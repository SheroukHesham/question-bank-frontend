import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/ui/components/ui/sidebar";
import { AppSidebar } from "@/ui/components/Sidebar";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Layout = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarTrigger />
          <div className="flex flex-col w-full">
            {/* <Navbar /> */}
            <Toaster />
            <Outlet />
          </div>
        </SidebarProvider>
      </QueryClientProvider>
    </>
  );
};

export default Layout;
