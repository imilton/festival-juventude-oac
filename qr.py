"""
gerar_qr.py — QR Code gerador para OAC Moçambique
Compatível com: qrcode >= 7.4  |  Pillow >= 9.0

Instalação (uma só vez):
    pip install "qrcode[pil]" pillow

Uso:
    python gerar_qr.py
"""

import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers.pil import RoundedModuleDrawer
from qrcode.image.styles.colormasks import SolidFillColorMask
from PIL import Image, ImageDraw, ImageFont

# ── CONFIGURAÇÃO — edita apenas aqui ─────────────────────────────────────────

URL         = "https://imilton.github.io/festival-juventude-oac/"
OUTPUT_FILE = "oac_qr.png"

# Cores da marca OAC (RGB)
RED   = (200, 16, 46)
WHITE = (255, 255, 255)
GRAY  = (100, 100, 100)

# ── 1. GERAR QR ───────────────────────────────────────────────────────────────

print(f"\n[1/4] A gerar QR para:\n      {URL}\n")

qr = qrcode.QRCode(
    version=4,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=12,
    border=2,
)
qr.add_data(URL)
qr.make(fit=True)

img_qr = qr.make_image(
    image_factory=StyledPilImage,
    module_drawer=RoundedModuleDrawer(),
    color_mask=SolidFillColorMask(
        front_color=RED,
        back_color=WHITE,
    ),
).convert("RGBA")

# ── 2. CARD COM MOLDURA ───────────────────────────────────────────────────────

print("[2/4] A aplicar moldura e texto...")

QR_W, QR_H = img_qr.size
PAD_TOP    = 64
PAD_BOT    = 80
PAD_SIDE   = 28

CARD_W = QR_W + PAD_SIDE * 2
CARD_H = QR_H + PAD_TOP  + PAD_BOT

card = Image.new("RGB", (CARD_W, CARD_H), WHITE)
draw = ImageDraw.Draw(card)

draw.rectangle([0, 0, CARD_W, PAD_TOP], fill=RED)
draw.rectangle([0, PAD_TOP + QR_H, CARD_W, CARD_H], fill=(247, 247, 247))
card.paste(img_qr.convert("RGB"), (PAD_SIDE, PAD_TOP))

# ── 3. TEXTO ──────────────────────────────────────────────────────────────────

def _font(size):
    paths = [
        "C:/Users/Milton Massuanganhe/Downloads/Fira_Code_v6.2/ttf/FiraCode-Bold.ttf",
        "C:/Users/Milton Massuanganhe/Downloads/Fira_Code_v6.2/ttf/FiraCode-Light.ttf",
    ]
    for p in paths:
        try:
            return ImageFont.truetype(p, size)
        except OSError:
            continue
    return ImageFont.load_default()

def centro(draw, text, y, cor, size):
    f    = _font(size)
    bbox = draw.textbbox((0, 0), text, font=f)
    x    = (CARD_W - (bbox[2] - bbox[0])) // 2
    draw.text((x, y), text, fill=cor, font=f)

centro(draw, "OAC Moçambique",               12, WHITE,           22)
centro(draw, "Igreja Velha Apostólica",       38, (255,200,210),  14)

Y = PAD_TOP + QR_H + 10
centro(draw, "38 Aniversário da Juventude",   Y,      RED,        17)
centro(draw, "03 de Maio de 2026",            Y + 26, GRAY,       14)

url_curta = URL.replace("https://", "").strip("/")
if len(url_curta) > 44:
    url_curta = url_curta[:41] + "..."
centro(draw, url_curta, Y + 50, (180,180,180), 11)

# ── 4. GUARDAR ────────────────────────────────────────────────────────────────

print("[3/4] A guardar imagem...")
card.save(OUTPUT_FILE, "PNG", optimize=True, dpi=(300, 300))

print(f"[4/4] Ficheiro gerado: {OUTPUT_FILE}")
print(f"      Dimensoes: {card.width} x {card.height} px | 300 DPI")
print()
print("  PROXIMOS PASSOS:")
print(f"  1. Verifica o QR abrindo {OUTPUT_FILE!r}")
print(f"  2. Edita a variavel URL no topo do script com o teu link real")
print(f"  3. Corre novamente: python gerar_qr.py")