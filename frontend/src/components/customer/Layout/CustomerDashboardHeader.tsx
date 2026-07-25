import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search, User, LogOut, Home } from "lucide-react";
import { useAlert } from "@/context/alert/AlertContext";
import { Input } from "@/components/ui/input";

interface User {
  name?: string;
  role?: string;
}

export function CustomerDashboardHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showSuccess } = useAlert();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // ✅ Customer ID from URL

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("auth-token");
      const userData = localStorage.getItem("user-data");

      if (token && userData && id) {
        try {
          const parsedUser = JSON.parse(userData);
          if (parsedUser.role === "Customer") {
            setUser({
              name: parsedUser.name || "Customer",
              role: "Customer",
            });
          } else {
            setUser(null);
            navigate("/login", { replace: true });
          }
        } catch {
          setUser(null);
          navigate("/login", { replace: true });
        }
      } else {
        setUser(null);
        navigate("/login", { replace: true });
      }
      setIsLoading(false);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [id, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user-data");
    setUser(null);
    showSuccess("Logged out successfully");
    navigate("/login");
  };

  if (isLoading) {
    return (
      <header className="h-16 bg-card/50 backdrop-blur border-b border-border/50 flex items-center px-6">
        <div className="flex items-center gap-4 flex-1">
          <SidebarTrigger />
          <div className="w-80 h-10 bg-muted rounded-md animate-pulse" />
        </div>
        <div className="w-24 h-10 bg-muted rounded-md animate-pulse" />
      </header>
    );
  }

  if (!user || !id) {
    return null;
  }

  return (
    <header className="h-16 bg-card/50 backdrop-blur border-b border-border/50 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders, suppliers, products..."
            className="pl-10 bg-background/60"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full text-xs flex items-center justify-center text-white">
            3
          </span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full"
              aria-label="Customer menu"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" alt={user.name || "Customer"} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : "CU"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 bg-card/90 backdrop-blur-md text-foreground" align="end">
            <DropdownMenuItem asChild>
              <Link to="/" className="flex items-center w-full">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                to={`/customer/${id}/dashboard`}
                className="flex items-center w-full"
              >
                <User className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <button onClick={handleLogout} className="flex items-center w-full">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
