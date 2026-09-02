import { Modal } from "./Modal";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { categorySchema, type CategoryFormValues } from "@/ui/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

const CategoryForm = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: yupResolver(categorySchema),
  });

  const addCategory = useMutation({
    mutationFn: (name: string) => window.electron.category.createCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories", "findAllDetails"],
      });
      reset();
      setOpen(false);
      toast.success("Topic Added Successfully", {
        position: "top-center",
        style: {
          justifyContent: "center",
          color: "green",
          fontSize: "16px",
        },
      });
    },
  });
  const onSubmit = (data: CategoryFormValues) => {
    addCategory.mutate(data.name);
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      size="sm"
      title="Create New Topic"
      triggerText="Create New Topic"
      triggerIcon={<Plus />}
      onSubmit={handleSubmit(onSubmit)}
      onCancel={() => {
        reset();
      }}
      onClose={() => {
        reset();
      }}
    >
      <div className="w-full flex gap-5 flex-col overflow-auto ">
        <div className="flex flex-col gap-5 w-full ">
          <div className="flex flex-col  min-w-sm gap-2">
            <Label className="text-lg font-semibold">Topic Name</Label>
            <Input {...register("name")} placeholder="Enter Topic Name" />

            {errors.name && (
              <p className="text-destructive text-sm font-semibold">
                {errors.name.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CategoryForm;
