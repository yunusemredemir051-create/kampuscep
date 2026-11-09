/* SINAV KOÇUM · Algoritma — içerik (3/3: konu 9–11) */
(function () {
  var K = String.raw, D = window.KOC_DERS;

  /* ------------------------------------------------------------------ 9 */
  D.konular.push({
    no: 9, ad: "İç içe döngüler", kisa: "İç içe döngüler", sinav: "final",
    hedef: ["Dış ve iç döngünün çalışma sırasını anlamak", "Toplam tur sayısını hesaplamak", "Yıldız ve sayı desenlerinin çıktısını bulmak", "İstenen deseni üreten döngüyü yazmak"],
    anlat: [
      { t: "p", h: "Bir döngünün içinde başka bir döngü olabilir. <b>Dış döngünün her bir turunda iç döngü baştan sona tamamen çalışır.</b>" },
      { t: "hayat", baslik: "Günlük hayattan: saat", h: "Saatin akrebi dış döngü, yelkovanı iç döngüdür. Akrep 1 saat ilerlerken yelkovan 60 dakikanın hepsini dolaşır. Akrep 12 tur atarsa yelkovan toplam 12 × 60 = 720 kez ilerler." },
      { t: "kod", ad: "Örnek · Satır ve sütun", k: K`for (i = 1; i <= 3; i++)          /* dış: satır */
{
    for (j = 1; j <= 4; j++)      /* iç: sütun */
        printf("*");
    printf("\n");                 /* her satırdan sonra alt satır */
}
/* ****
   ****
   ****  → 3 satır, her satırda 4 yıldız, toplam 12 yıldız */` },
      { t: "p", h: "Toplam tur = <b>dış tur × iç tur</b> (iç döngü sabitse). İç döngünün sınırı dış değişkene bağlıysa (<code>j <= i</code>) her satırda farklı sayıda tekrar olur." },
      { t: "kod", ad: "Örnek · Üçgen desen (j <= i)", k: K`for (i = 1; i <= 4; i++)
{
    for (j = 1; j <= i; j++)
        printf("%d", j);
    printf("\n");
}
/* 1
   12
   123
   1234 */` },
      { t: "tablo", baslik: "Üçgen desende her satır", b: ["i", "j değerleri", "Yazılan"], r: [["1", "1", "1"], ["2", "1, 2", "12"], ["3", "1, 2, 3", "123"], ["4", "1, 2, 3, 4", "1234"]] },
      { t: "kontrol", s: "Dış döngü 5, iç döngü (sabit) 3 kez dönüyorsa iç döngünün gövdesi toplam kaç kez çalışır?", o: ["8", "15", "5", "3"], c: 1, a: "Dış döngünün her turunda iç döngü 3 kez döner: 5 × 3 = 15." }
    ],
    alt: [
      { t: "p", h: "İç içe döngüyü <b>sinema salonu</b> gibi düşün: dış döngü sıraları, iç döngü sıradaki koltukları gezer. 1. sıranın tüm koltuklarını bitirmeden 2. sıraya geçilmez." },
      { t: "tablo", baslik: "for (i=1;i<=2;i++) for (j=1;j<=3;j++) printf(\"%d%d \", i, j);", b: ["Sıra", "i", "j", "Ekrana"], r: [["1", "1", "1", "11"], ["2", "1", "2", "12"], ["3", "1", "3", "13"], ["4", "2", "1", "21"], ["5", "2", "2", "22"], ["6", "2", "3", "23"]] },
      { t: "p", h: "Desen sorularında önce <b>kaç satır</b> olduğuna (dış döngü), sonra <b>her satırda ne yazıldığına</b> (iç döngü) bak. \\n iç döngünün dışında ise her satır sonunda bir kez alt satıra geçilir." },
      { t: "kontrol", s: "Yukarıdaki tabloda printf toplam kaç kez çalıştı?", o: ["3", "5", "6", "2"], c: 2, a: "2 (dış) × 3 (iç) = 6." }
    ],
    ozet: ["Dış döngünün her turunda iç döngü baştan sona çalışır", "Toplam = dış tur × iç tur (iç sınır sabitse)", "j <= i → her satırda artan sayıda tekrar (üçgen)", "\\n iç döngünün dışında → satır sonu"]
  });
  D.sorular.push(
    { id: "a9-01", k: 9, z: 1, tip: "mc", b: "ic-ice-tur", s: "Aşağıdaki kodda printf kaç kez çalışır?", kod: K`for (i = 1; i <= 3; i++)
    for (j = 1; j <= 4; j++)
        printf("*");`, o: ["3", "4", "7", "12", "16"], c: 3, y: { 2: "Turlar toplanmaz, çarpılır." }, a: "3 × 4 = 12." },
    { id: "a9-02", k: 9, z: 2, tip: "cikti", b: "desen", s: "Aşağıdaki kodun çıktısını yaz.", kod: K`for (i = 1; i <= 3; i++)
{
    for (j = 1; j <= i; j++)
        printf("*");
    printf("\n");
}`, c: ["*\n**\n***"], a: "1. satırda 1, 2. satırda 2, 3. satırda 3 yıldız." },
    { id: "a9-03", k: 9, z: 2, tip: "mc", b: "ic-ice-tur", s: "Aşağıdaki kodda printf toplam kaç kez çalışır?", kod: K`for (i = 1; i <= 4; i++)
    for (j = 1; j <= i; j++)
        printf("%d", j);`, o: ["4", "8", "10", "16", "12"], c: 2, y: { 3: "İç döngü sabit değil; i'ye bağlı (1, 2, 3, 4 tur)." }, a: "1 + 2 + 3 + 4 = 10." },
    { id: "a9-04", k: 9, z: 3, tip: "cikti", b: "desen", s: "Aşağıdaki kodun çıktısını yaz.", kod: K`for (i = 3; i >= 1; i--)
{
    for (j = 1; j <= i; j++)
        printf("%d", j);
    printf("\n");
}`, c: ["123\n12\n1"], a: "i = 3: 123 · i = 2: 12 · i = 1: 1." },
    { id: "a9-05", k: 9, z: 2, tip: "dy", b: "ic-ice-sira", s: "İç içe döngülerde dış döngünün her turunda iç döngü baştan sona tamamen çalışır.", c: true, a: "Doğru. İç döngü bitmeden dış döngü bir sonraki tura geçmez." },
    { id: "a9-06", k: 9, z: 3, tip: "kod", b: "desen", s: "Aşağıdaki deseni üretmesi için iç döngünün şartını tamamla.<br><code>1<br>12<br>123<br>1234</code>", kod: K`for (i = 1; i <= 4; i++)
{
    for (j = 1; ___; j++)
        printf("%d", j);
    printf("\n");
}`, c: ["j<=i", "i>=j", "j<i+1"], a: "Her satırda 1'den satır numarasına kadar yazılır: j <= i." },
    { id: "a9-07", k: 9, z: 3, tip: "cikti", b: "ic-ice-cikti", s: "Aşağıdaki kodun çıktısı nedir?", kod: K`int i, j, s = 0;
for (i = 1; i <= 3; i++)
    for (j = 1; j <= 2; j++)
        s = s + i * j;
printf("%d", s);`, c: ["18"], a: "i = 1: 1 + 2 = 3 · i = 2: 2 + 4 = 6 · i = 3: 3 + 6 = 9 → 3 + 6 + 9 = 18." },
    { id: "a9-08", k: 9, z: 2, tip: "mc", b: "ic-ice-cikti", s: "Aşağıdaki kodun çıktısı hangisidir?", kod: K`for (i = 1; i <= 2; i++)
    for (j = 1; j <= 2; j++)
        printf("%d%d ", i, j);`, o: ["11 12 21 22", "11 21 12 22", "12 21", "11 22", "1 2 1 2"], c: 0, y: { 1: "Önce iç döngü (j) tamamlanır; i sabitken j değişir." }, a: "i = 1 iken j = 1, 2 → 11 12; i = 2 iken → 21 22." },
    { id: "a9-09", k: 9, z: 3, tip: "klasik", b: "program-yazma", s: "İç içe döngü kullanarak 1'den 5'e kadar çarpım tablosunu (1x1=1 … 5x5=25) satır satır yazdıran kodu yazınız.", model: K`#include <stdio.h>
main()
{
    int i, j;
    for (i = 1; i <= 5; i++)
    {
        for (j = 1; j <= 5; j++)
            printf("%dx%d=%d\t", i, j, i * j);
        printf("\n");
    }
}`, olcut: ["Dış döngü 1–5", "İç döngü 1–5", "i * j hesaplanıyor", "Her satır sonunda \\n (iç döngünün dışında)", "Biçim belirteçleri doğru (%d)"], a: "\\t sütunları hizalar; \\n iç döngünün dışında olmalıdır." },
    { id: "a9-10", k: 9, z: 1, tip: "mc", b: "ic-ice-sira", s: "Bir desende satır sayısını genellikle hangi döngü belirler?", o: ["İç döngü", "Dış döngü", "printf", "if", "scanf"], c: 1, a: "Dış döngü satırları, iç döngü bir satırdaki elemanları üretir." }
  );

  /* ------------------------------------------------------------------ 10 */
  D.konular.push({
    no: 10, ad: "Diziler", kisa: "Diziler", sinav: "final",
    hedef: ["Dizi tanımlamak ve indeksin 0'dan başladığını bilmek", "Döngüyle diziyi doldurmak ve dolaşmak", "Dizide toplam, ortalama, en büyük bulmak", "Karakter dizisini (metin) tanımak"],
    anlat: [
      { t: "p", h: "Aynı tipte çok sayıda veriyi tek bir adla tutmak için <b>dizi</b> kullanılır. 30 öğrencinin notu için 30 ayrı değişken yerine <code>int notlar[30];</code> yeterlidir." },
      { t: "kod", ad: "Tanım ve kullanım", k: K`int a[5] = {4, 7, 1, 9, 3};
/* indeks:   0  1  2  3  4  */
printf("%d", a[0]);    /* 4 : ilk eleman */
printf("%d", a[4]);    /* 3 : son eleman */
a[2] = 10;             /* 3. elemanı değiştir */` },
      { t: "hayat", baslik: "Günlük hayattan: apartman", h: "Dizi bir apartman, elemanlar dairelerdir. Daire numaraları <b>0'dan başlar</b>. 5 daireli bir apartmanda daireler 0, 1, 2, 3, 4'tür; 5 numaralı daire yoktur. <code>a[5]</code> yazmak olmayan bir daireye girmeye çalışmaktır." },
      { t: "kod", ad: "Döngüyle dolaşma · toplam ve en büyük", k: K`int a[5] = {4, 7, 1, 9, 3};
int i, toplam = 0, enb = a[0];
for (i = 0; i < 5; i++)
{
    toplam = toplam + a[i];
    if (a[i] > enb)
        enb = a[i];
}
printf("%d %d", toplam, enb);    /* 24 9 */` },
      { t: "adim", baslik: "En büyüğü bulma mantığı", adimlar: [["enb = a[0]", "İlk elemanı geçici olarak en büyük kabul et (4)."], ["Her elemanı karşılaştır", "7 > 4 → enb = 7 · 1 > 7 değil · 9 > 7 → enb = 9 · 3 > 9 değil."], ["Sonuç", "enb = 9. enb'yi 0 ile başlatmak, tüm elemanlar negatifse hatalı sonuç verir."]] },
      { t: "p", h: "Metinler de bir dizidir: <code>char ad[20] = \"Elif\";</code> Her harf bir elemandır (ad[0] = 'E') ve metnin sonunda görünmeyen bir bitiş karakteri <code>'\\0'</code> bulunur." },
      { t: "kontrol", s: "<code>int x[6];</code> dizisinin son elemanının indeksi kaçtır?", o: ["6", "5", "0", "7"], c: 1, a: "İndeks 0'dan başlar: 0, 1, 2, 3, 4, 5 → son indeks 5." }
    ],
    alt: [
      { t: "p", h: "Diziyi <b>yumurta kolisi</b> gibi düşün: tek bir koli (dizi adı), içinde sıralı gözler (elemanlar). Göz numaraları 0'dan başlar. Koliyi baştan sona gezmek için bir döngü kullanırsın; her turda bir göze bakarsın." },
      { t: "tablo", baslik: "int a[4] = {5, 2, 8, 6};", b: ["İfade", "Değer"], r: [["a[0]", "5"], ["a[3]", "6"], ["a[1] + a[2]", "10"], ["a[4]", "Yok! (dizi dışı)"]] },
      { t: "p", h: "Bir dizinin tüm elemanlarını gezen döngü hep aynıdır: <code>for (i = 0; i < boyut; i++)</code>. <b>i 0'dan başlar ve boyuttan küçükken</b> devam eder; <= yazarsan dizinin dışına taşarsın." },
      { t: "kontrol", s: "<code>int a[4] = {5, 2, 8, 6};</code> için <code>a[1] * a[3]</code> kaçtır?", o: ["30", "12", "16", "40"], c: 1, a: "a[1] = 2, a[3] = 6 → 12." }
    ],
    ozet: ["tip ad[boyut]; · indeks 0'dan başlar, son indeks boyut − 1", "Dolaşma: for (i = 0; i < boyut; i++)", "En büyük: enb = a[0] ile başla, karşılaştır", "Metin = char dizisi, sonunda '\\0'"]
  });
  D.sorular.push(
    { id: "a10-01", k: 10, z: 1, tip: "mc", b: "indeks", s: "<code>int a[5] = {4, 7, 1, 9, 3};</code> dizisinde <code>a[2]</code> kaçtır?", o: ["7", "1", "9", "4", "2"], c: 1, y: { 0: "İndeks 0'dan başlar; a[2] üçüncü elemandır." }, a: "a[0] = 4, a[1] = 7, a[2] = 1." },
    { id: "a10-02", k: 10, z: 1, tip: "dy", b: "indeks", s: "C dilinde dizilerin ilk elemanının indeksi 1'dir.", c: false, a: "Yanlış. İndeks 0'dan başlar." },
    { id: "a10-03", k: 10, z: 2, tip: "cikti", b: "dizi-dongu", s: "Aşağıdaki kodun çıktısı nedir?", kod: K`int a[4] = {2, 5, 3, 6};
int i, t = 0;
for (i = 0; i < 4; i++)
    t = t + a[i];
printf("%d", t);`, c: ["16"], a: "2 + 5 + 3 + 6 = 16." },
    { id: "a10-04", k: 10, z: 2, tip: "hata", b: "dizi-sinir", s: "5 elemanlı diziyi dolaşan kodda hangi satır dizinin dışına taşar?", kod: K`int a[5] = {1, 2, 3, 4, 5};
int i, t = 0;
for (i = 0; i <= 5; i++)
    t = t + a[i];
printf("%d", t);`, c: 3, a: "i <= 5 olduğunda a[5]'e erişilir; bu dizi dışıdır. i < 5 olmalıdır." },
    { id: "a10-05", k: 10, z: 3, tip: "kod", b: "en-buyuk", s: "Dizideki en büyük elemanı bulan kodda boşluğu doldur.", kod: K`int enb = a[0];
for (i = 1; i < 5; i++)
    if (a[i] ___ enb)
        enb = a[i];`, c: [">"], a: "Eleman mevcut en büyükten büyükse enb güncellenir." },
    { id: "a10-06", k: 10, z: 2, tip: "mc", b: "indeks", s: "<code>int x[10];</code> dizisinin son elemanına hangi ifadeyle erişilir?", o: ["x[10]", "x[9]", "x[0]", "x[11]", "x[-1]"], c: 1, y: { 0: "10 elemanlı dizide indeksler 0–9'dur." }, a: "Son indeks boyut − 1 = 9." },
    { id: "a10-07", k: 10, z: 3, tip: "cikti", b: "dizi-dongu", s: "Aşağıdaki kodun çıktısını yaz.", kod: K`int a[5] = {3, 8, 1, 6, 4};
int i;
for (i = 4; i >= 0; i -= 2)
    printf("%d ", a[i]);`, c: ["4 1 3", "4 1 3 "], a: "i = 4, 2, 0 → a[4] = 4, a[2] = 1, a[0] = 3." },
    { id: "a10-08", k: 10, z: 2, tip: "mc", b: "char-dizi", s: "<code>char ad[] = \"Ali\";</code> için <code>ad[1]</code> nedir?", o: ["'A'", "'l'", "'i'", "\"Ali\"", "'\\0'"], c: 1, a: "ad[0] = 'A', ad[1] = 'l', ad[2] = 'i', ad[3] = '\\0'." },
    { id: "a10-09", k: 10, z: 3, tip: "klasik", b: "program-yazma", s: "Klavyeden 5 öğrencinin notunu bir diziye okuyan, ortalamayı ve en yüksek notu yazdıran C programını yazınız.", model: K`#include <stdio.h>
main()
{
    int notlar[5], i, toplam = 0, enb;
    for (i = 0; i < 5; i++)
    {
        printf("%d. not: ", i + 1);
        scanf("%d", &notlar[i]);
        toplam = toplam + notlar[i];
    }
    enb = notlar[0];
    for (i = 1; i < 5; i++)
        if (notlar[i] > enb) enb = notlar[i];
    printf("Ortalama: %.2f\n", toplam / 5.0);
    printf("En yuksek: %d", enb);
}`, olcut: ["Dizi 5 elemanlı tanımlanmış", "Döngü 0'dan 4'e (i < 5), scanf'te &notlar[i]", "Toplam döngüde hesaplanıyor", "Ortalama ondalıklı (5.0 ile bölme)", "En büyük a[0]'dan başlayıp karşılaştırılıyor"], a: "toplam / 5 yazılırsa tamsayı bölmesi yapılır; 5.0 kullan." },
    { id: "a10-10", k: 10, z: 2, tip: "bosluk", b: "char-dizi", s: "C'de bir metnin (karakter dizisinin) sonunu belirten görünmez karakter ______'dır.", c: ["\\0", "'\\0'", "null", "nul"], a: "Metinler '\\0' (null) karakteriyle biter." }
  );

  /* ------------------------------------------------------------------ 11 */
  D.konular.push({
    no: 11, ad: "Algoritma problemleri ve uygulamalar", kisa: "Problemler", sinav: "final",
    hedef: ["Faktöriyel, asal sayı, basamak toplamı gibi klasik problemleri çözmek", "Problemi doğru kalıba (toplam, sayaç, bayrak, en büyük) oturtmak", "Kendi çözümünü test değerleriyle sınamak"],
    anlat: [
      { t: "p", h: "Sınavdaki problemlerin çoğu birkaç <b>kalıbın</b> birleşimidir. Kalıpları tanırsan yeni bir problemi parçalara ayırıp çözebilirsin." },
      { t: "tablo", baslik: "Problem çözme kalıpları", b: ["Kalıp", "Ne zaman?", "Başlangıç"], r: [["Toplam", "Değerleri biriktir", "t = 0; t += x;"], ["Çarpım", "Faktöriyel, üs", "c = 1; c *= x;"], ["Sayaç", "Kaç tane?", "say = 0; say++;"], ["En büyük / küçük", "Karşılaştır", "enb = ilk değer"], ["Bayrak", "Var mı / yok mu? (asal)", "asal = 1; bulursan asal = 0"], ["Basamak ayırma", "Rakamlar", "r = n % 10; n = n / 10;"]] },
      { t: "kod", ad: "Faktöriyel · N!", k: K`int n, i, f = 1;
scanf("%d", &n);
for (i = 1; i <= n; i++)
    f = f * i;
printf("%d! = %d", n, f);      /* 5! = 120 */` },
      { t: "kod", ad: "Asal mı? · bayrak kalıbı", k: K`int n, i, asal = 1;
scanf("%d", &n);
if (n < 2) asal = 0;
for (i = 2; i < n; i++)
    if (n % i == 0)
        asal = 0;              /* bir bölen bulundu */
if (asal) printf("Asal"); else printf("Asal degil");` },
      { t: "adim", baslik: "Basamak toplamı · n = 472", adimlar: [["r = n % 10", "472 % 10 = 2 → son basamak. t = 2"], ["n = n / 10", "472 / 10 = 47 (tamsayı bölmesi) → son basamak atıldı"], ["Tekrar", "47 % 10 = 7 → t = 9; n = 4"], ["Tekrar", "4 % 10 = 4 → t = 13; n = 0"], ["n == 0", "Döngü biter: while (n > 0). Sonuç 13."]] },
      { t: "p", h: "Çözümünü yazınca <b>küçük bir değerle elle dene</b>: n = 3 için faktöriyel 6 çıkıyor mu? 7 asal çıkıyor mu, 9 asal değil mi? Bu kontrol sınavda puan kaybını önler." },
      { t: "kontrol", s: "Bir sayının asal olup olmadığını bulurken 'asal = 1' ile başlayıp bölen bulununca 'asal = 0' yapmaya ne denir?", o: ["Sayaç", "Bayrak (flag)", "Toplam", "Dizi"], c: 1, a: "Bayrak, bir durumun gerçekleşip gerçekleşmediğini tutan 1/0 değişkenidir." }
    ],
    alt: [
      { t: "p", h: "Problemi bir <b>yemek tarifi</b> gibi parçala: Malzemeler (girdi) neler? Hangi araçları (kalıpları) kullanacağım? Sonunda tabağa ne koyacağım (çıktı)?" },
      { t: "tablo", baslik: "Problem → kalıp eşlemesi", b: ["Problem", "Kalıp"], r: [["1'den N'e toplam", "Toplam + döngü"], ["N!", "Çarpım + döngü"], ["Girilen 10 sayıdan kaçı pozitif?", "Sayaç + if"], ["Sınıfın en yüksek notu", "En büyük"], ["Sayı asal mı?", "Bayrak + mod"], ["Sayının rakamları toplamı", "Basamak ayırma (% 10, / 10)"]] },
      { t: "p", h: "<code>n % 10</code> bir sayının <b>son rakamını</b> verir, <code>n / 10</code> son rakamı <b>siler</b>. 472 → 2 ve 47. Bu ikisini döngüde tekrarlarsan bütün rakamları tek tek elde edersin." },
      { t: "kontrol", s: "<code>int n = 358;</code> için <code>n % 10</code> ve <code>n / 10</code> nedir?", o: ["8 ve 35", "3 ve 58", "8 ve 35.8", "58 ve 3"], c: 0, a: "Son rakam 8; tamsayı bölmesiyle 35." }
    ],
    ozet: ["Kalıplar: toplam, çarpım, sayaç, en büyük, bayrak, basamak ayırma", "n % 10 son rakam, n / 10 son rakamı siler", "Asal: 2..n-1 arası bölen yoksa asal (n < 2 asal değil)", "Çözümünü küçük değerlerle elle test et"]
  });
  D.sorular.push(
    { id: "a11-01", k: 11, z: 2, tip: "cikti", b: "faktoriyel", s: "n = 5 için çıktı nedir?", kod: K`int i, f = 1;
for (i = 1; i <= n; i++)
    f = f * i;
printf("%d", f);`, c: ["120"], a: "5! = 1 × 2 × 3 × 4 × 5 = 120." },
    { id: "a11-02", k: 11, z: 2, tip: "mc", b: "basamak", s: "<code>int n = 472;</code> için <code>n % 10</code> ve <code>n / 10</code> sırasıyla nedir?", o: ["2 ve 47", "4 ve 72", "2 ve 47.2", "47 ve 2", "7 ve 4"], c: 0, a: "n % 10 son rakamı (2), n / 10 son rakamı silinmiş sayıyı (47) verir." },
    { id: "a11-03", k: 11, z: 3, tip: "cikti", b: "basamak", s: "Aşağıdaki kodun çıktısı nedir?", kod: K`int n = 3052, t = 0;
while (n > 0)
{
    t = t + n % 10;
    n = n / 10;
}
printf("%d", t);`, c: ["10"], a: "Rakamlar 2, 5, 0, 3 → toplam 10." },
    { id: "a11-04", k: 11, z: 3, tip: "kod", b: "asal", s: "Asal sayı kontrolünde boşluğa ne gelmelidir?", kod: K`int asal = 1;
for (i = 2; i < n; i++)
    if (n % i ___ 0)
        asal = 0;`, c: ["=="], a: "n, i'ye tam bölünüyorsa (kalan 0) bir bölen bulunmuştur; sayı asal değildir." },
    { id: "a11-05", k: 11, z: 2, tip: "mc", b: "kalip", s: "\"Klavyeden girilen 10 sayıdan kaç tanesinin negatif olduğunu\" bulmak için hangi kalıp kullanılır?", o: ["Çarpım", "Sayaç + if", "Basamak ayırma", "Bayrak", "Takas"], c: 1, a: "Koşulu sağlayanları saymak için sayaç (say++) ve if kullanılır." },
    { id: "a11-06", k: 11, z: 3, tip: "mc", b: "asal", s: "Bayrak kalıbıyla yazılmış asal kontrolü n = 9 için ne yazar?", kod: K`int n = 9, i, asal = 1;
for (i = 2; i < n; i++)
    if (n % i == 0) asal = 0;
if (asal) printf("Asal"); else printf("Asal degil");`, o: ["Asal", "Asal degil", "9", "3", "Hiçbir şey"], c: 1, y: { 0: "9, 3'e tam bölünür." }, a: "i = 3 iken 9 % 3 == 0 → asal = 0 → 'Asal degil'." },
    { id: "a11-07", k: 11, z: 2, tip: "dy", b: "kalip", s: "Faktöriyel hesaplanırken sonuç değişkeni 0'dan başlatılmalıdır.", c: false, a: "Yanlış. Çarpım 1'den başlatılır; 0 ile başlarsa sonuç her zaman 0 olur." },
    { id: "a11-08", k: 11, z: 3, tip: "klasik", b: "program-yazma", s: "Klavyeden girilen bir sayının asal olup olmadığını ekrana yazan C programını yazınız.", model: K`#include <stdio.h>
main()
{
    int n, i, asal = 1;
    printf("Sayi: ");
    scanf("%d", &n);
    if (n < 2) asal = 0;
    for (i = 2; i < n; i++)
        if (n % i == 0)
            asal = 0;
    if (asal == 1)
        printf("Asal");
    else
        printf("Asal degil");
}`, olcut: ["Sayı scanf ile okunuyor", "Bayrak (asal = 1) kullanılıyor", "2'den n-1'e kadar bölen aranıyor (n % i == 0)", "n < 2 durumu ele alınmış", "Sonuca göre doğru mesaj yazılıyor"], a: "Döngü i * i <= n ile daha hızlı yazılabilir ama sınav için yukarıdaki yeterlidir." },
    { id: "a11-09", k: 11, z: 3, tip: "klasik", b: "program-yazma", s: "Klavyeden girilen N için 1 + 2 + … + N toplamını ve N! değerini aynı döngüde hesaplayıp yazan programı yazınız.", model: K`#include <stdio.h>
main()
{
    int n, i, t = 0, f = 1;
    scanf("%d", &n);
    for (i = 1; i <= n; i++)
    {
        t = t + i;
        f = f * i;
    }
    printf("Toplam: %d\nFaktoriyel: %d", t, f);
}`, olcut: ["t = 0 ve f = 1 başlangıçları doğru", "Tek döngüde ikisi birden hesaplanıyor", "Döngü 1'den N'e (N dahil)", "Süslü parantezle iki komut bloğa alınmış", "Sonuçlar yazdırılıyor"], a: "İki komut aynı döngüde çalışacaksa { } şarttır." },
    { id: "a11-10", k: 11, z: 2, tip: "sira", b: "faktoriyel", s: "N! hesaplayan programın satırlarını sırala.", o: ["int n, i, f = 1;", "scanf(\"%d\", &n);", "for (i = 1; i <= n; i++)", "    f = f * i;", "printf(\"%d\", f);"], a: "Tanım → okuma → döngü → gövde → yazdırma." }
  );
})();
