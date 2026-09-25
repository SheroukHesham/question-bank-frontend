import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/ui/components/ui/sidebar";
import { AppSidebar } from "@/ui/components/Sidebar";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationGuardProvider } from "../context/NavigationGuardProvider";

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
        <NavigationGuardProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarTrigger />
            <div className="flex flex-col w-full">
              <Toaster />
              <Outlet />
            </div>
          </SidebarProvider>
        </NavigationGuardProvider>
      </QueryClientProvider>
    </>
  );
};

export default Layout;
