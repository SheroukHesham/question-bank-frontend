import type { ICategory, ISubCategory } from "@/shared/interfaces";
import { Button } from "./ui/button";
import { CheckIcon, Pen, X } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { categorySchema, type CategoryFormValues } from "../validation";
import { Label } from "./ui/label";
import EditSubcategoryForm from "./EditSubcategoryForm";

interface IProps {
  category: ICategory;
  subcategories: ISubCategory[];
}

const EditCategoryForm = ({ category, subcategories }: IProps) => {
  const [editCategoryName, setEditCategoryName] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: yupResolver(categorySchema),
    defaultValues: { name: category.name as string },
  });

  //todo:api call to update
  const onSubmit = (data: CategoryFormValues) => {
    setEditCategoryName(false);
    console.log(data);
  };

  return (
    <div className="w-full">
      <div className="w-full flex justify-end ">
        <Button onClick={() => {}}>Done</Button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full mb-10 ">
        <div className="flex w-full justify-between">
          <div className="flex  flex-col gap-5">
            <Label className="text-5xl">Topic</Label>
            <div className="flex gap-5 items-center ">
              <Input
                {...register("name")}
                className="text-4xl font-semibold"
                disabled={!editCategoryName}
              />
              {editCategoryName ? (
                <div className="flex gap-5">
                  <Button size={"icon-lg"} type="submit">
                    <CheckIcon size={"20px"} />
                  </Button>
                  <Button
                    size={"icon-lg"}
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
                  size={"icon-lg"}
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
      <EditSubcategoryForm subcategories={subcategories} />
    </div>
  );
};

export default EditCategoryForm;
