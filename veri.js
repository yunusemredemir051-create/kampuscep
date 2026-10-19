/* =====================================================================
   KampüsCep VERİ DOSYASI
   Siteyi güncellemek için çoğu zaman SADECE bu dosyayı değiştirmen yeterli.

   Kurallar (bozmamak için):
   - Yazıları çift tırnak içinde yaz: "Mercimek çorbası"
   - Liste elemanlarının arasına virgül koy, son elemandan sonra koyma şart değil
   - Tarihleri "YYYY-AA-GG" biçiminde yaz: "2027-01-04"
   - Not dosyası linki: "notlar/ybs/2/istatistik.pdf" gibi, dosyayı o klasöre yükle
   ===================================================================== */

/* Yurtlar: "wp" kısmına o yurdun WhatsApp grup linkini yapıştır. */
const yurtlar = [
  { id: "ahmet-kabakli",   ad: "Ahmet Kabaklı Yurdu",   tur: "erkek", wp: "" },
  { id: "firat",           ad: "Elazığ Fırat Yurdu",    tur: "erkek", wp: "" },
  { id: "omer-bilginoglu", ad: "Ömer Bilginoğlu Yurdu", tur: "erkek", wp: "" },
  { id: "fethi-sekin",     ad: "Fethi Sekin Yurdu",     tur: "kiz",   wp: "" },
  { id: "harput",          ad: "Harput Yurdu",          tur: "kiz",   wp: "" },
  { id: "izzetpasa",       ad: "İzzetpaşa Yurdu",       tur: "kiz",   wp: "" },
  { id: "sare-ana",        ad: "Sare Ana Yurdu",        tur: "kiz",   wp: "" }
];

/* Yurt menüleri — bir yurdun kendi menüsünü girmek için "varsayilan" bloğunu
   kopyala, adını o yurdun id'si yap (ör. "harput"). Girilmeyen yurtlar varsayılanı gösterir. */
const yurtMenuleri = {
  varsayilan: {
    kahvalti: ["Haşlanmış yumurta", "Beyaz peynir", "Siyah zeytin", "Domates, salatalık", "Bal, tereyağı"],
    aksam:    ["Mercimek çorbası", "Tavuk sote", "Pirinç pilavı", "Ayran"]
  }
};

/* Üniversite Evi menüsü — kaynak: https://unievi.firat.edu.tr ("Haftalık Menü")
   Her hafta yeni günleri aynı biçimde ekle: "YYYY-AA-GG": ["Yemek 1", "Yemek 2", ...],
   Geçmiş haftaları silebilirsin. Site her gün o günün menüsünü kendisi seçer. */
const uniEviMenuleri = {
  "2026-10-19": ["Etli taze fasulye", "Pirinç pilavı", "Mercimek çorbası", "Yoğurt"],
  "2026-10-20": ["Orman kebap", "Bulgur pilavı", "Yayla çorbası", "Meyve"],
  "2026-10-21": ["Rosto köfte", "Makarna", "Domates çorbası", "Tatlı"],
  "2026-10-22": ["Fırında tavuk", "Bulgur pilavı", "Mercimek çorbası", "Yoğurt"],
  "2026-10-23": ["Etli kuru fasulye", "Pirinç pilavı", "Mevsim salata", "T. helva"]
};

/* YBS dersleri — not eklemek için:
   1) PDF'i GitHub'da notlar/ybs/SINIF/ klasörüne yükle (ör. notlar/ybs/2/istatistik.pdf)
   2) Aşağıda o dersin link kısmına aynı yolu yaz: link: "notlar/ybs/2/istatistik.pdf"
   Yeni ders: { ad: "Ders adı", link: "" },  satırını ilgili sınıfa ekle */
const ybsDersleri = {
  1: [],
  2: [
    { ad: "İstatistik", link: "" },
    { ad: "Finansal Yönetim", link: "" },
    { ad: "Bilişim Sistemleri ve Teknolojileri", link: "" }
  ],
  3: [],
  4: []
};

/* Akademik takvim 2026–2027 (Fırat Üniversitesi genel akademik takvimi)
   tur: sinav | tatil | kayit | donem
   yarim: true → ilk gün arife (yarım gün)
   tahmini: true → takvimdeki hafta kuralına göre hesaplandı */
const donemler = [
  { ad: "Güz dönemi",   bas: "2026-09-21", bit: "2026-12-31" },
  { ad: "Bahar dönemi", bas: "2027-02-08", bit: "2027-05-30" }
];

const takvim = [
  { ad: "Ders kaydı ve harç ödeme",            bas: "2026-09-11", bit: "2026-09-17", tur: "kayit" },
  { ad: "Güz dönemi dersleri başlıyor",        bas: "2026-09-21", tur: "donem" },
  { ad: "Ders ekle-bırak",                     bas: "2026-09-30", bit: "2026-10-02", tur: "kayit" },
  { ad: "Muafiyet ve mazeretli kayıt son gün", bas: "2026-10-02", tur: "kayit" },
  { ad: "Geçici izin için son başvuru",        bas: "2026-10-09", tur: "kayit" },
  { ad: "Cumhuriyet Bayramı",                  bas: "2026-10-28", bit: "2026-10-29", tur: "tatil", yarim: true },
  { ad: "Ara sınavlar",                        bas: "2026-11-09", bit: "2026-11-22", tur: "sinav", tahmini: true },
  { ad: "Mazeret sınavları",                   bas: "2026-12-14", bit: "2026-12-27", tur: "sinav", tahmini: true },
  { ad: "Güz dönemi derslerin sonu",           bas: "2026-12-31", tur: "donem" },
  { ad: "Yılbaşı",                             bas: "2027-01-01", tur: "tatil" },
  { ad: "Final sınavları",                     bas: "2027-01-04", bit: "2027-01-17", tur: "sinav" },
  { ad: "Bütünleme sınavları",                 bas: "2027-01-25", bit: "2027-01-31", tur: "sinav" },
  { ad: "Bahar ders kaydı ve harç ödeme",      bas: "2027-02-01", bit: "2027-02-04", tur: "kayit" },
  { ad: "Başarı sıralaması %10 listesi",       bas: "2027-02-04", tur: "kayit" },
  { ad: "Tek ders sınavı",                     bas: "2027-02-05", tur: "sinav" },
  { ad: "Bahar dönemi dersleri başlıyor",      bas: "2027-02-08", tur: "donem" },
  { ad: "Ders ekle-bırak",                     bas: "2027-02-17", bit: "2027-02-19", tur: "kayit" },
  { ad: "Mazeretli kayıt son gün",             bas: "2027-02-19", tur: "kayit" },
  { ad: "Geçici izin için son başvuru",        bas: "2027-02-26", tur: "kayit" },
  { ad: "Ramazan Bayramı",                     bas: "2027-03-08", bit: "2027-03-11", tur: "tatil", yarim: true },
  { ad: "Ara sınavlar",                        bas: "2027-03-29", bit: "2027-04-11", tur: "sinav", tahmini: true },
  { ad: "23 Nisan",                            bas: "2027-04-23", tur: "tatil" },
  { ad: "1 Mayıs",                             bas: "2027-05-01", tur: "tatil" },
  { ad: "Mazeret sınavları",                   bas: "2027-05-03", bit: "2027-05-16", tur: "sinav", tahmini: true },
  { ad: "Kurban Bayramı ve 19 Mayıs",          bas: "2027-05-15", bit: "2027-05-19", tur: "tatil", yarim: true },
  { ad: "Bahar dönemi derslerin sonu",         bas: "2027-05-30", tur: "donem" },
  { ad: "Final sınavları",                     bas: "2027-05-31", bit: "2027-06-13", tur: "sinav" },
  { ad: "Bütünleme sınavları",                 bas: "2027-06-21", bit: "2027-06-27", tur: "sinav" },
  { ad: "Mezuniyet sınavı",                    bas: "2027-07-05", bit: "2027-07-06", tur: "sinav" },
  { ad: "Başarı sıralaması %10 listesi",       bas: "2027-07-09", tur: "kayit" },
  { ad: "15 Temmuz",                           bas: "2027-07-15", tur: "tatil" },
  { ad: "30 Ağustos Zafer Bayramı",            bas: "2027-08-30", tur: "tatil" }
];
