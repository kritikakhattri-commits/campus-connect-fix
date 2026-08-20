import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Check } from "lucide-react";
import { StudentShell } from "@/components/campus/StudentShell";
import { fetchIssues } from "@/lib/api";
import { reportedLabel } from "@/lib/campus";

export const Route = createFileRoute("/updates")({
  head: () => ({
    meta: [
      { title: "Campus Updates — Campus-Fix" },
      {
        name: "description",
        content: "Recently resolved campus issues and scheduled maintenance across the university.",
      },
      { property: "og:title", content: "Campus Updates — Campus-Fix" },
      {
        property: "og:description",
        content: "See what has been fixed on campus and what maintenance is planned next.",
      },
    ],
  }),
  component: Updates,
});

const SCHEDULED = [
  {
    title: "Electrical maintenance scheduled — Academic Block",
    meta: "Tomorrow · 2:00–3:00 PM · Electrical Department",
  },
  {
    title: "Network switch upgrade — Central Library",
    meta: "Saturday · 7:00–9:00 AM · IT Services",
  },
];

function Updates() {
  const { data: issues = [] } = useQuery({ queryKey: ["issues"], queryFn: fetchIssues });
  const resolved = issues.filter((i) => i.status === "resolved").slice(0, 8);

  return (
    <StudentShell>
      <h1 className="text-2xl font-semibold">Campus Updates</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        What has been fixed recently, and what&apos;s planned next.
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-semibold">Recently resolved</h2>
        <div className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {resolved.map((issue) => (
            <div key={issue.id} className="flex items-start gap-3 p-4">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-success-soft text-success">
                <Check className="size-3.5" />
              </span>
              <div>
                <p className="text-sm font-medium">{issue.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {reportedLabel(issue.resolved_at ?? issue.updated_at)} · {issue.department} ·{" "}
                  {issue.building}
                </p>
                {issue.public_update && (
                  <p className="mt-1.5 text-xs text-muted-foreground">{issue.public_update}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold">Scheduled maintenance</h2>
        <div className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {SCHEDULED.map((item) => (
            <div key={item.title} className="flex items-start gap-3 p-4">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-pending-soft text-pending">
                <AlertTriangle className="size-3.5" />
              </span>
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.meta}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </StudentShell>
  );
}
