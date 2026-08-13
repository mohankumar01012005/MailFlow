import { NavLink } from "react-router-dom";
import { LayoutDashboard, Send, PlusCircle, BarChart3, Settings, Mail } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/campaigns", label: "Campaigns", icon: Send },
  { to: "/campaigns/new", label: "Create Campaign", icon: PlusCircle },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col border-r border-border bg-surface-1 transition-all duration-200 md:flex",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <Mail className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
        {!collapsed && <span className="text-sm font-semibold tracking-tight">MailFlow</span>}
      </div>

      <nav className="flex-1 space-y-1 p-3" aria-label="Primary">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent-muted text-text-primary"
                  : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex w-full items-center justify-center rounded-md py-2 text-xs font-medium text-text-tertiary transition-colors hover:bg-surface-2 hover:text-text-secondary"
        >
          {collapsed ? "»" : "Collapse"}
        </button>
      </div>
    </aside>
  );
}