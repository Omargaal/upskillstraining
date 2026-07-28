import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type SignupUser = {
  id: string;
  email: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  invited_at: string | null;
  source: "self_signup" | "admin_invited" | "admin_created";
  roles: string[];
};

export const listSignupUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<SignupUser[]> => {
    // Verify caller is a Global OGAdmin using their own RLS-scoped client.
    const { data: myRoles, error: rolesErr } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "ogadmin");
    if (rolesErr) throw new Error(rolesErr.message);
    if (!myRoles || myRoles.length === 0) {
      throw new Error("Forbidden: Global OGAdmin only");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const perPage = 200;
    let page = 1;
    const all: Array<{
      id: string;
      email: string | null;
      created_at: string;
      last_sign_in_at: string | null;
      email_confirmed_at: string | null;
      invited_at: string | null;
      identities?: Array<{ provider: string }> | null;
    }> = [];
    // Paginate through all users.
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
      if (error) throw new Error(error.message);
      const users = data?.users ?? [];
      all.push(
        ...users.map((u) => ({
          id: u.id,
          email: u.email ?? null,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at ?? null,
          email_confirmed_at: (u as { email_confirmed_at?: string | null }).email_confirmed_at ?? null,
          invited_at: (u as { invited_at?: string | null }).invited_at ?? null,
          identities: (u.identities as Array<{ provider: string }> | undefined) ?? null,
        })),
      );
      if (users.length < perPage) break;
      page += 1;
      if (page > 25) break; // safety cap: 5000 users
    }

    // Fetch roles for all users at once.
    const ids = all.map((u) => u.id);
    let rolesByUser = new Map<string, string[]>();
    if (ids.length) {
      const { data: rolesData, error: rErr } = await supabaseAdmin
        .from("user_roles")
        .select("user_id, role")
        .in("user_id", ids);
      if (rErr) throw new Error(rErr.message);
      rolesByUser = (rolesData ?? []).reduce((acc, r) => {
        const arr = acc.get(r.user_id) ?? [];
        arr.push(r.role as string);
        acc.set(r.user_id, arr);
        return acc;
      }, new Map<string, string[]>());
    }

    return all.map((u) => {
      let source: SignupUser["source"];
      if (u.invited_at) source = "admin_invited";
      else if (!u.identities || u.identities.length === 0) source = "admin_created";
      else source = "self_signup";
      return {
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        email_confirmed_at: u.email_confirmed_at,
        invited_at: u.invited_at,
        source,
        roles: rolesByUser.get(u.id) ?? [],
      };
    });
  });

export const adminResetUserPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { email: string; newPassword: string }) =>
    z.object({ email: z.string().email(), newPassword: z.string().min(8) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    // Only Global OGAdmin can reset another user's password.
    const { data: myRoles, error: rolesErr } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "ogadmin");
    if (rolesErr) throw new Error(rolesErr.message);
    if (!myRoles || myRoles.length === 0) throw new Error("Forbidden: Global OGAdmin only");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Find user by email via pagination (admin.getUserByEmail is not in all SDK versions).
    const perPage = 200;
    let page = 1;
    let target: { id: string; email: string | null } | null = null;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { data: list, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
      if (error) throw new Error(error.message);
      const users = list?.users ?? [];
      const found = users.find(
        (u) => (u.email ?? "").toLowerCase() === data.email.toLowerCase(),
      );
      if (found) {
        target = { id: found.id, email: found.email ?? null };
        break;
      }
      if (users.length < perPage) break;
      page += 1;
      if (page > 25) break;
    }
    if (!target) throw new Error(`No user found for ${data.email}`);

    const { error: updErr } = await supabaseAdmin.auth.admin.updateUserById(target.id, {
      password: data.newPassword,
    });
    if (updErr) throw new Error(updErr.message);
    return { ok: true, userId: target.id, email: target.email };
  });
