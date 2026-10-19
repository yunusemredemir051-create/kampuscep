"""Ders kitaplarını sitedeki ünite yapısına dönüştürür.
- Her üniteyi ayrı PDF yapar
- 'Ödevler' başlığından (yoksa 'Kendini Test Et'ten) ünite sonuna kadar her şeyi PDF'ten SİLER
- Her sayfaya KampüsCep filigranı basar
- notlar/<klasör>/ders.json dosyasını yazar (üniteler + testler)
"""
import io, json, os, re, shutil, subprocess
import pymupdf
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

SITE = "/home/claude/kampuscep"
FILIGRAN = "KampüsCep"
GECICI = "/tmp/claude-0/-home-claude/9f2446b6-fc9f-54c7-a9c4-f0a83dfc0ef5/scratchpad"
pdfmetrics.registerFont(TTFont("Poppins", "/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf"))

def bsg_testleri():
    v = json.load(open("sorular.json"))
    for b in v.values():
        for q in b["bosluk"]:
            q["cs"] = [x.strip() for x in q.pop("c").split(";")]
        for q in b["test"]:
            q["o"] = [o.replace(" ,", ",") for o in q["o"]]
    return v

KITAPLAR = [
    dict(pdf="bsg.pdf", klasor="ybs/1/bilisim-sistemleri", testler=bsg_testleri(),
         ad="Bilişim Sistemleri ve Teknolojilerine Giriş", sinif=1, yazarlar="Yeşim Ülgen Sönmez · Yunus Emre Demir",
         uniteler=[(1, "Bilişim Sistemleri ve Karar Verme", 11, 21), (2, "Bilgisayar Donanımı", 22, 40),
                   (3, "Sayı Sistemleri", 41, 64), (4, "Boole Cebri ve Lojik Kapılar", 65, 74),
                   (5, "Toplumsal Gelişim Aşamaları", 75, 81), (6, "Yazılım Geliştirme Yaşam Döngüsü", 82, 100),
                   (7, "İşletim Sistemleri", 101, 115), (8, "Veri Yapıları ve Algoritmalar", 116, 134)]),
    dict(pdf="vt.pdf", klasor="ybs/1/veri-tabanina-giris", testler=json.load(open("vt_sorular.json")),
         ad="Veri Tabanına Giriş", sinif=1, yazarlar="Yeşim Ülgen Sönmez · Yunus Emre Demir",
         uniteler=[(1, "Veri Tabanına Giriş ve Temel Kavramlar", 11, 28), (2, "Veri Tabanı Tasarımı", 29, 38),
                   (3, "Varlık–İlişki (ER) Modeli", 39, 57), (4, "Normalizasyon", 58, 77),
                   (5, "SQL’e Giriş: Veri Tipleri ve Veri Tanımlama", 78, 97),
                   (6, "SQL ile Veri İşleme ve Sorgulama", 98, 118), (7, "Uygulamalar", 119, 134),
                   (8, "Final Sınavı Soruları ve Çözümleri", 135, 146)]),
    dict(pdf="ist.pdf", klasor="ybs/2/istatistik", testler={},
         ad="İstatistik", sinif=2, yazarlar="Yunus Emre Demir",
         uniteler=[(1, "İstatistik Serileri ve Grafikler", 8, 13), (2, "Ortalamalar", 14, 22)]),
    dict(pdf="fin.pdf", klasor="ybs/2/finansal-yonetim", testler={},
         ad="Finansal Yönetim", sinif=2, yazarlar="Yunus Emre Demir",
         uniteler=[(1, "Finansal Yönetim ve Finansal Sistem", 8, 11)]),
]

def filigran_sayfasi(w, h):
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=(w, h))
    c.saveState()
    c.setFillColorRGB(0.23, 0.36, 0.99, alpha=0.07)
    c.translate(w / 2, h / 2); c.rotate(40)
    c.setFont("Poppins", 78); c.drawCentredString(0, -26, FILIGRAN)
    c.restoreState()
    c.setFillColorRGB(0.42, 0.45, 0.56, alpha=0.55)
    c.setFont("Poppins", 7)
    c.drawCentredString(w / 2, 9, f"{FILIGRAN} · öğrenciler için ücretsiz ders notları")
    c.save(); buf.seek(0)
    return PdfReader(buf).pages[0]

def kesim_noktasi(doc, a, b):
    """Ünitedeki ilk büyük 'Ödevler' (yoksa 'Kendini Test Et') başlığının (sayfa, y) konumu."""
    for aranan in ("Ödevler", "Kendini Test Et"):
        for pno in range(a - 1, b):
            for blok in doc[pno].get_text("dict")["blocks"]:
                for satir in blok.get("lines", []):
                    t = "".join(s["text"] for s in satir["spans"]).strip()
                    if t == aranan and satir["spans"][0]["size"] > 11:
                        return pno, satir["bbox"][1]
    return None

def unite_pdf(kaynak_yol, a, b, hedef, baslik, yazarlar):
    doc = pymupdf.open(kaynak_yol)
    kes = kesim_noktasi(doc, a, b)
    son = b - 1
    if kes:
        pno, y = kes
        if y < 115:          # başlık sayfanın en üstündeyse sayfayı tamamen at
            son = pno - 1
        else:                # başlıktan alt bilginin üstüne kadar her şeyi gerçekten sil
            sayfa = doc[pno]
            sayfa.add_redact_annot(pymupdf.Rect(0, y - 18, sayfa.rect.width, 778), fill=(1, 1, 1))
            sayfa.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_REMOVE,
                                   graphics=pymupdf.PDF_REDACT_LINE_ART_REMOVE_IF_TOUCHED)
            son = pno
    yeni = pymupdf.open()
    yeni.insert_pdf(doc, from_page=a - 1, to_page=son)
    ara = f"{GECICI}/ara.pdf"
    yeni.save(ara, garbage=4, deflate=True)
    okuyucu = PdfReader(ara)
    w = float(okuyucu.pages[0].mediabox.width); h = float(okuyucu.pages[0].mediabox.height)
    damga = filigran_sayfasi(w, h)
    yaz = PdfWriter()
    for p in okuyucu.pages:
        yaz.add_page(p); yaz.pages[-1].merge_page(damga)
    yaz.add_metadata({"/Title": baslik, "/Author": yazarlar.replace(" · ", ", "), "/Producer": FILIGRAN})
    with open(ara, "wb") as f: yaz.write(f)
    subprocess.run(["qpdf", "--object-streams=generate", "--compress-streams=y", "--recompress-flate", ara, hedef], check=True)
    return dict(kes=kes, sayfa=son - (a - 1) + 1)

for k in KITAPLAR:
    hedef_klasor = f"{SITE}/notlar/{k['klasor']}"
    if os.path.isdir(hedef_klasor): shutil.rmtree(hedef_klasor)
    os.makedirs(hedef_klasor)
    ders = dict(ad=k["ad"], bolum="Yönetim Bilişim Sistemleri", sinif=k["sinif"], yazarlar=k["yazarlar"], uniteler=[])
    for n, ad, a, b in k["uniteler"]:
        pdf_ad = f"unite-{n}.pdf"
        bilgi = unite_pdf(k["pdf"], a, b, f"{hedef_klasor}/{pdf_ad}", f"Ünite {n} · {ad}", k["yazarlar"])
        u = dict(no=n, ad=ad, pdf=pdf_ad, sayfa=bilgi["sayfa"])
        t = k["testler"].get(str(n))
        if t:
            u["test"] = {x: t[x] for x in ("test", "dy", "bosluk")}
            if t.get("not"): u["not"] = t["not"]
        ders["uniteler"].append(u)
        kes = bilgi["kes"]
        print(f"{k['ad'][:22]:22} Ü{n} sayfa {a}-{b} -> {bilgi['sayfa']} sayfa, kesim: {('s.%d y=%d' % (kes[0] + 1, kes[1])) if kes else 'yok'}"
              f", {round(os.path.getsize(f'{hedef_klasor}/{pdf_ad}') / 1e6, 2)} MB")
    json.dump(ders, open(f"{hedef_klasor}/ders.json", "w"), ensure_ascii=False, separators=(",", ":"))
