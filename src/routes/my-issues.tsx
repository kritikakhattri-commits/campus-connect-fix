import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search } from "lucide-react";
import { StudentShell } from "@/components/campus/StudentShell";
import { PriorityPill, StatusPill } from "@/components/campus/Pills";
import { fetchIssues } from "@/lib/api";
import { locationLabel, OPEN_STATUSES, reportedLabel } from "@/lib/campus";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/my-issues")({
  head: () => ({
    meta: [
      { title: "My Issues — Campus-Fix" },
      { name: "description", content: "Everything you've reported on campus, in one place." },
      { property: "og:title", content: "My Issues — Campus-Fix" },
      {
        property: "og:description",
        content: "Track every campus issue you reported, from acknowledgement to resolution.",
      },
    ],
  }),
  component: MyIssues,
});

const FILTERS = ["All", "Open", "In Progress", "Resolved"] as const;

function MyIssues() {
  const { data: issues = [], isLoading } = useQuery({ queryKey: ["issues"], queryFn: fetchIssues });
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [q, setQ] = useState("");

  const mine = issues.filter((i) => i.submitted_by === "Aditya Verma");
  const filtered = mine.filter((issue) => {
    const matchesFilter =
      filter === "All" ||
      (filter === "Open" && OPEN_STATUSES.includes(issue.status)) ||
      (filter === "In Progress" && issue.status === "in_progress") ||
      (filter === "Resolved" && issue.status === "resolved");
    const text = `${issue.title} ${issue.issue_id} ${issue.department} ${locationLabel(issue)}`;
    return matchesFilter && text.toLowerCase().includes(q.toLowerCase());
  });

  return (
    <StudentShell>
      <h1 className="text-2xl font-semibold">My Issues</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Everything you&apos;ve reported, in one place.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground",
                filter === f && "bg-primary-soft text-primary",
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search your reports..."
            className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-primary/50"
          />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {filtered.map((issue) => (
          <Link
            key={issue.id}
            to="/issue/$issueId"
            params={{ issueId: issue.issue_id }}
            className="panel block p-4 hover:border-primary/40"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] text-muted-foreground">#{issue.issue_id}</span>
              <PriorityPill priority={issue.priority} />
              <StatusPill status={issue.status} className="ml-auto" />
            </div>
            <p className="mt-2 text-sm font-medium">{issue.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {locationLabel(issue)} · {issue.department} · {reportedLabel(issue.created_at)}
            </p>
          </Link>
        ))}
        {!isLoading && filtered.length === 0 && (
          <div className="panel p-8 text-center text-sm text-muted-foreground">
            No reports match this view.
          </div>
        )}
      </div>
    </StudentShell>
  );
}
