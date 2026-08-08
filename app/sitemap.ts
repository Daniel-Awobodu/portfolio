import type { MetadataRoute } from "next";
import { getAllCaseStudies, LANE_SLUGS } from "@/lib/content";
import { site } from "@/lib/site-config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now, priority: 1 },
    { url: `${site.url}/how-i-think`, lastModified: now, priority: 0.8 },
    { url: `${site.url}/about`, lastModified: now, priority: 0.7 },
    { url: `${site.url}/contact`, lastModified: now, priority: 0.9 },
  ];

  const laneRoutes: MetadataRoute.Sitemap = LANE_SLUGS.map((lane) => ({
    url: `${site.url}/${lane}`,
    lastModified: now,
    priority: 0.8,
  }));

  // New case study files appear here automatically.
  const caseStudyRoutes: MetadataRoute.Sitemap = getAllCaseStudies().map(
    (study) => ({
      url: `${site.url}/${study.lane}/${study.slug}`,
      lastModified: new Date(study.date),
      priority: 0.7,
    }),
  );

  return [...staticRoutes, ...laneRoutes, ...caseStudyRoutes];
}
