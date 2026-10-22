import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudyCard from "@/components/CaseStudyCard";
import CaseStudySearch, {
  type SearchableStudy,
} from "@/components/CaseStudySearch";
import CTAButton from "@/components/CTAButton";
import Container from "@/components/Container";
import ImageLightbox from "@/components/ImageLightbox";
import LandingPages from "@/components/LandingPages";
import PageHeader from "@/components/PageHeader";
import {
  getCaseStudies,
  getLaneEyebrow,
  LANE_SLUGS,
  LANES,
} from "@/lib/content";
import { normalise } from "@/lib/search";
import { shareImage, site } from "@/lib/site-config";
import type { CaseStudy, Lane } from "@/lib/types";

/** Only `automation` and `marketing` exist; anything else 404s at build time. */
export const dynamicParams = false;

export function generateStaticParams() {
  return LANE_SLUGS.map((lane) => ({ lane }));
}

/**
 * Drops each screenshot and the italic caption under it. They describe the
 * picture, not the build ("phone numbers are blurred"), so leaving them in
 * makes searches like "phone" match every study. Bare component tags such as
 * `<NextStep>` go too; the text inside them stays searchable.
 */
function withoutImages(body: string): string {
  return body
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(
      (block) =>
        !/^!\[[^\]]*\]\([^)]*\)$/.test(block) &&
        !/^\*(?!\*)[\s\S]*[^*]\*$/.test(block) &&
        !/^<\/?[A-Z][A-Za-z]*\s*\/?>$/.test(block),
    )
    .join("\n\n");
}

/**
 * Strips the MDX body off a study and folds everything a visitor might search
 * for into one normalised string, so the browser only receives what it needs.
 */
function toSearchable({ body, ...study }: CaseStudy): SearchableStudy {
  const haystack = normalise(
    [
      study.title,
      study.client,
      study.alsoAt ?? "",
      study.summary,
      study.role,
      study.year,
      ...study.tools,
      ...study.metrics.flatMap((metric) => [metric.label, metric.value]),
      withoutImages(body),
    ].join(" "),
  );
  return { ...study, haystack };
}

function resolveLane(value: string): Lane | null {
  return LANE_SLUGS.includes(value as Lane) ? (value as Lane) : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lane: string }>;
}): Promise<Metadata> {
  const { lane } = await params;
  const info = resolveLane(lane) ? LANES[lane as Lane] : null;
  if (!info) return {};

  return {
    title: info.label,
    description: info.description,
    alternates: { canonical: `/${info.slug}` },
    openGraph: {
      title: `${info.label} — Daniel Awobodu`,
      description: info.description,
      url: `/${info.slug}`,
      images: [shareImage],
    },
  };
}

export default async function LanePage({
  params,
}: {
  params: Promise<{ lane: string }>;
}) {
  const { lane: laneParam } = await params;
  const lane = resolveLane(laneParam);
  if (!lane) notFound();

  const info = LANES[lane];
  const studies = getCaseStudies(lane);

  return (
    <>
      <PageHeader
        eyebrow={getLaneEyebrow(lane)}
        title={info.label}
        lede={info.intro}
      >
        {lane === "automation" ? (
          <p className="mt-5 inline-flex max-w-full items-start gap-2 rounded-md border border-edge bg-card px-4 py-2 text-sm leading-relaxed text-ink">
            <span
              aria-hidden="true"
              className="font-semibold text-accent-strong"
            >
              ✓
            </span>
            <span>
              Certified in {site.certification.label}, with a capstone graded{" "}
              {site.certification.capstone.grade}.{" "}
              <ImageLightbox
                href={site.certification.image}
                alt={`Certificate: ${site.certification.label}`}
                className="font-semibold text-accent-strong underline underline-offset-4"
              >
                See the certificate
              </ImageLightbox>
            </span>
          </p>
        ) : null}
      </PageHeader>

      <Container as="section" className="py-14 md:py-16">
        {lane === "automation" && studies.length > 0 ? (
          <CaseStudySearch studies={studies.map(toSearchable)} />
        ) : studies.length > 0 ? (
          <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {studies.map((study, index) => (
              <li key={study.slug}>
                <CaseStudyCard study={study} priority={index < 3} />
              </li>
            ))}
          </ul>
        ) : (
          /* Empty state — a lane with no MDX files still looks deliberate. */
          <div className="rounded-md border border-dashed border-hairline bg-card px-6 py-16 text-center">
            <p className="eyebrow">{info.label}</p>
            <p className="mx-auto mt-4 max-w-md font-display text-2xl leading-tight font-semibold text-ink">
              Case studies coming soon
            </p>
            <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-muted">
              Write-ups for this lane are being published shortly. If you want
              to talk about a build in the meantime, message me directly.
            </p>
            <div className="mt-8">
              <CTAButton href="/contact">Start a conversation</CTAButton>
            </div>
          </div>
        )}
      </Container>

      {lane === "marketing" ? <LandingPages /> : null}

      {studies.length > 0 ? (
        <Container as="section" className="pb-20">
          <div className="flex flex-col items-start gap-6 border-t border-hairline pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md font-display text-xl leading-snug font-semibold text-ink sm:text-2xl">
              {lane === "marketing"
                ? "Got a product that needs more orders?"
                : "Want something like this running in your business?"}
            </p>
            <CTAButton href="/contact">Start a conversation</CTAButton>
          </div>
        </Container>
      ) : null}
    </>
  );
}
