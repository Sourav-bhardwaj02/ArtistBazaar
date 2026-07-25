import { SidebarProvider } from "@/components/ui/sidebar";
import { ServiceSidebar } from "@/components/services/Layout/ServiceSidebar";
import { ServiceDashboardHeader } from "@/components/services/Layout/ServiceDashboardHeader";
import { Outlet } from "react-router-dom";


export function ServiceLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-slate-50/50">
        <ServiceSidebar />
        <div className="flex-1 flex flex-col">
          <ServiceDashboardHeader />
          <main className="flex-1 overflow-auto">
         <Outlet /> {/* ✅ nested route content goes here */}
       </main>
        </div>
      </div>
    </SidebarProvider>
  );
}