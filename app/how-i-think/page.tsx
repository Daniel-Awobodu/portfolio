import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CTAButton from "@/components/CTAButton";
import Container from "@/components/Container";
import FullSizeBadge from "@/components/FullSizeBadge";
import ImageLightbox from "@/components/ImageLightbox";
import PageHeader from "@/components/PageHeader";
import { getCaseStudy } from "@/lib/content";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "How I Think",
  description:
    "Most automation freelancers can't explain what they built. I can, because I was a teacher before I built systems. Clear handoffs, real documentation, and a system you actually own.",
  alternates: { canonical: "/how-i-think" },
  openGraph: {
    title: `How I Think — ${site.name}`,
    description:
      "A maths teacher's habit: I don't just build it, I explain it so you actually own it.",
    url: "/how-i-think",
  },
};

/** Where the teaching happened. Kept factual: school, class, year. */
const schools = [
  {
    name: "Mainland High School, Lagos",
    detail: "Mathematics, SS1A to SS1E",
    when: "2021 · Teaching practice, about six months",
  },
  {
    name: "Busy Fingers School, Lagos",
    detail: "Basic 3 (primary), most subjects including maths",
    when: "2024 · My NYSC year",
  },
];

/**
 * Rules that show up across the automation builds. Each one names the builds
 * where a visitor can see it working, so the page is proof, not promises.
 */
const principles = [
  {
    title: "AI reads. Code decides.",
    body: "AI is good at reading messy messages, so it does the reading. Anything that has to be exactly right, like a price, a date or a score, is checked or worked out by plain code.",
    builds: ["whatsapp-bakery", "quote-requests", "opportunity-feed"],
  },
  {
    title: "A person approves anything that leaves the business.",
    body: "Emails, quotes and posts are drafted automatically, then wait for a person to say yes, in whichever app your team already uses. Nothing goes out in your name without one.",
    builds: ["ai-outreach", "quote-requests", "content-pipeline"],
  },
  {
    title: "Check again right before acting.",
    body: "Calendars and statuses change while a workflow runs. So the slot or the status is checked again seconds before anything is booked or sent.",
    builds: ["appointment-reminders", "voice-receptionist", "crm-follow-ups"],
  },
  {
    title: "Fail loudly, never silently.",
    body: "When something can’t be read or saved, it goes to a review list with the reason, and someone is told. A wrong record saved quietly is worse than one that fails loudly.",
    builds: ["order-extraction", "whatsapp-receipts", "multichannel-intake"],
  },
  {
    title: "Say what’s missing.",
    body: "Every build ends with what I’d add next, in plain words. You should know a system’s limits before you rely on it.",
    builds: ["office-assistant", "solar-leads"],
  },
];

/** How a project runs, start to finish. */
const projectSteps: { title: string; body: string; options?: string[] }[] = [
  {
    title: "Discovery call",
    body: "We talk through the job that’s eating your time. I ask how it’s done today, step by step, and what done right looks like.",
  },
  {
    title: "Map the bottleneck",
    body: "I write the process down as it really runs and find the step that costs the most. Together we agree what success looks like and where you’ll see it.",
  },
  {
    title: "Build",
    body: "I build it in the tools you already use, in small pieces you can see working early, so there are no surprises at the end.",
  },
  {
    title: "Test the edge cases",
    body: "I try to break it: the messy message, the missing detail, the change halfway through. Every build on this site lists what testing caught.",
  },
  {
    title: "Walkthrough and handoff",
    body: "You get a recorded walkthrough and a short guide in plain words: what runs, when it runs, and what to do if it stops.",
  },
  {
    title: "Support",
    body: "Fixes are free for the first two weeks after launch, while your team settles in. After that, you choose how to keep me on:",
    options: [
      "A monthly retainer: I’m always on hand to fix anything that comes up and to add to your workflows.",
      "Pay as you go: a consultation fee each time you need me.",
    ],
  },
];

/** A real build, explained the way the thesis promises. */
const workedExample = {
  slug: "whatsapp-receipts",
  image: "/case-studies/whatsapp-receipts/workflow.png",
  alt: "The receipt workflow in n8n, from the incoming WhatsApp message to the Drive upload, the expense sheet row and the reply to the driver",
  sentences: [
    "When a driver sends a photo of a receipt to the company’s WhatsApp number, the workflow starts.",
    "AI reads the receipt and pulls out the vendor, date, total, tax and category, and says when it isn’t sure.",
    "A clear receipt is filed in this month’s Drive folder and added to the expense sheet. An unclear one goes to a review list, and the driver is asked to resend it.",
    "Either way, the driver gets a WhatsApp reply saying exactly what happened.",
  ],
};

export default function HowIThinkPage() {
  return (
    <>
      <PageHeader
        eyebrow="The difference"
        title="I don't just build it. I explain it."
        lede="Most people who can wire up an automation cannot tell you how it works. That gap is where projects go to die: the system runs, nobody understands it, and the first time it breaks it gets abandoned."
      />

      {/* ---------- Thesis: where the habit comes from ---------- */}
      <Container as="section" className="py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <p className="eyebrow">Where I taught</p>
            <ul className="mt-5 space-y-5">
              {schools.map((school) => (
                <li key={school.name} className="border-l-2 border-edge pl-4">
                  <p className="font-display text-lg leading-snug font-semibold text-ink">
                    {school.name}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {school.detail}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted">
                    {school.when}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="max-w-prose md:col-span-8">
            <p className="font-display text-[clamp(1.5rem,1.2rem+1.3vw,2rem)] leading-[1.25] font-semibold text-ink">
              Before I built systems, I taught. The job was never knowing the
              answer. It was making someone else see it.
            </p>
            <p className="mt-6 text-[1.0625rem] leading-relaxed text-muted">
              My first classes were five SS1 maths classes at Mainland High
              School, during my teaching practice. The lesson I still remember
              is modular arithmetic: sums on a clock in mod 6, mod 12 and mod
              24, clockwise and anticlockwise. My explanation was correct, and
              the class still couldn&rsquo;t see it.
            </p>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted">
              So I went and got a real wall clock, and we worked the sums on it
              together. For the other modes, I drew a clock on the board with
              only that many numbers, six for mod 6, and told them to draw their
              own whenever they got stuck. By the end, almost the whole class
              had it. It&rsquo;s still the best lesson I&rsquo;ve taught.
            </p>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted">
              That&rsquo;s how I build. A correct system isn&rsquo;t enough if
              the people running it can&rsquo;t see how it works. So every build
              comes with the clock on the table: a plain explanation, a real
              example and a walkthrough. A system is only worth something if it
              still runs long after the handoff. I make sure your team
              understands it too.
            </p>
          </div>
        </div>
      </Container>

      {/* ---------- Principles, each with the builds that prove it ---------- */}
      <section className="border-y border-hairline bg-card">
        <Container className="py-14 md:py-16">
          <p className="eyebrow">In every build</p>
          <h2 className="mt-3 max-w-2xl font-display text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight font-semibold text-ink">
            Five rules you&rsquo;ll find in everything I build
          </h2>
          <p className="mt-4 max-w-prose text-[1.0625rem] leading-relaxed text-muted">
            Not promises. Each one links to the builds where you can see it
            working.
          </p>

          <ol className="mt-10 divide-y divide-hairline border-y border-hairline">
            {principles.map((principle, index) => (
              <li
                key={principle.title}
                className="grid gap-4 py-7 md:grid-cols-12 md:gap-8"
              >
                <div className="flex gap-4 md:col-span-5">
                  <span
                    aria-hidden="true"
                    className="font-display text-2xl leading-none font-semibold text-accent-strong"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-xl leading-snug font-semibold text-ink">
                    {principle.title}
                  </h3>
                </div>
                <div className="md:col-span-7">
                  <p className="text-[0.9375rem] leading-relaxed text-muted">
                    {principle.body}
                  </p>
                  <p className="mt-4 text-sm font-semibold text-ink">
                    See it in:
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {principle.builds
                      .map((slug) => getCaseStudy("automation", slug))
                      .filter((study) => study !== null)
                      .map((study) => (
                        <li key={study.slug}>
                          <Link
                            href={`/automation/${study.slug}`}
                            className="inline-block rounded-sm border border-edge px-3 py-1.5 text-sm text-ink transition-colors duration-150 hover:border-accent-strong hover:text-accent-strong"
                          >
                            {study.title}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ---------- Worked example: a real build in four sentences ---------- */}
      <Container as="section" className="py-14 md:py-16">
        <div className="max-w-prose">
          <p className="eyebrow">Worked example</p>
          <h2 className="mt-3 font-display text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight font-semibold text-ink">
            A real workflow, in four sentences
          </h2>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted">
            This is the receipt workflow from my logistics build. It looks busy.
            Here is everything it does, with nothing left out.
          </p>
        </div>

        <figure className="mt-8">
          <ImageLightbox
            href={workedExample.image}
            alt={workedExample.alt}
            className="group/zoom relative block cursor-zoom-in overflow-hidden rounded-md border border-hairline"
          >
            <Image
              src={workedExample.image}
              alt={workedExample.alt}
              width={2384}
              height={480}
              sizes="(max-width: 1100px) 100vw, 1036px"
              className="h-auto w-full"
            />
            <FullSizeBadge />
          </ImageLightbox>
        </figure>

        <div className="max-w-prose">
          <ol className="mt-8 space-y-5">
            {workedExample.sentences.map((sentence, index) => (
              <li
                key={sentence}
                className="flex gap-5 border-b border-hairline pb-5 last:border-0"
              >
                <span
                  aria-hidden="true"
                  className="font-display text-xl font-semibold text-accent-strong"
                >
                  {index + 1}
                </span>
                <p className="font-display text-lg leading-snug text-ink sm:text-xl">
                  {sentence}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-[1.0625rem] leading-relaxed text-muted">
            That&rsquo;s the whole system. Everything else on that canvas is the
            plumbing that carries out those four sentences, plus the checks that
            catch what goes wrong. If someone needs more than four sentences to
            tell you what your own system does, be suspicious.
          </p>
          <p className="mt-5">
            <Link
              href={`/automation/${workedExample.slug}`}
              className="text-[0.9375rem] font-semibold text-accent-strong underline underline-offset-4"
            >
              See the full receipt build
            </Link>
          </p>
        </div>
      </Container>

      {/* ---------- How a project runs ---------- */}
      <section className="border-y border-hairline bg-card">
        <Container className="py-14 md:py-16">
          <p className="eyebrow">Working together</p>
          <h2 className="mt-3 font-display text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight font-semibold text-ink">
            How a project runs
          </h2>

          <ol className="mt-10 max-w-3xl">
            {projectSteps.map((step, index) => (
              <li
                key={step.title}
                className="relative flex gap-5 pb-8 last:pb-0"
              >
                {/* The rail joining each step to the next. */}
                {index < projectSteps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-10 bottom-0 left-[1.1875rem] w-px bg-edge"
                  />
                ) : null}
                <span
                  aria-hidden="true"
                  className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-accent-strong bg-card font-display text-base font-semibold text-accent-strong"
                >
                  {index + 1}
                </span>
                <div className="pt-1.5">
                  <h3 className="font-display text-xl leading-snug font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                    {step.body}
                  </p>
                  {step.options ? (
                    <ul className="mt-3 space-y-2">
                      {step.options.map((option) => (
                        <li
                          key={option}
                          className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-muted"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-strong"
                          />
                          <span>{option}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ---------- Credential ---------- */}
      <Container as="section" className="py-14 md:py-16">
        <div className="max-w-prose">
          <p className="eyebrow">Credential</p>
          <p className="mt-3 font-display text-xl leading-snug font-semibold text-ink">
            {site.credential}
          </p>
        </div>
      </Container>

      {/* ---------- CTA ---------- */}
      <section className="border-t border-hairline bg-card">
        <Container className="py-14 md:py-16">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-lg font-display text-[clamp(1.5rem,1.25rem+1vw,2rem)] leading-tight font-semibold text-ink">
              If you want a system you actually understand, we&rsquo;ll get on
              well.
            </p>
            <CTAButton href="/contact">Start a conversation</CTAButton>
          </div>
        </Container>
      </section>
    </>
  );
}
