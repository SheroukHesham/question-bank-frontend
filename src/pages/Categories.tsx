import { changeActiveTab } from "@/features/activeTabSlice";
import { useDispatch } from "react-redux";

const Categories = () => {
  const dispatch = useDispatch();
  dispatch(changeActiveTab("categories"));
  return <div>Categories</div>;
};

export default Categories;
