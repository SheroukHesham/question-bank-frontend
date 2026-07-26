import QuestionDetailsCard from "@/components/QuestionDetailsCard";
import { MOCK_QUESTIONS } from "@/mock";
import { Dot } from "lucide-react";
import type { ReactNode } from "react";
import { useParams } from "react-router-dom";

const McqQuestionDetails = () => {
  // TODO: replace with getQuestion by id API request
  const params = useParams();
  const question = MOCK_QUESTIONS.find((q) => q._id === params.id);

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
  );
};

export default McqQuestionDetails;
