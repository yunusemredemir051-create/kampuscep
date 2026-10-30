from dsl import *

K41 = '''listBox1.Items.RemoveAt(1);
listBox1.Items.Add("Van");
listBox1.Items.Remove("İzmir");
listBox1.Items.RemoveAt(listBox1.Items.Count - 1);
listBox1.Items.Add("Bursa");
listBox1.Items.RemoveAt(0);
listBox1.SelectedIndex = 1;'''
K42A = '''private void button1_Click(object sender, EventArgs e)   // Tümünü Sil (A)
{
    for (int i = 0; i < listBox1.Items.Count; i++)
    {
        listBox1.Items.RemoveAt(i);
    }
}'''
K42B = '''private void button2_Click(object sender, EventArgs e)   // Tümünü Sil (B)
{
    for (int i = 0; i < 5; i++)
    {
        listBox1.Items.RemoveAt(i);
    }
}'''
K43 = '''private void Form1_Load(object sender, EventArgs e)
{
    comboBox1.Items.AddRange(new string[] { "kırmızı", "beyaz", "mavi" });
}
private void comboBox1_SelectedIndexChanged(object sender, EventArgs e)
{
    if (comboBox1.SelectedIndex == 1)
        this.BackColor = Color.Red;
    if (comboBox1.SelectedIndex == 2)
        this.BackColor = Color.White;
    if (comboBox1.Text == "Mavi")
        this.BackColor = Color.Blue;
}
private void button1_Click(object sender, EventArgs e)   // listBox1: Seçili Sil
{
    listBox1.Items.RemoveAt(listBox1.SelectedIndex);
}'''
K45 = '''private void Form1_Load(object sender, EventArgs e)
{
    comboBox1.Items.AddRange(new string[] { "Elazığ", "Malatya" });
}

private void comboBox1_SelectedIndexChanged(object sender, EventArgs e)
{
    comboBox2.Items.Clear();
    comboBox2.Text = "";
    if (comboBox1.SelectedIndex == 0)
        comboBox2.Items.AddRange(new string[] { "Baskil", "Keban", "Palu" });
    else if (comboBox1.SelectedIndex == 1)
        comboBox2.Items.AddRange(new string[] { "Battalgazi", "Darende", "Yeşilyurt" });
}'''

def L(*e): return " · ".join(f"{i}: {x}" for i, x in enumerate(e))
SORULAR = [
Q("4.1", "izleme", "Liste nasıl değişir?", 2,
  "<code>listBox1</code> başlangıçta şöyledir: <b>0: Ankara · 1: Bursa · 2: Elazığ · 3: İzmir · 4: Malatya</b>. Bir butona tıklandığında aşağıdaki yedi satır sırasıyla çalıştırılıyor.",
  [kod(K41, "Yedi satır")],
  [
    tablo("<b>a)</b> Her satırdan sonra listenin içeriğini <code>indis: değer</code> biçiminde (aralarına “·” koyarak) ve <code>Count</code> değerini yazın.", ["Satır", "Liste içeriği", "Count"],
          [["1", girdi(["0: Ankara · 1: Elazığ · 2: İzmir · 3: Malatya"], mod="liste", gen=44), girdi("4")],
           ["2", girdi(["0: Ankara · 1: Elazığ · 2: İzmir · 3: Malatya · 4: Van"], mod="liste", gen=44), girdi("5")],
           ["3", girdi(["0: Ankara · 1: Elazığ · 2: Malatya · 3: Van"], mod="liste", gen=44), girdi("4")],
           ["4", girdi(["0: Ankara · 1: Elazığ · 2: Malatya"], mod="liste", gen=44), girdi("3")],
           ["5", girdi(["0: Ankara · 1: Elazığ · 2: Malatya · 3: Bursa"], mod="liste", gen=44), girdi("4")],
           ["6", girdi(["0: Elazığ · 1: Malatya · 2: Bursa"], mod="liste", gen=44), girdi("3")]],
          notlar=["Bursa (indis 1) silinince sonraki elemanlar bir geri kayar.", "Van listenin sonuna eklenir.", "İzmir değerine göre silinir.", "<code>Count − 1</code> o anki son indistir (3): Van silinir.", "Bursa bu kez sona eklenir.", "0. eleman (Ankara) silinir, hepsi bir geri kayar."]),
    sec("<b>b)</b> 7. satırdan (<code>SelectedIndex = 1</code>) sonra hangi şehir seçili görünür?", ["Elazığ", "Malatya", "Bursa", "Ankara"], 1,
        "6. satırdan sonra liste 0: Elazığ · 1: Malatya · 2: Bursa olduğu için indis 1 Malatya'dır."),
    adim("Kayma kavramını adım adım izle.", 0,
         [dict(s=[], n="Başlangıç: 5 eleman.", g=[dict(ad="Liste", d="Ankara, Bursa, Elazığ, İzmir, Malatya"), dict(ad="Count", d="5")]),
          dict(s=[1], n="Bursa silinir; Elazığ 2'den 1'e kayar.", g=[dict(ad="Liste", d="Ankara, Elazığ, İzmir, Malatya"), dict(ad="Count", d="4")]),
          dict(s=[2], n="Van sona eklenir.", g=[dict(ad="Liste", d="Ankara, Elazığ, İzmir, Malatya, Van"), dict(ad="Count", d="5")]),
          dict(s=[3], n="İzmir silinir.", g=[dict(ad="Liste", d="Ankara, Elazığ, Malatya, Van"), dict(ad="Count", d="4")]),
          dict(s=[4], n="Son eleman (Van) silinir.", g=[dict(ad="Liste", d="Ankara, Elazığ, Malatya"), dict(ad="Count", d="3")]),
          dict(s=[5], n="Bursa sona eklenir.", g=[dict(ad="Liste", d="Ankara, Elazığ, Malatya, Bursa"), dict(ad="Count", d="4")]),
          dict(s=[6], n="Ankara silinir.", g=[dict(ad="Liste", d="Elazığ, Malatya, Bursa"), dict(ad="Count", d="3")]),
          dict(s=[7], n="1. indis seçilir: <b>Malatya</b>.", g=[dict(ad="Seçili", d="Malatya (indis 1)")])]),
  ],
  ack="Her silmede sonraki elemanların indisi bir azalır. <code>Count − 1</code> her zaman son elemanın indisidir."),

Q("4.2", "hata", "Hepsini silmeyen “Tümünü Sil”", 3,
  "Bir öğrenci listeyi döngüyle boşaltmak için iki kod yazmıştır.",
  [kod(K42A, "Kod A"), kod(K42B, "Kod B")],
  [
    tablo("<b>a)</b> Listede <b>A B C D E F</b> varken Kod A çalıştırılırsa her turda i, tur başındaki Count, silinen eleman ve tur sonu liste nedir?", ["Tur", "i", "Count (tur başı)", "Silinen", "Liste (tur sonu)"],
          [["1", girdi("0"), girdi("6"), girdi("A"), girdi("B C D E F")],
           ["2", girdi("1"), girdi("5"), girdi("C"), girdi("B D E F")],
           ["3", girdi("2"), girdi("4"), girdi("E"), girdi("B D F")],
           ["4", girdi("3"), girdi("3"), girdi("—", mod="tire"), girdi("B D F")]],
          notlar=["", "", "", "i = 3, Count = 3 → şart yanlış, döngü biter."]),
    sec("<b>a2)</b> Kod A bitince listede hangi elemanlar kalır ve neden?", ["Hiçbiri; liste boşalır", "B, D, F; her silmede sonraki elemanlar bir geri kayar, i ise ileri gider, bu yüzden her turda bir eleman atlanır", "A, C, E", "Yalnızca F"], 1,
        "Kayma: silinen elemandan sonrakiler bir indis geri gelir ama sayaç bir ileri gittiği için kayan eleman atlanır."),
    adim("Kod A'nın ilk turlarını izle.", 0,
         [dict(s=[], n="Başlangıç: A B C D E F.", g=[dict(ad="i", d="—"), dict(ad="Count", d="6"), dict(ad="Liste", d="A B C D E F")]),
          dict(s=[3, 5], n="i = 0: A silinir. B artık 0. indistedir.", g=[dict(ad="i", d="0"), dict(ad="Count", d="5"), dict(ad="Liste", d="B C D E F")]),
          dict(s=[3, 5], n="i = 1: C silinir (B atlandı).", g=[dict(ad="i", d="1"), dict(ad="Count", d="4"), dict(ad="Liste", d="B D E F")]),
          dict(s=[3, 5], n="i = 2: E silinir (D atlandı).", g=[dict(ad="i", d="2"), dict(ad="Count", d="3"), dict(ad="Liste", d="B D F")]),
          dict(s=[3], n="i = 3: şart (3 &lt; 3) yanlış; döngü biter.", g=[dict(ad="i", d="3"), dict(ad="Count", d="3"), dict(ad="Liste", d="B D F")])]),
    tablo("<b>b)</b> Listede <b>A B C D E</b> (5 eleman) varken Kod B çalıştırılırsa:", ["Soru", "Cevap"],
          [["Hangi turda (i değeri) program durur?", girdi("3")], ["Hata türü nedir?", girdi("ArgumentOutOfRangeException", gen=30)], ["O anda listede ne vardır? (örn. B D)", girdi("B D")]],
          notlar=["i = 0: A, i = 1: C, i = 2: E silinir; i = 3'te listede yalnızca 2 eleman vardır.", "Geçerli indisler 0 ve 1'dir; <code>RemoveAt(3)</code> aralık dışıdır.", "Sabit sınır (5) listenin küçüldüğünü hesaba katmaz."]),
    yaz("<b>c)</b> Listeyi eksiksiz boşaltan <b>iki farklı</b> doğru çözüm yazın (iki ayrı metot: <code>button1_Click</code> ve <code>button2_Click</code>).",
        [dict(ad="1. çözüm: <code>while (Count &gt; 0)</code> ile her seferinde <code>RemoveAt(0)</code>", all=["while(listBox1.Items.Count>0)", "RemoveAt(0)"]),
         dict(ad="2. çözüm: sondan başa doğru <code>for (int i = Count − 1; i &gt;= 0; i−−)</code>", any=["i=listBox1.Items.Count-1;i>=0;i--"])],
        '''private void button1_Click(object sender, EventArgs e)
{
    while (listBox1.Items.Count > 0)
    {
        listBox1.Items.RemoveAt(0);
    }
}
private void button2_Click(object sender, EventArgs e)
{
    for (int i = listBox1.Items.Count - 1; i >= 0; i--)
    {
        listBox1.Items.RemoveAt(i);
    }
}''', bas="private void button1_Click(object sender, EventArgs e)\n{\n    \n}\nprivate void button2_Click(object sender, EventArgs e)\n{\n    \n}",
        a="En kısa yol: <code>listBox1.Items.Clear();</code>. 1. çözümde kayan eleman bir sonraki turda yine 0. konumdadır. 2. çözümde sondan silindiği için kayma, henüz silinmemiş elemanları etkilemez."),
  ],
  ack="Bir koleksiyonu gezerken silme yapıyorsanız ya <b>hep baştan silin</b> ya da <b>sondan başa</b> gidin."),

Q("4.3", "hata", "Renkler karıştı", 2,
  "Aşağıdaki kodda liste elemanları <i>kırmızı, beyaz, mavi</i> sırasındadır.",
  [kod(K43, "Form1.cs")],
  [
    tablo("<b>a)</b> Kullanıcı sırasıyla kırmızı, beyaz ve mavi'yi seçtiğinde formun rengi her seferinde ne olur? (Değişmezse “Değişmez” yazın.)", ["Seçilen", "SelectedIndex", "Formun rengi"],
          [["kırmızı", girdi("0"), girdi("Değişmez", ["Değişmez", "Kırmızı", "Beyaz", "Mavi"])],
           ["beyaz", girdi("1"), girdi("Kırmızı", ["Değişmez", "Kırmızı", "Beyaz", "Mavi"])],
           ["mavi", girdi("2"), girdi("Beyaz", ["Değişmez", "Kırmızı", "Beyaz", "Mavi"])]],
          notlar=["Hiçbir şart 0'ı denetlemiyor.", "Şart 1'e kırmızı atamış.", "Şart 2'ye beyaz atamış; Mavi şartı da hiç doğru olmaz."]),
    sec("<b>b)</b> <code>comboBox1.Text == \"Mavi\"</code> şartı neden hiçbir zaman doğru olmaz?", ["Text özelliği salt okunurdur", "String karşılaştırması büyük-küçük harfe duyarlıdır; listedeki eleman <code>mavi</code>, karşılaştırılan <code>Mavi</code>", "Mavi bir renk değildir", "if iki kez yazılamaz"], 1,
        "<code>\"mavi\" != \"Mavi\"</code>."),
    sec("<b>c)</b> Kullanıcı <code>listBox1</code>'de hiçbir satır seçmeden button1'e basarsa ne olur?", ["Hiçbir şey olmaz", "İlk satır silinir", "<code>SelectedIndex = −1</code> olduğundan <code>RemoveAt(−1)</code> ArgumentOutOfRangeException verir", "Tüm liste silinir"], 2,
        "Seçim yokken <code>SelectedIndex</code> −1'dir."),
    yaz("<b>d)</b> Olay metodunu <code>switch</code> ile, button1 metodunu ise güvenli hâle getirerek yeniden yazın. Seçim yoksa <i>Önce bir satır seçiniz.</i> uyarısı çıksın.",
        [dict(ad="<code>switch (comboBox1.SelectedIndex)</code>", any=["switch(comboBox1.SelectedIndex)"]),
         dict(ad="Doğru eşleme: 0 → Red, 1 → White, 2 → Blue", all=["case0:this.BackColor=Color.Red;", "case1:this.BackColor=Color.White;", "case2:this.BackColor=Color.Blue;"]),
         dict(ad="Her case <code>break;</code> ile bitiyor", say=dict(p=["break;"], min=3)),
         dict(ad="<code>SelectedIndex != -1</code> denetimi", any=["listBox1.SelectedIndex!=-1", "listBox1.SelectedIndex>=0", "listBox1.SelectedIndex>-1", "listBox1.SelectedItem!=null"]),
         dict(ad="Seçim yoksa uyarı veriliyor", any=["MessageBox.Show("])],
        '''private void comboBox1_SelectedIndexChanged(object sender, EventArgs e)
{
    switch (comboBox1.SelectedIndex)
    {
        case 0: this.BackColor = Color.Red; break;
        case 1: this.BackColor = Color.White; break;
        case 2: this.BackColor = Color.Blue; break;
    }
}
private void button1_Click(object sender, EventArgs e)
{
    if (listBox1.SelectedIndex != -1)
        listBox1.Items.RemoveAt(listBox1.SelectedIndex);
    else
        MessageBox.Show("Önce bir satır seçiniz.");
}''', bas="private void comboBox1_SelectedIndexChanged(object sender, EventArgs e)\n{\n    \n}\nprivate void button1_Click(object sender, EventArgs e)\n{\n    \n}"),
  ],
  ack="İndis ile metni karıştırmayın: indisler 0'dan başlar, metin karşılaştırması harf duyarlıdır."),

Q("4.4", "yaz", "Alışveriş sepeti", 3,
  "Bir kırtasiye için sepet uygulaması: <b>Defter 45,50 TL · Kalem 12 TL · Silgi 7,25 TL</b>. <code>comboBox1</code> ürünleri listeler (yalnızca listeden seçim); <code>numericUpDown1</code> adet seçtirir (1–20). <b>Sepete Ekle</b> (<code>button1</code>): ürün seçilmemişse uyarı; seçilmişse <code>listBox1</code>'e <i>ürün · adet · tutar</i> satırını ekler ve <code>label1</code>'de güncel sepet tutarını gösterir. <b>Sepeti Boşalt</b> (<code>button2</code>): listeyi ve tutarı sıfırlar.",
  [],
  [
    yaz("<b>a)</b> Programı yazın. Ürün adlarını ve fiyatları <b>iki ayrı dizide</b> tutun; doğru fiyata seçili indis üzerinden ulaşın. (Sınıf düzeyindeki alanları, Load, button1 ve button2 metotlarını yazın.)",
        [dict(ad="İki ayrı dizi: <code>string[] urunler</code> ve <code>double[] fiyatlar</code>", all=["string[]urunler", "double[]fiyatlar"]),
         dict(ad="Sepet tutarı <b>sınıf düzeyinde</b> (metotların dışında) tanımlı", any=["doublesepetTutari=0;"], disi=True),
         dict(ad="Fiyata <code>fiyatlar[i]</code> ile ulaşılıyor (i = SelectedIndex)", all=["fiyatlar[", "SelectedIndex"]),
         dict(ad="Ürün seçilmemişse uyarı ve <code>return;</code>", any=["SelectedIndex==-1", "SelectedIndex<0", "SelectedItem==null", "==-1)", "i<0)"]),
         dict(ad="Satır <code>listBox1.Items.Add</code> ile ekleniyor", any=["listBox1.Items.Add("]),
         dict(ad="Sepeti boşaltma: <code>Items.Clear()</code> ve tutar sıfırlanıyor", all=["Items.Clear()", "=0;"]),
         dict(ad="<code>numericUpDown1</code> sınırları 1–20", say=dict(p=["Minimum=1", "Maximum=20"], min=2))],
        '''string[] urunler = { "Defter", "Kalem", "Silgi" };
double[] fiyatlar = { 45.5, 12, 7.25 };
double sepetTutari = 0;   // alan (field)

private void Form1_Load(object sender, EventArgs e)
{
    comboBox1.Items.AddRange(urunler);
    comboBox1.DropDownStyle = ComboBoxStyle.DropDownList;
    numericUpDown1.Minimum = 1;
    numericUpDown1.Maximum = 20;
}
private void button1_Click(object sender, EventArgs e)   // Sepete Ekle
{
    int i = comboBox1.SelectedIndex;
    if (i == -1)
    {
        MessageBox.Show("Lütfen bir ürün seçiniz.");
        return;
    }
    int adet = Convert.ToInt32(numericUpDown1.Value);
    double tutar = fiyatlar[i] * adet;
    listBox1.Items.Add(urunler[i] + "\\t" + adet + " adet\\t" + tutar + " TL");
    sepetTutari += tutar;
    label1.Text = "Sepet tutarı: " + sepetTutari + " TL";
}
private void button2_Click(object sender, EventArgs e)   // Sepeti Boşalt
{
    listBox1.Items.Clear();
    sepetTutari = 0;
    label1.Text = "Sepet tutarı: 0 TL";
}''', bas="string[] urunler = { };\n\nprivate void Form1_Load(object sender, EventArgs e)\n{\n    \n}", tamsatir=True),
    metin("<b>b)</b> Sırasıyla 2 Defter, 4 Silgi ve 3 Kalem eklendiğinde <code>label1</code>'de ne yazar?", ["Sepet tutarı: 156 TL"],
          "2 × 45,50 = 91; 4 × 7,25 = 29; 3 × 12 = 36 → 156."),
    metin("<b>c)</b> <code>sepetTutari</code> değişkeni <code>button1_Click</code>'in <u>içinde</u> tanımlansaydı (b) şıkkındaki işlemlerden sonra <code>label1</code>'de ne görünürdü?", ["Sepet tutarı: 36 TL"],
          "Yerel değişken her tıklamada yeniden oluşturulur ve 0'dan başlar; yalnızca son eklenen ürünün tutarı (3 × 12 = 36) görünür. Sınıf düzeyindeki değişkene <b>alan (field)</b> denir; form yaşadığı sürece değerini korur ve tüm metotlar onu kullanabilir."),
  ],
  ack="İki ayrı dizi aynı indisle eşlenir: <code>urunler[i]</code> ve <code>fiyatlar[i]</code>. Olaylar arasında korunması gereken değer sınıf düzeyinde tutulur."),

Q("4.5", "senaryo", "Birbirine bağlı iki liste", 2,
  "<code>comboBox1</code>'den il seçildiğinde <code>comboBox2</code>'ye o ilin ilçeleri gelir.",
  [kod(K45, "Form1.cs")],
  [
    tablo("<b>a)</b> 9. satırdaki (<code>comboBox2.Items.Clear();</code>) silinirse ve kullanıcı sırasıyla Elazığ, Malatya, Elazığ seçerse <code>comboBox2</code>'de kaç eleman olur ve sırayla ne olur?", ["Soru", "Cevap"],
          [["Eleman sayısı", girdi("9")], ["Sırayla elemanlar (virgülle)", girdi("Baskil, Keban, Palu, Battalgazi, Darende, Yeşilyurt, Baskil, Keban, Palu", mod="liste", gen=44)]],
          notlar=["Liste temizlenmediği için her seçimde yeni ilçeler eskilerin sonuna eklenir.", ""]),
    sec("<b>b)</b> <code>comboBox2.Text = \"\";</code> satırının görevi nedir?", ["Listeyi siler", "Kutuda önceki ilden kalan seçili metni temizler (ör. Keban, il değişince de görünmesin)", "Yazı rengini değiştirir", "Hata yakalar"], 1,
        "Elazığ'da Keban seçilip il Malatya yapılırsa, bu satır olmadan kutuda Keban yazmaya devam edebilir."),
    sec("<b>c)</b> İl ve ilçe sayısı arttıkça <code>if – else if</code> zinciri uzar. Verileri nasıl tutarsanız bu uzamayı önlersiniz?",
        ["Her il için ayrı bir Form açarım", "İlçeleri il listesiyle aynı sırada bir dizi dizisinde (<code>string[][]</code>) tutar, <code>ilceler[comboBox1.SelectedIndex]</code> ile erişirim", "if yerine goto kullanırım", "Her ilçeyi ayrı bir değişkende tutarım"], 1,
        "Örnek: <code>comboBox2.Items.AddRange(ilceler[comboBox1.SelectedIndex]);</code>"),
  ],
  ack="Bağlı listelerde sıra: <b>temizle → metni sıfırla → seçime göre doldur</b>."),
]
