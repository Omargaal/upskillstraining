import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { CourseCard } from "@/components/CourseCard";
import { ITTrainingLanding } from "@/components/ITTrainingLanding";
import { courses } from "@/lib/courses";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  category: z.enum(["all", "it"]).catch("all"),
});

export const Route = createFileRoute("/courses/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Courses — UpskillsTraining" },
      { name: "description", content: "Browse IT Training courses at UpskillsTraining. PCO Licence training now lives on its own dedicated page." },
      { property: "og:title", content: "Courses — UpskillsTraining" },
      { property: "og:description", content: "IT Training courses to build your tech career. PCO Licence training has its own dedicated page." },
    ],
  }),
  component: CoursesPage,
});

const TABS = [
  { key: "all", label: "All Courses" },
  { key: "it", label: "IT Training" },
] as const;

function CoursesPage() {
  const { category } = Route.useSearch();
  const filtered = category === "all" ? courses.filter((c) => c.category === "it") : courses.filter((c) => c.category === category);

  return (
    <>
      <section className="bg-gradient-to-b from-primary-soft to-background">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <div>
            <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Our Courses</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              IT training courses you can book on their own, with a free consultation to make sure they're right for you. PCO Licence training has moved to its own page.
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
