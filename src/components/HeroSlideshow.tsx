import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

interface HeroImage {
  src: string;
  alt: string;
  to?: string;
  search?: Record<string, string>;
  fit?: "cover" | "contain" | "fill";
}

interface HeroSlideshowProps {
  images: HeroImage[];
  interval?: number;
}

export function HeroSlideshow({ images, interval = 6000 }: HeroSlideshowProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-card shadow-elevated">
      {images.map((img, i) => {
        const isActive = i === index;
        const imgEl = (
          <img
            src={img.src}
            alt={img.alt}
            className={
              "absolute inset-0 h-full w-full transition-[opacity,transform] duration-[1500ms] ease-[cubic-bezier(0.4,0,0.2,1)] object-" + (img.fit || "cover") +
              (isActive ? " opacity-100 scale-100" : " opacity-0 scale-105 pointer-events-none")
            }
          />
        );
        if (img.to) {
          return (
            <Link
              key={img.src}
              to={img.to}
              search={img.search as never}
              className="absolute inset-0 block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={img.alt}
            >
              {imgEl}
            </Link>
          );
        }
        return <div key={img.src} className="absolute inset-0">{imgEl}</div>;
      })}
    </div>
  );
}
