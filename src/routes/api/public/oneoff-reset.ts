import { createFileRoute } from "@tanstack/react-router";

// One-off admin password reset. Reads target credentials from server env
// (ONEOFF_RESET_EMAIL / ONEOFF_RESET_PASSWORD) and applies them via the
// service-role admin API. Remove this file after use.
export const Route = createFileRoute("/api/public/oneoff-reset")({
  server: {
    handlers: {
      POST: async () => {
        const email = process.env.ONEOFF_RESET_EMAIL;
        const password = process.env.ONEOFF_RESET_PASSWORD;
        if (!email || !password) {
          return new Response("Not configured", { status: 404 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const perPage = 200;
        let page = 1;
        let userId: string | null = null;
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
          if (error) return new Response(error.message, { status: 500 });
          const users = data?.users ?? [];
          const found = users.find((u) => (u.email ?? "").toLowerCase() === email.toLowerCase());
          if (found) { userId = found.id; break; }
          if (users.length < perPage) break;
          page += 1;
          if (page > 25) break;
        }
        if (!userId) return new Response(`No user for ${email}`, { status: 404 });
        const { error: updErr } = await supabaseAdmin.auth.admin.updateUserById(userId, { password });
        if (updErr) return new Response(updErr.message, { status: 500 });
        return Response.json({ ok: true, userId });
      },
    },
  },
});
