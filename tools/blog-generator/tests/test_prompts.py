import blog_writing as bw
import guards


def setup_function(_):
    bw.CONTEXT = "KONTEKST"


def test_keyword_slots_first_middle_last():
    assert bw.keyword_slots(7) == {0, 3, 6}
    assert bw.keyword_slots(3) == {0, 1, 2}
    assert bw.keyword_slots(1) == {0}


def test_description_prompt_allows_phrase_once_only_in_slot():
    on = bw.description_prompt("fraza x", "Tytuł", "H2: Sekcja", "zarys", "pl", use_keyword=True, other_headers=["H2: Inna"])
    off = bw.description_prompt("fraza x", "Tytuł", "H2: Sekcja", "zarys", "pl", use_keyword=False, other_headers=["H2: Inna"])
    assert "dokładnie RAZ" in on
    assert "NIE używaj dokładnej frazy" in off
    assert "dokładnie RAZ" not in off


def test_description_prompt_is_deterministic_and_lists_other_sections():
    a = bw.description_prompt("f", "T", "H2: A", "z", "pl", other_headers=["H2: B", "H2: C"])
    b = bw.description_prompt("f", "T", "H2: A", "z", "pl", other_headers=["H2: B", "H2: C"])
    assert a == b
    assert "H2: B" in a and "H2: C" in a


def test_description_prompt_limits_length():
    p = bw.description_prompt("f", "T", "H2: A", "z", "pl")
    # Cel 800+ słów po redakcji (2026-10-19): ~1100 słów przed redakcją.
    assert "150-200" in p
    assert "200 SŁÓW" not in p


def test_headers_prompt_asks_for_few_concrete_headers():
    p = bw.headers_prompt("fraza x", "Tytuł", "pl")
    assert "5-7" in p
    assert "maksymalnie w dwóch" in p


def test_headers_good_rejects_too_many_headers():
    many = ["H1: T"] + [f"H2: s{i}" for i in range(12)]
    assert bw.headers_good(many) is False


def test_headers_good_accepts_reasonable_count():
    ok = ["H1: T"] + [f"H2: s{i}" for i in range(6)]
    assert bw.headers_good(ok) is True


def test_context_contains_style_rules():
    ctx = bw.build_context("pl", "", "", "", knowledge="K")
    assert "STYL" in ctx
    assert "3. osobie" in ctx


def test_style_flags_keyword_overuse():
    text = "Magazyn energii bez fotowoltaiki. " * 12
    flags = guards.style_flags(text, "magazyn energii bez fotowoltaiki")
    assert any(f["kind"] == "fraza" for f in flags)


def test_style_flags_filler_words():
    flags = guards.style_flags("To kluczowy, kluczowa i kluczowe. " * 5, "x")
    assert any(f["kind"] == "wypełniacz" for f in flags)


def test_style_flags_clean_text():
    assert guards.style_flags("Zwykły tekst o magazynie.", "magazyn energii") == []


def test_cta_only_in_last_section():
    mid = bw.description_prompt("f", "T", "H2: A", "z", "pl", is_last=False)
    last = bw.description_prompt("f", "T", "H2: A", "z", "pl", is_last=True)
    assert "NIE zapraszaj na konsultację" in mid
    assert "bezpłatna konsultacja" in last and "NIE zapraszaj na konsultację" not in last


def test_description_prompt_bans_quality_adjectives_and_filler():
    p = bw.description_prompt("f", "T", "H2: A", "z", "pl")
    assert "kluczowy" in p and "intuicyjny" in p


def test_headers_prompt_analysis_only_in_last_header():
    p = bw.headers_prompt("f", "T", "pl")
    assert "TYLKO w ostatnim" in p


# Poprawki po porównaniu modeli 2026-10-19

def test_fact_rules_allow_price_factors_without_numbers():
    import kontekst
    assert "od czego zależy cena" in kontekst.FACT_RULES
    assert "bez kwot" in kontekst.FACT_RULES


def test_style_rules_forbid_hedging():
    ctx = bw.build_context("pl", "", "", "", knowledge="K")
    assert "nie należy zakładać" in ctx


def test_style_flags_hedging_overuse():
    text = "Nie należy zakładać, że tak. Nie oznacza to, że nie. " * 3
    flags = guards.style_flags(text, "fraza")
    assert any(f["kind"] == "asekuracja" for f in flags)


def test_length_flag_below_800_words():
    assert guards.length_flags(["słowo " * 799]) == [{"kind": "długość", "snippet": "799 słów (minimum 800)"}]
    assert guards.length_flags(["słowo " * 400, "słowo " * 400]) == []


def test_build_knowledge_uses_up_to_three_sheets():
    import inspect
    import kontekst
    assert inspect.signature(kontekst.build_knowledge).parameters["limit"].default == 3


def test_style_flags_single_hedge_is_fine():
    flags = guards.style_flags("Nie oznacza to, że bateria zasili cały dom.", "fraza")
    assert not any(f["kind"] == "asekuracja" for f in flags)


def test_fix_title_capitalizes_first_letter_only():
    assert bw.fix_title("magazyn energii bez fotowoltaiki – kiedy ma sens?") == "Magazyn energii bez fotowoltaiki – kiedy ma sens?"
    assert bw.fix_title("EMS a taryfa") == "EMS a taryfa"


def test_remixed_first_header_is_capitalized(monkeypatch):
    import asyncio

    async def fake_chat(prompt, model=None):
        return "H2: ile kosztuje magazyn energii i co wpływa na wycenę?"

    monkeypatch.setattr(bw, "chat_request", fake_chat)

    out = asyncio.run(bw.remix_h1("H2: Ile kosztuje magazyn energii?", "ile kosztuje magazyn energii", "pl"))
    assert out == "H2: Ile kosztuje magazyn energii i co wpływa na wycenę?"


def test_headers_prompt_limits_header_length():
    assert "70 znaków" in bw.headers_prompt("fraza x", "Tytuł", "pl")
