import { NAVBAR_ITEMS } from "@/data";
import { Link } from "react-router-dom";
import { ProfileAvatar } from "./ProfileAvatar";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { changeActiveTab } from "@/features/activeTabSlice";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { NavigationMenuDemo } from "./items";
//TODO:resizable for small screens

const Navbar = () => {
  const activeTab = useSelector(
    (state: RootState) => state.activeTab.activeIdx,
  );
  const dispatch = useDispatch();

  const renderNavItems = NAVBAR_ITEMS.map((item) => {
    return item.subLinks ? (
      <NavigationMenuItem>
        <NavigationMenuTrigger className="text-lg">
          Getting started
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="w-96">
            <ListItem href="/docs" title="Introduction">
              Re-usable components built with Tailwind CSS.
            </ListItem>
            <ListItem href="/docs/installation" title="Installation">
              How to install dependencies and structure your app.
            </ListItem>
            <ListItem href="/docs/primitives/typography" title="Typography">
              Styles for headings, paragraphs, lists...etc
            </ListItem>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    ) : (
      <></>
    );
    // return (
    //   <Link
    //     key={item.id}
    //     to={item.to}
    //     onClick={() => {
    //       dispatch(changeActiveTab(item.id));
    //     }}
    //     className={` border-b-2 py-1 ease-in duration-200 cursor-pointer   ${item.id === activeTab ? "border-b-primary" : "border-b-transparent"}`}
    //   >
    //     {item.label}
    //   </Link>
    // );
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
          <NavigationMenu>
            <NavigationMenuList>{renderNavItems}</NavigationMenuList>
          </NavigationMenu>
        </div>
        <div>
          <ProfileAvatar />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link to={href}>
          <div className="flex flex-col gap-1 text-sm">
            <div className="leading-none font-medium">{title}</div>
            <div className="line-clamp-2 text-muted-foreground">{children}</div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
