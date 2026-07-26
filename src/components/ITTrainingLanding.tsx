import { useState } from "react";
import {
  ArrowRight, Sparkles, CheckCircle2, Clock, Layers, Cloud, Shield,
  Terminal, Monitor, Users, Video, GraduationCap, Award, PlayCircle,
  BookOpen, ChevronDown, TrendingUp, Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConsultationModal } from "@/components/ConsultationModal";
import { cn } from "@/lib/utils";

/* ============================================================
 * Curriculum: 4 stackable tiers × 3 modules = 12 modules
 * ============================================================ */
type Tier = {
  id: string;
  name: string;
  tagline: string;
  icon: typeof Layers;
  accent: string; // tailwind text color for numerals + icon
  ring: string;   // border color for tier block
  modules: { n: string; title: string; topic: string; lab: string }[];
  price: { online: number; live: number; inclass: number };
};

const TIERS: Tier[] = [
  {
    id: "t1",
    name: "Tier 1 — IT Foundations",
    tagline: "Start here if you're new to IT. Master the fundamentals before you specialise.",
    icon: Monitor,
    accent: "text-sky-600",
    ring: "border-sky-200",
    price: { online: 129, live: 179, inclass: 249 },
    modules: [
      { n: "01", title: "IT Fundamentals", topic: "Hardware, software and IT career paths.", lab: "Build & document a PC teardown" },
      { n: "02", title: "Networking Basics", topic: "IP, DNS, DHCP and common topologies.", lab: "Design a small office network" },
      { n: "03", title: "Operating Systems", topic: "Windows install, users and NTFS.", lab: "Windows 11 clean install + user setup" },
    ],
  },
  {
    id: "t2",
    name: "Tier 2 — Cloud & Identity",
    tagline: "Step into Microsoft 365. Learn Entra ID and get hands-on with Intune.",
    icon: Cloud,
    accent: "text-blue-700",
    ring: "border-blue-200",
    price: { online: 199, live: 249, inclass: 349 },
    modules: [
      { n: "04", title: "Cloud Identity", topic: "Entra ID users, groups and licences.", lab: "Configure Entra ID tenant + groups" },
      { n: "05", title: "Intune Fundamentals", topic: "Admin centre, enrolment, MDM vs MAM.", lab: "Enrol a Windows device in Intune" },
      { n: "06", title: "Device Configuration", topic: "Settings catalog and profiles.", lab: "Deploy a device restriction profile" },
    ],
  },
  {
    id: "t3",
    name: "Tier 3 — Management & Compliance",
    tagline: "Take control of the fleet. Policies, apps and zero-touch deployment.",
    icon: Shield,
    accent: "text-indigo-700",
    ring: "border-indigo-200",
    price: { online: 199, live: 249, inclass: 349 },
    modules: [
      { n: "07", title: "Compliance Policies", topic: "Rules, remediation and reporting.", lab: "Build a compliance policy set" },
      { n: "08", title: "Application Management", topic: "Store apps and Win32 packaging.", lab: "Package & deploy a Win32 app" },
      { n: "09", title: "Windows Autopilot", topic: "Registration and deployment profiles.", lab: "Run an Autopilot deployment" },
    ],
  },
  {
    id: "t4",
    name: "Tier 4 — Automation, Security & Cert Prep",
    tagline: "Level up to specialist. Automate at scale and get MD-102 ready.",
    icon: Terminal,
    accent: "text-violet-700",
    ring: "border-violet-200",
    price: { online: 249, live: 299, inclass: 399 },
    modules: [
      { n: "10", title: "PowerShell & Graph", topic: "Automation essentials with Microsoft Graph.", lab: "Automate a bulk user task" },
      { n: "11", title: "Security & Defender", topic: "Endpoint security and baselines.", lab: "Roll out a security baseline" },
      { n: "12", title: "Capstone & Cert Prep", topic: "Full Intune build + MD-102 prep.", lab: "End-to-end Intune capstone build" },
    ],
  },
];

const BUNDLE = { online: 649, live: 799, inclass: 1099 };

/* ============================================================ */

const HERO_BADGES = ["Microsoft Intune", "Entra ID", "Windows Autopilot", "MD-102 Aligned"];

const PILLARS = [
  { icon: Layers, title: "4 stackable tiers", body: "Buy one tier at a time or the full bundle. Each tier builds on the last." },
  { icon: PlayCircle, title: "Hands-on labs", body: "12 real labs — build compliance policies, package apps, run Autopilot end-to-end." },
  { icon: Video, title: "Live or self-paced", body: "Learn online at your own pace, add live labs, or join us in-class in London." },
  { icon: Award, title: "MD-102 aligned", body: "Curriculum mapped to Microsoft's Endpoint Administrator certification track." },
];

const DELIVERY = [
  {
    id: "online",
    name: "Self-paced Online",
    tagline: "Learn on your own schedule.",
    icon: Monitor,
    points: ["Full video lessons + downloadable resources", "Access lab guides 24/7", "Community forum support"],
  },
  {
    id: "live",
    name: "Online + Live Labs",
    tagline: "Everything online, plus weekly live sessions.",
    icon: Video,
    points: ["Everything in Self-paced", "Weekly 90-min live lab session", "Instructor Q&A + recordings"],
    highlight: true,
  },
  {
    id: "inclass",
    name: "In-Class (London)",
    tagline: "Small cohort, in-person delivery.",
    icon: Users,
    points: ["Everything in Live Labs", "In-person classroom in London", "Direct 1-on-1 instructor time"],
  },
];

const CAREER = [
  { title: "IT Support Trainee", pay: "£14 – £18/hr", icon: BookOpen },
  { title: "Helpdesk Technician", pay: "£25K – £32K", icon: Headphones },
  { title: "Desktop Support Engineer", pay: "£35K – £45K", icon: Monitor },
  { title: "Endpoint Administrator", pay: "£50K – £65K", icon: Shield },
  { title: "Senior Endpoint Engineer", pay: "£70K – £95K+", icon: TrendingUp },
];

const FAQS = [
  { q: "Do I need IT experience to start?", a: "No. Tier 1 is designed for complete beginners. If you already work in IT support, you can start at Tier 2." },
  { q: "How long does the full course take?", a: "Self-paced students typically finish in 10–14 weeks. Live and In-Class cohorts run over 12 weeks." },
  { q: "Is this aligned to MD-102?", a: "Yes. All four tiers together cover the Microsoft Endpoint Administrator (MD-102) exam objectives, with dedicated cert prep in Tier 4." },
  { q: "Can I pay in instalments?", a: "Yes — we offer monthly payment plans on the full bundle. Ask us on your free consultation." },
  { q: "What if I only want one tier?", a: "Every tier can be purchased on its own. If you later upgrade to the bundle we credit what you've already paid." },
  { q: "Do I get a certificate?", a: "You receive a UpskillsTraining certificate of completion for each tier finished, plus a final course certificate on completing all 4 tiers." },
  { q: "What kit do I need?", a: "A Windows laptop or PC (8GB RAM min). We provide a free Microsoft 365 developer tenant for labs." },
  { q: "Is there a refund policy?", a: "Yes — 14-day money-back guarantee on any tier if you decide it isn't for you." },
];

/* ============================================================ */

export function ITTrainingLanding() {
  return (
    <>
      <Hero />
      <Pillars />
      <Curriculum />
      <DeliveryModes />
      <Pricing />
      <Module0 />
      <CareerOutcomes />
      <FAQ />
      <FinalCTA />
    </>
  );
}

/* ---------- Sections ---------- */

function Hero() {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-slate-50 to-background">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      </div>
      <div className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Modern Endpoint Management · MD-102 track
            </div>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              From zero experience to{" "}
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                enterprise-ready
              </span>{" "}
              IT skills.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              A structured, stackable programme in <strong>Microsoft Intune, Entra ID and Windows Autopilot</strong> — built for career changers, helpdesk staff and IT pros stepping into modern endpoint management.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <a href="#curriculum">View curriculum <ArrowRight className="ml-1 h-4 w-4" /></a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#pricing">See pricing & tiers</a>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {HERO_BADGES.map((b) => (
                <Badge key={b} variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
                  {b}
                </Badge>
              ))}
            </div>
          </div>

          {/* Curriculum peek card */}
          <div className="rounded-3xl border bg-card p-6 shadow-elevated">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Curriculum at a glance</span>
              <span className="text-xs font-mono text-primary">12 modules · 4 tiers</span>
            </div>
            <ul className="mt-4 space-y-2.5">
              {TIERS.map((t) => (
                <li key={t.id} className="flex items-center gap-3 rounded-xl border bg-background/60 px-3 py-2.5">
                  <t.icon className={cn("h-5 w-5 shrink-0", t.accent)} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{t.name}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {t.modules.map((m) => m.title).join(" · ")}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pillars() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((p) => (
          <div key={p.title} className="rounded-2xl border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-elevated">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <p.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-base font-bold">{p.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Curriculum() {
  return (
    <section id="curriculum" className="border-y bg-slate-50/60 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-semibold text-primary">
            <BookOpen className="h-3.5 w-3.5" /> Curriculum
          </div>
          <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">
            Four stackable tiers. Twelve real-world modules.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Every module ships with a hands-on lab — no watching-only. Buy tiers individually as you grow, or grab the full bundle and save.
          </p>
        </div>

        <div className="mt-10 space-y-8">
          {TIERS.map((tier) => (
            <div key={tier.id} className={cn("rounded-3xl border-2 bg-card p-6 shadow-card", tier.ring)}>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className={cn("grid h-11 w-11 place-items-center rounded-xl bg-background border", tier.ring, tier.accent)}>
                    <tier.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">3 modules</div>
                    <h3 className="font-display text-xl font-bold">{tier.name}</h3>
                  </div>
                </div>
                <p className="max-w-md text-sm text-muted-foreground">{tier.tagline}</p>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {tier.modules.map((m) => (
                  <div key={m.n} className="group rounded-2xl border bg-background p-5 transition hover:border-primary/40 hover:shadow-card">
                    <div className="flex items-baseline gap-3">
                      <span className={cn("font-display text-4xl font-black leading-none tabular-nums", tier.accent)}>
                        {m.n}
                      </span>
                      <h4 className="font-display text-base font-bold leading-tight">{m.title}</h4>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{m.topic}</p>
                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2 text-xs">
                      <PlayCircle className="h-3.5 w-3.5 text-primary" />
                      <span className="font-medium text-foreground/80">Lab:</span>
                      <span className="truncate text-muted-foreground">{m.lab}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeliveryModes() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Choose how you learn</h2>
        <p className="mt-3 text-muted-foreground">
          Same curriculum, three ways to consume it. Switch or upgrade any time.
        </p>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {DELIVERY.map((d) => (
          <div
            key={d.id}
            className={cn(
              "rounded-2xl border bg-card p-6 shadow-card",
              d.highlight && "border-primary shadow-elevated ring-2 ring-primary/20"
            )}
          >
            {d.highlight && (
              <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                Most popular
              </div>
            )}
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <d.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold">{d.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{d.tagline}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {d.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-foreground/80">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  const bundleFullOnline = TIERS.reduce((s, t) => s + t.price.online, 0);
  const bundleSave = bundleFullOnline - BUNDLE.online;

  return (
    <section id="pricing" className="border-y bg-slate-50/60 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-semibold text-primary">
            <Award className="h-3.5 w-3.5" /> Transparent pricing
          </div>
          <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">Buy a tier. Or grab the bundle.</h2>
          <p className="mt-3 text-muted-foreground">
            Save <strong className="text-foreground">£{bundleSave}</strong> when you buy the full 4-tier bundle. Instalment plans available on request.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border bg-card shadow-card">
          <div className="hidden grid-cols-[1.6fr_repeat(3,1fr)_auto] gap-4 border-b bg-slate-100/70 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:grid">
            <div>Tier</div>
            <div className="text-right">Online</div>
            <div className="text-right">Online + Live Labs</div>
            <div className="text-right">In-Class</div>
            <div />
          </div>
          {TIERS.map((t) => (
            <div key={t.id} className="grid grid-cols-1 gap-3 border-b px-6 py-5 md:grid-cols-[1.6fr_repeat(3,1fr)_auto] md:items-center md:gap-4">
              <div>
                <div className="font-display text-base font-bold">{t.name}</div>
                <div className="text-xs text-muted-foreground">3 modules · hands-on labs</div>
              </div>
              <PriceCell amount={t.price.online} label="Online" />
              <PriceCell amount={t.price.live} label="Live Labs" />
              <PriceCell amount={t.price.inclass} label="In-Class" />
              <div className="md:justify-self-end">
                <ConsultationModal
                  courseId={t.id}
                  trigger={<Button size="sm" variant="outline">Enquire</Button>}
                />
              </div>
            </div>
          ))}

          <div className="grid grid-cols-1 gap-3 bg-gradient-to-r from-primary/5 to-transparent px-6 py-6 md:grid-cols-[1.6fr_repeat(3,1fr)_auto] md:items-center md:gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">Best value</span>
                <span className="font-display text-lg font-extrabold">Full Bundle — All 4 Tiers</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">All 12 modules · capstone project · certificate</div>
            </div>
            <PriceCell amount={BUNDLE.online} label="Online" strong />
            <PriceCell amount={BUNDLE.live} label="Live Labs" strong />
            <PriceCell amount={BUNDLE.inclass} label="In-Class" strong />
            <div className="md:justify-self-end">
              <ConsultationModal
                courseId="it-bundle"
                trigger={<Button size="sm">Get bundle</Button>}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PriceCell({ amount, label, strong = false }: { amount: number; label: string; strong?: boolean }) {
  return (
    <div className="md:text-right">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground md:hidden">{label}</div>
      <div className={cn("font-display tabular-nums", strong ? "text-2xl font-extrabold text-primary" : "text-xl font-bold")}>
        £{amount}
      </div>
    </div>
  );
}

function Module0() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="overflow-hidden rounded-3xl border bg-gradient-to-br from-primary to-blue-700 p-8 text-primary-foreground shadow-elevated sm:p-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              <PlayCircle className="h-3.5 w-3.5" /> Free · Module 0
            </div>
            <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">
              Orientation & Career Map — try before you buy
            </h2>
            <p className="mt-3 max-w-2xl text-primary-foreground/85">
              Not sure if this is for you? Take our free Module 0. It answers <em>"what is Modern Endpoint Management?"</em>, maps out your career journey, and shows exactly what the paid tiers cover — no card required.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <ConsultationModal
              trigger={<Button size="lg" variant="secondary">Start free orientation</Button>}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function CareerOutcomes() {
  return (
    <section className="border-y bg-slate-50/60 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Where this course takes you</h2>
          <p className="mt-3 text-muted-foreground">
            Roles our alumni move into. Salary ranges are UK averages from job boards for 2025.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CAREER.map((c, i) => (
            <div key={c.title} className="rounded-2xl border bg-card p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <c.icon className="h-5 w-5" />
                </div>
                <span className="font-mono text-xs text-muted-foreground">Step {i + 1}</span>
              </div>
              <div className="mt-4 font-display text-base font-bold leading-tight">{c.title}</div>
              <div className="mt-1 text-sm font-semibold text-primary">{c.pay}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border bg-card px-5 py-4 text-sm shadow-card">
          <GraduationCap className="h-5 w-5 text-primary" />
          <span>
            <strong>MD-102 aligned:</strong> the full 4-tier programme covers the Microsoft Endpoint Administrator exam objectives end-to-end.
          </span>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="text-center">
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Questions, answered</h2>
        <p className="mt-3 text-muted-foreground">Still not sure? Book a free consultation and ask us anything.</p>
      </div>
      <div className="mt-10 divide-y rounded-2xl border bg-card shadow-card">
        {FAQS.map((f, i) => <FAQItem key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />)}
      </div>
    </section>
  );
}

function FAQItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <details className="group" open={open} onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
        <span className="font-semibold">{q}</span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </summary>
      <div className="px-5 pb-5 text-sm text-muted-foreground">{a}</div>
    </details>
  );
}

function FinalCTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="rounded-3xl border bg-card p-8 shadow-elevated sm:p-12">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Ready to build a career in Modern Endpoint Management?</h2>
            <p className="mt-3 text-muted-foreground">
              Book a free, no-obligation consultation. We'll help you pick the right tier and delivery mode for your goals.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ConsultationModal
              trigger={<Button size="lg" variant="accent">Book free consultation</Button>}
            />
            <Button size="lg" variant="outline" asChild>
              <a href="#pricing">See pricing</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
