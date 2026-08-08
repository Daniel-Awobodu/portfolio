import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { CaseStudy, CaseStudyMeta, Lane, LaneInfo, Metric } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

/**
 * Lane copy lives here so the home cards, lane pages and nav never drift.
 * The `description` strings are the verbatim lane card descriptions.
 */
export const LANES: Record<Lane, LaneInfo> = {
  automation: {
    slug: "automation",
    label: "Automation",
    eyebrow: "Lane 01",
    description:
      "AI and no-code systems that handle the repetitive work — lead routing, follow-ups, data, content pipelines.",
    intro:
      "Systems that do the work nobody should be doing by hand. Each build below starts with the bottleneck, shows the wiring, then explains it in plain language.",
  },
  marketing: {
    slug: "marketing",
    label: "Marketing",
    eyebrow: "Lane 02",
    description:
      "Facebook & Instagram ads, sales pages, and social systems that turn spend into orders.",
    intro:
      "Five years of getting products sold online. Ads, offers and sales pages — measured by orders, not impressions.",
  },
};

export const LANE_SLUGS: Lane[] = ["automation", "marketing"];

/* -------------------------------------------------------------------------- */
/* Frontmatter parsing                                                        */
/* -------------------------------------------------------------------------- */

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asMetrics(value: unknown): Metric[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (item): item is Record<string, unknown> =>
        typeof item === "object" && item !== null,
    )
    .map((item) => ({
      label: asString(item.label),
      value: asString(item.value),
    }))
    .filter((metric) => metric.label !== "" && metric.value !== "");
}

function asTools(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

/**
 * Turns one MDX file into a typed case study. Optional fields (`cover`,
 * `video`, `metrics`) come back undefined/empty rather than throwing, so a
 * half-filled file still renders without breaking the layout.
 */
function parseFile(lane: Lane, filename: string): CaseStudy {
  const filePath = path.join(CONTENT_DIR, lane, filename);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const slug = filename.replace(/\.mdx?$/, "");
  const cover = asString(data.cover).trim();
  const video = asString(data.video).trim();

  return {
    slug,
    title: asString(data.title, slug),
    client: asString(data.client),
    lane,
    summary: asString(data.summary),
    role: asString(data.role),
    year: asString(data.year),
    date: asString(data.date, "1970-01-01"),
    order: typeof data.order === "number" ? data.order : 999,
    featured: data.featured === true,
    cover: cover === "" ? undefined : cover,
    video: video === "" ? undefined : video,
    tools: asTools(data.tools),
    metrics: asMetrics(data.metrics),
    body: content,
  };
}

/* -------------------------------------------------------------------------- */
/* Readers                                                                    */
/* -------------------------------------------------------------------------- */

/** Sort: `order` ascending, then newest `date` first. */
function byOrderThenDate(a: CaseStudyMeta, b: CaseStudyMeta): number {
  if (a.order !== b.order) return a.order - b.order;
  return b.date.localeCompare(a.date);
}

/**
 * Every case study in a lane, sorted for display.
 * Drop a new `.mdx` file into /content/<lane>/ and it appears here — no other
 * change needed anywhere in the codebase.
 */
export function getCaseStudies(lane: Lane): CaseStudy[] {
  const dir = path.join(CONTENT_DIR, lane);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => /\.mdx?$/.test(file))
    // `_`-prefixed files are templates/drafts and are never published.
    .filter((file) => !file.startsWith("_"))
    .map((file) => parseFile(lane, file))
    .sort(byOrderThenDate);
}

/** All case studies across every lane, sorted for display. */
export function getAllCaseStudies(): CaseStudy[] {
  return LANE_SLUGS.flatMap((lane) => getCaseStudies(lane)).sort(
    byOrderThenDate,
  );
}

export function getCaseStudy(lane: Lane, slug: string): CaseStudy | null {
  return getCaseStudies(lane).find((study) => study.slug === slug) ?? null;
}

/** Powers `generateStaticParams` on the case study route. */
export function getCaseStudySlugs(lane: Lane): string[] {
  return getCaseStudies(lane).map((study) => study.slug);
}

/**
 * The case study that follows `slug` in its lane, wrapping to the first one at
 * the end so the "Next case study" link is never a dead end. Returns null when
 * the lane holds a single study.
 */
export function getNextCaseStudy(lane: Lane, slug: string): CaseStudy | null {
  const studies = getCaseStudies(lane);
  if (studies.length < 2) return null;
  const index = studies.findIndex((study) => study.slug === slug);
  if (index === -1) return null;
  return studies[(index + 1) % studies.length];
}

/**
 * Featured case studies' top metric, for the home proof strip.
 * Only studies with `featured: true` AND at least one metric qualify.
 */
export function getProofMetrics(): Array<Metric & { href: string }> {
  return getAllCaseStudies()
    .filter((study) => study.featured && study.metrics.length > 0)
    .map((study) => ({
      ...study.metrics[0],
      href: `/${study.lane}/${study.slug}`,
    }));
}
