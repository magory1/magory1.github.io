"""
Sync the site with the YouTube channel.

Reads the course playlists from data.js, fetches every playlist and the newest
uploads of the channel with yt-dlp (no API key needed) and writes youtube.js.
The site (app.js) adds every video found in a course playlist that is not yet
listed in data.js, and shows the newest uploads on the home page.

data.js stays the hand-edited source: titles, units and topics written there
always win. A GitHub Action runs this script every few hours
(.github/workflows/youtube-sync.yml). Run it by hand with:
    pip install yt-dlp
    python tools/sync_youtube.py
"""
import datetime as dt
import json
import pathlib
import re
import sys

import yt_dlp

ROOT = pathlib.Path(__file__).resolve().parent.parent
CHANNEL = "https://www.youtube.com/@JCT_1/videos"
LATEST = 12                                             # newest uploads kept for the home page
SKIP = re.compile(r"^(Recording #\d+|Untitled|Test)\b", re.I)   # raw recordings, not lessons


def dur(sec):
    if not sec:
        return ""
    sec = int(sec)
    h, m, s = sec // 3600, sec % 3600 // 60, sec % 60
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m}:{s:02d}"


def entries(url, limit=None):
    opts = {"extract_flat": "in_playlist", "quiet": True, "skip_download": True, "ignoreerrors": True}
    if limit:
        opts["playlistend"] = limit
    with yt_dlp.YoutubeDL(opts) as y:
        info = y.extract_info(url, download=False) or {}
    out = []
    for e in info.get("entries") or []:
        if not e or not e.get("id") or SKIP.match(e.get("title") or ""):
            continue
        if (e.get("title") or "").startswith("[Private") or (e.get("title") or "").startswith("[Deleted"):
            continue
        out.append({"id": e["id"], "title": e.get("title", ""), "dur": dur(e.get("duration"))})
    return out


def main():
    data = (ROOT / "data.js").read_text(encoding="utf-8")
    playlists = sorted(set(re.findall(r'playlist:\s*"([\w-]+)"', data)))
    result = {"updated": dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%MZ"), "playlists": {}, "latest": []}
    ok = 0
    for pl in playlists:
        vids = entries(f"https://www.youtube.com/playlist?list={pl}")
        if vids:
            result["playlists"][pl] = vids
            ok += 1
        print(f"playlist {pl}: {len(vids)} videos")
    result["latest"] = entries(CHANNEL, LATEST + 5)[:LATEST]
    print(f"channel: {len(result['latest'])} newest uploads")
    if not ok and not result["latest"]:
        sys.exit("YouTube returned nothing – keeping the previous youtube.js")

    out = ROOT / "youtube.js"
    if out.exists():
        try:
            prev = json.loads(out.read_text(encoding="utf-8").split("=", 1)[1].rstrip().rstrip(";"))
            prev.pop("updated", None)
            if prev == {k: v for k, v in result.items() if k != "updated"}:
                print("no change")
                return
        except (IndexError, ValueError):
            pass
    out.write_text(
        "/* נוצר אוטומטית מ-YouTube על ידי tools/sync_youtube.py – לא לערוך ידנית. */\n"
        f"window.YT_SYNC = {json.dumps(result, ensure_ascii=False, indent=1)};\n",
        encoding="utf-8")
    print("youtube.js updated")


if __name__ == "__main__":
    main()
