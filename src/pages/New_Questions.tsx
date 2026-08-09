import { RadioGroupChoiceCard } from "@/components/ChoiceCard";
import { ClickCard } from "@/components/ClickCard";
import { Modal } from "@/components/Modal";
import { SelectBox } from "@/components/new_SelectGroup";
import { NumberSelectorInput } from "@/components/NumberSelectorInput";
import { SortableOPtions } from "@/components/Sortable";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  defaultEssayFormValues,
  defaultMcqFormValues,
  RadioQuestionGroup,
} from "@/data";
import { MOCK_CATEGORIES } from "@/mock";
import { questionSchema, type QuestionFormValues } from "@/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { CircleQuestionMark, LayoutGrid, Plus } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const New_Questions = () => {
  const navigate = useNavigate();
  const [mcq, setMcq] = useState(false);

  const {
    register,
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<QuestionFormValues>({
    resolver: yupResolver(questionSchema),
    defaultValues: mcq ? defaultMcqFormValues : defaultEssayFormValues,
  });

  const { fields } = useFieldArray({
    control,
    name: "distractors",
  });

  console.log("Errors", errors.mark);
  const onSubmit = (data: QuestionFormValues) => {
    console.log("ho");
    console.log("Data", data);
    // const payload =
    //   data.type === "essay"
    //     ? { ...data, modelAnswer: data.modelAnswer! }
    //     : {
    //         ...data,
    //         key: data.key!,
    //         distractors: data.distractors!.map((d) => d.value),
    //       };
    // console.log(payload);

    //Todo:after adding the question action
  };

  const onHeaderChange = (html: string) => {
    console.log(html);
  };
  const onAnswerChange = (html: string) => {
    console.log(html);
  };

  const renderCategories = MOCK_CATEGORIES.map((category) => {
    return (
      <ClickCard
        key={category._id}
        title={category.name}
        onClick={() => {
          navigate(`/category/${category._id}`);
        }}
      >
        <div className="w-full flex justify-between items-center">
          <span className="font-semibold text-[15px]">Total Questions</span>
          <div className="size-8 rounded-full bg-primary text-primary-foreground flex justify-center items-center">
            05
          </div>
        </div>
      </ClickCard>
    );
  });

  return (
    <div className="w-full p-10 ">
      <h1 className="text-4xl font-semibold ">All Questions</h1>
      <div className="w-full flex justify-end ">
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
                    setValue={setValue}
                    defaultValue="mcq"
                    radioItems={RadioQuestionGroup}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 w-3xs ">
                <NumberSelectorInput
                  label="Question Mark"
                  name="mark"
                  setValue={setValue}
                />
                {/* add error message */}
                <SelectBox
                  label="Specialization"
                  list={MOCK_CATEGORIES}
                  setValue={setValue}
                />
              </div>
            </div>

            <div className=" flex flex-col gap-5">
              <Field data-invalid={false}>
                <FieldLabel htmlFor="question-header">Question</FieldLabel>
                <div className="h-50">
                  <SimpleEditor onChange={onHeaderChange} />
                </div>

                {/* {true && (
                  <FieldDescription className="text-destructive font-semibold">
                    Question Header is required.
                  </FieldDescription>
                )} */}
              </Field>
              {mcq ? (
                <Field data-invalid={false}>
                  <FieldLabel htmlFor="">Options</FieldLabel>
                  <SortableOPtions register={register} />
                </Field>
              ) : (
                <Field data-invalid={false}>
                  <FieldLabel htmlFor="model-answer">Model Answer</FieldLabel>
                  <div className="h-50">
                    <SimpleEditor onChange={onAnswerChange} />
                  </div>

                  {/* {true && (
                  <FieldDescription className="text-destructive font-semibold">
                    Question Header is required.
                  </FieldDescription>
                )} */}
                </Field>
              )}
            </div>
          </div>
        </Modal>
      </div>
      <div className="w-full p-3 grid grid-cols-3 gap-5 mt-5 bg-white rounded-md">
        <div className="border-2 border-border rounded-md px-5 py-3 flex items-center gap-3">
          <span className="text-primary ">
            <CircleQuestionMark size={45} />
          </span>
          <div className="flex flex-col">
            <span className="text-muted font-semibold  ">Total Questions</span>
            <span className="font-semibold text-2xl text-black ">1135</span>
          </div>
        </div>

        <div className="border-2 border-border rounded-md px-5 py-3 flex items-center gap-3">
          <span className="text-primary ">
            <LayoutGrid size={45} />
          </span>
          <div className="flex flex-col">
            <span className="text-muted font-semibold  ">Total Categories</span>
            <span className="font-semibold text-2xl text-black ">6</span>
          </div>
        </div>
      </div>
      <div className="mt-5 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {renderCategories}
      </div>
    </div>
  );
};

export default New_Questions;
