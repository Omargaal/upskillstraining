import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getMyDashboard } from "@/lib/lms.functions";
import { getMyCertificates } from "@/lib/lms-phase3.functions";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, PlayCircle, Lock, Award } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "My Learning Dashboard — UpskillsTraining" },
      { name: "robots", content: "noindex" },
      { name: "description", content: "Track your IT Training progress and continue learning." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const fetchDashboard = useServerFn(getMyDashboard);
  const fetchCerts = useServerFn(getMyCertificates);
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-dashboard"],
    queryFn: () => fetchDashboard(),
  });
  const { data: certData } = useQuery({
    queryKey: ["my-certificates"],
    queryFn: () => fetchCerts(),
  });

  if (isLoading) return <div className="mx-auto max-w-5xl px-6 py-16">Loading…</div>;
  if (error || !data)
    return (
      <div className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-destructive">Couldn't load your dashboard.</p>
        <Button className="mt-4" onClick={() => router.invalidate()}>Retry</Button>
      </div>
    );

  const { tiers, modules, enrollments, progress } = data;
  const completedIds = new Set(progress.map((p) => p.module_id));
  const enrolledSet = new Set(enrollments);

  // continue learning: first incomplete module in first enrolled tier
  const enrolledTiers = tiers.filter((t) => enrolledSet.has(t.id));
  let nextModule: (typeof modules)[number] | undefined;
  for (const t of enrolledTiers) {
    const tierModules = modules.filter((m) => m.tier_id === t.id);
    nextModule = tierModules.find((m) => !completedIds.has(m.id));
    if (nextModule) break;
  }

  const totalEnrolledModules = modules.filter((m) => enrolledSet.has(m.tier_id));
  const completedCount = totalEnrolledModules.filter((m) => completedIds.has(m.id)).length;
  const overallPct = totalEnrolledModules.length
    ? Math.round((completedCount / totalEnrolledModules.length) * 100)
    : 0;

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">My Learning</p>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            {enrolledTiers.length === 0
              ? "You're not enrolled in any tier yet. Contact your admin to get access."
              : `${completedCount} of ${totalEnrolledModules.length} modules complete · ${overallPct}%`}
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/certificates"><Award className="mr-2 h-4 w-4" />My Certificates{certData?.certificates?.length ? ` (${certData.certificates.length})` : ""}</Link>
        </Button>
      </header>

      {nextModule && (
        <div className="mb-10 rounded-2xl border-2 border-primary/30 bg-primary/5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-primary">Continue learning</div>
              <h2 className="mt-1 font-display text-xl font-bold">
                Module {nextModule.number} — {nextModule.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{nextModule.topic}</p>
            </div>
            <Button asChild size="lg">
              <Link to="/learn/$moduleId" params={{ moduleId: nextModule.id }}>
                <PlayCircle className="mr-2 h-4 w-4" /> Continue
              </Link>
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {tiers.map((tier) => {
          const tierModules = modules
            .filter((m) => m.tier_id === tier.id)
            .sort((a, b) => a.sort_order - b.sort_order);
          const isEnrolled = enrolledSet.has(tier.id);
          const tierCompleted = tierModules.filter((m) => completedIds.has(m.id)).length;
          const pct = tierModules.length ? Math.round((tierCompleted / tierModules.length) * 100) : 0;

          return (
            <div key={tier.id} className="rounded-2xl border bg-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg font-bold">{tier.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{tier.tagline}</p>
                </div>
                {isEnrolled ? (
                  <div className="text-right text-sm">
                    <div className="font-mono">{tierCompleted}/{tierModules.length}</div>
                    <div className="text-xs text-muted-foreground">{pct}% complete</div>
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" /> Not enrolled
                  </span>
                )}
              </div>

              {isEnrolled && (
                <>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-3">
                    {tierModules.map((m, i) => {
                      const done = completedIds.has(m.id);
                      const priorDone = tierModules.slice(0, i).every((p) => completedIds.has(p.id));
                      const locked = !done && !priorDone;
                      const inner = (
                        <>
                          {locked ? (
                            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                          ) : done ? (
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          ) : (
                            <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                          )}
                          <div className="min-w-0">
                            <div className="text-sm font-medium">
                              <span className="font-mono text-muted-foreground">{m.number}</span> {m.title}
                            </div>
                            <div className="truncate text-xs text-muted-foreground">
                              {locked ? "Locked — finish previous module" : m.topic}
                            </div>
                          </div>
                        </>
                      );
                      return (
                        <li key={m.id}>
                          {locked ? (
                            <div
                              className="flex items-start gap-2 rounded-lg border p-3 opacity-60 cursor-not-allowed"
                              aria-disabled="true"
                            >
                              {inner}
                            </div>
                          ) : (
                            <Link
                              to="/learn/$moduleId"
                              params={{ moduleId: m.id }}
                              className="flex items-start gap-2 rounded-lg border p-3 hover:border-primary hover:bg-muted/30 transition-colors"
                            >
                              {inner}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
