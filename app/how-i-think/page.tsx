import type { Metadata } from "next";
import CTAButton from "@/components/CTAButton";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "How I Think",
  description:
    "Most automation freelancers can't explain what they built. I can — I taught maths for two years before I built systems. Clear handoffs, real documentation, and a system you actually own.",
  alternates: { canonical: "/how-i-think" },
  openGraph: {
    title: `How I Think — ${site.name}`,
    description:
      "A maths teacher's habit: I don't just build it, I explain it so you actually own it.",
    url: "/how-i-think",
  },
};

const strengths = [
  {
    title: "You get a handoff, not a black box",
    body: "Every build ends with a walkthrough in plain language: what runs, when it runs, and what to do when it stops. If I disappeared tomorrow, your team could still operate the thing.",
  },
  {
    title: "Documentation written for the person using it",
    body: "Not a technical spec. A short document that says what each part does in the words your team already uses, with the two or three things most likely to go wrong and how to spot them.",
  },
  {
    title: "You can tell whether it's working",
    body: "I'd rather you understood the number than trusted my dashboard. Part of every build is agreeing, up front, what success looks like and where you'll see it.",
  },
];

export default function HowIThinkPage() {
  return (
    <>
      <PageHeader
        eyebrow="The difference"
        title="I don't just build it. I explain it."
        lede="Most people who can wire up an automation cannot tell you how it works. That gap is where projects go to die — the system runs, nobody understands it, and the first time it breaks it gets abandoned."
      />

      {/* ---------- Thesis ---------- */}
      <Container as="section" className="py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <p className="eyebrow">The thesis</p>
          </div>
          <div className="max-w-prose md:col-span-8">
            <p className="font-display text-[clamp(1.5rem,1.2rem+1.3vw,2rem)] leading-[1.25] font-semibold text-ink">
              I spent two years teaching maths before I built a single system.
              That job was never about knowing the answer — it was about making
              someone else see it.
            </p>
            <p className="mt-6 text-[1.0625rem] leading-relaxed text-muted">
              Thirty teenagers will not politely nod at an explanation they
              don&rsquo;t follow. They switch off, visibly, in about four
              seconds. You learn very quickly to strip an idea down to its
              actual mechanism, and to notice the exact sentence where you lost
              the room.
            </p>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted">
              That is the same skill a client needs from an automation build.
              Not a demo — an explanation. The system is only worth what you can
              still run six months after I&rsquo;ve gone.
            </p>
          </div>
        </div>
      </Container>

      {/* ---------- What it means for you ---------- */}
      <section className="border-y border-hairline bg-card">
        <Container className="py-14 md:py-16">
          <h2 className="font-display text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight font-semibold text-ink">
            What that means when you hire me
          </h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {strengths.map((item, index) => (
              <li
                key={item.title}
                className="border-t border-hairline pt-5 md:border-t-0 md:border-l md:pt-0 md:pl-6"
              >
                <span className="font-display text-2xl font-semibold text-accent-strong">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-xl leading-snug font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ---------- Worked example: the teaching voice, on the page ---------- */}
      <Container as="section" className="py-14 md:py-16">
        <div className="max-w-prose">
          <p className="eyebrow">Worked example</p>
          <h2 className="mt-3 font-display text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight font-semibold text-ink">
            So what is an automation, actually?
          </h2>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted">
            Here is the whole thing, in four sentences. No jargon, nothing left
            out.
          </p>

          <ol className="mt-8 space-y-5">
            {[
              "An automation is a rule that says: when this happens, do that.",
              "Something has to start it — a form gets filled in, a payment lands, a certain time of day arrives.",
              "Then a list of steps runs in order, and each step is something a person could have done by hand: copy this, check that, send this message.",
              "The computer's only advantage is that it never forgets a step, never gets tired, and does it at 3am.",
            ].map((sentence, index) => (
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
            That&rsquo;s it. Everything else — n8n, Make, webhooks, APIs — is
            just the plumbing that carries out those four sentences. If someone
            needs more than four sentences to tell you what your own system
            does, be suspicious.
          </p>

          <div className="mt-10 border-t border-hairline pt-8">
            <p className="eyebrow">Credential</p>
            <p className="mt-3 font-display text-xl leading-snug font-semibold text-ink">
              {site.credential}
            </p>
          </div>
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
