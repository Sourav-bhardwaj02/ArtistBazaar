import { SidebarProvider } from "@/components/ui/sidebar";
import { SellerSidebar } from "@/components/seller/Sidebar";
import { SellerDashboardHeader } from "@/components/seller/Layout/SellerDashboardHeader";
import { Outlet } from "react-router-dom";

export function SellerLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-slate-50/50">
        <SellerSidebar/>
        <div className="flex-1 flex flex-col">
          <SellerDashboardHeader />
          <main className="flex-1 overflow-auto">
         <Outlet /> {/* ✅ nested route content goes here */}
       </main>
        </div>
      </div>
    </SidebarProvider>
  );
}