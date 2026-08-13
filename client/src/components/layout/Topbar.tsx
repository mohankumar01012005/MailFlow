import { Menu } from "lucide-react";

interface TopbarProps {
  title: string;
  onMenuClick: () => void;
}

export function Topbar({ title, onMenuClick }: TopbarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface-0 px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        aria-label="Open navigation"
        className="rounded-md p-1.5 text-text-secondary hover:bg-surface-2 hover:text-text-primary md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      <h1 className="text-base font-semibold text-text-primary">{title}</h1>
    </header>
  );
}