import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/ui/components/ui/sidebar";
import { AppSidebar } from "@/ui/components/Sidebar";
import { Toaster } from "sonner";
// import Navbar from "@/components/Navbar";

const Layout = () => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        <div className="flex flex-col w-full">
          {/* <Navbar /> */}
          <Toaster />
          <Outlet />
        </div>
      </SidebarProvider>
    </>
  );
};

export default Layout;
