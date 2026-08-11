import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { findSubCategory, splitFunction } from "@/functions";
import type { ICategories } from "@/interfaces";
import type { QuestionFormValues } from "@/validation";
import type { UseFormSetValue } from "react-hook-form";

interface IProps {
  label: string;
  list: ICategories[];
  setValue: UseFormSetValue<QuestionFormValues>;
}

export function SelectBox({ label, list, setValue }: IProps) {
  const renderItems = list.map((category) => {
    return category.subCategories.map((subcategory) => {
      return (
        <SelectItem
          key={`${category._id}-${subcategory}`}
          value={`${category._id}-${subcategory}`}
        >
          {category.name}, {findSubCategory(subcategory)}
        </SelectItem>
      );
    });
  });

  return (
    <Field className="w-full max-w-3xs gap-2 ">
      <FieldLabel>{label}</FieldLabel>
      <Select
        onValueChange={(v) => {
          const [category, subcategory] = splitFunction(v, "-");
          if (setValue) {
            setValue("categoryId", category, { shouldValidate: true });
            setValue("subcategoryId", subcategory, { shouldValidate: true });
          }

          //  if (setQuestionToEdit)
          //    setQuestionToEdit((prev) => ({
          //      ...prev,
          //      mark: Number(value),
          //    }));
        }}
      >
        <div className="w-70 ">
          <SelectTrigger className="cursor-pointer bg-white">
            <SelectValue placeholder={`Choose ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>{renderItems}</SelectGroup>
          </SelectContent>
        </div>
      </Select>
    </Field>
  );
}
