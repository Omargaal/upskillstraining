import { createFileRoute } from "@tanstack/react-router";
import { ConsultationForm } from "@/components/ConsultationForm";

export const Route = createFileRoute("/book-consultation")({
  head: () => ({
    meta: [
      { title: "Book a Free Consultation — UpskillsTraining" },
      { name: "description", content: "Book a free, no-obligation consultation with UpskillsTraining. Pick your course, time and format." },
      { property: "og:title", content: "Book a Free Consultation — UpskillsTraining" },
      { property: "og:description", content: "Free, no-obligation consultations with our UK training experts." },
    ],
  }),
  component: BookConsultation,
});

function BookConsultation() {
  return (
    <>
      <section className="bg-gradient-to-b from-primary-soft to-background">
        <div className="mx-auto max-w-4xl px-6 py-3 text-center">
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Book a Free Consultation</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Chat with a UK training advisor about the right course for your goals. No obligation, no cost.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-3xl border bg-card p-6 shadow-card">
          <ConsultationForm />
        </div>
      </section>
    </>
  );
}
