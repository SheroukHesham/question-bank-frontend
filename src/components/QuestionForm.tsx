import { Modal } from "./Modal";
import { PenBoxIcon, Plus } from "lucide-react";
import { RadioGroupChoiceCard } from "./ChoiceCard";
import { NumberSelectorInput } from "./NumberSelectorInput";
// import { SelectBox } from "./SelectGroup";
import { Field, FieldLabel } from "./ui/field";
import { SimpleEditor } from "./tiptap-templates/simple/simple-editor";
import { SortableOPtions } from "./Sortable";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { questionSchema, type QuestionFormValues } from "@/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  defaultEssayFormValues,
  defaultMcqFormValues,
  RadioQuestionGroup,
} from "@/data";
import { MOCK_CATEGORIES } from "@/mock";
import type { IEssayQuestion, IMcqQuestion, IQuestions } from "@/interfaces";
import { SingleSelect } from "./SingleSelect";
import { SelectItem } from "./ui/select";
import {
  findSubCategory,
  isEssayQuestion,
  isMcqQuestion,
  splitFunction,
} from "@/functions";
import ImageUpload from "./ImageUpload";

//TODO: add difficulty and API calls

interface IProps {
  type?: "create" | "edit";
  questionToEdit?: IQuestions;
  setQuestionToEdit?: Dispatch<SetStateAction<IEssayQuestion | IMcqQuestion>>;
}

const QuestionForm = ({
  type = "create",
  questionToEdit,
  setQuestionToEdit,
}: IProps) => {
  const [mcq, setMcq] = useState(true);

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<QuestionFormValues>({
    resolver: yupResolver(questionSchema),
    defaultValues:
      type === "create"
        ? mcq
          ? defaultMcqFormValues
          : defaultEssayFormValues
        : questionToEdit,
  });

  const onSelectValueChange = (v: string) => {
    const [category, subcategory] = splitFunction(v, "-");
    if (setValue) {
      setValue("categoryId", category, { shouldValidate: true });
      setValue("subcategoryId", subcategory, { shouldValidate: true });
    }
  };

  const onSubmit = (data: QuestionFormValues) => {
    const payload: IQuestions =
      data.type === "essay"
        ? ({ ...data, modelAnswer: data.modelAnswer! } as IEssayQuestion)
        : ({ ...data, choices: data.choices! } as IMcqQuestion);

    // TODO: API call with payload to create question or edit question
    console.log("Payload", payload);
    if (setQuestionToEdit) setQuestionToEdit(payload);
  };

  const renderAnswerFrom = (type: "mcq" | "essay") => {
    if (type === "mcq") {
      return (
        <Field data-invalid={false}>
          <FieldLabel>Options</FieldLabel>
          <SortableOPtions
            setValue={setValue}
            itemList={
              questionToEdit && isMcqQuestion(questionToEdit)
                ? questionToEdit.choices
                : undefined
            }
          />
          {errors.choices && (
            <p className="text-destructive text-sm font-semibold">
              {errors.choices.message}
            </p>
          )}
        </Field>
      );
    } else {
      return (
        <Field data-invalid={false}>
          <FieldLabel htmlFor="model-answer">Model Answer</FieldLabel>
          <div className="h-50">
            <SimpleEditor
              onChange={(html) => {
                setValue("modelAnswer", html);
              }}
              initialContent={
                questionToEdit && isEssayQuestion(questionToEdit)
                  ? questionToEdit.modelAnswer
                  : undefined
              }
            />
          </div>
          {errors.modelAnswer && (
            <p className="text-destructive text-sm font-semibold">
              {errors.modelAnswer.message}
            </p>
          )}
        </Field>
      );
    }
  };

  return (
    <Modal
      title={type === "create" ? "Create New Question" : "Edit Question"}
      triggerText={type === "create" ? "Create New Question" : null}
      triggerIcon={type === "create" ? <Plus /> : <PenBoxIcon />}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full flex gap-5 flex-col overflow-scroll ">
        <div className="flex w-full relative justify-between">
          <div className="flex flex-col w-lg min-w-sm gap-2">
            <span className="text-lg font-semibold">Question Type</span>
            <div className="flex gap-5">
              <RadioGroupChoiceCard
                setMcq={setMcq}
                setValue={setValue}
                defaultValue={
                  type === "create" ? "mcq" : (questionToEdit?.type as string)
                }
                radioItems={RadioQuestionGroup}
              />
            </div>
            {errors.type && (
              <p className="text-destructive text-sm font-semibold">
                {errors.type.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3 w-3xs ">
            <NumberSelectorInput
              label="Question Mark"
              name="mark"
              setValue={setValue}
              defaultValue={type === "edit" ? questionToEdit?.mark : undefined}
            />
            {errors.mark && (
              <p className="text-destructive text-sm font-semibold">
                {errors.mark.message}
              </p>
            )}
            <SingleSelect
              label="Specialization"
              onValueChange={onSelectValueChange}
              defaultValue={
                type === "edit"
                  ? `${questionToEdit?.categoryId}-${questionToEdit?.subcategoryId}`
                  : undefined
              }
            >
              {MOCK_CATEGORIES.map((category) => {
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
              })}
            </SingleSelect>

            {errors.categoryId && (
              <p className="text-destructive text-sm font-semibold">
                {errors.categoryId.message}
              </p>
            )}
          </div>
        </div>

        <div className=" flex flex-col gap-5">
          <Field data-invalid={false}>
            <FieldLabel htmlFor="question-header">Question</FieldLabel>
            <div className="h-50">
              <SimpleEditor
                onChange={(html) => {
                  setValue("header", html);
                }}
                initialContent={questionToEdit?.header}
              />
            </div>
            {errors.header && (
              <p className="text-destructive text-sm font-semibold">
                {errors.header.message}
              </p>
            )}
          </Field>
          <FieldLabel>Header Image (Optional)</FieldLabel>
          <ImageUpload
            onFileSelected={(file) => {
              setValue("headerImageUrl", file.name);
            }}
            onClear={() => {
              setValue("headerImageUrl", "", { shouldValidate: true });
            }}
          />

          {type === "create"
            ? mcq
              ? renderAnswerFrom("mcq")
              : renderAnswerFrom("essay")
            : renderAnswerFrom(questionToEdit?.type as "mcq" | "essay")}
        </div>
      </div>
    </Modal>
  );
};

export default QuestionForm;
