
CREATE TABLE public.departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  categories text[] NOT NULL DEFAULT '{}',
  avg_hours numeric NOT NULL DEFAULT 0,
  staff text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.departments TO anon, authenticated;
GRANT ALL ON public.departments TO service_role;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "departments are public" ON public.departments FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL,
  priority text NOT NULL DEFAULT 'normal',
  status text NOT NULL DEFAULT 'reported',
  building text NOT NULL DEFAULT '',
  floor text NOT NULL DEFAULT '',
  landmark text NOT NULL DEFAULT '',
  image_url text,
  department text NOT NULL DEFAULT '',
  assigned_staff text,
  expected_resolution text,
  public_update text,
  internal_note text,
  submitted_by text NOT NULL DEFAULT 'Student',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);
GRANT SELECT, INSERT, UPDATE ON public.issues TO anon, authenticated;
GRANT ALL ON public.issues TO service_role;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "issues readable" ON public.issues FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "issues insertable" ON public.issues FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "issues updatable" ON public.issues FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.issue_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_ref uuid NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  action text NOT NULL,
  previous_status text,
  new_status text,
  updated_by text NOT NULL DEFAULT 'System',
  message text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.issue_activity TO anon, authenticated;
GRANT ALL ON public.issue_activity TO service_role;
ALTER TABLE public.issue_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activity readable" ON public.issue_activity FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "activity insertable" ON public.issue_activity FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE INDEX idx_activity_issue ON public.issue_activity(issue_ref);

INSERT INTO public.departments (name, categories, avg_hours, staff) VALUES
  ('IT Services', ARRAY['Wi-Fi / Network'], 2.1, ARRAY['Ananya P.','Rohit K.','Sneha M.']),
  ('Maintenance', ARRAY['Plumbing','Infrastructure'], 3.8, ARRAY['Rahul S.','Imran A.','Deepak V.']),
  ('Electrical Department', ARRAY['Electrical'], 2.7, ARRAY['Vikram T.','Suresh N.']),
  ('Housekeeping', ARRAY['Cleanliness'], 1.4, ARRAY['Lata R.','Manoj B.']),
  ('Campus Security', ARRAY['Parking'], 1.9, ARRAY['Harpreet S.','Nisha D.']),
  ('Academic Infrastructure', ARRAY['Classroom Equipment','Other'], 3.1, ARRAY['Kavya J.','Arjun L.']);

INSERT INTO public.issues (issue_id, title, description, category, priority, status, building, floor, landmark, department, assigned_staff, public_update, submitted_by, created_at, updated_at, resolved_at) VALUES
 ('CF-2048','Water leakage near Block B','The ceiling near Room 204 is leaking and water is collecting on the floor.','Plumbing','safety','in_progress','Academic Block B','Floor 2','Near Room 204','Maintenance','Rahul S.','Our technician is inspecting the pipeline. Expected resolution: 1:00 PM.','Aditya Verma', now() - interval '12 minutes', now() - interval '4 minutes', NULL),
 ('CF-2047','Wi-Fi unavailable on second floor','No network coverage in the reading hall since morning.','Wi-Fi / Network','normal','acknowledged','Central Library','Floor 2','Reading Hall','IT Services',NULL,NULL,'Aditya Verma', now() - interval '24 minutes', now() - interval '20 minutes', NULL),
 ('CF-2046','Broken ceiling fan','Fan in Room 304 makes a loud noise and stopped rotating.','Electrical','important','assigned','Academic Block A','Floor 3','Room 304','Electrical Department','Vikram T.',NULL,'Aditya Verma', now() - interval '41 minutes', now() - interval '30 minutes', NULL),
 ('CF-2045','Overflowing dustbin near cafeteria','Waste bin has not been cleared since yesterday evening.','Cleanliness','normal','resolved','Cafeteria','Ground Floor','Main entrance','Housekeeping','Lata R.','Bin cleared and collection schedule updated.','Meera Nair', now() - interval '1 day', now() - interval '22 hours', now() - interval '22 hours'),
 ('CF-2044','Parking light not working','Two lights in the visitor parking row are out, area is dark at night.','Parking','safety','in_progress','Main Parking','Ground Floor','Visitor row C','Campus Security','Harpreet S.',NULL,'Karan Mehta', now() - interval '2 hours', now() - interval '1 hour', NULL),
 ('CF-2043','Projector not working','Projector in Seminar Hall does not detect HDMI input.','Classroom Equipment','important','acknowledged','Academic Block A','Floor 1','Seminar Hall','Academic Infrastructure',NULL,NULL,'Meera Nair', now() - interval '3 hours', now() - interval '2 hours', NULL),
 ('CF-2042','Water cooler not functioning','Cooler on hostel ground floor dispenses warm water only.','Infrastructure','normal','reported','Hostel A','Ground Floor','Near warden office','Maintenance',NULL,NULL,'Karan Mehta', now() - interval '5 hours', now() - interval '5 hours', NULL),
 ('CF-2041','Wi-Fi drops repeatedly in Hostel B','Connection disconnects every few minutes in rooms 210-224.','Wi-Fi / Network','important','in_progress','Hostel B','Floor 2','Rooms 210-224','IT Services','Rohit K.','Access point being replaced today.','Sanjana Iyer', now() - interval '8 hours', now() - interval '6 hours', NULL),
 ('CF-2040','Washroom tap running continuously','Tap cannot be closed, water is being wasted.','Plumbing','important','resolved','Sports Complex','Ground Floor','Changing room','Maintenance','Imran A.','Tap washer replaced.','Sanjana Iyer', now() - interval '2 days', now() - interval '2 days', now() - interval '2 days'),
 ('CF-2039','Auditorium microphone not working','Wireless mic has no output during rehearsals.','Classroom Equipment','normal','resolved','Auditorium','Ground Floor','Stage right','Academic Infrastructure','Kavya J.','Receiver battery replaced and tested.','Aditya Verma', now() - interval '3 days', now() - interval '3 days', now() - interval '3 days'),
 ('CF-2038','Broken chair stack in classroom','Six chairs damaged in Room 112.','Infrastructure','normal','resolved','Academic Block B','Floor 1','Room 112','Maintenance','Deepak V.','Chairs replaced.','Meera Nair', now() - interval '4 days', now() - interval '4 days', now() - interval '4 days'),
 ('CF-2037','Corridor light flickering','Flickering tube light on library third floor corridor.','Electrical','normal','resolved','Central Library','Floor 3','East corridor','Electrical Department','Suresh N.','Tube light replaced.','Karan Mehta', now() - interval '5 days', now() - interval '5 days', now() - interval '5 days');

INSERT INTO public.issue_activity (issue_ref, action, previous_status, new_status, updated_by, message, created_at)
SELECT i.id, a.action, a.prev, a.new, a.by, a.msg, i.created_at + a.offs
FROM public.issues i
JOIN (VALUES
  ('CF-2048','Student submitted issue',NULL,'reported','Aditya Verma','We received your report.', interval '0 minute'),
  ('CF-2048','Automatically routed to Maintenance','reported','routed','Campus-Fix','Automatically sent to Campus Maintenance.', interval '1 minute'),
  ('CF-2048','Issue acknowledged by Maintenance','routed','acknowledged','Maintenance','Maintenance team accepted the issue.', interval '9 minutes'),
  ('CF-2048','Assigned to Rahul S.','acknowledged','assigned','Maintenance','Technician assigned.', interval '20 minutes'),
  ('CF-2048','Status changed to In Progress','assigned','in_progress','Rahul S.','Technician on site inspecting the pipeline.', interval '38 minutes'),
  ('CF-2047','Student submitted issue',NULL,'reported','Aditya Verma','We received your report.', interval '0 minute'),
  ('CF-2047','Automatically routed to IT Services','reported','routed','Campus-Fix','Automatically sent to IT Services.', interval '1 minute'),
  ('CF-2047','Issue acknowledged by IT Services','routed','acknowledged','IT Services','Network team accepted the issue.', interval '4 minutes'),
  ('CF-2046','Student submitted issue',NULL,'reported','Aditya Verma','We received your report.', interval '0 minute'),
  ('CF-2046','Automatically routed to Electrical Department','reported','routed','Campus-Fix','Automatically sent to the Electrical Department.', interval '1 minute'),
  ('CF-2046','Assigned to Vikram T.','acknowledged','assigned','Electrical Department','Technician assigned.', interval '11 minutes')
) AS a(iid, action, prev, new, by, msg, offs) ON a.iid = i.issue_id;
