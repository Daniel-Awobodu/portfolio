"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 520px";

/**
 * 5 to 7 seconds per slide, picked from the image path so it stays stable
 * between renders, and a grid of cards doesn't flip in step.
 */
function slideDelay(seed: string): number {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return 5000 + (hash % 2001);
}

/**
 * Card cover. Leads with the result; when the build has a workflow canvas,
 * it slides across to it and back while the card is on screen, for visitors
 * who want to see the wiring. Picking a slide stops the rotation, and it
 * never starts for visitors who prefer reduced motion.
 */
export default function CardCover({
  cover,
  canvas,
  title,
  priority = false,
}: {
  cover: string;
  canvas?: string;
  title: string;
  priority?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  // The canvas is only fetched once the card has been on screen.
  const [seen, setSeen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!canvas || !el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const delay = slideDelay(canvas);
    let timer: number | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        window.clearInterval(timer);
        if (!entry.isIntersecting) return;
        setSeen(true);
        if (auto && !reduced) {
          timer = window.setInterval(() => setIndex((i) => 1 - i), delay);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [canvas, auto]);

  const imageClass =
    "object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]";

  if (!canvas) {
    return (
      <Image
        src={cover}
        alt={`Result from ${title}`}
        fill
        sizes={SIZES}
        priority={priority}
        className={imageClass}
      />
    );
  }

  const slides = [
    { label: "Result", alt: `Result from ${title}` },
    { label: "Workflow", alt: `Workflow behind ${title}` },
  ];

  return (
    <div ref={ref} className="absolute inset-0">
      <div
        className={`flex h-full w-[200%] transition-transform duration-700 ease-in-out motion-reduce:transition-none ${
          index === 1 ? "-translate-x-1/2" : "translate-x-0"
        }`}
      >
        <div className="relative h-full w-1/2 overflow-hidden" aria-hidden={index !== 0}>
          <Image
            src={cover}
            alt={slides[0].alt}
            fill
            sizes={SIZES}
            priority={priority}
            className={imageClass}
          />
        </div>
        <div className="relative h-full w-1/2 overflow-hidden" aria-hidden={index !== 1}>
          {seen ? (
            <Image
              src={canvas}
              alt={slides[1].alt}
              fill
              sizes={SIZES}
              loading="eager"
              className={imageClass}
            />
          ) : null}
        </div>
      </div>

      {/* Sits above the card's full-size link, so a tap here switches the
          slide instead of opening the build. */}
      <div
        role="group"
        aria-label="Cover image"
        className="absolute bottom-3 left-3 z-10 flex rounded-full border border-hairline bg-card p-0.5 shadow-sm"
      >
        {slides.map((slide, n) => (
          <button
            key={slide.label}
            type="button"
            aria-pressed={index === n}
            onClick={() => {
              setAuto(false);
              setSeen(true);
              setIndex(n);
            }}
            className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors duration-150 ${
              index === n
                ? "bg-accent-strong text-on-accent"
                : "text-muted hover:text-ink"
            }`}
          >
            {slide.label}
          </button>
        ))}
      </div>
    </div>
  );
}
