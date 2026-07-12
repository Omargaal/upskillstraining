import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Clock, ExternalLink, GraduationCap, Languages, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConsultationModal } from "@/components/ConsultationModal";
import { getCourse } from "@/lib/courses";
import passSeruBadge from "@/assets/passseruexam-badge.png.asset.json";

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
          {course.id === "pco-seru" && (
            <a
              href={course.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 block rounded-2xl border-2 border-primary/20 bg-card p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-elevated hover:border-primary/40"
              aria-label="Visit PassSeruExam.com — bilingual Somali & English SERU portal"
            >
              <img
                src={passSeruBadge.url}
                alt="PassSeruExam.com — Portal for learning SERU. Pass your TfL SERU in Somali or English."
                className="w-full max-w-2xl h-auto rounded-lg"
                loading="lazy"
              />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  <Languages className="h-3.5 w-3.5" /> Somali ↔ English toggle
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <ExternalLink className="h-3.5 w-3.5" /> Open PassSeruExam.com
                </span>
              </div>
            </a>
          )}
        </div>
      </section>

      {course.embedUrl && (
        <section className="mx-auto max-w-6xl px-6 pt-8">
          <div className="rounded-2xl border bg-card p-3 shadow-card">
            <div className="flex items-center justify-between px-2 py-2">
              <h2 className="font-display text-lg font-bold">Course platform</h2>
              <a
                href={course.embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Open in new tab <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="relative w-full overflow-hidden rounded-xl border" style={{ aspectRatio: "16 / 10" }}>
              <iframe
                src={course.embedUrl}
                title={`${course.title} — course platform`}
                className="absolute left-0 w-full"
                style={{ top: "-72px", height: "calc(100% + 72px)" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allow="fullscreen; clipboard-read; clipboard-write"
              />
            </div>

          </div>
        </section>
      )}

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
              {course.pricing ? (
                <div className="mt-2 overflow-hidden rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-2 py-1.5 text-left text-xs font-medium text-muted-foreground">Course</th>
                        <th className="px-2 py-1.5 text-left text-xs font-medium text-muted-foreground">Duration</th>
                        <th className="px-2 py-1.5 text-left text-xs font-medium text-muted-foreground">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {course.pricing.map((tier) => (
                        <tr key={tier.course} className="border-t">
                          <td className="px-2 py-1.5 font-medium">{tier.course}</td>
                          <td className="px-2 py-1.5 text-muted-foreground">{tier.duration}</td>
                          <td className="px-2 py-1.5 font-semibold">{tier.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-lg font-bold text-foreground mt-1">{course.price}</div>
              )}
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <ConsultationModal
              courseId={course.id}
              trigger={<Button variant="accent" className="w-full" size="lg">Book a Free Consultation</Button>}
            />
            <Button asChild variant="outline" className="w-full">
              <a href={`mailto:info@upskillstraining.co.uk?subject=Enquiry: ${encodeURIComponent(course.title)}`}>
                <Mail className="h-4 w-4" /> Enquire by Email
              </a>
            </Button>
            {course.externalUrl && (
              <Button asChild variant="secondary" className="w-full">
                <a href={course.externalUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" /> Visit PassSeruExam.com
                </a>
              </Button>
            )}
          </div>
        </aside>
      </section>
    </>
  );
}
