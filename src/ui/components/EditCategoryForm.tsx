import type { ICategory, ISubCategory } from "@/shared/interfaces";
import { Button } from "./ui/button";
import { CheckIcon, Pen, X } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { categorySchema, type CategoryFormValues } from "../validation";
import { Label } from "./ui/label";
import UpdateSubcategoryEntry from "./UpdateSubcategoryEntry";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

//todo:fix on error message in toast

interface IProps {
  category: ICategory;
  subcategories: ISubCategory[];
}

const EditCategoryForm = ({ category, subcategories }: IProps) => {
  const [editCategoryName, setEditCategoryName] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: yupResolver(categorySchema),
    defaultValues: { name: category.name as string },
  });

  const updateCategory = useMutation({
    mutationFn: (category: ICategory) =>
      window.electron.category.updateCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories", "getGroupedSubCat"],
      });
      toast.success("Topic Name Updated Successfully", {
        position: "top-center",
        style: {
          justifyContent: "center",
          color: "green",
          fontSize: "16px",
        },
      });
    },
    onError: (error) => {
      reset();
      toast.error("Error Updating Topic Name", {
        description: error.message,
        position: "top-center",
        style: {
          justifyContent: "center",
          color: "crimson",
          fontSize: "16px",
        },
      });
      console.log(error.message);
    },
  });

  //todo:api call to update
  const onSubmit = (data: CategoryFormValues) => {
    setEditCategoryName(false);
    updateCategory.mutate({ ...category, name: data.name });

    console.log(data);
  };

  const renderSubcategories = subcategories.map((subcategory) => {
    return (
      <div className="flex gap-5" key={subcategory._id}>
        <UpdateSubcategoryEntry subcategory={subcategory} />
      </div>
    );
  });

  return (
    <div className="w-full">
      <div className="w-full flex justify-end ">
        <Button onClick={() => {}}>Done</Button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full mb-10 ">
        <div className="flex w-full justify-between">
          <div className="flex  flex-col gap-5">
            <Label className="text-5xl">Topic</Label>
            <div className="flex gap-5 ">
              <div className="flex flex-col w-full gap-y-3">
                <Input
                  {...register("name")}
                  className="text-lg font-semibold"
                  disabled={!editCategoryName}
                />
                {errors.name && (
                  <p className="text-destructive text-sm font-semibold">
                    {errors.name.message}
                  </p>
                )}
              </div>
              {editCategoryName ? (
                <div className="flex gap-5">
                  <Button type="submit">
                    <CheckIcon size={"20px"} />
                  </Button>
                  <Button
                    variant={"secondary"}
                    type="button"
                    onClick={() => {
                      setEditCategoryName(false);
                      reset();
                    }}
                  >
                    <X />
                  </Button>
                </div>
              ) : (
                <Button
                  variant={"outline"}
                  type="button"
                  onClick={() => {
                    setEditCategoryName(true);
                  }}
                >
                  <Pen />
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>

      <div className="flex flex-col gap-5">
        <div className="flex w-full justify-between">
          <h1 className="text-4xl font-semibold">Subtopics</h1>
        </div>
        <div className="flex flex-col gap-5">{renderSubcategories}</div>
      </div>
    </div>
  );
};

export default EditCategoryForm;
