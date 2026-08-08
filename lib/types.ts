export type Lane = "automation" | "marketing";

export type Metric = {
  label: string;
  value: string;
};

/** The frontmatter schema every case study MDX file must follow. */
export type CaseStudyMeta = {
  slug: string;
  title: string;
  client: string;
  lane: Lane;
  summary: string;
  role: string;
  year: string;
  /** ISO date, used for sorting. */
  date: string;
  /** Lower sorts higher on the lane page. */
  order: number;
  featured: boolean;
  /** Optional — degrades gracefully when absent. */
  cover?: string;
  video?: string;
  tools: string[];
  metrics: Metric[];
};

export type CaseStudy = CaseStudyMeta & {
  /** Raw MDX body, rendered by <MDXRemote /> in a server component. */
  body: string;
};

/** Display metadata for each lane. Single source of truth for lane copy. */
export type LaneInfo = {
  slug: Lane;
  label: string;
  eyebrow: string;
  /** Verbatim lane card description used on the home page. */
  description: string;
  intro: string;
};
