import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { authApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const userStr = searchParams.get("user");
    const err = searchParams.get("error");

    if (err) {
      setError(decodeURIComponent(err));
    }

    if (token && userStr) {
      try {
        const userObj = JSON.parse(decodeURIComponent(userStr));
        login(token, userObj);
        navigate("/", { replace: true });
      } catch {
        setError("Failed to parse Google login response.");
      }
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;

    setError(null);
    setIsLoading(true);

    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.token) {
        login(res.token, res.user);
        navigate("/");
      }
    } catch (err: any) {
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-base px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-border bg-surface-1 p-8 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-surface-2 border border-border">
            <Mail className="h-6 w-6 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Welcome back to MailFlow</h1>
          <p className="text-sm text-text-secondary">Sign in to your campaign orchestration control center</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-md border border-status-failed/40 bg-status-failed/10 px-4 py-3 text-sm text-status-failed">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Google OAuth Option */}
        <div>
          <a
            href={`${apiBaseUrl}/api/auth/google`}
            className="flex w-full items-center justify-center gap-3 rounded-md border border-border bg-surface-2 py-2.5 px-4 text-sm font-medium text-text-primary transition-colors hover:bg-surface-3 hover:text-text-primary"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </a>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-border" />
          <span className="absolute bg-surface-1 px-3 text-xs uppercase tracking-wider text-text-tertiary">
            or email
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-text-tertiary">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
              <input
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-border bg-surface-2 py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-border-strong focus:outline-none focus:ring-1 focus:ring-border-strong"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-text-tertiary">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
              <input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-md border border-border bg-surface-2 py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-border-strong focus:outline-none focus:ring-1 focus:ring-border-strong"
              />
            </div>
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full justify-center">
            Sign In
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="border-t border-border pt-4 text-center text-xs text-text-secondary">
          Don't have an account?{" "}
          <Link to="/signup" className="font-semibold text-text-primary hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
