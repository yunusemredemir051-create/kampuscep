/* SINAV KOÇUM · Finansal Yönetim — içerik (1/2: vize provalarındaki uygulama soruları, konu 1–5)
   Sıra bilinçli: önce vize provalarında çıkan hesap soruları (dikey, yatay, trend, basit-bileşik faiz,
   bugünkü değer), sonra NBD ve KE (finansal-2.js), en son tanım ve kavram konuları.
   Soru alanları koc/algoritma-1.js başındaki açıklamayla aynıdır.
   Sayısal boşluk cevaplarında birden çok yazım kabul edilir (%25, 25, 25%, 25,00 …).
*/
(function () {
  var K = String.raw;
  var D = window.KOC_DERS = window.KOC_DERS || { id: "finansal", ad: "Finansal Yönetim", konular: [], sorular: [] };
  D.klasikYer = "Çözümünü adım adım buraya yaz: formül → yerine koyma → sonuç → karar/yorum cümlesi";
  D.becAd = {
    "dikey-tanim": "Dikey analizin tanımı", "dikey-baz": "Dikey analizde baz kalem", "dikey-hesap": "Dikey analiz hesabı", "dikey-yorum": "Dikey analizi yorumlama",
    "yatay-tanim": "Yatay analizin tanımı", "yatay-hesap": "Yatay analiz hesabı", "yatay-payda": "Yatay analizde payda",
    "trend-tanim": "Trend analizinin tanımı", "trend-hesap": "Trend endeksi hesabı", "trend-yorum": "Trend endeksini yorumlama", "analiz-ayirt": "Dikey / yatay / trend ayrımı",
    "basit-faiz": "Basit faiz hesabı", "bilesik-faiz": "Bileşik faiz (GD) hesabı", "firsat-karar": "“Fırsatı değerlendirmeli mi?” kararı",
    "bd-hesap": "Bugünkü değer hesabı", "teklif-karar": "Teklifi değerlendirme", "carpan": "(1 + i)ⁿ çarpanı",
    "nbd-tanim": "NBD'nin tanımı ve karar kuralı", "nbd-hesap": "NBD hesabı", "iskonto": "İskonto oranı ve çarpanlar", "ara-cikis": "Ara dönem eksi nakit akışları",
    "ke-tanim": "KE'nin tanımı ve karar kuralı", "ke-hesap": "KE hesabı", "nbd-ke": "NBD ile KE karşılaştırması",
    "fy-tanim": "Finansal yönetim", "sistem": "Finansal sistem ve unsurları", "finansman": "Doğrudan / dolaylı finansman", "para-sermaye": "Para ve sermaye piyasaları",
    "birincil-ikincil": "Birincil / ikincil piyasa", "organize": "Organize / tezgâhüstü piyasa",
    "bilanco": "Bilanço", "donen-duran": "Dönen ve duran varlıklar", "gelir-tablosu": "Gelir tablosu", "pzd": "Paranın zaman değeri", "risksiz": "Risksiz getiri"
  };
  /* Sayısal cevapların kabul edilen yazımları */
  function Y(x) { var s = String(x); return [s, "%" + s, s + "%", "% " + s, s + " %", "%" + s + ",00", s + ",00"]; }
  function T(x) { var s = String(x), d = s.replace(/\./g, ""); return [s, d, s + " tl", d + " tl", s + " $", d + " $", s + "$", d + "$", s + "tl", d + "tl"]; }

  /* ------------------------------------------------------------------ 1 */
  D.konular.push({
    no: 1, ad: "Dikey analiz (vize uygulaması)", kisa: "Dikey analiz", sinav: "vize",
    hedef: ["Gelir tablosunda ve bilançoda hangi kalemin %100 kabul edildiğini bilmek", "Her kalemin dikey yüzdesini hesaplamak", "Vize provasındaki gelir tablosu sorusunu baştan sona çözmek", "Sonuca yorum cümlesi yazmak"],
    anlat: [
      { t: "p", h: "Vize provalarında ilk uygulama sorusu hep bir tabloyla gelir: <b>“Gelir tablosunun dikey analizini yapınız ve yorumlayınız.”</b> Dikey analiz, tablodaki her kalemin <b>aynı tablodaki bir toplamın yüzde kaçı</b> olduğunu bulmaktır. Sadece tek bir yılın tablosu yeter." },
      { t: "formul", baslik: "Formül", h: "Dikey % = <b>İlgili kalem ÷ Seçilen toplam × 100</b>" },
      { t: "tablo", baslik: "Payda (%100 kabul edilen kalem) hangisi?", b: ["Tablo", "%100 kabul edilen", "Sorduğu soru"], r: [["Gelir tablosu", "Toplam gelir (net satışlar)", "Her 100 TL satışın nereye gittiği"], ["Bilanço", "Toplam varlıklar (ya da toplam kaynaklar)", "Paranın hangi varlıklara bağlandığı"]] },
      { t: "adim", baslik: "Vize Provası 1 · Uygulama 1 adım adım", adimlar: [
        ["Soru", "Toplam gelir 8.000.000 $, satılan malların maliyeti 4.800.000 $, brüt kâr 3.200.000 $, işletme giderleri 1.200.000 $, faiz gideri 400.000 $, net kâr 1.600.000 $. Dikey analizini yapıp net kârı yorumlayın."],
        ["1. Baz kalemi yaz", "Gelir tablosu olduğu için baz toplam gelirdir: 8.000.000 $ = %100. Bunu cevabın ilk satırına mutlaka yaz."],
        ["2. SMM", "4.800.000 ÷ 8.000.000 × 100 = %60"],
        ["3. Brüt kâr", "3.200.000 ÷ 8.000.000 × 100 = %40"],
        ["4. İşletme giderleri", "1.200.000 ÷ 8.000.000 × 100 = %15"],
        ["5. Faiz gideri", "400.000 ÷ 8.000.000 × 100 = %5"],
        ["6. Net kâr", "1.600.000 ÷ 8.000.000 × 100 = %20"],
        ["7. Yorum cümlesi", "Her 100 $'lık satışın 60 $'ı malın maliyetine, 15 $'ı işletme giderlerine, 5 $'ı faize gidiyor; geriye 20 $ net kâr kalıyor. Net kâr marjı %20'dir."]] },
      { t: "tablo", baslik: "Kâğıda böyle yaz (4 sütunlu tablo)", b: ["Kalem", "Miktar ($)", "İşlem", "Dikey %"], r: [["Toplam gelir", "8.000.000", "8.000.000 / 8.000.000 × 100", "%100"], ["SMM", "4.800.000", "4.800.000 / 8.000.000 × 100", "%60"], ["Brüt kâr", "3.200.000", "3.200.000 / 8.000.000 × 100", "%40"], ["İşletme giderleri", "1.200.000", "1.200.000 / 8.000.000 × 100", "%15"], ["Faiz gideri", "400.000", "400.000 / 8.000.000 × 100", "%5"], ["Net kâr", "1.600.000", "1.600.000 / 8.000.000 × 100", "%20"]] },
      { t: "hayat", baslik: "Puan kaybetme", h: "Uygulama sorularında formül ve kurulum doğruysa işlem hatasına kısmi puan verilir; ama sonuçtan sonra <b>yorum cümlesi</b> yazmazsan puan kırılır. Tabloyu bitirince “her 100 TL satıştan … TL net kâr kalıyor” cümlesini yazmadan geçme." },
      { t: "kontrol", s: "Bir bilançonun dikey analizinde toplam varlıklar 20.000.000 $, envanter 6.000.000 $. Envanterin dikey yüzdesi kaçtır?", o: ["%20", "%30", "%60", "%3,33"], c: 1, a: "6.000.000 ÷ 20.000.000 × 100 = %30. Bilançoda payda toplam varlıklardır." }
    ],
    alt: [
      { t: "p", h: "Dikey analizi bir <b>pasta</b> gibi düşün. Pastanın tamamı %100'dür: gelir tablosunda pastanın tamamı toplam gelir. Her kalem pastadan bir dilimdir. Dikey analiz “bu dilim pastanın yüzde kaçı?” sorusunu cevaplar." },
      { t: "hayat", baslik: "Aylık harçlık örneği", h: "Aylık 10.000 TL harçlığın var (%100). 4.000 TL kiraya gidiyor: 4.000 ÷ 10.000 × 100 = %40. 1.500 TL yemeğe: %15. Elinde 2.000 TL kalıyorsa “harçlığımın %20'sini biriktiriyorum” dersin. Gelir tablosundaki net kâr yüzdesi de tam olarak budur." },
      { t: "p", h: "Hesap hep aynı üç hareket: <b>kalemi al → toplam gelire böl → 100 ile çarp</b>. Paydayı bir kez bulursun, sonra bütün satırlarda aynı sayıya bölersin." },
      { t: "kontrol", s: "Gelir tablosunda toplam gelir 5.000.000 TL, net kâr 1.000.000 TL. Net kâr marjı kaçtır?", o: ["%5", "%10", "%20", "%50"], c: 2, a: "1.000.000 ÷ 5.000.000 × 100 = %20." }
    ],
    ozet: ["Dikey % = Kalem ÷ Toplam × 100", "Gelir tablosunda %100: toplam gelir (net satışlar)", "Bilançoda %100: toplam varlıklar (toplam kaynaklar)", "Tek dönemin tablosu yeter", "Tabloyu 4 sütunla kur, sonunda yorum cümlesi yaz"]
  });
  D.sorular.push(
    { id: "f1-01", k: 1, z: 1, tip: "mc", b: "dikey-tanim", s: "Bir mali tablodaki her kalemin aynı tablodan seçilmiş bir toplama oranlanmasına ne denir?", o: ["Yatay analiz", "Trend analizi", "Dikey analiz", "Oran analizi", "Nakit akış analizi"], c: 2, y: { 0: "Yatay analiz iki dönemi karşılaştırır.", 1: "Trend analizi baz yıla göre birçok dönemi karşılaştırır." }, a: "Dikey analizde her kalem aynı tablodaki bir toplama (toplam gelir ya da toplam varlıklar) bölünür; tek dönem yeterlidir." },
    { id: "f1-02", k: 1, z: 1, tip: "mc", b: "dikey-baz", s: "Gelir tablosunun dikey analizinde hangi kalem %100 kabul edilir?", o: ["Net kâr", "Brüt kâr", "Toplam gelir (net satışlar)", "Faiz gideri", "Satılan malların maliyeti"], c: 2, y: { 0: "Net kâr tablonun en altındaki sonuçtur; payda değil, yüzdesi bulunan kalemdir." }, a: "Gelir tablosunda payda toplam gelirdir; bütün kalemler toplam gelire bölünür." },
    { id: "f1-03", k: 1, z: 1, tip: "mc", b: "dikey-baz", s: "Bilançonun dikey analizinde varlık kalemleri hangi toplama oranlanır?", o: ["Toplam gelire", "Toplam varlıklara", "Net kâra", "Önceki yılın değerine", "Baz yılın değerine"], c: 1, y: { 3: "Önceki yıla bölmek yatay analizdir.", 4: "Baz yıla bölmek trend analizidir." }, a: "Bilançoda baz toplam varlıklar (ya da toplam kaynaklar) olur." },
    { id: "f1-04", k: 1, z: 1, tip: "bosluk", b: "dikey-hesap", s: "Toplam varlıkları 8.000.000 $ olan bir işletmenin stokları 2.000.000 $'dır. Stokların dikey analiz yüzdesi % ______'tir.", c: Y(25), a: "2.000.000 ÷ 8.000.000 × 100 = %25" },
    { id: "f1-05", k: 1, z: 2, tip: "bosluk", b: "dikey-hesap", s: "Toplam geliri 8.000.000 $, satılan malların maliyeti 4.800.000 $ olan işletmede SMM'nin dikey yüzdesi % ______'dır.", c: Y(60), a: "4.800.000 ÷ 8.000.000 × 100 = %60 (Vize Provası 1, Uygulama 1)" },
    { id: "f1-06", k: 1, z: 2, tip: "bosluk", b: "dikey-hesap", s: "Toplam geliri 10.000.000 $, net kârı 2.700.000 $ olan işletmenin net kâr marjı (dikey %) % ______'dir.", c: Y(27), a: "2.700.000 ÷ 10.000.000 × 100 = %27" },
    { id: "f1-07", k: 1, z: 1, tip: "dy", b: "dikey-tanim", s: "Dikey analiz yapmak için tek bir dönemin mali tablosu yeterlidir.", c: true, a: "Doğru. Dikey analiz aynı tablonun içindeki kalemleri karşılaştırır; yatay analiz için en az 2, trend için 3 ve daha fazla dönem gerekir." },
    { id: "f1-08", k: 1, z: 2, tip: "dy", b: "dikey-baz", s: "Dikey analizde payda, kalemin bir önceki dönemdeki değeridir.", c: false, a: "Yanlış. Önceki döneme bölmek yatay analizdir. Dikey analizde payda aynı tablodaki toplamdır (toplam gelir / toplam varlıklar)." },
    { id: "f1-09", k: 1, z: 2, tip: "mc", b: "dikey-yorum", s: "Gelir tablosunun dikey analizinde net kâr %20 bulundu. Bu sonucun doğru yorumu hangisidir?", o: ["Net kâr geçen yıla göre %20 artmış", "Her 100 TL'lik satıştan 20 TL net kâr kalıyor", "Giderler satışların %20'si", "Net kâr baz yıla göre 20 puan artmış", "Satışlar %20 azalmış"], c: 1, y: { 0: "Geçen yıla göre değişim yatay analizin konusudur.", 3: "Baz yıl trend analizinde kullanılır." }, a: "Dikey yüzde “toplamın yüzde kaçı” demektir: her 100 TL satıştan 20 TL net kâr kalıyor, net kâr marjı %20." },
    { id: "f1-10", k: 1, z: 3, tip: "mc", b: "dikey-hesap", s: "Toplam gelir 5.000.000 TL, SMM 3.000.000 TL, işletme giderleri 750.000 TL, faiz gideri 250.000 TL, net kâr 1.000.000 TL. İşletme giderlerinin dikey yüzdesi kaçtır?", o: ["%25", "%7,5", "%15", "%75", "%5"], c: 2, y: { 0: "750.000 ÷ 3.000.000 yapılmış; payda SMM değil toplam gelirdir.", 3: "750.000 ÷ 1.000.000 yapılmış; payda net kâr değildir." }, a: "750.000 ÷ 5.000.000 × 100 = %15" },
    { id: "f1-11", k: 1, z: 2, tip: "sira", b: "dikey-hesap", s: "Vizede dikey analiz sorusunu çözerken adımları doğru sıraya koy.", o: ["Baz kalemi belirle ve %100 yaz", "Her kalemi baz kaleme böl", "Sonucu 100 ile çarp", "Yüzdeleri tabloya yaz", "Yorum cümlesini yaz"], a: "Önce payda bulunur, sonra her satır aynı paydaya bölünüp 100 ile çarpılır; en son yorum yazılır." },
    { id: "f1-12", k: 1, z: 3, tip: "mc", b: "dikey-hesap", s: "Toplam varlıkları 20.000.000 $ olan bir işletmede nakdin dikey yüzdesi %10'dur. Nakit kaç $'dır?", o: ["200.000", "2.000.000", "10.000.000", "1.000.000", "20.000.000"], c: 1, a: "Nakit = 20.000.000 × 10 / 100 = 2.000.000 $. Formülü ters çevirdik: Kalem = Toplam × Yüzde / 100." },
    { id: "f1-13", k: 1, z: 3, tip: "dy", b: "dikey-yorum", s: "Bilançonun dikey analizinde varlık kalemlerinin (alt toplamlar hariç) yüzdeleri toplanırsa %100 eder.", c: true, a: "Doğru. Her kalem aynı toplamın bir parçasıdır; parçaların yüzdeleri toplamı %100'dür. (Örn. %10 + %15 + %30 + %5 + %35 + %5 = %100)" },
    { id: "f1-14", k: 1, z: 2, tip: "klasik", b: "dikey-hesap", s: "Bir işletmenin gelir tablosu: Toplam gelir 6.000.000 TL, satılan malların maliyeti 3.600.000 TL, brüt kâr 2.400.000 TL, işletme giderleri 900.000 TL, faiz gideri 300.000 TL, net kâr 1.200.000 TL. Gelir tablosunun dikey analizini yapınız ve yorumlayınız.", model: K`Baz: Toplam gelir 6.000.000 = %100
SMM          3.600.000 / 6.000.000 × 100 = %60
Brüt kâr     2.400.000 / 6.000.000 × 100 = %40
İşl. gider.    900.000 / 6.000.000 × 100 = %15
Faiz gideri    300.000 / 6.000.000 × 100 = %5
Net kâr      1.200.000 / 6.000.000 × 100 = %20

Yorum: Her 100 TL satışın 60 TL'si maliyete, 15 TL'si
işletme giderine, 5 TL'si faize gidiyor; 20 TL net kâr
kalıyor. Net kâr marjı %20.`, olcut: ["Toplam gelir %100 (baz) olarak yazıldı", "Her kalem 6.000.000'a bölünüp 100 ile çarpıldı", "SMM %60 ve brüt kâr %40 doğru", "İşletme giderleri %15, faiz %5, net kâr %20 doğru", "Yorum cümlesi yazıldı (her 100 TL'den 20 TL net kâr)"], a: "Yorum cümlesi olmadan tam puan alınmaz." }
  );

  /* ------------------------------------------------------------------ 2 */
  D.konular.push({
    no: 2, ad: "Yatay analiz (vize uygulaması)", kisa: "Yatay analiz", sinav: "vize",
    hedef: ["Yatay analizde paydanın önceki dönem olduğunu bilmek", "Değişim tutarını ve yüzdesini bulmak", "Artış / azalış yorumu yazmak"],
    anlat: [
      { t: "p", h: "Yatay analiz, aynı kalemin <b>iki dönem arasında ne kadar değiştiğini</b> bulur. Vize Provası 2'de “alacakların 2025→2026 yatay analizini yapınız” diye soruldu. Paydaya her zaman <b>önceki dönem</b> yazılır." },
      { t: "formul", baslik: "Formül", h: "Değişim tutarı = Cari dönem − Önceki dönem<br>Yatay % = <b>(Cari − Önceki) ÷ Önceki × 100</b>" },
      { t: "adim", baslik: "Vize Provası 2 · Uygulama 1-a adım adım", adimlar: [
        ["Soru", "Alacaklar 2025'te 600.000 $, 2026'da 750.000 $. 2025→2026 yatay analizini yapınız."],
        ["1. Önceki dönemi bul", "Önceki dönem (baz) 2025: 600.000 $. Payda bu olacak."],
        ["2. Farkı bul", "750.000 − 600.000 = 150.000 $ (değişim tutarı)"],
        ["3. Önceki döneme böl", "150.000 ÷ 600.000 = 0,25"],
        ["4. 100 ile çarp", "0,25 × 100 = %25"],
        ["5. Yorum", "Sonuç pozitif: alacaklar son bir yılda %25 artmış. Negatif çıksaydı “azalmış” yazacaktık."]] },
      { t: "tablo", baslik: "Bilanço örneği (2025 → 2026)", b: ["Kalem", "2025", "2026", "Değişim", "Yatay %"], r: [["Nakit", "1.800.000", "2.000.000", "+200.000", "+%11,11"], ["Alacaklar", "2.400.000", "3.000.000", "+600.000", "+%25"], ["Envanter", "5.000.000", "6.000.000", "+1.000.000", "+%20"], ["Toplam varlıklar", "17.500.000", "20.000.000", "+2.500.000", "+%14,29"]] },
      { t: "hayat", baslik: "En sık hata", h: "Paydaya <b>yeni yılın</b> değerini yazmak. 400.000 → 500.000 değişiminde 100.000 ÷ 500.000 = %20 değil, 100.000 ÷ 400.000 = <b>%25</b> artıştır. Değişim hep <b>başlangıç noktasına</b> göre ölçülür." },
      { t: "kontrol", s: "Bir kalem 800.000 TL'den 600.000 TL'ye düştü. Yatay analiz sonucu nedir?", o: ["%25 azalış", "%33,33 azalış", "%25 artış", "%75"], c: 0, a: "(600.000 − 800.000) ÷ 800.000 × 100 = −%25 → %25 azalış." }
    ],
    alt: [
      { t: "p", h: "Yatay analizi <b>fiyat artışı</b> gibi düşün. Geçen yıl 40 TL olan döner bu yıl 50 TL olmuş. “Ne kadar zamlandı?” sorusunda 10 TL'yi eski fiyata bölersin: 10 ÷ 40 × 100 = %25 zam. Yeni fiyata (50'ye) bölmezsin." },
      { t: "tablo", b: ["Adım", "Döner örneği", "Alacak örneği"], r: [["Önceki dönem", "40 TL", "600.000 $"], ["Fark", "50 − 40 = 10", "750.000 − 600.000 = 150.000"], ["Böl ve çarp", "10 ÷ 40 × 100", "150.000 ÷ 600.000 × 100"], ["Sonuç", "%25 zam", "%25 artış"]] },
      { t: "kontrol", s: "Nakit 1.800.000'dan 2.000.000'a çıktı. Yatay yüzde kaçtır?", o: ["%10", "%11,11", "%20", "%90"], c: 1, a: "200.000 ÷ 1.800.000 × 100 = %11,11" }
    ],
    ozet: ["Yatay % = (Cari − Önceki) ÷ Önceki × 100", "Payda: önceki dönem", "Pozitif: artış · negatif: azalış", "En az 2 dönem gerekir", "Sonuca artış/azalış yorumu yaz"]
  });
  D.sorular.push(
    { id: "f2-01", k: 2, z: 1, tip: "mc", b: "yatay-tanim", s: "Mali tablodaki bir kalemin iki dönem arasında ne kadar ve hangi yönde değiştiğini inceleyen analiz hangisidir?", o: ["Dikey analiz", "Yatay analiz", "Trend analizi", "NBD analizi", "Kârlılık endeksi"], c: 1, a: "Yatay analiz önceki dönemi baz alarak değişimi tutar ve yüzde olarak bulur." },
    { id: "f2-02", k: 2, z: 1, tip: "mc", b: "yatay-payda", s: "Yatay analizde değişim yüzdesi hesaplanırken paydaya hangi değer yazılır?", o: ["Cari dönem", "Önceki dönem", "Toplam varlıklar", "Baz yıl (hep aynı yıl)", "Toplam gelir"], c: 1, y: { 0: "Cari döneme bölmek en sık yapılan hatadır.", 3: "Hep aynı baz yıla bölmek trend analizidir." }, a: "Yatay % = (Cari − Önceki) ÷ Önceki × 100" },
    { id: "f2-03", k: 2, z: 1, tip: "bosluk", b: "yatay-hesap", s: "Bir kalem 2025'te 400.000 $, 2026'da 500.000 $'dır. Yatay analize göre artış % ______'tir.", c: Y(25), a: "(500.000 − 400.000) ÷ 400.000 × 100 = %25" },
    { id: "f2-04", k: 2, z: 2, tip: "bosluk", b: "yatay-hesap", s: "Alacaklar 2025'te 600.000 $, 2026'da 750.000 $'dır. 2025→2026 yatay analiz sonucu % ______ artıştır.", c: Y(25), a: "150.000 ÷ 600.000 × 100 = %25 (Vize Provası 2)" },
    { id: "f2-05", k: 2, z: 2, tip: "bosluk", b: "yatay-hesap", s: "Bir kalem 800.000 TL'den 600.000 TL'ye düşmüştür. Yatay analiz sonucu yüzde kaçtır? (Azalışı eksi işaretiyle yaz.)", c: ["-25", "%-25", "-%25", "-25%", "− 25", "−25", "-%25,00", "-25,00", "%25 azalış", "25 azalış"], a: "(600.000 − 800.000) ÷ 800.000 × 100 = −%25, yani %25 azalış." },
    { id: "f2-06", k: 2, z: 2, tip: "mc", b: "yatay-hesap", s: "Nakit 2025'te 1.800.000 $, 2026'da 2.000.000 $'dır. Yatay analiz yüzdesi kaçtır?", o: ["%10", "%11,11", "%20", "%90", "%111,11"], c: 1, y: { 0: "200.000 ÷ 2.000.000 yapılmış; payda önceki dönem olmalı." }, a: "200.000 ÷ 1.800.000 × 100 = %11,11" },
    { id: "f2-07", k: 2, z: 1, tip: "dy", b: "yatay-hesap", s: "Yatay analiz sonucu negatif çıkarsa kalem önceki döneme göre azalmış demektir.", c: true, a: "Doğru. Pozitif sonuç artış, negatif sonuç azalış gösterir." },
    { id: "f2-08", k: 2, z: 2, tip: "dy", b: "yatay-tanim", s: "Elinde yalnızca 2026 yılının bilançosu varsa yatay analiz yapılabilir.", c: false, a: "Yanlış. Yatay analiz iki dönemi karşılaştırır; en az iki yılın rakamı gerekir. Tek yılla yalnızca dikey analiz yapılır." },
    { id: "f2-09", k: 2, z: 3, tip: "mc", b: "yatay-payda", s: "Bir öğrenci 400.000 → 500.000 değişimini “100.000 ÷ 500.000 × 100 = %20 artış” diye hesaplamış. Hatası nedir?", o: ["Farkı yanlış bulmuş", "Paydaya cari dönemi yazmış; doğrusu %25", "100 ile çarpmayı unutmuş", "Trend analizi yapması gerekirdi", "Hata yok, sonuç doğru"], c: 1, a: "Payda önceki dönemdir: 100.000 ÷ 400.000 × 100 = %25." },
    { id: "f2-10", k: 2, z: 3, tip: "bosluk", b: "yatay-hesap", s: "Toplam varlıklar 2025'te 17.500.000 $, 2026'da 20.000.000 $'dır. Yatay analiz yüzdesi (iki basamak) % ______'dur.", c: Y("14,29").concat(Y("14.29"), Y("14,28")), a: "2.500.000 ÷ 17.500.000 × 100 = %14,29" },
    { id: "f2-11", k: 2, z: 2, tip: "sira", b: "yatay-hesap", s: "Yatay analiz sorusunun çözüm adımlarını sırala.", o: ["Önceki dönemi (baz) belirle", "Cari − Önceki farkını bul", "Farkı önceki döneme böl", "100 ile çarp", "Artış / azalış yorumunu yaz"], a: "Fark → önceki döneme böl → ×100 → yorum." },
    { id: "f2-12", k: 2, z: 2, tip: "mc", b: "yatay-hesap", s: "Alacaklar 550.000 TL'den 700.000 TL'ye çıkmıştır. Değişim tutarı ve yüzdesi hangisidir?", o: ["150.000 TL · %21,43", "150.000 TL · %27,27", "700.000 TL · %100", "150.000 TL · %15", "1.250.000 TL · %27,27"], c: 1, y: { 0: "150.000 ÷ 700.000 yapılmış; payda önceki dönem (550.000) olmalı." }, a: "Fark 150.000; 150.000 ÷ 550.000 × 100 = %27,27" },
    { id: "f2-13", k: 2, z: 3, tip: "dy", b: "yatay-payda", s: "Bir kalem önce %20 artıp sonraki yıl %20 azalırsa başlangıçtaki değerine geri döner.", c: false, a: "Yanlış. 100 → 120 (%20 artış) → 120 × 0,80 = 96. Her yılın yüzdesi farklı bir paydaya göre hesaplandığı için başlangıca dönülmez." },
    { id: "f2-14", k: 2, z: 2, tip: "klasik", b: "yatay-hesap", s: "Bir işletmenin alacakları 2025'te 550.000 TL, 2026'da 700.000 TL'dir. 2025→2026 yatay analizini yapınız ve yorumlayınız.", model: K`Önceki dönem (baz): 2025 = 550.000
Değişim = 700.000 − 550.000 = 150.000 TL
Yatay % = 150.000 / 550.000 × 100 = %27,27 artış

Yorum: Alacaklar bir yılda %27,27 artmış.
Alacakların bu kadar hızlı artması işletmenin daha
çok veresiye sattığını / tahsilatın yavaşladığını
gösterebilir.`, olcut: ["Payda olarak önceki dönem (550.000) kullanıldı", "Değişim tutarı 150.000 bulundu", "Sonuç %27,27 artış", "Yorum cümlesi yazıldı"], a: "Paydaya 700.000 yazılırsa sonuç yanlış çıkar (%21,43)." }
  );

  /* ------------------------------------------------------------------ 3 */
  D.konular.push({
    no: 3, ad: "Trend analizi ve üç analizin farkı", kisa: "Trend analizi", sinav: "vize",
    hedef: ["Baz yılı 100 kabul edip trend endeksi hesaplamak", "Endeksi “baz yıla göre % kaç arttı/azaldı” diye yorumlamak", "Dikey, yatay ve trend analizinin paydasını karıştırmamak"],
    anlat: [
      { t: "p", h: "Trend analizi, bir kalemin <b>birçok yıl boyunca</b> nereye gittiğini gösterir. Bir yıl <b>baz yıl</b> seçilir ve <b>100</b> kabul edilir; diğer bütün yıllar <b>hep bu baz yıla</b> bölünür. Vize Provası 2'de yatay analizle aynı soruda b şıkkı olarak soruldu." },
      { t: "formul", baslik: "Formül", h: "Trend endeksi = <b>İlgili yılın değeri ÷ Baz yılın değeri × 100</b>" },
      { t: "adim", baslik: "Vize Provası 2 · Uygulama 1-b adım adım", adimlar: [
        ["Soru", "Alacaklar 2024: 500.000 $, 2025: 600.000 $, 2026: 750.000 $. 2024 baz yıllı trend analizini yapınız."],
        ["1. Baz yılı yaz", "2024 = 100. Payda her yıl 500.000 olacak."],
        ["2. 2025", "600.000 ÷ 500.000 × 100 = 120"],
        ["3. 2026", "750.000 ÷ 500.000 × 100 = 150"],
        ["4. Yorum", "Endeks 150: alacaklar baz yıla göre iki yılda %50 büyümüş. 120 → baz yıla göre %20 artış."]] },
      { t: "tablo", baslik: "Üç analizi karıştırma (en çok soru buradan)", b: ["Analiz", "Payda", "Cevapladığı soru", "Kaç dönem?"], r: [["Dikey", "Seçilen toplam (toplam gelir / toplam varlıklar)", "Kalem toplamın ne kadarı?", "1 dönem yeter"], ["Yatay", "Önceki dönem", "Geçen yıla göre ne kadar değişti?", "En az 2"], ["Trend", "Hep aynı baz yıl", "Yıllar içinde hangi yöne gidiyor?", "3 ve daha fazla"]] },
      { t: "hayat", baslik: "Endeksi okuma", h: "Endeks <b>100'ün üstündeyse</b> kalem baz yıla göre büyümüş, <b>altındaysa</b> küçülmüştür. 125 → %25 artış, 96 → %4 azalış. Dikkat: 120'den 150'ye çıkan endeks “%30 arttı” demek değildir; iki yıl arasındaki değişim 150 ÷ 120 = %25'tir." },
      { t: "kontrol", s: "Baz yıl değeri 200, 2026 değeri 150 olan kalemin trend endeksi kaçtır?", o: ["75", "133,33", "150", "50"], c: 0, a: "150 ÷ 200 × 100 = 75 → baz yıla göre %25 azalmış." }
    ],
    alt: [
      { t: "p", h: "Trend analizini <b>boy ölçme çizgisi</b> gibi düşün. Kapı pervazına ilk çizgiyi çekersin (baz yıl = 100). Sonraki yıllarda hep o ilk çizgiyle kıyaslarsın: “ilk çizgiye göre ne kadar uzadım?” Yatay analiz ise her yıl bir önceki çizgiyle kıyaslar." },
      { t: "tablo", b: ["Yıl", "Alacak", "Yatay (önceki yıla göre)", "Trend (2024 = 100)"], r: [["2024", "500.000", "—", "100"], ["2025", "600.000", "%20", "120"], ["2026", "750.000", "%25", "150"]] },
      { t: "kontrol", s: "Envanter 2024'te 4.000.000, 2026'da 6.000.000. 2024 baz yıllı 2026 endeksi kaçtır?", o: ["66,67", "150", "200", "50"], c: 1, a: "6.000.000 ÷ 4.000.000 × 100 = 150" }
    ],
    ozet: ["Trend endeksi = Yıl ÷ Baz yıl × 100", "Baz yıl = 100, payda hep aynı", "Endeks − 100 = baz yıla göre % değişim", "Dikey: toplam · Yatay: önceki dönem · Trend: baz yıl", "120 → 150 geçişi %25'tir, %30 değil"]
  });
  D.sorular.push(
    { id: "f3-01", k: 3, z: 1, tip: "mc", b: "trend-tanim", s: "Bir yılın baz yıl seçilip 100 kabul edildiği, diğer yılların bu yıla göre endekslendiği analiz hangisidir?", o: ["Dikey analiz", "Yatay analiz", "Trend analizi", "Oran analizi", "Duyarlılık analizi"], c: 2, a: "Trend analizinde payda hep aynı baz yıldır." },
    { id: "f3-02", k: 3, z: 1, tip: "mc", b: "trend-tanim", s: "Trend analizinde baz yıl kaç kabul edilir?", o: ["0", "1", "10", "100", "1.000"], c: 3, a: "Baz yıl 100 kabul edilir; diğer yıllar 100'e göre okunur." },
    { id: "f3-03", k: 3, z: 1, tip: "bosluk", b: "trend-hesap", s: "Alacaklar 2024'te (baz yıl) 500.000 $, 2026'da 750.000 $'dır. 2026 trend endeksi ______'dir.", c: ["150", "150,00", "%150"], a: "750.000 ÷ 500.000 × 100 = 150 (Vize Provası 2)" },
    { id: "f3-04", k: 3, z: 2, tip: "bosluk", b: "trend-hesap", s: "Baz yıl değeri 200, 2026 değeri 150 olan bir kalemin trend endeksi ______'tir.", c: ["75", "75,00", "%75"], a: "150 ÷ 200 × 100 = 75 → %25 azalış" },
    { id: "f3-05", k: 3, z: 2, tip: "mc", b: "trend-yorum", s: "Trend endeksi 130 olan bir kalem için hangisi doğrudur?", o: ["Kalem %130 azalmıştır", "Kalem baz yıla göre %30 artmıştır", "Kalem toplamın %130'udur", "Kalem önceki yıla göre %30 artmıştır", "Kalem değişmemiştir"], c: 1, y: { 3: "Trend her zaman baz yıla göredir, önceki yıla göre değil." }, a: "130 − 100 = 30 → baz yıla göre %30 artış." },
    { id: "f3-06", k: 3, z: 2, tip: "dy", b: "analiz-ayirt", s: "Trend analizinde her yıl bir önceki yıla bölünür.", c: false, a: "Yanlış. Önceki yıla bölmek yatay analizdir. Trendde payda hep aynı baz yıldır." },
    { id: "f3-07", k: 3, z: 1, tip: "dy", b: "trend-tanim", s: "Trend analizi için genellikle üç ve daha fazla dönemin verisi gerekir.", c: true, a: "Doğru. Dikey 1, yatay en az 2, trend 3 ve daha fazla dönem." },
    { id: "f3-08", k: 3, z: 3, tip: "mc", b: "trend-yorum", s: "Bir kalemin trend endeksi 2025'te 120, 2026'da 150'dir. Kalem 2025'ten 2026'ya yüzde kaç artmıştır?", o: ["%30", "%25", "%50", "%20", "%150"], c: 1, y: { 0: "150 − 120 = 30 puan farktır; yüzde değişim 30 ÷ 120 ile bulunur.", 2: "%50 baz yıla göre artıştır." }, a: "150 ÷ 120 = 1,25 → %25 artış (alacaklarda 600.000 → 750.000 ile aynı sonuç)." },
    { id: "f3-09", k: 3, z: 2, tip: "mc", b: "analiz-ayirt", s: "“Paydası hep aynı baz yıl olan” analiz hangisidir?", o: ["Dikey analiz", "Yatay analiz", "Trend analizi", "NBD", "Kârlılık endeksi"], c: 2, a: "Dikey: toplam · Yatay: önceki dönem · Trend: hep aynı baz yıl." },
    { id: "f3-10", k: 3, z: 3, tip: "bosluk", b: "trend-hesap", s: "Envanter 2024'te (baz) 4.000.000 $, 2026'da 6.000.000 $'dır. 2026 trend endeksi ______'dir.", c: ["150", "150,00", "%150"], a: "6.000.000 ÷ 4.000.000 × 100 = 150 → iki yılda %50 artış" },
    { id: "f3-11", k: 3, z: 2, tip: "sira", b: "trend-hesap", s: "Trend analizinin adımlarını sırala.", o: ["Baz yılı seç", "Baz yılı 100 kabul et", "Her yılın değerini baz yılın değerine böl", "100 ile çarp", "Endeksi 100'e göre yorumla"], a: "Baz yıl → 100 → böl → ×100 → yorum." },
    { id: "f3-12", k: 3, z: 3, tip: "mc", b: "trend-yorum", s: "Alacakların 2025 trend endeksi 96 bulunmuştur. Doğru yorum hangisidir?", o: ["Alacaklar %96 azalmış", "Alacaklar baz yıla göre %4 azalmış", "Alacaklar %4 artmış", "Alacaklar toplamın %96'sı", "Alacaklar değişmemiş"], c: 1, a: "96 − 100 = −4 → baz yıla göre %4 azalış." },
    { id: "f3-13", k: 3, z: 1, tip: "mc", b: "analiz-ayirt", s: "Yalnızca tek bir yılın bilançosu elinizdeyse hangi analiz yapılabilir?", o: ["Yatay analiz", "Trend analizi", "Dikey analiz", "Yatay ve trend analizi", "Hiçbiri"], c: 2, a: "Yatay için en az 2, trend için 3 ve daha fazla dönem gerekir." },
    { id: "f3-14", k: 3, z: 3, tip: "klasik", b: "trend-hesap", s: "Bir işletmenin alacakları 2024: 400.000 $, 2025: 500.000 $, 2026: 600.000 $'dır. a) 2025→2026 yatay analizini, b) 2024 baz yıllı trend analizini yapıp yorumlayınız.", model: K`a) Yatay analiz (payda: önceki yıl 2025)
   (600.000 − 500.000) / 500.000 × 100 = %20 artış

b) Trend analizi (2024 = 100)
   2025 = 500.000 / 400.000 × 100 = 125
   2026 = 600.000 / 400.000 × 100 = 150

Yorum: Alacaklar son bir yılda %20 artmış; baz yıla
göre iki yılda %50 büyümüştür.`, olcut: ["Yatay analizde payda 500.000 (önceki yıl)", "Yatay sonuç %20 artış", "Trendde 2024 = 100 yazıldı", "2025 = 125 ve 2026 = 150 doğru", "Yorum cümlesi yazıldı"], a: "Bu soru tipi Vize Provası 2'nin ilk uygulama sorusudur." }
  );

  /* ------------------------------------------------------------------ 4 */
  D.konular.push({
    no: 4, ad: "Basit ve bileşik faiz: “Fırsatı değerlendirmeli mi?”", kisa: "Basit - bileşik faiz", sinav: "vize",
    hedef: ["Basit faizle ve bileşik faizle paranın ulaşacağı tutarı bulmak", "Fırsatın getirisini faizle karşılaştırıp karar vermek", "Vize provalarındaki iki fırsat sorusunu çözmek"],
    anlat: [
      { t: "p", h: "Vize provalarının ikinci uygulama sorusu: <b>“Yatırımcı bu fırsatı değerlendirmeli midir? a) basit faiz, b) bileşik faiz yöntemiyle çözünüz.”</b> Yol hep aynı: <b>Aynı parayı hiç risk almadan faize yatırsaydık ne olurdu?</b> Bunu hesapla, fırsatla karşılaştır." },
      { t: "formul", baslik: "Basit faiz", h: "Faiz = <b>Ana para × Faiz oranı × Zaman ÷ 100</b><br>Faizde toplam = Ana para + Faiz" },
      { t: "formul", baslik: "Bileşik faiz", h: "GD = <b>BD × (1 + i)<sup>n</sup></b> &nbsp;·&nbsp; i: faiz oranı (ondalık), n: yıl sayısı" },
      { t: "adim", baslik: "Vize Provası 1 · Uygulama 2 adım adım", adimlar: [
        ["Soru", "Faiz %20. Yatırımcı 30.000 TL yatırımla 2 yıl sonunda 11.000 TL kazanç, toplam 41.000 TL elde edecek. Değerlendirmeli mi?"],
        ["a) Basit faiz", "Faiz = 30.000 × 20 × 2 ÷ 100 = 12.000 TL"],
        ["Faizde toplam", "30.000 + 12.000 = 42.000 TL"],
        ["Karşılaştır", "Faiz 42.000 TL > fırsat 41.000 TL → fırsat değerlendirilmemeli."],
        ["b) Bileşik faiz", "GD = 30.000 × (1 + 0,20)² = 30.000 × 1,44 = 43.200 TL"],
        ["Karşılaştır", "43.200 TL > 41.000 TL → yine değerlendirilmemeli. Faize yatırmak risksiz olarak daha çok kazandırıyor."]] },
      { t: "adim", baslik: "Vize Provası 2 · Uygulama 2 adım adım", adimlar: [
        ["Soru", "Faiz %15. 50.000 TL yatırımla 2 yıl sonunda toplam 64.000 TL. Değerlendirmeli mi?"],
        ["a) Basit faiz", "Faiz = 50.000 × 15 × 2 ÷ 100 = 15.000 → faizde 65.000 TL"],
        ["Karar (basit)", "65.000 > 64.000 → değerlendirilmemeli."],
        ["b) Bileşik faiz", "GD = 50.000 × (1,15)² = 50.000 × 1,3225 = 66.125 TL"],
        ["Karar (bileşik)", "66.125 > 64.000 → değerlendirilmemeli."]] },
      { t: "tablo", baslik: "Bileşik faiz yıl yıl (30.000 TL, %20)", b: ["Yıl", "Yıl başı", "Faiz (%20)", "Yıl sonu"], r: [["1", "30.000", "6.000", "36.000"], ["2", "36.000", "7.200", "43.200"]] },
      { t: "tablo", baslik: "Karar kuralı", b: ["Durum", "Karar"], r: [["Faizde ulaşılan tutar > fırsatın tutarı", "Fırsat değerlendirilmemeli (faize yatır)"], ["Fırsatın tutarı > faizde ulaşılan tutar", "Fırsat değerlendirilmeli"]] },
      { t: "kontrol", s: "10.000 TL, %20 faiz, 2 yıl. Bileşik faizle 2 yıl sonundaki tutar kaçtır?", o: ["14.000", "14.400", "12.000", "12.400"], c: 1, a: "10.000 × 1,2² = 10.000 × 1,44 = 14.400 TL. (Basit faizde 14.000 olurdu.)" }
    ],
    alt: [
      { t: "p", h: "Basit faizde faiz <b>hep ilk paraya</b> işler: her yıl aynı faiz. Bileşik faizde ise yıl sonunda kazandığın faiz paraya eklenir ve ertesi yıl <b>faizin de faizi</b> alınır. Bu yüzden 1 yıldan uzun vadede bileşik faiz hep daha çok kazandırır; 1 yılda ikisi eşittir." },
      { t: "hayat", baslik: "Bankadaki mevduat", h: "Bankaya 30.000 TL koydun, faiz %20. İlk yıl 6.000 TL faiz alırsın. Parayı çekmeyip faizle birlikte bırakırsan ikinci yıl faiz 36.000 TL'ye işler: 7.200 TL. Toplam 43.200 TL. Basit faizde ikinci yıl da 6.000 alırdın: 42.000 TL." },
      { t: "p", h: "Karar cümlesini şöyle kur: “Aynı para faizde <b>…</b> TL olurdu; fırsat <b>…</b> TL getiriyor. Faiz daha fazla kazandırdığı için yatırımcı bu fırsatı <b>değerlendirmemelidir</b>.”" },
      { t: "kontrol", s: "5.000 TL %10 basit faizle 3 yılda kaç TL faiz getirir?", o: ["500", "1.500", "1.655", "6.500"], c: 1, a: "5.000 × 10 × 3 ÷ 100 = 1.500 TL" }
    ],
    ozet: ["Basit: Faiz = Ana para × oran × zaman ÷ 100", "Bileşik: GD = BD × (1 + i)ⁿ", "Soru: aynı para faizde ne olurdu?", "Faizdeki tutar > fırsat → değerlendirme", "1 yılda basit = bileşik; sonra bileşik daha fazla"]
  });
  D.sorular.push(
    { id: "f4-01", k: 4, z: 1, tip: "mc", b: "basit-faiz", s: "Faizin yalnızca ana para üzerinden hesaplandığı, her yıl aynı tutarda faiz kazanılan yöntem hangisidir?", o: ["Bileşik faiz", "Basit faiz", "İskonto", "Net bugünkü değer", "Kârlılık endeksi"], c: 1, a: "Basit faizde faiz ana paraya eklenmez; her yıl aynı faiz kazanılır." },
    { id: "f4-02", k: 4, z: 1, tip: "mc", b: "bilesik-faiz", s: "Bileşik faizle gelecekteki değer formülü hangisidir?", o: ["GD = BD × i × n", "GD = BD × (1 + i)ⁿ", "GD = BD ÷ (1 + i)ⁿ", "GD = BD + i", "GD = BD × n ÷ 100"], c: 1, y: { 2: "Bölme, gelecekteki paradan bugünkü değere gitmektir (BD formülü)." }, a: "GD = BD × (1 + i)ⁿ" },
    { id: "f4-03", k: 4, z: 1, tip: "bosluk", b: "basit-faiz", s: "5.000 TL'nin %10 basit faizle 3 yıllık faizi ______ TL'dir.", c: T("1.500"), a: "5.000 × 10 × 3 ÷ 100 = 1.500 TL" },
    { id: "f4-04", k: 4, z: 2, tip: "bosluk", b: "bilesik-faiz", s: "10.000 TL'nin %10 bileşik faizle 2 yıl sonraki değeri ______ TL'dir.", c: T("12.100"), a: "10.000 × 1,1² = 10.000 × 1,21 = 12.100 TL" },
    { id: "f4-05", k: 4, z: 2, tip: "bosluk", b: "basit-faiz", s: "Faiz %20. 30.000 TL basit faizle 2 yıl faizde kalırsa toplam ______ TL olur.", c: T("42.000"), a: "Faiz = 30.000 × 20 × 2 ÷ 100 = 12.000 → 30.000 + 12.000 = 42.000 TL (Vize Provası 1)" },
    { id: "f4-06", k: 4, z: 2, tip: "bosluk", b: "bilesik-faiz", s: "Faiz %20. 30.000 TL bileşik faizle 2 yıl sonra ______ TL olur.", c: T("43.200"), a: "30.000 × 1,2² = 30.000 × 1,44 = 43.200 TL (Vize Provası 1)" },
    { id: "f4-07", k: 4, z: 2, tip: "mc", b: "firsat-karar", s: "30.000 TL ile 2 yılda toplam 41.000 TL getirecek bir fırsat var; aynı para basit faizle 42.000 TL oluyor. Karar ne olmalı?", o: ["Fırsat değerlendirilmeli; 11.000 TL kazandırıyor", "Fırsat değerlendirilmemeli; faiz daha çok kazandırıyor", "İkisi eşit, fark etmez", "Bileşik faiz hesaplanmadan karar verilemez", "Fırsat 1.000 TL daha kârlı"], c: 1, y: { 0: "Fırsat kâr ettiriyor ama faiz risksiz olarak daha fazla kazandırıyor; kıyas faize göre yapılır." }, a: "42.000 > 41.000 → fırsat değerlendirilmez. Faiz, fırsatın geçmesi gereken çıtadır." },
    { id: "f4-08", k: 4, z: 1, tip: "dy", b: "bilesik-faiz", s: "1 yıllık vadede basit faiz ile bileşik faiz aynı sonucu verir.", c: true, a: "Doğru. İlk yıl faiz yalnızca ana paraya işler; fark 2. yıldan itibaren oluşur." },
    { id: "f4-09", k: 4, z: 2, tip: "dy", b: "bilesik-faiz", s: "Bileşik faizde her yıl kazanılan faiz tutarı aynıdır.", c: false, a: "Yanlış. Bileşik faizde faiz büyüyen tutara işler; her yıl kazanılan faiz artar (6.000 → 7.200). Her yıl aynı faiz basit faizdir." },
    { id: "f4-10", k: 4, z: 3, tip: "mc", b: "bilesik-faiz", s: "Faiz %15. 50.000 TL'nin bileşik faizle 2 yıl sonraki değeri kaçtır?", o: ["65.000", "66.125", "57.500", "64.000", "66.500"], c: 1, y: { 0: "65.000 basit faiz sonucudur." }, a: "50.000 × 1,15² = 50.000 × 1,3225 = 66.125 TL (Vize Provası 2)" },
    { id: "f4-11", k: 4, z: 3, tip: "mc", b: "firsat-karar", s: "Faiz %20. 10.000 TL ile 2 yıl sonunda toplam 12.000 TL getirecek fırsat basit faize göre nasıl değerlendirilir?", o: ["Değerlendirilmeli; 2.000 TL kâr var", "Değerlendirilmemeli; faizde 14.000 TL olur, fırsat 2.000 TL geride", "Değerlendirilmeli; faiz 12.000 TL eder", "Değerlendirilmemeli; faizde 12.400 TL olur", "Fark etmez"], c: 1, a: "Faiz = 10.000 × 20 × 2 ÷ 100 = 4.000 → 14.000 TL > 12.000 TL." },
    { id: "f4-12", k: 4, z: 2, tip: "sira", b: "firsat-karar", s: "“Fırsatı değerlendirmeli mi?” sorusunun çözüm adımlarını sırala.", o: ["Aynı paranın faizini/gelecekteki değerini hesapla", "Faizde ulaşılan toplamı bul", "Fırsatın getireceği toplamla karşılaştır", "Karar cümlesini yaz"], a: "Önce faizdeki tutar bulunur, sonra fırsatla kıyaslanır, en son karar yazılır." },
    { id: "f4-13", k: 4, z: 3, tip: "dy", b: "bilesik-faiz", s: "(1 + 0,15)² = 1,3225'tir.", c: true, a: "Doğru. 1,15 × 1,15 = 1,3225. Vize Provası 2'de bu çarpan kullanıldı." },
    { id: "f4-14", k: 4, z: 2, tip: "klasik", b: "firsat-karar", s: "Faiz oranının %15 olduğu bir ekonomide 8.000 TL yatıran bir yatırımcı 2 yıl sonunda toplam 10.000 TL'ye sahip olacağı bir fırsat buluyor. a) Basit faiz, b) bileşik faiz yöntemiyle fırsatı değerlendiriniz.", model: K`a) Basit faiz
   Faiz = 8.000 × 15 × 2 / 100 = 2.400 TL
   Faizde toplam = 8.000 + 2.400 = 10.400 TL
   10.400 > 10.000 → fırsat değerlendirilmemeli

b) Bileşik faiz
   GD = 8.000 × (1 + 0,15)² = 8.000 × 1,3225 = 10.580 TL
   10.580 > 10.000 → fırsat değerlendirilmemeli`, olcut: ["Basit faiz formülü doğru kuruldu (8.000 × 15 × 2 / 100)", "Faizde toplam 10.400 bulundu", "Bileşik faizde GD = 8.000 × 1,3225 = 10.580", "İki yöntemde de fırsatla karşılaştırıldı", "Karar cümlesi yazıldı (değerlendirilmemeli)"], a: "Sonuç sayısı tek başına yetmez; karşılaştırma ve karar cümlesi şart." }
  );

  /* ------------------------------------------------------------------ 5 */
  D.konular.push({
    no: 5, ad: "Bugünkü değer: “Teklifi değerlendiriniz”", kisa: "Bugünkü değer", sinav: "vize",
    hedef: ["Gelecekteki parayı bugüne indirmek (BD = GD ÷ (1 + i)ⁿ)", "Bugün gelen teklifi bugünkü değerle karşılaştırmak", "(1 + i)ⁿ çarpanlarını hızlı hesaplamak"],
    anlat: [
      { t: "p", h: "Vize Provası 1'in üçüncü uygulama sorusu: Bir yatırım <b>3 yıl sonra</b> 133.100 TL verecek, biri bu yatırımı <b>bugün</b> 95.000 TL'ye almak istiyor. Bugünkü teklifi gelecekteki parayla kıyaslayamazsın; önce gelecekteki parayı <b>bugüne indirirsin</b>." },
      { t: "formul", baslik: "Bugünkü değer", h: "BD = <b>GD ÷ (1 + i)<sup>n</sup></b> &nbsp;·&nbsp; Bileşik faiz formülünün tersidir" },
      { t: "adim", baslik: "Vize Provası 1 · Uygulama 3 adım adım", adimlar: [
        ["Soru", "Faiz %10. Yatırım 3 yıl boyunca getiri vermiyor, 3. yılın sonunda 133.100 TL ödüyor. Ahmet bugün 95.000 TL teklif ediyor. Değerlendiriniz."],
        ["1. Çarpanı bul", "(1 + 0,10)³ = 1,1 × 1,1 × 1,1 = 1,331"],
        ["2. Bugüne indir", "BD = 133.100 ÷ 1,331 = 100.000 TL"],
        ["3. Karşılaştır", "Teklif 95.000 TL < BD 100.000 TL"],
        ["4. Karar", "Teklif reddedilmelidir. 95.000 TL'ye satmak bugünün parasıyla 5.000 TL kayıp demektir."],
        ["Sağlama (isteğe bağlı)", "95.000 TL'yi faize koysak 3 yıl sonra 95.000 × 1,331 = 126.445 TL olur; bu 133.100 TL'den az."]] },
      { t: "tablo", baslik: "Sık kullanılan çarpanlar", b: ["Oran", "1. yıl", "2. yıl", "3. yıl"], r: [["%10", "1,1", "1,21", "1,331"], ["%15", "1,15", "1,3225", "1,521"], ["%20", "1,2", "1,44", "1,728"]] },
      { t: "tablo", baslik: "Karar kuralı", b: ["Durum", "Karar"], r: [["Teklif < Bugünkü değer", "Teklif reddedilir (satarsan kaybedersin)"], ["Teklif > Bugünkü değer", "Teklif kabul edilir"]] },
      { t: "kontrol", s: "Faiz %10 iken 2 yıl sonra alınacak 121.000 TL'nin bugünkü değeri kaçtır?", o: ["110.000", "100.000", "108.900", "99.000"], c: 1, a: "121.000 ÷ 1,21 = 100.000 TL" }
    ],
    alt: [
      { t: "p", h: "Şöyle düşün: Bugün <b>100.000 TL</b>'yi %10 faize koysan 3 yıl sonra 133.100 TL olur. Demek ki 3 yıl sonraki 133.100 TL ile bugünkü 100.000 TL <b>aynı değerdedir</b>. Biri sana bugün 95.000 TL veriyorsa, 100.000 TL'lik bir şeyi ucuza satıyorsun demektir." },
      { t: "tablo", b: ["Yön", "İşlem", "Formül"], r: [["Bugünden geleceğe", "Çarp", "GD = BD × (1 + i)ⁿ"], ["Gelecekten bugüne", "Böl", "BD = GD ÷ (1 + i)ⁿ"]] },
      { t: "kontrol", s: "Faiz %20 iken 2 yıl sonra alınacak 14.400 TL'nin bugünkü değeri kaçtır?", o: ["12.000", "10.000", "11.520", "9.600"], c: 1, a: "14.400 ÷ 1,44 = 10.000 TL" }
    ],
    ozet: ["BD = GD ÷ (1 + i)ⁿ (bileşik faizin tersi)", "Bugünkü teklif, gelecekteki parayla değil BD ile kıyaslanır", "Teklif < BD → reddet · Teklif > BD → kabul et", "%10'da 3 yıl: 1,331 · %20'de 2 yıl: 1,44", "Karar cümlesinde kaybı/kazancı TL olarak yaz"]
  });
  D.sorular.push(
    { id: "f5-01", k: 5, z: 1, tip: "mc", b: "bd-hesap", s: "Gelecekte elde edilecek bir paranın belirli bir faiz oranıyla bugüne indirgenmiş değerine ne denir?", o: ["Gelecekteki değer", "Bugünkü değer", "Basit faiz", "Risksiz getiri", "Kârlılık endeksi"], c: 1, a: "Bugünkü değer (BD) = GD ÷ (1 + i)ⁿ" },
    { id: "f5-02", k: 5, z: 1, tip: "mc", b: "bd-hesap", s: "Bugünkü değer formülü hangisidir?", o: ["BD = GD × (1 + i)ⁿ", "BD = GD ÷ (1 + i)ⁿ", "BD = GD − i", "BD = GD × i × n", "BD = GD ÷ n"], c: 1, y: { 0: "Çarpmak bugünden geleceğe gitmektir (GD formülü)." }, a: "Gelecekten bugüne gelirken (1 + i)ⁿ'ye bölünür." },
    { id: "f5-03", k: 5, z: 1, tip: "bosluk", b: "bd-hesap", s: "Faiz %20 iken 2 yıl sonra alınacak 14.400 TL'nin bugünkü değeri ______ TL'dir.", c: T("10.000"), a: "14.400 ÷ 1,44 = 10.000 TL" },
    { id: "f5-04", k: 5, z: 2, tip: "bosluk", b: "bd-hesap", s: "Faiz %10 iken 3. yılın sonunda alınacak 133.100 TL'nin bugünkü değeri ______ TL'dir.", c: T("100.000"), a: "133.100 ÷ 1,331 = 100.000 TL (Vize Provası 1)" },
    { id: "f5-05", k: 5, z: 2, tip: "bosluk", b: "bd-hesap", s: "Faiz %10 iken 2 yıl sonra alınacak 121.000 TL'nin bugünkü değeri ______ TL'dir.", c: T("100.000"), a: "121.000 ÷ 1,21 = 100.000 TL" },
    { id: "f5-06", k: 5, z: 2, tip: "mc", b: "teklif-karar", s: "Bir yatırımın bugünkü değeri 100.000 TL'dir. Bugün 95.000 TL teklif geliyor. Karar ne olmalı?", o: ["Kabul; 95.000 TL nakit kazanılır", "Red; satış bugünün parasıyla 5.000 TL kayıp", "Kabul; gelecekteki 133.100 TL'den az olduğu için", "Fark etmez", "Red; 38.100 TL kayıp"], c: 1, y: { 4: "133.100 − 95.000 farkı farklı zamanların parasını karşılaştırır; doğru kıyas bugünkü değerle yapılır." }, a: "Teklif < BD → reddedilir. Kayıp 100.000 − 95.000 = 5.000 TL." },
    { id: "f5-07", k: 5, z: 2, tip: "mc", b: "teklif-karar", s: "Bir yatırımın bugünkü değeri 50.000 TL ise hangi teklif kabul edilmelidir?", o: ["40.000 TL", "45.000 TL", "48.000 TL", "55.000 TL", "Hiçbiri"], c: 3, a: "Bugünkü değerden yüksek teklif kârlıdır." },
    { id: "f5-08", k: 5, z: 1, tip: "dy", b: "bd-hesap", s: "Bugünkü değer formülü, bileşik faiz formülünün tersidir.", c: true, a: "Doğru. GD = BD × (1 + i)ⁿ ise BD = GD ÷ (1 + i)ⁿ." },
    { id: "f5-09", k: 5, z: 2, tip: "dy", b: "teklif-karar", s: "Bugün yapılan bir satış teklifi, yatırımın gelecekte vereceği tutarla doğrudan karşılaştırılmalıdır.", c: false, a: "Yanlış. Farklı zamanların paraları doğrudan karşılaştırılmaz; önce gelecekteki tutar bugüne indirilir." },
    { id: "f5-10", k: 5, z: 3, tip: "bosluk", b: "bd-hesap", s: "Faiz %20 iken 3 yıl sonra alınacak 172.800 TL'nin bugünkü değeri ______ TL'dir.", c: T("100.000"), a: "(1,2)³ = 1,728 → 172.800 ÷ 1,728 = 100.000 TL" },
    { id: "f5-11", k: 5, z: 3, tip: "mc", b: "carpan", s: "(1 + 0,10)³ işleminin sonucu kaçtır?", o: ["1,3", "1,331", "1,21", "1,33", "3,3"], c: 1, a: "1,1 × 1,1 = 1,21 → 1,21 × 1,1 = 1,331" },
    { id: "f5-12", k: 5, z: 2, tip: "sira", b: "teklif-karar", s: "“Teklifi değerlendiriniz” sorusunun adımlarını sırala.", o: ["(1 + i)ⁿ çarpanını bul", "Gelecekteki tutarı çarpana bölerek BD'yi bul", "Teklifi BD ile karşılaştır", "Kabul/red kararını ve kazanç/kaybı yaz"], a: "Çarpan → BD → karşılaştır → karar." },
    { id: "f5-13", k: 5, z: 3, tip: "dy", b: "carpan", s: "Faiz oranı yükselirse, gelecekte alınacak aynı tutarın bugünkü değeri de yükselir.", c: false, a: "Yanlış. Faiz artınca (1 + i)ⁿ büyür; büyük sayıya bölünce BD küçülür." },
    { id: "f5-14", k: 5, z: 2, tip: "klasik", b: "teklif-karar", s: "Faiz oranı %20 iken 3 yıl sonunda 172.800 TL getirecek bir yatırım için bugün 110.000 TL teklif geliyor. Teklifi finansal açıdan değerlendiriniz.", model: K`BD = GD / (1 + i)³
   = 172.800 / (1 + 0,20)³
   = 172.800 / 1,728
   = 100.000 TL

Teklif 110.000 TL > BD 100.000 TL
Karar: Teklif kabul edilmelidir; bugünün parasıyla
10.000 TL kazanç sağlar.`, olcut: ["BD formülü yazıldı", "Çarpan 1,728 doğru bulundu", "BD = 100.000 TL", "Teklif BD ile karşılaştırıldı", "Kabul kararı ve 10.000 TL kazanç yazıldı"], a: "Vize Provası 1'deki 133.100 TL sorusunun aynı mantıkta farklı sayılarla hâli." }
  );
})();
