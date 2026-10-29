"""Prawdziwy katalog kontekst/: każda fraza z kolejki ma arkusz wiedzy, każdy moduł z mapy ma plik."""
import json
import os

import pytest

import kontekst

MAPA = json.load(open(os.path.join(kontekst.DEFAULT_DIR, "mapa.json"), encoding="utf-8"))


def test_every_queued_phrase_has_knowledge_sheet():
    import auto
    missing = [f for f in auto.load_queue() if not kontekst.select_modules(f, MAPA)]
    assert missing == []


@pytest.mark.parametrize("modul", list(MAPA))
def test_every_mapped_module_has_sheet_file(modul):
    assert os.path.isfile(os.path.join(kontekst.DEFAULT_DIR, "tematy", f"{modul}.md"))


@pytest.mark.parametrize("fraza,oczekiwany", [
    ("ile kosztuje tatuaż", "cena"),
    ("czy tatuaż boli", "bol"),
    ("tatuaż na nadgarstku", "miejsca"),
    ("tatuaż za uchem", "miejsca"),
    ("jak dbać o świeży tatuaż", "pielegnacja"),
    ("tatuaż łapka psa", "motywy"),
    ("tatuaż na bliznach", "blizny"),
    ("tatuaż fine line", "style"),
    ("tatuaż dla mamy z imionami dzieci", "okazje"),
    ("tatuaż dla przyjaciółek", "okazje"),
    ("tatuaż na plecach damski", "miejsca"),
    ("tatuaż góry", "motywy"),
    ("ile goi się tatuaż", "pielegnacja"),
])
def test_phrase_hits_its_dedicated_sheet(fraza, oczekiwany):
    assert oczekiwany in kontekst.select_modules(fraza, MAPA)
