import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CircleDot,
  ClipboardList,
  Droplets,
  Fan,
  GitBranch,
  ImagePlus,
  Lightbulb,
  MapPin,
  ParkingCircle,
  ParkingSquare,
  RadioTower,
  Route as RouteIcon,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wifi,
  Wrench,
} from "lucide-react";
import { StudentShell } from "@/components/campus/StudentShell";
import { fetchIssues } from "@/lib/api";
import { reportedLabel } from "@/lib/campus";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Campus-Fix — Report. Route. Resolve." },
      {
        name: "description",
        content:
          "A transparent campus operating layer for reporting, routing, resolving, and tracking everyday university issues.",
      },
      { property: "og:title", content: "Campus-Fix — Report. Route. Resolve." },
      {
        property: "og:description",
        content:
          "Students report campus issues in seconds while the right department receives, acknowledges, and resolves them.",
      },
    ],
  }),
  component: StudentHome,
});

const pulseFallback = [
  ["Library Wi-Fi", "Resolved", "8 min ago"],
  ["Block B Leakage", "In Progress", "14 min ago"],
  ["Room 304 Fan", "Assigned", "22 min ago"],
];

const signals = [
  ["Wi-Fi", Wifi],
  ["Leakage", Droplets],
  ["Fan", Fan],
  ["Clean", Sparkles],
  ["Parking", ParkingCircle],
  ["Projector", Lightbulb],
] as const;

const workflow = ["REPORT", "ROUTE", "ACKNOWLEDGE", "RESOLVE", "TRACK"] as const;

function StudentHome() {
  const { data: issues = [] } = useQuery({ queryKey: ["issues"], queryFn: fetchIssues });
  const pulse =
    issues.length > 0
      ? issues
          .slice(0, 3)
          .map((issue) => [
            `${issue.category.replace(" / Network", "")} · ${issue.building}`,
            issue.status.replace("_", " "),
            reportedLabel(issue.updated_at),
          ])
      : pulseFallback;

  return (
    <StudentShell>
      <section className="mx-auto w-[calc(100%-28px)] max-w-[1500px] overflow-hidden rounded-[2rem] bg-surface px-5 pb-5 pt-8 sm:w-[calc(100%-64px)] sm:px-8 sm:pb-8 lg:min-h-[calc(100vh-8.25rem)] lg:rounded-[2.25rem] lg:px-12 lg:pb-9 lg:pt-10">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
          <div>
            <p className="label-eyebrow">Campus operating layer</p>
            <h1 className="mt-4 max-w-5xl text-[3.05rem] font-medium leading-[0.97] text-foreground sm:text-[4.2rem] lg:text-[4.85rem] xl:text-[5.25rem]">
              See it.{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Report it.</span>
                <svg
                  className="pointer-events-none absolute -bottom-3 left-[-3%] z-0 h-4 w-[106%] text-accent sm:-bottom-4 sm:h-5"
                  viewBox="0 0 420 44"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    className="scribble-path"
                    d="M8 26C70 8 118 30 176 18C234 6 285 11 336 24C365 31 391 29 413 20"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              Campus-Fix it.
            </h1>
          </div>

          <div className="lg:pt-8">
            <div className="flex gap-2">
              <IconBubble label="Report">
                <ClipboardList className="size-5" />
              </IconBubble>
              <IconBubble label="Route">
                <RouteIcon className="size-5" />
              </IconBubble>
              <IconBubble label="Resolve">
                <ShieldCheck className="size-5" />
              </IconBubble>
            </div>
            <p className="mt-5 max-w-[280px] text-[15px] leading-6 text-muted-foreground">
              One place for every campus issue, from first report to visible resolution.
            </p>
            <Link
              to="/report"
              reloadDocument
              className="group mt-6 inline-flex h-11 items-center gap-3 rounded-full bg-foreground px-5 text-sm font-medium text-background"
            >
              Report Issue
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <ProductCollage pulse={pulse} />
      </section>

      <Link
        to="/report"
        reloadDocument
        className="fixed bottom-4 right-4 z-30 inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background shadow-sm sm:hidden"
      >
        + Report Issue
      </Link>

      <BenefitsSection />
      <CampusConstructorSection />
      <FeaturesSection />
      <TestimonialsSection />
      <FinalCTASection />
    </StudentShell>
  );
}

function IconBubble({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span
      className="hero-utility-pulse grid size-13 place-items-center rounded-full border border-foreground/10 bg-card text-foreground"
      title={label}
      aria-label={label}
    >
      {children}
    </span>
  );
}

function ProductCollage({ pulse }: { pulse: string[][] }) {
  return (
    <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12 lg:grid-rows-[230px_190px]">
      <ProblemScene />
      <IssueOperationsPanel pulse={pulse} />
      <IssueTicketPanel />
      <RoutingActionPanel />
      <FacilityObjectPanel />
      <DashboardPreviewPanel />
      <HeroLowerLeftCue />
    </div>
  );
}

function HeroLowerLeftCue() {
  return (
    <div className="flex items-end justify-start gap-3 pb-2 md:col-span-3 lg:col-start-1 lg:row-start-2">
      <div className="flex items-center gap-2 text-foreground/70" aria-hidden="true">
        <Sparkles className="size-7 fill-foreground text-foreground" strokeWidth={2.2} />
        <span className="grid size-7 grid-cols-2 gap-1">
          <span className="rounded-full bg-foreground/75" />
          <span className="rounded-full bg-foreground/25" />
          <span className="rounded-full bg-foreground/25" />
          <span className="rounded-full bg-foreground/75" />
        </span>
        <CircleDot className="size-7 text-foreground/25" strokeWidth={5} />
      </div>
      <span className="rounded-full bg-card px-3 py-2 text-xs text-muted-foreground">
        Problems stay visible
      </span>
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-foreground">
        <ArrowRight className="size-4" />
      </span>
    </div>
  );
}

function ProblemScene() {
  return (
    <div className="hero-collage-card relative overflow-hidden rounded-[1.65rem] bg-card p-5 md:col-span-3 lg:col-span-3 lg:row-start-1">
      <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs">
        <Wifi className="size-3.5" />
        Library · Wi-Fi
      </div>
      <svg className="absolute inset-x-8 bottom-8 top-16 w-[calc(100%-4rem)]" viewBox="0 0 280 150">
        <rect
          x="92"
          y="58"
          width="96"
          height="62"
          rx="10"
          fill="#EAE9E5"
          stroke="#111"
          strokeOpacity=".08"
        />
        <rect
          x="108"
          y="76"
          width="64"
          height="26"
          rx="5"
          fill="#fff"
          stroke="#111"
          strokeOpacity=".08"
        />
        <path
          d="M140 50c20 0 37 8 50 22"
          fill="none"
          stroke="#111"
          strokeOpacity=".22"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          className="signal-wave"
          d="M140 32c34 0 63 13 85 37"
          fill="none"
          stroke="#111"
          strokeOpacity=".16"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          className="signal-wave delay-150"
          d="M140 16c48 0 90 19 122 53"
          fill="none"
          stroke="#111"
          strokeOpacity=".12"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle className="map-marker-pulse" cx="198" cy="64" r="10" fill="#DFFF32" />
        <path d="M198 59v10M193 64h10" stroke="#111" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function IssueOperationsPanel({ pulse }: { pulse: string[][] }) {
  return (
    <div className="hero-collage-card hero-organic-panel relative overflow-hidden rounded-[1.65rem] bg-card p-5 md:col-span-3 lg:col-span-6 lg:col-start-4 lg:row-start-1">
      <div className="grid h-full grid-cols-[1.1fr_0.9fr] gap-5">
        <div className="min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Campus operations</p>
            <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-medium">live</span>
          </div>
          <div className="mt-5 space-y-3">
            {[
              [pulse[0]?.[0] ?? "Library Wi-Fi", "IT Services", "Assigned"],
              ["Block B Leakage", "Maintenance", "In Progress"],
              ["Room 304 Fan", "Electrical", "Resolved"],
            ].map(([issue, team, status]) => (
              <div
                key={issue}
                className="flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2"
              >
                <span className="size-2 shrink-0 rounded-full bg-accent" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{issue}</p>
                  <p className="text-[10px] text-muted-foreground">{team}</p>
                </div>
                <span className="text-[10px] text-muted-foreground">{status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative grid place-items-center overflow-hidden rounded-2xl bg-surface">
          <div className="facility-object scale-[.78]">
            <svg viewBox="0 0 180 150" className="size-44" fill="none" aria-hidden="true">
              <rect
                x="42"
                y="34"
                width="96"
                height="84"
                rx="10"
                fill="#fff"
                stroke="#111"
                strokeOpacity=".12"
              />
              <path
                d="M42 64h96M42 91h96M74 34v84M106 34v84"
                stroke="#111"
                strokeOpacity=".1"
                strokeWidth="2"
              />
              <path
                d="M26 50h16M138 50h16M26 103h16M138 103h16"
                stroke="#111"
                strokeOpacity=".25"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <circle cx="115" cy="52" r="10" fill="#DFFF32" />
              <path d="M115 47v10M110 52h10" stroke="#111" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="absolute bottom-3 left-3 rounded-full bg-card px-2.5 py-1 text-[10px] text-muted-foreground">
            Central campus · active issue
          </span>
        </div>
      </div>
    </div>
  );
}

function IssueTicketPanel() {
  return (
    <div className="hero-collage-card relative overflow-hidden rounded-[1.65rem] bg-[#464644] p-5 text-background md:col-span-3 lg:col-span-3 lg:col-start-10 lg:row-start-1">
      <div className="ticket-sheet mx-auto flex h-full max-w-[170px] flex-col justify-center rounded-xl bg-[#f7f7f4] p-4 text-foreground">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>ISSUE TICKET</span>
          <BadgeCheck className="size-3.5" />
        </div>
        <p className="mt-5 text-sm font-medium">#CF-2048</p>
        <div className="mt-3 space-y-1.5 text-[10px] text-muted-foreground">
          <p>Wi-Fi · Central Library</p>
          <p>Priority · High</p>
          <p>Team · IT Services</p>
        </div>
        <span className="mt-4 inline-flex w-fit rounded-full bg-accent px-2 py-1 text-[10px] font-medium text-foreground">
          Acknowledged
        </span>
      </div>
    </div>
  );
}

function RoutingActionPanel() {
  return (
    <div className="hero-collage-card relative overflow-hidden rounded-[1.65rem] bg-[#464644] p-5 md:col-span-3 lg:col-span-3 lg:col-start-4 lg:row-start-2">
      <div className="route-demo-window relative mx-auto max-w-[220px] overflow-hidden rounded-xl bg-[#f7f7f4] p-3 text-foreground">
        <div className="flex items-center justify-between text-xs font-medium">
          <span>Auto-route issue</span>
          <RouteIcon className="size-3.5" />
        </div>
        <div
          className="route-demo-line absolute left-[42%] top-11 h-px w-[30%] bg-foreground/15"
          aria-hidden="true"
        >
          <span className="route-demo-dot absolute -top-1 left-0 size-2 rounded-full bg-accent" />
        </div>
        <div className="mt-3 space-y-2 text-[10px]">
          {[
            ["Wi-Fi unavailable", "IT Services"],
            ["Broken fan", "Electrical"],
            ["Water leakage", "Maintenance"],
          ].map(([issue, team]) => (
            <div
              key={issue}
              className="route-demo-row flex items-center justify-between rounded-lg bg-muted px-2.5 py-2"
            >
              <span>{issue}</span>
              <span className="route-demo-team font-medium text-muted-foreground">→ {team}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FacilityObjectPanel() {
  return (
    <div className="hero-collage-card relative overflow-hidden rounded-[1.65rem] bg-card p-5 md:col-span-3 lg:col-span-3 lg:col-start-7 lg:row-start-2">
      <div className="grid h-full place-items-center">
        <div className="facility-object">
          <svg viewBox="0 0 180 150" className="size-40" fill="none" aria-hidden="true">
            <rect
              x="42"
              y="34"
              width="96"
              height="84"
              rx="10"
              fill="#EAE9E5"
              stroke="#111"
              strokeOpacity=".12"
            />
            <path
              d="M42 64h96M42 91h96M74 34v84M106 34v84"
              stroke="#111"
              strokeOpacity=".1"
              strokeWidth="2"
            />
            <path
              d="M26 50h16M138 50h16M26 103h16M138 103h16"
              stroke="#111"
              strokeOpacity=".25"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle cx="115" cy="52" r="11" fill="#DFFF32" />
            <path d="M115 46v12M109 52h12" stroke="#111" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <span className="absolute bottom-3 left-3 rounded-full border border-border bg-background px-2.5 py-1 text-[10px] text-muted-foreground">
          Library · Wi-Fi marker
        </span>
      </div>
    </div>
  );
}

function DashboardPreviewPanel() {
  return (
    <div className="hero-collage-card relative overflow-hidden rounded-[1.65rem] bg-card p-0 md:col-span-6 lg:col-span-3 lg:col-start-10 lg:row-start-2">
      <div className="absolute -bottom-16 -right-16 w-[calc(100%+4rem)] rounded-t-[1.2rem] border border-border bg-[#f7f7f4] p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid size-8 place-items-center rounded-lg bg-foreground text-background">
            <CircleDot className="size-4" />
          </div>
          <div>
            <p className="text-sm font-medium">Campus dashboard</p>
            <p className="text-[10px] text-muted-foreground">Resolution overview</p>
          </div>
        </div>
        <div className="dashboard-live-window mt-3 h-8 overflow-hidden rounded-lg bg-muted px-2.5 text-[10px]">
          <div className="dashboard-live-track">
            {[
              ["Library Wi-Fi", "Assigned"],
              ["Block B Leakage", "In Progress"],
              ["Room 304 Fan", "Resolved"],
              ["Library Wi-Fi", "Assigned"],
            ].map(([issue, status], index) => (
              <div
                key={`${issue}-${status}-${index}`}
                className="flex h-8 items-center justify-between gap-3"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <span className="size-1.5 shrink-0 rounded-full bg-accent" />
                  {issue}
                </span>
                <span className="shrink-0 text-muted-foreground">{status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {[
            ["Urgent", "04"],
            ["Pending", "18"],
            ["Resolved", "32"],
            ["Teams", "06"],
          ].map(([label, value]) => (
            <div key={label} className="dashboard-metric rounded-lg bg-muted px-2.5 py-2">
              <p className="text-[10px] text-muted-foreground">{label}</p>
              <p className="mt-1 text-sm font-medium">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReportPreview() {
  return (
    <Link
      to="/report"
      search={{ category: "Wi-Fi / Network" }}
      reloadDocument
      className="hero-collage-card group overflow-hidden rounded-[1.65rem] bg-card p-5 transition-transform hover:-translate-y-0.5 md:col-span-3 lg:col-span-4 lg:row-start-1"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Report an issue</p>
        <span className="grid size-8 place-items-center rounded-full bg-accent text-foreground transition-transform group-hover:translate-x-0.5">
          <ArrowRight className="size-4" />
        </span>
      </div>
      <div className="mt-3 rounded-2xl border border-border bg-background p-2.5">
        <div className="relative grid h-16 place-items-center overflow-hidden rounded-xl border border-dashed border-foreground/18 bg-surface text-muted-foreground">
          <ImagePlus className="size-5" />
          <span className="absolute right-3 top-3 size-2 rounded-full bg-accent" />
        </div>
        <div className="mt-2.5 grid gap-1.5">
          <MiniField icon={<MapPin className="size-3.5" />} label="Central Library · Floor 2" />
          <MiniField icon={<Wifi className="size-3.5" />} label="Wi-Fi & Network" active />
        </div>
      </div>
    </Link>
  );
}

function MiniField({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-2.5 py-1.5 text-xs">
      <span className={active ? "text-foreground" : "text-muted-foreground"}>{icon}</span>
      <span>{label}</span>
      {active && <span className="ml-auto size-2 rounded-full bg-accent" />}
    </div>
  );
}

function RouteMotionCard() {
  return (
    <div className="hero-collage-card relative overflow-hidden rounded-[1.65rem] bg-card p-5 transition-transform hover:-translate-y-0.5 md:col-span-3 lg:col-span-4 lg:row-start-1">
      <div className="flex items-start justify-between gap-5">
        <p className="text-sm font-medium">Auto routing</p>
        <span className="-rotate-6 rounded-full bg-accent px-3 py-1 text-xs font-medium">live</span>
      </div>

      <div className="relative mt-8 h-32">
        <RouteStation
          className="left-0 top-3"
          icon={<UserRound className="size-4" />}
          label="STUDENT"
        />
        <RouteStation
          className="left-1/2 top-16 -translate-x-1/2"
          icon={<RouteIcon className="size-4" />}
          label="FIX"
        />
        <RouteStation
          className="right-0 top-3"
          icon={<Wrench className="size-4" />}
          label="TEAM"
          active
        />
        <svg
          className="absolute inset-x-8 top-12 h-16 text-foreground/45"
          viewBox="0 0 260 84"
          fill="none"
        >
          <path
            className="route-path"
            d="M8 15C82 15 80 68 130 68C180 68 177 15 252 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span className="issue-transfer-arc absolute left-1 top-10 grid size-9 place-items-center rounded-xl border border-border bg-background">
          <Droplets className="size-4" />
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <TinyStep label="reported" done />
        <TinyStep label="routed" active />
        <TinyStep label="received" />
      </div>
    </div>
  );
}

function RouteStation({
  className,
  label,
  icon,
  active,
}: {
  label: string;
  icon: React.ReactNode;
  className?: string;
  active?: boolean;
}) {
  return (
    <div className={cn("absolute grid justify-items-center gap-2", className)}>
      <span
        className={cn(
          "grid size-10 place-items-center rounded-full border border-border bg-background",
          active && "bg-accent",
        )}
      >
        {icon}
      </span>
      <span className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function TinyStep({ label, done, active }: { label: string; done?: boolean; active?: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-[11px]">
      <span className={cn("size-2 rounded-full", active ? "bg-accent" : "bg-foreground/25")} />
      <span className={done || active ? "text-foreground" : "text-muted-foreground"}>{label}</span>
    </div>
  );
}

function CampusMap() {
  return (
    <div className="hero-collage-card relative min-h-56 overflow-hidden rounded-[1.65rem] border border-foreground/10 bg-surface p-5 md:col-span-6 lg:col-span-4 lg:row-start-1">
      <div className="absolute left-5 top-5 flex items-center gap-4 text-foreground">
        <CircleDot className="size-5" />
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          Campus map
        </span>
      </div>
      <div className="absolute inset-x-5 bottom-5 top-14 rounded-2xl border border-border bg-background/55 p-3">
        <MapBlock className="left-[8%] top-[12%] h-12 w-24" label="Library" />
        <MapBlock className="left-[46%] top-[8%] h-14 w-28" label="Academic" />
        <MapBlock className="left-[18%] top-[58%] h-12 w-24" label="Hostel" />
        <MapBlock className="right-[8%] top-[54%] h-12 w-24" label="Parking" />
        <IssueMarker className="left-[32%] top-[28%]" icon={<Wifi className="size-3" />} active />
        <IssueMarker className="left-[58%] top-[55%]" icon={<Droplets className="size-3" />} />
        <IssueMarker
          className="right-[20%] top-[30%]"
          icon={<ParkingSquare className="size-3" />}
        />
      </div>
    </div>
  );
}

function MapBlock({ className, label }: { className: string; label: string }) {
  return (
    <div
      className={cn(
        "absolute rounded-xl border border-border bg-card px-3 py-2 text-[10px] text-muted-foreground",
        className,
      )}
    >
      {label}
    </div>
  );
}

function IssueMarker({
  className,
  icon,
  active,
}: {
  className: string;
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={cn(
        "absolute grid size-8 place-items-center rounded-full border border-border bg-card",
        active && "map-marker-pulse bg-accent",
        className,
      )}
    >
      {icon}
    </span>
  );
}

function DepartmentStrip() {
  return (
    <div className="grid gap-4 md:col-span-3 lg:col-span-4 lg:col-start-1 lg:row-start-2">
      <div className="grid grid-cols-2 gap-4">
        <DepartmentMotionCard />
        <ProgressRingCard />
      </div>

      <SmallCard>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Before</p>
            <div className="mt-3 flex items-center gap-3">
              <Droplets className="size-5 text-muted-foreground" />
              <ArrowRight className="size-3 text-muted-foreground" />
              <span className="grid size-7 place-items-center rounded-full border border-border">
                <BadgeCheck className="size-4" />
              </span>
            </div>
          </div>
          <div className="h-14 w-px bg-border" />
          <div>
            <p className="text-xs text-muted-foreground">After</p>
            <div>
              <p className="mt-2 text-sm font-medium">Resolved</p>
              <p className="text-xs text-muted-foreground">12:48 PM</p>
            </div>
          </div>
        </div>
      </SmallCard>
    </div>
  );
}

function DepartmentMotionCard() {
  return (
    <SmallCard className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <Wrench className="size-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">11:02</span>
      </div>
      <div className="mt-5 flex items-center gap-2">
        <span className="department-dot size-3 rounded-full bg-accent" />
        <p className="text-sm font-medium">received</p>
      </div>
      <UserRound className="absolute bottom-4 right-4 size-6 text-foreground/70" />
    </SmallCard>
  );
}

function ProgressRingCard() {
  return (
    <SmallCard>
      <div className="flex items-center justify-between">
        <svg className="size-16 -rotate-90" viewBox="0 0 72 72" aria-hidden="true">
          <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(17,17,17,.1)" strokeWidth="8" />
          <circle
            className="progress-ring"
            cx="36"
            cy="36"
            r="28"
            fill="none"
            stroke="#111111"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>
        <div>
          <p className="text-sm font-medium">in progress</p>
          <p className="text-xs text-muted-foreground">1:00 PM</p>
        </div>
      </div>
    </SmallCard>
  );
}

function SmallCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-[1.45rem] bg-card p-4 transition-transform hover:-translate-y-0.5",
        className,
      )}
    >
      {children}
    </div>
  );
}

function ResolutionPanel({ pulse }: { pulse: string[][] }) {
  return (
    <div className="hero-collage-card md:col-span-6 lg:col-span-8 lg:col-start-3 lg:row-start-2">
      <Link
        to="/report"
        reloadDocument
        className="resolved-card group flex h-full items-center justify-between gap-6 rounded-[1.45rem] bg-card p-5 transition-transform hover:-translate-y-0.5"
      >
        <div className="flex items-center gap-2">
          <span className="resolved-pulse grid size-8 place-items-center rounded-full bg-accent">
            <BadgeCheck className="size-4" />
          </span>
          <div>
            <p className="text-sm font-medium">Resolved</p>
            <p className="text-xs text-muted-foreground">Student notified · 12:48 PM</p>
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Latest: {pulse[0]?.[0] ?? "Campus issue"}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {workflow.map((step, index) => (
            <span key={step} className="inline-flex items-center gap-2 text-[11px]">
              <span
                className={index === 4 ? "font-medium text-foreground" : "text-muted-foreground"}
              >
                {step}
              </span>
              {index < workflow.length - 1 && (
                <ArrowRight className="size-3 text-muted-foreground" />
              )}
            </span>
          ))}
        </div>
      </Link>
    </div>
  );
}

function CampusPulseCard({ pulse }: { pulse: string[][] }) {
  return (
    <SmallCard className="overflow-hidden md:col-span-6 lg:col-span-3 lg:col-start-5 lg:row-start-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Pulse</p>
        <RadioTower className="size-4 text-muted-foreground" />
      </div>
      <div className="pulse-ticker mt-4 space-y-3">
        {[...pulse, ...pulseFallback].slice(0, 4).map(([title, status, time], index) => (
          <div key={`${title}-${time}-${index}`} className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-accent" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs">{title}</p>
              <p className="text-[11px] capitalize text-muted-foreground">{status}</p>
            </div>
          </div>
        ))}
      </div>
    </SmallCard>
  );
}

const benefits = [
  {
    icon: <CircleDot className="size-9" />,
    metric: "1",
    description: "Connected platform for reporting campus issues.",
  },
  {
    icon: <GitBranch className="size-9" />,
    metric: "5",
    description: "Report → Classify → Route → Resolve → Track.",
  },
  {
    icon: <BadgeCheck className="size-9" />,
    metric: "E2E",
    description: "Track an issue from submission through resolution.",
  },
] as const;

function BenefitsSection() {
  return (
    <section
      id="benefits"
      className="relative overflow-hidden bg-background px-5 py-[4.5rem] sm:px-8 sm:py-[4.75rem] lg:px-12 lg:py-20"
    >
      <svg
        className="pointer-events-none absolute -bottom-24 -left-28 hidden h-64 w-96 text-accent sm:block"
        viewBox="0 0 420 300"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M-24 232C52 198 148 204 212 245C277 287 340 308 413 246"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M-30 130C58 108 142 104 189 150C245 204 140 260 28 250C-54 243 -86 188 -30 130Z"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      <div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="pt-2">
          <span className="relative z-10 inline-flex px-3 py-1 text-[19px] font-medium text-foreground">
            Benefits
            <svg
              className="pointer-events-none absolute -inset-3 z-0 h-[calc(100%+24px)] w-[calc(100%+24px)] text-accent"
              viewBox="0 0 190 90"
              fill="none"
              aria-hidden="true"
            >
              <path
                className="label-accent-a"
                d="M18 31C6 8 43 2 95 6C153 10 185 28 177 54C168 82 34 88 17 59C7 43 13 36 18 31"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                className="label-accent-b"
                d="M25 36C18 18 48 9 101 13C151 16 179 31 169 52C158 73 43 77 24 55C18 48 19 41 25 36"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>

        <div>
          <p className="max-w-[980px] text-[1.48rem] font-medium leading-[1.32] text-foreground sm:text-[1.6rem] lg:text-[1.75rem]">
            Bring campus reporting, routing, and resolution into one clear system so students know
            where issues go and administrators can manage them efficiently.
          </p>

          <div className="mt-14 grid gap-10 md:grid-cols-3 lg:gap-14">
            {benefits.map((benefit) => (
              <BenefitBlock key={benefit.metric} {...benefit} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const campusLibrary = [
  ["Classroom", "classroom", "light"],
  ["Library", "library", "light"],
  ["Lab", "lab", "cool"],
  ["Hostel", "hostel", "light"],
  ["Admin Block", "admin", "brown"],
  ["Cafeteria", "cafe", "light"],
  ["Parking", "parking", "cool"],
  ["Washroom", "washroom", "light"],
  ["Sports Area", "sports", "brown"],
  ["Study Space", "study", "light"],
] as const;

type CampusSpaceType = (typeof campusLibrary)[number][1];

function CampusConstructorSection() {
  const [selectedSpace, setSelectedSpace] = useState("Library");

  return (
    <section
      id="campus-space"
      className="mx-auto mt-8 w-[calc(100%-28px)] max-w-[1500px] overflow-hidden rounded-[2rem] bg-surface px-5 pb-6 pt-12 sm:w-[calc(100%-64px)] sm:px-8 sm:pb-8 sm:pt-14 lg:mt-10 lg:rounded-[2.25rem] lg:px-10 lg:pb-10 lg:pt-16"
    >
      <div className="relative z-10 text-center">
        <span className="relative z-10 inline-flex px-3 py-1 text-[18px] font-medium text-foreground">
          Campus Space
          <svg
            className="pointer-events-none absolute -inset-3 z-0 h-[calc(100%+24px)] w-[calc(100%+24px)] text-accent"
            viewBox="0 0 220 90"
            fill="none"
            aria-hidden="true"
          >
            <path
              className="label-accent-a"
              d="M18 31C6 8 50 2 110 6C176 10 214 28 204 54C193 82 38 88 17 59C7 43 13 36 18 31"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              className="label-accent-b"
              d="M25 36C18 18 54 9 115 13C173 16 206 31 196 52C185 73 47 77 24 55C18 48 19 41 25 36"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <h2 className="relative z-10 mx-auto mt-8 max-w-[760px] text-[clamp(2.75rem,4.4vw,4.4rem)] font-normal leading-[1.03] text-foreground lg:translate-y-20">
          Map Campus Spaces
          <br />
          And Issues Effortlessly
        </h2>
      </div>

      <div className="campus-constructor-workspace relative mx-auto mt-8 min-h-[410px] max-w-[1260px] lg:mt-10 lg:min-h-[470px]">
        <div className="relative min-h-[410px] overflow-hidden rounded-[1.6rem] bg-surface lg:min-h-[470px] lg:pr-[296px]">
          <CampusCanvasObject
            className="left-[10%] top-[14%]"
            label="Library"
            type="library"
            selected={selectedSpace === "Library"}
            issue="wifi"
            onSelect={() => setSelectedSpace("Library")}
          />
          <CampusCanvasObject
            className="bottom-[8%] left-[20%]"
            label="Study Zone"
            type="study"
            tone="brown"
            selected={selectedSpace === "Study Space"}
            onSelect={() => setSelectedSpace("Study Space")}
          />
          <CampusCanvasObject
            className="bottom-[11%] left-[47%] sm:left-[53%]"
            label="Lab 3"
            type="lab"
            selected={selectedSpace === "Lab"}
            issue="maintenance"
            onSelect={() => setSelectedSpace("Lab")}
          />

          <div className="absolute left-[32%] top-[31%] hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <span className="size-1.5 rounded-full bg-accent" />
            <span>{selectedSpace} selected</span>
          </div>
        </div>

        <aside className="campus-space-library absolute bottom-0 right-0 top-0 hidden w-[272px] rounded-[1.35rem] bg-card p-5 lg:-top-[13rem] lg:flex lg:flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Campus Library</h3>
            <span className="text-[10px] text-muted-foreground">10 spaces</span>
          </div>
          <div className="mt-5 grid min-h-0 flex-1 grid-cols-2 grid-rows-5 gap-3">
            {campusLibrary.map(([label, type, tone]) => (
              <button
                key={label}
                type="button"
                onClick={() => setSelectedSpace(label)}
                className={cn(
                  "campus-library-tile grid h-full place-items-center rounded-xl bg-muted p-2 text-[10px] text-muted-foreground",
                  selectedSpace === label && "ring-2 ring-accent ring-offset-2 ring-offset-card",
                )}
                aria-label={`Place ${label} on campus canvas`}
                aria-pressed={selectedSpace === label}
              >
                <CampusSpaceGlyph type={type} tone={tone} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:hidden">
          {campusLibrary.slice(0, 4).map(([label, type, tone]) => (
            <button
              key={label}
              type="button"
              onClick={() => setSelectedSpace(label)}
              className={cn(
                "campus-library-tile flex items-center gap-2 rounded-xl bg-card px-3 py-2 text-left text-[10px] text-muted-foreground",
                selectedSpace === label && "ring-2 ring-accent",
              )}
              aria-label={`Select ${label}`}
            >
              <CampusSpaceGlyph type={type} tone={tone} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function CampusCanvasObject({
  className,
  label,
  type,
  tone = "light",
  issue,
  selected,
  onSelect,
}: {
  className: string;
  label: string;
  type: CampusSpaceType;
  tone?: "light" | "brown" | "cool";
  issue?: "wifi" | "maintenance";
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "campus-space-object absolute z-10 grid h-[138px] w-[174px] place-items-center rounded-[1.35rem] bg-card p-4 text-left",
        tone === "brown" && "bg-[#9a7656] text-[#2d241e]",
        tone === "cool" && "bg-[#e1e3df]",
        selected && "ring-2 ring-accent ring-offset-4 ring-offset-surface",
        className,
      )}
      aria-label={`Select ${label}`}
      aria-pressed={selected}
    >
      <CampusSpaceGlyph type={type} tone={tone} large />
      <span className="absolute bottom-3 left-4 text-[10px] font-medium uppercase tracking-[0.12em] opacity-70">
        {label}
      </span>
      {issue && (
        <span className="absolute right-3 top-3 grid size-6 place-items-center rounded-full bg-accent text-foreground">
          {issue === "wifi" ? <Wifi className="size-3.5" /> : <Wrench className="size-3.5" />}
        </span>
      )}
    </button>
  );
}

function CampusSpaceGlyph({
  type,
  tone,
  large,
}: {
  type: CampusSpaceType;
  tone: "light" | "brown" | "cool";
  large?: boolean;
}) {
  const stroke = tone === "brown" ? "#4b382a" : "#111111";
  const opacity = tone === "brown" ? ".22" : ".16";

  return (
    <svg
      viewBox="0 0 110 72"
      className={cn(large ? "h-20 w-28" : "h-8 w-10", "overflow-visible")}
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="18"
        y="12"
        width="74"
        height="48"
        rx="8"
        fill={tone === "brown" ? "#b88f69" : "#fdfdfb"}
        stroke={stroke}
        strokeOpacity=".12"
      />
      {type === "library" || type === "study" ? (
        <>
          <path
            d="M28 23h54M28 35h54M28 47h54"
            stroke={stroke}
            strokeOpacity={opacity}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M39 18v36M55 18v36M71 18v36"
            stroke={stroke}
            strokeOpacity={opacity}
            strokeWidth="2"
          />
        </>
      ) : type === "lab" ? (
        <>
          <circle
            cx="38"
            cy="36"
            r="10"
            fill={tone === "brown" ? "#caa07a" : "#eae9e5"}
            stroke={stroke}
            strokeOpacity=".18"
          />
          <circle
            cx="72"
            cy="36"
            r="10"
            fill={tone === "brown" ? "#caa07a" : "#eae9e5"}
            stroke={stroke}
            strokeOpacity=".18"
          />
          <path d="M48 36h14" stroke={stroke} strokeOpacity={opacity} strokeWidth="3" />
        </>
      ) : (
        <>
          <path
            d="M27 24h56v24H27z"
            fill={tone === "brown" ? "#caa07a" : "#eae9e5"}
            stroke={stroke}
            strokeOpacity=".16"
          />
          <path
            d="M36 24v24M48 24v24M60 24v24M72 24v24"
            stroke={stroke}
            strokeOpacity={opacity}
            strokeWidth="2"
          />
        </>
      )}
    </svg>
  );
}

function BenefitBlock({
  icon,
  metric,
  description,
}: {
  icon: React.ReactNode;
  metric: string;
  description: string;
}) {
  return (
    <div>
      <div className="text-foreground/75">{icon}</div>
      <p className="mt-5 whitespace-nowrap text-[2.8rem] font-normal leading-none text-foreground lg:text-[3.35rem]">
        {metric}
      </p>
      <p className="mt-4 max-w-[15rem] text-sm leading-5 text-foreground">{description}</p>
    </div>
  );
}

const featureShowcases = [
  {
    key: "report",
    pill: "Report",
    icon: ClipboardList,
    title: "Report an Issue",
    description:
      "Students can quickly report campus problems with a photo, location, issue details, and priority-all from one simple interface.",
    mockup: <ReportFeatureMockup />,
  },
  {
    key: "routing",
    pill: "Smart Routing",
    icon: RouteIcon,
    title: "Smart Routing",
    description:
      "Campus-Fix classifies each report and sends it to the right department automatically, removing the confusion around who students should contact.",
    mockup: <RoutingFeatureMockup />,
  },
  {
    key: "track",
    pill: "Track",
    icon: BadgeCheck,
    title: "Track Every Resolution",
    description:
      "Students and administrators can follow an issue from submission to assignment, resolution, and final update without losing track of the complaint.",
    mockup: <TrackingFeatureMockup />,
  },
  {
    key: "dashboard",
    pill: "Dashboard",
    icon: RadioTower,
    title: "One Dashboard for Campus Operations",
    description:
      "Administration gets a centralized view of reported issues, priorities, department assignments, recurring problems, and resolution progress.",
    mockup: <DashboardFeatureMockup />,
  },
] as const;

function FeaturesSection() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const mockupRefs = useRef<Array<HTMLDivElement | null>>([]);
  const copyRefs = useRef<Array<HTMLDivElement | null>>([]);
  const markRefs = useRef<Array<HTMLDivElement | null>>([]);
  const activeRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const currentProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resetLayers = () => {
      [mockupRefs.current, copyRefs.current, markRefs.current].forEach((collection) => {
        collection.forEach((node, index) => {
          if (!node) return;
          node.style.opacity = index === 0 ? "1" : "0";
          node.style.transform = "none";
          node.style.zIndex = index === 0 ? "100" : "1";
        });
      });
    };

    const renderLayers = (progress: number) => {
      const position = progress * (featureShowcases.length - 1);
      const nextActive = Math.min(featureShowcases.length - 1, Math.max(0, Math.round(position)));

      if (nextActive !== activeRef.current) {
        activeRef.current = nextActive;
        setActiveIndex(nextActive);
      }

      featureShowcases.forEach((_, index) => {
        const offset = index - position;
        const absOffset = Math.abs(offset);
        const clamped = Math.max(-1, Math.min(1, offset));
        const fade = Math.max(0, Math.min(1, (absOffset - 0.28) / 0.36));
        const opacity = absOffset > 0.64 ? 0 : 1 - fade;
        const zIndex = `${100 - Math.round(absOffset * 20)}`;

        const mockup = mockupRefs.current[index];
        const copy = copyRefs.current[index];
        const marks = markRefs.current[index];
        if (mockup) {
          mockup.style.opacity = `${opacity}`;
          mockup.style.transform = `translate3d(0, ${clamped * 74}px, 0)`;
          mockup.style.zIndex = zIndex;
        }
        if (copy) {
          copy.style.opacity = `${opacity}`;
          copy.style.transform = `translate3d(0, ${clamped * 40}px, 0)`;
          copy.style.zIndex = zIndex;
        }
        if (marks) {
          marks.style.opacity = `${opacity}`;
          marks.style.transform = `translate3d(0, ${clamped * 18}px, 0)`;
          marks.style.zIndex = zIndex;
        }
      });
    };

    const updateTarget = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper || window.innerWidth < 1024 || reduceMotion.matches) {
        targetProgressRef.current = 0;
        currentProgressRef.current = 0;
        resetLayers();
        return;
      }

      const rect = wrapper.getBoundingClientRect();
      const scrollRange = Math.max(1, wrapper.offsetHeight - window.innerHeight);
      targetProgressRef.current = Math.min(1, Math.max(0, -rect.top / scrollRange));
    };

    const tick = () => {
      updateTarget();
      const current = currentProgressRef.current;
      const target = targetProgressRef.current;
      const next = current + (target - current) * 0.16;
      currentProgressRef.current = Math.abs(target - next) < 0.001 ? target : next;
      renderLayers(currentProgressRef.current);

      if (Math.abs(target - currentProgressRef.current) > 0.001) {
        rafRef.current = window.requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    const requestUpdate = () => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(tick);
    };

    updateTarget();
    renderLayers(currentProgressRef.current);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reduceMotion.addEventListener("change", requestUpdate);

    return () => {
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reduceMotion.removeEventListener("change", requestUpdate);
    };
  }, []);

  const scrollToFeature = (index: number) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const scrollRange = wrapper.offsetHeight - window.innerHeight;
    const target =
      wrapper.getBoundingClientRect().top +
      window.scrollY +
      (scrollRange * index) / Math.max(1, featureShowcases.length - 1);
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <section id="features" className="bg-background px-5 pb-20 pt-12 sm:px-8 lg:px-12 lg:pt-16">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(500px,0.9fr)] lg:items-end">
          <div>
            <span className="relative z-10 inline-flex px-3 py-1 text-[19px] font-medium text-foreground">
              Features
              <svg
                className="pointer-events-none absolute -inset-3 z-0 h-[calc(100%+24px)] w-[calc(100%+24px)] text-accent"
                viewBox="0 0 190 90"
                fill="none"
                aria-hidden="true"
              >
                <path
                  className="label-accent-a"
                  d="M18 31C6 8 43 2 95 6C153 10 185 28 177 54C168 82 34 88 17 59C7 43 13 36 18 31"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  className="label-accent-b"
                  d="M25 36C18 18 48 9 101 13C151 16 179 31 169 52C158 73 43 77 24 55C18 48 19 41 25 36"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <h2 className="mt-9 max-w-4xl text-[clamp(2.625rem,4.2vw,4.25rem)] font-normal leading-[1.08] text-foreground">
              A Smarter Way to Handle Campus Issues
            </h2>
          </div>

          <div className="z-20 flex flex-wrap gap-3 lg:sticky lg:top-24 lg:justify-end lg:pb-5">
            {featureShowcases.map((feature, index) => {
              const Icon = feature.icon;
              const active = activeIndex === index;
              return (
                <button
                  key={feature.key}
                  type="button"
                  onClick={() => scrollToFeature(index)}
                  className={cn(
                    "inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium",
                    active
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {feature.pill}
                </button>
              );
            })}
          </div>
        </div>

        <div ref={wrapperRef} className="relative mt-10 lg:h-[320vh]">
          <div className="relative mx-auto w-full max-w-[1120px] lg:sticky lg:top-[calc(50vh-10.625rem)]">
            <FeatureShowcaseShell mockupRefs={mockupRefs} copyRefs={copyRefs} markRefs={markRefs} />
            <div className="grid gap-5 lg:hidden">
              {featureShowcases.map((feature, index) => (
                <FeatureMobileCard key={feature.key} index={index} feature={feature} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureShowcaseShell({
  mockupRefs,
  copyRefs,
  markRefs,
}: {
  mockupRefs: React.MutableRefObject<Array<HTMLDivElement | null>>;
  copyRefs: React.MutableRefObject<Array<HTMLDivElement | null>>;
  markRefs: React.MutableRefObject<Array<HTMLDivElement | null>>;
}) {
  return (
    <article className="relative hidden h-[min(410px,52vh)] overflow-hidden rounded-[1.85rem] bg-surface lg:grid lg:grid-cols-[minmax(0,1.48fr)_minmax(270px,0.9fr)] lg:items-stretch">
      <div className="relative z-10 overflow-hidden">
        {featureShowcases.map((feature, index) => (
          <div
            key={feature.key}
            ref={(node) => {
              mockupRefs.current[index] = node;
            }}
            className="absolute inset-0 flex items-center justify-center p-7"
            style={{
              opacity: index === 0 ? 1 : 0,
              transform: index === 0 ? "none" : "translate3d(0, 74px, 0)",
              willChange: "transform, opacity",
            }}
          >
            {feature.mockup}
          </div>
        ))}
      </div>

      <svg
        className="pointer-events-none absolute bottom-0 left-[57.5%] top-0 z-0 hidden h-full w-24 text-background lg:block"
        viewBox="0 0 96 620"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <path d="M35 0H96V620H35C66 574 12 560 12 522V98C12 60 66 46 35 0Z" fill="currentColor" />
      </svg>

      <div className="relative z-10 overflow-hidden">
        {featureShowcases.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.key}
              ref={(node) => {
                copyRefs.current[index] = node;
              }}
              className="absolute inset-0 flex flex-col justify-center px-10 py-10"
              style={{
                opacity: index === 0 ? 1 : 0,
                transform: index === 0 ? "none" : "translate3d(0, 40px, 0)",
                willChange: "transform, opacity",
              }}
            >
              <div
                ref={(node) => {
                  markRefs.current[index] = node;
                }}
                className="flex items-center gap-2.5 text-foreground"
                style={{
                  opacity: index === 0 ? 1 : 0,
                  transform: index === 0 ? "none" : "translate3d(0, 18px, 0)",
                  willChange: "transform, opacity",
                }}
              >
                <FeatureMark icon={<Icon className="size-3.5" />} active={index === 0} />
                <FeatureMark icon={<CircleDot className="size-3.5" />} />
                <FeatureMark icon={<Sparkles className="size-3.5" />} />
              </div>
              <h3 className="mt-8 max-w-sm text-[1.55rem] font-medium leading-tight text-foreground">
                {feature.title}
              </h3>
              <p className="mt-3 max-w-[20rem] text-[13px] leading-6 text-foreground">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function FeatureMobileCard({
  feature,
  index,
}: {
  feature: (typeof featureShowcases)[number];
  index: number;
}) {
  const Icon = feature.icon;

  return (
    <article className="relative min-h-[620px] overflow-hidden rounded-[2rem] bg-surface p-6 sm:p-8">
      <div className="relative z-10 flex min-h-[330px] items-center justify-center">
        {feature.mockup}
      </div>
      <div className="relative z-10 flex flex-col justify-center pt-8">
        <div className="flex items-center gap-3 text-foreground">
          <FeatureMark icon={<Icon className="size-4" />} active={index === 0} />
          <FeatureMark icon={<CircleDot className="size-4" />} />
          <FeatureMark icon={<Sparkles className="size-4" />} />
        </div>
        <h3 className="mt-9 max-w-sm text-[1.65rem] font-medium leading-tight text-foreground">
          {feature.title}
        </h3>
        <p className="mt-3.5 max-w-[22rem] text-sm leading-6 text-foreground">
          {feature.description}
        </p>
      </div>
    </article>
  );
}

function FeatureMark({ icon, active }: { icon: React.ReactNode; active?: boolean }) {
  return (
    <span
      className={cn(
        "grid size-8 place-items-center rounded-full",
        active ? "bg-foreground text-background" : "bg-card text-foreground/72",
      )}
    >
      {icon}
    </span>
  );
}

function ReportFeatureMockup() {
  return (
    <div className="relative w-full max-w-[470px]">
      <div className="rounded-[1.25rem] bg-card p-3.5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Report an issue</p>
          <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium">new</span>
        </div>
        <div className="mt-3.5 grid gap-2.5 sm:grid-cols-[1.05fr_0.95fr]">
          <div className="grid min-h-28 place-items-center rounded-2xl border border-dashed border-foreground/20 bg-background text-muted-foreground">
            <div className="grid justify-items-center gap-2">
              <ImagePlus className="size-6" />
              <span className="text-[11px]">Upload Photo</span>
            </div>
          </div>
          <div className="grid content-start gap-2.5">
            <FeatureField
              icon={<MapPin className="size-3.5" />}
              label="Central Library · Floor 2"
            />
            <FeatureField icon={<Wifi className="size-3.5" />} label="Wi-Fi unavailable" active />
            <FeatureField icon={<CircleDot className="size-3.5" />} label="Priority · Medium" />
            <button className="mt-0.5 inline-flex h-9 items-center justify-center gap-2 rounded-full bg-foreground px-4 text-xs font-medium text-background">
              Submit <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-6 -left-6 hidden w-48 rounded-2xl bg-card p-3 sm:block">
        <p className="text-xs font-medium">Photo attached</p>
        <p className="mt-1 text-[11px] text-muted-foreground">Block B · Floor 2</p>
      </div>
    </div>
  );
}

function RoutingFeatureMockup() {
  const routes = [
    ["Wi-Fi", "IT Services", Wifi],
    ["Fan", "Electrical", Fan],
    ["Leakage", "Maintenance", Droplets],
  ] as const;

  return (
    <div className="w-full max-w-[485px] rounded-[1.25rem] bg-card p-3.5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Auto classify</p>
        <span className="-rotate-6 rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium">
          routed
        </span>
      </div>
      <div className="mt-5 grid gap-2.5">
        {routes.map(([issue, team, Icon]) => (
          <div
            key={issue}
            className="grid grid-cols-[1fr_auto_1fr] items-center gap-2.5 rounded-2xl border border-border bg-background p-2.5"
          >
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-full bg-card">
                <Icon className="size-3.5" />
              </span>
              <span className="text-xs font-medium">{issue}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="h-px w-6 bg-border" />
              <ArrowRight className="size-3.5" />
              <span className="h-px w-6 bg-border" />
            </div>
            <div className="rounded-full bg-card px-3 py-1.5 text-center text-xs font-medium">
              {team}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrackingFeatureMockup() {
  const steps = ["Reported", "Assigned", "In Progress", "Resolved"];

  return (
    <div className="relative w-full max-w-[470px] rounded-[1.25rem] bg-card p-3.5">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-xs text-muted-foreground">#CF-2048</p>
          <p className="mt-1 text-sm font-medium">Projector not working</p>
          <p className="text-xs text-muted-foreground">Room 304 · Academic Block</p>
        </div>
        <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium">visible</span>
      </div>
      <div className="mt-6 grid gap-2.5">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-2.5">
            <span
              className={cn(
                "grid size-7 place-items-center rounded-full border",
                index < 3 ? "border-foreground bg-foreground text-background" : "border-border",
              )}
            >
              {index < 3 ? <BadgeCheck className="size-3.5" /> : <CircleDot className="size-3.5" />}
            </span>
            <div className="h-px flex-1 bg-border" />
            <span className="w-24 text-xs font-medium">{step}</span>
          </div>
        ))}
      </div>
      <div className="absolute -right-5 bottom-7 hidden rounded-2xl bg-background p-3 sm:block">
        <p className="text-xs font-medium">Student notified</p>
        <p className="mt-1 text-[11px] text-muted-foreground">12:48 PM</p>
      </div>
    </div>
  );
}

function DashboardFeatureMockup() {
  return (
    <div className="w-full max-w-[500px] rounded-[1.25rem] bg-card p-3.5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Campus dashboard</p>
        <RadioTower className="size-4 text-muted-foreground" />
      </div>
      <div className="mt-4 grid gap-2.5 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-2xl bg-background p-3">
          <div className="flex h-28 items-end gap-2.5">
            {[54, 34, 72, 42, 61].map((height, index) => (
              <span key={height} className="flex flex-1 items-end rounded-full bg-muted">
                <span
                  className={cn("w-full rounded-full bg-foreground", index === 2 && "bg-accent")}
                  style={{ height: `${height}%` }}
                />
              </span>
            ))}
          </div>
          <div className="mt-2.5 flex justify-between text-[11px] text-muted-foreground">
            <span>Urgent</span>
            <span>Pending</span>
            <span>Resolved</span>
          </div>
        </div>
        <div className="grid gap-2">
          {["Recent Issues", "Departments", "Resolution overview"].map((item, index) => (
            <div key={item} className="rounded-xl border border-border bg-background p-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{item}</span>
                <span
                  className={cn("size-2 rounded-full", index === 1 ? "bg-accent" : "bg-foreground")}
                />
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-foreground"
                  style={{ width: `${index === 0 ? 72 : index === 1 ? 48 : 84}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureField({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-full border border-border bg-background px-3 py-2 text-xs">
      <span className={active ? "text-foreground" : "text-muted-foreground"}>{icon}</span>
      <span>{label}</span>
      {active && <span className="ml-auto size-1.5 rounded-full bg-accent" />}
    </div>
  );
}

const testimonials = [
  {
    icon: "spark",
    text: "Reporting a campus issue feels much simpler now. I can submit the problem with the location and details in one place instead of trying to figure out which department to contact.",
    name: "Aarav Sharma",
    role: "Student",
    initials: "AS",
  },
  {
    icon: "ring",
    text: "Campus-Fix gives us a much clearer view of reported issues and where each complaint currently stands. Routing and tracking everything from one dashboard makes the process easier to manage.",
    name: "Dr. Meera Kapoor",
    role: "Campus Administration",
    initials: "MK",
  },
  {
    icon: "petal",
    text: "Having issues routed directly to the relevant department removes unnecessary back-and-forth and gives us a clearer picture of what needs attention.",
    name: "Rahul Verma",
    role: "Maintenance Department",
    initials: "RV",
  },
  {
    icon: "grid",
    text: "The best part is knowing that the report has not disappeared. I can see when it is received, assigned, and resolved without following up repeatedly.",
    name: "Nisha Rao",
    role: "Student",
    initials: "NR",
  },
  {
    icon: "ring",
    text: "A shared issue queue makes daily coordination easier. Teams can see priority, location, and status without relying on scattered messages.",
    name: "Kabir Malhotra",
    role: "Operations Team",
    initials: "KM",
  },
] as const;

function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardCount = testimonials.length;

  const move = (direction: 1 | -1) => {
    setActiveIndex((current) => (current + direction + cardCount) % cardCount);
  };

  const visibleTestimonials = [0, 1, 2].map(
    (offset) => testimonials[(activeIndex + offset) % cardCount],
  );

  return (
    <section
      id="testimonials"
      className="mx-auto mt-10 w-[calc(100%-28px)] max-w-[1500px] scroll-mt-24 overflow-hidden rounded-[1.75rem] bg-[#464644] px-6 pb-8 pt-11 text-background sm:w-[calc(100%-64px)] sm:rounded-[2rem] sm:px-8 sm:pb-9 sm:pt-11 lg:px-10 lg:pb-10 lg:pt-12"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_180px] lg:items-center">
        <div>
          <span className="relative z-10 inline-flex px-3 py-1 text-[18px] font-medium text-background">
            Testimonials
            <svg
              className="pointer-events-none absolute -inset-3 z-0 h-[calc(100%+24px)] w-[calc(100%+24px)] text-accent"
              viewBox="0 0 220 90"
              fill="none"
              aria-hidden="true"
            >
              <path
                className="label-accent-a"
                d="M18 31C6 8 50 2 110 6C176 10 214 28 204 54C193 82 38 88 17 59C7 43 13 36 18 31"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                className="label-accent-b"
                d="M25 36C18 18 54 9 115 13C173 16 206 31 196 52C185 73 47 77 24 55C18 48 19 41 25 36"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>

          <h2 className="mt-7 max-w-4xl text-[clamp(2.35rem,3.8vw,4rem)] font-normal leading-[1.01] tracking-[-0.03em] text-background">
            What Our Users
            <br />
            Say About Campus-Fix
          </h2>
        </div>

        <div className="flex gap-2.5 lg:justify-end lg:self-end lg:pb-6">
          <button
            type="button"
            onClick={() => move(-1)}
            className="grid size-10 place-items-center rounded-full bg-[#303030] text-xl leading-none text-background hover:-translate-x-0.5 hover:bg-[#292929]"
            aria-label="Previous testimonial"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            className="grid size-10 place-items-center rounded-full bg-[#303030] text-xl leading-none text-background hover:translate-x-0.5 hover:bg-[#292929]"
            aria-label="Next testimonial"
          >
            →
          </button>
        </div>
      </div>

      <div className="mx-auto mt-12 grid gap-4 md:grid-cols-2 lg:mt-16 lg:max-w-[1080px] lg:grid-cols-3 lg:gap-5">
        {visibleTestimonials.map((testimonial, index) => (
          <TestimonialCard
            key={`${activeIndex}-${testimonial.name}`}
            testimonial={testimonial}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[number];
  index: number;
}) {
  return (
    <article
      className={cn(
        "flex min-h-[300px] animate-in fade-in slide-in-from-right-6 flex-col rounded-[1.5rem] bg-[#f1f1ee] p-6 text-[#20242c] transition-all duration-700 motion-reduce:animate-none motion-reduce:transition-none sm:min-h-[330px] sm:p-7 lg:min-h-[330px] lg:p-8",
        index === 1 && "hidden md:flex",
        index === 2 && "hidden lg:flex",
        index === 1 && "lg:translate-y-14",
        index === 2 && "lg:translate-y-6",
      )}
    >
      <AbstractTestimonialIcon variant={testimonial.icon} />

      <p className="mt-10 max-w-[31rem] text-[0.92rem] leading-[1.55] text-[#252a33] sm:text-[1rem]">
        “{testimonial.text}”
      </p>

      <div className="mt-auto flex items-center gap-3 pt-6">
        <span className="grid size-9 place-items-center rounded-full bg-[#dfe0dc] text-xs font-medium text-foreground">
          {testimonial.initials}
        </span>
        <span>
          <span className="block text-base font-medium leading-tight text-[#252a33]">
            {testimonial.name}
          </span>
          <span className="mt-1 block text-sm text-[#8b8b86]">{testimonial.role}</span>
        </span>
      </div>
    </article>
  );
}

function AbstractTestimonialIcon({ variant }: { variant: (typeof testimonials)[number]["icon"] }) {
  if (variant === "ring") {
    return <CircleDot className="size-9 text-[#252a33]" strokeWidth={5} />;
  }

  if (variant === "petal") {
    return (
      <span className="relative grid size-9 place-items-center">
        <span className="absolute h-4 w-10 rounded-full bg-[#252a33]" />
        <span className="absolute h-10 w-4 rounded-full bg-[#252a33]" />
        <span className="relative size-2.5 rounded-full bg-[#f1f1ee]" />
      </span>
    );
  }

  if (variant === "grid") {
    return (
      <span className="grid size-9 grid-cols-2 gap-1">
        <span className="rounded-full bg-[#252a33]" />
        <span className="rounded-full bg-[#252a33]" />
        <span className="rounded-full bg-[#252a33]" />
        <span className="rounded-full bg-[#252a33]" />
      </span>
    );
  }

  return <Sparkles className="size-9 fill-[#252a33] text-[#252a33]" strokeWidth={2.5} />;
}

function FinalCTASection() {
  return (
    <section
      id="final-cta"
      className="relative mx-auto mt-8 min-h-[720px] max-w-[1500px] overflow-hidden bg-background px-5 py-16 sm:mt-6 sm:px-8 lg:mt-9 lg:min-h-[780px] lg:px-10 lg:py-20"
    >
      <style>
        {`
          @keyframes final-cta-float-a {
            0%, 100% { transform: translate3d(0, 0, 0); }
            50% { transform: translate3d(0, -8px, 0); }
          }

          @keyframes final-cta-float-b {
            0%, 100% { transform: translate3d(0, 0, 0); }
            50% { transform: translate3d(0, 7px, 0); }
          }

          @keyframes final-cta-enter {
            from { opacity: 0; transform: translate3d(0, 18px, 0) scale(0.98); }
            to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
          }

          .final-cta-enter {
            animation: final-cta-enter 850ms cubic-bezier(0.22, 1, 0.36, 1) both;
          }

          .final-cta-float-a {
            animation: final-cta-float-a 6.8s ease-in-out infinite;
          }

          .final-cta-float-b {
            animation: final-cta-float-b 7.4s ease-in-out infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .final-cta-enter,
            .final-cta-float-a,
            .final-cta-float-b {
              animation: none !important;
            }
          }
        `}
      </style>

      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
        <div className="absolute left-[5.5%] top-[14%] w-[285px] final-cta-enter final-cta-float-a">
          <FinalIssueActionCard />
        </div>
        <div
          className="absolute right-[6.5%] top-[15%] w-[310px] final-cta-enter final-cta-float-b"
          style={{ animationDelay: "120ms, 900ms" }}
        >
          <FinalRecentReportsCard />
        </div>
        <div
          className="absolute bottom-[8%] left-[11%] w-[275px] final-cta-enter final-cta-float-b"
          style={{ animationDelay: "220ms, 400ms" }}
        >
          <FinalReportMiniCard />
        </div>
        <div
          className="absolute bottom-[5%] right-[15%] w-[305px] final-cta-enter final-cta-float-a"
          style={{ animationDelay: "320ms, 1200ms" }}
        >
          <FinalDepartmentQueueCard />
        </div>
      </div>

      <div className="relative z-30 mx-auto flex min-h-[430px] max-w-[900px] flex-col items-center justify-center text-center lg:min-h-[620px]">
        <div className="mb-12 flex items-center justify-center gap-5 text-foreground">
          <Sparkles className="size-9 fill-foreground text-foreground" strokeWidth={2.2} />
          <span className="relative grid size-9 place-items-center opacity-10">
            <span className="absolute h-3.5 w-9 rounded-full bg-foreground" />
            <span className="absolute h-9 w-3.5 rounded-full bg-foreground" />
          </span>
          <CircleDot className="size-10 text-foreground/10" strokeWidth={5} />
          <span className="relative grid size-9 place-items-center opacity-10">
            <span className="absolute h-3.5 w-9 rotate-45 rounded-full bg-foreground" />
            <span className="absolute h-9 w-3.5 rotate-45 rounded-full bg-foreground" />
          </span>
          <Sparkles className="size-9 fill-foreground text-foreground" strokeWidth={2.2} />
        </div>

        <h2 className="max-w-[900px] text-[clamp(3rem,4.4vw,4.35rem)] font-normal leading-[1.08] tracking-normal text-foreground">
          Ready to Make Campus Issues Easier to Resolve?
        </h2>

        <p className="mt-8 max-w-[660px] text-[17px] leading-8 text-muted-foreground sm:text-lg">
          Report campus problems in one place, route them to the right department, and follow every
          issue from submission to resolution.
        </p>

        <Link
          to="/report"
          reloadDocument
          className="group mt-10 inline-flex h-14 items-center justify-center gap-3 rounded-full bg-foreground px-7 text-base font-medium text-background transition duration-200 hover:-translate-y-0.5 hover:bg-[#292929]"
        >
          Report an Issue
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="relative z-20 mt-8 grid gap-4 sm:grid-cols-2 lg:hidden">
        <FinalIssueActionCard />
        <FinalRecentReportsCard />
        <FinalReportMiniCard />
        <FinalDepartmentQueueCard />
      </div>
    </section>
  );
}

function LimeDoodle({
  variant,
  className,
}: {
  variant: "frame" | "loop" | "tall" | "circle";
  className?: string;
}) {
  if (variant === "frame") {
    return (
      <svg className={className} viewBox="0 0 330 260" fill="none" aria-hidden="true">
        <path
          d="M28 22C95 18 190 20 278 20C305 20 316 38 314 66C311 111 316 170 307 219C303 240 285 249 252 249H63C34 249 19 234 18 205C16 154 17 100 19 53C20 36 24 26 28 22Z"
          stroke="currentColor"
          strokeWidth="2.2"
        />
      </svg>
    );
  }

  if (variant === "tall") {
    return (
      <svg className={className} viewBox="0 0 260 320" fill="none" aria-hidden="true">
        <path
          d="M72 20C142 65 198 153 171 238C155 290 98 288 56 251C15 215 17 155 43 116C66 81 65 48 72 20Z"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        <path d="M52 82C19 156 53 258 137 282" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    );
  }

  if (variant === "circle") {
    return (
      <svg className={className} viewBox="0 0 320 250" fill="none" aria-hidden="true">
        <path
          d="M43 118C62 37 157 10 239 61C315 108 297 211 202 230C101 251 18 220 43 118Z"
          stroke="currentColor"
          strokeWidth="2.2"
        />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 350 250" fill="none" aria-hidden="true">
      <path
        d="M64 4C79 69 162 105 250 85C329 67 321 20 282 2"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <path d="M31 103C82 154 235 167 322 112" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}

function FinalIssueActionCard() {
  return (
    <div className="relative">
      <LimeDoodle
        variant="frame"
        className="absolute -inset-7 z-0 h-[250px] w-[330px] text-accent"
      />
      <div className="relative z-10 h-[190px] rounded-[1.6rem] border border-border bg-card/95 p-5">
        <div className="flex h-full items-center justify-center rounded-[1.1rem] bg-muted">
          <div className="grid size-18 place-items-center rounded-2xl bg-card text-muted-foreground">
            <MapPin className="size-7" />
          </div>
        </div>
        <div className="absolute right-3 top-[92px] w-[168px] rounded-xl border border-border bg-card p-2 text-[13px] shadow-sm">
          <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
            <span className="grid size-6 place-items-center rounded-md bg-accent text-foreground">
              <RouteIcon className="size-3.5" />
            </span>
            Assign Team
          </div>
          <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
            <span className="grid size-6 place-items-center rounded-md bg-accent text-foreground">
              <BadgeCheck className="size-3.5" />
            </span>
            Update Priority
          </div>
        </div>
      </div>
    </div>
  );
}

function FinalRecentReportsCard() {
  const reports = [
    ["Wi-Fi · Library", "Assigned"],
    ["Leakage · Block B", "In Progress"],
    ["Fan · Lab 3", "Resolved"],
  ] as const;

  return (
    <div className="relative">
      <LimeDoodle
        variant="loop"
        className="absolute -right-14 -top-12 z-0 h-[205px] w-[300px] text-accent"
      />
      <div className="relative z-10 rounded-[1.15rem] border border-border bg-card/95 p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between text-sm font-medium">
          <span>Recent Reports</span>
          <span className="text-xs text-muted-foreground">View all</span>
        </div>
        <div className="space-y-3 text-xs">
          {reports.map(([issue, status]) => (
            <div key={issue} className="grid grid-cols-[1fr_auto] items-center gap-4">
              <span className="flex items-center gap-2 text-foreground/80">
                <span className="size-2 rounded-full bg-accent" />
                {issue}
              </span>
              <span className="text-muted-foreground">{status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FinalReportMiniCard() {
  return (
    <div className="relative">
      <LimeDoodle
        variant="tall"
        className="absolute -left-16 -top-16 z-0 h-[300px] w-[250px] text-accent"
      />
      <div className="relative z-10 rounded-[1.2rem] border border-border bg-card/95 p-4 shadow-sm">
        <div className="mb-3 text-sm font-medium">Report an Issue</div>
        <div className="space-y-2">
          {[
            ["Location", "Central Library"],
            ["Category", "Wi-Fi"],
            ["Priority", "High"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-muted px-3 py-2 text-xs">
              <span className="text-muted-foreground">{label}</span>
              <span className="ml-3 font-medium text-foreground">{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 h-8 rounded-full bg-foreground px-4 text-center text-xs font-medium leading-8 text-background">
          Submit
        </div>
      </div>
    </div>
  );
}

function FinalDepartmentQueueCard() {
  const queues = [
    ["IT Department", 82],
    ["Electrical", 54],
    ["Maintenance", 68],
  ] as const;

  return (
    <div className="relative">
      <LimeDoodle
        variant="circle"
        className="absolute -bottom-10 -left-12 z-0 h-[220px] w-[290px] text-accent"
      />
      <div className="relative z-10 rounded-[1.2rem] border border-border bg-card/95 p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium">
          <RadioTower className="size-4" />
          Department Queue
        </div>
        <div className="space-y-3">
          {queues.map(([name, progress]) => (
            <div key={name}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span>{name}</span>
                <span className="text-muted-foreground">Active</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-foreground"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const benefitsSummary = [
  {
    icon: <CircleDot className="size-10" />,
    metric: "1",
    title: "One Place to Report",
    description: "Connected platform for reporting campus issues.",
  },
  {
    icon: <GitBranch className="size-10" />,
    metric: "5",
    title: "Smarter Issue Routing",
    description: "Report → Classify → Route → Resolve → Track.",
  },
  {
    icon: <BadgeCheck className="size-10" />,
    metric: "E2E",
    title: "Clear Resolution Tracking",
    description: "Track an issue from submission through resolution.",
  },
] as const;

function BenefitsSummarySection() {
  return (
    <section
      aria-labelledby="benefits-summary-title"
      className="relative overflow-hidden bg-background px-5 py-[4.5rem] sm:px-8 sm:py-20 lg:px-12 lg:py-[5.5rem]"
    >
      <svg
        className="pointer-events-none absolute -bottom-20 -left-24 hidden h-64 w-96 text-accent sm:block"
        viewBox="0 0 420 300"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M-24 232C52 198 148 204 212 245C277 287 340 308 413 246"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M-30 130C58 108 142 104 189 150C245 204 140 260 28 250C-54 243 -86 188 -30 130Z"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      <div className="relative mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-12">
        <div className="pt-2">
          <span className="relative z-10 inline-flex px-3 py-1 text-[19px] font-medium text-foreground">
            Benefits
            <svg
              className="pointer-events-none absolute -inset-3 z-0 h-[calc(100%+24px)] w-[calc(100%+24px)] text-accent"
              viewBox="0 0 190 90"
              fill="none"
              aria-hidden="true"
            >
              <path
                className="label-accent-a"
                d="M18 31C6 8 43 2 95 6C153 10 185 28 177 54C168 82 34 88 17 59C7 43 13 36 18 31"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                className="label-accent-b"
                d="M25 36C18 18 48 9 101 13C151 16 179 31 169 52C158 73 43 77 24 55C18 48 19 41 25 36"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>

        <div>
          <p
            id="benefits-summary-title"
            className="max-w-[1020px] text-[clamp(1.45rem,2.1vw,2rem)] font-medium leading-[1.3] text-foreground"
          >
            Bring campus reporting, routing, and resolution into one clear system so students know
            where issues go and administrators can manage them efficiently.
          </p>

          <div className="mx-auto mt-14 flex w-fit max-w-full flex-col gap-12 sm:flex-row sm:items-start sm:justify-center sm:gap-12 lg:mt-[4.25rem] lg:gap-16">
            {benefitsSummary.map((benefit) => (
              <div key={benefit.metric} className="min-w-0">
                <div className="text-foreground">{benefit.icon}</div>
                <p className="mt-5 whitespace-nowrap text-[clamp(3.25rem,4.5vw,4.5rem)] font-normal leading-none text-foreground">
                  {benefit.metric}
                </p>
                <p className="mt-4 max-w-[230px] text-[16px] leading-[1.35] text-foreground sm:text-[17px]">
                  <span className="font-medium">{benefit.title}</span>
                  <br />
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
