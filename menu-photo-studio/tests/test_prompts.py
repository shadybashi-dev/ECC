from mpp.menu import MenuItem
from mpp.prompts import build_prompt, build_prompts, load_preset, stable_seed


def _item(**kw):
    base = dict(id="mixed-grill", name="Mixed Grill", category="Grill",
                price="65", description="", name_ar="", prompt_subject="",
                notes="")
    base.update(kw)
    return MenuItem(**base)


def test_shared_vibe_and_subject():
    preset = load_preset()
    p = build_prompt(_item(), preset)
    assert "Mixed Grill" in p["positive"]
    # shared background - v1 slate, v2 basalt/quarry both contain "stone surface"
    assert "stone surface" in p["positive"]          # shared background (slate or basalt)
    assert "85mm" in p["positive"]                  # shared camera
    assert "char-grilled marks" in p["positive"]    # category enricher
    assert "watermark" in p["negative"]
    assert "white background" in p["negative"]
    assert (p["width"], p["height"]) == (1536, 864)


def test_category_fallback_and_subject_override():
    preset = load_preset()
    p = build_prompt(_item(id="x", name="House Special",
                           category="Chef", prompt_subject="lamb kofta skewer"),
                     preset)
    assert "lamb kofta skewer" in p["positive"]
    assert "honest realistic portion" in p["positive"]  # default enricher


def test_seed_stable_and_distinct():
    assert stable_seed("a") == stable_seed("a")
    assert stable_seed("a") != stable_seed("b")


def test_build_prompts_count():
    prompts = build_prompts([_item(id="a", name="A"), _item(id="b", name="B")])
    assert [p["item_id"] for p in prompts] == ["a", "b"]
