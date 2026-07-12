import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — UpskillsTraining" },
      { name: "description", content: "Career tips, PCO guidance and IT training insights from UpskillsTraining." },
      { property: "og:title", content: "UpskillsTraining Blog" },
      { property: "og:description", content: "Career tips and training insights." },
    ],
  }),
  component: Blog,
});

function Blog() {
  const posts = [
    { t: "Passing the TfL SERU test first time: a 2-week plan", d: "The exact 2-week revision plan our students use." },
    { t: "From zero to helpdesk: your first IT support role", d: "What employers actually want in the first 90 days." },
    { t: "PCO licence in London — the 2026 process, explained", d: "Fees, timelines, medicals and DBS — the honest version." },
  ];
  return (
    <>
      <section className="bg-gradient-to-b from-primary-soft to-background">
        <div className="mx-auto max-w-4xl px-6 py-3">
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">The blog</h1>
          <p className="mt-3 text-muted-foreground">Career tips, course guides and industry news.</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-12 grid gap-6 md:grid-cols-3">
        {posts.map((p) => (
          <article key={p.t} className="rounded-2xl border bg-card p-6 shadow-card">
            <div className="aspect-[16/10] rounded-xl bg-gradient-to-br from-primary to-accent mb-4" />
            <h3 className="font-display text-lg font-bold">{p.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
            <a href="#" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">Read more →</a>
          </article>
        ))}
      </section>
    </>
  );
}
