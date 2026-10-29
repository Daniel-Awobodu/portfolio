/* eslint-disable @next/next/no-img-element -- a small local image inside an
   animated mock-up, sized by its container */
import { easeOut, span } from "@/components/demo/anim";
import { Window } from "@/components/demo/AppScenes";
import type { Demo } from "@/lib/demos/types";

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.1em] w-[1.1em]" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="#5f6368"
        strokeWidth="2"
      />
      <path
        d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"
        fill="none"
        stroke="#5f6368"
        strokeWidth="1.6"
      />
    </svg>
  );
}

/**
 * What readers see. "article": the published post on the blog, its
 * illustration first. "social": the same article shared on X and LinkedIn,
 * each written for its platform.
 */
export default function PostScene({
  demo,
  t,
  narrow,
  mode,
}: {
  demo: Demo;
  t: number;
  narrow: boolean;
  mode: "article" | "social";
}) {
  const post = demo.post!;

  if (mode === "article") {
    const scroll = easeOut(span(t, 0.45, 0.9)) * (narrow ? 26 : 18);
    return (
      <Window title={`${post.title} · ${post.site}`} icon={<GlobeIcon />}>
        <div className="h-full overflow-hidden bg-white">
          <div
            className={`mx-auto px-[clamp(12px,3cqw,28px)] pt-[clamp(10px,2.4cqh,22px)] ${narrow ? "" : "max-w-[62%]"}`}
            style={{ transform: `translateY(-${scroll}cqh)` }}
          >
            <p className="text-[clamp(16px,2.8cqw,28px)] leading-tight text-[#111]">
              {post.title}
            </p>
            <img
              src={post.image}
              alt=""
              className="mt-[clamp(6px,1.4cqh,12px)] aspect-[3/2] w-full rounded-sm object-cover"
              style={{ opacity: easeOut(span(t, 0.05, 0.2)) }}
            />
            <p className="mt-1.5 text-[clamp(9px,1.1cqw,11px)] text-[#555]">
              {post.byline}
            </p>
            {post.paragraphs.map((p, i) => (
              <p
                key={i}
                className={`mt-2 leading-snug text-[#222] ${
                  p.startsWith("## ")
                    ? "text-[clamp(13px,1.9cqw,19px)]"
                    : "text-[clamp(11px,1.4cqw,14px)]"
                }`}
              >
                {p.replace(/^## /, "")}
              </p>
            ))}
          </div>
        </div>
      </Window>
    );
  }

  const x = easeOut(span(t, 0.08, 0.22));
  const li = easeOut(span(t, 0.32, 0.46));
  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#22302a,#0b100e)]">
      <div
        className={`absolute inset-x-[4cqw] top-[6cqh] bottom-[19cqh] flex gap-[clamp(8px,2cqw,20px)] text-[clamp(10px,1.35cqw,13px)] ${narrow ? "flex-col" : ""}`}
      >
        {/* X */}
        <div
          className="min-h-0 flex-1 overflow-hidden rounded-xl border border-white/15 bg-black p-[clamp(8px,1.6cqw,16px)] text-[#e7e9ea]"
          style={{ opacity: x, transform: `translateY(${(1 - x) * 10}px)` }}
        >
          <p className="flex items-center gap-2">
            <span className="flex h-[2.2em] w-[2.2em] shrink-0 items-center justify-center rounded-full bg-[#2f3336] font-bold">
              {post.x.name.charAt(0)}
            </span>
            <span className="min-w-0 truncate">
              <span className="font-bold">{post.x.name}</span>{" "}
              <span className="text-[#71767b]">
                {post.x.handle} · {post.x.time}
              </span>
            </span>
            <span className="ml-auto font-bold">𝕏</span>
          </p>
          <p className={`mt-1.5 leading-snug ${narrow ? "line-clamp-2" : ""}`}>
            {post.x.text}
          </p>
          <div className="mt-2 flex overflow-hidden rounded-xl border border-[#2f3336]">
            <img
              src={post.image}
              alt=""
              className={`shrink-0 object-cover ${narrow ? "w-[30%]" : "w-[38%]"}`}
            />
            <div className="min-w-0 p-2 leading-snug">
              <p className="truncate text-[#71767b]">{post.site}</p>
              <p className="line-clamp-2">{post.title}</p>
            </div>
          </div>
        </div>

        {/* LinkedIn */}
        <div
          className="min-h-0 flex-1 overflow-hidden rounded-xl border border-[#d9d9d9] bg-white p-[clamp(8px,1.6cqw,16px)] text-[#1d1d1d]"
          style={{ opacity: li, transform: `translateY(${(1 - li) * 10}px)` }}
        >
          <p className="flex items-center gap-2">
            <span className="flex h-[2.2em] w-[2.2em] shrink-0 items-center justify-center rounded-full bg-[#0a66c2] font-bold text-white">
              {post.linkedin.name.charAt(0)}
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-semibold">
                {post.linkedin.name}
              </span>
              <span className="block truncate text-[0.85em] text-[#666]">
                {post.linkedin.headline} · {post.linkedin.time}
              </span>
            </span>
            <span className="ml-auto rounded-[3px] bg-[#0a66c2] px-1 text-[0.85em] font-bold text-white">
              in
            </span>
          </p>
          <p className={`mt-1.5 leading-snug ${narrow ? "line-clamp-3" : ""}`}>
            {post.linkedin.text}
            <span className="text-[#666]"> …more</span>
          </p>
          {!narrow ? (
            <img
              src={post.image}
              alt=""
              className="mt-2 aspect-[2/1] w-full rounded object-cover"
            />
          ) : null}
          <p className="mt-2 flex justify-between border-t border-[#e8e8e8] pt-1.5 text-[0.9em] text-[#666]">
            <span>👍 Like</span>
            <span>💬 Comment</span>
            <span>🔁 Repost</span>
            {!narrow ? <span>➤ Send</span> : null}
          </p>
        </div>
      </div>
    </div>
  );
}
