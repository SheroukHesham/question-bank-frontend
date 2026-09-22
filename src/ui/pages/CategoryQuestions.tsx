import QuestionCard from "@/ui/components/QuestionCard";
import QuestionForm from "@/ui/components/QuestionForm";
import { Badge } from "@/ui/components/reui/badge";
import { SingleSelect } from "@/ui/components/SingleSelect";
import { Button } from "@/ui/components/ui/button";
import { SelectItem } from "@/ui/components/ui/select";
import type { TQuestionTypeFilter } from "@/ui/types";
import { Check, Pen } from "lucide-react";
import { useMemo, useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../hooks/custom";
import Back from "../components/Back";
import type { ICategory, ISubCategory } from "@/shared/interfaces";
import EditCategoryForm from "../components/EditCategoryForm";
import { useVirtualizer } from "@tanstack/react-virtual";
import ReusableSearch from "../components/ReusableSearch";
import { useInfiniteQuery } from "@tanstack/react-query";

const CategoryQuestions = () => {
  //todo:change after testing
  const PAGE_SIZE = 5;
  const params = useParams();
  const categoryId = Number(params.id);

  const [editMode, setEditMode] = useState(false);
  const [deleteSub, setDeleteSub] = useState<ISubCategory>();
  const [typeFilter, setTypeFilter] = useState<TQuestionTypeFilter>("all");
  const [specializationFilter, setSpecializationFilter] = useState<
    string | null
  >(null);
  const [search, setSearch] = useState("");
  const parentRef = useRef<HTMLDivElement>(null);

  function useDebouncedValue<T>(value: T, delay = 300): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
      const t = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
  }

  const debouncedSearch = useDebouncedValue(search, 300);

  const { data: category } = useFetch({
    queryKey: ["category", "findById", categoryId],
    queryFn: () => window.electron.category.getCategoryById(categoryId),
  });

  const { data: subcategories } = useFetch({
    queryKey: ["subcategory", "findByCategoryId", categoryId],
    queryFn: () =>
      window.electron.subcategory.findSubcategoryByCategoryId(categoryId),
  });

  const { data: allQuestions = [] } = useFetch({
    queryKey: ["questions", "byCategory", categoryId],
    queryFn: () => window.electron.question.findByCategoryId(categoryId),
  });

  //todo:invalidate query after question creation/update/delete
  const { data } = useInfiniteQuery({
    queryKey: [
      "questions",
      "filtered",
      categoryId,
      typeFilter,
      specializationFilter,
      debouncedSearch,
    ],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      window.electron.question.findByFilterPaginated({
        categoryId,
        questionType: typeFilter === "all" ? undefined : typeFilter,
        subcategoryId: specializationFilter
          ? Number(specializationFilter)
          : undefined,
        search: debouncedSearch || undefined,
        limit: PAGE_SIZE,
        offset: pageParam,
      }),

    getNextPageParam: (lastPage, allPages) =>
      lastPage.data.hasMore ? allPages.length * PAGE_SIZE : undefined,
  });

  const filteredQuestions = useMemo(
    () => data?.pages.flatMap((p) => p.data.questions) ?? [],
    [data],
  );

  const rowVirtualizer = useVirtualizer({
    count: filteredQuestions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 220,
    overscan: 5,
    getItemKey: (index) => filteredQuestions?.[index]?._id,
    measureElement: (el) => el.getBoundingClientRect().height,
  });

  // useEffect(() => {
  //   const items = rowVirtualizer.getVirtualItems();
  //   const last = items[items.length - 1];
  //   if (
  //     last &&
  //     last.index >= filteredQuestions.length - 1 &&
  //     hasNextPage &&
  //     !isFetchingNextPage
  //   ) {
  //     fetchNextPage();
  //   }
  // }, [
  //   filteredQuestions.length,
  //   hasNextPage,
  //   isFetchingNextPage,
  //   fetchNextPage,
  //   rowVirtualizer,
  // ]);

  const renderQuestions = () => {
    return (
      <div
        className="relative w-full flex flex-col gap-5"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const question = filteredQuestions[virtualItem.index];

          return (
            <div
              key={question._id}
              ref={rowVirtualizer.measureElement}
              data-index={virtualItem.index}
              className="absolute top-0 left-0 w-full "
              style={{
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <div className="mb-5">
                <QuestionCard idx={virtualItem.index} question={question} />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full p-10 scrollbar-gutter-stable">
      {editMode ? (
        <div className="flex w-full justify-between mt-10">
          <EditCategoryForm
            setEditMode={setEditMode}
            category={category as ICategory}
            subcategories={subcategories as ISubCategory[]}
          />
        </div>
      ) : (
        <div className="w-full flex flex-col">
          <Back />
          <div className="flex w-full justify-between">
            <div className="flex  items-center gap-2 mt-10">
              <h1 className="text-4xl font-semibold ">{category?.name}</h1>
              <span className="text-muted/50 text-3xl font-semibold">
                ({allQuestions?.length})
              </span>
            </div>
            {editMode ? (
              <Button
                size={"icon-lg"}
                onClick={() => {
                  setEditMode(false);
                  setDeleteSub(undefined);
                }}
              >
                <Check />
              </Button>
            ) : (
              <Button
                variant={"outline"}
                size={"icon-lg"}
                onClick={() => {
                  setEditMode(true);
                }}
              >
                <Pen />
              </Button>
            )}
          </div>
          <div className=" w-xl justify-between items-center mt-5 mb-5">
            <div className="flex  w-lg justify-between items-center">
              <div className="flex gap-3 items-center ">
                {subcategories && subcategories?.length > 0 ? (
                  subcategories?.map((subcategory) => {
                    return (
                      <Badge
                        key={subcategory._id}
                        className={`${editMode ? "cursor-pointer" : ""}`}
                        variant={
                          editMode && deleteSub?._id === subcategory._id
                            ? "destructive-light"
                            : "primary-light"
                        }
                        radius={"full"}
                        size={"xl"}
                        onClick={() => {
                          if (editMode) setDeleteSub(subcategory);
                        }}
                      >
                        {subcategory.name}
                      </Badge>
                    );
                  })
                ) : (
                  <span className="italic">No Types Yet!</span>
                )}
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end ">
            <QuestionForm
              defaultCategory={
                category && subcategories?.[0]
                  ? {
                      categoryName: category?.name,
                      categoryId: category?._id,
                      subcategoryId: subcategories?.[0]._id,
                      subcategoryName: subcategories?.[0].name,
                    }
                  : undefined
              }
            />
          </div>

          <div className="my-5">
            <ReusableSearch
              placeholder="Search for a question"
              search={search}
              setSearch={setSearch}
            />
          </div>

          <div className=" flex w-full  mt-3">
            <SingleSelect
              placeholder="Question Type"
              onValueChange={(value) =>
                setTypeFilter(value as TQuestionTypeFilter)
              }
            >
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="mcq">MCQ</SelectItem>
              <SelectItem value="essay">Essay</SelectItem>
            </SingleSelect>

            <SingleSelect
              placeholder="Subtopic"
              onValueChange={(value) =>
                setSpecializationFilter(value === "all" ? null : value)
              }
            >
              <SelectItem value="all">All</SelectItem>
              {subcategories?.map((subcategory) => {
                return (
                  <SelectItem
                    key={subcategory._id}
                    value={subcategory._id.toString()}
                  >
                    {subcategory.name}
                  </SelectItem>
                );
              })}
            </SingleSelect>
          </div>

          <div
            ref={parentRef}
            className="w-full flex flex-col mt-5 h-[calc(100vh-250px)] overflow-y-auto scrollbar-none gap-5"
          >
            {renderQuestions()}
          </div>
        </div>
      )}
      {/* <PagePagination
        onNext={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onPrevious={() => {
          if (hasPreviousPage && !isFetchingPreviousPage) {
            fetchPreviousPage();
          }
        }}
      >
        <PaginationItem>
          <PaginationLink>1</PaginationLink>
        </PaginationItem>
      </PagePagination> */}
    </div>
  );
};

export default CategoryQuestions;
