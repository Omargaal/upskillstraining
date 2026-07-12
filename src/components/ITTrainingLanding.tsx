import { Link } from "@tanstack/react-router";
import {
  Sparkles, ArrowRight, Target, Brain, Users, HeadphonesIcon,
  Monitor, Headphones, Laptop, Clock, BookOpen, CheckCircle, Award,
  FileText, MessageSquare, Trophy, Lightbulb, CheckCircle2, Briefcase,
  Star, Quote, FileCheck, GraduationCap, Cloud, Shield, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConsultationModal } from "@/components/ConsultationModal";
import { CareerJourneyMap } from "@/components/CareerJourneyMap";

const pillars = [
  { icon: Target, title: "Proven Process", description: "A practical, step-by-step curriculum validated by industry professionals and successful IT candidates." },
  { icon: Brain, title: "Foundation First", description: "Master IT fundamentals before specialising — no gaps, no confusion, just solid skills." },
  { icon: Users, title: "Community Support", description: "Join fellow IT aspirants, collaborate on labs, get help when stuck and build professional connections." },
  { icon: HeadphonesIcon, title: "Expert Mentorship", description: "Live sessions and direct support from experienced Endpoint Management professionals." },
];

const journeyStages = [
  { title: "IT Novice", salary: "£0 – £12/hr", icon: GraduationCap },
  { title: "IT Support Trainee", salary: "£14 – £18/hr", icon: BookOpen },
  { title: "Helpdesk Technician", salary: "£25K – £32K", icon: Headphones },
  { title: "Desktop Support Engineer", salary: "£35K – £45K", icon: Monitor },
  { title: "Endpoint Administrator", salary: "£50K – £65K", icon: Shield },
  { title: "Senior Endpoint Engineer", salary: "£70K – £95K+", icon: TrendingUp },
];

const learningPaths = [
  {
    id: "beginner",
    title: "Beginner Path",
    subtitle: "Zero IT Experience",
    duration: "12 weeks",
    modules: 12,
    description: "Perfect for career changers with no prior IT experience. Build your foundation from the ground up.",
    highlights: ["IT Fundamentals & Hardware", "Networking Basics", "Cloud Identity (Entra ID)", "Intune Core Concepts"],
    icon: Monitor,
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    courseId: "it-beginner-path",
  },
  {
    id: "helpdesk",
    title: "Helpdesk Transition",
    subtitle: "IT Support Experience",
    duration: "8 weeks",
    modules: 8,
    description: "Designed for IT support professionals ready to specialise in modern endpoint management.",
    highlights: ["Modern management architecture", "Advanced Intune deep-dive", "Autopilot mastery", "Graph & PowerShell automation"],
    icon: Headphones,
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    courseId: "it-helpdesk-path",
  },
  {
    id: "endpoint",
    title: "MD-102 Certification",
    subtitle: "Microsoft Endpoint Administrator",
    duration: "10 weeks",
    modules: 10,
    description: "Comprehensive preparation for the MD-102 exam covering modern endpoint management end-to-end.",
    highlights: ["Intune administration", "Windows Autopilot", "Compliance & security", "Exam prep & practice"],
    icon: Laptop,
    gradient: "from-emerald-500 via-green-500 to-teal-500",
    courseId: "it-autopilot-deployment",
  },
];

const roadmap = [
  { week: "01", title: "IT Fundamentals", topic: "Hardware, software, IT career paths" },
  { week: "02", title: "Networking Basics", topic: "IP, DNS, DHCP, topologies" },
  { week: "03", title: "Operating Systems", topic: "Windows install, users, NTFS" },
  { week: "04", title: "Cloud Identity", topic: "Microsoft Entra ID, users, groups, licences" },
  { week: "05", title: "Intune Fundamentals", topic: "Admin centre, enrolment, MDM vs MAM" },
  { week: "06", title: "Device Configuration", topic: "Settings catalog and profiles" },
  { week: "07", title: "Compliance Policies", topic: "Compliance rules and remediation" },
  { week: "08", title: "Application Management", topic: "Store apps and Win32 packaging" },
  { week: "09", title: "Windows Autopilot", topic: "Registration and deployment profiles" },
  { week: "10", title: "PowerShell & Graph", topic: "Essentials and automation" },
  { week: "11", title: "Security & Defender", topic: "Endpoint security and baselines" },
  { week: "12", title: "Capstone & Cert Prep", topic: "Full Intune build and MD-102 prep" },
];

const interviewSteps = [
  { step: 1, icon: FileText, title: "CV & Profile Optimisation", description: "Craft an IT-focused CV that passes ATS systems and catches recruiters' attention.", points: ["Keyword optimisation for IT roles", "Quantifiable achievements format", "LinkedIn profile alignment"], color: "from-blue-500 to-cyan-500" },
  { step: 2, icon: MessageSquare, title: "Technical Interview Prep", description: "Master technical questions specific to Endpoint Management and IT support.", points: ["Common Intune & SCCM scenarios", "Troubleshooting methodology", "Live lab walkthroughs"], color: "from-cyan-500 to-teal-500" },
  { step: 3, icon: Target, title: "Behavioural Strategy", description: "Prepare compelling STAR-format answers that showcase problem-solving abilities.", points: ["STAR method mastery", "Situational response templates", "Communication soft skills"], color: "from-teal-500 to-emerald-500" },
  { step: 4, icon: Trophy, title: "Mock Interviews", description: "Practice with realistic interview simulations and receive detailed feedback.", points: ["1-on-1 mock sessions", "Panel interview practice", "Personalised improvement plan"], color: "from-emerald-500 to-green-500" },
];

const strategies = [
  { icon: Lightbulb, title: "Research the Company", tip: "Understand their tech stack, recent news and culture before the interview." },
  { icon: Briefcase, title: "Prepare Your Portfolio", tip: "Document lab projects and certifications to demonstrate hands-on experience." },
  { icon: CheckCircle2, title: "Ask Smart Questions", tip: "Prepare thoughtful questions about the team, projects and growth opportunities." },
];

const reviews = [
  { name: "Ahmed K.", role: "Now IT Support Specialist", content: "I spent 2 years watching random tutorials with no progress. This programme gave me the structure I needed. Within 6 months I landed my first IT role." },
  { name: "Sarah M.", role: "Endpoint Administrator", content: "The hands-on labs were a game-changer. In my interview I could demonstrate real Intune and Entra ID skills. Got the job." },
  { name: "David O.", role: "Desktop Support Engineer", content: "Building the foundation first before specialising was the right approach. I feel confident troubleshooting any IT issue now." },
];

export function ITTrainingLanding() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-16 pb-12">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 hero-gradient opacity-[0.08]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/25 rounded-full blur-3xl" />
        </div>
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Modern Endpoint Management Training
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                Start your journey into a{" "}
                <span className="text-gradient">Modern Endpoint Management</span> career
              </h1>
              <p className="mt-5 text-lg text-muted-foreground max-w-xl">
                From zero experience to enterprise-ready skills — guided step by step. Whether you're new
                to IT or transitioning from helpdesk, we have a path for you.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" className="gap-2" asChild>
                  <a href="#learning-paths">Find your path <ArrowRight className="w-5 h-5" /></a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#roadmap">View 12-week roadmap</a>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-8">
                <Stat n="12" label="Week programme" />
                <Stat n="50+" label="Hands-on labs" />
                <Stat n="100%" label="Career-ready" />
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl border bg-card p-6 shadow-glow">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Career journey preview</p>
                <div className="space-y-3">
                  {journeyStages.map((s, i) => (
                    <div key={s.title} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border/60">
                      <div className="w-9 h-9 rounded-lg accent-gradient flex items-center justify-center text-white text-xs font-bold">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{s.title}</p>
                      </div>
                      <span className="text-xs font-mono text-primary shrink-0">{s.salary}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-muted-foreground text-center">
                  Explore the interactive map below ↓
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CAREER JOURNEY MAP (interactive) */}
      <CareerJourneyMap />


      {/* HOW IT WORKS */}
      <section className="py-16 bg-muted/40">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Here's how <span className="text-gradient">it works</span>
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Everything you need to go from IT beginner to Endpoint Management specialist. No guessing — just a clear path.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p) => (
              <div key={p.title} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition">
                  <p.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEARNING PATHS */}
      <section id="learning-paths" className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              choose your path
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Three paths, one <span className="text-gradient">destination</span>
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Pick your starting point. All paths merge into career-ready endpoint management expertise.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPaths.map((p) => (
              <div key={p.id} className="group relative rounded-2xl border bg-card overflow-hidden hover:-translate-y-1 transition shadow-card">
                <div className={`h-1.5 bg-gradient-to-r ${p.gradient}`} />
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center text-white shadow-lg shrink-0`}>
                      <p.icon className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display font-bold text-lg">{p.title}</h3>
                      <p className="text-xs text-muted-foreground">{p.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 pb-4 mb-4 border-b text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{p.duration}</span>
                    <span className="inline-flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{p.modules} modules</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{p.description}</p>
                  <ul className="space-y-2 mb-6">
                    {p.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary shrink-0" /> {h}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full gap-2">
                    <Link to="/courses/$courseId" params={{ courseId: p.courseId }}>
                      Start {p.title} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12-WEEK ROADMAP */}
      <section id="roadmap" className="py-16 bg-muted/40">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              The <span className="text-gradient">12-week roadmap</span>
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              A guided week-by-week path taking you from IT fundamentals to a full Intune capstone build.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {roadmap.map((r) => (
              <div key={r.week} className="rounded-xl border bg-card p-5 hover:shadow-elevated transition">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-display font-extrabold text-2xl text-gradient">{r.week}</span>
                  <h3 className="font-semibold">{r.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{r.topic}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERVIEW PREP */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Trophy className="w-4 h-4" /> Interview Success System
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              How <span className="text-gradient">interview prep works</span>
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Land your dream IT role with our proven system — from CV writing to mock interviews.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
            {interviewSteps.map((s) => (
              <div key={s.step} className="relative rounded-2xl border bg-card p-6 hover:shadow-elevated transition">
                <div className={`absolute -top-3 -left-3 w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} text-white font-bold text-sm flex items-center justify-center shadow-lg`}>
                  {s.step}
                </div>
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shrink-0`}>
                    <s.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{s.description}</p>
                    <ul className="space-y-1.5">
                      {s.points.map((p) => (
                        <li key={p} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="font-display text-2xl font-bold">Pro interview <span className="text-primary">strategies</span></h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {strategies.map((s) => (
                <div key={s.title} className="rounded-xl border bg-muted/40 p-5 hover:bg-primary/5 hover:border-primary/20 transition">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <s.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-1">{s.title}</h4>
                  <p className="text-sm text-muted-foreground">{s.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-16 bg-muted/40">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4">
              <Star className="w-4 h-4 fill-current" /> Student success stories
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              What our <span className="text-gradient">students say</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {reviews.map((r) => (
              <div key={r.name} className="relative rounded-2xl border bg-card p-6 shadow-card">
                <Quote className="w-8 h-8 text-primary/20 absolute top-6 right-6" />
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">"{r.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATION CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="relative hero-gradient rounded-3xl overflow-hidden text-white">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
            </div>
            <div className="relative z-10 p-8 md:p-14 text-center max-w-3xl mx-auto">
              <div className="w-16 h-16 accent-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
                Earn your professional certificate
              </h2>
              <p className="text-white/85 mb-8">
                Complete all modules and pass the final exam to receive your Endpoint Management Professional
                Certificate. Showcase your expertise to employers worldwide.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
                <span className="inline-flex items-center gap-2"><FileCheck className="w-5 h-5 text-accent" /> Verifiable credential</span>
                <span className="inline-flex items-center gap-2"><Trophy className="w-5 h-5 text-accent" /> Industry recognised</span>
                <span className="inline-flex items-center gap-2"><Award className="w-5 h-5 text-accent" /> Lifetime validity</span>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <ConsultationModal
                  courseId="it-beginner-path"
                  trigger={<Button size="lg" variant="accent" className="gap-2">Book a free consultation <ArrowRight className="w-5 h-5" /></Button>}
                />
                <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white">
                  <Link to="/courses/$courseId" params={{ courseId: "it-beginner-path" }}>Begin the beginner path</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <p className="font-display font-extrabold text-3xl">{n}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
