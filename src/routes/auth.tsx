import { createFileRoute, useNavigate, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Sign In — UpskillsTraining" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Signed in");
    navigate({ to: "/admin/follow-up" });
  };

  if (location.pathname !== "/auth") return <Outlet />;

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-3xl font-bold">Admin Sign In</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Restricted area. Admins only.
      </p>
      <form onSubmit={signIn} className="mt-6 grid gap-4 rounded-2xl border bg-card p-6 shadow-card">
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</Button>
      </form>
      <div className="mt-6 rounded-2xl border bg-card p-4 text-center shadow-card">
        <p className="text-sm text-muted-foreground">Don't have an account yet?</p>
        <Button asChild variant="outline" className="mt-3 w-full">
          <Link to="/auth/signup">Create an admin account</Link>
        </Button>
      </div>
    </section>
  );
}
