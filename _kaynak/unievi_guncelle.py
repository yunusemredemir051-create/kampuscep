"""unievi.firat.edu.tr ana sayfasındaki haftalık menüyü okuyup veri.js içindeki uniEviMenuleri bloğunu günceller.
Yalnızca standart kütüphane kullanır (GitHub Actions'ta kurulum gerektirmez)."""
import html, json, re, sys, urllib.request, ssl
from datetime import date, timedelta

URL = "https://unievi.firat.edu.tr/"
LOG = open("/tmp/unievi.log", "w")
def log(*a): print(*a); print(*a, file=LOG)

AYLAR = {"ocak":1,"şubat":2,"mart":3,"nisan":4,"mayıs":5,"haziran":6,"temmuz":7,"ağustos":8,"eylül":9,"ekim":10,"kasım":11,"aralık":12}

def indir():
    ctx = ssl.create_default_context()
    hata = None
    for deneme in range(3):
        try:
            req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0 (KampusCepte menu bot; +https://kampuscepte.com.tr)", "Accept-Language": "tr"})
            with urllib.request.urlopen(req, timeout=40, context=ctx) as r:
                return r.read().decode("utf-8", "replace")
        except Exception as e:
            hata = e; log("indirme hatası:", repr(e))
            if "CERTIFICATE" in repr(e).upper():
                ctx = ssl._create_unverified_context()
    raise SystemExit(f"Sayfa indirilemedi: {hata!r}")

def duz_metin(h):
    h = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", h)
    h = re.sub(r"(?i)<br\s*/?>|</(p|div|li|tr|td|th|h\d|span)>", "\n", h)
    h = re.sub(r"<[^>]+>", " ", h)
    satirlar = [re.sub(r"\s+", " ", html.unescape(s)).strip() for s in h.split("\n")]
    return [s for s in satirlar if s]

TARIH = re.compile(r"(\d{1,2})[ .](" + "|".join(AYLAR) + r"|\d{1,2})[ .](\d{4})", re.I)
GUN = {"pazartesi","salı","çarşamba","perşembe","cuma","cumartesi","pazar","bugün"}

def tr_kucuk(s): return s.replace("I", "ı").replace("İ", "i").lower()

def guzel(y):
    y = tr_kucuk(y.strip(" -•·*"))
    y = re.sub(r"\bçorba\b", "çorbası", y) if re.search(r"\w+ çorba$", y) else y
    y = y.replace("t.helva", "tahin helva").replace("t. helva", "tahin helva")
    return y[:1].upper() + y[1:] if y else y

def ayristir(satirlar):
    menu, gun = {}, None
    for s in satirlar:
        m = TARIH.search(tr_kucuk(s))
        if m:
            g, a, yil = m.groups()
            ay = AYLAR.get(tr_kucuk(a)) or int(a)
            try: gun = date(int(yil), ay, int(g)).isoformat(); menu.setdefault(gun, [])
            except ValueError: gun = None
            continue
        if gun is None: continue
        k = tr_kucuk(s)
        if k in GUN or k.startswith("(") or len(s) > 60: continue
        if not re.search(r"[a-zçğıöşü]", k): continue
        if any(x in k for x in ("menü", "afiyet", "kalori", "tümünü", "haber", "duyuru")):
            if menu.get(gun): gun = None
            continue
        if len(menu[gun]) < 8 and s.upper() == s:   # yemek adları sitede büyük harfle yazılı
            menu[gun].append(guzel(s))
    return {g: y for g, y in menu.items() if len(y) >= 2}

h = indir()
open("/tmp/unievi.html", "w").write(h)
# Yalnızca "Üniversite Yemekhanesi" bölümünü al (sayfanın geri kalanındaki bağlantılar karışmasın)
bas = h.find("Yemekhanesi Ba"); son = h.find("<!--Üniversite Yemekhanesi Son-->")
if son != -1:
    h = h[(bas if bas != -1 and bas < son else 0):son]
else:
    log("UYARI: yemekhane bölüm işaretleri bulunamadı, tüm sayfa taranıyor.")
menu = ayristir(duz_metin(h))
log("Okunan menü:", json.dumps(menu, ensure_ascii=False, indent=1))
if not menu:
    raise SystemExit("Menü ayrıştırılamadı — sayfa yapısı değişmiş olabilir.")

v = open("veri.js", encoding="utf-8").read()
m = re.search(r"const uniEviMenuleri = \{(.*?)\n\};", v, re.S)
eski = dict(re.findall(r'"(\d{4}-\d{2}-\d{2})": (\[.*?\])', m.group(1)))
eski = {k: json.loads(x) for k, x in eski.items()}
birlesik = {**eski, **menu}
sinir = (date.today() - timedelta(days=21)).isoformat()   # 3 haftadan eski günleri at
birlesik = {k: birlesik[k] for k in sorted(birlesik) if k >= sinir}
govde = ",\n".join(f'  "{k}": {json.dumps(y, ensure_ascii=False)}' for k, y in birlesik.items())
v = v[:m.start()] + "const uniEviMenuleri = {\n" + govde + "\n};" + v[m.end():]
open("veri.js", "w", encoding="utf-8").write(v)
log("veri.js güncellendi:", len(menu), "gün okundu.")
