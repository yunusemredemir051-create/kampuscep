=== 1
aciklama: Veri, enformasyon, bilgi ve bilgelik farkı; yapısal, yarı yapısal ve yapısal olmayan kararlar ve yönetim bilişim sistemleri piramidi.

Bilişim sistemleri veriyi işleyerek karar vericiye yardımcı olur. Bu ünite, ham veriden doğru karara nasıl gidildiğini, işletmelerde hangi tür kararların verildiğini ve her yönetim düzeyinde hangi bilişim sisteminin kullanıldığını anlatır.

## Bilgi hiyerarşisi (DIKW piramidi)

Ham veriden karara giden yol dört basamaklı bir piramitle gösterilir. Tabanda en çok bulunan ama en az anlam taşıyan **veri**, tepede ise en az bulunan ama en değerli olan **bilgelik** yer alır. Her basamak, bir alttakinin işlenmesiyle oluşur.

- **Veri:** Henüz işlenmemiş, tek başına anlam taşımayan sayı ve semboller. Örnek: 38,5.
- **Enformasyon:** Bir bağlama oturtulmuş, "kim, ne, nerede, ne zaman" sorularını cevaplayan veri. Örnek: Ali'nin bu sabahki vücut sıcaklığı 38,5 °C.
- **Bilgi:** Enformasyonun kural ve deneyimle yorumlanması; "nasıl, ne anlama geliyor" sorusunu cevaplar. Örnek: 38 °C'nin üzeri ateştir, Ali'nin ateşi var.
- **Bilgelik:** Bilginin doğru zamanda kullanılıp karar verilmesi; "ne yapmalıyım, neden" sorusunu cevaplar. Örnek: Ateş iki gündür düşmüyorsa doktora gitmek gerekir.

Bir sistem ne kadar çok veri toplarsa toplasın, bu veri işlenip yorumlanmadıkça karar vermeye yardımcı olmaz.

## Karar türleri

- **Yapısal kararlar:** Tekrarlanan, rutin ve nasıl verileceği önceden belli olan kararlar. İşletmenin alt kademelerinde yaygındır.
- **Yarı yapısal kararlar:** Hem yapısal hem yapısal olmayan özellikler taşır; bir kısmı hesaplanabilir, bir kısmı yöneticinin muhakemesine kalır.
- **Yapısal olmayan kararlar:** Yeni, önemli ve rutin dışı kararlar. Kabul edilmiş bir prosedürleri yoktur; değerlendirme ve muhakeme gerektirir.
- **Operasyonel kararlar:** Alt yönetimin günlük, haftalık işler için verdiği, belirlilik ortamında alınan ve sonucu kısa vadede görülen kararlar. Örnek: kasiyerlerin hangi kasada çalışacağı.

## Yönetim bilişim sistemleri piramidi

Piramit; karar tiplerini, kararı veren yönetici düzeyini ve o düzeyde kullanılan sistemi birlikte gösterir. Tabanda üretim, finans, satış ve pazarlama, muhasebe ve insan kaynakları gibi fonksiyonel alanlar bulunur.

- **Veri İşleme Sistemleri (TPS) ve Ofis Otomasyonu:** Operasyonel yöneticiler ve yapısal kararlar. Satış, fatura ve stok gibi günlük işlemleri kaydeder.
- **Yönetim Bilişim Sistemleri (MIS) ve Uzman Sistemler:** Alt seviye yöneticiler ve bilgi çalışanları. İşlem verilerini düzenli raporlara dönüştürür.
- **Karar Destek Sistemleri (DSS):** Orta seviye yöneticilerin taktiksel, yarı yapısal kararları. "Şöyle olursa ne olur?" analizleri yapar.
- **Üst Yönetim Bilgi Sistemleri (EIS):** Üst yönetimin stratejik, yapısal olmayan kararları. İşletmenin genel durumunu özet göstergelerle sunar.

## Örnek: Arçelik

Arçelik'te üretim hattı otomasyonu ve SAP ERP tabanlı stok takibi operasyonel düzeyde; üretim, satış ve maliyet raporları bilgi düzeyinde; mevsimsel satış trendi analizi ve tedarik zinciri optimizasyonu taktiksel düzeyde; yeni fabrika yatırımı ve pazar seçimi ise stratejik düzeyde yer alır.

=== 2
aciklama: Ana kart, kuzey ve güney köprüsü, işlemci bileşenleri, önbellek, BIOS ve CMOS, veri yolları ve portlar, ekran kartı ve ağ kartı.

Bu ünite bir bilgisayarın içindeki temel donanım birimlerini, bu birimlerin birbirine nasıl bağlandığını ve satın alırken bakılması gereken parametreleri anlatır.

## Ana kart

Bilgisayardaki bütün birimler ana karta bağlanır. Ana kart üzerindeki paralel iletken tellerden oluşan yapıya **veri yolu (BUS)** denir; veri yolları taşınacak verinin boyutunu belirler.

- **Chipset (yonga seti):** Ana karttaki birimleri yöneten ve aralarındaki veri akışını sağlayan bir tür işlemcidir.
- **Kuzey köprüsü:** İşlemci, RAM ve AGP gibi temel birimler arasındaki veri alışverişini sağlar.
- **Güney köprüsü:** PCI, USB, IDE ve BIOS gibi diğer birimler arasındaki veri alışverişini sağlar.

Günümüzde kuzey köprüsünün görevleri büyük ölçüde işlemcinin içine taşınmıştır. AGP'nin yerini PCI Express, IDE'nin yerini SATA ve M.2 almıştır. Ana kart seçerken işlemci desteğine (Intel, AMD) ve bellek desteğine (DDR3, DDR4 gibi) bakılır.

## İşlemci (CPU)

İşlemci veri alır, işler ve gönderir. Temel bileşenleri şunlardır:

- **ALU:** Aritmetik ve mantıksal işlemlerin yapıldığı birim.
- **Komut çözücü:** Gelen verilerle hangi işlemin yapılacağını çözer.
- **Kaydediciler:** Verileri 32 veya 64 bitlik paketler hâlinde tutar.
- **Bayraklar:** Yapılan işlemler hakkında bilgi tutan 1 bitlik verilerdir.

İşlemci parametreleri hız, bit genişliği, FSB hızı (işlemci ile ana kart arasındaki veri akış hızı), önbellek ve çekirdek sayısıdır. Çekirdek sayısı arttıkça birim zamanda yapılan iş de artar.

## Önbellek mantığı

İşlemci aradığı veriyi önce en hızlı ve en küçük alan olan **L1** önbellekte arar; bulamazsa sırasıyla L2, L3, RAM ve diske iner. Çekirdekten diske gidildikçe kapasite de gecikme de artar. İşlemci satın alırken ilanda yazan önbellek değeri genellikle **L3** önbelleğidir.

## BIOS ve CMOS

**BIOS**, bilgisayarın açılması için gerekli komutları işlemciye gönderen ve donanımı tanıyıp test eden yazılımdır. ROM bellekte tutulduğu için elektrik kesilince silinmez. Yeni ana kartlarda yerini daha gelişmiş **UEFI** almıştır. **CMOS** ise saat, fan hızı gibi BIOS ayarlarını saklayan çiptir; bilgileri korumak için küçük bir pille çalışır. Pil bitince CMOS ayarları sıfırlanır, bilgisayarın saati her açılışta başa döner.

## Veri yolları ve portlar

**Bant genişliği** bir veri yolundan aynı anda geçebilecek veri miktarıdır; yol ne kadar genişse trafik o kadar rahat akar.

- **PCI:** Ses, ağ gibi kartların takıldığı paralel veri yolu.
- **AGP:** Video verisi için kullanılan, 32 bit bant genişliğine sahip paralel veri yolu.
- **PCI Express:** Birden fazla hattan iletişim kuran, günümüzün standart yuvası.
- **USB (Evrensel Seri Veri Yolu):** Takılan cihazı otomatik tanır. USB 2.0'ın bant genişliği 480 Mbit, USB 3.0'ınki 4,8 Gbit'tir.
- **Seri port:** Her seferinde 1 bit aktarır. **Paralel port (LPT):** Bir seferde 8 bit aktarır ve 25 pinlidir. İkisi de günümüzde yerini USB'ye bırakmıştır.

## Ekran kartı, ekran ve ağ kartı

Ekran kartının kendi grafik işlemcisi ve belleği vardır; bu, bilgisayar işlemcisinin yükünü azaltır. **RAMDAC** dijital görüntüyü analog görüntüye çevirir. Ekranda çözünürlük, tazeleme oranı, tepki süresi ve çıkış türleri (D-SUB, DVI, HDMI) önemlidir. **Ağ kartları** bilgisayarlar arası iletişimi sağlar; her ağ kartına 48 bit genişliğinde bir **MAC adresi** verilir. Kablolu ve kablosuz çeşitleri vardır.

=== 3
aciklama: Binary, oktal, decimal ve hexadecimal sayı sistemleri, tabanlar arası dönüşümler, dört işlem ve bit, bayt, KB, MB, GB dönüşümleri.

Bilgisayar her bilgiyi açık (1) ve kapalı (0) durumlarıyla saklar. Bu ünite dört sayı sistemini, bunlar arasında nasıl dönüşüm yapıldığını, her sistemde dört işlemi ve bilgi birimlerini anlatır.

## Dört sayı sistemi

- **Binary (ikilik, taban 2):** Yalnızca 0 ve 1 kullanılır. Örnek: (1011)<sub>2</sub>.
- **Oktal (sekizlik, taban 8):** 0–7 rakamları kullanılır. Örnek: (472)<sub>8</sub>.
- **Decimal (onluk, taban 10):** Günlük hayatta kullandığımız 0–9 rakamları.
- **Hexadecimal (on altılık, taban 16):** 0–9 rakamlarına ek olarak A=10, B=11, C=12, D=13, E=14, F=15 harfleri kullanılır. Örnek: (B12C9)<sub>16</sub>.

Bir hexadecimal basamak 4 bite, bir oktal basamak 3 bite karşılık gelir. Gruplama yöntemleri bu yüzden çalışır.

## Dönüşümler

- **Binary → decimal:** Her basamak 2'nin kuvvetiyle çarpılıp toplanır. (101101)<sub>2</sub> = 32 + 8 + 4 + 1 = (45)<sub>10</sub>.
- **Decimal → binary:** Sayı sürekli 2'ye bölünür; kalanlar sondan başa okunur. (29)<sub>10</sub> = (11101)<sub>2</sub>.
- **Binary → oktal:** Sayı sağdan üçerli gruplara ayrılır, her grup 4-2-1 ağırlıklarıyla okunur. (10011010)<sub>2</sub> = (232)<sub>8</sub>.
- **Binary → hexadecimal:** Sayı sağdan dörderli gruplara ayrılır, her grup 8-4-2-1 ağırlıklarıyla okunur. (01101110)<sub>2</sub> = (6E)<sub>16</sub>.
- **Oktal veya hexadecimal → binary:** Her basamak tek tek ikiliğe çevrilir; oktalda 3, hexadecimalde 4 haneli yazılır. (9A)<sub>16</sub> = (10011010)<sub>2</sub>.

## Dört işlem

Tüm tabanlarda mantık decimal ile aynıdır; yalnızca elde ve borcun değeri tabana eşittir.

- **Binary:** 1 + 1 = 0, elde 1. Çıkarmada 0'dan 1 çıkmazsa soldan 2 değerinde borç alınır. Örnek: (1011)<sub>2</sub> + (1101)<sub>2</sub> = (11000)<sub>2</sub>.
- **Oktal:** Toplam 8 veya daha büyükse 8 çıkarılıp 1 elde aktarılır; borç 8 değerindedir. Örnek: (456)<sub>8</sub> + (173)<sub>8</sub> = (651)<sub>8</sub>.
- **Hexadecimal:** Harfler sayı değerleriyle düşünülür; elde ve borç 16 değerindedir. Örnek: (B32)<sub>16</sub> − (5C7)<sub>16</sub> = (56B)<sub>16</sub>. Orta basamakta borç verildiği unutulursa yanlışlıkla 57B bulunur.

## Bilgi birimleri

**Bit** bilginin en küçük birimidir ve yalnızca 0 ya da 1 değerini alır. 4 bite **nibble**, 8 bite **bayt** denir; bir karakter genellikle 1 bayt ile saklanır. n bit ile 2<sup>n</sup> farklı değer gösterilebilir; bu yüzden 1 bayta yazılabilecek en büyük sayı (11111111)<sub>2</sub> = 255'tir.

- 1 bayt = 8 bit; 1 KB = 1024 bayt; 1 MB = 1024 KB; 1 GB = 1024 MB; 1 TB = 1024 GB.
- **Büyük birimden küçüğe geçerken çarpılır, küçükten büyüğe geçerken bölünür.** Örnek: 3 KB = 3 × 1024 = 3072 bayt = 24.576 bit.
- Disk üreticileri 1 GB'ı 1.000.000.000 bayt kabul eder. Bu yüzden 500 GB diye satılan disk bilgisayarda yaklaşık 465 GB görünür.
- İnternet hızları bit cinsinden verilir: 100 Mbps'lik bağlantı en fazla 100 ÷ 8 = 12,5 MB/s hızla indirir.

=== 4
aciklama: Boole cebrinin esasları ve kuralları, De Morgan kuralı, sadeleştirme ve AND, OR, NOT, NAND, NOR, XOR, XNOR lojik kapıları.

Boole cebri, 1854'te George Boole'un geliştirdiği ve 1938'de Shannon'ın devrelere uyguladığı simgesel bir mantık sistemidir. Bilgisayar devrelerinin tasarımının temelini oluşturur.

## Esaslar

Bir değişken yalnızca iki değer alır: 1 (doğru) ya da 0 (yanlış). Üç temel işlem vardır: **VE (AND)** "·" ile, **VEYA (OR)** "+" ile, **DEĞİL (NOT)** ise değişkenin üzerine çizgi çekilerek gösterilir.

## Temel kurallar

- **Değişme:** X + Y = Y + X ve X · Y = Y · X.
- **Dağılma:** X · (Y + Z) = X·Y + X·Z ve (X + Y) · (X + Z) = X + Y·Z.
- **Özdeşlik:** X + X = X ve X · X = X.
- **VE kuralı:** X · 1 = X ve X · 0 = 0. **VEYA kuralı:** X + 0 = X ve X + 1 = 1.
- **Tamamlayıcı:** X + <span class="ust-cizgi">X</span> = 1 ve X · <span class="ust-cizgi">X</span> = 0.
- **De Morgan:** <span class="ust-cizgi">X · Y</span> = <span class="ust-cizgi">X</span> + <span class="ust-cizgi">Y</span> ve <span class="ust-cizgi">X + Y</span> = <span class="ust-cizgi">X</span> · <span class="ust-cizgi">Y</span>.

## Sadeleştirme örnekleri

Kurallar art arda uygulanarak ifadeler sadeleştirilir. Örneğin X·Y + X = X·(Y + 1) = X olur. Benzer şekilde Y·(X + <span class="ust-cizgi">X</span>) + <span class="ust-cizgi">Y</span> = Y + <span class="ust-cizgi">Y</span> = 1 bulunur. Sadeleştirme, aynı işi daha az kapıyla yapan devre kurmayı sağlar.

## Lojik kapılar

- **VE (AND):** Yalnızca tüm girişler 1 ise çıkış 1'dir.
- **VEYA (OR):** Girişlerden en az biri 1 ise çıkış 1'dir.
- **DEĞİL (NOT):** Tek girişlidir, girişin tersini verir.
- **VE DEĞİL (NAND):** AND'in tersidir; yalnızca tüm girişler 1 ise çıkış 0 olur. NAND'in iki girişine aynı sinyal verilirse NOT kapısı elde edilir.
- **VEYA DEĞİL (NOR):** OR'un tersidir; yalnızca tüm girişler 0 ise çıkış 1 olur.
- **YA DA (XOR):** Girişler birbirinden farklıysa çıkış 1'dir.
- **YA DA DEĞİL (XNOR):** Girişler aynıysa çıkış 1'dir.

Bir Boole ifadesinin lojik diyagramı çizilirken her çarpım için bir VE, her toplam için bir VEYA, her ters alınan değişken için bir DEĞİL kapısı kullanılır. Örneğin Q = A·B + B·<span class="ust-cizgi">C</span>·D için 2 VE, 1 VEYA ve 1 DEĞİL kapısı gerekir.

=== 5
aciklama: Avcı-toplayıcı toplumdan süper akıllı topluma: Toplum 1.0'dan Toplum 5.0'a beş aşamanın özellikleri.

İnsanlık tarihi, üretim biçimini ve gündelik hayatı kökten değiştiren beş aşamada incelenir. Her aşama bir öncekinin üzerine kurulmuştur.

## Toplum 1.0: Avcı-toplayıcı toplum

İnsanın doğaya tam bağımlı olduğu ilk aşamadır. İnsanlar göçebe yaşar, avcılık ve toplayıcılıkla geçinir, küçük ve akraba temelli gruplar hâlinde yaşar.

## Toplum 2.0: Tarım toplumu

Yerleşik hayata geçişle başlar. Tarım ve hayvancılık başlar, köyler ve ilk şehirler kurulur. Yazı icat edilir; sosyal sınıflar ve ticaret bu aşamada oluşur.

## Toplum 3.0: Sanayi toplumu

Sanayi Devrimi ile başlar. Buhar gücü ve makineleşme fabrikalarda seri üretimi mümkün kılar. Kentleşme hızlanır, işçi sınıfı doğar.

## Toplum 4.0: Bilgi toplumu

Bilgi ve iletişim teknolojilerinin yükselişiyle başlar. İnternet, dijitalleşme ve küreselleşme bu dönemin özellikleridir. Bilgi, birincil üretim faktörü ve güç kaynağı hâline gelir.

## Toplum 5.0: Süper akıllı toplum

Dijital teknolojilerin insan merkezli bir yaklaşımla kullanıldığı en yeni aşamadır. Temel fikir siber dünya ile fiziksel dünyanın tam bütünleşmesidir. Yapay zekâ, nesnelerin interneti (IoT), büyük veri ve robotik gibi teknolojiler toplumsal sorunları çözmek ve insan refahını artırmak için kullanılır.

Örneğin bir şehirde sensörlerden toplanan trafik verisinin yapay zekâ ile işlenip yaşlıların hastaneye ulaşımını kolaylaştıran otonom servislere dönüştürülmesi Toplum 5.0'a bir örnektir.

"Toplum 5.0" kavramı ilk kez Japonya'da, hükûmetin 2016'da yayımladığı bilim ve teknoloji planında ortaya atılmıştır. Üretimin dijitalleşmesini anlatan **Endüstri 4.0** ile karıştırılmamalıdır; Toplum 5.0 bu teknolojilerin toplumun bütününe yarar sağlamasına odaklanır.

=== 6
aciklama: Yazılım geliştirme yaşam döngüsünün altı evresi, şelale, V, spiral ve çevik modellerin karşılaştırması ve use case kavramı.

Yazılım geliştirme yalnızca kod yazmaktan ibaret değildir. Kodlama sürecin yaklaşık %15-20'sidir; geri kalanı problemi doğru anlamak, kaliteyi denetlemek ve sürdürülebilirliği sağlamaktır. Bu süreci yöneten disipline **Yazılım Geliştirme Yaşam Döngüsü (SDLC)** denir.

## SDLC nedir?

SDLC, bir yazılım projesini fikir aşamasından kullanımdan kaldırılmasına kadar yöneten yapısal bir yöntemdir. **Buzdağı benzetmesinde** kodlama ve arayüzler suyun üstünde görünen kısım, müşteri görüşmeleri, fizibilite, veri tabanı tasarımı, risk analizi ve test senaryoları ise suyun altındaki büyük kütledir.

SDLC'nin amaçları disiplin (plansız çalışmayı önlemek), kontrol (bütçe ve zaman sınırlarına uymak), kalite ve öngörülebilirliktir. Amaç, tek kişinin yazdığı dokümansız bir "program"dan; test edilmiş, dokümante edilmiş ve müşteri gereksinimine göre üretilmiş bir **yazılım ürününe** geçmektir.

## Altı evre

1. **Planlama:** Fizibilite değerlendirilir; bütçe, kaynak ve zaman planı yapılır. Temel soru: Bu projeyi yapmaya değer mi?
2. **Analiz:** Müşterinin ne istediği ayrıntılı anlaşılır. Çıktısı Gereksinim Spesifikasyon Dokümanı'dır (SRS).
3. **Tasarım:** Teknik mimari, veri tabanı şemaları ve kullanıcı arayüzleri tasarlanır.
4. **Gerçekleştirme:** Tasarım koda dökülür, altyapı kurulur.
5. **Test:** Hatalar (bug) bulunur ve gereksinimlerin karşılanıp karşılanmadığı kontrol edilir.
6. **Bakım:** Teslimden sonraki güncellemeler ve düzeltmelerdir. En uzun süren ve en maliyetli evredir.

## SDLC modelleri

- **Şelale (Waterfall):** Her aşama bir öncekinin bitmesiyle başlar, geri dönüş çok zordur. Yönetimi basit, dokümantasyonu güçlüdür; ancak değişime kapalıdır ve müşteri ürünü yalnızca en sonda görür. Gereksinimleri değişmeyecek projelere uygundur.
- **V-Modeli:** Şelalenin test odaklı hâlidir; her geliştirme adımının karşısında bir test adımı bulunur. Hata tespiti erken başlar. Tıbbi cihaz ve havacılık gibi kritik sistemlerde kullanılır.
- **Spiral model:** Proje, her birinde risk analizi yapılıp prototip üretilen döngülerle ilerler. Risk yönetimi mükemmeldir ama karmaşık ve maliyetlidir; küçük projelere uygun değildir.
- **Çevik (Agile):** Proje 2-4 haftalık **sprintlere** bölünür, her sprint sonunda çalışan bir parça teslim edilir. Değişime hızlı uyum sağlar ve müşteri sürekli sürece katılır; dokümantasyonu zayıf kalabilir. En yaygın uygulaması **Scrum**'dır. Mobil ve web projelerine uygundur.

En iyi model yoktur, projeye en uygun model vardır. Sıfır hata gereken bir nükleer santral yazılımında V-Modeli, hızla değişen bir e-ticaret sitesinde Çevik model, gereksinimleri baştan belli bir arşiv sisteminde Şelale yeterli olabilir.

## Vaka: güvenlik kritik bir tıbbi cihaz

Vücuda yerleştirilen, sıfır hata toleranslı, teknolojisi henüz belirsiz ve ağır regülasyona tabi bir cihaz yazılımında en uygun yaklaşım **V-Modeli ile Spiral modelin birleştirildiği hibrit modeldir**. V-Modeli izlenebilirliği ve doğrulamayı, Spiral ise belirsizlik ve risk yönetimini sağlar. Şelale değişime kapalı olduğu için, Çevik ise hafif dokümantasyonu izlenebilirlik zorunluluğuyla çeliştiği ve "hızlı hata yap" mantığı hasta üzerinde denenemeyeceği için elenir.

## Use case (kullanım durumu)

Use case, sistemin bir işi **nasıl** yaptığına değil, **ne yaptığına** odaklanan bir senaryodur. Bileşenleri şunlardır:

- **Aktör:** Sistemi kullanan kişi ya da başka bir sistem.
- **Amaç:** Aktörün ulaşmak istediği hedef.
- **Ön koşul:** Senaryonun başlaması için gereken şart. Örnek: ürün stokta olmalı.
- **Ana senaryo:** Her şeyin yolunda gittiği akış.
- **Alternatif senaryo:** İstisna ve hata durumları. Örnek: stok yoksa uyarı verilir.

Use case diyagramları PlantUML, draw.io ve Mermaid gibi araçlarla çizilebilir.

=== 7
aciklama: İşletim sisteminin görevleri, kullanıcı ve görev sayısına göre sınıflandırma, Windows, macOS, Linux, Pardus, Android, iOS ve arayüz türleri.

**İşletim sistemi**, donanım ile kullanıcı arasında köprü görevi gören, bilgisayarın kaynaklarını yöneten ve uygulamaların çalışmasını sağlayan yazılımdır. Temel özellikleri kullanıcı dostu arayüz, çoklu görev, güvenlik ve kullanıcı yetkilendirme, hızlı çalışma ve donanım uyumluluğudur.

## Sınıflandırma

- **Kullanıcı sayısına göre:** Tek kullanıcılı (MS-DOS) ve çok kullanıcılı (UNIX, Linux).
- **Görev yapısına göre:** Tek görevli (MS-DOS) ve çok görevli (Windows, Linux, macOS).
- **Kullanım alanına göre:** Masaüstü, mobil ve sunucu işletim sistemleri.

Aynı anda birçok kullanıcının bağlanıp her birinin birkaç program çalıştırdığı bir sunucu, çok kullanıcılı ve çok görevli bir sistem kullanır.

## Masaüstü işletim sistemleri

- **Windows:** Microsoft'un geliştirdiği, dünyada en yaygın masaüstü sistemi. Ticari ve kapalı kaynaktır; geniş yazılım ve donanım desteği vardır.
- **macOS:** Apple'ın yalnızca Mac bilgisayarlar için geliştirdiği, Unix tabanlı, kararlı ve kapalı kaynak sistem. Grafik tasarım ve yaratıcı işlerde tercih edilir.

## Sunucu ve Linux tabanlı sistemler

- **Linux:** Açık kaynak kodlu bir çekirdek ailesidir. Sunucularda liderdir; Ubuntu ve Fedora gibi birçok dağıtımı vardır.
- **Pardus:** TÜBİTAK ULAKBİM'in geliştirdiği, Debian tabanlı, yerli, açık kaynaklı ve ücretsiz sistemdir. Kamu kurumları için uygundur.
- **Unix:** 1970'lerden gelen, çok kullanıcılı ve çok görevli, kararlı bir sistemdir. macOS'un temelini oluşturur; Linux da Unix'in tasarım fikirlerini izler.

İşletim sisteminin donanımla doğrudan konuşan kısmına **çekirdek (kernel)** denir. Linux aslında bir çekirdektir; Ubuntu, Fedora ve Pardus bu çekirdeğin üzerine arayüz ve uygulamalar eklenerek oluşturulan dağıtımlardır. Android de aynı çekirdeği kullanır.

## Mobil işletim sistemleri

- **Android:** Google'ın geliştirdiği, Linux tabanlı ve açık kaynaklı sistemdir. En yüksek pazar payına sahiptir ve çok çeşitli cihazda kullanılır.
- **iOS:** Yalnızca Apple cihazlarında çalışan, güvenli ve kararlı sistemdir.
- **HarmonyOS:** Huawei'nin telefon, saat, tablet ve televizyonlarında ortak kullandığı sistemdir.
- **HyperOS:** Xiaomi'nin Android tabanlı, çok cihazlı ekosistem sistemidir.

## Kullanıcı arayüzleri

- **Komut satırı arayüzü (CLI):** Ekranda yalnızca yazı vardır; komutlar klavyeyle yazılır (dir, cd gibi). MS-DOS ve sunuculardaki Linux böyle kullanılır.
- **Grafik kullanıcı arayüzü (GUI):** Pencere, simge, menü ve fare imlecinden oluşur; komut ezberlemek gerekmez. Windows, macOS, Ubuntu ve Pardus bu türdedir.
- **Dokunmatik arayüz:** Grafik arayüzün parmakla kullanılan biçimidir; fare imleci yoktur. Android ve iOS bu türdedir.

=== 8
aciklama: Dizi, yığın, kuyruk, bağlı liste, ağaç ve graf; algoritmanın özellikleri, akış şeması sembolleri, doğrusal ve ikili arama, kabarcık sıralama.

Bir programın hızı ve bellek kullanımı, verinin nasıl düzenlendiğine ve üzerinde hangi adımların izlendiğine bağlıdır. Bu ünite temel veri yapılarını ve algoritma kavramını anlatır.

## Veri yapısı nedir?

**Veri yapısı**, verilerin bellekte nasıl düzenleneceğini, saklanacağını ve onlara nasıl erişileceğini belirleyen yapıdır. Kütüphanedeki kitapların konu ve yazar sırasıyla dizilmesi gibi, veriyi belirli bir düzende tutarak eklemeyi, aramayı ve sıralamayı kolaylaştırır. Elemanları sıra hâlinde dizilen yapılara **doğrusal** (dizi, yığın, kuyruk, bağlı liste), dallanarak bağlanan yapılara **doğrusal olmayan** (ağaç, graf) denir.

## Doğrusal veri yapıları

- **Dizi (array):** Aynı türden verilerin bellekte yan yana tutulduğu ve her elemana bir **indis** ile erişilen yapıdır. İndis genellikle 0'dan başlar; n elemanlı dizinin son indisi n − 1'dir. Elemana doğrudan erişim çok hızlıdır, ama araya ekleme ve silme için elemanlar kaydırılır.
- **Yığın (stack):** Elemanlar yalnızca tepeden eklenip çıkarılır; **son giren ilk çıkar (LIFO)**. Üst üste konmuş tabaklar gibidir. İşlemleri push (ekle), pop (çıkar) ve top'tur (tepeyi göster). Geri al (Ctrl+Z), tarayıcıdaki geri düğmesi ve parantez denetimi yığınla yapılır.
- **Kuyruk (queue):** Elemanlar arkadan eklenir, önden çıkar; **ilk giren ilk çıkar (FIFO)**. Banka sırası gibidir. Yazıcıya gönderilen belgeler ve çağrı merkezindeki aramalar kuyrukla yönetilir.
- **Bağlı liste:** Her düğüm hem veriyi hem de bir sonraki düğümün adresini tutar; son düğüm NULL gösterir. Tren vagonları gibidir; araya eleman eklemek için yalnızca bağlantılar değişir.

A, B, C sırasıyla eklenen elemanlar yığından C, B, A sırasıyla; kuyruktan ise A, B, C sırasıyla çıkar.

## Doğrusal olmayan veri yapıları

- **Ağaç:** Elemanların üst–alt ilişkiyle bağlandığı hiyerarşik yapıdır. En üstteki düğüme **kök**, alt düğümü olmayanlara **yaprak** denir. Bilgisayardaki klasör yapısı ve soy ağacı birer ağaçtır.
- **Graf:** Düğümlerin kenarlarla serbestçe bağlandığı yapıdır; bir düğüme birden çok yoldan ulaşılabilir. Şehirler ve aralarındaki yollar, sosyal ağlar birer graftır.

## Algoritma

**Algoritma**, bir problemi çözmek için izlenen, sırası belli ve sonlu sayıdaki adımlar dizisidir. Bir yemek tarifi ya da çay demleme talimatı da birer algoritmadır. İyi bir algoritma sıfır ya da daha fazla giriş alır, en az bir çıkış üretir, her adımı açık ve tek anlamlıdır, mutlaka sona erer ve gereksiz adım içermez. Algoritma bir programlama diline bağlı değildir; sözel olarak, sözde kodla (pseudo code) ya da akış şemasıyla gösterilebilir.

## Akış şeması

- **Oval:** Başla / Bitir.
- **Paralelkenar:** Giriş / çıkış (veri okuma, sonuç yazdırma).
- **Dikdörtgen:** İşlem (hesaplama, atama).
- **Eşkenar dörtgen (baklava):** Karar; koşul sınanır, evet ve hayır yollarına ayrılır.
- **Ok:** Akış yönü.

Akış şemalarında üç temel yapı vardır: adımların sırayla yapıldığı **sıralı yapı**, koşula göre yol seçilen **karar yapısı** ve adımların koşul sağlandıkça tekrarlandığı **döngü yapısı**. Toplam bulunurken başlangıç değeri 0, faktöriyel gibi çarpım bulunurken 1 olmalıdır; aksi hâlde çarpım hep 0 çıkar.

## Arama ve sıralama

- **Doğrusal arama:** Aranan değer dizinin başından itibaren tek tek karşılaştırılır. Dizinin sıralı olması gerekmez.
- **İkili arama:** Yalnızca **sıralı** dizilerde çalışır. Ortadaki elemanla karşılaştırılır; aranan küçükse sol, büyükse sağ yarıda devam edilir. Her adımda alan yarıya indiği için 1000 elemanlı bir dizide en fazla 10 adımda sonuca ulaşır.
- **Kabarcık sıralama:** Yan yana iki eleman karşılaştırılır, sıraları yanlışsa yer değiştirilir. Her geçişin sonunda en büyük eleman dizinin sonuna yerleşir. Örnek: [5, 3, 8, 1] üç geçişte [1, 3, 5, 8] olur.

Veri yapıları ve algoritmalar birlikte kullanılır: harfleri yığına ekleyip geri çıkarmak bir kelimeyi tersine çevirir (KİTAP → PATİK), yazıcıda ise ilk gönderilen belgenin ilk basılması için kuyruk kullanılır.
