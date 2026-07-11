import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/upskills-logo.png.asset.json";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center ${className}`} aria-label="UpskillsTraining home">
      <img
        src={logoAsset.url}
        alt="UpskillsTraining"
        className="h-[52px] w-auto md:h-[62px]"
        loading="eager"
      />
    </Link>
  );
}

