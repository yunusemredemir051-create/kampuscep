"""Elazığ (merkez) namaz vakitlerini Diyanet verisinden (ezanvakti.emushaf.net, ilçe 9432) okuyup vakitler.json'a yazar.
Diyanet ~30 gün ilerisini yayımlar; her gün çalışınca yeni günler eklenir, 40 günden eski günler silinir.
Biçim: {"gunler": {"YYYY-AA-GG": ["imsak","gunes","ogle","ikindi","aksam","yatsi"]}} """
import json, os, urllib.request
from datetime import date, timedelta

URL = "https://ezanvakti.emushaf.net/vakitler/9432"
req = urllib.request.Request(URL, headers={"User-Agent": "KampusCepte (+https://kampuscepte.com.tr)"})
with urllib.request.urlopen(req, timeout=40) as r:
    veri = json.load(r)

yeni = {}
for g in veri:
    gg, aa, yyyy = g["MiladiTarihKisa"].split(".")
    yeni[f"{yyyy}-{aa}-{gg}"] = [g["Imsak"], g["Gunes"], g["Ogle"], g["Ikindi"], g["Aksam"], g["Yatsi"]]
if len(yeni) < 7:
    raise SystemExit(f"Beklenenden az gün geldi: {len(yeni)}")

eski = {}
if os.path.exists("vakitler.json"):
    eski = json.load(open("vakitler.json", encoding="utf-8")).get("gunler", {})
sinir = (date.today() - timedelta(days=40)).isoformat()
gunler = {k: v for k, v in sorted({**eski, **yeni}.items()) if k >= sinir}
json.dump({"sehir": "Elazığ", "kaynak": "Diyanet İşleri Başkanlığı", "gunler": gunler},
          open("vakitler.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print(len(yeni), "gün okundu; toplam", len(gunler), "gün, son:", max(gunler))
