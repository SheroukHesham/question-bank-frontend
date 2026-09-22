import QuestionForm from "@/ui/components/QuestionForm";
import { Badge } from "@/ui/components/reui/badge";
import { Button } from "@/ui/components/ui/button";
import { Check, Pen } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../hooks/custom";
import Back from "../components/Back";
import type { ICategory, ISubCategory } from "@/shared/interfaces";
import EditCategoryForm from "../components/EditCategoryForm";
import DisplayQuestions from "../components/DisplayQuestions";

const CategoryQuestions = () => {
  const params = useParams();
  const categoryId = Number(params.id);
  const [editMode, setEditMode] = useState(false);
  const [deleteSub, setDeleteSub] = useState<ISubCategory>();

  const { data: category } = useFetch({
    queryKey: ["category", "findById", categoryId],
    queryFn: () => window.electron.category.getCategoryById(categoryId),
  });

  const { data } = useFetch({
    queryKey: ["questions", "totalPerCategory"],
    queryFn: () => window.electron.question.getTotalQuestionsPerCategory(),
  });

  const categoryTotal = data?.find((v) => v.category_id === categoryId);

  const { data: subcategories } = useFetch({
    queryKey: ["subcategory", "findByCategoryId", categoryId],
    queryFn: () =>
      window.electron.subcategory.findSubcategoryByCategoryId(categoryId),
  });

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
                ({categoryTotal?.total})
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

          <DisplayQuestions
            subcategories={subcategories as ISubCategory[]}
            categoryId={categoryId}
          />

          {/* <div className="my-5">
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
          <div className=" mt-5 flex justify-center ">
            <PagePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div> */}
        </div>
      )}
    </div>
  );
};

export default CategoryQuestions;
