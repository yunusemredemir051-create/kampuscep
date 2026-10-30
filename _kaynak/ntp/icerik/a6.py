from dsl import *

K62 = '''private void button1_Click(object sender, EventArgs e)
{
    string veri = textBox1.Text;
    for (int i = 0; i < listBox1.Items.Count; i++)
    {
        string data = Convert.ToString(listBox1.Items[i]);
        if (veri == data)
        {
            MessageBox.Show("Ekleyeceğiniz veri daha önce eklenmiştir.");
            listBox1.Items.RemoveAt(i);
        }
    }
    listBox1.Items.Add(veri);
}'''
K63 = '''private void button1_Click(object sender, EventArgs e)
{
    if (radioButton1.Checked == true) { MessageBox.Show("1.sınıf öğrencisiniz."); }
    else if (radioButton2.Checked == true) { MessageBox.Show("2.sınıf öğrencisiniz."); }
    else if (radioButton3.Checked == true) { MessageBox.Show("3.sınıf öğrencisiniz."); }
    else { MessageBox.Show("1.sınıf öğrencisiniz."); }
}'''
K64 = '''private void button1_Click(object sender, EventArgs e)
{
    int[] dizi = new int[6];
    Random uret = new Random();
    for (int i = 0; i < 6; i++)
    {
        dizi[i] = uret.Next(1, 50);
        for (int j = 0; j < i; j++)
        {
            if (dizi[i] == dizi[j])
            {
                i--;
                break;
            }
        }
    }
    label1.Text = Convert.ToString(dizi[0]);
    // ... label2 – label6 aynı biçimde
}'''
K65 = '''string s = "istanbul";
s.ToUpper();
label1.Text = s;                       // a
s = s.ToUpper();
label1.Text = s;                       // b
label1.Text = "ID".ToLower();          // c
label1.Text = "ID".ToLowerInvariant(); // d
label1.Text = "Fırat".ToUpper() + "Fırat".ToLower(); // e'''
K66 = '''private void radioButton3_CheckedChanged(object sender, EventArgs e)
{
    string sonuc = ""; int j = 0;
    string metin = textBox1.Text;
    if (metin[0] != ' ') { sonuc = sonuc + "" + metin[0].ToString().ToUpper(); j = 1; }
    for (int i = j; i < metin.Length; i++)
    {
        if (metin[i] == ' ') { sonuc = sonuc + " " + metin[i + 1].ToString().ToUpper(); i++; }
        else { sonuc = sonuc + "" + metin[i]; }
    }
    label2.Text = sonuc;
}'''

# 6.4 simülasyonu (çözüm doğrulaması için ayrıca çalıştırılır)
def loto(sirali):
    it = iter(sirali); dizi = [0] * 6; satirlar = []; i = 0; n = 0
    while i < 6:
        x = next(it); n += 1; dizi[i] = x; red = None
        for j in range(i):
            if dizi[i] == dizi[j]: red = j; break
        satirlar.append((n, i, x, red))
        if red is not None: pass
        else: i += 1
    return dizi, satirlar, n

LOTO = loto([7, 12, 7, 30, 12, 45, 3, 30, 22])
_t = []
for n, i, x, red in LOTO[1]:
    _t.append([str(n), girdi(str(i)), girdi(str(x)), girdi("red" if red is not None else "kabul", ["kabul", "red"])])
_n = [(f"dizi[{red}] ile aynı; i tekrar {i}" if red is not None else f"dizi[{i}] olarak saklanır") for n, i, x, red in LOTO[1]]

SORULAR = [
Q("6.1", "cikti", "Contains mi, FindStringExact mi?", 2,
  "<code>listBox1</code>'de sırasıyla <b>mesut, hakan, ayşe, ali</b> bulunmaktadır (indisler 0–3). Her ifadenin sonucunu yazın.",
  [],
  [
    tablo("<b>a)</b> Sonuçlar (true / false ya da indis):", ["", "İfade", "Sonuç"],
          [["a", "<code>listBox1.Items.Contains(\"ayşe\")</code>", girdi("true", ["true", "false", "-1", "2"])],
           ["b", "<code>listBox1.Items.Contains(\"Ayşe\")</code>", girdi("false", ["true", "false", "-1", "2"])],
           ["c", "<code>listBox1.Items.Contains(\"ayşe \")</code>", girdi("false", ["true", "false", "-1", "2"])],
           ["d", "<code>listBox1.FindStringExact(\"AYŞE\")</code>", girdi("2", ["true", "false", "-1", "2"])],
           ["e", "<code>listBox1.FindStringExact(\"ay\")</code>", girdi("-1", ["true", "false", "-1", "2"])],
           ["f", "<code>listBox1.FindString(\"ay\")</code>", girdi("2", ["true", "false", "-1", "2"])],
           ["g", "<code>listBox1.FindStringExact(\"veli\")</code>", girdi("-1", ["true", "false", "-1", "2"])]],
          notlar=["Birebir aynı eleman vardır.", "Contains büyük-küçük harfe duyarlıdır.", "Sondaki boşluk da karakterdir.", "FindStringExact duyarsızdır; ayşe 2. indistedir.", "Metnin tamamı “ay” olan eleman yok.", "FindString, “ay” ile <u>başlayan</u> ilk elemanı bulur.", "Eleman yok."]),
    coklusec("<b>b)</b> Senaryo: EKLE düğmesi <code>Items.Contains</code> ile denetler; BUL düğmesi <code>FindStringExact</code> kullanır. Kullanıcı kutuya <b>Ayşe</b> yazıp EKLE'ye, sonra <b>AYŞE</b> yazıp BUL'a basıyor.",
             [("Listeye yeni eleman eklenir mi?", ["Evet; Contains duyarlı olduğundan ayşe ile Ayşe farklı sayılır", "Hayır; zaten vardır"], 0, "Aynı kişi listede iki kez yer alır."),
              ("BUL hangi satırı seçili gösterir?", ["2. indisteki ayşe (ilk eşleşme)", "Yeni eklenen Ayşe", "Hiçbirini"], 0, "Yeni eklenen Ayşe hiçbir zaman bulunamaz.")]),
    yaz("<b>c)</b> EKLE'yi, ekleme ve arama <u>aynı karşılaştırmayı</u> kullanacak şekilde düzeltin (boşlukları da temizleyin).",
        [dict(ad="<code>Trim()</code> ile baştaki/sondaki boşluklar temizleniyor", any=[".Trim()"]),
         dict(ad="<code>FindStringExact(veri) == -1</code> ile denetleniyor", any=["FindStringExact(veri)==-1", "FindStringExact(veri)<0", "FindStringExact(textBox1.Text.Trim())==-1"]),
         dict(ad="Yoksa <code>Items.Add</code>", any=["Items.Add("])],
        '''string veri = textBox1.Text.Trim();
if (listBox1.FindStringExact(veri) == -1)
    listBox1.Items.Add(veri);''', bas="private void button1_Click(object sender, EventArgs e)\n{\n    string veri = textBox1.Text.Trim();\n    \n}"),
  ],
  ack="<b>Contains</b>: bool, harf duyarlı. <b>FindStringExact</b>: indis ya da −1, harf duyarsız. <b>FindString</b>: ile <i>başlayan</i> ilk eleman."),

Q("6.2", "hata", "Uyarı veren ama engellemeyen kod", 3,
  "Bölüm 6.2'deki sunum çözümü (çözüm 2) aşağıdadır.",
  [kod(K62, "Çözüm 2")],
  [
    tablo("<b>a)</b> Listede <b>A, B, C</b> varken kutuya <b>B</b> yazılıp butona basılırsa:", ["Soru", "Cevap"],
          [["Kaç mesaj çıkar?", girdi("1")], ["Liste (virgülle) ne olur?", girdi("A, C, B", mod="liste", gen=14)]],
          notlar=["i = 1'de B bulunur, mesaj çıkar, B silinir.", "Döngü bittikten sonra B sona eklenir; yani tekrarlanan kayıt engellenmemiş, yalnızca sona taşınmıştır."]),
    tablo("<b>b)</b> Listede <b>A, B, B, C</b> varken kutuya <b>B</b> yazılırsa tur tur izleyin:", ["Tur", "i", "Count", "Items[i]", "İşlem", "Liste (tur sonu)"],
          [["1", girdi("0"), girdi("4"), girdi("A"), girdi("—", mod="tire"), girdi("A B B C", mod="liste", gen=10)],
           ["2", girdi("1"), girdi("4"), girdi("B"), girdi("mesaj, RemoveAt(1)", ["—", "mesaj, RemoveAt(1)"]), girdi("A B C", mod="liste", gen=10)],
           ["3", girdi("2"), girdi("3"), girdi("C"), girdi("—", mod="tire"), girdi("A B C", mod="liste", gen=10)],
           ["4", girdi("3"), girdi("3"), girdi("şart yanlış"), girdi("—", mod="tire"), girdi("A B C", mod="liste", gen=10)]],
          notlar=["", "Silme sonrasında ikinci B 1. indise kayar.", "Ama i = 2 olduğu için kayan B atlanır.", "Döngü biter; sonra B tekrar eklenir → son liste A, B, C, B (1 mesaj)."]),
    yaz("<b>c)</b> <code>Contains</code> kullanmadan, yalnızca döngüyle ve <b>hiçbir elemanı silmeden</b> doğru çalışan kodu yazın. (Bayrak değişkeni kullanın.)",
        [dict(ad="Bayrak değişkeni: <code>bool varMi = false;</code>", any=["boolvarMi=false;", "boolbulundu=false;", "boolvar=false;", "boolbayrak=false;", "boolvarmi=false;"]),
         dict(ad="Döngüde yalnızca arama yapılıyor (<code>RemoveAt</code> yok)", yok=["RemoveAt"]),
         dict(ad="Eşleşmede bayrak <code>true</code> yapılıp <code>break;</code>", all=["=true;", "break;"]),
         dict(ad="Karar döngüden <b>sonra</b>: varsa uyarı, yoksa <code>Items.Add</code>", all=["MessageBox.Show(", "Items.Add("])],
        '''private void button1_Click(object sender, EventArgs e)
{
    string veri = textBox1.Text;
    bool varMi = false;                       // bayrak (flag) değişkeni
    for (int i = 0; i < listBox1.Items.Count; i++)
    {
        if (Convert.ToString(listBox1.Items[i]) == veri)
        {
            varMi = true;
            break;                            // bulundu, aramaya gerek kalmadı
        }
    }
    if (varMi)
        MessageBox.Show("Ekleyeceğiniz veri daha önce eklenmiştir.");
    else
        listBox1.Items.Add(veri);
}''', bas="private void button1_Click(object sender, EventArgs e)\n{\n    string veri = textBox1.Text;\n    \n}"),
  ],
  ack="Döngüde <b>ara</b>, sonucu <b>bayrakta</b> tut, kararı <b>döngüden sonra</b> ver. Döngü içinde silme kayma hatası üretir (Bölüm 4)."),

Q("6.3", "hata", "Dördüncü sınıf neden birinci?", 2,
  "Bir öğrenci sınıf seçimi formu yazmış; <code>radioButton1…4</code> sırasıyla 1.–4. Sınıf'tır.",
  [kod(K63, "Click metodu")],
  [
    coklusec("<b>a)</b> Mesaj ne yazar?",
             [("Kullanıcı 4. Sınıf'ı seçip basarsa", ["1.sınıf öğrencisiniz.", "4.sınıf öğrencisiniz.", "Hiçbir şey"], 0, "İlk üç koşul yanlış olduğundan <code>else</code> çalışır."),
              ("Hiçbir seçenek seçmeden basarsa", ["1.sınıf öğrencisiniz.", "Lütfen sınıf seçin", "Hiçbir şey"], 0, "<code>else</code>, “geri kalan her durum” anlamına gelir.")]),
    yaz("<b>b)</b> Dört RadioButton'ı bir dizide toplayıp seçili olanın <code>Text</code>'ini mesajda kullanan, hiçbiri seçili değilse uyaran kodu yazın. <code>MessageBox.Show</code> içinde sınıf numarası elle yazılmasın.",
        [dict(ad="<code>RadioButton[]</code> dizisi", any=["RadioButton[]"]),
         dict(ad="Dizi döngüyle taranıyor (<code>foreach</code>/<code>for</code>)", any=["foreach(RadioButton", "for(inti=0;i<siniflar.Length", "for(inti=0;i<", "foreach(var"]),
         dict(ad="Seçili olan <code>.Checked</code> ile bulunuyor", any=[".Checked"]),
         dict(ad="Mesajda <code>.Text</code> kullanılıyor", any=[".Text+", "+rb.Text", "rb.Text"]),
         dict(ad="Seçili bulununca <code>return;</code>", any=["return;"]),
         dict(ad="Döngü sonunda seçim yapılmadı uyarısı", say=dict(p=["MessageBox.Show("], min=2))],
        '''private void button1_Click(object sender, EventArgs e)
{
    RadioButton[] siniflar = { radioButton1, radioButton2, radioButton3, radioButton4 };
    foreach (RadioButton rb in siniflar)
    {
        if (rb.Checked)
        {
            MessageBox.Show(rb.Text + " öğrencisiniz.");
            return;
        }
    }
    MessageBox.Show("Lütfen sınıfınızı seçiniz.");
}''', bas="private void button1_Click(object sender, EventArgs e)\n{\n    \n}", a="4. sınıf seçiliyken mesaj <i>4. Sınıf öğrencisiniz.</i> olur. Sınıf eklense bile mesaj kodu değişmez."),
  ],
  ack="Aynı türden kontroller bir dizide toplanıp döngüyle işlenir; “geri kalan her durum” (<code>else</code>) ile “seçim yok” karıştırılmamalıdır."),

Q("6.4", "izleme", "Sayısal lotoyu izlemek", 3,
  "Bölüm 6.5'teki loto kodunda <code>uret.Next(1, 50)</code> çağrısının sırasıyla şu değerleri ürettiğini varsayalım: <b>7, 12, 7, 30, 12, 45, 3, 30, 22</b>.",
  [kod(K64, "Loto kodu")],
  [
    tablo("<b>a)</b> Her <code>Next</code> çağrısında <code>i</code>'nin değerini, üretilen sayıyı ve sonucu yazın. Sonuç: <code>kabul</code> (sayı saklanır) ya da <code>red</code> (önceki bir sayıyla çakıştı).",
          ["Çağrı", "i", "Üretilen", "Sonuç"], _t,
          notlar=_n),
    metin("<b>b)</b> Labellarda hangi sayılar görünür? (virgülle, sırayla) ", ["7, 12, 30, 45, 3, 22", "7,12,30,45,3,22"], "Toplam Next çağrısı: 9."),
    metin("<b>b2)</b> Toplam kaç kez <code>Next</code> çağrılmıştır?", ["9"], ""),
    sec("<b>c)</b> <code>Next(1, 49)</code> yazılsaydı 49 çıkabilir miydi?", ["Evet", "Hayır; üst sınır sonuca dahil değildir, en fazla 48 üretir", "Yalnızca ilk çağrıda", "Yalnızca i = 5 iken"], 1, "<code>Next(alt, ust)</code>: alt dahil, ust hariç."),
    sec("<b>d)</b> Bir öğrenci <code>break</code> satırı silinirse aynı sayının iki kez çıkabileceğini iddia ediyor. Doğru mu?",
        ["Doğru; i-- sonrası iç döngü sürer ve aynı sayıyı tekrar karşılaştırır",
         "Yanlış; i-- sonrası dizi[i] bir önceki, zaten kabul edilmiş sayıyı gösterir ve kalan karşılaştırmalar eşleşmez; dış döngünün i++ adımı çakışan konuma geri döner. break yalnızca gereksiz karşılaştırmaları önler",
         "Doğru; program sonsuz döngüye girer", "Yanlış; çünkü Random aynı sayıyı hiç üretmez"], 1,
        "Bu kitapta break satırı silinmiş kod 200 000 kez çalıştırılarak doğrulanmıştır: sonuç yine doğrudur."),
  ],
  ack="Benzersiz sayı üretmek: yeni sayıyı öncekilerle karşılaştır; çakışırsa <code>i--</code> ile aynı konumu yeniden üret."),

Q("6.5", "cikti", "Değişmeyen metin", 3,
  "Kod <b>Türkçe</b> ayarlı bilgisayarda çalışıyor. Her satırdan sonra <code>label1</code>'de ne yazar?",
  [kod(K65, "Kod")],
  [
    tablo("<b>a)</b> label1 değerleri:", ["", "label1"],
          [["a", girdi("istanbul")], ["b", girdi("İSTANBUL", hasas=True)], ["c", girdi("ıd", hasas=True)], ["d", girdi("id", hasas=True)], ["e", girdi("FIRATfırat", hasas=True)]],
          notlar=["<code>ToUpper</code> sonucu atanmadı; string değiştirilemez.", "Sonuç geri atandı; Türkçe ayarda i → İ.", "Türkçe ayarda I → ı.", "Invariant (dilden bağımsız) dönüşümde I → i.", "ı → I, I → ı; iki metin birleştirilir."]),
    sec("<b>b)</b> Kayıtlı kullanıcı adı <b>ADMIN</b>, kullanıcı <b>admin</b> yazmıştır. <code>kayitli.ToLower() == giris.ToLower()</code> Türkçe ayarlı bilgisayarda neden false verir?",
        ["ToLower yalnızca ilk harfi çevirir", "Türkçe ayarda <code>ADMIN.ToLower()</code> “admın” olur (I → ı); “admin” ile eşit değildir", "== operatörü metinlerde çalışmaz", "Boşluk karakteri vardır"], 1, ""),
    yaz("<b>c)</b> Karşılaştırmayı harf duyarsız ve dilden bağımsız olacak şekilde yazın.",
        [dict(ad="<code>string.Equals(..., StringComparison.OrdinalIgnoreCase)</code> ya da <code>ToLowerInvariant()</code>", any=["StringComparison.OrdinalIgnoreCase", "ToLowerInvariant()", "StringComparison.InvariantCultureIgnoreCase"])],
        'bool ayni = string.Equals(kayitli, giris, StringComparison.OrdinalIgnoreCase);',
        bas="bool ayni = ", a="Alternatif: <code>kayitli.ToLowerInvariant() == giris.ToLowerInvariant()</code>"),
  ],
  ack="<code>ToUpper</code>/<code>ToLower</code> yeni bir metin döndürür; sonuç geri atanmalıdır. Türkçe ayarda i ↔ İ ve ı ↔ I dönüşür."),

Q("6.6", "duzen", "İlk harfi büyüt: sınır durumları", 3,
  "Bölüm 6.8'deki sunum çözümünü düşünün.",
  [kod(K66, "Sunum çözümü")],
  [
    tablo("<b>a)</b> Kutuya <b>mehmet ali</b> (10 karakter, sonda boşluk yok) yazıldığında izleme yapın. Döngü <code>i = 1</code>'den başlar (ilk harf boşluk değil).", ["i (tur başı)", "metin[i]", "İşlem", "sonuc (tur sonu)"],
          [["1–5", "e h m e t", "olduğu gibi eklenir", girdi("Mehmet")],
           ["6", "boşluk", "“ ” + “A” eklenir, i++ → 7", girdi("Mehmet A")],
           ["8–9", "l i", "olduğu gibi eklenir", girdi("Mehmet Ali")]],
          notlar=["", "Boşluktan sonraki harf büyütülüp eklenir, ardından o harf atlanır.", ""]),
    sec("<b>a2)</b> <code>i++</code> satırı kaldırılsaydı sonuç ne olurdu?", ["Mehmet Ali", "Mehmet Aali", "Mehmet ali", "Hata"], 1,
        "Boşluktan sonraki harf hem büyük hem küçük olarak iki kez eklenirdi."),
    sec("<b>b)</b> Kutuya <b>ali␣␣veli</b> (iki boşluk) yazıldığında ikinci kelime neden büyütülmez?", ["Çünkü ToUpper yalnızca ilk kelimede çalışır", "İlk boşlukta “boşluk + sonraki karakter” eklenir; sonraki karakter de boşluktur, <code>i++</code> onu atlar ve <code>v</code> sıradan karakter gibi küçük eklenir", "Çünkü döngü erken biter", "Çünkü v harfi büyütülemez"], 1, ""),
    yaz("<b>c)</b> Boş kutu hatasını yalnızca <u>başa eklenecek bir if satırıyla</u> önleyin; ayrıca sonda boşluk bulunan metin hatasını önlemek için döngüdeki boşluk koşulunu yazın.",
        [dict(ad="Boş metin denetimi: <code>metin.Length == 0</code> → <code>label2.Text = \"\"; return;</code>", all=["metin.Length==0", "return;"]),
         dict(ad="Sınır denetimli koşul: <code>metin[i] == ' ' &amp;&amp; i + 1 &lt; metin.Length</code>", any=["metin[i]==''&&i+1<metin.Length", "metin[i]==''&&metin.Length>i+1", "metin[i]==''&&i<metin.Length-1"], bosluksuz=True)],
        '''if (metin.Length == 0) { label2.Text = ""; return; }
// ...
if (metin[i] == ' ' && i + 1 < metin.Length)''', bas="", a="Böylece son karakter boşluksa <code>metin[i + 1]</code>'e erişilmez (IndexOutOfRange)."),
  ],
  ack="Metinde indisle gezerken <b>sınırı</b> her zaman denetleyin: <code>i + 1 &lt; Length</code>."),

Q("6.7", "yaz", "Kredi sınırlı ders seçimi", 3,
  "Ders seçimi formunu geliştirin. Dersler <code>checkBox1</code>–<code>checkBox6</code>, kredileri sırasıyla <b>5, 4, 4, 5, 3, 2</b>. CheckBox'ları ve kredileri iki ayrı dizide tutun (aynı indis aynı ders). Hiç ders seçilmemişse uyarı; toplam kredi 15'i aşarsa uyarı ve liste değişmesin. Geçerli seçimde <code>listBox1</code>'e <i>ders adı · kredi</i> satırları eklensin, <code>label1</code>'e <i>4 ders, 14 kredi</i> biçiminde özet yazılsın.",
  [],
  [
    yaz("<b>a)</b> button1_Click metodunu yazın.",
        [dict(ad="<code>CheckBox[]</code> ve <code>int[]</code> dizileri", all=["CheckBox[]", "int[]"]),
         dict(ad="Dizi uzunluğu <code>Length</code> ile döngüde kullanılıyor", any=[".Length"]),
         dict(ad="Seçili dersin kredisi toplanıyor (<code>.Checked</code>, <code>toplamKredi +=</code>)", all=[".Checked", "toplamKredi+=krediler["]),
         dict(ad="Hiç ders yoksa uyarı + <code>return;</code> (<code>adet == 0</code>)", any=["adet==0", "adet<1"]),
         dict(ad="15 üstü uyarı + <code>return;</code> (liste henüz değişmeden)", any=["toplamKredi>15"]),
         dict(ad="Liste temizlenip yeniden dolduruluyor (<code>Items.Clear()</code>, <code>Items.Add</code>)", all=["Items.Clear()", "Items.Add("]),
         dict(ad="Özet <code>label1.Text</code>'e yazılıyor", any=["label1.Text=adet+"])],
        '''private void button1_Click(object sender, EventArgs e)
{
    CheckBox[] dersler = { checkBox1, checkBox2, checkBox3, checkBox4, checkBox5, checkBox6 };
    int[] krediler = { 5, 4, 4, 5, 3, 2 };
    int adet = 0, toplamKredi = 0;
    for (int i = 0; i < dersler.Length; i++)
    {
        if (dersler[i].Checked)
        {
            adet++;
            toplamKredi += krediler[i];
        }
    }
    if (adet == 0)
    {
        MessageBox.Show("En az bir ders seçmelisiniz.");
        return;
    }
    if (toplamKredi > 15)
    {
        MessageBox.Show("Kredi sınırı aşıldı: " + toplamKredi + " / 15");
        return;
    }
    listBox1.Items.Clear();
    for (int i = 0; i < dersler.Length; i++)
    {
        if (dersler[i].Checked)
            listBox1.Items.Add(dersler[i].Text + "\\t" + krediler[i] + " kredi");
    }
    label1.Text = adet + " ders, " + toplamKredi + " kredi";
}''', bas="private void button1_Click(object sender, EventArgs e)\n{\n    \n}"),
    tablo("<b>b)</b> Kullanıcı 1., 2., 4. ve 6. dersleri seçerse:", ["Soru", "Cevap"],
          [["Toplam kredi", girdi("16")], ["Sonuç", girdi("Kredi sınırı aşıldı: 16 / 15")]],
          notlar=["5 + 4 + 5 + 2 = 16 &gt; 15", "Uyarı çıkar, liste değişmez."]),
    metin("<b>c)</b> Kullanıcı 1., 2. ve 5. dersleri seçerse <code>label1</code>'de ne yazar?", ["3 ders, 12 kredi"], "5 + 4 + 3 = 12."),
  ],
  ack="Paralel diziler: aynı indis aynı dersi gösterir. Önce topla ve denetle; liste ancak denetim geçilince değişir."),
]
