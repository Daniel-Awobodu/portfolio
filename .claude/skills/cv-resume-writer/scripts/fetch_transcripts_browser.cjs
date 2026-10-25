#!/usr/bin/env node
// Open each candidate video in a real browser, read its metadata, and save the transcript
// shown by YouTube's own "Show transcript" panel.
//
// Use this when yt-dlp can't get captions (YouTube now asks for a token only its own player
// generates). It goes one page at a time with a pause between them. If YouTube shows its
// "unusual traffic" page, it stops at once; wait a few hours and run it again.
//
// Needs: npm ci (installs the pinned Playwright). On Windows it drives the built-in Edge;
// elsewhere also run: npx playwright install chromium
// Usage: node scripts/fetch_transcripts_browser.cjs [CANDIDATES.json] [OUT_DIR]
//          [--top 20] [--per-channel 2] [--months 6] [--pause 20] [--limit N] [--headed]
// Defaults: research/candidates.json next to this script's folder, and ./out.
// CANDIDATES.json is a list of {id, title, channel, view_count}, best first.
// Videos already handled (OUT_DIR/pages.json) are not loaded again, so a stopped run can resume.
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const flags = process.argv.slice(2);
function arg(name, dflt) {
  const i = flags.indexOf(`--${name}`);
  return i >= 0 ? Number(flags[i + 1]) : dflt;
}
const positional = flags.filter((a, i) => !a.startsWith("--") && !(i > 0 && flags[i - 1].startsWith("--") && flags[i - 1] !== "--headed"));
const candFile = positional[0] || path.join(__dirname, "..", "research", "candidates.json");
const outDir = positional[1] || "out";
const TOP = arg("top", 20), PER_CHANNEL = arg("per-channel", 2), MONTHS = arg("months", 6);
const PAUSE = arg("pause", 20) * 1000, LIMIT = arg("limit", Infinity), HEADED = flags.includes("--headed");
// Windows already has Edge, which saves downloading Playwright's Chromium.
const CHANNEL = process.env.PW_CHANNEL || (process.platform === "win32" ? "msedge" : undefined);
const BASE = process.env.YT_BASE || "https://www.youtube.com"; // YT_BASE: tests only
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

// Cookie-consent page shown in the EU/UK: decline and carry on to the video.
async function passConsent(page) {
  const btn = page.getByRole("button", { name: /reject all|accept all/i }).first();
  if (/consent\.(youtube|google)\./.test(page.url())) {
    await btn.click({ timeout: 15000 });
    await page.waitForURL(/youtube\.com\/watch/, { timeout: 30000 });
  } else if (await btn.waitFor({ state: "visible", timeout: 3000 }).then(() => true, () => false)) {
    await btn.click().catch(() => {}); // the same choice shown as a pop-up over the video page
  }
}

function textFromTranscriptJson(json) {
  const parts = [];
  for (const seg of find(json, "transcriptSegmentRenderer"))
    parts.push(((seg.snippet || {}).runs || []).map((r) => r.text).join(""));
  if (!parts.length)
    for (const seg of find(json, "transcriptSegmentViewModel")) {
      const s = seg.simpleText || (seg.snippet || {}).content || (seg.snippet || {}).simpleText;
      if (s) parts.push(s);
    }
  return parts.join(" ");
}

async function openTranscript(page) {
  const resp = page
    .waitForResponse((r) => r.url().includes("/youtubei/v1/get_transcript") && r.ok(), { timeout: 45000 })
    .catch(() => null);
  await page.locator("ytd-watch-metadata, #below").first().waitFor({ timeout: 30000 }).catch(() => {});
  // The button sits at the bottom of the description, which may need expanding first.
  const expand = page.locator("ytd-watch-metadata #description-inline-expander #expand, tp-yt-paper-button#expand, #description #expand").first();
  await expand.waitFor({ state: "visible", timeout: 15000 }).then(() => expand.click()).catch(() => {});
  let btn = page.getByRole("button", { name: /show transcript/i }).first();
  if (!(await btn.waitFor({ state: "visible", timeout: 10000 }).then(() => true, () => false))) {
    // Older layout: "..." menu under the video -> "Show transcript".
    await page.locator("ytd-watch-metadata #button-shape button[aria-label*='More actions' i], ytd-menu-renderer yt-button-shape button[aria-label*='More actions' i]").first().click({ timeout: 10000 });
    btn = page.getByRole("option", { name: /show transcript/i }).or(page.getByText(/^show transcript$/i)).first();
  }
  await btn.scrollIntoViewIfNeeded().catch(() => {});
  await btn.click({ timeout: 15000 });

  const r = await resp;
  let text = r ? textFromTranscriptJson(await r.json().catch(() => ({}))) : "";
  if (!text.trim()) {
    // Fall back to the rendered panel if the response shape changes.
    const seg = page.locator("ytd-transcript-segment-renderer .segment-text, transcript-segment-view-model .yt-core-attributed-string");
    await seg.first().waitFor({ timeout: 20000 });
    await sleep(1500);
    text = (await seg.allInnerTexts()).join(" ");
  }
  const lang = await page.locator("ytd-transcript-footer-renderer yt-dropdown-menu, ytd-transcript-footer-renderer").first().innerText({ timeout: 3000 }).catch(() => "");
  return { text: text.replace(/\s+/g, " ").trim(), panel_language: lang.trim().split("\n")[0] || null };
}

(async () => {
  fs.mkdirSync(path.join(outDir, "transcripts"), { recursive: true });
  fs.mkdirSync(path.join(outDir, "debug"), { recursive: true });
  const cands = JSON.parse(fs.readFileSync(candFile));
  const pages = read("pages.json", {});
  const chosen = read("videos.json", []);
  const perChannel = {};
  for (const m of chosen) perChannel[m.channel] = (perChannel[m.channel] || 0) + 1;
  console.log(`Looking for the ${TOP} most-viewed videos uploaded since ${cutoff} (${cands.length} candidates).\n`);

  const launchOpts = {
    headless: !HEADED,
    proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: "localhost,127.0.0.1" } : undefined,
  };
  let browser;
  try {
    browser = await chromium.launch({ ...launchOpts, channel: CHANNEL });
  } catch (err) {
    if (!CHANNEL) throw err;
    console.log(`Couldn't start ${CHANNEL}; using Playwright's own Chromium instead.`);
    browser = await chromium.launch(launchOpts);
  }
  const ctx = await browser.newContext({ locale: "en-US", viewport: { width: 1366, height: 900 } });
  // No need to stream video or images to read a transcript.
  await ctx.route("**/*", (r) => (["media", "image", "font"].includes(r.request().resourceType()) ? r.abort() : r.continue()));

  let loaded = 0, failedInARow = 0, stopped = false;
  for (const c of cands) {
    if (chosen.length >= TOP || loaded >= LIMIT) break;
    if (chosen.some((m) => m.id === c.id)) continue;
    let m = pages[c.id];
    if (m && !m.error && !m.qualifies) continue; // already known not to qualify
    const page = await ctx.newPage();
    let fetched = false;
    try {
      loaded++;
      await page.goto(`${BASE}/watch?v=${c.id}&hl=en`, { waitUntil: "domcontentloaded", timeout: 60000 });
      await passConsent(page);
      if (/google\.com\/sorry/.test(page.url())) {
        console.log("STOP: YouTube is showing its 'unusual traffic' page. Wait a few hours and run the same command again.");
        stopped = true;
        break;
      }
      await page.waitForFunction(() => window.ytInitialPlayerResponse, null, { timeout: 30000 });
      const pr = await page.evaluate(() => window.ytInitialPlayerResponse);
      m = metaFrom(pr, c.id);
      const channelFull = (perChannel[m.channel] || 0) >= PER_CHANNEL;
      m.qualifies = m.upload_date >= cutoff && m.english && !m.was_live && m.duration >= 180;
      m.reason = !m.qualifies
        ? (m.upload_date < cutoff ? "older than the window" : !m.english ? `not English (${m.spoken_language})` : m.was_live ? "livestream" : "too short")
        : channelFull ? `already have ${PER_CHANNEL} from this channel` : "";
      if (m.qualifies && !channelFull) {
        fetched = true;
        const { text, panel_language } = await openTranscript(page);
        if (text.split(" ").length < 100) throw new Error(`transcript too short (${text.length} chars)`);
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
        failedInARow = 0;
        console.log(`  got ${n}/${TOP}: ${m.channel}: ${m.title}  (${m.transcript_words} words)`);
      } else {
        console.log(`  skipped (${m.reason}): ${m.title}`);
      }
    } catch (err) {
      m = { ...(m || { id: c.id, title: c.title }), error: String(err).slice(0, 300) };
      console.log(`  problem with ${c.id}: ${m.error.split("\n")[0]}`);
      await page.screenshot({ path: path.join(outDir, "debug", `${c.id}.png`) }).catch(() => {});
      // A redirect to google.com/sorry surfaces as a failed tunnel when that host is not reachable.
      if (/ERR_TUNNEL_CONNECTION_FAILED|ERR_PROXY_CONNECTION_FAILED/.test(m.error)) {
        console.log("STOP: YouTube is redirecting to its 'unusual traffic' page. Wait a few hours and run it again.");
        stopped = true;
      } else if (fetched && ++failedInARow >= 3 && !chosen.length) {
        console.log("STOP: the transcript panel wasn't found on 3 videos in a row. Please send Claude the 'out' folder as it is.");
        stopped = true;
      }
    } finally {
      pages[c.id] = m;
      write("pages.json", pages);
      await page.close().catch(() => {});
    }
    if (stopped) break;
    await sleep(fetched ? PAUSE : 5000);
  }
  await browser.close();
  console.log(`\n${chosen.length} transcripts saved in ${path.resolve(outDir, "transcripts")}`);
  if (!stopped && chosen.length >= TOP) console.log("Done! Zip the 'out' folder and send it to Claude.");
  else if (!stopped) console.log("Finished the list. Zip the 'out' folder and send it to Claude.");
  process.exitCode = stopped ? 3 : 0;
})();
