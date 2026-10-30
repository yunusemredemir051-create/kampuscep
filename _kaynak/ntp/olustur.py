"""Nesne Tabanlı Programlama II kitabını ünite PDF'lerine ayırır ve ders.json'u yazar.
Kullanım (depo kökünden): python3 _kaynak/ntp/olustur.py
- Her bölümü ayrı PDF yapar; "Kendini Test Et"ten sonrası (sorular + cevap anahtarı) PDF'ten silinir, uygulamada çözülür
- Filigran basar
- notlar/ybs/2/nesne-tabanli-programlama-2/ders.json: üniteler + testler + kod atölyesi + provalar
"""
import io, json, os, shutil, subprocess, sys, tempfile
import pymupdf
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

KOK = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
AYRI = os.path.dirname(os.path.abspath(__file__))
HEDEF = os.path.join(KOK, "notlar", "ybs", "2", "nesne-tabanli-programlama-2")
FILIGRAN = "KampüsCepte"
pdfmetrics.registerFont(TTFont("Poppins", "/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf"))
GECICI = tempfile.mkdtemp()
# kitap PDF sayfa numarası (1 tabanlı): kapak vb. 8 sayfa + bölüm sayfaları
UNITELER = [(1, "Visual Studio ve Windows Forms Ortamı", 9, 21), (2, "Toolbox ve Genel Kontroller", 22, 42),
            (3, "Veri Tipleri, Tür Dönüşümü ve Kontrol Yapıları", 43, 63), (4, "ComboBox ve ListBox ile Liste İşlemleri", 64, 77),
            (5, "Çoklu Form Uygulamaları", 78, 89), (6, "Veri Arama, Rastgele Sayılar ve Metin İşlemleri", 90, 109)]

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


def pdfler():
    out = {}
    if os.path.isdir(HEDEF): shutil.rmtree(HEDEF)
    os.makedirs(HEDEF)
    for n, ad, a, b in UNITELER:
        doc = pymupdf.open(os.path.join(AYRI, "ntp.pdf"))   # her ünite taze belge (redaksiyon kalıcı olmasın)
        s = unite_pdf(doc, a, b, os.path.join(HEDEF, f"unite-{n}.pdf"), f"Bölüm {n} · {ad}")
        out[n] = s
        print(f"Bölüm {n}: {s} sayfa, {os.path.getsize(os.path.join(HEDEF, f'unite-{n}.pdf')) // 1024} KB")
    return out

def ders_json(sayfalar):
    sys.path.insert(0, os.path.join(AYRI, "icerik"))
    import a1, a2, a3, a4, a5, a6, t
    from dsl import TURLER
    sorular = []
    for m in (a1, a2, a3, a4, a5, a6): sorular += m.SORULAR
    ders = dict(ad="Nesne Tabanlı Programlama II", bolum="Yönetim Bilişim Sistemleri", sinif=2, yazarlar="Yunus Emre Demir", uniteler=[])
    for n, ad, _, _ in UNITELER:
        u = dict(no=n, ad=ad, pdf=f"unite-{n}.pdf", sayfa=sayfalar[n], test=t.TESTLER[n])
        u["atolye"] = [q["id"] for q in sorular if q["id"].startswith(f"{n}.")]
        ders["uniteler"].append(u)
    ders["atolye"] = dict(turler=TURLER, sorular=sorular)

    def sec(birimler, idx):
        out = []
        for n in birimler:
            for i in idx:
                if i < len(t.TESTLER[n]["test"]):
                    q = dict(t.TESTLER[n]["test"][i]); q["a"] = (q.get("a") or "").strip() + f" (Bölüm {n})"; out.append(q)
        return out
    ders["provalar"] = [
        dict(id="vize1", ad="Vize Provası 1", konu="Bölüm 1–3", sure=30, puan=5, sorular=sec([1, 2, 3], [0, 2, 4, 6, 8])),
        dict(id="vize2", ad="Vize Provası 2", konu="Bölüm 1–3", sure=30, puan=5, sorular=sec([1, 2, 3], [1, 3, 5, 7, 9])),
        dict(id="final1", ad="Final Provası 1", konu="Bölüm 4–6", sure=30, puan=5, sorular=sec([4, 5, 6], [0, 2, 4, 6, 8])),
        dict(id="final2", ad="Final Provası 2", konu="Bölüm 4–6", sure=30, puan=5, sorular=sec([4, 5, 6], [1, 3, 5, 7, 9])),
    ]
    ders["denemeler"] = [
        dict(id="vize", ad="Karışık deneme · Bölüm 1–3", konu="Bölüm 1–3 sorularından rastgele", bolumler=[1, 2, 3], adet=15, sure=25),
        dict(id="final", ad="Karışık deneme · Bölüm 4–6", konu="Bölüm 4–6 sorularından rastgele", bolumler=[4, 5, 6], adet=15, sure=25),
        dict(id="donem", ad="Tüm dönem denemesi", konu="6 bölümden rastgele 25 soru", bolumler=[1, 2, 3, 4, 5, 6], adet=25, sure=40),
    ]
    json.dump(ders, open(os.path.join(HEDEF, "ders.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    print("ders.json", os.path.getsize(os.path.join(HEDEF, "ders.json")) // 1024, "KB;", len(sorular), "atölye sorusu")

if __name__ == "__main__":
    ders_json(pdfler())
