import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminListModulesForQuiz } from "@/lib/lms.functions";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileQuestion } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/quizzes")({
  head: () => ({
    meta: [
      { title: "Quizzes — Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminQuizzesIndex,
});

function AdminQuizzesIndex() {
  const listFn = useServerFn(adminListModulesForQuiz);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-quiz-modules"],
    queryFn: () => listFn(),
  });

  if (isLoading) return <div className="mx-auto max-w-5xl px-6 py-16">Loading…</div>;
  if (error || !data)
    return <div className="mx-auto max-w-5xl px-6 py-16 text-destructive">Forbidden or failed to load.</div>;

  const byTier = new Map<string, typeof data.modules>();
  for (const m of data.modules) {
    const arr = byTier.get(m.tier_id) ?? [];
    arr.push(m);
    byTier.set(m.tier_id, arr);
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Admin</p>
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Checkpoint quizzes</h1>
        <p className="mt-2 text-muted-foreground">
          Author multiple-choice quizzes for each module. Students must score 80%+ to complete a module.
        </p>
      </header>

      <div className="space-y-6">
        {[...byTier.entries()].map(([tierId, mods]) => (
          <div key={tierId} className="rounded-2xl border bg-card p-6">
            <h2 className="font-display text-lg font-bold uppercase tracking-wider">{tierId}</h2>
            <ul className="mt-4 divide-y">
              {mods.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <div className="text-sm font-medium">
                      <span className="font-mono text-muted-foreground">{m.number}</span> {m.title}
                    </div>
                    <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
                      <FileQuestion className="h-3 w-3" />
                      {m.questionCount} question{m.questionCount === 1 ? "" : "s"}
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/admin/quizzes/$moduleId" params={{ moduleId: m.id }}>
                      Edit <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
