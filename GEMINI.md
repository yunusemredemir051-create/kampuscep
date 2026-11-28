# GEMINI.md — Gemini için KampüsCepte kuralları

Bu dosya, bu depoda çalışan Gemini (Gemini Code Assist / Gemini CLI) içindir.

## 0. Önce bunu oku

**`AGENTS.md` dosyasının tamamını oku ve uy.** Oradaki kurallar (dokunulmayacak yerler, güvenlik,
tasarım çıtası, `?v=` ve `SURUM` artırma) burada da geçerlidir. Bu dosya yalnızca site sahibinin
Gemini'ye en sık verdiği kısa işlerin tarifini ekler. Çelişki olursa `AGENTS.md` geçerlidir; emin
değilsen dur ve sor.

## 1. Site sahibiyle çalışma şekli

- Site sahibi yazılımcı değil. Kısa ve sade Türkçe konuş, teknik terim kullanırsan bir cümleyle açıkla.
- **Commit atma, push yapma, dal birleştirme.** Yalnızca dosyaları değiştir. Değişiklikleri site sahibi
  kendisi inceler ve VS Code'daki Source Control'den yayına gönderir.
- İşi bitirince şunları söyle: hangi dosyaları değiştirdin (tek satırla neden), sitede nereye bakması
  gerektiği ve yayına gönderirken commit mesajı olarak yazabileceği kısa bir Türkçe cümle.
- İstenmeyen hiçbir şeyi "bu arada düzelteyim" diye değiştirme. Bir istek = yalnızca o değişiklik.
- **Logo, uygulama ikonu (`ikonlar/`, `favicon.svg`), avatarlar ve site sahibinin çizdiği görseller
  asla değiştirilmez.** Site sahibi istemeden yeni ikon/logo üretme.
- Komut çalıştırmadan önce ne yapacağını bir cümleyle söyle ve onay bekle.

## 2. Tarif: "Şu yemek görselini ekle"

Yemek fotoğrafları `yemekfoto.js` ile menüdeki yemek adına bağlanır. Her fotoğrafın **iki kopyası** vardır:

| Dosya | Boyut | Ne için |
|---|---|---|
| `gorseller/yemek/<ad>.webp` | 800 × 800 | Dokununca açılan büyük görsel |
| `gorseller/yemek/k/<ad>.webp` | 200 × 200 | Menü listesindeki küçük görsel |

**Adımlar:**

1. **Hangi yer, hangi yemek?** Yer ya `unievi` (Üniversite Evi) ya `yurt` (KYK yurtları). Site sahibi
   söylemediyse sor. Bu iki yerin fotoğrafları birbirine karışmaz; Üniversite Evi fotoğrafı yurda verilmez.
2. **Dosya adı:** `<yer>-<yemek-adı>` biçiminde, küçük harf, Türkçe karaktersiz, kelimeler arası tire.
   Örnek: Üniversite Evi "Fırında Tavuk" → `unievi-firinda-tavuk`; yurt "Kıymalı Ispanak" → `yurt-kiymali-ispanak`.
   Aynı ad zaten varsa (`gorseller/yemek/` içinde) **üzerine yazma**; site sahibine "bu yemeğin fotoğrafı
   zaten var, değiştireyim mi?" diye sor.
3. **Görseli hazırla:** Site sahibinin verdiği görseli ortadan kare kırp, 800 × 800 ve 200 × 200 olarak
   `webp` (kalite 85) kaydet. Saydam yer varsa beyaz arka plan kullan. Renk, filtre, yazı ekleme.
   Python ile örnek (gerekirse önce `py -m pip install pillow`):
   ```python
   from PIL import Image, ImageOps
   im = Image.open(KAYNAK).convert("RGBA")
   arka = Image.new("RGBA", im.size, "white"); arka.alpha_composite(im); im = arka.convert("RGB")
   ImageOps.fit(im, (800, 800), Image.LANCZOS).save(f"gorseller/yemek/{AD}.webp", "WEBP", quality=85)
   ImageOps.fit(im, (200, 200), Image.LANCZOS).save(f"gorseller/yemek/k/{AD}.webp", "WEBP", quality=85)
   ```
   Kaynak görseli depoya ekleme; yalnızca iki `.webp` dosyası eklenir.
4. **Eşleşmeyi ekle:** `yemekfoto.js` içindeki `const FOTOLAR = { … }` nesnesinde ilgili yerin
   (`"unievi"` ya da `"yurt"`) bloğuna satır ekle. Anahtar **menüde yazdığı gibi, küçük harfle** yemek adıdır:
   ```js
   "fırında tavuk": "unievi-firinda-tavuk",
   ```
   Menüde aynı yemek farklı yazılıyorsa (ör. "tarhana çorbası" / "tarhana çorba") her yazım için ayrı satır
   ekle, hepsi aynı dosyayı göstersin. Menüdeki gerçek yazımı `veri.js`'teki menülerden kontrol et.
   Var olan satırları silme ya da değiştirme.
5. **Katalog:** Yemek `TUM_KATALOG` listesinde yoksa aynı biçimde bir kayıt ekle
   (`ad`, `yer`, `yerAdi`, `rozet` alanları; mevcut kayıtları örnek al).
6. **Önbelleği yenile:** `yemekfoto.js` değiştiği için onu yükleyen **bütün** `.html` dosyalarındaki
   `yemekfoto.js?v=N` numarasını bir artır (hepsi aynı numara olmalı) ve `sw.js` içindeki
   `SURUM` değerini bir artır (`kc-v307` → `kc-v308` gibi). Bunu yapmazsan kullanıcılar yeni fotoğrafı görmez.
7. **Kontrol:** `yemekfoto.js`'de sözdizimi hatası olmadığından emin ol (`node --check yemekfoto.js`
   varsa çalıştır). Sonra site sahibine "Ana sayfada <yer> menüsünde <yemek> fotoğrafına bak" de.

Birden fazla görsel gönderilirse hepsini aynı işte yap, `?v=` ve `SURUM`'u yalnızca bir kez artır.

## 3. Diğer sık işler

- **Başka bir değişiklik** (metin, menü, not, sayfa düzeni): `AGENTS.md`'deki dosya haritasından doğru
  dosyayı bul, `istekler/` klasöründe ilgili istek dosyası varsa önce onu oku. CSS/JS dosyası değiştiyse
  6. adımdaki `?v=` ve `SURUM` kuralını o dosya için uygula.
- **Büyük işler** (sayfa tasarımı, yeni özellik, Firebase, güvenlik): bunları tek mesajla doğrudan
  yapma. Önce ne yapacağını ve hangi dosyalara dokunacağını anlat, onay al.
