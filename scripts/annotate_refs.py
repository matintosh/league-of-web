#!/usr/bin/env python3
"""
annotate_refs.py — generate component reference images from a main reference.

For each component box in a spec, produces:
  1. a CROP of just that component  → <out>/<ref-stem>__<slug>.png
  2. one ANNOTATED copy of the main ref with a red rectangle + label per box
     → <out>/<ref-stem>__annotated.png

Boxes may be given in absolute pixels {x,y,w,h} or normalized fractions
{fx,fy,fw,fh} (0..1 of the ref's width/height) — normalized is robust to the
ref's actual resolution.

Usage:
  python3 scripts/annotate_refs.py <spec.json> [<spec2.json> ...]

Spec format:
  {
    "ref": "docs/reference/universe-landing.png",
    "out": "docs/reference/components",          # optional, defaults here
    "boxes": [
      {"name": "Top Nav",    "slug": "top-nav",    "fx":0,    "fy":0,    "fw":1,    "fh":0.06},
      {"name": "Story Card",  "slug": "story-card", "x":48, "y":300, "w":230, "h":150}
    ]
  }
"""
import json
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

RED = (226, 54, 54)


def load_font(size):
    for path in [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/Library/Fonts/Arial.ttf",
    ]:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            continue
    return ImageFont.load_default()


def resolve_box(b, W, H):
    if "fx" in b:
        x = round(b["fx"] * W); y = round(b["fy"] * H)
        w = round(b["fw"] * W); h = round(b["fh"] * H)
    else:
        x, y, w, h = b["x"], b["y"], b["w"], b["h"]
    x = max(0, min(x, W - 1)); y = max(0, min(y, H - 1))
    w = max(1, min(w, W - x)); h = max(1, min(h, H - y))
    return x, y, w, h


def process(spec_path):
    spec = json.loads(Path(spec_path).read_text())
    ref = Path(spec["ref"])
    out = Path(spec.get("out", "docs/reference/components"))
    out.mkdir(parents=True, exist_ok=True)
    stem = ref.stem

    base = Image.open(ref).convert("RGB")
    W, H = base.size
    annotated = base.copy()
    draw = ImageDraw.Draw(annotated)
    font = load_font(max(14, W // 90))
    made = []

    for b in spec["boxes"]:
        slug = b.get("slug") or b["name"].lower().replace(" ", "-")
        x, y, w, h = resolve_box(b, W, H)
        # crop
        crop_path = out / f"{stem}__{slug}.png"
        base.crop((x, y, x + w, y + h)).save(crop_path)
        # annotate: rectangle + label chip
        draw.rectangle([x, y, x + w, y + h], outline=RED, width=3)
        label = b["name"]
        tb = draw.textbbox((0, 0), label, font=font)
        tw, th = tb[2] - tb[0], tb[3] - tb[1]
        ly = max(0, y - th - 6)
        draw.rectangle([x, ly, x + tw + 8, ly + th + 6], fill=RED)
        draw.text((x + 4, ly + 2), label, fill=(255, 255, 255), font=font)
        made.append(f"{crop_path.name}  [{x},{y},{w},{h}]")

    ann_path = out / f"{stem}__annotated.png"
    annotated.save(ann_path)
    print(f"{ref.name}: {len(made)} crops + {ann_path.name}")
    for m in made:
        print("  ", m)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("usage: annotate_refs.py <spec.json> [...]"); sys.exit(1)
    for sp in sys.argv[1:]:
        process(sp)
