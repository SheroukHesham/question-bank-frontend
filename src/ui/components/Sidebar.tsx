import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/ui/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ChevronDown } from "lucide-react";
import { NAVBAR_ITEMS } from "@/ui/data";
import { useSelector } from "react-redux";
import type { RootState } from "@/ui/store";
import { useNavigationGuard } from "../context/NavigationGuardContext";
import universityLogo from "@/ui/assets/university.png";

export function AppSidebar() {
  const activeTab = useSelector(
    (state: RootState) => state.activeTab.activeIdx,
  );
  const navigate = useNavigate();
  const { requestNavigation } = useNavigationGuard();

  const goTo = (to: string) => requestNavigation(() => navigate(to));

  const renderNavBarItems = NAVBAR_ITEMS.map((item) => {
    const Icon = item.icon;

    return item.subLinks ? (
      <Collapsible defaultOpen className="group/collapsible" key={item.id}>
        <SidebarGroup>
          <SidebarGroupLabel
            asChild
            className={`${activeTab.includes(item.id) ? "text-primary" : ""}`}
          >
            <CollapsibleTrigger className="capitalize flex items-center gap-2">
              {Icon && <Icon size={20} />}

              {item.label}
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent className="flex  flex-col gap-1">
            {item.subLinks.map((subLink) => {
              return (
                <SidebarMenu key={subLink.id}>
                  <SidebarMenuItem
                    className={`capitalize  ${subLink.id === activeTab ? "bg-primary/10 text-primary" : ""} `}
                  >
                    <SidebarMenuButton
                      className="cursor-pointer"
                      onClick={() => goTo(subLink.to as string)}
                    >
                      <span className="text-[16px] ">{subLink.label}</span>
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
        <button
          type="button"
          onClick={() => goTo(item.to as string)}
          className="flex items-center gap-2 w-full text-left"
        >
          <SidebarGroupLabel
            className={`${item.id === activeTab ? "text-primary" : ""}`}
          >
            {Icon && <Icon size={20} />}
            <span className="text-[16px]">{item.label}</span>
          </SidebarGroupLabel>
        </button>
      </SidebarGroup>
    );
  });

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-5 bg-white mt-5 mb-5 flex justify-center ">
          <button type="button" onClick={() => goTo("/")}>
            <img className="h-20" src={universityLogo} />
          </button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {renderNavBarItems}
        <SidebarGroup />
      </SidebarContent>
    </Sidebar>
  );
}
