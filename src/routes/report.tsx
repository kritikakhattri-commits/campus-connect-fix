import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, Camera, Check, Circle, ImagePlus, MapPin, Sparkles } from "lucide-react";
import { StudentShell } from "@/components/campus/StudentShell";
import { createIssue } from "@/lib/api";
import { BUILDINGS, CATEGORIES, FLOORS, PRIORITY_META, routeCategory } from "@/lib/campus";
import type { Issue, IssuePriority } from "@/lib/campus";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/report")({
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search["category"] === "string" ? (search["category"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Report an issue — Campus-Fix" },
      {
        name: "description",
        content:
          "Tell us what's wrong on campus. Campus-Fix routes your report to the right department automatically.",
      },
      { property: "og:title", content: "Report an issue — Campus-Fix" },
      {
        property: "og:description",
        content: "Report a campus problem in seconds and track it until it is resolved.",
      },
    ],
  }),
  component: ReportPage,
});

const inputCls =
  "h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary/50";

function ReportPage() {
  const { category: preset } = Route.useSearch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [category, setCategory] = useState<string>(preset ?? "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [landmark, setLandmark] = useState("");
  const [priority, setPriority] = useState<IssuePriority>("normal");
  const [image, setImage] = useState<string | null>(null);
  const [created, setCreated] = useState<Issue | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      createIssue({
        title: title || `${category} issue at ${building || "campus"}`,
        description,
        category,
        priority,
        building,
        floor,
        landmark,
        image_url: image,
        submitted_by: "Aditya Verma",
      }),
    onSuccess: (issue) => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      setCreated(issue);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  });

  if (created) return <SuccessState issue={created} />;

  const department = category ? routeCategory(category) : null;
  const ready = category && building && description.trim().length > 4;

  return (
    <StudentShell>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold">Report an issue</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Tell us what&apos;s wrong. We&apos;ll make sure it reaches the right team.
        </p>

        <form
          className="mt-8 space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            if (ready) mutation.mutate();
          }}
        >
          <Section label="Add a photo" hint="Optional, but it helps the team act faster.">
            <label
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-input bg-card px-4 py-8 text-center hover:border-primary/50",
                image && "border-solid p-3",
              )}
            >
              {image ? (
                <img
                  src={image}
                  alt="Issue preview"
                  className="max-h-56 w-full rounded-lg object-cover"
                />
              ) : (
                <>
                  <span className="grid size-10 place-items-center rounded-full bg-muted text-muted-foreground">
                    <ImagePlus className="size-4" />
                  </span>
                  <span className="text-sm font-medium">Upload a photo of the issue</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Camera className="size-3.5" /> Take a photo or choose from your device
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => setImage(String(reader.result));
                  reader.readAsDataURL(file);
                }}
              />
            </label>
          </Section>

          <Section label="Where is it?">
            <div className="grid gap-3 sm:grid-cols-2">
              <select
                className={inputCls}
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
              >
                <option value="">Campus building</option>
                {BUILDINGS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
              <select className={inputCls} value={floor} onChange={(e) => setFloor(e.target.value)}>
                <option value="">Floor</option>
                {FLOORS.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
            <input
              className={cn(inputCls, "mt-3")}
              placeholder="Room number or nearby landmark"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
            />
            <button
              type="button"
              onClick={() => {
                setBuilding("Central Library");
                setFloor("Floor 2");
                setLandmark("Reading Hall");
              }}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              <MapPin className="size-3.5" /> Use my current location
            </button>
          </Section>

          <Section label="What's the problem?">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={cn(
                    "rounded-lg border border-border bg-card px-3 py-2.5 text-left text-xs font-medium hover:border-primary/40",
                    category === c && "border-primary bg-primary-soft text-primary",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            {department && (
              <p className="mt-3 inline-flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 text-xs text-muted-foreground">
                <Sparkles className="size-3.5 text-primary" />
                Automatically routed to:{" "}
                <span className="font-medium text-foreground">{department}</span>
              </p>
            )}
          </Section>

          <Section label="Describe the issue">
            <input
              className={inputCls}
              placeholder="Short title, e.g. Water leaking near Room 204"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="mt-3 min-h-28 w-full rounded-lg border border-border bg-card p-3 text-sm outline-none focus:border-primary/50"
              placeholder="e.g. The ceiling near Room 204 is leaking and water is collecting on the floor."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Section>

          <Section label="Priority" hint="Choose honestly so urgent safety issues stay visible.">
            <div className="space-y-2">
              {(Object.keys(PRIORITY_META) as IssuePriority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg border border-border bg-card p-3 text-left hover:border-primary/40",
                    priority === p && "border-primary bg-primary-soft",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border",
                      priority === p ? "border-primary bg-primary" : "border-input",
                    )}
                  >
                    {priority === p && <Check className="size-2.5 text-primary-foreground" />}
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{PRIORITY_META[p].label}</span>
                    <span className="block text-xs text-muted-foreground">
                      {PRIORITY_META[p].hint}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </Section>

          <div>
            <button
              type="submit"
              disabled={!ready || mutation.isPending}
              className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-40 sm:w-auto"
            >
              {mutation.isPending ? "Submitting…" : "Submit Report"}
            </button>
            <p className="mt-2 text-xs text-muted-foreground">
              Your report will automatically be routed to the relevant campus department.
            </p>
            {mutation.isError && (
              <p className="mt-2 text-xs text-urgent">
                Something went wrong. Please try submitting again.
              </p>
            )}
          </div>
        </form>
      </div>
    </StudentShell>
  );
}

function Section({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-sm font-semibold">{label}</h2>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function SuccessState({ issue }: { issue: Issue }) {
  const navigate = useNavigate();
  return (
    <StudentShell>
      <div className="mx-auto max-w-lg py-6">
        <div className="panel p-8 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-success-soft text-success">
            <Check className="size-5" />
          </span>
          <h1 className="mt-4 text-xl font-semibold">Issue reported</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your report has been received and routed to the {issue.department}.
          </p>
          <p className="mt-4 inline-block rounded-lg border border-border bg-muted px-3 py-1.5 font-mono text-sm">
            #{issue.issue_id}
          </p>

          <ul className="mt-6 space-y-3 text-left">
            <Step done label="Reported" />
            <Step done label={`Routed to ${issue.department}`} />
            <Step label="Awaiting acknowledgement" />
          </ul>

          <div className="mt-7 flex flex-col gap-2 sm:flex-row">
            <Link
              to="/issue/$issueId"
              params={{ issueId: issue.issue_id }}
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Track this issue <ArrowRight className="size-4" />
            </Link>
            <button
              onClick={() => navigate({ to: "/report", search: {}, reloadDocument: true })}
              className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-border bg-card px-5 text-sm font-medium hover:border-primary/40 hover:text-primary"
            >
              Report another issue
            </button>
          </div>
        </div>
      </div>
    </StudentShell>
  );
}

function Step({ label, done }: { label: string; done?: boolean }) {
  return (
    <li className="flex items-center gap-3 text-sm">
      {done ? (
        <span className="grid size-5 place-items-center rounded-full bg-success-soft text-success">
          <Check className="size-3" />
        </span>
      ) : (
        <span className="grid size-5 place-items-center text-muted-foreground">
          <Circle className="size-3" />
        </span>
      )}
      <span className={done ? "font-medium" : "text-muted-foreground"}>{label}</span>
    </li>
  );
}
