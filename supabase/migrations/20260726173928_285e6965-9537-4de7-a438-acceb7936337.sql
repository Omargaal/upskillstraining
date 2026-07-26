
-- TIERS
CREATE TABLE public.tiers (
  id text PRIMARY KEY,
  name text NOT NULL,
  tagline text NOT NULL,
  sort_order int NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tiers TO authenticated;
GRANT ALL ON public.tiers TO service_role;
ALTER TABLE public.tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tiers readable by authenticated" ON public.tiers FOR SELECT TO authenticated USING (true);
CREATE POLICY "admins manage tiers" ON public.tiers FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'ogadmin'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'ogadmin'));

-- MODULES
CREATE TABLE public.modules (
  id text PRIMARY KEY,
  tier_id text NOT NULL REFERENCES public.tiers(id) ON DELETE CASCADE,
  number text NOT NULL,
  title text NOT NULL,
  topic text NOT NULL,
  lab text NOT NULL,
  lesson_content text NOT NULL DEFAULT '',
  video_url text,
  sort_order int NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.modules TO authenticated;
GRANT ALL ON public.modules TO service_role;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "modules readable by authenticated" ON public.modules FOR SELECT TO authenticated USING (true);
CREATE POLICY "admins manage modules" ON public.modules FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'ogadmin'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'ogadmin'));

-- ENROLLMENTS
CREATE TABLE public.enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier_id text NOT NULL REFERENCES public.tiers(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, tier_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enrollments TO authenticated;
GRANT ALL ON public.enrollments TO service_role;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own enrollments" ON public.enrollments FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'ogadmin'));
CREATE POLICY "admins manage enrollments" ON public.enrollments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'ogadmin'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'ogadmin'));

-- MODULE PROGRESS
CREATE TABLE public.module_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id text NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.module_progress TO authenticated;
GRANT ALL ON public.module_progress TO service_role;
ALTER TABLE public.module_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own progress" ON public.module_progress FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admins read progress" ON public.module_progress FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'ogadmin'));

-- SEED
INSERT INTO public.tiers (id, name, tagline, sort_order) VALUES
 ('t1','Tier 1 — IT Foundations','Start here if you''re new to IT. Master the fundamentals before you specialise.',1),
 ('t2','Tier 2 — Cloud & Identity','Step into Microsoft 365. Learn Entra ID and get hands-on with Intune.',2),
 ('t3','Tier 3 — Management & Compliance','Take control of the fleet. Policies, apps and zero-touch deployment.',3),
 ('t4','Tier 4 — Automation, Security & Cert Prep','Level up to specialist. Automate at scale and get MD-102 ready.',4);

INSERT INTO public.modules (id, tier_id, number, title, topic, lab, lesson_content, sort_order) VALUES
 ('m01','t1','01','IT Fundamentals','Hardware, software and IT career paths.','Build & document a PC teardown','In this module you will build a solid foundation in IT hardware and software. You will learn to identify components of a modern PC, understand the differences between operating systems, and explore the main career paths in IT — from helpdesk to cloud engineering. By the end you will complete a hands-on PC teardown lab and document your findings.',1),
 ('m02','t1','02','Networking Basics','IP, DNS, DHCP and common topologies.','Design a small office network','Learn how networks move data. This module covers IPv4 addressing, subnetting basics, DNS resolution, DHCP leases, and the most common LAN topologies. You will finish by designing a small office network on paper, including switch/router placement and IP scheme.',2),
 ('m03','t1','03','Operating Systems','Windows install, users and NTFS.','Windows 11 clean install + user setup','Install Windows 11 from scratch, configure local and cloud accounts, and understand NTFS permissions inside-out. Includes a walkthrough of user profile management and the Windows recovery environment.',3),
 ('m04','t2','04','Cloud Identity','Entra ID users, groups and licences.','Configure Entra ID tenant + groups','Move from on-prem thinking to cloud identity. Create a Microsoft Entra ID tenant, add users, build dynamic and assigned groups, and assign Microsoft 365 licences. Understand roles and conditional access at a high level.',4),
 ('m05','t2','05','Intune Fundamentals','Admin centre, enrolment, MDM vs MAM.','Enrol a Windows device in Intune','Get hands-on with Microsoft Intune. Tour the Intune admin centre, understand MDM vs MAM, and enrol your first Windows device. You will see the full flow from device registration to policy sync.',5),
 ('m06','t2','06','Device Configuration','Settings catalog and profiles.','Deploy a device restriction profile','Learn how configuration profiles shape the user experience. Use the settings catalog, deploy a device restriction profile, and validate the result on an enrolled endpoint.',6),
 ('m07','t3','07','Compliance Policies','Rules, remediation and reporting.','Build a compliance policy set','Build compliance policies that enforce encryption, minimum OS versions, and password complexity. Configure remediation actions and understand how compliance feeds into Conditional Access.',7),
 ('m08','t3','08','Application Management','Store apps and Win32 packaging.','Package & deploy a Win32 app','Package a Win32 app using the Microsoft Win32 Content Prep Tool, deploy it via Intune, and validate install/uninstall detection rules. Also covers Store apps and app protection policies (MAM).',8),
 ('m09','t3','09','Windows Autopilot','Registration and deployment profiles.','Run an Autopilot deployment','Register a device hash, build an Autopilot deployment profile, and take a factory-reset device through the full user-driven Autopilot flow.',9),
 ('m10','t4','10','PowerShell & Graph','Automation essentials with Microsoft Graph.','Automate a bulk user task','Automate at scale. Write PowerShell that authenticates against Microsoft Graph and performs a bulk user operation such as licence assignment or group membership change.',10),
 ('m11','t4','11','Security & Defender','Endpoint security and baselines.','Roll out a security baseline','Deploy the Microsoft-recommended security baseline via Intune, onboard devices to Defender for Endpoint, and review the security score for your tenant.',11),
 ('m12','t4','12','Capstone & Cert Prep','Full Intune build + MD-102 prep.','End-to-end Intune capstone build','Bring it all together: build an Intune environment from a clean tenant to a fully-managed device with apps, compliance, Autopilot and security baselines. Finish with a focused MD-102 exam prep session.',12);
