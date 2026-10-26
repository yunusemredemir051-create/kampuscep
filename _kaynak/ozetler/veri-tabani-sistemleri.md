=== 1
aciklama: Veri tabanı nedir, listelerin sorunları, VTYS ve veri modelleri, tablo, kayıt, alan, birincil ve yabancı anahtar, metadata, indeks, saklı yordam ve tetikleyici.

Bu ünite veri tabanının ne olduğunu, neden basit listeler yerine veri tabanı kullanıldığını ve bir veri tabanı sistemini oluşturan temel kavramları anlatır.

## Veri tabanı nedir?

**Veri tabanı**, birbiriyle ilişkili verilerin kullanım amacına uygun biçimde düzenlenerek saklandığı bilgi deposudur. Genellikle bilgisayarda elektronik olarak tutulan, yönetilebilir, güncellenebilir ve aralarında tanımlı ilişkiler bulunan yapılandırılmış bir veri koleksiyonudur. Üniversitedeki öğrenci işleri sistemi, hastanedeki hasta ve tedavi kayıtları, bir bankanın müşteri ve kredi bilgileri birer veri tabanı örneğidir.

- **Veri yönetimi:** Verilerin uygun biçimde üretilmesine, depolanmasına ve alınmasına odaklanan disiplin.
- **Yapısal veri:** Saklanması ve kullanılması kolay olsun diye biçimlendirilmiş veri. **Yapılandırılmamış veri** ise ham durumdaki veridir.
- **Metadata (üst veri):** Tabloların, sütunların, veri türlerinin ve ilişkilerin özelliklerini açıklayan veri; yani verinin verisi.
- **VTYS (Veri Tabanı Yönetim Sistemi):** Veri tabanlarını oluşturmak, saklamak ve yönetmek için tasarlanmış yazılım paketi.

## Neden liste yerine veri tabanı?

Müşteri, firma ve satış bilgilerinin tek bir listede tutulması üç soruna yol açar:

- **Güncelleme sorunu:** Bir firmanın adresi üç satırda geçiyorsa, adres değiştiğinde birinin unutulması bilgi tutarsızlığı yaratır.
- **Silme sorunu:** Bir firmaya ait kayıtlar silinince müşteri bilgileri de kaybolur.
- **Paylaşım sorunu:** Her departman listenin farklı bir kısmına ihtiyaç duyar; listenin tamamını herkesle paylaşmak gizlilik açısından sakıncalıdır.

Çözüm, farklı konuları farklı tablolara ayırmak ve tabloları numaralarla birbirine bağlamaktır. Böylece firmanın adresi tek bir yerde durur ve değiştiğinde yalnızca bir satır güncellenir. Bu sürece **normalizasyon** denir.

Veri tabanı yaklaşımı veri tekrarını önler, merkezî denetim ve tutarlılık sağlar, veriyi yetkisiz kişilerden korur, programları verilerden ayırır ve yedekleme gibi işletim sorunlarına çözüm sunar.

## VTYS ve veri modelleri

Yaygın veri tabanı yönetim sistemleri arasında Oracle, Microsoft SQL Server, MySQL, PostgreSQL, SQLite ve IBM DB2 sayılabilir. Veri modeline göre dört tür vardır:

- **Hiyerarşik:** İlk modeldir; veriler ağaç yapısında saklanır.
- **Ağ:** 1960'ların sonunda ortaya çıkmıştır; veriler graf şeklinde saklanır.
- **İlişkisel:** 1970'lerin başında geliştirilmiştir; veriler tablolarda tutulur ve tablolar birbirine bağlanır. Günümüz veri tabanlarının hemen hepsi bu modeldedir. Microsoft SQL Server da ilişkiseldir.
- **Nesneye yönelik:** C++ gibi nesneye yönelik dillerle oluşturulup kullanılan veri tabanıdır.

## Veri tabanı sisteminin bileşenleri

Bir veri tabanı sistemi **kullanıcı**, **veri tabanı uygulaması**, **VTYS** ve **veri tabanı** bileşenlerinden oluşur. Kullanıcı formu doldurur; uygulama bu bilgiyi SQL isteğine çevirip VTYS'ye iletir; VTYS de veri tabanı dosyalarında okuma ya da yazma yapar. Formları ve raporları oluşturmak ve "stok yetmezse ne yapılacağı" gibi uygulama mantığını yürütmek uygulamanın; tabloları oluşturmak, kısıtları uygulamak, yetkileri denetlemek ve yedek almak ise VTYS'nin görevidir.

## Tablo, kayıt, alan ve anahtarlar

Veri tabanı tablolardan oluşur. Tablodaki her satıra **kayıt**, her sütuna **alan** denir ve her alan için önceden bir veri türü seçilir.

- **Birincil anahtar (PK):** Bir kaydı diğerlerinden ayıran alandır. Sınıfta iki Ahmet varsa öğrenci numarası doğru kişiyi bulmayı sağlar. Birden fazla alan birlikte de birincil anahtar olabilir.
- **Yabancı anahtar (FK):** Bir tabloya girilebilecek değerleri başka bir tablodaki değerlerle sınırlayan ve iki tabloyu ilişkilendiren alandır.

## Veri tabanında başka neler bulunur?

- **İndeks:** Kayıtların nerede olduğunu gösterip sorguları hızlandırır; kitabın sonundaki dizin gibidir.
- **Saklı yordam (stored procedure):** Veri tabanında tanımlanan, derlenmiş ve hızlı çalışan SQL kodlarıdır.
- **Tetikleyici (trigger):** Bir tabloda INSERT, UPDATE veya DELETE olduğunda kendiliğinden çalışan SQL kodudur. Örneğin stok hareketinde stok miktarını otomatik günceller.
- **Veri tutarlılığı (referential integrity):** Başka bir tabloda kullanılan bir kaydın silinmesini engelleyerek veri bütünlüğünü korur.

Saklı yordamlar ve tetikleyiciler sunucu üzerinde çalışır; böylece sunucudan istemciye en az veri çekilir. Veri tabanları ölçeğe göre de ayrılır: tek kişinin kullandığı küçük sistemler, aynı kaydın iki kişi tarafından aynı anda seçilmemesi gereken küçük işletme sistemleri ve yüzlerce kullanıcının 7/24 eriştiği büyük kurum sistemleri.

=== 2
aciklama: Veri tabanı tasarım adımları, gereksinimlerin toplanması ve analizi, e-sınav örneği, kavramsal model ve kütüphane örneğiyle yedi adımda tasarım.

Bir bilgi sistemi, veri tabanının yapısı ve bu veri tabanı üzerinde çalışan uygulamadan oluşur. Veri tabanı projenin başında tasarlandığı için çok iyi tasarlanmalıdır; sonradan yapılacak yapısal değişiklikler zahmetli ve hatalıdır.

## Tasarım adımları

1. **Gereksinim analizi:** İhtiyacın ve mevcut sistemin incelenmesi, donanım ve yazılım maliyeti.
2. **Kavramsal tasarım:** Varlıkların, niteliklerin ve ilişkilerin belirlenmesi; Varlık–İlişki modelinin çıkarılması.
3. **Mantıksal tasarım:** ER modelinden tablolara geçiş.
4. **Normalizasyon:** Tabloların 1NF, 2NF, 3NF ve BCNF kurallarına göre düzenlenmesi.
5. **Fiziksel tasarım:** Tabloların ve kısıtların oluşturulması, güvenlik ve hakların tanımlanması, ilk verilerin yüklenmesi.
6. **Uygulama programı:** Kullanım durumlarının belirlenmesi ve programlama.

## Gereksinimler

**Gereksinim**, bir sistemin beklenen işlevleri yerine getirmesi için sahip olması gereken özelliktir. Bunları anlamak için kullanıcıların mevcut yöntemlerine, iş kurallarına ve yaşadıkları sorunlara bakılır.

- **Geleneksel toplama yöntemleri:** Anket, açık uçlu görüşme ve doküman analizi (mevcut form ve raporların incelenmesi).
- **Grupsal yöntemler:** Beyin fırtınası ve prototipleme.

İyi bir gereksinim analisti görüştüğü kişileri yönlendirir, doğru soruları sorar ve unutulmuş gereksinimleri ortaya çıkarır. Yanlış ya da eksik toplanan gereksinimler, istenen işleri yanlış yapan sistemlere yol açar.

## Örnek: e-sınav sistemi

Önce kullanıcı grupları (öğretmen, öğrenci, yönetici) belirlenir, ardından görüşme ve beyin fırtınası gibi yöntemlerle sorular sorulur: Kaç tür yönetici olacak? Öğretmenlerle ilgili hangi bilgiler tutulacak? Sınavlarda süre sınırı olacak mı? Çelişkili görüşler üzerinde uzlaşma sağlanır, gereksinimler madde madde yazılır, gereksizler çıkarılır ve son rapor kullanıcıların ve proje sahibinin onayına sunulur.

## Kavramsal model

Kullanıcıların anlayacağı gereksinim modeli, veri tabanı uzmanlarının kullanacağı **kavramsal modele** dönüştürülür. Bunun için en çok **Varlık–İlişki (ER) modeli** kullanılır. ER modeli belirli bir VTYS'ye bağlı değildir; ortaya çıkan şema daha sonra herhangi bir sistemde tablolara dönüştürülebilir. ER diyagramı varlıkları, niteliklerini ve varlıklar arası ilişkileri gösterir.

## Kütüphane örneği: yedi adımda tasarım

1. Nesneler tanımlanır: kitap, üyeler, türler, ödünç hareketleri.
2. Her nesne için bir tablo oluşturulur.
3. Her tablo için bir anahtar alan seçilir (kitapno, uyeno).
4. Her özellik için tabloya sütun eklenir.
5. Tekrarlayan özellikler için ek tablolar oluşturulur (örneğin üyelerin kitap istekleri).
6. Tabloyla doğrudan ilişkili olmayan alanlar ayıklanır. Üyenin adresi ödünç hareketleri tablosunda değil, üyeler tablosunda tutulmalıdır.
7. Tablolar arasındaki ilişkiler tanımlanır (üyeler tablosundaki uyeno ile ödünç hareketlerindeki uyeno).

=== 3
aciklama: ER diyagramı sembolleri, varlık ve nitelik türleri, birincil ve yabancı anahtar, 1–1, 1–N ve M–N bağıntılar, zayıf varlık ve ER modelinin tablolara dönüştürülmesi.

Kavramsal modellemede veri tabanının şematik tasarımı **Varlık–İlişki (ER) diyagramlarıyla** yapılır. Bu ünite diyagramdaki sembolleri, ilişki türlerini ve diyagramın tablolara nasıl dönüştürüleceğini anlatır.

## Semboller

- **Dikdörtgen:** Varlık kümesi (veri tabanında tablo). **Çift çizgili dikdörtgen:** zayıf varlık.
- **Oval:** Nitelik (tablonun sütunu). **Altı çizili oval:** anahtar nitelik. **Çift çizgili oval:** çok değerli nitelik. **Kesik çizgili oval:** türetilmiş nitelik.
- **Baklava dilimi:** İlişki (bağıntı). **Çift çizgili baklava:** varolma bağıntısı.

## Varlık, nitelik ve anahtar

**Varlık**, var olan ve benzerlerinden ayırt edilebilen her şeydir; öğrenci, kitap gibi fiziksel ya da ders, şirket gibi soyut olabilir. Benzer varlıklar bir **varlık kümesi** oluşturur. Varlığın her özelliği bir **nitelik**tir. Niteliğin alabileceği değer aralığına **etki alanı (domain)** denir; örneğin sınav notu için 0–100.

Nitelik türleri: bölünemeyen **çekirdek** nitelik (e-posta), parçalardan oluşan **birleşik** nitelik (isim = ad + soyad), başka niteliklerden hesaplanan **türetilmiş** nitelik (doğum tarihinden yaş) ve **birden çok değer alabilen** nitelik (birden fazla telefon).

**Birincil anahtar (PK)** NULL değer ve tekrar eden değer içeremez. **Yabancı anahtar (FK)** başka bir tablonun birincil anahtarıyla eşleşen sütundur ve tabloları birbirine bağlar.

## Bağıntılar

Varlıklar arasındaki anlamlı bağlantılara bağıntı denir; iki varlık arasında birden fazla bağıntı olabilir. Bağıntılar tanımlanırken **veri bütünlüğü** için eleman sayısı ve katılım kısıtları belirlenir.

- **Bire-bir (1–1):** Bir öğretim elemanının yalnızca bir ofisi vardır.
- **Bire-çok (1–N):** Bir bölümde birçok öğrenci okur; en çok kullanılan türdür.
- **Çoğa-çok (M–N):** Bir öğrenci birçok ders alır, bir dersi birçok öğrenci alır.
- **Katılım:** Zorunlu katılım düz çizgiyle, isteğe bağlı (kısmi) katılım yuvarlakla gösterilir.

## Zayıf varlık ve diğer kavramlar

**Zayıf varlık**, tek başına ayakta duramayan, varlığı başka bir varlığa bağlı olan varlıktır. Bir personel işten ayrılınca çocuklarının kaydı da silinir; çocuğun adı tek başına anahtar olamaz, ancak personel_no + çocuk_adı birlikte benzersiz olur. Fakülte de üniversite olmadan var olamayacağı için zayıf varlıktır.

- **Özyineli bağıntı:** Varlığın kendi içinde kurulan bağıntı; örneğin zümre başkanının da bir öğretmen olması.
- **Bağıntı derecesi:** Bağıntıya katılan varlık sayısıdır. "Hangi firma, hangi projedeki hangi malzemeyi sağladı?" sorusu üç varlık içerdiği için 3. dereceden bir bağıntıdır.
- **Kümelenme:** Bir ilişkinin tek bir varlığa değil, başka bir ilişkinin bütününe bağlanmasıdır.

## ER modelinden tablolara

- **1–1 ilişki:** Bir tablonun birincil anahtarı diğerine yabancı anahtar olarak eklenir. Boş (NULL) değer az kalacak taraf seçilir; örneğin bölüm başkanının numarası bölüm tablosuna konur.
- **1–N ilişki:** N tarafındaki tabloya 1 tarafının birincil anahtarı eklenir. Bir müşterinin birçok siparişi varsa musteri_no sipariş tablosuna eklenir.
- **M–N ilişki:** İlişkinin adıyla yeni bir **bağlantı tablosu** oluşturulur; iki tablonun birincil anahtarları buna yabancı anahtar olarak eklenir. Gerekirse ayrı bir anahtar sütunu tanımlanır (aynı filmin aynı sinemada farklı saatlerde oynaması gibi).
- **Zayıf varlık:** Güçlü varlığın anahtarı zayıf varlığın tablosuna eklenir ve bileşik birincil anahtarın parçası olur: Fakulte (univNo, fakulteNo, fakulteAdi).

=== 4
aciklama: Normalizasyonun amacı, ekleme, güncelleme ve silme sorunları, fonksiyonel bağımlılık türleri, 1NF, 2NF, 3NF, BCNF ve 4NF.

**Normalizasyon**, ilişkisel veri tabanı tasarlanırken veri tekrarını, veri kaybını ve tutarsızlığı önlemek için tabloları mantıklı parçalara bölme işlemidir. Bir dolabı düzenlemeye benzer: çoraplar bir çekmecede, tişörtler başka rafta durursa aradığınızı bulmak kolaylaşır.

## Normalizasyon yapılmazsa

- **Ekleme sorunu:** Yeni bir veri eklemek için ilgisiz başka verileri de girmek gerekir.
- **Güncelleme sorunu:** Aynı veri birçok yerde durduğu için hepsinin tek tek düzeltilmesi gerekir; biri unutulursa veri tutarsızlaşır.
- **Silme sorunu:** Bir satır silinince istenmeyen başka bir bilgi de kaybolur.

Normalizasyonun amaçları veri tekrarını azaltıp bütünlüğü sağlamak, uygulamadan bağımsız bir model kurmak ve daha az kopya sayesinde performansı artırmaktır. Normalizasyon tablo sayısını azaltmaz, artırır.

## Anahtarlar ve fonksiyonel bağımlılık

İki veya daha fazla sütundan oluşan birincil anahtara **bileşik anahtar** denir. A sütunu bilindiğinde B kesin olarak bulunabiliyorsa B, A'ya **fonksiyonel bağımlıdır** (A → B). Başka bir niteliğin bağımlı olduğu niteliğe **belirleyici** denir.

- **Tam bağımlılık:** Sütun, bileşik anahtarın tamamına bağlıdır. (Öğrenci No, Kurs Kodu) → Not.
- **Kısmi bağımlılık:** Sütun, bileşik anahtarın yalnızca bir parçasına bağlıdır. Öğrenci No → Öğrenci Adı. Anahtar tek sütunsa kısmi bağımlılık olamaz.
- **Geçişli bağımlılık:** Sütun, anahtara başka bir sütun üzerinden dolaylı bağlıdır. Öğrenci No → Posta Kodu → Şehir.

## Normal formlar

- **1NF:** Her hücre tek ve bölünemez (atomik) bir değer taşır. "555-111, 555-222" gibi liste değerler satırlara bölünür.
- **2NF:** Tablo 1NF'dedir ve anahtar olmayan her sütun birincil anahtarın tamamına bağlıdır. Kural: "Bu bilgi kimin?" diye sor, o tabloya koy.
- **3NF:** Tablo 2NF'dedir ve hiçbir sütun anahtara başka bir sütun üzerinden bağlı değildir. Bölüm telefonu öğrencinin değil bölümün bilgisidir; ayrı tabloya alınır.
- **BCNF:** Her belirleyici bir aday anahtardır. Bir danışmanın tek bir bölümde çalıştığı ÖĞRENCİ (ÖğrNo, Bölüm, Danışman) tablosu 3NF'de olsa bile Danışman → Bölüm bağımlılığı yüzünden sorun çıkarır; tablo ikiye ayrılır.
- **4NF:** Birbirinden bağımsız çok değerli bağımlılıklar ayrı tablolara alınır. Bir öğrencinin bölümleri ve sporları birbirinden bağımsızsa ÖĞRENCİ_BÖLÜM ve ÖĞRENCİ_SPOR olarak ayrılır.

Üst normal formlar alttakileri kapsar; 3NF'deki bir tablo 1NF ve 2NF'yi de sağlar. Normalizasyon çoğu uygulamada 3NF'ye kadar yapılır.

## Örnek: kurs kayıt tablosu

Bir hücrede birden fazla ders ve not tutan kayıt tablosu önce satırlara bölünür (1NF) ve bileşik anahtar (ÖğrenciNo, DersKodu) tanımlanır. Ardından öğrenci adı ve ders bilgileri ayrı tablolara alınır (2NF). Son olarak eğitmenin odası derse değil eğitmene bağlı olduğu için eğitmenler ayrı tabloya taşınır (3NF). Sonuçta Öğrenciler, Eğitmenler, Dersler ve Kayıtlar olmak üzere dört tablo oluşur; bir eğitmen odasını değiştirdiğinde yalnızca tek satır güncellenir. Ayrılan tablolar raporlama sırasında JOIN ile yeniden birleştirilir.

## Örnek: DAĞITIM tablosu

DAĞITIM (müşteri_no, şehir_kodu, şehir_adı, gönderi_no, miktar) tablosunda müşteri_no → şehir kısmi, şehir_kodu → şehir_adı geçişli bağımlılıktır; miktar ise anahtarın tamamına bağlıdır. 2NF'de MÜŞTERİLER ve MİKTARLAR, 3NF'de ayrıca ŞEHİRLER tablosu oluşturulur. Böylece hiç dağıtım yapılmamış bir şehir de kaydedilebilir ve tek dağıtımı iptal edilen müşterinin bilgisi kaybolmaz.

=== 5
aciklama: SQL nedir, DDL, DML ve DCL komut grupları, SQL Server veri tipleri, CREATE TABLE, kısıtlamalar, ALTER TABLE, DELETE, TRUNCATE, DROP ve .sql, .mdf, .bak dosyaları.

**SQL (Structured Query Language, Yapısal Sorgulama Dili)**, veri tabanlarında kayıt eklemek, değiştirmek, silmek ve sorgulamak için tasarlanmış dildir. Önce matematiksel söz dizimli SQUARE, ardından İngilizceye benzeyen SEQUEL geliştirilmiş; bu dil daha sonra SQL adını almıştır. Microsoft SQL Server, MySQL, PostgreSQL ve Oracle SQL kullanan sistemlerdendir.

## Komut grupları

- **DDL (Veri Tanımlama Dili):** Veri tabanının yapısıyla ilgilenir. CREATE (oluştur), ALTER (yapıyı değiştir), DROP (tamamen sil), TRUNCATE (içini boşalt) ve RENAME.
- **DML (Veri İşleme Dili):** Tablonun içindeki satırlarla çalışır. SELECT, INSERT, UPDATE ve DELETE.
- **DCL (Veri Kontrol Dili):** Yetkileri yönetir. GRANT yetki verir, REVOKE geri alır, DENY açıkça yasaklar.

VIEW oluşturmak, ALTER TABLE ve TRUNCATE birer DDL işlemidir. Kullanıcı oluşturma ve değiştirme komutları (CREATE USER, ALTER USER) veri işleme komutu değildir.

Derste veri tabanı motoru olarak **SQL Server Express**, yönetim arayüzü olarak **SQL Server Management Studio (SSMS)** kurulur. SQL Server arka planda çalışan bir servistir; tabloları görmek ve sorgu yazmak için SSMS gerekir.

## Veri tipleri

Doğru veri tipi gereksiz bellek kullanımını önler ve yanlış veri girilmesini engeller.

- **Tam sayılar:** bigint (8 bayt), int (4 bayt, en yaygın), smallint (2 bayt), tinyint (1 bayt, SQL Server'da 0–255), bit (0 veya 1; evet/hayır gibi ikili durumlar).
- **Ondalıklı ve parasal:** decimal/numeric (basamak sayısı tanımlanır), float ve real (yaklaşık değerli), money ve smallmoney.
- **Tarih ve zaman:** date, time, datetime, datetime2, smalldatetime, datetimeoffset.
- **Metin:** char(n) her zaman n karakterlik yer kaplar; varchar(n) girilen kadar yer kaplar. nchar ve nvarchar Unicode destekler. Türkçe karakterlerin bozulmaması için **nvarchar** tercih edilir.

## Tablo oluşturma ve kısıtlamalar

Veri tabanı CREATE DATABASE, tablo CREATE TABLE ile oluşturulur. **USE** komutların hangi veri tabanında çalışacağını, **GO** komut gruplarının ayrılmasını belirtir. **IDENTITY(1,1)** bir sütunun değerini her yeni kayıtta 1'den başlayıp birer artırır.

- **PRIMARY KEY:** Satırı benzersiz tanımlar; NULL ve tekrar içeremez. Tabloda bir tane olur ama birden çok sütundan oluşabilir.
- **FOREIGN KEY:** Sütunu başka bir tablonun birincil anahtarına bağlar; orada bulunmayan değerin girilmesini engeller.
- **UNIQUE:** Değerlerin tekrar etmesini engeller; bir tabloda birden çok olabilir.
- **NOT NULL:** Sütunun boş bırakılmasını engeller.
- **CHECK:** Değerin bir koşulu sağlamasını zorunlu kılar. Örnek: CHECK (Sinif BETWEEN 1 AND 4).
- **DEFAULT:** Değer girilmezse kullanılacak varsayılan değeri belirler.

**NULL** "değer yok" demektir; 0 ya da boş metinle aynı şey değildir. Yabancı anahtar nedeniyle önce bağımsız tablo (Bolum), sonra ona bağlı tablolar (Ogrenci, Dersler) oluşturulur.

## ALTER TABLE

Dolu bir tablonun yapısını, tabloyu silmeden değiştirir: ADD ile sütun eklenir (eski kayıtlarda yeni sütun NULL başlar), DROP COLUMN ile sütun silinir, ALTER COLUMN ile veri tipi değiştirilir, ADD CONSTRAINT ile sonradan anahtar eklenir. ALTER TABLE yapıyı, UPDATE ise satırlardaki veriyi değiştirir.

## DELETE, TRUNCATE ve DROP

- **DELETE (DML):** WHERE ile seçilen satırları siler; her satırı günlüğe yazdığı için yavaştır ama geri alınabilir. IDENTITY sayacını sıfırlamaz.
- **TRUNCATE (DDL):** Tablonun bütün içeriğini çok hızlı boşaltır; WHERE almaz, tablo boş bir şablon olarak kalır ve sayaç sıfırlanır.
- **DROP (DDL):** Tabloyu yapısıyla birlikte tamamen siler.

Veri tabanı her INSERT, UPDATE ve DELETE işlemini önce **işlem günlüğüne (log)** yazar; elektrik kesilirse yarım kalan işlem yeniden açılışta geri alınır (ROLLBACK).

## Taşıma ve yedekleme

- **.sql (script):** Veri tabanını sıfırdan kuran komutları içeren düz metin dosyasıdır. Sürüm farklarından en az etkilenir ama büyük verilerde yavaştır; yedekleme dosyası değildir.
- **.mdf:** SQL Server'ın ana veri dosyasıdır. Sunucu çalışırken kilitlidir; taşımak için Detach ve Attach yapılır.
- **.bak:** Veri tabanının sıkıştırılmış yedeğidir. Sistem çalışırken alınabilir ve Restore ile geri yüklenir. Üst sürümde alınan yedek alt sürüme yüklenemez.

=== 6
aciklama: INSERT, SELECT, WHERE, ORDER BY, LIKE, BETWEEN, IN, DISTINCT, UPDATE, DELETE, COUNT, SUM, AVG, JOIN türleri, GROUP BY, HAVING, alt sorgu ve VIEW.

Bu ünitedeki sorgular, Bolum, Ogrenci, Dersler ve Dersi_Alanlar tablolarından oluşan örnek **Fakülte veri tabanı** üzerinde anlatılır.

## Kayıt ekleme: INSERT

INSERT INTO tablo (alanlar) VALUES (değerler) biçiminde yazılır. Metin ve tarih değerleri tek tırnak içinde, sayılar tırnaksız yazılır. Alan sayısı ile değer sayısı eşit ve aynı sırada olmalıdır. IDENTITY tanımlı sütuna değer yazılmaz. Yabancı anahtar nedeniyle önce ana tablo, sonra bağlı tablolar, en son köprü tablo doldurulur.

## Listeleme ve filtreleme

- **SELECT:** SELECT * tüm sütunları, SELECT Ad, Soyad yalnızca istenen sütunları getirir.
- **ORDER BY:** ASC artan (varsayılan), DESC azalan sıralar; birden fazla alana göre sıralanabilir.
- **WHERE:** Koşula uyan kayıtları getirir. AND ile bağlanan koşulların hepsi, OR ile bağlananların en az biri sağlanmalıdır. Birlikte kullanıldıklarında parantez sonucu değiştirir.
- **LIKE:** Kalıba göre arar. SQL Server'da **%** herhangi sayıda karakterin, **_** tek bir karakterin yerini tutar. LIKE 'D%' D ile başlayanları getirir. (Access'te % yerine * kullanılır.)
- **BETWEEN a AND b:** Aralıktaki değerleri seçer; uç değerler dâhildir. **IN (…):** Listedeki değerlerden birine eşit olanları seçer.
- **DISTINCT:** Tekrarlayan değerleri bir kez listeler.

## UPDATE ve DELETE

UPDATE tablo SET sütun = değer WHERE koşul ile veri güncellenir, DELETE FROM tablo WHERE koşul ile satır silinir. **WHERE yazılmazsa işlem bütün satırlara uygulanır.** Çalıştırmadan önce aynı koşulla bir SELECT yapıp etkilenecek satırlara bakmak iyi bir alışkanlıktır. Başka bir tabloda kullanılan bir kaydı silmeye çalışmak yabancı anahtar hatası verir; önce bağlı kayıtlar silinmelidir.

## Hazır fonksiyonlar

COUNT(*) kayıt sayısını, SUM toplamı, AVG ortalamayı, MAX en büyüğü, MIN en küçüğü verir; sonuç sütununa AS ile ad verilebilir. Sütun INT ise SQL Server **tam sayı bölmesi** yapar: toplamı 27, sayısı 8 olan kredilerin AVG sonucu 3,375 değil 3 olur. Ondalıklı sonuç için AVG(Kredi * 1.0) yazılır.

## JOIN ile tabloları birleştirme

Normalizasyonla ayrılan tablolar raporlanırken JOIN ile birleştirilir; bağlantı genellikle birincil ve yabancı anahtar üzerinden kurulur.

- **INNER JOIN:** Yalnızca iki tabloda da eşleşen kayıtları getirir.
- **LEFT JOIN:** Soldaki tablonun tüm kayıtlarını getirir; sağda eşleşeni olmayanlar NULL olur. Öğrencisi olmayan bölümleri de listelemek için Bolum tablosu solda olmalıdır.
- **RIGHT JOIN:** Sağdaki tablonun tamamını getirir. **FULL JOIN:** İki tablonun da tamamını getirir.

Üç tablo (öğrenci, ders ve aradaki köprü tablo) iki JOIN ile bağlanır. Sorgu yazarken tablolara kısa takma adlar verilebilir (Ogrenci O gibi).

## GROUP BY ve HAVING

GROUP BY satırları bir sütuna göre gruplar ve her grup için COUNT, SUM gibi özet değer hesaplar; karışık madenî paraları türlerine göre destelemek gibidir. **HAVING** gruplara şart koyar. WHERE COUNT(*) > 1 yazılamaz, çünkü WHERE çalıştığında henüz sayım yapılmamıştır.

SQL sorgusunun çalışma sırası: **FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY**. İlk çalışan bölüm FROM, son çalışan ORDER BY'dır.

## Alt sorgu ve VIEW

Bir sorgunun sonucu başka bir sorgunun koşulunda kullanılabilir; içteki sorgu önce çalışır. Örneğin kredisi ortalamanın üzerinde olan dersler WHERE Kredi > (SELECT AVG(Kredi) FROM Dersler) ile bulunur.

**VIEW (görüntü)**, fiziksel olarak veri saklamayan, kaydedilmiş bir sorgudan ibaret sanal tablodur; veriye bakan bir pencere gibidir. CREATE VIEW ile oluşturulur, ALTER VIEW ile değiştirilir, DROP VIEW ile silinir. Kullanıcıya yalnızca görmesi gereken veriyi gösterir, uzun JOIN sorgularını tek satırla çağırmayı sağlar ve ana tablo değişince gösterdiği veri de kendiliğinden güncellenir.

=== 7
aciklama: Fakülte veri tabanında tablo ilişkileri ve çözümlü SQL soruları, Gelecek Sepeti e-ticaret uygulamasında JOIN, GROUP BY ve HAVING, SATIŞ veri tabanının SQL Server'da kurulması.

Bu ünite önceki ünitelerde öğrenilenleri üç uygulama üzerinde bir araya getirir: tasarımı incelemek, tabloları kurmak ve gerçek sorulara SQL ile cevap aramak.

## Uygulama 1: Fakülte veri tabanı

Fakülte veri tabanında dört tablo vardır: Bolum, Ogrenci, Dersler ve Dersi_Alanlar.

- **Bolum – Ogrenci (1–N):** Bir bölümde birçok öğrenci okur; her öğrenci tek bir bölüme bağlıdır. Bu yüzden Ogrenci tablosunda BolumId bulunur.
- **Bolum – Dersler (1–N):** Bir bölüm birçok ders açar; her ders tek bir bölüme aittir.
- **Ogrenci – Dersler (N–M):** Bir öğrenci birçok ders alır, bir dersi birçok öğrenci alır. Bu ilişkiyi Dersi_Alanlar köprü tablosu kurar.

Çözülen sorulardan çıkan önemli noktalar:

- Başka bir tabloda kayıtları bulunan dersleri silmeye çalışmak yabancı anahtar hatası verir; önce Dersi_Alanlar'daki bağlı kayıtlar silinmelidir.
- Var olmayan bir bölüm numarasıyla ders eklemek istenirse yabancı anahtar kısıtı kaydı reddeder.
- ALTER TABLE Bolum DROP COLUMN BolumAdi; komutu satırları değil, yalnızca sütunu ve içindeki verileri siler.
- UPDATE … WHERE DersKodu LIKE 'ABM%' komutu ABM ile başlayan tüm dersleri etkiler.

## Uygulama 2: Gelecek Sepeti

Gelecek Sepeti adlı bir e-ticaret sitesinin Musteriler, Urunler ve Siparisler tabloları vardır. Siparisler tablosu müşteri ile ürün arasındaki köprüdür; müşteri ve ürün adını birlikte görmek için **iki INNER JOIN** gerekir. Kodlar, program kurmadan db-fiddle.com üzerinde denenebilir.

- **Kategori başına satış adedi:** Siparisler ile Urunler birleştirilir, GROUP BY Kategori ile SUM(Adet) alınır.
- **Toplam harcaması 10.000 TL'yi aşan müşteriler:** SUM(Adet * BirimFiyat) her müşteri için hesaplanır, HAVING ile filtrelenir. Örnekte Ahmet 23.000 TL, Ayşe 15.450 TL harcamıştır.
- **Belirli bir kategoriden alışveriş yapanlar:** WHERE Kategori = 'Eğitim' ile süzülür; DISTINCT aynı müşterinin adının tekrar etmesini önler.
- **Hiç sipariş vermemiş müşterileri de listelemek** için Musteriler tablosu solda olacak biçimde LEFT JOIN kullanılır.

## Uygulama 3: SATIŞ veri tabanının kurulması

Normalizasyon ünitesinde üç tabloya ayrılan SATIŞ tablosu SQL Server'da kurulur: Sehirler (sehir_kodu, sehir_adi), Musteriler (musteri_no, sehir_kodu) ve Gonderiler (musteri_no, gonderi_no, miktar). Gonderiler tablosunun birincil anahtarı (musteri_no, gonderi_no) bileşik anahtarıdır, çünkü aynı gönderi numarası farklı müşterilerde tekrar edebilir.

Yabancı anahtar hatası almamak için veriler **önce ana tabloya, sonra ona bağlı tabloya** girilir: Sehirler → Musteriler → Gonderiler. Son olarak SSMS'te Database Diagrams klasöründen yeni bir **veri tabanı diyagramı** oluşturulur; FOREIGN KEY tanımları sayesinde tablolar arasındaki ilişki çizgileri kendiliğinden çizilir. Anahtar simgesi 1 tarafını, sonsuz simgesi N tarafını gösterir.

=== 8
aciklama: Veri Tabanına Giriş 2025–2026 bahar final sınavı soruları ve çözümleri: normalizasyon, ER sembolleri, SQL komut grupları, veri tipleri, LEFT JOIN, UPDATE, DELETE ve AVG.

Bu ünite, Veri Tabanına Giriş dersinin 2025–2026 bahar dönemi final sınavı sorularını çözümleriyle birlikte içerir. Sınava hazırlanırken önce soruları kendin çözmeyi dene, sonra çözümlerle karşılaştır.

## Sınavda sorulan konular

- **Normalizasyonun tanımı ve amaçları:** Veri tekrarını azaltmak, veri bütünlüğünü sağlamak, ekleme, silme ve güncelleme sorunlarını önlemek.
- **Normal formları tanımından tanımak:** "Atomik değer" → 1NF; "kısmi bağımlılık, bileşik anahtarın tamamı" → 2NF; "her belirleyici aday anahtar" → BCNF; "çok değerli bağımlılık" → 4NF.
- **ER sembolleri:** Varlık, zayıf varlık, nitelik, anahtar nitelik ve çok değerli nitelik sembollerinin adlarını yazmak.
- **SQL komut grupları:** DDL için CREATE, ALTER, DROP, TRUNCATE; DCL için GRANT, REVOKE, DENY; DML için SELECT, INSERT, UPDATE, DELETE.

## MAĞAZA veri tabanı soruları

Musteri, Urunsatis, Urunler ve Kategori tablolarından oluşan bir mağaza veri tabanında alanların veri tipleri ve anahtarları istenir. Her tabloda satırı tek başına tanımlayan alan birincil anahtardır; tekrar etmemesi gereken ama birincil anahtar olmayan kategori adı benzersiz anahtardır (UK). **Yabancı anahtarın veri tipi, bağlandığı birincil anahtarla aynı olmalıdır.** Küçük sayılar için tinyint, barkod ve fiyat gibi büyük sayılar için int, cinsiyet gibi iki değerli alanlar için bit seçilir.

LEFT OUTER JOIN sorusunda soldaki tablonun koşulu sağlayan bütün kayıtları listelenir; hiç satışı olmayan müşteriler de görünür ve karşılarındaki miktar NULL gelir. İki satışı olan müşteri iki satırda görünür.

## FAKÜLTE veri tabanı soruları

- UPDATE … WHERE DersId BETWEEN 4 AND 8 komutu uç değerler dâhil beş dersi etkiler.
- Ders kodu "INT" ile başlayan dersleri silmek için WHERE DersKodu LIKE 'INT%' yazılır; = 'INT' hiçbir kaydı eşleştirmez.
- AVG(Kredi) sorusunda gerçek ortalama 3,25'tir, ancak Kredi sütunu INT ise SQL Server tam sayı bölmesi yaparak 3 gösterir.
- INNER JOIN sorusunda her öğrencinin bölüm kodu bulunur; sekiz öğrenci için sekiz satır döner.

## Boşluk doldurma ve normalizasyon

Bir sütunun alabileceği değerleri sınırlayan kısıtlama **CHECK**, veri tabanını başka bilgisayara taşımak için **script dosyası**, bir tablonun tüm verilerini boşaltan DDL komutu **TRUNCATE**, sanal tablo ise **görüntü (VIEW)** olarak cevaplanır. C# uygulamasının SQL Server'a bağlanması için koda using System.Data.SqlClient; satırı eklenir. Son soruda SATIŞ tablosu 1NF, 2NF ve 3NF adımlarıyla ŞEHİRLER, MÜŞTERİLER ve MİKTARLAR tablolarına ayrılır ve ER diyagramı çizilir.
