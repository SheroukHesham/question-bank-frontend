import { changeActiveTab } from "@/features/activeTabSlice";
import { useDispatch } from "react-redux";

const Home = () => {
  const dispatch = useDispatch();
  dispatch(changeActiveTab("dashboard"));
  return <div>Hello</div>;
};

export default Home;
