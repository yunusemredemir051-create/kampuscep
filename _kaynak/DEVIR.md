# KampüsCepte — devir notu (21 Ekim 2026)

Yeni bir sohbette Claude'a bu dosyayı ver ya da "kampuscep reposundaki _kaynak/DEVIR.md'yi oku" de.

## Genel
- Site: https://kampuscepte.com.tr — GitHub Pages, repo `yunusemredemir051-create/kampuscep` (dal: main). `_` ile başlayan klasörler yayına çıkmaz.
- Elazığ öğrencileri için: yurt + Üniversite Evi menüleri, YBS ders notları/testler, akademik takvim, yol arkadaşı, araçlar.
- Alan adı Natro'da (DNS: 4 A kaydı GitHub, CNAME www, MX ImprovMX). E-posta: iletisim@kampuscepte.com.tr → yunusemredemir051@gmail.com (ImprovMX).
- Sponsorluk iletişimi: WhatsApp 0543 781 38 95.

## Önemli dosyalar
- `veri.js` — yurtlar, yurt menüleri (tarihli), Üniversite Evi menüsü (otomatik), YBS dersleri, akademik takvim.
- `index.html` — ana sayfa (tek sayfa, sekmeler: ana/yurtlar/notlar/takvim/araclar).
- `_kaynak/yurt_sablon.html` + `_kaynak/yurt_sayfalari.py` → `/<yurt-id>/` sayfaları üretir. Şablonu değiştirince: `python3 _kaynak/yurt_sayfalari.py && python3 _kaynak/pwa_ekle.py`.
- `_kaynak/pwa_ekle.py` — tüm sayfaların `<head>`ine manifest, AdSense, Google Analytics (G-EN48D4XWNB), güvenli alan stili, `ozelgun.js` ekler.
- `sw.js` — service worker; büyük değişiklikte `SURUM` artır (şu an kc-v16). Script değişince sayfalardaki `?v=` numarasını artır.
- `yemekfoto.js` — menüdeki yemeklerin gerçek fotoğrafları. `FOTOLAR` tablosu: `unievi`, `yurt` (tüm KYK yurtları ortak), tarihe özel `unievi_2026-10-21` gibi. Görseller `gorseller/yemek/<ad>.webp` + küçükleri `gorseller/yemek/k/<ad>.webp` (160px kare kırpım). `YANINDA`: ekmek, su (unievi: su-unievi, yurt: su-yurt).
- `yorum.js` — menülere beğeni/beğenmeme + yorum/yanıt. Hesapsız: ad yazılır, Firebase anonim oturum.
- `vitrin.js` — sponsorlu alanlar (`.vitrin` kutuları). `CADDE_KATIK_AKTIF=false` → "Bu alana reklam verebilirsiniz" kartı. Cadde Katık görselleri `gorseller/vitrin/`.
- `ozelgun.js` — özel gün temaları (21 görsel `gorseller/ozel/`), Ramazan modu (iftar/imsak sayacı, imsakiye), önizleme: herhangi bir sayfaya `?tarih=2027-02-20`. Hicri tarihler (kandil, Ramazan, bayramlar) her yıl elle güncellenir; Mevlid 2027 tarihi yaklaşık.
- `vakitler.json` — Elazığ namaz vakitleri (Diyanet), `.github/workflows/vakit.yml` her gün günceller.
- `.github/workflows/unievi.yml` + `_kaynak/unievi_guncelle.py` — Üniversite Evi menüsünü her sabah unievi.firat.edu.tr'den çeker.
- `.github/workflows/android.yml` — Android uygulaması derlemesi (çıktılar `derleme` dalına).
- `_kaynak/firestore.rules` — Firestore kuralları (Firebase konsolunda yayınlı olanla aynı tutulmalı).

## Firebase (proje kampuscepte-2b0a1)
- Giriş: Google (yol arkadaşı için zorunlu) + Anonim (yorumlar için).
- Koleksiyonlar: `kullanicilar`, `yolculuklar` (+ `iletisim`), `menuler/{yer_tarih_ogun}/oylar|yorumlar`, `sikayetler`.
- Uygunsuz yorum silmek için: Firestore → menuler.

## Öğün saatleri (sitede gösteriliyor)
- Yurt kahvaltı 06.30–12.00 (hafta sonu 12.30), akşam 16.00–22.00. Kahvaltı saati bitince akşam yemeği öne gelir.
- Üniversite Evi 11.00–13.30 ve 15.00–16.30 (kullanıcıya teyit ettirilecek: 11.00–12.30 mu?).

## Günlük yemek fotoğrafı akışı
1. Kullanıcı yemekhanede gerçek fotoğrafları çeker, gönderir.
2. Claude her yemek için ayrı ChatGPT prompt'u yazar: "Use the attached photo as the exact reference… high-end studio food photograph… same plate/steel compartment… keep real portion… plain pure white background… 1:1 1024".
3. Kullanıcı ChatGPT'de çizdirip görselleri gönderir.
4. Claude: 640px büyük + 160px kare küçük webp kaydeder, `yemekfoto.js` FOTOLAR'a ekler, `?v=` artırır, yayınlar.
- Şu an fotoğrafı olanlar: Unievi (rosto köfte, makarna, domates çorbası, 21 Ekim tatlı=baklava), Yurt (mercimek/sebze çorbası, fırında sebzeli tavuk ızgara, etli dolma, mevsim türlü, soslu makarna, karışık salata), ekmek, iki su.

## Kullanıcının çalışma tercihleri
- Yeni görsel/özellikleri önce yalnızca kendisinin görebileceği önizleme linkiyle görmek ister, onaylayınca herkese açılır.
- ChatGPT prompt'ları kopyalanabilir kod bloğu olarak, Türkçe açıklamayla.
- Sade, abartısız tasarım; mobil öncelikli.

## Açık işler
- Sponsorluk: tek sayfalık sunum + sponsor kartına tıklama sayacı (henüz yapılmadı). Fiyat önerisi: başlangıçta aylık 750–1.500 TL, rakamlar oturunca artır.
- AdSense: saitdemir hesabı cihaz doğrulama limitine takıldı; ya tekrar denenecek ya da kullanıcı adına yeni hesap (o zaman pub ID `pwa_ekle.py` ve `ads.txt`'de değişir).
- Google Play: AAB 1.0.5 imzalı ve hazır; Play Console'da uygulama oluşturma, kapalı test (12 test kullanıcısı, 14 gün), sonra Play App Signing SHA-1'ini Firebase Android uygulamasına ekleme.
- Ders notları: sadece 4 ders var (1: Bilişim Sistemleri, Veri Tabanına Giriş; 2: İstatistik, Finansal Yönetim). Diğerleri "Yakında".
- Diğer yurtların menüleri (şimdilik Ahmet Kabaklı menüsü var; KYK menüsünün ortak olduğu varsayılıyor).
