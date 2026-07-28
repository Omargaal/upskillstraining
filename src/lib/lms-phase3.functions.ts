import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const [{ data: a }, { data: o }] = await Promise.all([
    ctx.supabase.rpc("has_role", { _user_id: ctx.userId, _role: "admin" }),
    ctx.supabase.rpc("has_role", { _user_id: ctx.userId, _role: "ogadmin" }),
  ]);
  if (!a && !o) throw new Error("Forbidden");
}

// ---------- Student: certificates & module navigation ----------

export const getMyCertificates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [certsRes, tiersRes, userRes] = await Promise.all([
      supabase
        .from("certificates")
        .select("*")
        .eq("user_id", userId)
        .order("issued_at", { ascending: false }),
      supabase.from("tiers").select("id, name, tagline"),
      supabase.auth.getUser(),
    ]);
    if (certsRes.error) throw certsRes.error;
    if (tiersRes.error) throw tiersRes.error;
    const tierMap = new Map((tiersRes.data ?? []).map((t: any) => [t.id, t]));
    const email = userRes.data?.user?.email ?? "";
    const fullName =
      (userRes.data?.user?.user_metadata as any)?.full_name ||
      (userRes.data?.user?.user_metadata as any)?.name ||
      email;
    return {
      certificates: (certsRes.data ?? []).map((c: any) => ({
        ...c,
        tier: tierMap.get(c.tier_id) ?? null,
      })),
      recipient: { fullName, email },
    };
  });

export const getCertificate = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const cRes = await supabase
      .from("certificates")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (cRes.error) throw cRes.error;
    if (!cRes.data) throw new Error("Certificate not found");

    // RLS lets admins read all; also allow the owner
    const isOwner = cRes.data.user_id === userId;
    let isAdmin = false;
    if (!isOwner) {
      const [{ data: a }, { data: o }] = await Promise.all([
        supabase.rpc("has_role", { _user_id: userId, _role: "admin" }),
        supabase.rpc("has_role", { _user_id: userId, _role: "ogadmin" }),
      ]);
      isAdmin = !!a || !!o;
      if (!isAdmin) throw new Error("Forbidden");
    }

    const tierRes = await supabase
      .from("tiers")
      .select("id, name, tagline")
      .eq("id", cRes.data.tier_id)
      .single();
    if (tierRes.error) throw tierRes.error;

    let recipient = { fullName: "", email: "" };
    if (isOwner) {
      const u = await supabase.auth.getUser();
      const email = u.data?.user?.email ?? "";
      recipient = {
        email,
        fullName:
          (u.data?.user?.user_metadata as any)?.full_name ||
          (u.data?.user?.user_metadata as any)?.name ||
          email,
      };
    } else {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const u = await supabaseAdmin.auth.admin.getUserById(cRes.data.user_id);
      const email = u.data?.user?.email ?? "";
      recipient = {
        email,
        fullName:
          (u.data?.user?.user_metadata as any)?.full_name ||
          (u.data?.user?.user_metadata as any)?.name ||
          email,
      };
    }

    return { certificate: cRes.data, tier: tierRes.data, recipient };
  });

export const getModuleWithNav = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { moduleId: string }) => z.object({ moduleId: z.string() }).parse(d))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const modRes = await supabase.from("modules").select("*").eq("id", data.moduleId).single();
    if (modRes.error) throw modRes.error;
    const tierModulesRes = await supabase
      .from("modules")
      .select("id, number, title, sort_order")
      .eq("tier_id", modRes.data.tier_id)
      .order("sort_order");
    if (tierModulesRes.error) throw tierModulesRes.error;
    const list = tierModulesRes.data ?? [];
    const idx = list.findIndex((m) => m.id === data.moduleId);
    const prev = idx > 0 ? list[idx - 1] : null;
    const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;

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
      prev,
      next,
      position: idx + 1,
      total: list.length,
    };
  });

// ---------- Admin: modules CRUD ----------

export const adminListAllModules = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [mRes, tRes] = await Promise.all([
      supabaseAdmin.from("modules").select("*").order("sort_order"),
      supabaseAdmin.from("tiers").select("id, name, sort_order").order("sort_order"),
    ]);
    if (mRes.error) throw mRes.error;
    if (tRes.error) throw tRes.error;
    return { modules: mRes.data ?? [], tiers: tRes.data ?? [] };
  });

const ModuleInput = z.object({
  id: z.string().min(1),
  tier_id: z.string().min(1),
  number: z.string().min(1),
  title: z.string().min(1),
  topic: z.string().min(1),
  lab: z.string().default(""),
  lesson_content: z.string().default(""),
  video_url: z.string().url().nullable().or(z.literal("")).optional(),
  sort_order: z.number().int(),
});

export const adminSaveModule = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ModuleInput.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const patch = {
      id: data.id,
      tier_id: data.tier_id,
      number: data.number,
      title: data.title,
      topic: data.topic,
      lab: data.lab,
      lesson_content: data.lesson_content,
      video_url: data.video_url === "" ? null : data.video_url ?? null,
      sort_order: data.sort_order,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabaseAdmin.from("modules").upsert(patch);
    if (error) throw error;
    return { ok: true };
  });

export const adminDeleteModule = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("modules").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ---------- Admin: tiers CRUD ----------

export const adminListTiers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [tRes, mRes] = await Promise.all([
      supabaseAdmin.from("tiers").select("*").order("sort_order"),
      supabaseAdmin.from("modules").select("tier_id"),
    ]);
    if (tRes.error) throw tRes.error;
    if (mRes.error) throw mRes.error;
    const counts = new Map<string, number>();
    for (const m of mRes.data ?? []) counts.set(m.tier_id, (counts.get(m.tier_id) ?? 0) + 1);
    return {
      tiers: (tRes.data ?? []).map((t) => ({ ...t, moduleCount: counts.get(t.id) ?? 0 })),
    };
  });

const TierInput = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  tagline: z.string().default(""),
  sort_order: z.number().int(),
});

export const adminSaveTier = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => TierInput.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("tiers").upsert(data);
    if (error) throw error;
    return { ok: true };
  });

export const adminDeleteTier = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("tiers").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ---------- Admin: progress analytics ----------

export const adminGetProgress = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [tRes, mRes, eRes, pRes, aRes, cRes, uRes] = await Promise.all([
      supabaseAdmin.from("tiers").select("id, name").order("sort_order"),
      supabaseAdmin.from("modules").select("id, tier_id, number, title").order("sort_order"),
      supabaseAdmin.from("enrollments").select("user_id, tier_id, created_at"),
      supabaseAdmin.from("module_progress").select("user_id, module_id, completed_at"),
      supabaseAdmin
        .from("quiz_attempts")
        .select("user_id, module_id, score, passed, created_at"),
      supabaseAdmin.from("certificates").select("user_id, tier_id, certificate_number, issued_at"),
      supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }),
    ]);
    if (tRes.error) throw tRes.error;
    if (mRes.error) throw mRes.error;
    if (eRes.error) throw eRes.error;
    if (pRes.error) throw pRes.error;
    if (aRes.error) throw aRes.error;
    if (cRes.error) throw cRes.error;

    const users = (uRes.data?.users ?? []).map((u) => ({
      id: u.id,
      email: u.email ?? "",
      created_at: u.created_at ?? "",
    }));
    const userMap = new Map(users.map((u) => [u.id, u]));
    const tiers = tRes.data ?? [];
    const modules = mRes.data ?? [];
    const modulesByTier = new Map<string, typeof modules>();
    for (const m of modules) {
      const arr = modulesByTier.get(m.tier_id) ?? [];
      arr.push(m);
      modulesByTier.set(m.tier_id, arr);
    }

    // per-student aggregation
    const enrollments = eRes.data ?? [];
    const progress = pRes.data ?? [];
    const attempts = aRes.data ?? [];
    const certificates = cRes.data ?? [];

    const doneSet = new Set(progress.map((p) => `${p.user_id}::${p.module_id}`));
    const bestAttempt = new Map<string, number>();
    const lastAttempt = new Map<string, string>();
    for (const a of attempts) {
      const key = `${a.user_id}::${a.module_id}`;
      const prev = bestAttempt.get(key) ?? -1;
      if (a.score > prev) bestAttempt.set(key, a.score);
      const prevT = lastAttempt.get(key);
      if (!prevT || a.created_at > prevT) lastAttempt.set(key, a.created_at);
    }

    const students = new Map<string, {
      user_id: string;
      email: string;
      tiers: {
        tier_id: string;
        tier_name: string;
        total: number;
        completed: number;
        pct: number;
        avg_score: number | null;
        last_activity: string | null;
        certificate_number: string | null;
      }[];
    }>();

    for (const e of enrollments) {
      const u = userMap.get(e.user_id);
      const tier = tiers.find((t) => t.id === e.tier_id);
      if (!tier) continue;
      const tierMods = modulesByTier.get(e.tier_id) ?? [];
      const total = tierMods.length;
      let completed = 0;
      let scoreSum = 0;
      let scoreCount = 0;
      let lastAct: string | null = null;
      for (const m of tierMods) {
        const k = `${e.user_id}::${m.id}`;
        if (doneSet.has(k)) completed += 1;
        const best = bestAttempt.get(k);
        if (best !== undefined) {
          scoreSum += best;
          scoreCount += 1;
        }
        const la = lastAttempt.get(k);
        if (la && (!lastAct || la > lastAct)) lastAct = la;
      }
      const cert = certificates.find(
        (c) => c.user_id === e.user_id && c.tier_id === e.tier_id,
      );
      const entry = students.get(e.user_id) ?? {
        user_id: e.user_id,
        email: u?.email ?? "(unknown)",
        tiers: [],
      };
      entry.tiers.push({
        tier_id: tier.id,
        tier_name: tier.name,
        total,
        completed,
        pct: total ? Math.round((completed / total) * 100) : 0,
        avg_score: scoreCount ? Math.round(scoreSum / scoreCount) : null,
        last_activity: lastAct,
        certificate_number: cert?.certificate_number ?? null,
      });
      students.set(e.user_id, entry);
    }

    // per-module aggregation
    const moduleStats = modules.map((m) => {
      const modAttempts = attempts.filter((a) => a.module_id === m.id);
      const passRate = modAttempts.length
        ? Math.round(
            (modAttempts.filter((a) => a.passed).length / modAttempts.length) * 100,
          )
        : 0;
      const avgScore = modAttempts.length
        ? Math.round(modAttempts.reduce((s, a) => s + a.score, 0) / modAttempts.length)
        : null;
      const learnersCompleted = progress.filter((p) => p.module_id === m.id).length;
      return {
        module_id: m.id,
        number: m.number,
        title: m.title,
        tier_id: m.tier_id,
        attempts: modAttempts.length,
        pass_rate: passRate,
        avg_score: avgScore,
        learners_completed: learnersCompleted,
      };
    });

    return {
      students: Array.from(students.values()).sort((a, b) =>
        a.email.localeCompare(b.email),
      ),
      moduleStats,
      tiers,
    };
  });
