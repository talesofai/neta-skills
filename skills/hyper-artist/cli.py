#!/usr/bin/env python3
"""
Hyper Artist — open art search and moodboard compositor.

The language model owns query understanding, intent detection, query expansion,
result selection, and semantic ordering. This CLI intentionally stays a thin
adapter around open art providers plus image downloading/cropping/compositing.

Examples:
  hyper-artist search "Claude Monet water lilies" --provider cleveland --limit 9 --format json
  hyper-artist batch --query "Claude Monet water lilies" \
    --query "French Impressionist garden" \
    --query "post-impressionist pond flowers" --limit 30 --format json
  hyper-artist moodboard "Claude Monet water lilies" --aspect 1:1
  hyper-artist assemble --input selected.json --aspect 16:9 --format json

Dependencies: Python 3.9+ and Pillow.
"""

import argparse
import hashlib
import io
import json
import os
import random
import re
import sys
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor

try:
    from PIL import Image, ImageStat
except ImportError:
    Image = None
    ImageStat = None


MET_API = "https://collectionapi.metmuseum.org/public/collection/v1"
ARTIC_API = "https://api.artic.edu/api/v1"
CLEVELAND_API = "https://openaccess-api.clevelandart.org/api/artworks"
EUROPEANA_API = "https://api.europeana.eu/record/v2/search.json"
OPENVERSE_API = "https://api.openverse.org/v1/images/"
USER_AGENT = "Mozilla/5.0 (compatible; hyper-artist/3.0)"
TIMEOUT = 25
IMAGE_TIMEOUT = 20
OUTPUT_DIR = os.environ.get("HYPER_ARTIST_OUTPUT", "/workspace/outputs/hyper-artist")
MEDIA_FETCH_PROXY_URL = os.environ.get("MEDIA_FETCH_PROXY_URL", "").rstrip("/")
OPENVERSE_API_KEY = os.environ.get("OPENVERSE_API_KEY", "")
EUROPEANA_API_KEY = os.environ.get("EUROPEANA_API_KEY", "apidemo")
ARTIC_IIIF = "https://www.artic.edu/iiif/2"


def _fetch_json(url, timeout=TIMEOUT):
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return json.loads(response.read())


def _fetch_bytes(url, referer=""):
    """Download bytes directly, then retry through Media Fetcher proxy.

    The proxy uses a different egress path and supplies upstream Referer/UA
    headers. It cannot bypass an origin that blocks both egress locations, so
    callers still need candidate-level fallback.
    """
    direct_error = None
    try:
        headers = {"User-Agent": USER_AGENT}
        if referer:
            headers["Referer"] = referer
        request = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(request, timeout=IMAGE_TIMEOUT) as response:
            return response.read()
    except Exception as exc:
        direct_error = exc

    if not MEDIA_FETCH_PROXY_URL:
        raise direct_error

    params = urllib.parse.urlencode({
        "url": url,
        "referer": referer,
        "ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
              "AppleWebKit/537.36 Chrome/138.0 Safari/537.36",
    })
    proxy_url = f"{MEDIA_FETCH_PROXY_URL}/proxy?{params}"
    request = urllib.request.Request(proxy_url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=IMAGE_TIMEOUT + 10) as response:
        return response.read()


def _artwork(provider, object_id, title, artist, date, culture, medium,
             classification, image, thumbnail, url, license_name, credit,
             **extra):
    result = {
        "id": f"{provider}-{object_id}",
        "title": (title or "").strip(),
        "artist": artist or "Unknown",
        "date": date or "",
        "culture": culture or "",
        "medium": medium or "",
        "classification": classification or "",
        "image": image or "",
        "thumbnail": thumbnail or image or "",
        "url": url or "",
        "provider": provider,
        "license": license_name or "",
        "credit": credit or "",
    }
    result.update(extra)
    return result


# ---------------------------------------------------------------------------
# Providers
# ---------------------------------------------------------------------------

def search_met(query, limit=10, offset=0):
    """The Met: global collection, ancient to modern, public-domain images."""
    try:
        params = urllib.parse.urlencode({
            "q": query,
            "hasImages": "true",
            "isPublicDomain": "true",
        })
        data = _fetch_json(f"{MET_API}/search?{params}")
        object_ids = (data.get("objectIDs") or [])[offset:offset + max(limit * 2, limit)]

        def fetch_object(object_id):
            try:
                return _fetch_json(f"{MET_API}/objects/{object_id}")
            except Exception:
                return None

        with ThreadPoolExecutor(max_workers=6) as pool:
            objects = list(pool.map(fetch_object, object_ids))

        results = []
        for obj in objects:
            if not obj:
                continue
            image = obj.get("primaryImage") or ""
            if not image and obj.get("additionalImages"):
                image = obj["additionalImages"][0]
            if not image:
                continue
            tags = [tag.get("term", "") for tag in (obj.get("tags") or [])]
            results.append(_artwork(
                "met", obj.get("objectID"), obj.get("title"),
                obj.get("artistDisplayName"), obj.get("objectDate"),
                obj.get("culture"), obj.get("medium"), obj.get("classification"),
                image, obj.get("primaryImageSmall") or image,
                obj.get("objectURL"), "CC0 / Public Domain",
                obj.get("creditLine"),
                artist_bio=obj.get("artistDisplayBio", ""),
                department=obj.get("department", ""), tags=tags[:8],
            ))
            if len(results) >= limit:
                break
        return results
    except Exception as exc:
        print(f"[hyper-artist] Met search failed: {exc}", file=sys.stderr)
        return []


def search_artic(query, limit=10, offset=0):
    """Art Institute of Chicago: fast API with IIIF images and style metadata."""
    try:
        fields = [
            "id", "title", "image_id", "artist_display", "date_display",
            "medium_display", "place_of_origin", "style_title",
            "classification_titles", "dimensions",
        ]
        params = urllib.parse.urlencode({
            "q": query,
            "limit": min(limit + offset + 10, 100),
            "fields": ",".join(fields),
        })
        data = _fetch_json(f"{ARTIC_API}/artworks/search?{params}")
        results = []
        for item in (data.get("data") or [])[offset:]:
            image_id = item.get("image_id")
            if not image_id:
                continue
            classifications = item.get("classification_titles") or []
            style = item.get("style_title") or ""
            results.append(_artwork(
                "artic", item.get("id"), item.get("title"),
                item.get("artist_display"), item.get("date_display"),
                item.get("place_of_origin"), item.get("medium_display"),
                classifications[0] if classifications else "",
                f"{ARTIC_IIIF}/{image_id}/full/843,/0/default.jpg",
                f"{ARTIC_IIIF}/{image_id}/full/200,/0/default.jpg",
                f"https://www.artic.edu/artworks/{item.get('id')}",
                "CC0 / Public Domain", "The Art Institute of Chicago",
                style=style, dimensions=item.get("dimensions", ""),
                tags=[style] if style else [],
            ))
            if len(results) >= limit:
                break
        return results
    except Exception as exc:
        print(f"[hyper-artist] Art Institute search failed: {exc}", file=sys.stderr)
        return []


def search_cleveland(query, limit=10, offset=0):
    """Cleveland Museum of Art: global collection with CC0 filtering."""
    try:
        params = urllib.parse.urlencode({
            "q": query,
            "limit": min(limit + offset + 10, 100),
            "skip": offset,
            "has_image": "1",
            "cc0": "1",
        })
        data = _fetch_json(f"{CLEVELAND_API}/?{params}")
        results = []
        for item in data.get("data") or []:
            images = item.get("images") or {}
            web = images.get("web") or {}
            print_image = images.get("print") or {}
            image = print_image.get("url") or web.get("url")
            if not image:
                continue
            creators = item.get("creators") or []
            artist = creators[0].get("description", "Unknown") if creators else "Unknown"
            cultures = item.get("culture") or []
            results.append(_artwork(
                "cleveland", item.get("id"), item.get("title"), artist,
                item.get("creation_date") or item.get("creation_date_earliest"),
                cultures[0] if cultures else "", item.get("technique"),
                item.get("type"), image, web.get("url"), item.get("url"),
                "CC0 / Public Domain", "Cleveland Museum of Art",
                department=item.get("department", ""), tags=cultures[:3],
            ))
            if len(results) >= limit:
                break
        return results
    except Exception as exc:
        print(f"[hyper-artist] Cleveland search failed: {exc}", file=sys.stderr)
        return []


def search_openverse(query, limit=10, offset=0):
    """Openverse: broad CC/public-domain image index, supplemental for contemporary work."""
    try:
        page_size = min(max(limit + offset, 20), 50)
        page = offset // page_size + 1
        params = urllib.parse.urlencode({
            "q": query,
            "license": "cc0,pdm,by,by-sa",
            "page_size": page_size,
            "page": page,
        })
        if not OPENVERSE_API_KEY:
            print("[hyper-artist] Openverse skipped: set OPENVERSE_API_KEY to enable it", file=sys.stderr)
            return []
        request = urllib.request.Request(
            f"{OPENVERSE_API}?{params}",
            headers={"User-Agent": USER_AGENT, "Authorization": f"Bearer {OPENVERSE_API_KEY}"},
        )
        with urllib.request.urlopen(request, timeout=TIMEOUT) as response:
            data = json.loads(response.read())
        results = []
        for item in (data.get("results") or [])[offset % page_size:]:
            image = item.get("url") or ""
            if not image:
                continue
            license_code = item.get("license", "").lower()
            license_name = {
                "cc0": "CC0",
                "pdm": "Public Domain Mark",
                "by": "CC BY",
                "by-sa": "CC BY-SA",
            }.get(license_code, license_code.upper())
            results.append(_artwork(
                "openverse", item.get("id"), item.get("title"),
                item.get("creator"), item.get("date"), "", "", "",
                image, item.get("thumbnail") or image,
                item.get("foreign_landing_url") or item.get("source"),
                license_name, item.get("source", "Openverse"),
                source=item.get("source", ""),
                license_url=item.get("license_url", ""),
            ))
            if len(results) >= limit:
                break
        return results
    except Exception as exc:
        print(f"[hyper-artist] Openverse search failed: {exc}", file=sys.stderr)
        return []


def search_europeana(query, limit=10, offset=0):
    """Europeana: aggregated European cultural heritage with PDM/CC licensing."""
    try:
        # Filter for PDM, CC BY, CC BY-SA — the open-licensed subset
        rights_filter = (
            "qf=RIGHTS:http://creativecommons.org/publicdomain/mark/1.0/"
            "&qf=RIGHTS:http://creativecommons.org/licenses/by/4.0/"
            "&qf=RIGHTS:http://creativecommons.org/licenses/by-sa/4.0/"
        )
        page = offset // limit + 1
        params = (
            f"query={urllib.parse.quote(query)}"
            f"&rows={min(limit + offset, 100)}"
            f"&start={page}"
            f"&wskey={EUROPEANA_API_KEY}"
            f"&profile=rich"
            f"&{rights_filter}"
            f"&type=IMAGE"
        )
        data = _fetch_json(f"{EUROPEANA_API}?{params}")
        if not data.get("success"):
            print(f"[hyper-artist] Europeana error: {data.get('error', 'unknown')}", file=sys.stderr)
            return []
        results = []
        for item in (data.get("items") or []):
            title = (item.get("title") or [""])[0]
            if not title:
                continue
            previews = item.get("edmPreview") or []
            image = previews[0] if previews else ""
            if not image:
                continue
            rights = (item.get("rights") or [""])[0]
            license_name = {
                "http://creativecommons.org/publicdomain/mark/1.0/": "Public Domain Mark",
                "http://creativecommons.org/licenses/by/4.0/": "CC BY",
                "http://creativecommons.org/licenses/by-sa/4.0/": "CC BY-SA",
            }.get(rights, rights.split("/")[-1] if rights else "")
            creator = (item.get("dcCreator") or [""])[0] if item.get("dcCreator") else ""
            if creator and creator.startswith("http"):
                creator = ""  # skip URI-only creators
            if creator and creator.startswith("#"):
                creator = ""  # skip internal IDs
            year = (item.get("year") or [""])[0] if item.get("year") else ""
            provider = (item.get("dataProvider") or [""])[0] if item.get("dataProvider") else "Europeana"
            edm_type = (item.get("type") or "")
            country = (item.get("country") or [""])[0] if item.get("country") else ""
            results.append(_artwork(
                "europeana", item.get("id", ""), title,
                creator, year, country, edm_type, "",
                image, image, item.get("guid", "") or item.get("link", ""),
                license_name, provider,
                source=item.get("dataProvider", [""])[0] if item.get("dataProvider") else "",
                license_url=rights,
            ))
            if len(results) >= limit:
                break
        return results
    except Exception as exc:
        print(f"[hyper-artist] Europeana search failed: {exc}", file=sys.stderr)
        return []


PROVIDERS = {
    "met": search_met,
    "artic": search_artic,
    "cleveland": search_cleveland,
    "openverse": search_openverse,
    "europeana": search_europeana,
}


# ---------------------------------------------------------------------------
# Search orchestration. It receives explicit queries; it does not interpret them.
# ---------------------------------------------------------------------------

def _dedupe(artworks):
    seen = set()
    unique = []
    for artwork in artworks:
        key = (artwork.get("provider"), artwork.get("id"))
        if key in seen:
            continue
        seen.add(key)
        unique.append(artwork)
    return unique


def search_queries(queries, providers, limit_per_query=12):
    """Run explicit query strings across explicit providers.

    Results are interleaved by query and provider to preserve source diversity.
    No query expansion, intent detection, or semantic ranking happens here.
    """
    jobs = [(query, provider) for query in queries for provider in providers]

    def run(job):
        query, provider = job
        function = PROVIDERS.get(provider)
        if not function:
            return query, provider, []
        return query, provider, function(query, limit=limit_per_query)

    collected = []
    with ThreadPoolExecutor(max_workers=min(8, max(1, len(jobs)))) as pool:
        responses = list(pool.map(run, jobs))

    grouped = {}
    for query, provider, results in responses:
        for artwork in results:
            artwork["search_query"] = query
            grouped.setdefault((query, provider), []).append(artwork)

    max_len = max((len(items) for items in grouped.values()), default=0)
    for index in range(max_len):
        for query in queries:
            for provider in providers:
                items = grouped.get((query, provider), [])
                if index < len(items):
                    collected.append(items[index])
    return _dedupe(collected)


# ---------------------------------------------------------------------------
# Moodboard compositor
# ---------------------------------------------------------------------------

def _crop_resize(image, width, height):
    current = image.width / image.height
    target = width / height
    if current > target:
        crop_width = int(image.height * target)
        left = (image.width - crop_width) // 2
        image = image.crop((left, 0, left + crop_width, image.height))
    elif current < target:
        crop_height = int(image.width / target)
        top = (image.height - crop_height) // 2
        image = image.crop((0, top, image.width, top + crop_height))
    return image.resize((width, height), Image.Resampling.LANCZOS)


def _hue(image):
    small = image.resize((32, 32), Image.Resampling.LANCZOS).convert("RGB")
    r, g, b = [value / 255 for value in ImageStat.Stat(small).mean[:3]]
    maximum, minimum = max(r, g, b), min(r, g, b)
    if maximum == minimum:
        return 0
    delta = maximum - minimum
    if maximum == r:
        value = (g - b) / delta + (6 if g < b else 0)
    elif maximum == g:
        value = (b - r) / delta + 2
    else:
        value = (r - g) / delta + 4
    return (value * 60) % 360


def _year(date):
    match = re.search(r"(\d{3,4})", str(date or ""))
    return int(match.group(1)) if match else 9999


def _order(items, layout):
    if layout in ("input", "balanced"):
        return items
    if layout == "chronological":
        return sorted(items, key=lambda item: _year(item[1].get("date")))
    if layout == "random":
        result = list(items)
        random.shuffle(result)
        return result
    return sorted(items, key=lambda item: item[1].get("_hue", 0))


def assemble_moodboard(artworks, aspect="1:1", layout="input", cell_size=400, gap=6):
    if Image is None:
        raise RuntimeError("Pillow is required. Install it with: pip install Pillow")

    ratios = {"1:1": (1, 1), "16:9": (16, 9), "9:16": (9, 16)}
    ratio_w, ratio_h = ratios[aspect]
    if ratio_w >= ratio_h:
        cell_h, cell_w = cell_size, int(cell_size * ratio_w / ratio_h)
    else:
        cell_w, cell_h = cell_size, int(cell_size * ratio_h / ratio_w)

    prepared = []
    # Accept a candidate pool larger than nine so inaccessible CDN URLs can be
    # skipped while preserving the order of every successfully fetched image.
    for artwork in artworks:
        if len(prepared) >= 9:
            break
        try:
            data = _fetch_bytes(
                artwork.get("image", ""),
                referer=artwork.get("url", ""),
            )
            image = Image.open(io.BytesIO(data)).convert("RGB")
            image = _crop_resize(image, cell_w, cell_h)
            item = dict(artwork)
            item["_hue"] = _hue(image)
            prepared.append((image, item))
        except Exception as exc:
            print(f"[hyper-artist] image skipped: {artwork.get('image', '')[:100]} ({exc})", file=sys.stderr)

    ordered_items = _order(prepared, layout)
    board_width = 3 * cell_w + 4 * gap
    board_height = 3 * cell_h + 4 * gap
    board = Image.new("RGB", (board_width, board_height), (24, 24, 28))
    selected = []
    for index, (image, artwork) in enumerate(ordered_items[:9]):
        x = gap + (index % 3) * (cell_w + gap)
        y = gap + (index // 3) * (cell_h + gap)
        board.paste(image, (x, y))
        artwork.pop("_hue", None)
        selected.append(artwork)
    return board, selected


def _save_board(board, artworks, query=""):
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    stamp = time.strftime("%Y%m%d_%H%M%S")
    digest = hashlib.md5(query.encode()).hexdigest()[:8] if query else "custom"
    image_path = os.path.join(OUTPUT_DIR, f"moodboard_{digest}_{stamp}.jpg")
    json_path = os.path.splitext(image_path)[0] + ".json"
    board.save(image_path, "JPEG", quality=92)
    with open(json_path, "w", encoding="utf-8") as file:
        json.dump({"moodboard_path": image_path, "artworks": artworks}, file, ensure_ascii=False, indent=2)
    return image_path, json_path


# ---------------------------------------------------------------------------
# CLI commands
# ---------------------------------------------------------------------------

def _queries_from_args(args):
    queries = []
    if getattr(args, "query", None):
        queries.append(args.query)
    queries.extend(getattr(args, "queries", None) or [])
    return [query.strip() for query in queries if query and query.strip()]


def _providers(value):
    return [item.strip() for item in value.split(",") if item.strip()]


def cmd_search(args):
    artworks = PROVIDERS[args.provider](args.query, limit=args.limit, offset=args.offset)
    _emit({"queries": [args.query], "providers": [args.provider], "count": len(artworks), "artworks": artworks}, args.format)


def cmd_batch(args):
    queries = _queries_from_args(args)
    if not queries:
        raise SystemExit("batch requires a query or one or more --query values")
    providers = _providers(args.providers)
    artworks = search_queries(queries, providers, limit_per_query=args.per_query)
    artworks = artworks[args.offset:args.offset + args.limit]
    _emit({"queries": queries, "providers": providers, "offset": args.offset, "count": len(artworks), "artworks": artworks}, args.format)


def cmd_multi(args):
    providers = _providers(args.providers)
    artworks = search_queries([args.query], providers, limit_per_query=args.limit)
    _emit({"queries": [args.query], "providers": providers, "count": len(artworks[:args.limit]), "artworks": artworks[:args.limit]}, args.format)


def cmd_moodboard(args):
    if Image is None:
        raise SystemExit("moodboard requires Pillow: pip install Pillow")
    queries = _queries_from_args(args)
    if not queries:
        raise SystemExit("moodboard requires a query or one or more --query values")
    providers = _providers(args.providers)
    all_artworks = search_queries(queries, providers, limit_per_query=max(args.limit * 3, 18))
    # Pass a candidate pool, not only nine records. The compositor keeps the
    # first nine successfully downloaded images after the requested offset.
    page_items = all_artworks[args.offset:]
    board, selected = assemble_moodboard(page_items, args.aspect, args.layout)
    image_path, json_path = _save_board(board, selected, " | ".join(queries))
    _emit({
        "queries": queries,
        "providers": providers,
        "offset": args.offset,
        "count": len(selected),
        "requested_count": args.limit,
        "aspect": args.aspect,
        "layout": args.layout,
        "moodboard_path": image_path,
        "metadata_path": json_path,
        "artworks": selected,
    }, args.format)


def _load_artworks(path):
    source = sys.stdin if not path else open(path, encoding="utf-8")
    try:
        data = json.load(source)
    finally:
        if path:
            source.close()
    if isinstance(data, dict):
        data = data.get("artworks", [])
    if not isinstance(data, list):
        raise SystemExit("assemble input must be a JSON array or an object with an artworks array")
    return data


def cmd_assemble(args):
    artworks = _load_artworks(args.input)
    board, selected = assemble_moodboard(artworks, args.aspect, args.layout)
    image_path, json_path = _save_board(board, selected)
    _emit({"count": len(selected), "aspect": args.aspect, "layout": args.layout, "moodboard_path": image_path, "metadata_path": json_path, "artworks": selected}, args.format)


def _emit(output, fmt):
    if fmt == "json":
        print(json.dumps(output, ensure_ascii=False, indent=2))
        return
    if output.get("moodboard_path"):
        print(f"Moodboard: {output['moodboard_path']}")
    print(f"{output.get('count', 0)} artworks from {', '.join(output.get('providers', []))}")
    for item in output.get("artworks", []):
        print(f"[{item.get('provider', '')}] {item.get('title', '')} — {item.get('artist', '')}")
        print(f"  image: {item.get('image', '')}")
        print(f"  source: {item.get('url', '')} | license: {item.get('license', '')}")


def main():
    parser = argparse.ArgumentParser(description="Hyper Artist — open art search and moodboard compositor")
    sub = parser.add_subparsers(dest="command")

    p = sub.add_parser("search", help="Search one provider with one literal query")
    p.add_argument("query")
    p.add_argument("--provider", choices=list(PROVIDERS), default="met")
    p.add_argument("--limit", type=int, default=9)
    p.add_argument("--offset", type=int, default=0)
    p.add_argument("--format", choices=["json", "text"], default="text")

    p = sub.add_parser("multi", help="Search one literal query across providers")
    p.add_argument("query")
    p.add_argument("--providers", default="met,cleveland,europeana")
    p.add_argument("--limit", type=int, default=12)
    p.add_argument("--format", choices=["json", "text"], default="text")

    p = sub.add_parser("batch", help="Search multiple literal queries across providers")
    p.add_argument("query", nargs="?")
    p.add_argument("--query", dest="queries", action="append", help="Repeat for each LM-generated search expression")
    p.add_argument("--providers", default="met,cleveland,europeana")
    p.add_argument("--per-query", type=int, default=12)
    p.add_argument("--limit", type=int, default=36)
    p.add_argument("--offset", type=int, default=0)
    p.add_argument("--format", choices=["json", "text"], default="json")

    p = sub.add_parser("moodboard", help="Literal query search followed by a 3×3 board")
    p.add_argument("query", nargs="?")
    p.add_argument("--query", dest="queries", action="append")
    p.add_argument("--providers", default="met,cleveland,europeana")
    p.add_argument("--limit", type=int, default=9)
    p.add_argument("--offset", type=int, default=0)
    p.add_argument("--aspect", choices=["1:1", "16:9", "9:16"], default="1:1")
    p.add_argument("--layout", choices=["input", "balanced", "chronological", "color", "random"], default="input")
    p.add_argument("--format", choices=["json", "text"], default="json")

    p = sub.add_parser("assemble", help="Compose a board from LM-selected artwork JSON")
    p.add_argument("--input", help="JSON file; stdin when omitted")
    p.add_argument("--aspect", choices=["1:1", "16:9", "9:16"], default="1:1")
    p.add_argument("--layout", choices=["input", "balanced", "chronological", "color", "random"], default="input")
    p.add_argument("--format", choices=["json", "text"], default="json")

    for name in PROVIDERS:
        p = sub.add_parser(name, help=f"Search {name} directly")
        p.add_argument("query")
        p.add_argument("--limit", type=int, default=9)
        p.add_argument("--offset", type=int, default=0)
        p.add_argument("--format", choices=["json", "text"], default="text")

    args = parser.parse_args()
    if args.command == "search" or args.command in PROVIDERS:
        if args.command in PROVIDERS:
            args.provider = args.command
        cmd_search(args)
    elif args.command == "multi":
        cmd_multi(args)
    elif args.command == "batch":
        cmd_batch(args)
    elif args.command == "moodboard":
        cmd_moodboard(args)
    elif args.command == "assemble":
        cmd_assemble(args)
    else:
        parser.print_help()
        raise SystemExit(1)


if __name__ == "__main__":
    main()
