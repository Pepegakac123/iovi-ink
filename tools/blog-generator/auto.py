"""Tryb automatyczny: jeden wpis na uruchomienie (GitHub Actions co tydzień).

0. przebieg zapasowy (`--zapasowy`, środa) kończy od razu, gdy poniedziałkowy już zostawił wpis,
1. następna fraza z kolejka.txt, której nie ma jeszcze w tytułach wpisów WP (bez własnego stanu),
2. write: wpis do JSON,
3. czysty wpis -> status `future` w losowym dniu roboczym i godzinie (WP publikuje sam),
   wpis z flagami -> `draft` i kod wyjścia 2 (czerwony run = mail do sprawdzenia).
"""
import asyncio
import html
import json
import os
import random
from datetime import datetime, timedelta, timezone

import pytz
import requests

WARSAW = pytz.timezone("Europe/Warsaw")
QUEUE_FILE = os.path.join(os.path.dirname(__file__), "kolejka.txt")
EXIT_DRAFT = 2


def load_queue(path: str = QUEUE_FILE) -> list[str]:
    with open(path, encoding="utf-8") as f:
        lines = [line.strip() for line in f]
    return [line for line in lines if line and not line.startswith("#")]


def next_phrase(queue: list[str], titles: list[str]):
    """Pierwsza fraza, której (bez względu na wielkość liter) nie ma w żadnym tytule."""
    taken = [html.unescape(t).casefold() for t in titles]
    for phrase in queue:
        if not any(phrase.casefold() in title for title in taken):
            return phrase
    return None


def publish_slot(now: datetime, rng: random.Random) -> datetime:
    """Losowy dzień roboczy w ciągu 7 dni (od jutra), godzina 8:00–17:59 — publikacje nie są mechanicznie równe."""
    days = [now + timedelta(days=d) for d in range(1, 8)]
    day = rng.choice([d for d in days if d.weekday() < 5])
    naive = datetime(day.year, day.month, day.day, rng.randint(8, 17), rng.randint(0, 59))
    return WARSAW.localize(naive)


def decide_status(flags: list) -> str:
    return "draft" if flags else "future"


FALLBACK_WINDOW = timedelta(days=3)


def week_already_done(posts: list[dict], now_utc: datetime) -> bool:
    """Dla środowego przebiegu zapasowego: czy poniedziałkowy już coś zostawił.

    Zaplanowany wpis albo wpis opublikowany / zmieniony w ostatnich 3 dniach (od poniedziałku)
    = tydzień zrobiony. Porównujemy czasy GMT z WP (bez strefy) z `now_utc` (bez strefy).
    """
    since = now_utc - FALLBACK_WINDOW
    for p in posts:
        if p.get("status") == "future":
            return True
        stamps = [p.get("date_gmt"), p.get("modified_gmt")]
        if any(s and datetime.fromisoformat(s) >= since for s in stamps):
            return True
    return False


def fetch_posts(site: str, user: str, password: str) -> list[dict]:
    """Wpisy we wszystkich stanach (opublikowane, zaplanowane, szkice): tytuł, status, daty GMT."""
    posts, page = [], 1
    while True:
        resp = requests.get(
            f"{site.rstrip('/')}/wp-json/wp/v2/{os.getenv('WP_POST_TYPE', 'blog')}",
            params={"status": "publish,future,draft,pending,private", "per_page": 100, "page": page,
                    "context": "edit", "_fields": "title,status,date_gmt,modified_gmt"},
            auth=(user, password), timeout=30,
        )
        if resp.status_code == 400 and page > 1:   # strona poza zakresem
            break
        resp.raise_for_status()
        batch = resp.json()
        posts += batch
        if len(batch) < 100:
            break
        page += 1
    return posts


def run_auto(site: str, user: str, password: str, lang: str = "pl", with_photos: bool = True,
             queue_path: str = QUEUE_FILE, fallback: bool = False) -> int:
    import blog_upload
    import blog_writing

    posts = fetch_posts(site, user, password)
    if fallback and week_already_done(posts, datetime.now(timezone.utc).replace(tzinfo=None)):
        print("✅ Przebieg zapasowy: wpis na ten tydzień już jest — nic nie robię.")
        return 0

    phrase = next_phrase(load_queue(queue_path), [p["title"]["raw"] for p in posts])
    if phrase is None:
        print("✅ Kolejka pusta — wszystkie frazy mają już wpis. Dopisz nowe do kolejka.txt.")
        return 0
    print(f"📝 Fraza: {phrase}")

    files = asyncio.run(blog_writing.main([phrase], "", lang, "", site))
    if not files:
        raise RuntimeError(f"Nie udało się napisać wpisu dla frazy: {phrase}")
    path = os.path.join(blog_writing.BLOG_SAVE_DIR, files[0])
    with open(path, encoding="utf-8") as f:
        flags = json.load(f).get("flagi", [])

    status = decide_status(flags)
    slot = publish_slot(datetime.now(WARSAW), random.Random())
    post_id = blog_upload.upload_one(path, site, user, password, lang, status=status,
                                     publish_at=slot, with_photos=with_photos)
    if not post_id:
        raise RuntimeError("Wgrywanie do WordPressa nie powiodło się.")

    if status == "draft":
        print(f"⚠️ Wpis {post_id} zostaje SZKICEM — flagi do sprawdzenia:")
        for flag in flags:
            print(f"   - {flag['kind']}: {flag['snippet']}")
        return EXIT_DRAFT
    print(f"✅ Wpis {post_id} zaplanowany na {slot:%Y-%m-%d %H:%M} ({site}/?p={post_id})")
    return 0
