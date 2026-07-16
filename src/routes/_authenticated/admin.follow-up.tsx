import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getCourse } from "@/lib/courses";
import { format } from "date-fns";
import { FileBarChart2, LogOut, Search } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/follow-up")({
  head: () => ({
    meta: [
      { title: "Follow-Up Enquiries — Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FollowUpPage,
});

type Consultation = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  course_id: string | null;
  format: string;
  preferred_date: string | null;
  time_slot: string | null;
  notes: string | null;
  status: string;
  created_at: string;
};

const STATUSES = ["new", "contacted", "booked", "closed"];

function FollowUpPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isOgAdmin, setIsOgAdmin] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id);
      const roleSet = new Set((roles ?? []).map((r) => r.role));
      const admin = roleSet.has("admin") || roleSet.has("ogadmin");
      setIsAdmin(admin);
      setIsOgAdmin(roleSet.has("ogadmin"));
      if (!admin) { setLoading(false); return; }
      const { data, error } = await supabase
        .from("consultations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) toast.error(error.message);
      else setRows((data as Consultation[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const prev = rows;
    setRows(rows.map((r) => (r.id === id ? { ...r, status } : r)));
    const { error } = await supabase.from("consultations").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); setRows(prev); }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  const filtered = rows.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      r.full_name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.phone.toLowerCase().includes(q) ||
      (r.notes ?? "").toLowerCase().includes(q)
    );
  });

  if (loading) {
    return <div className="mx-auto max-w-6xl px-6 py-16 text-muted-foreground">Loading…</div>;
  }

  if (isAdmin === false) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="font-display text-3xl font-bold">Not authorised</h1>
        <p className="mt-2 text-muted-foreground">
          Your account is signed in but doesn't have admin access. Ask an existing admin to grant it.
        </p>
        <Button className="mt-6" variant="outline" onClick={signOut}>Sign out</Button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Follow-Up Enquiries</h1>
          <p className="text-sm text-muted-foreground">
            All consultation & contact form submissions. {rows.length} total.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isOgAdmin && (
            <Button asChild variant="default" size="sm">
              <Link to="/admin/reports">
                <FileBarChart2 className="mr-2 h-4 w-4" /> View Full Report
              </Link>
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </div>


      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search name, email, phone, notes…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Received</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Preferred</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  No enquiries yet.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((r) => {
              const course = r.course_id ? getCourse(r.course_id) : undefined;
              return (
                <TableRow key={r.id}>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {format(new Date(r.created_at), "d MMM yyyy, HH:mm")}
                  </TableCell>
                  <TableCell className="font-medium">{r.full_name}</TableCell>
                  <TableCell className="text-sm">
                    <div><a href={`mailto:${r.email}`} className="underline">{r.email}</a></div>
                    <div className="text-muted-foreground"><a href={`tel:${r.phone}`}>{r.phone}</a></div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {course?.title ?? r.course_id ?? "—"}
                    <div><Badge variant="secondary" className="mt-1">{r.format}</Badge></div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {r.preferred_date ? format(new Date(r.preferred_date), "d MMM yyyy") : "—"}
                    <div className="text-xs text-muted-foreground">{r.time_slot ?? ""}</div>
                  </TableCell>
                  <TableCell className="max-w-xs text-sm text-muted-foreground">
                    {r.notes || <span className="opacity-50">—</span>}
                  </TableCell>
                  <TableCell>
                    <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v)}>
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
