"""Modele OpenAI: wybór, treść żądania, koszt i czyszczenie odpowiedzi.

Domyślne modele z porównania 2026-10-19 (ta sama fraza na gpt-4o, gpt-6.1-sol, gpt-6-luna):
Sol pisze najlepiej (bez wypełniaczy, każda sekcja ma swój wątek), Luna wystarcza do FAQ/opisu/zdjęć.
Nadpisanie: BLOG_MODEL, BLOG_MODEL_AUX, BLOG_REASONING_EFFORT, BLOG_SERVICE_TIER w .env.
"""
import os
import re

DEFAULT_MODEL = "gpt-6.1-sol"
DEFAULT_AUX_MODEL = "gpt-6-luna"

MODEL = os.getenv("BLOG_MODEL", DEFAULT_MODEL)
AUX_MODEL = os.getenv("BLOG_MODEL_AUX", DEFAULT_AUX_MODEL)
REASONING_EFFORT = os.getenv("BLOG_REASONING_EFFORT", "low")   # gpt-6.1-sol nie zna "none"
SERVICE_TIER = os.getenv("BLOG_SERVICE_TIER", "flex")          # Flex: -50%, wolniej, 429 bez opłaty

# USD za 1M tokenów (standard, kontekst <272K): wejście, wejście z cache, wyjście.
# Źródło: developers.openai.com/api/docs/pricing (2026-10-19). Flex/Batch = połowa.
PRICES = {
    "gpt-4o": (2.50, 1.25, 10.00),
    "gpt-4o-mini": (0.15, 0.075, 0.60),
    "gpt-6-astra": (10.00, 1.00, 50.00),
    "gpt-6-sol": (2.00, 0.20, 10.00),
    "gpt-6.1-sol": (2.00, 0.10, 10.00),
    "gpt-6-luna": (0.10, 0.01, 0.50),
}


def is_reasoning_model(model: str) -> bool:
    """Modele rozumujące (gpt-5+, gpt-6, o1/o3/o4) przyjmują reasoning_effort i Flex."""
    return bool(re.match(r"^(gpt-[5-9]|o\d)", model or ""))


def build_chat_body(prompt: str, model: str, effort: str = "", tier: str = "") -> dict:
    body = {"model": model, "messages": [{"role": "user", "content": prompt}]}
    if is_reasoning_model(model):
        if effort:
            body["reasoning_effort"] = effort
        if tier:
            body["service_tier"] = tier
    return body


def standard_tier_fallback(body: dict):
    """Flex przy braku mocy zwraca 429 z długim Retry-After — wtedy od razu tryb standardowy (zalecenie OpenAI)."""
    if body.get("service_tier") != "flex":
        return None
    return {k: v for k, v in body.items() if k != "service_tier"}


def estimate_cost(model: str, usage: dict, tier: str = ""):
    """Koszt w USD z liczników USAGE; None dla modelu spoza cennika."""
    price = PRICES.get(model)
    if not price:
        return None
    inp, cached, out = price
    fresh = usage["prompt"] - usage["cached"]
    cost = (fresh * inp + usage["cached"] * cached + usage["completion"] * out) / 1_000_000
    return cost / 2 if tier == "flex" and is_reasoning_model(model) else cost


def split_cost(model: str, usage: dict, flex_usage: dict):
    """Koszt całości, gdy część zapytań przeszła przez Flex, a część (429 → fallback) po cenie standardowej."""
    standard = {k: usage[k] - flex_usage[k] for k in usage}
    parts = [estimate_cost(model, standard), estimate_cost(model, flex_usage, tier="flex")]
    return None if None in parts else sum(parts)


_WRAPPING_QUOTES = [('"', '"'), ("„", "”"), ("“", "”")]


def clean_model_text(text: str) -> str:
    """Usuwa markdown (#, **, punktory '*'), cudzysłów obejmujący całą odpowiedź; cytaty w środku zostają."""
    text = (text or "").strip()
    for left, right in _WRAPPING_QUOTES:
        if len(text) > 1 and text.startswith(left) and text.endswith(right) and left not in text[1:-1]:
            text = text[1:-1].strip()
    text = text.replace("**", "").replace("__", "")
    text = re.sub(r"^\s*#+\s*", "", text, flags=re.MULTILINE)
    text = re.sub(r"^(\s*)\*\s+", r"\1- ", text, flags=re.MULTILINE)
    return text
