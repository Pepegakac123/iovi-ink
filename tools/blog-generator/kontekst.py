"""Wiedza o IOVI INK (Jowita, Studio Lewus Ink) doklejana na górę każdego promptu.

Układ katalogu `kontekst/`:
  core.md          — rdzeń (firma, oferta, ton, zakazy); zawsze dołączany
  zakazane.md      — zdania/frazy, których model nie ma używać (opcjonalny, zawsze dołączany po core)
  tematy/<id>.md   — arkusze faktów per temat
  mapa.json        — {"<id>": ["fragment frazy", ...]}; wybór modułów bez LLM

Fakty idą na początek promptu (stały prefiks), żeby zadziałał prompt caching OpenAI.
"""
import json
import os

DEFAULT_DIR = os.path.join(os.path.dirname(__file__), "kontekst")

FACT_RULES = (
    "ZASADY FAKTÓW (obowiązują bezwzględnie):\n"
    "- Opieraj się WYŁĄCZNIE na faktach z sekcji wiedzy poniżej. Gdy faktu brakuje, pisz ogólnie "
    "i nie podawaj liczb, nazw, dat ani obietnic.\n"
    "- Nie podawaj cen, widełek cenowych ani kosztów w złotówkach.\n"
    "- Gdy fraza dotyczy ceny lub kosztu: opisz, od czego zależy cena (wielkość, styl, miejsce na ciele, "
    "stopień skomplikowania, czas pracy) — bez kwot. Czytelnik ma wiedzieć, co przygotować do wyceny.\n"
    "- Nie dawaj porad medycznych poza podstawową pielęgnacją; nie wymieniaj nazw leków, maści ani marek kosmetyków. "
    "Przy niepokojących objawach odsyłaj do lekarza.\n"
    "- Nie obiecuj, że tatuaż nie będzie bolał, ani konkretnego efektu po latach.\n"
    "- Nie wymieniaj innych tatuażystów i studiów ani nie porównuj się z nimi.\n"
    "- Nie pisz, że wykonuję style spoza sekcji wiedzy (np. realizm, portrety, pełny kolor)."
)


def select_modules(keyword: str, mapa: dict, limit: int = 3) -> list[str]:
    """Moduły, których słowa występują we frazie (najwięcej trafień pierwsze, remis = kolejność w mapie)."""
    text = keyword.casefold()
    scored = []
    for index, (module, stems) in enumerate(mapa.items()):
        hits = sum(1 for stem in stems if stem.casefold() in text)
        if hits:
            scored.append((-hits, index, module))
    scored.sort()
    return [module for _, _, module in scored[:limit]]


def _read(path: str) -> str:
    with open(path, encoding="utf-8") as f:
        return f.read().strip()


def build_knowledge(keyword: str, directory: str = DEFAULT_DIR, limit: int = 3) -> str:
    """Rdzeń + do `limit` modułów tematycznych dopasowanych do frazy."""
    parts = [_read(os.path.join(directory, "core.md"))]
    banned_path = os.path.join(directory, "zakazane.md")
    if os.path.isfile(banned_path):
        parts.append(_read(banned_path))
    mapa_path = os.path.join(directory, "mapa.json")
    if os.path.isfile(mapa_path):
        with open(mapa_path, encoding="utf-8") as f:
            mapa = json.load(f)
        for module in select_modules(keyword, mapa, limit):
            path = os.path.join(directory, "tematy", f"{module}.md")
            if os.path.isfile(path):
                parts.append(_read(path))
    return "\n\n".join(parts)
