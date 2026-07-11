import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ConsultationForm } from "./ConsultationForm";
import { getCourse } from "@/lib/courses";

interface Props {
  courseId?: string;
  trigger: ReactNode;
}

export function ConsultationModal({ courseId, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const course = courseId ? getCourse(courseId) : undefined;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book a Free Consultation</DialogTitle>
          <DialogDescription>
            {course
              ? `Chat with our team about "${course.title}" — no obligation.`
              : "Chat with our team about the right course for you — no obligation."}
          </DialogDescription>
        </DialogHeader>
        <ConsultationForm defaultCourseId={courseId} compact />
      </DialogContent>
    </Dialog>
  );
}
