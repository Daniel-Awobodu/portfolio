import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CTAButton from "@/components/CTAButton";
import Container from "@/components/Container";
import FullSizeBadge from "@/components/FullSizeBadge";
import ImageLightbox from "@/components/ImageLightbox";
import PageHeader from "@/components/PageHeader";
import VideoEmbed from "@/components/VideoEmbed";
import { getCaseStudy } from "@/lib/content";
import { shareImage, site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "How I Work",
  description:
    "How a project runs, the rules every build follows, and what your team gets at handoff: a plain guide, a recorded walkthrough, error alerts and two weeks of free fixes.",
  alternates: { canonical: "/how-i-work" },
  openGraph: {
    title: `How I Work — ${site.name}`,
    description:
      "Every build comes with a plain guide, a recorded walkthrough and error alerts, so your team can run it without me.",
    url: "/how-i-work",
    images: [shareImage],
  },
};

/**
 * What every client gets with every build. This leads the page: it is the
 * part a buyer pays for, and each item links to the proof further down.
 */
const handover: {
  title: string;
  body: string;
  link?: { href: string; label: string };
}[] = [
  {
    title: "A guide in plain words",
    body: "What runs, when it runs, and what to do if it stops. Written for the people who use it, not for developers.",
    link: { href: "#handoff-guide", label: "See a sample guide" },
  },
  {
    title: "A recorded walkthrough",
    body: "The build explained out loud, step by step, so anyone on your team can learn it, now or a year from now.",
    link: { href: "#worked-example", label: "Watch one" },
  },
  {
    title: "Error alerts from day one",
    body: "If any step fails, an alert names the step that broke and goes to me and to someone on your team.",
  },
  {
    title: "Two weeks of free fixes",
    body: "Anything that breaks in the first two weeks after launch, I fix at no cost while your team settles in.",
  },
];

/** Where the teaching happened. Kept factual: school, class, year. */
const schools = [
  {
    name: "University of Lagos",
    detail: "B.Sc. (Ed.) Mathematics",
    when: "Graduated 2022",
  },
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
    title: "A person approves anything risky to get wrong.",
    body: "Quotes, cold emails and published posts are drafted automatically, then wait for a person to say yes, in whichever app your team already uses. Routine messages, like a booking confirmation, go out on their own.",
    builds: ["ai-outreach", "quote-requests", "content-pipeline"],
  },
  {
    title: "Check again right before acting.",
    body: "Calendars and statuses change while a workflow runs. So the slot or the status is checked again seconds before anything is booked or sent.",
    builds: ["appointment-reminders", "voice-receptionist", "crm-follow-ups"],
  },
  {
    title: "Fail loudly, never silently.",
    body: "When something can’t be read or saved, it’s set aside with the reason, so a person can deal with it. A wrong record saved quietly is worse than one that fails loudly.",
    builds: ["order-extraction", "whatsapp-receipts", "multichannel-intake"],
  },
  {
    title: "Say what’s missing.",
    body: "Every build ends with what I’d add next, in plain words. You should know a system’s limits before you rely on it.",
    builds: ["office-assistant", "solar-leads"],
  },
];

/** How a project runs, start to finish. */
const projectSteps: {
  title: string;
  body: string;
  options?: string[];
  link?: { href: string; label: string };
}[] = [
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
    body: "I build it in n8n, Make or Zapier, connected to the tools you already use, in small pieces you can see working early, so there are no surprises at the end.",
  },
  {
    title: "Test the edge cases",
    body: "I try to break it: the messy message, the missing detail, the change halfway through. The build pages show what testing caught, like a reply that landed seconds before a follow-up was due.",
  },
  {
    title: "Walkthrough and handoff",
    body: "You get a recorded walkthrough and a short guide in plain words: what runs, when it runs, and what to do if it stops.",
    link: { href: "#handoff-guide", label: "See a sample guide" },
  },
  {
    title: "Error alerts from day one",
    body: "Every build I hand over reports its own failures. The moment any step fails, an alert goes to me and to someone on your team, naming the step that broke. I usually know before anyone notices a problem, and most fixes take minutes. Your team’s copy means you’re never in the dark, retainer or not.",
  },
  {
    title: "Support",
    body: "Fixes are free for the first two weeks after launch, while your team settles in. After that, you choose how to keep me on:",
    options: [
      "A monthly retainer: I’m on call to fix anything that comes up and to add to your workflows.",
      "Pay as you go: a consultation fee each time you need me.",
    ],
  },
];

/**
 * A sample of the plain-language guide every client gets at handoff, written
 * for the receipt build so it can be checked against that build's page.
 */
const handoffGuide = {
  title: "Receipt logging: how your system works",
  sections: [
    {
      heading: "What it does",
      items: [
        "Drivers send receipts on WhatsApp. The system reads each one, files it in Google Drive and adds it to the expense sheet. Nobody in the office types anything.",
      ],
    },
    {
      heading: "What happens to each receipt",
      items: [
        "A clear photo or PDF: filed in this month’s Drive folder, added to the expense sheet, and the driver gets a confirmation.",
        "Hard to read: saved to the review log, and the driver is asked to send it again.",
        "Not a photo or PDF: the driver is asked for the right format.",
        "From a number that isn’t on the driver list: logged under Unknown Driver, so nothing is lost.",
      ],
    },
    {
      heading: "Your weekly five minutes",
      items: [
        "Open the review log and chase any driver who hasn’t resent a receipt.",
        "Look for Unknown Driver rows. If it’s a new driver, add their number to the driver list in Airtable, and their next receipt is matched automatically.",
      ],
    },
    {
      heading: "If something seems wrong",
      items: [
        "You’ll often hear from me first: every failed run sends an alert to me and to your office admin, naming the step that failed.",
        "Drivers say they got no reply: check that the WhatsApp number is still connected in Green API.",
        "Receipts arrive but nothing new appears in the sheet: open n8n, go to Executions, and look for a run marked in red. It names the step that failed.",
        "Still stuck: message me with the time the receipt was sent, and I’ll trace it.",
      ],
    },
    {
      heading: "Where everything lives",
      items: [
        "Receipts: Google Drive, in the Receipts folder, one folder per month.",
        "Expenses: the expense sheet in Google Sheets, one row per receipt.",
        "Driver list: Airtable. The workflow itself: n8n.",
      ],
    },
  ],
};

/** A real build, explained the way the thesis promises. */
const workedExample = {
  slug: "whatsapp-receipts",
  video:
    "https://drive.google.com/file/d/1Ms8CrEDk3Yv--q1XOGvp7fcsWXnlj8fm/view?usp=sharing",
  image: "/case-studies/whatsapp-receipts/workflow.png",
  alt: "The receipt workflow in n8n, from the incoming WhatsApp message to the Drive upload, the expense sheet row and the reply to the driver",
  sentences: [
    "When a driver sends a photo of a receipt to the company’s WhatsApp number, the workflow starts.",
    "AI reads the receipt and pulls out the vendor, date, total, tax and category, and says when it isn’t sure.",
    "A clear receipt is filed in this month’s Drive folder and added to the expense sheet. An unclear one goes to a review list, and the driver is asked to resend it.",
    "Either way, the driver gets a WhatsApp reply saying exactly what happened.",
  ],
};

export default function HowIWorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="How I work"
        title="Built to hand over, so your team can run it."
        lede="Plenty of automations stop working the first time their builder is out of reach, because nobody else knows how they run. Every system I build comes with what your team needs to run it, check it and handle the small things themselves."
      />

      {/* ---------- What every build comes with ---------- */}
      <Container as="section" className="py-14 md:py-16">
        <p className="eyebrow">With every build</p>
        <h2 className="mt-3 max-w-2xl font-display text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight font-semibold text-ink">
          What you get, every time
        </h2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {handover.map((item, index) => (
            <li
              key={item.title}
              className="flex flex-col rounded-md border-2 border-edge bg-card p-6 shadow-card"
            >
              <span
                aria-hidden="true"
                className="font-display text-2xl leading-none font-semibold text-gold"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-xl leading-snug font-semibold text-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                {item.body}
              </p>
              {item.link ? (
                <p className="mt-auto pt-4">
                  <a
                    href={item.link.href}
                    className="text-[0.9375rem] font-semibold text-accent-strong underline underline-offset-4"
                  >
                    {item.link.label}
                  </a>
                </p>
              ) : null}
            </li>
          ))}
        </ul>
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
                  {step.link ? (
                    <p className="mt-2">
                      <a
                        href={step.link.href}
                        className="text-[0.9375rem] font-semibold text-accent-strong underline underline-offset-4"
                      >
                        {step.link.label}
                      </a>
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ---------- Principles, each with the builds that prove it ---------- */}
      <Container as="section" className="py-14 md:py-16">
        <p className="eyebrow">How I build</p>
        <h2 className="mt-3 max-w-2xl font-display text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight font-semibold text-ink">
          Five rules I build by
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
                  className="font-display text-2xl leading-none font-semibold text-gold"
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
                <ul className="mt-2 space-y-1.5">
                  {principle.builds
                    .map((slug) => getCaseStudy("automation", slug))
                    .filter((study) => study !== null)
                    .map((study) => (
                      <li key={study.slug}>
                        <Link
                          href={`/automation/${study.slug}`}
                          className="group/link inline-flex gap-2 text-[0.9375rem] leading-snug font-medium text-accent-strong"
                        >
                          <span aria-hidden="true">→</span>
                          <span className="underline decoration-edge underline-offset-4 transition-colors duration-150 group-hover/link:decoration-accent-strong">
                            {study.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </Container>

      {/* ---------- Worked example: a real build in four sentences ---------- */}
      <section
        id="worked-example"
        className="scroll-mt-24 border-y border-hairline bg-card"
      >
        <Container className="py-14 md:py-16">
          <div className="max-w-prose">
            <p className="eyebrow">Worked example</p>
            <h2 className="mt-3 font-display text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight font-semibold text-ink">
              A real workflow, in four sentences
            </h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted">
              This is the receipt workflow from my logistics build. It looks
              busy. Here is everything it does, with nothing left out.
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
                    className="font-display text-xl font-semibold text-gold"
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
              That&rsquo;s the whole system. Everything else on that canvas is
              the plumbing that carries out those four sentences, plus the
              checks that catch what goes wrong. If someone needs more than four
              sentences to tell you what your own system does, be suspicious.
            </p>
            <h3 className="mt-10 font-display text-xl leading-snug font-semibold text-ink">
              Hear me walk through it
            </h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
              The same receipt build, explained out loud, the way I&rsquo;d hand
              it over to your team.
            </p>
            <VideoEmbed
              src={workedExample.video}
              title="Walkthrough: the receipt build"
            />
            <p>
              <Link
                href={`/automation/${workedExample.slug}`}
                className="text-[0.9375rem] font-semibold text-accent-strong underline underline-offset-4"
              >
                See the full receipt build
              </Link>
            </p>
          </div>
        </Container>
      </section>

      {/* ---------- Sample handoff guide ---------- */}
      <Container
        as="section"
        id="handoff-guide"
        className="scroll-mt-24 py-14 md:py-16"
      >
        <div className="max-w-prose">
          <p className="eyebrow">What you get at handoff</p>
          <h2 className="mt-3 font-display text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight font-semibold text-ink">
            A guide your team can actually use
          </h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">
            Every build comes with a short guide like this one, written for the
            people who run it, not for developers. This sample is for the
            receipt build above.
          </p>
        </div>

        <article className="mt-8 max-w-3xl rounded-md border-2 border-edge bg-card p-6 shadow-card sm:p-10">
          <p className="eyebrow">Sample handoff guide</p>
          <h3 className="mt-2 font-display text-2xl leading-snug font-semibold text-ink">
            {handoffGuide.title}
          </h3>
          <div className="mt-6 divide-y divide-hairline">
            {handoffGuide.sections.map((section) => (
              <section
                key={section.heading}
                className="py-5 first:pt-0 last:pb-0"
              >
                <h4 className="text-sm font-semibold tracking-wide text-ink uppercase">
                  {section.heading}
                </h4>
                <ul className="mt-3 space-y-2">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-muted"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-strong"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </article>
      </Container>

      {/* ---------- Why: the teaching, kept short, as the reason ---------- */}
      <section className="border-y border-hairline bg-card">
        <Container className="py-14 md:py-16">
          <div className="grid gap-10 md:grid-cols-12 md:gap-12">
            <div className="max-w-prose md:col-span-8">
              <p className="eyebrow">Why I explain everything</p>
              <h2 className="mt-3 font-display text-[clamp(1.5rem,1.25rem+1vw,2rem)] leading-tight font-semibold text-ink">
                Before I built systems, I taught maths.
              </h2>
              <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted">
                In one lesson on clock arithmetic, my explanation was correct
                and the class still couldn&rsquo;t see it. So I brought in a
                real wall clock, and we worked the sums on it together. By the
                end, almost the whole class had it.
              </p>
              <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted">
                Systems work the same way. A correct build isn&rsquo;t enough if
                the people running it can&rsquo;t see how it works. That&rsquo;s
                why every build comes with the guide, the walkthrough and the
                alerts above.
              </p>
            </div>
            <div className="md:col-span-4">
              <p className="eyebrow">Teaching background</p>
              <ul className="mt-5 space-y-4">
                {schools.map((school) => (
                  <li key={school.name} className="border-l-2 border-edge pl-4">
                    <p className="text-[0.9375rem] leading-snug font-semibold text-ink">
                      {school.name}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {school.detail} · {school.when}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- CTA ---------- */}
      <section>
        <Container className="py-14 md:py-16">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-lg font-display text-[clamp(1.5rem,1.25rem+1vw,2rem)] leading-tight font-semibold text-ink">
              Want a system your team can run without calling me every week?
            </p>
            <CTAButton href="/contact">Start a conversation</CTAButton>
          </div>
        </Container>
      </section>
    </>
  );
}
