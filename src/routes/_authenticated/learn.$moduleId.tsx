import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getModule, markModuleComplete } from "@/lib/lms.functions";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Circle, Lock } from "lucide-react";
import { toast } from "sonner";
import { QuizSection } from "@/components/QuizSection";

export const Route = createFileRoute("/_authenticated/learn/$moduleId")({
  head: () => ({
    meta: [
      { title: "Learn — UpskillsTraining" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LearnModule,
});

function embedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    if (u.hostname === "youtu.be") return `https://www.youtube.com/embed${u.pathname}`;
    if (u.hostname.includes("vimeo.com")) return `https://player.vimeo.com/video${u.pathname}`;
    return url;
  } catch {
    return null;
  }
}

function LearnModule() {
  const { moduleId } = Route.useParams();
  const router = useRouter();
  const qc = useQueryClient();
  const fetchModule = useServerFn(getModule);
  const markFn = useServerFn(markModuleComplete);

  const { data, isLoading, error } = useQuery({
    queryKey: ["module", moduleId],
    queryFn: () => fetchModule({ data: { moduleId } }),
  });

  const mutation = useMutation({
    mutationFn: (completed: boolean) => markFn({ data: { moduleId, completed } }),
    onSuccess: (_res, completed) => {
      toast.success(completed ? "Module marked complete" : "Marked as not complete");
      qc.invalidateQueries({ queryKey: ["module", moduleId] });
      qc.invalidateQueries({ queryKey: ["my-dashboard"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <div className="mx-auto max-w-4xl px-6 py-16">Loading…</div>;
  if (error || !data)
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-destructive">Couldn't load this module.</p>
        <Button className="mt-4" onClick={() => router.invalidate()}>Retry</Button>
      </div>
    );

  const { module: m, enrolled, completed } = data;
  const video = embedUrl(m.video_url);

  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <header className="mt-4">
        <div className="text-xs font-mono uppercase tracking-wider text-primary">Module {m.number}</div>
        <h1 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">{m.title}</h1>
        <p className="mt-2 text-muted-foreground">{m.topic}</p>
      </header>

      {!enrolled ? (
        <div className="mt-8 rounded-2xl border-2 border-dashed p-8 text-center">
          <Lock className="mx-auto h-8 w-8 text-muted-foreground" />
          <h2 className="mt-3 font-display text-lg font-bold">You're not enrolled in this tier</h2>
          <p className="mt-1 text-sm text-muted-foreground">Contact your admin to gain access to this module.</p>
        </div>
      ) : (
        <>
          {video && (
            <div className="mt-8 aspect-video overflow-hidden rounded-2xl border bg-black">
              <iframe
                src={video}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={m.title}
              />
            </div>
          )}

          <article className="prose prose-slate mt-8 max-w-none whitespace-pre-wrap text-base leading-7">
            {m.lesson_content || "Lesson content coming soon."}
          </article>

          <div className="mt-8 rounded-2xl border bg-muted/40 p-5">
            <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Hands-on lab</div>
            <div className="mt-1 font-medium">{m.lab}</div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3 border-t pt-6">
            <Button
              size="lg"
              variant={completed ? "outline" : "default"}
              disabled={mutation.isPending}
              onClick={() => mutation.mutate(!completed)}
            >
              {completed ? (
                <>
                  <Circle className="mr-2 h-4 w-4" /> Mark as not complete
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Mark complete
                </>
              )}
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/dashboard">Back to dashboard</Link>
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
