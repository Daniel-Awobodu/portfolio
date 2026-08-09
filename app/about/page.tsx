import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/Container";
import ContactLinks from "@/components/ContactLinks";
import CTAButton from "@/components/CTAButton";
import PageHeader from "@/components/PageHeader";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name} — UNILAG mathematics education graduate, five years in growth marketing, now building AI automation systems. ${site.tagline}`,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About — ${site.name}`,
    description:
      "Maths teacher, then five years in growth marketing, now building AI automation systems. The through-line is making complex things simple.",
    url: "/about",
  },
};

/* Replace each [FUN FACT] with something true and specific — these are what
   people actually remember about you. Keep them short. */
const funFacts = [
  "[FUN FACT]",
  "[FUN FACT]",
  "[FUN FACT]",
  "[FUN FACT]",
  "[FUN FACT]",
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Maths teacher, marketer, systems builder — in that order."
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
                {site.name} — Lagos, Nigeria. Working with clients worldwide.
              </figcaption>
            </figure>
          </div>

          {/* Story */}
          <div className="md:col-span-7">
            <div className="max-w-prose">
              <h2 className="font-display text-2xl leading-tight font-semibold text-ink">
                The story
              </h2>
              <div className="mt-5 space-y-5 text-[1.0625rem] leading-relaxed text-muted">
                <p>
                  I graduated from the University of Lagos in 2022 with a B.Sc.
                  in Mathematics Education, and then did the thing the degree
                  was for: I taught. Two years in front of a class, turning
                  abstract ideas into something a sixteen-year-old could hold
                  onto.
                </p>
                <p>
                  Alongside and after that, I spent five years in growth
                  marketing — Facebook and Instagram ads, sales pages, offers,
                  the unglamorous work of getting a product to actually sell. I
                  ran my own store, <strong>quality-buy.online</strong>, partly
                  as a business and partly as a laboratory I could break without
                  costing anyone else money.
                </p>
                <p>
                  Marketing is where I met the bottleneck that led me here.
                  Campaigns worked, leads arrived, and then everything fell over
                  at the human step — nobody following up, nobody sorting the
                  inbox, the same copy-paste job done four hundred times a
                  month. So I started building systems to handle it, and that
                  became the work.
                </p>
                <p>
                  The through-line is the same one from the classroom. A
                  business process and a maths problem fail for the same reason:
                  nobody has looked at the structure. Find the structure, build
                  the system, then explain it so the person who owns it actually
                  owns it.
                </p>
              </div>

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

              {/* Credential — one text line, no documents, no images. */}
              <h2 className="mt-12 font-display text-2xl leading-tight font-semibold text-ink">
                Education
              </h2>
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink">
                {site.credential}
              </p>

              {/* Fun facts */}
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
                      —
                    </span>
                    {fact}
                  </li>
                ))}
              </ul>
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
