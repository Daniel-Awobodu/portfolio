"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import DemoPreview from "@/components/demo/DemoPreview";
import { unlockAudio } from "@/components/demo/narrator";
import WorkflowDemo from "@/components/demo/WorkflowDemo";
import type { Demo } from "@/lib/demos/types";

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
  demo,
  live = false,
}: {
  cover: string;
  canvas?: string;
  title: string;
  priority?: boolean;
  /** The build's walkthrough, which then leads the cover. */
  demo?: Demo;
  /** The card shows the Live badge, top left. */
  live?: boolean;
}) {
  if (demo) {
    return (
      <DemoCover
        demo={demo}
        cover={cover}
        canvas={canvas}
        title={title}
        live={live}
      />
    );
  }
  return (
    <ImageCover
      cover={cover}
      canvas={canvas}
      title={title}
      priority={priority}
    />
  );
}

function ImageCover({
  cover,
  canvas,
  title,
  priority,
}: {
  cover: string;
  canvas?: string;
  title: string;
  priority: boolean;
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
        <div
          className="relative h-full w-1/2 overflow-hidden"
          aria-hidden={index !== 0}
        >
          <Image
            src={cover}
            alt={slides[0].alt}
            fill
            sizes={SIZES}
            priority={priority}
            className={imageClass}
          />
        </div>
        <div
          className="relative h-full w-1/2 overflow-hidden"
          aria-hidden={index !== 1}
        >
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

const IMAGE_SLIDE_MS = 6000;
/** A beat on the closing card before moving on to the pictures. */
const END_HOLD_MS = 1800;

/**
 * Card cover led by the build's walkthrough. It plays silently while the card
 * is on screen, then slides to the result and the workflow, and starts over.
 * Pause stops all of it, Full screen opens the full player, and visitors who
 * prefer reduced motion get the pictures, with the walkthrough a tap away.
 */
function DemoCover({
  demo,
  cover,
  canvas,
  title,
  live,
}: {
  demo: Demo;
  cover: string;
  canvas?: string;
  title: string;
  live: boolean;
}) {
  const slides = [
    { label: "Walkthrough" },
    { label: "Result", src: cover, alt: `Result from ${title}` },
    ...(canvas
      ? [{ label: "Workflow", src: canvas, alt: `Workflow behind ${title}` }]
      : []),
  ];
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  // The pictures are only fetched once the card has been on screen.
  const [seen, setSeen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [open, setOpen] = useState(false);
  // The narration, unlocked by the Full screen tap itself.
  const audio = useRef<HTMLAudioElement | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const fullButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) {
      setReduced(true);
      setIndex(1);
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setSeen(true);
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const moving = visible && !paused && !open && !reduced;

  // The pictures take turns, then hand back to the walkthrough.
  useEffect(() => {
    if (!moving || index === 0) return;
    const timer = window.setTimeout(
      () => setIndex((i) => (i + 1) % slides.length),
      IMAGE_SLIDE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [moving, index, slides.length]);

  const [ended, setEnded] = useState(false);
  useEffect(() => {
    if (!ended) return;
    const timer = window.setTimeout(() => {
      setEnded(false);
      setIndex(1);
    }, END_HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [ended]);

  const close = () => {
    setOpen(false);
    fullButton.current?.focus({ preventScroll: true });
  };

  const pill =
    "flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm";

  return (
    <div ref={ref} className="absolute inset-0 bg-[#0b100e]">
      <div
        className="flex h-full transition-transform duration-700 ease-in-out motion-reduce:transition-none"
        style={{
          width: `${slides.length * 100}%`,
          transform: `translateX(-${(index * 100) / slides.length}%)`,
        }}
      >
        {slides.map((slide, n) => (
          <div
            key={slide.label}
            className="relative h-full overflow-hidden"
            style={{ width: `${100 / slides.length}%` }}
            aria-hidden={index !== n}
          >
            {slide.src ? (
              seen || index === n ? (
                <>
                  {/* On a portrait phone card the whole picture shows,
                      over a blurred copy of itself. */}
                  <Image
                    src={slide.src}
                    alt=""
                    fill
                    sizes={SIZES}
                    className="scale-110 object-cover opacity-60 blur-xl sm:hidden"
                  />
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    sizes={SIZES}
                    className="object-contain transition-transform duration-300 ease-out group-hover:scale-[1.03] sm:object-cover"
                  />
                </>
              ) : null
            ) : (
              <DemoPreview
                demo={demo}
                run={moving && index === 0 && !ended}
                onEnd={() => setEnded(true)}
              />
            )}
          </div>
        ))}
      </div>

      {/* What's showing. A walkthrough is always marked as a simulation. */}
      <span
        className={`pointer-events-none absolute left-3 z-10 rounded-full bg-black/75 px-2 py-0.5 text-[11px] font-medium text-white ${live ? "top-11" : "top-3"}`}
      >
        {index === 0 ? "Simulation · sample data" : slides[index].label}
      </span>

      {/* Above the card's full-size link, so these don't open the build. */}
      <div className="absolute top-3 right-3 z-10 flex gap-1.5">
        {!reduced ? (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play the card" : "Pause the card"}
            className={`${pill} h-7 w-7 justify-center px-0 hover:bg-black/80`}
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
              {paused ? (
                <path d="M7 4v16l13-8L7 4Z" fill="currentColor" />
              ) : (
                <path
                  d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"
                  fill="currentColor"
                />
              )}
            </svg>
          </button>
        ) : null}
        <button
          ref={fullButton}
          type="button"
          onClick={() => {
            if (demo.voice) unlockAudio((audio.current ??= new Audio()));
            setOpen(true);
          }}
          aria-label={`Watch the walkthrough full screen: ${title}`}
          className={`${pill} h-7 hover:bg-black/80`}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          </svg>
          Full screen
        </button>
      </div>

      {open
        ? createPortal(
            <WorkflowDemo
              demo={demo}
              startFull
              onClose={close}
              audio={audio.current ?? undefined}
            />,
            document.body,
          )
        : null}
    </div>
  );
}
