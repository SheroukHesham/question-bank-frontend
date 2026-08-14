import type { IQuestions } from "@/interfaces";
import { Badge } from "./reui/badge";
import { findSubCategory, isMcqQuestion } from "@/functions";
import { Circle, CircleCheckBigIcon, Trash2 } from "lucide-react";
import { Alert } from "./Alert";
import QuestionForm from "./QuestionForm";
import { useState } from "react";

interface IProps {
  idx: number;
  question: IQuestions;
}

const QuestionCard = ({ question, idx }: IProps) => {
  const { header, mark, subcategoryId } = question;
  const [questionToEdit, setQuestionToEdit] = useState(question);

  //todo: replace by api call to delete question
  const onDelete = () => {
    console.log("Delete: ", question);
  };

  const renderAnswer = () => {
    if (isMcqQuestion(question)) {
      return (
        <div className="flex flex-col gap-y-4">
          {question.choices.map((choice, idx) => {
            return (
              <div key={idx} className="flex items-center gap-2">
                {choice.isCorrect ? (
                  <CircleCheckBigIcon size={20} />
                ) : (
                  <Circle size={20} />
                )}
                <span className="capitalize font-semibold text-lg">
                  {choice.choice}
                </span>
              </div>
            );
          })}
        </div>
      );
    } else {
      return (
        <span className="font-semibold text-lg">{question.modelAnswer}</span>
      );
    }
  };

  return (
    <div className="flex flex-col gap-y-7 bg-card text-card-foreground p-5 rounded-md">
      <div className="flex justify-between">
        <div className="flex gap-3 items-center">
          <div className="size-8 text-xl text-center flex items-center justify-center rounded-md bg-muted/10 font-semibold text-card-foreground pb-0.5">
            {idx + 1}
          </div>
          <span className="text-xl font-semibold text-card-foreground">
            {header}
          </span>
        </div>

        <div className="gap-2 flex items-center">
          <span className="text-muted font-semibold">Mark</span>
          <span className="size-8 text-lg rounded-full bg-muted/5 font-semibold flex items-center justify-center text-muted pb-0.5">
            {mark}
          </span>
        </div>
      </div>

      {question.headerImageUrl && (
        <div className="w-full flex  justify-center  ">
          <img
            src={question.headerImageUrl}
            className="object-cover aspect-auto"
          />
        </div>
      )}

      <div className="mx-10">{renderAnswer()}</div>

      <div className="w-full flex justify-between pl-10">
        <div className="flex gap-2">
          <span className="text-sm font-semibold">Specialization:</span>
          <Badge variant={"primary-light"} radius={"full"} size={"xl"}>
            {findSubCategory(subcategoryId)}
          </Badge>
        </div>

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
      </div>
    </div>
  );
};

export default QuestionCard;
