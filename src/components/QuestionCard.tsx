import type { IQuestions } from "@/interfaces";
import { Badge } from "./reui/badge";
import { findSubCategory, isMcqQuestion } from "@/functions";
import { KeyRound, Trash2, X } from "lucide-react";
import { Alert } from "./Alert";
import QuestionForm from "./QuestionForm";
import { useState } from "react";
import { Button } from "./ui/button";

interface IProps {
  idx: number;
  question: IQuestions;
  editable?: boolean;
  size?: "default" | "sm";
  onClick?: (question?: IQuestions) => void;
  onClose?: () => void;
}

const QuestionCard = ({
  question,
  idx,
  editable = true,
  size = "default",
  onClick,
  onClose,
}: IProps) => {
  const { header, difficulty, subcategoryId } = question;
  const [questionToEdit, setQuestionToEdit] = useState(question);

  //todo: replace by api call to delete question
  const onDelete = () => {
    console.log("Delete: ", question);
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
        <span className="font-semibold text-lg">{question.modelAnswer}</span>
      );
    }
  };

  return (
    <div
      className="flex flex-col gap-y-7 bg-card text-card-foreground p-5 rounded-md"
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      <div className="flex w-full justify-between">
        <div className="flex w-full gap-3 items-center">
          <div className="size-8 text-xl text-center flex items-center justify-center rounded-md bg-muted/10 font-semibold text-card-foreground pb-0.5">
            {idx + 1}
          </div>
          <span className="text-xl font-semibold text-card-foreground">
            {header}
          </span>
        </div>

        {onClose && (
          <Button
            variant={"ghost"}
            size={"icon"}
            className=" flex justify-center"
            onClick={onClose}
          >
            <X />
          </Button>
        )}
      </div>
      <div className="flex w-full justify-end">
        <span
          className={`text-lg rounded-full  font-semibold flex items-center justify-center px-5 py-2 capitalize ${difficulty === "difficult" ? "bg-destructive/10 text-destructive" : difficulty === "moderate" ? "bg-warning/10 text-warning-foreground" : "bg-success/10 text-success-foreground"}`}
        >
          {difficulty}
        </span>
      </div>

      {size === "default" ? (
        <>
          {question.headerImageUrl && (
            <div className="w-full flex  justify-center  ">
              <img
                src={question.headerImageUrl}
                className="object-cover aspect-auto"
              />
            </div>
          )}

          <div className="mx-10">{renderAnswer()}</div>
        </>
      ) : (
        <div className="flex w-full justify-between gap-2">
          <div className={`${question.headerImageUrl ? "w-[50%]" : "w-full"}`}>
            {renderAnswer()}
          </div>
          {question.headerImageUrl && (
            <div className="w-[50%] object-contain flex  justify-center  ">
              <img
                src={question.headerImageUrl}
                className="object-contain aspect-auto"
              />
            </div>
          )}
        </div>
      )}

      <div className="w-full flex justify-between pl-10">
        <div className="flex gap-2">
          <span className="text-sm font-semibold">Specialization:</span>
          <Badge variant={"primary-light"} radius={"full"} size={"xl"}>
            {findSubCategory(subcategoryId)}
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
              onSubmit={onDelete}
              buttonSize="icon"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
