import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { adminListTiers, adminSaveTier, adminDeleteTier } from "@/lib/lms-phase3.functions";

export const Route = createFileRoute("/_authenticated/admin/tiers")({
  head: () => ({
    meta: [
      { title: "Tiers — Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminTiers,
});

type Tier = { id: string; name: string; tagline: string; sort_order: number; moduleCount?: number };

function AdminTiers() {
  const navigate = useNavigate();
  const [authorised, setAuthorised] = useState<boolean | null>(null);
  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { navigate({ to: "/auth" }); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userData.user.id);
      setAuthorised((roles ?? []).some((r) => r.role === "admin" || r.role === "ogadmin"));
    })();
  }, [navigate]);

  const list = useServerFn(adminListTiers);
  const save = useServerFn(adminSaveTier);
  const del = useServerFn(adminDeleteTier);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-tiers"],
    queryFn: () => list(),
    enabled: authorised === true,
  });

  const saveMut = useMutation({
    mutationFn: (t: Tier) => save({ data: { id: t.id, name: t.name, tagline: t.tagline, sort_order: t.sort_order } }),
    onSuccess: () => { toast.success("Tier saved"); qc.invalidateQueries({ queryKey: ["admin-tiers"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => { toast.success("Tier deleted"); qc.invalidateQueries({ queryKey: ["admin-tiers"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  if (authorised === null || (authorised && isLoading)) {
    return <div className="mx-auto max-w-5xl px-6 py-16 text-muted-foreground">Loading…</div>;
  }
  if (authorised === false) {
    return <div className="mx-auto max-w-2xl px-6 py-16 text-center"><h1 className="font-display text-2xl font-bold">Not authorised</h1></div>;
  }

  const tiers = (data?.tiers ?? []) as Tier[];

  return (
    <section className="mx-auto max-w-5xl px-6 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Tiers</h1>
          <p className="text-sm text-muted-foreground">The learning tracks students enrol into.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm"><Link to="/admin/follow-up">Follow-Up</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to="/admin/modules">Modules</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to="/admin/progress">Progress</Link></Button>
          <TierDialog
            title="New tier"
            initial={{ id: "", name: "", tagline: "", sort_order: tiers.length + 1 }}
            onSave={(t) => saveMut.mutate(t)}
            isNew
            trigger={<Button size="sm"><Plus className="mr-1 h-4 w-4" />New</Button>}
          />
        </div>
      </header>

      <div className="mt-8 space-y-3">
        {tiers.map((t) => (
          <div key={t.id} className="flex items-start justify-between gap-3 rounded-2xl border bg-card p-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">#{t.sort_order}</span>
                <h3 className="font-display text-lg font-bold">{t.name}</h3>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{t.moduleCount} modules</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{t.tagline}</p>
              <p className="mt-1 text-xs font-mono text-muted-foreground">{t.id}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <TierDialog title={`Edit ${t.name}`} initial={t} onSave={(next) => saveMut.mutate(next)}
                trigger={<Button size="sm" variant="outline"><Pencil className="h-3.5 w-3.5" /></Button>} />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  if ((t.moduleCount ?? 0) > 0) { toast.error("Move or delete this tier's modules first"); return; }
                  if (confirm(`Delete tier "${t.name}"?`)) delMut.mutate(t.id);
                }}
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {tiers.length === 0 && <p className="text-sm text-muted-foreground">No tiers yet.</p>}
      </div>
    </section>
  );
}

function TierDialog({ title, initial, onSave, trigger, isNew }: {
  title: string; initial: Tier; onSave: (t: Tier) => void; trigger: React.ReactNode; isNew?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Tier>(initial);
  useEffect(() => { if (open) setForm(initial); }, [open, initial]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid gap-1.5"><Label>ID (slug)</Label>
            <Input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} disabled={!isNew} />
          </div>
          <div className="grid gap-1.5"><Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid gap-1.5"><Label>Tagline</Label>
            <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
          </div>
          <div className="grid w-32 gap-1.5"><Label>Sort order</Label>
            <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value, 10) || 0 })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => {
            if (!form.id || !form.name) { toast.error("ID and name are required"); return; }
            onSave(form); setOpen(false);
          }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
