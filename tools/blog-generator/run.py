"""Maszynka do blogów IOVI INK (port z ME360).

  python run.py write  --opis opis.txt --frazy frazy.txt
  python run.py upload --site https://domena.pl --user login_wp --pliki "var/data/blogs/*.json"
  python run.py all    --opis opis.txt --frazy frazy.txt --site ... --user ...
  python run.py auto   (WP_SITE, WP_USER, WP_APP_PASSWORD z env) — 1 wpis z kolejka.txt, patrz auto.py

Frazy: plik, jedna na linię (kolejka.txt — z DataForSEO, patrz README).
Wiedza o IOVI INK: katalog kontekst/ (core.md, tematy/*.md, mapa.json), patrz kontekst.py.
Upload domyślnie tworzy SZKICE (do oceny); --plan włącza harmonogram publikacji.
Hasło WP (Application Password) z env WP_APP_PASSWORD, nie z argumentów.
"""
import argparse
import asyncio
import glob
import os
import sys

from dotenv import load_dotenv

load_dotenv()

import kontekst


def _read(path_or_text: str) -> str:
    """Plik (jeśli istnieje) albo tekst podany wprost."""
    if path_or_text and os.path.isfile(path_or_text):
        with open(path_or_text, encoding="utf-8") as f:
            return f.read()
    return path_or_text or ""


def _lines(path: str) -> list[str]:
    return [l.strip() for l in _read(path).splitlines() if l.strip()]


def cmd_write(a) -> list[str]:
    import blog_writing

    keywords = _lines(a.frazy)
    if not keywords:
        sys.exit("❌ Brak fraz (podaj --frazy plik.txt, jedna fraza na linię).")
    files = asyncio.run(
        blog_writing.main(keywords, _read(a.opis), a.lang, _read(a.kontekst), a.site or "", a.kontekst_dir)
    )
    usage = blog_writing.USAGE
    print(f"✅ Napisano {len(files)}/{len(keywords)} blogów -> {blog_writing.BLOG_SAVE_DIR}")
    print(f"📊 calli: {blog_writing.CHAT_REQUESTS}, prompt: {usage['prompt']} tok "
          f"(cached: {usage['cached']}), completion: {usage['completion']} tok")
    cost = blog_writing.split_cost(blog_writing.chat_model, usage, blog_writing.FLEX_USAGE)
    print(f"💵 model: {blog_writing.chat_model}, koszt: "
          + (f"${cost:.4f}" if cost is not None else "brak modelu w cenniku"))
    return [os.path.join(blog_writing.BLOG_SAVE_DIR, f) for f in files]


def cmd_upload(a, files=None):
    import blog_upload

    password = os.getenv("WP_APP_PASSWORD")
    if not password:
        sys.exit("❌ Ustaw WP_APP_PASSWORD w .env (Application Password z WordPressa).")
    if not a.site or not a.user:
        sys.exit("❌ Podaj --site i --user.")
    if files is None:
        files = [p for pat in (a.pliki or []) for p in glob.glob(pat)]
    if not files:
        sys.exit("❌ Brak plików JSON do wgrania.")
    res = blog_upload.upload_blogs(
        files, a.site, a.user, password, a.lang,
        uploads_per_week=a.na_tydzien,
        start_date_offset_in_weeks=a.start_za_tygodni,
        extra_context=_read(a.kontekst),
        schedule=a.plan,
        with_photos=not a.bez_zdjec,
        knowledge_dir=a.kontekst_dir,
    )
    print(f"✅ {res['summary']}")


def cmd_auto(a) -> int:
    import auto

    site = a.site or os.getenv("WP_SITE")
    user = a.user or os.getenv("WP_USER")
    password = os.getenv("WP_APP_PASSWORD")
    if not (site and user and password):
        sys.exit("❌ auto: ustaw WP_SITE, WP_USER i WP_APP_PASSWORD (albo --site/--user).")
    return auto.run_auto(site, user, password, a.lang, with_photos=not a.bez_zdjec, fallback=a.zapasowy)


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("krok", choices=["write", "upload", "all", "auto"])
    p.add_argument("--lang", default="pl", help="pl, de, en, nl, fr, da… (2 litery)")
    p.add_argument("--opis", help="opis firmy: plik .txt/.md albo tekst")
    p.add_argument("--kontekst", help="dodatkowy kontekst ręczny: plik .md albo tekst")
    p.add_argument("--kontekst-dir", dest="kontekst_dir", default=kontekst.DEFAULT_DIR,
                   help="katalog z core.md, tematy/, mapa.json")
    p.add_argument("--frazy", help="plik z frazami (jedna na linię)")
    p.add_argument("--site", help="https://domena.pl")
    p.add_argument("--user", help="login WP")
    p.add_argument("--pliki", nargs="*", help="pliki JSON blogów do wgrania (glob)")
    p.add_argument("--plan", action="store_true", help="planuj publikację (future/publish) zamiast szkiców")
    p.add_argument("--bez-zdjec", dest="bez_zdjec", action="store_true", help="pomiń zdjęcia z biblioteki mediów")
    p.add_argument("--na-tydzien", dest="na_tydzien", type=int, default=1)
    p.add_argument("--start-za-tygodni", dest="start_za_tygodni", type=int, default=0)
    p.add_argument("--zapasowy", action="store_true",
                   help="auto: przebieg zapasowy — nic nie rób, jeśli wpis na ten tydzień już powstał")
    a = p.parse_args()

    if a.krok == "auto":
        sys.exit(cmd_auto(a))
    if a.krok == "write":
        cmd_write(a)
    elif a.krok == "upload":
        cmd_upload(a)
    else:
        cmd_upload(a, cmd_write(a))


if __name__ == "__main__":
    main()
