import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Toaster } from "sonner";
// import Navbar from "@/components/Navbar";

const Layout = () => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
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
