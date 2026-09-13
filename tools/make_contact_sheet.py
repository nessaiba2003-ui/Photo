import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps

root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("incoming-photos")

files = [
    p
    for p in root.rglob("*")
    if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
]

thumb_w, thumb_h = 220, 150
pad = 28
cols = 4
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * (thumb_w + pad) + pad, rows * (thumb_h + 70) + pad), "#081e3a")
draw = ImageDraw.Draw(sheet)

for index, path in enumerate(files):
    image = Image.open(path).convert("RGB")
    image = ImageOps.contain(image, (thumb_w, thumb_h))
    x = pad + (index % cols) * (thumb_w + pad)
    y = pad + (index // cols) * (thumb_h + 70)
    sheet.paste(image, (x, y))
    label = f"{index + 1}. " + " / ".join(path.relative_to(root).parts)
    draw.text((x, y + thumb_h + 8), label[:48], fill="#f5f7fa")
    draw.text((x, y + thumb_h + 26), label[48:96], fill="#c9d6e8")

output = root / "contact-sheet.jpg"
sheet.save(output, quality=92)
print(output.resolve())
