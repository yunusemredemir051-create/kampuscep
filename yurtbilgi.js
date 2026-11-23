/* Yurt bilgileri: adres, telefon, ulaşım. veri.js'teki yurt id'leriyle eşleşir.
   Adres ve telefon kaynağı: Fırat Üniversitesi Öğrenci İşleri 2025 kayıt duyurusu (KYK yurt listesi).
   Otogar / havalimanı mesafeleri karayoluyla yaklaşıktır. */
const yurtBilgi = {
  "ahmet-kabakli": {
    tamAd: "Ahmet Kabaklı KYK Erkek Öğrenci Yurdu",
    adres: "Çaydaçıra Mahallesi, Anguzu Baba Sokak No: 50-50/1, Merkez / Elazığ",
    tel: "",
    otogar: "8", havalimani: "19,3",
    bolge: "Çaydaçıra (Şahinkaya tarafı)",
    aciklama: "Elazığ'daki üç KYK erkek yurdundan biri. Çaydaçıra Mahallesi'nde, İzzetpaşa Kız Yurdu ile aynı bölgede bulunur. Elazığ'daki KYK yurtları arasında otogara en uzak olanıdır; şehir merkezine ve kampüse genellikle toplu taşımayla gidilir."
  },
  "firat": {
    tamAd: "Elazığ-Fırat KYK Erkek Öğrenci Yurdu",
    adres: "Kültür Mahallesi, Çavuldur Sokak No: 6, Merkez / Elazığ",
    tel: "0424 234 07 52",
    otogar: "6", havalimani: "17,2",
    bolge: "Kültür Mahallesi",
    aciklama: "Kültür Mahallesi'ndeki KYK erkek yurdu. Elazığ'daki üç KYK erkek yurdundan biridir."
  },
  "omer-bilginoglu": {
    tamAd: "Ömer Bilginoğlu KYK Erkek Öğrenci Yurdu",
    adres: "Ataşehir Mahallesi, Mazı Sokak No: 4, Merkez / Elazığ",
    tel: "0424 247 68 91",
    otogar: "5,9", havalimani: "17,1",
    bolge: "Ataşehir",
    aciklama: "Ataşehir Mahallesi'ndeki KYK erkek yurdu. Fethi Sekin Kız Yurdu ile aynı mahallededir."
  },
  "fethi-sekin": {
    tamAd: "Fethi Sekin KYK Kız Öğrenci Yurdu",
    adres: "Ataşehir Mahallesi, Kibar Sokak No: 48, Merkez / Elazığ",
    tel: "0424 247 84 77",
    otogar: "5,4", havalimani: "16,6",
    bolge: "Ataşehir",
    aciklama: "Ataşehir Mahallesi'ndeki KYK kız yurdu. Elazığ'daki KYK yurtları arasında otogara en yakın olanıdır."
  },
  "harput": {
    tamAd: "Harput KYK Kız Öğrenci Yurdu",
    adres: "Üniversite Mahallesi, Zübeyde Hanım Caddesi No: 131/1, Merkez / Elazığ",
    tel: "0424 247 00 18",
    otogar: "6,3", havalimani: "16,7",
    bolge: "Üniversite Mahallesi",
    aciklama: "Üniversite Mahallesi'nde, Zübeyde Hanım Caddesi üzerindeki KYK kız yurdu. Fırat Üniversitesi yerleşkesine yakındır."
  },
  "izzetpasa": {
    tamAd: "İzzetpaşa KYK Kız Öğrenci Yurdu",
    adres: "Çaydaçıra Mahallesi, Şahinkaya Küme Evleri No: 2/1, Merkez / Elazığ",
    tel: "0424 502 04 55",
    otogar: "6,9", havalimani: "18,2",
    bolge: "Çaydaçıra (Şahinkaya)",
    aciklama: "Çaydaçıra Mahallesi'nin Şahinkaya bölgesindeki KYK kız yurdu; Ahmet Kabaklı Erkek Yurdu ile aynı bölgededir."
  },
  "sare-ana": {
    tamAd: "Sare Ana KYK Kız Öğrenci Yurdu",
    adres: "Üniversite Mahallesi, Zübeyde Hanım Caddesi, Fırat Üniversitesi Girişi No: 262/1, Merkez / Elazığ",
    tel: "0424 241 12 00",
    otogar: "6,1", havalimani: "16,6",
    bolge: "Fırat Üniversitesi girişi",
    aciklama: "Fırat Üniversitesi'nin girişinde, Zübeyde Hanım Caddesi üzerinde bulunan KYK kız yurdu. Kampüse en yakın yurtlardan biridir."
  }
};
function yurtHaritaLinki(id) {
  const b = yurtBilgi[id];
  return b ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(b.tamAd + ", Elazığ") : "";
}
