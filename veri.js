/* =====================================================================
   KampüsCepte VERİ DOSYASI
   Siteyi güncellemek için çoğu zaman SADECE bu dosyayı değiştirmen yeterli.

   Kurallar (bozmamak için):
   - Yazıları çift tırnak içinde yaz: "Mercimek çorbası"
   - Liste elemanlarının arasına virgül koy, son elemandan sonra koyma şart değil
   - Tarihleri "YYYY-AA-GG" biçiminde yaz: "2027-01-04"
   - Not dosyası linki: "notlar/ybs/2/istatistik.pdf" gibi, dosyayı o klasöre yükle
   ===================================================================== */

/* Yurtlar (id, menü sayfası adresinde de kullanılır: kampuscepte.com.tr/<id>/) */
const yurtlar = [
  { id: "ahmet-kabakli",   ad: "Ahmet Kabaklı Yurdu",   tur: "erkek" },
  { id: "firat",           ad: "Elazığ Fırat Yurdu",    tur: "erkek" },
  { id: "omer-bilginoglu", ad: "Ömer Bilginoğlu Yurdu", tur: "erkek" },
  { id: "fethi-sekin",     ad: "Fethi Sekin Yurdu",     tur: "kiz" },
  { id: "harput",          ad: "Harput Yurdu",          tur: "kiz" },
  { id: "izzetpasa",       ad: "İzzetpaşa Yurdu",       tur: "kiz" },
  { id: "sare-ana",        ad: "Sare Ana Yurdu",        tur: "kiz" }
];

/* ================= KYK ORTAK EKİM 2026 MENÜSÜ =================
   Tüm Elazığ KYK yurtlarında kahvaltı ve akşam ana menüleri aynıdır.
   Farklılık sadece İl Müdürlüğü notunda belirtilen yurt gruplarına göre
   özel menü (Lahmacun vb.) tarihlerindedir:
   - 02.10 - 16.10: Ahmet Kabaklı
   - 05.10 - 22.10: Sare Ana, Harput, İzzetpaşa
   - 23.10 - 27.10: Ömer Bilginoğlu, Fethi Sekin, Fırat
   ===================================================================== */
const kykAnaMenu = {
  kahvaltiNotu: "Al götür kahvaltı her gün 10.30'a kadar verilir.",
  "2026-10-20": { kahvalti: ["Peynirli omlet", "Patates kızartma", "Karışık pizza", "Beyaz peynir", "Siyah / yeşil zeytin", "Çay"],
                  aksam: ["Ezogelin çorbası / Sebze çorbası", "Hamburger köfte + patates / Tavuk burger / Taze fasulye", "Pirinç pilavı", "Ayran"] },
  "2026-10-21": { kahvalti: ["Haşlanmış yumurta", "Karışık kızartma", "Sade poğaça", "Labne peynir", "Siyah / yeşil zeytin", "Çay"],
                  aksam: ["Sebze çorbası / Mercimek çorbası", "Fırında sebzeli tavuk ızgara / Mevsim türlü / Etli dolma", "Soslu makarna", "Karışık salata"] },
  "2026-10-22": { kahvalti: ["Sade omlet", "Patates salatası", "Çikolatalı kek", "Beyaz peynir", "Siyah / yeşil zeytin", "Çay"],
                  aksam: ["Yayla çorbası / Şehriye çorbası", "Etsiz kuru fasulye / Mevsim soslu karışık kızartma / Tavuk çöp şiş", "Bulgur pilavı", "Haydari", "Tulumba"] },
  "2026-10-23": { kahvalti: ["Haşlanmış yumurta", "Patates kızartma", "Peynirli börek", "Beyaz peynir", "Siyah / yeşil zeytin", "Çay"],
                  aksam: ["Ezogelin çorbası / Domates çorbası", "Patlıcan musakka / Nugget / Yoğurtlu kabak", "Soslu makarna", "Karışık salata"] },
  "2026-10-24": { kahvalti: ["Kaşarlı omlet", "Karışık kızartma", "Sucuklu yumurta", "Krem peynir", "Siyah / yeşil zeytin", "Çay"],
                  aksam: ["Ayran aşı çorbası / Tarhana çorbası", "Şinitzel / Rosto köfte / Sulu patates", "Erişte pilavı", "Şekerpare"] },
  "2026-10-25": { kahvalti: ["Haşlanmış yumurta", "Sosis kızartma", "Simit", "Beyaz peynir", "Siyah / yeşil zeytin", "Çay"],
                  aksam: ["Yayla çorbası / Ezogelin çorbası", "Patlıcan parmak kebabı / Salçalı mantı / Tavuk baget kızartma", "Bulgur pilavı", "Ezme"] },
  "2026-10-26": { kahvalti: ["Sucuklu omlet", "Patates salatası", "Dere otlu poğaça", "Krem peynir", "Siyah / yeşil zeytin", "Çay"],
                  aksam: ["Şehriye çorbası / Mercimek çorbası", "Tavuk döner / Karışık sebze graten", "Pirinç pilavı", "Karışık salata"] },
  "2026-10-27": { kahvalti: ["Haşlanmış yumurta", "Patates kızartma", "Kek + bal + tereyağı", "Beyaz peynir", "Siyah / yeşil zeytin", "Çay"],
                  aksam: ["Sebze çorbası / Tarhana çorbası", "Etsiz kuru fasulye / Mevsim soslu karışık kızartma / Nugget", "Erişte pilavı", "Yoğurt", "Brownie"] },
  "2026-10-28": { kahvalti: ["Sucuklu omlet", "Patates kavurma", "Zeytinli / peynirli açma", "Kaşar peynir", "Siyah / yeşil zeytin", "Çay"],
                  aksam: ["Mercimek çorbası / Domates çorbası", "Kuşbaşılı patlıcan kebap / Tavuk kavurma / Bezelye yemeği", "Sebzeli bulgur pilavı", "Çoban salata"] },
  "2026-10-29": { kahvalti: ["Menemen", "Karışık kızartma", "Mozaik kek", "Beyaz peynir", "Siyah / yeşil zeytin", "Çay"],
                  aksam: ["Ezogelin çorbası / Tarhana çorbası", "Tavuk tantuni / Mücver / Kıymalı ıspanak", "Makarna salatası", "Ayran"] },
  "2026-10-30": { kahvalti: ["Sade omlet", "Patates kızartma", "Simit", "Beyaz peynir", "Siyah / yeşil zeytin", "Çay"],
                  aksam: ["Mercimek çorbası / Yayla çorbası", "Ekmek arası köfte / Tavuk sote / Yoğurtlu mantı", "Nohutlu pirinç pilavı", "Mevsim salata"] },
  "2026-10-31": { kahvalti: ["Haşlanmış yumurta", "Salçalı sosis", "Ispanaklı börek", "Labne peynir", "Siyah / yeşil zeytin", "Çay"],
                  aksam: ["Dövme çorbası / Domates çorbası", "Orman kebabı / Ispanak yemeği / Tavuk çöp şiş", "Bulgur pilavı", "Sütlaç"] }
};

/* İl Müdürlüğü notu: bazı yurt gruplarına belirli tarihlerde özel akşam menüsü verilir.
   Menü listesi DEĞİŞMEZ; yalnızca ilgili yurdun ilgili günlerinde kısa bir not gösterilir. */
const kykOzelAralik = {
  "ahmet-kabakli":   ["2026-10-02", "2026-10-16"],
  "sare-ana":        ["2026-10-05", "2026-10-22"],
  "harput":          ["2026-10-05", "2026-10-22"],
  "izzetpasa":       ["2026-10-05", "2026-10-22"],
  "omer-bilginoglu": ["2026-10-11", "2026-10-27"],
  "fethi-sekin":     ["2026-10-11", "2026-10-27"],
  "firat":           ["2026-10-11", "2026-10-27"]
};
const kykOzelNot = (bas, bit) => {
  const g = t => t.slice(8, 10) + "." + t.slice(5, 7);
  return "Not: " + g(bas) + "–" + g(bit) + " tarihleri arasında yurdumuzda (Mercimek çorba, Lahmacun, Mevsim Salata, Ayran) menüsü verilecektir.";
};

/* Her yurt için ortak takvimden kendi menüsünü üretir; not yalnızca o yurdun özel tarih aralığındaki günlere eklenir. */
function kykYurtMenusu(yurtId) {
  const [bas, bit] = kykOzelAralik[yurtId] || ["", ""];
  const m = { kahvaltiNotu: kykAnaMenu.kahvaltiNotu };
  Object.keys(kykAnaMenu).forEach(k => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(k)) return;
    const gun = Object.assign({}, kykAnaMenu[k]);
    if (bas && k >= bas && k <= bit) gun.aksamNotu = kykOzelNot(bas, bit);
    m[k] = gun;
  });
  return m;
}

const yurtMenuleri = {};
["ahmet-kabakli", "sare-ana", "harput", "izzetpasa", "omer-bilginoglu", "fethi-sekin", "firat"]
  .forEach(id => { yurtMenuleri[id] = kykYurtMenusu(id); });

/* Üniversite Evi menüsü */
const uniEviMenuleri = {
  "2026-10-19": ["Etli taze fasulye", "Pirinç pilavı", "Mercimek çorbası", "Yoğurt"],
  "2026-10-20": ["Orman kebap", "Bulgur pilavı", "Yayla çorbası", "Meyve"],
  "2026-10-21": ["Rosto köfte", "Makarna", "Domates çorbası", "Tatlı"],
  "2026-10-22": ["Fırında tavuk", "Bulgur pilavı", "Mercimek çorbası", "Yoğurt"],
  "2026-10-23": ["Etli kuru fasulye", "Pirinç pilavı", "Mevsim salata", "Tahin helva"],
  "2026-10-26": ["Etli nohut", "Bulgur pilavı", "Yoğurt", "Tatlı"],
  "2026-10-27": ["Et kavurma", "Pirinç pilavı", "Mercimek çorbası", "Ayran"],
  "2026-10-28": ["Tebiyeli köfte", "Makarna", "Domates çorbası", "Meyve"],
  "2026-10-30": ["Etli bezelye", "Pirinç pilavı", "Mercimek çorbası", "Meyve"]
};
/* Üniversite Evi'nin kapalı olduğu özel günler */
const uniEviKapali = { "2026-10-29": "29 Ekim Cumhuriyet Bayramı" };

/* YBS dersleri — 2026-2027 güz dönemi ders programına göre (seçmeli ve staj dersleri hariç)
   link: ders sayfası ("ders.html?d=ybs/SINIF/klasor") ya da tek bir PDF ("notlar/ybs/2/dosya.pdf")
   link boşsa ders "Yakında" olarak görünür.
   Yeni ders: { kod: "", ad: "Ders adı", gun: "", saat: "", hoca: "", yer: "", link: "" }, */
const ybsDersleri = {
  1: [
    { kod: "YBS1105", ad: "Bilişim Sistemleri ve Teknolojilerine Giriş", gun: "Salı", saat: "13:15–17:00", hoca: "Dr. Öğr. Üyesi Yeşim Ülgen Sönmez", yer: "ENF LAB 2", link: "ders.html?d=ybs/1/bilisim-sistemleri" },
    { kod: "", ad: "Veri Tabanına Giriş", gun: "", saat: "", hoca: "", yer: "", link: "ders.html?d=ybs/1/veri-tabanina-giris" },
    { kod: "YBS1107", ad: "Algoritma", gun: "Pazartesi", saat: "08:15–12:00", hoca: "Doç. Dr. Mesut Toğaçar", yer: "ENF LAB 2", link: "" },
    { kod: "YBS1111", ad: "Muhasebe I", gun: "Pazartesi", saat: "13:15–16:00", hoca: "Doç. Dr. Meltem Gül", yer: "Çevre Amfi 3", link: "" },
    { kod: "YBS1103", ad: "İşletme Yönetimi", gun: "Perşembe", saat: "09:15–12:00", hoca: "Doç. Dr. Cem Ayden", yer: "Kimya Amfi 4", link: "" },
    { kod: "İKT1101", ad: "Mikro İktisat", gun: "Perşembe", saat: "13:15–16:00", hoca: "Doç. Dr. Yunus Gülcü", yer: "Kimya Amfi 4", link: "" },
    { kod: "YBS1109", ad: "İşletme Matematiği", gun: "Cuma", saat: "09:15–12:00", hoca: "Öğr. Gör. Tuba Şekerci", yer: "Kimya Amfi 4", link: "" }
  ],
  2: [
    { kod: "YBS2103", ad: "İstatistik", gun: "Perşembe", saat: "09:15–12:00", hoca: "Dr. Öğr. Üyesi Yunus Emre Gür", yer: "Çevre Derslik 3", link: "ders.html?d=ybs/2/istatistik" },
    { kod: "YBS2101", ad: "Finansal Yönetim", gun: "Salı", saat: "13:15–16:00", hoca: "Dr. Öğr. Üyesi Emre Bulut", yer: "Seminer Salonu", link: "ders.html?d=ybs/2/finansal-yonetim" },
    { kod: "YBS2105", ad: "Web Tabanlı Uygulamalar", gun: "Pazartesi", saat: "13:15–17:00", hoca: "Dr. Öğr. Üyesi Yeşim Ülgen Sönmez", yer: "ENF LAB 2", link: "" },
    { kod: "YBS2109", ad: "Nesne Tabanlı Programlama II", gun: "Salı", saat: "08:15–12:00", hoca: "Doç. Dr. Mesut Toğaçar", yer: "ENF LAB 2", link: "" },
    { kod: "YBS2113", ad: "Sosyal Medya Analizi", gun: "Perşembe", saat: "13:15–17:00", hoca: "Doç. Dr. Seda Özer Şanal", yer: "Çevre Derslik 3", link: "" },
    { kod: "YBS2115", ad: "Grafik Tasarımı ve Animasyon", gun: "Cuma", saat: "08:15–12:00", hoca: "Dr. Öğr. Üyesi Abdullah Şener", yer: "ENF LAB 2", link: "" },
    { kod: "YBS2107", ad: "Pazarlama İlkeleri", gun: "Cuma", saat: "13:15–16:00", hoca: "Dr. Öğr. Üyesi Yunus Emre Gür", yer: "Sosyal Hizmetler Amfi 4", link: "" }
  ],
  3: [
    { kod: "YBS301", ad: "Sistem Analizi ve Tasarımı", gun: "Pazartesi", saat: "09:15–12:00", hoca: "Dr. Öğr. Üyesi Abdullah Şener", yer: "Çalışma Ekonomisi Derslik 1", link: "" },
    { kod: "YBS311", ad: "Proje Yönetimi", gun: "Pazartesi", saat: "13:15–16:00", hoca: "Doç. Dr. Seda Özer Şanal", yer: "Çevre Derslik 3", link: "" },
    { kod: "YBS309", ad: "Yöneylem Araştırması", gun: "Çarşamba", saat: "09:15–12:00", hoca: "Doç. Dr. Ahmed İhsan Şimşek", yer: "Kimya Amfi 4", link: "" },
    { kod: "YBS307", ad: "Bilişim Hukuku", gun: "Çarşamba", saat: "13:15–16:00", hoca: "Öğr. Gör. Murat Bal", yer: "Kimya Amfi 4", link: "" },
    { kod: "YBS305", ad: "Veri Tabanı Sistemleri", gun: "Perşembe", saat: "08:15–12:00", hoca: "Dr. Öğr. Üyesi Yeşim Ülgen Sönmez", yer: "ENF LAB 2", link: "" },
    { kod: "YBS303", ad: "Veri Madenciliği", gun: "Perşembe", saat: "13:15–17:00", hoca: "Dr. Öğr. Üyesi Yunus Emre Gür", yer: "ENF LAB 2", link: "" }
  ],
  4: [
    { kod: "YBS409", ad: "Stratejik Yönetim", gun: "Pazartesi", saat: "09:15–12:00", hoca: "Doç. Dr. Cem Ayden", yer: "Çevre Derslik 3", link: "" },
    { kod: "YBS419", ad: "Teknolojik Liderlik ve Motivasyon", gun: "Pazartesi", saat: "13:15–16:00", hoca: "Dr. Öğr. Üyesi Hatice Gökçe Demirel", yer: "Seminer Salonu", link: "" },
    { kod: "YBS405", ad: "İşletmeler için Karar Destek Sistemleri", gun: "Salı", saat: "09:15–12:00", hoca: "Doç. Dr. Ahmed İhsan Şimşek", yer: "Çevre Derslik 3", link: "" },
    { kod: "YBS403", ad: "Müşteri İlişkileri Yönetimi", gun: "Salı", saat: "13:15–16:00", hoca: "Prof. Dr. Atilla Yücel", yer: "Çevre Derslik 3", link: "" },
    { kod: "YBS421", ad: "Yapay Zekâ", gun: "Çarşamba", saat: "09:15–12:00", hoca: "Dr. Öğr. Üyesi Abdullah Şener", yer: "ENF LAB 2", link: "" },
    { kod: "YBS411", ad: "Girişimcilik", gun: "Perşembe", saat: "09:15–12:00", hoca: "Öğr. Gör. Naim Aslanmirza", yer: "Seminer Salonu", link: "" },
    { kod: "YBS415", ad: "Bilgi Sistemleri Güvenliği ve Risk Yönetimi", gun: "Cuma", saat: "09:15–12:00", hoca: "Dr. Öğr. Üyesi Yunus Emre Gür", yer: "Sosyal Hizmetler Amfi 4", link: "" },
    { kod: "YBS417", ad: "Bilişim Toplumu ve E-Devlet", gun: "Cuma", saat: "13:15–16:00", hoca: "Doç. Dr. Seda Özer Şanal", yer: "Seminer Salonu", link: "" }
  ]
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
  { ad: "Ara sınavlar (vizeler)",              bas: "2026-11-16", bit: "2026-11-29", tur: "sinav" },
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
  { ad: "Ara sınavlar (vizeler)",              bas: "2027-03-29", bit: "2027-04-11", tur: "sinav", tahmini: true },
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
