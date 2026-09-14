import type { ISubCategory } from "@/shared/interfaces";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CheckIcon, Pen, Trash2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { subcategorySchema, type SubcategoryFormValues } from "../validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Alert } from "./Alert";

interface IProps {
  subcategory: ISubCategory;
}

const UpdateSubcategoryEntry = ({ subcategory }: IProps) => {
  const [editSubcategory, setEditSubcategory] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    reset,
    setFocus,
    handleSubmit,
    formState: { errors },
  } = useForm<SubcategoryFormValues>({
    resolver: yupResolver(subcategorySchema),
    defaultValues: { name: subcategory.name },
  });

  useEffect(() => {
    if (editSubcategory) {
      setFocus("name");
    }
  }, [editSubcategory, setFocus]);

  const updateSubcategory = useMutation({
    mutationFn: (subcategory: ISubCategory) =>
      window.electron.subcategory.updateSubcategory(subcategory),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subcategory", "findByCategoryId"],
      });
      toast.success("Subtopic Name Updated Successfully", {
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
      toast.error("Error Updating Subtopic Name", {
        description: error.message,
        position: "top-center",
        style: {
          justifyContent: "center",
          color: "crimson",
          fontSize: "16px",
        },
      });
    },
  });

  const onSubmit = (data: SubcategoryFormValues) => {
    updateSubcategory.mutate({ ...subcategory, name: data.name });
    setEditSubcategory(false);
  };

  const deleteSubcategories = useMutation({
    mutationFn: ({ id }: { id: number }) =>
      window.electron.subcategory.deleteSubcategory(id),
    onSuccess: () => {
      toast.success("Subtopic Deleted Successfully", {
        position: "top-center",
        style: {
          justifyContent: "center",
          color: "green",
          fontSize: "16px",
        },
      });
      queryClient.invalidateQueries({
        queryKey: ["subcategory", "findByCategoryId"],
      });
      queryClient.invalidateQueries({
        queryKey: ["categories", "getGroupedSubCat"],
      });
    },
    onError: () => {
      toast.error("Error Deleting Subtopic", {
        position: "top-center",
        style: {
          justifyContent: "center",
          color: "crimson",
          fontSize: "16px",
        },
      });
    },
  });

  const onDeleteSubcategories = () => {
    deleteSubcategories.mutate({ id: subcategory._id });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex gap-5">
      <div className="flex flex-col w-full gap-y-3">
        <Input
          {...register("name")}
          className="capitalize"
          type="text"
          disabled={editSubcategory ? false : true}
        />
        {errors.name && (
          <p className="text-destructive text-sm font-semibold">
            {errors.name.message}
          </p>
        )}
      </div>
      {editSubcategory ? (
        <div className="flex gap-3">
          <Button type="submit" variant={"default"}>
            <CheckIcon />
          </Button>
          <Button
            variant={"secondary"}
            type="button"
            onClick={() => {
              reset();
              setEditSubcategory(false);
            }}
          >
            <X />
          </Button>
        </div>
      ) : (
        <div className="flex gap-3">
          <Button
            type="button"
            variant={"outline"}
            onClick={(e) => {
              e.preventDefault();
              setEditSubcategory(true);
            }}
          >
            <Pen />
          </Button>
          <Alert
            title="Are You Sure You Want to Delete This Subtopic?"
            description="Deleting this subtopic will permanently remove it from the system. You will not be able to remove subtopics that have questions assigned to them to avoid accidentally losing questions."
            variant="destructive"
            buttonChildren={<Trash2 />}
            submitText="Delete"
            onSubmit={() => onDeleteSubcategories()}
          />
        </div>
      )}
    </form>
  );
};

export default UpdateSubcategoryEntry;
