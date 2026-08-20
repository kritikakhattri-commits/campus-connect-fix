import { PRIORITY_META, STATUS_META, toneClasses } from "@/lib/campus";
import type { IssuePriority, IssueStatus } from "@/lib/campus";
import { cn } from "@/lib/utils";

export function StatusPill({ status, className }: { status: IssueStatus; className?: string }) {
  const meta = STATUS_META[status] ?? STATUS_META.reported;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        toneClasses(meta.tone),
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {meta.label}
    </span>
  );
}

export function PriorityPill({
  priority,
  className,
}: {
  priority: IssuePriority;
  className?: string;
}) {
  const meta = PRIORITY_META[priority] ?? PRIORITY_META.normal;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        toneClasses(meta.tone),
        className,
      )}
    >
      {priority === "safety" ? "Urgent" : meta.label}
    </span>
  );
}
