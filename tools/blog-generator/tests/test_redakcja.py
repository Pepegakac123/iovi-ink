import asyncio

import blog_writing as bw

HEADERS = ["H2: Pierwsza", "H2: Druga"]
BODIES = ["Treść pierwszej sekcji o taryfie.", "Treść drugiej sekcji o EMS."]


def setup_function(_):
    bw.CONTEXT = "KONTEKST"


def test_editor_prompt_contains_all_sections_with_markers():
    p = bw.editor_prompt("fraza", "Tytuł", HEADERS, BODIES)

    assert "=== SEKCJA 1 ===" in p and "=== SEKCJA 2 ===" in p
    assert "H2: Pierwsza" in p and "Treść drugiej sekcji o EMS." in p
    assert "powtórz" in p.casefold()


def test_parse_edited_returns_bodies_in_order():
    resp = "=== SEKCJA 1 ===\nNowa pierwsza.\n\n=== SEKCJA 2 ===\nNowa druga.\n- punkt"

    assert bw.parse_edited(resp, 2) == ["Nowa pierwsza.", "Nowa druga.\n- punkt"]


def test_parse_edited_drops_rewritten_h1_h2_lines_but_keeps_h3():
    # Przebieg 2026-10-19: redaktor wkleił "H1: tytuł" na początek pierwszej sekcji.
    resp = "=== SEKCJA 1 ===\nH1: Tytuł wpisu\n\nTreść.\nH3: Podtytuł\nDalej.\n=== SEKCJA 2 ===\nH2: Druga\nDruga treść."

    assert bw.parse_edited(resp, 2) == ["Treść.\nH3: Podtytuł\nDalej.", "Druga treść."]


def test_parse_edited_rejects_wrong_section_count():
    assert bw.parse_edited("=== SEKCJA 1 ===\nTylko jedna.", 2) is None


def test_parse_edited_rejects_empty_section():
    assert bw.parse_edited("=== SEKCJA 1 ===\nJest.\n=== SEKCJA 2 ===\n", 2) is None


def test_accept_edit_requires_800_words():
    # Decyzja 2026-10-19: wpis po redakcji ma mieć co najmniej 800 słów.
    original = ["słowo " * 600, "słowo " * 600]
    assert bw.accept_edit(original, ["słowo " * 400, "słowo " * 400]) is True
    assert bw.accept_edit(original, ["słowo " * 390, "słowo " * 390]) is False


def test_editor_prompt_asks_for_minimum_length():
    assert "850 słów" in bw.editor_prompt("fraza", "Tytuł", HEADERS, BODIES)


def test_edit_blog_retries_once_when_edit_too_short(monkeypatch):
    long_bodies = ["słowo " * 600, "słowo " * 600]
    answers = iter([
        f"=== SEKCJA 1 ===\n{'krótko ' * 200}\n=== SEKCJA 2 ===\n{'krótko ' * 200}",
        f"=== SEKCJA 1 ===\n{'dobrze ' * 450}\n=== SEKCJA 2 ===\n{'dobrze ' * 450}",
    ])

    async def fake_chat(prompt, model=None):
        return next(answers)

    monkeypatch.setattr(bw, "chat_request", fake_chat)

    out = asyncio.run(bw.edit_blog("fraza", "Tytuł", HEADERS, long_bodies))
    assert out[0].startswith("dobrze")


def test_edit_blog_keeps_original_when_both_attempts_too_short(monkeypatch):
    long_bodies = ["słowo " * 600, "słowo " * 600]

    async def fake_chat(prompt, model=None):
        return f"=== SEKCJA 1 ===\n{'krótko ' * 200}\n=== SEKCJA 2 ===\n{'krótko ' * 200}"

    monkeypatch.setattr(bw, "chat_request", fake_chat)

    assert asyncio.run(bw.edit_blog("fraza", "Tytuł", HEADERS, long_bodies)) == long_bodies


def test_edit_blog_falls_back_to_original_on_bad_response(monkeypatch):
    async def fake_chat(prompt, model=None):
        return "zła odpowiedź bez znaczników"

    monkeypatch.setattr(bw, "chat_request", fake_chat)

    assert asyncio.run(bw.edit_blog("fraza", "Tytuł", HEADERS, BODIES)) == BODIES


def test_edit_blog_uses_edited_bodies(monkeypatch):
    long_bodies = ["słowo " * 600, "słowo " * 600]

    async def fake_chat(prompt, model=None):
        return f"=== SEKCJA 1 ===\n{'krócej ' * 450}\n=== SEKCJA 2 ===\n{'krócej ' * 450}"

    monkeypatch.setattr(bw, "chat_request", fake_chat)

    out = asyncio.run(bw.edit_blog("fraza", "Tytuł", HEADERS, long_bodies))
    assert out[0].startswith("krócej")
