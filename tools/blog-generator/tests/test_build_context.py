import blog_writing


def test_build_context_includes_knowledge_and_rules():
    ctx = blog_writing.build_context("pl", "Opis IOVI INK", "", "https://x.pl", knowledge="FAKT-XYZ")
    assert "FAKT-XYZ" in ctx
    assert "Opis IOVI INK" in ctx
    assert "WYŁĄCZNIE" in ctx


def test_build_context_prefix_is_stable():
    a = blog_writing.build_context("pl", "Opis", "", "https://x.pl", knowledge="K")
    b = blog_writing.build_context("pl", "Opis", "", "https://x.pl", knowledge="K")
    assert a == b


def test_knowledge_comes_before_variable_parts():
    # stała część (fakty) na początku => prompt caching OpenAI
    ctx = blog_writing.build_context("pl", "Opis", "", "", knowledge="FAKT-XYZ")
    blog_writing.CONTEXT = ctx
    prompt = blog_writing.title_prompt("fraza-abc", "pl")
    assert prompt.index("FAKT-XYZ") < prompt.index("fraza-abc")
