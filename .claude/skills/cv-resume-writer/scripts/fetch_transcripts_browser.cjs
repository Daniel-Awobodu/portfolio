#!/usr/bin/env node
// Open each candidate video in a real browser, read its metadata, and save the transcript
// shown by YouTube's own "Show transcript" panel.
//
// Use this when yt-dlp can't get captions (YouTube now asks for a token only its own player
// generates). It is slow on purpose: one page at a time with a pause between them. If YouTube
// shows its "unusual traffic" page, it stops at once; wait a few hours and run it again.
//
// Needs: npm install playwright (or a pre-installed Playwright + Chromium).
// Usage: node scripts/fetch_transcripts_browser.cjs CANDIDATES.json OUT_DIR
//          [--top 20] [--per-channel 2] [--months 6] [--pause 20] [--limit N]
// CANDIDATES.json is a list of {id, title, channel, view_count}, best first (e.g. the
// candidates.json written by fetch_cv_transcripts.py, minus off-topic videos).
// Already-fetched videos (OUT_DIR/pages.json) are not loaded again.
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

function arg(name, dflt) {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? Number(process.argv[i + 1]) : dflt;
}
const [candFile, outDir] = process.argv.slice(2);
if (!candFile || !outDir) {
  console.error("usage: fetch_transcripts_browser.cjs CANDIDATES.json OUT_DIR [--top 20] ...");
  process.exit(2);
}
const TOP = arg("top", 20), PER_CHANNEL = arg("per-channel", 2), MONTHS = arg("months", 6);
const PAUSE = arg("pause", 20) * 1000, LIMIT = arg("limit", Infinity);
const cutoff = new Date(Date.now() - MONTHS * 30.44 * 864e5).toISOString().slice(0, 10).replace(/-/g, "");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const write = (f, o) => fs.writeFileSync(path.join(outDir, f), JSON.stringify(o, null, 2));
const read = (f, d) => (fs.existsSync(path.join(outDir, f)) ? JSON.parse(fs.readFileSync(path.join(outDir, f))) : d);

function* find(o, key) {
  if (Array.isArray(o)) for (const v of o) yield* find(v, key);
  else if (o && typeof o === "object")
    for (const [k, v] of Object.entries(o)) k === key ? yield v : yield* find(v, key);
}

function metaFrom(pr, id) {
  const vd = pr.videoDetails || {};
  const mf = (pr.microformat || {}).playerMicroformatRenderer || {};
  const tracks = ((pr.captions || {}).playerCaptionsTracklistRenderer || {}).captionTracks || [];
  const asr = tracks.find((t) => t.kind === "asr");
  return {
    id,
    url: `https://www.youtube.com/watch?v=${id}`,
    title: vd.title || "",
    channel: vd.author || "",
    upload_date: (mf.uploadDate || mf.publishDate || "").slice(0, 10).replace(/-/g, ""),
    view_count: Number(vd.viewCount || 0),
    duration: Number(vd.lengthSeconds || 0),
    was_live: Boolean(vd.isLiveContent),
    spoken_language: asr ? asr.languageCode : null,
    english: asr ? asr.languageCode.startsWith("en") : tracks.some((t) => t.languageCode.startsWith("en")),
    caption_tracks: tracks.map((t) => `${t.kind === "asr" ? "auto" : "manual"}:${t.languageCode}`),
  };
}

async function openTranscript(page) {
  const resp = page.waitForResponse((r) => r.url().includes("/youtubei/v1/get_transcript"), { timeout: 30000 });
  // The button sits in the description, which may need expanding first.
  for (const sel of ["#description-inline-expander #expand", "tp-yt-paper-button#expand", "#expand"]) {
    const el = page.locator(sel).first();
    if (await el.isVisible().catch(() => false)) { await el.click().catch(() => {}); break; }
  }
  const btn = page.getByRole("button", { name: /show transcript/i }).first();
  await btn.waitFor({ state: "visible", timeout: 15000 });
  await btn.click();
  const json = await (await resp).json();
  const segs = [...find(json, "transcriptSegmentRenderer")];
  let text = segs.map((s) => ((s.snippet || {}).runs || []).map((r) => r.text).join("")).join(" ");
  if (!text.trim()) {
    // Fall back to the rendered panel if the response shape changes.
    await page.locator("ytd-transcript-segment-renderer").first().waitFor({ timeout: 15000 });
    text = (await page.locator("ytd-transcript-segment-renderer .segment-text").allInnerTexts()).join(" ");
  }
  const lang = await page.locator("ytd-transcript-footer-renderer yt-dropdown-menu").innerText().catch(() => "");
  return { text: text.replace(/\s+/g, " ").trim(), panel_language: lang.trim() || null };
}

(async () => {
  fs.mkdirSync(path.join(outDir, "transcripts"), { recursive: true });
  const cands = JSON.parse(fs.readFileSync(candFile));
  const pages = read("pages.json", {});
  const chosen = read("videos.json", []);
  const perChannel = {};
  for (const m of chosen) perChannel[m.channel] = (perChannel[m.channel] || 0) + 1;

  const browser = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined });
  const ctx = await browser.newContext({ locale: "en-US", viewport: { width: 1366, height: 900 } });
  // No need to stream video or images to read a transcript.
  await ctx.route("**/*", (r) => (["media", "image", "font"].includes(r.request().resourceType()) ? r.abort() : r.continue()));

  let loaded = 0;
  for (const c of cands) {
    if (chosen.length >= TOP || loaded >= LIMIT) break;
    if (chosen.some((m) => m.id === c.id)) continue;
    let m = pages[c.id];
    if (m && !m.error && !m.qualifies) continue; // already known not to qualify
    const page = await ctx.newPage();
    try {
      loaded++;
      await page.goto(`https://www.youtube.com/watch?v=${c.id}&hl=en`, { waitUntil: "domcontentloaded", timeout: 60000 });
      if (/google\.com\/sorry|consent\./.test(page.url())) {
        console.log(`STOP: YouTube served ${page.url().split("?")[0]} (rate limit / consent). Try again later.`);
        process.exitCode = 3;
        break;
      }
      await page.waitForFunction(() => window.ytInitialPlayerResponse, null, { timeout: 30000 });
      const pr = await page.evaluate(() => window.ytInitialPlayerResponse);
      m = metaFrom(pr, c.id);
      const channelFull = (perChannel[m.channel] || 0) >= PER_CHANNEL;
      m.qualifies = m.upload_date >= cutoff && m.english && !m.was_live && m.duration >= 180;
      m.reason = !m.qualifies
        ? (m.upload_date < cutoff ? "too old" : !m.english ? `not English (${m.spoken_language})` : m.was_live ? "livestream" : "too short")
        : channelFull ? `channel cap (${PER_CHANNEL})` : "";
      if (m.qualifies && !channelFull) {
        const { text, panel_language } = await openTranscript(page);
        m.panel_language = panel_language;
        m.transcript_words = text.split(" ").length;
        const n = String(chosen.length + 1).padStart(2, "0");
        fs.writeFileSync(path.join(outDir, "transcripts", `${n}_${m.id}.txt`),
          `# ${m.title}\n# ${m.channel} | uploaded ${m.upload_date} | ${m.view_count.toLocaleString("en")} views | ` +
          `${Math.floor(m.duration / 60)} min | transcript panel (${panel_language || "?"}; tracks ${m.caption_tracks.join(", ")})\n` +
          `# ${m.url}\n\n${text}\n`);
        chosen.push(m);
        perChannel[m.channel] = (perChannel[m.channel] || 0) + 1;
        write("videos.json", chosen);
        console.log(`${n}. ${m.view_count.toLocaleString("en").padStart(9)}  ${m.upload_date}  ${m.channel}: ${m.title}  (${m.transcript_words} words)`);
      } else {
        console.log(`  skip ${m.id} ${m.upload_date} ${m.spoken_language || "-"} ${m.reason}: ${m.channel}: ${m.title}`);
      }
    } catch (err) {
      m = { ...(m || { id: c.id, title: c.title }), error: String(err).slice(0, 300) };
      console.log(`  error ${c.id}: ${m.error.split("\n")[0]}`);
      // A redirect to google.com/sorry surfaces as a failed tunnel when that host is not reachable.
      if (/ERR_TUNNEL_CONNECTION_FAILED|ERR_PROXY_CONNECTION_FAILED/.test(m.error)) {
        console.log("STOP: YouTube is redirecting to its unusual-traffic page. Try again later.");
        process.exitCode = 3;
        await page.close().catch(() => {});
        break;
      }
    } finally {
      pages[c.id] = m;
      write("pages.json", pages);
      await page.close().catch(() => {});
    }
    await sleep(PAUSE);
  }
  await browser.close();
  console.log(`\n${chosen.length} transcripts in ${path.join(outDir, "transcripts")}`);
})();
