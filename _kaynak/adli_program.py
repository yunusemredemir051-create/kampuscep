"""Adli Bilişim Mühendisliği 2026-2027 Güz haftalık programı (F.Ü. Teknoloji Fakültesi PDF'lerinden elle aktarıldı).
Çıktı: adli/program.json   Kullanım: python3 _kaynak/adli_program.py
Kayıt: (gün 0=Pzt..4=Cum, başlangıç, bitiş, ders, ayrıntı, şube 0=hepsi/1/2)"""
import json, os
S1, S2 = 1, 2
# ---- 1. öğretim ----
o1 = {
 "1": [
  (0,"08.15","10.00","ABM 1101 Algoritma ve Programlama-I LAB","Siber Güvenlik Lab",S1),
  (0,"10.15","12.00","MAT1161","",0),
  (0,"15.15","17.00","FİZ1111","",0),
  (1,"08.15","10.00","MAT1161","",0),
  (1,"13.15","15.00","FİZ1111","",0),
  (2,"09.15","12.00","ABM 1103 Adli Bilişim Mühendisliğinin Temelleri","B102",S1),
  (3,"09.15","12.00","ABM 1101 Algoritma ve Programlama-I","B102",0),
  (3,"13.15","15.00","ABM 1101 Algoritma ve Programlama-I LAB","Siber Güvenlik Lab",S2),
  (3,"15.15","17.00","ABM 1105 Temel Hukuk","B102",0),
  (4,"10.15","11.00","ABM 1103 Adli Bilişim Mühendisliğinin Temelleri LAB","Siber Güvenlik Lab",S1),
  (4,"11.15","12.00","ABM 1103 Adli Bilişim Mühendisliğinin Temelleri LAB","Siber Güvenlik Lab",S2),
 ],
 "2": [
  (0,"09.15","12.00","ABM 2101 Bilgisayar Ağları","B102",S1),
  (0,"09.15","12.00","ABM 2107 Veri Tabanı Yönetim Sistemleri","B108",S2),
  (0,"13.15","15.00","ABM 2101 Bilgisayar Ağları","B102",S2),
  (0,"13.15","15.00","ABM 2105 Veri Yapıları","B108",S1),
  (1,"09.15","12.00","ABM 2105 Veri Yapıları","B108",S2),
  (1,"09.15","12.00","ABM 2107 Veri Tabanı Yönetim Sistemleri","B102",S1),
  (1,"13.15","14.00","Bilişim Suçları ve Önleyici Tedbirler LAB","Elektronik Delil Lab",S2),
  (1,"13.15","14.00","Veri Tabanı Yönetim Sistemleri LAB","Siber Güvenlik Lab",S1),
  (1,"14.15","15.00","Bilişim Suçları ve Önleyici Tedbirler LAB","Elektronik Delil Lab",S1),
  (1,"14.15","15.00","Veri Tabanı Yönetim Sistemleri LAB","Siber Güvenlik Lab",S2),
  (2,"10.15","12.00","MAT2171","",0),
  (2,"15.15","17.00","SSD2101","",0),
  (3,"08.15","10.00","MAT2171","",0),
  (3,"10.15","12.00","İŞL 451 Girişimcilik I","B109",0),
  (3,"13.15","15.00","ABM 2101 Bilgisayar Ağları LAB","Elektronik Delil Lab",S2),
  (3,"15.15","17.00","ABM 2101 Bilgisayar Ağları LAB","Elektronik Delil Lab",S1),
  (4,"09.15","12.00","ABM 2103 Bilişim Suçları ve Önleyici Tedbirler","B108",S1),
  (4,"09.15","12.00","ABM 2105 Veri Yapıları LAB (10.00–12.00)","Elektronik Delil Lab",S2),
  (4,"13.15","16.00","ABM 2103 Bilişim Suçları ve Önleyici Tedbirler","B108",S2),
  (4,"13.15","16.00","ABM 2105 Veri Yapıları LAB (13.15–15.00)","Elektronik Delil Lab",S1),
 ],
 "3": [
  (0,"09.15","12.00","Bilişim Suçu İnceleme Donanımları","Adli Bilişim Donanımları Lab",S1),
  (0,"13.15","16.00","Bilişim Suçu İnceleme Donanımları","Adli Bilişim Donanımları Lab",S2),
  (1,"09.15","12.00","ABM 315 Bilişim Suçu İnceleme Yazılımları","Elektronik Delil Lab",0),
  (1,"13.15","16.00","ABM 313 İşletim Sistemleri","B108",S2),
  (1,"13.15","16.00","ABM 311 Elektronik Deliller ve Bilgisayar Suçları","B102",S1),
  (1,"16.15","17.00","ABM 311 Elektronik Deliller ve Bilgisayar Suçları LAB","Elektronik Delil Lab",S1),
  (2,"09.15","12.00","ABM 319 Çoklu Ortam Bilgi Sistemleri","Elektronik Delil Lab",0),
  (2,"13.15","15.00","ABM 315 Bilişim Suçu İnceleme Yazılımları LAB","Elektronik Delil Lab",S1),
  (2,"15.15","17.00","ABM 315 Bilişim Suçu İnceleme Yazılımları LAB","Elektronik Delil Lab",S2),
  (3,"08.15","10.00","ABM 319 Çoklu Ortam Bilgi Sistemleri LAB","Elektronik Delil Lab",S1),
  (3,"08.15","10.00","Bilişim Suçu İnceleme Donanımları LAB","Adli Bilişim Donanımları Lab",S2),
  (3,"10.15","12.00","ABM 319 Çoklu Ortam Bilgi Sistemleri LAB","Elektronik Delil Lab",S2),
  (3,"10.15","12.00","Bilişim Suçu İnceleme Donanımları LAB","Adli Bilişim Donanımları Lab",S1),
  (3,"13.15","16.00","ABM 313 İşletim Sistemleri","B108",S1),
  (4,"13.15","16.00","ABM 311 Elektronik Deliller ve Bilgisayar Suçları","B102",S2),
  (4,"16.15","17.00","ABM 311 Elektronik Deliller ve Bilgisayar Suçları LAB","Elektronik Delil Lab",S2),
 ],
 "4": [
  (1,"09.15","12.00","ABM 461 Bilgi Güvenliği Yönetimi","Siber Güvenlik Lab",0),
  (1,"13.15","15.00","ABM 413 İnsan Kaynakları Yönetimi","B109",0),
  (1,"15.15","16.00","ABM 461 Bilgi Güvenliği Yönetimi LAB","Siber Güvenlik Lab",0),
  (2,"12.15","13.00","455 Makine Öğrenmesi LAB","Siber Güvenlik Lab",0),
  (2,"13.15","16.00","455 Makine Öğrenmesi","Siber Güvenlik Lab",0),
  (3,"08.15","11.00","ABM 407 Elektronik Delil Toplanması ve Analizi","B108",0),
  (3,"11.15","13.00","ABM 407 Elektronik Delil Toplanması ve Analizi LAB","Siber Güvenlik Lab",0),
  (4,"10.15","12.00","ABM 404 Yazılım Etiği","B109",0),
 ],
}
# ---- 2. öğretim (akşam; PDF'de yalnızca 3. ve 4. sınıf var) ----
o2 = {
 "3": [
  (0,"14.15","16.00","ABM 315 Bilişim Suçu İnceleme Yazılımları LAB","Siber Güvenlik Lab",0),
  (0,"16.15","17.00","ABM 311 Elektronik Deliller ve Bilgisayar Suçları LAB","Elektronik Delil Lab",S2),
  (0,"17.15","20.00","Bilişim Suçu İnceleme Donanımları","Adli Bilişim Donanımları Lab",0),
  (1,"15.15","17.00","Bilişim Suçu İnceleme Donanımları LAB","Adli Bilişim Donanımları Lab",0),
  (1,"17.15","20.00","ABM 315 Bilişim Suçu İnceleme Yazılımları","Elektronik Delil Lab",0),
  (1,"20.15","23.00","ABM 319 Çoklu Ortam Bilgi Sistemleri","Elektronik Delil Lab",0),
  (3,"17.15","20.00","ABM 313 İşletim Sistemleri","B102",0),
  (4,"15.15","17.00","ABM 319 Çoklu Ortam Bilgi Sistemleri LAB","Elektronik Delil Lab",0),
  (4,"17.15","20.00","ABM 311 Elektronik Deliller ve Bilgisayar Suçları","B102",0),
 ],
 "4": [
  (0,"20.15","22.00","ABM 413 İnsan Kaynakları Yönetimi","B109",0),
  (1,"16.15","17.00","ABM 461 Bilgi Güvenliği Yönetimi LAB","Siber Güvenlik Lab",0),
  (1,"17.15","20.00","ABM 461 Bilgi Güvenliği Yönetimi","Siber Güvenlik Lab",0),
  (2,"16.15","17.00","455 Makine Öğrenmesi LAB","Siber Güvenlik Lab",0),
  (2,"17.15","20.00","455 Makine Öğrenmesi","Siber Güvenlik Lab",0),
  (3,"15.15","17.00","ABM 407 Elektronik Delil Toplanması ve Analizi LAB","Siber Güvenlik Lab",0),
  (3,"17.15","20.00","ABM 407 Elektronik Delil Toplanması ve Analizi","B108",0),
  (3,"20.15","22.00","ABM 404 Yazılım Etiği","B109",0),
 ],
}
def donustur(d):
    return {k: [dict(g=g, s=s, e=e, d=ad, h=h, sube=sb) for g, s, e, ad, h, sb in v] for k, v in d.items()}
cikti = {"donem": "2026-2027 Güz", "o1": donustur(o1), "o2": donustur(o2)}
yol = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "adli", "program.json")
json.dump(cikti, open(yol, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print(yol, {o: {k: len(v) for k, v in cikti[o].items()} for o in ("o1", "o2")})
