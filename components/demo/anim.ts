/** Small, pure helpers for the demo scenes. Everything is driven by `t`, the
 *  progress through the current beat (0 to 1), so seeking always lands on the
 *  exact frame rather than replaying animations. */

export const clamp = (v: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, v));

/** Progress of `t` through the window [from, to], clamped to 0..1. */
export const span = (t: number, from: number, to: number) =>
  clamp((t - from) / (to - from));

export const easeInOut = (s: number) =>
  s < 0.5 ? 2 * s * s : 1 - Math.pow(-2 * s + 2, 2) / 2;

export const easeOut = (s: number) => 1 - Math.pow(1 - s, 3);

/** The first part of `text`, revealed as `p` goes from 0 to 1. */
export const reveal = (text: string, p: number) =>
  text.slice(0, Math.ceil(clamp(p) * text.length));
