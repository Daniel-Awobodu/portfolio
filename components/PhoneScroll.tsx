import type { ReactNode } from "react";
import PhoneFrame, { ScrollHint } from "@/components/PhoneFrame";
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
        <PhoneFrame tiles={tiles} alt={alt} />
        <figcaption className="mt-4 text-sm leading-relaxed text-muted">
          <ScrollHint />
          {caption ? <span className="mt-1 block">{caption}</span> : null}
        </figcaption>
      </div>

      {children ? <div className="prose-editorial">{children}</div> : null}
    </figure>
  );
}
