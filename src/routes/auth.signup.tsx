import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({
    meta: [
      { title: "Create Admin Account — UpskillsTraining" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const emailRedirectTo = `${window.location.origin}/auth`;
    const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo } });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created. You can now sign in.");
    navigate({ to: "/auth" });
  };

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-3xl font-bold">Create Account</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        After signing up, an existing admin must grant you admin access before you can view enquiries.
      </p>
      <form onSubmit={signUp} className="mt-6 grid gap-4 rounded-2xl border bg-card p-6 shadow-card">
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="password">Password (min 6 chars)</Label>
          <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" disabled={loading}>{loading ? "Creating…" : "Create account"}</Button>
        <p className="text-xs text-muted-foreground">
          Already have an account? <Link to="/auth" className="underline">Sign in</Link>
        </p>
      </form>
    </section>
  );
}
