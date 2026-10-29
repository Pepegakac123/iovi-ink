import os
import sys

# Moduły rzucają wyjątek przy imporcie bez klucza — testy nie dotykają sieci.
os.environ.setdefault("OPENAI_API_KEY_BLOGS", "test-key")
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
