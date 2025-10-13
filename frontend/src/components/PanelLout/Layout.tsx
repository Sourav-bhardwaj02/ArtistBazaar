import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/PanelLout/Sidebar";
import { DashboardHeader } from "@/components/PanelLout/DashboardHeader";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-slate-50/50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 overflow-auto">
         <Outlet /> {/* ✅ nested route content goes here */}
       </main>
        </div>
      </div>
    </SidebarProvider>
  );
}