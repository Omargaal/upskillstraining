import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { getCourse } from "@/lib/courses";
import { format } from "date-fns";
import { ArrowLeft, Download, Search, ShieldAlert } from "lucide-react";
import { listSignupUsers, type SignupUser } from "@/lib/admin-users.functions";


export const Route = createFileRoute("/_authenticated/admin/reports")({
  head: () => ({
    meta: [
      { title: "Enquiry Reports — Global OGAdmin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReportsPage,
});

type Consultation = {
  id: string; full_name: string; email: string; phone: string;
  course_id: string | null; format: string;
  preferred_date: string | null; time_slot: string | null;
  notes: string | null; status: string; created_at: string;
};
type Contact = {
  id: string; full_name: string; email: string; phone: string | null;
  subject: string | null; message: string; status: string; created_at: string;
};

function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const cols = Object.keys(rows[0]);
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}

function download(name: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

function ReportsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isOgAdmin, setIsOgAdmin] = useState<boolean | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .eq("role", "ogadmin");
      const ok = !!(roles && roles.length > 0);
      setIsOgAdmin(ok);
      if (!ok) { setLoading(false); return; }
      const [c1, c2] = await Promise.all([
        supabase.from("consultations").select("*").order("created_at", { ascending: false }),
        supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
      ]);
      if (c1.error) toast.error(c1.error.message); else setConsultations((c1.data as Consultation[]) ?? []);
      if (c2.error) toast.error(c2.error.message); else setContacts((c2.data as Contact[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const filteredConsult = useMemo(() => {
    if (!q) return consultations;
    const s = q.toLowerCase();
    return consultations.filter((r) =>
      [r.full_name, r.email, r.phone, r.notes ?? "", r.course_id ?? ""].some((v) => v.toLowerCase().includes(s))
    );
  }, [consultations, q]);

  const filteredContact = useMemo(() => {
    if (!q) return contacts;
    const s = q.toLowerCase();
    return contacts.filter((r) =>
      [r.full_name, r.email, r.phone ?? "", r.subject ?? "", r.message].some((v) => v.toLowerCase().includes(s))
    );
  }, [contacts, q]);

  const signOut = async () => { await supabase.auth.signOut(); navigate({ to: "/auth" }); };

  if (loading) {
    return <div className="mx-auto max-w-6xl px-6 py-16 text-muted-foreground">Loading…</div>;
  }
  if (isOgAdmin === false) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-16 text-center">
        <ShieldAlert className="mx-auto h-10 w-10 text-destructive" />
        <h1 className="mt-3 font-display text-3xl font-bold">Global OGAdmin only</h1>
        <p className="mt-2 text-muted-foreground">
          This report is restricted to Global OGAdmin accounts.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button variant="outline" onClick={() => navigate({ to: "/admin/follow-up" })}>Back to Follow-Up</Button>
          <Button variant="ghost" onClick={signOut}>Sign out</Button>
        </div>
      </section>
    );
  }

  const totals = {
    consult: consultations.length,
    contact: contacts.length,
    newConsult: consultations.filter((r) => r.status === "new").length,
    newContact: contacts.filter((r) => r.status === "new").length,
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/admin/follow-up" className="inline-flex items-center gap-1 underline">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Follow-Up
            </Link>
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold">Enquiry Reports</h1>
          <p className="text-sm text-muted-foreground">
            Full view of every submitted consultation and contact enquiry.
          </p>
        </div>
        <Badge variant="secondary">Global OGAdmin</Badge>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        {[
          { label: "Total consultations", value: totals.consult },
          { label: "New consultations", value: totals.newConsult },
          { label: "Total contact enquiries", value: totals.contact },
          { label: "New contact enquiries", value: totals.newContact },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border bg-card p-4 shadow-card">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</div>
            <div className="mt-1 text-2xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search across all enquiries…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="consultations" className="mt-6">
        <TabsList>
          <TabsTrigger value="consultations">Consultations ({filteredConsult.length})</TabsTrigger>
          <TabsTrigger value="contact">Contact Us ({filteredContact.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="consultations" className="mt-4">
          <div className="mb-3 flex justify-end">
            <Button size="sm" variant="outline" onClick={() => download(`consultations-${Date.now()}.csv`, toCsv(filteredConsult))}>
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>
          <div className="overflow-x-auto rounded-2xl border bg-card shadow-card">
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
                {filteredConsult.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No consultation enquiries.</TableCell></TableRow>
                )}
                {filteredConsult.map((r) => {
                  const c = r.course_id ? getCourse(r.course_id) : undefined;
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
                        {c?.title ?? r.course_id ?? "—"}
                        <div><Badge variant="secondary" className="mt-1">{r.format}</Badge></div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {r.preferred_date ? format(new Date(r.preferred_date), "d MMM yyyy") : "—"}
                        <div className="text-xs text-muted-foreground">{r.time_slot ?? ""}</div>
                      </TableCell>
                      <TableCell className="max-w-xs text-sm text-muted-foreground">{r.notes || "—"}</TableCell>
                      <TableCell><Badge>{r.status}</Badge></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="mt-4">
          <div className="mb-3 flex justify-end">
            <Button size="sm" variant="outline" onClick={() => download(`contact-${Date.now()}.csv`, toCsv(filteredContact))}>
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>
          <div className="overflow-x-auto rounded-2xl border bg-card shadow-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Received</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContact.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No contact enquiries.</TableCell></TableRow>
                )}
                {filteredContact.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {format(new Date(r.created_at), "d MMM yyyy, HH:mm")}
                    </TableCell>
                    <TableCell className="font-medium">{r.full_name}</TableCell>
                    <TableCell className="text-sm">
                      <div><a href={`mailto:${r.email}`} className="underline">{r.email}</a></div>
                      {r.phone && <div className="text-muted-foreground"><a href={`tel:${r.phone}`}>{r.phone}</a></div>}
                    </TableCell>
                    <TableCell className="text-sm">{r.subject ?? "—"}</TableCell>
                    <TableCell className="max-w-md text-sm text-muted-foreground">{r.message}</TableCell>
                    <TableCell><Badge>{r.status}</Badge></TableCell>
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
