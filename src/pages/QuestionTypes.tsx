import { ClickCard } from "@/components/ClickCard";
import { useNavigate } from "react-router-dom";

const QuestionTypes = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-1 h-screen absolute border items-center justify-center  w-full top-0 ">
      <div className="w-[60%] flex justify-between items-center  ">
        <ClickCard
          title="MCQ Questions"
          description="View all the MCQ questions in the bank."
          onClick={() => {
            navigate("/questions/mcq");
          }}
        />
        <ClickCard
          title="Essay Questions"
          description="View all the essay questions in the bank."
          onClick={() => {
            navigate("/questions/essay");
          }}
        />
      </div>
    </div>
  );
};

export default QuestionTypes;
