import { Button } from "@/ui/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/ui/components/ui/hover-card";
import { changeActiveTab } from "@/ui/features/activeTabSlice";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/custom";
import ExamCard from "../components/ExamCard";
import type { TQuestionTypeFilter } from "../types";
import { SingleSelect } from "../components/SingleSelect";
import { SelectItem } from "../components/ui/select";
import ReusableSearch from "../components/ReusableSearch";
import { examQueries } from "../lib/queries/exam.queries";

type TExamStatusFilter = "all" | "final" | "draft";

const Exams = () => {
  const [typeFilter, setTypeFilter] = useState<TQuestionTypeFilter>("all");
  const [examStatusFilter, setExamStatusFilter] =
    useState<TExamStatusFilter>("all");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeActiveTab("exams"));
  }, [dispatch]);

  const { data: exams } = useFetch(examQueries.findAll());

  const filteredExams = useMemo(() => {
    if (search === "") {
      return exams?.filter((exam) => {
        const matchesType = typeFilter === "all" || exam.type === typeFilter;
        const matchesStatus =
          examStatusFilter === "all" || exam.status === examStatusFilter;

        return matchesStatus && matchesType;
      });
    } else {
      return exams?.filter((exam) =>
        exam.title.toLowerCase().includes(search.toLowerCase()),
      );
    }
  }, [exams, typeFilter, examStatusFilter, search]);

  const renderExams = filteredExams?.map((exam) => {
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

      <div className="mt-5">
        <ReusableSearch
          placeholder="Search Exams"
          search={search}
          setSearch={setSearch}
        />
      </div>
      <div className=" flex w-full  mt-3">
        <SingleSelect
          placeholder="Exam Type"
          onValueChange={(value) => setTypeFilter(value as TQuestionTypeFilter)}
        >
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="mcq">MCQ</SelectItem>
          <SelectItem value="essay">Essay</SelectItem>
        </SingleSelect>

        <SingleSelect
          placeholder="Exam Status"
          onValueChange={(value) =>
            setExamStatusFilter(value as TExamStatusFilter)
          }
        >
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="final">Final</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
        </SingleSelect>
      </div>

      <div className="flex flex-col w-full mt-10 gap-5">{renderExams}</div>
    </div>
  );
};

export default Exams;
