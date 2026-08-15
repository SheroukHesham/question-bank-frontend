import ExamAddFromBankModal from "@/components/ExamAddFromBankModal";
import { NumberSelectorInput } from "@/components/NumberSelectorInput";
import QuestionCard from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";
import type { IQuestions } from "@/interfaces";
import { MOCK_QUESTIONS } from "@/mock";
import { examSchema, type ExamFormValues } from "@/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

const CreateExam = () => {
  //todo:remove

  const params = useParams();
  const examType = params.type;
  const questions = MOCK_QUESTIONS.filter((item) => item.type === examType);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [addedQuestions, setAddedQuestions] = useState<IQuestions[]>(questions);
  // const [addFromBank, setAddFromBank] = useState<IQuestions[]>();

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ExamFormValues>({
    resolver: yupResolver(examSchema),
  });

  setValue("addedQuestions", addedQuestions.length);

  const toggleSelected = (question: IQuestions) => {
    if (addedQuestions.includes(question)) {
      const filtered = addedQuestions.filter((item) => item !== question);
      setAddedQuestions(filtered);
    } else {
      setAddedQuestions((prev) => [...prev, question]);
    }
  };

  const onTotalQuestionsChange = (value: number) => {
    setTotalQuestions(value);
    setValue("totalQuestions", value);
  };

  const onSubmit = (data: ExamFormValues) => {
    console.log(data);
  };

  return (
    <div className="w-full p-10 ">
      <h1 className="text-4xl font-semibold capitalize">
        {examType === "essay" ? examType : examType?.toUpperCase()} Exam
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full flex flex-col gap-5 ">
          <div className="flex justify-between w-full sticky top-0 bg-popover py-2 z-10">
            <div className="flex items-end ">
              <div className="flex items-center gap-5">
                <div>
                  <span className="text-muted/70 font-semibold mr-2 items-center ">
                    Questions Added:
                  </span>
                  <span
                    className={`font-bold ${addedQuestions.length > totalQuestions ? "text-destructive" : ""}`}
                  >
                    {addedQuestions.length}
                  </span>
                  <span className="font-semibold">/{totalQuestions}</span>
                  {errors.addedQuestions && (
                    <p className="text-destructive text-sm font-semibold">
                      {errors.addedQuestions.message}
                    </p>
                  )}
                </div>

                <ExamAddFromBankModal
                  addedQuestions={addedQuestions}
                  setAddedQuestions={setAddedQuestions}
                />
              </div>
            </div>

            <div className="mb-5">
              <NumberSelectorInput
                label="Number of Questions"
                name="totalQuestions"
                onValueChange={(value) =>
                  onTotalQuestionsChange(value as number)
                }
              />
              {errors.totalQuestions && (
                <p className="text-destructive text-sm font-semibold">
                  {errors.totalQuestions.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-5 ">
            {addedQuestions.map((question, idx) => {
              return (
                <QuestionCard
                  key={question._id}
                  idx={idx}
                  question={question}
                  editable={false}
                  onClose={() => {
                    toggleSelected(question);
                  }}
                />
              );
            })}
          </div>

          <div className="w-full flex justify-center">
            <Button className="w-fit">Submit</Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateExam;
