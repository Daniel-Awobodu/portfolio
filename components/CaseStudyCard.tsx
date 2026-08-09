import Image from "next/image";
import Link from "next/link";
import type { CaseStudy } from "@/lib/types";

/**
 * Lane-page card. Everything except `title` degrades gracefully:
 * no cover falls back to a typographic panel, and missing metrics/tools simply
 * drop out rather than leaving holes in the grid.
 */
export default function CaseStudyCard({
  study,
  priority = false,
}: {
  study: CaseStudy;
  priority?: boolean;
}) {
  const topMetric = study.metrics[0];

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-md border border-hairline bg-card transition-all duration-200 ease-out hover:-translate-y-1 hover:border-accent hover:shadow-lift">
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-hairline bg-paper">
        {study.cover ? (
          <Image
            src={study.cover}
            alt={`Cover image for ${study.title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 520px"
            priority={priority}
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          /* No cover set — a quiet editorial panel rather than a broken image.
             Deliberately wordless: the client, title and metric all appear
             directly below, so repeating them here would just read as noise. */
          <div
            aria-hidden="true"
            className="flex h-full w-full flex-col justify-end gap-2.5 p-6"
          >
            <span className="block h-px w-full bg-hairline" />
            <span className="block h-px w-2/3 bg-hairline" />
            <span className="block h-px w-1/3 bg-accent" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="eyebrow">
          {[study.client, study.year].filter(Boolean).join(" · ")}
        </p>

        <h3 className="mt-2.5 font-display text-xl leading-snug font-semibold text-ink">
          <Link
            href={`/${study.lane}/${study.slug}`}
            className="after:absolute after:inset-0"
          >
            {study.title}
          </Link>
        </h3>

        {study.summary ? (
          <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">
            {study.summary}
          </p>
        ) : null}

        <div className="mt-auto pt-6">
          {topMetric ? (
            <div className="border-t border-hairline pt-4">
              <p className="font-display text-xl leading-none font-semibold text-accent-strong">
                {topMetric.value}
              </p>
              <p className="mt-1 text-sm text-muted">{topMetric.label}</p>
            </div>
          ) : null}

          {study.tools.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {study.tools.map((tool) => (
                <li
                  key={tool}
                  className="rounded-xs border border-hairline px-2 py-1 text-xs font-medium text-muted"
                >
                  {tool}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </article>
  );
}
