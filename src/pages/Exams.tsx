import { changeActiveTab } from "@/features/activeTabSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const Exams = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(changeActiveTab("exams"));
  }, [dispatch]);
  return <div>Exams</div>;
};

export default Exams;
