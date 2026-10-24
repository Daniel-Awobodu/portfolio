#!/usr/bin/env python3
"""Find the most-viewed CV / resume-writing videos from the last N months and export their transcripts.

Needs network access to www.youtube.com and `pip install yt-dlp`.

Two stages, so the off-topic videos can be reviewed by hand in between:

  # 1. search + metadata for every candidate (cached in OUT_DIR/meta_cache.json)
  python3 scripts/fetch_cv_transcripts.py candidates OUT_DIR [--months 6] [--max-meta 250]

  # 2. read OUT_DIR/candidates.json, then download captions for the top N
  python3 scripts/fetch_cv_transcripts.py transcripts OUT_DIR [--top 20] [--per-channel 2] [--exclude ID ...]

Stage 1 keeps English-language videos (by audio language or an `en-orig` caption track)
that mention resume / CV in the title, run 3 min - 2 h, are not livestreams and were uploaded
inside the window. Stage 2 ranks those by views, applies the per-channel cap and the manual
exclusions (videos that match the search but don't teach CV writing), and saves transcripts.
"""
import argparse
import datetime as dt
import json
import pathlib
import re
import sys
import time
import urllib.parse

import yt_dlp

QUERIES = [
    "how to write a resume",
    "how to write a CV",
    "resume tips",
    "resume tips 2026",
    "CV tips",
    "CV writing tips",
    "how to write a CV 2026",
    "how to make a resume",
    "resume writing",
    "resume mistakes",
    "CV mistakes",
    "ATS resume",
    "ATS friendly resume",
    "best resume format",
    "resume format 2026",
    "resume examples",
    "resume template",
    "perfect resume",
    "resume advice recruiter",
    "resume review",
    "resume bullet points",
    "resume summary",
    "resume with no experience",
    "tailor your resume",
    "resume that gets interviews",
    "how to write a resume that stands out",
]
# YouTube search filter: sort by view count, upload date "this year", type video.
SEARCH_FILTER = "CAMSBAgFEAE="
PER_QUERY = 60
TOPIC_RE = re.compile(r"r[eé]sum[eé]s?\b|\bCVs?\b|curriculum vitae", re.I)
LIVE_RE = re.compile(r"\blive ?stream|\blive\b.*\bQ ?& ?A\b", re.I)
# Titles that are plainly in another language; the real language check happens on metadata.
NON_EN_RE = re.compile(
    r"[ऀ-෿ঀ-৿؀-ۿ฀-๿぀-ヿ一-鿿가-힯]"
    r"|\b(kaise|banaye|banane|hindi|tamil|telugu|marathi|bangla|bengali|malayalam|kannada|urdu|"
    r"curr[ií]culo|lebenslauf|currículum)\b",
    re.I,
)
PAUSE = 5  # seconds between metadata calls, to stay under YouTube's rate limit

# The default web client is sometimes bot-checked from servers; the mobile-web one is not.
BASE_OPTS = {
    "quiet": True,
    "no_warnings": True,
    "skip_download": True,
    "ignore_no_formats_error": True,
    "extractor_args": {"youtube": {"player_client": ["mweb"]}},
}
TRANSIENT = ("429", "Connection reset", "timed out", "Unable to connect", "not a bot", "Read timed out")


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


def search(query):
    url = "https://www.youtube.com/results?" + urllib.parse.urlencode(
        {"search_query": query, "sp": SEARCH_FILTER}
    )
    opts = {"quiet": True, "extract_flat": True, "skip_download": True, "playlistend": PER_QUERY}
    with yt_dlp.YoutubeDL(opts) as ydl:
        res = with_backoff(lambda: ydl.extract_info(url, download=False))
    return [e for e in res.get("entries", []) if e.get("id")]


def channel_name(name):
    # Collab videos list the channel as "X and 2 more" in search results.
    return re.sub(r" and \d+ more$", "", name or "")


def is_english(info):
    lang = (info.get("language") or "").lower()
    if lang:
        return lang.startswith("en")
    auto = info.get("automatic_captions") or {}
    if any(k.endswith("-orig") for k in auto):
        return "en-orig" in auto
    return any(k.startswith("en") for k in (info.get("subtitles") or {}))


def pick_track(info):
    """Prefer human captions, then the original-language auto captions."""
    manual = info.get("subtitles") or {}
    auto = info.get("automatic_captions") or {}
    for source, langs in ((manual, ["en", "en-GB", "en-US", "en-CA", "en-AU"]), (auto, ["en-orig", "en"])):
        for lang in langs:
            for fmt in source.get(lang, []):
                if fmt.get("ext") == "json3":
                    return fmt["url"], ("manual" if source is manual else "auto") + f":{lang}"
    return None, None


def json3_to_text(raw):
    events = json.loads(raw).get("events", [])
    words = ["".join(seg.get("utf8", "") for seg in ev.get("segs", [])) for ev in events]
    return re.sub(r"\s+", " ", " ".join(words)).strip()


def video_meta(info, video_id):
    return {
        "id": video_id,
        "url": f"https://www.youtube.com/watch?v={video_id}",
        "title": info.get("title", ""),
        "channel": info.get("channel") or info.get("uploader", ""),
        "upload_date": info.get("upload_date", ""),
        "view_count": info.get("view_count") or 0,
        "duration": info.get("duration") or 0,
        "was_live": bool(info.get("was_live")) or info.get("live_status") in ("is_live", "was_live"),
        "language": info.get("language"),
        "english": is_english(info),
        "has_captions": pick_track(info)[0] is not None,
        "description": (info.get("description") or "")[:400],
    }


def cmd_candidates(args):
    out = pathlib.Path(args.out_dir)
    out.mkdir(parents=True, exist_ok=True)
    cutoff = (dt.date.today() - dt.timedelta(days=round(args.months * 30.44))).strftime("%Y%m%d")

    flat_path = out / "search_results.json"
    if flat_path.exists() and not args.refresh_search:
        flat = {e["id"]: e for e in json.loads(flat_path.read_text())}
    else:
        flat = {}
        for q in QUERIES:
            try:
                for e in search(q):
                    flat.setdefault(e["id"], {k: e.get(k) for k in ("id", "title", "channel", "view_count", "duration")})
            except Exception as err:
                print(f"search failed for {q!r}: {err}", file=sys.stderr)
            time.sleep(2)
        flat_path.write_text(json.dumps(list(flat.values()), indent=2, ensure_ascii=False))
    print(f"{len(flat)} unique search results", file=sys.stderr)

    pre = [
        e for e in flat.values()
        if TOPIC_RE.search(e.get("title") or "")
        and not NON_EN_RE.search(e.get("title") or "")
        and not LIVE_RE.search(e.get("title") or "")
        and 180 <= (e.get("duration") or 0) <= 2 * 3600
    ]
    pre.sort(key=lambda e: e.get("view_count") or 0, reverse=True)
    print(f"{len(pre)} after title/duration prefilter; checking up to {args.max_meta} (cutoff {cutoff})",
          file=sys.stderr)

    cache_path = out / "meta_cache.json"
    cache = json.loads(cache_path.read_text()) if cache_path.exists() else {}
    with yt_dlp.YoutubeDL(BASE_OPTS) as ydl:
        for i, e in enumerate(pre[: args.max_meta]):
            if e["id"] in cache:
                continue
            try:
                info = with_backoff(lambda: ydl.extract_info(e["url"] if "url" in e else
                                                             f"https://www.youtube.com/watch?v={e['id']}",
                                                             download=False))
                cache[e["id"]] = video_meta(info, e["id"])
            except Exception as err:
                cache[e["id"]] = {"id": e["id"], "title": e.get("title"), "error": str(err)[:300]}
            m = cache[e["id"]]
            print(f"[{i + 1}/{min(len(pre), args.max_meta)}] {m.get('upload_date', '?')} "
                  f"{'EN' if m.get('english') else '--'} {m.get('view_count', 0):>9,} "
                  f"{m.get('channel', '')}: {m.get('title', '')}", file=sys.stderr, flush=True)
            cache_path.write_text(json.dumps(cache, indent=2, ensure_ascii=False))
            time.sleep(PAUSE)

    cands = [
        m for m in cache.values()
        if "error" not in m and m["upload_date"] >= cutoff and m["english"] and not m["was_live"]
    ]
    cands.sort(key=lambda m: m["view_count"], reverse=True)
    (out / "candidates.json").write_text(json.dumps(cands, indent=2, ensure_ascii=False))
    print(f"\n{len(cands)} English, in-window candidates written to {out / 'candidates.json'}")
    for n, m in enumerate(cands, 1):
        print(f"{n:3d}. {m['id']} {m['view_count']:>9,} {m['upload_date']} {m['duration'] // 60:>3}m "
              f"{'cc' if m['has_captions'] else 'NO-CC'} {m['channel']}: {m['title']}")


def cmd_transcripts(args):
    out = pathlib.Path(args.out_dir)
    (out / "transcripts").mkdir(parents=True, exist_ok=True)
    cands = json.loads((out / "candidates.json").read_text())

    chosen, skipped, per_channel = [], [], {}
    with yt_dlp.YoutubeDL(BASE_OPTS) as ydl:
        for m in cands:
            if len(chosen) == args.top:
                break
            if m["id"] in args.exclude:
                skipped.append({**m, "reason": "excluded (off-topic)"})
                continue
            channel = channel_name(m["channel"])
            if per_channel.get(channel, 0) >= args.per_channel:
                skipped.append({**m, "reason": f"channel cap ({args.per_channel})"})
                continue
            try:
                info = with_backoff(lambda: ydl.extract_info(m["url"], download=False))
                url, track = pick_track(info)
                if not url:
                    # Throttled responses sometimes omit captions; ask once more before giving up.
                    time.sleep(PAUSE * 5)
                    info = with_backoff(lambda: ydl.extract_info(m["url"], download=False))
                    url, track = pick_track(info)
                if not url:
                    skipped.append({**m, "reason": "no English captions"})
                    continue
                text = json3_to_text(with_backoff(lambda: ydl.urlopen(url).read()))
            except Exception as err:
                skipped.append({**m, "reason": f"captions: {err}"[:300]})
                time.sleep(PAUSE)
                continue
            meta = {k: v for k, v in m.items() if k != "description"}
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
                  f"{meta['channel']}: {meta['title']}  ({meta['transcript_words']:,} words)", flush=True)
            time.sleep(PAUSE)

    (out / "videos.json").write_text(json.dumps(chosen, indent=2, ensure_ascii=False))
    (out / "skipped.json").write_text(json.dumps(skipped, indent=2, ensure_ascii=False))
    print(f"\nSaved {len(chosen)} transcripts to {out / 'transcripts'} ({len(skipped)} skipped)")


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    c = sub.add_parser("candidates")
    c.add_argument("out_dir")
    c.add_argument("--months", type=int, default=6)
    c.add_argument("--max-meta", type=int, default=250, help="metadata lookups, in view order")
    c.add_argument("--refresh-search", action="store_true")
    t = sub.add_parser("transcripts")
    t.add_argument("out_dir")
    t.add_argument("--top", type=int, default=20)
    t.add_argument("--per-channel", type=int, default=2)
    t.add_argument("--exclude", nargs="*", default=[], help="video IDs to leave out")
    args = ap.parse_args()
    {"candidates": cmd_candidates, "transcripts": cmd_transcripts}[args.cmd](args)


if __name__ == "__main__":
    main()
