import { Card } from "@/components/ui/card";
import { changeActiveTab } from "@/features/activeTabSlice";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { questionSchema, type QuestionFormValues } from "@/validation";
import { QuestionForm } from "@/components/QuestionForm";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { defaultEssayFormValues, defaultMcqFormValues } from "@/data";
import { Dot } from "lucide-react";
import { Input } from "@/components/ui/input";

const NewQuestion = () => {
  const dispatch = useDispatch();
  dispatch(changeActiveTab("questions"));
  const params = useParams();
  const navigate = useNavigate();
  const isEssay = params.type === "essay";

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<QuestionFormValues>({
    resolver: yupResolver(questionSchema),
    defaultValues: isEssay ? defaultEssayFormValues : defaultMcqFormValues,
  });

  const { fields } = useFieldArray({
    control,
    name: "distractors",
  });

  console.log(errors);

  //Todo: change to Api call to add question
  const onSubmit = (data: QuestionFormValues) => {
    const payload =
      data.type === "essay"
        ? { ...data, modelAnswer: data.modelAnswer! }
        : {
            ...data,
            key: data.key!,
            distractors: data.distractors!.map((d) => d.value),
          };
    console.log(payload);

    //Todo:after adding the question action
  };

  const onCancel = () => {
    navigate("/questions");
  };
  return (
    <div className="max-w-6xl mx-auto gap-y-3 flex flex-col mb-20">
      <Card>
        {isEssay ? (
          <QuestionForm
            errors={errors}
            onCancel={onCancel}
            register={register}
            setValue={setValue}
            onSubmit={handleSubmit(onSubmit)}
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
                <p className="text-destructive text-sm">
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
                <FieldLabel className="text-[16px]">Distractors:</FieldLabel>
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
    </div>
  );
};

export default NewQuestion;
