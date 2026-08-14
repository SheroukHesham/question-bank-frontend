import { Button } from "@/components/ui/button";
import { changeActiveTab } from "@/features/activeTabSlice";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Exams = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(changeActiveTab("exams"));
  }, [dispatch]);

  const [createExamOptions, setCreateExamOptions] = useState(false);

  return (
    <div className="w-full p-10 ">
      <h1 className="text-4xl font-semibold ">All Exams</h1>
      <div className="w-full flex justify-end ">
        <Button
          variant={"secondary"}
          size={"default"}
          onClick={() => {
            setCreateExamOptions(true);
          }}

          // onClick={() => {
          //   navigate("/exams/new");
          // }}
        >
          <Plus /> Create New Exam
        </Button>
      </div>
    </div>
  );
};

export default Exams;
