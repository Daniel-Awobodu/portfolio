"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

/**
 * Google Drive share links (…/file/d/<id>/view?usp=sharing) can't be framed;
 * the same file's /preview URL can. Every other URL (Loom, YouTube embed,
 * Vimeo) is passed through untouched.
 */
function toEmbedUrl(src: string): string {
  const drive = src.match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
  return drive ? `https://drive.google.com/file/d/${drive[1]}/preview` : src;
}

/**
 * Walkthrough video hidden behind a button. Clicking it slides a 16:9 player
 * open and pushes the write-up down. The iframe only mounts on the first
 * open, so the page never loads the video for visitors who skip it.
 * Renders nothing when `src` is absent.
 */
export default function VideoEmbed({
  src,
  title = "Walkthrough video",
}: {
  src?: string;
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [full, setFull] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const exitFull = useCallback(() => {
    setFull(false);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }, []);

  // Full screen stays on this page. Where the browser allows it, the player
  // goes truly full screen and the phone turns to landscape; elsewhere (an
  // iPhone, say) it fills the window instead.
  async function enterFull() {
    setFull(true);
    const box = boxRef.current;
    try {
      if (box?.requestFullscreen) await box.requestFullscreen();
      const orientation = screen.orientation as ScreenOrientation & {
        lock?: (o: string) => Promise<void>;
      };
      await orientation.lock?.("landscape");
    } catch {
      // The window-filling layout is already showing.
    }
  }

  useEffect(() => {
    if (!full) return;
    const onChange = () => {
      if (!document.fullscreenElement) setFull(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") exitFull();
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("keydown", onKey);
    };
  }, [full, exitFull]);

  if (!src) return null;

  function toggle() {
    setLoaded(true);
    setOpen((value) => !value);
  }

  return (
    <div className="my-10">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="group inline-flex items-center gap-3 rounded-sm border border-accent-strong bg-card px-5 py-3 text-[0.9375rem] font-semibold text-accent-strong transition-colors duration-150 hover:bg-accent-strong hover:text-on-accent"
        >
          <span
            aria-hidden="true"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-strong text-on-accent transition-colors duration-150 group-hover:bg-on-accent group-hover:text-accent-strong"
          >
            {open ? (
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5"
                fill="currentColor"
              >
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="ml-0.5 h-3.5 w-3.5"
                fill="currentColor"
              >
                <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
              </svg>
            )}
          </span>
          {open ? "Hide the video" : "Watch the video presentation"}
        </button>
        <p className="text-sm text-muted">
          Tip: watch at{" "}
          <span className="font-semibold text-ink">1.5x to 2x</span> speed
        </p>
      </div>

      {/* Animating grid-template-rows from 0fr to 1fr slides the panel open
          at its natural height, so the text below is pushed down smoothly. */}
      <div
        id={panelId}
        className={`grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden" inert={!open}>
          <figure className="pt-6">
            <div
              ref={boxRef}
              className={
                full
                  ? "fixed inset-0 z-[100] bg-black"
                  : "relative w-full overflow-hidden rounded-md border border-hairline bg-ink pt-[56.25%]"
              }
            >
              {loaded ? (
                <iframe
                  src={toEmbedUrl(src)}
                  title={title}
                  allowFullScreen
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  className="absolute inset-0 h-full w-full"
                />
              ) : null}
              {/* Sits over the player's own "open in a new tab" corner, so the
                  full-screen tap keeps visitors on this page. */}
              <button
                type="button"
                onClick={full ? exitFull : enterFull}
                aria-label={full ? "Exit full screen video" : "Full screen video"}
                className="absolute top-0 right-0 z-10 flex h-14 w-14 items-center justify-center rounded-bl-md bg-black/80 text-white transition-colors duration-150 hover:bg-black"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
            <figcaption className="mt-3 text-sm text-muted">
              A walkthrough of the build, showing how it runs from start to
              finish. For a quicker watch, set the speed to 1.5x or 2x with the
              settings icon in the player.
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
