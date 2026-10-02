"use client";

import { useEffect, useMemo, useState } from "react";
import CaseStudyCard from "./CaseStudyCard";
import { normalise } from "@/lib/search";
import type { CaseStudyMeta } from "@/lib/types";

export type SearchableStudy = CaseStudyMeta & {
  /** Every searchable word for this study, pre-normalised on the server. */
  haystack: string;
};

/**
 * Lane-page grid with a keyword filter. Every word typed must appear somewhere
 * in a study (title, summary, tools, client, metrics or the write-up itself),
 * so "whatsapp ai" narrows rather than widens. The query is mirrored into
 * `?q=` so a filtered view can be linked to directly, e.g. /automation?q=hubspot.
 */
export default function CaseStudySearch({
  studies,
}: {
  studies: SearchableStudy[];
}) {
  const [query, setQuery] = useState("");

  // Read ?q= once on load. Done in an effect rather than useSearchParams so
  // the page stays fully static.
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q");
    if (initial) setQuery(initial);
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (query.trim()) url.searchParams.set("q", query.trim());
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", url);
  }, [query]);

  const tools = useMemo(() => {
    const counts = new Map<string, number>();
    for (const study of studies) {
      for (const tool of study.tools) {
        counts.set(tool, (counts.get(tool) ?? 0) + 1);
      }
    }
    // Most-used tools first, so the chips lead with what clients ask about.
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tool]) => tool);
  }, [studies]);

  const terms = normalise(query).split(" ").filter(Boolean);
  const results =
    terms.length === 0
      ? studies
      : studies.filter((study) =>
          terms.every((term) => study.haystack.includes(term)),
        );

  const activeTool = tools.find(
    (tool) => normalise(tool) === normalise(query),
  );

  return (
    <div>
      <div className="max-w-2xl">
        <label htmlFor="build-search" className="eyebrow">
          Search {studies.length} builds
        </label>
        <div className="relative mt-3">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            id="build-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try WhatsApp, HubSpot, booking, receipts…"
            autoComplete="off"
            className="w-full rounded-sm border border-muted bg-card py-3.5 pr-4 pl-12 text-base text-ink transition-colors duration-150 placeholder:text-muted hover:border-ink focus:border-accent-strong"
          />
        </div>

        {tools.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Filter by tool">
            {tools.map((tool) => {
              const active = tool === activeTool;
              return (
                <li key={tool}>
                  <button
                    type="button"
                    onClick={() => setQuery(active ? "" : tool)}
                    aria-pressed={active}
                    className={`rounded-sm border px-3 py-1.5 text-sm transition-colors duration-150 ${
                      active
                        ? "border-accent-strong bg-accent-strong text-on-accent"
                        : "border-hairline bg-card text-ink hover:border-accent"
                    }`}
                  >
                    {tool}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      <p className="mt-8 text-sm text-muted" aria-live="polite">
        {terms.length === 0
          ? `Showing all ${studies.length} builds`
          : `${results.length} of ${studies.length} builds match “${query.trim()}”`}
      </p>

      {results.length > 0 ? (
        <ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((study, index) => (
            <li key={study.slug}>
              <CaseStudyCard study={study} priority={index < 3} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-5 rounded-md border border-dashed border-hairline bg-card px-6 py-12 text-center">
          <p className="font-display text-xl leading-snug font-semibold text-ink">
            No build matches that yet
          </p>
          <p className="mx-auto mt-2 max-w-md text-[0.9375rem] leading-relaxed text-muted">
            That doesn&rsquo;t mean I can&rsquo;t build it. Tell me what you
            need and I&rsquo;ll tell you how I&rsquo;d approach it.
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-6 text-[0.9375rem] font-semibold text-accent-strong underline underline-offset-4"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
