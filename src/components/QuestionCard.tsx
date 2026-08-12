import type { IQuestions } from "@/interfaces";
import { Badge } from "./reui/badge";
import { findSubCategory } from "@/functions";
import { Trash2 } from "lucide-react";
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

  console.log(questionToEdit);

  //todo: replace by api call to delete question
  const onDelete = () => {
    console.log("Delete: ", question);
  };

  return (
    <div className="bg-card text-card-foreground p-5 rounded-md">
      <div className="flex justify-between mb-7">
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
          <span className="size-8 text-lg rounded-full bg-muted/10 font-semibold flex items-center justify-center text-muted pb-0.5">
            {mark}
          </span>
        </div>
      </div>

      <div className="w-full flex justify-between">
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
