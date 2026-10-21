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
  /** Another business running this build, shown beside the client. */
  alsoAt?: string;
  lane: Lane;
  summary: string;
  role: string;
  year: string;
  /** ISO date, used for sorting. */
  date: string;
  /** Lower sorts higher on the lane page. */
  order: number;
  featured: boolean;
  /** Runs in a live business, not built to a brief. Shows the Live badge. */
  live: boolean;
  /** Optional — degrades gracefully when absent. */
  cover?: string;
  /** The workflow canvas. When set, the card cover slides to it after the result. */
  canvas?: string;
  /** Caption for the result image shown under the title. No caption, no image. */
  resultCaption?: string;
  /** The result image under the title, when it differs from the card cover. Defaults to `cover`. */
  result?: string;
  /** The full screenshot the result image opens. Defaults to `cover`. */
  resultFull?: string;
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
  /**
   * When set, the eyebrow ends with a live count of the lane's builds,
   * e.g. "Lane 01 · 16 systems built". Singular, then plural.
   */
  countLabel?: [string, string];
  /** Verbatim lane card description used on the home page. */
  description: string;
  intro: string;
};
