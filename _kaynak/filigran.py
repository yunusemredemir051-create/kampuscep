"""Kitabı bölümlere ayırır ve her sayfaya KampüsCepte filigranı basar.
Kullanım: python3 filigran.py  (filigran metnini FILIGRAN ile değiştirebilirsin)"""
import io, os
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from bolumler import BOLUMLER

FILIGRAN = "KampüsCepte"
CIKTI = "../kampuscep/notlar/ybs/1/bilisim-sistemleri"
pdfmetrics.registerFont(TTFont("Poppins", "/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf"))

def filigran_sayfasi(w, h):
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=(w, h))
    c.saveState()
    c.setFillColorRGB(0.23, 0.36, 0.99, alpha=0.07)
    c.translate(w / 2, h / 2)
    c.rotate(40)
    c.setFont("Poppins", 78)
    c.drawCentredString(0, -26, FILIGRAN)
    c.restoreState()
    # sayfanın en altında küçük, sade bir not
    c.setFillColorRGB(0.42, 0.45, 0.56, alpha=0.55)
    c.setFont("Poppins", 7)
    c.drawCentredString(w / 2, 9, f"{FILIGRAN} · öğrenciler için ücretsiz ders notları")
    c.save()
    buf.seek(0)
    return PdfReader(buf).pages[0]

kaynak = PdfReader("bsg.pdf")
w = float(kaynak.pages[0].mediabox.width); h = float(kaynak.pages[0].mediabox.height)
damga = filigran_sayfasi(w, h)

def yaz(sayfalar, ad):
    out = PdfWriter()
    for p in sayfalar:
        out.add_page(kaynak.pages[p - 1])
        out.pages[-1].merge_page(damga)
    out.add_metadata({"/Title": ad, "/Author": "Yeşim Ülgen Sönmez, Yunus Emre Demir", "/Producer": FILIGRAN})
    return out

os.makedirs(CIKTI, exist_ok=True)
for n, ad, a, b in BOLUMLER:
    yol = f"{CIKTI}/bolum-{n}.pdf"
    with open(yol, "wb") as f:
        yaz(range(a, b + 1), f"Bölüm {n} · {ad}").write(f)
with open(f"{CIKTI}/hizli-tekrar-karti.pdf", "wb") as f:
    yaz([135], "Hızlı Tekrar Kartı").write(f)
with open(f"{CIKTI}/kitabin-tamami.pdf", "wb") as f:
    yaz(range(1, len(kaynak.pages) + 1), "YBS 1. Sınıf Bilişim Sistemleri ve Teknolojilerine Giriş").write(f)
for d in sorted(os.listdir(CIKTI)):
    print(d, round(os.path.getsize(f"{CIKTI}/{d}") / 1e6, 2), "MB")
