import { useState, useMemo } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getModuleQuiz, submitQuizAttempt } from "@/lib/lms.functions";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Award, RefreshCw } from "lucide-react";
import { toast } from "sonner";

type QuizOption = { id: string; text: string };
type QuizQuestion = {
  id: string;
  question_text: string;
  question_type: "single" | "multi";
  options: QuizOption[];
  sort_order: number;
};

type SubmitResult = {
  score: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  passThreshold: number;
  perQuestion: { questionId: string; correct: boolean; correctIds: string[] }[];
};

export function QuizSection({ moduleId, onPassed }: { moduleId: string; onPassed?: () => void }) {
  const qc = useQueryClient();
  const fetchQuiz = useServerFn(getModuleQuiz);
  const submitFn = useServerFn(submitQuizAttempt);

  const { data, isLoading } = useQuery({
    queryKey: ["module-quiz", moduleId],
    queryFn: () => fetchQuiz({ data: { moduleId } }),
  });

  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [result, setResult] = useState<SubmitResult | null>(null);

  const mutation = useMutation({
    mutationFn: () => submitFn({ data: { moduleId, answers } }),
    onSuccess: (res) => {
      setResult(res as SubmitResult);
      if ((res as SubmitResult).passed) {
        toast.success(`Passed with ${(res as SubmitResult).score}%`);
        qc.invalidateQueries({ queryKey: ["module", moduleId] });
        qc.invalidateQueries({ queryKey: ["my-dashboard"] });
        onPassed?.();
      } else {
        toast.error(`Scored ${(res as SubmitResult).score}% — need ${(res as SubmitResult).passThreshold}% to pass`);
      }
      qc.invalidateQueries({ queryKey: ["module-quiz", moduleId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const questions = (data?.questions ?? []) as QuizQuestion[];
  const attempts = data?.attempts ?? [];
  const bestScore = useMemo(
    () => attempts.reduce((m, a) => Math.max(m, a.score ?? 0), 0),
    [attempts],
  );
  const everPassed = attempts.some((a) => a.passed);

  if (isLoading) {
    return <div className="mt-10 rounded-2xl border bg-muted/40 p-6 text-sm text-muted-foreground">Loading quiz…</div>;
  }
  if (questions.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border bg-muted/40 p-6">
        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Checkpoint quiz</div>
        <div className="mt-1 text-sm text-muted-foreground">No quiz configured for this module yet.</div>
      </div>
    );
  }

  function toggleAnswer(q: QuizQuestion, optId: string) {
    setAnswers((prev) => {
      const cur = new Set(prev[q.id] ?? []);
      if (q.question_type === "single") return { ...prev, [q.id]: [optId] };
      if (cur.has(optId)) cur.delete(optId);
      else cur.add(optId);
      return { ...prev, [q.id]: [...cur] };
    });
  }

  function reset() {
    setAnswers({});
    setResult(null);
  }

  const allAnswered = questions.every((q) => (answers[q.id]?.length ?? 0) > 0);
  const resultById = new Map(result?.perQuestion.map((p) => [p.questionId, p]) ?? []);

  return (
    <div className="mt-10 rounded-2xl border-2 border-primary/20 bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-primary">Checkpoint quiz</div>
          <h3 className="mt-1 font-display text-xl font-bold">
            {questions.length} question{questions.length === 1 ? "" : "s"} · pass at{" "}
            {data?.passThreshold ?? 80}%
          </h3>
        </div>
        {attempts.length > 0 && (
          <div className="text-right text-sm">
            <div className="font-mono">Best: {bestScore}%</div>
            <div className="text-xs text-muted-foreground">
              {attempts.length} attempt{attempts.length === 1 ? "" : "s"}
              {everPassed && " · passed"}
            </div>
          </div>
        )}
      </div>

      {result && (
        <div
          className={`mt-5 rounded-xl border-2 p-4 ${
            result.passed
              ? "border-primary bg-primary/5 text-foreground"
              : "border-destructive/40 bg-destructive/5"
          }`}
        >
          <div className="flex items-center gap-2 font-bold">
            {result.passed ? <Award className="h-5 w-5 text-primary" /> : <XCircle className="h-5 w-5 text-destructive" />}
            {result.passed
              ? `Passed — ${result.score}%`
              : `Not passed yet — ${result.score}% (need ${result.passThreshold}%)`}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {result.correctCount} of {result.totalQuestions} correct.
            {result.passed
              ? " Module marked complete."
              : " Review your answers below and try again."}
          </div>
        </div>
      )}

      <ol className="mt-6 space-y-6">
        {questions.map((q, idx) => {
          const r = resultById.get(q.id);
          const chosen = new Set(answers[q.id] ?? []);
          const correctIds = new Set(r?.correctIds ?? []);
          return (
            <li key={q.id} className="rounded-xl border p-4">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 font-mono text-xs text-muted-foreground">Q{idx + 1}</span>
                <div className="flex-1">
                  <div className="font-medium">{q.question_text}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {q.question_type === "multi" ? "Select all that apply" : "Select one"}
                  </div>
                </div>
                {r && (
                  <span className="shrink-0">
                    {r.correct ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                  </span>
                )}
              </div>
              <ul className="mt-3 space-y-2">
                {q.options.map((opt) => {
                  const isChosen = chosen.has(opt.id);
                  const isCorrect = correctIds.has(opt.id);
                  const showAnswerState = !!r;
                  const base =
                    "flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors";
                  const state = showAnswerState
                    ? isCorrect
                      ? "border-primary bg-primary/5"
                      : isChosen
                        ? "border-destructive/50 bg-destructive/5"
                        : "border-border"
                    : isChosen
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/40";
                  return (
                    <li key={opt.id}>
                      <label className={`${base} ${state}`}>
                        <input
                          type={q.question_type === "single" ? "radio" : "checkbox"}
                          name={`q-${q.id}`}
                          className="h-4 w-4 accent-primary"
                          checked={isChosen}
                          disabled={mutation.isPending}
                          onChange={() => toggleAnswer(q, opt.id)}
                        />
                        <span className="flex-1">{opt.text}</span>
                        {showAnswerState && isCorrect && (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        )}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t pt-5">
        <Button
          size="lg"
          disabled={!allAnswered || mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {result ? "Submit again" : "Submit answers"}
        </Button>
        {(result || Object.keys(answers).length > 0) && (
          <Button variant="ghost" onClick={reset} disabled={mutation.isPending}>
            <RefreshCw className="mr-2 h-4 w-4" /> Reset
          </Button>
        )}
        {!allAnswered && (
          <span className="text-xs text-muted-foreground">Answer every question to submit.</span>
        )}
      </div>

      {attempts.length > 0 && (
        <details className="mt-6 text-sm">
          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
            Attempt history
          </summary>
          <ul className="mt-3 space-y-1">
            {attempts.map((a) => (
              <li key={a.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                <span className="text-xs text-muted-foreground">
                  {new Date(a.created_at).toLocaleString()}
                </span>
                <span className={`font-mono text-xs ${a.passed ? "text-primary" : "text-muted-foreground"}`}>
                  {a.score}% · {a.correct_count}/{a.total_questions} {a.passed ? "· passed" : ""}
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
