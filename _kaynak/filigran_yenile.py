"""Mevcut ünite PDF'lerindeki eski filigranı kaldırıp yenisini basar.
Kullanım (repo kökünden): python3 _kaynak/filigran_yenile.py
Filigran metnini değiştirmek için FILIGRAN değerini düzenle."""
import glob, io, os, subprocess
from pypdf import PdfReader, PdfWriter
from pypdf.generic import ContentStream, NameObject
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

FILIGRAN = "kampuscepte.com.tr"
ALT_NOT = f"{FILIGRAN} · öğrenciler için ücretsiz ders notları"
pdfmetrics.registerFont(TTFont("Poppins", "/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf"))


def damga(w, h):
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=(w, h))
    c.saveState()
    c.setFillColorRGB(0.23, 0.36, 0.99, alpha=0.07)
    c.translate(w / 2, h / 2)
    c.rotate(40)
    boyut = 46  # metin, sayfanın kısa kenarına göre küçülür
    while pdfmetrics.stringWidth(FILIGRAN, "Poppins", boyut) > 0.95 * min(w, h) / 0.766:
        boyut -= 2
    c.setFont("Poppins", boyut)
    c.drawCentredString(0, -boyut / 3, FILIGRAN)
    c.restoreState()
    c.setFillColorRGB(0.42, 0.45, 0.56, alpha=0.55)
    c.setFont("Poppins", 7)
    c.drawCentredString(w / 2, 9, ALT_NOT)
    c.save()
    buf.seek(0)
    return PdfReader(buf).pages[0]


def eski_filigrani_sil(sayfa, okuyucu):
    """reportlab damgası 'q, re(0 0 w h), W, n, cm(1 0 0 1 0 0), BT, Tf /F1' ile başlar; oradan sonrası silinir."""
    cs = ContentStream(sayfa.get_contents(), okuyucu)
    ops = cs.operations
    for i in range(len(ops) - 6, -1, -1):
        if (ops[i][1] == b"q" and ops[i + 1][1] == b"re" and ops[i + 2][1] == b"W"
                and ops[i + 3][1] == b"n" and ops[i + 5][1] == b"BT"
                and any(o[1] == b"Tj" and "amp" in str(o[0]) for o in ops[i:])):
            cs.operations = ops[:i]
            sayfa[NameObject("/Contents")] = cs
            return True
    return False


for yol in sorted(glob.glob("notlar/**/unite-*.pdf", recursive=True)):
    r = PdfReader(yol)
    out = PdfWriter()
    silinen = 0
    for s in r.pages:
        silinen += eski_filigrani_sil(s, r)
        w, h = float(s.mediabox.width), float(s.mediabox.height)
        s.merge_page(damga(w, h))
        out.add_page(s)
    out.add_metadata({k: v for k, v in (r.metadata or {}).items()} | {"/Producer": FILIGRAN})
    gecici = yol + ".tmp"
    with open(gecici, "wb") as f:
        out.write(f)
    subprocess.run(["qpdf", "--object-streams=generate", "--compress-streams=y", gecici, yol], check=True)
    os.remove(gecici)
    print(f"{yol}: {len(r.pages)} sayfa, {silinen} eski filigran silindi, {os.path.getsize(yol)/1e6:.2f} MB")
