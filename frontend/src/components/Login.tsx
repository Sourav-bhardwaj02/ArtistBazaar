import { useState, ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import { useAlert } from "../context/alert/AlertContext";

interface Credentials {
  email: string;
  password: string;
  userType: "Admin" | "Seller" | "Services" | "Customer";
}

export default function Login() {
  const [credentials, setCredentials] = useState<Credentials>({
    email: "",
    password: "",
    userType: "Customer",
  });

  const [errorMsg, setErrorMsg] = useState("An unknown error occurred");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_URL as string;
  const navigate = useNavigate();

  const { showSuccess, showError, showInfo } = useAlert();

  const { email, password, userType } = credentials;

  const handleSubmit = async () => {
    setIsLoading(true);
    // All user types use the same login endpoint
    const endpoint = "/api/auth/login";

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();
      setErrorMsg(json.message);

      if (response.ok) {
        localStorage.setItem("auth-token", json.authToken);
        localStorage.setItem("refresh-token", json.refreshToken);
        localStorage.setItem("auth-role", userType);
        localStorage.setItem("user-data", JSON.stringify(json.user));
        showSuccess(`Welcome back, ${json.user?.name || 'User'}!`);
        setCredentials({ email: "", password: "", userType });

        // Navigate based on user role from backend response
        const userRole = json.user?.role || userType;
        if (userRole === "Admin") {
          navigate("/admin");
        } else if (userRole === "Seller") {
          navigate(`/seller/${json.user?.id}`);
        } else if (userRole === "Services") {
          navigate(`/services/${json.user?.id}`);
        } else {
          navigate(`/customer/${json.user?.id}`); // Customer
        }
      } else {
        showError(json.message);
      }
    } catch (error: any) {
      setErrorMsg(error.message);
      showError(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, you'd use Google OAuth
      // For now, we'll simulate it
      const mockGoogleUser = {
        email: "user@gmail.com",
        name: "Google User",
        avatar: "https://via.placeholder.com/150",
        googleId: "google123"
      };

      const response = await fetch(`${API_URL}/api/auth/google/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockGoogleUser),
      });

      const json = await response.json();
      if (response.ok) {
        localStorage.setItem("auth-token", json.authToken);
        localStorage.setItem("refresh-token", json.refreshToken);
        localStorage.setItem("auth-role", "Customer");
        localStorage.setItem("user-data", JSON.stringify(json.user));
        showSuccess("Google login successful!");
        navigate("/products");
      } else {
        showError(json.message);
      }
    } catch (error: any) {
      showError("Google login failed");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Google Login */}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* User Type */}
          <div className="space-y-2">
            <Label htmlFor="userType">Login as</Label>
            <select
              name="userType"
              value={userType}
              onChange={onChange}
              className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="Customer">Customer</option>
              <option value="Seller">Seller</option>
              <option value="Services">Services</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Enter your password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button
            type="button"
            className="w-full"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link
              to="/signup"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
