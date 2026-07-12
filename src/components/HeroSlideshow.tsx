import { useEffect, useState } from "react";

interface HeroSlideshowProps {
  images: { src: string; alt: string }[];
  interval?: number;
}

export function HeroSlideshow({ images, interval = 5000 }: HeroSlideshowProps) {
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
      {images.map((img, i) => (
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          className="absolute inset-0 h-full w-full object-contain transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
        />
      ))}
    </div>
  );
}
