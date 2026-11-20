/* SINAV KOÇUM · Finansal Yönetim — içerik (2/2: NBD ve KE, sonra tanım/kavram konuları, konu 6–9) */
(function () {
  var K = String.raw;
  var D = window.KOC_DERS;
  function T(x) { var s = String(x), d = s.replace(/\./g, ""); return [s, d, s + " tl", d + " tl", s + "tl", d + "tl", "−" + s, "-" + s].filter(function (v, i, a) { return a.indexOf(v) === i; }); }

  /* ------------------------------------------------------------------ 6 */
  D.konular.push({
    no: 6, ad: "Net bugünkü değer (NBD)", kisa: "NBD", sinav: "vize",
    hedef: ["Nakit akışlarını dönemlere yazıp her birini (1 + r)ᵗ'ye bölmek", "Ara dönemdeki eksi nakit akışlarını doğru işaretle hesaba katmak", "NBD > 0 kuralıyla karar vermek, iki projeden birini seçmek", "Vize provalarındaki NBD sorularını hocanın yazım düzeniyle çözmek"],
    anlat: [
      { t: "p", h: "Vizenin en çok puanlı sorusu (20 puan) NBD ve KE'dir. NBD, projenin <b>bütün nakit akışlarının bugüne indirgenip toplanmasıdır</b>. 0. dönem “bugün” demektir; ilk yatırım buraya <b>eksi</b> işaretle yazılır." },
      { t: "formul", baslik: "Net bugünkü değer", h: "NBD = <b>NA₀/(1+r)⁰ + NA₁/(1+r)¹ + NA₂/(1+r)² + … + NAₙ/(1+r)ⁿ</b><br>r = iskonto oranı = faiz = sermaye maliyeti" },
      { t: "tablo", baslik: "Karar kuralı", b: ["Sonuç", "Karar"], r: [["NBD > 0", "Proje faizin üstünde kazandırır → kabul"], ["NBD < 0", "Proje değerlendirmeye alınmaz"], ["İki proje varsa", "NBD'si büyük olan seçilir"]] },
      { t: "tablo", baslik: "%15 için hocanın kullandığı çarpanlar", b: ["Dönem (t)", "Çarpan (1,15)ᵗ"], r: [["0", "1"], ["1", "1,15"], ["2", "1,323"], ["3", "1,521"], ["4", "1,749"], ["5", "2,011"]] },
      { t: "adim", baslik: "Vize Provası 2 · Uygulama 3 adım adım", adimlar: [
        ["Soru", "Faiz %20. Proje 500.000 TL yatırım istiyor; 1. yıl 200.000, 2. yıl 300.000, 3. yıl 250.000 TL nakit girişi. NBD'yi bulup değerlendiriniz."],
        ["1. Formülü dönemlerle yaz", "NBD = −500.000/(1,2)⁰ + 200.000/(1,2)¹ + 300.000/(1,2)² + 250.000/(1,2)³"],
        ["2. Çarpanları yaz", "= −500.000/1 + 200.000/1,2 + 300.000/1,44 + 250.000/1,728"],
        ["3. Bölmeleri yap", "= −500.000 + 166.667 + 208.333 + 144.676"],
        ["4. Topla", "= −500.000 + 519.676 → NBD ≅ 19.676 TL"],
        ["5. Karar", "NBD > 0 olduğu için proje faizin üstünde kazandırır; yatırım kabul edilir."]] },
      { t: "adim", baslik: "Vize Provası 1 · Uygulama 4-a (A ve B, %15)", adimlar: [
        ["Nakit akışları", "A: −10.000 · 3.000 · 4.000 · 4.000 · 3.000 · 2.000 — B: −50.000 · 14.000 · 16.000 · 18.000 · 20.000 · 12.000"],
        ["A projesi", "−10.000 + 3.000/1,15 + 4.000/1,323 + 4.000/1,521 + 3.000/1,749 + 2.000/2,011"],
        ["A bölmeler", "= −10.000 + 2.609 + 3.025 + 2.630 + 1.715 + 994 = −10.000 + 10.973 → NBD_A ≅ 973 TL"],
        ["B projesi", "−50.000 + 14.000/1,15 + 16.000/1,323 + 18.000/1,521 + 20.000/1,749 + 12.000/2,011"],
        ["B bölmeler", "= −50.000 + 12.174 + 12.098 + 11.835 + 11.435 + 5.966 = −50.000 + 53.509 → NBD_B ≅ 3.509 TL"],
        ["Karar (NBD)", "İkisi de > 0, ikisi de kârlı. NBD_B > NBD_A → NBD yöntemine göre B projesi seçilir."]] },
      { t: "hayat", baslik: "Ara dönemde eksi nakit akışı (Vize Provası 2, Uygulama 4)", h: "Projenin 2. yılında −4.000 gibi bir çıkış varsa onu da bugüne indirirsin ve <b>eksi işaretiyle</b> toplama katarsın: −4.000 / 1,323 = −3.025. Örneğin A projesi (−25.000 · 12.000 · −4.000 · 14.000 · 10.000 · 9.000) için NBD ≅ 1.808 TL çıkar; B projesi (−40.000 · 15.000 · −8.000 · 20.000 · −5.000 · 30.000) için NBD ≅ −7.799 TL → B değerlendirmeye alınmaz." },
      { t: "kontrol", s: "Bir projenin NBD'si −7.799 TL çıktı. Karar ne olmalı?", o: ["Kabul edilir", "Değerlendirmeye alınmaz", "KE'ye bakmadan karar verilemez", "Faiz düşürülerek tekrar hesaplanır"], c: 1, a: "NBD < 0 → proje faizin altında kalır, değerlendirmeye alınmaz." }
    ],
    alt: [
      { t: "p", h: "NBD'yi şöyle düşün: Projeye yatıracağın parayı projeye değil de <b>faize</b> koyabilirdin. Projenin gelecekte verdiği her parayı bugüne çevirip topluyorsun; bu toplam, bugün yatırdığından fazlaysa (NBD > 0) proje faizden daha iyidir." },
      { t: "tablo", b: ["Dönem (t)", "Nakit akışı", "Çarpan (1,2)ᵗ", "Bugünkü değer"], r: [["0", "−500.000", "1", "−500.000"], ["1", "200.000", "1,2", "166.667"], ["2", "300.000", "1,44", "208.333"], ["3", "250.000", "1,728", "144.676"], ["Toplam", "", "", "NBD ≅ 19.676"]] },
      { t: "p", h: "Tablo yöntemi aynı hesabı satır satır gösterir: her satırda <b>nakit akışı ÷ çarpan</b>, en altta toplam. Sınavda hocanın yaptığı gibi formülü alt alta yazmak da, bu tabloyu kurmak da doğru sonuca götürür." },
      { t: "kontrol", s: "%20'de 2. yılın çarpanı kaçtır?", o: ["1,2", "1,4", "1,44", "2,4"], c: 2, a: "(1,2)² = 1,44" }
    ],
    ozet: ["NBD = Σ NAₜ ÷ (1 + r)ᵗ, 0. dönemin çarpanı 1", "İlk yatırım ve ara dönem çıkışları eksi işaretli", "İskonto oranı = faiz = sermaye maliyeti", "NBD > 0 kabul · NBD < 0 değerlendirmeye alınmaz", "İki projede NBD'si büyük olan seçilir"]
  });
  D.sorular.push(
    { id: "f6-01", k: 6, z: 1, tip: "mc", b: "nbd-tanim", s: "Bir projenin bütün nakit akışlarının iskonto oranıyla bugüne indirgenip toplanmasıyla bulunan değer hangisidir?", o: ["Kârlılık endeksi", "Net bugünkü değer", "Gelecekteki değer", "Basit faiz", "Trend endeksi"], c: 1, a: "NBD = nakit girişlerinin BD'si − nakit çıkışlarının BD'si." },
    { id: "f6-02", k: 6, z: 1, tip: "mc", b: "nbd-tanim", s: "NBD yöntemine göre bir proje hangi durumda kabul edilir?", o: ["NBD < 0", "NBD > 0", "NBD = 1", "NBD < 1", "NBD faiz oranından küçükse"], c: 1, y: { 3: "1 sınırı kârlılık endeksinin karar kuralıdır." }, a: "NBD > 0 → kabul; NBD < 0 → değerlendirmeye alınmaz." },
    { id: "f6-03", k: 6, z: 1, tip: "mc", b: "iskonto", s: "Derste tahtaya yazılan eşitliğe göre iskonto oranı neye eşittir?", o: ["Enflasyon = vergi", "Faiz = sermaye maliyeti", "Net kâr marjı", "Trend endeksi", "Kârlılık endeksi"], c: 1, a: "İskonto oranı = faiz = sermaye maliyeti. Parayı faize koysak kazanacağımız oran, projenin geçmesi gereken çıtadır." },
    { id: "f6-04", k: 6, z: 1, tip: "bosluk", b: "iskonto", s: "0. dönemdeki (bugünkü) nakit akışının iskonto çarpanı (1 + r)⁰ = ______'dir.", c: ["1", "1,0", "bir"], a: "Her sayının 0. kuvveti 1'dir; ilk yatırım bölünmeden aynen yazılır." },
    { id: "f6-05", k: 6, z: 2, tip: "bosluk", b: "nbd-hesap", s: "%20 iskonto oranında 1. yıl alınacak 200.000 TL'nin bugünkü değeri (tam sayıya yuvarla) ______ TL'dir.", c: T("166.667").concat(T("166.666")), a: "200.000 ÷ 1,2 = 166.667 TL" },
    { id: "f6-06", k: 6, z: 2, tip: "bosluk", b: "iskonto", s: "%20 iskonto oranında 2. yılın çarpanı (1,2)² = ______'tür.", c: ["1,44", "1.44"], a: "1,2 × 1,2 = 1,44" },
    { id: "f6-07", k: 6, z: 2, tip: "mc", b: "nbd-hesap", s: "Faiz %20. 500.000 TL'lik proje 1., 2., 3. yıllarda 200.000, 300.000 ve 250.000 TL getiriyor. NBD ve karar hangisidir?", o: ["NBD ≅ 250.000 TL, kabul", "NBD ≅ 19.676 TL, kabul", "NBD ≅ −19.676 TL, red", "NBD ≅ 519.676 TL, kabul", "NBD = 0, kararsız"], c: 1, y: { 0: "250.000 indirgemeden toplamaktır (750.000 − 500.000); paranın zaman değeri unutulmuş.", 3: "519.676 girişlerin BD toplamıdır; ilk yatırım düşülmemiş." }, a: "166.667 + 208.333 + 144.676 = 519.676 → 519.676 − 500.000 = 19.676 > 0 → kabul (Vize Provası 2)." },
    { id: "f6-08", k: 6, z: 2, tip: "dy", b: "ara-cikis", s: "Projenin ara dönemlerinde nakit çıkışı varsa bu çıkış da bugüne indirgenip NBD'ye eksi işaretiyle girer.", c: true, a: "Doğru. Örn. 2. yıldaki −4.000 → −4.000 ÷ 1,323 = −3.025." },
    { id: "f6-09", k: 6, z: 1, tip: "dy", b: "nbd-tanim", s: "İlk yatırım tutarı 0. döneme eksi işaretiyle yazılır.", c: true, a: "Doğru. Yatırım işletmeden çıkan paradır; 0. dönemde, eksi işaretle." },
    { id: "f6-10", k: 6, z: 3, tip: "mc", b: "nbd-hesap", s: "İskonto oranı %15. NBD_A ≅ 973 TL, NBD_B ≅ 3.509 TL bulundu. NBD yöntemine göre karar hangisidir?", o: ["A seçilir; daha az yatırım istiyor", "B seçilir; NBD'si daha büyük", "İkisi de reddedilir", "İkisi de eşit kârlıdır", "Karar için KE gerekir"], c: 1, a: "İkisi de > 0, ikisi de kârlı; NBD yönteminde NBD'si büyük olan (B) seçilir (Vize Provası 1)." },
    { id: "f6-11", k: 6, z: 3, tip: "mc", b: "iskonto", s: "%15 iskonto oranında 3. yılın çarpanı (hocanın kullandığı üç basamaklı değer) hangisidir?", o: ["1,45", "1,323", "1,521", "1,749", "2,011"], c: 2, a: "1,15 × 1,15 × 1,15 = 1,520875 ≅ 1,521. Sırasıyla: 1,15 · 1,323 · 1,521 · 1,749 · 2,011" },
    { id: "f6-12", k: 6, z: 2, tip: "sira", b: "nbd-hesap", s: "NBD sorusunun çözüm adımlarını sırala.", o: ["Nakit akışlarını dönemleriyle yaz (ilk yatırım eksi)", "Her dönem için (1 + r)ᵗ çarpanını bul", "Her nakit akışını çarpanına böl", "Bugünkü değerleri topla", "NBD'nin işaretine göre karar yaz"], a: "Akışlar → çarpanlar → bölmeler → toplam → karar." },
    { id: "f6-13", k: 6, z: 3, tip: "bosluk", b: "nbd-hesap", s: "%20 iskonto oranında bir proje bugün 100.000 TL yatırım istiyor; 1. yıl 60.000, 2. yıl 72.000 TL getiriyor. NBD = ______ TL.", c: ["0", "0 tl", "sıfır"], a: "60.000 ÷ 1,2 = 50.000 · 72.000 ÷ 1,44 = 50.000 · 50.000 + 50.000 − 100.000 = 0 → proje faizle aynı getiriyi sağlar." },
    { id: "f6-14", k: 6, z: 3, tip: "mc", b: "ara-cikis", s: "%15'te nakit akışları −40.000 · 15.000 · −8.000 · 20.000 · −5.000 · 30.000 olan B projesinin NBD'si ≅ −7.799 TL'dir. Karar hangisidir?", o: ["Kabul; girişler çıkışlardan fazla", "Değerlendirmeye alınmaz; NBD < 0", "Kabul; son yıl 30.000 getiriyor", "Ara çıkışlar hesaba katılmaz, kabul", "KE > 1 olduğu için kabul"], c: 1, y: { 0: "Girişlerin toplamı (65.000) çıkışlardan (53.000) fazla görünür ama bugüne indirgenince fark kapanmaz; NBD eksi.", 3: "Ara çıkışlar da indirgenip eksi olarak katılır." }, a: "NBD < 0 → proje değerlendirmeye alınmaz (Vize Provası 2)." },
    { id: "f6-15", k: 6, z: 2, tip: "klasik", b: "nbd-hesap", s: "Faiz oranının %20 olduğu bir ortamda 500.000 TL yatırım gerektiren bir proje 1. yıl 200.000 TL, 2. yıl 300.000 TL, 3. yıl 250.000 TL nakit girişi sağlayacaktır. Projenin net bugünkü değerini bulunuz ve yatırımı değerlendiriniz.", model: K`NBD = −500.000/(1+0,20)⁰ + 200.000/(1+0,20)¹
      + 300.000/(1+0,20)² + 250.000/(1+0,20)³

    = −500.000/1 + 200.000/1,2 + 300.000/1,44 + 250.000/1,728

    = −500.000 + 166.667 + 208.333 + 144.676

    = −500.000 + 519.676  ⇒  NBD ≅ 19.676 TL

Karar: NBD > 0 olduğu için proje faizin üstünde
kazandırır; yatırım kabul edilir.`, olcut: ["NBD formülü dönem üsleriyle yazıldı", "Çarpanlar 1 · 1,2 · 1,44 · 1,728 doğru", "Bugünkü değerler 166.667 · 208.333 · 144.676", "NBD ≅ 19.676 TL", "NBD > 0 → kabul kararı yazıldı"], a: "Vize Provası 2, Uygulama 3'ün aynısı." },
    { id: "f6-16", k: 6, z: 3, tip: "klasik", b: "nbd-hesap", s: "İskonto oranı %15. Bir proje bugün 20.000 TL yatırım istiyor; 1. yıl 11.500 TL, 2. yıl 15.870 TL nakit girişi sağlıyor. NBD'yi hesaplayıp karar veriniz.", model: K`NBD = −20.000/1 + 11.500/(1,15)¹ + 15.870/(1,15)²
    = −20.000 + 11.500/1,15 + 15.870/1,3225
    = −20.000 + 10.000 + 12.000
    = 2.000 TL

Karar: NBD > 0 → proje kabul edilir.`, olcut: ["0. dönem −20.000 yazıldı", "Çarpanlar 1,15 ve 1,3225 (≅1,323)", "Bugünkü değerler 10.000 ve 12.000", "NBD = 2.000 TL", "Kabul kararı"], a: "1,323 ile bölersen 11.995 çıkar; NBD ≅ 1.995. Hocanın çarpanlarıyla küçük yuvarlama farkı puan kaybettirmez." }
  );

  /* ------------------------------------------------------------------ 7 */
  D.konular.push({
    no: 7, ad: "Kârlılık endeksi (KE) ve NBD ile karşılaştırma", kisa: "Kârlılık endeksi", sinav: "vize",
    hedef: ["KE'yi girişlerin BD toplamı ÷ çıkışların BD toplamı olarak hesaplamak", "Ara dönem çıkışlarını paydaya eklemek", "KE > 1 kuralıyla karar vermek", "NBD ile KE'nin neden farklı proje seçebildiğini açıklamak"],
    anlat: [
      { t: "p", h: "Vize provalarında NBD'nin hemen ardından <b>b) şıkkı</b> olarak kârlılık endeksi sorulur. KE, yatırılan <b>her 1 TL'nin bugünün parasıyla ne kadar geri getirdiğini</b> gösterir. NBD'de hesapladığın bugünkü değerleri tekrar kullanırsın." },
      { t: "formul", baslik: "Kârlılık endeksi (hocanın yazımı)", h: "KE = <b>N.G.NBD ÷ N.Ç.NBD</b><br>N.G.NBD: nakit girişlerinin bugünkü değerleri toplamı · N.Ç.NBD: nakit çıkışlarının bugünkü değerleri toplamı (ilk yatırım + ara dönem çıkışları)" },
      { t: "tablo", baslik: "Karar kuralı", b: ["Sonuç", "Karar"], r: [["KE > 1", "Kabul (her 1 TL, 1'den fazla geri getirir)"], ["KE < 1", "Tercih edilmez"], ["İki proje varsa", "KE'si büyük olan seçilir"], ["NBD > 0 ise", "KE > 1'dir (ikisi aynı şeyi söyler)"]] },
      { t: "adim", baslik: "Vize Provası 1 · Uygulama 4-b (A ve B, %15)", adimlar: [
        ["A projesi", "KE_A = (2.609 + 3.025 + 2.630 + 1.715 + 994) ÷ 10.000 = 10.973 ÷ 10.000 = 1,097"],
        ["B projesi", "KE_B = (12.174 + 12.098 + 11.835 + 11.435 + 5.966) ÷ 50.000 = 53.509 ÷ 50.000 = 1,070"],
        ["Karar (KE)", "KE_A > KE_B → kârlılık endeksine göre A projesi seçilir. A'da yatırılan her 1 TL, 1,097 TL geri getirir."],
        ["Genel karar", "NBD'ye göre B (3.509 > 973), KE'ye göre A (1,097 > 1,070). Yöntemler farklı proje seçti: B çok daha büyük bir yatırım; NBD kazancı TL olarak, KE ise verim oranı olarak ölçer."]] },
      { t: "adim", baslik: "Vize Provası 2 · Uygulama 4-b (ara dönem çıkışlı, %15)", adimlar: [
        ["A: −25.000 · 12.000 · −4.000 · 14.000 · 10.000 · 9.000", "Girişler: 10.435 + 9.205 + 5.718 + 4.475 = 29.832 · Çıkışlar: 25.000 + 3.025 = 28.025"],
        ["KE_A", "29.832 ÷ 28.025 = 1,064 > 1"],
        ["B: −40.000 · 15.000 · −8.000 · 20.000 · −5.000 · 30.000", "Girişler: 13.043 + 13.150 + 14.915 = 41.109 · Çıkışlar: 40.000 + 6.049 + 2.859 = 48.908"],
        ["KE_B", "41.109 ÷ 48.908 = 0,841 < 1 → her 1 TL yalnızca 0,841 TL getirir, tercih edilmez"],
        ["Karar", "NBD_A ≅ 1.808 > 0 ve KE_A > 1; NBD_B ≅ −7.799 < 0 ve KE_B < 1. Her iki yönteme göre A projesi seçilir."]] },
      { t: "kontrol", s: "Ara dönemdeki −8.000 TL'lik nakit çıkışı KE hesabında nereye yazılır?", o: ["Paya, girişlerden düşülerek", "Paydaya, ilk yatırımla birlikte (bugünkü değeriyle)", "Hiç yazılmaz", "Sadece NBD'de kullanılır"], c: 1, a: "KE = girişlerin BD toplamı ÷ çıkışların BD toplamı. Ara çıkışlar bugüne indirgenip paydaya eklenir." }
    ],
    alt: [
      { t: "p", h: "NBD “kaç TL kazandırıyor?”, KE “her 1 TL'ye kaç TL getiriyor?” sorusunu cevaplar. 10.000 TL yatırıp 10.973 TL alan proje oranca daha verimlidir (1,097); 50.000 TL yatırıp 53.509 TL alan proje TL olarak daha çok kazandırır (3.509 TL)." },
      { t: "hayat", baslik: "Market örneği", h: "Küçük dükkânın 10.000 TL sermayeyle 1.000 TL, büyük mağazanın 50.000 TL sermayeyle 3.500 TL kâr ettiğini düşün. Kâr tutarına bakarsan büyük mağaza (NBD), sermayeye oranla bakarsan küçük dükkân (KE) daha iyi. Vizede “neden farklı seçtiler?” sorusunun cevabı budur: <b>yatırım büyüklükleri farklı</b>." },
      { t: "kontrol", s: "Girişlerin BD toplamı 55.000, çıkışların BD toplamı 50.000. KE kaçtır?", o: ["0,91", "1,1", "5.000", "1,05"], c: 1, a: "55.000 ÷ 50.000 = 1,1 > 1 → kabul." }
    ],
    ozet: ["KE = Girişlerin BD toplamı ÷ Çıkışların BD toplamı", "Ara dönem çıkışları paydaya eklenir", "KE > 1 kabul · KE < 1 tercih edilmez", "NBD > 0 ⇔ KE > 1", "NBD tutar (TL), KE oran ölçer; yatırım büyüklüğü farklıysa farklı proje seçebilirler"]
  });
  D.sorular.push(
    { id: "f7-01", k: 7, z: 1, tip: "mc", b: "ke-tanim", s: "Nakit girişlerinin bugünkü değerinin nakit çıkışlarının bugünkü değerine oranı hangisidir?", o: ["Net bugünkü değer", "Kârlılık endeksi", "Trend endeksi", "Dikey analiz", "Risksiz getiri"], c: 1, a: "KE = N.G.NBD ÷ N.Ç.NBD" },
    { id: "f7-02", k: 7, z: 1, tip: "mc", b: "ke-tanim", s: "Kârlılık endeksine göre proje hangi durumda kabul edilir?", o: ["KE > 0", "KE > 1", "KE < 1", "KE = 0", "KE < 0"], c: 1, y: { 0: "0 sınırı NBD'nin karar kuralıdır." }, a: "KE > 1 → her 1 TL'den fazlası geri geliyor." },
    { id: "f7-03", k: 7, z: 1, tip: "bosluk", b: "ke-hesap", s: "Nakit girişlerinin BD toplamı 55.000 TL, nakit çıkışlarının BD toplamı 50.000 TL olan projenin KE'si ______'dir.", c: ["1,1", "1.1", "1,10", "1.10"], a: "55.000 ÷ 50.000 = 1,1" },
    { id: "f7-04", k: 7, z: 2, tip: "bosluk", b: "ke-hesap", s: "A projesinde girişlerin BD toplamı 10.973 TL, ilk yatırım 10.000 TL'dir. KE_A = ______ (üç basamak).", c: ["1,097", "1.097", "1,0973"], a: "10.973 ÷ 10.000 = 1,097 (Vize Provası 1)" },
    { id: "f7-05", k: 7, z: 2, tip: "mc", b: "ke-tanim", s: "KE = 1,097 sonucunun anlamı nedir?", o: ["Proje %1,097 kâr eder", "Yatırılan her 1 TL bugünün parasıyla 1,097 TL geri getirir", "Proje 1.097 TL kazandırır", "Proje zarar eder", "Faiz oranı %1,097'dir"], c: 1, a: "KE yatırımın verimini, yani her 1 TL'nin karşılığını gösterir." },
    { id: "f7-06", k: 7, z: 2, tip: "dy", b: "nbd-ke", s: "Bir projenin NBD'si sıfırdan büyükse kârlılık endeksi 1'den büyüktür.", c: true, a: "Doğru. NBD > 0 demek girişlerin BD'si çıkışlarınkinden büyük demektir; oranları da 1'den büyük olur." },
    { id: "f7-07", k: 7, z: 1, tip: "dy", b: "ke-tanim", s: "KE'si 0,841 olan bir proje kabul edilir.", c: false, a: "Yanlış. KE < 1: her 1 TL yatırım yalnızca 0,841 TL getirir; tercih edilmez." },
    { id: "f7-08", k: 7, z: 3, tip: "mc", b: "nbd-ke", s: "NBD yöntemi B projesini, KE yöntemi A projesini seçti. Bunun en olası nedeni nedir?", o: ["Hesap hatası yapılmıştır", "Projelerin yatırım büyüklükleri farklıdır; NBD tutarı, KE oranı ölçer", "İskonto oranı iki yöntemde farklıdır", "KE paranın zaman değerini dikkate almaz", "NBD ara dönemleri hesaba katmaz"], c: 1, y: { 3: "KE de bugünkü değerlerle hesaplanır; zaman değerini dikkate alır." }, a: "Büyük proje daha yüksek NBD (TL), küçük proje daha yüksek KE (verim) verebilir." },
    { id: "f7-09", k: 7, z: 3, tip: "mc", b: "ara-cikis", s: "Ara dönemde nakit çıkışı olan bir projede KE hesaplanırken bu çıkışlar ne yapılır?", o: ["Hesaba katılmaz", "Bugüne indirgenip paydaya (çıkışlara) eklenir", "Paydaki girişlere eklenir", "İlk yatırımdan düşülür", "Faiz oranına eklenir"], c: 1, a: "Payda = ilk yatırım + ara çıkışların bugünkü değerleri (Vize Provası 2: 25.000 + 3.025 = 28.025)." },
    { id: "f7-10", k: 7, z: 3, tip: "bosluk", b: "ke-hesap", s: "B projesinde girişlerin BD toplamı 41.109 TL, çıkışların BD toplamı 48.908 TL'dir. KE_B = ______ (üç basamak).", c: ["0,841", "0.841", ",841"], a: "41.109 ÷ 48.908 = 0,841 < 1 → tercih edilmez (Vize Provası 2)." },
    { id: "f7-11", k: 7, z: 2, tip: "sira", b: "ke-hesap", s: "KE sorusunun çözüm adımlarını sırala.", o: ["Her nakit akışının bugünkü değerini bul", "Girişlerin bugünkü değerlerini topla (pay)", "İlk yatırım ve ara çıkışların bugünkü değerlerini topla (payda)", "Payı paydaya böl", "KE'yi 1 ile karşılaştırıp karar yaz"], a: "BD'ler → pay → payda → bölme → karar." },
    { id: "f7-12", k: 7, z: 2, tip: "mc", b: "nbd-ke", s: "KE_A = 1,064 ve KE_B = 0,841 bulunmuştur. Karar hangisidir?", o: ["B seçilir", "A seçilir, B tercih edilmez", "İkisi de kabul", "İkisi de reddedilir", "Eşit kârlı"], c: 1, a: "KE_A > 1 kabul; KE_B < 1 tercih edilmez → A seçilir (Vize Provası 2)." },
    { id: "f7-13", k: 7, z: 3, tip: "dy", b: "ara-cikis", s: "KE'nin paydasına yalnızca 0. dönemdeki ilk yatırım yazılır; ara dönem çıkışları dahil edilmez.", c: false, a: "Yanlış. Ara dönem çıkışlarının bugünkü değerleri de paydaya eklenir." },
    { id: "f7-14", k: 7, z: 2, tip: "klasik", b: "ke-hesap", s: "İskonto oranı %15. Bir proje bugün 40.000 TL yatırım istiyor; 1. yıl 23.000 TL, 2. yıl 31.740 TL nakit girişi sağlıyor. a) NBD'yi, b) kârlılık endeksini bulup karar veriniz.", model: K`a) NBD = −40.000 + 23.000/1,15 + 31.740/1,3225
       = −40.000 + 20.000 + 24.000
       = 4.000 TL  → NBD > 0, kabul

b) KE = N.G.NBD / N.Ç.NBD
      = (20.000 + 24.000) / 40.000
      = 44.000 / 40.000 = 1,1 → KE > 1, kabul

Her 1 TL yatırım 1,1 TL geri getirir.`, olcut: ["Bugünkü değerler 20.000 ve 24.000 bulundu", "NBD = 4.000 TL ve kabul kararı", "KE formülü (girişler BD ÷ çıkışlar BD) yazıldı", "KE = 1,1", "KE > 1 → kabul ve yorum"], a: "1,323 ile bölersen 23.991 çıkar; küçük yuvarlama farkı sorun değildir." }
  );

  /* ------------------------------------------------------------------ 8 */
  D.konular.push({
    no: 8, ad: "Finansal yönetim, finansal sistem ve piyasalar", kisa: "Finansal sistem", sinav: "vize",
    hedef: ["Finansal yönetim ve finansal sistem tanımlarını yazmak", "Doğrudan ve dolaylı finansmanı ayırmak", "Para–sermaye, birincil–ikincil, organize–tezgâhüstü piyasaları karşılaştırmak"],
    anlat: [
      { t: "p", h: "Vize provalarında <b>tanım soruları</b> (5 × 4 puan) ve <b>klasik sorular</b> (3 × 10 puan) bu kavramlardan gelir. Prova 1'de “finansal sistem” ve “birincil piyasa” tanımı, “para ve sermaye piyasası farkı” klasik olarak soruldu." },
      { t: "terim", baslik: "Tanımlar (kelimesi kelimesine çalış)", l: [["Finansal yönetim", "İşletmenin ihtiyaç duyduğu fonların doğru zamanda, doğru yerde ve doğru şartlarda temin edilmesi ve bu fonların işletmenin ihtiyaçlarına uygun şekilde değerlendirilmesi faaliyetleri ile ilgilenir."], ["Finansal sistem", "Atıl fonların tasarruf sahiplerinden (fon arz edenler) fona ihtiyaç duyanlara (fon talep edenler) aktarılmasını sağlayan kurumlar, piyasalar, araçlar ve kurallar bütünüdür."], ["Birincil piyasa", "Bir finansal aracın ilk kez ihraç edildiği piyasadır; yatırımcının ödediği para doğrudan şirkete gider."], ["İkincil piyasa", "İhraç edilmiş araçların yatırımcılar arasında alınıp satıldığı piyasadır; para hisseyi satan yatırımcıya gider."], ["Organize piyasa", "Belirli kurallar altında, merkezi bir yapıda işlem yapılan, fiyat oluşumu şeffaf ve denetimli piyasadır (borsa)."], ["Tezgâhüstü piyasa", "İşlemlerin merkezi bir borsa dışında, taraflar arasında yapıldığı piyasadır."]] },
      { t: "formul", baslik: "Finansal sistemin unsurları", h: "Finansal sistem = <b>Fon arz edenler + Fon talep edenler + Aracılar + Araçlar</b>" },
      { t: "tablo", baslik: "Para ve sermaye piyasaları (Prova 1 klasik sorusu)", b: ["", "Para piyasası", "Sermaye piyasası"], r: [["Vade", "1 yıl ve daha kısa", "Orta ve uzun (1 yıldan uzun)"], ["Risk", "Daha düşük", "Daha yüksek"], ["Likidite", "Yüksek", "Daha düşük"], ["Araçlar", "Kısa vadeli kredi, mevduat, Hazine bonosu", "Hisse senedi, tahvil, uzun vadeli borçlanma araçları"]] },
      { t: "tablo", baslik: "Doğrudan ve dolaylı finansman", b: ["", "Fon nasıl aktarılır?", "Örnek"], r: [["Doğrudan", "Fon talep eden ⟷ fon arz eden (aracı yok)", "Girişimcinin melek yatırımcıdan para alması"], ["Dolaylı", "Fon talep eden ⟷ aracı ⟷ fon arz eden", "Mevduatın banka aracılığıyla kredi olarak verilmesi"]] },
      { t: "hayat", baslik: "Karıştırılan ikili: bono ve tahvil", h: "<b>Bono</b> kısa vadelidir → para piyasası. <b>Tahvil</b> uzun vadelidir → sermaye piyasası. Hazine bonosu sınavda “para piyasası aracı” olarak sorulur." },
      { t: "kontrol", s: "Halka arzda hisse alan yatırımcının ödediği para kime gider?", o: ["Borsaya", "Şirkete (birincil piyasa)", "Hisseyi satan yatırımcıya", "Devlete"], c: 1, a: "Halka arz birincil piyasa işlemidir; para şirkete gider. Sonra borsada el değiştirince (ikincil piyasa) para satan yatırımcıya gider." }
    ],
    alt: [
      { t: "p", h: "Piyasaları üç farklı soruyla sınıflandır: <b>Vadesi ne kadar?</b> (para – sermaye) · <b>İlk satış mı, el değiştirme mi?</b> (birincil – ikincil) · <b>Kurallı merkezi yapı mı, taraflar arası mı?</b> (organize – tezgâhüstü)." },
      { t: "hayat", baslik: "Araba örneği", h: "Bayiden sıfır araba alırsan para üreticiye gider (birincil piyasa). Aynı arabayı sonra bir başkasına satarsan para sana gelir, üreticiye değil (ikincil piyasa). Galeriden kurallı alım = organize; tanıdığa elden satış = tezgâhüstü." },
      { t: "kontrol", s: "Hazine bonosu hangi piyasada işlem görür?", o: ["Sermaye piyasası", "Para piyasası", "İkincil emtia piyasası", "Tezgâhüstü hisse piyasası"], c: 1, a: "Bono kısa vadelidir (1 yıl ve altı) → para piyasası." }
    ],
    ozet: ["Finansal yönetim: fonların doğru zaman, yer ve şartta temini ve değerlendirilmesi", "Finansal sistem: fon arz edenden fon talep edene aktarım (kurumlar, piyasalar, araçlar, kurallar)", "Para piyasası ≤ 1 yıl (bono) · Sermaye piyasası > 1 yıl (hisse, tahvil)", "Birincil: para şirkete · İkincil: para satan yatırımcıya", "Organize: borsa, kurallı · Tezgâhüstü: taraflar arası"]
  });
  D.sorular.push(
    { id: "f8-01", k: 8, z: 1, tip: "mc", b: "fy-tanim", s: "İşletmenin ihtiyaç duyduğu fonların doğru zamanda, doğru yerde ve doğru şartlarda temin edilmesi ve değerlendirilmesiyle ilgilenen alan hangisidir?", o: ["Pazarlama yönetimi", "Finansal yönetim", "Üretim yönetimi", "İnsan kaynakları", "Muhasebe denetimi"], c: 1, a: "Finansal yönetimin iki işi: fon bulmak ve fonu kullanmak." },
    { id: "f8-02", k: 8, z: 1, tip: "mc", b: "sistem", s: "Hangisi finansal sistemin unsurlarından biri değildir?", o: ["Fon arz edenler", "Fon talep edenler", "Aracılar", "Finansal araçlar", "Üretim tesisleri"], c: 4, a: "Finansal sistem = fon arz edenler + fon talep edenler + aracılar + araçlar." },
    { id: "f8-03", k: 8, z: 1, tip: "mc", b: "para-sermaye", s: "Hazine bonosu hangi piyasada işlem görür?", o: ["Sermaye piyasası", "Para piyasası", "Birincil hisse piyasası", "Tezgâhüstü piyasa", "Emtia piyasası"], c: 1, a: "Bono kısa vadelidir → para piyasası." },
    { id: "f8-04", k: 8, z: 1, tip: "bosluk", b: "para-sermaye", s: "Para piyasası ile sermaye piyasasını ayıran vade sınırı ______ yıldır.", c: ["1", "bir", "1 yıl"], a: "1 yıl ve altı para piyasası, 1 yıldan uzun sermaye piyasası." },
    { id: "f8-05", k: 8, z: 2, tip: "mc", b: "birincil-ikincil", s: "Yatırımcının ödediği paranın doğrudan şirkete gittiği piyasa hangisidir?", o: ["İkincil piyasa", "Tezgâhüstü piyasa", "Birincil piyasa", "Para piyasası", "Döviz piyasası"], c: 2, a: "Birincil piyasada araç ilk kez ihraç edilir (halka arz); para şirkete gider." },
    { id: "f8-06", k: 8, z: 2, tip: "mc", b: "organize", s: "Merkezi bir yapıda, belli kurallar ve denetim altında işlem yapılan piyasa hangisidir?", o: ["Tezgâhüstü piyasa", "Organize piyasa", "İkincil piyasa", "Para piyasası", "Birincil piyasa"], c: 1, a: "Organize piyasa: kurallar belli, fiyat oluşumu şeffaf, denetim var (borsa)." },
    { id: "f8-07", k: 8, z: 2, tip: "dy", b: "finansman", s: "Mevduat sahiplerinin parasının banka aracılığıyla kredi olarak verilmesi doğrudan finansmandır.", c: false, a: "Yanlış. Araya banka (aracı) girdiği için dolaylı finansmandır." },
    { id: "f8-08", k: 8, z: 1, tip: "dy", b: "para-sermaye", s: "Hisse senedi ve tahvil sermaye piyasası araçlarıdır.", c: true, a: "Doğru. Orta ve uzun vadeli araçlar sermaye piyasasında işlem görür." },
    { id: "f8-09", k: 8, z: 2, tip: "dy", b: "birincil-ikincil", s: "Borsada hisse alım satımında para hisseyi satan yatırımcıya gider.", c: true, a: "Doğru. Bu ikincil piyasa işlemidir; para şirkete değil satan yatırımcıya gider." },
    { id: "f8-10", k: 8, z: 3, tip: "mc", b: "para-sermaye", s: "Para piyasaları için hangisi yanlıştır?", o: ["Vade 1 yıl veya daha kısadır", "Likiditesi yüksektir", "Riski daha düşüktür", "Hisse senedi ve tahvil işlem görür", "Kısa vadeli nakit ihtiyacını karşılar"], c: 3, a: "Hisse ve tahvil sermaye piyasası araçlarıdır." },
    { id: "f8-11", k: 8, z: 3, tip: "mc", b: "finansman", s: "Bir girişimcinin parayı hiçbir aracı olmadan doğrudan bir melek yatırımcıdan alması hangi finansman türüdür?", o: ["Dolaylı finansman", "Doğrudan finansman", "Kamu finansmanı", "Tezgâhüstü finansman", "Kredi finansmanı"], c: 1, a: "Aracı yoksa doğrudan finansman." },
    { id: "f8-12", k: 8, z: 3, tip: "bosluk", b: "sistem", s: "Finansal sistemde fonlarını başkalarına kullandıran tasarruf sahiplerine fon ______ edenler denir.", c: ["arz", "arz edenler"], a: "Tasarruf sahipleri fon arz edenler, fona ihtiyaç duyanlar fon talep edenlerdir." },
    { id: "f8-13", k: 8, z: 2, tip: "sira", b: "birincil-ikincil", s: "Bir şirket hissesinin yolculuğunu sırala.", o: ["Şirket paylarını halka arz eder", "Yatırımcı payları alır, para şirkete gider (birincil piyasa)", "Yatırımcı payları borsada başka yatırımcıya satar", "Para satan yatırımcıya gider (ikincil piyasa)"], a: "Önce birincil piyasada ihraç, sonra ikincil piyasada el değiştirme." },
    { id: "f8-14", k: 8, z: 2, tip: "klasik", b: "para-sermaye", s: "Para piyasaları ile sermaye piyasaları arasındaki farkı örneklerle açıklayınız.", model: K`Para piyasalarında 1 yıl veya daha kısa vadeli fonlar
işlem görür; riski düşük, likiditesi yüksektir.
Örnek: kısa vadeli krediler, mevduat, Hazine bonosu.

Sermaye piyasalarında orta ve uzun vadeli (1 yıldan uzun)
fonlar işlem görür; riski daha yüksektir.
Örnek: hisse senedi, tahvil, uzun vadeli borçlanma araçları.`, olcut: ["Vade sınırı (1 yıl) belirtildi", "Para piyasası örnekleri verildi (mevduat, bono, kısa vadeli kredi)", "Sermaye piyasası örnekleri verildi (hisse, tahvil)", "Risk/likidite farkına değinildi"], a: "Vize Provası 1, klasik soru 1." },
    { id: "f8-15", k: 8, z: 3, tip: "klasik", b: "birincil-ikincil", s: "Bir şirketin halka arzında hisse alan yatırımcı bir ay sonra bu hisseleri borsada başka bir yatırımcıya satıyor. Bu iki işlem hangi piyasalarda gerçekleşmiştir? Paranın kime gittiğini belirtiniz.", model: K`Halka arzda alım: birincil piyasa işlemidir.
Yatırımcının ödediği para doğrudan şirkete gider.

Borsada satış: ikincil piyasa işlemidir (borsa aynı
zamanda organize piyasadır). Para şirkete değil, hisseyi
satan yatırımcıya gider.`, olcut: ["Halka arz = birincil piyasa", "Birincilde para şirkete gider", "Borsada satış = ikincil piyasa", "İkincilde para satan yatırımcıya gider"], a: "" }
  );

  /* ------------------------------------------------------------------ 9 */
  D.konular.push({
    no: 9, ad: "Finansal tablolar ve paranın zaman değeri kavramları", kisa: "Tablolar ve kavramlar", sinav: "vize",
    hedef: ["Bilanço ile gelir tablosunu ayırmak", "Dönen ve duran varlıklara örnek vermek", "Bilanço eşitliğiyle eksik kalemi bulmak", "Paranın zaman değeri ve risksiz getiriyi tanımlamak"],
    anlat: [
      { t: "p", h: "Son konu, provalardaki tanım sorularının geri kalanı: <b>bilanço, gelir tablosu, paranın zaman değeri, risksiz getiri</b>. Vize Provası 2'de “bilanço ile gelir tablosu farkı, dönen ve duran varlıklara ikişer örnek” klasik olarak soruldu." },
      { t: "terim", baslik: "Tanımlar", l: [["Bilanço", "Bir işletmenin belirli bir tarihte sahip olduğu varlıkları ve bu varlıkları edinmek için kullandığı kaynakları gösteren tablodur."], ["Gelir tablosu", "İşletmenin belirli bir dönemde elde ettiği gelirleri, bu gelirler için katlandığı giderleri ve dönem sonundaki kâr/zararı gösteren tablodur."], ["Dönen varlıklar", "Nakit, çek, hisse senedi, bono, kısa vadeli alacaklar ve 1 yıl içinde nakde dönmesi beklenen varlıklar (stoklar)."], ["Duran varlıklar", "Faaliyet için 1 yıldan uzun kullanılan varlıklar ve uzun vadeli yatırımlar: bina, arsa, makine, taşıt."], ["Paranın zaman değeri", "Bugün elde edilen bir liranın gelecekteki bir liradan daha değerli olmasıdır; bugünkü para faiz kazanabilir, enflasyon ve belirsizlik gelecekteki paranın değerini düşürür."], ["Risksiz getiri (risk free)", "Hiçbir risk taşımadan, kaybetme ihtimali olmadan elde edilen getiridir; devlet tahvili ya da mevduat faizi örnektir. Yatırımlar için kıyas noktasıdır."]] },
      { t: "formul", baslik: "Bilanço eşitliği", h: "Dönen varlıklar + Duran varlıklar = <b>K.V.Y.K. + U.V.Y.K. + Özkaynaklar</b><br>Toplam varlıklar = Toplam kaynaklar" },
      { t: "tablo", baslik: "Bilanço ile gelir tablosu", b: ["", "Bilanço", "Gelir tablosu"], r: [["Neyi gösterir?", "Varlıklar ve kaynaklar", "Gelirler, giderler, kâr/zarar"], ["Zaman", "Belirli bir tarih (an)", "Belirli bir dönem (süre)"], ["Hesap grupları", "100–200 varlık, 300–400–500 kaynak", "600 ve 700"]] },
      { t: "tablo", baslik: "Gelir tablosunun ana basamakları", b: ["İşlem", "Sonuç"], r: [["Brüt satışlar − iadeler − iskontolar", "Net satışlar"], ["Net satışlar − SMM", "Brüt kâr"], ["Brüt kâr − faaliyet giderleri", "Faaliyet kârı"], ["FVÖK − finansman giderleri", "Vergi öncesi kâr"], ["Vergi öncesi kâr − vergi", "Net kâr"]] },
      { t: "kontrol", s: "Dönen varlıklar 400.000, duran varlıklar 600.000, K.V.Y.K. 250.000, U.V.Y.K. 350.000 TL. Özkaynaklar kaçtır?", o: ["1.000.000", "400.000", "600.000", "150.000"], c: 1, a: "Toplam varlık 1.000.000 = 250.000 + 350.000 + Özkaynak → Özkaynak = 400.000 TL." }
    ],
    alt: [
      { t: "p", h: "Bilanço bir <b>fotoğraftır</b>: 31 Aralık günü işletmenin elinde ne var, bunları kimin parasıyla almış. Gelir tablosu bir <b>videodur</b>: 1 Ocak'tan 31 Aralık'a kadar ne kazandı, ne harcadı, sonunda kâr mı etti zarar mı." },
      { t: "hayat", baslik: "Dönen mi duran mı?", h: "Kendine sor: “Bu varlık 1 yıl içinde nakde döner mi?” Stoklar satılıp nakde döner → dönen. Fabrika binası yıllarca kullanılır → duran." },
      { t: "kontrol", s: "Hangisi duran varlıktır?", o: ["Stoklar", "Kısa vadeli alacaklar", "Makine ve tesisler", "Hazine bonosu"], c: 2, a: "Makine ve tesisler 1 yıldan uzun kullanılır → duran varlık." }
    ],
    ozet: ["Bilanço: belirli bir tarih · Gelir tablosu: belirli bir dönem", "Toplam varlıklar = Toplam kaynaklar", "Dönen: nakit, alacak, stok · Duran: bina, arsa, makine, taşıt", "Net satışlar − SMM = Brüt kâr", "Paranın zaman değeri ve risksiz getiri tanımlarını ezberle"]
  });
  D.sorular.push(
    { id: "f9-01", k: 9, z: 1, tip: "mc", b: "bilanco", s: "Bir işletmenin belirli bir tarihteki varlıklarını ve kaynaklarını gösteren tablo hangisidir?", o: ["Gelir tablosu", "Nakit akış tablosu", "Bilanço", "Bütçe", "Satış raporu"], c: 2, a: "Bilanço belirli bir anı gösterir." },
    { id: "f9-02", k: 9, z: 1, tip: "mc", b: "donen-duran", s: "Hangisi dönen varlıklar arasında yer almaz?", o: ["Nakit", "Stoklar", "Kısa vadeli ticari alacaklar", "Makine ve tesisler", "Hazine bonosu"], c: 3, a: "Makine ve tesisler duran varlıktır." },
    { id: "f9-03", k: 9, z: 1, tip: "mc", b: "risksiz", s: "Hangisi risksiz getiriye örnek gösterilebilir?", o: ["Hisse senedi getirisi", "Kripto para", "Devlet tahvili / mevduat faizi", "Yeni bir iş kurmak", "Altın"], c: 2, a: "Kaybetme ihtimali olmayan getiri: devlet tahvili ya da mevduat faizi." },
    { id: "f9-04", k: 9, z: 1, tip: "dy", b: "bilanco", s: "Bilançoda toplam varlıklar her zaman toplam kaynaklara eşittir.", c: true, a: "Doğru. Paranın nerede durduğu (varlıklar) ile nereden geldiği (kaynaklar) dengededir." },
    { id: "f9-05", k: 9, z: 2, tip: "mc", b: "gelir-tablosu", s: "Gelir tablosunda “Net satışlar − Satılan malların maliyeti” işleminin sonucu nedir?", o: ["Faaliyet kârı", "Net kâr", "Brüt kâr", "Olağan kâr", "FVÖK"], c: 2, a: "Net satışlar − SMM = Brüt kâr" },
    { id: "f9-06", k: 9, z: 2, tip: "mc", b: "pzd", s: "Bugünkü 1 liranın gelecekteki 1 liradan daha değerli olmasının temel nedeni nedir?", o: ["Vergiler", "Bugünkü paranın faiz/getiri kazanabilmesi", "Döviz kuru", "Muhasebe kuralları", "Amortisman"], c: 1, a: "Paranın zaman değeri: bugünkü para faiz kazanabilir; enflasyon ve belirsizlik gelecekteki paranın değerini düşürür." },
    { id: "f9-07", k: 9, z: 2, tip: "dy", b: "gelir-tablosu", s: "Gelir tablosu belirli bir anı, bilanço ise belirli bir dönemi gösterir.", c: false, a: "Yanlış; tam tersi. Bilanço bir anı (tarih), gelir tablosu bir dönemi gösterir." },
    { id: "f9-08", k: 9, z: 2, tip: "bosluk", b: "bilanco", s: "Dönen varlıklar 400.000 TL, duran varlıklar 600.000 TL, K.V.Y.K. 250.000 TL, U.V.Y.K. 350.000 TL ise özkaynaklar ______ TL'dir.", c: T("400.000"), a: "1.000.000 − 250.000 − 350.000 = 400.000 TL" },
    { id: "f9-09", k: 9, z: 3, tip: "bosluk", b: "gelir-tablosu", s: "Brüt satışlar 900.000, satış iadeleri 50.000, satış iskontoları 50.000, SMM 500.000 TL ise brüt kâr ______ TL'dir.", c: T("300.000"), a: "Net satışlar = 900.000 − 50.000 − 50.000 = 800.000 · Brüt kâr = 800.000 − 500.000 = 300.000 TL" },
    { id: "f9-10", k: 9, z: 3, tip: "mc", b: "gelir-tablosu", s: "Gelir tablosundaki gelir ve gider kalemleri hangi hesap gruplarında yer alır?", o: ["100 ve 200", "300 ve 400", "500", "600 ve 700", "800 ve 900"], c: 3, a: "Bilanço: 100–200 varlık, 300–400–500 kaynak · Gelir tablosu: 600 ve 700." },
    { id: "f9-11", k: 9, z: 3, tip: "dy", b: "risksiz", s: "Bir yatırım fırsatı risksiz getiriden (faizden) daha az kazandırıyorsa değerlendirilmez.", c: true, a: "Doğru. Risksiz getiri kıyas noktasıdır; “fırsatı değerlendirmeli mi?” sorularının mantığı budur." },
    { id: "f9-12", k: 9, z: 2, tip: "sira", b: "gelir-tablosu", s: "Gelir tablosunda kalemleri yukarıdan aşağıya doğru sırala.", o: ["Net satışlar", "Brüt kâr", "Faaliyet kârı", "Vergi öncesi kâr", "Net kâr"], a: "Satışlardan başlayıp giderler düşülerek net kâra inilir." },
    { id: "f9-13", k: 9, z: 1, tip: "dy", b: "donen-duran", s: "Stoklar dönen varlıktır.", c: true, a: "Doğru. 1 yıl içinde satılıp nakde dönmesi beklenir." },
    { id: "f9-14", k: 9, z: 2, tip: "klasik", b: "bilanco", s: "Bilanço ile gelir tablosu arasındaki farkı yazınız. Dönen ve duran varlıklara ikişer örnek veriniz.", model: K`Bilanço belirli bir tarihteki varlık ve kaynakları
gösterir (an). Gelir tablosu belirli bir dönemdeki gelir,
gider ve kâr/zararı gösterir (süre).

Dönen varlık: nakit, stoklar, kısa vadeli alacaklar
Duran varlık: bina, arsa, makine, taşıt`, olcut: ["Bilanço = belirli tarih, varlık ve kaynaklar", "Gelir tablosu = belirli dönem, gelir-gider-kâr", "İki dönen varlık örneği", "İki duran varlık örneği"], a: "Vize Provası 2, klasik soru 1." },
    { id: "f9-15", k: 9, z: 3, tip: "klasik", b: "pzd", s: "Paranın zaman değerini ve risksiz getiriyi tanımlayınız. Risksiz getiri yatırım kararlarında nasıl kullanılır?", model: K`Paranın zaman değeri: Bugün elde edilen bir liranın
gelecekteki bir liradan daha değerli olmasıdır; çünkü
bugünkü para faiz/getiri kazanabilir, enflasyon ve
belirsizlik gelecekteki paranın değerini düşürür.

Risksiz getiri: Hiç risk taşımadan elde edilen getiridir
(devlet tahvili, mevduat faizi).

Kullanımı: Kıyas noktasıdır. Bir yatırım, parayı faize
koymaktan daha fazla kazandırmıyorsa değerlendirilmez.`, olcut: ["Paranın zaman değeri doğru tanımlandı", "Faiz kazanma / enflasyon gerekçesi yazıldı", "Risksiz getiri tanımı ve örneği", "Kıyas noktası olarak kullanımı açıklandı"], a: "" }
  );
})();
