import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Building2,
  LayoutGrid,
  ListChecks,
  MapPin,
  Search,
  Settings,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutGrid, exact: true },
  { to: "/admin/issues", label: "Issues", icon: ListChecks, exact: false },
  { to: "/admin/departments", label: "Departments", icon: Building2, exact: false },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3, exact: false },
  { to: "/admin/locations", label: "Locations", icon: MapPin, exact: false },
] as const;

export function AdminShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside className="border-b border-sidebar-border bg-sidebar lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:shrink-0 lg:border-r lg:border-b-0">
        <div className="flex h-14 items-center px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
              <LayoutGrid className="size-3.5" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">Campus-Fix</span>
          </Link>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible">
          {NAV.map(({ to, label, icon: Icon, exact }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact }}
              className="flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              activeProps={{ className: "bg-sidebar-accent text-primary font-medium" }}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden border-t border-sidebar-border p-3 lg:mt-auto lg:block">
          <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground">
            <Settings className="size-4" /> Settings
          </div>
          <div className="mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2">
            <span className="grid size-7 place-items-center rounded-full bg-primary-soft text-[11px] font-semibold text-primary">
              PS
            </span>
            <div className="leading-tight">
              <p className="text-xs font-medium">Priya Shah</p>
              <p className="text-[11px] text-muted-foreground">Campus Operations</p>
            </div>
          </div>
          <Link
            to="/"
            className="mt-2 block rounded-md border border-border px-3 py-1.5 text-center text-xs text-muted-foreground hover:border-primary/40 hover:text-primary"
          >
            Switch to student view
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <h1 className="text-lg font-semibold">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search"
                className="h-9 w-48 rounded-lg border border-border bg-card pl-8 pr-3 text-sm outline-none focus:border-primary/50"
              />
            </div>
            <button
              className="grid size-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="size-4" />
            </button>
            <span className="grid size-9 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
              PS
            </span>
          </div>
        </header>

        <div className="px-5 py-6 sm:px-8">{children}</div>
      </div>
    </div>
  );
}

export const AdminIcons = { Users };
