import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

// Types
export type Role = "Admin" | "Seller" | "Customer" | "Services";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User, authToken: string, refreshToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  refreshAuthToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const API_URL = import.meta.env.VITE_API_URL as string;
  
  // Restore from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user-data");
    const authToken = localStorage.getItem("auth-token");
    const refreshToken = localStorage.getItem("refresh-token");
    
    if (storedUser && authToken) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        
        // Check if token is expired and try to refresh
        const tokenPayload = JSON.parse(atob(authToken.split('.')[1]));
        const isExpired = tokenPayload.exp * 1000 < Date.now();
        
        if (isExpired && refreshToken) {
          refreshAuthToken();
        }
      } catch {
        localStorage.removeItem("user-data");
        localStorage.removeItem("auth-token");
        localStorage.removeItem("refresh-token");
      }
    }
    setLoading(false);
  }, []);

  const refreshAuthToken = async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem("refresh-token");
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("auth-token", data.authToken);
        localStorage.setItem("refresh-token", data.refreshToken);
        localStorage.setItem("user-data", JSON.stringify(data.user));
        setUser(data.user);
        return true;
      } else {
        logout();
        return false;
      }
    } catch {
      logout();
      return false;
    }
  };

  const login = (userData: User, authToken: string, refreshToken: string) => {
    setUser(userData);
    localStorage.setItem("user-data", JSON.stringify(userData));
    localStorage.setItem("auth-token", authToken);
    localStorage.setItem("refresh-token", refreshToken);
    
    // Navigate based on role
    if (userData.role === "Seller") {
      localStorage.setItem("sellerId", userData.id);
      navigate(`/seller/${userData.id}`);
    } else if (userData.role === "Customer") {
      navigate(`/customer/${userData.id}`);
    } else if (userData.role === "Admin") {
      navigate(`/admin`);
    } else if (userData.role === "Services") {
      navigate(`/services/${userData.id}`);
    } else {
      navigate(`/`);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user-data");
    localStorage.removeItem("auth-token");
    localStorage.removeItem("refresh-token");
    localStorage.removeItem("sellerId");
    navigate("/login");
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    refreshAuthToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};