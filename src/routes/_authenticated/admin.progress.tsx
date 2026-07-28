import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import { Search, Award } from "lucide-react";
import { format } from "date-fns";
import { adminGetProgress } from "@/lib/lms-phase3.functions";

export const Route = createFileRoute("/_authenticated/admin/progress")({
  head: () => ({
    meta: [
      { title: "Progress Analytics — Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminProgress,
});

function AdminProgress() {
  const navigate = useNavigate();
  const [authorised, setAuthorised] = useState<boolean | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { navigate({ to: "/auth" }); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userData.user.id);
      setAuthorised((roles ?? []).some((r) => r.role === "admin" || r.role === "ogadmin"));
    })();
  }, [navigate]);

  const fetchProgress = useServerFn(adminGetProgress);
  const { data, isLoading } = useQuery({
    queryKey: ["admin-progress"],
    queryFn: () => fetchProgress(),
    enabled: authorised === true,
  });

  if (authorised === null || (authorised && isLoading)) {
    return <div className="mx-auto max-w-6xl px-6 py-16 text-muted-foreground">Loading…</div>;
  }
  if (authorised === false) {
    return <div className="mx-auto max-w-2xl px-6 py-16 text-center"><h1 className="font-display text-2xl font-bold">Not authorised</h1></div>;
  }

  const students = (data?.students ?? []).filter((s: any) =>
    !q || s.email.toLowerCase().includes(q.toLowerCase())
  );
  const modules = data?.moduleStats ?? [];
  const tiers = data?.tiers ?? [];
  const tierName = (id: string) => tiers.find((t: any) => t.id === id)?.name ?? id;

  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Progress Analytics</h1>
          <p className="text-sm text-muted-foreground">Per-student and per-module engagement.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm"><Link to="/admin/follow-up">Follow-Up</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to="/admin/enrollments">Enrollments</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to="/admin/modules">Modules</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to="/admin/tiers">Tiers</Link></Button>
        </div>
      </header>

      <Tabs defaultValue="students" className="mt-8">
        <TabsList>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-4 space-y-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search by email…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="overflow-x-auto rounded-2xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Avg quiz</TableHead>
                  <TableHead>Last activity</TableHead>
                  <TableHead>Certificate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No enrolled students.</TableCell></TableRow>
                )}
                {students.flatMap((s: any) =>
                  s.tiers.map((t: any, idx: number) => (
                    <TableRow key={`${s.user_id}-${t.tier_id}`}>
                      {idx === 0 ? (
                        <TableCell rowSpan={s.tiers.length} className="align-top font-medium">{s.email}</TableCell>
                      ) : null}
                      <TableCell>{t.tier_name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                            <div className="h-full bg-primary" style={{ width: `${t.pct}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{t.completed}/{t.total} ({t.pct}%)</span>
                        </div>
                      </TableCell>
                      <TableCell>{t.avg_score !== null ? `${t.avg_score}%` : "—"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {t.last_activity ? format(new Date(t.last_activity), "d MMM yyyy") : "—"}
                      </TableCell>
                      <TableCell>
                        {t.certificate_number ? (
                          <Badge variant="secondary"><Award className="mr-1 h-3 w-3" />{t.certificate_number}</Badge>
                        ) : "—"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="modules" className="mt-4">
          <div className="overflow-x-auto rounded-2xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Module</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Learners completed</TableHead>
                  <TableHead>Quiz attempts</TableHead>
                  <TableHead>Pass rate</TableHead>
                  <TableHead>Avg score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map((m: any) => (
                  <TableRow key={m.module_id}>
                    <TableCell><span className="font-mono text-muted-foreground">{m.number}</span> {m.title}</TableCell>
                    <TableCell>{tierName(m.tier_id)}</TableCell>
                    <TableCell>{m.learners_completed}</TableCell>
                    <TableCell>{m.attempts}</TableCell>
                    <TableCell>{m.attempts ? `${m.pass_rate}%` : "—"}</TableCell>
                    <TableCell>{m.avg_score !== null ? `${m.avg_score}%` : "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
