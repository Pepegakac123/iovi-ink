"""Wgrywanie wygenerowanych blogów (JSON z blog_writing.py) do WordPressa przez REST API.

Wersja samodzielna (bez FastAPI). Wejście: upload_blogs(...) na dole pliku.
"""
import os
import json
import time
from datetime import datetime, timedelta
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

import blog_writing
import kontekst

BLOGS_DIR = os.getenv("BLOG_SAVE_DIR", "var/data/blogs")


def resolve_blog_path(blog, blogs_dir):
    """Ścieżka bezwzględna lub istniejąca względna (np. z globa) bez zmian; gołą nazwę pliku szukamy w katalogu blogów."""
    if os.path.isabs(blog) or os.path.exists(blog):
        return blog
    return os.path.join(blogs_dir, blog)
# Endpoint REST typu wpisu: w CMS iovi-ink to CPT JetEngine "blog" -> /wp-json/wp/v2/blog.
WP_POST_TYPE = os.getenv("WP_POST_TYPE", "blog")
# Okładka z AI (Nano Banana) tylko na żądanie: na blogu tatuażystki okładką ma być prawdziwa praca z biblioteki mediów.
AI_COVER = os.getenv("BLOG_AI_COVER", "").lower() in ("1", "true", "tak")
EXTRA_CONTEXT = ""
lang = "pl"

import requests
import re
import json
from requests.auth import HTTPBasicAuth
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import random
from openai import OpenAI
import os
import urllib.parse
import bs4
import base64
from io import BytesIO
CONTEXT = ""

USERNAME = None
PASSWORD = None
SITE_URL = None
SITE_DESCRIPTION = ""

# Prefer gzip/deflate and retry without compression to avoid brotli decode errors on some WP setups
BROTLI_HEADER_VARIANTS = [
    {"Accept-Encoding": "gzip, deflate"},
    {"Accept-Encoding": "identity"},
]

NANOBANANA_PRO_KEY = os.getenv("NANOBANANA_PRO_KEY")
NANOBANANA_PRO_URL = os.getenv(
    "NANOBANANA_PRO_URL",
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image:generateContent",  # stabilna (2026-10-19)
)
NANOBANANA_TIMEOUT = 60  # seconds

OPENAI_BLOGS_API_KEY = os.getenv("OPENAI_API_KEY_BLOGS") or os.getenv("OPENAI_API_KEY")
import openai

from modele import (AUX_MODEL, REASONING_EFFORT, SERVICE_TIER, build_chat_body, clean_model_text,
                    standard_tier_fallback)

if OPENAI_BLOGS_API_KEY:
    client = OpenAI(api_key=OPENAI_BLOGS_API_KEY)
    OPENAI_IMPORT_ERROR = None
else:
    client = None
    OPENAI_IMPORT_ERROR = (
        "Brak zmiennej środowiskowej OPENAI_API_KEY_BLOGS (ani zapasowego OPENAI_API_KEY). "
        "Ustaw ją, aby korzystać z automatycznego generowania blogów."
    )


def _require_openai_client() -> OpenAI:
    if client is None:
        raise RuntimeError(OPENAI_IMPORT_ERROR)
    return client


def chat_request(prompt, model=None):
    """Zadania pomocnicze (FAQ, opis, dobór zdjęcia) — tańszy model AUX_MODEL."""
    openai_client = _require_openai_client()
    body = build_chat_body(prompt, model or AUX_MODEL, REASONING_EFFORT, SERVICE_TIER)
    try:
        response = openai_client.chat.completions.create(**body)
    except openai.RateLimitError:
        fallback = standard_tier_fallback(body)
        if not fallback:
            raise
        print("429 w trybie Flex (brak mocy) — ponawiam w trybie standardowym")
        response = openai_client.chat.completions.create(**fallback)
    return clean_model_text(response.choices[0].message.content)


def safe_response_json(response):
    try:
        return response.json()
    except requests.exceptions.ContentDecodingError as e:
        print(f"⚠️ Dekodowanie brotli w odpowiedzi nie powiodło się: {e}. Pomijam treść odpowiedzi.")
        return {}


def _fetch_site_description(site_url: str) -> str:
    """
    Lekki opis firmy: najpierw próba wp-json (description/tagline), potem meta description ze strony głównej.
    """
    # Try WP REST root
    try:
        resp = requests.get(f"{site_url.rstrip('/')}/wp-json", timeout=8)
        resp.raise_for_status()
        data = resp.json()
        if isinstance(data, dict):
            desc = data.get("description") or data.get("name")
            if desc:
                return str(desc)
    except Exception as exc:
        print(f"⚠️ Nie udało się pobrać opisu z wp-json: {exc}")

    # Try homepage meta description
    try:
        headers = BROTLI_HEADER_VARIANTS[0]
        html = requests.get(site_url, timeout=8, headers=headers).text
        soup = BeautifulSoup(html, "html.parser")
        meta = soup.find("meta", attrs={"name": "description"})
        if meta and meta.get("content"):
            return meta["content"]
    except Exception as exc:
        print(f"⚠️ Nie udało się pobrać meta description strony: {exc}")

    return site_url


def _cover_prompt(company_description: str, blog_title: str) -> str:
    return (
        f"opis firmy: {company_description}\n"
        f"wygeneruj okładkę na tego bloga: {blog_title}\n"
        "format 4:3\n"
        "bez ludzi\n"
        "bez żadnych napisów\n"
        "ma być realistyczna i dobra na stronę firmową klienta"
    )


def _decode_image_string(image_str: str) -> bytes:
    if image_str.startswith("data:image"):
        try:
            header, payload = image_str.split(",", 1)
            image_str = payload
        except Exception:
            pass
    return base64.b64decode(image_str)


def _extract_image_bytes(resp_json: dict) -> Optional[bytes]:
    # Prefer inline_data.data from Gemini image response
    try:
        candidates = resp_json.get("candidates") if isinstance(resp_json, dict) else None
        if candidates and isinstance(candidates, list):
            first = candidates[0] if candidates else None
            parts = first.get("content", {}).get("parts", []) if isinstance(first, dict) else []
            for part in parts:
                if isinstance(part, dict):
                    inline = part.get("inline_data") or part.get("inlineData")
                    if isinstance(inline, dict) and isinstance(inline.get("data"), str):
                        return _decode_image_string(inline["data"])
    except Exception as exc:
        print(f"⚠️ Nie udało się sparsować inline_data: {exc}")

    b64_candidates = []
    url_candidates = []

    def collect(item):
        if not isinstance(item, dict):
            return
        for key in ("image", "base64", "b64_json", "content", "data"):
            if key in item and isinstance(item[key], str):
                b64_candidates.append(item[key])
        if "url" in item and isinstance(item["url"], str):
            url_candidates.append(item["url"])

    if isinstance(resp_json, dict):
        if isinstance(resp_json.get("images"), list):
            for img in resp_json["images"]:
                collect(img)
        if isinstance(resp_json.get("data"), list):
            for img in resp_json["data"]:
                collect(img)
        if isinstance(resp_json.get("output"), list):
            for img in resp_json["output"]:
                collect(img if isinstance(img, dict) else {"image": img})

    if b64_candidates:
        return _decode_image_string(b64_candidates[0])

    if url_candidates:
        try:
            url = url_candidates[0]
            download = requests.get(url, timeout=15)
            download.raise_for_status()
            return download.content
        except Exception as exc:
            print(f"⚠️ Pobieranie grafiki z URL nie powiodło się: {exc}")

    return None


def cover_payload(prompt: str) -> dict:
    """16:9 jak karty kursów; strona wpisu pokazuje okładkę w naturalnych proporcjach (blog-post.css)."""
    return {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "tools": [{"google_search": {}}],
        "generationConfig": {
            "responseModalities": ["IMAGE"],
            "imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"},
        },
    }


def generate_cover_via_nanobanana(company_description: str, blog_title: str) -> bytes:
    if not NANOBANANA_PRO_KEY:
        raise RuntimeError("Brak klucza NANOBANANA_PRO_KEY w środowisku.")
    payload = cover_payload(_cover_prompt(company_description, blog_title))
    headers = {
        "x-goog-api-key": NANOBANANA_PRO_KEY,
        "Content-Type": "application/json"
    }
    resp = requests.post(
        NANOBANANA_PRO_URL,
        json=payload,
        headers=headers,
        timeout=NANOBANANA_TIMEOUT
    )
    if resp.status_code >= 300:
        try:
            print(f"❌ NanoBanana error payload: {resp.json()}")
        except Exception:
            print(f"❌ NanoBanana error text: {resp.text}")
        raise RuntimeError(f"NanoBanana API error {resp.status_code}")
    resp_json = resp.json()
    image_bytes = _extract_image_bytes(resp_json)
    if not image_bytes:
        print(f"❌ NanoBanana empty image payload: {resp_json}")
        raise RuntimeError("Brak danych obrazu w odpowiedzi NanoBanana.")
    return image_bytes


_PL = str.maketrans("ąćęłńóśźżĄĆĘŁŃÓŚŹŻ", "acelnoszzACELNOSZZ")


def _slugify(text: str) -> str:
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text.translate(_PL)).strip("-").lower()
    return text or "cover"


def _convert_to_webp_sync(image_bytes: bytes, quality: int = 95, max_width: int = 1200) -> bytes:
    """
    Konwertuje dowolny obraz (png/jpg/webp) do WEBP.
    - max_width skaluje proporcjonalnie (jeśli obraz jest szerszy).
    Wymaga: pillow (pip install pillow)
    """
    try:
        from PIL import Image  # pillow
    except ModuleNotFoundError as exc:
        raise RuntimeError("Brak biblioteki Pillow. Zainstaluj: pip install pillow") from exc

    img = Image.open(BytesIO(image_bytes))

    # Ujednolicenie trybu
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGBA" if "A" in img.getbands() else "RGB")

    # Skalowanie do max_width
    w, h = img.size
    if max_width and w > max_width:
        new_h = int(h * (max_width / w))
        img = img.resize((max_width, new_h), Image.LANCZOS)

    out = BytesIO()
    save_kwargs = {
        "format": "WEBP",
        "quality": max(1, min(int(quality), 100)),
        "method": 6,
    }
    img.save(out, **save_kwargs)
    return out.getvalue()


def upload_cover_to_wp(site_url: str, username: str, password: str, image_bytes: bytes, blog_title: str):
    """Wgrywa okładkę do biblioteki mediów. Zwraca (url, id)."""
    webp_bytes = _convert_to_webp_sync(image_bytes, quality=98, max_width=1200)
    filename = f"{_slugify(blog_title)[:60]}-cover.webp"

    media_url = f"{site_url.rstrip('/')}/wp-json/wp/v2/media"
    headers = {
        "Content-Disposition": f'attachment; filename="{filename}"',
        "Content-Type": "image/webp"
    }
    auth = (username, password)

    resp = requests.post(media_url, data=webp_bytes, headers=headers, auth=auth, timeout=30)
    if resp.status_code not in (200, 201):
        raise RuntimeError(f"Upload cover failed: {resp.status_code} {resp.text}")
    media = resp.json()
    result_url = media.get('source_url')
    media_id = media.get('id')

    if media_id and blog_title:
        try:
            u = f"{site_url.rstrip('/')}/wp-json/wp/v2/media/{media_id}"
            update_payload = {"alt_text": blog_title}
            # PATCH zwykle jest poprawnym wyborem dla aktualizacji media w WP REST
            try:
                requests.patch(u, json=update_payload, auth=auth, timeout=10)
            except Exception:
                # Fallback do POST, jeśli środowisko blokuje PATCH
                requests.post(u, json=update_payload, auth=auth, timeout=10)
        except Exception as exc:
            print(f"⚠️ Nie udało się ustawić ALT dla okładki: {exc}")

    if not result_url:
        raise RuntimeError("Brak URL w odpowiedzi WordPressa dla okładki.")
    return result_url, media_id


def get_all_photos(per_page=100):
    page = 1
    all_items = []
    auth = HTTPBasicAuth(USERNAME, PASSWORD)

    while True:
        api_url = f"{SITE_URL}/wp-json/wp/v2/media?per_page={per_page}&page={page}"
        response = None
        media_items = None
        last_error = None

        for headers in BROTLI_HEADER_VARIANTS:
            try:
                response = requests.get(api_url, auth=auth, headers=headers)
                if response.status_code != 200:
                    break
                media_items = response.json()
                break
            except requests.exceptions.ContentDecodingError as e:
                last_error = e
                print("⚠️ Dekodowanie brotli listy mediów nie powiodło się, ponawiam bez kompresji.")
                continue
            except requests.exceptions.RequestException as e:
                last_error = e
                break

        if last_error and media_items is None and (response is None or response.status_code == 200):
            # Both attempts failed to decode
            raise last_error

        if response is None or response.status_code != 200:
            break

        if not media_items:
            break

        all_items.extend(media_items)
        page += 1

    return all_items


def sort_by_horizontal(photos):
    def get_aspect_ratio(photo):
        try:
            media_details = photo.get('media_details', {})
            width = media_details.get('width', 0)
            height = media_details.get('height', 0)
            
            if height == 0 or width == 0:
                return 0
            return width / height
        except (KeyError, TypeError, AttributeError):
            return 0

    sorted_photos = sorted(photos, key=get_aspect_ratio, reverse=True)
    return sorted_photos


def get_photos_from_title(title, count=4):
    all_photos = get_all_photos()
    selected_photos = []
    if not all_photos:
        print("⚠️ Biblioteka mediów pusta — blog bez zdjęć w treści.")
        return []

    tries = 0
    while len(selected_photos) < count:
        tries += 1
        if(tries > count + 3):
            print(f"Warning: Unable to find {count} photos after {tries} attempts.")
            break

        random.shuffle(all_photos)

        photos_with_alt = [photo for photo in all_photos if 'alt_text' in photo and photo['alt_text']]
        photos_with_alt = [photo for photo in photos_with_alt if photo.get('source_url', '').endswith('.webp')]
        
        filtered_photos = []
        for photo in photos_with_alt:
            media_details = photo.get('media_details', {})
            width = media_details.get('width')
            height = media_details.get('height')
            
            if width and height:
                try:
                    if int(width) >= 500 or int(height) >= 500:
                        filtered_photos.append(photo)
                except (ValueError, TypeError):
                    continue
        
        photos_with_alt = filtered_photos

        random.shuffle(photos_with_alt)

        if not photos_with_alt:
            print("No photos with alt text found")
            break

        alt_texts = [photo['alt_text'] for photo in photos_with_alt]
        random.shuffle(alt_texts)
        alt_texts = "\n".join(alt_texts)
        prompt = f"Który z poniższych tekstów alternatywnych zdjęć najlepiej pasuje do bloga o tytule '{title}'? \n Tu jest lista tytułów:\n{alt_texts} \n\n Odpisz tylko tytułem alt, dokładnie w takiej samej formie jak jest zapisany w liście. Nie pisz nic więcej."
        best_match = chat_request(prompt)

        best_match_found = False
        for photo in photos_with_alt:
            if photo['alt_text'].strip().lower().replace("'", "") == best_match.strip().lower().replace("'", ""):
                selected_photos.append(photo)
                all_photos = [photo for photo in all_photos if photo['source_url'] not in [selected_photo['source_url'] for selected_photo in selected_photos]]
                best_match_found = True
                break

    if len(selected_photos) < count and all_photos:
        for _ in range(count - len(selected_photos)):
            selected_photos.append(random.choice(all_photos))

    selected_photos = sort_by_horizontal(selected_photos)

    return [photo["source_url"] for photo in selected_photos if photo.get("source_url")]


def read_blog_data(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        blog_data = json.load(file)

    return blog_data['keyword'], blog_data['title'], blog_data['headers'], blog_data['descriptions']


def parse_faq(response: str, count: int = 3):
    """Parsuje odpowiedź modelu ("Pytanie: ...\nOdpowiedź: ...", bloki oddzielone pustą linią)."""
    questions, answers = [], []
    for faq in response.split("\n\n"):
        if not faq:
            continue
        q_a = faq.split("\nOdpowiedź:", 1)
        if len(q_a) == 2:
            questions.append(q_a[0].replace("Pytanie:", "").strip())
            answers.append(q_a[1].strip())
        if len(questions) >= count:
            break
    if len(questions) == count and len(answers) == count:
        return questions, answers
    return None, None


def generate_faq_questions(article, count=3, max_retries: int = 3, initial_delay: float = 1.0):
    global CONTEXT, lang
    prompt = (
        f"{CONTEXT}\nPisz w języku: {lang}\n"
        f"Proszę wygenerować {count} pytań i odpowiedzi na często zadawane pytania "
        f"na podstawie poniższego artykułu. Odpowiedzi tylko z faktów artykułu, bez cen i liczb spoza artykułu. "
        f"Każde pytanie i odpowiedź oddziel od siebie "
        f"podwójną nową linią (dwa razy Enter). Format odpowiedzi: \n"
        f"Pytanie: [Treść pytania]\nOdpowiedź: [Treść odpowiedzi]\n\nArtykuł:\n{article}"
    )
    delay = initial_delay
    for attempt in range(1, max_retries + 1):
        questions, answers = parse_faq(chat_request(prompt), count)
        if questions:
            return questions, answers
        if attempt == max_retries:
            break
        print(f"Retrying FAQ generation (attempt {attempt}/{max_retries}) in {delay:.1f}s...")
        time.sleep(delay)
        delay *= 2

    return None, None


def create_blog_post(site_url, username, password, post_data):
    auth = (username, password)

    response = requests.post(
        f'{site_url}/wp-json/wp/v2/{WP_POST_TYPE}',
        json=post_data,
        auth=auth,
        headers=BROTLI_HEADER_VARIANTS[0],
    )

    if response.status_code == 201:
        response_json = safe_response_json(response)
        print('Post created successfully, ID:', response_json.get('id'))
        missing = [k for k, v in post_data.get('meta', {}).items()
                   if v and not (response_json.get('meta') or {}).get(k)]
        if missing:
            print(f'⚠️ WordPress nie zapisał pól meta: {missing} (sprawdź "Show in REST API" w JetEngine)')
        return response_json
    else:
        print('Failed to create post')
        print('Response:', safe_response_json(response))
        return None


def build_html_content(headers, descriptions, photos, keyword):
    """Nagłówki + akapity (format modelu: `H2: ...`, `H3: ...`, `- punkt`) -> HTML."""
    photos = list(photos)
    photos_count = len(photos)
    html_content = ""
    for i, header in enumerate(headers):
        if "H1" in header or "H2" in header:
            html_content += f"<h2>{header[4:]}</h2>\n"

        if i < len(descriptions):
            description = ""
            in_list = False
            for line in descriptions[i].split('\n'):
                if line.strip().startswith("- "):
                    if not in_list:
                        description += "<ul>\n"
                        in_list = True
                    description += f"<li>{line.strip()[2:].strip()}</li>\n"
                else:
                    if in_list:
                        description += "</ul>\n"
                        in_list = False
                    if 'H3' in line:
                        description += f"<h3>{line[4:]}</h3>\n"
                    else:
                        description += f"<p>{line}</p>\n"

            if in_list:
                description += "</ul>\n"

            html_content += description

        after_x = max(1, int(len(descriptions) / photos_count)) if photos_count else 0
        if after_x and i % after_x == 1 and photos:
            html_content += f'<img src="{photos.pop()}" alt="{keyword}" />\n'

    return html_content


def build_post_payload(title, keyword, html, short_description, questions, answers,
                       cover_url, date_iso, status="draft"):
    """Payload dla CPT JetEngine `blog` (CMS iovi-ink). Front (Next.js) czyta wyłącznie pola meta:
    treść w `tekst_glowny`, FAQ w repeaterze `blog_faq` (renderuje go BlogFAQSection), okładka jako URL."""
    return {
        'title': title,
        'status': status,
        'date': date_iso,
        'slug': _slugify(keyword),
        'meta': {
            'original_title': title,
            'seo_title': title,
            'seo_description': short_description,
            'wstep': short_description,
            'tekst_glowny': html,
            'miniaturka_bloga': cover_url or '',
            'data_bloga': date_iso[:10],
            'blog_faq': {
                f'item-{i}': {'pytanie': q, 'odpowiedz': a}
                for i, (q, a) in enumerate(zip(questions, answers))
            },
            'keyword_1': keyword,
        },
    }


def publish_date_string(publish_in_days, publish_at=None) -> str:
    """Data wpisu dla WP (czas Warszawy): dokładna `publish_at` (tryb auto) albo dziś + dni (tryb --plan)."""
    from pytz import timezone

    if publish_at is None:
        publish_at = timezone('Europe/Warsaw').localize(datetime.now() + timedelta(days=int(publish_in_days + 1)))
    return publish_at.strftime('%Y-%m-%dT%H:%M:%S')


def load_and_post_blog(keyword, title, headers, descriptions, publish_in_days, status="draft", with_photos=True,
                       publish_at=None):
    global CONTEXT, lang, SITE_DESCRIPTION
    if title[1] == '.':
        title = title[2:]
    elif title[2] == '.':
        title = title[3:]

    photos = get_photos_from_title(title) if with_photos else []

    # Okładka: najlepiej dopasowane prawdziwe zdjęcie pracy; AI tylko gdy BLOG_AI_COVER=1 albo brak zdjęć.
    cover_url = photos.pop(0) if photos and not AI_COVER else None
    if cover_url is None and (AI_COVER or NANOBANANA_PRO_KEY):
        try:
            if not SITE_DESCRIPTION:
                SITE_DESCRIPTION = _fetch_site_description(SITE_URL)
            cover_bytes = generate_cover_via_nanobanana(SITE_DESCRIPTION, title)
            cover_url, _ = upload_cover_to_wp(SITE_URL, USERNAME, PASSWORD, cover_bytes, title)
            print(f"✅ Okładka NanoBanana wygenerowana: {cover_url}")
        except Exception as exc:
            print(f"⚠️ Nie udało się wygenerować okładki NanoBanana: {exc}")

    publish_date = publish_date_string(publish_in_days, publish_at)

    short_description = chat_request(
        f'''{CONTEXT}\nPisz w języku: {lang}\n Napisz krótki opis na bazie tekstu: \n{descriptions[0]}\n\n.
        Użyj tekstu, aby stworzyć meta description: 130-155 znaków, jedno-dwa zdania. Napisz w odpowiedzi tylko gotowy opis, bez żadnych dodatkowych znaków, ani tekstów.
        Opis trafia do wyników Google i jako wstęp wpisu. Zacznij od frazy: {keyword} dokładnie w takiej formie i użyj jej tylko raz.
        NIE PISZ WIĘCEJ NIŻ 155 ZNAKÓW'''
    )

    html_content = build_html_content(headers, descriptions, photos, keyword)

    questions, answers = generate_faq_questions(html_content)
    if questions is None:
        raise Exception("Unable to generate the required number of questions and answers.")

    blog_data = build_post_payload(
        title, keyword, html_content, short_description, questions, answers,
        cover_url, publish_date, status,
    )
    return create_blog_post(site_url=SITE_URL, username=USERNAME, password=PASSWORD, post_data=blog_data)


def _configure(site_url, username, password, lang, extra_context=""):
    if not isinstance(lang, str) or len(lang) != 2:
        raise ValueError("lang must be a 2-letter string")
    global USERNAME, PASSWORD, SITE_URL, SITE_DESCRIPTION, EXTRA_CONTEXT
    USERNAME = username
    PASSWORD = password
    SITE_URL = site_url.rstrip('/')
    EXTRA_CONTEXT = extra_context or ""
    globals()["lang"] = lang
    try:
        SITE_DESCRIPTION = _fetch_site_description(SITE_URL)
    except Exception as exc:
        print(f"⚠️ Nie udało się wstępnie pobrać opisu firmy: {exc}")


def upload_one(path, site_url, username, password, lang, status="draft", publish_at=None, with_photos=True,
               knowledge_dir=kontekst.DEFAULT_DIR):
    """Tryb auto: jeden wpis z dokładnym statusem i datą. Zwraca ID wpisu albo None."""
    _configure(site_url, username, password, lang)
    global CONTEXT
    keyword, title, headers, descriptions = read_blog_data(path)
    CONTEXT = blog_writing.build_context(lang, "", EXTRA_CONTEXT, SITE_URL,
                                         knowledge=kontekst.build_knowledge(keyword, knowledge_dir))
    result = load_and_post_blog(keyword, title, headers, descriptions, 0, status, with_photos, publish_at=publish_at)
    return (result or {}).get("id")


def upload_blogs(
    blog_filenames: list[str],
    site_url: str,
    username: str,
    password: str,
    lang: str,
    uploads_per_week: int = 1,
    start_date_offset_in_weeks: int = 0,
    extra_context: str = "",
    schedule: bool = False,
    with_photos: bool = True,
    knowledge_dir: str = kontekst.DEFAULT_DIR,
):
    """Wgrywa blogi do WP. Domyślnie jako `draft` (do oceny); `schedule=True` planuje publikację
    `uploads_per_week` na tydzień (status future/publish).

    username/password = login WP + Application Password (Użytkownicy -> Profil ->
    Hasła aplikacji), NIE zwykłe hasło do panelu.
    """
    _configure(site_url, username, password, lang, extra_context)
    global CONTEXT
    blog_file_names = sorted(blog_filenames)
    total = len(blog_file_names)
    done = 0

    if total > 0:
        weeks_until_publication = (total + uploads_per_week - 1) // uploads_per_week
        days_between_uploads = weeks_until_publication * 7 / total

        for i, blog in enumerate(blog_file_names):
            publish_in_days = start_date_offset_in_weeks * 7 + int(round(i * days_between_uploads))
            blog_path = resolve_blog_path(blog, BLOGS_DIR)

            if not os.path.exists(blog_path):
                print(f"Warning: Blog file {blog_path} does not exist, skipping...")
                continue

            try:
                keyword, title, headers, descriptions = read_blog_data(blog_path)
                CONTEXT = blog_writing.build_context(
                    lang, "", EXTRA_CONTEXT, SITE_URL,
                    knowledge=kontekst.build_knowledge(keyword, knowledge_dir),
                )
                if schedule:
                    status = 'publish' if publish_in_days <= 0 else 'future'
                else:
                    status = 'draft'
                if load_and_post_blog(keyword, title, headers, descriptions, publish_in_days, status, with_photos):
                    done += 1
            except Exception as e:
                print(f"Error processing blog {blog_path}: {e}")

    return {"status": "ok", "summary": f"Wgrano ({'plan' if schedule else 'szkice'}): {done}/{total}."}
