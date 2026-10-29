"""Ortak ders: Atatürk İlkeleri ve İnkılap Tarihi I (güncel kitap, 14 bölüm + 3 prova).
Kullanım: python3 _kaynak/ortak_inkilap.py   (depo kökünden)
- Her bölümü ayrı PDF yapar, "Kendini Test Et"ten sonrasını PDF'ten siler, filigran basar
- notlar/ortak/inkilap-tarihi-1/ders.json: üniteler + testler + provalar
Soru verisi: _kaynak/inkilap/sorular.json (kitaptan ayrıştırıldı; anahtarlar bölüm no, V1, V2, F)
"""
import io, json, os, shutil, subprocess, tempfile
import pymupdf
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KAYNAK = os.path.join(KOK, "_kaynak", "inkilap")
HEDEF = os.path.join(KOK, "notlar", "ortak", "inkilap-tarihi-1")
FILIGRAN = "KampüsCepte"
pdfmetrics.registerFont(TTFont("Poppins", "/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf"))
GECICI = tempfile.mkdtemp()

BASLIK = {1: "İnkılap ve Konuyla İlgili Kavramlar", 2: "Osmanlı Devleti’nin Yıkılış Nedenleri: İç Nedenler",
          3: "Osmanlı Devleti’nin Yıkılış Nedenleri: Dış Nedenler",
          4: "Osmanlı Devleti’ni Kurtarma Çabaları: Tanzimat Öncesi ve Tanzimat Dönemi", 5: "Meşrutiyet Dönemi",
          6: "Osmanlı Devleti’nde Son Dönem Fikir Akımları",
          7: "Parçalanma Süreci: İttihat ve Terakki, Trablusgarp ve Balkan Savaşları", 8: "Birinci Dünya Savaşı",
          9: "Paylaşma Projeleri ve Savaşı Sona Erdiren Antlaşmalar", 10: "Mondros Ateşkes Antlaşması ve İlk İşgaller",
          11: "Azınlık Faaliyetleri, Zararlı ve Millî Cemiyetler", 12: "Millî Mücadelenin Başlaması: Samsun, Havza ve Amasya",
          13: "Kongreler Dönemi ve Heyet-i Temsiliye’nin Ankara’ya Gelişi",
          14: "Son Osmanlı Meclis-i Mebusanı, Misak-ı Millî ve İstanbul’un İşgali"}
# kitaptaki sayfa numarası + 11 = PDF sayfası (1 tabanlı)
KITAP_SAYFA = {1: (1, 8), 2: (9, 18), 3: (19, 27), 4: (28, 35), 5: (36, 41), 6: (42, 47), 7: (48, 54), 8: (55, 63),
               9: (64, 70), 10: (81, 87), 11: (88, 93), 12: (94, 100), 13: (101, 109), 14: (110, 115)}
EK_SAYFA = (121, 122)

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
    ders = dict(ad="Atatürk İlkeleri ve İnkılap Tarihi I", bolum="Ortak ders", sinif=None, yazarlar="Yunus Emre Demir", uniteler=[])
    for n, (b1, b2) in KITAP_SAYFA.items():
        ad = f"unite-{n}.pdf"
        sayfa = unite_pdf(doc, b1 + 11, b2 + 11, os.path.join(HEDEF, ad), f"Bölüm {n} · {BASLIK[n]}")
        u = dict(no=n, ad=BASLIK[n], pdf=ad, sayfa=sayfa, test=dict(test=sorular[str(n)], dy=[], bosluk=[]))
        ders["uniteler"].append(u)
        print(f"Bölüm {n}: {sayfa} sayfa, {len(sorular[str(n)])} soru, {os.path.getsize(os.path.join(HEDEF, ad)) // 1024} KB")
    ek = unite_pdf(doc, EK_SAYFA[0] + 11, EK_SAYFA[1] + 11, os.path.join(HEDEF, "unite-15.pdf"), "Dönem Planı ve Kronoloji", kesmeli=False)
    ders["uniteler"].append(dict(no=15, ad="Dönem Planı ve Kronoloji (hızlı tekrar)", pdf="unite-15.pdf", sayfa=ek))
    ders["provalar"] = [
        dict(id="vize1", ad="Vize Provası 1", konu="Bölüm 1–9 · 1.–8. hafta konuları", sure=40, puan=5, sorular=sorular["V1"]),
        dict(id="vize2", ad="Vize Provası 2", konu="Bölüm 1–9 · 1.–8. hafta konuları", sure=40, puan=5, sorular=sorular["V2"]),
        dict(id="final", ad="Final Provası", konu="Bölüm 10–14 konuları", sure=40, puan=5, sorular=sorular["F"]),
    ]
    ders["denemeler"] = [
        dict(id="vize", ad="Karışık deneme · Vize konuları", konu="Bölüm 1–9 sorularından rastgele", bolumler=list(range(1, 10)), adet=20, sure=40),
        dict(id="final", ad="Karışık deneme · Final konuları", konu="Bölüm 10–14 sorularından rastgele", bolumler=list(range(10, 15)), adet=20, sure=40),
        dict(id="donem", ad="Tüm dönem denemesi", konu="14 bölümden rastgele 30 soru", bolumler=list(range(1, 15)), adet=30, sure=60),
    ]
    json.dump(ders, open(os.path.join(HEDEF, "ders.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    print("toplam boyut", sum(os.path.getsize(os.path.join(HEDEF, f)) for f in os.listdir(HEDEF)) // 1024, "KB")

if __name__ == "__main__":
    main()
