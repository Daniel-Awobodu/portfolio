import type { Metric } from "@/lib/types";

/**
 * The metric row at the top of a case study. Renders nothing when `metrics` is
 * empty or missing, so a half-filled frontmatter block never leaves a gap.
 */
export default function StatRow({
  metrics,
  className = "",
}: {
  metrics: Metric[];
  className?: string;
}) {
  if (metrics.length === 0) return null;

  return (
    <dl
      className={`grid gap-px overflow-hidden rounded-md border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3 ${className}`}
    >
      {metrics.map((metric) => (
        <div key={metric.label} className="bg-card px-5 py-6">
          <dt className="eyebrow">{metric.label}</dt>
          {/* Large display type, so --accent (4.13:1) clears AA for large text. */}
          <dd className="mt-2 font-display text-[1.625rem] leading-tight font-semibold text-accent sm:text-[1.75rem]">
            {metric.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
