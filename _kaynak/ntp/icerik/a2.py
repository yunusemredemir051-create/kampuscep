from dsl import *

K22 = '''private void Form1_Load(object sender, EventArgs e)
{
    button1.Enable = false;
    button2.FlatSytle = FlatStyle.Flat;
    dateTimePicker1.MaxDropDownItems = 5;
    toolTip1.SetToolTip = "Kaydet";
    label1.Text = 25;
    numericUpDown1.Value = 2.5;
}'''
K23 = '''private void button1_Click(object sender, EventArgs e)
{
    button2.Enabled = !button2.Enabled;
}
private void button2_Click(object sender, EventArgs e)
{
    button3.Visible = !button3.Visible;
    button1.Enabled = false;
}
private void button3_Click(object sender, EventArgs e)
{
    button1.Enabled = true;
    button2.Visible = false;
}'''
K25 = '''private void Form1_Load(object sender, EventArgs e)
{
    for (int i = 1; i <= 3; i++)
    {
        Button b = new Button();
        b.Text = "Buton " + i;
        b.Location = new Point(20, 40 * i);
        b.Click += Dinamik_Click;
        this.Controls.Add(b);
    }
}

private void Dinamik_Click(object sender, EventArgs e)
{
    Button tiklanan = (Button)sender;
    MessageBox.Show(tiklanan.Text);
}'''
KONT = ["TextBox", "MaskedTextBox", "NumericUpDown", "DateTimePicker", "ComboBox", "CheckedListBox", "RadioButton", "CheckBox"]

def durum(a, b, c): return [a, b, c]

SORULAR = [
Q("2.1", "tasarim", "Doğru kontrol, doğru ayar", 1,
  "Bir öğrenci kayıt formu tasarlanıyor. Her ihtiyaç için kullanılacak kontrolü seçin, sonra Load olayındaki ayarları yazın.",
  [],
  [
    tablo("<b>a)</b> Her ihtiyaç için en uygun kontrolü seçin.", ["No", "İhtiyaç", "Kontrol"],
          [["1", "Telefon <code>0(5xx) xxx xx xx</code> biçiminde girilsin; baştaki 0 ekranda sabit dursun.", girdi("MaskedTextBox", KONT)],
           ["2", "Yaş 18–65 arasında bir tam sayı olsun; harf ve aralık dışı değer girilemesin.", girdi("NumericUpDown", KONT)],
           ["3", "Doğum tarihi seçilecek; bugünden ileri tarih seçilemesin.", girdi("DateTimePicker", KONT)],
           ["4", "Bölüm sabit listeden (YBS, İşletme, İktisat) seçilecek; elle yazılamasın.", girdi("ComboBox", KONT)],
           ["5", "Şifre girilirken karakterler görünmesin.", girdi("TextBox", KONT)],
           ["6", "Adres en fazla 200 karakter olsun ve birden çok satıra yazılabilsin.", girdi("TextBox", KONT)]],
          notlar=["TextBox biçimi denetlemez; Mask her rakamın yerini belirler, <code>MaskCompleted</code> eksik girişi yakalar.", "NumericUpDown yalnızca sayı kabul eder ve sınırları kendisi uygular.", "Tarihi elle yazdırırsanız biçim hataları çıkar; <code>MaxDate</code> ileri tarihleri seçilemez yapar.", "Tek seçim gerektiğinden CheckedListBox uygun değildir; <code>DropDownList</code> stili elle yazmayı kapatır.", "TextBox + <code>PasswordChar</code>.", "TextBox + <code>Multiline</code> + <code>MaxLength</code>."]),
    yaz("<b>b)</b> Load olayında altı ayarı yazın (her ihtiyaç için bir satır). Telefondaki sabit 0 için kalıp karakteri olan 0'ın önüne ters bölü konur; C# metninde ters bölü iki kez yazılır.",
        [dict(ad="Telefon kalıbı: <code>maskedTextBox1.Mask = \"\\\\0(000) 000 00 00\";</code>", any=['maskedTextBox1.Mask="\\\\0(000)0000000";']),
         dict(ad="<code>numericUpDown1.Minimum = 18;</code>", any=["numericUpDown1.Minimum=18;"]),
         dict(ad="<code>numericUpDown1.Maximum = 65;</code>", any=["numericUpDown1.Maximum=65;"]),
         dict(ad="<code>dateTimePicker1.MaxDate = DateTime.Today;</code>", any=["dateTimePicker1.MaxDate=DateTime.Today;", "dateTimePicker1.MaxDate=DateTime.Now;"]),
         dict(ad="<code>comboBox1.DropDownStyle = ComboBoxStyle.DropDownList;</code>", any=["comboBox1.DropDownStyle=ComboBoxStyle.DropDownList;"]),
         dict(ad="<code>textBox1.PasswordChar = '*';</code> (tek tırnak, char)", any=["PasswordChar='*';"]),
         dict(ad="<code>Multiline = true;</code> ve <code>MaxLength = 200;</code>", say=dict(p=["Multiline=true;", "MaxLength=200;"], min=2))],
        '''private void Form1_Load(object sender, EventArgs e)
{
    maskedTextBox1.Mask = "\\\\0(000) 000 00 00";
    numericUpDown1.Minimum = 18;
    numericUpDown1.Maximum = 65;
    dateTimePicker1.MaxDate = DateTime.Today;
    comboBox1.DropDownStyle = ComboBoxStyle.DropDownList;
    textBox1.PasswordChar = '*';
    textBox2.Multiline = true;
    textBox2.MaxLength = 200;
}''', bas="private void Form1_Load(object sender, EventArgs e)\n{\n    \n}",
        a="Kalıp <code>\"0(000) 000 00 00\"</code> yazılsaydı baştaki 0 da kullanıcının yazacağı bir rakam yeri olurdu; <code>5321234567</code> girişi kutuda <code>5(321) 234 56 7_</code> görünürdü. Kaçışlı kalıpla aynı giriş <code>0(532) 123 45 67</code> olarak görünür."),
  ],
  ack="Her kontrol bir sınıftır; <code>button1</code>, <code>textBox1</code> bu sınıfların nesneleridir. Özellikler Properties penceresinden ya da kodla değiştirilir."),

Q("2.2", "hata", "Altı satır, altı hata", 1,
  "Aşağıdaki Load metodunun 3–8. satırlarının her birinde bir hata vardır. 5. satırdaki amaç bir <b>ComboBox</b>'ta aynı anda 5 eleman göstermektir.",
  [kod(K22, "Form1_Load", goster=False)],
  [
    satir("<b>a)</b> Hatalı satırları işaretleyin (hepsi hatalı).", 0, [3, 4, 5, 6, 7, 8],
          [(3, "Enable", "Özelliğin adı <code>Enabled</code>'dır; <code>Enable</code> diye bir üye yoktur."),
           (4, "FlatSytle", "Yazım hatası: <code>FlatSytle</code> → <code>FlatStyle</code>."),
           (5, "DateTimePicker.MaxDropDownItems", "<code>MaxDropDownItems</code> ComboBox'a aittir, DateTimePicker'da yoktur."),
           (6, "SetToolTip =", "<code>SetToolTip</code> bir metottur; değer atanamaz, parametreyle çağrılır."),
           (7, "label1.Text = 25", "<code>Text</code> string türündedir; int doğrudan atanamaz."),
           (8, "Value = 2.5", "<code>Value</code> decimal türündedir; <code>2.5</code> double sabitidir ve kendiliğinden decimal'e dönüşmez.")]),
    sec("<b>b)</b> 8. satırı düzelten ifade hangisidir?", ["<code>numericUpDown1.Value = 2.5d;</code>", "<code>numericUpDown1.Value = 2.5m;</code>", "<code>numericUpDown1.Value = (int)2.5;</code> ve amaç korunur", "<code>numericUpDown1.Value = \"2.5\";</code>"], 1,
        "decimal sabitleri <code>m</code> son ekiyle yazılır (<code>2.5m</code>). (int) dönüşümü 2 verir ve amacı bozar."),
    yaz("<b>c)</b> Metodu yazanın amacını koruyarak düzeltin.",
        [dict(ad="<code>button1.Enabled = false;</code>", any=["button1.Enabled=false;"]),
         dict(ad="<code>button2.FlatStyle = FlatStyle.Flat;</code>", any=["button2.FlatStyle=FlatStyle.Flat;"]),
         dict(ad="<code>comboBox1.MaxDropDownItems = 5;</code>", any=["comboBox1.MaxDropDownItems=5;"]),
         dict(ad='<code>toolTip1.SetToolTip(button1, "Kaydet");</code>', any=['toolTip1.SetToolTip(button1,"Kaydet");']),
         dict(ad='<code>label1.Text = "25";</code> (ya da <code>25.ToString()</code>)', any=['label1.Text="25";', "label1.Text=25.ToString();", "label1.Text=Convert.ToString(25);"]),
         dict(ad="<code>numericUpDown1.Value = 2.5m;</code>", any=["numericUpDown1.Value=2.5m;", "numericUpDown1.Value=2.5M;", "numericUpDown1.Value=(decimal)2.5;"])],
        '''private void Form1_Load(object sender, EventArgs e)
{
    button1.Enabled = false;
    button2.FlatStyle = FlatStyle.Flat;
    comboBox1.MaxDropDownItems = 5;
    toolTip1.SetToolTip(button1, "Kaydet");
    label1.Text = "25";
    numericUpDown1.Value = 2.5m;
}''', bas="private void Form1_Load(object sender, EventArgs e)\n{\n    \n}"),
  ],
  ack="Metotlar parantezle çağrılır (<code>SetToolTip(...)</code>), özelliklere <code>=</code> ile değer atanır. Özellik türünü bilmek (Text → string, Value → decimal) tür hatalarını önler."),

Q("2.3", "izleme", "Visible ve Enabled izleme tablosu", 2,
  "Formda <code>button1</code>, <code>button2</code> ve <code>button3</code> var. Başlangıçta üçü de görünür ve aktiftir. Kullanıcı sırasıyla şu butonlara tıklamaya çalışıyor: <b>button2 → button1 → button3 → button1 → button2 → button3</b>. Pasif butona tıklamak Click olayını tetiklemez, görünmez butona tıklanamaz.",
  [kod(K23, "Click metotları")],
  [
    tablo("<b>a)</b> Her adımdan sonra butonların durumunu seçin. (G: görünür, Gz: görünmez, A: aktif, P: pasif)",
          ["Adım", "Tıklanan", "İşlem oldu mu?", "button1", "button2", "button3"],
          [["1", "button2", girdi("Evet", ["Evet", "Hayır"]), girdi("G,P", ["G,A", "G,P", "Gz,A", "Gz,P"]), girdi("G,A", ["G,A", "G,P", "Gz,A", "Gz,P"]), girdi("Gz,A", ["G,A", "G,P", "Gz,A", "Gz,P"])],
           ["2", "button1", girdi("Hayır", ["Evet", "Hayır"]), girdi("G,P", ["G,A", "G,P", "Gz,A", "Gz,P"]), girdi("G,A", ["G,A", "G,P", "Gz,A", "Gz,P"]), girdi("Gz,A", ["G,A", "G,P", "Gz,A", "Gz,P"])],
           ["3", "button3", girdi("Hayır", ["Evet", "Hayır"]), girdi("G,P", ["G,A", "G,P", "Gz,A", "Gz,P"]), girdi("G,A", ["G,A", "G,P", "Gz,A", "Gz,P"]), girdi("Gz,A", ["G,A", "G,P", "Gz,A", "Gz,P"])],
           ["4", "button1", girdi("Hayır", ["Evet", "Hayır"]), girdi("G,P", ["G,A", "G,P", "Gz,A", "Gz,P"]), girdi("G,A", ["G,A", "G,P", "Gz,A", "Gz,P"]), girdi("Gz,A", ["G,A", "G,P", "Gz,A", "Gz,P"])],
           ["5", "button2", girdi("Evet", ["Evet", "Hayır"]), girdi("G,P", ["G,A", "G,P", "Gz,A", "Gz,P"]), girdi("G,A", ["G,A", "G,P", "Gz,A", "Gz,P"]), girdi("G,A", ["G,A", "G,P", "Gz,A", "Gz,P"])],
           ["6", "button3", girdi("Evet", ["Evet", "Hayır"]), girdi("G,A", ["G,A", "G,P", "Gz,A", "Gz,P"]), girdi("Gz,A", ["G,A", "G,P", "Gz,A", "Gz,P"]), girdi("G,A", ["G,A", "G,P", "Gz,A", "Gz,P"])]],
          notlar=["button2 Click: button3 gizlenir, button1 pasif olur.", "button1 pasif: tıklama işlem yapmaz.", "button3 görünmez: tıklanamaz.", "button1 hâlâ pasif.", "button2 Click: button3.Visible tersine döner (tekrar görünür), button1 zaten pasif.", "button3 Click: button1 aktif olur, button2 gizlenir."]),
    sec("<b>b)</b> Son durumda kullanıcı <code>button2</code>'yi bir daha görebilir mi?",
        ["Evet, button1'e tıklayarak", "Evet, button3'e tekrar tıklayarak", "Hayır; <code>button2.Visible = true</code> yapan hiçbir satır yok", "Hayır; çünkü button2 pasif"], 2,
        "button2'yi gizleyen satır button3'ün metodunda yazılıdır ve görünür yapan bir karşılığı yoktur. Üstelik görünmez bir butona tıklanamayacağı için kullanıcı hiçbir olayı tetikleyemez."),
    adim("Adımlar kodda böyle ilerler.", 0,
         [dict(s=[], n="Başlangıç.", g=[dict(ad="button1", d="G, A"), dict(ad="button2", d="G, A"), dict(ad="button3", d="G, A")]),
          dict(s=[7, 8], n="button2'ye tıklandı: button3 gizlendi, button1 pasif oldu.", g=[dict(ad="button1", d="G, P"), dict(ad="button2", d="G, A"), dict(ad="button3", d="Gz, A")]),
          dict(s=[], n="button1 pasif ve button3 görünmez: sonraki üç tıklamada (button1, button3, button1) işlem olmaz.", g=[dict(ad="button1", d="G, P"), dict(ad="button2", d="G, A"), dict(ad="button3", d="Gz, A")]),
          dict(s=[7], n="5. adım: button2 tekrar tıklandı; button3 yeniden görünür.", g=[dict(ad="button1", d="G, P"), dict(ad="button2", d="G, A"), dict(ad="button3", d="G, A")]),
          dict(s=[12, 13], n="6. adım: button3 tıklandı; button1 aktif, button2 gizli.", g=[dict(ad="button1", d="G, A"), dict(ad="button2", d="Gz, A"), dict(ad="button3", d="G, A")])]),
  ],
  ack="Pasif (<code>Enabled = false</code>) kontrol görünür ama tıklanmaz; görünmez (<code>Visible = false</code>) kontrol hiç tıklanamaz. <code>x = !x</code> kalıbı değeri tersine çevirir."),

Q("2.4", "yaz", "Mini proje: Kayıt özeti formu", 3,
  "Şu kontrollerden oluşan bir form kodlayın: <code>textBox1</code> (ad soyad), <code>comboBox1</code> (bölüm: YBS, İşletme, İktisat; yalnızca listeden), <code>numericUpDown1</code> (sınıf 1–4), <code>maskedTextBox1</code> (telefon), <code>dateTimePicker1</code> (doğum tarihi, ileri tarih seçilemez), <code>checkBox1</code> (bülten), <code>button1</code> (Özetle). Fare button1'in üzerine gelince <i>Bilgileri kontrol edip özetler</i> açıklaması görünsün.",
  [],
  [
    yaz("<b>a)</b> Form açılışında yapılacak ayarları yazın (Load).",
        [dict(ad="ComboBox elemanları <code>Items.AddRange</code> (ya da <code>Items.Add</code>) ile ekleniyor", any=["comboBox1.Items.AddRange(", "comboBox1.Items.Add("]),
         dict(ad="<code>DropDownStyle = ComboBoxStyle.DropDownList</code>", any=["DropDownStyle=ComboBoxStyle.DropDownList"]),
         dict(ad="Telefon kalıbı <code>Mask</code> ile veriliyor", any=["maskedTextBox1.Mask="]),
         dict(ad="Sınıf sınırları <code>Minimum = 1</code>, <code>Maximum = 4</code>", say=dict(p=["numericUpDown1.Minimum=1;", "numericUpDown1.Maximum=4;"], min=2)),
         dict(ad="<code>dateTimePicker1.MaxDate = DateTime.Today</code>", any=["dateTimePicker1.MaxDate=DateTime.Today", "dateTimePicker1.MaxDate=DateTime.Now"]),
         dict(ad="Açıklama: <code>toolTip1.SetToolTip(button1, …)</code>", any=["toolTip1.SetToolTip(button1,"])],
        '''private void Form1_Load(object sender, EventArgs e)
{
    comboBox1.Items.AddRange(new string[] { "YBS", "İşletme", "İktisat" });
    comboBox1.DropDownStyle = ComboBoxStyle.DropDownList;
    maskedTextBox1.Mask = "\\\\0(000) 000 00 00";
    numericUpDown1.Minimum = 1;
    numericUpDown1.Maximum = 4;
    dateTimePicker1.MaxDate = DateTime.Today;
    toolTip1.SetToolTip(button1, "Bilgileri kontrol edip özetler");
}''', bas="private void Form1_Load(object sender, EventArgs e)\n{\n    \n}"),
    yaz("<b>b)</b> button1 Click: ad soyad boşsa, bölüm seçilmemişse ya da telefon eksikse uyarı verip işlemi durdurun; her şey doğruysa tüm bilgiler <b>tek</b> MessageBox'ta alt alta gösterilsin.",
        [dict(ad="Ad soyad boşluk kırpılarak denetleniyor (<code>Trim()</code>)", any=["textBox1.Text.Trim()==\"\"", "textBox1.Text.Trim().Length==0", "string.IsNullOrWhiteSpace(textBox1.Text)", "textBox1.Text.Trim()==string.Empty"]),
         dict(ad="Bölüm denetimi: <code>SelectedIndex == -1</code>", any=["comboBox1.SelectedIndex==-1", "comboBox1.SelectedItem==null", "comboBox1.Text==\"\""]),
         dict(ad="Telefon denetimi: <code>MaskCompleted</code>", any=["!maskedTextBox1.MaskCompleted", "maskedTextBox1.MaskCompleted==false"]),
         dict(ad="Hatalı durumda <code>return;</code> ile metot bitiriliyor", say=dict(p=["return;"], min=3)),
         dict(ad="Özet tek MessageBox'ta, satırlar <code>\\n</code> ile ayrılmış", any=["\\n"]),
         dict(ad="Bülten durumu <code>checkBox1.Checked</code> ile okunuyor", any=["checkBox1.Checked"])],
        '''private void button1_Click(object sender, EventArgs e)
{
    if (textBox1.Text.Trim() == "")
    {
        MessageBox.Show("Ad soyad boş bırakılamaz.");
        return;
    }
    if (comboBox1.SelectedIndex == -1)
    {
        MessageBox.Show("Lütfen bölüm seçiniz.");
        return;
    }
    if (!maskedTextBox1.MaskCompleted)
    {
        MessageBox.Show("Telefon numarasını eksiksiz giriniz.");
        return;
    }
    string bulten = "Hayır";
    if (checkBox1.Checked)
        bulten = "Evet";
    string ozet = "Ad Soyad: " + textBox1.Text + "\\n"
                + "Bölüm: " + comboBox1.Text + "\\n"
                + "Sınıf: " + numericUpDown1.Value + "\\n"
                + "Telefon: " + maskedTextBox1.Text + "\\n"
                + "Doğum tarihi: " + dateTimePicker1.Value.ToShortDateString() + "\\n"
                + "Bülten: " + bulten;
    MessageBox.Show(ozet, "Kayıt Özeti");
}''', bas="private void button1_Click(object sender, EventArgs e)\n{\n    \n}",
        a="<code>return;</code> metodu o noktada bitirir; böylece hatalı durumda özet gösterilmez. <code>numericUpDown1.Value</code> decimal olsa da metinle <code>+</code> ile birleştirilebilir."),
  ],
  ack="Önce ayarlar (Load), sonra denetimler (<i>erken çıkış</i>), en sonda asıl iş: bu kalıp tüm form programlarında kullanılır."),

Q("2.5", "oku", "Kod ile oluşturulan butonlar", 2,
  "Aşağıdaki kod formda butonları kodla oluşturur.",
  [kod(K25, "Form1.cs")],
  [
    tablo("<b>a)</b> Form açıldığında kaç buton görünür? Her birinin yazısı ve konumu (x, y) nedir?", ["Buton", "Yazı", "x", "y"],
          [["1.", girdi("Buton 1"), girdi("20"), girdi("40")], ["2.", girdi("Buton 2"), girdi("20"), girdi("80")], ["3.", girdi("Buton 3"), girdi("20"), girdi("120")]],
          notlar=["y değeri <code>40 * i</code> ile hesaplanır.", "", ""]),
    sec("<b>b)</b> Kullanıcı ortadaki butona tıklarsa ne olur ve metot hangi butona tıklandığını nasıl bilir?",
        ["“Buton 2” yazan mesaj çıkar; <code>sender</code> tıklanan nesnedir, <code>(Button)sender</code> ile dönüştürülüp <code>Text</code> okunur", "“Buton 3” yazan mesaj çıkar; <code>b</code> değişkeni son nesneyi tutar", "Hiçbir şey olmaz", "“Buton 1” yazan mesaj çıkar; ilk kayıt çalışır"], 0,
        "Üç butonun Click olayı da aynı metoda bağlıdır; metot hangi butondan çağrıldığını <code>sender</code> parametresinden öğrenir."),
    coklusec("<b>c)</b> Satır silinirse ne değişir?",
             [("8. satır (<code>b.Click += …</code>) silinirse", ["Butonlar görünür ama tıklanınca bir şey olmaz", "Butonlar hiç görünmez", "Program derlenmez"], 0, "Olaya bağlı metot yoktur."),
              ("9. satır (<code>Controls.Add</code>) silinirse", ["Butonlar görünür ama tıklanınca bir şey olmaz", "Butonlar bellekte oluşur ama forma eklenmediği için hiçbiri görünmez", "Program derlenmez"], 1, "Forma eklenmeyen kontrol ekranda çizilmez.")]),
    tablo("<b>d)</b> <code>Button b = new Button();</code> satırı döngünün dışına (üstüne) alınırsa:", ["Soru", "Cevap"],
          [["Kaç Button nesnesi oluşur?", girdi("1")], ["Ekranda kaç buton görünür?", girdi("1")], ["Butona tıklanınca kaç mesaj gelir?", girdi("3")]],
          notlar=["Döngü aynı nesnenin yazısını ve konumunu değiştirir.", "Son durumda (20, 120) konumunda “Buton 3” yazan tek buton kalır.", "Click olayına aynı metot 3 kez bağlandığı için mesaj üç kez gelir. Her tur için ayrı nesne gerekiyorsa <code>new</code> döngünün içinde olmalıdır."]),
  ],
  ack="Kodla kontrol oluşturma sırası: <b>new → özellikleri ayarla → olaya bağla (<code>+=</code>) → <code>Controls.Add</code></b>."),
]
