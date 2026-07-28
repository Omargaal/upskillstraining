import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getMyCertificates } from "@/lib/lms-phase3.functions";
import { Button } from "@/components/ui/button";
import { Award, ArrowLeft, Printer } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/certificates")({
  head: () => ({
    meta: [
      { title: "My Certificates — UpskillsTraining" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CertificatesPage,
});

function CertificatesPage() {
  const fetchFn = useServerFn(getMyCertificates);
  const { data, isLoading } = useQuery({
    queryKey: ["my-certificates"],
    queryFn: () => fetchFn(),
  });

  if (isLoading) return <div className="mx-auto max-w-4xl px-6 py-16">Loading…</div>;
  const certs = data?.certificates ?? [];
  const recipient = data?.recipient;

  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>
      <header className="mt-4">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">My Certificates</h1>
        <p className="mt-1 text-muted-foreground">Earned by completing every module in a tier.</p>
      </header>

      {certs.length === 0 && (
        <div className="mt-10 rounded-2xl border-2 border-dashed p-10 text-center">
          <Award className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">No certificates yet. Complete all modules in a tier to earn one.</p>
        </div>
      )}

      <div className="mt-8 space-y-6">
        {certs.map((c: any) => (
          <CertificateCard key={c.id} cert={c} recipient={recipient} />
        ))}
      </div>
    </section>
  );
}

function CertificateCard({ cert, recipient }: { cert: any; recipient: any }) {
  return (
    <div className="rounded-2xl border bg-card p-2 shadow-card">
      <div className="print-cert relative overflow-hidden rounded-xl border-4 border-double border-primary/40 bg-gradient-to-br from-background to-muted/30 p-10">
        <div className="text-center">
          <div className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground">UpskillsTraining · Certificate of Completion</div>
          <Award className="mx-auto mt-4 h-12 w-12 text-primary" />
          <p className="mt-6 text-sm text-muted-foreground">This certifies that</p>
          <h2 className="mt-1 font-display text-3xl font-extrabold">{recipient?.fullName || recipient?.email}</h2>
          <p className="mt-4 text-sm text-muted-foreground">has successfully completed</p>
          <h3 className="mt-1 font-display text-xl font-bold text-primary">{cert.tier?.name}</h3>
          {cert.tier?.tagline && <p className="mt-1 text-sm text-muted-foreground">{cert.tier.tagline}</p>}
          <div className="mt-8 flex items-center justify-center gap-6 text-xs">
            <div>
              <div className="font-mono text-muted-foreground">Issued</div>
              <div className="font-semibold">{format(new Date(cert.issued_at), "d MMMM yyyy")}</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <div className="font-mono text-muted-foreground">Certificate #</div>
              <div className="font-semibold">{cert.certificate_number}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end p-3 print:hidden">
        <Button size="sm" variant="outline" onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" /> Print / Save PDF
        </Button>
      </div>
    </div>
  );
}
