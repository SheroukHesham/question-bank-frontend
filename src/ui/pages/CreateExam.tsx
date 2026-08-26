import ExamAddFromBankModal from "@/ui/components/ExamAddFromBankModal";
import GenerateExamModal from "@/ui/components/GenerateExamModal";
import { NumberSelectorInput } from "@/ui/components/NumberSelectorInput";
import QuestionCard from "@/ui/components/QuestionCard";
import { Button } from "@/ui/components/ui/button";
import type { IQuestions } from "@/ui/interfaces";
import type { TQuestionTypes } from "@/ui/types";
import { examSchema, type ExamFormValues } from "@/ui/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

const CreateExam = () => {
  const params = useParams();
  const examType = params.type as TQuestionTypes;
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [addedQuestions, setAddedQuestions] = useState<IQuestions[]>([]);

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
          <div className="flex flex-col gap-y-3 w-full sticky top-0 bg-popover py-2 z-10">
            <div className="flex w-full justify-end">
              <div className="flex flex-col gap-y-1">
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
            <div className="flex w-full items-center gap-5">
              <div className="flex flex-col w-full  gap-3">
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
                </div>
                {errors.addedQuestions && (
                  <p className="text-destructive text-sm font-semibold">
                    {errors.addedQuestions.message}
                  </p>
                )}
              </div>
              <div className="flex gap-5">
                <GenerateExamModal
                  examType={examType}
                  addedQuestions={addedQuestions}
                  totalQuestions={totalQuestions}
                />
                <ExamAddFromBankModal
                  examType={examType}
                  addedQuestions={addedQuestions}
                  setAddedQuestions={setAddedQuestions}
                />
              </div>
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
