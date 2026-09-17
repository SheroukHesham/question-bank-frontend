import ExamAddFromBankModal from "@/ui/components/ExamAddFromBankModal";
import GenerateExamModal from "@/ui/components/GenerateExamModal";
import { NumberSelectorInput } from "@/ui/components/NumberSelectorInput";
import QuestionCard from "@/ui/components/QuestionCard";
import { Button } from "@/ui/components/ui/button";
import type { IExam, IExamBase, IQuestions } from "@/shared/interfaces";
import type { TQuestionTypes } from "@/shared/types";
import { examSchema, type ExamFormValues } from "@/ui/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Trash2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface IProps {
  _formType?: "create" | "edit";
  exam?: IExam;
}

const ExamForm = ({ _formType, exam }: IProps) => {
  const navigate = useNavigate();
  const params = useParams();
  const examType = params.type as TQuestionTypes;
  const [totalQuestions, setTotalQuestions] = useState<number>(
    exam ? exam.totalNumberOfQuestions : 0,
  );
  //todo: if exam is passed, addedQuestions are the questions of the prop
  const [addedQuestions, setAddedQuestions] = useState<IQuestions[]>([]);

  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExamFormValues>({
    resolver: yupResolver(examSchema),
    defaultValues: exam
      ? {
          title: exam?.title,
          numberOfQuestionsAdded: exam?.numberOfQuestionsAdded,
          totalNumberOfQuestions: exam?.totalNumberOfQuestions,
        }
      : undefined,
  });

  setValue("numberOfQuestionsAdded", addedQuestions.length);

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
    setValue("totalNumberOfQuestions", value);
  };

  const createExam = useMutation({
    mutationFn: ({ exam }: { exam: IExamBase }) =>
      window.electron.exam.createExam(exam),
    onSuccess: () => {
      toast.success("Exam is Created Successfully", {
        position: "top-center",
        style: {
          justifyContent: "center",
          color: "green",
          fontSize: "16px",
        },
      });
      navigate(-1);
    },
    onError: () => {
      toast.error("An Error Occurred While Saving The Exam! ", {
        position: "top-center",
        style: {
          justifyContent: "center",
          color: "crimson",
          fontSize: "16px",
        },
      });
    },
  });

  const onSubmit = (data: ExamFormValues) => {
    const examQuestions = addedQuestions.map((question, idx) => {
      return { questionId: question._id, position: idx };
    });
    const payload: IExamBase = {
      ...data,
      examQuestions: examQuestions,
      type: examType,
      status: "final",
    };
    createExam.mutate({ exam: payload });
    console.log(payload);
  };

  return (
    <div className="w-full p-10 ">
      <h1 className="text-4xl font-semibold capitalize ">
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
                {errors.totalNumberOfQuestions && (
                  <p className="text-destructive text-sm font-semibold">
                    {errors.totalNumberOfQuestions.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-y-3 mb-5">
              <Label className="text-2xl ">Exam Title</Label>
              <Input
                type="text"
                {...register("title")}
                className="first-letter:uppercase"
                autoFocus
              />
              {errors.title && (
                <p className="text-destructive text-sm font-semibold">
                  {errors.title.message}
                </p>
              )}
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
                {errors.numberOfQuestionsAdded && (
                  <p className="text-destructive text-sm font-semibold">
                    {errors.numberOfQuestionsAdded.message}
                  </p>
                )}
              </div>
              <div className="flex gap-5">
                <GenerateExamModal
                  examType={examType}
                  addedQuestions={addedQuestions}
                  totalQuestions={totalQuestions}
                  setAddedQuestions={setAddedQuestions}
                />
                <ExamAddFromBankModal
                  examType={examType}
                  addedQuestions={addedQuestions}
                  setAddedQuestions={setAddedQuestions}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col ">
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
                  closeButton={<Trash2 />}
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

export default ExamForm;
