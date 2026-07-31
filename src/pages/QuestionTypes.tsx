import { ClickCard } from "@/components/ClickCard";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const QuestionTypes = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-1 justify-center w-full top-0 ">
      <div className="w-[60%] flex flex-col gap-y-5">
        <div className="w-full flex justify-end">
          <Modal
            triggerText="Add Question"
            title="Question Type"
            saveButton={false}
          >
            <Button
              onClick={() => {
                navigate("/new_question/essay");
              }}
            >
              Essay Question
            </Button>
            <Button
              onClick={() => {
                navigate("/new_question/mcq");
              }}
            >
              MCQ Question
            </Button>
          </Modal>
        </div>
        <div className="w-full flex justify-between items-center mt-20 ">
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
    </div>
  );
};

export default QuestionTypes;
