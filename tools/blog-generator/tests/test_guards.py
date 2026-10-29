import guards


def test_flags_price_in_zloty():
    assert guards.find_flags("Mały tatuaż kosztuje 300 zł.")


def test_flags_pln_and_percent():
    assert guards.find_flags("od 400 PLN")
    assert guards.find_flags("90% klientek wraca")


def test_clean_text_has_no_flags():
    assert guards.find_flags("Cienkie linie wymagają spokojnej ręki i dobrego projektu.") == []


def test_flag_contains_snippet():
    flags = guards.find_flags("Cena to 500 zł za sesję")
    assert any("500" in f["snippet"] for f in flags)


def test_flags_pain_promises_and_superlatives():
    assert guards.find_flags("Zabieg jest praktycznie bezbolesny.")
    assert guards.find_flags("Spokojnie, nic nie poczujesz.")
    assert guards.find_flags("najlepsza tatuażystka w regionie")
    assert guards.find_flags("Gwarantuję idealny efekt.")


def test_flags_medical_advice():
    assert guards.find_flags("Posmaruj maścią z antybiotykiem.")
    assert guards.find_flags("Użyj Bepanthenu przez tydzień.")


def test_general_doctor_mention_is_allowed():
    assert guards.find_flags("Jeśli objawy narastają, skonsultuj się z lekarzem.") == []
