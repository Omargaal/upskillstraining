import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section className="mx-auto max-w-7xl px-6 -mb-12">
      <div className="rounded-3xl bg-primary text-primary-foreground shadow-elevated p-6 md:p-8 grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h3 className="text-2xl font-bold">Get course updates & career tips</h3>
          <p className="text-sm text-primary-foreground/80 mt-1">
            Occasional email — no spam. Unsubscribe any time.
          </p>
        </div>
        {done ? (
          <p className="text-sm bg-primary-foreground/10 rounded-xl px-4 py-3">Thanks — you're subscribed.</p>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); setDone(true); }}
            className="flex flex-col sm:flex-row gap-3 min-w-0"
          >
            <Input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background text-foreground sm:w-72"
            />
            <Button type="submit" variant="accent">Subscribe</Button>
          </form>
        )}
      </div>
    </section>
  );
}
