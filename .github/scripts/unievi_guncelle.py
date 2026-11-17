"""Üniversite Evi haftalık menüsünü unievi.firat.edu.tr'den okuyup veri.js'e yazar.

Ne yapar:
  1. Sayfayı indirir: önce doğrudan, olmazsa Türkiye'den bağlanabilen aracı (UNIEVI_VEKIL_URL, Cloudflare Worker) üzerinden.
     Üniversite sitesi yurt dışı IP'lerini engelliyor; GitHub Actions sunucuları yurt dışında (bkz. ARAYUZ-PLANI.md Ek 2).
  2. "Haftalık Menü" bölümündeki her günü okur: yemek adları + kalori, protein, karbonhidrat, yağ.
  3. veri.js'teki iki bloğu günceller:
       uniEviMenuleri  →  "2026-11-17": ["Kuru köfte", "Pirinç pilavı", ...]
       uniEviBesin     →  "2026-11-17": { y: [[kcal, protein, karb, yağ], ...], t: [günün toplamı] }

Güvenlik kuralları (Ek 2 / 4, 6, 7):
  - Sayfa okunamazsa ya da menü eksik/bozuk gelirse veri.js'e HİÇBİR ŞEY yazılmaz, iş akışı kırmızı biter.
  - Var olan günler silinmez; bir gün yalnızca sitede gerçekten değiştiyse güncellenir.
  - Yemek adları eski biçimde yazılır (guzel()), böylece yemekfoto.js'teki fotoğraf eşleşmeleri bozulmaz.
    Fotoğrafı olmayan adlar kayda ve iş akışı özetine liste olarak yazılır; fotoğraf dosyalarına dokunulmaz.
  - Menü puanları/beğeniler Firestore'da tarih + yemek adıyla tutulur; bu betik Firestore'a hiç dokunmaz.

Yalnızca standart kütüphane kullanır.

Kullanım:
  python3 .github/scripts/unievi_guncelle.py                  # GitHub Actions'taki normal çalışma
  python3 .github/scripts/unievi_guncelle.py --dosya sayfa.html --bugun 2026-11-17 --kuru   # deneme
Ortam değişkenleri:
  UNIEVI_VEKIL_URL   Cloudflare Worker adresi (yoksa yalnızca doğrudan denenir)
  UNIEVI_MOD         "haftasonu": o haftanın menüsü zaten tamsa siteye hiç gitmeden çıkar
"""
import argparse, html, json, os, re, ssl, sys, tempfile, urllib.request
from datetime import date, timedelta

URL = "https://unievi.firat.edu.tr/"
GECICI = tempfile.gettempdir()
LOG = open(os.path.join(GECICI, "unievi.log"), "w", encoding="utf-8")


def log(*a):
    print(*a)
    print(*a, file=LOG)
    LOG.flush()


AYLAR = {"ocak": 1, "şubat": 2, "mart": 3, "nisan": 4, "mayıs": 5, "haziran": 6, "temmuz": 7,
         "ağustos": 8, "eylül": 9, "ekim": 10, "kasım": 11, "aralık": 12}
TARIH = re.compile(r"(\d{1,2})[ .]+(" + "|".join(AYLAR) + r"|\d{1,2})[ .]+(\d{4})", re.I)


# ---------------------------------------------------------------- yazı biçimi

def tr_kucuk(s):
    return s.replace("I", "ı").replace("İ", "i").lower()


def tr_buyuk_ilk(s):
    if not s:
        return s
    ilk = {"i": "İ", "ı": "I"}.get(s[0], s[0].upper())
    return ilk + s[1:]


def guzel(y):
    """Sitedeki adı veri.js'teki biçime çevirir: 'Mercimek Çorba' → 'Mercimek çorbası'.
    Bu biçim yemekfoto.js'teki fotoğraf anahtarlarıyla aynıdır; değiştirilirse eşleşmeler bozulur."""
    y = tr_kucuk(re.sub(r"\s+", " ", y).strip(" -•·*"))
    y = re.sub(r"\bçorba\b", "çorbası", y) if re.search(r"\w+ çorba$", y) else y
    y = y.replace("t.helva", "tahin helva").replace("t. helva", "tahin helva")
    return tr_buyuk_ilk(y)


def duz(h):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", h))).strip()


def sayi(s):
    if s is None:
        return None
    s = s.replace(",", ".")
    try:
        f = float(s)
    except ValueError:
        return None
    return int(f) if f == int(f) else round(f, 1)


# ---------------------------------------------------------------- indirme

def _getir(url, zaman_asimi):
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (KampusCepte menu bot; +https://kampuscepte.com.tr)",
        "Accept-Language": "tr"})
    with urllib.request.urlopen(req, timeout=zaman_asimi, context=ssl.create_default_context()) as r:
        return r.read().decode("utf-8", "replace")


def indir():
    yollar = [("doğrudan", URL, 20, 1)]
    vekil = os.environ.get("UNIEVI_VEKIL_URL", "").strip()
    if vekil:
        yollar.append(("aracı (Cloudflare Worker)", vekil, 45, 2))
    else:
        log("Not: UNIEVI_VEKIL_URL tanımlı değil, yalnızca doğrudan bağlantı denenecek.")
    for ad, url, sure, deneme in yollar:
        for i in range(deneme):
            try:
                h = _getir(url, sure)
                if "fm-panel" not in h and "Yemekhanesi" not in h:
                    log(f"{ad}: sayfa geldi ama menü bölümü yok ({len(h)} bayt).")
                    continue
                log(f"Sayfa {ad} yoldan indirildi ({len(h)} bayt).")
                return h
            except Exception as e:  # zaman aşımı, bağlantı hatası vb.
                log(f"{ad} bağlantı hatası (deneme {i + 1}/{deneme}): {e!r}")
    raise SystemExit("HATA: Sayfa hiçbir yoldan indirilemedi. veri.js'e dokunulmadı.")


# ---------------------------------------------------------------- ayrıştırma

ETIKET = {"protein": 1, "karbonhidrat": 2, "yağ": 3}


def ayristir(h, bugun):
    """Sayfadaki her günü {tarih: {"yemekler": [...], "y": [[...]], "t": [...]}} olarak döndürür.
    Eksik ya da şüpheli günler atlanır ve kayda yazılır."""
    bas, son = h.find("Yemekhanesi Ba"), h.find("Yemekhanesi Son")
    if bas != -1 and son > bas:
        h = h[bas:son]
    else:
        log("UYARI: yemekhane bölüm işaretleri bulunamadı, tüm sayfada fm-panel aranıyor.")

    gunler = {}
    paneller = re.findall(r'<section[^>]*class="[^"]*\bfm-panel\b[^"]*"[^>]*>(.*?)</section>', h, re.S)
    if not paneller:
        log("UYARI: sayfada hiç gün paneli (fm-panel) yok — sitenin yapısı değişmiş olabilir.")
    for p in paneller:
        bas_m = re.search(r'class="fm-heading".*?<small>(.*?)</small>', p, re.S)
        m = TARIH.search(tr_kucuk(duz(bas_m.group(1)))) if bas_m else None
        if not m:
            log("Atlandı: tarihi okunamayan bir gün paneli.")
            continue
        g, a, yil = m.groups()
        try:
            gun = date(int(yil), AYLAR.get(tr_kucuk(a)) or int(a), int(g))
        except ValueError:
            log("Atlandı: geçersiz tarih", m.group(0))
            continue
        if not (bugun - timedelta(days=21) <= gun <= bugun + timedelta(days=21)):
            log(f"Atlandı: {gun} bugüne çok uzak, yanlış okunmuş olabilir.")
            continue

        yemekler, besin = [], []
        for parca in re.split(r'<div class="fm-dish"', p)[1:]:
            parca = parca.split('class="fm-total"')[0]
            ad_m = re.search(r"<strong>(.*?)</strong>", parca, re.S)
            ad = guzel(duz(ad_m.group(1))) if ad_m else ""
            if not ad or len(ad) > 60 or not re.search(r"[a-zçğıöşü]", tr_kucuk(ad)):
                continue
            satir = [None, None, None, None]
            e = re.search(r'class="fm-energy"[^>]*>\s*([\d.,]+)', parca)
            satir[0] = sayi(e.group(1)) if e else None
            for etiket, deger in re.findall(r"<span>\s*([^<]+?)\s*<b>\s*([\d.,]+)\s*g?\s*</b>", parca):
                i = ETIKET.get(tr_kucuk(etiket.strip()))
                if i:
                    satir[i] = sayi(deger)
            yemekler.append(ad)
            besin.append(satir)

        if len(yemekler) < 3:
            log(f"Atlandı: {gun} — yalnızca {len(yemekler)} yemek okundu, eksik olabilir.")
            continue

        toplam = [None, None, None, None]
        t = re.search(r'class="fm-total".*', p, re.S)
        if t:
            tk = re.search(r'fm-total-right"[^>]*>\s*<b>\s*([\d.,]+)', t.group(0))
            toplam[0] = sayi(tk.group(1)) if tk else None
            for etiket, deger in re.findall(r"<span>\s*([^<]+?)\s*<b>\s*([\d.,]+)\s*g?\s*</b>", t.group(0)):
                i = ETIKET.get(tr_kucuk(etiket.strip()))
                if i:
                    toplam[i] = sayi(deger)
        for i in range(4):  # sitede toplam yazmıyorsa yemeklerden topla (hepsi biliniyorsa)
            if toplam[i] is None and all(s[i] is not None for s in besin):
                toplam[i] = sayi(str(sum(s[i] for s in besin)))

        gunler[gun.isoformat()] = {"yemekler": yemekler, "y": besin, "t": toplam}
    return gunler


# ---------------------------------------------------------------- veri.js okuma / yazma

MENU_RE = re.compile(r"const uniEviMenuleri = \{(.*?)\n\};", re.S)
BESIN_RE = re.compile(r"const uniEviBesin = \{(.*?)\n\};", re.S)


def menuleri_oku(v):
    m = MENU_RE.search(v)
    if not m:
        raise SystemExit("HATA: veri.js'te uniEviMenuleri bloğu bulunamadı.")
    return {k: json.loads(x) for k, x in re.findall(r'"(\d{4}-\d{2}-\d{2})": (\[.*?\])', m.group(1))}


def besinleri_oku(v):
    m = BESIN_RE.search(v)
    if not m:
        raise SystemExit("HATA: veri.js'te uniEviBesin bloğu bulunamadı.")
    sonuc = {}
    for k, y, t in re.findall(r'"(\d{4}-\d{2}-\d{2})": \{ y: (\[.*?\]\]), t: (\[.*?\]) \}', m.group(1)):
        sonuc[k] = {"y": json.loads(y), "t": json.loads(t)}
    return sonuc


def js(x):
    return json.dumps(x, ensure_ascii=False).replace(", ", ", ")


def menuleri_yaz(v, menuler):
    govde = ",\n".join(f'  "{k}": {js(menuler[k])}' for k in sorted(menuler))
    m = MENU_RE.search(v)
    return v[:m.start()] + "const uniEviMenuleri = {\n" + govde + "\n};" + v[m.end():]


def besinleri_yaz(v, besinler):
    govde = ",\n".join(f'  "{k}": {{ y: {js(besinler[k]["y"])}, t: {js(besinler[k]["t"])} }}' for k in sorted(besinler))
    m = BESIN_RE.search(v)
    return v[:m.start()] + "const uniEviBesin = {\n" + govde + "\n};" + v[m.end():]


def kapali_gunler(v):
    m = re.search(r"const uniEviKapali = \{(.*?)\};", v, re.S)
    return set(re.findall(r'"(\d{4}-\d{2}-\d{2})"', m.group(1))) if m else set()


def foto_anahtarlari(yol):
    try:
        f = open(yol, encoding="utf-8").read()
    except OSError:
        return None
    m = re.search(r'const FOTOLAR = \{\s*"unievi": \{(.*?)\n    \}', f, re.S)
    return {k for k in re.findall(r'"([^"]+)":', m.group(1))} if m else None


# ---------------------------------------------------------------- ana akış

def hedef_hafta(bugun):
    """Hafta sonu ve pazartesi: menüsü beklenen haftanın iş günleri."""
    pzt = bugun + timedelta(days=(7 - bugun.weekday()) % 7) if bugun.weekday() >= 5 else bugun - timedelta(days=bugun.weekday())
    return [(pzt + timedelta(days=i)).isoformat() for i in range(5)]


def ozet_yaz(satirlar):
    yol = os.environ.get("GITHUB_STEP_SUMMARY")
    if yol:
        with open(yol, "a", encoding="utf-8") as f:
            f.write("\n".join(satirlar) + "\n")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dosya", help="sayfayı internetten değil bu dosyadan oku (deneme)")
    ap.add_argument("--veri", default="veri.js")
    ap.add_argument("--foto", default="yemekfoto.js")
    ap.add_argument("--bugun", help="YYYY-AA-GG (deneme için)")
    ap.add_argument("--kuru", action="store_true", help="veri.js'e yazma, yalnızca ne değişeceğini göster")
    a = ap.parse_args()

    bugun = date.fromisoformat(a.bugun) if a.bugun else date.today()
    v = open(a.veri, encoding="utf-8").read()
    eski_menu, eski_besin = menuleri_oku(v), besinleri_oku(v)

    if os.environ.get("UNIEVI_MOD") == "haftasonu":
        kapali = kapali_gunler(v)
        eksik = [g for g in hedef_hafta(bugun) if g not in kapali and (g not in eski_menu or g not in eski_besin)]
        if not eksik:
            log("Bu haftanın menüsü zaten tam, siteye gidilmedi (günlük kontrol düzeltmeleri yakalar).")
            return
        log("Eksik günler:", ", ".join(eksik))

    h = open(a.dosya, encoding="utf-8").read() if a.dosya else indir()
    open(os.path.join(GECICI, "unievi.html"), "w", encoding="utf-8").write(h)

    gunler = ayristir(h, bugun)
    log("Okunan günler:", json.dumps(gunler, ensure_ascii=False, indent=1))
    if not gunler:
        raise SystemExit("HATA: Menü ayrıştırılamadı — sitenin yapısı değişmiş olabilir. veri.js'e dokunulmadı.")

    yeni_menu, yeni_besin = dict(eski_menu), dict(eski_besin)
    eklenen, degisen = [], []
    for g, d in sorted(gunler.items()):
        if g not in eski_menu:
            eklenen.append(g)
        elif eski_menu[g] != d["yemekler"]:
            degisen.append(f"{g}: {eski_menu[g]} → {d['yemekler']}")
        yeni_menu[g] = d["yemekler"]
        yeni_besin[g] = {"y": d["y"], "t": d["t"]}

    anahtarlar = foto_anahtarlari(a.foto)
    fotosuz = sorted({y for d in gunler.values() for y in d["yemekler"]
                      if anahtarlar is not None and tr_kucuk(y) not in anahtarlar})

    ozet = ["## Üniversite Evi menüsü", f"- Okunan gün: {len(gunler)} ({', '.join(sorted(gunler))})",
            f"- Yeni eklenen: {', '.join(eklenen) or 'yok'}"]
    if degisen:
        ozet.append("- Sitede değişen günler:\n" + "\n".join(f"  - {x}" for x in degisen))
    if fotosuz:
        ozet.append("- Fotoğrafı olmayan yemekler (sitede çizim görünür, fotoğraf sonra eklenebilir): " + ", ".join(fotosuz))
    for s in ozet:
        log(s)
    ozet_yaz(ozet)

    yeni = besinleri_yaz(menuleri_yaz(v, yeni_menu), yeni_besin)
    if yeni == v:
        log("veri.js zaten güncel, değişiklik yok.")
        return
    if a.kuru:
        log("Kuru çalışma: veri.js'e yazılmadı.")
        return
    # Son güvenlik: yazılacak dosyada eski günlerin hepsi duruyor mu?
    kontrol = menuleri_oku(yeni)
    kayip = [g for g in eski_menu if g not in kontrol]
    if kayip:
        raise SystemExit(f"HATA: yazma sonrası bazı günler kayboluyordu ({kayip}); veri.js'e dokunulmadı.")
    open(a.veri, "w", encoding="utf-8").write(yeni)
    log("veri.js güncellendi.")


if __name__ == "__main__":
    main()
