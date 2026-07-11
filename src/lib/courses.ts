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
    price: "£200 (4 weeks online) or £400 (4 weeks in-class)",
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
    id: "it-fundamentals",
    category: "it",
    title: "Technical Support Fundamentals",
    short: "Hardware, software, OS basics and troubleshooting methodology.",
    description:
      "Your foundation for a career in IT support. Learn how computers work end-to-end, common failure modes, and a repeatable troubleshooting method used by real service desks.",
    duration: "4 weeks",
    price: "From £249 · Funding may be available",
    delivery: "Online or Hybrid",
    requirements: "None. Absolute beginners welcome.",
    syllabus: [
      "PC hardware, peripherals and internals",
      "Operating systems: Windows, macOS and Linux basics",
      "Software installation and updates",
      "Structured troubleshooting methodology",
      "Support ticketing and customer communication",
    ],
    tag: "Part 1 of 5",
  },
  {
    id: "it-networking",
    category: "it",
    title: "Computer Networking Essentials",
    short: "IP, DNS, DHCP, wireless and real-world connectivity troubleshooting.",
    description:
      "Understand how networks really work — from an office LAN to the wider internet — and diagnose the connectivity problems that make up most helpdesk tickets.",
    duration: "4 weeks",
    price: "From £249 · Funding may be available",
    delivery: "Online or Hybrid",
    requirements: "Basic IT familiarity recommended.",
    syllabus: [
      "TCP/IP fundamentals and the OSI model",
      "IP addressing, subnets and DHCP",
      "DNS, routing and NAT in practice",
      "Wi-Fi standards, security and troubleshooting",
      "Diagnostic tools: ping, traceroute, nslookup",
    ],
    tag: "Part 2 of 5",
  },
  {
    id: "it-windows-admin",
    category: "it",
    title: "Windows Administration",
    short: "Users, permissions, file systems and remote access.",
    description:
      "Get hands-on with the day-to-day tools of a Windows administrator. Manage users, secure files, configure remote access and support end-users at scale.",
    duration: "4 weeks",
    price: "From £279 · Funding may be available",
    delivery: "Online or Hybrid",
    requirements: "Comfort with Windows OS.",
    syllabus: [
      "User accounts, groups and profiles",
      "NTFS permissions and shared folders",
      "Windows services and the registry",
      "Remote Desktop, RSAT and PowerShell basics",
      "Backup, recovery and update management",
    ],
    tag: "Part 3 of 5",
  },
  {
    id: "it-security",
    category: "it",
    title: "IT Security & Compliance Basics",
    short: "Threats, encryption, access control and policy essentials.",
    description:
      "Build the security mindset every modern IT professional needs. Understand common attacks, protective controls, and how policy and compliance shape real workplaces.",
    duration: "4 weeks",
    price: "From £279 · Funding may be available",
    delivery: "Online or Hybrid",
    requirements: "Recommended after Networking Essentials.",
    syllabus: [
      "Threat landscape: phishing, malware, ransomware",
      "Authentication, MFA and access control",
      "Encryption at rest and in transit",
      "Endpoint hardening and patching",
      "GDPR, ISO 27001 and workplace policy essentials",
    ],
    tag: "Part 4 of 5",
  },
  {
    id: "it-sysadmin-capstone",
    category: "it",
    title: "System Admin, Automation & Capstone",
    short: "Directory services, scripting and a live ticket-queue capstone project.",
    description:
      "Tie it all together. Manage users at scale with directory services, automate repetitive tasks with scripting, and complete a capstone working a live ticket queue.",
    duration: "4 weeks",
    price: "From £299 · Funding may be available",
    delivery: "Hybrid",
    requirements: "Recommended after Parts 1–4 or equivalent experience.",
    syllabus: [
      "Active Directory and identity management",
      "Group Policy and configuration management",
      "PowerShell / Bash scripting for automation",
      "Monitoring, logging and incident response",
      "Capstone: live ticket queue simulation",
    ],
    tag: "Part 5 of 5",
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
