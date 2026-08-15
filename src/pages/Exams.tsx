import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { changeActiveTab } from "@/features/activeTabSlice";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Exams = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(changeActiveTab("exams"));
  }, [dispatch]);

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
    </div>
  );
};

export default Exams;
