import blog_upload


def _payload(**kw):
    args = dict(
        title="Tatuaż za uchem", keyword="tatuaż za uchem", html="<p>x</p>", short_description="Opis",
        questions=["q1", "q2", "q3"], answers=["a1", "a2", "a3"], cover_url="https://cms/x.webp",
        date_iso="2026-11-03T10:00:00", status="draft",
    )
    args.update(kw)
    return blog_upload.build_post_payload(**args)


def test_payload_status_passthrough():
    assert _payload()["status"] == "draft"
    assert _payload(status="future")["status"] == "future"


def test_payload_targets_jetengine_blog_fields():
    p = _payload()
    assert set(p) == {"title", "status", "date", "slug", "meta"}
    assert set(p["meta"]) == {
        "original_title", "seo_title", "seo_description", "wstep", "tekst_glowny",
        "miniaturka_bloga", "data_bloga", "blog_faq", "keyword_1",
    }


def test_slug_is_ascii():
    assert _payload()["slug"] == "tatuaz-za-uchem"


def test_content_without_faq_and_faq_as_repeater():
    meta = _payload()["meta"]
    assert meta["tekst_glowny"] == "<p>x</p>"
    assert meta["blog_faq"] == {
        "item-0": {"pytanie": "q1", "odpowiedz": "a1"},
        "item-1": {"pytanie": "q2", "odpowiedz": "a2"},
        "item-2": {"pytanie": "q3", "odpowiedz": "a3"},
    }


def test_dates_and_cover():
    meta = _payload()["meta"]
    assert meta["data_bloga"] == "2026-11-03"
    assert meta["miniaturka_bloga"] == "https://cms/x.webp"
    assert _payload(cover_url=None)["meta"]["miniaturka_bloga"] == ""


def test_cover_payload_is_16_9():
    assert blog_upload.cover_payload("p")["generationConfig"]["imageConfig"]["aspectRatio"] == "16:9"


def test_html_builder_headers_lists_h3():
    html = blog_upload.build_html_content(
        ["H1: Tytuł", "H2: Sekcja"],
        ["Wstęp\nH3: Podtytuł\n- punkt a\n- punkt b\nKoniec", "Tekst drugi"],
        [],
        "tatuaż",
    )
    assert "<h2>Tytuł</h2>" in html
    assert "<h3>Podtytuł</h3>" in html
    assert "<ul>" in html and "<li>punkt a</li>" in html
    assert "<h2>Sekcja</h2>" in html
    assert "<br>" not in html


def test_parse_faq_ok_and_bad():
    text = "Pytanie: A?\nOdpowiedź: B\n\nPytanie: C?\nOdpowiedź: D\n\nPytanie: E?\nOdpowiedź: F"
    q, a = blog_upload.parse_faq(text, 3)
    assert q == ["A?", "C?", "E?"] and a == ["B", "D", "F"]
    assert blog_upload.parse_faq("brak", 3) == (None, None)


def test_create_post_uses_blog_cpt_and_no_rank_math(monkeypatch):
    calls = []

    class Resp:
        status_code, text = 201, ""

        def json(self):
            return {"id": 7, "meta": {}}

    monkeypatch.setattr(blog_upload.requests, "post", lambda url, **kw: calls.append(url) or Resp())
    blog_upload.create_blog_post("https://x.pl", "u", "p", _payload())
    assert calls == ["https://x.pl/wp-json/wp/v2/blog"]
