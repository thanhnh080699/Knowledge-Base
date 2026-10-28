#!/usr/bin/env python3
"""Daily RSS/sitemap validation and atomic public XML snapshots. No credentials."""
import argparse
import datetime
import json
import os
from pathlib import Path
import sys
import tempfile
import time
import urllib.request
from urllib.parse import urlparse
import xml.etree.ElementTree as ET


def fetch(url):
    for attempt in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(
                url, headers={"User-Agent": "thanhnh-public-feeds-check/1.0"}
            ), timeout=45) as response:
                return response.read()
        except Exception:
            if attempt == 2:
                raise
            time.sleep(2)


def refresh(origin, api_origin, snapshot_dir):
    rss = fetch(origin + "/rss.xml")
    sitemap = fetch(origin + "/sitemap.xml")
    rss_root, sitemap_root = ET.fromstring(rss), ET.fromstring(sitemap)
    if rss_root.tag != "rss" or rss_root.get("version") != "2.0":
        raise ValueError("Expected RSS 2.0")
    namespace = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
    if sitemap_root.tag != namespace + "urlset":
        raise ValueError("Expected sitemap urlset")
    items = rss_root.findall("./channel/item")
    links = [item.findtext("link") for item in items]
    guids = [item.findtext("guid") for item in items]
    if len(set(links)) != len(links) or len(set(guids)) != len(guids):
        raise ValueError("Duplicate RSS links or identifiers")
    sitemap_links = {entry.findtext(namespace + "loc") for entry in sitemap_root}
    if not set(links).issubset(sitemap_links):
        raise ValueError("RSS articles missing from sitemap")
    if any(not item.findtext("title") or not item.findtext("description") for item in items):
        raise ValueError("Missing RSS title/description")
    # Compare every published API page, so a truncated but valid XML fails validation.
    expected = set()
    page, last_page = 1, 1
    now = datetime.datetime.now(datetime.timezone.utc)
    while page <= last_page:
        payload = json.loads(fetch(api_origin + f"/api/posts?status=PUBLISHED&limit=100&page={page}"))
        last_page = int(payload["meta"]["lastPage"])
        if not 1 <= last_page <= 10000:
            raise ValueError("Invalid API pagination")
        for post in payload["data"]:
            published = post.get("publishedAt")
            if post.get("status") != "PUBLISHED":
                continue
            if published and datetime.datetime.fromisoformat(published.replace("Z", "+00:00")) > now:
                continue
            expected.add(f'urn:{urlparse(origin).hostname}:post:{post["id"]}')
        page += 1
    if set(guids) != expected:
        raise ValueError(f"RSS/API mismatch: RSS={len(guids)}, API={len(expected)}")
    snapshot_dir.mkdir(parents=True, exist_ok=True)
    for name, data in [("rss.xml", rss), ("sitemap.xml", sitemap)]:
        fd, temporary = tempfile.mkstemp(dir=snapshot_dir, prefix=name + ".")
        try:
            with os.fdopen(fd, "wb") as output:
                output.write(data)
            os.replace(temporary, snapshot_dir / name)
        finally:
            if os.path.exists(temporary):
                os.unlink(temporary)
    return len(items), len(sitemap_links)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--origin", default="https://thanhnh.id.vn")
    parser.add_argument("--api-origin", default="https://api.thanhnh.id.vn")
    parser.add_argument("--snapshot-dir", type=Path, required=True)
    args = parser.parse_args()
    timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()
    try:
        articles, urls = refresh(args.origin.rstrip("/"), args.api_origin.rstrip("/"), args.snapshot_dir)
        print(f"{timestamp} OK articles={articles} sitemap_urls={urls}", flush=True)
    except Exception as error:
        print(f"{timestamp} ERROR {type(error).__name__}: {error}", file=sys.stderr, flush=True)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
