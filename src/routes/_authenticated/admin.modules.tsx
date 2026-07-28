import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  adminListAllModules, adminSaveModule, adminDeleteModule,
} from "@/lib/lms-phase3.functions";

export const Route = createFileRoute("/_authenticated/admin/modules")({
  head: () => ({
    meta: [
      { title: "Modules — Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminModules,
});

type Mod = {
  id: string;
  tier_id: string;
  number: string;
  title: string;
  topic: string;
  lab: string;
  lesson_content: string;
  video_url: string | null;
  sort_order: number;
};

const emptyModule: Mod = {
  id: "",
  tier_id: "",
  number: "",
  title: "",
  topic: "",
  lab: "",
  lesson_content: "",
  video_url: "",
  sort_order: 0,
};

function AdminModules() {
  const navigate = useNavigate();
  const [authorised, setAuthorised] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { navigate({ to: "/auth" }); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userData.user.id);
      const ok = (roles ?? []).some((r) => r.role === "admin" || r.role === "ogadmin");
      setAuthorised(ok);
    })();
  }, [navigate]);

  const list = useServerFn(adminListAllModules);
  const save = useServerFn(adminSaveModule);
  const del = useServerFn(adminDeleteModule);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-modules"],
    queryFn: () => list(),
    enabled: authorised === true,
  });

  const saveMut = useMutation({
    mutationFn: (m: Mod) => save({ data: { ...m, video_url: m.video_url ?? "" } as any }),
    onSuccess: () => { toast.success("Module saved"); qc.invalidateQueries({ queryKey: ["admin-modules"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => { toast.success("Module deleted"); qc.invalidateQueries({ queryKey: ["admin-modules"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  if (authorised === null || (authorised && isLoading)) {
    return <div className="mx-auto max-w-6xl px-6 py-16 text-muted-foreground">Loading…</div>;
  }
  if (authorised === false) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="font-display text-2xl font-bold">Not authorised</h1>
        <p className="mt-2 text-muted-foreground">Admin access required.</p>
      </div>
    );
  }

  const modules = (data?.modules ?? []) as Mod[];
  const tiers = data?.tiers ?? [];
  const byTier = tiers.map((t: any) => ({
    tier: t,
    modules: modules.filter((m) => m.tier_id === t.id).sort((a, b) => a.sort_order - b.sort_order),
  }));

  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Modules</h1>
          <p className="text-sm text-muted-foreground">Edit lesson content, video URLs, and hands-on labs.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm"><Link to="/admin/follow-up">Follow-Up</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to="/admin/tiers">Tiers</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to="/admin/quizzes">Quizzes</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to="/admin/progress">Progress</Link></Button>
          <ModuleDialog
            title="New module"
            initial={{ ...emptyModule, sort_order: modules.length + 1 }}
            tiers={tiers}
            onSave={(m) => saveMut.mutate(m)}
            trigger={<Button size="sm"><Plus className="mr-1 h-4 w-4" />New</Button>}
          />
        </div>
      </header>

      <div className="mt-8 space-y-8">
        {byTier.map(({ tier, modules: mods }) => (
          <div key={tier.id} className="rounded-2xl border bg-card p-6">
            <h2 className="font-display text-lg font-bold">{tier.name}</h2>
            <p className="text-xs text-muted-foreground">{mods.length} modules</p>
            <div className="mt-4 divide-y">
              {mods.map((m) => (
                <div key={m.id} className="flex items-start justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <div className="text-sm">
                      <span className="font-mono text-muted-foreground">{m.number}</span> <span className="font-medium">{m.title}</span>
                    </div>
                    <div className="truncate text-xs text-muted-foreground">{m.topic}</div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <ModuleDialog
                      title={`Edit ${m.number}`}
                      initial={m}
                      tiers={tiers}
                      onSave={(next) => saveMut.mutate(next)}
                      trigger={<Button size="sm" variant="outline"><Pencil className="h-3.5 w-3.5" /></Button>}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => { if (confirm(`Delete module ${m.number}?`)) delMut.mutate(m.id); }}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              {mods.length === 0 && <p className="py-3 text-sm text-muted-foreground">No modules in this tier.</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ModuleDialog({
  title, initial, tiers, onSave, trigger,
}: {
  title: string;
  initial: Mod;
  tiers: { id: string; name: string }[];
  onSave: (m: Mod) => void;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Mod>(initial);
  useEffect(() => { if (open) setForm(initial); }, [open, initial]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>ID (slug)</Label>
              <Input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} disabled={!!initial.id} />
            </div>
            <div className="grid gap-1.5">
              <Label>Tier</Label>
              <Select value={form.tier_id} onValueChange={(v) => setForm({ ...form, tier_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>
                  {tiers.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="grid gap-1.5">
              <Label>Number</Label>
              <Input value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} />
            </div>
            <div className="col-span-2 grid gap-1.5">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Topic</Label>
            <Input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} />
          </div>
          <div className="grid gap-1.5">
            <Label>Video URL (YouTube / Vimeo)</Label>
            <Input value={form.video_url ?? ""} onChange={(e) => setForm({ ...form, video_url: e.target.value })} placeholder="https://…" />
          </div>
          <div className="grid gap-1.5">
            <Label>Lesson content (Markdown / plain text)</Label>
            <Textarea rows={8} value={form.lesson_content} onChange={(e) => setForm({ ...form, lesson_content: e.target.value })} />
          </div>
          <div className="grid gap-1.5">
            <Label>Hands-on lab</Label>
            <Textarea rows={3} value={form.lab} onChange={(e) => setForm({ ...form, lab: e.target.value })} />
          </div>
          <div className="grid gap-1.5 w-32">
            <Label>Sort order</Label>
            <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value, 10) || 0 })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (!form.id || !form.tier_id || !form.title || !form.number || !form.topic) {
                toast.error("ID, tier, number, title and topic are required");
                return;
              }
              onSave(form);
              setOpen(false);
            }}
          >Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
