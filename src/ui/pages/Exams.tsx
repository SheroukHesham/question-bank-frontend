import { Button } from "@/ui/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/ui/components/ui/hover-card";
import { changeActiveTab } from "@/ui/features/activeTabSlice";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/custom";
import ExamCard from "../components/ExamCard";

const Exams = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(changeActiveTab("exams"));
  }, [dispatch]);

  const { data: exams } = useFetch({
    queryKey: ["exam", "getAll"],
    queryFn: () => window.electron.exam.findAllExams(),
  });

  const renderExams = exams?.map((exam) => {
    return (
      <ExamCard
        key={exam._id}
        exam={exam}
        onClick={() => {
          navigate(`/exams/${exam._id}`, { state: { exam: exam } });
        }}
      />
    );
  });

  return (
    <div className="w-full p-10 ">
      <h1 className="text-4xl font-semibold ">All Exams</h1>
      <div className="w-full flex justify-end ">
        <HoverCard openDelay={100} closeDelay={100}>
          <HoverCardTrigger asChild>
            <Button variant={"secondary"} size={"default"}>
              <Plus /> Create New Exam
            </Button>
          </HoverCardTrigger>
          <HoverCardContent side={"bottom"}>
            <div className="flex flex-col gap-1">
              <span
                className="font-bold text-[16px] text-primary hover:bg-primary/10 px-3 py-2 rounded-md cursor-pointer"
                onClick={() =>
                  navigate("/exams/form/mcq", { state: { formType: "create" } })
                }
              >
                MCQ Exam
              </span>
              <span
                className="font-bold text-[16px] text-primary hover:bg-primary/10 px-3 py-2 rounded-md cursor-pointer"
                onClick={() =>
                  navigate("/exams/form/essay", {
                    state: { formType: "create" },
                  })
                }
              >
                Essay Exam
              </span>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      <div className="flex flex-col w-full mt-10 gap-5">{renderExams}</div>
    </div>
  );
};

export default Exams;
