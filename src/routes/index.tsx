import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, GraduationCap, HeartHandshake, Sparkles, Users } from "lucide-react";
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
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-2 lg:items-center lg:py-14">
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
                <Link to="/courses" search={{ category: "it" }}>Explore IT Courses</Link>
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
          className="rounded-3xl shadow-card object-cover aspect-[4/3] w-full"
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

      {/* IT Courses */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">IT Training Courses</p>
              <Badge className="bg-accent text-accent-foreground hover:bg-accent">New</Badge>
            </div>
            <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">A career in IT — one course at a time.</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Build a career in IT support and systems administration. Each course can be taken individually or as a full pathway.
            </p>
          </div>
          <Link to="/courses" search={{ category: "it" }} className="text-sm font-semibold text-primary hover:underline">
            View all IT courses →
          </Link>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {itCourses().map((c) => <CourseCard key={c.id} course={c} />)}
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
