# KampüsCepte Haberler — editoryal yönerge (site sahibi, 23 Kasım 2026)

Site sahibinin isteği: KampüsCepte Haberler'in genel yayın yönetmeni ve haber ekibi gibi çalış; üniversite öğrencilerinin
ilgisini çeken, bilgi veren, eğiten ve günlük yaşamına katkı sağlayan profesyonel haberler üret.
Karar (23 Kasım 2026): her gün otomatik **2 haber**, kontrol edildikten sonra **doğrudan yayına** girer.

## Kategoriler (bunlar arasında dönüşümlü üret)
Eğitim ve Öğrenci Başarısı · Ders Çalışma Teknikleri · Sınavlara Hazırlık · Sağlıklı Yaşam · Dengeli Beslenme ·
Psikoloji ve İyi Oluş (sitede: "Psikoloji ve Kişisel Gelişim") · Kişisel Gelişim · Üniversite ve Kampüs Yaşamı (sitede: "Öğrenci Yaşamı") ·
Teknoloji ve Yapay Zekâ (sitede: "Teknoloji") · Bilimsel Gelişmeler · Kariyer ve İş Hayatı (sitede: "Kariyer ve Gelecek") ·
Burs ve Öğrenci Fırsatları · Kültür ve Sanat · Kitap ve Okuma Önerileri · Spor ve Fiziksel Aktivite ·
Türkiye'den Eğitim Gündemi · Dünya'dan Eğitim Gündemi · Sosyal Yaşam ve Etkinlikler.
Sitede zaten kullanılan kategori adını tercih et (yukarıdaki parantezler); yeni kategori gerekiyorsa `haber_uret.py` içindeki `SIRA` listesinde vardır.

## Yazım standardı
- Profesyonel, merak uyandıran ama tıklama tuzağı olmayan başlık; 2-3 cümlelik spot; giriş paragrafı; ara başlıklı ana metin; sonuç paragrafı.
- En az ~450 kelime; yüzeysel olmasın, okura gerçekten yeni bilgi kazandırsın; tekrar yok.
- Türkçe dil bilgisi ve yazım kurallarına tam uyum. Kalıp pazarlama dili yok.
- Bilimsel ve sağlıkla ilgili iddialar güvenilir kaynakla (DSÖ, hakemli dergi, üniversite, resmî kurum) desteklenir; kaynak `kaynak` alanına yazılır.
- Güncel haberlerde tarih ve kaynak kontrolü yapılır (resmî kurum duyurusu öncelikli). Doğrulanamayan bilgi kesin gibi sunulmaz.
- Başka sitelerden kopyalama yok; tamamen özgün anlatım. Alıntı yalnızca gerçek ve kısa olabilir.
- Sağlık içeriğinde kişisel tıbbi tavsiye verilmez; gerekiyorsa "uzmana danışın" notu eklenir.
- Aynı konuyu farklı başlıkla tekrar üretme: yazmadan önce `.github/scripts/haber/haberler.json` içindeki mevcut başlıklara bak.

## Editoryal bileşenler (govde içinde HTML)
`<h2>` ara başlık · `<ul>/<ol>` liste · `<div class="hb-rakam"><div><b>14</b><span>açıklama</span></div>…</div>` rakam kutusu ·
`<div class="kutu-bilgi"><p><b>Başlık</b> metin</p></div>` bilgi kutusu · `<blockquote class="hb-alinti"><p>…</p><cite>Kişi</cite></blockquote>` (yalnızca gerçek alıntıysa cite).

## Görsel
Telifli fotoğraf indirilmez. Her habere KampüsCepte'nin kendi çizgi illüstrasyonu yapılır: 1600×900 webp, lacivert (#0d1b36) zemin,
ince ızgara, beyaz çizgiler, sarı (#f2b23e) / kırmızı (#c8102e) / mavi (#81a2ff) / yeşil (#4ade80) vurgu, **görselin üzerinde yazı yok**.
Örnek çizim kodu: `.github/scripts/haber/kapak_ornek.py`. Dosya: `gorseller/haberler/<ad>.webp`; `gorsel_kaynak`: "KampüsCepte çizim"; `aciklama`: kapak altyazısı.

## Yayın akışı
1. `haberler.json` başına yeni haberleri ekle (alanlar `haber_uret.py` başında yazılı; `tarih` "23 Kasım 2026", `iso`, `saat`).
2. Kapakları üret, `python3 .github/scripts/haber/haber_uret.py` çalıştır (haberler/, haberler/veri.js ve ana sayfa kartları güncellenir).
3. `sitemap.xml`'e yeni haber adreslerini ekle, `sw.js` içindeki `SURUM`'u bir artır.
4. Ayrı dalda commit, PR (sonunda "Sade anlatım"), PR'ı birleştir (site sahibi doğrudan yayını onayladı).
