import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password — UpskillsTraining" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    setSent(true);
    toast.success("Reset link sent. Check your inbox.");
  };

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-3xl font-bold">Reset your password</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter your email and we'll send you a secure link to set a new password.
      </p>
      {sent ? (
        <div className="mt-6 rounded-2xl border bg-card p-6 shadow-card">
          <p className="text-sm">
            If an account exists for <strong>{email}</strong>, a password reset
            link is on its way. The link expires shortly — use it soon.
          </p>
          <Button asChild variant="outline" className="mt-4 w-full">
            <Link to="/auth">Back to sign in</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 grid gap-4 rounded-2xl border bg-card p-6 shadow-card">
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button type="submit" disabled={loading}>{loading ? "Sending…" : "Send reset link"}</Button>
          <Link to="/auth" className="text-center text-sm text-muted-foreground hover:underline">
            Back to sign in
          </Link>
        </form>
      )}
    </section>
  );
}
