import { createServerFn } from "@tanstack/react-start";

const responses = [
  {
    keywords: ["report", "submit", "complaint", "issue"],
    reply:
      "You can report a campus problem with its location, category, priority, and details. Campus-Fix then routes it to the right team.",
    action: "report",
  },
  {
    keywords: ["wifi", "wi-fi", "network", "internet"],
    reply:
      "Wi-Fi and network issues are typically routed to IT Services. Include the building, floor, and where the connection fails.",
    action: "report",
  },
  {
    keywords: ["fan", "electric", "electrical", "light", "power"],
    reply:
      "Fan, lighting, and power problems are typically handled by Electrical. Add the room or facility location so the team can find it quickly.",
    action: "report",
  },
  {
    keywords: ["leak", "leakage", "plumbing", "water", "maintenance"],
    reply:
      "Leakage and plumbing issues are routed to Maintenance. Add the exact block, floor, and nearby landmark when you submit the report.",
    action: "report",
  },
  {
    keywords: ["status", "track", "progress", "resolved", "assigned"],
    reply:
      "After submission, Campus-Fix shows the issue moving through Reported, Assigned, In Progress, and Resolved. Open My Issues to follow your reports.",
    action: "status",
  },
  {
    keywords: ["how", "work", "workflow", "campus-fix"],
    reply:
      "Campus-Fix connects reporting, automatic department routing, updates, and resolution tracking in one clear workflow.",
    action: null,
  },
] as const;

export const askCampusFix = createServerFn({ method: "POST" })
  .validator((data: { message: string }) => ({ message: data.message.trim().slice(0, 500) }))
  .handler(async ({ data }) => {
    const message = data.message.toLowerCase();
    const match = responses.find((item) =>
      item.keywords.some((keyword) => message.includes(keyword)),
    );

    return (
      match ?? {
        reply:
          "I can help with reporting an issue, department routing, issue status, and the Campus-Fix workflow. What would you like to know?",
        action: null,
      }
    );
  });
