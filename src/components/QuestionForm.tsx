import { Modal } from "./Modal";
import { Plus } from "lucide-react";
import { RadioGroupChoiceCard } from "./ChoiceCard";
import { NumberSelectorInput } from "./NumberSelectorInput";
// import { SelectBox } from "./SelectGroup";
import { Field, FieldLabel } from "./ui/field";
import { SimpleEditor } from "./tiptap-templates/simple/simple-editor";
import { SortableOPtions } from "./Sortable";
import { useState } from "react";
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
import { findSubCategory, splitFunction } from "@/functions";

//TODO: add difficulty and API calls

const QuestionForm = () => {
  const [mcq, setMcq] = useState(true);

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<QuestionFormValues>({
    resolver: yupResolver(questionSchema),
    defaultValues: mcq ? defaultMcqFormValues : defaultEssayFormValues,
  });

  const onHeaderChange = (html: string) => {
    setValue("header", html);
  };
  const onAnswerChange = (html: string) => {
    setValue("modelAnswer", html);
  };

  const extractKey = (
    choices:
      | {
          value: string;
          isCorrect: NonNullable<boolean | undefined>;
        }[]
      | undefined,
  ) => {
    const key = choices?.find((choice) => choice.isCorrect);
    const distractorsRaw = choices?.filter((choice) => !choice.isCorrect);
    const distractors = distractorsRaw?.map((item) => {
      return item.value;
    });

    return { key: key?.value, distractors: distractors };
  };

  const onSelectValueChange = (v: string) => {
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
  };

  const onSubmit = (data: QuestionFormValues) => {
    const { choices, ...rest } = data;

    const payload: IQuestions =
      data.type === "essay"
        ? ({ ...rest, modelAnswer: data.modelAnswer! } as IEssayQuestion)
        : (() => {
            const { key, distractors } = extractKey(choices);
            return {
              ...rest,
              key: key!,
              distractors: distractors!,
            } as IMcqQuestion;
          })();

    console.log(payload);
    // TODO: API call with payload
  };

  return (
    <Modal
      title="Create New Question"
      triggerText="Create New Question"
      triggerIcon={<Plus />}
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
                defaultValue="mcq"
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
            />
            {errors.mark && (
              <p className="text-destructive text-sm font-semibold">
                {errors.mark.message}
              </p>
            )}
            <SingleSelect
              label="Specialization"
              onValueChange={onSelectValueChange}
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
              <SimpleEditor onChange={onHeaderChange} />
            </div>
            {errors.header && (
              <p className="text-destructive text-sm font-semibold">
                {errors.header.message}
              </p>
            )}
          </Field>
          {mcq ? (
            <Field data-invalid={false}>
              <FieldLabel htmlFor="">Options</FieldLabel>
              <SortableOPtions setValue={setValue} />
              {errors.choices && (
                <p className="text-destructive text-sm font-semibold">
                  {errors.choices.message}
                </p>
              )}
            </Field>
          ) : (
            <Field data-invalid={false}>
              <FieldLabel htmlFor="model-answer">Model Answer</FieldLabel>
              <div className="h-50">
                <SimpleEditor onChange={onAnswerChange} />
              </div>
              {errors.modelAnswer && (
                <p className="text-destructive text-sm font-semibold">
                  {errors.modelAnswer.message}
                </p>
              )}
            </Field>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default QuestionForm;
