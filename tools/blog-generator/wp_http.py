"""Sesja HTTP do WordPressa z ponawianiem: hosting CMS (seohost) zwraca 429 przy serii zapytań REST."""
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


def make_session() -> requests.Session:
    retry = Retry(
        total=6,
        backoff_factor=5,                 # 5, 10, 20, 40… s
        status_forcelist=[429, 502, 503, 504],
        allowed_methods=None,             # także POST — tworzenie wpisu po 429 nic nie zapisało
        respect_retry_after_header=True,
        raise_on_status=False,
    )
    session = requests.Session()
    session.mount("https://", HTTPAdapter(max_retries=retry))
    session.headers["User-Agent"] = "iovi-blog-generator/1.0"
    return session


WP_HTTP = make_session()
