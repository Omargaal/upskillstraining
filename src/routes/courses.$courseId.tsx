import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Clock, GraduationCap, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConsultationModal } from "@/components/ConsultationModal";
import { getCourse } from "@/lib/courses";

export const Route = createFileRoute("/courses/$courseId")({
  loader: ({ params }) => {
    const course = getCourse(params.courseId);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.course.title} — UpskillsTraining` },
          { name: "description", content: loaderData.course.short },
          { property: "og:title", content: `${loaderData.course.title} — UpskillsTraining` },
          { property: "og:description", content: loaderData.course.short },
        ]
      : [{ title: "Course not found" }, { name: "robots", content: "noindex" }],
  }),
  component: CourseDetail,
  notFoundComponent: CourseNotFound,
});

function CourseNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Course not found</h1>
      <p className="mt-2 text-muted-foreground">The course you're looking for doesn't exist.</p>
      <Button asChild className="mt-6"><Link to="/courses" search={{ category: "all" }}>Browse all courses</Link></Button>
    </div>
  );
}

function CourseDetail() {
  const { course } = Route.useLoaderData();
  return (
    <>
      <section className="bg-gradient-to-b from-primary-soft to-background">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <Link to="/courses" search={{ category: course.category }} className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to {course.category === "pco" ? "PCO" : "IT"} courses
          </Link>
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="secondary">{course.category === "pco" ? "PCO Licence" : "IT Training"}</Badge>
            {course.tag && <span className="text-xs font-medium text-muted-foreground">{course.tag}</span>}
          </div>
          <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">{course.title}</h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">{course.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <h2 className="font-display text-2xl font-bold">What you'll learn</h2>
          <ul className="mt-4 space-y-3">
            {course.syllabus.map((s: string) => (
              <li key={s} className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                <span className="text-foreground">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="rounded-2xl border bg-card p-5 shadow-card h-fit lg:sticky lg:top-28">
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-primary mt-0.5" />
              <div><div className="font-medium">Duration</div><div className="text-muted-foreground">{course.duration}</div></div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-primary mt-0.5" />
              <div><div className="font-medium">Delivery</div><div className="text-muted-foreground">{course.delivery}</div></div>
            </div>
            <div className="flex items-start gap-3">
              <GraduationCap className="h-4 w-4 text-primary mt-0.5" />
              <div><div className="font-medium">Entry requirements</div><div className="text-muted-foreground">{course.requirements}</div></div>
            </div>
            <div className="border-t pt-4">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Investment</div>
              <div className="text-lg font-bold text-foreground mt-1">{course.price}</div>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <ConsultationModal
              courseId={course.id}
              trigger={<Button variant="accent" className="w-full" size="lg">Book a Free Consultation</Button>}
            />
            <Button asChild variant="outline" className="w-full">
              <a href={`mailto:hello@upskillstraining.co.uk?subject=Enquiry: ${encodeURIComponent(course.title)}`}>
                <Mail className="h-4 w-4" /> Enquire by Email
              </a>
            </Button>
          </div>
        </aside>
      </section>
    </>
  );
}
