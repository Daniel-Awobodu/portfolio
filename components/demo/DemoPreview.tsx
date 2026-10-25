"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import DemoScenes from "@/components/demo/DemoScenes";
import { useDemoClock } from "@/components/demo/useDemoClock";
import type { Demo } from "@/lib/demos/types";

/** The sizes the preview is drawn at, then scaled to fit the card: the
 *  desktop player's layout, or the phone player's on a portrait card. */
const WIDE = { w: 720, h: 450, narrow: false };
const TALL = { w: 400, h: 500, narrow: true };

/**
 * A build's walkthrough playing silently on its card: a scaled copy of the
 * desktop player, or of the phone player on a portrait card, with the
 * caption kept at a readable size. It plays
 * while `run` is set, starting over once it has finished, and reports the end
 * so the card can move on to its pictures.
 */
export default function DemoPreview({
  demo: voiced,
  run,
  onEnd,
}: {
  demo: Demo;
  run: boolean;
  onEnd: () => void;
}) {
  // Silent here, so at the scripted pace rather than the narrated one.
  const demo = useMemo(
    () =>
      voiced.silentBeats ? { ...voiced, beats: voiced.silentBeats } : voiced,
    [voiced],
  );
  const { starts, total, time, playing, setPlaying, play, beatAt } =
    useDemoClock(demo, 33);
  const [scale, setScale] = useState(0.5);
  const [layout, setLayout] = useState(WIDE);
  const wrapRef = useRef<HTMLDivElement>(null);
  const ended = time >= total;
  const endedRef = useRef(onEnd);
  endedRef.current = onEnd;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const box = entry.contentRect;
      const next = box.height > box.width * 0.9 ? TALL : WIDE;
      setLayout(next);
      setScale(Math.max(box.width / next.w, box.height / next.h));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (run) play();
    else setPlaying(false);
  }, [run, play, setPlaying]);

  // Reports the end once, as the clock reaches it, not on a later restart.
  const wasPlaying = useRef(false);
  useEffect(() => {
    if (wasPlaying.current && !playing && ended) endedRef.current();
    wasPlaying.current = playing;
  }, [playing, ended]);

  const index = beatAt(time);
  const beat = demo.beats[index];
  const t = Math.min(1, (time - starts[index]) / beat.duration);

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 overflow-hidden bg-[#0b100e]"
      aria-hidden="true"
      data-playing={playing || undefined}
    >
      <div
        className="pointer-events-none absolute top-0 left-0 origin-top-left [container-type:size]"
        style={{
          width: layout.w,
          height: layout.h,
          transform: `scale(${scale})`,
        }}
      >
        <DemoScenes
          demo={demo}
          beatIndex={index}
          t={t}
          width={layout.w}
          height={layout.h}
          narrow={layout.narrow}
          reduced={false}
          onReplay={play}
        />
      </div>
      {beat.scene !== "end" ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/65 to-transparent px-3 pt-8 pb-2.5">
          <p className="line-clamp-2 text-center text-[12.5px] leading-snug font-medium text-white">
            {beat.caption}
          </p>
        </div>
      ) : null}
    </div>
  );
}
