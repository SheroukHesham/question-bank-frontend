import QuestionCard from "@/components/QuestionCard";
import QuestionForm from "@/components/QuestionForm";
import { Badge } from "@/components/reui/badge";
import { SingleSelect } from "@/components/SingleSelect";
import SubcategoryAddForm from "@/components/SubcategoryAddForm";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { findCategory, findSubCategory } from "@/functions";
import { MOCK_QUESTIONS } from "@/mock";
import type { TQuestionTypeFilter } from "@/types";
import type { SubcategoryFormValues } from "@/validation";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

const CategoryQuestions = () => {
  const params = useParams();
  const categoryId = params.id;
  const category = findCategory(params.id as string);
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);

  //todo:replace by api call
  const allQuestions = MOCK_QUESTIONS.filter(
    (items) => items.categoryId === categoryId,
  );

  const [typeFilter, setTypeFilter] = useState<TQuestionTypeFilter>("all");
  const [specializationFilter, setSpecializationFilter] = useState<
    string | null
  >(null);

  const filteredQuestions = useMemo(() => {
    return (allQuestions ?? []).filter((item) => {
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      const matchesSpecialization =
        !specializationFilter || item.subcategoryId === specializationFilter;
      return matchesType && matchesSpecialization;
    });
  }, [allQuestions, typeFilter, specializationFilter]);

  const onSubmit = (data: SubcategoryFormValues) => {
    //todo:add api call to add a new subcategory for this category
    console.log(data);
    setIsAddingSubcategory(false);
  };

  const renderQuestions = filteredQuestions.map((question, idx) => {
    return <QuestionCard key={question._id} idx={idx} question={question} />;
  });

  return (
    <div className="w-full p-10 ">
      <div className="flex  items-center gap-2">
        <h1 className="text-4xl font-semibold ">{category?.name}</h1>
        <span className="text-muted/50 text-3xl font-semibold">
          ({allQuestions.length})
        </span>
      </div>
      <div className=" w-xl justify-between items-center mt-5">
        <div className="flex gap-3 items-center ">
          {category?.subCategories.map((subCat) => {
            return (
              <Badge variant={"primary-light"} radius={"full"} size={"xl"}>
                {findSubCategory(subCat)}
              </Badge>
            );
          })}
        </div>
        <div className="mt-5">
          {isAddingSubcategory ? (
            <SubcategoryAddForm
              onSaved={onSubmit}
              onCancel={() => {
                setIsAddingSubcategory(false);
              }}
            />
          ) : (
            <Button
              size={"sm"}
              className="flex items-center"
              onClick={() => setIsAddingSubcategory(true)}
            >
              <Plus />
              <span>Add Subcategory</span>
            </Button>
          )}
        </div>
      </div>
      <div className="w-full flex justify-end ">
        <QuestionForm />
      </div>

      <div className=" flex w-full mt-3">
        <SingleSelect
          placeholder="Question Type"
          onValueChange={(value) => setTypeFilter(value as TQuestionTypeFilter)}
        >
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="mcq">MCQ</SelectItem>
          <SelectItem value="essay">Essay</SelectItem>
        </SingleSelect>

        <SingleSelect
          placeholder="Specialization"
          onValueChange={(value) =>
            setSpecializationFilter(value === "all" ? null : value)
          }
        >
          <SelectItem value="all">All</SelectItem>
          {category?.subCategories.map((sub) => {
            return (
              <SelectItem key={sub} value={sub}>
                {findSubCategory(sub)}
              </SelectItem>
            );
          })}
        </SingleSelect>
      </div>

      <div className="w-full flex flex-col gap-5 mt-5">{renderQuestions}</div>
    </div>
  );
};

export default CategoryQuestions;
