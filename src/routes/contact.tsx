import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { ConsultationForm } from "@/components/ConsultationForm";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — UpskillsTraining" },
      { name: "description", content: "Get in touch with UpskillsTraining — phone, email, or book a free consultation." },
      { property: "og:title", content: "Contact UpskillsTraining" },
      { property: "og:description", content: "We'd love to hear from you. Reach us by phone, email or consultation booking." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <>
      <section className="bg-gradient-to-b from-primary-soft to-background">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Contact us</h1>
          <p className="mt-3 text-muted-foreground">Questions before you book? We're friendly, UK-based and happy to help.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 grid gap-10 lg:grid-cols-[320px_1fr]">
        <div className="space-y-6">
          {[
            { icon: Phone, title: "Phone", body: "0203 916 6417" },
            { icon: Mail, title: "Email", body: "hello@upskillstraining.co.uk" },
            { icon: MapPin, title: "Address", body: "1 Training House, London, UK" },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border bg-card p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{c.title}</div>
                  <div className="font-semibold">{c.body}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border bg-card p-8 shadow-card">
          <h2 className="font-display text-2xl font-bold">Book a free consultation</h2>
          <p className="mt-1 text-sm text-muted-foreground">Fastest way to get help — pick a time that suits you.</p>
          <div className="mt-6">
            <ConsultationForm />
          </div>
        </div>
      </section>
    </>
  );
}
