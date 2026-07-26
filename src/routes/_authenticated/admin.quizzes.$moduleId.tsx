import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  adminListQuizQuestions,
  adminCreateQuizQuestion,
  adminUpdateQuizQuestion,
  adminDeleteQuizQuestion,
} from "@/lib/lms.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, Save, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/quizzes/$moduleId")({
  head: () => ({ meta: [{ title: "Edit quiz — Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminQuizEditor,
});

type Option = { id: string; text: string };
type Draft = {
  id?: string;
  questionText: string;
  questionType: "single" | "multi";
  options: Option[];
  correctOptionIds: string[];
  sortOrder: number;
};

function emptyDraft(sortOrder: number): Draft {
  return {
    questionText: "",
    questionType: "single",
    options: [
      { id: "a", text: "" },
      { id: "b", text: "" },
      { id: "c", text: "" },
      { id: "d", text: "" },
    ],
    correctOptionIds: [],
    sortOrder,
  };
}

function AdminQuizEditor() {
  const { moduleId } = Route.useParams();
  const qc = useQueryClient();
  const listFn = useServerFn(adminListQuizQuestions);
  const createFn = useServerFn(adminCreateQuizQuestion);
  const updateFn = useServerFn(adminUpdateQuizQuestion);
  const deleteFn = useServerFn(adminDeleteQuizQuestion);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-quiz", moduleId],
    queryFn: () => listFn({ data: { moduleId } }),
  });

  const [draft, setDraft] = useState<Draft | null>(null);

  function startNew() {
    setDraft(emptyDraft(data?.questions.length ?? 0));
  }
  function startEdit(q: NonNullable<typeof data>["questions"][number]) {
    setDraft({
      id: q.id,
      questionText: q.question_text,
      questionType: q.question_type as "single" | "multi",
      options: (q.options as Option[]) ?? [],
      correctOptionIds: q.correct_option_ids ?? [],
      sortOrder: q.sort_order,
    });
  }

  const saveMut = useMutation({
    mutationFn: async () => {
      if (!draft) return;
      const payload = { ...draft, moduleId };
      if (draft.id) await updateFn({ data: { ...payload, id: draft.id } });
      else await createFn({ data: payload });
    },
    onSuccess: () => {
      toast.success("Saved");
      setDraft(null);
      qc.invalidateQueries({ queryKey: ["admin-quiz", moduleId] });
      qc.invalidateQueries({ queryKey: ["admin-quiz-modules"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-quiz", moduleId] });
      qc.invalidateQueries({ queryKey: ["admin-quiz-modules"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <div className="mx-auto max-w-4xl px-6 py-16">Loading…</div>;
  if (!data) return <div className="mx-auto max-w-4xl px-6 py-16 text-destructive">Forbidden.</div>;

  const canSave =
    !!draft &&
    draft.questionText.trim().length > 0 &&
    draft.options.every((o) => o.text.trim().length > 0) &&
    draft.correctOptionIds.length > 0 &&
    (draft.questionType === "multi" || draft.correctOptionIds.length === 1);

  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <Link to="/admin/quizzes" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to quizzes
      </Link>
      <header className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-primary">Module {data.module.number}</p>
          <h1 className="font-display text-3xl font-extrabold">{data.module.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{data.questions.length} question(s)</p>
        </div>
        {!draft && (
          <Button onClick={startNew}>
            <Plus className="mr-2 h-4 w-4" /> New question
          </Button>
        )}
      </header>

      {draft && (
        <div className="mt-6 rounded-2xl border-2 border-primary/30 bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">{draft.id ? "Edit question" : "New question"}</h2>
            <Button variant="ghost" size="sm" onClick={() => setDraft(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Question</label>
              <Textarea
                rows={2}
                value={draft.questionText}
                onChange={(e) => setDraft({ ...draft, questionText: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-muted-foreground">Type</label>
              <Select
                value={draft.questionType}
                onValueChange={(v: "single" | "multi") =>
                  setDraft({
                    ...draft,
                    questionType: v,
                    correctOptionIds: v === "single" ? draft.correctOptionIds.slice(0, 1) : draft.correctOptionIds,
                  })
                }
              >
                <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single answer</SelectItem>
                  <SelectItem value="multi">Multi-select</SelectItem>
                </SelectContent>
              </Select>
              <label className="ml-auto text-xs font-medium text-muted-foreground">Sort order</label>
              <Input
                type="number"
                className="w-24"
                value={draft.sortOrder}
                onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) || 0 })}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">
                  Options ({draft.questionType === "single" ? "pick one correct" : "check all correct"})
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      options: [
                        ...draft.options,
                        { id: `o${draft.options.length + 1}-${Date.now()}`, text: "" },
                      ],
                    })
                  }
                >
                  <Plus className="mr-1 h-3 w-3" /> Add option
                </Button>
              </div>
              <ul className="mt-2 space-y-2">
                {draft.options.map((opt, i) => {
                  const isCorrect = draft.correctOptionIds.includes(opt.id);
                  return (
                    <li key={opt.id} className="flex items-center gap-2 rounded-lg border p-2">
                      <input
                        type={draft.questionType === "single" ? "radio" : "checkbox"}
                        name="correct"
                        checked={isCorrect}
                        onChange={() => {
                          if (draft.questionType === "single") {
                            setDraft({ ...draft, correctOptionIds: [opt.id] });
                          } else {
                            const s = new Set(draft.correctOptionIds);
                            if (s.has(opt.id)) s.delete(opt.id);
                            else s.add(opt.id);
                            setDraft({ ...draft, correctOptionIds: [...s] });
                          }
                        }}
                        className="h-4 w-4 accent-primary"
                      />
                      <Input
                        placeholder={`Option ${i + 1}`}
                        value={opt.text}
                        onChange={(e) => {
                          const options = draft.options.slice();
                          options[i] = { ...opt, text: e.target.value };
                          setDraft({ ...draft, options });
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={draft.options.length <= 2}
                        onClick={() => {
                          const options = draft.options.filter((o) => o.id !== opt.id);
                          const correctOptionIds = draft.correctOptionIds.filter((id) => id !== opt.id);
                          setDraft({ ...draft, options, correctOptionIds });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex items-center gap-2 border-t pt-4">
              <Button disabled={!canSave || saveMut.isPending} onClick={() => saveMut.mutate()}>
                <Save className="mr-2 h-4 w-4" /> Save
              </Button>
              <Button variant="ghost" onClick={() => setDraft(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      <ul className="mt-8 space-y-3">
        {data.questions.map((q, i) => {
          const opts = (q.options as Option[]) ?? [];
          return (
            <li key={q.id} className="rounded-xl border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="text-xs font-mono text-muted-foreground">
                    Q{i + 1} · {q.question_type === "multi" ? "multi-select" : "single"}
                  </div>
                  <div className="mt-1 font-medium">{q.question_text}</div>
                  <ul className="mt-2 space-y-1 text-sm">
                    {opts.map((o) => {
                      const correct = (q.correct_option_ids ?? []).includes(o.id);
                      return (
                        <li key={o.id} className={correct ? "text-primary" : "text-muted-foreground"}>
                          {correct ? "✓" : "·"} {o.text}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(q)}>Edit</Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (confirm("Delete this question?")) delMut.mutate(q.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </li>
          );
        })}
        {data.questions.length === 0 && !draft && (
          <li className="rounded-xl border-2 border-dashed p-8 text-center text-sm text-muted-foreground">
            No questions yet. Click "New question" to add one.
          </li>
        )}
      </ul>
    </section>
  );
}
