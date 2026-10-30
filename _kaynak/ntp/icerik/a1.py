from dsl import *

K11 = r'''private void button1_Click(object sender, EventArgs e)
{
    messagebox.Show("Kayıt tamamlandı");
    button1.text = "Tamam"
    MessageBox.Show(Merhaba);
    /* Bu satır bir açıklamadır
}'''

K12 = r'''using System;
using System.Windows.Forms;

namespace Soru12
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
            button1.Text = "A";
            this.Text = "Kurucu";
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            button1.Text = button1.Text + "B";
            this.Text = this.Text + " + Load";
        }

        private void button1_Click(object sender, EventArgs e)
        {
            button1.Text = button1.Text + "C";
        }
    }
}'''

K14 = r'''using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;

namespace makine1
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            MessageBox.Show("Merhaba");
        }
    }
}'''

CTRL = ["Form", "button1", "textBox1", "checkBox1", "comboBox1", "linkLabel1", "dateTimePicker1", "label1"]
OLAY = ["Load", "Click", "TextChanged", "CheckedChanged", "SelectedIndexChanged", "LinkClicked", "ValueChanged"]

SORULAR = [
Q("1.1", "hata", "Derlenmeyen kod", 1,
  "Bir öğrenci, butona tıklandığında iki mesaj gösterip buton yazısını değiştiren aşağıdaki kodu yazmış ancak program derlenmemiştir.",
  [kod(K11, "Öğrencinin kodu", goster=False)],
  [
    satir("<b>a)</b> Kodda <b>beş</b> ayrı hata var. Derleyicinin kabul etmeyeceği satırlara dokunup işaretleyin, sonra <i>Kontrol et</i>'e basın. (Bir satırda birden fazla hata olabilir.)",
          0, [3, 4, 5, 6],
          [(3, "messagebox", "C# büyük-küçük harf duyarlıdır. Sınıfın adı <code>MessageBox</code>'tır; <code>messagebox</code> adında bir şey tanımlı değildir."),
           (4, "button1.text", "Button sınıfında <code>text</code> adlı bir üye yoktur. Özelliğin adı <code>Text</code>'tir."),
           (4, "Noktalı virgül eksik", "Komut <code>;</code> ile bitmediği için derleyici bir sonraki satırı da aynı komutun devamı sanar ve beklenmeyen ifade hatası verir."),
           (5, "MessageBox.Show(Merhaba)", "Tırnak işareti olmadığı için <code>Merhaba</code> bir değişken adı sayılır. Böyle bir değişken tanımlı olmadığından hata oluşur."),
           (6, "/* … kapatılmamış", "Çok satırlı açıklama <code>*/</code> ile kapatılmamıştır.")]),
    sec("<b>b)</b> Hatalardan biri, kendisinden sonraki satırların <b>tamamının</b> derleyici tarafından yanlış okunmasına neden olur. Hangisidir?",
        ["3. satır: <code>messagebox</code>", "4. satır: eksik noktalı virgül", "5. satır: tırnaksız <code>Merhaba</code>", "6. satır: kapatılmamış <code>/*</code> açıklaması"], 3,
        "<code>/*</code> görüldükten sonra derleyici <code>*/</code> görene kadar her şeyi açıklama sayar. Bu yüzden metodu kapatan <code>}</code> ve sonrasındaki tüm sınıf kodu açıklamanın içinde kalır; derleyici dosya sonuna kadar <code>*/</code> bulamayınca “dosya sonuna ulaşıldı, */ bekleniyordu” hatası verir."),
    yaz("<b>c)</b> Metodun düzeltilmiş hâlini yazın.",
        [dict(ad='3. satır: <code>MessageBox.Show("Kayıt tamamlandı");</code>', any=['MessageBox.Show("Kayıt tamamlandı");']),
         dict(ad='4. satır: <code>button1.Text = "Tamam";</code> (büyük T ve noktalı virgül)', any=['button1.Text="Tamam";']),
         dict(ad='5. satır: <code>MessageBox.Show("Merhaba");</code> (tırnaklı)', any=['MessageBox.Show("Merhaba");']),
         dict(ad="6. satır: açıklama <code>*/</code> ile kapatılmış (ya da <code>//</code> ile tek satır)", esit=["/*", "*/"], ham=True)],
        '''private void button1_Click(object sender, EventArgs e)
{
    MessageBox.Show("Kayıt tamamlandı");
    button1.Text = "Tamam";
    MessageBox.Show("Merhaba");
    /* Bu satır bir açıklamadır */
}''',
        bas='private void button1_Click(object sender, EventArgs e)\n{\n    \n}',
        ),
  ],
  ack="Windows Forms uygulamaları olay güdümlüdür. C# büyük-küçük harfe duyarlıdır, her komut <code>;</code> ile biter, metinler çift tırnak içinde yazılır ve <code>/* … */</code> açıklaması mutlaka kapatılmalıdır."),

Q("1.2", "izleme", "Kurucu metot, Load ve Click", 2,
  "Aşağıdaki <code>Form1</code> sınıfında form üzerinde yalnızca <code>button1</code> bulunmaktadır. Tüm olay metotları olaylarına doğru şekilde bağlanmıştır.",
  [kod(K12, "Form1.cs")],
  [
    tablo("<b>a)</b> Form ekrana geldiği anda butonun üzerinde ve formun başlık çubuğunda ne yazar?",
          ["Nerede?", "Yazan"],
          [["Butonun üzerinde", girdi(["AB"])], ["Formun başlık çubuğunda", girdi(["Kurucu + Load", "Kurucu+Load"], gen=18)]],
          notlar=["Önce kurucu metot çalışır ve butona <code>A</code>, başlığa <code>Kurucu</code> yazar. Form ekrana gelmeden önce Load olayı tetiklenir ve mevcut metinlerin sonuna <code>B</code> ve <code>+ Load</code> ekler.", ""]),
    metin("<b>b)</b> Kullanıcı butona art arda <b>3 kez</b> tıkladıktan sonra butonun üzerinde ne yazar?", ["ABCCC"],
          "Her tıklamada mevcut metnin sonuna bir <code>C</code> eklenir: AB → ABC → ABCC → ABCCC."),
    sec("<b>c)</b> Kurucu metotta 11. satır (<code>button1.Text = \"A\";</code>) 10. satırın (<code>InitializeComponent();</code>) üstüne taşınırsa program açılırken ne olur?",
        ["Hata olmaz; buton yine AB yazar", "Program açılırken <code>NullReferenceException</code> oluşur", "Derleme hatası verir, program hiç çalışmaz", "Buton boş görünür ama program çalışır"], 1,
        "<code>button1</code> nesnesi <code>InitializeComponent()</code> içinde <code>new Button()</code> ile oluşturulur. Bu satırdan önce <code>button1</code> değişkeni henüz hiçbir nesneyi göstermez (<code>null</code>); <code>Text</code> özelliğine erişilemez. <b>Kural:</b> kontrollere kurucu metotta ancak <code>InitializeComponent()</code> satırından <u>sonra</u> erişilebilir. Kod derlenir ama çalışma sırasında hata verir."),
    tablo("<b>d)</b> Öğrenci <code>Form1_Load</code> metodunu tasarım penceresinde çift tıklayarak oluşturmamış, başka bir projeden kopyalayıp yapıştırmıştır. Bu durumda (a) şıkkının cevabı ne olur?",
          ["Nerede?", "Yazan"],
          [["Butonun üzerinde", girdi(["A"])], ["Formun başlık çubuğunda", girdi(["Kurucu"])]],
          notlar=["Kopyalanan metot olaya bağlı olmadığı için (Designer dosyasında <code>this.Load += …</code> satırı yoktur) hiç çalışmaz.", "<b>Çözüm:</b> Properties → Events (şimşek) listesinde Load olayına bu metodu seçmek ya da formun boş bir yerine çift tıklamaktır."]),
    adim("Şimdi (a) ve (b) şıklarının neden öyle çıktığını satır satır izle.", 0,
         [dict(s=[], n="Başlangıç: henüz hiçbir şey çalışmadı.", g=[dict(ad="button1.Text", d="—"), dict(ad="Form başlığı", d="—")]),
          dict(s=[10], n="<code>InitializeComponent()</code> kontrolleri oluşturur ve varsayılan yazıları verir.", g=[dict(ad="button1.Text", d="button1"), dict(ad="Form başlığı", d="Form1")]),
          dict(s=[11], n="Kurucu: buton yazısı <b>A</b> olur.", g=[dict(ad="button1.Text", d="A"), dict(ad="Form başlığı", d="Form1")]),
          dict(s=[12], n="Kurucu: başlık <b>Kurucu</b> olur.", g=[dict(ad="button1.Text", d="A"), dict(ad="Form başlığı", d="Kurucu")]),
          dict(s=[17], n="Form ekrana gelmeden önce <b>Load</b> tetiklenir: yazının sonuna B eklenir.", g=[dict(ad="button1.Text", d="AB"), dict(ad="Form başlığı", d="Kurucu")]),
          dict(s=[18], n="Load devam eder: başlığa <code> + Load</code> eklenir. Form artık görünür.", g=[dict(ad="button1.Text", d="AB"), dict(ad="Form başlığı", d="Kurucu + Load")]),
          dict(s=[23], n="Kullanıcı 1. kez tıkladı: sona C eklenir.", g=[dict(ad="button1.Text", d="ABC"), dict(ad="Form başlığı", d="Kurucu + Load")]),
          dict(s=[23], n="2. tıklama.", g=[dict(ad="button1.Text", d="ABCC"), dict(ad="Form başlığı", d="Kurucu + Load")]),
          dict(s=[23], n="3. tıklama: <b>ABCCC</b>.", g=[dict(ad="button1.Text", d="ABCCC"), dict(ad="Form başlığı", d="Kurucu + Load")])]),
  ],
  ack="Çalışma sırası: <b>Main → new Form1() (kurucu, InitializeComponent) → Load → form görünür → kullanıcı olayları</b>."),

Q("1.3", "tasarim", "Hangi kontrol, hangi olay?", 2,
  "Aşağıdaki her istek için kodun hangi kontrolün hangi olay metoduna yazılacağını belirleyin; sonra bazı metotların gövdesini kendiniz yazın.",
  [],
  [
    tablo("<b>a)</b> Her isteğin karşısına kontrolü ve olayı seçin.",
          ["No", "İstek", "Kontrol", "Olay"],
          [["1", "Program açılır açılmaz formun başlığı <b>Öğrenci Kayıt</b> olsun.", girdi("Form", CTRL), girdi("Load", OLAY)],
           ["2", "Kullanıcı <code>textBox1</code>'e her harf yazdığında, <code>label1</code>'de kutudaki karakter sayısı görünsün.", girdi("textBox1", CTRL), girdi("TextChanged", OLAY)],
           ["3", "<code>checkBox1</code> (<i>Koşulları okudum</i>) işaretlenince Kaydet butonu (<code>button1</code>) tıklanabilir, işaret kaldırılınca tıklanamaz olsun.", girdi("checkBox1", CTRL), girdi("CheckedChanged", OLAY)],
           ["4", "<code>comboBox1</code>'den bir şehir seçildiğinde seçilen şehir mesaj olarak gösterilsin.", girdi("comboBox1", CTRL), girdi("SelectedIndexChanged", OLAY)],
           ["5", "<code>linkLabel1</code>'e tıklanınca üniversitenin web sitesi açılsın.", girdi("linkLabel1", CTRL), girdi("LinkClicked", OLAY)],
           ["6", "<code>dateTimePicker1</code>'de tarih değiştirildiğinde bu yıl ile seçilen yıl arasındaki fark <code>label2</code>'ye yazılsın.", girdi("dateTimePicker1", CTRL), girdi("ValueChanged", OLAY)]],
          notlar=["", "", "", "", "", ""]),
    yaz("<b>b)</b> 2. istek için metodun gövdesini yazın (1 satır).",
        [dict(ad="<code>label1.Text</code>'e atama yapılıyor", any=["label1.Text="]),
         dict(ad="Karakter sayısı <code>textBox1.Text.Length</code> ile alınıyor", any=["textBox1.Text.Length"])],
        '''private void textBox1_TextChanged(object sender, EventArgs e)
{
    label1.Text = textBox1.Text.Length + " karakter";
}''', bas="private void textBox1_TextChanged(object sender, EventArgs e)\n{\n    \n}"),
    yaz("<b>c)</b> 3. istek için gövdeyi yazın. (<code>if</code> yazmaya gerek var mı?)",
        [dict(ad="<code>button1.Enabled</code>'a atama yapılıyor", any=["button1.Enabled="]),
         dict(ad="<code>checkBox1.Checked</code> kullanılıyor", any=["checkBox1.Checked"])],
        '''private void checkBox1_CheckedChanged(object sender, EventArgs e)
{
    button1.Enabled = checkBox1.Checked;
}''', bas="private void checkBox1_CheckedChanged(object sender, EventArgs e)\n{\n    \n}",
        a="<code>if</code> yazmaya gerek yoktur: <code>Checked</code> zaten <code>true</code>/<code>false</code> değeri taşır ve doğrudan <code>Enabled</code>'a atanabilir. Tasarımda <code>button1</code>'in Enabled özelliği başlangıçta <b>False</b> yapılmalıdır."),
    yaz("<b>d)</b> 4. istek için gövdeyi yazın. Listedeki seçim kaldırılırsa olay yine tetiklenir; bunu da düşünün.",
        [dict(ad="Seçimin olup olmadığı <code>SelectedIndex != -1</code> ile denetleniyor", any=["comboBox1.SelectedIndex!=-1", "comboBox1.SelectedItem!=null", "comboBox1.SelectedIndex>-1", "comboBox1.SelectedIndex>=0"]),
         dict(ad="Seçili şehir <code>SelectedItem.ToString()</code> (ya da <code>Text</code>) ile alınıyor", any=["comboBox1.SelectedItem.ToString()", "comboBox1.Text", "comboBox1.SelectedItem"]),
         dict(ad="<code>MessageBox.Show</code> ile gösteriliyor", any=["MessageBox.Show("])],
        '''private void comboBox1_SelectedIndexChanged(object sender, EventArgs e)
{
    if (comboBox1.SelectedIndex != -1)
    {
        MessageBox.Show(comboBox1.SelectedItem.ToString());
    }
}''', bas="private void comboBox1_SelectedIndexChanged(object sender, EventArgs e)\n{\n    \n}",
        a="Seçim kaldırılırsa <code>SelectedIndex</code> değeri <b>−1</b> olur; <code>SelectedItem</code> boştur (<code>null</code>) ve <code>.ToString()</code> hata verir. Kontrol bu yüzden yazılır."),
    yaz("<b>e)</b> 6. istek için gövdeyi yazın.",
        [dict(ad="Bu yıl <code>DateTime.Today.Year</code> ile alınıyor", any=["DateTime.Today.Year", "DateTime.Now.Year"]),
         dict(ad="Seçilen yıl <code>dateTimePicker1.Value.Year</code> ile alınıyor", any=["dateTimePicker1.Value.Year"]),
         dict(ad="Fark <code>label2.Text</code>'e yazılıyor", any=["label2.Text="])],
        '''private void dateTimePicker1_ValueChanged(object sender, EventArgs e)
{
    int fark = DateTime.Today.Year - dateTimePicker1.Value.Year;
    label2.Text = "Yıl farkı: " + fark;
}''', bas="private void dateTimePicker1_ValueChanged(object sender, EventArgs e)\n{\n    \n}"),
  ],
  ack="Ayrıca 1. istek: <code>this.Text = \"Öğrenci Kayıt\";</code> (Form → Load). 5. istek: <code>System.Diagnostics.Process.Start(\"https://www.firat.edu.tr\");</code> (linkLabel1 → LinkClicked)."),

Q("1.4", "oku", "Form1.cs'yi okumak", 2,
  "Bölüm 1.5'teki <code>Form1.cs</code> dosyasını (<code>makine1</code> projesi) dikkate alarak aşağıdaki soruları cevaplayın.",
  [kod(K14, "Form1.cs (makine1)", goster=False)],
  [
    satir("<b>a)</b> Projenin adı <code>makine1</code> yerine <code>hesap</code> olsaydı kodda hangi satır değişirdi? O satıra dokunun.", 0, [9],
          [(9, "namespace makine1", "<code>namespace hesap</code> olurdu. Proje oluşturulurken Name alanına yazılan isim ad alanı olur (Program.cs'deki ad alanı da aynı şekilde değişir).")], tek=True),
    sec("<b>b)</b> <code>Form1</code> sınıfı hangi sınıftan türetilmiştir ve bu türetme olmasaydı ne olurdu?",
        ["<code>Control</code>'den; olmasaydı yalnızca butonlar çalışmazdı", "<code>Form</code> sınıfından; olmasaydı <code>Form1</code> boş bir sınıf olur, <code>Text</code>, <code>BackColor</code>, <code>Show()</code> gibi üyeler bulunmazdı", "<code>Button</code> sınıfından; olmasaydı butona tıklanamazdı", "Hiçbir sınıftan; <code>: Form</code> yalnızca bir yazım alışkanlığıdır"], 1,
        "<code>Text</code>, <code>BackColor</code>, <code>Show()</code> gibi üyeler <code>Form</code> sınıfında (ve onun da türediği <code>Control</code> sınıfında) tanımlıdır. <code>Form1</code> bunları <b>kalıtım</b> yoluyla devralır."),
    sec("<b>c)</b> <code>InitializeComponent</code> metodu <code>Form1.cs</code> dosyasında tanımlı olmadığı hâlde nasıl çağrılabilmektedir?",
        ["Başka bir projeden otomatik kopyalandığı için", "<code>partial</code> sayesinde sınıfın bir parçası Form1.cs'de, diğer parçası Form1.Designer.cs'de bulunur; derleyici ikisini tek sınıf olarak birleştirir", "<code>using System;</code> satırı metodu getirdiği için", "<code>Main</code> metodu onu önceden tanımladığı için"], 1,
        "<code>InitializeComponent</code> Designer dosyasındaki parçada tanımlı olduğu için <code>Form1.cs</code>'den çağrılabilir."),
    yaz("<b>d)</b> Aynı <code>Click</code> metodu hem <code>button1</code>'in hem de <code>button2</code>'nin Click olayına bağlanmıştır. Metot içinde hangi butona tıklandığını nasıl anlarsınız? Metodu, tıklanan butonun yazısını gösterecek biçimde yazın.",
        [dict(ad="<code>sender</code> parametresi <code>Button</code>'a dönüştürülüyor (<code>(Button)sender</code> ya da <code>sender as Button</code>)", any=["(Button)sender", "senderasButton"]),
         dict(ad="Tıklanan butonun <code>Text</code> özelliği okunuyor", any=[".Text"]),
         dict(ad="<code>MessageBox.Show</code> ile gösteriliyor", any=["MessageBox.Show("])],
        '''private void button1_Click(object sender, EventArgs e)
{
    Button tiklanan = (Button)sender;   // olayı tetikleyen nesne
    MessageBox.Show(tiklanan.Text + " butonuna tıklandı.");
}''', bas="private void button1_Click(object sender, EventArgs e)\n{\n    \n}",
        a="İstenirse <code>if (sender == button1)</code> karşılaştırması da yapılabilir."),
  ],
  ack="<code>sender</code> olayı tetikleyen nesnedir; genel <code>object</code> türünde olduğu için özelliklerine ulaşmak için tür dönüşümü gerekir."),
]
