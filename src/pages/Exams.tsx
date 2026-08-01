import { changeActiveTab } from "@/features/activeTabSlice";
import { useDispatch } from "react-redux";

const Exams = () => {
  const dispatch = useDispatch();
  dispatch(changeActiveTab("exams"));
  return <div>Exams</div>;
};

export default Exams;
