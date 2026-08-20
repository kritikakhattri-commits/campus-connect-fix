import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Check, Circle, Dot, MessageSquare } from "lucide-react";
import { StudentShell } from "@/components/campus/StudentShell";
import { PriorityPill, StatusPill } from "@/components/campus/Pills";
import { fetchActivity, fetchIssue } from "@/lib/api";
import { clockTime, locationLabel, reportedLabel, STATUS_META, STATUS_ORDER } from "@/lib/campus";

export const Route = createFileRoute("/issue/$issueId")({
  head: ({ params }) => ({
    meta: [
      { title: `Tracking #${params.issueId} — Campus-Fix` },
      {
        name: "description",
        content: `Live progress for campus issue #${params.issueId}: routing, acknowledgement, assignment and resolution.`,
      },
      { property: "og:title", content: `Tracking #${params.issueId} — Campus-Fix` },
      {
        property: "og:description",
        content: "Follow a campus issue from report to resolution with a transparent timeline.",
      },
    ],
  }),
  component: TrackIssue,
});

function TrackIssue() {
  const { issueId } = Route.useParams();
  const { data: issue, isLoading } = useQuery({
    queryKey: ["issue", issueId],
    queryFn: () => fetchIssue(issueId),
  });
  const { data: activity = [] } = useQuery({
    queryKey: ["activity", issue?.id],
    queryFn: () => fetchActivity(issue!.id),
    enabled: !!issue,
  });

  if (isLoading) {
    return (
      <StudentShell>
        <p className="text-sm text-muted-foreground">Loading issue…</p>
      </StudentShell>
    );
  }

  if (!issue) {
    return (
      <StudentShell>
        <p className="text-sm text-muted-foreground">
          We couldn&apos;t find that issue.{" "}
          <Link to="/my-issues" className="text-primary hover:underline">
            Back to My Issues
          </Link>
        </p>
      </StudentShell>
    );
  }

  const currentIndex = STATUS_ORDER.indexOf(issue.status);
  const steps = STATUS_ORDER.filter((s) => s !== "assigned" || currentIndex >= 3);

  return (
    <StudentShell>
      <Link
        to="/my-issues"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> My Issues
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{issue.title}</h1>
          <p className="mt-1 font-mono text-xs text-muted-foreground">#{issue.issue_id}</p>
        </div>
        <StatusPill status={issue.status} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          {issue.image_url && (
            <img
              src={issue.image_url}
              alt={issue.title}
              className="w-full rounded-xl border border-border object-cover"
            />
          )}

          <div className="panel p-5">
            <h2 className="text-sm font-semibold">Progress</h2>
            <ol className="mt-4 space-y-0">
              {steps.map((step, idx) => {
                const stepIndex = STATUS_ORDER.indexOf(step);
                const done = stepIndex < currentIndex;
                const active = stepIndex === currentIndex;
                const entry = activity.find((a) => a.new_status === step);
                return (
                  <li key={step} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={
                          done
                            ? "grid size-6 place-items-center rounded-full bg-success-soft text-success"
                            : active
                              ? "grid size-6 place-items-center rounded-full bg-pending-soft text-pending"
                              : "grid size-6 place-items-center rounded-full border border-border text-muted-foreground"
                        }
                      >
                        {done ? (
                          <Check className="size-3" />
                        ) : active ? (
                          <Dot className="size-5" />
                        ) : (
                          <Circle className="size-2.5" />
                        )}
                      </span>
                      {idx < steps.length - 1 && <span className="w-px flex-1 bg-border" />}
                    </div>
                    <div className="pb-6">
                      <p
                        className={
                          done || active ? "text-sm font-medium" : "text-sm text-muted-foreground"
                        }
                      >
                        {STATUS_META[step].label}
                      </p>
                      {entry && (
                        <>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {clockTime(entry.created_at)}
                          </p>
                          {entry.message && (
                            <p className="mt-1 text-xs text-muted-foreground">{entry.message}</p>
                          )}
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {issue.public_update && (
            <div className="rounded-xl border border-border bg-primary-soft/60 p-5">
              <p className="flex items-center gap-2 text-xs font-semibold text-primary">
                <MessageSquare className="size-3.5" /> Update from {issue.department}
              </p>
              <p className="mt-2 text-sm">{issue.public_update}</p>
            </div>
          )}
        </div>

        <aside className="panel h-fit p-5">
          <h2 className="text-sm font-semibold">Issue details</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="Location" value={locationLabel(issue)} />
            <Row label="Category" value={issue.category} />
            <Row
              label="Priority"
              value={<PriorityPill priority={issue.priority} />}
            />
            <Row label="Reported" value={reportedLabel(issue.created_at)} />
            <Row label="Department" value={issue.department} />
            {issue.assigned_staff && <Row label="Technician" value={issue.assigned_staff} />}
          </dl>
          <p className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">
            {issue.description}
          </p>
        </aside>
      </div>
    </StudentShell>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-right text-xs font-medium">{value}</dd>
    </div>
  );
}
