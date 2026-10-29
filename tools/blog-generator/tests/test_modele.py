import blog_upload
import modele


def test_defaults_after_model_comparison_2026_10_19():
    # Porównanie gpt-4o / gpt-6.1-sol / gpt-6-luna: Sol pisze najlepiej, Luna wystarcza do zadań pomocniczych.
    assert modele.DEFAULT_MODEL == "gpt-6.1-sol"
    assert modele.DEFAULT_AUX_MODEL == "gpt-6-luna"


def test_clean_model_text_strips_markdown_but_keeps_quotes():
    raw = '## H2: Czym jest **taryfa dynamiczna**\nSprzedawca nazywa to "ceną godzinową".'

    assert modele.clean_model_text(raw) == 'H2: Czym jest taryfa dynamiczna\nSprzedawca nazywa to "ceną godzinową".'


def test_clean_model_text_unwraps_fully_quoted_answer():
    assert modele.clean_model_text('"Magazyn energii bez fotowoltaiki"') == "Magazyn energii bez fotowoltaiki"
    assert modele.clean_model_text("„Magazyn energii”") == "Magazyn energii"


def test_clean_model_text_keeps_bullets():
    assert modele.clean_model_text("- punkt pierwszy\n* punkt drugi") == "- punkt pierwszy\n- punkt drugi"


def test_upload_chat_request_falls_back_to_standard_on_flex_429(monkeypatch):
    import httpx2 as httpx  # openai 3.x
    import openai

    tiers = []

    class FakeCompletions:
        def create(self, **kwargs):
            tiers.append(kwargs.get("service_tier"))
            if kwargs.get("service_tier") == "flex":
                resp = httpx.Response(429, request=httpx.Request("POST", "https://api.openai.com"))
                raise openai.RateLimitError("Resource Unavailable", response=resp, body=None)
            msg = type("M", (), {"content": "OK"})
            return type("R", (), {"choices": [type("C", (), {"message": msg})]})

    fake = type("Client", (), {"chat": type("Chat", (), {"completions": FakeCompletions()})})
    monkeypatch.setattr(blog_upload, "client", fake)
    monkeypatch.setattr(blog_upload, "SERVICE_TIER", "flex")

    assert blog_upload.chat_request("prompt") == "OK"
    assert tiers == ["flex", None]


def test_upload_chat_request_uses_aux_model(monkeypatch):
    calls = {}

    class FakeCompletions:
        def create(self, **kwargs):
            calls.update(kwargs)
            msg = type("M", (), {"content": "**Opis** wpisu"})
            return type("R", (), {"choices": [type("C", (), {"message": msg})]})

    fake = type("Client", (), {"chat": type("Chat", (), {"completions": FakeCompletions()})})
    monkeypatch.setattr(blog_upload, "client", fake)

    assert blog_upload.chat_request("prompt") == "Opis wpisu"
    assert calls["model"] == blog_upload.AUX_MODEL
    assert calls["messages"] == [{"role": "user", "content": "prompt"}]


def test_publish_date_from_explicit_datetime():
    from datetime import datetime
    import pytz
    at = pytz.timezone("Europe/Warsaw").localize(datetime(2026, 10, 21, 14, 5))
    assert blog_upload.publish_date_string(publish_in_days=0, publish_at=at) == "2026-10-21T14:05:00"


def test_upload_one_passes_status_and_date(monkeypatch, tmp_path):
    import json as _json
    from datetime import datetime
    path = tmp_path / "b.json"
    path.write_text(_json.dumps({"keyword": "k", "title": "Tytuł wpisu", "headers": ["H2: a"], "descriptions": ["d"]}),
                    encoding="utf-8")
    calls = {}

    def fake_post(keyword, title, headers, descriptions, publish_in_days, status="draft", with_photos=True, publish_at=None):
        calls.update(status=status, publish_at=publish_at, keyword=keyword)
        return {"id": 123}

    monkeypatch.setattr(blog_upload, "load_and_post_blog", fake_post)
    monkeypatch.setattr(blog_upload, "_fetch_site_description", lambda url: "opis")
    at = datetime(2026, 10, 21, 14, 5)

    assert blog_upload.upload_one(str(path), "https://x.pl", "u", "p", "pl", status="future", publish_at=at) == 123
    assert calls == {"status": "future", "publish_at": at, "keyword": "k"}
