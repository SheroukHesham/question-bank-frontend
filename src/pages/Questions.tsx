import { CollapsibleCard } from "@/components/CollapsibleCard";
import { Button } from "@/components/ui/button";
import { changeActiveTab } from "@/features/activeTabSlice";
import {
  MOCK_GROUPED_ESSAY_QUESTIONS,
  MOCK_GROUPED_MCQ_QUESTIONS,
} from "@/mock";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

interface IProps {
  type: "essay" | "mcq";
}

const Questions = ({ type }: IProps) => {
  const dispatch = useDispatch();
  dispatch(changeActiveTab("questions"));
  const navigate = useNavigate();
  const data =
    type === "mcq" ? MOCK_GROUPED_MCQ_QUESTIONS : MOCK_GROUPED_ESSAY_QUESTIONS;

  const renderQuestions = data?.categories.map((category) => {
    return (
      <CollapsibleCard key={category._id} title={category.name}>
        {category.subcategories.map((subcategory) => {
          return (
            <CollapsibleCard key={subcategory._id} title={subcategory.name}>
              {subcategory.questions.length ? (
                subcategory.questions.map((question, idx) => {
                  return (
                    <div
                      className="flex items-center  text-black font-semibold text-lg"
                      key={question._id}
                      onClick={() => {
                        navigate(`/questions/${question._id}`);
                      }}
                    >
                      <span> {idx + 1}- </span>
                      <span className="w-full px-2 ring-0 hover:underline underline-offset-3 cursor-pointer">
                        {question.header}
                      </span>
                    </div>
                  );
                })
              ) : (
                <span className="text-lg ">No Question Yet!</span>
              )}
            </CollapsibleCard>
          );
        })}
      </CollapsibleCard>
    );
  });

  return (
    <div className="w-full px-5">
      <div className="flex flex-col max-w-6xl mx-auto gap-y-5">
        <Button onClick={() => {}}>Add Question</Button>
        {renderQuestions}
      </div>
    </div>
  );
};

export default Questions;
