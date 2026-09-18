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

  const renderExams = exams?.map((exam) => {
    return (
      <div
        key={exam._id}
        className=" w-full bg-card cursor-pointer px-5 py-3 rounded-md shadow hover:shadow-lg "
        onClick={() => {
          navigate(`/exams/${exam._id}`, { state: { exam: exam } });
        }}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col w-full gap-y-1">
            <span className={`font-bold text-lg capitalize`}>
              [{exam.type === "essay" ? exam.type : exam.type.toUpperCase()}{" "}
              Exam]
            </span>

            <span className="font-bold text-xl tracking-tight">
              {exam.title}{" "}
            </span>
            <span className="font-semibold text-base text-muted/60">
              Created: {exam.createdAt.split(" ")[0]}
            </span>
          </div>
          {exam.status === "draft" && (
            <span className="capitalize font-bold text-xl text-muted">
              [{exam.status}]
            </span>
          )}
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
