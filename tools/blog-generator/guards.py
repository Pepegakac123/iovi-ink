"""Twarde flagi: rzeczy, których blog IOVI INK nie powinien zawierać (ceny, obietnice, porady medyczne)."""
import re

_PATTERNS = {
    "cena": re.compile(r"\d[\d\s.,]*\s?(?:zł|złotych|pln)\b", re.IGNORECASE),
    "procent": re.compile(r"\d+(?:[.,]\d+)?\s?%"),
    "obietnica": re.compile(r"bezboles\w+|nic nie poczujesz|najlepsz\w+|numer 1|lider\w*|gwarantuj\w*|gwarancj\w+", re.IGNORECASE),
    "medyczne": re.compile(r"antybiotyk\w*|steryd\w*|bepanthen\w*|alantan\w*|tormentiol\w*|octenisept\w*|maś\w* z antybiotykiem|leki? przeciwzapaln\w*", re.IGNORECASE),
}


def find_flags(text: str) -> list[dict]:
    flags = []
    for kind, pattern in _PATTERNS.items():
        for match in pattern.finditer(text or ""):
            start = max(0, match.start() - 30)
            flags.append({"kind": kind, "snippet": text[start:match.end() + 30].replace("\n", " ")})
    return flags


MIN_WORDS = 800        # decyzja 2026-10-19: krótszy wpis nie idzie automatycznie na stronę


def word_count(texts) -> int:
    return sum(len(t.split()) for t in texts)


def length_flags(descriptions) -> list[dict]:
    words = word_count(descriptions)
    if words < MIN_WORDS:
        return [{"kind": "długość", "snippet": f"{words} słów (minimum {MIN_WORDS})"}]
    return []


KEYWORD_LIMIT = 8     # łącznie w całym wpisie (tytuł + nagłówki + treść)
FILLER_LIMIT = 6       # "kluczow*" / "istotn*" / "warto" łącznie
HEDGE_LIMIT = 3        # "nie należy zakładać" / "nie oznacza" itp. — GPT-6 przesadnie się asekuruje
_HEDGES = re.compile(r"nie należy zakładać|nie oznacza|nie można obiecać|nie przesądza|nie należy\b", re.IGNORECASE)


def style_flags(text: str, keyword: str) -> list[dict]:
    """Flagi stylu: upychanie frazy kluczowej i wypełniacze ('kluczowy', 'istotny', 'warto')."""
    flags = []
    body = (text or "").casefold()
    count = body.count(keyword.casefold()) if keyword else 0
    if count > KEYWORD_LIMIT:
        flags.append({"kind": "fraza", "snippet": f"fraza '{keyword}' użyta {count}x (limit {KEYWORD_LIMIT})"})
    filler = len(re.findall(r"kluczow\w*|istotn\w*|\bwarto\b", body))
    if filler > FILLER_LIMIT:
        flags.append({"kind": "wypełniacz", "snippet": f"'kluczowy/istotny/warto' użyte {filler}x (limit {FILLER_LIMIT})"})
    hedges = len(_HEDGES.findall(body))
    if hedges > HEDGE_LIMIT:
        flags.append({"kind": "asekuracja", "snippet": f"zastrzeżenia typu 'nie należy zakładać' użyte {hedges}x (limit {HEDGE_LIMIT})"})
    return flags
