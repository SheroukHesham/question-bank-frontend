import QuestionCard from "@/ui/components/QuestionCard";
import QuestionForm from "@/ui/components/QuestionForm";
import { Badge } from "@/ui/components/reui/badge";
import { SingleSelect } from "@/ui/components/SingleSelect";
import { Button } from "@/ui/components/ui/button";
import { SelectItem } from "@/ui/components/ui/select";
import type { TQuestionTypeFilter } from "@/ui/types";
import { Check, Pen } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../hooks/custom";
import Back from "../components/Back";
import type { ICategory, ISubCategory } from "@/shared/interfaces";
import EditCategoryForm from "../components/EditCategoryForm";

//TODO: DELETE SUBCATEGORY FEATURE

const CategoryQuestions = () => {
  const params = useParams();
  const categoryId = Number(params.id);
  const [editMode, setEditMode] = useState(false);
  const [deleteSub, setDeleteSub] = useState<ISubCategory>();

  const { data: category } = useFetch({
    queryKey: ["category", "findById"],
    queryFn: () => window.electron.category.getCategoryById(categoryId),
  });
  const { data: subcategories } = useFetch({
    queryKey: ["subcategory", "findByCategoryId"],
    queryFn: () =>
      window.electron.subcategory.findSubcategoryByCategoryId(categoryId),
  });
  const { data: allQuestions } = useFetch({
    queryKey: ["questions", "byCategory"],
    queryFn: () => window.electron.question.findByCategoryId(categoryId),
  });

  const [typeFilter, setTypeFilter] = useState<TQuestionTypeFilter>("all");
  const [specializationFilter, setSpecializationFilter] = useState<
    string | null
  >(null);

  const filteredQuestions = useMemo(() => {
    return (allQuestions ?? []).filter((item) => {
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      const matchesSpecialization =
        !specializationFilter ||
        item.subcategoryId === Number(specializationFilter);
      return matchesType && matchesSpecialization;
    });
  }, [allQuestions, typeFilter, specializationFilter]);

  const renderQuestions = filteredQuestions.map((question, idx) => {
    return <QuestionCard key={question._id} idx={idx} question={question} />;
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

          <div className="w-full flex flex-col gap-5 pt-5">
            {renderQuestions}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryQuestions;
