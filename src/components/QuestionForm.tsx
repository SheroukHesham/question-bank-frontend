import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "./ui/card";
import type { ICategories } from "@/interfaces";
import { useState, type ReactNode } from "react";
import { NumberSelectorInput } from "./NumberSelectorInput";
import { MOCK_CATEGORIES, MOCK_SUB_CATEGORIES } from "@/mock";
import { Selector } from "./Selector";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import type { QuestionFormValues } from "@/validation";

interface IProps {
  children: ReactNode;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onCancel: () => void;
  register: UseFormRegister<QuestionFormValues>;
  setValue: UseFormSetValue<QuestionFormValues>;
  errors: FieldErrors<QuestionFormValues>;
  defaultValues?: QuestionFormValues;
}

export function QuestionForm({
  onSubmit,
  onCancel,
  children,
  errors,
  register,
  setValue,
  defaultValues,
}: IProps) {
  console.log(defaultValues);
  const difficultyArray = Array.from({ length: 5 }, (_, index) => index + 1);

  const initialCategory = MOCK_CATEGORIES.find(
    (cat) => cat._id === defaultValues?.categoryId,
  );
  const initialSubCategory = MOCK_SUB_CATEGORIES.find(
    (sub) => sub._id === defaultValues?.subcategoryId,
  );

  const [categoryToEdit, setCategoryToEdit] = useState<ICategories | undefined>(
    initialCategory,
  );

  const renderCategories = MOCK_CATEGORIES.map((category) => {
    return (
      <SelectItem value={category.name} key={category._id}>
        {category.name}
      </SelectItem>
    );
  });

  //TODO: revisit;can be replaced with API call
  function renderSubCategories(): ReactNode {
    const subCategories = categoryToEdit?.subCategories.map((subCategory) => {
      return MOCK_SUB_CATEGORIES.find((sub) => sub._id === subCategory);
    });
    return subCategories?.map((subCat) => {
      return (
        <SelectItem value={subCat?.name as string} key={subCat?._id}>
          {subCat?.name}
        </SelectItem>
      );
    });
  }

  return (
    <div className="w-full ">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <CardHeader className=" text-black font-semibold gap-y-10">
                <div className="flex flex-col gap-y-2">
                  <Selector
                    title="Category"
                    isError={!!errors?.categoryId}
                    errorMsg={
                      errors?.categoryId?.message ?? "Please select a category"
                    }
                    value={categoryToEdit?.name} // now seeded from initialCategory on mount
                    onValueChange={(v: string) => {
                      const cat = MOCK_CATEGORIES.find(
                        (category) => category.name === v,
                      );
                      setCategoryToEdit(cat);
                      setValue("categoryId", cat?._id ?? "", {
                        shouldValidate: true,
                      });
                    }}
                  >
                    {renderCategories}
                  </Selector>
                  {errors?.categoryId && (
                    <p className="text-destructive text-sm">
                      {errors.categoryId.message}
                    </p>
                  )}
                  <div className="pl-5">
                    <Selector
                      title="Subcategory"
                      isError={!!errors?.subcategoryId}
                      errorMsg={
                        errors?.subcategoryId?.message ??
                        "Please select a category"
                      }
                      value={initialSubCategory?.name} // was missing a `value` prop entirely before — fixed
                      onValueChange={(v: string) => {
                        const subCat = MOCK_SUB_CATEGORIES.find(
                          (subcategory) => subcategory.name === v,
                        );
                        setValue("subcategoryId", subCat?._id ?? "", {
                          shouldValidate: true,
                        });
                      }}
                    >
                      {renderSubCategories()}
                    </Selector>
                    {errors?.subcategoryId && (
                      <p className="text-destructive text-sm">
                        {errors.subcategoryId.message}
                      </p>
                    )}
                  </div>
                </div>
                <Field>
                  <FieldLabel htmlFor="header" className="font-bold text-lg">
                    Question
                  </FieldLabel>
                  <Input
                    placeholder="Enter the question header."
                    className="px-3 py-5 text-[16px]"
                    {...register("header")}
                  />
                  {errors?.header && (
                    <p className="text-destructive text-sm">
                      {errors.header.message}
                    </p>
                  )}
                </Field>
              </CardHeader>
              <CardDescription className="px-5 text-[16px] ">
                <Field>
                  <div className="flex gap-2">
                    <FieldLabel htmlFor="difficulty" className="font-bold">
                      Difficulty
                    </FieldLabel>
                    <Select
                      defaultValue={defaultValues?.difficulty?.toString()}
                      onValueChange={(v) =>
                        setValue("difficulty", Number(v), {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger id="difficulty" className="font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="bg-card">
                          {difficultyArray.map((value) => {
                            return (
                              <SelectItem
                                key={value}
                                value={`${value}`}
                                className="font-bold "
                              >
                                {value}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  {errors?.difficulty && (
                    <p className="text-destructive text-sm font-semibold">
                      {errors.difficulty.message}
                    </p>
                  )}
                </Field>
              </CardDescription>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />

          <CardContent>
            <FieldSet>
              <FieldGroup>
                {children}
                <Field className="w-32">
                  <NumberSelectorInput
                    defaultValue={defaultValues?.mark}
                    label="Marks"
                    name="mark"
                    setValue={setValue}
                  />
                  {errors?.mark && (
                    <p className="text-destructive text-sm font-semibold">
                      {errors.mark.message}
                    </p>
                  )}
                </Field>
              </FieldGroup>
            </FieldSet>
          </CardContent>
          <CardFooter className="border-t-0">
            <Field orientation="horizontal" className="flex justify-between ">
              <Button type="submit">Save</Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => onCancel()}
              >
                Cancel
              </Button>
            </Field>
          </CardFooter>
        </FieldGroup>
      </form>
    </div>
  );
}
