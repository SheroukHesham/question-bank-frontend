import type { IExam } from "@/shared/interfaces";
import { useLocation, useNavigate } from "react-router-dom";
import Back from "../components/Back";
import QuestionCard from "../components/QuestionCard";
import { useFetch } from "../hooks/custom";
import { Button } from "../components/ui/button";

const ExamDetails = () => {
  const location = useLocation();
  const exam: IExam = location.state.exam;
  const navigate = useNavigate();

  const { data: questions } = useFetch({
    queryKey: ["questions", "findByExam", exam._id],
    queryFn: () => window.electron.question.findQuestionsForExam(exam._id),
  });

  const renderQuestions = questions?.map((question, idx) => {
    return (
      <QuestionCard
        key={question._id}
        idx={idx}
        editable={false}
        question={question}
      />
    );
  });

  return (
    <div className="flex flex-col gap-5 w-full p-10">
      <div className="flex w-full justify-between">
        <Back />
        <Button
          onClick={() => {
            navigate(`/exams/form/${exam.type}`, {
              state: { formType: "edit", exam: exam },
            });
          }}
        >
          Edit Exam
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex w-full justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-semibold  capitalize">
              [{exam.type === "essay" ? exam.type : exam.type.toUpperCase()}{" "}
              Exam]
            </h1>

            <h1 className="text-4xl font-bold tracking-tight">
              {exam.title}: {exam.createdAt}
            </h1>
          </div>
          {exam.status === "draft" && (
            <h1 className="text-4xl font-semibold capitalize text-muted">
              [{exam.status}]
            </h1>
          )}
        </div>
        <span className="font-semibold text-muted/50">
          Last Updated: {exam.updatedAt}
        </span>
      </div>
      <div className="flex gap-1 items-center text-[18px] mt-5">
        <span className="font-semibold text-[18px]">Exam Questions: </span>
        <span className="font-bold">
          {exam.numberOfQuestionsAdded}/{exam.totalNumberOfQuestions}
        </span>
      </div>
      <div>{questions && renderQuestions}</div>
    </div>
  );
};

export default ExamDetails;
