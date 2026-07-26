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
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (data.lesson_content !== undefined) patch.lesson_content = data.lesson_content;
    if (data.video_url !== undefined) patch.video_url = data.video_url;
    const { error } = await supabaseAdmin.from("modules").update(patch).eq("id", data.moduleId);
    if (error) throw error;
    return { ok: true };
  });
