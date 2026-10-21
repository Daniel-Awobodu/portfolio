"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import PhoneFrame, {
  ScrollHint,
  type PhoneTile,
} from "@/components/PhoneFrame";
import type { LandingPage } from "@/lib/landing-pages";

export type GalleryPage = LandingPage & { thumb: string; tiles: PhoneTile[] };

const STEP: Record<string, number> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

/**
 * A row of round product thumbnails; picking one shows that landing page in
 * the large phone below. Built as tabs, so arrow keys move between products
 * and screen readers announce which page is showing.
 */
export default function LandingGallery({ pages }: { pages: GalleryPage[] }) {
  const [index, setIndex] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const page = pages[index];

  function select(next: number) {
    setIndex(next);
    tabs.current[next]?.focus();
  }

  function onKeyDown(event: KeyboardEvent) {
    const last = pages.length - 1;
    if (event.key in STEP) {
      select((index + STEP[event.key] + pages.length) % pages.length);
    } else if (event.key === "Home") {
      select(0);
    } else if (event.key === "End") {
      select(last);
    } else {
      return;
    }
    event.preventDefault();
  }

  return (
    <>
      <div
        role="tablist"
        aria-label="Landing pages"
        onKeyDown={onKeyDown}
        className="-mx-5 mt-8 flex snap-x gap-3 overflow-x-auto px-5 pt-1 pb-2 sm:mx-0 sm:flex-wrap sm:gap-4 sm:overflow-visible sm:px-0"
      >
        {pages.map((item, n) => {
          const selected = n === index;
          return (
            <button
              key={item.slug}
              ref={(el) => {
                tabs.current[n] = el;
              }}
              type="button"
              role="tab"
              id={`landing-tab-${item.slug}`}
              aria-selected={selected}
              aria-controls="landing-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setIndex(n)}
              className="group flex w-20 shrink-0 snap-start flex-col items-center gap-2 rounded-md text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong sm:w-24"
            >
              <span
                className={`relative block h-16 w-16 overflow-hidden rounded-full ring-2 ring-offset-2 ring-offset-paper transition duration-150 sm:h-20 sm:w-20 ${
                  selected
                    ? "ring-accent"
                    : "ring-edge group-hover:ring-accent-strong/60"
                }`}
              >
                <Image
                  src={item.thumb}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </span>
              <span
                className={`text-xs leading-tight ${
                  selected ? "font-semibold text-ink" : "text-muted"
                }`}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id="landing-panel"
        aria-labelledby={`landing-tab-${page.slug}`}
        className="mt-8 grid items-start gap-8 md:grid-cols-[auto_minmax(0,1fr)] md:gap-12"
      >
        <div className="order-2 mx-auto w-[300px] md:order-1 md:mx-0">
          {/* Keyed by page, so switching starts the new page at its top. */}
          <PhoneFrame
            key={page.slug}
            tiles={page.tiles}
            alt={`The ${page.name.toLowerCase()} landing page on a phone, from the top down to the order form.`}
            size="lg"
          />
          <p className="mt-4 text-sm leading-relaxed text-muted">
            <ScrollHint />
            <span className="mt-1 block">
              The live page in mobile view.
              {page.blurred ? " Customer names and photos are blurred." : ""}
            </span>
          </p>
        </div>

        {/* On phones the name and order count come first, then the phone. */}
        <div className="order-1 md:order-2 md:pt-6">
          <p className="eyebrow">{page.date}</p>
          <h3 className="mt-2 font-display text-2xl leading-tight font-semibold text-ink">
            {page.name}
          </h3>
          <p className="mt-3 max-w-prose text-[1.0625rem] leading-relaxed text-muted">
            {page.note}
          </p>
          {page.orders ? (
            <div className="mt-6 max-w-xs border-t border-hairline pt-5">
              <p className="font-display text-[1.75rem] leading-none font-semibold text-accent">
                {page.orders.toLocaleString("en-GB")}
              </p>
              <p className="mt-1.5 text-sm text-muted">
                orders through this page&rsquo;s form
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
