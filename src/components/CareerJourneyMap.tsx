import { useState } from "react";
import {
  HelpCircle, GraduationCap, Headphones, Monitor, Shield, TrendingUp,
  ArrowRight, DollarSign, Briefcase, Award,
} from "lucide-react";

type Stage = {
  id: number;
  title: string;
  role: string;
  salary: string;
  icon: React.ElementType;
  description: string;
  skills: string[];
  color: string;
};

const stages: Stage[] = [
  { id: 1, title: "The Starting Point", role: "IT Novice", salary: "£0 – £12/hr", icon: HelpCircle, description: "Scattered learning, no clear direction, struggling with where to begin.", skills: ["Random YouTube tutorials", "Outdated courses", "No practical experience"], color: "from-muted to-muted/50" },
  { id: 2, title: "Foundation Building", role: "IT Support Trainee", salary: "£14 – £18/hr", icon: GraduationCap, description: "Structured learning path with fundamental IT skills and certifications.", skills: ["CompTIA A+ basics", "Networking fundamentals", "Troubleshooting"], color: "from-blue-500/20 to-blue-600/10" },
  { id: 3, title: "Technical Support", role: "Help Desk Technician", salary: "£25K – £32K/year", icon: Headphones, description: "First professional role with hands-on experience and customer interaction.", skills: ["Ticket management", "User support", "Documentation"], color: "from-cyan-500/20 to-cyan-600/10" },
  { id: 4, title: "Endpoint Specialist", role: "Desktop Support Engineer", salary: "£35K – £45K/year", icon: Monitor, description: "Managing enterprise devices, deployments and endpoint security.", skills: ["Intune / SCCM", "Device management", "Automation"], color: "from-primary/20 to-primary/10" },
  { id: 5, title: "Security Focus", role: "Endpoint Administrator", salary: "£50K – £65K/year", icon: Shield, description: "Enterprise security policies, compliance and advanced management.", skills: ["Zero Trust", "Compliance policies", "Security baselines"], color: "from-emerald-500/20 to-emerald-600/10" },
  { id: 6, title: "Career Peak", role: "Senior Endpoint Engineer", salary: "£70K – £95K+/year", icon: TrendingUp, description: "Leading endpoint strategy, architecture decisions and team mentorship.", skills: ["Cloud architecture", "Enterprise strategy", "Team leadership"], color: "from-amber-500/20 to-amber-600/10" },
];

export function CareerJourneyMap() {
  const [active, setActive] = useState(1);
  const [hovered, setHovered] = useState<number | null>(null);
  const current = stages.find((s) => s.id === (hovered ?? active)) ?? stages[0];
  const progress = ((hovered ?? active) - 1) * 20;

  return (
    <section className="py-16 bg-background overflow-hidden">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Your Career Journey Map</h2>
          <p className="mt-3 text-muted-foreground">
            From IT novice to high-earning specialist — see the transformation path.
          </p>
        </div>

        {/* Progress path */}
        <div className="relative mb-8">
          <div className="absolute top-7 left-0 right-0 h-1 bg-gradient-to-r from-muted via-primary/50 to-amber-500/50 rounded-full" />
          <div
            className="absolute top-7 left-0 h-1 bg-gradient-to-r from-primary to-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
          <div className="relative flex justify-between">
            {stages.map((s) => {
              const Icon = s.icon;
              const isActive = s.id === (hovered ?? active);
              const isPast = s.id < (hovered ?? active);
              return (
                <div
                  key={s.id}
                  className="flex flex-col items-center cursor-pointer group"
                  onMouseEnter={() => setHovered(s.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setActive(s.id)}
                >
                  <div
                    className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                      isActive
                        ? "bg-gradient-to-br from-primary to-primary/80 scale-110 shadow-lg shadow-primary/30"
                        : isPast
                        ? "bg-gradient-to-br from-primary/60 to-primary/40"
                        : "bg-muted/50 border-2 border-muted-foreground/20"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive || isPast ? "text-primary-foreground" : "text-muted-foreground"}`} />
                    {isActive && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                        <div className="absolute -inset-2 rounded-full border-2 border-primary/30 animate-pulse" />
                      </>
                    )}
                  </div>
                  <span className={`mt-2 text-xs font-bold ${isActive ? "text-primary" : isPast ? "text-primary/60" : "text-muted-foreground"}`}>
                    Stage {s.id}
                  </span>
                  <span
                    className={`hidden md:block text-[11px] text-center max-w-[90px] leading-tight mt-1 ${
                      isActive ? "text-foreground font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {s.role}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail card */}
        <div className={`relative rounded-2xl p-6 border border-border/60 bg-gradient-to-br ${current.color}`}>
          <div className="absolute -top-3 right-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <DollarSign className="w-3 h-3" />
            {current.salary}
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${current.id === 1 ? "bg-muted" : "bg-primary/20"}`}>
                  <current.icon className={`w-5 h-5 ${current.id === 1 ? "text-muted-foreground" : "text-primary"}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{current.title}</p>
                  <h3 className="font-display text-lg font-bold">{current.role}</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{current.description}</p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Briefcase className="w-3.5 h-3.5" /> High demand
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Award className="w-3.5 h-3.5" /> Certified path
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold mb-2">
                {current.id === 1 ? "Common struggles" : "Key skills"}
              </p>
              <div className="space-y-1.5">
                {current.skills.map((skill) => (
                  <div
                    key={skill}
                    className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-md ${
                      current.id === 1 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-foreground"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${current.id === 1 ? "bg-destructive" : "bg-primary"}`} />
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {current.id < 6 ? (
            <div className="flex items-center justify-center mt-4 text-primary">
              <span className="text-xs font-medium">Click next stage to continue</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 animate-pulse" />
            </div>
          ) : (
            <div className="flex items-center justify-center mt-4">
              <div className="bg-gradient-to-r from-amber-500/20 to-primary/20 px-3 py-1 rounded-full">
                <span className="text-xs font-bold bg-gradient-to-r from-amber-500 to-primary bg-clip-text text-transparent">
                  🎯 This is your destination
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-8 mt-6">
          <div className="text-center">
            <p className="text-lg font-bold text-primary">6 Stages</p>
            <p className="text-[11px] text-muted-foreground">Career progression</p>
          </div>
          <div className="w-px bg-border" />
          <div className="text-center">
            <p className="text-lg font-bold text-emerald-500">£95K+</p>
            <p className="text-[11px] text-muted-foreground">Earning potential</p>
          </div>
          <div className="w-px bg-border" />
          <div className="text-center">
            <p className="text-lg font-bold text-amber-500">12 Weeks</p>
            <p className="text-[11px] text-muted-foreground">To get started</p>
          </div>
        </div>
      </div>
    </section>
  );
}
