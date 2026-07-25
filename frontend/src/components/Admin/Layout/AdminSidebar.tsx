import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  Database,
  Users,
  Shield,
  FileText,
  Settings,
  Code,
  Globe,
  Activity,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const mainItems = [
  { title: "Overview", url: "/admin", icon: BarChart3 },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Analytics", url: "/admin/analytics", icon: Activity },
  { title: "Security", url: "/admin/security", icon: Shield },
  { title: "Logs", url: "/admin/logs", icon: FileText },
  { title: "Domains", url: "/admin/domains", icon: Globe },
  { title: "Code", url: "/admin/code", icon: Code },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

const dataItems = [
  "Product",
  "Order",
  "CartItem",
  "WishlistItem",
  "Category",
  "PaymentGateway",
  "DeliveryPartner",
  "ProductOption",
  "Review",
  "Coupon",
  "Banner",
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const [dataOpen, setDataOpen] = useState(true);

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-primary text-black font-medium shadow-glow"
      : "hover:bg-muted/50 text-black hover:text-primary-foreground";

  return (
    <Sidebar className={`${collapsed ? "w-16" : "w-64"} bg-card border-r shadow-card`}>
      <SidebarContent className="p-4">
        {/* Logo/Brand */}
        <div className="flex items-center gap-2 mb-6 px-2">
          {!collapsed && (
            <>
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg">Admin Panel</span>
            </>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center mx-auto">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-foreground px-2 mb-2 text-black">
            {!collapsed && "MAIN"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.slice(0, 2).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="rounded-lg">
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="w-5 h-5" />
                      {!collapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Data Section - Moved below Users */}
        {!collapsed && (
          <SidebarGroup className="mt-6">
            <Collapsible open={dataOpen} onOpenChange={setDataOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1 text-xs font-medium text-foreground opacity-100 hover:text-primary">
                <span>DATA</span>
                {dataOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 mt-2">
                <SidebarMenu>
                  {dataItems.map((item) => (
                    <SidebarMenuItem key={item}>
                      <SidebarMenuButton asChild className="rounded-lg pl-6">
                        <NavLink
                          to={`/admin/data/${item.toLowerCase()}`}
                          className={({ isActive }) =>
                            isActive
                              ? "bg-accent/10 text-accent font-medium border-l-2 border-accent"
                              : "hover:bg-muted/30 text-foreground hover:text-primary"
                          }
                        >
                          <Database className="w-4 h-4" />
                          <span className="ml-3">{item}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        )}

        {/* Remaining Main Navigation */}
        <SidebarGroup className="mt-6">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.slice(2).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="rounded-lg">
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="w-5 h-5" />
                      {!collapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}