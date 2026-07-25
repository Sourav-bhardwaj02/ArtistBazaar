import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactElement;
  roles?: Array<"Admin" | "Seller" | "Services" | "Customer">;
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
  const role = typeof window !== 'undefined' ? localStorage.getItem('auth-role') as any : undefined;

  if (!token) return <Navigate to="/login" replace />;
  if (roles && role && !roles.includes(role)) return <Navigate to="/login" replace />;
  return children;
}


