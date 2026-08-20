import { supabase } from "@/integrations/supabase/client";
import type { Activity, Department, Issue, IssueStatus } from "./campus";
import { routeCategory } from "./campus";

const db = supabase as unknown as {
  from: (table: string) => any;
};

export async function fetchIssues(): Promise<Issue[]> {
  const { data, error } = await db
    .from("issues")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Issue[];
}

export async function fetchIssue(issueId: string): Promise<Issue | null> {
  const { data, error } = await db.from("issues").select("*").eq("issue_id", issueId).maybeSingle();
  if (error) throw error;
  return (data ?? null) as Issue | null;
}

export async function fetchActivity(issueRef: string): Promise<Activity[]> {
  const { data, error } = await db
    .from("issue_activity")
    .select("*")
    .eq("issue_ref", issueRef)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Activity[];
}

export async function fetchDepartments(): Promise<Department[]> {
  const { data, error } = await db.from("departments").select("*").order("name");
  if (error) throw error;
  return (data ?? []) as Department[];
}

export interface NewIssueInput {
  title: string;
  description: string;
  category: string;
  priority: string;
  building: string;
  floor: string;
  landmark: string;
  image_url: string | null;
  submitted_by: string;
}

export async function createIssue(input: NewIssueInput): Promise<Issue> {
  const department = routeCategory(input.category);
  const issueId = `CF-${2100 + Math.floor(Math.random() * 899)}`;

  const { data, error } = await db
    .from("issues")
    .insert({ ...input, issue_id: issueId, department, status: "routed" })
    .select("*")
    .single();
  if (error) throw error;

  const issue = data as Issue;
  await db.from("issue_activity").insert([
    {
      issue_ref: issue.id,
      action: "Student submitted issue",
      new_status: "reported",
      updated_by: input.submitted_by,
      message: "We received your report.",
    },
    {
      issue_ref: issue.id,
      action: `Automatically routed to ${department}`,
      previous_status: "reported",
      new_status: "routed",
      updated_by: "Campus-Fix",
      message: `Category "${input.category}" is handled by ${department}.`,
    },
  ]);
  return issue;
}

export interface IssueUpdateInput {
  status?: IssueStatus;
  department?: string;
  assigned_staff?: string | null;
  expected_resolution?: string | null;
  public_update?: string | null;
  internal_note?: string | null;
}

export async function updateIssue(
  issue: Issue,
  changes: IssueUpdateInput,
  actor = "Campus Admin",
): Promise<Issue> {
  const payload: Record<string, unknown> = { ...changes, updated_at: new Date().toISOString() };
  if (changes.status === "resolved") payload["resolved_at"] = new Date().toISOString();

  const { data, error } = await db
    .from("issues")
    .update(payload)
    .eq("id", issue.id)
    .select("*")
    .single();
  if (error) throw error;

  const entries: Record<string, unknown>[] = [];
  if (changes.status && changes.status !== issue.status) {
    entries.push({
      issue_ref: issue.id,
      action: `Status changed to ${changes.status.replace("_", " ")}`,
      previous_status: issue.status,
      new_status: changes.status,
      updated_by: actor,
      message: "",
    });
  }
  if (changes.department && changes.department !== issue.department) {
    entries.push({
      issue_ref: issue.id,
      action: `Reassigned to ${changes.department}`,
      updated_by: actor,
      message: "",
    });
  }
  if (changes.assigned_staff && changes.assigned_staff !== issue.assigned_staff) {
    entries.push({
      issue_ref: issue.id,
      action: `Assigned to ${changes.assigned_staff}`,
      updated_by: actor,
      message: "",
    });
  }
  if (changes.public_update && changes.public_update !== issue.public_update) {
    entries.push({
      issue_ref: issue.id,
      action: "Update posted for student",
      updated_by: actor,
      message: changes.public_update,
    });
  }
  if (entries.length) await db.from("issue_activity").insert(entries);

  return data as Issue;
}
