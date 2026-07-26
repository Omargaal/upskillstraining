import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getMyDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [tiersRes, modulesRes, enrollRes, progRes] = await Promise.all([
      supabase.from("tiers").select("*").order("sort_order"),
      supabase.from("modules").select("*").order("sort_order"),
      supabase.from("enrollments").select("tier_id").eq("user_id", userId),
      supabase.from("module_progress").select("module_id, completed_at").eq("user_id", userId),
    ]);
    if (tiersRes.error) throw tiersRes.error;
    if (modulesRes.error) throw modulesRes.error;
    if (enrollRes.error) throw enrollRes.error;
    if (progRes.error) throw progRes.error;
    return {
      tiers: tiersRes.data ?? [],
      modules: modulesRes.data ?? [],
      enrollments: (enrollRes.data ?? []).map((e) => e.tier_id),
      progress: progRes.data ?? [],
    };
  });

export const getModule = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { moduleId: string }) => z.object({ moduleId: z.string() }).parse(d))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const modRes = await supabase.from("modules").select("*").eq("id", data.moduleId).single();
    if (modRes.error) throw modRes.error;
    const enrRes = await supabase
      .from("enrollments")
      .select("tier_id")
      .eq("user_id", userId)
      .eq("tier_id", modRes.data.tier_id)
      .maybeSingle();
    if (enrRes.error) throw enrRes.error;
    const progRes = await supabase
      .from("module_progress")
      .select("completed_at")
      .eq("user_id", userId)
      .eq("module_id", data.moduleId)
      .maybeSingle();
    return {
      module: modRes.data,
      enrolled: !!enrRes.data,
      completed: !!progRes.data,
    };
  });

export const markModuleComplete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { moduleId: string; completed: boolean }) =>
    z.object({ moduleId: z.string(), completed: z.boolean() }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    if (data.completed) {
      const { error } = await supabase
        .from("module_progress")
        .upsert({ user_id: userId, module_id: data.moduleId }, { onConflict: "user_id,module_id" });
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("module_progress")
        .delete()
        .eq("user_id", userId)
        .eq("module_id", data.moduleId);
      if (error) throw error;
    }
    return { ok: true };
  });

// -------- Admin --------

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const [{ data: a }, { data: o }] = await Promise.all([
    ctx.supabase.rpc("has_role", { _user_id: ctx.userId, _role: "admin" }),
    ctx.supabase.rpc("has_role", { _user_id: ctx.userId, _role: "ogadmin" }),
  ]);
  if (!a && !o) throw new Error("Forbidden");
}

export const adminListEnrollments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [enrRes, tiersRes, usersRes] = await Promise.all([
      supabaseAdmin.from("enrollments").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("tiers").select("id,name").order("sort_order"),
      supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }),
    ]);
    if (enrRes.error) throw enrRes.error;
    if (tiersRes.error) throw tiersRes.error;
    const users = (usersRes.data?.users ?? []).map((u) => ({ id: u.id, email: u.email ?? "" }));
    return { enrollments: enrRes.data ?? [], tiers: tiersRes.data ?? [], users };
  });

export const adminEnrollUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string; tierId: string }) =>
    z.object({ userId: z.string().uuid(), tierId: z.string() }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("enrollments")
      .upsert({ user_id: data.userId, tier_id: data.tierId }, { onConflict: "user_id,tier_id" });
    if (error) throw error;
    return { ok: true };
  });

export const adminRevokeEnrollment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string; tierId: string }) =>
    z.object({ userId: z.string().uuid(), tierId: z.string() }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("enrollments")
      .delete()
      .eq("user_id", data.userId)
      .eq("tier_id", data.tierId);
    if (error) throw error;
    return { ok: true };
  });

export const adminUpdateModule = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { moduleId: string; lesson_content?: string; video_url?: string | null }) =>
    z
      .object({
        moduleId: z.string(),
        lesson_content: z.string().optional(),
        video_url: z.string().url().nullable().optional(),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const patch: { updated_at: string; lesson_content?: string; video_url?: string | null } = {
      updated_at: new Date().toISOString(),
    };
    if (data.lesson_content !== undefined) patch.lesson_content = data.lesson_content;
    if (data.video_url !== undefined) patch.video_url = data.video_url;
    const { error } = await supabaseAdmin.from("modules").update(patch).eq("id", data.moduleId);
    if (error) throw error;
    return { ok: true };
  });

// -------- Quizzes --------

const PASS_THRESHOLD = 80;

export const getModuleQuiz = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { moduleId: string }) => z.object({ moduleId: z.string() }).parse(d))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const qRes = await supabase
      .from("quiz_questions")
      .select("id, question_text, question_type, options, sort_order")
      .eq("module_id", data.moduleId)
      .order("sort_order");
    if (qRes.error) throw qRes.error;
    const aRes = await supabase
      .from("quiz_attempts")
      .select("id, score, passed, correct_count, total_questions, created_at")
      .eq("user_id", userId)
      .eq("module_id", data.moduleId)
      .order("created_at", { ascending: false })
      .limit(10);
    if (aRes.error) throw aRes.error;
    return {
      questions: qRes.data ?? [],
      attempts: aRes.data ?? [],
      passThreshold: PASS_THRESHOLD,
    };
  });

export const submitQuizAttempt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { moduleId: string; answers: Record<string, string[]> }) =>
    z
      .object({
        moduleId: z.string(),
        answers: z.record(z.string(), z.array(z.string())),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const qRes = await supabase
      .from("quiz_questions")
      .select("id, question_type, correct_option_ids")
      .eq("module_id", data.moduleId);
    if (qRes.error) throw qRes.error;
    const questions = qRes.data ?? [];
    if (questions.length === 0) throw new Error("No quiz for this module");

    const perQuestion: { questionId: string; correct: boolean; correctIds: string[] }[] = [];
    let correctCount = 0;
    for (const q of questions) {
      const chosen = new Set((data.answers[q.id] ?? []).map(String));
      const expected = new Set((q.correct_option_ids ?? []).map(String));
      const isCorrect =
        chosen.size === expected.size && [...expected].every((x) => chosen.has(x));
      if (isCorrect) correctCount += 1;
      perQuestion.push({ questionId: q.id, correct: isCorrect, correctIds: [...expected] });
    }
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= PASS_THRESHOLD;

    const ins = await supabase.from("quiz_attempts").insert({
      user_id: userId,
      module_id: data.moduleId,
      score,
      passed,
      total_questions: questions.length,
      correct_count: correctCount,
      answers: data.answers,
    });
    if (ins.error) throw ins.error;

    if (passed) {
      const up = await supabase
        .from("module_progress")
        .upsert(
          { user_id: userId, module_id: data.moduleId },
          { onConflict: "user_id,module_id" },
        );
      if (up.error) throw up.error;
    }

    return {
      score,
      passed,
      correctCount,
      totalQuestions: questions.length,
      passThreshold: PASS_THRESHOLD,
      perQuestion,
    };
  });

// -------- Admin quiz authoring --------

const QuestionInput = z.object({
  moduleId: z.string(),
  questionText: z.string().min(1),
  questionType: z.enum(["single", "multi"]),
  options: z.array(z.object({ id: z.string().min(1), text: z.string().min(1) })).min(2),
  correctOptionIds: z.array(z.string().min(1)).min(1),
  sortOrder: z.number().int().nonnegative().default(0),
});

export const adminListQuizQuestions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { moduleId: string }) => z.object({ moduleId: z.string() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [qRes, mRes] = await Promise.all([
      supabaseAdmin
        .from("quiz_questions")
        .select("*")
        .eq("module_id", data.moduleId)
        .order("sort_order"),
      supabaseAdmin.from("modules").select("id, number, title").eq("id", data.moduleId).single(),
    ]);
    if (qRes.error) throw qRes.error;
    if (mRes.error) throw mRes.error;
    return { questions: qRes.data ?? [], module: mRes.data };
  });

export const adminListModulesForQuiz = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [mRes, qRes] = await Promise.all([
      supabaseAdmin.from("modules").select("id, number, title, tier_id").order("sort_order"),
      supabaseAdmin.from("quiz_questions").select("module_id"),
    ]);
    if (mRes.error) throw mRes.error;
    if (qRes.error) throw qRes.error;
    const counts = new Map<string, number>();
    for (const r of qRes.data ?? []) counts.set(r.module_id, (counts.get(r.module_id) ?? 0) + 1);
    return {
      modules: (mRes.data ?? []).map((m) => ({ ...m, questionCount: counts.get(m.id) ?? 0 })),
    };
  });

export const adminCreateQuizQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => QuestionInput.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("quiz_questions").insert({
      module_id: data.moduleId,
      question_text: data.questionText,
      question_type: data.questionType,
      options: data.options,
      correct_option_ids: data.correctOptionIds,
      sort_order: data.sortOrder,
    });
    if (error) throw error;
    return { ok: true };
  });

export const adminUpdateQuizQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    QuestionInput.extend({ id: z.string().uuid() }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("quiz_questions")
      .update({
        question_text: data.questionText,
        question_type: data.questionType,
        options: data.options,
        correct_option_ids: data.correctOptionIds,
        sort_order: data.sortOrder,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const adminDeleteQuizQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("quiz_questions").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });
