import pytest

import blog_writing


@pytest.mark.parametrize("model", ["gpt-5", "gpt-5.4-mini", "gpt-6-luna", "gpt-6.1-sol", "o3", "o4-mini"])
def test_reasoning_models_are_detected(model):
    assert blog_writing.is_reasoning_model(model)


@pytest.mark.parametrize("model", ["gpt-4o", "gpt-4o-mini", "gpt-4.1"])
def test_classic_models_are_not_reasoning(model):
    assert not blog_writing.is_reasoning_model(model)


def test_chat_body_for_classic_model_has_no_reasoning_or_tier():
    body = blog_writing.build_chat_body("treść", "gpt-4o", effort="low", tier="flex")

    assert body == {"model": "gpt-4o", "messages": [{"role": "user", "content": "treść"}]}


def test_chat_body_for_reasoning_model_sets_effort_and_tier():
    body = blog_writing.build_chat_body("treść", "gpt-6.1-sol", effort="low", tier="flex")

    assert body["model"] == "gpt-6.1-sol"
    assert body["reasoning_effort"] == "low"
    assert body["service_tier"] == "flex"


def test_chat_body_skips_empty_effort_and_tier():
    body = blog_writing.build_chat_body("treść", "gpt-6-luna", effort="", tier="")

    assert "reasoning_effort" not in body
    assert "service_tier" not in body


def test_estimate_cost_uses_cached_price_and_flex_discount():
    usage = {"prompt": 10_000, "cached": 8_000, "completion": 2_000}

    # 2000 * $2 + 8000 * $0.10 + 2000 * $10 (za 1M) = $0.0248; Flex = połowa
    assert blog_writing.estimate_cost("gpt-6.1-sol", usage) == pytest.approx(0.0248)
    assert blog_writing.estimate_cost("gpt-6.1-sol", usage, tier="flex") == pytest.approx(0.0124)


def test_flex_429_falls_back_to_standard_tier_immediately():
    body = blog_writing.build_chat_body("treść", "gpt-6.1-sol", effort="low", tier="flex")

    fallback = blog_writing.standard_tier_fallback(body)

    assert "service_tier" not in fallback
    assert fallback["reasoning_effort"] == "low"
    assert body["service_tier"] == "flex"  # oryginał bez zmian


def test_no_fallback_when_already_standard():
    body = blog_writing.build_chat_body("treść", "gpt-6.1-sol", effort="low", tier="")

    assert blog_writing.standard_tier_fallback(body) is None


def test_split_cost_counts_standard_fallback_at_full_price():
    usage = {"prompt": 10_000, "cached": 8_000, "completion": 2_000}       # wszystko
    flex = {"prompt": 5_000, "cached": 4_000, "completion": 1_000}         # z tego przez Flex

    # Flex: (1000*2 + 4000*0.1 + 1000*10)/1M/2 = 0.0062; standard: to samo bez /2 = 0.0124
    assert blog_writing.split_cost("gpt-6.1-sol", usage, flex) == pytest.approx(0.0186)


def test_estimate_cost_unknown_model_returns_none():
    assert blog_writing.estimate_cost("gpt-99", {"prompt": 1, "cached": 0, "completion": 1}) is None
