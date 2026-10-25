/* KampüsCepte — Çok Dilli Destek (i18n)
   Desteklenen diller:
   - tr: Türkçe (Varsayılan)
   - en: English
   - ku: Kurdî (Kurmancî)
   - ar: العربية
*/

(function () {
  const SOZLUK = {
    tr: {
      nav_ana: "Ana sayfa",
      nav_yurtlar: "Yurtlar",
      nav_notlar: "Notlar",
      nav_takvim: "Takvim",
      nav_yol: "Yol arkadaşı",
      nav_yol_kisa: "Yolculuk",
      nav_araclar: "Araçlar",
      nav_ayarlar: "Ayarlar",
      
      afis_alt: "Menü, not, takvim ve yol arkadaşı cebinde.",
      yurt_menusu: "Yurt menüsü",
      yurt_sec_aciklama: "Yurdunu seç, bir dahaki sefere hatırlanır",
      aksam_yemegi: "Akşam yemeği",
      kahvalti: "Sabah kahvaltısı",
      ogle_yemegi: "Öğle yemeği",
      menuyu_goruntule: "Menüyü Gör",
      kalori: "Kalori",
      
      unievi_baslik: "Üniversite Evi",
      unievi_alt: "Fırat Üniversitesi merkez yemekhanesi",
      
      puan_ver: "Puan Ver",
      begendim: "Beğendim",
      begenmedim: "Beğenmedim",
      yorumlar: "Yorumlar",
      yorum_yaz: "Yorum yaz...",
      gonder: "Gönder",
      
      
      ayarlar_baslik: "Ayarlar & Profil",
      ayarlar_alt: "Hesap bilgilerinizi, dilinizi ve tercihlerinizi buradan yönetin",
      profil_bolumu: "Öğrenci Profili",
      profil_ad: "Adınız / Rumuzunuz",
      profil_ad_placeholder: "Örn: Yunus Emre",
      profil_yurt: "Kaldığınız Yurt",
      profil_yurt_sec: "Yurt Seçiniz",
      profil_bolum: "Bölümünüz / Fakülteniz",
      profil_bolum_placeholder: "Örn: Bilgisayar Mühendisliği",
      profil_avatar: "Profil Avatarı",
      profil_kaydet: "Profili Kaydet",
      profil_kaydedildi: "Profil bilgileriniz başarıyla kaydedildi!",
      
      dil_bolumu: "Uygulama Dili",
      dil_sec: "Dil Seçiniz",
      tema_bolumu: "Görünüm Modu",
      tema_acik: "Açık Mod",
      tema_koyu: "Koyu Mod",
      
      araclar_ortalama: "Dönem Sonu Ortalama Hesaplama",
      araclar_vize: "Vize - Final Notu Hesaplama",
      hesapla: "Hesapla",
      temizle: "Temizle",
      ders_ekle: "+ Ders Ekle",
      kredi: "Kredi",
      not: "Not",
      
      kapat: "Kapat",
      iptal: "İptal",
      kaydet: "Kaydet"
    },
    
    en: {
      nav_ana: "Home",
      nav_yurtlar: "Dorms",
      nav_notlar: "Notes",
      nav_takvim: "Calendar",
      nav_yol: "Ride Share",
      nav_yol_kisa: "Ride",
      nav_araclar: "Tools",
      nav_ayarlar: "Settings",
      
      afis_alt: "Dorm menu, lecture notes, academic calendar & ride share in your pocket.",
      yurt_menusu: "Dormitory Menu",
      yurt_sec_aciklama: "Select your dorm, it will be remembered next time",
      aksam_yemegi: "Dinner",
      kahvalti: "Breakfast",
      ogle_yemegi: "Lunch",
      menuyu_goruntule: "View Menu",
      kalori: "Calories",
      
      unievi_baslik: "University Dining",
      unievi_alt: "Fırat University Central Dining Hall",
      
      puan_ver: "Rate",
      begendim: "Like",
      begenmedim: "Dislike",
      yorumlar: "Comments",
      yorum_yaz: "Write a comment...",
      gonder: "Submit",
      
      
      ayarlar_baslik: "Settings & Profile",
      ayarlar_alt: "Manage your student profile, app language, and preferences",
      profil_bolumu: "Student Profile",
      profil_ad: "Your Name / Nickname",
      profil_ad_placeholder: "e.g., Alex Johnson",
      profil_yurt: "Your Dormitory",
      profil_yurt_sec: "Select Dormitory",
      profil_bolum: "Department / Faculty",
      profil_bolum_placeholder: "e.g., Computer Engineering",
      profil_avatar: "Profile Avatar",
      profil_kaydet: "Save Profile",
      profil_kaydedildi: "Profile information saved successfully!",
      
      dil_bolumu: "App Language",
      dil_sec: "Select Language",
      tema_bolumu: "Appearance",
      tema_acik: "Light Mode",
      tema_koyu: "Dark Mode",
      
      araclar_ortalama: "Semester GPA Calculator",
      araclar_vize: "Midterm - Final Grade Calculator",
      hesapla: "Calculate",
      temizle: "Clear",
      ders_ekle: "+ Add Course",
      kredi: "Credits",
      not: "Grade",
      
      kapat: "Close",
      iptal: "Cancel",
      kaydet: "Save"
    },

    ku: {
      nav_ana: "Destpêk",
      nav_yurtlar: "Wargeh",
      nav_notlar: "Nîşe",
      nav_takvim: "Salname",
      nav_yol: "Hevalê Rê",
      nav_yol_kisa: "Rêwîtî",
      nav_araclar: "Amûr",
      nav_ayarlar: "Mîheng",
      
      afis_alt: "Menûya wargehê, nîşeyên dersê, salname û hevalê rê di bêrîka te de.",
      yurt_menusu: "Menûya Wargehê",
      yurt_sec_aciklama: "Wargeha xwe hilbijêre, cara din tê bibîranîn",
      aksam_yemegi: "Şîv",
      kahvalti: "Taştê",
      ogle_yemegi: "Firo",
      menuyu_goruntule: "Menûyê Bibîne",
      kalori: "Kalorî",
      
      unievi_baslik: "Mala Zanîngehê",
      unievi_alt: "Xwarinxaneya navendî ya Zanîngeha Firatê",
      
      puan_ver: "Puan Bide",
      begendim: "Eciband",
      begenmedim: "Neeciband",
      yorumlar: "Şîrove",
      yorum_yaz: "Şîroveyek binivîse...",
      gonder: "Bişîne",
      
      
      ayarlar_baslik: "Mîheng & Profîl",
      ayarlar_alt: "Agahiyên xwe yên xwendekariyê, ziman û tercîhên xwe bi rê ve bibin",
      profil_bolumu: "Profîla Xwendekar",
      profil_ad: "Navê Te / Nasnav",
      profil_ad_placeholder: "Mînak: Azad",
      profil_yurt: "Wargeha ku lê dimînî",
      profil_yurt_sec: "Wargehê Hilbijêre",
      profil_bolum: "Beş / Fakulteya Te",
      profil_bolum_placeholder: "Mînak: Endezyariya Komputerê",
      profil_avatar: "Avatara Profîlê",
      profil_kaydet: "Profîlê Tomar Bike",
      profil_kaydedildi: "Agahiyên profîlê bi serkeftî hatin tomarkirin!",
      
      dil_bolumu: "Zimanê Sepanê",
      dil_sec: "Ziman Hilbijêre",
      tema_bolumu: "Cureyê Dîtinê",
      tema_acik: "Moda Ronî",
      tema_koyu: "Moda Tarî",
      
      araclar_ortalama: "Hesabkirina Navîna Serdemê",
      araclar_vize: "Hesabkirina Nîşeya Vîze - Fînal",
      hesapla: "Hesab Bike",
      temizle: "Paqij Bike",
      ders_ekle: "+ Dersê Zêde Bike",
      kredi: "Kredî",
      not: "Nîşe",
      
      kapat: "Bigire",
      iptal: "Betal bike",
      kaydet: "Tomar bike"
    },

    ar: {
      nav_ana: "الرئيسية",
      nav_yurtlar: "السكن الجامعي",
      nav_notlar: "الملاحظات",
      nav_takvim: "التقويم",
      nav_yol: "رفيق السفر",
      nav_yol_kisa: "السفر",
      nav_araclar: "الأدوات",
      nav_ayarlar: "الإعدادات",
      
      afis_alt: "قائمة طعام السكن، ملاحظات المحاضرات، التقويم ورفيق السفر في جيبك.",
      yurt_menusu: "قائمة طعام السكن",
      yurt_sec_aciklama: "اختر سكنك، سيتم تذكره في المرة القادمة",
      aksam_yemegi: "العشاء",
      kahvalti: "الإفطار",
      ogle_yemegi: "الغداء",
      menuyu_goruntule: "عرض القائمة",
      kalori: "سعرة حرارية",
      
      unievi_baslik: "مطعم الجامعة",
      unievi_alt: "المطعم المركزي لجامعة الفرات",
      
      puan_ver: "تقييم",
      begendim: "أعجبني",
      begenmedim: "لم يعجبني",
      yorumlar: "التعليقات",
      yorum_yaz: "اكتب تعليقاً...",
      gonder: "إرسال",
      
      
      ayarlar_baslik: "الإعدادات والملف الشخصي",
      ayarlar_alt: "إدارة بيانات ملفك الشخصي ولغة التطبيق والتفضيلات",
      profil_bolumu: "الملف الشخصي للطالب",
      profil_ad: "الاسم / اللقب",
      profil_ad_placeholder: "مثال: يونس",
      profil_yurt: "السكن الذي تقيم فيه",
      profil_yurt_sec: "اختر السكن",
      profil_bolum: "القسم / الكلية",
      profil_bolum_placeholder: "مثال: هندسة الحاسوب",
      profil_avatar: "الصورة الرمزية",
      profil_kaydet: "حفظ الملف الشخصي",
      profil_kaydedildi: "تم حفظ معلومات الملف الشخصي بنجاح!",
      
      dil_bolumu: "لغة التطبيق",
      dil_sec: "اختر اللغة",
      tema_bolumu: "المظهر",
      tema_acik: "الوضع الفاتح",
      tema_koyu: "الوضع الداكن",
      
      araclar_ortalama: "حساب المعدل الفصلي",
      araclar_vize: "حساب درجات الفصلي والنهائي",
      hesapla: "حساب",
      temizle: "مسح",
      ders_ekle: "+ إضافة مادة",
      kredi: "الساعات",
      not: "الدرجة",
      
      kapat: "إغلاق",
      iptal: "إلغاء",
      kaydet: "حفظ"
    }
  };

  let aktifDil = localStorage.getItem("kc-dil") || "tr";
  if (!SOZLUK[aktifDil]) aktifDil = "tr";

  function metin(anahtar) {
    if (SOZLUK[aktifDil] && SOZLUK[aktifDil][anahtar]) {
      return SOZLUK[aktifDil][anahtar];
    }
    if (SOZLUK.tr[anahtar]) {
      return SOZLUK.tr[anahtar];
    }
    return anahtar;
  }

  function sayfayiGuncelle() {
    // Sayfa yönü (RTL for Arabic)
    if (aktifDil === "ar") {
      document.documentElement.setAttribute("dir", "rtl");
      document.body.classList.add("dil-ar");
    } else {
      document.documentElement.removeAttribute("dir");
      document.body.classList.remove("dil-ar");
    }

    // Metin içerikleri
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const ceviri = metin(key);
      if (ceviri) el.textContent = ceviri;
    });

    // Placeholder'lar
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      const ceviri = metin(key);
      if (ceviri) el.setAttribute("placeholder", ceviri);
    });

    // Title'lar
    document.querySelectorAll("[data-i18n-title]").forEach(el => {
      const key = el.getAttribute("data-i18n-title");
      const ceviri = metin(key);
      if (ceviri) el.setAttribute("title", ceviri);
    });

    // Aktif dil butonlarını güncelle
    document.querySelectorAll("[data-dil-secici]").forEach(btn => {
      btn.classList.toggle("aktif", btn.getAttribute("data-dil-secici") === aktifDil);
    });

    // Olay fırlat
    window.dispatchEvent(new CustomEvent("kc-dil-degisti", { detail: { dil: aktifDil } }));
  }

  function dilDegistir(yeniDil) {
    if (!SOZLUK[yeniDil]) return;
    aktifDil = yeniDil;
    localStorage.setItem("kc-dil", yeniDil);
    sayfayiGuncelle();
  }

  window.DIL = {
    get: metin,
    aktif: () => aktifDil,
    degistir: dilDegistir,
    guncelle: sayfayiGuncelle
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", sayfayiGuncelle);
  } else {
    sayfayiGuncelle();
  }
})();
