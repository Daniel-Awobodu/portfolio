#!/usr/bin/env python3
"""Find the most-viewed FPL videos from the last N months and export their transcripts.

Needs network access to www.youtube.com.
Usage: python3 scripts/fetch_fpl_transcripts.py OUT_DIR [--top 20] [--months 6] [--per-channel 3] [--exclude ID ...]

Videos are ranked by view count, capped per channel so the consensus spans several creators.
Use --exclude for videos that match the search but are not classic FPL (e.g. FPL Draft leagues).
"""
import argparse
import datetime as dt
import json
import pathlib
import re
import sys
import time
import urllib.error
import urllib.parse

import yt_dlp

QUERIES = [
    "FPL tips",
    "FPL strategy",
    "Fantasy Premier League tips",
    "FPL team selection",
    "FPL best team",
    "FPL wildcard",
    "FPL chip strategy",
    "FPL draft 2026/27",
    "how to win at FPL",
    "FPL transfers",
    "FPL captain",
    "FPL beginner guide",
    "FPL template",
    "FPL differentials",
]
# YouTube search filter: sort by view count, upload date "this year", type video.
SEARCH_FILTER = "CAMSBAgFEAE="
FPL_RE = re.compile(r"\bFPL\b|fantasy premier league", re.I)
LIVE_RE = re.compile(r"deadline stream|live ?stream|\bstream\b", re.I)
PER_QUERY = 50
PAUSE = 6  # seconds between videos, to stay under YouTube's rate limit

# The default web client is bot-checked from this server; the mobile-web one is not.
BASE_OPTS = {
    "quiet": True,
    "no_warnings": True,
    "skip_download": True,
    "ignore_no_formats_error": True,
    "extractor_args": {"youtube": {"player_client": ["mweb"]}},
}


def search(query):
    url = "https://www.youtube.com/results?" + urllib.parse.urlencode(
        {"search_query": query, "sp": SEARCH_FILTER}
    )
    opts = {"quiet": True, "extract_flat": True, "skip_download": True, "playlistend": PER_QUERY}
    with yt_dlp.YoutubeDL(opts) as ydl:
        res = ydl.extract_info(url, download=False)
    return [e for e in res.get("entries", []) if e.get("id")]


def channel_name(name):
    # Collab videos list the channel as "FPL Harry and 2 more" in search results.
    return re.sub(r" and \d+ more$", "", name or "")


def pick_track(info):
    """Prefer human captions, then the original-language auto captions."""
    manual = info.get("subtitles") or {}
    auto = info.get("automatic_captions") or {}
    for source, langs in ((manual, ["en", "en-GB", "en-US"]), (auto, ["en-orig", "en"])):
        for lang in langs:
            for fmt in source.get(lang, []):
                if fmt.get("ext") == "json3":
                    return fmt["url"], ("manual" if source is manual else "auto") + f":{lang}"
    return None, None


def json3_to_text(raw):
    events = json.loads(raw).get("events", [])
    words = ["".join(seg.get("utf8", "") for seg in ev.get("segs", [])) for ev in events]
    return re.sub(r"\s+", " ", " ".join(words)).strip()


TRANSIENT = ("429", "Connection reset", "timed out", "Unable to connect", "not a bot")


def with_backoff(fn, tries=4):
    for i in range(tries):
        try:
            return fn()
        except Exception as e:
            if not any(t in str(e) for t in TRANSIENT) or i == tries - 1:
                raise
            wait = 30 * 2**i
            print(f"  transient error ({str(e)[:60]}); waiting {wait}s", file=sys.stderr)
            time.sleep(wait)


def fetch_video(ydl, video_id):
    info = with_backoff(
        lambda: ydl.extract_info(f"https://www.youtube.com/watch?v={video_id}", download=False)
    )
    meta = {
        "id": video_id,
        "url": f"https://www.youtube.com/watch?v={video_id}",
        "title": info.get("title", ""),
        "channel": info.get("channel") or info.get("uploader", ""),
        "upload_date": info.get("upload_date", ""),
        "view_count": info.get("view_count") or 0,
        "duration": info.get("duration") or 0,
        "was_live": bool(info.get("was_live")),
    }
    return meta, info


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("out_dir")
    ap.add_argument("--top", type=int, default=20)
    ap.add_argument("--months", type=int, default=6)
    ap.add_argument("--per-channel", type=int, default=3)
    ap.add_argument("--exclude", nargs="*", default=[], help="video IDs to leave out")
    args = ap.parse_args()

    out = pathlib.Path(args.out_dir)
    (out / "transcripts").mkdir(parents=True, exist_ok=True)
    cutoff = (dt.date.today() - dt.timedelta(days=round(args.months * 30.44))).strftime("%Y%m%d")

    flat = {}
    for q in QUERIES:
        try:
            for e in search(q):
                flat.setdefault(e["id"], e)
        except Exception as e:
            print(f"search failed for {q!r}: {e}", file=sys.stderr)
        time.sleep(2)
    print(f"{len(flat)} unique search results", file=sys.stderr)

    # Cheap prefilter on search-result fields: FPL title, not a Short, not a livestream.
    pre = [
        e for e in flat.values()
        if FPL_RE.search(e.get("title") or "")
        and not LIVE_RE.search(e.get("title") or "")
        and 180 <= (e.get("duration") or 0) <= 2 * 3600
    ]
    pre.sort(key=lambda e: e.get("view_count") or 0, reverse=True)
    (out / "search_results.json").write_text(json.dumps(
        [{k: e.get(k) for k in ("id", "title", "channel", "view_count", "duration")} for e in pre],
        indent=2,
    ))
    print(f"{len(pre)} after title/duration prefilter (cutoff {cutoff})", file=sys.stderr)

    chosen, skipped, per_channel = [], [], {}
    with yt_dlp.YoutubeDL(BASE_OPTS) as ydl:
        for e in pre:
            if len(chosen) == args.top:
                break
            if e["id"] in args.exclude:
                skipped.append({"id": e["id"], "title": e.get("title"), "reason": "excluded"})
                continue
            if per_channel.get(channel_name(e.get("channel")), 0) >= args.per_channel:
                continue
            try:
                meta, info = fetch_video(ydl, e["id"])
            except Exception as err:
                skipped.append({"id": e["id"], "title": e.get("title"), "reason": f"metadata: {err}"[:300]})
                time.sleep(PAUSE)
                continue
            if meta["upload_date"] < cutoff or meta["was_live"]:
                skipped.append({**meta, "reason": "too old" if meta["upload_date"] < cutoff else "livestream"})
                time.sleep(PAUSE)
                continue
            channel = channel_name(meta["channel"])
            if per_channel.get(channel, 0) >= args.per_channel:
                continue
            url, track = pick_track(info)
            if not url:
                # Throttled responses sometimes omit captions; ask once more before giving up.
                time.sleep(PAUSE * 5)
                try:
                    meta, info = fetch_video(ydl, e["id"])
                    url, track = pick_track(info)
                except Exception:
                    pass
            if not url:
                skipped.append({**meta, "reason": "no English captions"})
                time.sleep(PAUSE)
                continue
            try:
                text = json3_to_text(with_backoff(lambda: ydl.urlopen(url).read()))
            except Exception as err:
                skipped.append({**meta, "reason": f"captions: {err}"[:300]})
                time.sleep(PAUSE)
                continue
            meta["caption_track"] = track
            meta["transcript_words"] = len(text.split())
            (out / "transcripts" / f"{len(chosen) + 1:02d}_{meta['id']}.txt").write_text(
                f"# {meta['title']}\n# {meta['channel']} | uploaded {meta['upload_date']} | "
                f"{meta['view_count']:,} views | {meta['duration'] // 60} min | captions {track}\n"
                f"# {meta['url']}\n\n{text}\n"
            )
            chosen.append(meta)
            per_channel[channel] = per_channel.get(channel, 0) + 1
            print(f"{len(chosen):2d}. {meta['view_count']:>9,}  {meta['upload_date']}  "
                  f"{meta['channel']}: {meta['title']}", flush=True)
            time.sleep(PAUSE)

    (out / "videos.json").write_text(json.dumps(chosen, indent=2, ensure_ascii=False))
    (out / "skipped.json").write_text(json.dumps(skipped, indent=2, ensure_ascii=False))
    print(f"\nSaved {len(chosen)} transcripts to {out} ({len(skipped)} skipped)")


if __name__ == "__main__":
    main()
