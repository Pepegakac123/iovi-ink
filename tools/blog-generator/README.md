# Maszynka do blogów IOVI INK

Port maszynki z ME360 (`~/Projects/me360-platform/blog-generator-me360`), dostosowany do bloga Jowity:
wiedza o IOVI INK w każdym prompcie, wpisy trafiają do CPT JetEngine `blog` w `cms.iovi-ink.pl`,
a front Next.js renderuje je z pól meta.

```
kolejka.txt / frazy.txt ─► [write] ─► var/data/blogs/*.json ─► [upload] ─► CMS (CPT blog, domyślnie szkic)
```

## Start

```bash
cd tools/blog-generator
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env        # OPENAI_API_KEY_BLOGS, WP_USER, WP_APP_PASSWORD

python run.py write  --frazy frazy.txt
python run.py upload --site https://cms.iovi-ink.pl --user LOGIN --pliki "var/data/blogs/*.json"
```

## Wiedza (`kontekst/`) — SZKIC do akceptacji przez Jowitę

| Plik | Rola |
|---|---|
| `kontekst/core.md` | kim jest Jowita, specjalizacje, proces, ton, czego nie pisać (zawsze w prompcie) |
| `kontekst/zakazane.md` | zakazane zdania i schematy — dopisuj po każdej ocenie wpisów |
| `kontekst/tematy/<id>.md` | arkusze: cena, pielęgnacja, przygotowanie, ból, miejsca, style, motywy, okazje, blizny |
| `kontekst/mapa.json` | `{"<id>": ["fragment frazy", ...]}` — dobór arkuszy bez LLM |

Zasady faktów (`kontekst.FACT_RULES`): bez cen w zł, bez porad medycznych i nazw maści, bez obietnic „nie boli”,
bez stylów spoza oferty, bez innych studiów. `guards.py` flaguje ceny, procenty, obietnice i porady medyczne.

## Mapowanie na pola CMS (`blog_upload.build_post_payload`)

| Pole JetEngine | Co trafia |
|---|---|
| `original_title`, `seo_title` | tytuł (≤ 50 znaków, fraza na początku) |
| `seo_description`, `wstep` | opis 130–155 znaków |
| `tekst_glowny` | HTML treści (bez FAQ) |
| `blog_faq` | repeater `item-n: {pytanie, odpowiedz}` (renderuje `BlogFAQSection`) |
| `miniaturka_bloga` | URL okładki: dopasowane prawdziwe zdjęcie z biblioteki mediów |
| `data_bloga` | data publikacji `YYYY-MM-DD` |
| `keyword_1` | fraza kluczowa |

Slug = fraza bez polskich znaków (`tatuaz-na-przedramieniu-damski`).

## Kolejka (`kolejka.txt`)

Frazy z DataForSEO (Labs, PL, 2026-10-29) z wolumenem w komentarzach. Pominięte tematy, które mają już stronę
usługi lub wpis — tam poprawiamy istniejącą stronę, żeby nie kanibalizować. Każda fraza musi mieć arkusz
w `mapa.json` (pilnuje tego test).

## Tryb automatyczny (1 wpis tygodniowo)

```bash
WP_SITE=https://cms.iovi-ink.pl WP_USER=login python run.py auto
```

- Fraza: pierwsza z `kolejka.txt`, której nie ma jeszcze w tytule żadnego wpisu `blog`.
- Czysty wpis (≥ 800 słów, bez flag) → `future` w losowym dniu roboczym; wpis z flagami → szkic i kod wyjścia 2.
- GitHub Actions: `.github/workflows/blog-auto.yml`. Włącznik: zmienna repo `BLOG_AUTO_ENABLED=true`;
  sekrety `OPENAI_API_KEY_BLOGS`, `WP_APP_PASSWORD` (opcjonalnie `NANOBANANA_PRO_KEY`); zmienne `WP_SITE`, `WP_USER`.
- Nowy wpis pojawi się na iovi-ink.pl po rewalidacji (lista bloga i sitemap: do 1 h).

## Modele i redakcja

Bez zmian względem ME360 — patrz `modele.py` (`BLOG_MODEL`, `BLOG_MODEL_AUX` w `.env`).

## Testy

```bash
OPENAI_API_KEY_BLOGS=test pytest -q
```
