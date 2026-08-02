import { Alert } from "@/components/Alert";
import Back from "@/components/Back";
import QuestionDetailsCard from "@/components/QuestionDetailsCard";
import { QuestionForm } from "@/components/QuestionForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { changeActiveTab } from "@/features/activeTabSlice";
import { toFormValues } from "@/functions";
import type { IQuestions } from "@/interfaces";
import { MOCK_QUESTIONS } from "@/mock";
import { questionSchema, type QuestionFormValues } from "@/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dot, Pen, Trash } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const QuestionDetails = () => {
  const dispatch = useDispatch();
  dispatch(changeActiveTab("questions"));
  // TODO: replace with getQuestion by id API request
  const params = useParams();
  const [editMode, setEditMode] = useState(false);

  const question = MOCK_QUESTIONS.find((q) => q._id === params.id);
  const isEssay = question?.type === "essay";
  const {
    register,
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<QuestionFormValues>({
    resolver: yupResolver(questionSchema),
    defaultValues: toFormValues(question as IQuestions),
  });

  const { fields } = useFieldArray({
    control,
    name: "distractors",
  });

  if (!question) {
    return <h1>Question Not Found</h1>;
  }

  // TODO: API request to to edit question
  // TODO: revisit setQuestionToEdit logic
  const onSubmit = (data: QuestionFormValues) => {
    const payload =
      data.type === "essay"
        ? { ...data, modelAnswer: data.modelAnswer! }
        : {
            ...data,
            key: data.key!,
            distractors: data.distractors!.map((d) => d.value),
          };
    console.log("Payload", payload);

    setEditMode(false);
  };

  //TODO:test
  const onCancel = () => {
    reset(toFormValues(question));
    setEditMode(false);
  };

  const onDelete = () => {
    //TODO: change to API call to delete question
    console.log("Delete");
  };

  const renderDistractors = ({
    distractors,
  }: {
    distractors: string[];
  }): ReactNode =>
    distractors.map((distractor, index) => (
      <span key={index} className="flex items-center font-bold">
        <Dot />
        <span className="flex items-center capitalize">{distractor}</span>
      </span>
    ));

  return (
    <div className="max-w-6xl mx-auto gap-y-3 flex flex-col mb-20">
      <Back />
      <div className="flex w-full justify-end">
        {!editMode ? (
          <Button
            className="w-fit"
            onClick={() => {
              setEditMode(true);
            }}
          >
            <Pen />
            Edit Question
          </Button>
        ) : (
          <Alert
            title="Are You Sure You Want to Delete This Question?"
            description="Deleting this question will permanently remove it from the question bank."
            submitText="Delete"
            variant="destructive"
            onSubmit={onDelete}
            icon={<Trash />}
            buttonChildren={
              <>
                <Trash />
                Delete Question
              </>
            }
          />
        )}
      </div>
      <div>
        {editMode ? (
          <Card>
            {isEssay ? (
              <QuestionForm
                errors={errors}
                onCancel={onCancel}
                register={register}
                setValue={setValue}
                onSubmit={handleSubmit(onSubmit)}
                defaultValues={toFormValues(question)}
              >
                <input
                  type="hidden"
                  {...register("type")}
                  value={params.type === "essay" ? "essay" : "mcq"}
                />
                <Field>
                  <FieldLabel
                    htmlFor="modelAnswer"
                    className="text-black font-bold mb-2 text-[16px]"
                  >
                    Model Answer
                  </FieldLabel>
                  <Textarea
                    {...register("modelAnswer")}
                    className="text-[16px] text-black font-semibold text-justify min-h-fit"
                  />
                  {errors?.modelAnswer && (
                    <p className="text-destructive text-sm font-semibold">
                      {errors.modelAnswer.message}
                    </p>
                  )}
                </Field>
              </QuestionForm>
            ) : (
              <QuestionForm
                errors={errors}
                onCancel={onCancel}
                register={register}
                setValue={setValue}
                onSubmit={handleSubmit(onSubmit)}
                defaultValues={toFormValues(question)}
              >
                <div className="flex w-[80%] gap-x-5 justify-center">
                  <Field className=" font-semibold flex flex-col">
                    <FieldLabel
                      htmlFor="questionKey"
                      className="text-[16px] text-black font-semibold"
                    >
                      Key:
                    </FieldLabel>
                    <span className="flex items-center">
                      <Dot />
                      <Input
                        {...register("key")}
                        className="flex items-center capitalize"
                      />
                    </span>
                    {errors?.key && (
                      <p className="text-destructive text-sm">
                        {errors.key.message}
                      </p>
                    )}
                  </Field>

                  <Field className="text-black font-semibold flex flex-col">
                    <FieldLabel className="text-[16px]">
                      Distractors:
                    </FieldLabel>
                    {fields.map((field, idx) => (
                      <div key={field.id}>
                        <span className="flex items-center">
                          <Dot />
                          <Input
                            {...register(`distractors.${idx}.value`)}
                            className="flex items-center capitalize"
                          />
                        </span>
                        {errors?.distractors?.[idx]?.value && (
                          <p className="text-destructive text-sm">
                            {errors.distractors[idx]?.value?.message}
                          </p>
                        )}
                      </div>
                    ))}
                  </Field>
                </div>
              </QuestionForm>
            )}
          </Card>
        ) : question?.type === "essay" ? (
          <QuestionDetailsCard
            header={question?.header as string}
            difficulty={question?.difficulty as number}
            mark={question?.mark as number}
          >
            <div className="text-black font-bold mb-2">Model Answer:</div>
            <div className="h-fit text-black font-semibold text-justify text-[16px]">
              {question?.modelAnswer}
            </div>
          </QuestionDetailsCard>
        ) : (
          <QuestionDetailsCard
            header={question?.header as string}
            difficulty={question?.difficulty as number}
            mark={question?.mark as number}
          >
            <div className="flex w-[80%] justify-between">
              <div className="text-green-900 font-semibold flex flex-col text-[16px]">
                <span>Key:</span>
                {question?.key && (
                  <span className="flex items-center font-bold ">
                    <Dot />
                    <span className=" flex items-center capitalize">
                      {question?.key}
                    </span>
                  </span>
                )}
              </div>

              <div className="text-black font-semibold flex flex-col text-[16px]">
                <span>Distractors:</span>
                {question?.distractors &&
                  renderDistractors({
                    distractors: question?.distractors as string[],
                  })}
              </div>
            </div>
          </QuestionDetailsCard>
        )}
      </div>
    </div>
  );
};

export default QuestionDetails;
