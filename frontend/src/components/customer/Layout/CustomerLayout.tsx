// components/customer/Layout/CustomerLayout.tsx
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "./CustomerSidebar";
import { CustomerDashboardHeader } from "./CustomerDashboardHeader";
import { Outlet } from "react-router-dom";
import type { ReactNode } from "react";

type CustomerLayoutProps = { children?: ReactNode };

export function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-slate-50/50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <CustomerDashboardHeader />
          <main className="flex-1 overflow-auto">
            {children ?? <Outlet />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
