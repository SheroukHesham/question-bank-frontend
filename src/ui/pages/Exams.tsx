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
  console.log(exams);
  const renderExams = exams?.map((exam) => {
    return (
      <div
        className="flex flex-col w-full bg-card cursor-pointer px-5 py-3 rounded-md shadow hover:shadow-lg gap-y-2"
        onClick={() => {
          navigate(`/exams/${exam._id}`);
        }}
      >
        <span className="capitalize font-bold text-lg">[{exam.type} Exam]</span>
        <div className="flex items-center">
          <span className="font-bold text-xl ">{exam.title}: </span>
          <span className="font-bold text-xl pl-1">
            {exam.createdAt.split(" ")[0]}
          </span>
        </div>
      </div>
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
                className="font-semibold text-[16px] text-primary hover:bg-primary/10 px-3 py-2 rounded-md cursor-pointer"
                onClick={() => navigate("/exams/new/mcq")}
              >
                MCQ Exam
              </span>
              <span
                className="font-semibold text-[16px] text-primary hover:bg-primary/10 px-3 py-2 rounded-md cursor-pointer"
                onClick={() => navigate("/exams/new/essay")}
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
