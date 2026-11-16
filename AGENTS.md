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
| `yorum.js`, `skor.js` | Yorumlar, menü puanları ve beğeniler (Firestore) |
| `ayarlar.js`, `program.js`, `vize.js` | Ayarlar (bölüm/sınıf), ders ve vize programı |
| `ses.js`, `bildirim.js`, `duyuru.js` | Ses efektleri, bildirimler, duyurular |
| `sw.js` | Service worker (önbellek). `SURUM` sabiti var |
| `gorseller/`, `ikonlar/`, `favicon.svg` | Logo, ikon, avatar, yemek fotoğrafları |
| `.github/` | Otomatik menü/vakit güncelleme ve Android derleme iş akışları |

## 4. Dokunulmayacak yerler

Arayüz işinde aşağıdakiler **değiştirilmez**. Gerekirse PR'da gerekçesiyle sor.

- `firebase-ayar.js`, Firebase/App Check başlatma kodu, Firestore koleksiyon ve alan adları, giriş akışı.
- `veri.js` içindeki verinin **biçimi** (alan adları, yapı). Görünüm değişir, veri yapısı değişmez.
- URL'ler ve dosya yolları (yurt sayfaları, `ders.html?d=…`, `/sponsor`, `/reklam`, ünite sayfaları). WhatsApp gruplarında ve Google'da bu linkler var.
- **Logo, uygulama ikonu (`ikonlar/`, `favicon.svg`), avatarlar ve `gorseller/` içindeki çizim/görseller.** Bunları site sahibi
  kendisi çiziyor. Yenisini çizme, rengini/biçimini değiştirme.
  - **İstisna:** Arayüzdeki küçük çizgi ikonlar (menü, ayarlar listesi, düğmeler, sekmeler içindeki satır içi `<svg>` ikonlar)
    yeniden tasarlanabilir. Bunlar tek bir tutarlı set olarak elle yazılmış SVG olur (aynı çizgi kalınlığı, aynı ızgara, `currentColor`).
    İkon kütüphanesi (Font Awesome vb.) ve emoji kullanılmaz.
- **Yemek fotoğrafları:** `gorseller/yemek/` içindeki dosyalar ve `yemekfoto.js`'deki yemek adı → fotoğraf eşleşmeleri.
  Fotoğraf silinmez, yeniden adlandırılmaz, sıkıştırılmaz, kırpılmaz, üzerine filtre uygulanmaz. Görünüm değişebilir
  (boyut, oran, yerleşim) ama dosyaların kendisi ve eşleşmeler aynen kalır. Menü verisi değişince eşleşme bozulmamalı.
- JavaScript'in kullandığı `id` ve `class` adları. HTML yapısını değiştirmeden önce adı tüm `.js` dosyalarında ara (`grep -rn`).
- `.reklam` kutuları (AdSense alanları) ve `ads.txt`.
- `.github/workflows/`, `_uygulama/`, `CNAME`, `robots.txt`, `sitemap.xml`.
- Çalışan hiçbir özellik kaldırılmaz ya da gizlenmez.
- Yapay zekâ asistanı (Ek 5) **yalnızca yönetici panelinde** bulunur. Herkese açık sayfalarda, Android uygulamasında
  ya da sitemap'te ona giden hiçbir giriş noktası olmaz; site sahibi açıkça istemeden kamuya açılmaz.

## 5. İçerik kuralları

- Örnek/placeholder olarak site sahibinin adı kullanılmaz. Gerçekçi ama kurgusal içerik kullan.
- Çıkmış sorularda üniversite adı geçmez.
- Anlaşması olmayan işletme sponsorlar arasında gösterilmez.
- Arayüz metinleri Türkçe, sade ve öğrenci diline yakın. "Hoş geldiniz!", "Keşfedin", "Yolculuğunuz başlasın" gibi kalıp pazarlama cümleleri yok.

## 6. Tasarım çıtası — "yapay zekâ şablonu gibi durmasın"

Site sahibi iki tasarım turunu "hâlâ yapay zekâ yapmış gibi duruyor" diyerek reddetti. Hedef: profesyonel bir ürün ekibinin
elinden çıkmış gibi duran, kendine ait karakteri olan, sayfa düzeni güçlü bir site.
derslig.com bir referanstır, kopyalanacak bir şablon değil; ondan daha iyi bir düzen önerilebilir.
Masaüstü ve mobil düzen farklı olabilir; mobil bir uygulama gibi, masaüstü bir web sitesi gibi hissettirmeli.
Sayfa sayfa yenileme planı ve her adımın görev tanımı: `ARAYUZ-PLANI.md`.

**Yapma:**
- Arka planda bulanık renk lekeleri / radial gradient "ışık" efektleri, mor-mavi geçişli gradient düğmeler ve başlıklar.
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

## 7. Teknik kurallar

- `kc.css`, `ana.css` ya da başka bir CSS/JS dosyası değişince o dosyayı yükleyen **bütün sayfalardaki** `?v=` numarasını artır
  ve `sw.js` içindeki `SURUM` değerini bir artır. Yoksa kullanıcılar eski dosyayı görmeye devam eder.
- Web'e özel düzen `masaustu.css`'e (`html.web …`), uygulamaya özel düzen `uygulama.css`'e (`html.uyg …`).
- Konsolda hata bırakma. Değişiklikten sonra ana sayfa, ders sayfası, bir yurt sayfası, Yol Arkadaşı ve mağaza sayfasını açıp dene.
- Yerelde denemek için kök dizinde `python3 -m http.server 8000` yeterli.
- Kod yorumları ve commit mesajları Türkçe.
