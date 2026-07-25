import { useState, useMemo } from "react";
import { NavLink, useParams, Link } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Package,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Store,
  Users,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth/AuthContext"; // 👈 example auth context hook

// Seller nav
const sellerNavigation = [
  { name: "Home", href: "home", icon: LayoutDashboard },
  { name: "Dashboard", href: "dashboard", icon: LayoutDashboard },
  { name: "About", href: "about", icon: User },
  { name: "Services", href: "services", icon: Package },
  { name: "Chats", href: "chats", icon: MessageSquare },
  { name: "Analytics", href: "analytics", icon: BarChart3 },
  { name: "Settings", href: "settings", icon: Settings },
];

// Customer nav
const customerNavigation = [
  { name: "Home", href: "home", icon: LayoutDashboard },
  { name: "Dashboard", href: "dashboard", icon: LayoutDashboard },
  { name: "About", href: "about", icon: User },
  { name: "Suppliers", href: "suppliers", icon: Users },
  { name: "Analytics", href: "analytics", icon: BarChart3 },
  { name: "Settings", href: "settings", icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { id } = useParams();
  const { user } = useAuth(); // 👈 assumes { user: { role: "Seller" | "Customer", name, ... } }

  // Pick correct nav + base path
  const { basePath, navigation } = useMemo(() => {
    if (user?.role === "Customer") {
      return { basePath: `/customer/${id}`, navigation: customerNavigation };
    }
    return { basePath: `/seller/${id}`, navigation: sellerNavigation };
  }, [user, id]);

  return (
    <div
      className={cn(
        "bg-card border-r border-border transition-all duration-300 flex flex-col shadow-card",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
          <Link to="/" className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Store className="w-5 h-5 text-primary-foreground" />
          </Link>
          {!collapsed && (
            <div>
              <h1 className="font-semibold text-foreground">Artist Bazaar</h1>
              <p className="text-xs text-muted-foreground">
                {user?.role ?? "Dashboard"}
              </p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href ? `${basePath}/${item.href}` : basePath}
                end={item.href === ""}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive
                      ? "bg-gradient-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground",
                    collapsed && "justify-center"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          {!collapsed && user && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user.name || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user.role}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
