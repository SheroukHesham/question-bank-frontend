import { useEffect, useRef, useState } from "react";
import QuestionCard from "./QuestionCard";
import { useVirtualizer } from "@tanstack/react-virtual";
import PagePagination from "./PagePagination";
import { useQuery } from "@tanstack/react-query";
import ReusableSearch from "./ReusableSearch";
import { SingleSelect } from "./SingleSelect";
import type { TQuestionTypeFilter } from "../types";
import { SelectItem } from "./ui/select";
import type {
  ICategoryDetails,
  IQuestions,
  ISubCategory,
} from "@/shared/interfaces";
import type { TQuestionDifficulty, TQuestionTypes } from "@/shared/types";

interface IProps {
  categoryId?: number;
  subcategories: ISubCategory[];
  categories?: ICategoryDetails[];
  editable?: boolean;
  toggleSelected?: (question: IQuestions) => void;
  selectedQuestions?: IQuestions[];
  examType?: TQuestionTypes;
}

const DisplayQuestions = ({
  subcategories,
  categoryId,
  categories,
  editable = true,
  toggleSelected,
  selectedQuestions,
  examType,
}: IProps) => {
  const PAGE_SIZE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<TQuestionTypeFilter>("all");
  const [specializationFilter, setSpecializationFilter] = useState<
    string | null
  >(null);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(
    undefined,
  );
  const [difficultyFilter, setDifficultyFilter] = useState<
    TQuestionDifficulty | undefined
  >(undefined);
  const [search, setSearch] = useState("");
  const parentRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebouncedValue(search, 300);

  useEffect(() => {
    setCurrentPage(1);
    parentRef.current?.scrollTo({ top: 0 });
  }, [typeFilter, specializationFilter, debouncedSearch]);

  useEffect(() => {
    parentRef.current?.scrollTo({ top: 0 });
  }, [currentPage]);

  function useDebouncedValue<T>(value: T, delay = 300): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
      const t = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
  }

  //todo:invalidate query after question creation/update/delete
  const { data } = useQuery({
    queryKey: [
      "questions",
      "filtered",
      categoryId,
      typeFilter,
      specializationFilter,
      debouncedSearch,
      currentPage,
      difficultyFilter,
    ],
    queryFn: () =>
      window.electron.question.findByFilterPaginated({
        categoryId: categoryId ? categoryId : Number(categoryFilter),
        questionType:
          examType ?? (typeFilter === "all" ? undefined : typeFilter),
        subcategoryId: specializationFilter
          ? Number(specializationFilter)
          : undefined,
        difficulty: difficultyFilter,

        search: debouncedSearch || undefined,
        limit: PAGE_SIZE,
        offset: (currentPage - 1) * PAGE_SIZE,
      }),

    placeholderData: (previousData) => previousData,
  });
  const questions = data?.data.questions ?? [];
  const total = data?.data.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // // TanStack Virtual exposes an imperative API that React Compiler cannot safely memoize.
  // // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: questions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 220,
    overscan: 5,
    getItemKey: (index) => questions?.[index]?._id,
    measureElement: (el) => el.getBoundingClientRect().height,
  });

  const renderQuestions = () => {
    return (
      <div
        className="relative w-full flex flex-col gap-5"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const question = questions[virtualItem.index];

          const isSelected = selectedQuestions?.some(
            (item) => item._id === question._id,
          );

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
              <div
                className={`mb-5 rounded-md h-fit ${isSelected ? "border-2 border-primary" : ""}`}
              >
                <QuestionCard
                  idx={(currentPage - 1) * PAGE_SIZE + virtualItem.index}
                  question={question}
                  editable={editable}
                  onClick={() => {
                    if (toggleSelected) toggleSelected(question);
                  }}
                  size={editable ? "default" : "sm"}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <>
      <div className="my-5">
        <ReusableSearch
          placeholder="Search for a question"
          search={search}
          setSearch={setSearch}
        />
      </div>

      <div className=" flex w-full  mt-3">
        {!categoryId && (
          <SingleSelect
            placeholder="Topic"
            onValueChange={(value) =>
              setCategoryFilter(value === "all" ? undefined : value)
            }
          >
            <SelectItem value="all">All</SelectItem>
            {categories?.map((category) => {
              return (
                <SelectItem
                  key={category.categoryId}
                  value={category.categoryId.toString()}
                >
                  {category.categoryName}
                </SelectItem>
              );
            })}
          </SingleSelect>
        )}

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

        {!examType && (
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
        )}

        <SingleSelect
          placeholder="Question Difficulty"
          onValueChange={(value) =>
            setDifficultyFilter(
              value === "all" ? undefined : (value as TQuestionDifficulty),
            )
          }
        >
          <SelectItem value="all">All Difficulties</SelectItem>
          <SelectItem value="easy">Easy</SelectItem>
          <SelectItem value="moderate">Moderate</SelectItem>
          <SelectItem value="difficult">Difficult</SelectItem>
        </SingleSelect>
      </div>

      <div
        ref={parentRef}
        className="w-full flex flex-col mt-5 h-[calc(100vh-250px)] overflow-y-auto scrollbar-none gap-5"
      >
        {renderQuestions()}
      </div>
      <div className=" mt-5 flex justify-center ">
        <PagePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
};

export default DisplayQuestions;
