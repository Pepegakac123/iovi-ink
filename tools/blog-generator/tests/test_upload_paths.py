import blog_upload


def test_existing_relative_path_is_used_as_is(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    (tmp_path / "x").mkdir()
    (tmp_path / "x" / "b.json").write_text("{}")
    assert blog_upload.resolve_blog_path("x/b.json", "var/data/blogs") == "x/b.json"


def test_bare_filename_is_joined_with_blogs_dir():
    assert blog_upload.resolve_blog_path("b.json", "var/data/blogs") == "var/data/blogs/b.json"


def test_absolute_path_untouched():
    assert blog_upload.resolve_blog_path("/tmp/b.json", "var/data/blogs") == "/tmp/b.json"


def test_slugify_transliterates_polish_letters():
    import blog_upload
    assert blog_upload._slugify("Ile kosztuje magazyn energii? Od czego zależy cena") == "ile-kosztuje-magazyn-energii-od-czego-zalezy-cena"
    assert blog_upload._slugify("Łódź, żółć") == "lodz-zolc"
