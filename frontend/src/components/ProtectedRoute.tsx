import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/auth/AuthContext";
import { secureRetrieve, isTokenExpired, isTokenStructureValid } from "@/lib/security";

interface ProtectedRouteProps {
  children: React.ReactElement;
  roles?: Array<"Admin" | "Seller" | "Services" | "Customer">;
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();

  // Wait for AuthContext to finish restoring session
  if (loading) return null;

  // ── 1. Must be authenticated ──────────────────────────────────────────────
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // ── 2. Validate token integrity from secure storage ───────────────────────
  const token = secureRetrieve("auth-token");
  if (!token || !isTokenStructureValid(token)) {
    return <Navigate to="/login" replace />;
  }

  // ── 3. Reject expired tokens (refresh is handled in AuthContext) ──────────
  if (isTokenExpired(token)) {
    return <Navigate to="/login" replace />;
  }

  // ── 4. Role-based access control using the live AuthContext user ──────────
  if (roles && user && !roles.includes(user.role)) {
    // Redirect to the correct dashboard instead of login
    const rolePaths: Record<string, string> = {
      Seller: `/seller/${user.id}`,
      Customer: `/customer/${user.id}`,
      Admin: "/admin",
      Services: `/services/${user.id}`,
    };
    const redirect = rolePaths[user.role] ?? "/";
    return <Navigate to={redirect} replace />;
  }

  return children;
}
