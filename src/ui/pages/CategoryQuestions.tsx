import QuestionCard from "@/ui/components/QuestionCard";
import QuestionForm from "@/ui/components/QuestionForm";
import { Badge } from "@/ui/components/reui/badge";
import { SingleSelect } from "@/ui/components/SingleSelect";
import SubcategoryAddForm from "@/ui/components/SubcategoryAddForm";
import { Button } from "@/ui/components/ui/button";
import { SelectItem } from "@/ui/components/ui/select";
import type { TQuestionTypeFilter } from "@/ui/types";
import type { SubcategoryFormValues } from "@/ui/validation";
import { Check, Pen, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../hooks/custom";
import Back from "../components/Back";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ICategory, ISubCategory } from "@/shared/interfaces";
import { Alert } from "../components/Alert";
import EditCategoryForm from "../components/EditCategoryForm";

//TODO: DELETE SUBCATEGORY FEATURE

const CategoryQuestions = () => {
  const params = useParams();
  const categoryId = Number(params.id);
  const queryClient = useQueryClient();
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
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
  console.log(subcategories);
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

  const addSubcategory = useMutation({
    mutationFn: ({ name, categoryId }: { name: string; categoryId: number }) =>
      window.electron.subcategory.createSubcategory(name, categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subcategory", "findByCategoryId"],
      });
      queryClient.invalidateQueries({
        queryKey: ["categories", "getGroupedSubCat"],
      });
    },
  });

  const onSubmit = (data: SubcategoryFormValues) => {
    addSubcategory.mutate({ name: data.name, categoryId: categoryId });
    console.log(data);
    setIsAddingSubcategory(false);
  };

  const deleteSubcategories = useMutation({
    mutationFn: ({ id }: { id: number }) =>
      window.electron.subcategory.deleteSubcategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subcategory", "findByCategoryId"],
      });
      queryClient.invalidateQueries({
        queryKey: ["categories", "getGroupedSubCat"],
      });
    },
  });

  const onDeleteSubcategories = (id: number) => {
    deleteSubcategories.mutate({ id });
    setDeleteSub(undefined);
  };

  const renderQuestions = filteredQuestions.map((question, idx) => {
    return <QuestionCard key={question._id} idx={idx} question={question} />;
  });

  return (
    <div className="w-full p-10 ">
      {editMode ? (
        <div className="flex w-full justify-between mt-10">
          <EditCategoryForm
            category={category as ICategory}
            subcategories={subcategories as ISubCategory[]}
          />
        </div>
      ) : (
        <>
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
          <div className=" w-xl justify-between items-center mt-5">
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
              {editMode && (
                <Alert
                  title="Are You Sure You Want to Delete This Type?"
                  description="Deleting this type will remove it from the system and cannot be recovered. You will not be able to remove types that have questions assigned to them to avoid accidentally losing questions."
                  variant="destructive"
                  disabled={deleteSub ? false : true}
                  buttonChildren={"Delete Type"}
                  submitText="Delete"
                  onSubmit={() =>
                    onDeleteSubcategories(deleteSub?._id as number)
                  }
                />
              )}
            </div>
            {editMode && (
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
                    <span>Create New Type</span>
                  </Button>
                )}
              </div>
            )}
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

          <div className=" flex w-full mt-3">
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

          <div className="w-full flex flex-col gap-5 mt-5">
            {renderQuestions}
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryQuestions;
