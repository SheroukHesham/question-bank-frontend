import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { subcategorySchema, type SubcategoryFormValues } from "@/validation";

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
    console.log(data);
    onSaved(data);
  };

  return (
    <div className="flex gap-5">
      <div className="flex flex-col w-full gap-3">
        <Input placeholder="Enter subcategory name" {...register("name")} />
        {errors.name && (
          <p className="text-destructive text-sm font-semibold">
            {errors.name.message}
          </p>
        )}
      </div>
      <Button variant="outline" type="button" onClick={handleSubmit(onSubmit)}>
        Save
      </Button>
      <Button
        variant="ghost"
        type="button"
        onClick={() => {
          reset();
          onCancel();
        }}
      >
        Cancel
      </Button>
    </div>
  );
};

export default SubcategoryAddForm;
