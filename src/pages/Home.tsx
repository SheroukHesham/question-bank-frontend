import { changeActiveTab } from "@/features/activeTabSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const Home = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(changeActiveTab("dashboard"));
  }, [dispatch]);
  return <div>Hello</div>;
};

export default Home;
