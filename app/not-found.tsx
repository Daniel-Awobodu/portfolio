import CTAButton from "@/components/CTAButton";
import Container from "@/components/Container";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <Container className="py-24 text-center md:py-32">
      <p className="eyebrow">404</p>
      <h1 className="mx-auto mt-4 max-w-xl font-display text-[clamp(2rem,1.5rem+2.4vw,3rem)] leading-tight font-semibold text-ink">
        That page doesn&rsquo;t exist
      </h1>
      <p className="mx-auto mt-5 max-w-md text-[1.0625rem] leading-relaxed text-muted">
        The link may be out of date. The work is all still here — start with the
        automation lane, or just message me.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-4">
        <CTAButton href="/automation">See the work</CTAButton>
        <CTAButton href="/contact" variant="secondary">
          Start a conversation
        </CTAButton>
      </div>
    </Container>
  );
}
