import { useState, ChangeEvent, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, ArrowLeft, ShieldAlert, Clock } from "lucide-react";
import { useAlert } from "../context/alert/AlertContext";
import { useAuth } from "../context/auth/AuthContext";
import { apiClient } from "../lib/api";
import {
  sanitizeEmail,
  isLoginLocked,
  recordLoginFailure,
  clearLoginFailures,
} from "@/lib/security";

interface Credentials {
  email: string;
  password: string;
  userType: "Admin" | "Seller" | "Services" | "Customer";
}

// ─── Error classifier ──────────────────────────────────────────────────────
function classifyLoginError(error: unknown, statusCode?: number): string {
  if (statusCode === 401) return "Invalid email or password. Please try again.";
  if (statusCode === 403) return "Your account has been suspended. Contact support.";
  if (statusCode === 404) return "No account found with this email address.";
  if (statusCode === 422) return "Invalid credentials format. Please check your input.";
  if (statusCode === 429) return "Too many login attempts. Please try again later.";
  if (statusCode && statusCode >= 500)
    return "Server error. Please try again in a few moments.";

  if (error instanceof TypeError && error.message.includes("fetch"))
    return "Network error — please check your internet connection.";

  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("network") || msg.includes("failed to fetch"))
      return "Network error — please check your internet connection.";
    if (msg.includes("timeout")) return "Request timed out. Please try again.";
    if (msg.includes("invalid") || msg.includes("incorrect"))
      return "Invalid email or password.";
    if (msg.includes("suspended") || msg.includes("banned"))
      return "Your account has been suspended. Contact support.";
  }

  return "Something went wrong. Please try again.";
}

export default function Login() {
  const [credentials, setCredentials] = useState<Credentials>({
    email: "",
    password: "",
    userType: "Customer",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const { showSuccess, showError } = useAlert();
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // ── Redirect if already logged in ──────────────────────────────────────
  useEffect(() => {
    if (isAuthenticated && user) {
      const paths: Record<string, string> = {
        Seller: `/seller/${user.id}`,
        Customer: `/customer/${user.id}`,
        Admin: "/admin",
        Services: `/services/${user.id}`,
      };
      navigate(paths[user.role] ?? "/", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // ── Lockout countdown timer ─────────────────────────────────────────────
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((s) => {
        if (s <= 1) {
          clearInterval(timer);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  // ── Check lockout on mount ─────────────────────────────────────────────
  useEffect(() => {
    const { locked, remainingSeconds } = isLoginLocked();
    if (locked) setLockoutSeconds(remainingSeconds);
  }, []);

  const formatLockout = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  // ── Submit handler ─────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    // Check client-side lockout
    const lockState = isLoginLocked();
    if (lockState.locked) {
      showError(
        `Too many failed attempts. Try again in ${formatLockout(lockState.remainingSeconds)}.`
      );
      setLockoutSeconds(lockState.remainingSeconds);
      return;
    }

    const { email, password, userType } = credentials;

    // ── Input validation ─────────────────────────────────────────────────
    const cleanEmail = sanitizeEmail(email);
    if (!cleanEmail) {
      showError("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      showError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      showError("Please enter your password.");
      return;
    }
    if (password.length < 6) {
      showError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await apiClient.login({
        email: cleanEmail,
        password,
        role: userType,
      });

      // ── Success path ───────────────────────────────────────────────────
      if (result.data) {
        const { user: apiUser, authToken, refreshToken } = result.data;

        if (!authToken || !refreshToken) {
          showError("Authentication response was incomplete. Please try again.");
          return;
        }

        const userData = {
          id: apiUser?.id || apiUser?._id || "",
          name: apiUser?.name || "User",
          email: apiUser?.email || cleanEmail,
          role: apiUser?.role || userType,
          avatar: apiUser?.avatar,
        };

        if (!userData.id) {
          showError("Login succeeded but user data is missing. Please try again.");
          return;
        }

        clearLoginFailures();
        login(userData as any, authToken, refreshToken);
        showSuccess(`Welcome back, ${userData.name}!`);
        setCredentials({ email: "", password: "", userType: "Customer" });
        return;
      }

      // ── Error path from API ────────────────────────────────────────────
      const { locked: nowLocked, attemptsLeft } = recordLoginFailure();
      if (nowLocked) {
        const { remainingSeconds } = isLoginLocked();
        setLockoutSeconds(remainingSeconds);
        showError(
          `Account locked for ${formatLockout(remainingSeconds)} after too many failed attempts.`
        );
      } else {
        const friendlyError = result.error || "Login failed.";
        const suffix =
          attemptsLeft > 0
            ? ` (${attemptsLeft} attempt${attemptsLeft !== 1 ? "s" : ""} remaining before lockout)`
            : "";
        showError(friendlyError + suffix);
      }
    } catch (error: unknown) {
      // ── Network / unexpected error ─────────────────────────────────────
      const message = classifyLoginError(error);
      showError(message);

      // Only count as a "failed login" for non-network errors
      const isNetworkError =
        error instanceof TypeError && error.message.includes("fetch");
      if (!isNetworkError) {
        const { locked: nowLocked, attemptsLeft } = recordLoginFailure();
        if (nowLocked) {
          const { remainingSeconds } = isLoginLocked();
          setLockoutSeconds(remainingSeconds);
        } else if (attemptsLeft > 0) {
          showError(
            `${message} (${attemptsLeft} attempt${attemptsLeft !== 1 ? "s" : ""} remaining)`
          );
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [credentials, login, showError, showSuccess]);

  // ── Keyboard submit ────────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading && lockoutSeconds === 0) {
      handleSubmit();
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const isLocked = lockoutSeconds > 0;

  return (
    <div>
      <div className="container mx-auto p-4">
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6" onKeyDown={handleKeyDown}>

            {/* ── Lockout Banner ─────────────────────────────────────────── */}
            {isLocked && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <ShieldAlert className="w-5 h-5 mt-0.5 shrink-0 text-red-500" />
                <div>
                  <p className="font-semibold">Account temporarily locked</p>
                  <p className="flex items-center gap-1 mt-1 text-red-600">
                    <Clock className="w-3.5 h-3.5" />
                    Try again in{" "}
                    <span className="font-mono font-bold">
                      {formatLockout(lockoutSeconds)}
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* ── User Role ──────────────────────────────────────────────── */}
            <div className="space-y-2">
              <Label htmlFor="userType">Login as</Label>
              <select
                id="userType"
                name="userType"
                value={credentials.userType}
                onChange={onChange}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                disabled={isLoading || isLocked}
              >
                <option value="Customer">Customer</option>
                <option value="Seller">Seller</option>
                <option value="Services">Services</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {/* ── Email ─────────────────────────────────────────────────── */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={credentials.email}
                onChange={onChange}
                placeholder="Enter your email"
                autoComplete="email"
                required
                disabled={isLoading || isLocked}
              />
            </div>

            {/* ── Password ──────────────────────────────────────────────── */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={credentials.password}
                  onChange={onChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  disabled={isLoading || isLocked}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* ── Submit ────────────────────────────────────────────────── */}
            <Button
              type="button"
              id="login-submit-btn"
              className="w-full"
              onClick={handleSubmit}
              disabled={isLoading || isLocked}
            >
              {isLoading
                ? "Signing in…"
                : isLocked
                ? `Locked (${formatLockout(lockoutSeconds)})`
                : "Sign In"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}