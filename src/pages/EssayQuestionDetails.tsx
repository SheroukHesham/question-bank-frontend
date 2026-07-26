import QuestionDetailsCard from "@/components/QuestionDetailsCard";
import { MOCK_QUESTIONS } from "@/mock";
import { useParams } from "react-router-dom";

const EssayQuestionDetails = () => {
  // TODO: replace with getQuestion by id API request
  const params = useParams();
  const question = MOCK_QUESTIONS.find((q) => q._id === params.id);

  return (
    <QuestionDetailsCard
      header={question?.header as string}
      difficulty={question?.difficulty as number}
      mark={question?.mark as number}
    >
      <div className="text-black font-bold mb-2">Model Answer:</div>
      <div className="h-fit text-black font-semibold text-justify text-[16px]">
        {question?.modelAnswer}
      </div>
    </QuestionDetailsCard>
  );
};

export default EssayQuestionDetails;
