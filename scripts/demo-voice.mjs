/*
 * Makes the narration clips for the "Watch it run" demos with ElevenLabs:
 * one clip per beat, read from its caption, in the voice set below. Clips
 * whose text hasn't changed are kept, so re-running only pays for new lines.
 *
 *   ELEVENLABS_API_KEY=… ELEVENLABS_VOICE_ID=… \
 *     node --experimental-strip-types scripts/demo-voice.mjs [slug …]
 *
 * Writes public/demos/<slug>/voice/NN.mp3 and records each clip's text and
 * length in lib/demos/voice.json, which the player reads. `--fake` makes
 * silent clips of a plausible length instead, for testing without a key.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { clipPath, narration } from "../lib/demos/narration.ts";

const root = path.resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const fake = args.includes("--fake");
const only = args.filter((a) => !a.startsWith("--"));

const key = process.env.ELEVENLABS_API_KEY;
const voice = process.env.ELEVENLABS_VOICE_ID;
const model = process.env.ELEVENLABS_MODEL ?? "eleven_multilingual_v2";
if (!fake && (!key || !voice)) {
  console.error("Set ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID first.");
  process.exit(1);
}

const dir = path.join(root, "lib/demos");
const demos = [];
for (const file of fs.readdirSync(dir)) {
  if (
    !file.endsWith(".ts") ||
    ["index.ts", "types.ts", "narration.ts"].includes(file)
  )
    continue;
  const mod = await import(path.join(dir, file));
  for (const value of Object.values(mod)) {
    if (
      value &&
      typeof value === "object" &&
      "slug" in value &&
      "beats" in value
    )
      demos.push(value);
  }
}

const manifestFile = path.join(dir, "voice.json");
const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));

const seconds = (file) =>
  Number(
    execFileSync("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "csv=p=0",
      file,
    ])
      .toString()
      .trim(),
  );

async function speak(text, previous, next) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": key,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: model,
      previous_text: previous,
      next_text: next,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8,
        style: 0.15,
        use_speaker_boost: true,
      },
    }),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

for (const demo of demos) {
  if (only.length && !only.includes(demo.slug)) continue;
  const lines = demo.beats.map(narration);
  const clips = manifest[demo.slug] ?? [];
  let made = 0;
  for (let i = 0; i < lines.length; i += 1) {
    const file = path.join(root, "public", clipPath(demo.slug, i));
    if (clips[i]?.text === lines[i] && fs.existsSync(file)) continue;
    fs.mkdirSync(path.dirname(file), { recursive: true });
    if (fake) {
      const length = Math.max(1, lines[i].length / 15).toFixed(2);
      execFileSync("ffmpeg", [
        "-loglevel",
        "error",
        "-y",
        "-f",
        "lavfi",
        "-i",
        "sine=frequency=330:sample_rate=22050",
        "-t",
        length,
        "-filter:a",
        "volume=0.05",
        "-c:a",
        "libmp3lame",
        "-b:a",
        "32k",
        file,
      ]);
    } else {
      fs.writeFileSync(file, await speak(lines[i], lines[i - 1], lines[i + 1]));
    }
    clips[i] = { text: lines[i], ms: Math.round(seconds(file) * 1000) };
    made += 1;
  }
  manifest[demo.slug] = clips.slice(0, lines.length);
  console.log(`${demo.slug}: ${made} new clip(s), ${lines.length} in all`);
}

fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + "\n");
