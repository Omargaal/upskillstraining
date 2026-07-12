import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { CourseCard } from "@/components/CourseCard";
import { ITTrainingLanding } from "@/components/ITTrainingLanding";
import { courses } from "@/lib/courses";
import { cn } from "@/lib/utils";
import heroPcoLicence from "@/assets/hero-pco-licence.png.asset.json";

const searchSchema = z.object({
  category: z.enum(["all", "pco", "it"]).catch("all"),
});

export const Route = createFileRoute("/courses/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Courses — UpskillsTraining" },
      { name: "description", content: "Browse PCO Licence and IT Training courses at UpskillsTraining." },
      { property: "og:title", content: "Courses — UpskillsTraining" },
      { property: "og:description", content: "PCO Licence and IT Training — pick the course that fits your goals." },
    ],
  }),
  component: CoursesPage,
});

const TABS = [
  { key: "all", label: "All Courses" },
  { key: "pco", label: "PCO Licence" },
  { key: "it", label: "IT Training" },
] as const;

function CoursesPage() {
  const { category } = Route.useSearch();
  const filtered = category === "all" ? courses : courses.filter((c) => c.category === category);

  return (
    <>
      <section className="bg-gradient-to-b from-primary-soft to-background">
        <div className="mx-auto max-w-7xl px-6 py-10 grid gap-8 lg:grid-cols-[1fr_minmax(0,520px)] lg:items-center">
          <div>
            <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Our Courses</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Every course is bookable on its own, with a free consultation to make sure it's right for you.
            </p>
            <div className="mt-6 inline-flex rounded-full border bg-background p-1 shadow-card">
              {TABS.map((t) => (
                <Link
                  key={t.key}
                  to="/courses"
                  search={{ category: t.key }}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-full transition",
                    category === t.key ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:text-foreground"
                  )}
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </div>
          {category === "pco" && (
            <img
              src={heroPcoLicence.url}
              alt="London PCO Licence application cost breakdown — total £525 including medical, DBS, PHL, SERU, topographical"
              className="w-full max-h-[280px] rounded-2xl shadow-elevated object-contain self-center"
              loading="lazy"
            />
          )}
        </div>
      </section>

      {category === "it" ? (
        <ITTrainingLanding />
      ) : (
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        </section>
      )}
    </>
  );
}
