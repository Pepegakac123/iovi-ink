from openai import OpenAI
from uuid import uuid4
import aiohttp
import re
import requests
from bs4 import BeautifulSoup
import logging
import time
from concurrent.futures import ThreadPoolExecutor
import json
import os
import sys
import random
from dotenv import load_dotenv

load_dotenv()

import guards
import kontekst

BLOG_SAVE_DIR = os.getenv("BLOG_SAVE_DIR", "var/data/blogs")
os.makedirs(BLOG_SAVE_DIR, exist_ok=True)
import requests
# from googlesearch import search
import requests
import aiohttp
# import nest_asyncio
import asyncio
import zipfile
import os
import shutil
import random

OPENAI_BLOGS_API_KEY = os.getenv("OPENAI_API_KEY_BLOGS") or os.getenv("OPENAI_API_KEY")
if not OPENAI_BLOGS_API_KEY:
    raise RuntimeError("Brak zmiennej OPENAI_API_KEY_BLOGS (ani zapasowego OPENAI_API_KEY) dla modułu blogów.")
from modele import (MODEL as chat_model, REASONING_EFFORT, SERVICE_TIER,
                    build_chat_body, clean_model_text, estimate_cost, is_reasoning_model,
                    split_cost, standard_tier_fallback)

client = OpenAI(api_key=OPENAI_BLOGS_API_KEY)
CONTEXT = ""

START_TIME = time.time()
BLOGS_ADDED = 0
CHAT_REQUESTS = 0
BATCH_SIZE = 5
USAGE = {"prompt": 0, "cached": 0, "completion": 0}  # do raportu kosztów
FLEX_USAGE = {"prompt": 0, "cached": 0, "completion": 0}  # część USAGE policzona po cenie Flex

LANGUAGE_INSTRUCTIONS = {
    "pl": {
        "label": "polski",
        "instruction": (
            "Pisz wyłącznie w języku polskim. Pisz w 100% poprawnie, bez błędów gramatycznych, "
            "i używaj polskich znaków (np. ą, ć, ę, ł, ń, ó, ś, ź, ż) tam, gdzie to konieczne. "
            "NIE używaj słów z innych języków."
        ),
    },
    "de": {
        "label": "niemiecki",
        "instruction": (
            "Pisz wyłącznie w języku niemieckim (Deutsch). Pisz w 100% poprawnie, bez błędów gramatycznych, "
            "i używaj niemieckich znaków (np. ä, ö, ü, ß) tam, gdzie to konieczne. "
            "NIE używaj słów z innych języków."
        ),
    },
    "en": {
        "label": "angielski",
        "instruction": (
            "Pisz wyłącznie w języku angielskim (English). Pisz w 100% poprawnie, bez błędów gramatycznych. "
            "NIE używaj słów z innych języków."
        ),
    },
    "fr": {
        "label": "francuski",
        "instruction": (
            "Pisz wyłącznie w języku francuskim (Français). Pisz w 100% poprawnie, bez błędów gramatycznych, "
            "i używaj francuskich znaków (np. é, è, ê, ë, à, â, î, ï, ô, ù, û, ü, ç) tam, gdzie to konieczne. "
            "NIE używaj słów z innych języków."
        ),
    },
    "da": {
        "label": "duński",
        "instruction": (
            "Pisz wyłącznie w języku duńskim (Dansk). Pisz w 100% poprawnie, bez błędów gramatycznych, "
            "i używaj duńskich znaków (np. æ, ø, å) tam, gdzie to konieczne. "
            "NIE używaj słów z innych języków."
        ),
    },
    "nl": {
        "label": "holenderski",
        "instruction": (
            "Pisz wyłącznie w języku holenderskim (Nederlands). Pisz w 100% poprawnie, bez błędów gramatycznych, "
            "i używaj holenderskich znaków (np. ë, ï, é) tam, gdzie to konieczne. "
            "NIE używaj słów z innych języków."
        ),
    },
}

# Kody krajów / warianty ISO -> kody języków z LANGUAGE_INSTRUCTIONS.
# Bez tego np. 'DK' (Dania) nie mapuje się na 'da' (duński) i leci generyczny fallback.
LANGUAGE_CODE_ALIASES = {
    "dk": "da",  # Dania -> duński
    "gb": "en",
    "uk": "en",
    "us": "en",
    "at": "de",
    "ch": "de",
}

def get_language_instruction(lang_code):
    code = (lang_code or "").strip().lower()
    code = LANGUAGE_CODE_ALIASES.get(code, code)
    lang_config = LANGUAGE_INSTRUCTIONS.get(code)
    if lang_config:
         return f"INSTRUKCJA JĘZYKOWA: {lang_config['instruction']}"

    # Fallback for unknown languages
    return f"Pisz wyłącznie w języku o kodzie: {lang_code}. Pisz poprawnie gramatycznie i nie używaj słów z innych języków."

VERBOSE = False


helpful_content_desctiption = """
Jesteś profesjonalnym copywriterem. Piszesz bloga na stronę internetową. Ma on przyciągać ruch na stronę i pomagać ludziom, którzy go czytają.

Google Helpful Content to system promujący oryginalne i przydatne treści, stworzone z myślą o odbiorcy, a nie… o algorytmach. Oznacza to, że aby spełnić wymagania Google, nie powinniśmy myśleć o jego systemach. Dosyć paradoksalne, prawda? :) W praktyce Helpful Content to nic innego jak po prostu wartościowe, przydatne treści. System ten obniża rangę tekstów stworzonych jedynie z myślą o zajmowaniu wysokich pozycji w wynikach wyszukiwania, nagradzając natomiast strony zawierające pomocne, oryginalne treści. Helpful Content stanowi istotny czynnik rankingowy dla Google.

Twoja treść powinna być jak skrzynia skarbów pełna przydatnych rzeczy, na których zależy Twojej publiczności.

Zawsze staraj się oferować coś wartościowego — czy to rozwiązanie problemu, dostarczenie nowych spostrzeżeń, czy po prostu ułatwienie komuś dnia.

"""


API_KEY = OPENAI_BLOGS_API_KEY
MAX_CONCURRENT_CALLS = 2   # limit tokenów/min (TPM) jest niski; każdy call niesie cały prompt wiedzy
MAX_RATE_LIMIT_RETRIES = 8
_CALL_SLOTS = asyncio.Semaphore(MAX_CONCURRENT_CALLS)


def retry_delay(headers, attempt: int) -> float:
    """Ile czekać po 429: Retry-After, potem x-ratelimit-reset-tokens ('1m2s', '46.8s', '120ms'), inaczej backoff."""
    retry_after = headers.get("Retry-After")
    if retry_after:
        try:
            return float(retry_after)
        except ValueError:
            pass
    reset = headers.get("x-ratelimit-reset-tokens")
    if reset:
        parts = re.findall(r"(\d+(?:\.\d+)?)(ms|m|s)", reset)
        if parts:
            unit = {"ms": 0.001, "s": 1, "m": 60}
            return round(sum(float(v) * unit[u] for v, u in parts), 3)
    return min(60.0, 5.0 * 2 ** (attempt - 1))


async def chat_request(prompt, model=None):
    global CHAT_REQUESTS
    model = model or chat_model
    body = build_chat_body(prompt, model, REASONING_EFFORT, SERVICE_TIER)
    timeout = aiohttp.ClientTimeout(total=900)  # Flex bywa wolny
    async with _CALL_SLOTS:
        async with aiohttp.ClientSession(timeout=timeout) as session:
            for attempt in range(1, MAX_RATE_LIMIT_RETRIES + 1):
                try:
                    async with session.post('https://api.openai.com/v1/chat/completions', json=body, headers={"Authorization": f"Bearer {API_KEY}"}) as response:
                        if response.status == 429 and attempt < MAX_RATE_LIMIT_RETRIES:
                            fallback = standard_tier_fallback(body)
                            if fallback:
                                print("429 w trybie Flex (brak mocy) — ponawiam w trybie standardowym")
                                body = fallback
                                continue
                            wait = retry_delay(response.headers, attempt) + 1
                            print(f"429 (limit tokenów) — czekam {wait:.0f}s, próba {attempt}/{MAX_RATE_LIMIT_RETRIES}")
                            await asyncio.sleep(wait)
                            continue
                        if response.status != 200:
                            raise Exception(f"Request failed with status code {response.status}: {(await response.text())[:300]}")
                        result = await response.json()
                        CHAT_REQUESTS += 1
                        usage = result.get("usage") or {}
                        counters = [USAGE, FLEX_USAGE] if body.get("service_tier") == "flex" else [USAGE]
                        for counter in counters:
                            counter["prompt"] += usage.get("prompt_tokens", 0)
                            counter["cached"] += (usage.get("prompt_tokens_details") or {}).get("cached_tokens", 0)
                            counter["completion"] += usage.get("completion_tokens", 0)
                        return clean_model_text(result['choices'][0]['message']['content'])
                except Exception as e:
                    print(f"Error during API call: {e}")
                    raise



def title_prompt(KEYWORD, lang):
    lang_instruction = get_language_instruction(lang)

    return f"""
    {CONTEXT}
    
    {lang_instruction}

    Pisz w języku: {lang}

    Na bazie keyworda {KEYWORD} zaproponuj tytuł na bloga.

    Użyj słowa kluczowego: {KEYWORD} dokładnie w tej formie, najlepiej na początku tytułu.

    Tytuł nie może mieć więcej niż 50 znaków.

    Niech tytuł będzie konkretny i naturalny, bez clickbaitu, cen i obietnic.

    Nie pisz nic innego oprócz tytułu.

    """


def headers_prompt(KEYWORD, H1, lang):
    lang_instruction = get_language_instruction(lang)

    return f"""
    {CONTEXT}

    {lang_instruction}

    Pisz w języku: {lang}



    Napisz strukturę nagłówków do bloga o tytule {H1}

    Zasady:
    - Jeden nagłówek H1 (na początku) i 5-7 nagłówków H2. Nie pisz żadnego tekstu poza nagłówkami.
    - Każdy H2 to INNY aspekt tematu, wynikający z faktów w sekcji wiedzy. Żadnych dwóch nagłówków o tym samym (np. dwóch o pielęgnacji albo dwóch o bólu).
    - Nagłówki mają być konkretne (odpowiadają na realne pytanie czytelnika), nie ogólnikowe ("Znaczenie…", "Kluczowe aspekty…", "Podsumowanie").
    - Każdy nagłówek ma najwyżej 70 znaków.
    - Frazę kluczową {KEYWORD} dokładnie w tej formie wpleć maksymalnie w dwóch nagłówkach (H1 się nie liczy); w pozostałych użyj innych słów.
    - Ostatni H2 zaprasza do zrobienia takiego tatuażu u mnie: bezpłatna konsultacja i autorski projekt w Studio Lewus Ink w Mszanie Dolnej. Konsultacja jest tematem TYLKO w ostatnim H2 — żaden wcześniejszy nagłówek nie jest o niej.

    Nagłówki pisz w formacie:
    H1: Pierwszy tytuł
    H2: Drugi tytuł
    H2: ...
    H2: ...
    H2: ...
    H2: ...
    H2: ...
    """

def try_to_split(text):
    if text is None:
        print("Cannot split None text")
        return

    import re

    # Normalizacja końców linii. Uwaga: poprzednio `text.replace(...)` było no-opem
    # (string jest niemutowalny, wynik nie był przypisywany).
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    text = re.sub(r'\n{3,}', '\n\n', text)

    # 1) preferuj podział po pustych liniach
    rows = [r.strip() for r in text.split("\n\n") if r.strip()]
    # 2) jeśli za mało — podziel po pojedynczych liniach
    if len(rows) < 3:
        rows = [r.strip() for r in text.split("\n") if r.strip()]
    # 3) awaryjnie: model zwrócił nagłówki w jednej linii / nietypowym formacie
    #    (częste przy obcych językach z generycznym promptem) — rozbij po
    #    znacznikach H1..H6 niezależnie od białych znaków.
    if len(rows) < 3:
        parts = re.split(r'(?=\bH[1-6]\b)', text)
        rows = [p.strip() for p in parts if p.strip()]

    if len(rows) < 3:
        raise Exception("Too few rows")

    return rows


MIN_HEADERS, MAX_HEADERS = 5, 9   # H1 + 4-8 H2


def headers_good(headers):
    h1_count = 0

    if not MIN_HEADERS <= len(headers) <= MAX_HEADERS:
        print(f"Zła liczba nagłówków: {len(headers)} (oczekiwano {MIN_HEADERS}-{MAX_HEADERS})")
        return False

    for i in range(len(headers)):
        if not headers[i].startswith("H"):
            #print(f"Invalid header format at index {i}: {headers[i]}")
            return False

        if "h1" in headers[i].lower():
            h1_count += 1

        if i > 0:
            previous_level = int(headers[i-1][1])
            current_level = int(headers[i][1])
            if current_level > previous_level + 1:
                print(f"Header level jump at index {i}: {headers[i-1]} to {headers[i]}")
                return False

    if h1_count != 1:
        print(f"Invalid number of H1 headers: found {h1_count}, expected 1")
        return False

    return True


def fix_title(title: str) -> str:
    """Model potrafi zacząć tytuł od frazy pisanej małą literą."""
    title = title.strip()
    return title[:1].upper() + title[1:]


async def get_h1(keyword, lang):
    return fix_title(await chat_request(title_prompt(keyword, lang)))


async def get_headers(keyword, h1, lang, tries=10):
    headers_response = await chat_request(headers_prompt(keyword, h1, lang))

    headers = try_to_split(headers_response)

    for i in range(len(headers)):
        headers[i] = headers[i].replace("\n", "").replace("\"", "").replace("#", "").strip()
        if headers[i] == "" or headers[i] == " ":
            headers[i] = None

    headers = [header for header in headers if header is not None]

    if headers_good(headers):
        return headers
    else:
        tries -= 1
        if tries <= 0:
            print("Too many tries, restart")
            raise ValueError("Too many tries, could not generate valid headers.")
        return await get_headers(keyword, h1, lang, tries)



def sketch_prompt(keyword, headers, lang):
    lang_instruction = get_language_instruction(lang)
    return f"""
    {CONTEXT}

    {lang_instruction}

    Pisz w języku: {lang}


    Na podstawie słowa kluczowego: {keyword} oraz struktury nagłówków, przygotuj zarys bloga. Do każdego nagłówka napisz zarys (1-2 zdania): jakie KONKRETNE fakty z sekcji wiedzy tu opisać i jaki jeden wątek ta sekcja rozwija. Rozdziel fakty między sekcje tak, aby żaden nie powtarzał się w dwóch miejscach.

    Jeden zarys na jeden nagłówek.

    Każdy zarys w jednej linii.

    Oddzielaj zarysy pustymi pojedyńczymi liniami

    Nagłówki:
    {headers}
    """


async def get_sketch(keyword, headers, lang, tries=3):
    if tries <= 0:
        raise ValueError("Too many tries, could not generate valid sketches.")

    sketch_response = await chat_request(sketch_prompt(keyword, headers, lang))
    sketches = try_to_split(sketch_response)

    for i in range(len(headers)):
        for j in range(len(sketches)):
            if headers[i] in sketches[j]:
                sketches[j] = sketches[j].replace(headers[i], "")
            sketches[j] = sketches[j].replace("\n", "").strip()

    sketches = [s for s in sketches if s.strip() != ""]

    #print(f"Length of headers: {len(headers)}")
    #print(f"Length of sketches: {len(sketches)}")

    if len(headers) != len(sketches):
        #print("Headers and sketches are not the same length, restart")
        return await get_sketch(keyword, headers, lang, tries - 1)

    return sketches



def keyword_slots(n):
    """Indeksy sekcji, w których wolno użyć dokładnej frazy kluczowej: pierwsza, środkowa, ostatnia."""
    return {0, n // 2, n - 1}


def description_prompt(keyword, h1, header, sketch, lang, use_keyword=False, other_headers=None, is_last=False):
    lang_instruction = get_language_instruction(lang)
    if use_keyword:
        keyword_rule = f"Użyj frazy kluczowej: {keyword} dokładnie RAZ, w tej formie, naturalnie w środku zdania (nie na końcu akapitu)."
    else:
        keyword_rule = f"NIE używaj dokładnej frazy: {keyword}. Pisz o temacie innymi słowami, synonimami i formami zależnymi."
    if is_last:
        cta_rule = "To ostatnia sekcja: zakończ konkretnym następnym krokiem — bezpłatna konsultacja u mnie w Studio Lewus Ink w Mszanie Dolnej (formularz na stronie lub Instagram). Jedno-dwa zdania, bez nachalności."
    else:
        cta_rule = "NIE zapraszaj na konsultację ani do kontaktu — to robi tylko ostatnia sekcja. Skup się na wiedzy."
    others = "\n".join(f"    - {h}" for h in (other_headers or []) if h != header)
    return f"""
    {CONTEXT}

    {lang_instruction}

    Pisz w języku: {lang}

    Napisz treść jednej sekcji bloga: {header}. Blog ma tytuł: {h1}.

    Zarys tej sekcji (trzymaj się go): {sketch}

    Pozostałe sekcje tego wpisu — NIE powtarzaj ich treści, każda ma swój wątek:
{others}

    Zasady:
    - Długość 150-200 słów. Wypełnij ją konkretami z sekcji wiedzy (przykłady, kroki, pytania do zadania tatuażyście), nie ogólnikami.
    - Konkrety opieraj na sekcji wiedzy; jeśli faktu brak, napisz krótko i ogólnie, bez liczb, nazw i obietnic.
    - {keyword_rule}
    - Listę punktowaną (linie zaczynające się od "- ") dodaj tylko wtedy, gdy wymieniasz kryteria lub kroki; punkt = jedno zdanie.
    - Jeśli sekcja ma dwa wyraźne wątki, możesz dodać jeden podtytuł w osobnej linii w formacie 'H3: Tytuł 3-6 słów'. Nie zaczynaj sekcji od podtytułu.
    - {cta_rule}
    - Zakazane słowa: "kluczowy", "istotny", "warto", "nowoczesny", "zaawansowany", "intuicyjny", "niezauważalny", "znaczący/znaczne". Nie opisuj jakości bez faktu (szybki, wygodny, niezawodny).
    - Nie pisz tytułu sekcji na początku, tylko od razu treść.
    """

async def get_descriptions(keyword, h1, headers, sketch, lang):
    descriptions = []
    tasks = []

    slots = keyword_slots(len(headers))
    for i, h in enumerate(headers):
        task = chat_request(description_prompt(keyword, h1, h, sketch[i], lang,
                                               use_keyword=i in slots, other_headers=headers,
                                               is_last=i == len(headers) - 1))
        tasks.append(task)

    responses = await asyncio.gather(*tasks)

    for response in responses:
        descriptions.append(response.strip())

    return descriptions


async def remix_h1(old_h1, keyword, lang, tries=3):
    if tries <= 0:
        print("Remix H1 failed: Too many tries. Returning original title.")
        return old_h1

    words = len(old_h1.split(" "))
    remix_prompt = f"""
    {CONTEXT}

    Mamy tytuł bloga: \"{old_h1}\". Wygeneruj jeden nowy tytuł, używając innych słów, ale zachowując ten sam sens. Tytuł ma mieć podobną długość co ten poprzedni (około {words} słów) Nie dodawaj żadnego dodatkowego tekstu, tylko nowy tytuł w jednej linii.

    Zachowaj w treściach keyword: {keyword} dokładnie w takiej formie, nieodmienionej.

    Zachowaj format \"H2: Treść tytułu\"
    Zachowaj format \"H2: Treść tytułu\"
    
    {get_language_instruction(lang)}
    Pisz w języku: {lang}

    """

    try:
        response = await chat_request(remix_prompt)

        new_title = response.strip()

        if not new_title.startswith("H2: "):
            print(f"Invalid title format: {new_title}")
            print("Retrying remix_h1...")
            return await remix_h1(old_h1, keyword, lang, tries - 1)

        return "H2: " + fix_title(new_title[len("H2: "):])
    except Exception as e:
        print(f"Błąd podczas remiksowania H1: {e}")
        print("Retrying remix_h1...")
        return await remix_h1(old_h1, keyword, lang, tries - 1)


# Wpis po redakcji ma mieć co najmniej 800 słów (decyzja 2026-10-19). Redakcja usuwa powtórzenia
# i asekuracje; gdy zetnie za dużo — druga próba, potem zostaje wersja bez redakcji.
EDIT_MIN_WORDS = 800
EDIT_TARGET_WORDS = 850
_SECTION_MARK = re.compile(r"^=== SEKCJA (\d+) ===\s*$", re.MULTILINE)
_HEADER_LINE = re.compile(r"^\s*H[12]:.*\n*", re.MULTILINE)


def editor_prompt(keyword, h1, headers, descriptions):
    """Jedno przejście po całym wpisie: sekcje pisane osobno powtarzają się i asekurują."""
    article = "\n\n".join(
        f"=== SEKCJA {i} ===\n{header}\n{body}"
        for i, (header, body) in enumerate(zip(headers, descriptions), start=1)
    )
    return f"""
    {CONTEXT}

    Jesteś redaktorem. Poniżej cały wpis na blog "{h1}" (fraza kluczowa: {keyword}), pisany sekcjami przez różne osoby.

    Zredaguj treść sekcji:
    - Usuń zdania, które powtarzają to, co jest już w innej sekcji. Każda informacja zostaje tylko w jednym miejscu, tam gdzie najbardziej pasuje.
    - Usuń zastrzeżenia typu "nie należy zakładać", "nie oznacza to", "nie można obiecać" — zostaw najwyżej jedno w całym wpisie.
    - Usuń wypełniacze i zdania-morały na końcu sekcji.
    - NIE dodawaj nowych faktów, liczb, nazw ani obietnic. NIE zmieniaj sensu.
    - Dokładną frazę "{keyword}" zostaw tylko tam, gdzie już jest; nie dopisuj jej.
    - Zachowaj format: podtytuły "H3: ...", punkty zaczynające się od "- ", akapity oddzielone pustą linią.
    - Nie przepisuj nagłówków H2, nie skracaj sekcji bardziej, niż wymaga usunięcie powtórzeń.
    - Całość po redakcji ma mieć co najmniej {EDIT_TARGET_WORDS} słów. Wycinaj tylko powtórzenia i puste zastrzeżenia;
      konkretów, kroków i przykładów nie skracaj. Jeśli po usunięciu powtórzeń sekcja jest za krótka,
      rozwiń ją faktami z sekcji wiedzy, które jeszcze nie padły we wpisie.

    Zwróć wszystkie {len(headers)} sekcje w tej samej kolejności, każdą poprzedzoną linią "=== SEKCJA n ===" (bez nagłówka H2), i nic poza nimi.

    {article}
    """


def parse_edited(response, count):
    """Treści sekcji z odpowiedzi redaktora albo None, gdy liczba sekcji się nie zgadza."""
    parts = _SECTION_MARK.split(response or "")
    # Nagłówki H1/H2 składa write_blog; redaktor czasem je przepisuje do treści.
    bodies = [_HEADER_LINE.sub("", parts[i + 1]).strip() for i in range(1, len(parts) - 1, 2)]
    if len(bodies) != count or not all(bodies):
        return None
    return bodies


def accept_edit(original, edited):
    return guards.word_count(edited) >= EDIT_MIN_WORDS


async def edit_blog(keyword, h1, headers, descriptions, attempts=2):
    before = guards.word_count(descriptions)
    for attempt in range(1, attempts + 1):
        edited = parse_edited(await chat_request(editor_prompt(keyword, h1, headers, descriptions)), len(descriptions))
        if edited is None:
            print(f"⚠️ Redakcja (próba {attempt}): zła liczba sekcji")
            continue
        after = guards.word_count(edited)
        if accept_edit(descriptions, edited):
            print(f"✂️ Redakcja: {before} → {after} słów")
            return edited
        print(f"⚠️ Redakcja (próba {attempt}) za krótka: {before} → {after} słów (minimum {EDIT_MIN_WORDS})")
    print("⚠️ Zostaje wersja bez redakcji")
    return descriptions


async def write_blog(keyword, lang):
    # Fakty IOVI INK siedzą w CONTEXT (prefiks każdego promptu) — bez osobnego calla "bazy wiedzy".
    h1 = await get_h1(keyword, lang)

    headers = await get_headers(keyword, h1, lang)
    if(VERBOSE):
        print("\n")
        for h in headers:
            if "H1" in h:
                print(h)
            elif "H2" in h:
                print(f"\t{h}")
            else:
                print(f"\t\t{h}")
        print("\n")

    # Get the sketches
    sketches = await get_sketch(keyword, headers, lang)

    # Get the descriptions
    descriptions = await get_descriptions(keyword, h1, headers, sketches, lang)
    descriptions = await edit_blog(keyword, h1, headers, descriptions)
    if(VERBOSE):
        print("\n")
        for d in descriptions:
            print(headers[descriptions.index(d)])
            print(d + "\n\n")

    # first title change from h1 to h2 and remix
    headers[0] = headers[0].replace("H1", "H2")
    headers[0] = await remix_h1(headers[0], keyword, lang)

    print("Remixed title >", headers[0])

    # Write the blog data to a file
    blog_data = {
        "keyword": keyword,
        "title": h1,
        "headers": headers,
        "descriptions": descriptions,
        "flagi": (lambda t: guards.find_flags(t) + guards.style_flags(t, keyword))("\n".join([h1] + headers + descriptions))
                 + guards.length_flags(descriptions),
    }
    if blog_data["flagi"]:
        print(f"⚠️ {len(blog_data['flagi'])} flag do sprawdzenia w '{keyword}' (ceny/procenty/dotacje)")

    unique_id = str(uuid4())[:8]
    import re
    safe_h1 = re.sub(r'[^\w\-]+', '_', h1, flags=re.UNICODE).strip('_')[:80]
    filename = f"{unique_id}_{safe_h1}.json"
    file_path = os.path.join(BLOG_SAVE_DIR, filename)
    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(blog_data, file, indent=4, ensure_ascii=False)

    return filename


async def write_blog_async(keyword, lang, max_retries: int = 5, initial_delay: float = 1.0) -> str:
    """
    Attempt to write a blog with bounded retries to avoid recursive overflow.
    """
    delay = initial_delay
    for attempt in range(1, max_retries + 1):
        try:
            print()
            print(f"Writing blog for keyword '{keyword}' (attempt {attempt}/{max_retries})")
            return await write_blog(keyword, lang)
        except Exception as e:
            print(f"Error in writing blog for keyword '{keyword}' on attempt {attempt}: {e}")
            if attempt == max_retries:
                print("Max retries reached; aborting.")
                raise
            print(f"Retrying in {delay:.1f}s...")
            await asyncio.sleep(delay)
            delay *= 2



STYLE_RULES = (
    "STYL (obowiązuje bezwzględnie):\n"
    "- Piszesz jako Jowita, tatuażystka: w 1. osobie liczby pojedynczej, rodzaj żeński (\"projektuję\", \"zrobiłam\"), na \"Ty\" do czytelnika.\n"
    "- Konkretnie, krótkimi zdaniami, bez patosu — jak tatuażystka, która tłumaczy klientce, na co zwrócić uwagę.\n"
    "- O sobie nigdy w 3. osobie (\"Jowita projektuje…\", \"IOVI INK oferuje…\").\n"
    "- Każdy akapit wnosi NOWĄ informację z sekcji wiedzy. Nie powtarzaj tego, co jest w innych sekcjach wpisu.\n"
    "- Bez wypełniaczy: \"kluczowy\", \"istotny\", \"niezwykle ważny\", \"warto zauważyć\", \"nieoceniony\", \"wyobraź sobie\". "
    "Bez zdań o samym artykule (\"w artykule omówimy\", \"podsumowując\").\n"
    "- Frazy kluczowej NIE doklejaj na końcu akapitów. Poza wskazanymi miejscami używaj synonimów i form zależnych.\n"
    "- Gdy w wiedzy brakuje faktu, napisz krótko i ogólnie — lepszy krótszy tekst niż lanie wody.\n"
    "- Nie asekuruj się zdaniami typu \"nie należy zakładać\", \"nie oznacza to\", \"nie można obiecać\". "
    "Czego nie wiesz, po prostu nie pisz. Najwyżej jedno takie zastrzeżenie na wpis, gdy chroni czytelnika przed realnym błędem.\n"
    "- Stosuj się do listy ZAKAZANYCH zdań i schematów z sekcji wiedzy."
)


def build_context(lang, company_description="", extra_context="", site_url="", knowledge=""):
    """Kontekst doklejany na górę KAŻDEGO promptu.

    Kolejność ma znaczenie dla prompt cachingu OpenAI: najpierw części stałe
    (zasady faktów + wiedza IOVI INK), zmienne dopiero potem.
    """
    lang_instruction = get_language_instruction(lang)
    parts = [kontekst.FACT_RULES, "\n" + STYLE_RULES]
    if knowledge:
        parts.append("\nWIEDZA O IOVI INK (jedyne dozwolone źródło faktów):\n" + knowledge.strip())
    parts += [
        "\n" + lang_instruction,
        f"Język: {lang}",
        f"Dzisiaj jest {time.strftime('%d.%m.%Y')}.",
        "Pisz informacje które są przydatne i trafne na dzisiejszy dzień.",
        "Jeśli jakieś informację są nieadekwatne na dzisiejszy dzień to je pomiń.",
        "Nie pisz w treściach o tym jak ktoś może się skontaktować z innymi tatuażystami lub studiami.",
    ]
    if site_url:
        parts.append(f"Piszesz blogi na stronę: {site_url}")
    if company_description:
        parts.append(f"\nOpis firmy, dla której piszesz:\n{company_description.strip()}")
    if extra_context:
        parts.append("\nDodatkowy kontekst:\n" + extra_context.strip())
    return "\n".join(parts)


# Główne wejście: lista fraz -> pliki JSON w BLOG_SAVE_DIR (zwraca nazwy plików)
async def main(keywords, company_description, lang, extra_context="", site_url="", knowledge_dir=kontekst.DEFAULT_DIR):
    global CONTEXT
    results = []
    for keyword in keywords:
        try:
            # Moduły wiedzy dobierane per fraza (bez LLM); pętla sekwencyjna, więc global jest bezpieczny.
            CONTEXT = build_context(lang, company_description, extra_context, site_url,
                                    knowledge=kontekst.build_knowledge(keyword, knowledge_dir))
            filename = await write_blog_async(keyword, lang)
            results.append(filename)
        except Exception as e:
            # Nie wywalaj całej paczki przez jeden problematyczny keyword.
            print(f"Pomijam keyword '{keyword}' — nie udało się wygenerować bloga: {e}")
            continue
    return results
