import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-card">
        <GraduationCap className="h-5 w-5" />
      </span>
      <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
        Upskills<span className="text-primary">Training</span>
      </span>
    </Link>
  );
}
