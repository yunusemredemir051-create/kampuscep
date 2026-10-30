from dsl import *

K51A = '''private void button1_Click(object sender, EventArgs e)
{
    MessageBox.Show("1");
    Form2 f = new Form2();
    f.Show();
    MessageBox.Show("2");
}'''
K51B = K51A.replace("f.Show();", "f.ShowDialog();")
K51F2 = '''// Form2.cs içinde
private void Form2_Load(object sender, EventArgs e)
{
    MessageBox.Show("Form2 yüklendi");
}'''
K52 = '''private void button1_Click(object sender, EventArgs e)
{
    Form2 yeni = new Form2();
    yeni.Show();
}'''
SIRA = ["1", "Form2 yüklendi", "2"]

SORULAR = [
Q("5.1", "cikti", "Mesajların sırası", 2,
  "Form2'nin <code>Load</code> olayına aşağıdaki metot bağlıdır. Form1'deki butona iki farklı kod yazılmıştır (Kod A: <code>Show()</code>, Kod B: <code>ShowDialog()</code>).",
  [kod(K51F2, "Form2.cs"), kod(K51A, "Kod A"), kod(K51B, "Kod B")],
  [
    tablo("<b>a)</b> Butona tıklandıktan sonra gelen üç mesajın sırasını yazın. (Kod B'de kullanıcı Form2 açıkken “Form2 yüklendi” mesajını kapatıp Form2'yi de kapatır.)", ["Sıra", "Kod A", "Kod B"],
          [["1. mesaj", girdi("1", ["1", "Form2 yüklendi", "2"]), girdi("1", ["1", "Form2 yüklendi", "2"])],
           ["2. mesaj", girdi("Form2 yüklendi", ["1", "Form2 yüklendi", "2"]), girdi("Form2 yüklendi", ["1", "Form2 yüklendi", "2"])],
           ["3. mesaj", girdi("2", ["1", "Form2 yüklendi", "2"]), girdi("2", ["1", "Form2 yüklendi", "2"])]],
          notlar=["Load, form gösterilirken (Show / ShowDialog çağrısı sırasında) tetiklenir.", "", "Kod A: <code>Show()</code> pencereyi gösterir ve beklemeden sonraki satıra geçer; “2” Form2 açıkken gelir. Kod B: <code>ShowDialog()</code> satırında kod durur; “2”, Form2 kapatıldıktan sonra gelir."]),
    coklusec("<b>b)</b> “2” mesajı Form2'ye göre ne zaman gelir?",
             [("Kod A", ["Form2 kapatılmadan önce (Form2 açıldıktan hemen sonra)", "Form2 kapatıldıktan sonra"], 0, "Show beklemez."),
              ("Kod B", ["Form2 kapatılmadan önce (Form2 açıldıktan hemen sonra)", "Form2 kapatıldıktan sonra"], 1, "ShowDialog, form kapanana kadar sonraki satırı çalıştırmaz.")]),
    sec("<b>c)</b> Kod B'de Form2 açıkken kullanıcı Form1'deki butona tekrar tıklayabilir mi?", ["Evet, çünkü Form1 hâlâ görünür", "Hayır; modal pencere kapanmadan sahibi olan forma erişilemez", "Evet ama yalnızca bir kez", "Yalnızca klavyeyle"], 1,
        "ShowDialog modal bir pencere açar."),
  ],
  ack="<b>Show()</b>: kod akışı beklemeden devam eder (modeless). <b>ShowDialog()</b>: form kapanana kadar kod o satırda bekler (modal)."),

Q("5.2", "senaryo", "Üç tık, kaç pencere?", 2,
  "Bölüm 5.3'teki kod kullanılıyor (<code>new Form2()</code> + <code>Show()</code>).",
  [kod(K52, "button1_Click")],
  [
    tablo("<b>a-b)</b> Sayıları yazın.", ["Soru", "Cevap"],
          [["Kullanıcı FORM AÇ'a art arda 3 kez tıklarsa kaç Form2 penceresi olur?", girdi("3")], ["Aynı kodda <code>Show()</code> yerine <code>ShowDialog()</code> olsaydı aynı anda en fazla kaç Form2 açık olabilirdi?", girdi("1")]],
          notlar=["Her tıklamada <code>new Form2()</code> yeni, bağımsız bir nesne oluşturur; Show() Form1'i kilitlemediği için tekrar tıklanabilir.", "ShowDialog açıkken Form1'e tıklanamaz, butona ikinci kez basılamaz."]),
    yaz("<b>c)</b> <code>Show</code> kullanmaya devam ederek Form2 zaten açıksa yenisini açmayan, mevcut pencereyi öne getiren; kapatılmışsa yeniden açan kodu yazın. (İpucu: Form2 değişkenini sınıf düzeyinde tanımlayın; kapanıp kapanmadığı <code>IsDisposed</code> ile anlaşılır.)",
        [dict(ad="Form2 değişkeni <b>sınıf düzeyinde</b> (metodun dışında)", any=["Form2ikinci;", "Form2ikinci=null;", "Form2f;", "Form2form2;", "Form2yeni;"], disi=True),
         dict(ad="<code>null</code> ve <code>IsDisposed</code> denetimi", all=["==null", ".IsDisposed"]),
         dict(ad="Yeni nesne <code>new Form2()</code> ve <code>Show()</code>", all=["=newForm2()", ".Show()"]),
         dict(ad="Açıksa <code>Activate()</code> (ya da <code>BringToFront()</code>) ile öne getirilir", any=[".Activate()", ".BringToFront()", ".Focus()"])],
        '''Form2 ikinci;   // sınıf düzeyinde alan
private void button1_Click(object sender, EventArgs e)
{
    if (ikinci == null || ikinci.IsDisposed)
    {
        ikinci = new Form2();
        ikinci.Show();
    }
    else
    {
        ikinci.Activate();
    }
}''', bas="Form2 ikinci;\nprivate void button1_Click(object sender, EventArgs e)\n{\n    \n}",
        a="Kapatılan form dispose edilir ve <code>IsDisposed</code> <b>true</b> olur; kapatılmış form yeniden <code>Show()</code> edilemeyeceği için yeni nesne oluşturulur."),
  ],
  ack="Tıklamalar arasında hatırlanması gereken nesne, sınıf düzeyinde bir <b>alan</b> olmalıdır."),

Q("5.3", "senaryo", "Program neden kapanmıyor?", 3,
  "Bir öğrenci giriş ekranını (Form1) yazmış; doğru şifrede <code>Form2</code>'yi açıp <code>this.Hide()</code> ile giriş formunu gizliyor. Form2'yi X ile kapatınca ekranda pencere kalmıyor ama Visual Studio'da program “çalışıyor” görünüyor.",
  [kod("// Program.cs\nApplication.Run(new Form1());", "Program.cs"),
   kod('''// Form1.cs
Form2 anaSayfa = new Form2();
anaSayfa.Show();
this.Hide();''', "Form1.cs (özet)")],
  [
    sec("<b>a)</b> Neden kapanmıyor?", ["Form2 bellekte takılı kaldığı için", "<code>Application.Run(new Form1())</code> uygulamanın ömrünü Form1'e bağlar; Hide() Form1'i kapatmaz, yalnızca görünmez yapar, Form2'nin kapanması da ana formu etkilemez", "Visual Studio hatası", "Show() yerine ShowDialog kullanılmadığı için"], 1,
        "Ekranda pencere olmadığı hâlde mesaj döngüsü çalışmaya devam eder."),
    yaz("<b>b)</b> Sorunu <u>yalnızca Form2.cs</u>'te değişiklik yaparak çözün. (Form2'nin <code>FormClosed</code> olayına bağlanan metot.)",
        [dict(ad="<code>Form2_FormClosed</code> (<code>FormClosedEventArgs</code>) metodu", any=["FormClosedEventArgse"]),
         dict(ad="<code>Application.Exit();</code>", any=["Application.Exit();"])],
        '''private void Form2_FormClosed(object sender, FormClosedEventArgs e)
{
    Application.Exit();      // gizli Form1 dahil tüm uygulamayı kapatır
}''', bas="private void Form2_FormClosed(object sender, FormClosedEventArgs e)\n{\n    \n}"),
    yaz("<b>c)</b> Sorunu <u>yalnızca Form1.cs</u>'te değişiklik yaparak, bu kez Form2 kapanınca <b>giriş ekranı yeniden görünecek</b> şekilde çözün. (Form2'yi açarken <code>FormClosed</code> olayına Form1'deki bir metot bağlanır.)",
        [dict(ad="Olaya <code>+=</code> ile bir metot bağlanıyor", any=[".FormClosed+="]),
         dict(ad="Bağlanan metot <code>this.Show()</code> çağırıyor", any=["this.Show();"]),
         dict(ad="Form2 <code>Show()</code> ile açılıp Form1 <code>Hide()</code> ile gizleniyor", all=[".Show();", "this.Hide();"])],
        '''Form2 anaSayfa = new Form2();
anaSayfa.FormClosed += Form2_Kapandi;
anaSayfa.Show();
this.Hide();
// ...
private void Form2_Kapandi(object sender, FormClosedEventArgs e)
{
    this.Show();
}''', bas="private void button1_Click(object sender, EventArgs e)\n{\n    Form2 anaSayfa = new Form2();\n    \n    anaSayfa.Show();\n    this.Hide();\n}\n"),
    sec("<b>d)</b> Öğrenci <code>this.Hide()</code> yerine <code>this.Close()</code> yazsaydı ne olurdu?", ["Yalnızca Form1 kapanır, Form2 açık kalır", "Form1 ana form olduğu için uygulamanın tamamı kapanır; az önce açılan Form2 de kapanır (kullanıcı Form2'yi bir an görür ya da hiç göremez)", "Hiçbir şey olmaz", "Derleme hatası oluşur"], 1,
        "Ana formun Close()'u uygulamayı sonlandırır."),
  ],
  ack="<b>Hide</b>: görünmez yapar (açık). <b>Close</b>: kapatır; ana formsa uygulama biter. <b>Application.Exit</b>: tüm uygulamayı sonlandırır."),

Q("5.4", "yaz", "Üç deneme hakkı ve karşılama", 3,
  "Giriş uygulamasını yazın. Kullanıcı adı <b>admin</b>, şifre <b>1234</b>. (1) Şifre kutusunda karakterler görünmesin; <code>label3</code>'te <i>Kalan hak: 3</i> görünsün. (2) Her hatalı girişte hak bir azalsın ve kalan hak bildirilsin; hak 0'a düşünce mesajla program tamamen kapansın. (3) Doğru girişte giriş formu gizlensin, <code>Form2</code> açılsın; Form2'nin başlığında <i>Hoş geldin, admin</i> yazsın; kullanıcı adı Form2'ye <b>kurucu metotla</b> aktarılsın. (4) Form2 kapanınca program tamamen kapansın.",
  [],
  [
    yaz("<b>a)</b> Form1.cs içindeki alan, Load ve button1_Click metotlarını yazın.",
        [dict(ad="Kalan hak <b>sınıf düzeyinde</b> alan", any=["intkalanHak=3;"], disi=True),
         dict(ad="Şifre kutusu <code>PasswordChar = '*'</code>", any=["PasswordChar='*'"]),
         dict(ad="Doğru giriş koşulu: ad <b>ve</b> şifre (<code>&amp;&amp;</code>)", all=['textBox1.Text=="admin"', 'textBox2.Text=="1234"', "&&"]),
         dict(ad="Kullanıcı adı kurucu metotla aktarılıyor: <code>new Form2(textBox1.Text)</code>", any=["newForm2(textBox1.Text)"]),
         dict(ad="Giriş formu gizleniyor (<code>this.Hide()</code>)", any=["this.Hide();"]),
         dict(ad="Hatalı girişte hak azalıyor (<code>kalanHak--</code>)", any=["kalanHak--;", "kalanHak=kalanHak-1;", "kalanHak-=1;"]),
         dict(ad="Hak 0 olunca <code>Application.Exit()</code>", all=["kalanHak==0", "Application.Exit();"]),
         dict(ad="Form2 kapanınca programı kapatıyor (<code>FormClosed</code> + <code>Application.Exit</code>)", any=[".FormClosed+="])],
        '''int kalanHak = 3;   // alan: her tıklamada sıfırlanmasın

private void Form1_Load(object sender, EventArgs e)
{
    textBox2.PasswordChar = '*';
    label3.Text = "Kalan hak: " + kalanHak;
}
private void button1_Click(object sender, EventArgs e)
{
    if (textBox1.Text == "admin" && textBox2.Text == "1234")
    {
        Form2 anaSayfa = new Form2(textBox1.Text);
        anaSayfa.FormClosed += AnaSayfa_FormClosed;
        anaSayfa.Show();
        this.Hide();
    }
    else
    {
        kalanHak--;
        label3.Text = "Kalan hak: " + kalanHak;
        if (kalanHak == 0)
        {
            MessageBox.Show("3 kez hatalı giriş yapıldı. Program kapatılıyor.");
            Application.Exit();
        }
        else
        {
            MessageBox.Show("Hatalı giriş! Kalan hak: " + kalanHak);
        }
    }
}
private void AnaSayfa_FormClosed(object sender, FormClosedEventArgs e)
{
    Application.Exit();
}''', bas="private void Form1_Load(object sender, EventArgs e)\n{\n    \n}\nprivate void button1_Click(object sender, EventArgs e)\n{\n    \n}"),
    yaz("<b>b)</b> Form2.cs içindeki <b>kurucu metodu</b> yazın (<code>kullaniciAdi</code> parametresi alsın; başlığa <i>Hoş geldin, …</i> yazsın).",
        [dict(ad="Kurucu <code>public Form2(string kullaniciAdi)</code>", any=["publicForm2(stringkullaniciAdi)", "publicForm2(stringad)", "publicForm2(stringkullanici)", "publicForm2(stringisim)"]),
         dict(ad="<code>InitializeComponent();</code> kurucuda çağrılıyor", any=["InitializeComponent();"]),
         dict(ad="Başlık: <code>this.Text = \"Hoş geldin, \" + kullaniciAdi;</code>", any=['this.Text="Hoşgeldin,"+', 'Text="Hoşgeldin,"+'])],
        '''public Form2(string kullaniciAdi)
{
    InitializeComponent();
    this.Text = "Hoş geldin, " + kullaniciAdi;
}''', bas="public Form2()\n{\n    InitializeComponent();\n}", a="Başlık atamasını <code>InitializeComponent()</code>'ten <u>sonra</u> yazmayı unutmayın (2.1'de gördüğünüz kural)."),
    sec("<b>c)</b> Ek soru: <code>int kalanHak = 3;</code> satırı <code>button1_Click</code> <u>içinde</u> olsaydı program nasıl davranırdı?",
        ["Hiçbir fark olmazdı", "Her tıklamada yeniden 3 olurdu; hak 2'ye düşer ama bir sonraki tıklamada yine 3'ten başlar, hiç 0'a ulaşmaz ve kullanıcı sınırsız deneme yapar", "Hak her tıklamada 1 artardı", "Derleme hatası oluşurdu"], 1,
        "Tıklamalar arasında değerini koruması gereken bilgi, sınıf düzeyinde alan olarak tutulmalıdır."),
  ],
  ack="Formlar arası veri aktarımı için kurucu metoda parametre eklenir: <code>new Form2(veri)</code>."),

Q("5.5", "oku", "Hide mı, Close mu, Exit mi?", 2,
  "Ana formu <code>Form1</code> olan bir uygulamada aşağıdaki durumların her birinde ne olacağını seçin.",
  [],
  [
    coklusec("Her durum için sonucu seçin.",
             [("1) Form1'de <code>this.Hide();</code> çalışıyor. Başka açık form yok.", ["Uygulama kapanır", "Ekranda hiç pencere kalmaz ama uygulama açık kalır", "Yalnızca Form1 görünür kalır", "Hata oluşur"], 1, "Ana form kapanmamıştır, yalnızca gizlenmiştir."),
              ("2) Form1, Form2'yi <code>Show()</code> ile açmış. Form2'de <code>this.Close();</code> çalışıyor.", ["Yalnızca Form2 kapanır; Form1 görünür kalır, uygulama devam eder", "Her iki form kapanır", "Uygulama kapanır", "Form2 gizlenir"], 0, ""),
              ("3) Form1, Form2'yi <code>Show()</code> ile açmış. Form1'de <code>this.Close();</code> çalışıyor.", ["Yalnızca Form1 kapanır; Form2 açık kalır", "Ana form kapandığı için uygulama sonlanır; Form2 de kapanır", "Hiçbir şey olmaz", "Hata oluşur"], 1, ""),
              ("4) Form1 gizli, Form2 açık. Form2'de <code>Application.Exit();</code> çalışıyor.", ["Yalnızca Form2 kapanır", "Tüm formlar kapanır, uygulama sonlanır (gizli Form1 dahil)", "Form1 yeniden görünür", "Hiçbir şey olmaz"], 1, ""),
              ("5) Form1, Form2'yi <code>ShowDialog()</code> ile açmış. Form2'de <code>this.Close();</code> çalışıyor.", ["Uygulama kapanır", "Form2 kapanır, <code>ShowDialog()</code> satırı geri döner, Form1 yeniden kullanılabilir olur ve ondan sonraki satırlar çalışır; uygulama devam eder", "Form1 de kapanır", "Hata oluşur"], 1, "")]),
  ],
  ack="Ana formun kapanması = uygulamanın bitmesi. Yan formlar kapatılınca ana form etkilenmez."),
]
