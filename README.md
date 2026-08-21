# Campus Connect Fix

Build a complete, polished, responsive web application called Campus-Fix.

Campus-Fix is a centralized campus issue-reporting and resolution platform for universities and colleges.

Its core purpose is simple:

Report. Route. Resolve.

Students frequently encounter everyday campus problems such as broken lights, Wi-Fi failures, water leakage, damaged fans, cleanliness problems, parking issues, classroom equipment failures, electrical issues, and infrastructure problems. Usually students don't know whom to contact, complaints are scattered across WhatsApp/messages/verbal communication, and students don't know whether anything happened after reporting the problem.

Campus-Fix solves this with one transparent system.

A student reports an issue → the issue is categorized → it is routed to the appropriate campus department → the department acknowledges and resolves it → the student can track the complete progress.

PRODUCT PHILOSOPHY

Design this as a real institutional product, not a hackathon concept website.

Imagine this platform is already being used by 20,000 students at a modern university.

The interface should communicate:

Trust

Accountability

Simplicity

Speed

Transparency

Professionalism

The product has two audiences:

Students — young users who expect something extremely simple, fast and intuitive.

Campus Administration — staff members who need clarity, organization, prioritization and operational visibility.

The design therefore needs to feel youthful enough for students while still professional enough that a university administration would confidently adopt it.

VISUAL DIRECTION

Create an exceptionally minimal, premium interface.

Think:

Linear × Notion × modern university portal × civic-tech product

Do NOT create a flashy startup landing page.

Avoid:

excessive gradients

neon colors

huge animations

unnecessary glassmorphism

floating decorative objects

excessive shadows

cartoon illustrations

overly rounded everything

giant marketing headlines

cluttered dashboards

Use whitespace deliberately.

The visual hierarchy should be extremely clear.

Use a warm off-white/light neutral background rather than harsh pure white where appropriate.

Primary text: near-black / charcoal.

Choose ONE sophisticated primary brand color such as deep indigo, university blue or muted violet.

Use status colors only semantically:

Red = urgent

Amber = pending/in progress

Green = resolved

Neutral/blue = acknowledged

Typography should use a clean modern sans-serif such as Inter, Geist, or Manrope.

Use restrained border radii around 10–14px.

Use thin neutral borders instead of heavy shadows.

Animations should be extremely subtle:

150–250ms transitions

gentle hover states

small status transitions

no unnecessary scroll animation

The final result should feel like an award-winning utility product where the design almost disappears because everything is obvious to use.

APPLICATION STRUCTURE

Build BOTH:

Student Portal

and

Administration Dashboard

Include a simple role-selection/demo entry so judges can easily explore both experiences.

1. STUDENT HOME / DASHBOARD

Create a clean navigation bar.

Left:
Campus-Fix logo / wordmark

Navigation:
Home
My Issues
Campus Updates

Right:
student profile/avatar

The main student dashboard should immediately answer:

"What do you want to report?"

Hero area:

Small label:
CAMPUS-FIX

Headline:
Something wrong on campus?
Let's get it fixed.

Supporting text:
"Report campus issues in seconds and track them until they're resolved."

Primary CTA:
Report an Issue

Secondary action:
Track an Issue

Do not make this hero excessively large.

Underneath, provide quick-report categories using clean icon cards:

Wi-Fi & Network

Electrical

Water & Plumbing

Cleanliness

Classroom Equipment

Parking

Infrastructure

Other

Then show:

Your Recent Reports

Example issues:

Wi-Fi unavailable in Library — 2nd Floor
Status: In Progress
Department: IT Services
Reported: Today, 10:42 AM

Water leakage near Block B
Status: Acknowledged
Department: Maintenance
Reported: Yesterday

Broken classroom fan — Room 304
Status: Resolved
Department: Electrical
Reported: Aug 17

Each should be presented as a compact, highly readable issue card.

2. REPORT AN ISSUE FLOW

This is the MOST IMPORTANT student interaction.

Make reporting incredibly easy.

Prefer a clean single-page form or a maximum 2-step process.

Heading:

Report an issue

Subheading:
"Tell us what's wrong. We'll make sure it reaches the right team."

Fields:

Add a photo

Large upload/drop area.

Text:
"Upload a photo of the issue"

Allow camera/upload UI.

Where is it?

Fields:

Campus/Building

Floor

Room or nearby landmark

Option:
Use my current location

What's the problem?

Provide category selection.

Categories:

Wi-Fi / Network

Electrical

Plumbing

Cleanliness

Infrastructure

Classroom Equipment

Parking

Other

Then:

Describe the issue

Textarea placeholder:
"e.g. The ceiling near Room 204 is leaking and water is collecting on the floor."

Priority

Do NOT let every student simply mark everything "Urgent."

Provide:
Normal
Important
Safety concern

Explain each briefly.

Submit

Primary button:
Submit Report

Below:
"Your report will automatically be routed to the relevant campus department."

3. SUCCESS / ACKNOWLEDGEMENT EXPERIENCE

After submitting, don't simply display "Form submitted."

Create a satisfying confirmation state.

Show:

✓ Issue reported

"Your report has been received and routed to the Maintenance Department."

Generate an Issue ID:

#CF-2048

Show:

Reported
✓

Routed to Maintenance
✓

Awaiting acknowledgement
○

CTA:
Track this issue

Secondary:
Report another issue

This moment should reinforce that the student's complaint did not disappear.

4. MY ISSUES

Create a clean issue-management page for students.

Header:

My Issues

Supporting copy:
"Everything you've reported, in one place."

Filters:
All
Open
In Progress
Resolved

Search:
"Search your reports..."

Issue cards/rows should show:

Issue title
Issue ID
Location
Department
Reported date
Priority
Current status

Use compact status pills.

Example:

CF-2048
Water leakage near Block B
Maintenance
In Progress

Clicking an issue opens its detailed tracking page.

5. ISSUE TRACKING PAGE

This is one of the key differentiators.

Heading:

Water leakage near Block B

ID:
#CF-2048

Status:
In Progress

Display the uploaded photo.

Show:
Location
Category
Priority
Reported date
Assigned department

Then create a beautiful vertical progress timeline:

✓ Reported
10:42 AM
"We received your report."

✓ Routed
10:43 AM
"Automatically sent to Campus Maintenance."

✓ Acknowledged
10:51 AM
"Maintenance team accepted the issue."

● In Progress
11:20 AM
"Technician assigned."

○ Resolved

Include an optional staff update:

Update from Maintenance

"Our technician is inspecting the pipeline. Expected resolution: 1:00 PM."

This page should make transparency the hero of the product.

6. ADMINISTRATION DASHBOARD

Switch visual mindset slightly.

This should feel operational, efficient and extremely professional.

Sidebar:

Campus-Fix

Overview
Issues
Departments
Analytics
Locations

Bottom:
Settings
Admin profile

Main header:

Campus Overview

Subheading:
"Monitor, prioritize and resolve campus issues."

Top-right:
Search
Notifications
Admin profile

DASHBOARD KPI CARDS

Show four compact cards:

47
Open Issues

8
Urgent

31
In Progress

126
Resolved This Week

Add:

4.2 hrs
Average Resolution Time

Keep cards minimal.

No huge decorative charts.

7. LIVE ISSUE QUEUE

This should be the central element of the admin dashboard.

Heading:

Active Issues

Create a clean professional table.

Columns:

Issue
Location
Category
Priority
Department
Reported
Status
Action

Example rows:

CF-2048
Water leakage
Block B · Floor 2
Plumbing
Urgent
Maintenance
12 min ago
In Progress

CF-2047
Wi-Fi unavailable
Library · Floor 2
Network
Normal
IT Services
24 min ago
Acknowledged

CF-2046
Broken ceiling fan
Academic Block · Room 304
Electrical
Important
Electrical
41 min ago
Assigned

Provide filters:

All Issues
Urgent
Unassigned
In Progress
Resolved

Additional filters:
Department
Location
Date

Search:
"Search issue ID, location or problem..."

8. ADMIN ISSUE DETAIL

When an administrator clicks an issue, open a detailed operational view.

Left/main area:

Issue photo

Issue:
Water leakage near Block B

#CF-2048

Description

Location

Submitted by:
Student

Reported:
12 minutes ago

Priority:
Urgent

Right panel:

Manage Issue

Status dropdown:
Reported
Acknowledged
Assigned
In Progress
Resolved

Department:
Maintenance

Assign to:
Staff member dropdown

Expected resolution:
Time/date

Internal note field

Public student update field

Button:
Update Issue

Include complete activity history underneath.

Example:

10:42 — Student submitted issue
10:43 — Automatically routed to Maintenance
10:51 — Issue acknowledged by Maintenance
11:02 — Assigned to Rahul S.
11:20 — Status changed to In Progress

9. SMART ROUTING

Demonstrate the core concept clearly.

Campus-Fix should automatically map categories to departments.

Example:

Wi-Fi / Network → IT Services

Fan / Electrical → Electrical Department

Water Leakage → Maintenance

Cleanliness → Housekeeping

Parking → Security / Campus Operations

Classroom Equipment → Academic Infrastructure

When submitting an issue, visually show:

Automatically routed to: IT Services

For the prototype, this can be rule-based rather than actual AI.

Make it feel intelligent without falsely presenting simple rules as AI.

10. DEPARTMENT VIEW

Create a page called:

Departments

Cards/rows:

IT Services
12 Open · Avg 2.1 hrs

Maintenance
18 Open · Avg 3.8 hrs

Electrical
7 Open · Avg 2.7 hrs

Housekeeping
6 Open · Avg 1.4 hrs

Campus Security
4 Open · Avg 1.9 hrs

Clicking a department filters its issues.

11. ANALYTICS

Create a restrained analytics page.

Do not overload it with graphs.

Show useful institutional information:

Issues by Category

Wi-Fi — 31%
Maintenance — 24%
Electrical — 18%
Cleanliness — 14%
Other — 13%

Problem Hotspots

Library Block — 18 reports

Academic Block B — 14 reports

Hostel A — 11 reports

Resolution Performance

Average resolution time:
4.2 hours

Resolved within 24 hours:
91%

Recurring Problems

"Library Floor 2 has received 7 Wi-Fi reports this month."

"Block B has received 4 plumbing reports in the last 14 days."

These insights should visually suggest how Campus-Fix can eventually enable predictive maintenance.

12. CAMPUS UPDATES

Students should also be able to see useful resolution activity.

Create a simple page:

Campus Updates

Examples:

✓ Library Wi-Fi restored
Today · IT Services

✓ Water supply issue resolved — Hostel B
Yesterday · Maintenance

⚠ Electrical maintenance scheduled — Academic Block
Tomorrow · 2:00–3:00 PM

This makes Campus-Fix feel like a living campus utility rather than only a complaint box.

RESPONSIVE DESIGN

The student experience MUST be excellent on mobile.

Students will most likely report problems while physically standing near the issue.

Therefore optimize the report flow heavily for smartphones.

Admin dashboard should be optimized primarily for desktop/tablet while remaining responsive.

PROTOTYPE DATA

Populate the application with believable campus data.

Do not use lorem ipsum.

Use realistic locations such as:

Central Library
Academic Block A
Academic Block B
Cafeteria
Hostel A
Hostel B
Sports Complex
Main Parking
Auditorium

Use realistic problems:

"Wi-Fi unavailable on second floor"

"Water leaking near Room 204"

"Projector not working"

"Broken ceiling fan"

"Overflowing dustbin near cafeteria"

"Parking light not working"

"Water cooler not functioning"

TECHNICAL DIRECTION

Build this as a complete MERN-stack web application.

Required stack:

MongoDB for persistent storage

Express.js for the backend API

React.js for the frontend

Node.js for the server runtime

Tailwind CSS for styling

Lucide icons for interface icons

Do NOT use Next.js for this project.

Structure the project with a clear separation between the React client and Node/Express server.

Suggested architecture:

/client — React frontend

/server — Node.js + Express backend

/server/models — Mongoose models

/server/routes — API routes

/server/controllers — request handling and business logic

/server/middleware — authentication, validation and error handling

Use Mongoose to model and communicate with MongoDB.

Create reusable React components and maintain a clean, scalable component architecture.

The prototype should use actual backend APIs and MongoDB rather than relying only on locally mocked data.

Create REST API endpoints for the important application flows, including:

user/student authentication

admin authentication

submit a new issue

retrieve a student's issues

retrieve a single issue

retrieve all issues for administration

update issue status

assign an issue to a department

update issue priority

add public status updates

fetch department data

fetch dashboard statistics

fetch analytics data

Use role-based access control for at least two roles:

student

admin

For an Ideathon prototype, authentication can remain lightweight, but the architecture should clearly demonstrate how a production version would separate student and administrator permissions.

Suggested MongoDB collections/models:

User

name

email

password/auth identifier

role

studentId if applicable

createdAt

Issue

issueId

title

description

image

category

building

floor

landmark/room

location coordinates if available

priority

status

submittedBy

assignedDepartment

assignedStaff

expectedResolution

publicUpdate

createdAt

updatedAt

resolvedAt

Department

name

supportedCategories

assignedStaff

activeIssues

IssueActivity

issue reference

action

previousStatus

newStatus

updatedBy

message

timestamp

The IssueActivity model should power the tracking timeline shown to students.

Use rule-based smart routing on the backend. When a student chooses a category, the server should automatically assign the appropriate department before saving the issue.

Example routing rules:

Wi-Fi / Network → IT Services

Electrical → Electrical Department

Plumbing → Maintenance

Cleanliness → Housekeeping

Parking → Security / Campus Operations

Classroom Equipment → Academic Infrastructure

Create a clean API layer on the React frontend using fetch or Axios rather than directly coupling components to backend logic.

Use environment variables for values such as:

MongoDB connection URI

server port

authentication secret

image-upload configuration if required

If images are implemented in the prototype, use a practical upload approach such as Cloudinary or another simple image-hosting service, while storing only the resulting URL in MongoDB.

Make all important interactions functional:

Submit report

Category selection

Photo upload UI

Priority selection

Issue filtering

Search

Issue status tracking

Admin status updates

Department assignment

Student/Admin switching

Persist prototype state locally where appropriate so that when an administrator updates an issue, the updated state can also appear in the student tracking experience.

IMPORTANT UX PRINCIPLE

At every stage, answer one question clearly.

Student:
"Did someone actually receive my problem?"

Admin:
"What needs attention right now?"

Campus leadership:
"Where are problems repeatedly happening?"

Campus-Fix should make these answers immediately visible.

FINAL PRODUCT FEEL

The final application should NOT look like something created just to impress judges visually.

It should impress judges because it feels deployable.

Someone looking at the prototype should immediately think:

"Our university could actually use this."

Prioritize:

clarity over decoration
function over effects
information hierarchy over visual noise
trust over trendiness
speed over complexity

Make every screen polished enough for an Ideathon presentation while remaining realistic enough to become an actual campus product.

Brand tagline:

Campus-Fix — Report. Route. Resolve.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
