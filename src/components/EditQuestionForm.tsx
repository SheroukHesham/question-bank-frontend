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
import type { ICategories, IQuestions, ISubCategories } from "@/interfaces";
import {
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { NumberSelectorInput } from "./NumberSelectorInput";
import { MOCK_CATEGORIES, MOCK_SUB_CATEGORIES } from "@/mock";
import { Selector } from "./Selector";

interface IProps {
  questionToEdit: IQuestions;
  children: ReactNode;
  onSubmit: () => void;
  onCancel: () => void;
  setQuestionToEdit: Dispatch<SetStateAction<IQuestions>>;
}

export function EditQuestionForm({
  questionToEdit,
  setQuestionToEdit,
  onSubmit,
  onCancel,
  children,
}: IProps) {
  //TODO:replace by API callS to get category and subCat by ID
  const category = MOCK_CATEGORIES.find(
    (cat) => cat._id === questionToEdit.categoryId,
  );
  const subCategory = MOCK_SUB_CATEGORIES.find(
    (sub) => sub._id === questionToEdit.subcategoryId,
  );
  const difficultyArray = Array.from({ length: 5 }, (_, index) => index + 1);
  const { header, difficulty } = questionToEdit;
  const [categoryToEdit, setCategoryToEdit] = useState<ICategories | undefined>(
    category,
  );
  const [subcategoryToEdit, setSubCategoryToEdit] = useState<
    ISubCategories | undefined
  >(subCategory);

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
                <div className="flex flex-col gap-y-5">
                  <Selector
                    title="Category"
                    isError={false}
                    errorMsg="Please select a category"
                    value={categoryToEdit?.name}
                    onValueChange={(v: string) => {
                      const cat = MOCK_CATEGORIES.find(
                        (category) => category.name === v,
                      );
                      setCategoryToEdit(cat);
                      setQuestionToEdit((prev) => ({
                        ...prev,
                        categoryId: cat?._id as string,
                      }));
                    }}
                  >
                    {renderCategories}
                  </Selector>
                  <div className="pl-5">
                    <Selector
                      title="Subcategory"
                      isError={false}
                      errorMsg="Please select a category"
                      value={subcategoryToEdit?.name}
                      onValueChange={(v: string) => {
                        const subCat = MOCK_SUB_CATEGORIES.find(
                          (subcategory) => subcategory.name === v,
                        );
                        setSubCategoryToEdit(subCat);
                        setQuestionToEdit((prev) => ({
                          ...prev,
                          subcategoryId: subCat?._id as string,
                        }));
                      }}
                    >
                      {renderSubCategories()}
                    </Selector>
                  </div>
                </div>
                <Field>
                  <FieldLabel htmlFor="header" className="font-bold text-lg">
                    Question
                  </FieldLabel>
                  <Input
                    id="header"
                    name="header"
                    placeholder="Enter the question header."
                    required
                    className="px-3 py-5 text-[16px]"
                    value={header}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      setQuestionToEdit((prev) => ({ ...prev, [name]: value }));
                    }}
                  />
                </Field>
              </CardHeader>
              <CardDescription className="px-5 text-[16px] text-destructive ">
                <Field>
                  <div className="flex gap-2">
                    <FieldLabel htmlFor="difficulty" className="font-semibold">
                      Difficulty
                    </FieldLabel>
                    <Select
                      defaultValue={difficulty.toString()}
                      onValueChange={(v) =>
                        setQuestionToEdit((prev) => ({
                          ...prev,
                          difficulty: Number(v),
                        }))
                      }
                    >
                      <SelectTrigger
                        id="difficulty"
                        name="difficulty"
                        className="font-bold"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="bg-card">
                          {difficultyArray.map((value) => {
                            return (
                              <SelectItem
                                key={value}
                                value={`${value}`}
                                className="font-bold text-destructive"
                              >
                                {value}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
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
                    label="Marks"
                    name="mark"
                    questionToEdit={questionToEdit}
                    setQuestionToEdit={setQuestionToEdit}
                  />
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
