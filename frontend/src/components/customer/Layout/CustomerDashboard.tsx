import { useAuth } from "@/context/auth/AuthContext";
import SellerDashboard from "../../seller/SellerDashboard";
import CustomerDashboard from "../CustomerDashboard";
import Login from "../../Login";
import  { Link } from "react-router-dom";
export default function Dashboard() {
  const { user } = useAuth();

  // Render different dashboards based on user role
  if (user?.role === "Customer") {
    return <CustomerDashboard />;
  } else {
  // Navigate to login OR show access denied
  return <Link to="/login" replace />;
  // OR
  // return <Login />;
}

  // Default fallback
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-muted-foreground">Welcome to ArtistBazaar</h2>
        <p className="text-muted-foreground mt-2">Please log in to access your dashboard.</p>
      </div>
    </div>
  );
}