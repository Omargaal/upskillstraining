import { createFileRoute } from "@tanstack/react-router";
import teamImg from "@/assets/team.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — UpskillsTraining" },
      { name: "description", content: "UpskillsTraining is a UK-based vocational training company for PCO Licence and IT courses." },
      { property: "og:title", content: "About UpskillsTraining" },
      { property: "og:description", content: "Meet the UK team behind UpskillsTraining." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <section className="bg-gradient-to-b from-primary-soft to-background">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">About UpskillsTraining</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            We're a UK-based vocational training company on a mission to make recognised, career-changing qualifications accessible to everyone.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 grid gap-10 lg:grid-cols-2 lg:items-center">
        <img src={teamImg} alt="Our team" loading="lazy" className="rounded-3xl shadow-card object-cover aspect-[4/3]" />
        <div>
          <h2 className="font-display text-2xl font-bold">Our mission</h2>
          <p className="mt-3 text-muted-foreground">
            Give every learner — whatever their starting point — a clear, supported route into a real career. That means honest advice up front, structured teaching that respects your time, and post-course support that helps you land the job.
          </p>
          <h3 className="mt-6 font-semibold">What guides us</h3>
          <ul className="mt-2 space-y-2 text-muted-foreground">
            <li>· Free consultations before any commitment</li>
            <li>· Recognised, employer-relevant qualifications</li>
            <li>· Practitioners as trainers, not just presenters</li>
            <li>· Flexible online, hybrid and in-person delivery</li>
          </ul>
        </div>
      </section>
    </>
  );
}
