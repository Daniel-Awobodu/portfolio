import Image from "next/image";
import type { ReactNode } from "react";
import { jpegSize } from "@/lib/image-size";

/**
 * A full-length mobile screenshot inside a phone, scrollable in place, so a
 * visitor can read a whole landing page without it taking over the screen.
 *
 * `screens` is a comma-separated list because MDX here allows no JS
 * expressions in props. The page is cut into several JPEG tiles: one image
 * tens of thousands of pixels tall is more than phone browsers will decode.
 * Each tile's real size is read at build time, so the space is reserved
 * before it loads and the page doesn't jump while someone is scrolling.
 * Anything passed as children sits beside the phone as notes.
 */
export default function PhoneScroll({
  screens,
  alt,
  caption,
  children,
}: {
  screens: string;
  alt: string;
  caption?: string;
  children?: ReactNode;
}) {
  const tiles = screens
    .split(",")
    .map((src) => src.trim())
    .filter(Boolean)
    .map((src) => ({ src, ...jpegSize(src) }));

  return (
    <figure className="grid items-start gap-8 sm:grid-cols-[auto_minmax(0,1fr)]">
      <div className="mx-auto w-[272px] sm:mx-0">
        <div className="relative rounded-[2.75rem] bg-device p-[10px] shadow-lift ring-1 ring-edge">
          {/* Side buttons, purely decorative. */}
          <span
            aria-hidden="true"
            className="absolute top-28 -left-[3px] h-12 w-[3px] rounded-l-sm bg-device"
          />
          <span
            aria-hidden="true"
            className="absolute top-24 -right-[3px] h-16 w-[3px] rounded-r-sm bg-device"
          />

          <div className="overflow-hidden rounded-[2.1rem] bg-white">
            <div className="flex h-8 items-center justify-center">
              <span
                aria-hidden="true"
                className="h-5 w-20 rounded-full bg-device"
              />
            </div>
            {/* Focusable so keyboard users can scroll it too. The scrollbar is
                hidden to keep the phone look; the caption says it scrolls. */}
            <div
              tabIndex={0}
              role="region"
              aria-label={`${alt} Scrollable.`}
              className="h-[min(520px,68svh)] overflow-y-auto [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent-strong [&::-webkit-scrollbar]:hidden"
            >
              {tiles.map(({ src, width, height }, index) => (
                <Image
                  key={src}
                  src={src}
                  alt={index === 0 ? alt : ""}
                  width={width}
                  height={height}
                  sizes="252px"
                  loading={index < 2 ? "eager" : "lazy"}
                  className="block h-auto w-full rounded-none border-0"
                />
              ))}
            </div>
          </div>
        </div>

        <figcaption className="mt-4 text-sm leading-relaxed text-muted">
          <span className="flex items-center gap-1.5 font-semibold text-ink">
            <span aria-hidden="true">↕</span> Scroll inside the phone
          </span>
          {caption ? <span className="mt-1 block">{caption}</span> : null}
        </figcaption>
      </div>

      {children ? <div className="prose-editorial">{children}</div> : null}
    </figure>
  );
}
