/* KampüsCepte — Çok dilli arayüz (Türkçe, English, Kurdî/Kurmancî, العربية).

   Nasıl çalışır: Sayfadaki Türkçe metinler "kaynak"tır. Dil değişince sayfadaki TÜM metin düğümleri
   (ve placeholder / title / aria-label özellikleri) bu dosyadaki sözlük ve kalıplarla anında çevrilir;
   sayfa yeniden yüklenmez. Sonradan eklenen metinler (sayaçlar, menü, yorum kutusu...) de otomatik çevrilir.
   Sözlükte olmayan metinler (yemek adları, ders adları, kullanıcı yorumları...) olduğu gibi Türkçe kalır.

   Yeni bir metin eklemek için TABLO'ya  ["Türkçe", "English", "Kurdî", "العربية"]  satırı ekle.
   Sayı/tarih içeren metinler için KALIPLAR'a bak. */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ sözlük */
  const TABLO = [
    /* gezinme */
    ["Ana sayfa", "Home", "Destpêk", "الرئيسية"],
    ["Yurtlar", "Dorms", "Wargeh", "السكن الجامعي"],
    ["Notlar", "Notes", "Nîşe", "الملاحظات"],
    ["Takvim", "Calendar", "Salname", "التقويم"],
    ["Yol arkadaşı", "Ride buddy", "Hevalê rê", "رفيق الطريق"],
    ["Yolculuk", "Rides", "Rêwîtî", "الرحلات"],
    ["Araçlar", "Tools", "Amûr", "الأدوات"],
    ["Ayarlar", "Settings", "Mîheng", "الإعدادات"],
    ["Siteyi gez ›", "Explore the site ›", "Malperê bigere ›", "تصفّح الموقع ›"],
    ["Tüm yurtlar", "All dorms", "Hemû wargeh", "كل السكنات"],
    ["Gizlilik", "Privacy", "Nepenî", "الخصوصية"],

    /* selamlama ve ana sayfa */
    ["İyi geceler", "Good night", "Şevbaş", "ليلة سعيدة"],
    ["Günaydın", "Good morning", "Rojbaş", "صباح الخير"],
    ["İyi günler", "Good day", "Roj baş", "نهارك سعيد"],
    ["İyi akşamlar", "Good evening", "Êvarbaş", "مساء الخير"],
    ["Menü, not, takvim ve yol arkadaşı cebinde.", "Menus, notes, calendar and ride buddies in your pocket.", "Menû, nîşe, salname û hevalê rê di bêrîka te de.", "القائمة والملاحظات والتقويم ورفيق الطريق في جيبك."],
    ["Güz dönemi", "Fall term", "Dema payîzê", "الفصل الخريفي"],
    ["Bahar dönemi", "Spring term", "Dema biharê", "الفصل الربيعي"],
    ["Ders dönemi", "Term time", "Dema dersan", "فترة الدراسة"],
    ["Sıradaki sınav", "Next exam", "Azmûna paşê", "الامتحان القادم"],
    ["Sıradaki tatil", "Next holiday", "Betlaneya paşê", "العطلة القادمة"],
    ["gün", "days", "roj", "أيام"],
    ["Akademik takvim", "Academic calendar", "Salnameya akademîk", "التقويم الأكاديمي"],
    ["Aç", "Open", "Veke", "افتح"],
    ["Tüm tarihler", "All dates", "Hemû dîrok", "كل التواريخ"],
    ["Sınav, tatil, kayıt", "Exams, holidays, registration", "Azmûn, betlane, qeyd", "الامتحانات والعطل والتسجيل"],
    ["Yurt menüsü", "Dorm menu", "Menûya wargehê", "قائمة السكن"],
    ["Yurdunu seç, bir dahaki sefere hatırlanır", "Pick your dorm; it will be remembered next time", "Wargeha xwe hilbijêre, cara din tê bîranîn", "اختر سكنك وسيُحفظ في المرة القادمة"],
    ["Kahvaltı", "Breakfast", "Taştê", "الإفطار"],
    ["Akşam", "Dinner", "Êvar", "العشاء"],
    ["Akşam yemeği", "Dinner", "Xwarina êvarê", "وجبة العشاء"],
    ["Öğle yemeği", "Lunch", "Xwarina nîvro", "وجبة الغداء"],
    ["Menüyle verilir:", "Served with the meal:", "Bi menûyê re tê dayîn:", "تُقدَّم مع الوجبة:"],
    ["Ekmek", "Bread", "Nan", "خبز"],
    ["Su", "Water", "Av", "ماء"],
    ["Gelecek günlerin menüsünü gör", "See upcoming menus", "Menûya rojên bê bibîne", "اعرض قوائم الأيام القادمة"],
    ["Gelecek Günlerin Menüsü", "Upcoming menus", "Menûya Rojên Bê", "قوائم الأيام القادمة"],
    ["Yarından itibaren menü listesi", "Menu list starting tomorrow", "Lîsteya menûyê ji sibê û pê ve", "قائمة الوجبات ابتداءً من الغد"],
    ["Bu ay için kalan başka menü bulunmuyor.", "There are no more menus for this month.", "Ji bo vê mehê menûyeke din namîne.", "لا توجد قوائم أخرى لهذا الشهر."],
    ["Üniversite Evi", "University House", "Mala Zanîngehê", "بيت الجامعة"],
    ["Fırat Üni.", "Fırat Univ.", "Zan. Firatê", "جامعة الفرات"],
    ["Üniversite Evi hafta sonu yemek vermiyor.", "University House does not serve meals on weekends.", "Mala Zanîngehê di dawiya hefteyê de xwarin nade.", "بيت الجامعة لا يقدّم الوجبات في عطلة نهاية الأسبوع."],
    ["Bu günün menüsü henüz eklenmedi.", "Today's menu has not been added yet.", "Menûya vê rojê hê nehatiye zêdekirin.", "لم تُضَف قائمة هذا اليوم بعد."],
    ["Bugünün menüsü henüz eklenmedi.", "Today's menu has not been added yet.", "Menûya îroyê hê nehatiye zêdekirin.", "لم تُضَف قائمة اليوم بعد."],
    ["Bu yurdun menüsü henüz eklenmedi.", "This dorm's menu has not been added yet.", "Menûya vê wargehê hê nehatiye zêdekirin.", "لم تُضَف قائمة هذا السكن بعد."],
    ["Al götür kahvaltı her gün 10.30'a kadar verilir.", "Take-away breakfast is served every day until 10:30.", "Taştêya birin-û-biçe her roj heta 10.30 tê dayîn.", "تُقدَّم وجبة الإفطار الجاهزة يوميًا حتى الساعة 10:30."],
    ["Menüler yurt panosundaki listeden alınır; değişiklik olabilir. ·", "Menus are taken from the dorm notice board and may change. ·", "Menû ji lîsteya tabloya wargehê hatine girtin; dibe ku biguherin. ·", "تؤخذ القوائم من لوحة إعلانات السكن وقد تتغير. ·"],
    ["Sponsorlu alan", "Sponsored space", "Cihê sponsor", "مساحة برعاية"],
    ["Bu alana reklam verebilirsiniz", "You can advertise here", "Hûn dikarin li vir reklam bikin", "يمكنكم الإعلان في هذه المساحة"],
    ["İşletmenizi Elazığ'daki öğrencilere tanıtın", "Promote your business to students in Elazığ", "Karsaziya xwe ji xwendekarên Xarpêtê re bidin nasîn", "عرّفوا طلاب إيلازيغ بنشاطكم التجاري"],
    ["WhatsApp'tan yaz", "Message on WhatsApp", "Li WhatsApp'ê binivîse", "راسلنا عبر واتساب"],
    ["Hızlı erişim", "Quick access", "Gihîştina bilez", "وصول سريع"],
    ["Kahvaltı ve akşam menüsü", "Breakfast and dinner menu", "Menûya taştê û êvarê", "قائمة الإفطار والعشاء"],
    ["Ders notları", "Course notes", "Nîşeyên dersan", "ملاحظات المقررات"],
    ["Bölüm ve sınıf seç", "Choose department and year", "Beş û polê hilbijêre", "اختر القسم والسنة"],
    ["Sınavlar ve tatiller", "Exams and holidays", "Azmûn û betlane", "الامتحانات والعطل"],
    ["Ortalama", "GPA", "Navînî", "المعدل"],
    ["4'lük sistem", "4.0 scale", "Pergala 4'î", "نظام 4 نقاط"],
    ["Elazığ KYK yurtları", "Elazığ KYK dorms", "Wargehên KYK yên Xarpêtê", "سكنات KYK في إيلازيغ"],
    ["Hepsi", "All", "Hemû", "الكل"],
    ["Kız", "Girls", "Keç", "بنات"],
    ["Erkek", "Boys", "Kur", "أولاد"],
    ["Kız yurdu · Menü var", "Girls' dorm · Menu available", "Wargeha keçan · Menû heye", "سكن البنات · القائمة متوفرة"],
    ["Erkek yurdu · Menü var", "Boys' dorm · Menu available", "Wargeha kuran · Menû heye", "سكن الأولاد · القائمة متوفرة"],
    ["Kız yurdu · KYK", "Girls' dorm · KYK", "Wargeha keçan · KYK", "سكن البنات · KYK"],
    ["Erkek yurdu · KYK", "Boys' dorm · KYK", "Wargeha kuran · KYK", "سكن الأولاد · KYK"],
    ["‹ Tüm yurtlar", "‹ All dorms", "‹ Hemû wargeh", "‹ كل السكنات"],
    ["Bugünün menüsü", "Today's menu", "Menûya îroyê", "قائمة اليوم"],
    ["Tüm yurtların menüleri", "Menus of all dorms", "Menûyên hemû wargehan", "قوائم جميع السكنات"],
    ["KampüsCepte'de başka neler var?", "What else is on KampüsCepte?", "Li KampüsCepte'yê çi din heye?", "ماذا يوجد أيضًا في KampüsCepte؟"],
    ["Sınav ve tatil sayaçları", "Exam and holiday countdowns", "Jimarvanên azmûn û betlaneyan", "عدّادات الامتحانات والعطل"],
    ["Ünite özetleri ve testler", "Unit summaries and quizzes", "Kurteyên yekeyan û test", "ملخصات الوحدات والاختبارات"],
    ["Fırat harf notlarıyla", "With Fırat letter grades", "Bi notên herfî yên Firatê", "بنظام درجات جامعة الفرات"],
    ["Bugün", "Today", "Îro", "اليوم"],
    ["Yarın", "Tomorrow", "Sibê", "غدًا"],
    ["Şu an", "Now", "Niha", "الآن"],
    ["Geçti", "Past", "Derbas bû", "انتهى"],

    /* notlar */
    ["Bölümünü seç", "Choose your department", "Beşa xwe hilbijêre", "اختر قسمك"],
    ["Yönetim Bilişim Sistemleri", "Management Information Systems", "Pergalên Agahdariya Rêveberiyê", "نظم المعلومات الإدارية"],
    ["1, 2, 3 ve 4. sınıf · ders programı ve notlar", "Years 1–4 · timetable and notes", "Polên 1, 2, 3 û 4 · bernameya dersan û nîşe", "السنوات 1–4 · الجدول الدراسي والملاحظات"],
    ["Açık", "Available", "Vekirî", "متاح"],
    ["İktisat", "Economics", "Aborî", "الاقتصاد"],
    ["İşletme", "Business Administration", "Karsazî", "إدارة الأعمال"],
    ["Mühendislik", "Engineering", "Endezyarî", "الهندسة"],
    ["Yakında", "Coming soon", "Zû tê", "قريبًا"],
    ["Tüm konu özetleri", "All topic summaries", "Kurteyên hemû mijaran", "ملخصات جميع المواضيع"],
    ["Bütün derslerin ünite ünite özetleri tek sayfada", "Unit-by-unit summaries of all courses on one page", "Kurteyên hemû dersan, yekeyek, di rûpelekê de", "ملخصات وحدات جميع المقررات في صفحة واحدة"],
    ["‹ Tüm bölümler", "‹ All departments", "‹ Hemû beş", "‹ كل الأقسام"],
    ["Sınıfını seç", "Choose your year", "Polê xwe hilbijêre", "اختر سنتك"],
    ["Sınıf", "Year", "Pol", "سنة"],

    /* takvim */
    ["Fırat Üniversitesi 2026–2027", "Fırat University 2026–2027", "Zanîngeha Firatê 2026–2027", "جامعة الفرات 2026–2027"],
    ["Finallere", "Until finals", "Heta fînalan", "حتى النهائيات"],
    ["Final sınavları", "Final exams", "Azmûnên fînalê", "الامتحانات النهائية"],
    ["Tatiller", "Holidays", "Betlane", "العطل"],
    ["Resmi tatil", "Official holiday", "Betlaneya fermî", "عطلة رسمية"],
    ["arife günü öğleden sonra başlar", "starts on the afternoon of the eve", "di nîvroya roja berî cejnê de dest pê dike", "تبدأ بعد ظهر يوم الوقفة"],
    ["Ders yapılmayan gün", "Days without classes", "Rojên bê ders", "أيام بلا دراسة"],
    ["Dersler yokken geliyor; derslere etkisi yok.", "It falls outside class time, so classes are not affected.", "Dema ders tune ne tê; bandor li dersan nake.", "تقع في وقت لا توجد فيه دروس؛ لا تأثير على الدراسة."],
    ["Hafta sonuna denk geliyor; derslere etkisi yok.", "It falls on a weekend, so classes are not affected.", "Dikeve dawiya hefteyê; bandor li dersan nake.", "تصادف عطلة نهاية الأسبوع؛ لا تأثير على الدراسة."],
    ["Yılbaşı", "New Year's Day", "Sersal", "رأس السنة"],
    ["Ramazan Bayramı", "Ramadan Holiday (Eid al-Fitr)", "Cejna Remezanê", "عيد الفطر"],
    ["Kurban Bayramı ve 19 Mayıs", "Eid al-Adha and 19 May", "Cejna Qurbanê û 19'ê Gulanê", "عيد الأضحى و19 مايو"],
    ["30 Ağustos Zafer Bayramı", "30 August Victory Day", "Cejna Serkeftinê ya 30'ê Tebaxê", "عيد النصر 30 أغسطس"],
    ["Cumhuriyet Bayramı", "Republic Day", "Cejna Komarê", "عيد الجمهورية"],
    ["Ara sınavlar (vizeler)", "Midterm exams", "Azmûnên navîn (vîze)", "الامتحانات النصفية"],
    ["Mazeret sınavları", "Make-up exams", "Azmûnên mazeretê", "امتحانات الأعذار"],
    ["Bütünleme sınavları", "Resit exams", "Azmûnên bûtûnlemeyê", "امتحانات الإكمال"],
    ["Mezuniyet sınavı", "Graduation exam", "Azmûna mezûniyetê", "امتحان التخرج"],
    ["Tek ders sınavı", "Single-course exam", "Azmûna yek dersê", "امتحان المقرر الواحد"],
    ["Ders kaydı ve harç ödeme", "Course registration and fee payment", "Qeydkirina dersan û dayîna harcê", "تسجيل المقررات ودفع الرسوم"],
    ["Bahar ders kaydı ve harç ödeme", "Spring course registration and fee payment", "Qeydkirina dersan û dayîna harcê ya biharê", "تسجيل مقررات الفصل الربيعي ودفع الرسوم"],
    ["Güz dönemi dersleri başlıyor", "Fall term classes begin", "Dersên dema payîzê dest pê dikin", "بدء دروس الفصل الخريفي"],
    ["Bahar dönemi dersleri başlıyor", "Spring term classes begin", "Dersên dema biharê dest pê dikin", "بدء دروس الفصل الربيعي"],
    ["Güz dönemi derslerin sonu", "End of fall term classes", "Dawiya dersên dema payîzê", "نهاية دروس الفصل الخريفي"],
    ["Bahar dönemi derslerin sonu", "End of spring term classes", "Dawiya dersên dema biharê", "نهاية دروس الفصل الربيعي"],
    ["Ders ekle-bırak", "Add/drop courses", "Zêdekirin û avêtina dersan", "إضافة وحذف المقررات"],
    ["Muafiyet ve mazeretli kayıt son gün", "Last day for exemption and late registration with excuse", "Roja dawî ya mûafiyet û qeyda bi mazeretê", "آخر يوم للإعفاء والتسجيل بعذر"],
    ["Mazeretli kayıt son gün", "Last day for late registration with excuse", "Roja dawî ya qeyda bi mazeretê", "آخر يوم للتسجيل بعذر"],
    ["Geçici izin için son başvuru", "Last day to apply for temporary leave", "Roja dawî ya serlêdana îznê ya demkî", "آخر موعد لطلب الإجازة المؤقتة"],
    ["Başarı sıralaması %10 listesi", "Top 10% achievement list", "Lîsteya %10 ya serkeftinê", "قائمة أعلى 10% تحصيلًا"],
    ["tahmini", "estimated", "texmînî", "تقريبي"],
    ["Sınav", "Exam", "Azmûn", "امتحان"],
    ["Tatil", "Holiday", "Betlane", "عطلة"],
    ["Kayıt", "Registration", "Qeyd", "تسجيل"],
    ["Dönem", "Term", "Dem", "الفصل"],
    ["Tüm takvim", "Full calendar", "Hemû salname", "التقويم الكامل"],
    ["Sınavlar", "Exams", "Azmûn", "الامتحانات"],
    ["Kayıt ve başvuru", "Registration & applications", "Qeyd û serlêdan", "التسجيل والطلبات"],
    ["Sadece gelecek", "Upcoming only", "Tenê yên bê", "القادمة فقط"],
    ["Tüm tarihleri telefon takvimine ekle", "Add all dates to your phone calendar", "Hemû dîrokan li salnameya telefonê zêde bike", "أضف كل التواريخ إلى تقويم هاتفك"],

    /* araçlar */
    ["Dönem boyunca lazım olacak", "You'll need these throughout the term", "Di dema termê de lazim dibin", "ستحتاجها طوال الفصل"],
    ["Ortalama hesapla", "Calculate GPA", "Navînî hesab bike", "احسب المعدل"],
    ["Her dersin AKTS kredisini ve harf notunu gir.", "Enter each course's ECTS credits and letter grade.", "Krediya AKTS û nota herfî ya her dersê binivîse.", "أدخل رصيد ECTS والدرجة الحرفية لكل مقرر."],
    ["Ders ekle", "Add course", "Ders zêde bike", "أضف مقررًا"],
    ["Hesapla", "Calculate", "Hesab bike", "احسب"],
    ["Henüz hesaplanmadı", "Not calculated yet", "Hê nehatiye hesabkirin", "لم يُحسب بعد"],
    ["Kendi sınavına kaç gün var?", "How many days until your exam?", "Ji azmûna te re çend roj mane?", "كم يومًا تبقّى لامتحانك؟"],
    ["Sınav tarihini seç.", "Pick the exam date.", "Dîroka azmûnê hilbijêre.", "اختر تاريخ الامتحان."],
    ["Tarih seçilmedi", "No date selected", "Dîrok nehatiye hilbijartin", "لم يُحدَّد تاريخ"],
    ["Bağlantılar", "Links", "Girêdan", "روابط"],
    ["Fırat Üniversitesi", "Fırat University", "Zanîngeha Firatê", "جامعة الفرات"],
    ["YBS Bölümü", "MIS Department", "Beşa YBS", "قسم نظم المعلومات الإدارية"],

    /* görünüm */
    ["Görünüm", "Appearance", "Xuyang", "المظهر"],
    ["☀️ Açık", "☀️ Light", "☀️ Ronahî", "☀️ فاتح"],
    ["🌙 Koyu", "🌙 Dark", "🌙 Tarî", "🌙 داكن"],
    ["🌓 Otomatik", "🌓 Automatic", "🌓 Otomatîk", "🌓 تلقائي"],
    ["Koyu", "Dark", "Tarî", "داكن"],
    ["Otomatik", "Automatic", "Otomatîk", "تلقائي"],
    ["Otomatik, telefonunun ayarına göre açık ya da koyu olur.", "Automatic follows your phone's setting (light or dark).", "Otomatîk li gorî mîhenga telefona te ronahî an tarî dibe.", "الوضع التلقائي يتبع إعداد هاتفك (فاتح أو داكن)."],
    ["Renk teması", "Color theme", "Rengê temayê", "سمة الألوان"],
    ["Türk", "Türkiye", "Tirk", "تركيا"],
    ["Klasik", "Classic", "Klasîk", "كلاسيكي"],
    ["Uygulama Dili", "App language", "Zimanê sepanê", "لغة التطبيق"],
    ["Dil", "Language", "Ziman", "اللغة"],
    ["Ayarlar & Profil", "Settings & Profile", "Mîheng û Profîl", "الإعدادات والملف الشخصي"],
    ["Hesap bilgilerinizi, dilinizi ve tercihlerinizi buradan yönetin", "Manage your account, language and preferences here", "Agahiyên hesabê, ziman û vebijarkên xwe li vir birêve bibe", "أدِر حسابك ولغتك وتفضيلاتك من هنا"],
    ["🌟 Yönetici Hesabı", "🌟 Admin account", "🌟 Hesabê rêveber", "🌟 حساب المشرف"],
    ["Yönetici", "Admin", "Rêveber", "المشرف"],
    ["🍽️ Tüm Yemekler – Fotoğraf Paneli", "🍽️ All meals – photo panel", "🍽️ Hemû xwarin – panela wêneyan", "🍽️ كل الوجبات – لوحة الصور"],
    ["Öğrenci Profili", "Student profile", "Profîla xwendekar", "ملف الطالب"],
    ["Adınız / Rumuzunuz", "Your name / nickname", "Nav / Nasnav", "الاسم / اللقب"],
    ["Kaldığınız Yurt", "Your dorm", "Wargeha ku lê dimînî", "السكن الذي تقيم فيه"],
    ["Yurt Seçiniz", "Select dorm", "Wargehê hilbijêre", "اختر السكن"],
    ["Yurtta Kalmıyorum / Evde Kalıyorum", "I don't stay in a dorm / I live at home", "Ez li wargehê namînim / li malê dimînim", "لا أقيم في سكن / أقيم في المنزل"],
    ["Bölümünüz / Fakülteniz", "Your department / faculty", "Beşa te / Fakulteya te", "قسمك / كليتك"],
    ["Profil Avatarı", "Profile avatar", "Avatara profîlê", "الصورة الرمزية"],
    ["Profili Kaydet", "Save profile", "Profîlê tomar bike", "احفظ الملف الشخصي"],
    ["Profil bilgileriniz kaydedildi! ✅", "Your profile has been saved! ✅", "Agahiyên profîla te hatin tomarkirin! ✅", "تم حفظ ملفك الشخصي! ✅"],
    ["KampüsCepte v2.6 • Fırat Üniversitesi Öğrenci Platformu", "KampüsCepte v2.6 • Fırat University student platform", "KampüsCepte v2.6 • Platforma xwendekarên Zanîngeha Firatê", "KampüsCepte v2.6 • منصة طلاب جامعة الفرات"],
    ["Hakkımızda ve iletişim", "About & contact", "Derbarê me û têkilî", "من نحن والتواصل"],
    ["Gizlilik ve çerezler", "Privacy & cookies", "Nepenî û çerez", "الخصوصية وملفات الارتباط"],
    ["Tercihlerini hatırlamak için cihazında küçük kayıtlar tutuyoruz; ileride reklam ortaklarımız çerez kullanabilir.", "We keep small records on your device to remember your preferences; our ad partners may use cookies in the future.", "Ji bo bîranîna vebijarkên te em li ser cîhaza te tomarên piçûk digirin; di pêşerojê de hevkarên me yên reklamê dikarin çerez bikar bînin.", "نحتفظ بسجلات صغيرة على جهازك لتذكّر تفضيلاتك، وقد يستخدم شركاؤنا الإعلانيون ملفات تعريف الارتباط مستقبلًا."],
    ["Ayrıntılar", "Details", "Hûrgilî", "التفاصيل"],
    ["Tamam", "OK", "Baş e", "حسنًا"],

    /* yorum, puan ve beğeni kutusu */
    ["Puan ver", "Rate", "Puan bide", "قيّم"],
    ["(Senin oyun)", "(Your vote)", "(Dengê te)", "(صوتك)"],
    ["Yorumlar", "Comments", "Şîrove", "التعليقات"],
    ["Yorumlar yüklenemedi.", "Comments could not be loaded.", "Şîrove nehatin barkirin.", "تعذّر تحميل التعليقات."],
    ["Henüz yorum yok. İlk yorumu sen yap!", "No comments yet. Be the first!", "Hê şîrove tune. Yekem şîrove ya te be!", "لا توجد تعليقات بعد. كن أول من يعلّق!"],
    ["Bu menü hakkında ne düşünüyorsun?", "What do you think about this menu?", "Tu der barê vê menûyê de çi difikirî?", "ما رأيك في هذه القائمة؟"],
    ["Yanıtını yaz…", "Write your reply…", "Bersiva xwe binivîse…", "اكتب ردك…"],
    ["İsmin (isteğe bağlı, boş bırakırsan Anonim)", "Your name (optional; blank = Anonymous)", "Navê te (bijarte; heke vala bihêlî Nenas)", "اسمك (اختياري؛ إن تركته فارغًا يظهر مجهولًا)"],
    ["Anonim", "Anonymous", "Nenas", "مجهول"],
    ["Gönder", "Send", "Bişîne", "إرسال"],
    ["Yanıtla", "Reply", "Bersiv bide", "رد"],
    ["Bildir", "Report", "Ragihîne", "إبلاغ"],
    ["🗑️ Sil", "🗑️ Delete", "🗑️ Jê bibe", "🗑️ حذف"],
    ["Beğendim", "Like", "Min hez kir", "أعجبني"],
    ["Beğenmedim", "Dislike", "Min hez nekir", "لم يعجبني"],
    ["Yorumu beğen", "Like comment", "Şîroveyê hez bike", "أعجبني التعليق"],
    ["az önce", "just now", "demeke berê", "قبل لحظات"],
    ["şimdi", "now", "niha", "الآن"],
    ["Teşekkürler, inceleyeceğiz.", "Thank you, we'll look into it.", "Spas, em ê binirxînin.", "شكرًا، سنراجع الأمر."],
    ["Gönderilemedi, tekrar dener misin?", "Could not send. Try again?", "Neşand, dîsa biceribîne?", "تعذّر الإرسال، هل تحاول مجددًا؟"],
    ["Bağlantı kurulamadı, tekrar dener misin?", "Could not connect. Try again?", "Girêdan çênebû, dîsa biceribîne?", "تعذّر الاتصال، هل تحاول مجددًا؟"],
    ["Yorum silindi.", "Comment deleted.", "Şîrove hat jêbirin.", "تم حذف التعليق."],
    ["Bu yorumu silmek istediğine emin misin?", "Are you sure you want to delete this comment?", "Tu piştrast î ku dixwazî vê şîroveyê jê bibî?", "هل أنت متأكد من حذف هذا التعليق؟"],
    ["Tüm yemekler", "All meals", "Hemû xwarin", "كل الوجبات"],

    /* özellik: alt ve aria */
    ["Koyu ve açık mod arasında geç", "Switch between dark and light mode", "Di navbera moda tarî û ronahî de biguherîne", "التبديل بين الوضع الداكن والفاتح"],
    ["Yurt seç", "Select dorm", "Wargehê hilbijêre", "اختر السكن"],
    ["Ders adı", "Course name", "Navê dersê", "اسم المقرر"],
    ["AKTS kredisi", "ECTS credits", "Krediya AKTS", "رصيد ECTS"],
    ["Harf notu", "Letter grade", "Nota herfî", "الدرجة الحرفية"],
    ["Dersi sil", "Delete course", "Dersê jê bibe", "احذف المقرر"],
    ["Tema", "Theme", "Tema", "السمة"],
    ["Örn: Ayşe", "e.g. Ayşe", "Mînak: Azad", "مثال: عائشة"],
    ["Örn: Bilgisayar Mühendisliği", "e.g. Computer Engineering", "Mînak: Endezyariya Komputerê", "مثال: هندسة الحاسوب"],
    ["Kapat", "Close", "Bigire", "إغلاق"],
    ["Çerez bilgilendirmesi", "Cookie notice", "Agahdariya çerezan", "إشعار ملفات الارتباط"]
  ];

  /* Not: "Açık" yalnızca bölüm kartında (kullanıma açık) çıplak yazılır; tema düğmeleri emojilidir ("☀️ Açık"). */

  const AY = {
    tr: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    ku: ["Çile", "Sibat", "Adar", "Nîsan", "Gulan", "Hezîran", "Tîrmeh", "Tebax", "Îlon", "Cotmeh", "Mijdar", "Kanûn"],
    ar: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
  };
  const GUN = {
    tr: ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"],
    en: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    ku: ["Duşem", "Sêşem", "Çarşem", "Pêncşem", "În", "Şemî", "Yekşem"],
    ar: ["الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"]
  };
  const VE = { en: "and", ku: "û", ar: "و" };

  /* yurt adları (Arapça için okunuşları) */
  const YURT_AD = {
    "Ahmet Kabaklı": "أحمد كاباكلي", "Elazığ Fırat": "فرات إيلازيغ", "Fırat": "الفرات",
    "Ömer Bilginoğlu": "عمر بيلغينأوغلو", "Fethi Sekin": "فتحي سكين", "Harput": "هاربوت",
    "İzzetpaşa": "عزت باشا", "Sare Ana": "سارة آنا"
  };

  /* ------------------------------------------------------------------ yardımcılar */
  const DILLER = ["tr", "en", "ku", "ar"];
  const IDX = { en: 1, ku: 2, ar: 3 };
  const SOZLUK = new Map();
  TABLO.forEach(function (r) { if (!SOZLUK.has(r[0])) SOZLUK.set(r[0], r); });

  const HARF = "A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛû";
  const AY_RE = new RegExp("(^|[^" + HARF + "])(" + AY.tr.join("|") + ")(?![" + HARF + "])", "g");
  const GUN_RE = new RegExp("(^|[^" + HARF + "])(" + GUN.tr.join("|") + ")(?![" + HARF + "])", "g");
  const TARIH_VAR = new RegExp("(^|[^" + HARF + "])(" + AY.tr.concat(GUN.tr).join("|") + ")(?![" + HARF + "])");

  function gunKelime(n, d) {
    if (d === "en") return n === 1 ? "day" : "days";
    if (d === "ku") return "roj";
    if (n === 1) return "يوم";
    if (n === 2) return "يومان";
    if (n >= 3 && n <= 10) return "أيام";
    return "يومًا";
  }
  function sayi(s, d) { return d === "ku" ? String(s) : String(s).replace(",", "."); }
  function tarihKelime(s, d) {
    return s.replace(AY_RE, function (_, p, a) { return p + AY[d][AY.tr.indexOf(a)]; })
            .replace(GUN_RE, function (_, p, g) { return p + GUN[d][GUN.tr.indexOf(g)]; });
  }
  function yurtAdi(ad, d) {
    if (d === "ar") return YURT_AD[ad] || ad;
    return ad;
  }

  /* ------------------------------------------------------------------ kalıplar (sayı / tarih içeren metinler)
     [düzenli ifade, fonksiyon(m, d, c)]  —  c = çeviri fonksiyonu (iç içe parça çevirmek için) */
  const KALIPLAR = [
    [/^(\d+) gün$/, function (m, d) { const n = +m[1]; return n + " " + gunKelime(n, d); }],
    [/^([\d]+,[\d]+) gün$/, function (m, d) { return sayi(m[1], d) + " " + (d === "ar" ? "أيام" : d === "ku" ? "roj" : "days"); }],
    [/^(\d+)\. hafta$/, function (m, d) { return d === "en" ? "Week " + m[1] : d === "ku" ? "Hefteya " + m[1] + "." : "الأسبوع " + m[1]; }],
    [/^Derslerin bitmesine (\d+) gün var$/, function (m, d) {
      const n = +m[1];
      return d === "en" ? n + " " + gunKelime(n, d) + " until classes end"
           : d === "ku" ? "Heta dawiya dersan " + n + " roj maye"
           : "تبقّى " + n + " " + gunKelime(n, d) + " على انتهاء الدروس";
    }],
    [/^(\d+) gün sonra$/, function (m, d) {
      const n = +m[1];
      return d === "en" ? "in " + n + " " + gunKelime(n, d) : d === "ku" ? "piştî " + n + " rojan" : "بعد " + n + " " + gunKelime(n, d);
    }],
    [/^(Kahvaltı|Akşam yemeği|Öğle yemeği) ([\d.:–\- ]+)$/, function (m, d, c) { return c(m[1]) + " " + m[2]; }],
    [/^([\d.:]+\s?–\s?[\d.:]+) ve ([\d.:]+\s?–\s?[\d.:]+)$/, function (m, d) { return m[1] + " " + VE[d] + " " + m[2]; }],
    [/^(\d+) (\p{L}+) (Pazartesi|Salı|Çarşamba|Perşembe|Cuma|Cumartesi|Pazar)$/u, function (m, d) {
      const ay = tarihKelime(m[2], d), gun = tarihKelime(m[3], d);
      return d === "en" ? gun + ", " + m[1] + " " + ay : d === "ku" ? m[1] + " " + ay + ", " + gun : gun + " " + m[1] + " " + ay;
    }],
    [/^(\d+ \p{L}+ \p{L}+|\d+ \p{L}+) menüsü$/u, function (m, d, c) {
      const t = c(m[1]);
      return d === "en" ? t + " menu" : d === "ku" ? "Menûya " + t : "قائمة " + t;
    }],
    [/^(\d+ \p{L}+) öğle menüsü$/u, function (m, d, c) {
      const t = c(m[1]);
      return d === "en" ? t + " lunch menu" : d === "ku" ? "Menûya nîvroyê ya " + t : "قائمة غداء " + t;
    }],
    [/^(.+) (Erkek|Kız) Yurdu$/, function (m, d) {
      const ad = yurtAdi(m[1], d), erkek = m[2] === "Erkek";
      return d === "en" ? ad + (erkek ? " Boys' Dorm" : " Girls' Dorm")
           : d === "ku" ? "Wargeha " + (erkek ? "Kuran" : "Keçan") + ": " + ad
           : "سكن " + ad + (erkek ? " للأولاد" : " للبنات");
    }],
    [/^(.+) Yurdu$/, function (m, d) {
      const ad = yurtAdi(m[1], d);
      return d === "en" ? ad + " Dorm" : d === "ku" ? "Wargeha " + ad : "سكن " + ad;
    }],
    [/^(.+) – Gelecek Günlerin Menüsü$/, function (m, d, c) {
      return c(m[1]) + " – " + c("Gelecek Günlerin Menüsü");
    }],
    [/^Araya kalan (.+?) (gününü|günlerini) de tatil yaparsan, hafta sonuyla birlikte toplam ([\d.,]+) gün tatil olur\.$/, function (m, d, c) {
      const gunler = tarihKelime(m[1], d).replace(" ve ", " " + VE[d] + " "), coklu = m[2] === "günlerini", n = sayi(m[3], d);
      return d === "en" ? "If you also take the " + gunler + " in between off, you get " + n + " days off in total including the weekend."
           : d === "ku" ? "Ger " + (coklu ? "rojên " : "roja ") + gunler + " ya di navberê de jî betlane bikî, bi dawiya hefteyê re bi giştî " + n + " roj betlane dibe."
           : "إذا أخذت " + (coklu ? "يومَي " : "يوم ") + gunler + " الواقع بينهما عطلة أيضًا، تصبح العطلة " + n + " أيام بما فيها نهاية الأسبوع.";
    }],
    [/^Hafta sonuyla birleşince toplam ([\d.,]+) gün tatil olur\.$/, function (m, d) {
      const n = sayi(m[1], d);
      return d === "en" ? "Together with the weekend, that makes " + n + " days off."
           : d === "ku" ? "Bi dawiya hefteyê re bi giştî " + n + " roj betlane dibe."
           : "مع عطلة نهاية الأسبوع تصبح العطلة " + n + " أيام.";
    }],
    [/^Güz dönemi vizeleri (\d+) (\p{L}+)[’'](?:da|de|ta|te) başlıyor\. [\s\S]*$/u, function (m, d) {
      const ay = tarihKelime(m[2], d);
      return d === "en" ? "Fall midterms start on " + m[1] + " " + ay + ". Dates marked \"estimated\" (make-up exams and spring midterms) are calculated from the academic calendar's \"weeks 8–9\" and \"weeks 13–14\" rule; the department announces the exact days. Source: Fırat University 2026–2027 General Academic Calendar (excluding Medicine and Dentistry)."
           : d === "ku" ? "Vîzeyên dema payîzê di " + m[1] + " " + ay + "an de dest pê dikin. Dîrokên bi nîşana \"texmînî\" (azmûnên mazeretê û vîzeyên biharê) li gorî qaîdeya \"hefteyên 8–9\" û \"hefteyên 13–14\" ya salnameya akademîk hatine hesabkirin; rojên rast beş radigihîne. Çavkanî: Salnameya Giştî ya Akademîk a Zanîngeha Firatê 2026–2027 (ji bilî Bijîşkî û Diranzanî)."
           : "تبدأ الامتحانات النصفية للفصل الخريفي في " + m[1] + " " + ay + ". التواريخ المكتوب عليها \"تقريبي\" (امتحانات الأعذار ونصفي الربيع) حُسبت وفق قاعدة \"الأسبوعين 8–9\" و\"13–14\" في التقويم الأكاديمي؛ ويعلن القسم الأيام الدقيقة. المصدر: التقويم الأكاديمي العام لجامعة الفرات 2026–2027 (باستثناء الطب وطب الأسنان).";
    }],
    [/^(\d) yıldız$/, function (m, d) { return d === "en" ? m[1] + (m[1] === "1" ? " star" : " stars") : d === "ku" ? m[1] + " stêrk" : m[1] + " نجمة"; }],
    [/^5 yıldız üzerinden puanla$/, function (m, d) { return d === "en" ? "Rate out of 5 stars" : d === "ku" ? "Ji 5 stêrkan puan bide" : "قيّم من 5 نجوم"; }],
    [/^\((\d+) oy\)$/, function (m, d) { return d === "en" ? "(" + m[1] + " votes)" : d === "ku" ? "(" + m[1] + " deng)" : "(" + m[1] + " أصوات)"; }],
    [/^(\d+) yıldız verdin! ⭐$/, function (m, d) { return d === "en" ? "You gave " + m[1] + " stars! ⭐" : d === "ku" ? "Te " + m[1] + " stêrk da! ⭐" : "أعطيت " + m[1] + " نجوم! ⭐"; }],
    [/^(\d+) dk önce$/, function (m, d) { return d === "en" ? m[1] + " min ago" : d === "ku" ? m[1] + " deq berê" : "قبل " + m[1] + " د"; }],
    [/^(\d+) sa önce$/, function (m, d) { return d === "en" ? m[1] + " h ago" : d === "ku" ? m[1] + " saet berê" : "قبل " + m[1] + " س"; }],
    [/^(.+) fotoğrafı$/, function (m, d) { return d === "en" ? m[1] + " photo" : d === "ku" ? "Wêneyê " + m[1] : "صورة " + m[1]; }]
  ];

  /* ------------------------------------------------------------------ çeviri çekirdeği */
  const ONBELLEK = { en: new Map(), ku: new Map(), ar: new Map() };

  function cevirCekirdek(tr, d) {
    const s = SOZLUK.get(tr);
    if (s) return s[IDX[d]];
    for (let i = 0; i < KALIPLAR.length; i++) {
      const m = KALIPLAR[i][0].exec(tr);
      if (m) return KALIPLAR[i][1](m, d, function (x) { return cevirMetin(x, d); });
    }
    /* "Başlık:" biçimi */
    const iki = /^(.+):$/.exec(tr);
    if (iki) { const c = cevirMetin(iki[1], d); if (c !== iki[1]) return c + (d === "ar" ? ":" : ":"); }
    /* " · " ile ayrılmış parçalar */
    if (tr.indexOf(" · ") > 0) {
      const p = tr.split(" · "), q = p.map(function (x) { return cevirMetin(x, d); });
      if (q.some(function (x, i) { return x !== p[i]; })) return q.join(" · ");
    }
    /* yalnızca tarih sözcükleri (ay / gün adları) */
    if (/\d/.test(tr) && TARIH_VAR.test(tr)) return tarihKelime(tr, d);
    return tr;
  }
  function cevirMetin(tr, d) {
    if (d === "tr" || !tr) return tr;
    const k = ONBELLEK[d], v = k.get(tr);
    if (v !== undefined) return v;
    const c = cevirCekirdek(tr, d);
    if (k.size > 4000) k.clear();
    k.set(tr, c);
    return c;
  }
  /* baştaki/sondaki boşlukları koruyarak çevir */
  function cevirBosluklu(tr, d) {
    const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(tr);
    if (!m[2]) return tr;
    const c = cevirMetin(m[2].replace(/\s+/g, " "), d);
    return c === m[2].replace(/\s+/g, " ") ? tr : m[1] + c + m[3];
  }

  /* ------------------------------------------------------------------ DOM */
  let aktif = "tr";
  /* Varsayılan dil HER ZAMAN Türkçe'dir: yalnızca kullanıcı Ayarlar'dan açıkça başka dil seçtiyse o kullanılır
     (telefon/tarayıcı dili hiç dikkate alınmaz). Adrese ?dil=tr eklenirse Türkçeye sıfırlanır. */
  try {
    const q = new URLSearchParams(location.search).get("dil");
    if (DILLER.indexOf(q) >= 0) localStorage.setItem("kc-dil", q);
    const k = localStorage.getItem("kc-dil"); if (DILLER.indexOf(k) >= 0) aktif = k;
  } catch (e) {}

  const metinKayit = new Map();                 // metin düğümü -> { tr, ceviri }
  const ozellikKayit = new WeakMap();           // eleman -> { özellik: { tr, ceviri } }
  const OZELLIKLER = ["placeholder", "title", "aria-label", "alt"];
  const ATLA = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, CODE: 1, PRE: 1 };

  function atlanir(el) {
    for (let e = el; e && e.nodeType === 1; e = e.parentNode) {
      if (ATLA[e.tagName] || e.hasAttribute("data-ceviri-yok") || e.getAttribute("translate") === "no") return true;
    }
    return false;
  }

  function metinDugumu(n) {
    if (!n.parentNode || atlanir(n.parentNode)) return;
    const cur = n.nodeValue, kayit = metinKayit.get(n);
    /* uygulama metni yeniden yazdıysa (cur ≠ bizim çevirimiz) yeni Türkçe kaynak odur */
    const tr = kayit && kayit.ceviri === cur ? kayit.tr : cur;
    if (aktif === "tr") {
      if (kayit && kayit.ceviri === cur) n.nodeValue = kayit.tr;
      metinKayit.delete(n);
      return;
    }
    const c = cevirBosluklu(tr, aktif);
    if (c !== tr) { metinKayit.set(n, { tr: tr, ceviri: c }); if (n.nodeValue !== c) n.nodeValue = c; }
    else metinKayit.delete(n);
  }

  function ozellikler(el) {
    if (atlanir(el)) return;
    let kayit = ozellikKayit.get(el);
    for (let i = 0; i < OZELLIKLER.length; i++) {
      const a = OZELLIKLER[i], cur = el.getAttribute(a);
      if (cur == null) continue;
      const kr = kayit && kayit[a];
      const tr = kr && kr.ceviri === cur ? kr.tr : cur;
      if (aktif === "tr") {
        if (kr && kr.ceviri === cur) el.setAttribute(a, kr.tr);
        if (kr) delete kayit[a];
        continue;
      }
      const c = cevirBosluklu(tr, aktif);
      if (c !== tr) {
        if (!kayit) { kayit = {}; ozellikKayit.set(el, kayit); }
        kayit[a] = { tr: tr, ceviri: c };
        if (cur !== c) el.setAttribute(a, c);
      } else if (kr) delete kayit[a];
    }
  }

  function gez(kok) {
    if (kok.nodeType === 3) { metinDugumu(kok); return; }
    if (kok.nodeType !== 1) return;
    if (atlanir(kok)) return;
    ozellikler(kok);
    for (let c = kok.firstChild; c; c = c.nextSibling) gez(c);
  }

  function yonVeDil() {
    const kok = document.documentElement;
    kok.setAttribute("lang", aktif);
    if (aktif === "ar") kok.setAttribute("dir", "rtl"); else kok.removeAttribute("dir");
    if (document.body) document.body.classList.toggle("dil-ar", aktif === "ar");
  }

  function hepsiniGuncelle() {
    yonVeDil();
    if (!document.body) return;
    gozlemciDurdur();
    /* kaynağa dön (eski çeviriler) → yeni dile çevir */
    gez(document.body);
    /* artık bağlı olmayan düğümleri temizle */
    metinKayit.forEach(function (_, n) { if (!n.isConnected) metinKayit.delete(n); });
    gozlemciBaslat();
    document.querySelectorAll("[data-dil]").forEach(function (b) { b.classList.toggle("aktif", b.getAttribute("data-dil") === aktif); });
    turkceDugmesi();
    window.dispatchEvent(new CustomEvent("kc-dil-degisti", { detail: { dil: aktif } }));
  }

  /* sonradan eklenen / değişen metinler */
  let gozlemci = null, bekleyen = new Set(), planli = false;
  function isle() {
    planli = false;
    const liste = Array.from(bekleyen); bekleyen = new Set();
    gozlemciDurdur();
    liste.forEach(function (n) { if (n.isConnected) gez(n); });
    gozlemciBaslat();
  }
  function planla(n) {
    bekleyen.add(n);
    if (!planli) { planli = true; (window.requestAnimationFrame || setTimeout)(isle); }
  }
  function gozlemciBaslat() {
    if (!gozlemci || !document.body) return;
    gozlemci.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: OZELLIKLER });
  }
  function gozlemciDurdur() { if (gozlemci) gozlemci.disconnect(); }
  if (window.MutationObserver) {
    gozlemci = new MutationObserver(function (list) {
      if (aktif === "tr") return;
      list.forEach(function (m) {
        if (m.type === "childList") m.addedNodes.forEach(function (n) { planla(n); });
        else if (m.type === "characterData") planla(m.target);
        else if (m.type === "attributes") planla(m.target);
      });
    });
  }

  /* alert / confirm / prompt iletileri de çevrilsin */
  ["alert", "confirm", "prompt"].forEach(function (ad) {
    const o = window[ad];
    if (typeof o !== "function") return;
    window[ad] = function (msg) {
      const a = Array.prototype.slice.call(arguments);
      if (aktif !== "tr" && typeof msg === "string") a[0] = cevirMetin(msg, aktif);
      return o.apply(window, a);
    };
  });

  /* Türkçe dışında bir dil açıkken üst başlıkta her zaman görünen "Türkçe" düğmesi (geri dönüş yolu) */
  function turkceDugmesi() {
    let b = document.getElementById("dil-tr-don");
    if (aktif === "tr") { if (b) b.remove(); return; }
    if (b || !document.body) return;
    b = document.createElement("button");
    b.id = "dil-tr-don"; b.type = "button"; b.setAttribute("data-ceviri-yok", ""); b.setAttribute("translate", "no");
    b.textContent = "Türkçe";
    b.style.cssText = "position:fixed;top:max(10px,env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%);z-index:9998;border:0;border-radius:999px;padding:6px 14px;font:700 12px system-ui,sans-serif;background:#141b34;color:#fff;box-shadow:0 6px 18px -6px rgba(0,0,0,.4);cursor:pointer;opacity:.92";
    b.onclick = function () { degistir("tr"); };
    document.body.appendChild(b);
  }

  function degistir(yeni) {
    if (DILLER.indexOf(yeni) < 0 || yeni === aktif) { if (DILLER.indexOf(yeni) >= 0) hepsiniGuncelle(); return; }
    aktif = yeni;
    try { localStorage.setItem("kc-dil", yeni); } catch (e) {}
    hepsiniGuncelle();
  }

  window.DIL = {
    aktif: function () { return aktif; },
    degistir: degistir,
    guncelle: hepsiniGuncelle,
    cevir: function (tr) { return cevirMetin(tr, aktif); },
    /* eski kod uyumu */
    get: function (anahtar) { return cevirMetin(anahtar, aktif); }
  };

  /* ilk yükleme: Türkçe dışındaysa DOM hazır olunca çevir (ve dil/yön özniteliğini hemen koy) */
  yonVeDil();
  function basla() {
    if (aktif !== "tr") hepsiniGuncelle(); else gozlemciBaslat();
    document.querySelectorAll("[data-dil]").forEach(function (b) { b.classList.toggle("aktif", b.getAttribute("data-dil") === aktif); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", basla); else basla();
})();
