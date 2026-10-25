"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Demo } from "@/lib/demos/types";

/**
 * The playback clock behind a demo. Time only moves while `playing`; every
 * frame is drawn from it, so play, pause, step and seek always land exactly.
 * `frameMs` throttles redraws, for small previews that don't need 60 a second.
 */
export function useDemoClock(demo: Demo, frameMs = 0) {
  const starts = useMemo(() => {
    let acc = 0;
    return demo.beats.map((beat) => {
      const start = acc;
      acc += beat.duration;
      return start;
    });
  }, [demo]);
  const total =
    starts[starts.length - 1] + demo.beats[demo.beats.length - 1].duration;

  const [time, setClock] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timeRef = useRef(0);
  timeRef.current = time;
  // A seek made while playing, for the running clock to pick up.
  const seekRef = useRef<number | null>(null);

  const setTime = useCallback((ms: number) => {
    seekRef.current = ms;
    setClock(ms);
  }, []);

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    let drawn = last;
    let pending = timeRef.current;
    seekRef.current = null;
    let frame = requestAnimationFrame(function tick(now) {
      if (seekRef.current !== null) {
        pending = seekRef.current;
        seekRef.current = null;
      }
      pending = Math.min(total, pending + (now - last));
      last = now;
      if (now - drawn >= frameMs || pending >= total) {
        drawn = now;
        setClock(pending);
      }
      if (pending >= total) setPlaying(false);
      else frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [playing, total, frameMs]);

  /** Plays from where it is, or from the start once it has finished. */
  const play = useCallback(() => {
    if (timeRef.current >= total) setTime(0);
    setPlaying(true);
  }, [total, setTime]);

  const beatAt = useCallback(
    (ms: number) => {
      let i = starts.length - 1;
      while (i > 0 && starts[i] > ms) i -= 1;
      return i;
    },
    [starts],
  );

  return { starts, total, time, setTime, playing, setPlaying, play, beatAt };
}
