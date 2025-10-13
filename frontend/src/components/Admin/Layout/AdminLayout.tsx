import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Button } from "@/components/ui/button";
import { Bell, Search, User, LogOut } from "lucide-react";
import { useAlert } from '@/context/alert/AlertContext';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Types
interface User {
  name?: string;
  role?: string;
}
interface NavLink {
  name: string;
  path: string;
  isHash?: boolean;
}

export function AdminLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { showSuccess } = useAlert();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const handleLogout = () => {
    localStorage.clear();
    setUser(null); ``
    setIsMenuOpen(false);
    showSuccess('Logged out successfully');
    navigate('/');
  };
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 shadow-card">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-muted rounded-lg" />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-80 rounded-lg border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
              </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full" aria-label="User menu">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg" alt={user?.name || "User"} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                          {user?.name ? user.name.slice(0, 2).toUpperCase() : "JD"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 bg-card/90 backdrop-blur-md text-foreground" align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/" className="flex items-center w-full">
                        <User className="w-4 h-4 mr-2" />
                        Home
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

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto bg-gradient-subtle">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}