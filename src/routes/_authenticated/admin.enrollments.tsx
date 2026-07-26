import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { adminListEnrollments, adminEnrollUser, adminRevokeEnrollment } from "@/lib/lms.functions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/enrollments")({
  head: () => ({
    meta: [
      { title: "Enrollments — Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminEnrollments,
});

function AdminEnrollments() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListEnrollments);
  const enrollFn = useServerFn(adminEnrollUser);
  const revokeFn = useServerFn(adminRevokeEnrollment);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-enrollments"],
    queryFn: () => listFn(),
  });

  const [userId, setUserId] = useState("");
  const [tierId, setTierId] = useState("");

  const enrollMut = useMutation({
    mutationFn: () => enrollFn({ data: { userId, tierId } }),
    onSuccess: () => {
      toast.success("Enrolled");
      setUserId("");
      setTierId("");
      qc.invalidateQueries({ queryKey: ["admin-enrollments"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const revokeMut = useMutation({
    mutationFn: (v: { userId: string; tierId: string }) => revokeFn({ data: v }),
    onSuccess: () => {
      toast.success("Revoked");
      qc.invalidateQueries({ queryKey: ["admin-enrollments"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <div className="mx-auto max-w-5xl px-6 py-16">Loading…</div>;
  if (error || !data)
    return <div className="mx-auto max-w-5xl px-6 py-16 text-destructive">Access denied or failed to load.</div>;

  const { enrollments, tiers, users } = data;
  const usersById = new Map(users.map((u) => [u.id, u.email]));

  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Admin</p>
          <h1 className="font-display text-3xl font-extrabold">Course Enrollments</h1>
        </div>
        <Button asChild variant="outline"><Link to="/admin/follow-up">Follow-Ups</Link></Button>
      </div>

      <div className="mb-8 rounded-2xl border bg-card p-6">
        <h2 className="font-display text-lg font-bold">Enroll a student</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <Select value={userId} onValueChange={setUserId}>
            <SelectTrigger><SelectValue placeholder="Select user" /></SelectTrigger>
            <SelectContent>
              {users.map((u) => (
                <SelectItem key={u.id} value={u.id}>{u.email || u.id}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={tierId} onValueChange={setTierId}>
            <SelectTrigger><SelectValue placeholder="Select tier" /></SelectTrigger>
            <SelectContent>
              {tiers.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            disabled={!userId || !tierId || enrollMut.isPending}
            onClick={() => enrollMut.mutate()}
          >
            Enroll
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border bg-card">
        <div className="border-b p-4 font-display font-bold">
          Active enrollments ({enrollments.length})
        </div>
        {enrollments.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">No enrollments yet.</div>
        ) : (
          <ul className="divide-y">
            {enrollments.map((e) => {
              const tier = tiers.find((t) => t.id === e.tier_id);
              return (
                <li key={e.id} className="flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{usersById.get(e.user_id) ?? e.user_id}</div>
                    <div className="text-xs text-muted-foreground">{tier?.name ?? e.tier_id}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={revokeMut.isPending}
                    onClick={() => revokeMut.mutate({ userId: e.user_id, tierId: e.tier_id })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
