from dsl import *

K32A = '''int a = 5, b = 0, c = 1;
while (c <= a)
{
    b += c;
    c += 2;
}
label1.Text = "b = " + b;'''
K32B = '''string s = "";
for (int i = 1; i <= 4; i++)
{
    for (int j = 1; j <= i; j++)
    {
        s += j;
    }
    s += " ";
}
label1.Text = s;'''
K33 = '''private void button1_Click(object sender, EventArgs e)
{
    int sayi1 = Convert.ToInt32(textBox1.Text);
    int sayi2 = Convert.ToInt32(textBox2.Text);
    label1.Text = "Ortalama: " + sayi1 + sayi2 / 2;
}'''
K36 = '''private void button1_Click(object sender, EventArgs e)
{
    double bakiye = Convert.ToDouble(textBox1.Text);   // 10000
    int faiz = Convert.ToInt32(textBox2.Text);         // 40
    int yil = Convert.ToInt32(textBox3.Text);          // 3

    for (int i = 1; i <= yil; i++)
    {
        bakiye = bakiye * (1 + faiz / 100);
        listBox1.Items.Add(i + ". yıl: " + bakiye);
    }
}'''

SORULAR = [
Q("3.1", "cikti", "Ekranda ne yazar?", 2,
  "Aşağıdaki her satır bir butonun Click metodunda <b>tek başına</b> çalıştırılıyor. Bilgisayarın bölge ayarı <b>Türkçe</b>. Mesaj kutusunda tam olarak ne yazar?",
  [],
  [
    tablo("Her kod için mesaj kutusundaki metni yazın.", ["", "Kod", "Çıktı"],
          [["a", "<code>MessageBox.Show(\"Toplam: \" + 2 + 3);</code>", girdi("Toplam: 23")],
           ["b", "<code>MessageBox.Show(2 + 3 + \" adet\");</code>", girdi("5 adet")],
           ["c", "<code>int a = 7, b = 2; double s = a / b; MessageBox.Show(s.ToString());</code>", girdi("3")],
           ["d", "<code>textBox1.Text = \"12\"; textBox2.Text = \"8\"; MessageBox.Show(textBox1.Text + textBox2.Text);</code>", girdi("128")],
           ["e", "<code>MessageBox.Show(Math.Round(2.5) + \" / \" + Math.Round(3.5));</code>", girdi("2 / 4")],
           ["f", "<code>int s = 0; for (int i = 1; i &lt;= 10; i++) if (i % 3 == 0) s += i; MessageBox.Show(s.ToString());</code>", girdi("18")],
           ["g", "<code>MessageBox.Show(Convert.ToDouble(\"5.4\").ToString());</code> (Türkçe Windows)", girdi("54")],
           ["h", "<code>double t = 0.1 + 0.2; MessageBox.Show((t == 0.3).ToString());</code>", girdi("False")],
           ["i", "<code>MessageBox.Show(Math.Ceiling(-10.3) + \" ve \" + Math.Floor(-10.3));</code>", girdi(["-10 ve -11", "−10 ve −11"])]],
          notlar=["İşlem soldan sağa yapılır: önce <code>\"Toplam: \" + 2</code> metin olur, sonra 3 bu metnin sonuna eklenir.",
                  "Önce <code>2 + 3</code> iki sayı olarak toplanır (5), sonra metinle birleşir.",
                  "<code>a / b</code> iki int'in bölümüdür ve 3 olur; double'a atanırken zaten 3'tür.",
                  "İki string birleştirilir, toplama yapılmaz.",
                  "Bankacı yuvarlaması: tam ortadaki değerler çift sayıya yuvarlanır (2.5 → 2, 3.5 → 4).",
                  "1–10 arasında 3'e bölünenler: 3 + 6 + 9.",
                  "Türkçe ayarda ondalık ayırıcı virgüldür; nokta binlik ayırıcı sayılır ve <code>\"5.4\"</code> metni 54 okunur.",
                  "0,1 ve 0,2 ikili sistemde tam gösterilemez; toplamları 0,30000000000000004'tür. Ondalıklılar <code>==</code> ile karşılaştırılmamalıdır.",
                  "<code>Ceiling</code> sayı doğrusunda yukarıya (−10), <code>Floor</code> aşağıya (−11) yuvarlar."],
          kodlu=[]),
  ],
  ack="Formdan gelen her veri <code>string</code>'dir. <code>+</code> metinle birlikte kullanılınca birleştirir; iki int'in bölümü int'tir."),

Q("3.2", "izleme", "İki döngüyü izlemek", 2,
  "Önce <i>while</i> döngüsünü, sonra iç içe <i>for</i> döngülerini izleyin.",
  [kod(K32A, "Kod 1"), kod(K32B, "Kod 2")],
  [
    tablo("<b>a)</b> Kod 1 için izleme tablosunu doldurun.", ["Tur", "c (başta)", "c &lt;= a ?", "b (tur sonu)", "c (tur sonu)"],
          [["1", girdi("1"), girdi("doğru", ["doğru", "yanlış"]), girdi("1"), girdi("3")],
           ["2", girdi("3"), girdi("doğru", ["doğru", "yanlış"]), girdi("4"), girdi("5")],
           ["3", girdi("5"), girdi("doğru", ["doğru", "yanlış"]), girdi("9"), girdi("7")],
           ["4", girdi("7"), girdi("yanlış", ["doğru", "yanlış"]), girdi("—", gen=4, mod="tire"), girdi("—", gen=4, mod="tire")]],
          notlar=["", "", "", "Şart sağlanmaz, döngü biter; gövde çalışmaz."]),
    metin("<b>a2)</b> <code>label1</code>'de ne yazar?", ["b = 9"], "Kod 1'den 5'e kadar tek sayıları toplar: 1 + 3 + 5 = 9."),
    tablo("<b>b)</b> Kod 2'de dış döngünün her turu sonunda <code>s</code> değişkeni ne olur? (Boşluk karakterini de düşünün.)", ["i", "s (tur sonu)"],
          [["1", girdi("1 ")], ["2", girdi("1 12 ")], ["3", girdi("1 12 123 ")], ["4", girdi("1 12 123 1234 ")]],
          notlar=["İç döngü 1'den i'ye kadar sayar; <code>s += j</code> sayıyı metnin sonuna ekler, sonra bir boşluk eklenir.", "", "", ""]),
    sec("<b>b2)</b> Kod 2'nin sonunda <code>label1</code>'de görünen metnin sonunda ne bulunur?", ["Hiçbir şey", "Bir boşluk karakteri", "Bir satır başı", "4"], 1,
        "Her dış turun sonunda <code>s += \" \"</code> çalıştığı için son rakamdan sonra da bir boşluk vardır."),
    adim("Kod 2'nin ilk iki dış turunu satır satır izle.", 1,
         [dict(s=[], n="Başlangıç.", g=[dict(ad="s", d='""'), dict(ad="i", d="—"), dict(ad="j", d="—")]),
          dict(s=[2, 4, 6], n="i = 1: iç döngü yalnızca j = 1 için çalışır, s = \"1\".", g=[dict(ad="s", d='"1"'), dict(ad="i", d="1"), dict(ad="j", d="1")]),
          dict(s=[8], n="Dış tur sonunda boşluk eklenir.", g=[dict(ad="s", d='"1 "'), dict(ad="i", d="1"), dict(ad="j", d="—")]),
          dict(s=[4, 6], n="i = 2: j = 1, 2 için sayılar eklenir.", g=[dict(ad="s", d='"1 12"'), dict(ad="i", d="2"), dict(ad="j", d="2")]),
          dict(s=[8], n="Boşluk eklenir.", g=[dict(ad="s", d='"1 12 "'), dict(ad="i", d="2"), dict(ad="j", d="—")])]),
  ],
  ack="İzleme tablosu: her turda değişkenlerin değerini bir satıra yazın. <code>s += j</code> sayıyı toplamaz, <i>metin olarak</i> sona ekler."),

Q("3.3", "hata", "Ortalama yanlış çıkıyor", 2,
  "İki sayının ortalamasını hesaplaması beklenen kod hatasız derlenir ama yanlış çalışır.",
  [kod(K33, "Click metodu")],
  [
    tablo("<b>a)</b> Programın <u>gerçek</u> davranışını yazın. (Girişin sayı olmadığı veya boş olduğu durumda hata adını yazın.)", ["textBox1", "textBox2", "Beklenen", "Gerçek davranış"],
          [["10", "20", "Ortalama: 15", girdi("Ortalama: 1010")],
           ["7", "8", "Ortalama: 7,5", girdi("Ortalama: 74")],
           ["4,5", "3", "Ortalama: 3,75", girdi("FormatException", gen=18)],
           ["(boş)", "3", "Uyarı", girdi("FormatException", gen=18)]],
          notlar=["<code>sayi2 / 2</code> = 10 ve bu, metne eklenir: \"Ortalama: \" + 10 + 10.", "8 / 2 = 4; yani 7 ve 4 yan yana yazılır.", "<code>Convert.ToInt32</code> ondalıklı metni sayıya çeviremez.", "Boş metin sayıya çevrilemez."]),
    coklusec("<b>b)</b> Koddaki üç sorunu eşleştirin.",
             [("“Ortalama: ” + sayi1 + sayi2 / 2", ["İşlem önceliği ve metin birleştirme (<code>/</code>, <code>+</code>'dan önce yapılır; sonra sayılar metne eklenir)", "Değişken adı hatası", "Eksik using"], 0, "Parantezle <code>(sayi1 + sayi2) / 2</code> yazılmalıdır."),
              ("int sayi1, int sayi2", ["Tamsayı bölmesi: 7,5 yerine 7", "Tür adı yanlış", "Bellek taşması"], 0, "int / int sonucu int'tir; ondalık için <code>double</code> kullanılmalıdır."),
              ("Convert.ToInt32(textBox1.Text)", ["Giriş denetimi yok: ondalıklı ya da boş girişte hata", "Büyük harf hatası", "Çok yavaş çalışır"], 0, "<code>TryParse</code> hatalı girişi yakalar.")]),
    yaz("<b>c)</b> Kodu dört test satırında da beklenen sonucu verecek şekilde yeniden yazın. Hatalı girişte <code>Lütfen iki geçerli sayı giriniz.</code> yazılsın.",
        [dict(ad="Sayılar <code>double</code> türünde tutuluyor", any=["doublesayi1", "doublesayi1,sayi2"]),
         dict(ad="<code>double.TryParse</code> ile denetleniyor", say=dict(p=["double.TryParse(textBox1.Text", "double.TryParse(textBox2.Text"], min=2)),
         dict(ad="Hatalı girişte <code>return;</code>", any=["return;"]),
         dict(ad="Toplam parantez içinde: <code>(sayi1 + sayi2) / 2</code>", any=["(sayi1+sayi2)/2"]),
         dict(ad="Sonuç <code>label1.Text</code>'e yazılıyor", any=["label1.Text="])],
        '''private void button1_Click(object sender, EventArgs e)
{
    double sayi1, sayi2;
    if (!double.TryParse(textBox1.Text, out sayi1) || !double.TryParse(textBox2.Text, out sayi2))
    {
        label1.Text = "Lütfen iki geçerli sayı giriniz.";
        return;
    }
    double ortalama = (sayi1 + sayi2) / 2;
    label1.Text = "Ortalama: " + ortalama;
}''', bas="private void button1_Click(object sender, EventArgs e)\n{\n    \n}"),
  ],
  ack="Üç düzeltme: <b>parantez</b> (önce topla), <b>double</b> (ondalığı koru), <b>TryParse</b> (hatalı girişi yakala)."),

Q("3.4", "duzen", "Dört işlemi iyileştirmek", 3,
  "Dört işlem hesap makinesinde <code>textBox1</code>, <code>textBox2</code> ve dört <code>radioButton</code> (1: +, 2: −, 3: ×, 4: ÷) vardır. Sonucu <code>MessageBox</code> ile gösteren kodu şu şartlarla yeniden yazın: (1) sayı dışı girişte program kapanmasın, kullanıcı uyarılsın; (2) işlem seçilmemişse <i>Lütfen bir işlem seçiniz.</i>; (3) bölmede ikinci sayı 0 ise <i>Sıfıra bölme yapılamaz.</i>; (4) sonucu gösteren <code>MessageBox.Show</code> satırı kodda yalnızca <b>bir kez</b> geçsin.",
  [],
  [
    yaz("<b>a)</b> Metodu yazın.",
        [dict(ad="<code>double.TryParse</code> ile iki sayı da denetleniyor", say=dict(p=["double.TryParse(textBox1.Text", "double.TryParse(textBox2.Text"], min=2)),
         dict(ad="Dört radioButton'un dördü de denetleniyor", say=dict(p=["radioButton1.Checked", "radioButton2.Checked", "radioButton3.Checked", "radioButton4.Checked"], min=4)),
         dict(ad="Sıfıra bölme denetimi: <code>sayi2 == 0</code>", any=["sayi2==0"]),
         dict(ad="İşlem seçilmediğinde mesaj + <code>return;</code> (else dalı)", any=["Lütfenbirişlemseçiniz"]),
         dict(ad="Sonuç <code>MessageBox.Show</code> kodda <b>tek</b> kez geçiyor (uyarılar hariç, \"Sonuç\" ile başlayan)", say=dict(p=['MessageBox.Show("Sonuç:"+sonuc)'], min=1, max=1))],
        '''private void button1_Click(object sender, EventArgs e)
{
    double sayi1, sayi2, sonuc;
    if (!double.TryParse(textBox1.Text, out sayi1) || !double.TryParse(textBox2.Text, out sayi2))
    {
        MessageBox.Show("Lütfen iki geçerli sayı giriniz.");
        return;
    }
    if (radioButton1.Checked)
        sonuc = sayi1 + sayi2;
    else if (radioButton2.Checked)
        sonuc = sayi1 - sayi2;
    else if (radioButton3.Checked)
        sonuc = sayi1 * sayi2;
    else if (radioButton4.Checked)
    {
        if (sayi2 == 0)
        {
            MessageBox.Show("Sıfıra bölme yapılamaz.");
            return;
        }
        sonuc = sayi1 / sayi2;
    }
    else
    {
        MessageBox.Show("Lütfen bir işlem seçiniz.");
        return;
    }
    MessageBox.Show("Sonuç: " + sonuc);
}''', bas="private void button1_Click(object sender, EventArgs e)\n{\n    \n}"),
    coklusec("<b>b)</b> Ek soru: İyileştirme yapılmamış sunum çözümünde ikinci sayıya 0 girilip bölme seçilirse ne olur?",
             [("double ile bölme (<code>5.0 / 0</code>)", ["Program kapanır, DivideByZeroException", "Hata oluşmaz; sonuç sonsuz (∞ / Infinity) olur", "Sonuç 0 olur"], 1, "Kayan noktalı sayılarda sıfıra bölme hata fırlatmaz. <code>0.0 / 0</code> ise NaN verir."),
              ("int ile bölme (<code>5 / 0</code>)", ["Program kapanır, DivideByZeroException", "Hata oluşmaz; sonuç sonsuz olur", "Sonuç 0 olur"], 0, "Tamsayı bölmesinde sıfıra bölme çalışma anı hatasıdır.")]),
  ],
  ack="Her iki durumda da kullanıcıyı <u>önceden</u> uyarmak doğru yaklaşımdır. <code>return;</code> kalıbı iç içe <code>if</code> yığınlarını önler."),

Q("3.5", "yaz", "Harf notu hesaplayıcı", 3,
  "<code>textBox1</code>'e vize, <code>textBox2</code>'ye final notu girilir; butona tıklanınca <code>label1</code>'e ortalama ve harf notu yazılır. <b>Ortalama = vize × 0,4 + final × 0,6</b> (virgülden sonra 2 basamağa yuvarlanır). <b>Final barajı:</b> final 50'nin altındaysa ortalamaya bakılmadan <b>FF</b>. Ölçek: 90–100 AA · 85–89,99 BA · 80–84,99 BB · 75–79,99 CB · 70–74,99 CC · 60–69,99 DC · 50–59,99 DD · 50 altı FF. Notlar sayı değilse ya da 0–100 dışındaysa uyarı verilsin.",
  [],
  [
    yaz("<b>a)</b> Metodu yazın.",
        [dict(ad="İki not <code>double.TryParse</code> ile okunuyor", say=dict(p=["double.TryParse(textBox1.Text", "double.TryParse(textBox2.Text"], min=2)),
         dict(ad="0–100 aralığı denetleniyor", say=dict(p=["<0", ">100"], min=2)),
         dict(ad="Ortalama <code>Math.Round(…, 2)</code> ile yuvarlanıyor", any=["Math.Round(vize*0.4+final*0.6,2)", "Math.Round(final*0.6+vize*0.4,2)", "Math.Round(0.4*vize+0.6*final,2)", "Math.Round(0.6*final+0.4*vize,2)"]),
         dict(ad="Final barajı: <code>final &lt; 50</code> → FF", any=["final<50"]),
         dict(ad="Harf eşikleri 90, 85, 80, 75, 70, 60, 50 kullanılıyor", say=dict(p=[">=90", ">=85", ">=80", ">=75", ">=70", ">=60", ">=50"], min=7)),
         dict(ad="Sonuç <code>label1.Text</code>'e yazılıyor", any=["label1.Text="])],
        '''private void button1_Click(object sender, EventArgs e)
{
    double vize, final;
    if (!double.TryParse(textBox1.Text, out vize) || !double.TryParse(textBox2.Text, out final))
    {
        MessageBox.Show("Notları sayı olarak giriniz.");
        return;
    }
    if (vize < 0 || vize > 100 || final < 0 || final > 100)
    {
        MessageBox.Show("Notlar 0 ile 100 arasında olmalıdır.");
        return;
    }
    double ortalama = Math.Round(vize * 0.4 + final * 0.6, 2);
    string harf;
    if (final < 50)
        harf = "FF";
    else if (ortalama >= 90)
        harf = "AA";
    else if (ortalama >= 85)
        harf = "BA";
    else if (ortalama >= 80)
        harf = "BB";
    else if (ortalama >= 75)
        harf = "CB";
    else if (ortalama >= 70)
        harf = "CC";
    else if (ortalama >= 60)
        harf = "DC";
    else if (ortalama >= 50)
        harf = "DD";
    else
        harf = "FF";
    label1.Text = "Ortalama: " + ortalama + "   Harf notu: " + harf;
}''', bas="private void button1_Click(object sender, EventArgs e)\n{\n    \n}"),
    tablo("<b>b)</b> Programınız için test tablosunu doldurun. (Ondalık ayırıcı virgüldür.)", ["Vize", "Final", "Ortalama", "Harf"],
          [["40", "70", girdi("58"), girdi("DD")], ["90", "45", girdi("63"), girdi("FF")], ["85", "95", girdi("91"), girdi("AA")],
           ["80", "87", girdi("84,2"), girdi("BB")], ["70", "86", girdi("79,6"), girdi("CB")], ["2", "82", girdi("50"), girdi("DD")]],
          notlar=["0,4×40 + 0,6×70 = 16 + 42 = 58.", "Final 45 &lt; 50 olduğundan ortalama 63 olsa da <b>FF</b>.", "", "", "", "Matematikte tam 50; yuvarlama sayesinde DD."]),
    sec("<b>c)</b> Son satırı <code>Math.Round</code> kullanmadan denerseniz ne olur?",
        ["Aynı sonuç: DD", "<code>2 × 0,4 + 82 × 0,6</code> double ile 49,99999999999999 çıkar; sonuç 50 olması gerekirken program FF verir", "Program derlenmez", "Program kapanır"], 1,
        "Kayan nokta hatası. Not, para gibi kesinlik gerektiren hesaplarda ya yuvarlama yapılmalı ya da <code>decimal</code> kullanılmalıdır."),
  ],
  ack="Eşik karşılaştırmalarında (<code>&gt;= 50</code>) kayan nokta hatası sınırda yanlış harf üretebilir: önce yuvarla, sonra karşılaştır."),

Q("3.6", "hata", "Faiz büyümüyor", 2,
  "Anapara (<code>textBox1</code>), yıllık faiz yüzdesi (<code>textBox2</code>) ve yıl sayısı (<code>textBox3</code>) girilir; her yılın sonundaki bakiye <code>listBox1</code>'e yazılır. Kullanıcı <b>10000, 40, 3</b> girdiğinde listede üç satırın da 10000 olduğu görülmüştür.",
  [kod(K36, "Click metodu")],
  [
    sec("<b>a)</b> Bakiyenin hiç artmamasının nedeni 9. satırda nedir?",
        ["<code>faiz / 100</code> iki int'in bölümüdür; 40 / 100 = 0 olur ve çarpan (1 + 0) = 1 kalır", "<code>bakiye</code> double olduğu için çarpılamaz", "<code>for</code> döngüsü yalnızca bir kez çalışır", "Convert.ToDouble yanlış sonuç verir"], 0,
        "<code>faiz</code> int olduğundan <code>faiz / 100</code> tamsayı bölmesidir."),
    yaz("<b>b)</b> Kodu düzeltin: her yılın bakiyesi 2 basamağa yuvarlanarak yazılsın; döngü bittikten sonra aynı sonuç <code>Math.Pow</code> ile bileşik faiz formülünden hesaplanıp <code>label1</code>'e yazılsın.",
        [dict(ad="<code>faiz</code> double (ya da <code>/ 100.0</code>)", any=["doublefaiz=Convert.ToDouble(textBox2.Text)", "faiz/100.0", "doublefaiz=double.Parse(textBox2.Text)"]),
         dict(ad="<code>Math.Round(bakiye, 2)</code> listeye yazılıyor", any=["Math.Round(bakiye,2)"]),
         dict(ad="Başlangıç anaparası ayrıca saklanıyor", any=["baslangic=bakiye", "doublebaslangic=bakiye", "doublebaslangic=Convert.ToDouble(textBox1.Text)", "baslangic=Convert.ToDouble(textBox1.Text)"]),
         dict(ad="<code>Math.Pow(1 + faiz / 100, yil)</code>", any=["Math.Pow(1+faiz/100,yil)", "Math.Pow(1+faiz/100.0,yil)"]),
         dict(ad="Sonuç <code>label1.Text</code>'e yazılıyor", any=["label1.Text="])],
        '''private void button1_Click(object sender, EventArgs e)
{
    double bakiye = Convert.ToDouble(textBox1.Text);
    double faiz = Convert.ToDouble(textBox2.Text);
    int yil = Convert.ToInt32(textBox3.Text);
    double baslangic = bakiye;
    listBox1.Items.Clear();
    for (int i = 1; i <= yil; i++)
    {
        bakiye = bakiye * (1 + faiz / 100);
        listBox1.Items.Add(i + ". yıl: " + Math.Round(bakiye, 2));
    }
    double formul = baslangic * Math.Pow(1 + faiz / 100, yil);
    label1.Text = "Formül ile: " + Math.Round(formul, 2);
}''', bas="private void button1_Click(object sender, EventArgs e)\n{\n    \n}"),
    tablo("<b>c)</b> Düzeltilmiş programda 10000 / 40 / 3 girişi için görünen değerler:", ["Yer", "Değer"],
          [["listBox1, 1. yıl", girdi("14000")], ["listBox1, 2. yıl", girdi("19600")], ["listBox1, 3. yıl", girdi("27440")], ["label1", girdi("27440")]],
          notlar=["10000 × 1,4", "14000 × 1,4", "19600 × 1,4", "10000 × 1,4³ = 27440 (<code>Formül ile: 27440</code>)"]),
  ],
  ack="Yuvarlama yapılmasaydı formül sonucu bazı .NET sürümlerinde 27439,999999999993 görünürdü; bu da kayan nokta hatasıdır."),
]
