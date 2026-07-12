export type CourseCategory = "pco" | "it";

export interface Course {
  id: string;
  category: CourseCategory;
  title: string;
  short: string;
  description: string;
  duration: string;
  price: string;
  delivery: string;
  requirements: string;
  syllabus: string[];
  tag?: string;
  externalUrl?: string;
  embedUrl?: string;
}

export const courses: Course[] = [
  {
    id: "pco-topographical",
    category: "pco",
    title: "Topographical Skills Assessment Training",
    short: "Master London route planning and map reading for the TfL topographical test.",
    description:
      "Prepare confidently for the TfL Topographical Skills Assessment with structured practice on maps, route planning and A–Z navigation. Includes mock tests and one-to-one feedback.",
    duration: "4 weeks in-class training, 32hrs in Total",
    price: "£400",
    delivery: "In-Person (London)",
    requirements: "None. Suitable for aspiring PCO/PHV drivers.",
    syllabus: [
      "Reading and interpreting London street maps",
      "Route planning between named locations",
      "Using indexes, grids and postcodes",
      "Time management under exam conditions",
      "Full mock topographical tests with feedback",
    ],
  },
  {
    id: "pco-seru",
    category: "pco",
    title: "SERU Assessment Training",
    short: "TfL SERU prep with bilingual English/Somali support, 350+ questions and mock tests via PassSeruExam.com.",
    description:
      "Prepare for TfL's Safety, Equality and Regulatory Understanding (SERU) assessment with trainer-led support plus full access to PassSeruExam.com — a bilingual English/Somali portal built for London drivers. It includes 350+ realistic TfL questions, 10 study sections, mock tests, sentence-completion practice, voice guidance and a proven pass method. Assessment: 45 minutes, 60% pass mark.",
    duration: "4 weeks in-class training, 32hrs in Total",
    price: "3 Weeks £100 online or £150 4 Week online with Telephone support",
    delivery: "Online or In-Person",
    requirements: "Provisional PCO application or intent to apply.",
    externalUrl: "https://passseruexam.com/",
    syllabus: [
      "London PHV Driver Licensing",
      "Licensing Requirements for PHVs",
      "Carrying out Private Hire Journeys",
      "Staying Safe",
      "Driver Behaviour",
      "Driving and Parking in London",
      "Safer Driving",
      "Being Aware of Equality and Disability",
      "Safeguarding Children and Adults at Risk",
      "Ridesharing",
    ],
  },
  {
    id: "pco-full-support",
    category: "pco",
    title: "PCO Licence Full Support Package",
    short: "End-to-end support from application to licence issue.",
    description:
      "Our complete PCO/PHV licence support: application guidance, DBS help, medical booking assistance, Topographical + SERU + English prep, and dedicated mentor throughout.",
    duration: "4–6 weeks",
    price: "£850",
    delivery: "Hybrid (Online + In-Person)",
    requirements: "UK driving licence held for 3+ years.",
    syllabus: [
      "PCO application walkthrough",
      "DBS and medical booking support",
      "Topographical skills preparation",
      "SERU and English language preparation",
      "Post-licence guidance: platform sign-up, insurance, PHV rental",
    ],
  },
  {
    id: "it-beginner-path",
    category: "it",
    title: "IT Support to Cloud Admin — 12-Week Beginner Path",
    short: "Structured 12-week roadmap from IT fundamentals to Microsoft Intune, Autopilot and endpoint security.",
    description:
      "A guided 12-week learning path built on the Endpoint Mastery Hub curriculum. Move from IT hardware and networking basics through Windows, Microsoft Entra ID, Intune, compliance, application deployment, Autopilot, PowerShell and Defender — finishing with a capstone Intune build and certification prep.",
    duration: "12 weeks · self-paced",
    price: "From £600 · Funding may be available",
    delivery: "Online (Endpoint Mastery Hub) + Hybrid mentoring",
    requirements: "None. Absolute beginners welcome.",
    syllabus: [
      "Week 1 — IT Fundamentals: hardware, software, IT career paths",
      "Week 2 — Networking Basics: IP, DNS, DHCP, topologies",
      "Week 3 — Operating Systems: Windows install, users, NTFS",
      "Week 4 — Cloud Identity: Microsoft Entra ID, users, groups, licences",
      "Week 5 — Intune Fundamentals: admin centre, enrolment, MDM vs MAM",
      "Week 6 — Device Configuration: settings catalog and profiles",
      "Week 7 — Compliance Policies and remediation actions",
      "Week 8 — Application Management: Store apps and Win32 packaging",
      "Week 9 — Windows Autopilot: registration and deployment profiles",
      "Week 10 — PowerShell Essentials and Microsoft Graph",
      "Week 11 — Security and Microsoft Defender for Endpoint",
      "Week 12 — Capstone Intune build and certification prep",
    ],
    tag: "Beginner Path · 12 weeks",
  },
  {
    id: "it-helpdesk-path",
    category: "it",
    title: "Helpdesk to Modern Endpoint Admin — Advanced Path",
    short: "Advanced path for existing IT support staff moving into modern cloud endpoint administration.",
    description:
      "Designed for helpdesk and desktop-support professionals ready to specialise. Deep-dive into modern management architecture, advanced Intune configuration, application deployment, Autopilot mastery, Graph automation and enterprise security using the Endpoint Mastery Hub.",
    duration: "8 weeks · self-paced",
    price: "From £500 · Funding may be available",
    delivery: "Online (Endpoint Mastery Hub) + Hybrid mentoring",
    requirements: "Existing IT support experience or completion of the Beginner Path.",
    syllabus: [
      "Modern management: from on-prem to cloud",
      "Intune deep dive: architecture and advanced enrolment",
      "Configuration and compliance strategies",
      "Application deployment: Win32, LOB, MSI and MAM",
      "Windows Autopilot mastery and pre-provisioning",
      "PowerShell and Microsoft Graph automation",
      "Enterprise security with Defender for Endpoint",
      "Capstone project and certification readiness",
    ],
    tag: "Advanced Path · 8 weeks",
  },
  {
    id: "it-endpoint-intro",
    category: "it",
    title: "Introduction to Endpoint Management",
    short: "Fundamentals of endpoint management, modern device management and key security challenges.",
    description:
      "Learn the fundamentals of endpoint management, why it's critical for modern IT, and how devices, users and security connect. Delivered through the Endpoint Mastery Hub with lessons, readings and a module assessment.",
    duration: "~2 hours · self-paced",
    price: "Included in the Endpoint Mastery Hub",
    delivery: "Online (Endpoint Mastery Hub)",
    requirements: "None.",
    syllabus: [
      "What is endpoint management?",
      "The evolution of device management",
      "Key components of modern endpoint management",
      "Security challenges across the endpoint estate",
      "Module 1 assessment",
    ],
    tag: "Module 1 of 6",
  },
  {
    id: "it-intune-fundamentals",
    category: "it",
    title: "Microsoft Intune Fundamentals",
    short: "Master Intune architecture, environment setup, enrolment and device compliance.",
    description:
      "Hands-on introduction to Microsoft Intune, the cloud-based endpoint management service. Set up an Intune tenant, enrol devices, and understand compliance from day one.",
    duration: "~4 hours · self-paced",
    price: "Included in the Endpoint Mastery Hub",
    delivery: "Online (Endpoint Mastery Hub)",
    requirements: "Basic IT / Windows familiarity.",
    syllabus: [
      "Introduction to Microsoft Intune",
      "Intune architecture and components",
      "Setting up your Intune environment (lab)",
      "Device enrolment methods including Autopilot",
      "Managing device compliance",
      "Module 2 assessment",
    ],
    tag: "Module 2 of 6",
  },
  {
    id: "it-configuration-profiles",
    category: "it",
    title: "Configuration Profiles & Policies",
    short: "Create and deploy configuration profiles across Windows, iOS, macOS and Android.",
    description:
      "Design and deploy configuration profiles to control device settings, security and user experience at scale — including Android Enterprise and Apple platforms — and troubleshoot deployment issues.",
    duration: "~3 hours · self-paced",
    price: "Included in the Endpoint Mastery Hub",
    delivery: "Online (Endpoint Mastery Hub)",
    requirements: "Completion of Intune Fundamentals recommended.",
    syllabus: [
      "Understanding configuration profiles",
      "Creating Windows device profiles (lab)",
      "iOS and macOS configuration",
      "Android Enterprise profiles",
      "Troubleshooting profile deployment",
      "Module 3 assessment",
    ],
    tag: "Module 3 of 6",
  },
  {
    id: "it-application-management",
    category: "it",
    title: "Application Management",
    short: "Deploy Win32 apps, Store apps and app protection policies through Intune.",
    description:
      "Package, deploy and protect apps across your device fleet. Covers Win32 app deployment, the Microsoft Win32 Content Prep Tool, Microsoft Store apps, App Protection Policies (MAM) and App Configuration Policies.",
    duration: "~3.5 hours · self-paced",
    price: "Included in the Endpoint Mastery Hub",
    delivery: "Online (Endpoint Mastery Hub)",
    requirements: "Completion of Intune Fundamentals recommended.",
    syllabus: [
      "Application types in Intune",
      "Deploying Win32 applications (lab)",
      "Microsoft Store apps management",
      "App Protection Policies (MAM)",
      "App Configuration Policies",
      "Module 4 assessment",
    ],
    tag: "Module 4 of 6",
  },
  {
    id: "it-security-compliance",
    category: "it",
    title: "Endpoint Security & Compliance",
    short: "Defender for Endpoint, Conditional Access, security baselines and BitLocker.",
    description:
      "Implement robust endpoint security across managed devices. Integrate Microsoft Defender for Endpoint, build Conditional Access policies, deploy security baselines and manage BitLocker encryption.",
    duration: "~4 hours · self-paced",
    price: "Included in the Endpoint Mastery Hub",
    delivery: "Online (Endpoint Mastery Hub)",
    requirements: "Completion of Intune Fundamentals recommended.",
    syllabus: [
      "Endpoint security overview",
      "Microsoft Defender for Endpoint integration",
      "Conditional Access policies (lab)",
      "Security baselines",
      "Encryption and BitLocker management",
      "Module 5 assessment",
    ],
    tag: "Module 5 of 6",
  },
  {
    id: "it-autopilot-deployment",
    category: "it",
    title: "Windows Autopilot & Deployment",
    short: "Zero-touch provisioning with Autopilot deployment profiles and modes.",
    description:
      "Streamline device provisioning with Windows Autopilot. Learn deployment profiles, user-driven vs self-deploying modes, pre-provisioning and how to troubleshoot Autopilot rollouts.",
    duration: "~3 hours · self-paced",
    price: "Included in the Endpoint Mastery Hub",
    delivery: "Online (Endpoint Mastery Hub)",
    requirements: "Completion of Intune Fundamentals recommended.",
    syllabus: [
      "Introduction to Windows Autopilot",
      "Autopilot deployment profiles",
      "User-driven vs self-deploying mode",
      "Hands-on Autopilot configuration (lab)",
      "Troubleshooting Autopilot deployments",
      "Module 6 assessment",
    ],
    tag: "Module 6 of 6",
  },

  {
    id: "it-cv-interview",
    category: "it",
    title: "CV Workshop and Interview Sessions",
    short: "Build a standout IT CV and practise interview techniques with expert feedback.",
    description:
      "Practical CV writing and interview preparation for IT job seekers. Learn how to present your skills, tailor applications to job descriptions, and answer common interview questions with confidence.",
    duration: "2 Hrs Session",
    price: "Included in each course",
    delivery: "Online or In-Person",
    requirements: "None. Open to anyone preparing for IT roles.",
    syllabus: [
      "CV structure and formatting for IT roles",
      "Tailoring your CV to job descriptions",
      "Highlighting transferable and technical skills",
      "Common interview questions and model answers",
      "Mock interview practice and feedback",
    ],
  },
];

export const getCourse = (id: string) => courses.find((c) => c.id === id);
export const pcoCourses = () => courses.filter((c) => c.category === "pco");
export const itCourses = () => courses.filter((c) => c.category === "it");
