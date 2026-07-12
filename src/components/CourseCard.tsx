import { Link } from "@tanstack/react-router";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConsultationModal } from "./ConsultationModal";
import type { Course } from "@/lib/courses";

export function CourseCard({ course }: { course: Course }) {
  return (
    <article className="group flex flex-col rounded-2xl border bg-card p-5 shadow-card transition hover:-translate-y-1 hover:shadow-elevated">
      <div className="flex items-center justify-between gap-2">
        <Badge variant="secondary" className="uppercase tracking-wide text-[10px]">
          {course.category === "pco" ? "PCO Licence" : "IT Training"}
        </Badge>
        {course.tag && (
          <span className="text-xs font-medium text-muted-foreground">{course.tag}</span>
        )}
      </div>
      <h3 className="mt-3 font-display text-xl font-bold text-foreground min-h-[3.5rem]">
        {course.title}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">{course.short}</p>
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {course.duration}</span>
        <span>·</span>
        <span className="font-medium text-foreground">{course.price}</span>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button asChild variant="outline" className="flex-1">
          {course.externalUrl ? (
            <a href={course.externalUrl} target="_blank" rel="noopener noreferrer">
              View Course <ArrowRight className="h-4 w-4" />
            </a>
          ) : (
            <Link to="/courses/$courseId" params={{ courseId: course.id }}>
              View Course <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </Button>
        <ConsultationModal
          courseId={course.id}
          trigger={<Button variant="accent" className="flex-1">Free Consultation</Button>}
        />
      </div>
    </article>
  );
}
