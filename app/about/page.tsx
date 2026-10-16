import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import ContactLinks from "@/components/ContactLinks";
import CTAButton from "@/components/CTAButton";
import PageHeader from "@/components/PageHeader";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name}: UNILAG mathematics education graduate, five years in growth marketing, now building AI automation systems. ${site.tagline}`,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About — ${site.name}`,
    description:
      "Maths teacher and growth marketer, now building AI automation systems. The through-line is making complex things simple.",
    url: "/about",
  },
};

/* True, specific things outside work. The section stays hidden until this
   list has entries, so a placeholder can never go live. */
const funFacts: string[] = [];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Maths teacher, marketer, systems builder."
        lede="The job titles changed. The habit never did: take something tangled, find the structure underneath it, explain it back in plain words."
      />

      <Container as="section" className="py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-12 md:gap-14">
          {/* Portrait */}
          <div className="md:col-span-5">
            <figure className="sticky top-28">
              <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[380px] md:max-w-none">
                <div
                  aria-hidden="true"
                  className="absolute -inset-3 rounded-full border border-hairline sm:-inset-4"
                />
                <div className="relative aspect-square w-full overflow-hidden rounded-full border border-hairline bg-card">
                  <Image
                    src="/daniel.jpg"
                    alt={`${site.name}, AI automation and e-commerce growth specialist`}
                    fill
                    priority
                    sizes="(max-width: 640px) 320px, (max-width: 768px) 380px, 420px"
                    className="object-cover"
                  />
                </div>
              </div>
              <figcaption className="mt-8 text-center text-sm text-muted md:text-left">
                {site.name}, Lagos, Nigeria. Available to clients worldwide.
              </figcaption>
            </figure>
          </div>

          {/* Story */}
          <div className="md:col-span-7">
            <div className="max-w-prose">
              <h2 className="font-display text-2xl leading-tight font-semibold text-ink">
                The story
              </h2>
              <div className="mt-5 space-y-5 text-[1.0625rem] leading-relaxed text-muted [&_a]:text-accent-strong [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:decoration-2">
                <p>
                  I earned a B.Sc. (Ed.) Mathematics from the University of
                  Lagos in 2022, and I taught in two schools: maths to five SS1
                  classes at Mainland High School during my teaching practice,
                  then a primary class at Busy Fingers School for my NYSC year.
                  Both came down to the same job: turning abstract ideas into
                  something a student could hold onto.
                </p>
                <p>
                  Alongside that, I spent five years in growth marketing:
                  Facebook and Instagram ads, sales pages, offers, the
                  unglamorous work of getting a product to actually sell. I run
                  an e-commerce business, <strong>Quality-Buy</strong>, with a
                  business partner, and it&rsquo;s where every idea gets tested
                  with real money and real customers.
                </p>
                <p>
                  Quality-Buy is also where I met the problem that led me here.
                  Every order arrived as an email. Gmail notifications came
                  late, so orders sat unseen for up to two hours, and each one
                  was copied into WhatsApp by hand. More than a thousand past
                  orders sat in the inbox with no way to reuse them. So I built{" "}
                  <Link href="/automation/order-alerts">
                    an alert that sends every new order to WhatsApp
                  </Link>
                  , and{" "}
                  <Link href="/automation/order-extraction">
                    a reader that turned 1,145 past orders into one customer
                    database
                  </Link>
                  . Both still run every day, at Quality-Buy and at SpotShop,
                  and building systems like them became the work.
                </p>
                <p>
                  The through-line is the same one from the classroom. A
                  business process and a maths problem fail for the same reason:
                  nobody has looked at the structure. Find the structure, build
                  the system, then explain it so the person who owns it actually
                  owns it.
                </p>
              </div>

              {/* What I do now */}
              <h2 className="mt-12 font-display text-2xl leading-tight font-semibold text-ink">
                What I do now
              </h2>
              <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted">
                I build AI automations that take repetitive work off a team:
                capturing orders, following up leads, booking appointments, and
                reading documents and receipts. Every build comes with a plain
                explanation, so your team owns it. I still run the ads and sales
                pages for Quality-Buy.
              </p>
              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                <li>
                  <Link
                    href="/automation"
                    className="text-[0.9375rem] font-semibold text-accent-strong underline underline-offset-4"
                  >
                    See the automation builds
                  </Link>
                </li>
                <li>
                  <Link
                    href="/how-i-think"
                    className="text-[0.9375rem] font-semibold text-accent-strong underline underline-offset-4"
                  >
                    How I work
                  </Link>
                </li>
              </ul>

              {/* Experience */}
              <h2 className="mt-12 font-display text-2xl leading-tight font-semibold text-ink">
                Experience
              </h2>
              <dl className="mt-5 grid gap-px overflow-hidden rounded-md border border-hairline bg-hairline sm:grid-cols-3">
                {site.experience.map((item) => (
                  <div key={item.label} className="bg-card px-5 py-5">
                    <dt className="eyebrow">{item.label}</dt>
                    <dd className="mt-2 font-display text-[1.625rem] leading-none font-semibold text-accent">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
                <span className="font-semibold text-ink">Education:</span>{" "}
                {site.credential}
              </p>

              {/* Fun facts: hidden until there are real ones. */}
              {funFacts.length > 0 ? (
                <>
                  <h2 className="mt-12 font-display text-2xl leading-tight font-semibold text-ink">
                    Five things that aren&rsquo;t on my CV
                  </h2>
                  <ul className="mt-5 space-y-3">
                    {funFacts.map((fact, index) => (
                      <li
                        key={`${fact}-${index}`}
                        className="flex gap-3 border-b border-hairline pb-3 text-[1.0625rem] text-muted last:border-0"
                      >
                        <span aria-hidden="true" className="text-accent-strong">
                          •
                        </span>
                        {fact}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </Container>

      {/* Contact */}
      <section className="border-t border-hairline bg-card">
        <Container className="py-14 md:py-16">
          <h2 className="font-display text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight font-semibold text-ink">
            Say hello
          </h2>
          <p className="mt-4 max-w-prose text-[1.0625rem] leading-relaxed text-muted">
            Whether you have a project in mind or just want to compare notes on
            automation, I&rsquo;m easy to reach.
          </p>
          <ContactLinks className="mt-8" />
          <div className="mt-8">
            <CTAButton href="/contact">Start a conversation</CTAButton>
          </div>
        </Container>
      </section>
    </>
  );
}
