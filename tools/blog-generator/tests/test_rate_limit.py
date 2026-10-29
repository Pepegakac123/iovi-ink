import blog_writing


def test_retry_delay_reads_retry_after_header():
    assert blog_writing.retry_delay({"Retry-After": "7"}, attempt=1) == 7.0


def test_retry_delay_reads_openai_reset_tokens():
    assert blog_writing.retry_delay({"x-ratelimit-reset-tokens": "46.84s"}, attempt=1) == 46.84
    assert blog_writing.retry_delay({"x-ratelimit-reset-tokens": "1m2s"}, attempt=1) == 62.0
    assert blog_writing.retry_delay({"x-ratelimit-reset-tokens": "120ms"}, attempt=1) == 0.12


def test_retry_delay_falls_back_to_backoff_and_is_capped():
    assert blog_writing.retry_delay({}, attempt=1) == 5.0
    assert blog_writing.retry_delay({}, attempt=3) == 20.0
    assert blog_writing.retry_delay({}, attempt=10) == 60.0
