/*
 * What the narrator says on each beat: the caption, unless the beat gives its
 * own `say`, tidied so it reads well aloud. Shared by the player and by
 * scripts/demo-voice.mjs, which makes the clips, so a clip is only used while
 * it still matches its caption.
 */

type Narrated = { caption: string; say?: string };

export function narration(beat: Narrated): string {
  return (
    (beat.say ?? beat.caption)
      .replace(/₦([\d,.]+)/g, "$1 naira")
      .replace(/\s*→\s*/g, " to ")
      .replace(/…/g, "")
      // "Lead" here is always a prospect; spelt so the voice says "leed".
      .replace(/\b([Ll])ead(s?)\b/g, "$1eed$2")
      .replace(/\s+/g, " ")
      .trim()
  );
}

/** Where a beat's clip is published. */
export function clipPath(slug: string, beatIndex: number): string {
  return `/demos/${slug}/voice/${String(beatIndex).padStart(2, "0")}.mp3`;
}
