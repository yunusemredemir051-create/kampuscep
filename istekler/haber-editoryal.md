# KampüsCepte Haberler — editoryal yönerge

Bu dosya haber üreten her ajanın uyacağı kurallardır. Site sahibinin istek metinleri: `istekler/haberler.md` (23 Kasım 2026,
tasarım), `istekler/haber-platformu.md` (27 Kasım 2026, Türkiye haber platformuna dönüşüm). Çelişkide en yeni karar geçerlidir.

**27 Kasım 2026 kararı:** KampüsCepte Haberler yalnızca kampüs haberleri yayımlayan bir pano değildir. Memurlar.net gibi Türkiye ve dünya
gündemini, kamu, eğitim, ekonomi, teknoloji, sağlık, spor ve yaşam haberlerini birlikte sunan bir haber platformudur. Öğrenciler,
memurlar, kamu personeli adayları ve vatandaşların günlük hayatını doğrudan etkileyen haberler önceliklidir.

## Yayın ritmi
- Günde **3 tur**: sabah, öğle ve akşam. Her turda **2 haber**, kontrol edildikten sonra **doğrudan yayına** girer (site sahibinin 23 Kasım onayı).
- Bir turda iki haber **farklı kategoride** olur. Gün içinde mümkün olduğunca çok kategoriye yayılır; tek kategori günde 3 haberi geçmez.
- O turda yayımlanacak kadar güncel ve doğrulanmış konu yoksa eksik haberle tur kapatılır. **Haber uydurulmaz, doldurmak için zayıf haber yazılmaz.**

## Kategoriler (yalnızca bunlar; `haber_uret.py` başka kategoriyi reddeder)
| Kategori | Kapsam |
|---|---|
| Türkiye Gündemi | Ülke gündemi, Resmî Gazete kararları, yasalar, afetler, kamuoyunu ilgilendiren olaylar, siyasi gelişmeler (tarafsız) |
| Memur ve Kamu | Memur maaşı ve zamları, toplu sözleşme, atama, tayin, görevde yükselme, kamu personel alımı, KPSS tercih/atama, sözleşmeli personel, kurum duyuruları |
| Eğitim | YKS/TYT/AYT, ÖSYM sınavları (ALES, YDS, KPSS, AGS…), MEB, YÖK, öğretmen atamaları, KYK burs/kredi ve yurt, harç, burslar |
| Ekonomi | Altın, döviz, enflasyon (TÜİK), faiz (TCMB), asgari ücret, emekli maaşları, vergiler ve ekonomik kararlar |
| Teknoloji | Yapay zekâ, bilim, yeni teknolojiler, dijital dünya, siber güvenlik |
| Sağlık | Sağlık sistemi, Sağlık Bakanlığı kararları, bilimsel araştırmalar, sağlıklı yaşam (kişisel tıbbi tavsiye yok) |
| Dünya | Uluslararası gelişmeler |
| Spor | Futbol, basketbol, voleybol ve diğer branşlar |
| Yaşam | Günlük hayat, sosyal yaşam, kültür-sanat, resmî tatiller, ulaşım, hava ve mevsimsel gelişmeler |
| Üniversite ve Kampüs | Üniversitelerden (öncelik Fırat Üniversitesi ve Elazığ) haberler, öğrenci etkinlikleri, akademik gelişmeler, öğrenci işleri rehberleri |

## Konu seçimi: önem ve arama talebi
Öncelik sırası:
1. **Bugün açıklanan resmî karar ya da duyuru** (Resmî Gazete, ÖSYM, MEB, YÖK, KYK, bakanlıklar, TÜİK, TCMB, SGK, Devlet Personel Başkanlığı).
2. Milyonları etkileyen gündem: maaş ve zam, asgari ücret, enflasyon, sınav sonuçları, atamalar, afet ve önemli olaylar.
3. Çok aranan "ne zaman, kaç TL, nasıl başvurulur" soruları (bkz. "Aranan haberler ve Google'da üst sıra").
4. Kalıcı (evergreen) rehber içerik yalnızca o tur için güncel ve doğrulanmış haber yoksa.

Gündem takibi için bakılacak yerler: Memurlar.net, Anadolu Ajansı, TRT Haber, BBC Türkçe, NTV, CNN Türk, Habertürk, Dünya Gazetesi,
Ekonomim; resmî kurumların duyuru sayfaları ve Resmî Gazete.

**Tekrar ve bayatlık yasağı:** Yazmadan önce `.github/scripts/haber/haberler.json` içindeki son 60 haberin başlık ve slug'larına bak.
Aynı bilgi farklı başlıkla tekrar yazılmaz. Aynı konunun **yeni gelişmesi** (takvim → kılavuz → sonuç; iddia → resmî açıklama) yeni haber
olabilir; metin önceki habere bağlantı verir. 48 saatten eski bir gelişme "yeni" gibi sunulmaz; ancak hâlâ geçerli bir takvim ya da
rehber olarak yazılabilir ve metinde ne zaman açıklandığı açıkça söylenir.

## Kaynak ve doğrulama (zorunlu)
- **Haber siteleri konu bulmak ve gelişmeyi takip etmek içindir.** Metin, cümle, başlık, tablo, fotoğraf kopyalanmaz; haber tamamen özgün Türkçe ile yazılır.
- Her bilgi mümkünse **birincil resmî kaynaktan** doğrulanır (kurumun kendi duyurusu, kılavuz/takvim PDF'i, Resmî Gazete, TÜİK/TCMB bülteni).
  Resmî kaynak olmayan gelişmelerde (spor, dünya, olaylar) **en az iki bağımsız güvenilir haber kuruluşu** (AA, TRT Haber, BBC Türkçe, Reuters vb.) aynı bilgiyi vermelidir.
- `kaynaklar` alanına okuyucunun tıklayabileceği **gerçek bağlantılar** yazılır (önce resmî kaynak, sonra ajans). Ajanın bizzat açıp okuyamadığı ya da
  bir arama sonucunda gördüğü adres kaynak olarak yazılmaz. `kaynak` alanına aynı bilgi düz metin olarak da yazılır.
- Doğrulanamayan haber **yayımlanmaz**. Tarih, rakam, istatistik, alıntı ve kaynak **asla uydurulmaz**; emin olunmayan rakam metne girmez.
- **Resmî açıklama ile kulis ayrılır:** Kesinleşmemiş bilgi, iddia, "bekleniyor", "kulislere göre" içeren haberlerde `"kesinlesmemis": true`
  yazılır (metnin başında uyarı kutusu çıkar); metinde hangi bilginin resmî, hangisinin iddia olduğu cümle cümle belirtilir.
  Başlıkta iddia kesin bilgi gibi yazılmaz ("… iddiası", "… bekleniyor").
- Alıntı yalnızca gerçek, kısa ve kaynağı belli olabilir (`hb-alinti` + `cite`).

## Siyaset ve hassas konular
- Siyasi haberler yer alabilir; dil **tarafsız ve yorumsuzdur**. Taraflar aynı ağırlıkta ve kendi açıklamalarıyla verilir; KampüsCepte'nin görüşü yazılmaz.
- Yargılanan kişiler hakkında masumiyet karinesine uyulur; suç isnadı kesin hüküm gibi yazılmaz. Mağdurların, çocukların kimliği verilmez.
- Afet ve olaylarda yalnızca AFAD, valilik, bakanlık gibi resmî kaynakların doğruladığı can kaybı ve rakamlar yazılır.
- Sağlık içeriğinde kişisel tıbbi tavsiye verilmez; gerekiyorsa "uzmana danışın" notu eklenir.
- Ekonomi haberlerinde yatırım tavsiyesi verilmez; altın/döviz fiyatı yazılıyorsa saatiyle ve kaynağıyla verilir.

## Haber alanları (`haber_uret.py` başında da yazılı)
`slug, baslik, tarih ("27 Kasım 2026"), iso, saat (gerçek yayın saati, "08.15"), kategori, gorsel, w, h, alt, aciklama, gorsel_kaynak, ozet, govde, kaynak, kaynaklar`
ve isteğe bağlı:
- `son_dakika: true`: yalnızca **o gün resmî olarak açıklanan ve çok kişiyi doğrudan etkileyen** gelişmeler (sınav sonucu açıklandı, maaş zammı belli oldu,
  Resmî Gazete'de yayımlandı, büyük afet). Etiket yayından sonraki 24 saat görünür, sonra kendiliğinden kalkar. Günde en fazla 2 haber.
- `one_cikan: true`: manşet ve öne çıkanlarda önceliklidir. Günün en önemli 1-2 haberi.
- `kesinlesmemis: true`: kulis, iddia ya da beklenti içeren haber.

## Yazım standardı
- Profesyonel, merak uyandıran ama tıklama tuzağı olmayan başlık; ilk paragrafta 5N1K; ara başlıklı ana metin; sonuç.
- En az ~450 kelime (son dakika haberinde en az ~300 kelime olabilir, sonra güncellenir); yüzeysel olmasın, okura yeni bilgi kazandırsın.
- Türkçe dil bilgisi ve yazım kurallarına tam uyum. Kalıp pazarlama dili yok.
- Editoryal bileşenler (`govde` içinde HTML): `<h2>` ara başlık · `<ul>/<ol>` · `<div class="hb-rakam"><div><b>14</b><span>açıklama</span></div>…</div>` ·
  `<div class="kutu-bilgi"><p><b>Başlık</b> metin</p></div>` · `<blockquote class="hb-alinti"><p>…</p><cite>Kişi</cite></blockquote>`.

## Görsel (karışık sistem, 27 Kasım 2026)
Vektörel/çizgi illüstrasyon kapak kullanılmaz. Kapaklar gerçek fotoğraf gibi duran, editoryal tarzda **temsilî** görsellerdir. Telifli fotoğraf indirilmez;
gerçek kişi, sporcu, siyasetçi, takım forması/logosu, kurum amblemi çizdirilmez.
- **Özel görsel:** `one_cikan` ya da `son_dakika` olan haberlere Figma'daki "KampüsCepte Haber Kapakları" dosyasında (`fileKey: HtTsTpY6N4grSXDk9JzFQS`)
  `generate_image` ile özel görsel üretilir (haber başına 1, beğenilmezse en fazla 1 yeniden deneme).
- **Havuz görseli:** Diğer haberler `.github/scripts/haber/kapak_havuzu.json`'daki kendi kategorisinin havuzundan, **en uzun süredir kullanılmayan** görseli alır;
  kullanınca o görselin `son_kullanim` tarihini günceller. Aynı görsel art arda iki haberde kullanılmaz.
  Kategorinin havuzunda 3'ten az görsel varsa havuz için yeni bir **genel** kategori görseli üretilir (turda en fazla 1 havuz görseli) ve havuza eklenir.
- Prompt: "Realistic editorial news photograph, landscape 16:9 …"; konuya bağlı sahne (Türkiye'den), doğal ışık, sığ alan derinliği, soluk doğal renkler,
  lacivert ve sıcak sarı küçük vurgular, solda başlık için sakin alan. **Okunabilir yazı/rakam, logo, marka, kurum amblemi, tanınabilir yüz yok.**
  Havuz görselleri haberin ayrıntısına değil kategorinin genel temasına göre yazılır (Ekonomi: çarşıda kuyumcu vitrini, market sepeti; Memur ve Kamu:
  kamu binası koridoru, dosyalar; Spor: boş stadyum tribünü, top; Dünya: dünya haritası, havalimanı…).
- Tam boy dosya `get_screenshot` (`enableBase64Response: true`, `maxDimension: 1600`) ile alınır, 1600×900 webp'ye çevrilir (quality 86).
  Özel görsel: `gorseller/haberler/<slug>-foto.webp`; havuz görseli: `gorseller/haberler/havuz/<kategori-kodu>-<n>.webp`.
- Görsel açılıp kontrol edilir: yazı, bozuk el/yüz, ilgisiz nesne varsa kullanılmaz.
- `gorsel_kaynak`: "Temsilî görsel"; `alt`: görselde ne olduğu; `aciklama`: kapak altyazısı (haberin özünü söyler).
- Figma'ya erişilemezse özel görsel gereken haber havuzdan görselle yayımlanır; havuz da boşsa haber yayımlanmaz ve site sahibine bildirilir.
- Kullanılan promptlar PR açıklamasına ve site sahibine giden bildirime yazılır.

## Yayın akışı
1. `haberler.json` başına yeni haberleri ekle (yeni olan en üstte).
2. Kapakları hazırla (Görsel bölümü), `python3 .github/scripts/haber/haber_uret.py` çalıştır.
3. `sitemap.xml`'e yeni haber adreslerini ekle, `/haberler/` lastmod'unu güncelle, `sw.js` içindeki `SURUM`'u bir artır.
4. Yerel sunucuda (`python3 -m http.server`) yeni sayfaları ve haberler ana sayfasını aç; hata yoksa ayrı dalda commit, PR (sonunda "Sade anlatım"), PR'ı birleştir.

## Aranan haberler ve Google'da üst sıra (site sahibi, 24 Kasım 2026)
- **Başlık:** insanların arama kutusuna yazdığı ifadeyle başlar, yıl ve kurum adını içerir, yaklaşık 55-70 karakter.
  Örnek: "2027 ALES başvuru tarihleri: Başvurular 24 Şubat'ta başlıyor". Tıklama tuzağı yok, iddia başlıkta doğru olmalı.
- **Slug:** kısa, anahtar kelimeli, Türkçe karaktersiz (`2027-ales-basvuru-tarihleri`). Yayımlanan haberin slug'ı değişmez.
- **Özet (`ozet`, sayfa açıklaması olur):** 140-160 karakter civarı; aranan sorunun cevabı ilk cümlede (tarih, tutar, saat).
- **İlk paragraf:** cevabı hemen verir (kim, ne, ne zaman, nerede); arka plan sonra gelir.
- **Ara başlıklar soru biçiminde** olabilir: "Zam oranı ne kadar?", "Sonuçlar ne zaman açıklanacak?"
- Tarih ve tutarlar liste ya da `hb-rakam` ile verilir; sonda kısa bir **"Sık sorulan sorular"** bölümü (`<h2>` + 3-4 kısa soru-cevap) olabilir.
- Metin içinde 1-2 site içi bağlantı: ilgili KampüsCepte haberi, akademik takvim ya da ders sayfası.
- Anahtar kelime doldurma yok; doğal, akıcı Türkçe. Yalnızca arama için üretilmiş, okura yeni bilgi vermeyen içerik yayımlanmaz.
- Hız önemli: resmî duyuru o gün çıktıysa haber aynı gün yayımlanır; `saat` gerçek yayın saatidir.
