import type { ReactNode } from "react";

/**
 * `<NextStep>` in an MDX body: the build's known gap, framed as the next thing
 * worth adding. Closes the write-up, so it reads as a plan rather than a
 * disclaimer buried in the last paragraph.
 */
export default function NextStep({ children }: { children: ReactNode }) {
  return (
    <aside className="rounded-md border border-hairline border-l-2 border-l-accent bg-card px-6 py-5 [&>*+*]:mt-3">
      <p className="eyebrow">What I&rsquo;d add next</p>
      {children}
    </aside>
  );
}
