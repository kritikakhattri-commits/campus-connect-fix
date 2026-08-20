import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Building,
  Droplets,
  Fan,
  MonitorPlay,
  ParkingSquare,
  Search,
  Trash2,
  Wifi,
  Zap,
} from "lucide-react";
import { StudentShell } from "@/components/campus/StudentShell";
import { StatusPill } from "@/components/campus/Pills";
import { fetchIssues } from "@/lib/api";
import { locationLabel, reportedLabel, routeCategory } from "@/lib/campus";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Campus-Fix — Report. Route. Resolve." },
      {
        name: "description",
        content:
          "Report campus issues in seconds, watch them get routed to the right department, and track them until they are resolved.",
      },
      { property: "og:title", content: "Campus-Fix — Report. Route. Resolve." },
      {
        property: "og:description",
        content: "The transparent campus issue reporting and resolution platform for universities.",
      },
    ],
  }),
  component: StudentHome,
});

const QUICK = [
  { label: "Wi-Fi & Network", category: "Wi-Fi / Network", icon: Wifi },
  { label: "Electrical", category: "Electrical", icon: Zap },
  { label: "Water & Plumbing", category: "Plumbing", icon: Droplets },
  { label: "Cleanliness", category: "Cleanliness", icon: Trash2 },
  { label: "Classroom Equipment", category: "Classroom Equipment", icon: MonitorPlay },
  { label: "Parking", category: "Parking", icon: ParkingSquare },
  { label: "Infrastructure", category: "Infrastructure", icon: Building },
  { label: "Other", category: "Other", icon: Fan },
];

function StudentHome() {
  const { data: issues = [] } = useQuery({ queryKey: ["issues"], queryFn: fetchIssues });
  const mine = issues.filter((i) => i.submitted_by === "Aditya Verma").slice(0, 3);

  return (
    <StudentShell>
      <section className="panel px-6 py-8 sm:px-10 sm:py-10">
        <p className="label-eyebrow">Campus-Fix</p>
        <h1 className="mt-3 max-w-xl text-3xl font-semibold leading-tight sm:text-[2.1rem]">
          Something wrong on campus?
          <br />
          Let&apos;s get it fixed.
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          Report campus issues in seconds and track them until they&apos;re resolved.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link
            to="/report"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Report an Issue <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/my-issues"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 text-sm font-medium hover:border-primary/40 hover:text-primary"
          >
            <Search className="size-4" /> Track an Issue
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold">Quick report</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a category — we route it to the right department automatically.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {QUICK.map(({ label, category, icon: Icon }) => (
            <Link
              key={label}
              to="/report"
              search={{ category }}
              className="panel group flex flex-col gap-3 p-4 hover:border-primary/40"
            >
              <span className="grid size-9 place-items-center rounded-lg bg-primary-soft text-primary">
                <Icon className="size-4" />
              </span>
              <span className="text-sm font-medium leading-tight">{label}</span>
              <span className="text-[11px] text-muted-foreground">{routeCategory(category)}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Your recent reports</h2>
          <Link to="/my-issues" className="text-xs text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {mine.map((issue) => (
            <Link
              key={issue.id}
              to="/issue/$issueId"
              params={{ issueId: issue.issue_id }}
              className="panel flex flex-col gap-3 p-4 hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{issue.title}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {locationLabel(issue)} · {issue.department} · {reportedLabel(issue.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-muted-foreground">
                  #{issue.issue_id}
                </span>
                <StatusPill status={issue.status} />
              </div>
            </Link>
          ))}
          {mine.length === 0 && (
            <div className="panel p-6 text-sm text-muted-foreground">
              You haven&apos;t reported anything yet.
            </div>
          )}
        </div>
      </section>
    </StudentShell>
  );
}
