"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import DemoScenes, { sceneLabel } from "@/components/demo/DemoScenes";
import { unlockAudio } from "@/components/demo/narrator";
import { useDemoClock } from "@/components/demo/useDemoClock";
import { clipPath } from "@/lib/demos/narration";
import type { Demo } from "@/lib/demos/types";

const fmt = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/**
 * "Watch it run": a scripted walkthrough of one build, played like a video.
 * Every frame is drawn from the current time, so play, pause, step and seek
 * always land exactly. It starts on a poster with a play button, pauses when
 * scrolled away, and can go full screen. Opened from a card (`startFull`), it
 * plays straight away in full screen and closes when full screen ends.
 * When the build has narration, it plays only once the visitor has chosen to
 * watch, and can be muted.
 */
export default function WorkflowDemo({
  demo,
  startFull = false,
  onClose,
  audio,
}: {
  demo: Demo;
  startFull?: boolean;
  onClose?: () => void;
  /** A narration element already unlocked by the tap that opened this. */
  audio?: HTMLAudioElement;
}) {
  const {
    starts,
    total,
    time,
    setTime,
    playing,
    setPlaying,
    play: run,
    beatAt,
  } = useDemoClock(demo);

  const [started, setStarted] = useState(startFull);
  const [full, setFull] = useState(false);
  const [size, setSize] = useState({ w: 1036, h: 648 });
  const [reduced, setReduced] = useState(false);
  const [sound, setSound] = useState(true);
  // Bumped on every seek, so the narration jumps with the picture.
  const [cue, setCue] = useState(0);

  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wasFullscreen = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(audio ?? null);
  const timeRef = useRef(time);
  timeRef.current = time;
  const voiced = Boolean(demo.voice);

  // Before the first play, the cover shows the busiest moment: the first
  // workflow step with the most output, mostly done.
  const outputRows = (i: number) => {
    const b = demo.beats[i];
    return b.scene === "canvas" || b.scene === "zap"
      ? (b.output?.length ?? 0)
      : -1;
  };
  const posterBeat = demo.beats.reduce(
    (best, _, i) => (outputRows(i) > outputRows(best) ? i : best),
    0,
  );
  const shown = started
    ? time
    : starts[posterBeat] + demo.beats[posterBeat].duration * 0.8;

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
  }, [setPlaying]);

  useEffect(() => {
    const onChange = () => {
      const now = Boolean(document.fullscreenElement);
      setFull(now);
      if (now) wasFullscreen.current = true;
      else if (wasFullscreen.current && startFull) onClose?.();
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [startFull, onClose]);

  // Narration: the current beat's clip, from the right point in it, while
  // playing with sound on.
  useEffect(() => {
    if (!voiced) return;
    const el = (audioRef.current ??= new Audio());
    const clip = demo.voice?.[index] ?? null;
    const offset = timeRef.current - starts[index];
    if (!sound || !playing || !clip || offset >= clip) {
      el.pause();
      return;
    }
    const src = clipPath(demo.slug, index);
    if (!el.src.endsWith(src)) el.src = src;
    el.currentTime = offset / 1000;
    el.play().catch(() => {});
  }, [voiced, demo, sound, playing, index, cue, starts]);

  useEffect(() => () => audioRef.current?.pause(), []);

  /** Called from taps, so iPhones allow the narration that follows. */
  const unlock = () => {
    if (!voiced) return;
    unlockAudio((audioRef.current ??= new Audio()));
  };

  const play = useCallback(() => {
    setStarted(true);
    run();
  }, [run]);

  const enterFull = useCallback(async () => {
    const el = wrapRef.current;
    if (!el) return;
    if (el.requestFullscreen) {
      try {
        await el.requestFullscreen();
        return;
      } catch {
        // Falls through to covering the page.
      }
    }
    // iPhone Safari has no element full screen; cover the page instead.
    setFull(true);
  }, []);

  // Opened from a card: straight into full screen, playing from the start.
  useEffect(() => {
    if (!startFull) return;
    enterFull();
    run();
    stageRef.current?.focus({ preventScroll: true });
    // Runs once, when the player opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // While it covers the page, the page behind it doesn't scroll.
  useEffect(() => {
    if (!full || document.fullscreenElement) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [full]);

  const toggle = () => {
    unlock();
    if (playing) setPlaying(false);
    else play();
  };

  const step = (dir: 1 | -1) => {
    setStarted(true);
    setPlaying(false);
    if (dir === 1) {
      setTime(index + 1 < starts.length ? starts[index + 1] : total);
      setCue((c) => c + 1);
    } else {
      // Back to the start of this step, or the previous one if already there.
      const target =
        time - starts[index] > 600 || index === 0 ? index : index - 1;
      setTime(starts[target]);
      setCue((c) => c + 1);
    }
  };

  const toggleFull = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (full) {
      setFull(false);
      if (startFull) onClose?.();
    } else {
      await enterFull();
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
      if (startFull) onClose?.();
    }
  };

  const narrow = size.w < 640;
  const label = sceneLabel(demo, beat);

  return (
    <div
      ref={wrapRef}
      onKeyDown={onKeyDown}
      role={startFull ? "dialog" : undefined}
      aria-modal={startFull || undefined}
      aria-label={startFull ? `Walkthrough: ${demo.end.headline}` : undefined}
      className={
        full
          ? "fixed inset-0 z-[60] flex flex-col justify-center bg-black p-2 sm:p-4"
          : startFull
            ? "fixed inset-0 z-[60] flex flex-col justify-center bg-black"
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
          full || startFull
            ? "max-w-[calc((100dvh-6.5rem)*0.8)] rounded-lg sm:max-w-[calc((100dvh-6.5rem)*1.6)]"
            : ""
        }`}
      >
        <DemoScenes
          demo={demo}
          beatIndex={shownIndex}
          t={t}
          width={size.w}
          height={size.h}
          narrow={narrow}
          reduced={reduced}
          onReplay={play}
        />

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
        {!started ? null : beat.scene !== "end" ? (
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
            onClick={() => {
              unlock();
              play();
            }}
            className="group absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.7),rgba(0,0,0,0.35))] text-white"
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
          full || startFull
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
            setCue((c) => c + 1);
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

        {voiced ? (
          <button
            type="button"
            onClick={() => {
              unlock();
              setSound((on) => !on);
            }}
            aria-label={sound ? "Mute the narration" : "Turn the narration on"}
            aria-pressed={!sound}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-white/10"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" />
              {sound ? (
                <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
              ) : (
                <path d="m17 9 5 6M22 9l-5 6" />
              )}
            </svg>
          </button>
        ) : null}

        <button
          type="button"
          onClick={toggleFull}
          aria-label={full || startFull ? "Exit full screen" : "Full screen"}
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
            {full || startFull ? (
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
