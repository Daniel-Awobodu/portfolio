import Image from "next/image";
import Link from "next/link";
import CTAButton from "@/components/CTAButton";
import Container from "@/components/Container";
import ContactLinks from "@/components/ContactLinks";
import LaneCard from "@/components/LaneCard";
import { getCaseStudies, getProofMetrics, LANES } from "@/lib/content";
import { site } from "@/lib/site-config";

export default function HomePage() {
  const marketing = getCaseStudies("marketing");
  const proof = getProofMetrics();

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

            <p className="mt-6 font-display text-xl text-accent-strong sm:text-2xl">
              {site.tagline}
            </p>

            <p className="mt-5 max-w-prose text-[1.0625rem] leading-relaxed text-muted">
              {site.role} for founders and teams who want the work handled and
              the system explained. Five years in marketing, a year building
              automations, two years teaching maths — that last one is why you
              will understand what I hand you.
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

      {/* ================= 2. THREE LANES ================= */}
      <Container as="section" id="work" className="scroll-mt-24 py-16 md:py-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">The work</p>
            <h2 className="mt-3 font-display text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight font-semibold text-ink">
              Three ways I&rsquo;m useful
            </h2>
          </div>
          <p className="max-w-sm text-[0.9375rem] leading-relaxed text-muted">
            Two portfolio lanes and the habit that runs through both of them.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {/* Stated total of systems shipped, not the number of case studies
              published — those are two different numbers on purpose. */}
          <LaneCard
            eyebrow={LANES.automation.eyebrow}
            title="Automation"
            description={LANES.automation.description}
            stat="15+"
            statLabel="systems built"
            href="/automation"
            linkLabel="View automation"
          />
          <LaneCard
            eyebrow={LANES.marketing.eyebrow}
            title="Marketing"
            description={LANES.marketing.description}
            stat={marketing.length > 0 ? `${marketing.length}` : "New lane"}
            statLabel={
              marketing.length === 1 ? "campaign build" : "campaign builds"
            }
            href="/marketing"
            linkLabel="View marketing"
          />
          <LaneCard
            eyebrow="The difference"
            title="How I Think"
            description="A maths teacher's habit: I don't just build it, I explain it so you actually own it."
            stat="2 yrs"
            statLabel="teaching maths before this"
            href="/how-i-think"
            linkLabel="View how I think"
          />
        </div>
      </Container>

      {/* ================= 3. PROOF STRIP ================= */}
      {proof.length > 0 ? (
        <section
          aria-label="Selected results"
          className="border-y border-hairline bg-card"
        >
          <Container>
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-4 py-8 md:py-10">
              <p className="eyebrow w-full md:w-auto md:pr-3">
                Selected results
              </p>
              {proof.map((metric, index) => (
                <span
                  key={`${metric.href}-${metric.label}`}
                  className="flex items-baseline gap-5"
                >
                  {/* Separator keeps each result readable as its own unit
                      once the band wraps on narrow screens. */}
                  {index > 0 ? (
                    <span aria-hidden="true" className="text-hairline">
                      ·
                    </span>
                  ) : null}
                  <Link
                    href={metric.href}
                    className="flex items-baseline gap-2.5 transition-opacity duration-150 hover:opacity-70"
                  >
                    <span className="font-display text-xl leading-none font-semibold text-accent-strong sm:text-2xl">
                      {metric.value}
                    </span>
                    <span className="text-sm text-muted">{metric.label}</span>
                  </Link>
                </span>
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

      {/* ================= 4. ABOUT TEASER ================= */}
      <Container as="section" className="py-16 md:py-20">
        <div className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
          <div className="order-2 md:order-1 md:col-span-8">
            <p className="eyebrow">About</p>
            <h2 className="mt-3 max-w-[24ch] font-display text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight font-semibold text-ink">
              A maths teacher who turned into a systems builder
            </h2>
            <p className="mt-5 max-w-prose text-[1.0625rem] leading-relaxed text-muted">
              I spent two years in front of a class making abstract things
              concrete, then five years in growth marketing making products
              sell. Automation is where those two habits met. The through-line
              has always been the same: take something tangled, find the
              structure, explain it back plainly.
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
            {/* Same square source as the hero — next/image emits the small
                size, so a separate thumbnail file is no longer needed. */}
            <div className="relative aspect-square w-32 overflow-hidden rounded-full border border-hairline bg-card md:ml-auto md:w-full md:max-w-[240px]">
              <Image
                src="/daniel.jpg"
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 768px) 128px, 240px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Container>

      {/* ================= 5. CONTACT BAND ================= */}
      <section
        id="contact"
        className="scroll-mt-24 border-t border-hairline bg-card"
      >
        <Container>
          <div className="py-16 md:py-20">
            <p className="eyebrow">Contact</p>
            <h2 className="mt-3 max-w-[20ch] font-display text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight font-semibold text-ink">
              Tell me what you&rsquo;re trying to automate or sell
            </h2>
            <p className="mt-5 max-w-prose text-[1.0625rem] leading-relaxed text-muted">
              One message is enough to start. Tell me the bottleneck or the
              product, and I&rsquo;ll tell you straight whether I&rsquo;m the
              right person for it. I reply fast.
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
