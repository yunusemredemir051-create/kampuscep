# Güvenlik raporu — KampüsCepte

**Tarih:** 22 Kasım 2026 · **Kapsam:** ARAYUZ-PLANI.md Ek 6 / A-1 · **Kod değişikliği:** yok

Bu rapor herkese açık depodadır. Bu yüzden açıkların **nasıl istismar edileceği yazılmadı**. Kritik ve yüksek bulguların
ayrıntıları site sahibine özel olarak iletildi. Düzeltmeler önem sırasıyla, her biri ayrı PR olarak yapılacak (Ek 6 / A-3).

**Yöntem:** `firebase/firestore.rules` satır satır okundu. Firestore'a yazan ve kullanıcı verisini sayfaya basan bütün
dosyalar incelendi (`yorum.js`, `yol-arkadasi/index.html`, `cikmis.js`, ödev sayfaları, `skor.js`). Bunlara ek olarak
Cloudflare Worker kopyası, GitHub ayarları, dallar, git geçmişi ve canlı sitenin yanıt başlıkları da incelendi.

**Bu turda yapılamayanlar:**
- **Emulator testleri:** Firebase Emulator için Java ve firebase-tools bu bilgisayarda kurulu değil. Kural bulguları
  okumaya dayanıyor. Her düzeltme PR'ı, açığın kapandığını emulator testiyle gösterecek.
- **Firebase konsolu:** Hangi giriş yöntemlerinin açık olduğu, App Check'in hangi hizmetlerde zorunlu olduğu ve
  konsoldaki kuralların depodakiyle aynı olup olmadığı görülemedi (site sahibi kontrol edecek, bkz. sondaki liste).

## Özet

| No | Önem | Konu | Kısa öneri |
|---|---|---|---|
| K-1 | **Kritik** | Yol Arkadaşı: ilan alanlarında eksik denetim | Hem sayfada hem kuralda düzelt — **ilk iş** |
| Y-1 | **Yüksek** | Yol Arkadaşı: telefon numaralarının korunması | Beyan değişikliği ve katıl/ayrıl sınırı |
| O-1 | Orta | Yönetici yetkisi e-posta karşılaştırmasıyla veriliyor | Custom claim'e taşı |
| O-2 | Orta | Anonim oturumla puan/beğeni/sayaç şişirme | Google girişi şartı ya da hız sınırı |
| O-3 | Orta | Çıkmış soru puanlarında sınır yok | Hız sınırı, alan denetimi, ban denetimi |
| O-4 | Orta | Ban'ın atlatılabildiği yollar | Ban denetimini her yazmaya ekle |
| O-5 | Orta | Maç skoru Worker'ının günlük kotası dışarıdan tüketilebilir | Zamanlanmış çekme + tek kayıt |
| O-6 | Orta | `main` dalı korumasız | Branch protection aç |
| D-1 – D-9 | Düşük | Çeşitli | Aşağıda |

## Kritik

### K-1 · Yol Arkadaşı: ilan alanlarında eksik denetim
- **Ne:** İlan oluşturulurken alanlar kurallarla doğru denetleniyor. İlan **güncellenirken** ise bazı alanların türü ve
  sınırı yeniden denetlenmiyor. Bu alanlardan biri ilan kartında sayfaya kaçışlanmadan basılıyor.
- **Nerede:** `firebase/firestore.rules` (yolculuklar · update), `yol-arkadasi/index.html` (ilan kartı).
- **Etkisi:** Giriş yapmış herhangi bir kullanıcı, Yol Arkadaşı'nı açan **bütün ziyaretçileri** etkileyebilir. Bu,
  Android uygulamasını da kapsar, çünkü uygulama canlı siteyi açıyor. Kötü durumda başkalarının hesabıyla işlem
  yapılabilir. Ayrıca bozuk bir kayıt ilan listesinin herkes için açılmamasına yol açabilir.
- **Öneri:**
  1. Sayfada ilgili alanları kaçışla ve türünü denetle. Bu adım tek başına yayına girdiği anda etkiyi kapatır.
  2. Kuralda güncellemeye, oluşturmadaki bütün tür ve sınır denetimlerini ekle (ayrıca ban denetimi).
  3. Firebase konsolundan mevcut ilanlarda beklenmeyen değer olup olmadığına bak (adımlar özel notta).

## Yüksek

### Y-1 · Yol Arkadaşı: telefon numaralarının korunması
- **Ne:** Kız/erkek yurdu ayrımı kullanıcının kendi beyanına dayanıyor ve bu beyan istendiği an değiştirilebiliyor.
  Bir ilana katılan kişi gruptakilerin numarasını görüyor. Katılma ve ayrılmada sıklık sınırı yok.
- **Nerede:** `firebase/firestore.rules` (kullanicilar, yolculuklar · update, iletisim).
- **Etkisi:** Kötü niyetli biri kendi cinsiyetine ait olmayan ilanlara erişip numara toplayabilir. Plan, beyanın
  değiştirilebilmesini zaten not etmişti; bu bulgu, numara toplama boyutuyla bunu yüksek önem seviyesine taşıyor.
- **Seçenekler (site sahibi seçer):**
  - (a) Yurt ve tür ilk seçimden sonra kilitlenir; değişiklik ancak 30 günde bir (ya da yöneticiyle) yapılabilir.
  - (b) Katılma ve ayrılmaya hız sınırı (ör. günde birkaç ilan).
  - (c) Numara, ilan sahibi katılanı **onayladıktan** sonra görünür. En güçlü korumadır, ama akışa bir adım ekler.
  - Öneri: (a) + (b) hemen. (c) arayüz adımında (Adım 10) değerlendirilir.

## Orta

### O-1 · Yönetici yetkisi e-posta karşılaştırmasıyla veriliyor
- **Ne:** Kurallardaki `yonetici()` fonksiyonu, giriş yapan hesabın e-postasını sabit bir adresle karşılaştırıyor.
  Adres herkese açık kural dosyasında yazılı. AGENTS.md 5. bölüme göre yetki e-postaya dayanmamalı ve e-posta herkese
  açık koda yazılmamalı.
- **Durum:** Bugün doğrudan istismar zor, çünkü doğrulanmış e-posta şartı var. İstemci tarafındaki eski yönetici
  kontrolleri kapatılmış (`KC_ADMIN` hiç tanımlanmıyor, `yoneticiMi = () => false`). Geçmişte yaşanan olayın yolu kapalı
  görünüyor.
- **Ek not:** `googleli()` fonksiyonu adından farklı olarak "anonim olmayan her giriş" anlamına geliyor. Konsolda
  Google dışında bir giriş yöntemi (ör. e-posta/şifre) açıksa, "yalnızca Google" sınırı geçersiz kalır.
- **Öneri:** Yöneticiye **custom claim** (`admin: true`) ver; bunu bir kez çalıştırılan küçük bir yönetici betiği yapar.
  Spark planında yapılabilir, Blaze gerekmez. Kuralda `request.auth.token.admin == true` kullanılır ve e-posta kural
  dosyasından çıkar. `googleli()` kuralı, giriş yöntemini açıkça `google.com` olarak denetlemeli.

### O-2 · Anonim oturumla puan, beğeni ve sayaç şişirme
- **Ne:** Menü puanı ve beğenisi, yorum beğenisi, "kaç kişi baktı", çıkmış soru puanı ve indirme sayacı, ödev puanları
  anonim oturumla yazılabiliyor. Her yeni anonim oturum yeni bir kimlik demek.
- **Etkisi:** Puanlar ve sayılar yapay olarak şişirilebilir. Veri sızıntısı yok; güvenilirlik sorunu var. App Check
  otomasyonu zorlaştırıyor ama tarayıcıdan elle yapılanı durdurmuyor.
- **Seçenekler:** (a) Puan ve beğeni için Google girişi şartı. En etkili yoldur, ama giriş yapmayanlar oy veremez.
  (b) Anonim oyları ayrı say, gösterimde Google oylarına ağırlık ver. (c) Mevcut akış kalsın, kimlik başına günlük
  sınır konsun (yeni kimlik açmayı engellemez). Öneri: yorum beğenisi ve çıkmış soru puanı için (a); menü puanı için
  site sahibinin kararı.

### O-3 · Çıkmış soru puanlarında sınır yok
- **Ne:** `cikmisSorular/{id}/puanlar` kuralında zaman (hız) sınırı, ban denetimi ve `zaman` alanının tür denetimi
  yok. Üstelik geçerli kalıba uyan herhangi bir kimlikle yeni çıkmış soru kaydı açılabiliyor.
- **Öneri:** Menü oylarındaki gibi `zaman == request.time` ve 1 sn sınırı, `!banli()`. Kayıt kimliklerini bilinen
  listeyle sınırla ya da yeni kayıt açmayı kapat.

### O-4 · Ban'ın atlatılabildiği yollar
- **Ne:** Ban, Firebase kullanıcı kimliğine bağlı. İlan güncelleme, yorum beğenisi, çıkmış soru puanı ve indirme
  yazmalarında ban denetimi yok. Yeni bir Google hesabıyla ban zaten tümden atlanır; telefon numarası yasağı yalnızca
  Yol Arkadaşı iletişiminde geçerli.
- **Öneri:** Ban denetimini bütün yazmalara ekle. Yol Arkadaşı'nda telefon yasağı ilan açmayı da kapsasın. Hesap
  değiştirerek atlatma tamamen önlenemez; amaç maliyeti artırmak.

### O-5 · Maç skoru Worker'ının kotası dışarıdan tüketilebilir
- **Ne:** `workers/kc-skor.js` önbelleği Cloudflare'in her veri merkezinde ayrı tutuyor. CORS yalnızca tarayıcıları
  sınırlar. Farklı bölgelerden gelen doğrudan istekler API-Football'un günlük ücretsiz kotasını bitirebilir. Hata
  olduğunda sağlayıcının hata metni olduğu gibi dışarı veriliyor.
- **Etkisi:** O gün skorlar görünmez. Veri ya da anahtar sızıntısı yok; anahtar gizli değişkende duruyor.
- **Öneri:** Worker'a **zamanlanmış tetikleyici (Cron Trigger)** ekle. Veri birkaç dakikada bir çekilip tek bir yere
  (Workers KV) yazılsın, istekler yalnızca oradan okusun. Ücretsiz planda yapılabilir. Hata metni yerine kısa bir kod
  dönsün.

### O-6 · `main` dalı korumasız
- **Ne:** Geliştirme rehberinin hazırlık bölümündeki 3. adım (branch protection) yapılmamış: `main` için koruma kuralı
  yok. Yazma yetkisi olan herkes ya da sızan bir token, doğrudan canlı siteye yazabilir.
- **Öneri:** Settings → Branches → `main` → "Require a pull request before merging". Otomatik menü ve vakit işlerinin
  `main`'e yazabilmesi için bu işlere istisna tanınması ya da ayrı bir düzen gerekir; düzeltme PR'ında ele alınacak.

## Düşük

- **D-1 · Küfür filtresi:** Kural içindeki kalıp listesi kolayca atlatılır (harf değiştirme vb.). Bu bir güvenlik
  sorunu değil, içerik denetimi sorunu; Ek 3'teki yorum yönetimi ekranıyla çözülür.
- **D-2 · Takma ad tutma:** Ad değiştirilirken eski ad kaydı silinmezse, bir hesap zamanla birden çok adı elinde tutabilir.
- **D-3 · İlan kişi sayısı:** İlan sahibi aranan kişi sayısını mevcut katılan sayısının altına düşürebiliyor.
- **D-4 · Herkese açık kullanıcı kimlikleri:** İlanlarda ve oylarda Firebase kullanıcı kimlikleri (uid) herkese açık.
  Bunlar takma adlarla eşleştirilebiliyor. Doğrudan kişisel bilgi değil, ama gerekmedikçe gösterilmemeli.
- **D-5 · Skor verisi kaçışlanmıyor:** `skor.js`, API-Football'dan gelen takım ve lig adlarını kaçışlamadan basıyor.
  Kaynak güvenilir, ama kaçışlamak ucuz.
- **D-6 · Deneme imza anahtarı açık depoda:** `_uygulama/test-anahtari.jks` ve şifresi `build.gradle` içinde. Bu
  bilinçli bir tercih: Play'e giden sürüm ayrı ve gizli anahtarla imzalanıyor. Ancak test APK'sı canlı uygulamayla aynı
  paket adını taşıyor. Bu anahtarın SHA-1 parmak izi Firebase'de kayıtlıysa, aynı anahtarla imzalanmış başka bir
  uygulama da Google girişi kullanabilir. Öneri: test sürümüne ayrı paket adı (`applicationIdSuffix ".test"`) ver ve
  Firebase'deki kayıtları gözden geçir.
- **D-7 · Kişisel bilgi:** Site sahibinin e-postası kural dosyasında (O-1 ile kalkar) ve geçmişteki 22 commit'in yazar
  bilgisinde. Worker adresinde de hesap adı geçiyor. Geçmişi yeniden yazmak önerilmez. Bundan sonraki commit'ler için
  GitHub'ın gizli (noreply) adresi kullanılmalı.
- **D-8 · Güvenlik başlıkları:** Site GitHub Pages'te çalışıyor ve GitHub Pages özel başlık ayarına izin vermiyor.
  Content-Security-Policy, X-Frame-Options/frame-ancestors (tıklama tuzağına karşı) ve HSTS yanıtta yok.
  `<meta name="referrer">` sayfalara eklenebilir. CSP meta etiketiyle kısmen eklenebilir ama AdSense ve Google
  Tag Manager yüzünden geniş tutulmak zorunda kalır. Tam çözüm, alan adını Cloudflare vekili üzerinden geçirip
  başlıkları orada eklemektir (ücretsiz plan; site sahibinin kararı).
- **D-9 · Eski dallar:** Depoda 18 uzak dal var (`tasarim-v2`, `tasarim-v3`, `tasarim-yenileme`, `_kaynak/...`,
  `alan-adi`, `hiz-iyilestirme`, `onizleme` ve birleştirilmiş PR dalları). Git geçmişinde gizli anahtar dosyası
  bulunamadı; yalnızca D-6'daki deneme anahtarı ve herkese açık olması zaten gereken `google-services.json` var.
  Gereksiz dallar temizlenmeli (Ek 6 / B).

## İyi durumda olanlar

- **App Check:** Firestore'da zorunlu görünüyor. Uygulama dışından yapılan doğrudan okuma isteği reddedildi.
- **İstemci yönetici kontrolleri:** Kapatılmış durumda; yetki kararları yalnızca kurallarda veriliyor.
- **Kaçışlama:** Yorum metni, takma ad, ilan notu ve iletişim adı sayfaya kaçışlanarak basılıyor.
- **Yorum düzeni:** Hız sınırı (30 sn, günde 20) sağlam kurulmuş; takma adlar tekil; şikâyet kişi başı bir kez;
  menü kayıtları tarih penceresiyle sınırlı.
- **GitHub Actions:** Varsayılan izin yalnızca okuma. İş akışları yalnızca ihtiyaç duydukları yazma iznini alıyor.
  Dış katkıcıların iş akışları onaya bağlı (self-hosted runner için önemli).
- **Firebase yapılandırması:** `firebase-ayar.js`'teki anahtarlar herkese açık olacak türden; gizli değiller.

## Site sahibinin kontrol etmesi gerekenler (Firebase konsolu)

1. **Authentication → Sign-in method:** Yalnızca Google ve Anonim açık olmalı (O-1).
2. **App Check → APIs:** Firestore için "Enforced" olmalı. Authentication için de açılması değerlendirilmeli.
3. **Firestore → Rules:** Konsoldaki metin `firebase/firestore.rules` ile aynı mı?
4. **Proje ayarları → Android uygulaması → SHA parmak izleri:** Deneme anahtarının parmak izi kayıtlı mı (D-6)?

## Önerilen düzeltme sırası (Ek 6 / A-3)

1. K-1 (sayfa tarafı hemen, kural tarafı aynı PR'da; kuralı site sahibi yayınlar)
2. Y-1
3. O-1 + O-4 (yetki ve ban birlikte)
4. O-2 + O-3 (oylar ve sayaçlar)
5. O-6, O-5
6. Düşükler (bir kısmı Ek 6 / B kod temizliğiyle birlikte)
