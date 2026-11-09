/* SINAV KOÇUM · Algoritma — içerik (2/3: konu 5–8) */
(function () {
  var K = String.raw, D = window.KOC_DERS;

  /* ------------------------------------------------------------------ 5 */
  D.konular.push({
    no: 5, ad: "Operatörler ve işlem önceliği", kisa: "Operatörler", sinav: "vize",
    hedef: ["Aritmetik operatörleri ve % (mod) işlemini kullanmak", "Tamsayı bölmesini anlamak", "İşlem önceliğine göre ifade hesaplamak", "Matematiksel ifadeyi C'ye çevirmek", "Karşılaştırma ve mantıksal operatörleri okumak"],
    anlat: [
      { t: "tablo", baslik: "Aritmetik operatörler", b: ["Operatör", "İşlem", "Örnek", "Sonuç"], r: [["+", "Toplama", "7 + 2", "9"], ["-", "Çıkarma", "7 - 2", "5"], ["*", "Çarpma", "7 * 2", "14"], ["/", "Bölme", "7 / 2", "3 (iki int → tamsayı bölmesi)"], ["%", "Bölümden kalan (mod)", "7 % 2", "1"]] },
      { t: "p", h: "<b>En kritik nokta:</b> iki <code>int</code> bölünürse sonuç da int olur, virgülden sonrası atılır. <code>7 / 2 = 3</code>, ama <code>7.0 / 2 = 3.5</code>. Sınavda en çok buradan hata yapılır." },
      { t: "hayat", baslik: "Günlük hayattan: % (mod) operatörü", h: "17 şekeri 5 çocuğa eşit dağıtıyorsun. Her çocuk 17 / 5 = 3 şeker alır, elinde 17 % 5 = 2 şeker kalır. Bir sayının çift olup olmadığını anlamak için de kalan kullanılır: <code>n % 2 == 0</code> ise çifttir." },
      { t: "tablo", baslik: "İşlem önceliği (yukarıdan aşağı)", b: ["Öncelik", "Operatörler"], r: [["1", "( ) parantez"], ["2", "* / % (soldan sağa)"], ["3", "+ - (soldan sağa)"], ["4", "< <= > >= (karşılaştırma)"], ["5", "== != (eşit mi, eşit değil mi)"], ["6", "&& (ve)"], ["7", "|| (veya)"], ["8", "= += -= (atama, en son)"]] },
      { t: "adim", baslik: "Adım adım: 2 + 3 * 4 - 8 / 2", adimlar: [["Önce * ve /", "3 * 4 = 12 ve 8 / 2 = 4"], ["İfade", "2 + 12 - 4"], ["Sonra soldan sağa + ve -", "2 + 12 = 14, 14 - 4 = 10"], ["Sonuç", "10. Parantez olsaydı ((2 + 3) * 4) önce parantez hesaplanırdı: 20."]] },
      { t: "p", h: "<b>Matematiksel ifadeyi koda çevirirken</b> çarpma işaretini mutlaka yaz ve kesirleri paranteze al: <code>2ab</code> → <code>2*a*b</code>, <code>(a+b)/c</code> paydalı kesir → <code>(a+b)/c</code>; <code>a + b / c</code> yazarsan yalnızca b bölünür." },
      { t: "tablo", baslik: "Kısaltmalar ve mantıksal operatörler", b: ["Yazım", "Anlamı"], r: [["x += 3", "x = x + 3"], ["x *= 2", "x = x * 2"], ["x++", "x = x + 1"], ["x--", "x = x - 1"], ["a == b", "a, b'ye eşit mi?"], ["a != b", "a, b'den farklı mı?"], ["a > 0 && b > 0", "İkisi de pozitif mi? (VE)"], ["a > 0 || b > 0", "En az biri pozitif mi? (VEYA)"], ["!(a > 0)", "a pozitif değil mi? (DEĞİL)"]] },
      { t: "kontrol", s: "<code>int a = 17, b = 5;</code> için <code>a / b</code> ve <code>a % b</code> kaçtır?", o: ["3.4 ve 2", "3 ve 2", "3 ve 4", "4 ve 2"], c: 1, a: "İki int bölünürse sonuç tamsayıdır: 17 / 5 = 3, kalan 17 % 5 = 2." }
    ],
    alt: [
      { t: "p", h: "İşlem önceliğini <b>okuldaki matematik</b> gibi düşün: önce parantez, sonra çarpma-bölme, en son toplama-çıkarma. C de aynısını yapar; tek farkı bölmede virgülü atabilmesidir." },
      { t: "tablo", baslik: "Bölme tuzağı tablosu", b: ["İfade", "Sonuç", "Neden?"], r: [["10 / 4", "2", "İkisi de int → kesir atılır"], ["10.0 / 4", "2.5", "Biri ondalıklı → ondalıklı bölme"], ["10 % 4", "2", "10 = 4 × 2 + 2"], ["4 % 10", "4", "4, 10'dan küçük → kalan kendisi"], ["9 % 3", "0", "Tam bölünüyor"]] },
      { t: "p", h: "% operatörünü saatle düşün: saat 13'ü 12'lik sistemde söylerken 13 % 12 = 1 dersin. Kalan her zaman bölenden küçüktür." },
      { t: "kontrol", s: "<code>(4 + 6) / 4</code> int olarak kaçtır?", o: ["2.5", "2", "3", "5"], c: 1, a: "Önce parantez: 10. Sonra 10 / 4 = 2 (tamsayı bölmesi)." }
    ],
    ozet: ["/ iki int arasında tamsayı bölmesi yapar (7/2 = 3)", "% bölümden kalan: 7 % 2 = 1", "Öncelik: () → * / % → + - → karşılaştırma → && → || → =", "2ab → 2*a*b, kesirlerde parantez", "x += 3 → x = x + 3, x++ → x = x + 1"]
  });
  D.sorular.push(
    { id: "a5-01", k: 5, z: 1, tip: "mc", b: "mod", s: "<code>17 % 5</code> ifadesinin sonucu kaçtır?", o: ["3", "2", "3.4", "5", "0"], c: 1, y: { 0: "3 bölümdür (17 / 5); % kalanı verir.", 2: "% kalan verir, ondalıklı sonuç vermez." }, a: "17 = 5 × 3 + 2 → kalan 2." },
    { id: "a5-02", k: 5, z: 2, tip: "mc", b: "tamsayi-bolme", s: "<code>int a = 9, b = 2;</code> için <code>a / b</code> kaçtır?", o: ["4.5", "4", "5", "1", "4.0"], c: 1, y: { 0: "İki int bölünürse sonuç int olur; ondalık kısım atılır.", 2: "C yuvarlamaz, keser." }, a: "Tamsayı bölmesi: 9 / 2 = 4 (kalan 1 atılır)." },
    { id: "a5-03", k: 5, z: 2, tip: "mc", b: "oncelik", s: "<code>2 + 3 * 4 - 8 / 2</code> ifadesinin sonucu kaçtır?", o: ["6", "10", "16", "18", "8"], c: 1, y: { 3: "Önce toplamayı yapmışsın; çarpma ve bölme önce gelir.", 0: "Soldan sağa sırasız hesaplanmış; önce * ve /." }, a: "3 × 4 = 12, 8 / 2 = 4 → 2 + 12 - 4 = 10." },
    { id: "a5-04", k: 5, z: 2, tip: "kod", b: "matematik-ceviri", s: "Matematikteki <b>2ab + c</b> ifadesinin C karşılığını tamamla.", kod: K`sonuc = ___ + c;`, c: ["2*a*b", "2*b*a", "a*b*2", "a*2*b", "b*a*2", "b*2*a"], a: "C'de çarpma işareti asla atlanmaz: 2ab → 2*a*b." },
    { id: "a5-05", k: 5, z: 1, tip: "dy", b: "oncelik", s: "C'de çarpma ve bölme, toplama ve çıkarmadan önce yapılır.", c: true, a: "Doğru. Parantez yoksa önce * / %, sonra + - soldan sağa hesaplanır." },
    { id: "a5-06", k: 5, z: 3, tip: "mc", b: "oncelik", s: "<code>int x = 10;</code> için <code>x = x % 4 + x / 4 * 2;</code> sonrası x kaçtır?", o: ["6", "7", "4", "5", "9"], c: 0, y: { 1: "10 / 4 = 2 (tamsayı), 2.5 değil.", 3: "Önce * değil, soldan sağa: x / 4 = 2, sonra * 2 = 4." }, a: "10 % 4 = 2, 10 / 4 = 2, 2 * 2 = 4 → 2 + 4 = 6." },
    { id: "a5-07", k: 5, z: 2, tip: "bosluk", b: "kisaltma", s: "<code>x = x + 3;</code> ifadesinin kısaltılmış yazımı <code>x ___ 3;</code> şeklindedir.", c: ["+="], a: "x += 3, x = x + 3 ile aynıdır. Benzer şekilde -=, *=, /= de vardır." },
    { id: "a5-08", k: 5, z: 2, tip: "mc", b: "matematik-ceviri", s: "Paydası c olan <b>(a + b) / c</b> kesrinin doğru C yazımı hangisidir?", o: ["a + b / c", "(a + b) / c", "a + (b / c)", "a / c + b", "(a + b / c)"], c: 1, y: { 0: "Parantez olmadan yalnızca b, c'ye bölünür.", 4: "Burada da yalnızca b bölünür." }, a: "Payın tamamı bölünecekse parantez şarttır: (a + b) / c." },
    { id: "a5-09", k: 5, z: 3, tip: "cikti", b: "tamsayi-bolme", s: "Aşağıdaki kodun ekran çıktısı nedir?", kod: K`#include <stdio.h>
main()
{
    int a = 17, b = 5;
    printf("%d %d", a / b, a % b);
}`, c: ["3 2"], a: "a / b = 3 (tamsayı bölmesi), a % b = 2. printf aralarında bir boşlukla yazar: 3 2" },
    { id: "a5-10", k: 5, z: 2, tip: "mc", b: "mantiksal", s: "<code>a = 5, b = -2</code> iken hangi ifade <b>doğru (1)</b> olur?", o: ["a > 0 && b > 0", "a < 0 || b > 0", "a > 0 || b > 0", "!(a > 0)", "a == b"], c: 2, y: { 0: "&& için iki şartın da doğru olması gerekir; b > 0 yanlış." }, a: "|| (veya) için bir şartın doğru olması yeter: a > 0 doğrudur." },
    { id: "a5-11", k: 5, z: 1, tip: "mc", b: "mod", s: "Bir sayının <b>çift</b> olup olmadığını anlamak için hangi ifade kullanılır?", o: ["n / 2 == 0", "n % 2 == 0", "n * 2 == 0", "n % 2 == 1", "n - 2 == 0"], c: 1, y: { 3: "Kalan 1 ise sayı tektir.", 0: "n / 2 bölümü verir; çiftlik kalanla anlaşılır." }, a: "Çift sayının 2'ye bölümünden kalan 0'dır." },
    { id: "a5-12", k: 5, z: 3, tip: "cikti", b: "kisaltma", s: "Aşağıdaki kodun çıktısı nedir?", kod: K`#include <stdio.h>
main()
{
    int x = 4;
    x += 3;
    x *= 2;
    x--;
    printf("x=%d", x);
}`, c: ["x=13"], a: "x = 4 → x += 3 → 7 → x *= 2 → 14 → x-- → 13. Çıktı: x=13" },
    { id: "a5-13", k: 5, z: 2, tip: "dy", b: "esittir", s: "C'de <code>=</code> karşılaştırma, <code>==</code> atama operatörüdür.", c: false, a: "Yanlış. Tam tersi: = atama yapar, == iki değerin eşit olup olmadığını kontrol eder." },
    { id: "a5-14", k: 5, z: 3, tip: "mc", b: "tamsayi-bolme", s: "Vize ve final notu int olan bir öğrencinin ortalamasını doğru (ondalıklı) hesaplayan satır hangisidir?", o: ["float ort = (vize + final) / 2;", "float ort = (vize + final) / 2.0;", "int ort = (vize + final) / 2.0;", "float ort = vize + final / 2;", "float ort = (vize + final) % 2;"], c: 1, y: { 0: "(vize + final) ve 2 ikisi de int; önce tamsayı bölmesi yapılır, sonra float'a konur. 75 + 80 = 155 / 2 = 77 olur.", 3: "Parantez yok; yalnızca final 2'ye bölünür." }, a: "Bölenlerden biri ondalıklı (2.0) olunca bölme ondalıklı yapılır: 155 / 2.0 = 77.5." }
  );

  /* ------------------------------------------------------------------ 6 */
  D.konular.push({
    no: 6, ad: "Giriş ve çıkış işlemleri", kisa: "Giriş / çıkış", sinav: "vize",
    hedef: ["Bir C programının iskeletini kurmak", "printf ve kaçış karakterleriyle ekran çıktısını tahmin etmek", "scanf ile klavyeden veri okumak (& operatörü)", "gets / puts ve Türkçe karakter ayarını bilmek"],
    anlat: [
      { t: "kod", ad: "Bir C programının iskeleti", k: K`#include <stdio.h>     /* kütüphane: printf, scanf burada */
main()                 /* program buradan başlar */
{
    printf("Merhaba");   /* her komut ; ile biter */
}` },
      { t: "tablo", baslik: "Parçalar ne işe yarar?", b: ["Parça", "Görevi"], r: [["#include <stdio.h>", "Giriş-çıkış kütüphanesini ekler (printf, scanf)"], ["main()", "Programın başladığı ana fonksiyon"], ["{ }", "Komut bloğunun başı ve sonu"], [";", "Her komutun sonu"], ["/* … */ ve //", "Açıklama (derleyici okumaz)"], ["#include <conio.h>", "getch() gibi ekran/klavye komutları"], ["#include <locale.h>", "setlocale(LC_ALL, \"Turkish\"); ile Türkçe karakter"]] },
      { t: "tablo", baslik: "Kaçış karakterleri (printf içinde)", b: ["Yazım", "Etkisi"], r: [["\\n", "Alt satıra geçer"], ["\\t", "Bir sekme (tab) boşluk bırakır"], ["\\\\", "Ekrana \\ yazar"], ["\\\"", "Ekrana \" yazar"], ["%%", "Ekrana % yazar"]] },
      { t: "adim", baslik: "Ekran çıktısı bulma · printf(\"Bir\\nIki Uc\\n\\nDort\");", adimlar: [["\"Bir\" yazılır", "İmleç aynı satırda."], ["\\n", "Alt satıra geçilir; 'Iki Uc' ikinci satıra yazılır."], ["\\n\\n", "İki kez alt satır: araya bir boş satır girer."], ["\"Dort\"", "Dördüncü satıra yazılır. Toplam 4 satır (biri boş)."]] },
      { t: "p", h: "<b>printf birden fazla kez çağrılsa da \\n yoksa aynı satırda devam eder.</b> <code>printf(\"Ali\"); printf(\"Veli\");</code> çıktısı <code>AliVeli</code> olur." },
      { t: "kod", ad: "Klavyeden okuma · scanf", k: K`int yas;
float boy;
printf("Yasinizi girin: ");
scanf("%d", &yas);      /* & : değişkenin adresi */
scanf("%f", &boy);
printf("Yas: %d, Boy: %.2f\n", yas, boy);` },
      { t: "p", h: "scanf'te değişkenin önüne <b>& (adres operatörü)</b> konur; okunan değer o adrese yazılır. Metin (char dizisi) okurken & kullanılmaz: <code>scanf(\"%s\", ad);</code>. scanf boşlukta durur; boşluklu tam satır için <code>gets(ad)</code>, yazdırmak için <code>puts(ad)</code> kullanılır. <code>%.2f</code> ondalıklı sayıyı virgülden sonra 2 basamakla yazar." },
      { t: "kontrol", s: "<code>printf(\"A\\tB\\nC\");</code> kaç satır çıktı verir?", o: ["1", "2", "3", "4"], c: 1, a: "\\t aynı satırda boşluk bırakır; yalnızca \\n alt satıra geçirir. Çıktı: 'A    B' ve 'C' → 2 satır." }
    ],
    alt: [
      { t: "p", h: "printf'i <b>daktilo</b> gibi düşün. Daktilo sen 'satır başı' (\\n) demedikçe hep aynı satıra yazar. \\t ise kâğıdı biraz sağa kaydırır." },
      { t: "tablo", baslik: "Kod → ekran", b: ["Kod", "Ekranda görünen"], r: [["printf(\"Ali\"); printf(\"Veli\");", "AliVeli"], ["printf(\"Ali\\n\"); printf(\"Veli\");", "Ali ⏎ Veli"], ["printf(\"%d+%d=%d\", 2, 3, 5);", "2+3=5"], ["printf(\"%%50 indirim\");", "%50 indirim"], ["printf(\"\\\"Merhaba\\\"\");", "\"Merhaba\""]] },
      { t: "p", h: "scanf'i bir <b>kargo</b> gibi düşün: klavyeden gelen paketi değişkenin <b>adresine</b> teslim eder. Bu yüzden adres operatörü & gerekir. Unutursan paket yanlış yere gider ve program çöker." },
      { t: "kontrol", s: "Klavyeden bir tamsayıyı <code>n</code> değişkenine okuyan doğru komut hangisi?", o: ["scanf(\"%d\", n);", "scanf(\"%d\", &n);", "printf(\"%d\", &n);", "scanf(\"%f\", &n);"], c: 1, a: "int için %d ve değişkenin adresi &n kullanılır." }
    ],
    ozet: ["İskelet: #include <stdio.h> · main() · { } · her komut ;", "\\n alt satır · \\t sekme · \\\\ ters bölü · \\\" tırnak · %% yüzde", "\\n yoksa printf'ler aynı satıra yazar", "scanf(\"%d\", &x); → & şart (metinde yok)", "gets: boşluklu satır okur · puts: yazar · %.2f: 2 basamak"]
  });
  D.sorular.push(
    { id: "a6-01", k: 6, z: 1, tip: "mc", b: "iskelet", s: "printf ve scanf komutlarını kullanabilmek için programın başına hangi satır eklenir?", o: ["#include <conio.h>", "#include <stdio.h>", "#include <math.h>", "#include <locale.h>", "#include <string.h>"], c: 1, y: { 0: "conio.h getch() gibi komutlar içindir.", 3: "locale.h Türkçe karakter ayarı içindir." }, a: "stdio.h (standard input output) giriş-çıkış kütüphanesidir." },
    { id: "a6-02", k: 6, z: 1, tip: "bosluk", b: "iskelet", s: "C dilinde her komut ______ işaretiyle biter.", c: [";", "noktalı virgül", "noktali virgul"], a: "Komut sonuna ; (noktalı virgül) konmazsa derleme hatası alınır." },
    { id: "a6-03", k: 6, z: 2, tip: "cikti", b: "kacis", s: "Aşağıdaki kodun ekran çıktısını yaz. (Satırları alt alta yaz.)", kod: K`#include <stdio.h>
main()
{
    printf("Elazig");
    printf("Firat\n");
    printf("YBS");
}`, c: ["ElazigFirat\nYBS"], a: "İlk printf'ten sonra \\n olmadığı için 'Firat' aynı satıra yapışır. \\n'den sonra 'YBS' ikinci satıra yazılır." },
    { id: "a6-04", k: 6, z: 2, tip: "mc", b: "kacis", s: "Aşağıdaki kodun çıktısı kaç satırdır?", kod: K`printf("Bir\nIki\n\nUc\tDort\n");`, o: ["2", "3", "4", "5", "6"], c: 2, y: { 3: "Sondaki \\n yeni bir yazı satırı oluşturmaz; \\t de satır değiştirmez.", 1: "\\n\\n arka arkaya gelince araya boş bir satır girer." }, a: "Bir / Iki / (boş satır) / Uc  Dort → 4 satır. \\t aynı satırda boşluk bırakır." },
    { id: "a6-05", k: 6, z: 2, tip: "kod", b: "scanf", s: "Klavyeden bir tamsayıyı <b>sayi</b> değişkenine okumak için boşluğu doldur.", kod: K`int sayi;
scanf("%d", ___);`, c: ["&sayi"], a: "scanf değeri değişkenin adresine yazar; bu yüzden & kullanılır: &sayi." },
    { id: "a6-06", k: 6, z: 3, tip: "hata", b: "scanf", s: "Aşağıdaki programda hangi satır hatalıdır?", kod: K`#include <stdio.h>
main()
{
    int yas;
    printf("Yasinizi girin: ");
    scanf("%d", yas);
    printf("Yasiniz: %d", yas);
}`, c: 6, a: "scanf'te değişkenin önüne & konmalıdır: scanf(\"%d\", &yas);" },
    { id: "a6-07", k: 6, z: 2, tip: "mc", b: "kacis", s: "Ekrana <b>%25 indirim</b> yazdırmak için hangi komut kullanılır?", o: ["printf(\"%25 indirim\");", "printf(\"%%25 indirim\");", "printf(\"\\%25 indirim\");", "printf(\"25% indirim\");", "printf(%25 indirim);"], c: 1, y: { 0: "Tek % bir biçim belirteci başlatır; %2 gibi yorumlanır." }, a: "printf'te % işaretini yazdırmak için %% kullanılır." },
    { id: "a6-08", k: 6, z: 3, tip: "cikti", b: "bicim", s: "Aşağıdaki kodun çıktısı nedir?", kod: K`#include <stdio.h>
main()
{
    int a = 3, b = 4;
    printf("%d+%d=%d", a, b, a + b);
}`, c: ["3+4=7"], a: "Her %d sırasıyla a, b ve a + b ile yer değiştirir: 3+4=7" },
    { id: "a6-09", k: 6, z: 2, tip: "mc", b: "gets", s: "Kullanıcının adını ve soyadını <b>boşlukla birlikte</b> tek satırda okumak için hangisi uygundur?", o: ["scanf(\"%s\", ad);", "gets(ad);", "getch();", "puts(ad);", "printf(\"%s\", ad);"], c: 1, y: { 0: "scanf %s ilk boşlukta durur; yalnızca adı okur.", 3: "puts yazdırır, okumaz." }, a: "gets boşluklar dahil tüm satırı okur." },
    { id: "a6-10", k: 6, z: 1, tip: "dy", b: "iskelet", s: "C'de /* ve */ arasına yazılanlar derleyici tarafından komut olarak çalıştırılmaz.", c: true, a: "Doğru. Bunlar açıklama (yorum) satırlarıdır; kodu okuyanlar içindir." },
    { id: "a6-11", k: 6, z: 3, tip: "cikti", b: "kacis", s: "Aşağıdaki kodun çıktısını yaz.", kod: K`#include <stdio.h>
main()
{
    printf("1\n12\n123");
}`, c: ["1\n12\n123"], a: "Her \\n alt satıra geçirir: 1 / 12 / 123" },
    { id: "a6-12", k: 6, z: 2, tip: "mc", b: "bicim", s: "<code>float f = 3.14159;</code> için <code>printf(\"%.2f\", f);</code> ne yazar?", o: ["3.14159", "3.14", "3.1", "3", "3.142"], c: 1, a: "%.2f virgülden sonra 2 basamak gösterir: 3.14" },
    { id: "a6-13", k: 6, z: 3, tip: "klasik", b: "program-yazma", s: "Klavyeden ad, soyad ve okul numarasını okuyup ekrana alt alta yazdıran C programını yazınız.", model: K`#include <stdio.h>
main()
{
    char ad[30], soyad[30];
    int no;
    printf("Ad: ");    scanf("%s", ad);
    printf("Soyad: "); scanf("%s", soyad);
    printf("No: ");    scanf("%d", &no);
    printf("%s\n%s\n%d", ad, soyad, no);
}`, olcut: ["#include <stdio.h> ve main() { } var", "Ad ve soyad için char dizisi", "Numara int ve scanf'te &no", "Metinler %s ile, & olmadan okunuyor", "Çıktı \\n ile alt alta yazılıyor"], a: "Metinlerde & kullanılmaz çünkü dizi adı zaten bir adrestir." }
  );

  /* ------------------------------------------------------------------ 7 */
  D.konular.push({
    no: 7, ad: "Karar yapıları (if - else)", kisa: "if - else", sinav: "vize",
    hedef: ["if, else ve else if yapısını kurmak", "Koşulu doğru yazmak (== ve = farkı)", "Birden fazla koşulu && ve || ile birleştirmek", "if bloklarında süslü parantezin etkisini anlamak"],
    anlat: [
      { t: "p", h: "Program her zaman aynı yolu izlemez; bazen bir duruma göre karar verir. 'Not 50 ve üzeriyse geçti, değilse kaldı' gibi. C'de bunun için <b>if</b> kullanılır." },
      { t: "kod", ad: "Yapı", k: K`if (kosul)
{
    /* koşul doğruysa */
}
else
{
    /* koşul yanlışsa */
}` },
      { t: "hayat", baslik: "Günlük hayattan: şemsiye kararı", h: "Eğer yağmur yağıyorsa şemsiye al, değilse güneş gözlüğü tak. Koşul (yağmur var mı?) doğruysa ilk blok, yanlışsa else bloğu çalışır. <b>İkisi aynı anda asla çalışmaz.</b>" },
      { t: "kod", ad: "Örnek · Not değerlendirme (else if)", k: K`if (not >= 85)
    printf("AA");
else if (not >= 70)
    printf("BB");
else if (not >= 50)
    printf("CC");
else
    printf("FF");` },
      { t: "adim", baslik: "not = 72 için takip", adimlar: [["72 >= 85 ?", "Yanlış → sonraki koşula geç."], ["72 >= 70 ?", "Doğru → 'BB' yazılır."], ["Kalanlar", "Bir koşul doğru çıkınca zincirin geri kalanı hiç kontrol edilmez."]] },
      { t: "tablo", baslik: "Sık yapılan hatalar", b: ["Hatalı", "Doğru", "Neden?"], r: [["if (x = 5)", "if (x == 5)", "= atama yapar, koşul her zaman doğru olur"], ["if (x > 0);", "if (x > 0)", "Sondaki ; boş bir komuttur, if'i bitirir"], ["if (0 < x < 10)", "if (x > 0 && x < 10)", "Aralık için iki koşul && ile bağlanır"], ["Süslü parantez yok, iki komut", "{ } ile blok", "Parantez yoksa if yalnızca ilk komutu kapsar"]] },
      { t: "kontrol", s: "<code>int x = 3; if (x > 5) printf(\"A\"); else printf(\"B\");</code> ne yazar?", o: ["A", "B", "AB", "Hiçbir şey"], c: 1, a: "3 > 5 yanlış olduğu için else çalışır: B." }
    ],
    alt: [
      { t: "p", h: "if yapısını <b>turnike</b> gibi düşün: kartın geçerliyse (koşul doğru) içeri girersin; değilse (else) başka yöne yönlendirilirsin. else if ise art arda dizilmiş turnikelerdir; ilk açılan turnikeden geçersin, diğerlerine bakmazsın." },
      { t: "tablo", baslik: "Koşul → sonuç", b: ["x", "x > 0 && x < 10", "x < 0 || x > 100"], r: [["5", "Doğru", "Yanlış"], ["-3", "Yanlış", "Doğru"], ["150", "Yanlış", "Doğru"], ["0", "Yanlış", "Yanlış"]] },
      { t: "p", h: "Süslü parantezi <b>bir poşet</b> gibi düşün: if bir poşeti taşır. Komutları poşete koymazsan if yalnızca elindeki ilk komutu taşır, ikincisi her durumda çalışır." },
      { t: "kod", ad: "Tuzak", k: K`int x = 2;
if (x > 5)
    printf("Buyuk ");
    printf("Bitti");     /* if'e ait DEĞİL, her zaman çalışır */` },
      { t: "kontrol", s: "Yukarıdaki kodun çıktısı nedir?", o: ["Buyuk Bitti", "Bitti", "Buyuk", "Hiçbir şey"], c: 1, a: "x > 5 yanlış. Süslü parantez olmadığından ikinci printf if'e ait değildir ve çalışır: Bitti." }
    ],
    ozet: ["if (koşul) { … } else { … } → yalnızca biri çalışır", "else if zincirinde ilk doğru koşul çalışır, gerisine bakılmaz", "== karşılaştırma, = atama", "Aralık: x > 0 && x < 10", "Süslü parantez yoksa if yalnızca ilk komutu kapsar"]
  });
  D.sorular.push(
    { id: "a7-01", k: 7, z: 1, tip: "mc", b: "if-temel", s: "<code>int n = 8; if (n % 2 == 0) printf(\"Cift\"); else printf(\"Tek\");</code> ne yazar?", o: ["Tek", "Cift", "CiftTek", "0", "Hiçbir şey"], c: 1, a: "8 % 2 = 0 → koşul doğru → Cift." },
    { id: "a7-02", k: 7, z: 2, tip: "mc", b: "esittir", s: "<code>int x = 3; if (x = 5) printf(\"Bes\"); else printf(\"Degil\");</code> ne yazar?", o: ["Degil", "Bes", "3", "Derleme hatası", "Hiçbir şey"], c: 1, y: { 0: "x = 5 bir karşılaştırma değil, atamadır; sonucu 5 (sıfırdan farklı = doğru)." }, a: "x = 5 atama yapar ve değeri 5 olur; C'de sıfırdan farklı her değer 'doğru' sayılır. Karşılaştırma için == kullanılmalıydı." },
    { id: "a7-03", k: 7, z: 2, tip: "cikti", b: "else-if", s: "<code>not = 72</code> iken çıktı nedir?", kod: K`if (not >= 85)
    printf("AA");
else if (not >= 70)
    printf("BB");
else if (not >= 50)
    printf("CC");
else
    printf("FF");`, c: ["BB"], a: "72 >= 85 yanlış, 72 >= 70 doğru → BB. Zincirin geri kalanı kontrol edilmez." },
    { id: "a7-04", k: 7, z: 2, tip: "kod", b: "mantiksal", s: "x'in 1 ile 9 arasında (1 ve 9 dahil) olup olmadığını kontrol eden koşulu tamamla.", kod: K`if (x >= 1 ___ x <= 9)`, c: ["&&"], a: "İki şartın da doğru olması gerekir; VE operatörü &&." },
    { id: "a7-05", k: 7, z: 3, tip: "cikti", b: "suslu-parantez", s: "Aşağıdaki kodun çıktısı nedir?", kod: K`int x = 2;
if (x > 5)
    printf("Buyuk ");
    printf("Bitti");`, c: ["Bitti"], a: "Süslü parantez olmadığı için if yalnızca ilk printf'i kapsar. İkinci printf her durumda çalışır." },
    { id: "a7-06", k: 7, z: 3, tip: "hata", b: "noktali-virgul", s: "Aşağıdaki kodda x = -4 olmasına rağmen 'Pozitif' yazılıyor. Hatalı satır hangisi?", kod: K`#include <stdio.h>
main()
{
    int x = -4;
    if (x > 0);
        printf("Pozitif");
}`, c: 5, a: "if (x > 0); satırındaki ; if'in gövdesini boş bırakır. printf if'e bağlı değildir ve her durumda çalışır." },
    { id: "a7-07", k: 7, z: 1, tip: "dy", b: "if-temel", s: "Bir if-else yapısında koşul doğruysa hem if hem de else bloğu çalışır.", c: false, a: "Yanlış. Koşul doğruysa yalnızca if, yanlışsa yalnızca else bloğu çalışır." },
    { id: "a7-08", k: 7, z: 2, tip: "mc", b: "mantiksal", s: "Hangi koşul 'x negatif ya da 100'den büyükse' durumunu ifade eder?", o: ["x < 0 && x > 100", "x < 0 || x > 100", "!(x < 0)", "x <= 0 && x >= 100", "x < 0 < 100"], c: 1, y: { 0: "Bir sayı aynı anda hem negatif hem 100'den büyük olamaz; && hiç doğru olmaz." }, a: "'ya da' → || (veya)." },
    { id: "a7-09", k: 7, z: 2, tip: "sira", b: "else-if", s: "Gelir ve gidere göre Kâr / Zarar / Başabaş yazan kodun satırlarını sırala.", o: ["if (gelir > gider)", "    printf(\"Kar\");", "else if (gelir < gider)", "    printf(\"Zarar\");", "else", "    printf(\"Basabas\");"], a: "Önce if, sonra else if, en son else gelir. Eşitlik durumunda iki koşul da yanlış olur ve else çalışır." },
    { id: "a7-10", k: 7, z: 3, tip: "mc", b: "if-ic-ice", s: "<code>a = 4, b = 9</code> için çıktı nedir?", kod: K`if (a > 5)
    printf("X");
else if (b > 5)
{
    if (a % 2 == 0) printf("Y");
    else printf("Z");
}
else
    printf("W");`, o: ["X", "Y", "Z", "W", "YZ"], c: 1, y: { 2: "a = 4 çift; a % 2 == 0 doğrudur." }, a: "a > 5 yanlış → b > 5 doğru → içerideki if: 4 % 2 == 0 doğru → Y." },
    { id: "a7-11", k: 7, z: 3, tip: "klasik", b: "program-yazma", s: "Klavyeden vize ve final notunu okuyan, ortalamayı (vize × 0,4 + final × 0,6) hesaplayan; ortalama 50 ve üzeriyse \"Gecti\", değilse \"Kaldi\" yazan C programını yazınız.", model: K`#include <stdio.h>
main()
{
    float vize, final, ort;
    printf("Vize: ");  scanf("%f", &vize);
    printf("Final: "); scanf("%f", &final);
    ort = vize * 0.4 + final * 0.6;
    printf("Ortalama: %.2f\n", ort);
    if (ort >= 50)
        printf("Gecti");
    else
        printf("Kaldi");
}`, olcut: ["Notlar float, scanf'te & ile okunuyor", "Ortalama formülü doğru", "if (ort >= 50) koşulu doğru (>= kullanılmış)", "else ile 'Kaldi' yazılıyor", "Program iskeleti eksiksiz"], a: "Koşulda 50 dahil olduğu için >= kullanılır." },
    { id: "a7-12", k: 7, z: 2, tip: "mc", b: "if-temel", s: "Klavyeden girilen sayının pozitif, negatif ya da sıfır olduğunu yazmak için en az kaç koşul kontrolü gerekir?", o: ["1", "2", "3", "4", "Hiç gerekmez"], c: 1, a: "x > 0 ve x < 0 kontrol edilir; ikisi de yanlışsa else ile sıfır yazılır. 2 koşul yeter." },
    { id: "a7-13", k: 7, z: 1, tip: "bosluk", b: "esittir", s: "C'de iki değerin eşit olup olmadığını kontrol eden operatör ______'dir.", c: ["=="], a: "== karşılaştırma, = atama operatörüdür." }
  );

  /* ------------------------------------------------------------------ 8 */
  D.konular.push({
    no: 8, ad: "Döngüler (for, while)", kisa: "Döngüler", sinav: "vize",
    hedef: ["for döngüsünün üç parçasını tanımak", "Döngünün kaç kez döndüğünü hesaplamak", "Sayaç, toplam ve çarpım değişkeni kullanmak", "while ve do-while farkını bilmek", "Döngülü kodun çıktısını bulmak"],
    anlat: [
      { t: "p", h: "1'den 100'e kadar sayıları yazmak için 100 tane printf yazılmaz. Bir işi tekrar tekrar yapmak için <b>döngü</b> kullanılır." },
      { t: "kod", ad: "for döngüsü", k: K`for (baslangic; sart; artis)
{
    /* tekrar edecek komutlar */
}

for (i = 1; i <= 5; i++)
    printf("%d ", i);        /* 1 2 3 4 5 */` },
      { t: "adim", baslik: "for nasıl çalışır?", adimlar: [["1. Başlangıç", "i = 1 yalnızca bir kez, en başta çalışır."], ["2. Şart", "i <= 5 doğru mu? Doğruysa gövdeye girilir, yanlışsa döngü biter."], ["3. Gövde", "printf çalışır."], ["4. Artış", "i++ ile i bir artar, sonra 2. adıma (şarta) dönülür."], ["Sonuç", "i = 6 olunca şart yanlış olur; döngü 5 kez dönmüştür."]] },
      { t: "tablo", baslik: "Kaç kez döner?", b: ["Döngü", "i değerleri", "Tur"], r: [["for (i = 1; i <= 5; i++)", "1, 2, 3, 4, 5", "5"], ["for (i = 0; i < 5; i++)", "0, 1, 2, 3, 4", "5"], ["for (i = 2; i <= 10; i += 2)", "2, 4, 6, 8, 10", "5"], ["for (i = 10; i >= 1; i--)", "10 … 1", "10"], ["for (i = 1; i <= 10; i += 3)", "1, 4, 7, 10", "4"]] },
      { t: "kod", ad: "Toplam ve çarpım kalıbı", k: K`int i, toplam = 0, carpim = 1;   /* toplam 0'dan, çarpım 1'den başlar */
for (i = 1; i <= 5; i++)
{
    toplam = toplam + i;
    carpim = carpim * i;
}
printf("%d %d", toplam, carpim);   /* 15 120 */` },
      { t: "hayat", baslik: "Günlük hayattan: merdiven", h: "Bir merdiveni çıkarken 'son basamağa gelmediysem bir basamak daha çık' dersin. Başlangıç: ilk basamak. Şart: son basamağa gelmedim mi? Artış: bir basamak çık. Şartı kontrol etmeyi unutursan merdiven bitse de çıkmaya çalışırsın (sonsuz döngü)." },
      { t: "kod", ad: "while ve do-while", k: K`i = 1;
while (i <= 5)          /* önce şart, sonra gövde */
{
    printf("%d ", i);
    i++;
}

i = 10;
do {                    /* önce gövde, sonra şart: en az 1 kez çalışır */
    printf("%d ", i);
    i++;
} while (i <= 5);       /* çıktı: 10 */` },
      { t: "kontrol", s: "<code>for (i = 0; i < 10; i += 2)</code> döngüsü kaç kez döner?", o: ["4", "5", "10", "6"], c: 1, a: "i = 0, 2, 4, 6, 8 → 5 kez. i = 10 olunca 10 < 10 yanlıştır." }
    ],
    alt: [
      { t: "p", h: "Döngüyü <b>koşu bandında tur atmak</b> gibi düşün: başlangıç çizgisi (i = 1), kaç tur atacağın (şart), her turda tur sayacını bir artırmak (i++). Her turda aynı işi yaparsın." },
      { t: "tablo", baslik: "İz tablosu: toplam = 0; for (i = 1; i <= 4; i++) toplam += i;", b: ["Tur", "i", "Şart", "toplam"], r: [["1", "1", "1 <= 4 ✓", "1"], ["2", "2", "2 <= 4 ✓", "3"], ["3", "3", "3 <= 4 ✓", "6"], ["4", "4", "4 <= 4 ✓", "10"], ["—", "5", "5 <= 4 ✗", "Döngü biter → 10"]] },
      { t: "p", h: "Tur sayısını hızlı bulma formülü (artış 1 ise): <b>son − ilk + 1</b>. i = 3'ten 8'e: 8 − 3 + 1 = 6 tur. Şart < ise son değer dahil değildir." },
      { t: "p", h: "Toplam için başlangıç <b>0</b>, çarpım için <b>1</b> olmalı. Çarpımı 0'dan başlatırsan sonuç hep 0 çıkar." },
      { t: "kontrol", s: "<code>for (i = 3; i <= 8; i++)</code> kaç tur döner?", o: ["5", "6", "8", "3"], c: 1, a: "8 − 3 + 1 = 6 (3, 4, 5, 6, 7, 8)." }
    ],
    ozet: ["for (başlangıç; şart; artış): başlangıç 1 kez, şart her turdan önce", "Tur sayısı (artış 1): son − ilk + 1 (< ise son hariç)", "Toplam 0'dan, çarpım 1'den başlar", "while: önce şart · do-while: en az 1 kez çalışır", "Şart hiç yanlış olmazsa sonsuz döngü"]
  });
  D.sorular.push(
    { id: "a8-01", k: 8, z: 1, tip: "mc", b: "tur-sayisi", s: "<code>for (i = 1; i <= 5; i++)</code> döngüsü kaç kez döner?", o: ["4", "5", "6", "1", "Sonsuz"], c: 1, a: "i = 1, 2, 3, 4, 5 → 5 kez." },
    { id: "a8-02", k: 8, z: 2, tip: "mc", b: "tur-sayisi", s: "<code>for (i = 0; i < 10; i += 2)</code> döngüsü kaç kez döner?", o: ["4", "5", "6", "10", "20"], c: 1, y: { 2: "10 < 10 yanlıştır; 10 dahil değil.", 3: "i ikişer artıyor." }, a: "i = 0, 2, 4, 6, 8 → 5 kez." },
    { id: "a8-03", k: 8, z: 2, tip: "cikti", b: "dongu-cikti", s: "Aşağıdaki kodun çıktısı nedir?", kod: K`int t = 0, i;
for (i = 1; i <= 4; i++)
    t = t + i;
printf("%d", t);`, c: ["10"], a: "t = 1 + 2 + 3 + 4 = 10." },
    { id: "a8-04", k: 8, z: 2, tip: "cikti", b: "dongu-cikti", s: "Aşağıdaki kodun çıktısını yaz.", kod: K`int i;
for (i = 10; i >= 6; i -= 2)
    printf("%d ", i);`, c: ["10 8 6", "10 8 6 "], a: "i = 10, 8, 6 → '10 8 6 '. i = 4 olunca 4 >= 6 yanlıştır." },
    { id: "a8-05", k: 8, z: 2, tip: "kod", b: "carpim", s: "1'den 5'e kadar sayıların çarpımını bulan kodda <b>c</b>'nin başlangıç değeri ne olmalı?", kod: K`int i, c = ___;
for (i = 1; i <= 5; i++)
    c = c * i;`, c: ["1"], a: "Çarpımın etkisiz elemanı 1'dir. 0 ile başlarsa sonuç hep 0 olur." },
    { id: "a8-06", k: 8, z: 1, tip: "dy", b: "do-while", s: "do-while döngüsünde gövde, şart yanlış olsa bile en az bir kez çalışır.", c: true, a: "Doğru. do-while önce gövdeyi çalıştırır, şartı sonra kontrol eder." },
    { id: "a8-07", k: 8, z: 3, tip: "cikti", b: "dongu-cikti", s: "Aşağıdaki kodun çıktısı nedir?", kod: K`#include <stdio.h>
main()
{
    int x = 2, n = 5, s = 1, i;
    for (i = 1; i <= n; i++)
        s = s * x;
    printf("%d", s);
}`, c: ["32"], a: "Kod x üzeri n'yi hesaplar: 2⁵ = 32." },
    { id: "a8-08", k: 8, z: 3, tip: "hata", b: "sonsuz-dongu", s: "Aşağıdaki kod sonsuz döngüye giriyor. Hatalı satır hangisi?", kod: K`int i = 1, t = 0;
while (i <= 10)
{
    t = t + i;
    i--;
}
printf("%d", t);`, c: 5, a: "i-- ile i azalıyor; i <= 10 şartı hiç yanlış olmaz. i++ olmalıydı." },
    { id: "a8-09", k: 8, z: 2, tip: "mc", b: "for-yapi", s: "for (A; B; C) yapısında hangisi <b>yalnızca bir kez</b> çalışır?", o: ["A (başlangıç)", "B (şart)", "C (artış)", "Gövde", "Hepsi her turda çalışır"], c: 0, y: { 1: "Şart her turdan önce kontrol edilir." }, a: "Başlangıç ifadesi döngüye girerken bir kez çalışır." },
    { id: "a8-10", k: 8, z: 3, tip: "mc", b: "dongu-cikti", s: "Aşağıdaki kodun çıktısı nedir?", kod: K`int i = 10;
do {
    printf("%d ", i);
    i++;
} while (i <= 5);`, o: ["Hiçbir şey", "10", "5 6 7 8 9 10", "10 11 12 …(sonsuz)", "1 2 3 4 5"], c: 1, y: { 0: "do-while en az bir kez çalışır." }, a: "Gövde önce bir kez çalışır (10 yazılır), sonra 11 <= 5 yanlış olduğu için döngü biter." },
    { id: "a8-11", k: 8, z: 3, tip: "klasik", b: "program-yazma", s: "Klavyeden girilen N sayısına kadar olan <b>çift</b> sayıların toplamını bulan C programını yazınız.", model: K`#include <stdio.h>
main()
{
    int n, i, toplam = 0;
    printf("N: ");
    scanf("%d", &n);
    for (i = 2; i <= n; i += 2)
        toplam = toplam + i;
    printf("Toplam: %d", toplam);
}`, olcut: ["N scanf ile & kullanılarak okunuyor", "toplam 0'dan başlıyor", "Döngü yalnızca çift sayıları dolaşıyor (i += 2 ya da i % 2 == 0)", "N dahil ediliyor (<=)", "Sonuç yazdırılıyor"], a: "Alternatif: for (i = 1; i <= n; i++) if (i % 2 == 0) toplam += i;" },
    { id: "a8-12", k: 8, z: 1, tip: "bosluk", b: "for-yapi", s: "<code>i++</code> ifadesi <code>i = i ___ 1</code> anlamına gelir.", c: ["+"], a: "i++ değişkeni bir artırır." },
    { id: "a8-13", k: 8, z: 2, tip: "sira", b: "for-yapi", s: "for döngüsünün bir turunun çalışma sırasını diz (başlangıç zaten yapıldı).", o: ["Şart kontrol edilir", "Şart doğruysa gövde çalışır", "Artış ifadesi çalışır", "Tekrar şarta dönülür"], a: "Her tur: şart → gövde → artış → şart…" },
    { id: "a8-14", k: 8, z: 3, tip: "cikti", b: "dongu-cikti", s: "Aşağıdaki kodun çıktısı nedir?", kod: K`int i, s = 0;
for (i = 1; i <= 10; i++)
    if (i % 3 == 0)
        s = s + i;
printf("%d", s);`, c: ["18"], a: "3'e tam bölünenler: 3, 6, 9 → 3 + 6 + 9 = 18." }
  );
})();
