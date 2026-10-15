"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

/**
 * A link to a full-size screenshot that opens it over the page instead of in
 * a new tab. Without JavaScript, or with a new-tab click (Ctrl, Cmd, middle
 * button), it is still a plain link to the image.
 */
export default function ImageLightbox({
  href,
  alt,
  className = "",
  children,
}: {
  href: string;
  alt: string;
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleClosed = useCallback(() => {
    setOpen(false);
    linkRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <>
      <a
        ref={linkRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title="Open full size"
        aria-haspopup="dialog"
        className={className}
        onClick={(event) => {
          if (
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          ) {
            return;
          }
          event.preventDefault();
          setOpen(true);
        }}
      >
        {children}
      </a>
      {/* Portalled to <body>: a <dialog> can't sit inside the <p> that MDX
          wraps around each screenshot. */}
      {open
        ? createPortal(
            <Viewer src={href} alt={alt} onClosed={handleClosed} />,
            document.body,
          )
        : null}
    </>
  );
}

/**
 * The open image. Fits the screen first; when the screenshot is bigger than
 * that, a tap or click zooms to full detail, where it can be dragged or
 * scrolled around. Closes with the X, Escape, a tap beside the image, or the
 * browser's back button, which is the reflex on phones.
 */
function Viewer({
  src,
  alt,
  onClosed,
}: {
  src: string;
  alt: string;
  onClosed: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [zoomable, setZoomable] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [naturalWidth, setNaturalWidth] = useState(0);
  // Where the zoom was asked for: a point in the image (0 to 1) and on screen.
  const anchor = useRef({ x: 0.5, y: 0.5, screenX: 0, screenY: 0 });
  const drag = useRef<{
    x: number;
    y: number;
    left: number;
    top: number;
    moved: boolean;
  } | null>(null);

  // Open as a modal, and add a history entry so "back" closes the image
  // instead of leaving the page.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    if (!window.history.state?.lightbox) {
      window.history.pushState({ ...window.history.state, lightbox: true }, "");
    }
    window.addEventListener("popstate", onClosed);
    return () => window.removeEventListener("popstate", onClosed);
  }, [onClosed]);

  const close = useCallback(() => {
    // Undo our history entry; the popstate listener then closes the viewer.
    if (window.history.state?.lightbox) window.history.back();
    else onClosed();
  }, [onClosed]);

  const measure = useCallback(() => {
    const img = imgRef.current;
    if (!img || !img.naturalWidth) return;
    setLoaded(true);
    setNaturalWidth(img.naturalWidth);
    setZoomable(
      img.naturalWidth > img.clientWidth * 1.15 ||
        img.naturalHeight > img.clientHeight * 1.15,
    );
  }, []);

  // Measured at screen fit only: zoomed in, the image is always "bigger".
  useEffect(() => {
    if (zoomed) return;
    // A cached image can finish loading before React attaches onLoad.
    if (imgRef.current?.complete) measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, zoomed]);

  // Keep the point that was tapped under the finger after zooming in.
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const img = imgRef.current;
    if (!zoomed || !scroller || !img) return;
    const { x, y, screenX, screenY } = anchor.current;
    scroller.scrollLeft = img.offsetLeft + x * img.offsetWidth - screenX;
    scroller.scrollTop = img.offsetTop + y * img.offsetHeight - screenY;
  }, [zoomed]);

  function toggleZoom(point?: { clientX: number; clientY: number }) {
    const img = imgRef.current;
    if (!img || !zoomable) return;
    if (!zoomed) {
      const box = img.getBoundingClientRect();
      const screenX = point?.clientX ?? box.left + box.width / 2;
      const screenY = point?.clientY ?? box.top + box.height / 2;
      anchor.current = {
        x: (screenX - box.left) / box.width,
        y: (screenY - box.top) / box.height,
        screenX,
        screenY,
      };
    }
    setZoomed(!zoomed);
  }

  const iconButton =
    "flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition-colors duration-150 hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

  return (
    <dialog
      ref={dialogRef}
      aria-label={alt}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      className="m-0 h-dvh max-h-none w-full max-w-none overflow-hidden border-0 bg-black/97 p-0 text-white backdrop:bg-transparent"
    >
      <div
        ref={scrollerRef}
        className={`relative h-full w-full ${
          zoomed
            ? "cursor-grab overflow-auto active:cursor-grabbing"
            : "overflow-hidden"
        }`}
        onPointerDown={(event) => {
          const scroller = scrollerRef.current;
          if (!zoomed || !scroller || event.pointerType !== "mouse") return;
          drag.current = {
            x: event.clientX,
            y: event.clientY,
            left: scroller.scrollLeft,
            top: scroller.scrollTop,
            moved: false,
          };
        }}
        onPointerMove={(event) => {
          const scroller = scrollerRef.current;
          const d = drag.current;
          if (!d || !scroller || event.buttons !== 1) return;
          const dx = event.clientX - d.x;
          const dy = event.clientY - d.y;
          if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true;
          scroller.scrollLeft = d.left - dx;
          scroller.scrollTop = d.top - dy;
        }}
      >
        <div
          className={
            zoomed
              ? "flex h-max min-h-full w-max min-w-full items-center justify-center"
              : "flex h-full w-full items-center justify-center px-3 pt-16 pb-14 sm:px-10"
          }
          onClick={(event) => {
            const dragged = drag.current?.moved;
            drag.current = null;
            if (event.target === event.currentTarget && !dragged) close();
          }}
        >
          {/* A plain <img>: the viewer needs the original pixels to zoom
              into, not a resized copy. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            draggable={false}
            onLoad={measure}
            onClick={(event) => {
              const dragged = drag.current?.moved;
              drag.current = null;
              if (!dragged) toggleZoom(event);
            }}
            style={zoomed ? { width: naturalWidth } : undefined}
            className={`select-none ${
              zoomed
                ? "max-w-none"
                : `max-h-full max-w-full object-contain ${zoomable ? "cursor-zoom-in" : ""}`
            } ${loaded ? "" : "opacity-0"}`}
          />
        </div>
      </div>

      {!loaded ? (
        <p className="pointer-events-none fixed inset-0 flex items-center justify-center text-sm text-white/70">
          Loading image…
        </p>
      ) : null}

      <div className="fixed top-3 right-3 flex gap-2 sm:top-5 sm:right-5">
        {zoomable ? (
          <button
            type="button"
            onClick={() => toggleZoom()}
            aria-label={zoomed ? "Zoom out" : "Zoom in"}
            className={iconButton}
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
              <circle cx="11" cy="11" r="7" />
              <path
                d={
                  zoomed
                    ? "M8 11h6M20 20l-3.5-3.5"
                    : "M8 11h6M11 8v6M20 20l-3.5-3.5"
                }
              />
            </svg>
          </button>
        ) : null}
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          autoFocus
          className={iconButton}
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
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {loaded && zoomable ? (
        <p className="pointer-events-none fixed bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3.5 py-1.5 text-xs whitespace-nowrap text-white/90">
          {zoomed
            ? "Drag to look around. Tap the image to zoom out."
            : "Tap the image to zoom in"}
        </p>
      ) : null}
    </dialog>
  );
}
