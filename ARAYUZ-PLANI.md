# Arayüz yenileme planı

Bu dosya, KampüsCepte arayüzünün sayfa sayfa yenilenmesi için görev tanımlarını içerir.
Ajan, kendisine "ARAYUZ-PLANI.md'deki Adım N'yi yap" dendiğinde **önce `AGENTS.md`'yi, sonra bu dosyada "Her adımda"
bölümünü ve ilgili adımı** okur ve yalnızca o adımı yapar.

Sıra önemlidir: Adım 0 ve 1 bütün sitenin tasarım dilini kurar, sonraki adımlar bu dili kullanır.
Bir adım site sahibi tarafından onaylanıp `main`'e birleştirilmeden sonraki adıma geçilmez.

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
