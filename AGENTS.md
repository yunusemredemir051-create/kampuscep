# AGENTS.md — KampüsCepte için çalışma kuralları

Bu dosya, bu depoda çalışan her yapay zekâ ajanı (Codex, Claude, Cursor vb.) ve geliştirici içindir.
İşe başlamadan önce tamamını oku. Kurallar ile görev çelişirse dur ve site sahibine sor.

## 1. Site nedir

KampüsCepte (https://kampuscepte.com.tr), Elazığ'daki üniversite öğrencileri için bir günlük rehberdir:
yurt ve Üniversite Evi menüleri, ders notları ve testler, çıkmış sorular, vize provaları, Sınav Koçum,
akademik takvim, ders/vize programı, Yol Arkadaşı (taksi paylaşımı), sponsor mağazaları.

- **Teknoloji:** Derleme adımı olmayan düz HTML + CSS + JavaScript. Framework, npm ya da bundler yok (kök dizinde).
  Böyle kalmalı; React/Vue/Tailwind vb. eklenmez.
- **Yayın:** `main` dalı canlı sitedir. `main`'e giren her şey birkaç dakika içinde herkese yayılır.
- **Veri ve giriş:** Firebase (Auth: Google ile giriş, Firestore: yorumlar, puanlar, ilanlar) + App Check (reCAPTCHA).
- **Android uygulaması:** `_uygulama/` bir Capacitor kabuğudur ve **canlı siteyi** açar
  (`https://kampuscepte.com.tr/?kaynak=uygulama`). Yani sitede yapılan her değişiklik uygulamaya da anında yansır.

## 2. Çalışma akışı (zorunlu)

1. `main` dalına **asla doğrudan commit atma.** Her iş için ayrı dal aç (`arayuz/ana-sayfa` gibi) ve pull request gönder.
2. Bir PR = bir konu. Bütün siteyi tek PR'da değiştirme; sayfa sayfa ya da bileşen bileşen ilerle.
3. PR açıklamasına telefon (390 px) ve masaüstü (1440 px) genişliğinde **önce/sonra ekran görüntüsü** koy.
4. Site sahibi önizleme linkinden bakıp onaylamadan PR birleştirilmez.
5. Her PR açıklamasının sonuna **"Sade anlatım"** başlığıyla, yazılım bilmeyen site sahibinin anlayacağı Türkçe ile
   şunları yaz: bu değişiklik ne yaptı, neden bu yol seçildi, hangi dosyalar neyle ilgili, ileride bir yazılımcıyla
   konuşurken işine yarayacak terimler (kısa tanımlarıyla). Site sahibi siteyi bu açıklamalardan öğreniyor.
6. Başka bir ajan da bu depoda çalışıyor olabilir. PR açmadan önce `main`'i çek, çakışmayı sen çöz;
   açık PR'larda değiştirilen dosyalara mümkünse dokunma.

## 3. Dosya haritası

| Dosya / klasör | Ne işe yarar |
|---|---|
| `index.html` | Ana sayfa (tek sayfa, sekmeli: `.sayfa` blokları) |
| `kc.css` | **Tasarım sistemi.** Renk, yazı tipi, köşe, gölge belirteçleri (`--mavi`, `--kart`, `--r-2` …). Bütün sayfalar önce bunu yükler |
| `ana.css` | Ana sayfa stilleri |
| `masaustu.css` | Yalnızca web + geniş ekran kuralları. Her kural `html.web` ile başlar |
| `uygulama.css` | Yalnızca Android uygulaması kuralları. Her kural `html.uyg` ile başlar |
| `tema.js` | Koyu mod ve takım temaları (aynı belirteçleri değiştirir) |
| `veri.js` | Menüler, yurtlar, dersler, takvim — **içerik verisi** |
| `ders.html`, `dersler.html` | Ders listesi ve ders sayfası (üniteler, test, çıkmış sorular, provalar) |
| `koc.html`, `koc/` | Sınav Koçum |
| `magaza.html`, `sponsorlar.js`, `sponsor/`, `reklam/` | Sponsor mağazaları ve sponsorluk tanıtım sayfaları |
| `yol-arkadasi/` | Taksi paylaşımı (Firebase girişli) |
| `ahmet-kabakli/`, `firat/`, `harput/` … | Yurtlara özel kısa menü sayfaları (WhatsApp grupları için) |
| `notlar/**/unite-N.html` | Ünite özet sayfaları (SEO / AdSense) |
| `yorum.js` | Yorumlar, menü puanları ve beğeniler (Firestore) |
| `skor.js`, `workers/kc-skor.js` | Ana sayfadaki maç skorları. `skor.js` sayfada gösterir; `workers/kc-skor.js` Cloudflare Worker'ın kopyasıdır (API-Football'dan veri çeker, anahtar Cloudflare gizli değişkeninde). Worker depodan otomatik yüklenmez, Cloudflare panelinden elle yayınlanır |
| `ayarlar.js`, `program.js`, `vize.js` | Ayarlar (bölüm/sınıf), ders ve vize programı |
| `ses.js`, `bildirim.js`, `duyuru.js` | Ses efektleri, bildirimler, duyurular |
| `ozelgun.js`, `gorseller/ozel/`, `vakitler.json` | Özel gün temaları (`?tarih=YYYY-AA-GG` önizleme, `?tarih=kapat` çıkış), özel gün görselleri, Ramazan sayaçları için namaz vakitleri. Bkz. ARAYUZ-PLANI.md Ek 8 |
| `workers/kc-unievi.js`, `.github/scripts/unievi_guncelle.py` | Üniversite Evi menüsünü otomatik okuma. Worker, yurt dışını engelleyen unievi.firat.edu.tr'ye Cloudflare üzerinden bağlanan aracıdır (Cloudflare panelinden elle yayınlanır; adresi depo ayarlarında `UNIEVI_VEKIL_URL` değişkeninde). Okuyucunun testleri `.github/scripts/test/` |
| `istekler/` | Site sahibinin isteklerinin kendi yazdığı tam metinleri. İlgili göreve başlamadan önce okunur |
| `sw.js` | Service worker (önbellek). `SURUM` sabiti var |
| `firebase/firestore.rules` | Firestore güvenlik kuralları (16 Kasım 2026'da Firebase konsolundaki yayındaki sürümden kopyalandı). Depodaki dosya Firebase'e **otomatik yüklenmez**; değişiklikler site sahibi tarafından konsoldan yayınlanır. Kuralı değiştiren PR, konsola yapıştırılacak tam metni ve neyin değiştiğini açıkça yazar |
| `gorseller/`, `ikonlar/`, `favicon.svg` | Logo, ikon, avatar, yemek fotoğrafları |
| `.github/` | Otomatik menü/vakit güncelleme ve Android derleme iş akışları |

## 4. Dokunulmayacak yerler

Arayüz işinde aşağıdakiler **değiştirilmez**. Gerekirse PR'da gerekçesiyle sor.

- `firebase-ayar.js`, Firebase/App Check başlatma kodu, Firestore koleksiyon ve alan adları, giriş akışı.
- `veri.js` içindeki verinin **biçimi** (alan adları, yapı). Görünüm değişir, veri yapısı değişmez.
- URL'ler ve dosya yolları (yurt sayfaları, `ders.html?d=…`, `/sponsor`, `/reklam`, ünite sayfaları). WhatsApp gruplarında ve Google'da bu linkler var.
  (Ek 9'da `/reklam/` yalnızca `/sponsor/`'a yönlendirilir; adres yine çalışır.)
- **Logo, uygulama ikonu (`ikonlar/`, `favicon.svg`), avatarlar ve `gorseller/` içindeki çizim/görseller.** Bunları site sahibi
  kendisi çiziyor. Yenisini çizme, rengini/biçimini değiştirme.
  - **İstisna:** Arayüzdeki küçük çizgi ikonlar (menü, ayarlar listesi, düğmeler, sekmeler içindeki satır içi `<svg>` ikonlar)
    yeniden tasarlanabilir. Bunlar tek bir tutarlı set olarak elle yazılmış SVG olur (aynı çizgi kalınlığı, aynı ızgara, `currentColor`).
    İkon kütüphanesi (Font Awesome vb.) ve emoji kullanılmaz.
- **Yemek fotoğrafları:** `gorseller/yemek/` içindeki dosyalar ve `yemekfoto.js`'deki yemek adı → fotoğraf eşleşmeleri.
  Fotoğraf silinmez, yeniden adlandırılmaz, sıkıştırılmaz, kırpılmaz, üzerine filtre uygulanmaz. Görünüm değişebilir
  (boyut, oran, yerleşim) ama dosyaların kendisi ve eşleşmeler aynen kalır. Menü verisi değişince eşleşme bozulmamalı.
- JavaScript'in kullandığı `id` ve `class` adları. HTML yapısını değiştirmeden önce adı tüm `.js` dosyalarında ara (`grep -rn`).
- `.reklam` kutuları (AdSense alanları) ve `ads.txt` (reklam yerleşimi yalnızca Ek 10 kapsamında değişir).
- `.github/workflows/`, `_uygulama/`, `CNAME`, `robots.txt`, `sitemap.xml` (`_uygulama/` yalnızca Ek 7 kapsamında değişir).
- Çalışan hiçbir özellik kaldırılmaz ya da gizlenmez. **Özel gün temaları ve önizleme sistemi** (`?tarih=…`) her değişiklikten sonra çalışır durumda kalmalı.
- Yapay zekâ asistanı (Ek 5) **yalnızca yönetici panelinde** bulunur. Herkese açık sayfalarda, Android uygulamasında
  ya da sitemap'te ona giden hiçbir giriş noktası olmaz; site sahibi açıkça istemeden kamuya açılmaz.

## 5. Güvenlik kuralları

- Yetki (yönetici, moderatör, ban) yalnızca **sunucu tarafında** verilir ve denetlenir: Firestore/Storage güvenlik kuralları,
  sunucu fonksiyonları, Firebase custom claim. Sayfadaki JavaScript'in yetki kontrolü yalnızca görünüm içindir.
- İstemcinin yazabildiği hiçbir alan (profil belgesi, ayar, liste) yetki kararını etkilemez.
- Herkese açık koda e-posta adresi, şifre, API anahtarı, token, keystore ya da yönetici kimliği yazılmaz.
- Kullanıcı girdisi sayfaya her zaman kaçışlanarak (escape) basılır.
- Güvenlik açığı bulursan düzeltmeden önce site sahibine bildir; istismar ayrıntısını herkese açık yere yazma.

## 6. İçerik kuralları

- Örnek/placeholder olarak site sahibinin adı kullanılmaz. Gerçekçi ama kurgusal içerik kullan.
- Çıkmış sorularda üniversite adı geçmez.
- Anlaşması olmayan işletme sponsorlar arasında gösterilmez.
- Arayüz metinleri Türkçe, sade ve öğrenci diline yakın. "Hoş geldiniz!", "Keşfedin", "Yolculuğunuz başlasın" gibi kalıp pazarlama cümleleri yok.

## 7. Tasarım çıtası — "yapay zekâ şablonu gibi durmasın"

Site sahibi iki tasarım turunu "hâlâ yapay zekâ yapmış gibi duruyor" diyerek reddetti. Hedef: profesyonel bir ürün ekibinin
elinden çıkmış gibi duran, kendine ait karakteri olan, sayfa düzeni güçlü bir site.
derslig.com bir referanstır, kopyalanacak bir şablon değil; ondan daha iyi bir düzen önerilebilir.
Masaüstü ve mobil düzen farklı olabilir; mobil bir uygulama gibi, masaüstü bir web sitesi gibi hissettirmeli.
**Mobil önceliklidir:** site sahibi için Android uygulaması masaüstünden daha önemli; mobil, masaüstünün küçültülmüş
hâli değil, ayrı bir ürün gibi tasarlanır (bkz. `istekler/mobil-uygulama.md`, ARAYUZ-PLANI.md Ek 7).
Sayfa sayfa yenileme planı ve her adımın görev tanımı: `ARAYUZ-PLANI.md`.

**Yapma:**
- Rastgele, her sitede görülen şablon tipi bulanık renk lekeleri; mor-mavi geçişli gradient düğmeler ve başlıklar.
  (Arka plan dokusu, ışık ve derinlik **yasak değildir**: her tema için bilinçli tasarlanmış, ölçülü atmosfer Ek 11'in
  merkezi tema sistemiyle yapılır.)
- Cam (glassmorphism) efektleri, gereksiz `backdrop-filter`.
- Her şeye aynı büyük köşe yarıçapı. Her şeyin aynı beyaz kart + gölge olduğu, birbirinin kopyası kart ızgaraları.
- Emoji ikonlar, ikon kutusu + başlık + iki satır açıklama kalıbının her yerde tekrarı.
- Anlamsız süsleme: parıltı, nabız animasyonu, dekoratif şekiller, "✨ Yeni" rozetleri.
- Toast bildirimleri ve amatör görünen açılır uyarılar.
- Gri, cansız, her yerde aynı boşluk.

**Yap:**
- Güçlü tipografik hiyerarşi: başlık, ara başlık, gövde ve ikincil metin birbirinden açıkça ayrılsın. Az sayıda yazı boyutu, tutarlı kullanım.
- Bilgi yoğunluğu: öğrenci bir bakışta bugünkü menüyü, sıradaki dersi, yaklaşan sınavı görebilmeli. Süs değil içerik ön planda.
- Hiyerarşiye göre farklılaşan bileşenler: en önemli bilgi en büyük ve en belirgin; ikincil öğeler sade liste ya da satır olabilir, her şeyin kart olması gerekmez.
- Belirteç sistemi: renk, köşe, gölge, boşluk yalnızca `kc.css` belirteçlerinden. Sabit renk yazma. Yeni belirteç gerekiyorsa `kc.css`'e ekle.
- Tutarlı boşluk ölçeği (4/8 tabanlı), hizalı ızgaralar, net kenarlar.
- Gerçek görseller: menüde yemek fotoğrafları, sitenin kendi çizimleri.
- Etkileşimler kısa ve sakin (150–250 ms), dokunma geri bildirimi belirgin ama abartısız. `prefers-reduced-motion`'a uy.
- Koyu mod ve takım temalarında da düzgün görünmeli (`tema.js`). Her değişikliği iki modda da kontrol et.
- Erişilebilirlik: metin kontrastı en az WCAG AA, dokunma hedefi en az 44 px, `:focus-visible` görünür.
- Performans: yeni yazı tipi, kütüphane ya da büyük görsel ekleme. Görseller `webp`, tembel yükleme.

## 8. Teknik kurallar

- `kc.css`, `ana.css` ya da başka bir CSS/JS dosyası değişince o dosyayı yükleyen **bütün sayfalardaki** `?v=` numarasını artır
  ve `sw.js` içindeki `SURUM` değerini bir artır. Yoksa kullanıcılar eski dosyayı görmeye devam eder.
- Web'e özel düzen `masaustu.css`'e (`html.web …`), uygulamaya özel düzen `uygulama.css`'e (`html.uyg …`).
- Konsolda hata bırakma. Değişiklikten sonra ana sayfa, ders sayfası, bir yurt sayfası, Yol Arkadaşı ve mağaza sayfasını açıp dene.
- Yerelde denemek için kök dizinde `python3 -m http.server 8000` yeterli.
- Kod yorumları ve commit mesajları Türkçe.

## 9. Çalışma ortamı

Bu depoda tercih edilen ortam, **geliştiricinin bilgisayarında VS Code + Codex eklentisi** (yerel çalışma).
Bulut ortamı yalnızca tarayıcı ve ağ gerektirmeyen işler için (kod temizliği, belge) kullanılabilir.

**Yerelde yapılması zorunlu işler:**
- Arayüz adımları (ARAYUZ-PLANI.md Adım 0–13): site yerelde açılır, gerçek tarayıcıda 390 px ve 1440 px genişlikte
  bakılır, ekran görüntüleri buradan alınır.
- Ek 2 (Üniversite Evi menüsü): unievi.firat.edu.tr erişimi Türkiye'deki bu bilgisayardan test edilir ve yurt dışı
  (GitHub Actions) erişimiyle karşılaştırılır.
- Ek 3, Ek 5, Ek 6'daki güvenlik kuralı testleri: Firebase Emulator Suite ile yerelde yapılır; canlı Firebase projesine
  test verisi yazılmaz.

**Kurulum (bir kez):**
1. Git, VS Code ve VS Code için Codex eklentisi.
2. Depoyu klonla: `git clone https://github.com/yunusemredemir051-create/kampuscep.git`
3. Siteyi aç: depo kökünde `python3 -m http.server 8000` (Windows'ta `py -m http.server 8000`) → `http://localhost:8000`
4. Android uygulaması için (Ek 7): Android Studio, bir Android emülatörü ve USB hata ayıklaması açık bir telefon.
5. Güvenlik testleri için: Node.js LTS, Java 21+, `npm i -g firebase-tools`; emulator yalnızca demo proje kimliğiyle
   çalıştırılır (`firebase emulators:start --project demo-kampuscepte`), gerçek projeye bağlanmaz.

**Yerel çalışmada dikkat edilecekler:**
- Canlı ortama yayına alma (Firebase kurallarını yayınlama, Cloudflare Worker'ı güncelleme, Firebase ayarları) ajanın
  işi değildir; PR'da tam metin ve adımlar verilir, yayına alma site sahibiyle birlikte yapılır.
- Ajan, komut çalıştırmadan ve depo dışındaki dosyalara erişmeden önce onay ister (onaylı mod açık kalır).
- Gizli anahtar, `.env` ya da kişisel dosya depoya eklenmez; `git add -A` öncesi `git status` kontrol edilir.
- `localhost` adresinde giriş ve yorum denenebilir; bu denemelerde gerçek kullanıcıların verisi değiştirilmez, silinmez.

## 10. "Sıradaki adımı yap" komutu

Site sahibi ve Hocam her seferinde yalnızca şunu yazabilir: **"Sıradaki adımı yap."** Bu durumda:

1. `ILERLEME.md`'yi oku. `[~]` (devam ediyor) bir madde varsa önce onun durumunu sor: PR birleştirildi mi, düzeltme mi
   istendi? Birleştirildiyse `[x]` yap; düzeltme istendiyse aynı PR üzerinde düzeltmeye devam et.
2. `[~]` yoksa, ilk `[ ]` maddeyi al. Başlamadan önce kısa bir Türkçe özet ver: hangi madde, ne yapacaksın, ne kadar
   sürebilir, işin sonunda hangi kararı ya da kontrolü isteyeceksin. Onay gelince başla.
3. Maddeyi ARAYUZ-PLANI.md'deki tanımına ve (varsa) `istekler/` dosyasına göre yap; PR aç. PR açarken aynı PR'da
   `ILERLEME.md`'de maddeyi `[~]` yap ve PR bağlantısını maddenin sonuna yaz.
4. Bitirdiğinde site sahibine sade bir dille söyle: neyi kontrol etmeleri gerektiği (hangi sayfa, telefonda/bilgisayarda),
   hangi kararı vermeleri gerektiği (seçenekler ve önerinle).
5. Karar gerektiren maddelerde karar verilmeden sonraki maddeye geçme; maddeyi `[!]` yap. Verilen kararı
   `ILERLEME.md`'nin "Kararlar günlüğü" bölümüne tarihiyle yaz.
6. **Aynı anda tek madde.** Kendi kendine birden fazla maddeyi art arda yapma; PR'ı kendin birleştirme.
7. Site sahibi sırayı değiştirmek isterse (örn. "önce Ek 9'u yapalım") `ILERLEME.md`'deki sırayı buna göre güncelle.
8. "Neredeyiz?" diye sorulursa `ILERLEME.md`'ye göre tamamlananları, açık olanı ve sıradaki 3 maddeyi özetle.
