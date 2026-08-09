import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ChevronDown } from "lucide-react";
import { NAVBAR_ITEMS } from "@/data";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

export function AppSidebar() {
  const activeTab = useSelector(
    (state: RootState) => state.activeTab.activeIdx,
  );

  const renderNavBarItems = NAVBAR_ITEMS.map((item) => {
    const Icon = item.icon;

    return item.subLinks ? (
      <Collapsible defaultOpen className="group/collapsible" key={item.id}>
        <SidebarGroup>
          <SidebarGroupLabel
            asChild
            className={`${item.id === activeTab ? "text-primary" : ""}`}
          >
            <CollapsibleTrigger className="capitalize flex items-center gap-2">
              {Icon && <Icon size={20} />}

              {item.label}
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            {item.subLinks.map((subLink) => {
              return (
                <SidebarMenu key={subLink.id}>
                  <SidebarMenuItem className="capitalize ">
                    <SidebarMenuButton asChild>
                      <Link to={subLink.to as string}>
                        <span className="text-[16px]">{subLink.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              );
            })}
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    ) : (
      <SidebarGroup key={item.id}>
        <SidebarGroupLabel
          className={`${item.id === activeTab ? "text-primary" : ""}`}
        >
          <Link to={item.to as string} className="flex items-center gap-2">
            {Icon && <Icon size={20} />}
            <span className="text-[16px]">{item.label}</span>
          </Link>
        </SidebarGroupLabel>
      </SidebarGroup>
    );
  });

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-5 bg-white mt-5 mb-5">
          <Link to={"/"}>
            <img src="https://www.gu.edu.eg/wp-content/uploads/2023/08/GU-Powered-by-ASU-Colored.png" />
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {renderNavBarItems}
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
