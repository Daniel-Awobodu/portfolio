import Image from "next/image";
import Link from "next/link";
import CaseStudyCard from "@/components/CaseStudyCard";
import CTAButton from "@/components/CTAButton";
import Container from "@/components/Container";
import ContactLinks from "@/components/ContactLinks";
import LaneCard from "@/components/LaneCard";
import TestimonialCard from "@/components/TestimonialCard";
import {
  getCaseStudies,
  getCaseStudy,
  getProofMetrics,
  LANES,
} from "@/lib/content";
import { demos } from "@/lib/demos";
import { site } from "@/lib/site-config";
import { testimonials } from "@/lib/testimonials";
import { countTools } from "@/lib/tools";

export default function HomePage() {
  const marketing = getCaseStudies("marketing");
  // The marketing card leads with the top campaign's headline number.
  const marketingLead = marketing[0]?.metrics[0];
  const automation = getCaseStudies("automation");
  const automationTools = countTools(automation);
  // Automation is the main offer, so its results lead the strip.
  const proof = [...getProofMetrics()].sort(
    (a, b) =>
      Number(b.href.startsWith("/automation")) -
      Number(a.href.startsWith("/automation")),
  );
  // The builds that open the page: both live ones, then the biggest brief.
  const featured = ["order-alerts", "order-extraction", "voice-receptionist"]
    .map((slug) => getCaseStudy("automation", slug))
    .filter((study) => study !== null);

  return (
    <>
      {/* ================= 1. HERO ================= */}
      <Container as="section" className="border-b border-hairline">
        <div className="grid items-center gap-10 py-14 md:grid-cols-12 md:gap-12 md:py-20 lg:gap-16">
          {/* Text first in the DOM and first on mobile — the promise is never
              pushed below the fold by the portrait. */}
          <div className="rise md:col-span-7">
            <h1>
              <span className="eyebrow block">{site.name}</span>
              {/* max-width sits on the span, not the h1, so the `ch` unit is
                  measured against the display size rather than inherited 1rem. */}
              <span className="mt-4 block max-w-[17ch] font-display text-[clamp(2.1rem,1.35rem+3.1vw,3.6rem)] leading-[1.06] font-semibold text-ink">
                {site.promise}
              </span>
            </h1>

            <p className="mt-6 font-display text-xl text-gold sm:text-2xl">
              {site.tagline}
            </p>

            <p className="mt-5 max-w-prose text-[1.0625rem] leading-relaxed text-muted">
              I help founders and teams with AI automation and e-commerce
              growth: the work handled, and the system explained. Five years in
              marketing and a year building automations. Every build comes with
              a plain guide, a recorded walkthrough and error alerts, so your
              team can run it.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <CTAButton href="/contact">Start a conversation</CTAButton>
              <Link
                href="#work"
                className="text-[0.9375rem] font-semibold text-accent-strong underline underline-offset-4 transition-colors duration-150 hover:text-ink"
              >
                See my work ↓
              </Link>
            </div>

            {/* Counted from the build files, so it stays true as builds are
                added. Each item carries its own marker, so a wrapped line
                never starts with a stray separator. */}
            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              {[
                `${automation.length} systems built`,
                `${automationTools} tools connected`,
                `Certified in AI & Automation, capstone ${site.certification.capstone.grade}`,
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Circular portrait inside a concentric hairline ring.
              daniel.jpg is cropped square for exactly this mask, so object-cover
              never re-crops it — any replacement should be square too. */}
          <div className="md:col-span-5">
            <figure className="relative mx-auto w-full max-w-[300px] sm:max-w-[340px] md:max-w-[400px]">
              <div
                aria-hidden="true"
                className="absolute -inset-3 rounded-full border border-hairline sm:-inset-4"
              />
              <div className="relative aspect-square w-full overflow-hidden rounded-full border border-hairline bg-card">
                <Image
                  src="/daniel.jpg"
                  alt={`Portrait of ${site.name}`}
                  fill
                  priority
                  sizes="(max-width: 640px) 300px, (max-width: 768px) 340px, 400px"
                  className="object-cover"
                />
              </div>
            </figure>
          </div>
        </div>
      </Container>

      {/* ================= 2. AUTOMATION BUILDS ================= */}
      <Container as="section" id="work" className="scroll-mt-24 py-16 md:py-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">My main offer</p>
            <h2 className="mt-3 font-display text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight font-semibold text-ink">
              Automation builds
            </h2>
          </div>
          <p className="max-w-sm text-[0.9375rem] leading-relaxed text-muted">
            {LANES.automation.description}
          </p>
        </div>

        <ul className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((study, index) => (
            <li key={study.slug}>
              <CaseStudyCard
                study={study}
                priority={index === 0}
                demo={demos[study.slug]}
              />
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col items-center gap-5 text-center">
          <CTAButton href="/automation">
            See all {automation.length} builds
            <span aria-hidden="true">→</span>
          </CTAButton>
          {/* For the visitor who doesn't see their own business above. */}
          <p className="max-w-md text-[0.9375rem] leading-relaxed text-muted">
            Don&rsquo;t see your kind of business?{" "}
            <Link
              href="/contact"
              className="font-semibold text-accent-strong underline underline-offset-4 transition-colors duration-150 hover:text-ink"
            >
              Tell me how it runs
            </Link>
            , and I&rsquo;ll tell you what I&rsquo;d automate.
          </p>
        </div>
      </Container>

      {/* ================= 3. PROOF STRIP ================= */}
      {proof.length > 0 ? (
        <section
          aria-label="Selected results"
          className="border-y border-hairline bg-card"
        >
          <Container>
            <div className="flex flex-wrap items-baseline gap-x-10 gap-y-4 py-8 md:py-10">
              <p className="eyebrow w-full md:w-auto">Selected results</p>
              {/* No separators: the gap and the accent number mark each
                  result, so a wrapped line never starts with a stray dot. */}
              {proof.map((metric) => (
                <Link
                  key={`${metric.href}-${metric.label}`}
                  href={metric.href}
                  className="flex items-baseline gap-2.5 transition-opacity duration-150 hover:opacity-70"
                >
                  <span className="shrink-0 font-display text-xl leading-none font-semibold whitespace-nowrap text-gold sm:text-2xl">
                    {metric.value}
                  </span>
                  <span className="text-sm text-muted">{metric.label}</span>
                </Link>
              ))}
            </div>
          </Container>
          {/*
            CLIENT LOGOS SLOT — when you have permission to show client logos,
            drop a grayscale logo row here, directly under the metrics.
            <Container><ul className="flex flex-wrap items-center gap-10 border-t border-hairline py-8 opacity-60">…</ul></Container>
          */}
        </section>
      ) : null}

      {/* ================= 4. TESTIMONIALS ================= */}
      <Container
        as="section"
        className="border-b border-hairline py-16 md:py-20"
      >
        <p className="eyebrow">In their own words</p>
        <h2 className="mt-3 max-w-2xl font-display text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight font-semibold text-ink">
          From the people running my builds
        </h2>
        <p className="mt-4 max-w-prose text-[1.0625rem] leading-relaxed text-muted">
          Two businesses run my order automations every day. Each quote links to
          the message it came from.
        </p>
        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <li key={testimonial.id}>
              <TestimonialCard testimonial={testimonial} />
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted">
          References available on request.
        </p>
      </Container>

      {/* ================= 5. ALSO ================= */}
      <Container
        as="section"
        className="border-b border-hairline py-16 md:py-20"
      >
        <p className="eyebrow">Also</p>
        <h2 className="mt-3 font-display text-[clamp(1.5rem,1.25rem+1vw,2rem)] leading-tight font-semibold text-ink">
          Beyond the builds
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <LaneCard
            eyebrow="E-commerce growth"
            title="Marketing"
            description={LANES.marketing.description}
            stat={marketingLead ? marketingLead.value : "New lane"}
            statLabel={marketingLead ? marketingLead.label : "campaign builds"}
            href="/marketing"
            linkLabel="View marketing"
          />
          <LaneCard
            eyebrow="The difference"
            title="How I Work"
            description="Every build comes with a plain guide, a recorded walkthrough and error alerts, so your team can run it without me."
            stat="2 weeks"
            statLabel="of free fixes after launch"
            href="/how-i-work"
            linkLabel="View how I work"
          />
        </div>
      </Container>

      {/* ================= 6. ABOUT TEASER ================= */}
      <Container as="section" className="py-16 md:py-20">
        <div className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
          <div className="order-2 md:order-1 md:col-span-8">
            <p className="eyebrow">About</p>
            <h2 className="mt-3 max-w-[24ch] font-display text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight font-semibold text-ink">
              A marketer who builds the systems behind the sales
            </h2>
            <p className="mt-5 max-w-prose text-[1.0625rem] leading-relaxed text-muted">
              Five years in growth marketing taught me what makes a product
              sell. Building automations is how I take the busywork out of
              selling it. I&rsquo;m a mathematician by training, so every build
              has a clear structure, and I explain it in plain words.
            </p>
            <p className="mt-7">
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-accent-strong underline underline-offset-4 transition-colors duration-150 hover:text-ink"
              >
                More about me →
              </Link>
            </p>
          </div>

          <div className="order-1 md:order-2 md:col-span-4">
            {/* A casual photo, so the page doesn't repeat the hero portrait.
                Square source, like the hero, so the circle never re-crops it. */}
            <div className="relative aspect-square w-32 overflow-hidden rounded-full border border-hairline bg-card md:ml-auto md:w-full md:max-w-[240px]">
              <Image
                src="/daniel-casual.jpg"
                alt={`${site.name}, smiling, in a bucket hat and white T-shirt`}
                fill
                sizes="(max-width: 768px) 128px, 240px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Container>

      {/* ================= 7. CONTACT BAND ================= */}
      <section
        id="contact"
        className="scroll-mt-24 border-t border-hairline bg-card"
      >
        <Container>
          <div className="py-16 md:py-20">
            <p className="eyebrow">Contact</p>
            <h2 className="mt-3 max-w-[24ch] font-display text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight font-semibold text-ink">
              Not sure what to automate? Tell me about your business.
            </h2>
            <p className="mt-5 max-w-prose text-[1.0625rem] leading-relaxed text-muted">
              Tell me how your business runs today, and I&rsquo;ll show you what
              can run on its own: orders, follow-ups, bookings, client messages,
              the reports nobody enjoys. The first call is free, and if
              automation isn&rsquo;t worth it for you, I&rsquo;ll say so. I
              usually reply within a few hours.
            </p>

            <div className="mt-9">
              <CTAButton href="/contact">Start a conversation</CTAButton>
            </div>

            <ContactLinks className="mt-10" />
          </div>
        </Container>
      </section>
    </>
  );
}
