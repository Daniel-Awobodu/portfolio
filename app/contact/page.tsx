import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ContactForm from "@/components/ContactForm";
import ContactLinks from "@/components/ContactLinks";
import PageHeader from "@/components/PageHeader";
import { getCaseStudies } from "@/lib/content";
import { contact, site } from "@/lib/site-config";
import { topTools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Contact",
  description: `Tell ${site.name} what you're trying to automate or sell. Message on WhatsApp, email, LinkedIn or X, or book a free discovery call. Replies ${site.replyTime}.`,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact — ${site.name}`,
    description:
      "Tell me what you're trying to automate or sell. I usually reply within a few hours.",
    url: "/contact",
  },
};

/** What a visitor can expect once they've sent a message. */
const nextSteps = [
  {
    title: "I reply",
    body: `By email or WhatsApp, ${site.replyTime}.`,
  },
  {
    title: "A free discovery call",
    body: "30 minutes to an hour, wherever suits you: Google Meet, Zoom, WhatsApp or a phone call. You walk me through the job, and I ask how it runs today.",
  },
  {
    title: "A plan and a quote",
    body: "What I’d build, how long it takes and what it costs, in writing. Nothing is built until you agree to it.",
  },
];

export default function ContactPage() {
  // The builds decide which tools are listed, so the list can't drift.
  const tools = [
    ...site.platforms,
    ...topTools(getCaseStudies("automation"), 8, site.platforms),
    ...site.skills,
  ];

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Tell me what you’re trying to automate or sell."
        lede="State your business problem and walk me through how you handle it today: the manual steps and the tools you already use. We’ll plan the fix together, then I’ll build a workflow around the way your business actually runs."
      >
        <ul
          aria-label="Availability"
          className="mt-7 flex flex-col gap-1 text-sm text-muted sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3"
        >
          {[
            site.availability[0],
            `Replies ${site.replyTime}`,
            ...site.availability.slice(1),
          ].map((item, i) => (
            <li
              key={item}
              className={`flex items-center gap-3 ${i === 0 ? "" : "pl-5 sm:pl-0"}`}
            >
              {i === 0 ? (
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-brand-whatsapp"
                />
              ) : (
                <span aria-hidden="true" className="hidden sm:inline">
                  ·
                </span>
              )}
              <span className={i === 0 ? "font-medium text-ink" : undefined}>
                {item}
              </span>
            </li>
          ))}
        </ul>
      </PageHeader>

      <Container as="section" className="py-14 md:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="font-display text-2xl leading-tight font-semibold text-ink">
              Send a message
            </h2>
            <div className="mt-6">
              <ContactForm />
            </div>

            <div className="mt-14 border-t border-hairline pt-10">
              <h2 className="font-display text-2xl leading-tight font-semibold text-ink">
                What happens after you send
              </h2>
              <ol className="mt-6 space-y-5">
                {nextSteps.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-accent-strong font-display text-base font-semibold text-accent-strong"
                    >
                      {index + 1}
                    </span>
                    <div className="pt-1">
                      <h3 className="font-semibold text-ink">{step.title}</h3>
                      <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-6">
                <Link
                  href="/how-i-think"
                  className="text-[0.9375rem] font-semibold text-accent-strong underline underline-offset-4"
                >
                  See how a whole project runs
                </Link>
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <h2 className="font-display text-2xl leading-tight font-semibold text-ink">
              Or reach me directly
            </h2>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
              WhatsApp is the fastest way to reach me. Email is best for briefs
              and files.
            </p>
            <ContactLinks className="mt-6" columns={1} />

            <p className="mt-6 border-l-2 border-accent pl-4 text-[0.9375rem] leading-relaxed text-muted">
              <span className="font-semibold text-ink">
                Found me on Upwork?
              </span>{" "}
              Please message me there. Upwork keeps conversations on the
              platform until a contract starts, and I stick to that.{" "}
              <a
                href={contact.upwork}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-accent-strong underline underline-offset-4"
              >
                See my Upwork profile
              </a>
            </p>

            <div className="mt-10">
              <p className="eyebrow">What I build with</p>
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tools">
                {tools.map((tool) => (
                  <li
                    key={tool}
                    className="rounded-sm border border-hairline bg-card px-3 py-1.5 text-sm text-ink"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 rounded-md border border-hairline bg-card p-6">
              <p className="eyebrow">Good first message</p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                &ldquo;Every lead from our website gets copied into HubSpot by
                hand, then someone pings sales on Slack. It eats an hour a day
                and leads still slip through.&rdquo; That&rsquo;s enough for us
                to start planning.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
