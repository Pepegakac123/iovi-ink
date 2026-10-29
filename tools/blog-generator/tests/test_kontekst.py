import json

import pytest

import kontekst

MAPA = {
    "falownik": ["falownik", "inwerter"],
    "dla_firm": ["firm", "przemysł"],
    "magazyn": ["magazyn"],
}


def test_select_modules_by_keyword_stem():
    assert kontekst.select_modules("falownik hybrydowy", MAPA) == ["falownik"]


def test_select_modules_case_and_diacritics_insensitive():
    result = kontekst.select_modules("Magazyn Energii PRZEMYSŁOWY", MAPA)
    assert set(result) == {"magazyn", "dla_firm"}


def test_select_modules_none_when_no_match():
    assert kontekst.select_modules("pompa ciepła", MAPA) == []


def test_select_modules_limited_and_ordered_by_hits():
    mapa = {"a": ["magazyn"], "b": ["energii", "magazyn"], "c": ["energii"]}
    result = kontekst.select_modules("magazyn energii", mapa, limit=2)
    assert result == ["b", "a"]  # remis rozstrzyga kolejność w mapie


def test_build_knowledge_joins_core_and_modules(tmp_path):
    (tmp_path / "tematy").mkdir()
    (tmp_path / "core.md").write_text("CORE FAKTY", encoding="utf-8")
    (tmp_path / "tematy" / "falownik.md").write_text("MODUL FALOWNIK", encoding="utf-8")
    (tmp_path / "mapa.json").write_text(json.dumps(MAPA), encoding="utf-8")

    text = kontekst.build_knowledge("falownik hybrydowy", str(tmp_path))

    assert text.index("CORE FAKTY") < text.index("MODUL FALOWNIK")


def test_build_knowledge_skips_missing_module_file(tmp_path):
    (tmp_path / "tematy").mkdir()
    (tmp_path / "core.md").write_text("CORE", encoding="utf-8")
    (tmp_path / "mapa.json").write_text(json.dumps(MAPA), encoding="utf-8")

    assert kontekst.build_knowledge("falownik", str(tmp_path)) == "CORE"


def test_build_knowledge_requires_core(tmp_path):
    with pytest.raises(FileNotFoundError):
        kontekst.build_knowledge("falownik", str(tmp_path))


def test_facts_rules_forbid_prices():
    assert "cen" in kontekst.FACT_RULES.lower()
    assert "WYŁĄCZNIE" in kontekst.FACT_RULES


def test_build_knowledge_appends_banned_phrases_when_present(tmp_path):
    (tmp_path / "core.md").write_text("CORE", encoding="utf-8")
    (tmp_path / "zakazane.md").write_text("ZAKAZ-XYZ", encoding="utf-8")
    text = kontekst.build_knowledge("cokolwiek", str(tmp_path))
    assert "CORE" in text and "ZAKAZ-XYZ" in text
    assert text.index("CORE") < text.index("ZAKAZ-XYZ")


def test_build_knowledge_works_without_banned_phrases(tmp_path):
    (tmp_path / "core.md").write_text("CORE", encoding="utf-8")
    assert kontekst.build_knowledge("x", str(tmp_path)) == "CORE"
