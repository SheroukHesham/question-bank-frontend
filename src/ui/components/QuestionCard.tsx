import type { IQuestions } from "@/shared/interfaces";
import { Badge } from "./reui/badge";
import { isMcqQuestion } from "@/ui/functions";
import { KeyRound, Trash2, X } from "lucide-react";
import { Alert } from "./Alert";
import QuestionForm from "./QuestionForm";
import { useState, type ReactNode } from "react";
import { Button } from "./ui/button";
import { useFetch } from "../hooks/custom";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getQuestionImageSrc } from "../lib/image-url";

interface IProps {
  idx: number;
  question: IQuestions;
  editable?: boolean;
  size?: "default" | "sm";
  onClick?: (question?: IQuestions) => void;
  onClose?: () => void;
  closeButton?: ReactNode;
}

const QuestionCard = ({
  question,
  idx,
  editable = true,
  size = "default",
  onClick,
  onClose,
  closeButton,
}: IProps) => {
  const { header, difficulty, subcategoryId } = question;
  const [questionToEdit, setQuestionToEdit] = useState(question);
  const queryClient = useQueryClient();

  const { data: subcategory } = useFetch({
    queryKey: ["subcategory", "findById"],
    queryFn: () =>
      window.electron.subcategory.findSubcategoryById(subcategoryId),
  });

  const deleteQuestionMutation = useMutation({
    mutationKey: ["question", "delete"],
    mutationFn: (questionId: number) =>
      window.electron.question.deleteQuestion(questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", "byCategory"] });
      toast.success("Question Deleted Successfully", {
        position: "top-center",
        style: { justifyContent: "center", color: "green", fontSize: "16px" },
      });
    },
    onError: () => {
      toast.error("Error Deleting Question", {
        position: "top-center",
        style: { justifyContent: "center", color: "crimson", fontSize: "16px" },
      });
    },
  });

  const OnDelete = () => {
    deleteQuestionMutation.mutate(question._id);
  };

  const renderAnswer = () => {
    if (isMcqQuestion(question)) {
      const key = question.choices.find((choice) => choice.isCorrect);
      const distractors = question.choices.filter(
        (choice) => !choice.isCorrect,
      );
      return (
        <div className="flex flex-col gap-y-4">
          <div className="rounded-md flex flex-col gap-3 p-3 border transition-colors border-primary/40 bg-primary/5">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center size-8 rounded-full shrink-0 bg-primary text-primary-foreground">
                <KeyRound className="size-4" />
              </div>
              <span className="font-semibold text-primary text-lg">Key:</span>
            </div>
            <span className="capitalize font-semibold">{key?.choice}</span>
          </div>

          <div className="rounded-md flex flex-col gap-3 p-3 border transition-colors border-destructive/40 bg-destructive/5">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center size-8 rounded-full shrink-0 bg-destructive text-primary-foreground">
                <X className="size-4" />
              </div>
              <span className="font-semibold text-destructive text-lg">
                Distractors:
              </span>
            </div>
            {distractors.map((choice) => {
              return (
                <span key={choice.choice} className="capitalize font-semibold">
                  {choice.choice}
                </span>
              );
            })}
          </div>
        </div>
      );
    } else {
      return (
        <span className="font-semibold line-clamp-3">
          {question.modelAnswer}
        </span>
      );
    }
  };
  return (
    <div
      className="flex flex-col gap-y-7 bg-card text-card-foreground p-5 rounded-md h-full"
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      <div className="flex w-full justify-between">
        <div className="flex w-full justify-between">
          <div className="flex w-full gap-3 items-center">
            <div className="size-8 text-xl text-center flex items-center justify-center rounded-md bg-muted/10 font-semibold text-card-foreground pb-0.5">
              {idx + 1}
            </div>
            <span className="text-xl font-semibold text-card-foreground">
              {header}
            </span>
          </div>
          <span
            className={`text-lg rounded-full  font-semibold flex items-center justify-center px-5 py-2  mr-2 capitalize ${difficulty === "difficult" ? "bg-destructive/10 text-destructive" : difficulty === "moderate" ? "bg-warning/10 text-warning-foreground" : "bg-success/10 text-success-foreground"}`}
          >
            {difficulty}
          </span>
        </div>

        {onClose && (
          <Button
            variant={closeButton ? "destructive" : "ghost"}
            size={"icon"}
            className=" flex justify-center"
            onClick={onClose}
          >
            {closeButton ?? <X />}
          </Button>
        )}
      </div>

      {size === "default" ? (
        <>
          {getQuestionImageSrc(question.headerImageUrl) && (
            <div className="w-full flex  max-h-52 justify-center  ">
              <img
                src={getQuestionImageSrc(question.headerImageUrl)}
                className="object-contain aspect-auto"
                alt={question.header}
              />
            </div>
          )}

          <div className="mx-10">{renderAnswer()}</div>
        </>
      ) : (
        <div className="flex flex-col w-full justify-between gap-2 -mt-5">
          {getQuestionImageSrc(question.headerImageUrl) && (
            <div className="w-full object-contain flex  justify-center max-h-42 ">
              <img
                src={getQuestionImageSrc(question.headerImageUrl)}
                className="object-contain aspect-auto rounded-md shadow"
              />
            </div>
          )}
          <div className={`${question.headerImageUrl ? "w-[50%]" : "w-full"}`}>
            {renderAnswer()}
          </div>
        </div>
      )}

      <div className="w-full flex justify-between h-full items-end  ">
        <div className="flex gap-2 items-center">
          <span className="text-sm font-semibold">Specialization:</span>
          <Badge variant={"primary-light"} radius={"full"} size={"xl"}>
            {subcategory?.name}
          </Badge>
        </div>

        {editable && (
          <div className="flex gap-5 ">
            <QuestionForm
              type="edit"
              questionToEdit={questionToEdit}
              setQuestionToEdit={setQuestionToEdit}
            />
            <Alert
              title="Are you sure you want to delete this question?"
              description="Deleting this question will permanently remove it from the question bank and cannot be recovered."
              buttonChildren={<Trash2 />}
              variant="destructive"
              submitText="Yes, Delete"
              onSubmit={OnDelete}
              buttonSize="icon"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
