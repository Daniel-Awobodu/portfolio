import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudyCard from "@/components/CaseStudyCard";
import CTAButton from "@/components/CTAButton";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import { getCaseStudies, LANE_SLUGS, LANES } from "@/lib/content";
import type { Lane } from "@/lib/types";

/** Only `automation` and `marketing` exist; anything else 404s at build time. */
export const dynamicParams = false;

export function generateStaticParams() {
  return LANE_SLUGS.map((lane) => ({ lane }));
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
      <PageHeader eyebrow={info.eyebrow} title={info.label} lede={info.intro} />

      <Container as="section" className="py-14 md:py-16">
        {studies.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

      {studies.length > 0 ? (
        <Container as="section" className="pb-20">
          <div className="flex flex-col items-start gap-6 border-t border-hairline pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md font-display text-xl leading-snug font-semibold text-ink sm:text-2xl">
              Want something like this running in your business?
            </p>
            <CTAButton href="/contact">Start a conversation</CTAButton>
          </div>
        </Container>
      ) : null}
    </>
  );
}
