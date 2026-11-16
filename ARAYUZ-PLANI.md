# Arayüz yenileme planı

Bu dosya, KampüsCepte arayüzünün sayfa sayfa yenilenmesi için görev tanımlarını içerir.
Ajan, kendisine "ARAYUZ-PLANI.md'deki Adım N'yi yap" dendiğinde **önce `AGENTS.md`'yi, sonra bu dosyada "Her adımda"
bölümünü ve ilgili adımı** okur ve yalnızca o adımı yapar.

Sıra önemlidir: Adım 0 ve 1 bütün sitenin tasarım dilini kurar, sonraki adımlar bu dili kullanır.
Bir adım site sahibi tarafından onaylanıp `main`'e birleştirilmeden sonraki adıma geçilmez.

Arayüz adımlarından bağımsız ek görevler: **Ek 1 (temiz adresler)**, **Ek 2 (Üniversite Evi menüsünün otomatik
çekilmesi)** **Ek 3 (güvenli yönetici paneli)** **Ek 4 (altyapı sağlamlığı)** ve **Ek 5 (yalnızca yöneticiye açık RAG asistanı)**. Bunlar dosyanın sonundadır ve arayüz adımlarından önce ya da arada yapılabilir.

---

## Her adımda (ortak protokol)

1. **İncele.** İlgili sayfayı yerelde aç (`python3 -m http.server 8000`) ve 390 px ile 1440 px genişlikte, açık ve koyu modda
   ekran görüntüsü al. Sayfayı kullanan bütün HTML/CSS/JS dosyalarını oku.
2. **Eleştir.** PR açıklamasının başına "Mevcut sorunlar" başlığıyla, sayfanın neden amatör ya da yapay zekâ şablonu gibi
   durduğunu madde madde yaz. Genel laf değil, somut gözlem: "Başlık ile alt metin arasında boyut farkı yok",
   "Altı kart aynı ağırlıkta, hangisinin önemli olduğu anlaşılmıyor", "Sağ tarafta 300 px boş alan var" gibi.
3. **Planla.** "Yeni düzen" başlığıyla şunları yaz: sayfada kullanıcının en çok ne yapmak istediği, bilgi hiyerarşisi
   (1. 2. 3. öncelik), mobil ve masaüstü yerleşim (hangi blok nereye), kaldırılan/birleştirilen öğeler ve nedeni.
4. **Uygula.** Yalnızca o adımın dosyalarına dokun. `kc.css` belirteçlerini kullan. JS'nin kullandığı id/class adlarını koru.
   `?v=` numaralarını ve `sw.js` `SURUM` değerini artır.
5. **Kendini denetle.** Sonuç ekran görüntülerini al ve aşağıdaki kontrol listesinden geçir. Geçmeyen madde varsa düzelt.
6. **PR aç.** Başlık: `Arayüz – Adım N: <sayfa>`. Açıklamada eleştiri, plan, önce/sonra ekran görüntüleri
   (390 px ve 1440 px, açık ve koyu), denenen işlevlerin listesi.

### Kontrol listesi

- [ ] Sayfaya 3 saniye bakan biri en önemli bilgiyi hemen buluyor mu?
- [ ] Yazı boyutlarında net bir hiyerarşi var mı (en fazla 5–6 farklı boyut, hepsi belirteçten)?
- [ ] Her şey aynı beyaz kart değil mi? Önem sırasına göre farklı ağırlıkta bileşenler var mı?
- [ ] Gradient leke, cam efekti, emoji, gereksiz rozet, toast yok mu?
- [ ] Masaüstünde ekran dolu ve dengeli mi; mobilde tek elle kullanılabiliyor mu (dokunma hedefi ≥ 44 px)?
- [ ] Koyu mod ve en az iki takım temasında (örn. Galatasaray, Beşiktaş) okunaklı mı?
- [ ] Logo, avatarlar ve `gorseller/` çizimleri aynen duruyor mu?
- [ ] Bütün düğmeler, linkler, giriş, yorum, puanlama eskisi gibi çalışıyor mu? Konsolda hata yok mu?
- [ ] Önceki adımlarda kurulan bileşenler (başlık, liste satırı, düğme, sekme) yeniden kullanıldı mı, yenisi icat edilmedi mi?

---

## Adım 0 — Tasarım dili (kod yazmadan önce temel)

**Dosyalar:** `kc.css`, `tema.js` (yalnızca belirteç değerleri), yeni `TASARIM.md`

Bütün siteyi gez (ana sayfanın bütün sekmeleri, `ders.html`, `yol-arkadasi/`, `magaza.html`, bir yurt sayfası) ve
tek bir tutarlı tasarım dili kur:

- **Tipografi ölçeği:** başlık 1–3, gövde, küçük metin, etiket. Satır yüksekliği ve harf aralığı. Yazı tipi Nunito kalır;
  daha olgun bir alternatif uygun görülürse yalnızca PR'da öneri olarak yazılır, site sahibi onaylamadan değiştirilmez.
- **Renk:** marka rengi ve ikincil rengin hangi durumda kullanılacağı. Renk az ve anlamlı kullanılır; sayfa çoğunlukla nötr.
- **Boşluk ölçeği** (4/8 tabanlı) ve sayfa ızgarası (mobil kenar boşluğu, masaüstü içerik genişliği ve sütunları).
- **Köşe ve gölge:** en fazla 3 köşe değeri, en fazla 2 gölge seviyesi. Her şey yuvarlak ve gölgeli olmak zorunda değil;
  çizgi ve zemin farkıyla da ayrım yapılabilir.
- **Bileşen envanteri:** sayfa başlığı, bölüm başlığı, liste satırı, birincil/ikincil düğme, sekme/segment, rozet, boş durum.
- **İkon seti:** satır içi SVG arayüz ikonları için kural (24 px ızgara, tek çizgi kalınlığı, `currentColor`, köşe stili).

`TASARIM.md` dosyasına bu kararları kısa ve net yaz. `kc.css`'teki belirteçleri bu kararlara göre güncelle.
Bu adımda sayfalar görsel olarak bozulabilir ya da az değişebilir; amaç zemini kurmak. PR'a örnek olarak yalnızca
yeni tipografi ve bileşenleri gösteren bir ekran görüntüsü yeterli.

## Adım 1 — Çerçeve ve gezinme

**Dosyalar:** `index.html` (yan menü, mobil üst/alt çubuk), `ana.css`, `masaustu.css`, `uygulama.css`

Masaüstü yan menüsü ve mobil gezinme (alt sekme çubuğu / üst çubuk). Hangi sekmenin aktif olduğu çok net görünmeli.
Masaüstünde içerik alanının genişliği ve sağdaki boş alanın nasıl kullanılacağı bu adımda kararlaştırılır
(arka plan çizimleri ya da yan sütun — mevcut arka plan çizimlerine dokunmadan önce PR'da sor).
Satır içi gezinme ikonlarını Adım 0'daki ikon setine göre yeniden çiz.

## Adım 2 — Ana sayfa

**Dosyalar:** `index.html` (`#ana`), `ana.css`, `masaustu.css`, ana sayfada blok basan JS dosyaları (`ana.js`, `vitrin.js`,
`program.js`, `vize.js`, `ozelgun.js`, `duyuru.js` — yalnızca HTML çıktısı/sınıf adları, mantık değil)

Öğrencinin günlük "kontrol paneli". Sabah açtığında bugünkü menü, sıradaki ders, yaklaşan sınav/tatil sayacı ve
duyurular bir bakışta görünmeli. Bölüm/sınıfa göre görünen ve görünmeyen bloklar (ders programı yoksa hiçbir şey
gösterilmez kuralı) korunur. Vitrin ve sponsor alanı içeriği ezmeden yerleşmeli.

## Adım 3 — Yurtlar ve yemek menüsü

**Dosyalar:** `index.html` (`#yurtlar`), `ana.css`, `masaustu.css`, `yemekfoto.js`, `skor.js`, `yorum.js` (yalnızca görünüm)

Yemek menüsü sitenin en çok kullanılan yeri. Yemek fotoğrafları büyük ve iştah açıcı; kalori/makro değerleri okunaklı
ama ikincil; puan ve beğeni net. Günler arası kitap sayfası gibi kaydırma korunur. Yorumlar bölümü sohbet uygulaması
kalitesinde olmalı.

## Adım 4 — Notlar ve ders listesi

**Dosyalar:** `index.html` (`#notlar`), `dersler.html`, ilgili CSS

Bölüm → sınıf → ders seçimi hızlı olmalı. Ortak dersler ayrı ve belirgin. Ders listesi kart duvarı değil, taranabilir bir
liste/ızgara: ders adı, ne içerik olduğu (ünite sayısı, test, çıkmış soru, prova, Sınav Koçum) bir bakışta görünsün.

## Adım 5 — Ders sayfası

**Dosyalar:** `ders.html`, `masaustu.css`, `cikmis.js`

Üniteler, Kendini Test Et, çıkmış sorular, vize provaları ve PDF indirmeleri. Test çözme ekranı odaklı ve sade
(soru, şıklar, ilerleme). Masaüstünde iki sütun ızgarası yeniden düşünülebilir.

## Adım 6 — Sınav Koçum

**Dosyalar:** `koc.html`, `koc/koc.js` (yalnızca görünüm)

Kişisel koç hissi: kullanıcının ilerlemesi, sıradaki konu, güçlü/zayıf yönler net. Ders sayfasıyla aynı bileşenler.

## Adım 7 — Takvim

**Dosyalar:** `index.html` (`#takvim`), `takvim-izgara.js`, ilgili CSS

Akademik takvim, sınav haftaları ve tatiller. Ay görünümü okunaklı; bugünden sonraki önemli tarihler liste olarak öne
çıkar. Tıp ve Diş Hekimliği takvim farkı korunur.

## Adım 8 — Araçlar

**Dosyalar:** `index.html` (`#araclar`), ilgili JS'nin HTML çıktısı, ilgili CSS

Araçların listesi ve her aracın kendi ekranı (ortalama hesaplama vb.). Her araç gerçek bir uygulama ekranı gibi:
net giriş alanları, büyük sonuç, sade açıklama.

## Adım 9 — Ayarlar

**Dosyalar:** `index.html` (`#ayarlar`), `ayarlar.js` (yalnızca HTML çıktısı ve ikonlar), `tema.js` (tema seçici görünümü), ilgili CSS

iOS/Android ayarlar ekranı kalitesinde. Profil başlığı (avatar, ad, yurt/bölüm/sınıf) daha güçlü. Liste satırlarının
renkli ikon kutuları Adım 0 ikon setine göre yeniden çizilir; her satıra farklı renk vermek yerine tutarlı ve sakin bir
ikon dili kullanılır. Gruplar (Tercihler, Destek, Hakkında) arasında net ritim. Tekrarlayan satırlar birleştirilebilir
(örn. "İletişim" ile "Hakkımızda ve iletişim" — PR'da öner, kaldırmadan önce sor). Masaüstünde bu ekran tam genişliğe
yayılmamalı; okunaklı genişlikte ya da iki sütunlu (sol: kategori listesi, sağ: seçilen ayar) olabilir.

## Adım 10 — Yol Arkadaşı

**Dosyalar:** `yol-arkadasi/index.html` ve içindeki stiller

İlan listesi, ilan verme formu, giriş. Güven veren, düzenli bir ilan düzeni: nereden → nereye, saat, kişi sayısı en önde.
Firebase/giriş/ban mantığına dokunulmaz.

## Adım 11 — Mağaza ve sponsorlar

**Dosyalar:** `magaza.html`, `sponsorlar.js` (yalnızca görünüm), `sponsor/index.html`, `reklam/index.html`

Sponsor işletmenin mağazası gerçek bir sipariş/menü sayfası gibi; işletmelere satılabilecek kalitede. Sponsorluk
tanıtım sayfaları işletme sahibine güven veren, sade bir satış sayfası.

## Adım 12 — Yan sayfalar

**Dosyalar:** yurt kısa sayfaları (`ahmet-kabakli/` … `sare-ana/`), `notlar/**/unite-N.html`, `gizlilik.html`,
`hakkimizda.html`, `404.html`, `odev/`

WhatsApp'tan gelen kişinin ilk gördüğü sayfalar (yurt sayfaları) hızlı ve net olmalı. Ünite özet sayfaları okuma
deneyimi için: rahat satır uzunluğu, iyi başlıklar. Bu sayfalar betiklerle üretildiyse, ortak bir CSS dosyası üzerinden
değiştir; içerik metinlerine dokunma.

## Adım 13 — Son tutarlılık turu

**Dosyalar:** hepsi (yalnızca CSS ve küçük düzeltmeler)

Bütün sayfaları sırayla gez. Aynı bileşenin farklı yerlerde farklı görünüp görünmediğini, kullanılmayan CSS'i,
belirteç dışı sabit renkleri (`grep -n "#[0-9a-fA-F]\{3,6\}"`), koyu mod ve takım temalarındaki bozuklukları tespit edip
düzelt. PR'a bütün sayfaların 390 px ve 1440 px ekran görüntülerini koy.

---

## Ek 1 — Temiz adresler (adres çubuğunda `.html` görünmesin)

**Sorun:** Adres çubuğunda `kampuscepte.com.tr/index.html`, `/ders.html?d=…`, `/notlar/…/unite-3.html` gibi adresler
görünüyor. Bu, sitenin amatör durmasına yol açıyor.

**Hedef:** `kampuscepte.com.tr/`, `/dersler`, `/ders?d=…`, `/koc`, `/magaza`, `/gizlilik`, `/hakkimizda`,
`/notlar/ybs/1/bilisim-sistemleri/unite-3` biçiminde adresler.

**Yapılacaklar:**
1. Barındırmanın (GitHub Pages / Cloudflare Pages) uzantısız adresi `.html` dosyasına çözdüğünü yerelde değil canlıda
   doğrula (örn. `/dersler` açılıyor mu). Açılmıyorsa uygun klasör yapısını (`dersler/index.html`) PR'da öner, sormadan taşıma.
2. Sitedeki bütün iç bağlantıları (`href`, `location.href`, `window.open`, JS içinde üretilen linkler, `sitemap.xml`,
   `<link rel="canonical">`, Open Graph `og:url`) uzantısız biçime çevir. `index.html` linkleri `/` olur.
3. Eski `.html` adresleri **çalışmaya devam etmeli** (WhatsApp gruplarında ve Google'da duruyorlar). Her sayfanın başına,
   adres `.html` ile bitiyorsa `history.replaceState` ile adres çubuğunu uzantısız hâle getiren küçük bir betik ekle
   (sorgu dizesi ve `#` korunur). Ortak bir dosyada olsun, her sayfaya kopyalanmasın.
4. Service worker (`sw.js`) önbellek listesi ve yönlendirmeleri yeni adreslerle de çalışmalı. Android uygulaması
   (`?kaynak=uygulama`) bozulmamalı.
5. Ünite sayfaları betikle üretildiyse, betiğe değil üretilmiş HTML'e uygula ve bunu PR'da belirt.

Bu görev `AGENTS.md` 4. bölümdeki "URL'ler değiştirilmez" kuralının tek istisnasıdır: yeni adresler eklenir,
eskiler kaldırılmaz.

**Not:** Sitenin "HTML ile yazılmış" olması sorun değildir; her web sitesi tarayıcıya HTML olarak gelir. Görünen sorun
yalnızca adres biçimidir. Siteyi bir framework ile sıfırdan yazmak gerekmez ve yapılmaz.

## Ek 2 — Üniversite Evi menüsünün otomatik çekilmesi

**Durum:** `.github/workflows/unievi.yml` ve `.github/scripts/unievi_guncelle.py` menüyü https://unievi.firat.edu.tr/
adresinden okuyup `veri.js` içindeki `uniEviMenuleri` bloğuna yazmak için zaten var. Ancak **en az 9 Kasım 2026'dan beri her
çalışma başarısız**: kayıtlarda (`unievi-kayit` dalı, `unievi.log`) üç denemenin de `TimeoutError` ile bittiği görülüyor.
Site Türkiye'den açılıyor; GitHub Actions sunucuları yurt dışında. En olası neden üniversite sitesinin yurt dışı
IP'lerini engellemesi.

**Menünün yayımlanma düzeni:** Haftalık menü cumartesi, pazar ya da pazartesi günlerinden birinde siteye girilir.

**Yapılacaklar:**
1. Önce nedeni kanıtla: GitHub Actions içinden `curl -v` ile bağlantının nerede takıldığını (DNS, TCP, TLS) kayda yaz.
2. Yurt dışından erişim engelliyse, çekme işinin **Türkiye'deki bir IP'den** çalışmasını sağlayacak çözümleri karşılaştırıp
   PR'da site sahibine sun (maliyet, bakım, güvenilirlik):
   - Türkiye'de bir makinede çalışan **self-hosted GitHub Actions runner** (ör. küçük bir Türkiye VPS'i),
   - Türkiye'de barındırılan küçük bir sunucuda zamanlanmış görev (cron) — çıktıyı GitHub API ile depoya yazar,
   - başka bir uygun yol.
   Ücretli hizmet açmayı, hesap oluşturmayı ve gizli anahtar eklemeyi site sahibi yapar; ajan yalnızca adımları ve kodu hazırlar.
3. Zamanlamayı yayımlanma düzenine göre ayarla: **cumartesi, pazar ve pazartesi** günleri gün boyunca birkaç saatte bir
   (ör. 08:00–22:00 arası 2 saatte bir) dene; o haftanın menüsü bulunduktan sonra aynı hafta için tekrar denemeyi bırak.
   Diğer günlerde günde bir kontrol yeterli (sonradan yapılan düzeltmeler için).
4. Ayrıştırıcıyı sağlamlaştır: sayfa yapısı değişirse ya da menü eksik gelirse `veri.js`'e **hiçbir şey yazma**; mevcut
   menüleri silme ya da boşaltma. Yalnızca yeni ve eksiksiz günleri ekle, var olan günleri ancak sitede gerçekten
   değiştiyse güncelle.
5. unievi.firat.edu.tr'deki **kalori, protein, karbonhidrat, yağ** değerlerini de oku ve menüyle birlikte kaydet
   (veri biçimini eski kayıtları bozmadan genişlet; sitede gösterim arayüz adımlarında yapılır).
6. **Yemek fotoğraflarına zarar gelmesin:** yemek adları `yemekfoto.js` eşleşmeleriyle aynı biçimde yazılmalı
   (`guzel()` normalizasyonu korunur). Yeni çekilen bir yemek adı mevcut bir fotoğrafla eşleşmiyorsa fotoğraf dosyasına
   dokunma; eşleşmeyen adları kayda ve PR'a liste olarak yaz, site sahibi fotoğrafı sonra ekler.
7. Menü puanları ve beğeniler (Firestore) menü güncellenince kaybolmamalı; anahtar yapısına dokunma.
8. Başarısız olursa sessizce geçme: iş akışı kırmızı bitsin ve kayıt `unievi-kayit` dalına yazılsın (mevcut davranış).

## Ek 3 — Güvenli yönetici paneli

**Arka plan:** Sitede daha önce bir yönetici paneli vardı; güvenlik kaygısıyla tamamen kaldırıldı ve moderasyon Firebase
konsoluna taşındı. Site sahibi şimdi pratik ama **güvenlik açığı yaratmayan** yeni bir panel istiyor.
Bu görev arayüz adımlarından büyüktür; tek PR'da değil, aşağıdaki aşamalarla yapılır. **Kod yazmadan önce 1. aşamadaki
tasarım belgesi site sahibine sunulur ve onay beklenir.**

**Panelde yapılabilecekler:**
- **Not ekleme:** derse PDF/ünite ekleme, not linklerini düzenleme.
- **Yorum moderasyonu:** yorum silme/gizleme, kullanıcı banlama (Yol Arkadaşı'ndaki süresiz ban dahil).
- **Menü ekleme:** yurt ve Üniversite Evi menülerini elle girme ve düzeltme.
- **Görselden menü aktarma:** site sahibi menü görselini (örn. KYK aylık menü fotoğrafı) yükler; yapay zekâ görseldeki
  tarihleri ve yemekleri okuyup ilgili günlere dağıtılmış bir tablo hazırlar; site sahibi tabloyu ekranda kontrol edip
  düzeltir ve **"Kaydet"e bastığında** yayına girer. Yapay zekâ çıktısı onaysız asla yayına girmez.
- Duyuru ekleme/kaldırma.

**Güvenlik kuralları (pazarlık konusu değil):**
1. Yetki **sunucu tarafında** denetlenir. Yalnızca Google ile giriş yapmış ve yönetici listesindeki hesap
   (başlangıçta tek hesap: site sahibinin yönetici Google hesabı) yazabilir. Denetim Firestore/Storage güvenlik kurallarında
   ve sunucu fonksiyonunda yapılır; sayfadaki JavaScript'in "bu kişi yönetici mi" kontrolü yalnızca görünüm içindir.
   Tercihen Firebase **custom claim** (`admin: true`) ya da UID listesi kullanılır, e-posta metni tek başına yeterli sayılmaz.
2. Depoya, sayfaya ya da tarayıcıya **hiçbir gizli anahtar** (GitHub token, yapay zekâ API anahtarı, servis hesabı) konmaz.
   Bunlar yalnızca sunucu tarafındaki gizli ortam değişkenlerinde durur ve site sahibi tarafından girilir.
3. Panel sayfası gizlilik için `noindex` olur ve sitemap'e eklenmez; ama güvenlik adresin gizli olmasına dayanmaz.
4. Yüklenen dosyalarda tür ve boyut sınırı (PDF ≤ 25 MB, görsel ≤ 10 MB), App Check zorunlu.
5. Her yönetici işlemi bir denetim kaydına yazılır (kim, ne zaman, ne değişti) ve geri alınabilir olmalıdır.
6. Firestore kurallarındaki değişiklikler PR'da ayrı başlık altında, satır satır açıklanır; mevcut kullanıcıların
   yorum/puan/ilan yetkileri daralmaz ya da genişlemez.

**Aşamalar:**
1. **Tasarım belgesi (kod yok):** İçeriğin nerede tutulacağı (bugün `veri.js`'de; panelden düzenlenebilmesi için
   Firestore'a taşınması ve sitenin Firestore'dan okuması, okunamazsa `veri.js` yedeğine düşmesi önerilir), dosyaların
   nereye yükleneceği, yapay zekâ çağrısının nerede çalışacağı (Firebase Cloud Functions / Cloudflare Worker vb.),
   hangi yapay zekâ modelinin kullanılacağı ve **aylık tahmini maliyet** (Firebase Blaze planı gerekip gerekmediği dahil).
   En az iki seçenek, artı/eksileriyle. Site sahibi seçer.
2. **Yetki ve kurallar:** yönetici yetkisi, güvenlik kuralları, denetim kaydı. Kuralları Firebase Emulator ile test et
   (yönetici yazabiliyor, normal kullanıcı ve girişsiz kişi yazamıyor) ve test çıktısını PR'a koy.
3. **İçeriğin Firestore'a taşınması:** menüler, not linkleri, duyurular. Site görünüşü ve adresleri değişmez;
   `veri.js` yedek olarak kalır. Ek 2'deki otomatik Üniversite Evi çekme işi de buraya yazacak şekilde uyarlanır.
4. **Panel ekranları:** menü, not, yorum, duyuru. Telefonda tek elle kullanılabilecek kadar pratik: az dokunuş,
   büyük düğmeler, anlık önizleme. Arayüz `AGENTS.md` tasarım çıtasına uyar.
5. **Görselden menü aktarma:** görsel yükle → yapay zekâ okur → gün gün düzenlenebilir tablo → kontrol → kaydet.
   Yemek adları `yemekfoto.js` eşleşmeleriyle aynı biçimde normalize edilir; eşleşmeyen yemekler tabloda işaretlenir.
   Okunamayan ya da emin olunamayan hücreler boş ve işaretli bırakılır, uydurulmaz.

## Ek 4 — Altyapı sağlamlığı

Her madde ayrı PR olabilir. Ücretli hizmet açma, hesap oluşturma ve gizli anahtar girme işlerini site sahibi yapar;
ajan adımları ve kodu hazırlar.

1. **Hata bildirimi:** `.github/workflows/` altındaki zamanlanmış işler (Üniversite Evi menüsü, vakitler, Android derleme)
   başarısız olduğunda site sahibine bildirim gitmeli (GitHub'ın e-posta bildirimi yeterli değilse iş akışının kendisi
   bir bildirim göndersin — yöntem PR'da önerilir). Aynı iş art arda başarısız oluyorsa her seferinde değil, durum
   değiştiğinde bildir. Ayrıca sitenin çalışıp çalışmadığını dışarıdan izleyen ücretsiz bir çalışma süresi (uptime)
   izleme hizmeti öner ve kurulum adımlarını yaz.
2. **Veritabanı yedeği:** Firestore'daki yorumlar, puanlar, beğeniler, ilanlar ve (Ek 3'ten sonra) menüler/notlar için
   düzenli otomatik yedek. Seçenekleri (Firestore zamanlanmış yedekleme, dışa aktarma işi vb.) maliyetiyle PR'da sun.
   Yedekten geri yüklemenin nasıl yapılacağını adım adım yaz ve bir kez dene.
3. **Önizlemede giriş:** PR önizleme adreslerinde Google ile giriş çalışmalı. Hangi alan adının Firebase konsolunda
   "Authorized domains" listesine (ve App Check / reCAPTCHA alan adlarına) eklenmesi gerektiğini site sahibine yaz.
4. **Hız turu (arayüz adımları bittikten sonra):** Lighthouse ile mobil ölçüm yap (önce/sonra puanlarını PR'a koy).
   Ana sayfada yüklenen dosya sayısını ve boyutunu azalt: kullanılmayan CSS/JS'i temizle, kritik olmayan betikleri
   `defer` et, görselleri doğru boyutta ve tembel yükle. Derleme adımı ekleme (AGENTS.md). Yemek fotoğraflarına
   dokunma kuralı burada da geçerli.

## Ek 5 — RAG tabanlı Türkçe bilgi asistanı (yalnızca yönetici panelinde)

**Önkoşul:** Ek 3'ün 2. aşaması (yönetici yetkisi ve güvenlik kuralları) birleştirilmiş olmalı.

**Amaç:** KampüsCepte içeriği üzerinde çalışan, Türkçe sorulara kaynak göstererek doğru cevap veren, araştırma
kalitesinde bir RAG (Retrieval-Augmented Generation) asistanı. Bu asistan site sahibinin bir araştırma projesinin
konusudur; bu yüzden **ölçülebilir, belgelenmiş ve tekrar üretilebilir** olmalı. Hızlı bir demo değil, eksiksiz bir sistem.

### Mutlak kural: kamuya açılmaz

- Asistan **yalnızca yönetici panelinde** görünür ve çalışır. Sitenin hiçbir herkese açık sayfasında, menüsünde,
  Android uygulamasında, sitemap'te, duyuruda ya da kaynak kodunda görünen bir giriş noktası (düğme, sohbet balonu,
  link, "yakında" rozeti) olmaz.
- Asistan uç noktası (API) her istekte yönetici yetkisini **sunucu tarafında** doğrular; yönetici olmayan her isteği reddeder.
  App Check zorunlu.
- Herkese açık hâle getirmek yalnızca site sahibinin açık talimatıyla, ayrı bir PR'da yapılır.

### Bilgi kaynakları

- **Durağan içerik (RAG ile):** ünite özet sayfaları (`notlar/**/unite-N.html`), `ders.json` dosyaları (ünite adları, test
  soruları), SSS, hakkımızda/gizlilik, yurt bilgileri, Yol Arkadaşı kuralları, akademik takvim açıklamaları.
- **Değişken veri (RAG ile değil, yapılandırılmış sorgu/araç çağrısı ile):** bugünün ve haftanın menüleri, ders ve vize
  programı, sınav tarihleri, sayaçlar. "Bugün Üniversite Evi'nde ne var?" sorusu güncel veriden cevaplanır, eski bir
  metin parçasından değil. Tarih/saat Europe/Istanbul'a göre.
- Depoda olmayan özel kaynak metinler (kitap PDF'leri vb.) site sahibi verirse eklenir; verilmezse yalnızca açık içerik kullanılır.
- Yeni içerik eklendiğinde (panelden not/menü) dizin otomatik güncellenir.

### Kalite gereksinimleri

1. **Türkçeye özgü işleme:** Türkçe karakterler ve büyük/küçük harf (İ/ı) doğru; çekim ekleri nedeniyle anahtar kelime
   aramasında kök/normalizasyon. Parçalama (chunking) başlık ve paragraf sınırlarına saygılı, parça başına kaynak
   sayfa ve başlık bilgisi saklanır.
2. **Hibrit erişim:** anlamsal (embedding, çok dilli/Türkçe destekli model) + anahtar kelime (BM25) araması, ardından
   yeniden sıralama (reranking). Seçimler PR'da gerekçelendirilir ve değerlendirmeyle karşılaştırılır.
3. **Kaynak gösterme:** her cevap, dayandığı sayfalara tıklanabilir atıf verir. Kaynaklarda olmayan bilgi uydurulmaz;
   bulunamayan soruya "Bu konuda sitede bilgi bulamadım" denir. Ders konularında yanlış bilgi vermemek, cevap vermekten önemlidir.
4. **Kapsam dışı ve kötüye kullanım:** kapsam dışı soruları kibarca reddeder; istem enjeksiyonuna (prompt injection)
   karşı sistem talimatı ile kaynak metin ayrılır, kaynak metindeki talimatlar uygulanmaz.
5. **Kişisel veri:** yorumlar, kullanıcı adları, e-postalar, ilan sahipleri gibi kişisel veriler dizine **girmez** ve
   dil modeline gönderilmez. Kayıtlarda kullanıcı kimliği tutulmaz (yalnızca yönetici kullanıyor olsa da).
6. **Maliyet ve güvenlik sınırı:** günlük istek ve harcama tavanı (sunucu tarafında), aşılınca durur. API anahtarları
   yalnızca sunucu gizli değişkenlerinde.

### Değerlendirme (araştırma için zorunlu)

- En az 150 soruluk Türkçe **test seti**: ders içeriği, menü/tarih, site kullanımı, kapsam dışı ve cevabı olmayan sorular;
  her biri için beklenen cevap ve beklenen kaynak. Sorular gerçekçi öğrenci diliyle (yazım hatası, kısaltma dahil).
  Test seti depoda ayrı bir dosyada, sürümlü.
- Ölçütler: erişim için recall@k ve MRR; cevap için doğruluk, kaynağa sadakat (faithfulness), atıf doğruluğu,
  doğru reddetme oranı; ayrıca ortalama yanıt süresi ve soru başına maliyet.
- Tek komutla çalışan değerlendirme betiği; sonuçları tarihli rapor olarak kaydeder. Farklı yapılandırmalar
  (yalnız vektör / hibrit / yeniden sıralamalı; farklı parça boyutları; farklı modeller) karşılaştırma tablosuyla raporlanır.
- Yönetici panelinde: asistanla sohbet ekranı, her cevabın altında kullanılan kaynak parçalar ve skorları,
  cevaba 👍/👎 ve not ekleme (geri bildirim kaydı), değerlendirme sonuçlarının özet ekranı.
- İleride öğrencilerle yapılacak kullanıcı çalışması için hazırlık: anket soruları taslağı ve KVKK'ya uygun bilgilendirme/onam
  metni taslağı (çalışma bu görev kapsamında **başlatılmaz**).

### Belgeleme

`asistan/BELGE.md` (Türkçe): mimari şeması, veri akışı, her teknik seçimin gerekçesi ve alternatifleri, değerlendirme
yöntemi ve sonuçları, bilinen sınırlılıklar, maliyet tablosu, kurulum ve yeniden dizinleme adımları. Ayrıca her önemli
kararın tarihli kaydı (karar günlüğü). Site sahibi bu belgeyle sistemi anlatabilmeli ve savunabilmeli.

### Aşamalar (her biri ayrı PR, kod yazmadan önce 1. aşama onaylanır)

1. **Tasarım belgesi:** mimari, model ve vektör deposu seçenekleri (en az iki seçenek, maliyetiyle), Firebase planı
   gereksinimi, aylık tahmini maliyet, test seti taslağının ilk 30 sorusu.
2. **Dizinleme:** içerik toplama, temizleme, parçalama, embedding, dizin; otomatik güncelleme.
3. **Erişim:** hibrit arama + yeniden sıralama, erişim değerlendirmesi (recall@k, MRR) raporu.
4. **Cevap üretimi:** kaynak gösteren, uydurmayan, değişken veriyi araçla çeken cevap katmanı; güvenlik sınırları.
5. **Değerlendirme:** tam test seti, değerlendirme betiği, yapılandırma karşılaştırma raporu.
6. **Yönetici paneli ekranları:** sohbet, kaynak görünümü, geri bildirim, değerlendirme özeti. Arayüz AGENTS.md
   tasarım çıtasına uyar.
