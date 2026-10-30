"""Ortak ders: İngilizce I (YBS 2. sınıf kitabı, 13 bölüm + 3 prova).
Kullanım: python3 _kaynak/ortak_ingilizce.py   (depo kökünden)
- Her bölümü ayrı PDF yapar, "Kendini Test Et"ten sonrasını PDF'ten siler, filigran basar
- notlar/ortak/ingilizce-1/ders.json: üniteler + testler + provalar
Soru verisi: _kaynak/ingilizce/sorular.json (parse.py ile kitaptan ayrıştırıldı; anahtarlar bölüm no, V1, V2, F)
"""
import io, json, os, shutil, subprocess, tempfile
import pymupdf
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KAYNAK = os.path.join(KOK, "_kaynak", "ingilizce")
HEDEF = os.path.join(KOK, "notlar", "ortak", "ingilizce-1")
FILIGRAN = "KampüsCepte"
pdfmetrics.registerFont(TTFont("Poppins", "/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf"))
GECICI = tempfile.mkdtemp()

BASLIK = {1: "Countries and Nationalities; The Verb “be”", 2: "Jobs, Numbers 1–100 and Adjectives",
          3: "Personal Details; this / that / these / those; Plurals", 4: "Personal Objects, Family and Friends; Possessive Adjectives and ’s",
          5: "Telling the Time; Review of Units 1–2", 6: "Food and Drinks, Days; Present Simple (I / you / we / they)",
          7: "Common Verbs; Present Simple (he / she / it)", 8: "Linkers and Punctuation",
          9: "Transport, Daily Routines; Adverbs of Frequency", 10: "Adjectives and Prices; Present Simple Wh- Questions",
          11: "Café and Shopping English; Review of Units 3–4", 12: "Electronic Devices and Common Verbs; can / can’t",
          13: "Activities; Object Pronouns"}
# PDF sayfa aralığı (1 tabanlı)
SAYFA = {1: (11, 17), 2: (18, 24), 3: (25, 32), 4: (33, 38), 5: (39, 43), 6: (44, 48), 7: (49, 53), 8: (54, 58),
         9: (67, 71), 10: (72, 76), 11: (77, 80), 12: (81, 84), 13: (85, 89)}
EK_SAYFA = (94, 95)

def filigran_sayfasi(w, h):
    buf = io.BytesIO(); c = canvas.Canvas(buf, pagesize=(w, h))
    c.saveState(); c.setFillColorRGB(0.23, 0.36, 0.99, alpha=0.07); c.translate(w / 2, h / 2); c.rotate(40)
    c.setFont("Poppins", 78); c.drawCentredString(0, -26, FILIGRAN); c.restoreState()
    c.setFillColorRGB(0.42, 0.45, 0.56, alpha=0.55); c.setFont("Poppins", 7)
    c.drawCentredString(w / 2, 9, f"{FILIGRAN} · öğrenciler için ücretsiz ders notları")
    c.save(); buf.seek(0)
    return PdfReader(buf).pages[0]

def kesim_noktasi(doc, a, b):
    for pno in range(a - 1, b):
        for blok in doc[pno].get_text("dict")["blocks"]:
            for satir in blok.get("lines", []):
                t = "".join(s["text"] for s in satir["spans"]).strip()
                if t == "Kendini Test Et" and satir["spans"][0]["size"] > 11:
                    return pno, satir["bbox"][1]
    return None

def unite_pdf(doc, a, b, hedef, baslik, kesmeli=True):
    kes = kesim_noktasi(doc, a, b) if kesmeli else None
    son = b - 1
    if kes:
        pno, y = kes
        if y < 115: son = pno - 1
        else:
            sayfa = doc[pno]
            sayfa.add_redact_annot(pymupdf.Rect(0, y - 18, sayfa.rect.width, 778), fill=(1, 1, 1))
            sayfa.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_REMOVE, graphics=pymupdf.PDF_REDACT_LINE_ART_REMOVE_IF_TOUCHED)
            son = pno
    yeni = pymupdf.open(); yeni.insert_pdf(doc, from_page=a - 1, to_page=son)
    ara = os.path.join(GECICI, "ara.pdf"); yeni.save(ara, garbage=4, deflate=True)
    okuyucu = PdfReader(ara)
    w = float(okuyucu.pages[0].mediabox.width); h = float(okuyucu.pages[0].mediabox.height)
    damga = filigran_sayfasi(w, h); yaz = PdfWriter()
    for p in okuyucu.pages:
        yaz.add_page(p); yaz.pages[-1].merge_page(damga)
    yaz.add_metadata({"/Title": baslik, "/Author": "Yunus Emre Demir", "/Producer": FILIGRAN})
    with open(ara, "wb") as f: yaz.write(f)
    subprocess.run(["qpdf", "--object-streams=generate", "--compress-streams=y", "--recompress-flate", ara, hedef], check=True)
    return son - (a - 1) + 1

def main():
    sorular = json.load(open(os.path.join(KAYNAK, "sorular.json"), encoding="utf-8"))
    doc = pymupdf.open(os.path.join(KAYNAK, "kitap.pdf"))
    if os.path.isdir(HEDEF): shutil.rmtree(HEDEF)
    os.makedirs(HEDEF)
    ders = dict(ad="İngilizce I", bolum="Ortak ders", sinif=None, yazarlar="Yunus Emre Demir", uniteler=[])
    for n, (a, b) in SAYFA.items():
        ad = f"unite-{n}.pdf"
        doc = pymupdf.open(os.path.join(KAYNAK, "kitap.pdf"))
        sayfa = unite_pdf(doc, a, b, os.path.join(HEDEF, ad), f"Bölüm {n} · {BASLIK[n]}")
        u = dict(no=n, ad=BASLIK[n], pdf=ad, sayfa=sayfa, test=dict(test=sorular[str(n)], dy=[], bosluk=[]))
        ders["uniteler"].append(u)
        print(f"Bölüm {n}: {sayfa} sayfa, {len(sorular[str(n)])} soru, {os.path.getsize(os.path.join(HEDEF, ad)) // 1024} KB")
    doc = pymupdf.open(os.path.join(KAYNAK, "kitap.pdf"))
    ek = unite_pdf(doc, EK_SAYFA[0], EK_SAYFA[1], os.path.join(HEDEF, "unite-14.pdf"), "Dönem Planı ve Hızlı Tekrar", kesmeli=False)
    ders["uniteler"].append(dict(no=14, ad="Dönem Planı ve Hızlı Tekrar", pdf="unite-14.pdf", sayfa=ek))
    ders["provalar"] = [
        dict(id="vize1", ad="Vize Provası 1", konu="Bölüm 1–8 · 1.–8. hafta", sure=30, puan=5, sorular=sorular["V1"]),
        dict(id="vize2", ad="Vize Provası 2", konu="Bölüm 1–8 · 1.–8. hafta", sure=30, puan=5, sorular=sorular["V2"]),
        dict(id="final", ad="Final Provası", konu="Bütün dönem (ağırlık 10.–14. hafta)", sure=30, puan=5, sorular=sorular["F"]),
    ]
    ders["denemeler"] = [
        dict(id="vize", ad="Karışık deneme · Vize konuları", konu="Bölüm 1–8 sorularından rastgele", bolumler=list(range(1, 9)), adet=20, sure=30),
        dict(id="final", ad="Karışık deneme · Final konuları", konu="Bölüm 9–13 sorularından rastgele", bolumler=list(range(9, 14)), adet=20, sure=30),
        dict(id="donem", ad="Tüm dönem denemesi", konu="13 bölümden rastgele 30 soru", bolumler=list(range(1, 14)), adet=30, sure=45),
    ]
    json.dump(ders, open(os.path.join(HEDEF, "ders.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    print("toplam boyut", sum(os.path.getsize(os.path.join(HEDEF, f)) for f in os.listdir(HEDEF)) // 1024, "KB")

if __name__ == "__main__":
    main()
