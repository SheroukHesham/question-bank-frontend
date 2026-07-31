import { NAVBAR_ITEMS } from "@/data";
import { Link } from "react-router-dom";
import { ProfileAvatar } from "./ProfileAvatar";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { changeActiveTab } from "@/features/activeTabSlice";
//TODO:resizable for small screens

const Navbar = () => {
  const activeTab = useSelector(
    (state: RootState) => state.activeTab.activeIdx,
  );
  const dispatch = useDispatch();

  const renderNavItems = NAVBAR_ITEMS.map((item) => {
    return (
      <Link
        key={item.id}
        to={item.to}
        onClick={() => {
          dispatch(changeActiveTab(item.id));
        }}
        className={` border-b-2 py-1 ease-in duration-200 cursor-pointer   ${item.id === activeTab ? "border-b-primary" : "border-b-transparent"}`}
      >
        {item.label}
      </Link>
    );
  });

  return (
    <div className="flex justify-center items-center bg-secondary text-secondary-foreground w-full py-5 font-semibold text-lg mb-10 ">
      <div className="flex  items-center justify-between w-6xl ">
        <div className="w-50 bg-white ">
          <Link to={"/"}>
            <img src="https://www.gu.edu.eg/wp-content/uploads/2023/08/GU-Powered-by-ASU-Colored.png" />
          </Link>
        </div>
        <div className="flex gap-8 w-[50%] justify-between">
          {renderNavItems}
        </div>
        <div>
          <ProfileAvatar />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
