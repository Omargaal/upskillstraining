import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Calendar, PoundSterling, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConsultationModal } from "@/components/ConsultationModal";
import { CourseCard } from "@/components/CourseCard";
import { pcoCourses } from "@/lib/courses";
import heroPcoLicence from "@/assets/hero-pco-licence.png.asset.json";

export const Route = createFileRoute("/pco-licence")({
  head: () => ({
    meta: [
      { title: "PCO Licence — Drive & Earn with UpskillsTraining" },
      { name: "description", content: "Become a licensed PCO driver in London. Drive school runs or Uber, earn up to £3,500 a month, and enjoy flexible hours with reliable income." },
      { property: "og:title", content: "PCO Licence — Drive & Earn with UpskillsTraining" },
      { property: "og:description", content: "Become a licensed PCO driver in London. Drive school runs or Uber, earn up to £3,500 a month, and enjoy flexible hours with reliable income." },
    ],
  }),
  component: PcoLicence,
});

function PcoLicence() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-soft to-background">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-2 lg:items-center lg:py-14">
          <div className="fade-in-up">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">PCO Licence</p>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Drive school runs or Uber.<br />
              <span className="text-primary">Earn up to £3,500 a month.</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              Become a licensed PCO driver in London — flexible hours, reliable income, and full training support from application to your first job.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="hero">
                <a href="#pco-courses">Explore PCO PHV Courses</a>
              </Button>
              <ConsultationModal
                trigger={<Button size="lg" variant="accent">Book a Free Consultation <ArrowRight className="h-4 w-4" /></Button>}
              />
            </div>
          </div>

          <div className="relative fade-in-up">
            <div className="absolute -top-6 -left-6 h-40 w-40 rounded-full bg-accent/40 blur-3xl" />
            <div className="absolute -bottom-8 -right-6 h-52 w-52 rounded-full bg-primary/20 blur-3xl" />
            <div className="block overflow-hidden rounded-3xl shadow-elevated">
              <img
                src={heroPcoLicence.url}
                alt="Licensed PCO driver ready for school runs in London"
                className="w-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y bg-background">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: PoundSterling, title: "Earn up to £3,500/mo", body: "Reliable income for school runs, Uber and private hire." },
            { icon: Calendar, title: "Flexible hours", body: "Choose shifts that fit around your family and lifestyle." },
            { icon: Shield, title: "Licensed & insured", body: "We guide you through TfL licensing, DBS and medical steps." },
            { icon: BadgeCheck, title: "Recognised training", body: "SERU, Topographical and English prep from expert trainers." },
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

      {/* Courses */}
      <section id="pco-courses" className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">PCO Licence Training</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Get licensed to drive.</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              From your first TfL assessment to your issued PCO badge — pick a focused course or take our full support package.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pcoCourses().map((c) => <CourseCard key={c.id} course={c} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl px-6 py-14 text-center">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Ready to start driving?</h2>
          <p className="mt-4 text-lg text-primary-foreground/90">
            Book a free consultation and we'll map out the fastest, most affordable route to your PCO licence.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ConsultationModal
              trigger={<Button size="lg" variant="accent">Book a Free Consultation</Button>}
            />
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
