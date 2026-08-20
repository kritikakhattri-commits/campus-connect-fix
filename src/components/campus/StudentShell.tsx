import { Link } from "@tanstack/react-router";
import { LayoutGrid, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/my-issues", label: "My Issues" },
  { to: "/updates", label: "Campus Updates" },
] as const;

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
        <LayoutGrid className="size-3.5" />
      </span>
      <span className="text-[15px] font-semibold tracking-tight">Campus-Fix</span>
    </span>
  );
}

export function StudentShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
          <Link to="/" className="shrink-0">
            <Wordmark />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                activeProps={{ className: "bg-muted text-foreground font-medium" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/admin"
              className="hidden rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:text-primary sm:inline-flex"
            >
              Admin view
            </Link>
            <span className="grid size-8 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
              AV
            </span>
            <button
              onClick={() => setOpen((v) => !v)}
              className="grid size-8 place-items-center rounded-md border border-border md:hidden"
              aria-label="Toggle navigation"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="border-t border-border bg-background px-4 py-2 md:hidden">
            {[...NAV, { to: "/admin", label: "Admin view" } as const].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                activeProps={{ className: "bg-muted text-foreground font-medium" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6">{children}</main>

      <footer className="border-t border-border py-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>Campus-Fix — Report. Route. Resolve.</span>
          <span>Serving 20,000+ students across campus</span>
        </div>
      </footer>
    </div>
  );
}
