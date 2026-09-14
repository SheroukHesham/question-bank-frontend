import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { subcategorySchema, type SubcategoryFormValues } from "@/ui/validation";
import { CheckIcon, X } from "lucide-react";

interface IProps {
  onSaved: (data: SubcategoryFormValues) => void;
  onCancel: () => void;
}

const SubcategoryAddForm = ({ onSaved, onCancel }: IProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubcategoryFormValues>({
    resolver: yupResolver(subcategorySchema),
  });

  const onSubmit = (data: SubcategoryFormValues) => {
    onSaved(data);
  };

  return (
    <div className="flex gap-3">
      <div className="flex flex-col w-full gap-3">
        <Input
          placeholder="Enter subtopic name"
          {...register("name")}
          autoFocus
        />
        {errors.name && (
          <p className="text-destructive text-sm font-semibold">
            {errors.name.message}
          </p>
        )}
      </div>
      <Button variant="default" onClick={handleSubmit(onSubmit)}>
        <CheckIcon />
      </Button>
      <Button
        variant="ghost"
        type="button"
        onClick={() => {
          reset();
          onCancel();
        }}
      >
        <X />
      </Button>
    </div>
  );
};

export default SubcategoryAddForm;
