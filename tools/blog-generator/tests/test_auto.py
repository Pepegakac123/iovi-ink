import random
from datetime import datetime

import pytz

import auto

WARSAW = pytz.timezone("Europe/Warsaw")


def test_next_phrase_skips_phrases_already_in_titles():
    queue = ["magazyn energii bez fotowoltaiki", "ile kosztuje magazyn energii", "magazyn energii do firmy"]
    titles = ["Magazyn energii bez fotowoltaiki – jak działa?", "Ile kosztuje magazyn energii i od czego to zależy?"]

    assert auto.next_phrase(queue, titles) == "magazyn energii do firmy"


def test_next_phrase_none_when_queue_exhausted():
    assert auto.next_phrase(["fraza a"], ["Fraza A w tytule"]) is None


def test_next_phrase_ignores_html_entities_in_titles():
    # WP REST zwraca tytuł z encjami (&#8211; zamiast –)
    assert auto.next_phrase(["co to jest"], ["Net billing &#8211; co to jest?"]) is None


def test_load_queue_skips_comments_and_blank_lines(tmp_path):
    path = tmp_path / "kolejka.txt"
    path.write_text("# priorytet 1\nfraza a\n\n  fraza b  \n# fraza c\n", encoding="utf-8")

    assert auto.load_queue(str(path)) == ["fraza a", "fraza b"]


def test_publish_slot_is_weekday_working_hours_within_week():
    now = WARSAW.localize(datetime(2026, 10, 19, 9, 0))   # poniedziałek
    for seed in range(50):
        slot = auto.publish_slot(now, random.Random(seed))
        assert slot.weekday() < 5
        assert 8 <= slot.hour < 18
        assert 0 < (slot - now).total_seconds() <= 8 * 24 * 3600
        assert (slot - now).total_seconds() >= 2 * 3600


def test_publish_slot_from_friday_evening_lands_next_week():
    now = WARSAW.localize(datetime(2026, 10, 23, 19, 0))  # piątek wieczór
    slot = auto.publish_slot(now, random.Random(1))
    assert slot.weekday() < 5 and slot > now


def test_decide_status():
    assert auto.decide_status([]) == "future"
    assert auto.decide_status([{"kind": "cena", "snippet": "x"}]) == "draft"


# Środowy przebieg zapasowy: pisze tylko, gdy poniedziałkowy nie zostawił śladu.
NOW_UTC = datetime(2026, 10, 28, 5, 17)  # środa


def _post(status, date_gmt, modified_gmt=None):
    return {"status": status, "date_gmt": date_gmt, "modified_gmt": modified_gmt or date_gmt}


def test_week_done_when_post_is_scheduled():
    assert auto.week_already_done([_post("future", "2026-11-02T10:00:00")], NOW_UTC)


def test_week_done_when_post_published_since_monday():
    assert auto.week_already_done([_post("publish", "2026-10-27T09:30:00")], NOW_UTC)


def test_week_done_when_monday_left_a_draft():
    assert auto.week_already_done([_post("draft", "2026-10-26T05:40:00")], NOW_UTC)


def test_week_not_done_when_only_older_posts():
    posts = [_post("publish", "2026-10-19T16:17:48"), _post("draft", "2026-10-10T08:00:00")]
    assert not auto.week_already_done(posts, NOW_UTC)


def test_week_not_done_without_posts():
    assert not auto.week_already_done([], NOW_UTC)
