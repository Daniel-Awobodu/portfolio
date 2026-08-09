import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import CTAButton from "@/components/CTAButton";
import Container from "@/components/Container";
import MdxImage from "@/components/MdxImage";
import StatRow from "@/components/StatRow";
import VideoEmbed from "@/components/VideoEmbed";
import {
  getCaseStudy,
  getCaseStudySlugs,
  getNextCaseStudy,
  LANE_SLUGS,
  LANES,
} from "@/lib/content";
import { site } from "@/lib/site-config";
import type { Lane } from "@/lib/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return LANE_SLUGS.flatMap((lane) =>
    getCaseStudySlugs(lane).map((slug) => ({ lane, slug })),
  );
}

function resolveLane(value: string): Lane | null {
  return LANE_SLUGS.includes(value as Lane) ? (value as Lane) : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lane: string; slug: string }>;
}): Promise<Metadata> {
  const { lane, slug } = await params;
  const resolved = resolveLane(lane);
  const study = resolved ? getCaseStudy(resolved, slug) : null;
  if (!study) return {};

  return {
    title: study.title,
    description: study.summary || site.description,
    alternates: { canonical: `/${study.lane}/${study.slug}` },
    openGraph: {
      type: "article",
      title: study.title,
      description: study.summary || site.description,
      url: `/${study.lane}/${study.slug}`,
      ...(study.cover ? { images: [{ url: study.cover }] } : {}),
    },
  };
}

/** Small labelled fact used in the case study meta grid. */
function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-1.5 text-[0.9375rem] text-ink">{value}</dd>
    </div>
  );
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ lane: string; slug: string }>;
}) {
  const { lane: laneParam, slug } = await params;
  const lane = resolveLane(laneParam);
  if (!lane) notFound();

  const study = getCaseStudy(lane, slug);
  if (!study) notFound();

  const next = getNextCaseStudy(lane, slug);
  const laneInfo = LANES[lane];

  const facts = [
    { label: "Client", value: study.client },
    { label: "Role", value: study.role },
    { label: "Year", value: study.year },
    { label: "Tools", value: study.tools.join(", ") },
  ].filter((fact) => fact.value !== "");

  return (
    <article>
      {/* ---------- Header ---------- */}
      <Container as="header" className="border-b border-hairline py-12 md:py-16">
        <p className="text-sm">
          <Link
            href={`/${lane}`}
            className="font-medium text-muted transition-colors duration-150 hover:text-accent-strong"
          >
            ← {laneInfo.label}
          </Link>
        </p>

        <h1 className="mt-6 max-w-4xl font-display text-[clamp(2rem,1.5rem+2.4vw,3.25rem)] leading-[1.1] font-semibold text-ink">
          {study.title}
        </h1>

        {study.summary ? (
          <p className="mt-5 max-w-prose text-lg leading-relaxed text-muted">
            {study.summary}
          </p>
        ) : null}

        {/* Skipped entirely when a file sets none of these, so a minimal
            frontmatter block doesn't leave a stray rule and an empty band. */}
        {facts.length > 0 ? (
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-hairline pt-8 sm:grid-cols-4">
            {facts.map((fact) => (
              <Fact key={fact.label} label={fact.label} value={fact.value} />
            ))}
          </dl>
        ) : null}
      </Container>

      {/* ---------- Metrics + walkthrough ---------- */}
      <Container className="py-12 md:py-14">
        <StatRow metrics={study.metrics} />

        {/* Left-aligned, not centred — it lines up with the title and the
            stat row above it. */}
        <div className="max-w-prose">
          <VideoEmbed
            src={study.video}
            title={`Walkthrough — ${study.title}`}
          />

          {/* ---------- MDX body: problem → build → how it works → outcome ---------- */}
          <div className="prose-editorial mt-4">
            <MDXRemote source={study.body} components={{ img: MdxImage }} />
          </div>
        </div>
      </Container>

      {/* ---------- Footer: next case study + CTA ---------- */}
      <Container as="footer" className="pb-20">
        <div className="grid gap-5 border-t border-hairline pt-10 md:grid-cols-2">
          {next ? (
            <Link
              href={`/${next.lane}/${next.slug}`}
              className="group flex flex-col justify-between rounded-md border border-hairline bg-card p-6 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-accent"
            >
              <span className="eyebrow">Next case study</span>
              <span className="mt-3 font-display text-xl leading-snug font-semibold text-ink">
                {next.title}
              </span>
              <span className="mt-4 flex items-center gap-1.5 text-[0.9375rem] font-semibold text-accent-strong">
                Read it
                <span
                  aria-hidden="true"
                  className="transition-transform duration-150 group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </Link>
          ) : null}

          <div className="flex flex-col justify-between rounded-md border border-hairline bg-card p-6">
            <span className="eyebrow">Your turn</span>
            <p className="mt-3 font-display text-xl leading-snug font-semibold text-ink">
              Got a bottleneck that looks like this one?
            </p>
            <div className="mt-6">
              <CTAButton href="/contact">Start a conversation</CTAButton>
            </div>
          </div>
        </div>
      </Container>
    </article>
  );
}
