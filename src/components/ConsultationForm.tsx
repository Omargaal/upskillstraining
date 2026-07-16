import { useState, type ReactNode } from "react";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { courses } from "@/lib/courses";
import { saveConsultation } from "@/lib/consultation-store";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TIME_SLOTS = [
  "Morning (9am–12pm)",
  "Afternoon (12pm–5pm)",
  "Evening (5pm–8pm)",
];

interface Props {
  defaultCourseId?: string;
  compact?: boolean;
  footer?: ReactNode;
}

export function ConsultationForm({ defaultCourseId, compact, footer }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [courseId, setCourseId] = useState(defaultCourseId ?? courses[0].id);
  const [fmt, setFmt] = useState<"phone" | "video" | "in-person">("video");
  const [date, setDate] = useState<Date | undefined>();
  const [slot, setSlot] = useState(TIME_SLOTS[0]);
  const [notes, setNotes] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      full_name: fullName,
      email,
      phone,
      course_id: courseId,
      format: fmt,
      preferred_date: date ? date.toISOString() : null,
      time_slot: slot,
      notes: notes || null,
    };
    const { error } = await supabase.from("consultations").insert(payload);
    if (error) {
      console.error(error);
      toast.error("Couldn't submit your request. Please try again or call us.");
      setSubmitting(false);
      return;
    }
    saveConsultation({
      fullName, email, phone, courseId, format: fmt,
      date: date ? date.toISOString() : "",
      timeSlot: slot, notes,
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border bg-card p-8 text-center shadow-card">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary-soft text-primary">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-xl font-bold">Thanks, your request has been received.</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Our team will confirm your slot by email within 24 hours.
        </p>
        {footer}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("grid gap-4", compact ? "" : "sm:grid-cols-2")}>
      <div className="grid gap-1.5">
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="phone">Phone number</Label>
        <Input id="phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div className="grid gap-1.5">
        <Label>Course of interest</Label>
        <Select value={courseId} onValueChange={setCourseId}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent className="max-h-72">
            {courses.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1.5">
        <Label>Consultation format</Label>
        <Select value={fmt} onValueChange={(v) => setFmt(v as typeof fmt)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="phone">Phone Call</SelectItem>
            <SelectItem value="video">Video Call</SelectItem>
            <SelectItem value="in-person">In-Person</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1.5">
        <Label>Preferred date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid gap-1.5 sm:col-span-2">
        <Label>Preferred time slot</Label>
        <Select value={slot} onValueChange={setSlot}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {TIME_SLOTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1.5 sm:col-span-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" variant="accent" className="w-full sm:w-auto">
          Request my free consultation
        </Button>
      </div>
    </form>
  );
}
