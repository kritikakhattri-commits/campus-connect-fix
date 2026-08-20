export type IssueStatus =
  | "reported"
  | "routed"
  | "acknowledged"
  | "assigned"
  | "in_progress"
  | "resolved";

export type IssuePriority = "normal" | "important" | "safety";

export interface Issue {
  id: string;
  issue_id: string;
  title: string;
  description: string;
  category: string;
  priority: IssuePriority;
  status: IssueStatus;
  building: string;
  floor: string;
  landmark: string;
  image_url: string | null;
  department: string;
  assigned_staff: string | null;
  expected_resolution: string | null;
  public_update: string | null;
  internal_note: string | null;
  submitted_by: string;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

export interface Activity {
  id: string;
  issue_ref: string;
  action: string;
  previous_status: string | null;
  new_status: string | null;
  updated_by: string;
  message: string;
  created_at: string;
}

export interface Department {
  id: string;
  name: string;
  categories: string[];
  avg_hours: number;
  staff: string[];
}

export const CATEGORIES = [
  "Wi-Fi / Network",
  "Electrical",
  "Plumbing",
  "Cleanliness",
  "Infrastructure",
  "Classroom Equipment",
  "Parking",
  "Other",
] as const;

/** Rule-based routing: category -> owning campus department. */
export const ROUTING: Record<string, string> = {
  "Wi-Fi / Network": "IT Services",
  Electrical: "Electrical Department",
  Plumbing: "Maintenance",
  Cleanliness: "Housekeeping",
  Infrastructure: "Maintenance",
  "Classroom Equipment": "Academic Infrastructure",
  Parking: "Campus Security",
  Other: "Academic Infrastructure",
};

export const routeCategory = (category: string) => ROUTING[category] ?? "Academic Infrastructure";

export const BUILDINGS = [
  "Central Library",
  "Academic Block A",
  "Academic Block B",
  "Cafeteria",
  "Hostel A",
  "Hostel B",
  "Sports Complex",
  "Main Parking",
  "Auditorium",
];

export const FLOORS = ["Ground Floor", "Floor 1", "Floor 2", "Floor 3", "Basement", "Outdoor"];

export const STATUS_META: Record<IssueStatus, { label: string; tone: string }> = {
  reported: { label: "Reported", tone: "neutral" },
  routed: { label: "Routed", tone: "info" },
  acknowledged: { label: "Acknowledged", tone: "info" },
  assigned: { label: "Assigned", tone: "pending" },
  in_progress: { label: "In Progress", tone: "pending" },
  resolved: { label: "Resolved", tone: "success" },
};

export const STATUS_ORDER: IssueStatus[] = [
  "reported",
  "routed",
  "acknowledged",
  "assigned",
  "in_progress",
  "resolved",
];

export const PRIORITY_META: Record<IssuePriority, { label: string; tone: string; hint: string }> = {
  normal: {
    label: "Normal",
    tone: "neutral",
    hint: "Inconvenient, but nothing is at risk right now.",
  },
  important: {
    label: "Important",
    tone: "pending",
    hint: "Blocking classes, work or daily campus use.",
  },
  safety: {
    label: "Safety concern",
    tone: "urgent",
    hint: "Risk of injury, electrical hazard, or water/fire damage.",
  },
};

export function toneClasses(tone: string) {
  switch (tone) {
    case "urgent":
      return "bg-urgent-soft text-urgent border-urgent/20";
    case "pending":
      return "bg-pending-soft text-pending border-pending/20";
    case "success":
      return "bg-success-soft text-success border-success/20";
    case "info":
      return "bg-info-soft text-info border-info/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

export function locationLabel(issue: Pick<Issue, "building" | "floor" | "landmark">) {
  return [issue.building, issue.floor, issue.landmark].filter(Boolean).join(" · ");
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min} min ago`;
  const hrs = Math.round(min / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  const days = Math.round(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export function clockTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function reportedLabel(iso: string) {
  const date = new Date(iso);
  const today = new Date();
  const sameDay = date.toDateString() === today.toDateString();
  const yesterday = new Date(today.getTime() - 86400000).toDateString() === date.toDateString();
  if (sameDay) return `Today, ${clockTime(iso)}`;
  if (yesterday) return `Yesterday, ${clockTime(iso)}`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export const OPEN_STATUSES: IssueStatus[] = ["reported", "routed", "acknowledged", "assigned"];
