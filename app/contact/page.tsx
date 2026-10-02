import type { Metadata } from "next";
import Container from "@/components/Container";
import ContactForm from "@/components/ContactForm";
import ContactLinks from "@/components/ContactLinks";
import PageHeader from "@/components/PageHeader";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: `Tell ${site.name} what you're trying to automate or sell. Message on WhatsApp, email, LinkedIn or X — replies are fast.`,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact — ${site.name}`,
    description:
      "Tell me what you're trying to automate or sell. I reply fast.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Tell me what you're trying to automate or sell. I reply fast."
        lede="State your business problem and I'll show you the workflow that solves it: what gets automated, which tools it uses, and how it runs once it's live, explained so you understand exactly what you're getting."
      >
        <ul
          aria-label="Availability"
          className="mt-7 flex flex-col gap-1 text-sm text-muted sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3"
        >
          {site.availability.map((item, i) => (
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
          </div>

          <div className="lg:col-span-5">
            <h2 className="font-display text-2xl leading-tight font-semibold text-ink">
              Or reach me directly
            </h2>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
              WhatsApp is the fastest way to get me. Everything else lands in
              the same place eventually.
            </p>
            <ContactLinks className="mt-6" columns={1} />

            <p className="mt-6 border-l-2 border-accent pl-4 text-[0.9375rem] leading-relaxed text-muted">
              <span className="font-semibold text-ink">
                Found me on Upwork?
              </span>{" "}
              Please message me there. Upwork keeps conversations on the
              platform until a contract starts, and I stick to that.
            </p>

            <div className="mt-10">
              <p className="eyebrow">What I build with</p>
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tools">
                {site.tools.map((tool) => (
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
                and leads still slip through.&rdquo; That&rsquo;s enough for me
                to start mapping the fix.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
