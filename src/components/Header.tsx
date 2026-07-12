import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Mail, Phone, Menu, X, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { ConsultationModal } from "./ConsultationModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLink =
  "text-sm font-medium text-foreground/80 hover:text-primary transition-colors";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
      {/* Utility bar */}
      <div className="hidden sm:block bg-primary text-primary-foreground text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5">
          <div className="flex items-center gap-5">
            <a href="tel:+442039166417" className="inline-flex items-center gap-1.5 hover:opacity-80">
              <Phone className="h-3.5 w-3.5" /> 0203 916 6417
            </a>
            <a href="mailto:info@upskillstraining.co.uk" className="inline-flex items-center gap-1.5 hover:opacity-80">
              <Mail className="h-3.5 w-3.5" /> info@upskillstraining.co.uk
            </a>
          </div>
          <span className="hidden md:inline text-primary-foreground/80">
            Free consultations · Funding may be available
          </span>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-4">
          <Logo className="bg-background rounded-md" />
          <nav className="hidden lg:flex items-center gap-4">
            <Link to="/" className={navLink}>Home</Link>
            <DropdownMenu>
              <DropdownMenuTrigger className={`${navLink} inline-flex items-center gap-1 outline-none`}>
                Courses <ChevronDown className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuItem asChild>
                  <Link to="/pco-licence">PCO Licence</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/courses" search={{ category: "it" }}>IT Training Courses</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/courses" search={{ category: "all" }}>All Courses</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/about" className={navLink}>About</Link>
            <Link to="/blog" className={navLink}>Blog</Link>
            <Link to="/contact" className={navLink}>Contact</Link>
          </nav>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Button variant="ghost" size="sm">Login</Button>
          <ConsultationModal
            trigger={<Button variant="accent" size="sm">Book a Free Consultation</Button>}
          />
        </div>

        <button
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t bg-background">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-2">
            <Link to="/" className="py-1.5 font-medium" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/pco-licence" className="py-1.5 font-medium" onClick={() => setMobileOpen(false)}>PCO Licence</Link>
            <Link to="/courses" search={{ category: "it" }} className="py-1.5 font-medium" onClick={() => setMobileOpen(false)}>IT Training Courses</Link>
            <Link to="/about" className="py-1.5 font-medium" onClick={() => setMobileOpen(false)}>About</Link>
            <Link to="/blog" className="py-1.5 font-medium" onClick={() => setMobileOpen(false)}>Blog</Link>
            <Link to="/contact" className="py-1.5 font-medium" onClick={() => setMobileOpen(false)}>Contact</Link>
            <div className="mt-2 flex flex-col gap-2">
              <Button variant="outline">Login</Button>
              <ConsultationModal
                trigger={<Button variant="accent">Book a Free Consultation</Button>}
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
