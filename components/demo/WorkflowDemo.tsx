"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { DriveScene, EndScene, SheetScene } from "@/components/demo/AppScenes";
import CanvasScene from "@/components/demo/CanvasScene";
import PhoneScene from "@/components/demo/PhoneScene";
import type { Demo } from "@/lib/demos/types";

const fmt = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/**
 * "Watch it run": a scripted walkthrough of one build, played like a video.
 * Every frame is drawn from the current time, so play, pause, step and seek
 * always land exactly. It starts on a poster with a play button, pauses when
 * scrolled away, and can go full screen.
 */
export default function WorkflowDemo({ demo }: { demo: Demo }) {
  const starts = useMemo(() => {
    let acc = 0;
    return demo.beats.map((beat) => {
      const start = acc;
      acc += beat.duration;
      return start;
    });
  }, [demo]);
  const total =
    starts[starts.length - 1] + demo.beats[demo.beats.length - 1].duration;

  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [full, setFull] = useState(false);
  const [size, setSize] = useState({ w: 1036, h: 648 });
  const [reduced, setReduced] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef(0);
  timeRef.current = time;

  // Before the first play, the cover shows the busiest moment: the first
  // workflow step with the most output, mostly done.
  const outputRows = (i: number) => {
    const b = demo.beats[i];
    return b.scene === "canvas" ? (b.output?.length ?? 0) : -1;
  };
  const posterBeat = demo.beats.reduce(
    (best, _, i) => (outputRows(i) > outputRows(best) ? i : best),
    0,
  );
  const shown = started
    ? time
    : starts[posterBeat] + demo.beats[posterBeat].duration * 0.8;

  const beatAt = (ms: number) => {
    let i = starts.length - 1;
    while (i > 0 && starts[i] > ms) i -= 1;
    return i;
  };
  // The step the controls act on, and the frame on screen (the cover, before
  // the first play).
  const index = beatAt(time);
  const shownIndex = beatAt(shown);
  const beat = demo.beats[shownIndex];
  const t = Math.min(1, (shown - starts[shownIndex]) / beat.duration);
  const ended = time >= total;

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // The playback clock.
  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const next = Math.min(total, timeRef.current + (now - last));
      last = now;
      setTime(next);
      if (next >= total) setPlaying(false);
      else frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [playing, total]);

  // Scenes lay out from the stage's real size.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const box = entry.contentRect;
      setSize({ w: box.width, h: box.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Pause when the demo scrolls out of view.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setPlaying(false);
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onChange = () => setFull(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const play = useCallback(() => {
    setStarted(true);
    if (timeRef.current >= total) setTime(0);
    setPlaying(true);
  }, [total]);

  const toggle = () => (playing ? setPlaying(false) : play());

  const step = (dir: 1 | -1) => {
    setStarted(true);
    setPlaying(false);
    if (dir === 1) {
      setTime(index + 1 < starts.length ? starts[index + 1] : total);
    } else {
      // Back to the start of this step, or the previous one if already there.
      const target =
        time - starts[index] > 600 || index === 0 ? index : index - 1;
      setTime(starts[target]);
    }
  };

  const toggleFull = async () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (full) {
      setFull(false);
    } else if (el.requestFullscreen) {
      try {
        await el.requestFullscreen();
      } catch {
        setFull(true);
      }
    } else {
      // iPhone Safari has no element full screen; cover the page instead.
      setFull(true);
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.target instanceof HTMLInputElement) return;
    if (event.key === " " || event.key === "k") {
      event.preventDefault();
      toggle();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    } else if (event.key === "Escape" && full && !document.fullscreenElement) {
      setFull(false);
    }
  };

  const narrow = size.w < 640;
  const scene = beat.scene;
  const label = demo.sceneLabels[scene];

  return (
    <div
      ref={wrapRef}
      onKeyDown={onKeyDown}
      className={
        full
          ? "fixed inset-0 z-[60] flex flex-col justify-center bg-black p-2 sm:p-4"
          : "overflow-hidden rounded-xl border border-[#2a302d] bg-[#0b100e] shadow-card"
      }
    >
      <div
        ref={stageRef}
        role="region"
        aria-roledescription="animated walkthrough"
        aria-label={`Walkthrough: ${demo.end.headline}`}
        tabIndex={0}
        className={`relative mx-auto aspect-[4/5] w-full overflow-hidden bg-[#0b100e] [container-type:size] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#4cc995] sm:aspect-[16/10] ${
          full
            ? "max-w-[calc((100dvh-6.5rem)*0.8)] rounded-lg sm:max-w-[calc((100dvh-6.5rem)*1.6)]"
            : ""
        }`}
      >
        {/* Scenes */}
        <div
          key={scene}
          className="demo-fade absolute inset-0"
          aria-hidden="true"
        >
          {scene === "object" || scene === "camera" || scene === "chat" ? (
            <PhoneScene
              demo={demo}
              scene={scene}
              messages={beat.scene === "chat" ? beat.messages : []}
              t={t}
            />
          ) : null}
          {scene === "canvas" ? (
            <CanvasScene
              demo={demo}
              beatIndex={shownIndex}
              t={t}
              width={size.w}
              height={size.h}
              narrow={narrow}
              reduced={reduced}
            />
          ) : null}
          {scene === "drive" ? (
            <DriveScene demo={demo} t={t} narrow={narrow} />
          ) : null}
          {scene === "sheet" ? (
            <SheetScene demo={demo} t={t} narrow={narrow} />
          ) : null}
        </div>
        {scene === "end" ? <EndScene demo={demo} onReplay={play} /> : null}

        {/* Scene tag and honesty badge */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-[clamp(8px,2cqw,16px)]">
          <span className="rounded-full bg-black/60 px-3 py-1 text-[clamp(10px,1.4cqw,13px)] font-semibold tracking-wide text-white uppercase">
            {label}
          </span>
          <span className="rounded-full bg-black/60 px-3 py-1 text-[clamp(10px,1.3cqw,12px)] text-[#c9cfcc]">
            Simulation · sample data
          </span>
        </div>

        {/* Caption */}
        {!started ? null : scene !== "end" ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent px-[clamp(12px,4cqw,40px)] pt-[6cqh] pb-[clamp(10px,2.4cqh,20px)]">
            <p
              aria-live="polite"
              className="mx-auto max-w-[56ch] text-center text-[clamp(13px,1.9cqw,19px)] leading-snug font-medium text-white"
            >
              {beat.caption}
            </p>
          </div>
        ) : (
          <p aria-live="polite" className="sr-only">
            {beat.caption}
          </p>
        )}

        {/* Poster: the first frame behind a play button */}
        {!started ? (
          <button
            type="button"
            onClick={play}
            className="group absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/55 text-white"
          >
            <span className="flex h-[clamp(56px,10cqw,84px)] w-[clamp(56px,10cqw,84px)] items-center justify-center rounded-full bg-[#4cc995] text-[#0b100e] shadow-lg transition-transform duration-150 group-hover:scale-105">
              <svg
                viewBox="0 0 24 24"
                className="ml-1 h-1/2 w-1/2"
                aria-hidden="true"
              >
                <path d="M7 4v16l13-8L7 4Z" fill="currentColor" />
              </svg>
            </span>
            {/* Backed, so it stays readable over any frame. */}
            <span className="flex flex-col items-center gap-1 rounded-lg bg-black/75 px-4 py-2.5">
              <span className="text-[clamp(16px,2.4cqw,22px)] font-semibold">
                Watch it run
              </span>
              <span className="text-[clamp(12px,1.5cqw,14px)] text-white/85">
                {Math.round(total / 1000)} seconds · simulation with sample data
              </span>
            </span>
          </button>
        ) : null}
      </div>

      {/* Controls */}
      <div
        className={`mx-auto flex w-full items-center gap-2 px-3 py-2.5 text-[#d7dbd9] sm:gap-3 sm:px-4 ${
          full
            ? "max-w-[calc((100dvh-6.5rem)*0.8)] sm:max-w-[calc((100dvh-6.5rem)*1.6)]"
            : ""
        }`}
      >
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous step"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-white/10"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
              d="M6 5v14M18 5 9 12l9 7V5Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause" : ended ? "Watch again" : "Play"}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4cc995] text-[#0b100e] hover:bg-[#6ddcae]"
        >
          {playing ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="ml-0.5 h-5 w-5"
              aria-hidden="true"
            >
              <path d="M7 4v16l13-8L7 4Z" fill="currentColor" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next step"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-white/10"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
              d="M18 5v14M6 5l9 7-9 7V5Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <input
          type="range"
          min={0}
          max={total}
          step={50}
          value={time}
          onChange={(event) => {
            setStarted(true);
            setTime(Number(event.target.value));
          }}
          aria-label="Position in the walkthrough"
          aria-valuetext={`Step ${index + 1} of ${demo.beats.length}: ${demo.beats[index].caption}`}
          className="min-w-0 flex-1 cursor-pointer accent-[#4cc995]"
        />

        <span className="hidden shrink-0 text-[12px] tabular-nums text-[#a3a9a6] sm:inline">
          {fmt(time)} / {fmt(total)}
        </span>
        <span className="shrink-0 text-[12px] tabular-nums text-[#a3a9a6]">
          {index + 1}/{demo.beats.length}
        </span>

        <button
          type="button"
          onClick={toggleFull}
          aria-label={full ? "Exit full screen" : "Full screen"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-white/10"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {full ? (
              <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
            ) : (
              <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
            )}
          </svg>
        </button>
      </div>
    </div>
  );
}
