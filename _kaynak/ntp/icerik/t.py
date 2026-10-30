def M(s, o, c, a): return dict(s=s, o=o, c=c, a=a)
def D(s, c, a): return dict(s=s, c=c, a=a)
def B(s, cs, a=None):
    d = dict(s=s, cs=cs if isinstance(cs, list) else [cs])
    return d

TESTLER = {}

TESTLER[1] = dict(
test=[
 M("Windows Forms uygulamaları hangi programlama modeline göre çalışır?", ["Sıralı (toplu işlem)", "Olay güdümlü", "Yalnızca komut satırı", "Yalnızca veri tabanı güdümlü"], 1, "Kullanıcının eylemleri (tıklama, yazma) olayları tetikler ve ilgili olay metotları çalışır."),
 M("C#'ta <code>messagebox.Show(\"Merhaba\");</code> yazılırsa ne olur?", ["Mesaj kutusu açılır", "Derleme hatası oluşur; sınıfın adı MessageBox'tır", "Mesaj küçük harfle görünür", "Program sessizce kapanır"], 1, "C# büyük-küçük harfe duyarlıdır."),
 M("Bir komutun sonuna noktalı virgül konmazsa ne olur?", ["Hiçbir şey olmaz", "Derleyici sonraki satırı da aynı komutun devamı sanar ve derleme hatası verir", "Komut iki kez çalışır", "Program yavaşlar"], 1, "C#'ta komutlar <code>;</code> ile biter."),
 M("<code>/* … */</code> biçimindeki çok satırlı açıklamada <code>*/</code> yazılmazsa ne olur?", ["Yalnızca o satır açıklama olur", "Derleyici sonraki tüm kodu açıklama sayar ve dosya sonuna kadar */ arar; derleme hatası oluşur", "Hiçbir etkisi olmaz", "Program çalışır ama yavaşlar"], 1, ""),
 M("Form1'in kurucu metodunda kontrollere erişmeden önce hangi çağrı yapılmalıdır?", ["Application.Run()", "InitializeComponent()", "this.Close()", "Main()"], 1, "Kontroller <code>InitializeComponent()</code> içinde oluşturulur; önce erişilirse NullReferenceException oluşur."),
 M("Aşağıdaki sıralamalardan hangisi doğrudur?", ["Load → kurucu → form görünür", "Kurucu (InitializeComponent) → Load → form görünür → kullanıcı olayları", "Form görünür → kurucu → Load", "Load → form görünür → kurucu"], 1, ""),
 M("Form1.cs ve Form1.Designer.cs dosyalarının tek bir sınıf gibi birleşmesini hangi anahtar sözcük sağlar?", ["static", "partial", "abstract", "internal"], 1, ""),
 M("Olay metodunun ilk parametresi olan <code>sender</code> neyi gösterir?", ["Formun adını", "Olayı tetikleyen nesneyi", "Fare koordinatlarını", "Önceki formu"], 1, ""),
 M("Properties penceresinde olay listesine ulaşmak için hangi simge kullanılır?", ["Şimşek", "Anahtar", "Mercek", "Çark"], 0, ""),
 M("Hangi Windows Forms olayı formun ekrana gelmesi sırasında tetiklenir?", ["Click", "Load", "TextChanged", "LinkClicked"], 1, ""),
],
dy=[
 D("C# büyük-küçük harfe duyarlı bir dildir.", True, "<code>Text</code> ile <code>text</code> farklı adlardır."),
 D("Bir olay metodunun gövdesi tasarım penceresinde değil, yalnızca Designer dosyasında yazılır.", False, "Olay metotları Form1.cs dosyasında yazılır; Designer dosyası otomatik üretilir."),
 D("<code>InitializeComponent()</code> çağrılmadan önce <code>button1.Text</code>'e değer atamak NullReferenceException'a neden olur.", True, ""),
 D("Başka projeden kopyalanan bir <code>Form1_Load</code> metodu otomatik olarak Load olayına bağlanır.", False, "Olay bağlantısı Designer dosyasında yapılır; kopyalanan metot bağlı değildir."),
],
bosluk=[
 B("Mesaj kutusu göstermek için kullanılan sınıfın adı ____ 'tır.", ["MessageBox"]),
 B("Olayı tetikleyen nesneye ulaşmak için olay metodunun ____ parametresi kullanılır.", ["sender"]),
 B("Formun ekrana gelmesi sırasında ____ olayı tetiklenir.", ["Load"]),
 B("Form sınıfının iki dosyaya bölünmesini ____ anahtar sözcüğü sağlar.", ["partial"]),
])

TESTLER[2] = dict(
test=[
 M("Bir kontrolü görünür bırakıp tıklanamaz yapmak için hangi özellik <code>false</code> yapılır?", ["Visible", "Enabled", "Hide", "ReadOnly"], 1, "<code>Visible = false</code> kontrolü gizler; <code>Enabled = false</code> pasif yapar."),
 M("Telefon numarasının biçimini kısıtlamak için hangi kontrol uygundur?", ["TextBox", "MaskedTextBox", "Label", "ProgressBar"], 1, ""),
 M("<code>numericUpDown1.Value</code> özelliği hangi türdedir?", ["int", "double", "decimal", "string"], 2, ""),
 M("Şifre kutusunda karakterlerin <code>*</code> görünmesi için hangi özellik ayarlanır?", ["PasswordChar", "MaxLength", "Multiline", "ReadOnly"], 0, ""),
 M("ComboBox'a elle yazı yazılmasını engellemek için <code>DropDownStyle</code> neye ayarlanır?", ["Simple", "DropDown", "DropDownList", "Flat"], 2, ""),
 M("<code>toolTip1.SetToolTip(button1, \"Kaydet\")</code> ifadesinde <code>SetToolTip</code> nedir?", ["Özellik", "Olay", "Metot", "Sabit"], 2, "Metotlar parantezle çağrılır, ona <code>=</code> ile değer atanamaz."),
 M("<code>dateTimePicker1.MaxDate = DateTime.Today;</code> ne sağlar?", ["Bugünden önceki tarihler seçilemez", "Bugünden ileri tarihler seçilemez", "Saat gösterilmez", "Tarih silinir"], 1, ""),
 M("Kodla oluşturulan bir butonun formda görünmesi için hangi satır gerekir?", ["b.Show();", "this.Controls.Add(b);", "b.Visible = 1;", "Application.Run(b);"], 1, ""),
 M("Kodla oluşturulan kontrolün olayına metot bağlamak için hangi operatör kullanılır?", ["=", "+=", "==", "=>"], 1, ""),
 M("Birden çok seçimin yapılabildiği ve satırlar halinde listelenen kontrol hangisidir?", ["RadioButton", "CheckedListBox", "NumericUpDown", "MaskedTextBox"], 1, ""),
],
dy=[
 D("<code>Visible = false</code> olan bir kontrole kullanıcı tıklayamaz.", True, "Görünmeyen kontrole tıklanamaz."),
 D("<code>Enabled = false</code> olan bir butonun Click olayı yine de tetiklenir.", False, "Pasif butonun Click olayı tetiklenmez."),
 D("<code>label1.Text = 25;</code> satırı derlenir, çünkü sayı otomatik metne dönüşür.", False, "Text string türündedir; int doğrudan atanamaz."),
 D("<code>numericUpDown1.Value = 2.5;</code> hatalıdır; decimal sabiti <code>2.5m</code> biçiminde yazılır.", True, ""),
],
bosluk=[
 B("Kontrolü pasif yapmak için ____ özelliği <code>false</code> yapılır.", ["Enabled"]),
 B("Kontrolü gizlemek için ____ özelliği <code>false</code> yapılır.", ["Visible"]),
 B("Telefon kalıbında baştaki sabit 0 için, kalıp karakteri olan 0'ın önüne ____ konur.", ["ters bölü", "\\", "backslash"]),
 B("ComboBox'ta aynı anda gösterilecek eleman sayısı ____ özelliğiyle belirlenir.", ["MaxDropDownItems"]),
])

TESTLER[3] = dict(
test=[
 M("Formdaki bir TextBox'tan alınan <code>Text</code> değeri hangi türdedir?", ["int", "double", "string", "decimal"], 2, ""),
 M("<code>\"Toplam: \" + 2 + 3</code> ifadesinin sonucu nedir?", ["Toplam: 5", "Toplam: 23", "5", "Hata verir"], 1, "Soldan sağa: önce metin + 2, sonra metin + 3."),
 M("<code>int a = 7, b = 2; double s = a / b;</code> ise <code>s</code> kaçtır?", ["3,5", "3", "4", "3,0000001"], 1, "İki int'in bölümü int'tir."),
 M("Türkçe bölge ayarlı bilgisayarda <code>Convert.ToDouble(\"5.4\")</code> sonucu nedir?", ["5,4", "54", "5", "Hata verir"], 1, "Türkçede nokta binlik ayırıcı, virgül ondalık ayırıcıdır."),
 M("<code>Math.Round(2.5)</code> ve <code>Math.Round(3.5)</code> sonuçları sırasıyla nedir?", ["3 ve 4", "2 ve 4", "2 ve 3", "3 ve 3"], 1, "Bankacı yuvarlaması: yarım değerler çift sayıya yuvarlanır."),
 M("Kullanıcı girişinin sayıya güvenli dönüşümünü hangi metot sağlar?", ["Convert.ToInt32", "int.Parse", "double.TryParse", "ToString"], 2, ""),
 M("<code>0.1 + 0.2 == 0.3</code> karşılaştırması double'larda neden false verir?", ["Matematik hatası olduğu için", "Kayan nokta gösteriminde 0,1 ve 0,2 tam gösterilemez", "== kullanılamaz", "Sayılar çok küçük olduğu için"], 1, ""),
 M("<code>Math.Ceiling(-10.3)</code> ve <code>Math.Floor(-10.3)</code> sonuçları sırasıyla nedir?", ["-10 ve -11", "-11 ve -10", "-10 ve -10", "-11 ve -11"], 0, ""),
 M("Para gibi kesinlik gerektiren hesaplar için hangi tip uygundur?", ["float", "double", "decimal", "char"], 2, ""),
 M("<code>if – else if – else</code> zincirinde aşağıdakilerden hangisi doğrudur?", ["Tüm koşullar çalışır", "Doğru olan ilk bloğun kodu çalışır", "Son blok her zaman çalışır", "Yalnızca else çalışır"], 1, ""),
 M("<code>int faiz = 40; double c = 1 + faiz / 100;</code> ise <code>c</code> kaçtır?", ["1,4", "1", "40", "0,4"], 1, "<code>faiz / 100</code> tamsayı bölmesidir ve 0 olur."),
],
dy=[
 D("<code>int</code> türünde sıfıra bölme çalışma anında DivideByZeroException üretir.", True, ""),
 D("<code>double</code> türünde sıfıra bölme de program çökmesine neden olur.", False, "Sonuç sonsuz (Infinity) ya da NaN olur; hata fırlatılmaz."),
 D("<code>return;</code> bir void metodu o noktada bitirir.", True, ""),
 D("Math sınıfının metotları statiktir; nesne oluşturmaya gerek yoktur.", True, ""),
],
bosluk=[
 B("Formdan alınan her veri ____ türündedir.", ["string"]),
 B("Hatalı girişte program çökmeden sayıya çevirme denemesi yapan metot ____ 'tır. (double.…)", ["TryParse"]),
 B("Ondalıklı sayı ve metin arasındaki tür dönüşümü için ____ sınıfı kullanılır.", ["Convert"]),
 B("Bir sayının üssünü almak için Math sınıfının ____ metodu kullanılır.", ["Pow"]),
])

TESTLER[4] = dict(
test=[
 M("ListBox ve ComboBox'ta eleman indisleri kaçtan başlar?", ["1", "0", "-1", "Seçime bağlıdır"], 1, ""),
 M("5 elemanlı bir listede son elemanın indisi nedir?", ["5", "4", "6", "3"], 1, "<code>Count − 1</code>"),
 M("Listede hiçbir eleman seçili değilken <code>SelectedIndex</code> kaçtır?", ["0", "1", "-1", "null"], 2, ""),
 M("Dizideki tüm elemanları döngüsüz listeye eklemek için hangi metot kullanılır?", ["Items.Add", "Items.AddRange", "Items.Insert", "Items.Copy"], 1, ""),
 M("Tüm elemanları silen en kısa yol hangisidir?", ["Items.Remove", "Items.RemoveAt(0)", "Items.Clear()", "Items.Count = 0"], 2, ""),
 M("<code>for (int i = 0; i &lt; listBox1.Items.Count; i++) listBox1.Items.RemoveAt(i);</code> neden listeyi boşaltmaz?", ["Count sabittir", "Her silmede sonraki elemanlar bir indis kayar, i ise ileri gider; her turda bir eleman atlanır", "RemoveAt yalnızca ilk elemanı siler", "Döngü hiç çalışmaz"], 1, ""),
 M("Seçim yokken <code>listBox1.Items.RemoveAt(listBox1.SelectedIndex)</code> çağrılırsa ne olur?", ["Son eleman silinir", "ArgumentOutOfRangeException oluşur", "İlk eleman silinir", "Hiçbir şey olmaz"], 1, ""),
 M("Olaylar arasında korunması gereken değer (ör. sepet tutarı) nerede tanımlanmalıdır?", ["Olay metodunun içinde", "Sınıf düzeyinde (alan olarak)", "Designer dosyasında", "Main metodunda"], 1, ""),
 M("<code>comboBox1.Text == \"Mavi\"</code> ifadesi, listedeki eleman <code>mavi</code> ise neden false verir?", ["Boşluk olduğu için", "String karşılaştırması büyük-küçük harfe duyarlıdır", "Text salt okunurdur", "Karşılaştırma yapılamaz"], 1, ""),
 M("<code>switch</code> yapısında her <code>case</code> neyle bitirilmelidir?", ["return", "break", "continue", "goto"], 1, ""),
],
dy=[
 D("<code>Items.Remove(x)</code> değeri x olan ilk elemanı siler; yoksa hata fırlatır.", False, "Eleman yoksa bir şey yapmaz."),
 D("Bir listeden döngüyle eleman silerken sondan başa gitmek kayma sorununu önler.", True, ""),
 D("Yerel değişken, olay metodu her çağrıldığında yeniden oluşturulur.", True, ""),
 D("<code>Items.AddRange</code> yalnızca tek bir eleman ekler.", False, ""),
],
bosluk=[
 B("Listedeki eleman sayısı ____ özelliğiyle öğrenilir. (Items.…)", ["Count"]),
 B("Belirli bir indisteki elemanı silen metot ____ 'dir. (Items.…)", ["RemoveAt"]),
 B("Seçim değiştiğinde tetiklenen olay ____ 'dir.", ["SelectedIndexChanged"]),
 B("Metotların dışında, sınıf düzeyinde tanımlanan değişkene ____ (field) denir.", ["alan"]),
])

TESTLER[5] = dict(
test=[
 M("<code>Form2 yeni = new Form2(); yeni.Show();</code> kodunda <code>new</code> ne yapar?", ["Formu siler", "Form2 sınıfından yeni bir nesne oluşturur", "Formu gizler", "Ana formu değiştirir"], 1, ""),
 M("<code>Show()</code> ile <code>ShowDialog()</code> arasındaki fark nedir?", ["Fark yoktur", "ShowDialog form kapanana kadar kodu bekletir ve sahibi olan forma erişimi kapatır (modal)", "Show modal açar", "ShowDialog formu gizler"], 1, ""),
 M("Kullanıcı Show() ile açılan Form2 açıkken FORM AÇ butonuna 3 kez tıklarsa kaç Form2 açılır?", ["1", "2", "3", "Hata verir"], 2, ""),
 M("Ana formu gizleyip yan formu kapatınca program neden kapanmaz?", ["Visual Studio hatası", "Application.Run ana forma bağlıdır; gizlenen form kapanmamıştır", "Form2 bellekte kalır", "Show kullanıldığı için"], 1, ""),
 M("Gizli ana form varken tüm uygulamayı kapatan komut hangisidir?", ["this.Hide()", "this.Close() (Form2'de)", "Application.Exit()", "Form2.Dispose()"], 2, ""),
 M("Ana formda <code>this.Close()</code> çalışırsa ne olur?", ["Yalnızca ana form kapanır, uygulama sürer", "Uygulama sonlanır ve açık yan formlar da kapanır", "Hiçbir şey olmaz", "Yan form ana form olur"], 1, ""),
 M("Formlar arasında veri aktarmak için bu bölümde hangi yöntem kullanıldı?", ["Kurucu metoda parametre eklemek", "Dosyaya yazmak", "Registry", "Panoya kopyalamak"], 0, ""),
 M("Formun ekranın ortasında açılması için <code>StartPosition</code> neye ayarlanır?", ["Manual", "CenterScreen", "WindowsDefaultBounds", "CenterParent"], 1, ""),
 M("Kapatılıp yok edilmiş bir formun durumunu hangi özellik gösterir?", ["IsDisposed", "Visible", "Enabled", "TopMost"], 0, ""),
 M("Form2'nin kapanışına tepki vermek için hangi olay kullanılır?", ["Load", "FormClosed", "Click", "Shown"], 1, ""),
],
dy=[
 D("<code>Hide()</code> formu kapatır ve bellekten siler.", False, "Hide yalnızca görünmez yapar."),
 D("<code>ShowDialog()</code> ile açılan pencere açıkken sahibi olan forma tıklanamaz.", True, ""),
 D("Ana form gizlenmişse <code>Application.Exit()</code> onu da kapatır.", True, ""),
 D("Form2'nin kurucusu parametre alabilir.", True, "Örn. <code>public Form2(string kullaniciAdi)</code>"),
],
bosluk=[
 B("Formu gizleyen, ama kapatmayan metot ____ 'dır.", ["Hide"]),
 B("Form kapanana kadar kodu bekleten açılış yöntemi ____ 'dir.", ["ShowDialog"]),
 B("Tüm uygulamayı sonlandıran komut ____ . (Application.…)", ["Exit"]),
 B("Form2'nin ekrana gelişinde yazılacak ayar ____ olayında yapılabilir.", ["Load"]),
])

TESTLER[6] = dict(
test=[
 M("<code>listBox1.Items.Contains(\"Ayşe\")</code>, listede <code>ayşe</code> varsa ne döndürür?", ["true", "false", "2", "-1"], 1, "Contains büyük-küçük harfe duyarlıdır."),
 M("<code>FindStringExact</code> listede bulamazsa ne döndürür?", ["0", "-1", "null", "false"], 1, ""),
 M("<code>FindStringExact(\"AYŞE\")</code> ile <code>Contains(\"AYŞE\")</code> arasındaki fark nedir?", ["Fark yoktur", "FindStringExact harf duyarsızdır ve indis döndürür; Contains duyarlıdır ve bool döndürür", "Contains indis döndürür", "FindStringExact hata verir"], 1, ""),
 M("Döngüyle aramada doğru yöntem hangisidir?", ["Döngü içinde bulunan elemanı silmek", "Döngüde yalnızca aramak, sonucu bayrakta tutmak ve kararı döngüden sonra vermek", "Her turda Add yapmak", "break kullanmamak"], 1, ""),
 M("<code>new Random().Next(1, 50)</code> hangi aralıkta sayı üretir?", ["1–50", "1–49", "0–49", "2–50"], 1, "Alt sınır dahil, üst sınır hariçtir."),
 M("Benzersiz rastgele sayı üretiminde çakışma olursa ne yapılır?", ["Program kapatılır", "Aynı konumdaki sayı yeniden üretilir (i--)", "Sayı atlanır", "Sayı 0 yapılır"], 1, ""),
 M("<code>string s = \"istanbul\"; s.ToUpper();</code> sonrası <code>s</code> nedir?", ["İSTANBUL", "istanbul", "ISTANBUL", "Hata"], 1, "Sonuç geri atanmadığı için string değişmez."),
 M("Türkçe ayarda <code>\"ID\".ToLower()</code> sonucu nedir?", ["id", "ıd", "ID", "İd"], 1, ""),
 M("Dilden bağımsız (kültürden bağımsız) küçük harfe çevirme için hangisi kullanılır?", ["ToLower()", "ToLowerInvariant()", "ToString()", "Trim()"], 1, ""),
 M("Aynı türden CheckBox'ları tek tek yazmadan işlemek için ne yapılır?", ["Her biri için ayrı metot yazılır", "Bir dizide toplanıp döngüyle işlenir", "Formdan silinir", "Hepsi tek değişkene atanır"], 1, ""),
 M("Metinde <code>metin[i + 1]</code> erişiminde hata oluşmaması için ne denetlenmelidir?", ["i &gt; 0", "i + 1 &lt; metin.Length", "metin == null", "metin.Length &gt; 100"], 1, ""),
],
dy=[
 D("<code>Math.Max</code> ve <code>Math.Min</code> iç içe kullanılarak üç sayının en büyüğü/küçüğü bulunabilir.", True, ""),
 D("<code>FindString(\"ay\")</code> metnin tamamı “ay” olan elemanı arar.", False, "“ay” ile <u>başlayan</u> ilk elemanı bulur; tam eşleşme için FindStringExact kullanılır."),
 D("<code>Checked</code> özelliği hem okunabilir hem de kodla değiştirilebilir.", True, ""),
 D("<code>Contains(veri) == true</code> yerine yalnızca <code>Contains(veri)</code> yazmak yeterlidir.", True, ""),
],
bosluk=[
 B("Rastgele sayı üretmek için ____ sınıfından nesne oluşturulur.", ["Random"]),
 B("Metnin başındaki ve sonundaki boşlukları silen metot ____ 'dir.", ["Trim"]),
 B("Bir RadioButton'ın seçili olup olmadığını ____ özelliği tutar.", ["Checked"]),
 B("Metinde dizi gibi erişimde, karakter sayısı ____ özelliğiyle bulunur.", ["Length"]),
])
