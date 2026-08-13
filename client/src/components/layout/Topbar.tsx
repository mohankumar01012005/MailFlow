import { Link, useNavigate } from "react-router-dom";
import { Menu, LogOut, LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface TopbarProps {
  title: string;
  onMenuClick: () => void;
}

export function Topbar({ title, onMenuClick }: TopbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface-0 px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-md p-1.5 text-text-secondary hover:bg-surface-2 hover:text-text-primary md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-base font-semibold text-text-primary">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-border bg-surface-1 px-3 py-1 text-xs text-text-primary">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white uppercase">
                {user.name ? user.name[0] : "U"}
              </div>
              <span className="font-medium hidden sm:inline">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              title="Log out"
              className="flex items-center gap-1.5 rounded-md border border-border bg-surface-1 px-2.5 py-1 text-xs font-medium text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-2 hover:text-text-primary"
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign in
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-hover"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}