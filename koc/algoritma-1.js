/* SINAV KOÇUM · Algoritma ve Programlamaya Giriş — içerik (1/3: konu 1–4)
   Soru alanları:
   id, k (konu), z (1 kolay, 2 orta, 3 zor), tip, s (soru), b (beceri etiketi), a (açıklama)
   tip: mc (o, c, y = yanlış şıkların mantık hatası) · dy (c: true/false) · bosluk (c: kabul edilen cevaplar)
        kod (kod içinde ___ ; c: kabul edilenler) · cikti (kod; c: kabul edilen çıktılar) · sira (o doğru sırada)
        hata (kod satırları; c: hatalı satır no, 1'den) · akis (akis şeması + mc) · klasik (model cevap + olcut)
*/
(function () {
  var K = String.raw;
  var D = window.KOC_DERS = window.KOC_DERS || { id: "algoritma", ad: "Algoritma ve Programlamaya Giriş", konular: [], sorular: [] };

  /* ------------------------------------------------------------------ 1 */
  D.konular.push({
    no: 1, ad: "Algoritma kavramı ve temel mantık", kisa: "Algoritma", sinav: "vize",
    hedef: ["Algoritmanın ne olduğunu kendi cümlenle anlatmak", "Girdi, işlem ve çıktıyı ayırt etmek", "İyi bir algoritmanın özelliklerini tanımak"],
    anlat: [
      { t: "p", h: "Bilgisayar çok hızlıdır ama <b>kendi kendine düşünemez</b>. Ona ne yapacağını, hangi sırayla yapacağını tek tek söylemek gerekir. İşte bir problemi çözmek için izlenen <b>sırası belli, açık ve sonlu adımlar dizisine algoritma</b> denir." },
      { t: "hayat", baslik: "Günlük hayattan: çay demlemek", h: "1. Çaydanlığa su koy → 2. Ocağı yak → 3. Su kaynayınca demliğe çay koy → 4. Kaynar suyu ekle → 5. 10 dakika demlenmeye bırak → 6. Bardağa koy. Sırayı değiştirirsen (önce bardağa koyup sonra demlersen) sonuç çıkmaz. Algoritmada <b>sıra</b> en az adımlar kadar önemlidir." },
      { t: "tablo", baslik: "Her algoritmada üç parça vardır", b: ["Parça", "Ne demek?", "Ortalama örneğinde"], r: [["Girdi", "Dışarıdan alınan veri", "Vize ve final notu"], ["İşlem", "Veri üzerinde yapılan hesap", "(vize + final) / 2"], ["Çıktı", "Kullanıcıya verilen sonuç", "Ortalama"]] },
      { t: "tablo", baslik: "İyi bir algoritmanın özellikleri", b: ["Özellik", "Anlamı"], r: [["Başlangıç ve bitiş", "Bir 'Başla' ve bir 'Dur' adımı vardır"], ["Açıklık (kesinlik)", "Her adım tek anlama gelir; 'biraz', 'göz kararı' olmaz"], ["Sonluluk", "Sonlu sayıda adımdan sonra mutlaka biter"], ["Sıralılık", "Adımlar belli bir sırayla çalışır"], ["Etkinlik", "Girdiden doğru çıktıyı üretir, gereksiz adım içermez"]] },
      { t: "adim", baslik: "Adım adım örnek · İki sayının ortalaması", adimlar: [
        ["1. Başla", "Her algoritma bir başlangıçla açılır."],
        ["2. A ve B sayılarını oku", "Girdiler kullanıcıdan alınır. A ve B birer değişkendir; içine değer konan kutular gibi düşün."],
        ["3. T = A + B", "Toplam hesaplanıp T kutusuna konur. A = 6, B = 10 ise T = 16."],
        ["4. O = T / 2", "Ortalama hesaplanır: 16 / 2 = 8."],
        ["5. O'yu yaz", "Sonuç ekrana yazdırılır. Bu adım çıktıdır."],
        ["6. Dur", "Algoritma sonlanır. 'Dur' adımı olmayan algoritma sonluluk özelliğini taşımaz."]] },
      { t: "terim", baslik: "Bilmen gereken terimler", l: [["Program", "Algoritmanın bir programlama diliyle yazılmış hâli"], ["Kaynak kod", "Programcının yazdığı, insanın okuyabildiği komutlar"], ["Derleyici", "Kaynak kodu makine diline (0 ve 1) çeviren program"], ["Makine dili", "Bilgisayarın doğrudan anladığı 0 ve 1'lerden oluşan dil"]] },
      { t: "kontrol", s: "\"Tuzu göz kararı ekleyin\" adımı bir algoritmada neden sorun çıkarır?", o: ["Adım sayısını artırdığı için", "Tek bir anlama gelmediği, yani açık olmadığı için", "Başla adımı olmadığı için", "Çıktı üretmediği için"], c: 1, a: "'Göz kararı' kişiden kişiye değişir. Algoritmanın her adımı tek ve kesin bir anlama gelmelidir (açıklık)." }
    ],
    alt: [
      { t: "p", h: "Bunu bir de <b>robot arkadaş</b> üzerinden düşünelim. Elinde sadece söylediğini harfiyen yapan bir robot var. Ona 'bana sandviç yap' dersen hiçbir şey yapmaz; çünkü sandviçin nasıl yapılacağını bilmez." },
      { t: "hayat", baslik: "Robota sandviç yaptırmak", h: "1. Ekmeği al → 2. Bıçakla ekmeği ortadan kes → 3. Bir dilim peyniri ekmeğin arasına koy → 4. Ekmeği kapat → 5. Tabağa koy. Robot bu adımları <b>sırayla ve tam olarak</b> uygular. 'Peyniri biraz koy' dersen robot ne kadar koyacağını bilemez. Bilgisayar da bu robot gibidir." },
      { t: "tablo", baslik: "Kötü ve iyi adım karşılaştırması", b: ["Kötü adım", "Neden kötü?", "İyi hâli"], r: [["Suyu ısıt", "Ne zaman duracağı belli değil", "Su kaynayana kadar ısıt"], ["Sayıları topla", "Hangi sayılar?", "A ile B'yi topla, sonucu T'ye yaz"], ["Sonucu bul", "Hesap yöntemi yok", "O = T / 2"], ["(Dur yok)", "Algoritma bitmez", "Son adım: Dur"]] },
      { t: "p", h: "Kısaca: <b>girdi</b> robotun eline verdiğin malzeme, <b>işlem</b> robotun yaptığı iş, <b>çıktı</b> da ortaya çıkan sandviçtir." },
      { t: "kontrol", s: "Bir öğrencinin vize ve finalinden ortalamasını bulan algoritmada çıktı hangisidir?", o: ["Vize notu", "Final notu", "Ortalama", "Toplama işlemi"], c: 2, a: "Vize ve final girdidir, toplama ve bölme işlemdir; kullanıcıya verilen sonuç (ortalama) çıktıdır." }
    ],
    ozet: ["Algoritma: sırası belli, açık ve sonlu adımlar dizisi", "Girdi → işlem → çıktı", "Özellikler: başlangıç-bitiş, açıklık, sonluluk, sıralılık, etkinlik", "Derleyici kaynak kodu makine diline çevirir"]
  });
  D.sorular.push(
    { id: "a1-01", k: 1, z: 1, tip: "mc", b: "tanim", s: "Algoritma kavramının en doğru tanımı hangisidir?", o: ["Bilgisayarın donanım parçalarının listesi", "Bir problemi çözmek için izlenen sırası belli, açık ve sonlu adımlar dizisi", "Yalnızca C dilinde yazılmış kodlar", "Bilgisayarın ekrana yazdığı sonuç", "Rastgele sırayla yapılan işlemler"], c: 1, y: { 0: "Donanım fiziksel parçalardır; algoritma ise bir çözüm yöntemidir.", 2: "Algoritma herhangi bir dile bağlı değildir; Türkçe adımlarla da yazılabilir.", 3: "Ekrana yazılan sonuç çıktıdır, algoritmanın kendisi değil.", 4: "Algoritmada sıra rastgele olamaz." }, a: "Algoritma dile bağlı değildir; bir problemi çözen sıralı, açık ve sonlu adımlardır." },
    { id: "a1-02", k: 1, z: 1, tip: "dy", b: "ozellik", s: "Bir algoritmanın adım sayısı sonsuz olabilir.", c: false, a: "Yanlış. Sonluluk özelliğine göre algoritma sonlu sayıda adımdan sonra mutlaka bitmelidir." },
    { id: "a1-03", k: 1, z: 1, tip: "mc", b: "girdi-cikti", s: "Bir dikdörtgenin alanını hesaplayan algoritmada <b>girdiler</b> hangileridir?", o: ["Alan", "Kısa ve uzun kenar uzunlukları", "Çarpma işlemi", "Ekrana yazdırma", "Dur adımı"], c: 1, y: { 0: "Alan hesaplanıp kullanıcıya verilen sonuçtur; yani çıktıdır.", 2: "Çarpma bir işlemdir, girdi değil." }, a: "Kenar uzunlukları dışarıdan alınır (girdi), alan = kısa × uzun hesaplanır (işlem), alan yazdırılır (çıktı)." },
    { id: "a1-04", k: 1, z: 1, tip: "bosluk", b: "terim", s: "Programcının bir programlama diliyle yazdığı, insanın okuyabildiği komutlar bütününe ______ kod denir.", c: ["kaynak"], a: "Kaynak kod; derleyici tarafından makine diline çevrilir." },
    { id: "a1-05", k: 1, z: 2, tip: "mc", b: "ozellik", s: "\"Hamura biraz un ekleyin\" adımı algoritmanın hangi özelliğine aykırıdır?", o: ["Sonluluk", "Açıklık (kesinlik)", "Başlangıç", "Sıralılık", "Etkinlik"], c: 1, y: { 0: "Adım sonsuza kadar sürmüyor; sorun ölçünün belirsiz olması.", 3: "Sıra bozulmuyor; adımın kendisi belirsiz." }, a: "'Biraz' herkese göre farklıdır. Her adım tek ve kesin anlama gelmelidir." },
    { id: "a1-06", k: 1, z: 2, tip: "sira", b: "siralama", s: "İki sayının ortalamasını bulan algoritmanın adımlarını doğru sıraya koy.", o: ["Başla", "A ve B'yi oku", "T = A + B", "O = T / 2", "O'yu yaz", "Dur"], a: "Önce veri okunur, sonra hesaplanır, en son yazdırılır. Ortalama toplamdan önce hesaplanamaz." },
    { id: "a1-07", k: 1, z: 2, tip: "mc", b: "terim", s: "Derleyicinin (compiler) görevi nedir?", o: ["Kaynak kodu makine diline çevirmek", "Bilgisayarı kapatıp açmak", "Algoritmayı kâğıda çizmek", "Ekrana resim çizmek", "İnterneti bağlamak"], c: 0, a: "Derleyici, yazdığın kaynak kodu bilgisayarın anladığı 0 ve 1'lerden oluşan makine diline çevirir." },
    { id: "a1-08", k: 1, z: 2, tip: "dy", b: "tanim", s: "Aynı problem için birden fazla doğru algoritma yazılabilir.", c: true, a: "Doğru. Bir yere farklı yollardan gidilebildiği gibi bir problem de farklı adımlarla çözülebilir; önemli olan doğru sonuca ulaşmaktır." },
    { id: "a1-09", k: 1, z: 1, tip: "mc", b: "terim", s: "Bilgisayarın doğrudan anlayabildiği, 0 ve 1'lerden oluşan dil hangisidir?", o: ["Türkçe", "Sözde kod", "Makine dili", "C dili", "Akış şeması"], c: 2, y: { 3: "C bir yüksek seviyeli dildir; bilgisayar onu doğrudan değil, derlendikten sonra anlar." }, a: "Makine dili 0 ve 1'lerden oluşur; C gibi diller derleyiciyle bu dile çevrilir." },
    { id: "a1-10", k: 1, z: 3, tip: "hata", b: "girdi-cikti", s: "Aşağıdaki dikdörtgen alanı algoritmasında hangi adım <b>hiç okunmamış</b> bir değeri kullanıyor?", kod: K`1. Başla
2. Kısa kenar a'yı oku
3. Alan = a * b
4. Alan'ı yaz
5. Dur`, c: 3, a: "3. adımda b kullanılıyor ama b hiç okunmadı. 2. adım 'a ve b'yi oku' olmalıydı. Bir değişken kullanılmadan önce okunmalı ya da ona değer verilmelidir." },
    { id: "a1-11", k: 1, z: 3, tip: "mc", b: "ozellik", s: "Bir algoritma bazı girdilerde 'Dur' adımına hiç ulaşamıyor ve aynı adımları sonsuza dek tekrarlıyor. Hangi özellik ihlal edilmiştir?", o: ["Açıklık", "Sıralılık", "Sonluluk", "Girdi", "Etkinlik"], c: 2, y: { 0: "Adımların her biri açık olabilir; sorun bitmemesi.", 1: "Sıra doğru olsa bile algoritma bitmiyor." }, a: "Sonlu sayıda adımda bitmeyen bir yapı algoritma değildir; sonluluk ihlal edilmiştir." },
    { id: "a1-12", k: 1, z: 2, tip: "klasik", b: "algoritma-yazma", s: "Bir ürünün KDV dahil fiyatını hesaplayan algoritmayı adım adım yazınız. (KDV oranı %20)", model: K`1. Başla
2. Fiyat'ı oku
3. KDV = Fiyat * 0.20
4. Toplam = Fiyat + KDV
5. Toplam'ı yaz
6. Dur`, olcut: ["Başla ve Dur adımları var", "Fiyat girdi olarak okunuyor", "KDV doğru hesaplanıyor (Fiyat × 0,20)", "Toplam = Fiyat + KDV ya da Fiyat × 1,20", "Sonuç yazdırılıyor"], a: "Toplam = Fiyat * 1.20 tek adımda da yazılabilir; önemli olan girdi → işlem → çıktı sırasının doğru olması." },
    { id: "a1-13", k: 1, z: 2, tip: "mc", b: "girdi-cikti", s: "Bir öğrencinin vize ve final notlarıyla ortalamasını hesaplayan algoritmada aşağıdakilerden hangisi <b>işlem</b> adımıdır?", o: ["Vize notunu oku", "Final notunu oku", "Ortalama = Vize * 0.4 + Final * 0.6", "Ortalamayı yaz", "Dur"], c: 2, y: { 0: "Okuma adımları girdidir.", 3: "Yazdırma çıktıdır." }, a: "Hesaplama yapan adım işlemdir; okuma girdi, yazdırma çıktıdır." },
    { id: "a1-14", k: 1, z: 3, tip: "mc", b: "siralama", s: "Aşağıdaki adımlardan hangisi yanlış yerde olduğu için algoritma doğru sonuç vermez?<br><br>1. Başla · 2. T = A + B · 3. A ve B'yi oku · 4. T'yi yaz · 5. Dur", o: ["1. adım", "2. adım", "4. adım", "5. adım", "Hiçbiri, algoritma doğru"], c: 1, y: { 4: "A ve B okunmadan toplanamaz; sıra bozuk." }, a: "Toplama (2. adım), A ve B okunmadan yapılıyor. Okuma adımı toplamadan önce gelmelidir." }
  );

  /* ------------------------------------------------------------------ 2 */
  D.konular.push({
    no: 2, ad: "Algoritma oluşturma teknikleri", kisa: "Algoritma oluşturma", sinav: "vize",
    hedef: ["Problemi analiz edip adımlara bölmek", "Değişkenle algoritma yazmak (S = S + i mantığı)", "Karar ve 'git' adımlarını kullanmak", "Bir algoritmayı adım adım izlemek (iz tablosu)"],
    anlat: [
      { t: "p", h: "Bir problemi çözmeye doğrudan kod yazarak başlanmaz. Önce problem <b>analiz edilir</b>, sonra çözüm adımlara bölünür. Bunun için üç soru sorulur:" },
      { t: "tablo", b: ["Soru", "Ortalama problemi için cevap"], r: [["Ne isteniyor? (çıktı)", "Üç sayının ortalaması"], ["Elimde ne var? (girdi)", "Üç sayı: A, B, C"], ["Nasıl bulurum? (işlem)", "T = A + B + C, O = T / 3"]] },
      { t: "p", h: "<b>Değişken</b>, içine değer konan ve değeri değişebilen bir kutudur. <code>S = S + 5</code> ifadesi matematikteki gibi bir eşitlik değildir; '<b>S'nin eski değerine 5 ekle, sonucu yine S'ye koy</b>' demektir. Sağ taraf önce hesaplanır, sonra sola yazılır." },
      { t: "hayat", baslik: "Günlük hayattan: kumbara", h: "Kumbarada 20 TL var (S = 20). Her gün 5 TL atıyorsun: S = S + 5. Bir gün sonra 25, iki gün sonra 30 olur. Kumbara değişkendir; içindeki para her adımda güncellenir." },
      { t: "p", h: "Algoritmada karar vermek için <b>Eğer … ise … değilse …</b>, bir adımı tekrar etmek için de <b>'… adıma git'</b> ifadesi kullanılır." },
      { t: "adim", baslik: "Adım adım örnek · 1'den 5'e kadar sayıların toplamı", adimlar: [
        ["1. Başla", ""], ["2. S = 0, i = 1", "Toplam S sıfırdan başlar, sayaç i 1'den."],
        ["3. S = S + i", "İlk turda S = 0 + 1 = 1."],
        ["4. i = i + 1", "Sayaç bir artar: i = 2."],
        ["5. Eğer i <= 5 ise 3. adıma git", "i 5'i geçene kadar 3. ve 4. adımlar tekrar eder."],
        ["6. S'yi yaz", "Döngü bittiğinde S = 1+2+3+4+5 = 15 yazılır."], ["7. Dur", ""]] },
      { t: "tablo", baslik: "İz tablosu (her turda değişkenlerin değeri)", b: ["Tur", "i (başta)", "S = S + i", "i = i + 1", "i <= 5 ?"], r: [["1", "1", "1", "2", "Evet"], ["2", "2", "3", "3", "Evet"], ["3", "3", "6", "4", "Evet"], ["4", "4", "10", "5", "Evet"], ["5", "5", "15", "6", "Hayır → çık"]] },
      { t: "p", h: "<b>Sözde kod</b> (pseudo code), algoritmanın programlama diline benzer ama dil kurallarına bağlı olmayan, Türkçe/İngilizce karışık yazımıdır. Kod yazmadan önce mantığı kurmanı sağlar." },
      { t: "kontrol", s: "S = 7 iken <code>S = S * 2 + 1</code> çalışırsa S kaç olur?", o: ["7", "14", "15", "16"], c: 2, a: "Sağ taraf önce hesaplanır: 7 × 2 + 1 = 15. Sonuç S'ye yazılır." }
    ],
    alt: [
      { t: "p", h: "Algoritma kurmayı <b>yol tarifi</b> gibi düşün. Biri sana 'otogara nasıl giderim?' diye sorduğunda önce nerede olduğunu (girdi), nereye gitmek istediğini (çıktı) düşünürsün, sonra adımları sırayla söylersin." },
      { t: "p", h: "Değişkeni <b>bir defterin sayfası</b> gibi düşün. Sayfada 3 yazıyorsa ve 'üzerine 5 ekle' dersen, eski 3'ü silip 8 yazarsın. <code>S = S + 5</code> tam olarak budur." },
      { t: "tablo", baslik: "Adım adım takip: X = 2 ile başlıyoruz", b: ["Adım", "Komut", "X'in yeni değeri"], r: [["1", "X = 2", "2"], ["2", "X = X * 3", "6"], ["3", "X = X + 1", "7"], ["4", "X = X - 4", "3"]] },
      { t: "p", h: "'3. adıma git' demek, robota 'geri dön ve o işi yine yap' demektir. Bir şart koymazsan robot sonsuza kadar döner. Bu yüzden her 'git' bir 'Eğer' ile birlikte kullanılır." },
      { t: "kontrol", s: "S = 0, i = 1. Şu iki adım üç kez tekrar ediyor: S = S + i ve i = i + 1. Sonunda S kaçtır?", o: ["3", "6", "4", "1"], c: 1, a: "1. tur S = 1, i = 2 · 2. tur S = 3, i = 3 · 3. tur S = 6, i = 4. Sonuç 6." }
    ],
    ozet: ["Önce analiz: ne isteniyor, ne var, nasıl bulunur?", "S = S + x: eski değere ekle, yine S'ye yaz", "Karar: Eğer … ise … değilse", "Tekrar: '… adıma git' + şart", "İz tablosu ile algoritmayı takip et"]
  });
  D.sorular.push(
    { id: "a2-01", k: 2, z: 1, tip: "mc", b: "analiz", s: "Bir algoritma yazmadan önce ilk yapılması gereken nedir?", o: ["Hemen kod yazmak", "Problemi anlamak; neyin istendiğini ve hangi verilerin olduğunu belirlemek", "Akış şemasının renklerini seçmek", "Programı derlemek", "Çıktıyı ezberlemek"], c: 1, a: "Önce problem analiz edilir: ne isteniyor (çıktı), elimizde ne var (girdi), nasıl bulunur (işlem)." },
    { id: "a2-02", k: 2, z: 1, tip: "bosluk", b: "atama", s: "S'nin değeri 3 iken <code>S = S + 5</code> çalışırsa S'nin yeni değeri ______ olur.", c: ["8"], a: "Sağ taraf önce hesaplanır: 3 + 5 = 8, sonra S'ye yazılır." },
    { id: "a2-03", k: 2, z: 2, tip: "mc", b: "iz", s: "Aşağıdaki algoritma çalışınca ekrana ne yazılır?", kod: K`1. Başla
2. X = 2
3. X = X * 3
4. X = X + 1
5. X'i yaz
6. Dur`, o: ["2", "6", "7", "9", "3"], c: 2, y: { 1: "3. adımdan sonra X = 6 ama 4. adımda bir artıyor.", 3: "İşlemleri sırayla yap: önce çarpma (6), sonra +1." }, a: "X = 2 → X = 2 × 3 = 6 → X = 6 + 1 = 7." },
    { id: "a2-04", k: 2, z: 1, tip: "dy", b: "sozde-kod", s: "Sözde kod, belirli bir programlama dilinin yazım kurallarına birebir uymak zorundadır.", c: false, a: "Yanlış. Sözde kod dil kurallarına bağlı değildir; amacı mantığı sade biçimde göstermektir." },
    { id: "a2-05", k: 2, z: 2, tip: "sira", b: "karar", s: "Girilen iki sayıdan büyüğünü yazan algoritmanın adımlarını sırala.", o: ["Başla", "A ve B'yi oku", "Eğer A > B ise A'yı yaz", "Değilse B'yi yaz", "Dur"], a: "Karşılaştırma okumadan sonra yapılır; 'değilse' kısmı 'eğer'den hemen sonra gelir." },
    { id: "a2-06", k: 2, z: 2, tip: "mc", b: "iz", s: "Aşağıdaki algoritmanın çıktısı nedir?", kod: K`1. Başla
2. S = 0, i = 1
3. S = S + i
4. i = i + 2
5. Eğer i <= 7 ise 3. adıma git
6. S'yi yaz
7. Dur`, o: ["7", "16", "28", "9", "12"], c: 1, y: { 2: "i ikişer artıyor; yalnızca 1, 3, 5, 7 toplanır.", 4: "7 de toplama dahildir çünkü şart i <= 7." }, a: "i = 1, 3, 5, 7 değerlerini alır: 1 + 3 + 5 + 7 = 16. i = 9 olunca şart sağlanmaz." },
    { id: "a2-07", k: 2, z: 3, tip: "mc", b: "takas", s: "Aşağıdaki algoritmadan sonra A ve B'nin değerleri nedir?", kod: K`1. Başla
2. A = 10, B = 4
3. C = A
4. A = B
5. B = C
6. A ve B'yi yaz
7. Dur`, o: ["A = 10, B = 4", "A = 4, B = 10", "A = 4, B = 4", "A = 10, B = 10", "A = 4, B = 14"], c: 1, y: { 2: "C, A'nın eski değerini (10) sakladığı için B = C ile B 10 olur.", 3: "A = B satırından sonra A 4 olur." }, a: "C yardımcı değişkendir: C = 10, A = 4, B = 10. İki değişkenin değeri yer değiştirdi (takas)." },
    { id: "a2-08", k: 2, z: 2, tip: "hata", b: "analiz", s: "Üç sayının ortalamasını bulması gereken algoritmada hangi satır hatalı?", kod: K`1. Başla
2. A, B ve C'yi oku
3. T = A + B + C
4. O = T / 2
5. O'yu yaz
6. Dur`, c: 4, a: "Üç sayının ortalaması için toplam 3'e bölünmelidir: O = T / 3." },
    { id: "a2-09", k: 2, z: 2, tip: "mc", b: "karar", s: "<code>Eğer N MOD 2 = 0 ise 'Çift' yaz, değilse 'Tek' yaz</code> adımında N = 7 girilirse ne yazılır? (MOD: bölümden kalan)", o: ["Çift", "Tek", "3", "1", "Hiçbir şey"], c: 1, y: { 3: "7 MOD 2 = 1'dir ama ekrana kalan değil, karar sonucu yazılır." }, a: "7 MOD 2 = 1 olduğu için şart sağlanmaz, 'değilse' kısmı çalışır: Tek." },
    { id: "a2-10", k: 2, z: 2, tip: "bosluk", b: "dongu-adim", s: "Algoritmada bir adımı tekrar çalıştırmak için \"3. adıma ______\" ifadesi kullanılır.", c: ["git", "dön", "don"], a: "'… adıma git' ifadesi, şartla birlikte kullanılarak tekrar (döngü) oluşturur." },
    { id: "a2-11", k: 2, z: 3, tip: "klasik", b: "algoritma-yazma", s: "Klavyeden girilen bir sayının pozitif, negatif ya da sıfır olduğunu ekrana yazan algoritmayı yazınız.", model: K`1. Başla
2. N'yi oku
3. Eğer N > 0 ise "Pozitif" yaz, 6. adıma git
4. Eğer N < 0 ise "Negatif" yaz, 6. adıma git
5. "Sıfır" yaz
6. Dur`, olcut: ["Sayı okunuyor", "N > 0 durumu kontrol ediliyor", "N < 0 durumu kontrol ediliyor", "Sıfır durumu ayrıca ele alınıyor", "Her durumda yalnızca bir mesaj yazılıyor (6. adıma git)"], a: "Üç durum vardır; iki şart kontrol edilir, ikisi de sağlanmazsa sayı sıfırdır." },
    { id: "a2-12", k: 2, z: 2, tip: "dy", b: "atama", s: "Bir değişken algoritmada kullanılmadan önce ona bir değer verilmeli ya da okunmalıdır.", c: true, a: "Doğru. Değeri olmayan bir değişkenle hesap yapılamaz; S = 0 gibi ilk değer verilir ya da kullanıcıdan okunur." },
    { id: "a2-13", k: 2, z: 3, tip: "mc", b: "iz", s: "Aşağıdaki algoritmanın çıktısı nedir?", kod: K`1. Başla
2. S = 1, i = 1
3. S = S * 2
4. i = i + 1
5. Eğer i <= 4 ise 3. adıma git
6. S'yi yaz
7. Dur`, o: ["8", "16", "32", "4", "2"], c: 1, y: { 0: "Döngü 4 kez döner (i = 1, 2, 3, 4).", 2: "i = 5 olunca döngü biter; 5. kez çarpılmaz." }, a: "Döngü i = 1, 2, 3, 4 için dört kez çalışır: S = 2, 4, 8, 16." },
    { id: "a2-14", k: 2, z: 1, tip: "mc", b: "atama", s: "<code>T = T + 1</code> ifadesi ne anlama gelir?", o: ["T, T+1'e eşittir (matematiksel eşitlik)", "T'nin eski değerine 1 ekle, sonucu yine T'ye yaz", "T'yi sıfırla", "T'yi ekrana yaz", "Hiçbir anlamı yoktur, hatalıdır"], c: 1, y: { 0: "Algoritmada '=' eşitlik değil, atamadır." }, a: "Atama ifadesinde önce sağ taraf hesaplanır, sonra soldaki değişkene yazılır." }
  );

  /* ------------------------------------------------------------------ 3 */
  D.konular.push({
    no: 3, ad: "Akış şemaları", kisa: "Akış şemaları", sinav: "vize",
    hedef: ["Akış şeması sembollerini tanımak", "Akış şemasını takip ederek çıktıyı bulmak", "Karar ve döngü içeren akış şemalarını yorumlamak"],
    anlat: [
      { t: "p", h: "Akış şeması, algoritmanın <b>şekillerle çizilmiş hâlidir</b>. Her şeklin bir anlamı vardır; oklar akışın yönünü gösterir. Kod yazmadan önce mantığı görmeyi kolaylaştırır." },
      { t: "semboller" },
      { t: "p", h: "Sınavda en çok karıştırılanlar: <b>paralelkenar = giriş</b>, <b>dikdörtgen = işlem</b>, <b>eşkenar dörtgen (baklava) = karar</b>, <b>altı dalgalı belge = ekrana çıktı</b>, <b>altıgen = döngü</b>." },
      { t: "akis", baslik: "Örnek · İki sayıdan büyüğünü yazdırma", akis: [{ k: "bas" }, { k: "gir", m: "X, Y" }, { k: "kos", m: "X > Y ?", yan: "Y yaz" }, { k: "cik", m: "X yaz" }, { k: "son" }] },
      { t: "adim", baslik: "Bu şemayı takip edelim (X = 5, Y = 3)", adimlar: [["Başla", ""], ["X, Y okunur", "X = 5, Y = 3"], ["X > Y ?", "5 > 3 doğru → Evet koluna (aşağı) gidilir."], ["X yaz", "Ekrana 5 yazılır."], ["Dur", "X = 2, Y = 9 olsaydı Hayır koluna gidip 9 yazılırdı."]] },
      { t: "akis", baslik: "Döngülü örnek · 1'den N'e kadar toplam", akis: [{ k: "bas" }, { k: "gir", m: "N" }, { k: "isl", m: "S = 0 , i = 1" }, { k: "kos", m: "i <= N ?", yan: "S yaz → Dur" }, { k: "isl", m: "S = S + i" }, { k: "isl", m: "i = i + 1", geri: 3 }] },
      { t: "p", h: "Karar sembolünden <b>iki ok</b> çıkar (Evet/Hayır). Döngülerde ok, işlem bittikten sonra koşula <b>geri döner</b>; koşul yanlış olduğunda döngüden çıkılır." },
      { t: "kontrol", s: "Kullanıcıdan veri alındığını gösteren sembol hangisidir?", o: ["Dikdörtgen", "Paralelkenar", "Eşkenar dörtgen", "Oval"], c: 1, a: "Paralelkenar giriş sembolüdür. Dikdörtgen işlem, eşkenar dörtgen karar, oval başla/dur." }
    ],
    alt: [
      { t: "p", h: "Akış şemasını bir <b>metro haritası</b> gibi düşün. Duraklar şekillerdir, raylar oklardır. Trende oturup oku takip ettiğin sürece nereye varacağını bilirsin." },
      { t: "tablo", baslik: "Şekilleri işleriyle ezberle", b: ["Şekil", "Hatırlatıcı", "Görevi"], r: [["Oval", "Kapı", "Başla / Dur"], ["Paralelkenar", "Eğik giriş kapısı", "Veri girişi (oku)"], ["Dikdörtgen", "Hesap makinesi", "İşlem, atama"], ["Baklava", "Yol ayrımı tabelası", "Karar (Evet / Hayır)"], ["Belge (dalgalı alt)", "Yazıcıdan çıkan kâğıt", "Ekrana yazdır"], ["Altıgen", "Dönme dolap", "Döngü"]] },
      { t: "p", h: "Karar şeklinde <b>yol ayrımına</b> gelirsin. Sorunun cevabı 'Evet' ise bir yöne, 'Hayır' ise diğer yöne gidersin. Takip ederken her değişkenin değerini bir kenara yazmayı unutma." },
      { t: "akis", baslik: "Örnek · Sayı çift mi tek mi?", akis: [{ k: "bas" }, { k: "gir", m: "N" }, { k: "kos", m: "N % 2 == 0 ?", yan: "\"Tek\" yaz" }, { k: "cik", m: "\"Çift\" yaz" }, { k: "son" }] },
      { t: "kontrol", s: "Yukarıdaki şemada N = 9 girilirse ne yazılır?", o: ["Çift", "Tek", "9", "1"], c: 1, a: "9 % 2 = 1, yani 0 değil. Hayır koluna gidilir ve 'Tek' yazılır." }
    ],
    ozet: ["Oval: başla/dur · Paralelkenar: giriş · Dikdörtgen: işlem", "Baklava: karar (Evet/Hayır) · Belge: çıktı · Altıgen: döngü", "Döngüde ok koşula geri döner", "Takip ederken değişkenleri not et"]
  });
  D.sorular.push(
    { id: "a3-01", k: 3, z: 1, tip: "mc", b: "sembol", s: "Akış şemasında <b>karar verme</b> (Evet/Hayır) için hangi sembol kullanılır?", o: ["Oval", "Dikdörtgen", "Eşkenar dörtgen (baklava)", "Paralelkenar", "Altıgen"], c: 2, y: { 1: "Dikdörtgen işlem (hesap, atama) içindir.", 3: "Paralelkenar veri girişi içindir.", 4: "Altıgen döngü sembolüdür." }, a: "Karar sembolü eşkenar dörtgendir; içinden Evet ve Hayır olmak üzere iki ok çıkar." },
    { id: "a3-02", k: 3, z: 1, tip: "mc", b: "sembol", s: "Akış şemasında <b>S = S + i</b> gibi bir hesaplama hangi sembolün içine yazılır?", o: ["Oval", "Dikdörtgen", "Paralelkenar", "Eşkenar dörtgen", "Belge"], c: 1, y: { 2: "Paralelkenar, kullanıcıdan veri girişi içindir." }, a: "Değişkene değer atama ve hesaplama dikdörtgen (işlem) sembolüyle gösterilir." },
    { id: "a3-03", k: 3, z: 1, tip: "dy", b: "sembol", s: "Akış şemasında Başla ve Dur sembolü ovaldir.", c: true, a: "Doğru. Başla en üstte, Dur en altta yer alır ve ikisi de oval çizilir." },
    { id: "a3-04", k: 3, z: 2, tip: "akis", b: "akis-izleme", s: "Aşağıdaki akış şemasına X = 4 ve Y = 11 girilirse ekrana ne yazılır?", akis: [{ k: "bas" }, { k: "gir", m: "X, Y" }, { k: "kos", m: "X > Y ?", yan: "Y yaz" }, { k: "cik", m: "X yaz" }, { k: "son" }], o: ["4", "11", "15", "Hiçbir şey", "4 ve 11"], c: 1, y: { 0: "4 > 11 yanlıştır; Hayır koluna gidilir." }, a: "4 > 11 yanlış olduğu için Hayır kolu çalışır ve Y = 11 yazılır." },
    { id: "a3-05", k: 3, z: 2, tip: "akis", b: "akis-dongu", s: "Aşağıdaki şemaya N = 4 girilirse ekrana yazılan S kaçtır?", akis: [{ k: "bas" }, { k: "gir", m: "N" }, { k: "isl", m: "S = 0 , i = 1" }, { k: "kos", m: "i <= N ?", yan: "S yaz → Dur" }, { k: "isl", m: "S = S + i" }, { k: "isl", m: "i = i + 1", geri: 3 }], o: ["4", "6", "10", "15", "5"], c: 2, y: { 1: "i = 4 de şartı sağlar (4 <= 4); 4 de eklenir." }, a: "i = 1, 2, 3, 4 için S = 1 + 2 + 3 + 4 = 10. i = 5 olunca Hayır koluna gidilip S yazılır." },
    { id: "a3-06", k: 3, z: 2, tip: "akis", b: "akis-dongu", s: "Aşağıdaki şema X = 3, N = 4 ile çalışırsa ekrana ne yazılır?", akis: [{ k: "bas" }, { k: "gir", m: "X, N" }, { k: "isl", m: "S = 1 , i = 1" }, { k: "kos", m: "i <= N ?", yan: "S yaz → Dur" }, { k: "isl", m: "S = S * X" }, { k: "isl", m: "i = i + 1", geri: 3 }], o: ["12", "27", "81", "64", "243"], c: 2, y: { 0: "S, X ile çarpılıyor (üs alma); 3 × 4 değil 3⁴ hesaplanır.", 1: "Döngü 4 kez döner, 3 kez değil." }, a: "Bu şema X üzeri N'yi hesaplar: 3 × 3 × 3 × 3 = 81." },
    { id: "a3-07", k: 3, z: 1, tip: "bosluk", b: "sembol", s: "Kullanıcıdan veri girişi beklendiğini gösteren akış şeması sembolü ______'dır.", c: ["paralelkenar", "paralel kenar"], a: "Paralelkenar giriş sembolüdür." },
    { id: "a3-08", k: 3, z: 2, tip: "mc", b: "sembol", s: "Ekrana çıktı vermek (yazdırmak) için kitaptaki akış şemalarında hangi sembol kullanılır?", o: ["Altıgen", "Alt kenarı dalgalı belge şekli", "Oval", "Eşkenar dörtgen", "Daire"], c: 1, y: { 0: "Altıgen döngü sembolüdür." }, a: "Gösterim (çıktı) sembolü alt kenarı dalgalı belge şeklidir." },
    { id: "a3-09", k: 3, z: 3, tip: "akis", b: "akis-izleme", s: "Aşağıdaki şemaya Gelir = 500, Gider = 500 girilirse ekrana ne yazılır?", akis: [{ k: "bas" }, { k: "gir", m: "Gelir, Gider" }, { k: "kos", m: "Gelir > Gider ?", yan: "Bir alt karara git" }, { k: "cik", m: "\"Kâr\" yaz" }, { k: "son" }], ek: "Bir alt karar: <b>Gelir < Gider ?</b> Evet → \"Zarar\" yaz, Hayır → \"Başabaş\" yaz.", o: ["Kâr", "Zarar", "Başabaş", "500", "Hiçbir şey"], c: 2, y: { 0: "500 > 500 yanlıştır (eşitler).", 1: "500 < 500 de yanlıştır." }, a: "Gelir gidere eşit olduğu için iki şart da yanlıştır; 'Başabaş' yazılır." },
    { id: "a3-10", k: 3, z: 2, tip: "sira", b: "akis-izleme", s: "1'den N'e kadar toplamı bulan akış şemasının sembollerini yukarıdan aşağıya sırala.", o: ["Başla (oval)", "N'yi oku (paralelkenar)", "S = 0, i = 1 (dikdörtgen)", "i <= N ? (baklava)", "S = S + i, i = i + 1 (dikdörtgen)", "S'yi yaz (belge)", "Dur (oval)"], a: "Başla → giriş → ilk değerler → koşul → döngü gövdesi (geri dönüş) → koşul yanlışsa çıktı → Dur." },
    { id: "a3-11", k: 3, z: 3, tip: "mc", b: "akis-dongu", s: "Bir döngülü akış şemasında koşul her zaman 'Evet' çıkıyor ve hiç 'Hayır' koluna gidilmiyor. Ne olur?", o: ["Program hemen biter", "Sonsuz döngü oluşur", "Hayır kolu otomatik çalışır", "Şema geçersiz olur ama doğru sonuç verir", "Yalnızca bir kez döner"], c: 1, a: "Koşul hiç yanlış olmazsa döngüden çıkılamaz; sonsuz döngü oluşur. Bu yüzden döngü değişkeni (i = i + 1) mutlaka güncellenmelidir." },
    { id: "a3-12", k: 3, z: 3, tip: "klasik", b: "akis-cizme", s: "Klavyeden girilen vize ve final notuna göre ortalamayı (vize × 0,4 + final × 0,6) hesaplayan; ortalama 50 ve üzeriyse \"Geçti\", değilse \"Kaldı\" yazan akış şemasının sembollerini sırasıyla yazınız.", model: K`Başla (oval)
→ vize, final oku (paralelkenar)
→ ort = vize*0.4 + final*0.6 (dikdörtgen)
→ ort >= 50 ? (baklava)
   Evet → "Geçti" yaz (belge)
   Hayır → "Kaldı" yaz (belge)
→ Dur (oval)`, olcut: ["Başla/Dur oval", "Giriş paralelkenar içinde", "Ortalama dikdörtgende doğru formülle", "Karar baklavada, şart ort >= 50", "İki çıkış kolu da belge şekliyle yazdırılıyor"], a: "Sınavda sembolün doğru şekli ve okların yönü puanlanır; Evet/Hayır kollarını yazmayı unutma." },
    { id: "a3-13", k: 3, z: 2, tip: "dy", b: "akis-dongu", s: "Akış şemasında karar sembolünden yalnızca bir ok çıkar.", c: false, a: "Yanlış. Karar sembolünden iki ok çıkar: Evet ve Hayır." }
  );

  /* ------------------------------------------------------------------ 4 */
  D.konular.push({
    no: 4, ad: "Değişkenler ve veri türleri", kisa: "Değişkenler", sinav: "vize",
    hedef: ["C'deki temel veri tiplerini ve bellek boyutlarını bilmek", "Doğru ve hatalı değişken adlarını ayırt etmek", "Değişken tanımlayıp ilk değer vermek", "const ile sabit tanımlamak"],
    anlat: [
      { t: "p", h: "Program; sayılar, harfler ve metinlerle çalışır. Bu verileri bellekte tutmak için <b>değişken</b> kullanırız. C'de bir değişken kullanmadan önce <b>tipi ve adıyla tanımlanmalıdır</b>." },
      { t: "kod", ad: "Genel yazılış", k: K`veri_tipi degisken_adi;
veri_tipi degisken_adi = ilk_deger;

int yas = 20;
float ortalama = 72.5;
char harf = 'K';
int a = 2, b = 3, sonuc;` },
      { t: "tablo", baslik: "Temel veri tipleri", b: ["Tip", "Ne tutar?", "Bellek", "Örnek"], r: [["char", "Tek karakter", "1 bayt", "'A'"], ["int", "Tamsayı", "4 bayt", "25, -7"], ["float", "Ondalıklı (≈7 basamak)", "4 bayt", "3.14"], ["double", "Hassas ondalıklı (≈15 basamak)", "8 bayt", "3.14159265"], ["short int", "Küçük tamsayı", "2 bayt", "1200"], ["long int", "Büyük tamsayı", "8 bayt", "9000000000"]] },
      { t: "hayat", baslik: "Günlük hayattan: dolap gözleri", h: "Bellek bir dolap, değişkenler dolabın gözleri gibidir. Her göze üstüne bir etiket (ad) yapıştırır, içine ne koyacağını (tip) baştan söylersin: küçük göz (char) tek bir harf alır, büyük göz (double) hassas bir ondalıklı sayı. Yanlış göze yanlış eşya koyarsan bir kısmı sığmaz; ondalıklı bir sayıyı int'e koyarsan virgülden sonrası kaybolur." },
      { t: "tablo", baslik: "Değişken adı kuralları", b: ["Kural", "Doğru", "Yanlış"], r: [["Boşluk olmaz", "ogrenci_no", "ogrenci no"], ["Harf veya _ ile başlar, rakamla başlamaz", "sayi1", "1sayi"], ["Anahtar kelime olamaz", "toplam", "int, for, if"], ["Sadece harf, rakam ve _", "a_3", "a-3, ad%"], ["Türkçe karakter yok", "ogrenci", "öğrenci"]] },
      { t: "p", h: "C <b>büyük-küçük harfe duyarlıdır</b>: <code>sayi</code> ile <code>Sayi</code> iki farklı değişkendir. Değeri hiç değişmeyecek veriler için <code>const</code> kullanılır: <code>const float PI = 3.14;</code> Bu değer program boyunca değiştirilemez." },
      { t: "tablo", baslik: "Biçim belirteçleri (printf / scanf)", b: ["Tip", "Belirteç"], r: [["int", "%d"], ["float", "%f"], ["double", "%lf (scanf'te)"], ["char", "%c"], ["metin (char dizisi)", "%s"]] },
      { t: "kontrol", s: "Aşağıdakilerden hangisi geçerli bir değişken adıdır?", o: ["2not", "ogrenci_no", "float", "ad soyad"], c: 1, a: "Rakamla başlayamaz (2not), anahtar kelime olamaz (float), boşluk içeremez (ad soyad)." }
    ],
    alt: [
      { t: "p", h: "Değişkeni <b>etiketli bir kavanoz</b> gibi düşün. Kavanozun üstündeki etiket değişkenin adı, kavanozun türü de veri tipidir: tuz kavanozuna (int) tam sayılar, baharatlığa (float) ondalıklı sayılar, tek bir harf için küçük bir şişe (char)." },
      { t: "tablo", baslik: "Hangi veriye hangi tip?", b: ["Veri", "Uygun tip", "Neden?"], r: [["Öğrenci sayısı: 45", "int", "Tam sayı, virgül yok"], ["Not ortalaması: 72,5", "float", "Ondalıklı"], ["Harf notu: A", "char", "Tek karakter"], ["Ad: Elif", "char ad[30]", "Birden fazla karakter (metin)"], ["π sayısı", "const float", "Hiç değişmez"]] },
      { t: "p", h: "Etiket yazarken dikkat: boşluk bırakamazsın (yerine _ kullan), rakamla başlayamazsın, Türkçe harf kullanamazsın ve C'nin kendi kelimelerini (int, if, for…) etiket yapamazsın." },
      { t: "kontrol", s: "Bir öğrencinin harf notunu (A, B, C…) tutmak için en uygun tip hangisidir?", o: ["int", "float", "char", "double"], c: 2, a: "Tek bir karakter char tipinde tutulur ve 1 bayt yer kaplar." }
    ],
    ozet: ["Tanım: tip ad = değer;", "char 1 · int 4 · float 4 · double 8 bayt", "Ad kuralları: boşluk yok, rakamla başlamaz, anahtar kelime yok, Türkçe karakter yok", "C büyük-küçük harfe duyarlı · const = değişmeyen sabit", "%d int · %f float · %c char · %s metin"]
  });
  D.sorular.push(
    { id: "a4-01", k: 4, z: 1, tip: "mc", b: "veri-tipi", s: "C dilinde <b>float</b> veri tipi bellekte kaç bayt yer kaplar?", o: ["1", "2", "4", "8", "16"], c: 2, y: { 3: "8 bayt double'dır; float 4 bayttır." }, a: "float 4 bayt, double 8 bayttır. double daha hassastır." },
    { id: "a4-02", k: 4, z: 1, tip: "mc", b: "degisken-adi", s: "Aşağıdakilerden hangisi <b>geçerli</b> bir değişken adıdır?", o: ["2toplam", "ad soyad", "toplam_2", "int", "not%"], c: 2, y: { 0: "Değişken adı rakamla başlayamaz.", 1: "Değişken adında boşluk olmaz.", 3: "int bir anahtar kelimedir.", 4: "% gibi özel karakterler kullanılamaz." }, a: "toplam_2 harfle başlıyor; yalnızca harf, rakam ve alt çizgi içeriyor." },
    { id: "a4-03", k: 4, z: 1, tip: "dy", b: "buyuk-kucuk", s: "C dilinde <code>sayi</code> ve <code>Sayi</code> aynı değişkendir.", c: false, a: "Yanlış. C büyük-küçük harfe duyarlıdır; bunlar iki farklı değişkendir." },
    { id: "a4-04", k: 4, z: 2, tip: "mc", b: "veri-tipi", s: "Bir öğrencinin not ortalamasını (örneğin 72,5) tutmak için en uygun veri tipi hangisidir?", o: ["char", "int", "float", "short int", "unsigned char"], c: 2, y: { 1: "int ondalıklı kısmı tutamaz; 72,5 → 72 olur." }, a: "Ondalıklı değerler float (ya da daha hassas için double) ile tutulur." },
    { id: "a4-05", k: 4, z: 2, tip: "kod", b: "tanimlama", s: "π sayısını program boyunca değiştirilemeyen bir sabit olarak tanımlamak için boşluğa ne yazılmalıdır?", kod: K`___ float PI = 3.14;`, c: ["const"], a: "const ile tanımlanan değişkenin değeri program boyunca değiştirilemez." },
    { id: "a4-06", k: 4, z: 2, tip: "bosluk", b: "bicim", s: "printf ile bir <b>char</b> değişkeni yazdırmak için kullanılan biçim belirteci ______'dir.", c: ["%c"], a: "%d int, %f float, %c char, %s metin için kullanılır." },
    { id: "a4-07", k: 4, z: 2, tip: "hata", b: "degisken-adi", s: "Aşağıdaki tanımlardan hangisi derleme hatası verir?", kod: K`int sayi1 = 5;
float ortalama = 72.5;
int 2sayi = 10;
char harf = 'A';
double pi_degeri = 3.14159;`, c: 3, a: "Değişken adı rakamla başlayamaz: 2sayi geçersizdir. sayi2 ya da ikinci_sayi olmalıdır." },
    { id: "a4-08", k: 4, z: 3, tip: "mc", b: "veri-tipi", s: "<code>int x = 7.9;</code> satırından sonra x'in değeri nedir?", o: ["7.9", "8", "7", "0", "Derleme hatası"], c: 2, y: { 1: "C yuvarlamaz, ondalıklı kısmı keser.", 4: "C genellikle uyarı verip ondalık kısmı atar; hata vermez." }, a: "int ondalıklı kısmı tutamaz; virgülden sonrası kesilir (yuvarlanmaz): x = 7." },
    { id: "a4-09", k: 4, z: 1, tip: "mc", b: "veri-tipi", s: "char veri tipi bellekte kaç bayt yer kaplar?", o: ["1", "2", "4", "8", "Değişkene göre değişir"], c: 0, a: "char tek bir karakter tutar ve 1 bayttır." },
    { id: "a4-10", k: 4, z: 3, tip: "mc", b: "degisken-adi", s: "Aşağıdaki değişken adlarından kaç tanesi geçerlidir?<br><code>_toplam, öğrenci, sayi_1, for, a2b, ad-soyad</code>", o: ["1", "2", "3", "4", "5"], c: 2, y: { 3: "öğrenci Türkçe karakter içerdiği için kullanılmamalıdır." }, a: "Geçerli: _toplam, sayi_1, a2b (3 tane). öğrenci Türkçe karakter, for anahtar kelime, ad-soyad tire içerir." },
    { id: "a4-11", k: 4, z: 2, tip: "dy", b: "veri-tipi", s: "double tipi float'a göre daha hassastır ve bellekte daha fazla yer kaplar.", c: true, a: "Doğru. double 8 bayt ve yaklaşık 15 basamak, float 4 bayt ve yaklaşık 7 basamak hassasiyettedir." },
    { id: "a4-12", k: 4, z: 3, tip: "klasik", b: "tanimlama", s: "Bir öğrencinin adını (en fazla 30 karakter), yaşını, not ortalamasını ve harf notunu tutacak değişkenleri uygun veri tipleriyle tanımlayınız. Ayrıca geçme notunu (50) değiştirilemez bir sabit olarak tanımlayınız.", model: K`char ad[30];
int yas;
float ortalama;
char harfNotu;
const int GECME_NOTU = 50;`, olcut: ["Ad için char dizisi (char ad[30])", "Yaş için int", "Ortalama için float ya da double", "Harf notu için char", "Geçme notu const ile tanımlı", "Değişken adları kurallara uygun"], a: "Metin tek bir char değil, karakter dizisidir. Sabitlerin adı genellikle büyük harfle yazılır." },
    { id: "a4-13", k: 4, z: 2, tip: "mc", b: "anahtar-kelime", s: "Aşağıdakilerden hangisi C'de bir anahtar kelime <b>değildir</b>?", o: ["return", "while", "toplam", "double", "const"], c: 2, a: "toplam sıradan bir ad olabilir; diğerleri C'nin anahtar kelimeleridir ve değişken adı olamaz." }
  );
})();
