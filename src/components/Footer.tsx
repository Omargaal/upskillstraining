import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-24">
      <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-4">
        <div className="space-y-4">
          <div className="bg-background/10 rounded-xl inline-block p-1 pr-3">
            <Logo />
          </div>
          <p className="text-sm text-primary-foreground/80 max-w-xs">
            UK-based training provider helping people gain recognised qualifications and build real careers.
          </p>
          <div className="flex gap-3">
            {[Facebook, Instagram, Linkedin].map((Icon, i) => (
              <a key={i} href="#" aria-label="social" className="grid h-9 w-9 place-items-center rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-primary-foreground mb-4">Quick links</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/courses" search={{ category: "pco" }} className="hover:text-accent">PCO Courses</Link></li>
            <li><Link to="/courses" search={{ category: "it" }} className="hover:text-accent">IT Training Courses</Link></li>
            <li><Link to="/book-consultation" className="hover:text-accent">Book a Consultation</Link></li>
            <li><Link to="/about" className="hover:text-accent">About</Link></li>
            <li><Link to="/blog" className="hover:text-accent">Blog</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 shrink-0" /> +44 20 8000 0000</li>
            <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 shrink-0" /> hello@upskillstraining.co.uk</li>
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" /> 1 Training House, London, UK</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><a href="#" className="hover:text-accent">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-accent">Terms of Service</a></li>
            <li><a href="#" className="hover:text-accent">Complaints Procedure</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto max-w-7xl px-6 py-5 text-xs text-primary-foreground/70 flex flex-wrap gap-2 justify-between">
          <span>© 2026 UpskillsTraining. All rights reserved.</span>
          <span>Made with care in the UK</span>
        </div>
      </div>
    </footer>
  );
}
