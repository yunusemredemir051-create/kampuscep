# KampüsCep

Elazığ'daki üniversite öğrencileri için günlük rehber: yurt ve Üniversite Evi menüleri, ders notları, akademik takvim, sınav ve tatil sayaçları.

## Dosyalar

| Dosya | Ne işe yarar | Ne sıklıkla değişir |
|---|---|---|
| `veri.js` | Menüler, yurtlar, WhatsApp linkleri, dersler, not linkleri, akademik takvim | Sık (her gün / her hafta) |
| `index.html` | Sitenin tasarımı ve çalışma mantığı | Nadiren (yeni özellik, tasarım) |
| `notlar/` | Ders notu PDF'leri (`notlar/ybs/1` … `notlar/ybs/4`) | Not ekledikçe |
| `gizlilik.html`, `hakkimizda.html` | AdSense ve KVKK için gerekli sayfalar | Çok nadir |

## Not ekleme

1. GitHub'da `notlar/ybs/2` gibi ilgili sınıf klasörüne gir.
2. **Add file → Upload files** ile PDF'i yükle. Dosya adında Türkçe karakter ve boşluk kullanma: `istatistik-hafta-3.pdf`
3. **Commit changes**'e bas.
4. `veri.js` dosyasını aç, kalem simgesine bas, dersin `link` kısmına yolu yaz:
   `{ ad: "İstatistik", link: "notlar/ybs/2/istatistik-hafta-3.pdf" },`
5. **Commit changes**. Site 1 dakika içinde güncellenir.

## Ünitelere ayrılmış, testli ders notları

`notlar/ybs/1/bilisim-sistemleri/` klasörü örnek: ünite PDF'leri (filigranlı, ödev ve test kısımları çıkarılmış) ve
`ders.json` (ünite adları, Kendini Test Et soruları ve cevapları). Site bu klasörü
`ders.html?d=ybs/1/bilisim-sistemleri` adresinde gösterir. Yeni bir kitap için aynı yapıda bir klasör
hazırlanır ve `veri.js`'de dersin `link` kısmına bu adres yazılır.

## Menü güncelleme

`veri.js` → kalem simgesi → `yurtMenuleri` ya da `uniEviMenuleri` listesini değiştir → **Commit changes**.

## Bir şey bozulursa

Site boş görünür ya da bir kısmı çalışmazsa büyük ihtimalle `veri.js`'de bir tırnak ya da virgül eksik kalmıştır.
Dosyanın **History** kısmından son çalışan sürümü açıp geri yükleyebilirsin.

## Dikkat

- Tek bir dosya 25 MB'tan büyük olamaz (Cloudflare Pages sınırı). Büyük PDF'leri sıkıştırarak yükle.
- Repo herkese açıksa yüklediğin her dosya da herkese açıktır. Telif hakkı hocaya ait slayt ve kitap sayfalarını izinsiz yükleme.

## Konu özeti sayfaları (Google ve AdSense için)

Her ünitenin okunabilir özet sayfası `notlar/.../unite-N.html` dosyalarıdır. Bunlar elle düzenlenmez; kaynak metinler
`_kaynak/ozetler/` klasöründeki `.md` dosyalarındadır. Özet değiştiğinde ya da yeni ders eklendiğinde:

    python3 _kaynak/sayfa_olustur.py

Bu komut ünite sayfalarını, `dersler.html`, `sitemap.xml` ve `robots.txt` dosyalarını yeniden üretir.
Alan adı alındığında betikteki `SITE_URL` değeri değiştirilip komut yeniden çalıştırılır.
`_kaynak` klasörü alt çizgiyle başladığı için sitede yayımlanmaz.

## Reklam alanları

`.reklam` kutuları AdSense onaylanana kadar CSS ile gizlidir (`display: none`). Onaydan sonra bu satırlar silinip
AdSense kodu kutuların içine yerleştirilir; kök dizine de Google'ın verdiği `ads.txt` dosyası eklenir.
