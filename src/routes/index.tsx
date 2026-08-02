import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, BadgeCheck, GraduationCap, HeartHandshake, Layers, PlayCircle, Sparkles, Users, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CourseCard } from "@/components/CourseCard";
import { ConsultationModal } from "@/components/ConsultationModal";
import { Newsletter } from "@/components/Newsletter";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { itCourses, pcoCourses } from "@/lib/courses";
import md102JobRoles from "@/assets/md102-job-roles.png.asset.json";
import heroPco from "@/assets/hero-pco.jpg";
import heroPcoPass from "@/assets/hero-pco-pass.jpg";
import heroPcoUpload from "@/assets/hero-pco-upload.png.asset.json";

import teamImg from "@/assets/team.jpg";
import aboutHero from "@/assets/about-us-hero.png.asset.json";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-soft to-background">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-3 lg:grid-cols-2 lg:items-center lg:py-4">
          <div className="fade-in-up">
            <Badge className="bg-accent text-accent-foreground hover:bg-accent">
              <Sparkles className="h-3.5 w-3.5" /> UK Training Provider
            </Badge>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Gain tomorrow's<br />
              <span className="text-primary">skills today.</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              UpskillsTraining helps you gain recognised qualifications and start a new career — from PCO Licence prep to a full IT support pathway. Talk to us first, at no cost.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="hero">
                <Link to="/pco-licence">Explore PCO Licence</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/courses">Explore IT Courses</Link>
              </Button>
              <ConsultationModal
                trigger={<Button size="lg" variant="accent">Book a Free Consultation <ArrowRight className="h-4 w-4" /></Button>}
              />
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {[0,1,2,3].map(i => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-primary to-accent" />
                ))}
              </div>
              <span>Trusted by 2,000+ UK learners</span>
            </div>
          </div>

          <div className="relative fade-in-up">
            <div className="absolute -top-6 -left-6 h-40 w-40 rounded-full bg-accent/40 blur-3xl" />
            <div className="absolute -bottom-8 -right-6 h-52 w-52 rounded-full bg-primary/20 blur-3xl" />
            <div className="block overflow-hidden rounded-3xl shadow-elevated">
              <HeroSlideshow
                images={[
                  { src: md102JobRoles.url, alt: "MD-102 Endpoint Administrator job roles and career pathways" },
                  { src: heroPco, alt: "PCO SERU training classroom with learners studying for the TfL test", fit: "fill" },
                  { src: heroPcoPass, alt: "Proud learner holding her PCO licence after passing the TfL exam", fit: "fill" },
                  { src: heroPcoUpload.url, alt: "London PCO Licence application costs and step-by-step requirements guide", fit: "fill" },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y bg-background">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: GraduationCap, title: "Wide range of courses", body: "PCO Licence prep and a 5-part IT training pathway." },
            { icon: Users, title: "Expert trainers", body: "Industry practitioners with UK sector experience." },
            { icon: BadgeCheck, title: "Recognised qualifications", body: "Aligned with TfL, industry and employer standards." },
            { icon: HeartHandshake, title: "Free consultation first", body: "We help you pick the right course before you commit." },
          ].map((f) => (
            <div key={f.title} className="flex gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-7xl px-6 py-14 grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">About Us</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
            Welcome to UpskillsTraining
          </h2>
          <p className="mt-3 text-muted-foreground">
            We're a UK-based vocational training company on a mission to make recognised, career-changing qualifications accessible to everyone. Whether you're stepping into private hire driving or building the technical foundations for an IT support role, our trainers guide you every step of the way.
          </p>
          <p className="mt-3 text-muted-foreground">
            Our approach is simple: understand your goals in a free consultation, match you to the right course, and support you through to certification — and beyond.
          </p>
          <div className="mt-4">
            <Button asChild variant="outline">
              <Link to="/about">Meet the team <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
        <img
          src={aboutHero.url}
          alt="Welcome to UpskillsTraining — comprehensive training from fundamentals to advanced admin and security"
          width={1200}
          height={900}
          loading="lazy"
          className="rounded-3xl shadow-card object-contain aspect-[1024/410] w-full bg-card"
        />
      </section>

      {/* PCO Courses */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">PCO Licence Training</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Get licensed to drive.</h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                From your first TfL assessment to your issued PCO badge — pick a focused course or take our full support package.
              </p>
            </div>
            <Link to="/pco-licence" className="text-sm font-semibold text-primary hover:underline">
              View all PCO courses →
            </Link>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pcoCourses().map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        </div>
      </section>

      {/* IT Training */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">IT Training Courses</p>
              <Badge className="bg-accent text-accent-foreground hover:bg-accent">New</Badge>
            </div>
            <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">From zero experience to enterprise-ready IT skills.</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              A structured, stackable programme in Microsoft Intune, Entra ID and Windows Autopilot — built for career changers, helpdesk staff and IT pros stepping into modern endpoint management.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/courses">View full curriculum <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>

        {/* Pillars */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Layers, title: "4 stackable tiers", body: "Buy one tier at a time or the full bundle. Each tier builds on the last." },
            { icon: PlayCircle, title: "Hands-on labs", body: "12 real labs — compliance policies, app packaging, Autopilot end-to-end." },
            { icon: Video, title: "Live or self-paced", body: "Learn online at your own pace, add live labs, or join us in-class in London." },
            { icon: Award, title: "MD-102 aligned", body: "Curriculum mapped to Microsoft's Endpoint Administrator certification track." },
          ].map((p) => (
            <div key={p.title} className="rounded-2xl border bg-card p-5 shadow-card">
              <p.icon className="h-7 w-7 text-primary" />
              <h3 className="mt-3 font-semibold">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>

        {/* Curriculum at a glance */}
        <div className="mt-8 rounded-3xl border bg-card p-6 shadow-elevated">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Curriculum at a glance</span>
            <span className="text-xs font-mono text-primary">12 modules · 4 tiers</span>
          </div>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { n: "Tier 1", title: "IT Foundations", topic: "Hardware, networking & operating systems" },
              { n: "Tier 2", title: "Cloud & Identity", topic: "Entra ID, Intune enrolment & profiles" },
              { n: "Tier 3", title: "Management & Compliance", topic: "Policies, app management & Autopilot" },
              { n: "Tier 4", title: "Automation, Security & Cert Prep", topic: "PowerShell, Defender & MD-102 capstone" },
            ].map((t) => (
              <li key={t.n} className="flex items-center gap-3 rounded-xl border bg-background/60 px-3 py-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-xs font-bold text-primary">{t.n.split(" ")[1]}</span>
                <div>
                  <div className="text-sm font-semibold">{t.n} — {t.title}</div>
                  <div className="text-xs text-muted-foreground">{t.topic}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild><Link to="/courses">Explore IT Courses <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
            <ConsultationModal trigger={<Button variant="outline">Book a free consultation</Button>} />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 py-10 grid gap-8 sm:grid-cols-3 text-center">
          {[
            { k: "2,000+", v: "Students trained" },
            { k: "50+", v: "Employer partners" },
            { k: "10 years", v: "In UK training" },
          ].map((s) => (
            <div key={s.v}>
              <div className="font-display text-4xl sm:text-5xl font-extrabold text-accent">{s.k}</div>
              <div className="mt-2 text-primary-foreground/80">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <h2 className="font-display text-3xl font-extrabold text-center">What our learners say</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[
            { q: "The SERU prep was brilliant — passed first time. My trainer was patient and knew every detail.", n: "Amir S.", r: "PCO Full Support" },
            { q: "Went from zero IT experience to landing a helpdesk role in six months. The capstone project sealed it.", n: "Priya K.", r: "IT Pathway (1–5)" },
            { q: "Booking a free consultation first meant I picked the right course, not the biggest one. Refreshing.", n: "Daniel O.", r: "Networking Essentials" },
          ].map((t) => (
            <blockquote key={t.n} className="rounded-2xl border bg-card p-6 shadow-card">
              <p className="text-foreground">"{t.q}"</p>
              <footer className="mt-4 text-sm">
                <div className="font-semibold">{t.n}</div>
                <div className="text-muted-foreground">{t.r}</div>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <Newsletter />
    </>
  );
}
