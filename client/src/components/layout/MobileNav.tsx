import { NavLink } from "react-router-dom";
import { LayoutDashboard, Send, PlusCircle, BarChart3, Settings, Mail, X } from "lucide-react";
import { cn } from "../../lib/utils";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/campaigns", label: "Campaigns", icon: Send },
  { to: "/campaigns/new", label: "Create Campaign", icon: PlusCircle },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      <div
        className="fixed inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
      <nav
        aria-label="Primary"
        className="relative flex w-64 flex-col bg-surface-1 shadow-xl"
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-accent" aria-hidden="true" />
            <span className="text-sm font-semibold tracking-tight">MailFlow</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-md p-1.5 text-text-tertiary hover:bg-surface-2 hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-1 p-3">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent-muted text-text-primary"
                    : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}