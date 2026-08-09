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
        lede="No forms to fill out twice, no discovery-call funnel. Describe the bottleneck or the product in a few sentences and I'll tell you honestly whether I'm the right person for it."
      />

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

            <div className="mt-10 rounded-md border border-hairline bg-card p-6">
              <p className="eyebrow">Good first message</p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                &ldquo;We sell [product]. Right now [thing] is done by hand and
                it takes [time]. Can this be automated?&rdquo; — that&rsquo;s
                genuinely enough for me to give you a useful answer.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
