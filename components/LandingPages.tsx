import fs from "node:fs";
import path from "node:path";
import Container from "@/components/Container";
import LandingGallery from "@/components/LandingGallery";
import { jpegSize } from "@/lib/image-size";
import { landingPages } from "@/lib/landing-pages";

const DIR = "/case-studies/landing-pages";

/**
 * "Other landing pages I've built" on the marketing lane. Finds each page's
 * tiles on disk and reads their sizes here, at build time, so the client
 * gallery gets plain data and never touches the file system.
 */
export default function LandingPages() {
  const pages = landingPages.map((page) => {
    const folder = `${DIR}/${page.slug}`;
    const tiles = fs
      .readdirSync(path.join(process.cwd(), "public", folder))
      .filter((file) => /^\d+\.jpg$/.test(file))
      .sort()
      .map((file) => ({
        src: `${folder}/${file}`,
        ...jpegSize(`${folder}/${file}`),
      }));
    return { ...page, thumb: `${folder}/thumb.jpg`, tiles };
  });

  return (
    <Container as="section" aria-labelledby="landing-pages" className="pb-16">
      <div className="border-t border-hairline pt-12 md:pt-14">
        <p className="eyebrow">More work</p>
        <h2
          id="landing-pages"
          className="mt-3 font-display text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight font-semibold text-ink"
        >
          Other landing pages I&rsquo;ve built
        </h2>
        <p className="mt-4 max-w-prose text-[1.0625rem] leading-relaxed text-muted">
          Each one is live on the store and takes orders through its own form.
          Choose a product to see its page.
        </p>
        <LandingGallery pages={pages} />
      </div>
    </Container>
  );
}
