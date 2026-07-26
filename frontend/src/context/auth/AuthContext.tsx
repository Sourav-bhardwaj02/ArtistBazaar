import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  secureStore,
  secureRetrieve,
  secureRemove,
  isTokenExpired,
  isTokenStructureValid,
  clearLoginFailures,
} from "@/lib/security";

// ─── Types ────────────────────────────────────────────────────────────────────
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

// ─── Storage keys ─────────────────────────────────────────────────────────────
const KEYS = {
  USER: "user-data",
  TOKEN: "auth-token",
  REFRESH: "refresh-token",
  ROLE: "auth-role",
  SELLER: "sellerId",
} as const;

function clearAllAuthStorage() {
  Object.values(KEYS).forEach((k) => secureRemove(k));
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL as string;

  // ── Restore session on mount ──────────────────────────────────────────────
  useEffect(() => {
    const storedUser = secureRetrieve(KEYS.USER);
    const authToken = secureRetrieve(KEYS.TOKEN);
    const refreshToken = secureRetrieve(KEYS.REFRESH);

    if (storedUser && authToken) {
      try {
        // Validate token structure before trusting it
        if (!isTokenStructureValid(authToken)) {
          throw new Error("Malformed token");
        }

        const parsed: User = JSON.parse(storedUser);

        // Validate parsed user has minimum required fields
        if (!parsed.id || !parsed.email || !parsed.role) {
          throw new Error("Incomplete user data");
        }

        setUser(parsed);

        // Proactively refresh if expired
        if (isTokenExpired(authToken) && refreshToken) {
          refreshAuthToken();
        }
      } catch {
        // Tampered or corrupt data — wipe everything
        clearAllAuthStorage();
        setUser(null);
      }
    }
    setLoading(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Refresh token ─────────────────────────────────────────────────────────
  const refreshAuthToken = async (): Promise<boolean> => {
    const refreshToken = secureRetrieve(KEYS.REFRESH);
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();

        // Validate the new token before storing
        if (
          !data.authToken ||
          !isTokenStructureValid(data.authToken)
        ) {
          logout();
          return false;
        }

        secureStore(KEYS.TOKEN, data.authToken);
        secureStore(KEYS.REFRESH, data.refreshToken);
        if (data.user) {
          secureStore(KEYS.USER, JSON.stringify(data.user));
          secureStore(KEYS.ROLE, data.user.role ?? "");
          setUser(data.user);
        }
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

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = (userData: User, authToken: string, refreshToken: string) => {
    // Validate token structure before accepting
    if (!isTokenStructureValid(authToken)) {
      console.warn("Refused to store malformed auth token");
      return;
    }

    setUser(userData);
    secureStore(KEYS.USER, JSON.stringify(userData));
    secureStore(KEYS.TOKEN, authToken);
    secureStore(KEYS.REFRESH, refreshToken);
    // ✅ Fix: store role so ProtectedRoute can read it
    secureStore(KEYS.ROLE, userData.role);

    // Reset any failed-login counters on successful auth
    clearLoginFailures();

    // Navigate based on role
    if (userData.role === "Seller") {
      secureStore(KEYS.SELLER, userData.id);
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

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    clearAllAuthStorage();
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

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};