/* KampüsCepte — menüdeki yemeklerin gerçek fotoğrafları ve Tüm Yemekler yöneticisi.
   KYK Yurtları ve Üniversite Evi yemek fotoğrafları tamamen ayrıdır, ortak paylaşılmaz. */
(function () {
  "use strict";

  const Y = "/gorseller/yemek/";
  const TUM_KATALOG = [
  {
    "ad": "Ayran",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Ayran aşı çorbası",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Beyaz peynir",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Bezelye yemeği",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Brownie",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Bulgur pilavı",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Çay",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Çikolatalı kek",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Çoban salata",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Domates çorbası",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Düğün çorbası",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Ekmek arası köfte",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Elma",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Erişte pilavı",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Etli dolma",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Etli kuru fasulye",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Etsiz kuru fasulye",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Ezogelin çorbası",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Fırında sebzeli tavuk ızgara",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Hamburger köfte + patates",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Haşlanmış yumurta",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Haydari",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Ispanak yemeği",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Ispanaklı börek",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Karışık kızartma",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Karışık pizza",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Karışık salata",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Karışık sebze graten",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Kaşar peynir",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Kaşarlı omlet",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Kek",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Bal",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Tereyağı",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Kıymalı ıspanak",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Krem peynir",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Kuşbaşılı patlıcan kebap",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Labne peynir",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Makarna salatası",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Menemen",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Mercimek çorbası",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Mevsim salata",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Mevsim soslu karışık kızartma",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Mevsim türlü",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Mozaik kek",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Mücver",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Nohutlu pirinç pilavı",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Nugget",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Orman kebabı",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Patates kavurma",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Patates kızartma",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Patates salatası",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Patlıcan musakka",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Patlıcan parmak kebabı",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Peynirli börek",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Peynirli omlet",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Pirinç pilavı",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Poğaça",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Rosto köfte",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Sade omlet",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Sade poğaça",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Salçalı mantı",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Salçalı sosis",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Sebze çorbası",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Sebzeli bulgur pilavı",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Simit",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Siyah / yeşil zeytin",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Sosis kızartma",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Soslu makarna",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Sucuklu omlet",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Sucuklu yumurta",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Sulu patates",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Sütlaç",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Şehriye çorbası",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Şekerpare",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Şinitzel",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Tarhana çorbası",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Tavuk baget kızartma",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Tavuk burger",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Tavuk çöp şiş",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Tavuk döner",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Tavuk kavurma",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Tavuk sote",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Tavuk tantuni",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Taze fasulye",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Tulumba",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Yayla çorbası",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Yoğurt",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Yoğurtlu kabak",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Yoğurtlu mantı",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Zeytinli / peynirli açma",
    "yer": "yurt",
    "yerAdi": "KYK Yurdu",
    "rozet": "🏠 KYK Yurdu"
  },
  {
    "ad": "Bulgur pilavı",
    "yer": "unievi",
    "yerAdi": "Üniversite Evi",
    "rozet": "🏛️ Üniversite Evi"
  },
  {
    "ad": "Domates çorbası",
    "yer": "unievi",
    "yerAdi": "Üniversite Evi",
    "rozet": "🏛️ Üniversite Evi"
  },
  {
    "ad": "Etli kuru fasulye",
    "yer": "unievi",
    "yerAdi": "Üniversite Evi",
    "rozet": "🏛️ Üniversite Evi"
  },
  {
    "ad": "Etli taze fasulye",
    "yer": "unievi",
    "yerAdi": "Üniversite Evi",
    "rozet": "🏛️ Üniversite Evi"
  },
  {
    "ad": "Fırında tavuk",
    "yer": "unievi",
    "yerAdi": "Üniversite Evi",
    "rozet": "🏛️ Üniversite Evi"
  },
  {
    "ad": "Makarna",
    "yer": "unievi",
    "yerAdi": "Üniversite Evi",
    "rozet": "🏛️ Üniversite Evi"
  },
  {
    "ad": "Mercimek çorbası",
    "yer": "unievi",
    "yerAdi": "Üniversite Evi",
    "rozet": "🏛️ Üniversite Evi"
  },
  {
    "ad": "Mevsim salata",
    "yer": "unievi",
    "yerAdi": "Üniversite Evi",
    "rozet": "🏛️ Üniversite Evi"
  },
  {
    "ad": "Meyve",
    "yer": "unievi",
    "yerAdi": "Üniversite Evi",
    "rozet": "🏛️ Üniversite Evi"
  },
  {
    "ad": "Orman kebap",
    "yer": "unievi",
    "yerAdi": "Üniversite Evi",
    "rozet": "🏛️ Üniversite Evi"
  },
  {
    "ad": "Pirinç pilavı",
    "yer": "unievi",
    "yerAdi": "Üniversite Evi",
    "rozet": "🏛️ Üniversite Evi"
  },
  {
    "ad": "Rosto köfte",
    "yer": "unievi",
    "yerAdi": "Üniversite Evi",
    "rozet": "🏛️ Üniversite Evi"
  },
  {
    "ad": "Tulumba tatlısı",
    "yer": "unievi",
    "yerAdi": "Üniversite Evi",
    "rozet": "🏛️ Üniversite Evi"
  },
  {
    "ad": "Tatlı",
    "yer": "unievi",
    "yerAdi": "Üniversite Evi",
    "rozet": "🏛️ Üniversite Evi"
  },
  {
    "ad": "Yayla çorbası",
    "yer": "unievi",
    "yerAdi": "Üniversite Evi",
    "rozet": "🏛️ Üniversite Evi"
  },
  {
    "ad": "Yoğurt",
    "yer": "unievi",
    "yerAdi": "Üniversite Evi",
    "rozet": "🏛️ Üniversite Evi"
  }
];

  const FOTOLAR = {
    "unievi": {
      "rosto köfte": "unievi-rosto-kofte",
      "makarna": "unievi-makarna",
      "domates çorbası": "unievi-domates-corbasi",
      "fırında tavuk": "unievi-firinda-tavuk",
      "bulgur pilavı": "unievi-bulgur-pilavi",
      "mercimek çorbası": "unievi-mercimek-corbasi",
      "yoğurt": "unievi-yogurt",
      "baklava": "unievi-baklava",
      "ayran": "unievi-ayran",
      "tahin helva": "unievi-tahin-helvasi",
      "tahin helvası": "unievi-tahin-helvasi",
      "nohutlu pirinç pilavı": "unievi-nohutlu-pirinc-pilavi",
      "et kavurma": "unievi-et-kavurma"
    },
    "unievi_2026-10-21": { "tatlı": "unievi-baklava" },
    "yurt": {
      "makarna salatası": "yurt-makarna-salatasi",
      "tarhana çorbası": "yurt-tarhana-corbasi",
      "kıymalı ıspanak": "yurt-kiymali-ispanak",
      "tavuk tantuni": "yurt-tavuk-tantuni",
      "tantuni": "yurt-tavuk-tantuni",
      "ayran": "yurt-ayran",
      "mercimek çorbası": "yurt-mercimek-corbasi",
      "süzme mercimek çorbası": "yurt-mercimek-corbasi",
      "sebze çorbası": "yurt-sebze-corbasi",
      "karışık salata": "yurt-karisik-salata",
      "fırında sebzeli tavuk ızgara": "yurt-firinda-sebzeli-tavuk",
      "fırında sebzeli tavuk": "yurt-firinda-sebzeli-tavuk",
      "etli dolma": "yurt-etli-dolma",
      "mevsim türlü": "yurt-mevsim-turlu",
      "türlü": "yurt-mevsim-turlu",
      "soslu makarna": "yurt-soslu-makarna",
      "makarna": "yurt-soslu-makarna",
      "sade omlet": "yurt-sade-omlet",
      "omlet": "yurt-sade-omlet",
      "kaşarlı omlet": "yurt-sade-omlet",
      "patates salatası": "yurt-patates-salatasi",
      "çikolatalı kek": "yurt-cikolatali-kek",
      "kek": ["yurt-cikolatali-kek", "yurt-susamli-kek"],
      "beyaz peynir": "yurt-beyaz-peynir",
      "peynir": "yurt-beyaz-peynir",
      "krem peynir": "yurt-beyaz-peynir",
      "siyah / yeşil zeytin": "yurt-zeytin",
      "zeytin": "yurt-zeytin",
      "siyah zeytin": "yurt-zeytin",
      "yeşil zeytin": "yurt-zeytin",
      "çay": "yurt-cay",
      "cay": "yurt-cay",
      "şehriye çorbası": "yurt-sehriye-corbasi",
      "tavuk çöp şiş": "yurt-tavuk-cop-sis",
      "bulgur pilavı": "yurt-bulgur-pilavi",
      "haydari": "yurt-haydari",
      "tulumba": "yurt-tulumba",
      "tereyağı": "yurt-tereyagi",
      "etsiz kuru fasulye": "yurt-etsiz-kuru-fasulye",
      "simit": ["yurt-simit", "yurt-simit-2"],
      "yayla çorbası": ["yurt-yayla-corbasi", "yurt-yayla-corbasi-2"],
      "salçalı mantı": "yurt-salcali-manti",
      "şekerpare": "yurt-sekerpare",
      "rosto köfte": "yurt-rosto-kofte",
      "sulu patates": "yurt-sulu-patates",
      "erişte pilavı": "yurt-eriste-pilavi",
      "labne": "yurt-labne",
      "labne peynir": "yurt-labne",
      "yoğurtlu kabak": "yurt-yogurtlu-kabak",
      "şinitzel": "yurt-sinitzel",
      "nugget": "yurt-nugget",
      "tavuk baget kızartma": "yurt-tavuk-baget-kizartma",
      "ezme": "yurt-ezme",
      "karışık kızartma": "yurt-karisik-kizartma",
      "mevsim soslu karışık kızartma": "yurt-karisik-kizartma",
      "patates kızartma": "yurt-patates-kizartma",
      "patates kızartması": "yurt-patates-kizartma",
      "haşlanmış yumurta": "yurt-haslanmis-yumurta",
      "dere otlu poğaça": "yurt-dere-otlu-pogaca",
      "sosis kızartma": "yurt-sosis-kizartma",
      "sucuklu yumurta": "yurt-sucuklu-yumurta",
      "sucuklu omlet": "yurt-sucuklu-yumurta",
      "bal": "yurt-bal",
      "mozaik kek": "yurt-mozaik-kek"
    }
  };

  const YANINDA = {
    "unievi": [["Ekmek", "ekmek"], ["Su", "su-unievi"]],
    "yurt": [["Ekmek", "ekmek"], ["Su", "su-yurt"]]
  };

  const css = document.createElement("style");
  css.textContent = `
  ul.yemekler li.fotolu::before,
  .yemekler li.fotolu::before,
  li.fotolu::before {
    display: none !important;
  }
  ul.yemekler li.fotolu,
  .yemekler li.fotolu,
  li.fotolu {
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
  }
  .yf-grup {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    flex: none;
  }
  .yf-grup .yf + .yf {
    margin-left: -12px;
  }
  .yf {
    flex: none;
    width: 48px;
    height: 48px;
    border-radius: 13px;
    overflow: hidden;
    background: #fff;
    cursor: zoom-in;
    padding: 0;
    border: 0;
    box-shadow: 0 0 0 2px #fff, 0 4px 12px -4px rgba(40, 60, 140, .35);
    transition: transform .12s;
  }
  .yf:hover {
    transform: scale(1.06);
  }
  .yf img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .yf-metin {
    flex: 1;
    min-width: 0;
  }
  .yf-ek {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    margin: 8px 0 4px;
    font-size: 12.5px;
    font-weight: 700;
    color: var(--soluk, #6b7390);
  }
  .yf-ek button {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    border: 1px solid var(--cizgi, #e6e9f2);
    background: #fff;
    border-radius: 99px;
    padding: 3px 10px 3px 3px;
    font: 700 12.5px var(--font, inherit);
    color: var(--yazi, #141b34);
    cursor: zoom-in;
  }
  .yf-ek img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
  }
  .yf-buyuk {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: grid;
    place-items: center;
    background: rgba(14, 18, 40, .65);
    padding: 20px;
    cursor: zoom-out;
    animation: gir .2s ease;
  }
  .yf-buyuk figure {
    margin: 0;
    background: #fff;
    border-radius: 24px;
    padding: 12px 12px 10px;
    text-align: center;
    width: min(420px, 100%);
    box-shadow: 0 30px 60px -20px rgba(0, 0, 0, .45);
  }
  .yf-buyuk img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 16px;
  }
  .yf-buyuk figcaption {
    font: 800 15px var(--font, system-ui);
    color: #141b34;
    margin-top: 8px;
  }

  /* Admin Butonları */
  .yf-admin-btn {
    margin-left: auto;
    border: 1px dashed #3b5bfd;
    background: rgba(59, 91, 253, .08);
    color: #3b5bfd;
    font: 700 11.5px var(--font, inherit);
    padding: 4px 9px;
    border-radius: 8px;
    cursor: pointer;
    transition: all .15s;
    flex: none;
  }
  .yf-admin-btn:hover {
    background: #3b5bfd;
    color: #fff;
  }

  /* Yönetici Floating Butonu */
  .yf-admin-fab {
    position: fixed;
    bottom: 24px;
    right: 20px;
    z-index: 9990;
    background: linear-gradient(135deg, #1e3a8a, #3b5bfd);
    color: #fff;
    border: 0;
    border-radius: 999px;
    padding: 11px 18px;
    font: 800 13px var(--font, inherit);
    box-shadow: 0 10px 25px -5px rgba(59, 91, 253, .5);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: transform .15s, box-shadow .15s;
  }
  .yf-admin-fab:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 28px -4px rgba(59, 91, 253, .65);
  }

  /* Seçenek Modal */
  .yf-modal-perde {
    position: fixed;
    inset: 0;
    z-index: 10005;
    display: grid;
    place-items: center;
    background: rgba(14, 18, 40, .68);
    padding: 18px;
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    animation: gir .2s ease;
  }
  .yf-modal-kutu {
    background: #fff;
    border-radius: 22px;
    padding: 22px 20px 18px;
    width: min(420px, 100%);
    box-shadow: 0 25px 60px -15px rgba(0, 0, 0, .35);
    font-family: var(--font, system-ui);
  }
  .yf-modal-kutu h3 {
    margin: 0 0 6px;
    font-size: 16.5px;
    font-weight: 800;
    color: #141b34;
  }
  .yf-modal-kutu p {
    margin: 0 0 16px;
    font-size: 13px;
    color: #6b7390;
    line-height: 1.45;
  }
  .yf-secenekler-liste {
    display: grid;
    gap: 8px;
    margin-bottom: 14px;
  }
  .yf-secim-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    text-align: left;
    background: #f8faff;
    border: 1.5px solid #e2e8f0;
    padding: 12px 14px;
    border-radius: 14px;
    cursor: pointer;
    font-size: 14px;
    font-family: inherit;
    color: #1e293b;
    transition: all .15s;
  }
  .yf-secim-btn:hover {
    background: #eef3ff;
    border-color: #3b5bfd;
    color: #3b5bfd;
    transform: translateY(-1px);
  }
  .yf-secim-btn b {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .yf-secim-btn .rozet {
    font-size: 11px;
    font-weight: 700;
    color: #16a34a;
    background: #dcfce7;
    padding: 2px 8px;
    border-radius: 6px;
  }
  .yf-modal-kapat-btn {
    width: 100%;
    border: 0;
    background: #f1f5f9;
    color: #64748b;
    font: 700 13px var(--font, inherit);
    padding: 11px;
    border-radius: 12px;
    cursor: pointer;
    transition: background .15s;
  }
  .yf-modal-kapat-btn:hover {
    background: #e2e8f0;
    color: #334155;
  }

  /* Tüm Yemekler Tam Yönetici Modalı */
  .yf-katalog-perde {
    position: fixed;
    inset: 0;
    z-index: 10010;
    display: grid;
    place-items: center;
    background: rgba(14, 18, 40, .75);
    padding: 16px;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    animation: gir .2s ease;
  }
  .yf-katalog-kutu {
    background: #fff;
    border-radius: 24px;
    width: min(700px, 100%);
    max-height: 88vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 35px 70px -20px rgba(0, 0, 0, .45);
    font-family: var(--font, system-ui);
    overflow: hidden;
  }
  .yf-katalog-ust {
    padding: 20px 22px 14px;
    border-bottom: 1px solid #eef2f6;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: none;
  }
  .yf-katalog-ust h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 800;
    color: #141b34;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .yf-katalog-ust p {
    margin: 2px 0 0;
    font-size: 12.5px;
    color: #6b7390;
  }
  .yf-katalog-kapat {
    border: 0;
    background: #f1f5f9;
    color: #64748b;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    font-size: 20px;
    cursor: pointer;
    display: grid;
    place-items: center;
    transition: all .15s;
  }
  .yf-katalog-kapat:hover {
    background: #fee2e2;
    color: #ef4444;
  }
  .yf-katalog-araclar {
    padding: 12px 22px;
    background: #f8faff;
    border-bottom: 1px solid #eef2f6;
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: none;
  }
  .yf-katalog-ara-kutu {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .yf-katalog-ara {
    flex: 1;
    border: 1.5px solid #e2e8f0;
    background: #fff;
    border-radius: 12px;
    padding: 9px 14px;
    font: 600 13.5px var(--font, inherit);
    color: #1e293b;
  }
  .yf-katalog-filtreler {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  .yf-kat-sekme {
    border: 0;
    background: #e2e8f0;
    color: #475569;
    padding: 6px 13px;
    border-radius: 99px;
    font: 700 12px var(--font, inherit);
    cursor: pointer;
    transition: all .15s;
  }
  .yf-kat-sekme:hover {
    background: #cbd5e1;
  }
  .yf-kat-sekme.aktif {
    background: #3b5bfd;
    color: #fff;
  }
  .yf-yeni-yemek-bar {
    display: flex;
    gap: 8px;
    margin-top: 2px;
  }
  .yf-yeni-yer-sec {
    border: 1.5px solid #cbd5e1;
    background: #fff;
    border-radius: 10px;
    padding: 6px 10px;
    font: 700 12px var(--font, inherit);
    color: #1e293b;
  }
  .yf-yeni-yemek-inp {
    flex: 1;
    border: 1.5px dashed #cbd5e1;
    background: #fff;
    border-radius: 10px;
    padding: 7px 12px;
    font: 500 12.5px var(--font, inherit);
  }
  .yf-yeni-yemek-btn {
    border: 0;
    background: #16a34a;
    color: #fff;
    border-radius: 10px;
    padding: 7px 14px;
    font: 700 12px var(--font, inherit);
    cursor: pointer;
  }
  .yf-katalog-liste {
    flex: 1;
    overflow-y: auto;
    padding: 12px 22px;
    display: grid;
    gap: 8px;
  }
  .yf-katalog-satir {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 12px;
    background: #fff;
    border: 1px solid #eef2f6;
    border-radius: 14px;
    transition: background .12s;
  }
  .yf-katalog-satir:hover {
    background: #f8faff;
  }
  .yf-satir-resim {
    width: 46px;
    height: 46px;
    border-radius: 11px;
    overflow: hidden;
    background: #f1f5f9;
    display: grid;
    place-items: center;
    flex: none;
    cursor: zoom-in;
    box-shadow: 0 2px 6px rgba(0,0,0,.08);
  }
  .yf-satir-resim img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .yf-satir-bilgi {
    flex: 1;
    min-width: 0;
  }
  .yf-satir-ad {
    font-weight: 700;
    font-size: 14px;
    color: #1e293b;
    display: block;
    white-space: normal;
    overflow-wrap: anywhere;
    line-height: 1.25;
  }
  .yf-satir-alt {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 3px;
    flex-wrap: wrap;
  }
  .yf-satir-durum {
    font-size: 11px;
    font-weight: 700;
  }
  .yf-satir-durum.var {
    color: #16a34a;
  }
  .yf-satir-durum.yok {
    color: #94a3b8;
  }

  /* Yer Rozetleri */
  .yf-rozet-yer {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 10.5px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 6px;
  }
  .yf-rozet-yer.yurt {
    background: #f0fdf4;
    color: #15803d;
    border: 1px solid #bbf7d0;
  }
  .yf-rozet-yer.uni {
    background: #eff6ff;
    color: #1d4ed8;
    border: 1px solid #bfdbfe;
  }

  .yf-satir-eylem {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: none;
  }
  .yf-btn-yukle {
    border: 0;
    background: #3b5bfd;
    color: #fff;
    border-radius: 8px;
    padding: 6px 11px;
    font: 700 12px var(--font, inherit);
    cursor: pointer;
    transition: background .15s;
  }
  .yf-btn-yukle:hover {
    background: #2546e5;
  }
  .yf-btn-degistir {
    border: 1px solid #3b5bfd;
    background: #eef3ff;
    color: #3b5bfd;
    border-radius: 8px;
    padding: 5px 10px;
    font: 700 11.5px var(--font, inherit);
    cursor: pointer;
  }
  .yf-btn-sil {
    border: 0;
    background: #fee2e2;
    color: #dc2626;
    border-radius: 8px;
    padding: 5px 9px;
    font: 700 11.5px var(--font, inherit);
    cursor: pointer;
  }
  `;
  document.head.appendChild(css);

  const kucuk = s => String(s || "").toLocaleLowerCase("tr-TR").trim();
  const slugYap = s => kucuk(s).replace(/[^a-z0-9çğıöşü]+/gi, "-").replace(/^-+|-+$/g, "");
  const asciiYap = s => kucuk(s)
    .replace(/ş/g, "s").replace(/ı/g, "i").replace(/ğ/g, "g")
    .replace(/ö/g, "o").replace(/ü/g, "u").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  if (!window.KC_BULUT_FOTOLAR) {
    try {
      localStorage.removeItem("kc-bulut-fotolar");
      window.KC_BULUT_FOTOLAR = {};
    } catch (e) {
      window.KC_BULUT_FOTOLAR = {};
    }
  }

  function resimSrc(g) {
    if (!g) return "";
    if (g.startsWith("data:") || g.startsWith("http://") || g.startsWith("https://")) return g;
    return Y + "k/" + g + ".webp";
  }

  function buyukSrc(g) {
    if (!g) return "";
    if (g.startsWith("data:") || g.startsWith("http://") || g.startsWith("https://")) return g;
    return Y + g + ".webp";
  }

  function buyut(gorsel, yazi) {
    const d = document.createElement("div"); d.className = "yf-buyuk";
    d.innerHTML = `<figure><img src="${buyukSrc(gorsel)}" alt=""><figcaption></figcaption></figure>`;
    d.querySelector("figcaption").textContent = yazi;
    d.onclick = () => d.remove();
    document.body.appendChild(d);
  }

  function menuKimligi(ul) {
    const dg = ul.parentNode.querySelector(".degerlendir");
    return dg ? dg.dataset.menu || "" : "";
  }

  function resimSikistir(file, maxBoyut, kalite, cb) {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > maxBoyut || h > maxBoyut) {
          if (w > h) { h = Math.round((h * maxBoyut) / w); w = maxBoyut; }
          else { w = Math.round((w * maxBoyut) / h); h = maxBoyut; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        let res = canvas.toDataURL("image/webp", kalite);
        if (!res.startsWith("data:image/webp")) res = canvas.toDataURL("image/jpeg", kalite);
        cb(res);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  let seciciInput = null;
  function fotoSeciciAc(yemekAdi, yer, onUploadSuccess) {
    if (!seciciInput) {
      seciciInput = document.createElement("input");
      seciciInput.type = "file";
      seciciInput.accept = "image/*";
      seciciInput.style.display = "none";
      document.body.appendChild(seciciInput);
    }
    seciciInput.onchange = e => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      resimSikistir(file, 650, 0.82, async base64 => {
        if (window.KC_ADMIN && window.KC_ADMIN.yukleYemekFoto) {
          const ok = await window.KC_ADMIN.yukleYemekFoto(yemekAdi, base64, yer);
          if (ok && onUploadSuccess) onUploadSuccess();
        }
      });
      seciciInput.value = "";
    };
    seciciInput.click();
  }

  function seceneklereAyir(yazi) {
    const k = kucuk(yazi);
    if (k.includes("zeytin") || k === "siyah / yeşil zeytin") {
      return [yazi];
    }
    if (!yazi.includes("/")) return [yazi];
    return yazi.split("/").map(p => p.trim()).filter(Boolean);
  }

  // Yurt ve Üniversite Evi tamamen ayrılmıştır!

  /* ---- Fotoğrafı olmayan yemekler için vektörel (SVG) yer tutucu çizimler ---- */
  const VEK_TURLER = [
    ["icecek", /ayran|su\b|çay|süt|kola|meşrubat|şalgam|limonata|komposto|içecek/],
    ["corba", /çorba/],
    ["tatli", /tatlı|baklava|kek|pasta|helva|sütlaç|tulumba|revani|kadayıf|şekerpare|kazandibi|puding|lokma|profiterol|browni|kurabiye|dondurma|irmik|aşure|künefe|ekler|supangle/],
    ["meyve", /meyve|elma|portakal|mandalina|muz|armut|üzüm|karpuz|kavun|şeftali|kiraz|çilek|erik|nar\b|ayva/],
    ["salata", /salata|ezme|cacık|haydari|turşu|zeytin|piyaz|közleme|çoban|havuç tarator|yoğurt/],
    ["yumurta", /yumurta|omlet|menemen|sahanda/],
    ["ekmek", /ekmek|poğaça|börek|simit|çörek|açma|pide|gözleme|lavaş|tost|sandviç|burger|bazlama|katmer|kruvasan/],
    ["peynir", /peynir|labne|kaşar|tereyağ|bal\b|reçel|çikolata|krema|tahin|pekmez|helva|ezo/],
    ["et", /et\b|köfte|tavuk|kebap|kebab|şiş|kavurma|sote|şinitzel|baget|nugget|kıyma|döner|tantuni|bonfile|biftek|piliç|kanat|kızartma|izgara|sosis|sucuk|salam|hindi|balık|orman|tas |musakka|patlıcan|karnıyarık|dolma|sarma/],
    ["pilav", /pilav|makarna|bulgur|erişte|mantı|şehriye|noodle|spagetti|kuskus|arpa|börülce|lazanya|tel şehriye/],
    ["yemek", /fasulye|nohut|mercimek|bezelye|patates|türlü|kabak|ıspanak|pırasa|karnabahar|brokoli|bamya|havuç|enginar|barbunya|lahana|biber|domates|yeşil|taze|kuru|mevsim|etli|etsiz/]
  ];
  const VEK_ARKA = { icecek:"#dbeafe", corba:"#fef3c7", tatli:"#fce7f3", meyve:"#dcfce7", salata:"#d1fae5", yumurta:"#fef9c3", ekmek:"#ffedd5", peynir:"#fef3c7", et:"#fee2e2", pilav:"#fef9c3", yemek:"#ffedd5", varsayilan:"#e0e7ff" };
  const VEK_CIZIM = {
    tabak: '<ellipse cx="100" cy="128" rx="74" ry="26" fill="#fff" stroke="#cbd5e1" stroke-width="3"/><ellipse cx="100" cy="124" rx="54" ry="17" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>',
    kase: '<path d="M30 98h140c0 38-28 62-70 62s-70-24-70-62z" fill="#fff" stroke="#cbd5e1" stroke-width="3"/><ellipse cx="100" cy="98" rx="70" ry="13" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="3"/>',
    corba: () => VEK_CIZIM.kase + '<ellipse cx="100" cy="98" rx="60" ry="9" fill="#f59e0b"/><circle cx="82" cy="97" r="3" fill="#fde68a"/><circle cx="112" cy="99" r="3.5" fill="#fde68a"/><circle cx="98" cy="95" r="2.5" fill="#65a30d"/><path d="M80 78c-8-10 8-14 0-26M104 78c-8-10 8-14 0-26M128 78c-8-10 8-14 0-26" fill="none" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>',
    pilav: () => VEK_CIZIM.tabak + '<path d="M48 120c4-40 30-56 52-56s48 16 52 56c-30 12-74 12-104 0z" fill="#fff7d6" stroke="#eab308" stroke-width="3"/><g fill="#fde68a"><ellipse cx="80" cy="96" rx="9" ry="4"/><ellipse cx="108" cy="88" rx="9" ry="4"/><ellipse cx="124" cy="104" rx="9" ry="4"/><ellipse cx="94" cy="108" rx="9" ry="4"/></g>',
    yemek: () => VEK_CIZIM.kase + '<ellipse cx="100" cy="98" rx="60" ry="9" fill="#dc2626"/><g fill="#fde68a" stroke="#d97706" stroke-width="2"><ellipse cx="80" cy="95" rx="9" ry="5"/><ellipse cx="102" cy="99" rx="9" ry="5"/><ellipse cx="124" cy="95" rx="9" ry="5"/></g><path d="M84 78c-8-10 8-14 0-26M112 78c-8-10 8-14 0-26" fill="none" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>',
    et: () => VEK_CIZIM.tabak + '<path d="M62 112c-6-26 8-48 40-48 26 0 44 16 36 40-6 16-26 22-46 20-14-2-26-4-30-12z" fill="#b45309" stroke="#78350f" stroke-width="3"/><path d="M80 84c14-8 30-6 42 4M78 100c18 8 34 6 48-4" fill="none" stroke="#fbbf24" stroke-width="4" stroke-linecap="round" opacity=".7"/>',
    salata: () => VEK_CIZIM.kase + '<g stroke="#15803d" stroke-width="2"><path d="M50 98c0-26 20-34 30-22 6-16 30-16 34-2 14-10 36 0 36 24z" fill="#4ade80"/></g><circle cx="86" cy="84" r="8" fill="#ef4444"/><circle cx="118" cy="88" r="7" fill="#f97316"/><circle cx="102" cy="78" r="5" fill="#fde047"/>',
    tatli: '<ellipse cx="100" cy="146" rx="64" ry="14" fill="#fff" stroke="#cbd5e1" stroke-width="3"/><path d="M52 138V96l96-0v42c0 8-96 8-96 0z" fill="#fbbf24" stroke="#b45309" stroke-width="3"/><path d="M52 96c0-22 96-22 96 0 0 8-96 8-96 0z" fill="#92400e" stroke="#78350f" stroke-width="3"/><path d="M60 118h80" stroke="#fff7ed" stroke-width="4" stroke-linecap="round" opacity=".8"/><circle cx="100" cy="76" r="9" fill="#ef4444"/><path d="M100 67c2-8 8-10 10-10" stroke="#16a34a" stroke-width="3" fill="none"/>',
    meyve: '<ellipse cx="100" cy="152" rx="52" ry="10" fill="#e2e8f0"/><path d="M100 70c-30-18-62 6-54 44 6 28 30 40 54 30 24 10 48-2 54-30 8-38-24-62-54-44z" fill="#ef4444" stroke="#b91c1c" stroke-width="3"/><path d="M100 70c0-14 6-24 18-30" stroke="#78350f" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M104 56c14-10 28-4 30 4-12 6-24 4-30-4z" fill="#22c55e" stroke="#15803d" stroke-width="2"/>',
    icecek: '<ellipse cx="100" cy="158" rx="40" ry="9" fill="#e2e8f0"/><path d="M62 58h76l-10 98H72z" fill="#e0f2fe" stroke="#94a3b8" stroke-width="3"/><path d="M67 88h66l-6 68H73z" fill="#f8fafc"/><path d="M67 88c16 8 30-8 66 0" fill="none" stroke="#bae6fd" stroke-width="4"/>',
    yumurta: () => VEK_CIZIM.tabak + '<ellipse cx="82" cy="104" rx="30" ry="22" fill="#fff" stroke="#cbd5e1" stroke-width="3"/><circle cx="82" cy="104" r="11" fill="#fbbf24" stroke="#d97706" stroke-width="2"/><ellipse cx="122" cy="108" rx="24" ry="17" fill="#fff" stroke="#cbd5e1" stroke-width="3"/><circle cx="122" cy="108" r="9" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>',
    ekmek: () => VEK_CIZIM.tabak + '<path d="M44 116c-8-30 18-52 56-52s64 22 56 52c-18 12-94 12-112 0z" fill="#f59e0b" stroke="#b45309" stroke-width="3"/><path d="M72 76l-8 30M100 70l-4 36M128 76l8 30" stroke="#fde68a" stroke-width="5" stroke-linecap="round"/>',
    peynir: '<ellipse cx="100" cy="146" rx="62" ry="12" fill="#e2e8f0"/><path d="M42 132l116-44-6-26L42 90z" fill="#fde047" stroke="#ca8a04" stroke-width="3"/><path d="M42 90l110-28" stroke="#facc15" stroke-width="3"/><path d="M42 90v42l116-44" fill="#fef08a" stroke="#ca8a04" stroke-width="3"/><circle cx="78" cy="112" r="6" fill="#fbbf24"/><circle cx="112" cy="102" r="5" fill="#fbbf24"/><circle cx="64" cy="120" r="3.5" fill="#fbbf24"/>',
    varsayilan: () => VEK_CIZIM.tabak + '<path d="M40 60v34c0 8 12 8 12 0V60M46 60v66M148 60c-14 6-20 24-18 40h18V60zM148 100v34" fill="none" stroke="#64748b" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'
  };
  /* ---- Yemeğe özel vektörel çizimler (üstten bakış, fotoğraf yoksa gösterilir) ---- */
  const CZ = (function () {
    const rnd = seed => { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
    const dots = (n, seed, rad, fn, cx = 100, cy = 100) => {
      const r = rnd(seed); let o = "";
      for (let i = 0; i < n; i++) { const a = r() * 6.2832, d = Math.sqrt(r()) * rad; o += fn(cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.95, i, r); }
      return o;
    };
    const rot = (x, y, a) => `transform="rotate(${Math.round(a)} ${x.toFixed(1)} ${y.toFixed(1)})"`;
    const plate = () => '<circle cx="100" cy="100" r="82" fill="#fff" stroke="#dbe3ee" stroke-width="3"/><circle cx="100" cy="100" r="64" fill="#f8fafc" stroke="#e8edf4" stroke-width="2"/>';
    const bowl = c => '<circle cx="100" cy="100" r="82" fill="#fff" stroke="#dbe3ee" stroke-width="3"/><circle cx="100" cy="100" r="68" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="2"/><circle cx="100" cy="100" r="60" fill="' + c + '"/><path d="M58 76a50 50 0 0 1 38-22" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="5" stroke-linecap="round"/>';
    const pea = (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.6" fill="#6cc66d" stroke="#2f8f3a" stroke-width="1.6"/>`;
    const chick = (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5.2" fill="#eac680" stroke="#b98a3a" stroke-width="1.6"/>`;
    const bean = (x, y, i, r) => `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="6.5" ry="3.8" ${rot(x, y, r() * 180)} fill="#fff4de" stroke="#d4b483" stroke-width="1.6"/>`;
    const cube = (f, s, w = 9) => (x, y, i, r) => `<rect x="${(x - w / 2).toFixed(1)}" y="${(y - w / 2).toFixed(1)}" width="${w}" height="${w}" rx="2" ${rot(x, y, r() * 90)} fill="${f}" stroke="${s}" stroke-width="1.6"/>`;
    const meat = cube("#8a4b22", "#5a2b10", 10);
    const carrot = cube("#f97316", "#c2410c", 7);
    const potc = cube("#fbc54d", "#c58a1a", 10);
    const green = (x, y, i, r) => `<path d="M${(x - 9).toFixed(1)} ${y.toFixed(1)}q9 -7 18 0" ${rot(x, y, r() * 180)} fill="none" stroke="#4e9d3b" stroke-width="6" stroke-linecap="round"/>`;
    const herb = (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.1" fill="#3f8f2f"/>`;
    const grain = c => (x, y, i, r) => `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="4" ry="1.9" ${rot(x, y, r() * 180)} fill="${c[0]}" stroke="${c[1]}" stroke-width=".8"/>`;
    const mint = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="3.2" fill="#4caf50" stroke="#2e7d32" stroke-width="1.4" ${rot(x, y, 30)}/>`;
    const lemon = '<path d="M150 56a20 20 0 0 1 14 22z" fill="#fde047" stroke="#ca8a04" stroke-width="2.5"/><path d="M152 64l8 10" stroke="#fef9c3" stroke-width="2"/>';
    const pepperoni = (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7.5" fill="#c2331f" stroke="#8f1d10" stroke-width="1.6"/>`;
    const olive = (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="#27272a"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.4" fill="#d4d4d8"/>`;
    const fry = (x, y, a) => `<rect x="${x - 17}" y="${y - 3.5}" width="34" height="7" rx="2.5" fill="#fbbf24" stroke="#b45309" stroke-width="1.6" ${rot(x, y, a)}/>`;
    const patty = (x, y, rx, ry) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#8b4a22" stroke="#4e2610" stroke-width="2.5"/><path d="M${x - rx * .6} ${y - ry * .5}l${rx * .5} ${ry}M${x - rx * .1} ${y - ry * .7}l${rx * .5} ${ry * 1.3}M${x + rx * .35} ${y - ry * .6}l${rx * .45} ${ry}" stroke="#5a2f12" stroke-width="3" stroke-linecap="round" opacity=".7"/>`;
    const tomSl = (x, y, r = 11) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/><circle cx="${x}" cy="${y}" r="${r * .45}" fill="#fca5a5"/>`;
    const leafBlob = (x, y, c = "#5cb85c", s = "#2f8f3a") => `<path d="M${x - 14} ${y}c0-14 12-18 16-10 6-12 22-4 14 8 10 4 4 16-8 14-8 8-22 2-22-12z" fill="${c}" stroke="${s}" stroke-width="2"/>`;
    const cheeseSl = (x, y, a) => `<rect x="${x - 22}" y="${y - 14}" width="44" height="28" rx="3" fill="#fde047" stroke="#ca8a04" stroke-width="2.2" ${rot(x, y, a)}/><circle cx="${x - 8}" cy="${y}" r="3" fill="#fbbf24" ${rot(x, y, a)}/>`;
    const eggp = (x, y, a, l = 58) => `<rect x="${x - l / 2}" y="${y - 11}" width="${l}" height="22" rx="11" fill="#4c2a5e" stroke="#2e1740" stroke-width="2.2" ${rot(x, y, a)}/><rect x="${x - l / 2 + 8}" y="${y - 6}" width="${l - 20}" height="5" rx="2.5" fill="#7b4a8c" opacity=".7" ${rot(x, y, a)}/>`;

    const B = {}; // ad -> [arka, gövde()]
    const set = (adlar, bg, fn) => adlar.split("|").forEach(a => (B[a] = [bg, fn]));

    // çorbalar
    set("domates çorbası", "#fee2e2", () => bowl("#e5522a") + '<path d="M70 98q12-15 30-6t30 4" stroke="#fff1e6" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M92 106q8 8 18 2" stroke="#fff1e6" stroke-width="4" fill="none" stroke-linecap="round"/>' + dots(10, 3, 48, (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.4" fill="#3b1a0e"/>`) + mint(112, 84));
    set("ezogelin çorbası", "#ffedd5", () => bowl("#e8802a") + dots(60, 5, 52, grain(["#c2410c", "#9a3412"])) + mint(96, 92) + mint(108, 98) + lemon);
    set("tarhana çorbası", "#fef3c7", () => bowl("#d6823f") + dots(50, 7, 52, (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.7" fill="#a85a22"/>`) + '<path d="M72 104q14-12 28-2t28-4" stroke="#f2b783" stroke-width="3.5" fill="none" stroke-linecap="round"/>' + mint(104, 86));
    set("dövme çorbası", "#fef9c3", () => bowl("#f5ebd0") + dots(34, 9, 50, (x, y) => `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="3.6" ry="2" fill="#d9b779" stroke="#b8924c" stroke-width=".8"/>`) + dots(7, 12, 46, (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" fill="#dc2626" opacity=".85"/>`) + mint(100, 96));
    set("ayran aşı çorbası", "#ecfccb", () => bowl("#f4f0d6") + dots(11, 4, 44, chick) + dots(36, 6, 50, herb));
    set("yayla çorbası", "#f0fdf4", () => bowl("#f6f1dc") + dots(40, 8, 52, herb) + dots(12, 3, 50, (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.4" fill="#d9c98d"/>`));
    // etli / sebzeli yemekler
    set("taze fasulye", "#dcfce7", () => bowl("#e0592a") + dots(9, 11, 40, green) + dots(8, 14, 44, (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2" fill="#b6361a"/>`));
    set("etli taze fasulye", "#dcfce7", () => bowl("#e0592a") + dots(8, 11, 40, green) + dots(4, 21, 36, meat));
    set("etli kuru fasulye", "#ffedd5", () => bowl("#c8501f") + dots(17, 13, 44, bean) + dots(4, 23, 34, meat));
    set("etli nohut", "#fef3c7", () => bowl("#d4672a") + dots(17, 15, 44, chick) + dots(4, 25, 34, meat));
    set("bezelye yemeği", "#dcfce7", () => bowl("#e58a3a") + dots(20, 17, 44, pea) + dots(6, 19, 36, carrot) + dots(3, 27, 30, potc));
    set("etli bezelye", "#dcfce7", () => bowl("#e58a3a") + dots(20, 17, 44, pea) + dots(5, 19, 36, carrot) + dots(4, 29, 32, meat));
    set("ıspanak yemeği", "#dcfce7", () => plate() + '<circle cx="100" cy="102" r="44" fill="#3d7a33"/>' + dots(10, 31, 38, (x, y) => leafBlob(x, y, "#4f9a43", "#27642a")) + dots(7, 33, 34, (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="#ef4444"/>`) + '<ellipse cx="124" cy="82" rx="10" ry="6" fill="#fff"/>');
    set("kıymalı ıspanak", "#dcfce7", () => plate() + '<circle cx="100" cy="102" r="44" fill="#3d7a33"/>' + dots(9, 31, 38, (x, y) => leafBlob(x, y, "#4f9a43", "#27642a")) + dots(24, 35, 38, (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.8" fill="#7c4a24"/>`));
    // pilavlar
    const pilav = c => '<circle cx="100" cy="102" r="44" fill="' + c + '" stroke="#d8c680" stroke-width="2.5"/>';
    set("pirinç pilavı", "#fef9c3", () => plate() + pilav("#fffdf0") + dots(70, 41, 40, grain(["#fff", "#e5d9a8"])));
    set("nohutlu pirinç pilavı", "#fef9c3", () => plate() + pilav("#fffdf0") + dots(56, 41, 40, grain(["#fff", "#e5d9a8"])) + dots(10, 43, 36, chick));
    set("sebzeli bulgur pilavı", "#ffedd5", () => plate() + pilav("#d9a05b") + dots(70, 45, 40, grain(["#c68a42", "#8f5e22"])) + dots(9, 47, 36, pea) + dots(6, 49, 34, carrot));
    // etler
    set("ekmek arası köfte", "#ffedd5", () => plate() + '<ellipse cx="100" cy="102" rx="60" ry="38" fill="#f0c98a" stroke="#b9822f" stroke-width="3"/><ellipse cx="100" cy="100" rx="50" ry="29" fill="#fff4dc"/>' + patty(100, 102, 36, 17) + tomSl(70, 88, 8) + leafBlob(128, 90, "#7ccf5a", "#3b8a2a"));
    set("hamburger köfte + patates", "#fee2e2", () => plate() + patty(84, 90, 32, 21) + fry(118, 122, -20) + fry(132, 112, -50) + fry(104, 130, 10) + fry(138, 128, -80));
    set("orman kebabı|orman kebap", "#fee2e2", () => plate() + '<circle cx="100" cy="102" r="46" fill="#b86a30" opacity=".85"/>' + dots(6, 51, 36, meat) + dots(5, 53, 36, potc) + dots(5, 55, 36, carrot) + dots(10, 57, 38, pea));
    set("tebiyeli köfte", "#fef9c3", () => bowl("#f6dc86") + dots(6, 61, 38, (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="10" fill="#8b4a22" stroke="#5a2b10" stroke-width="2"/>`) + dots(14, 63, 48, herb));
    set("kuşbaşılı patlıcan kebap", "#f3e8ff", () => plate() + '<circle cx="100" cy="102" r="46" fill="#d9482b" opacity=".9"/>' + dots(6, 71, 34, cube("#4c2a5e", "#2e1740", 12)) + dots(5, 73, 34, meat) + '<path d="M70 120q20 12 44 4" stroke="#4ca13a" stroke-width="6" fill="none" stroke-linecap="round"/>');
    set("patlıcan musakka", "#f3e8ff", () => plate() + eggp(100, 82, -8, 70) + eggp(100, 114, 6, 70) + '<path d="M70 80q30-10 60 0M70 112q30-10 60 2" stroke="#9a4a1f" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M76 82q24-6 48 0M76 114q24-6 48 0" stroke="#e5522a" stroke-width="5" fill="none" stroke-linecap="round"/>');
    set("patlıcan parmak kebabı", "#f3e8ff", () => plate() + eggp(100, 76, -4, 74) + eggp(100, 100, 0, 74) + eggp(100, 124, 4, 74) + '<path d="M70 76h60M70 100h60M70 124h60" stroke="#8a4b22" stroke-width="6" stroke-linecap="round" opacity=".9"/>');
    set("patates kavurma", "#fef3c7", () => plate() + dots(16, 81, 40, potc) + dots(14, 83, 40, (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.8" fill="#dc2626"/>`) + dots(4, 85, 36, (x, y) => `<rect x="${(x - 5).toFixed(1)}" y="${(y - 2).toFixed(1)}" width="10" height="4" rx="2" fill="#4ca13a"/>`));
    set("tavuk burger", "#ffedd5", () => '<ellipse cx="100" cy="150" rx="62" ry="10" fill="#e2e8f0"/><path d="M42 92c0-34 30-50 58-50s58 16 58 50z" fill="#e8a54b" stroke="#a86a1c" stroke-width="3"/><g fill="#f5d9a0"><ellipse cx="80" cy="66" rx="4" ry="2"/><ellipse cx="104" cy="58" rx="4" ry="2"/><ellipse cx="124" cy="72" rx="4" ry="2"/></g><path d="M38 96q14 12 28 0t28 0 28 0 28 0" fill="#6dbf4a" stroke="#3b8a2a" stroke-width="3"/><rect x="44" y="104" width="112" height="10" rx="5" fill="#ef4444" stroke="#b91c1c" stroke-width="2.5"/><rect x="40" y="114" width="120" height="16" rx="8" fill="#e9a23b" stroke="#a8641a" stroke-width="3"/><path d="M44 132h112c0 14-14 18-56 18s-56-4-56-18z" fill="#e8a54b" stroke="#a86a1c" stroke-width="3"/>');
    set("tavuk döner", "#ffedd5", () => plate() + dots(9, 91, 36, (x, y, i, r) => `<path d="M${(x - 16).toFixed(1)} ${y.toFixed(1)}q16 -12 32 0" ${rot(x, y, r() * 60 - 30)} fill="none" stroke="#c98a4b" stroke-width="7" stroke-linecap="round"/>`) + tomSl(66, 126, 8) + tomSl(80, 132, 8) + leafBlob(132, 128, "#7ccf5a", "#3b8a2a"));
    set("tavuk tantuni", "#fef3c7", () => '<ellipse cx="100" cy="156" rx="64" ry="9" fill="#e2e8f0"/><g ' + rot(100, 100, -28) + '><rect x="34" y="72" width="132" height="56" rx="28" fill="#f4dfb4" stroke="#c49a4b" stroke-width="3"/><ellipse cx="160" cy="100" rx="9" ry="22" fill="#f8eccd" stroke="#c49a4b" stroke-width="2.5"/><ellipse cx="164" cy="100" rx="5" ry="16" fill="#b9602a"/><circle cx="162" cy="90" r="3" fill="#4ca13a"/><circle cx="162" cy="108" r="3" fill="#ef4444"/><rect x="60" y="72" width="40" height="56" fill="#e9d29c" opacity=".55"/></g>');
    set("tavuk kavurma", "#fee2e2", () => plate() + dots(7, 101, 36, (x, y, i, r) => `<rect x="${(x - 13).toFixed(1)}" y="${(y - 8).toFixed(1)}" width="26" height="16" rx="7" ${rot(x, y, r() * 180)} fill="#d79d5a" stroke="#9a6322" stroke-width="2"/>`) + dots(5, 103, 38, (x, y, i, r) => `<rect x="${(x - 8).toFixed(1)}" y="${(y - 2.5).toFixed(1)}" width="16" height="5" rx="2.5" ${rot(x, y, r() * 180)} fill="${i % 2 ? "#ef4444" : "#4ca13a"}"/>`));
    set("tavuk sote", "#fee2e2", () => plate() + '<circle cx="100" cy="102" r="44" fill="#e3683a" opacity=".55"/>' + dots(7, 111, 34, (x, y, i, r) => `<rect x="${(x - 13).toFixed(1)}" y="${(y - 6).toFixed(1)}" width="26" height="12" rx="6" ${rot(x, y, r() * 180)} fill="#e0b070" stroke="#9a6322" stroke-width="2"/>`) + dots(10, 113, 38, (x, y, i, r) => `<rect x="${(x - 9).toFixed(1)}" y="${(y - 2.5).toFixed(1)}" width="18" height="5" rx="2.5" ${rot(x, y, r() * 180)} fill="${["#ef4444", "#4ca13a", "#facc15"][i % 3]}"/>`));
    set("salçalı sosis", "#fee2e2", () => bowl("#d94a24") + dots(7, 121, 36, (x, y) => `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="11" ry="9" fill="#b9573a" stroke="#7a2f18" stroke-width="2.2"/><ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="6" ry="4.5" fill="#d98a6a"/>`));
    set("yoğurtlu mantı", "#fef9c3", () => plate() + dots(16, 131, 38, (x, y, i, r) => `<rect x="${(x - 6).toFixed(1)}" y="${(y - 6).toFixed(1)}" width="12" height="12" rx="3" ${rot(x, y, r() * 90)} fill="#f2dcae" stroke="#c9a566" stroke-width="1.6"/>`) + '<path d="M62 100q18-24 40-16t34 22q-10 18-38 18t-36-24z" fill="#fff" opacity=".92"/>' + dots(6, 133, 34, (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.4" fill="#e0391f"/>`));
    // hamur işleri
    set("karışık pizza", "#ffedd5", () => '<circle cx="100" cy="100" r="86" fill="#c9965a" stroke="#8a5a28" stroke-width="3"/><circle cx="100" cy="100" r="74" fill="#e8a74a" stroke="#b8791f" stroke-width="3"/><circle cx="100" cy="100" r="64" fill="#f3c254"/>' + dots(6, 141, 46, pepperoni) + dots(7, 143, 50, olive) + dots(5, 145, 46, (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="none" stroke="#4ca13a" stroke-width="3"/>`) + dots(10, 147, 50, (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.4" fill="#ef4444"/>`) + '<path d="M100 36v128M36 100h128" stroke="#b8791f" stroke-width="1.5" opacity=".5"/>');
    set("sade poğaça", "#ffedd5", () => plate() + '<ellipse cx="100" cy="102" rx="50" ry="36" fill="#e9a23b" stroke="#a8641a" stroke-width="3"/><ellipse cx="94" cy="92" rx="30" ry="14" fill="#f6c46b" opacity=".8"/>' + dots(14, 151, 34, (x, y) => `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="2.3" ry="1.2" fill="#fff4cf"/>`) + dots(5, 153, 30, (x, y) => `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="1.6" ry="1" fill="#27272a"/>`));
    set("zeytinli / peynirli açma", "#ffedd5", () => plate() + '<path d="M44 112c2-40 26-62 58-60 34 2 56 30 52 66-30 8-70 8-110-6z" fill="#e9a23b" stroke="#a8641a" stroke-width="3"/><path d="M70 100q30-26 62 2M62 114q38-20 80 0" fill="none" stroke="#f6c46b" stroke-width="5" stroke-linecap="round"/>' + olive(88, 92) + olive(108, 84) + olive(122, 98) + '<ellipse cx="100" cy="106" rx="9" ry="5" fill="#fff8e1"/>');
    const borek = (ic) => plate() + [[78, 84, -14], [122, 92, 10], [96, 124, 0]].map(([x, y, a]) => `<rect x="${x - 25}" y="${y - 15}" width="50" height="30" rx="7" ${rot(x, y, a)} fill="#e6a640" stroke="#a8641a" stroke-width="2.6"/><rect x="${x - 25}" y="${y - 8}" width="50" height="8" ${rot(x, y, a)} fill="${ic}" opacity=".9"/>`).join("");
    set("peynirli börek", "#fef3c7", () => borek("#fff8e8"));
    set("ıspanaklı börek", "#ecfccb", () => borek("#5fa84a"));
    set("karışık sebze graten", "#fef3c7", () => '<rect x="22" y="44" width="156" height="112" rx="22" fill="#fff" stroke="#cbd5e1" stroke-width="3"/><rect x="34" y="56" width="132" height="88" rx="14" fill="#f3c254" stroke="#d29a1c" stroke-width="2"/>' + dots(7, 161, 50, (x, y) => `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="12" ry="8" fill="#c98a2c" opacity=".75"/>`) + dots(5, 163, 52, carrot) + dots(4, 165, 50, (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="#4ca13a"/>`));
    // yumurta / peynir
    set("menemen", "#fee2e2", () => bowl("#e9462d") + dots(9, 171, 40, (x, y, i, r) => `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="11" ry="7" ${rot(x, y, r() * 180)} fill="#fde047" stroke="#d4a017" stroke-width="1.8"/>`) + dots(5, 173, 42, (x, y, i, r) => `<rect x="${(x - 8).toFixed(1)}" y="${(y - 2.5).toFixed(1)}" width="16" height="5" rx="2.5" ${rot(x, y, r() * 180)} fill="#4ca13a"/>`));
    set("peynirli omlet", "#fef9c3", () => plate() + '<path d="M40 112c0-40 28-54 60-54s60 14 60 54c-40 18-80 18-120 0z" fill="#fde047" stroke="#d4a017" stroke-width="3"/><path d="M52 104q48-30 96 0" fill="none" stroke="#fef08a" stroke-width="5" stroke-linecap="round"/><path d="M70 106q10 14 22 4t24 6" fill="none" stroke="#fff7d1" stroke-width="5" stroke-linecap="round"/>' + dots(8, 181, 40, herb));
    set("kaşar peynir", "#fef9c3", () => plate() + cheeseSl(84, 84, -10) + cheeseSl(118, 100, 8) + cheeseSl(90, 122, -3));
    // tatlılar
    set("brownie", "#f5e6d8", () => plate() + '<rect x="56" y="56" width="88" height="88" rx="9" ' + rot(100, 100, -8) + ' fill="#4a2512" stroke="#2a1208" stroke-width="3"/><path d="M66 74l22 8-8 18 24 4M104 66l6 22 20-8M76 124l18-6 12 20" fill="none" stroke="#7a4b2a" stroke-width="3" stroke-linecap="round"/>' + dots(5, 191, 28, (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="#c9965a" stroke="#8a5a28" stroke-width="1.5"/>`));
    set("sütlaç", "#fef3c7", () => bowl("#fffaf0") + dots(7, 201, 42, (x, y) => `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="9" ry="6" fill="#d58a35" opacity=".8"/>`) + dots(20, 203, 44, (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.4" fill="#8a4b22"/>`));
    set("tulumba tatlısı|tulumba", "#fef3c7", () => plate() + [[78, 82, -18], [122, 90, 12], [84, 122, 6], [124, 124, -14]].map(([x, y, a]) => `<g ${rot(x, y, a)}><rect x="${x - 27}" y="${y - 10}" width="54" height="20" rx="10" fill="#dd8a22" stroke="#a85a0c" stroke-width="2.6"/><path d="${[-16, -6, 4, 14].map(d => `M${x + d} ${y - 9}v18`).join("")}" stroke="#f6b04a" stroke-width="2.4"/><rect x="${x - 21}" y="${y - 7}" width="40" height="3.5" rx="1.7" fill="#fff" opacity=".4"/></g>`).join(""));
    set("yoğurt", "#f8fafc", () => bowl("#fffdf7") + '<path d="M66 100q16-20 34-8t32 6" fill="none" stroke="#efe6d0" stroke-width="4" stroke-linecap="round"/><circle cx="100" cy="100" r="14" fill="#fff" stroke="#efe6d0" stroke-width="2.5"/>');
    set("meyve", "#dcfce7", () => bowl("#f0fdf4") + '<circle cx="82" cy="86" r="17" fill="#ef4444" stroke="#b91c1c" stroke-width="3"/><path d="M82 70c0-6 3-10 8-12" stroke="#78350f" stroke-width="3" fill="none"/><circle cx="118" cy="92" r="17" fill="#fb923c" stroke="#c2410c" stroke-width="3"/><path d="M104 120q20 18 44-8-8 6-22 6t-22-8z" fill="#fde047" stroke="#ca8a04" stroke-width="3"/>' + dots(7, 211, 12, (x, y) => `<circle cx="${(x - 20).toFixed(1)}" cy="${(y + 28).toFixed(1)}" r="6" fill="#7c3aed" stroke="#5b21b6" stroke-width="1.8"/>`));
    // salatalar
    set("mevsim salata", "#d1fae5", () => bowl("#e9f7e1") + dots(8, 221, 40, (x, y) => leafBlob(x, y, "#78c850", "#3b8a2a")) + dots(3, 223, 32, (x, y) => tomSl(x.toFixed(1), y.toFixed(1), 9)) + dots(4, 225, 38, (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="#bbf7d0" stroke="#15803d" stroke-width="2.2"/>`) + dots(9, 227, 40, (x, y, i, r) => `<path d="M${(x - 7).toFixed(1)} ${y.toFixed(1)}h14" ${rot(x, y, r() * 180)} stroke="#f97316" stroke-width="2.6" stroke-linecap="round"/>`));
    set("çoban salata", "#d1fae5", () => bowl("#f4faee") + dots(12, 231, 42, cube("#ef4444", "#b91c1c", 8)) + dots(11, 233, 42, cube("#bbf7d0", "#15803d", 8)) + dots(8, 235, 42, cube("#f5f5f4", "#a8a29e", 6)) + dots(5, 237, 40, cube("#4ca13a", "#2f6f24", 6)) + dots(18, 239, 46, herb));
    set("makarna salatası", "#fef9c3", () => bowl("#fffaf0") + dots(14, 241, 40, (x, y, i, r) => `<path d="M${(x - 9).toFixed(1)} ${y.toFixed(1)}q4.5 -9 9 0t9 0" ${rot(x, y, r() * 180)} fill="none" stroke="#e9c46a" stroke-width="6" stroke-linecap="round"/>`) + dots(9, 243, 42, (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="#facc15"/>`) + dots(5, 245, 40, cube("#ef4444", "#b91c1c", 7)) + dots(6, 247, 40, pea) + dots(10, 249, 44, herb));
    set("ayran", "#dbeafe", () => '<ellipse cx="100" cy="164" rx="40" ry="9" fill="#e2e8f0"/><path d="M60 46h80l-10 118H70z" fill="#eef6ff" stroke="#94a3b8" stroke-width="3"/><path d="M65 78h70l-7 86H72z" fill="#fff"/><path d="M62 74q10-14 22-6t22-8 22 8 12 6v12H62z" fill="#fff" stroke="#dbeafe" stroke-width="2"/><circle cx="84" cy="80" r="3" fill="#dbeafe"/><circle cx="112" cy="76" r="2.5" fill="#dbeafe"/>');
    return function (ad) {
      const k = String(ad || "").toLocaleLowerCase("tr-TR").trim();
      const e = B[k];
      if (!e) return null;
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" rx="28" fill="' + e[0] + '"/>' + e[1]() + "</svg>";
    };
  })();

  function vektorCiz(ad) {
    const ozel = CZ(ad);
    if (ozel) return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(ozel);
    const k = kucuk(ad);
    let tur = "varsayilan";
    for (const [t, re] of VEK_TURLER) { if (re.test(k)) { tur = t; break; } }
    const c = VEK_CIZIM[tur] || VEK_CIZIM.varsayilan;
    const govde = typeof c === "function" ? c() : (tur === "tatli" || tur === "meyve" || tur === "icecek" || tur === "peynir" ? c : c);
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" rx="28" fill="' + VEK_ARKA[tur] + '"/>' + govde + '</svg>';
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  function fotoBulHepsi(ad, yer = "yurt") {
    if (!ad) return null;
    const bulut = {}; // elle/bulut fotoğraflar kapatıldı: yalnızca sabit tablo (FOTOLAR) kullanılır
    const k = kucuk(ad), sl = slugYap(ad), asc = asciiYap(ad);
    const yerKodu = yer === "unievi" ? "unievi" : "yurt";

    // 1) Yer önekiyle bulutta ara (örn: unievi_etli-kuru-fasulye veya yurt_etli-kuru-fasulye)
    
    // 2) Yerel sabit tabloda ara (FOTOLAR.yurt veya FOTOLAR.unievi)
    const yerTablo = FOTOLAR[yerKodu] || {};
    const v = yerTablo[k] || yerTablo[asc] || yerTablo[sl];
    if (v) return Array.isArray(v) ? v : [v];

    return [vektorCiz(ad)]; // gerçek fotoğraf yoksa vektörel çizim
  }
  function fotoBul(ad, yer = "yurt") {
    const h = fotoBulHepsi(ad, yer);
    return h ? h[0] : null;
  }


  // Gelecek günlerin menüsü gibi başka yerlerde kullanılmak üzere dışa aç
  window.KC_FOTO = { gercekMi: g => !!g && !String(g).startsWith("data:image/svg"), bul: fotoBul, hepsi: fotoBulHepsi, src: resimSrc, ayir: seceneklereAyir, buyut: buyut };

  // "A / B / C" biçimindeki seçenekleri alt alta, ayrı satırlarda göster
  function altAlta(el, yazi) {
    el.textContent = "";
    const p = seceneklereAyir(yazi);
    if (p.length < 2) { el.textContent = yazi; return; }
    const w = document.createElement("span"); w.style.cssText = "display:block;flex:1 1 0;min-width:0"; p.forEach(x => { const d = document.createElement("span"); d.style.display = "block"; d.textContent = x; w.appendChild(d); }); el.appendChild(w);
  }

  function secimDialogGoster(parcalar, fotoBulFn, secildiCallback) {
    const d = document.createElement("div");
    d.className = "yf-modal-perde";
    d.innerHTML = `
      <div class="yf-modal-kutu">
        <h3>📷 Hangi yemek için fotoğraf yüklenecek?</h3>
        <p>Bu satırda <b>${parcalar.length} farklı seçenek</b> bulunuyor. Fotoğrafını yüklemek istediğiniz yemeği seçin:</p>
        <div class="yf-secenekler-liste">
          ${parcalar.map((p, idx) => {
            const varMi = !!fotoBulFn(p);
            return `<button type="button" class="yf-secim-btn" data-idx="${idx}">
              <b>🍽️ ${p}</b>
              ${varMi ? '<span class="rozet">✓ Fotoğraf var</span>' : ''}
            </button>`;
          }).join("")}
        </div>
        <button type="button" class="yf-modal-kapat-btn">Vazgeç</button>
      </div>
    `;
    d.querySelectorAll(".yf-secim-btn").forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.idx, 10);
        d.remove();
        secildiCallback(parcalar[idx]);
      };
    });
    d.querySelector(".yf-modal-kapat-btn").onclick = () => d.remove();
    d.onclick = e => { if (e.target === d) d.remove(); };
    document.body.appendChild(d);
  }

  /* =====================================================================
     TÜM YEMEKLER — YÖNETİCİ FOTOĞRAF PANELİ (Yurt vs Üniversite Ayrımı)
     ===================================================================== */
  let katalogModal = null;
  function tumYemeklerPaneliniAc() {
    if (!window.KC_ADMIN || !window.KC_ADMIN.isAdmin || !window.KC_ADMIN.isAdmin()) {
      alert("Bu paneli yalnızca yönetici (yunusemredemir051@gmail.com) açabilir.");
      return;
    }
    if (katalogModal) katalogModal.remove();

    const d = document.createElement("div");
    d.className = "yf-katalog-perde";
    d.innerHTML = `
      <div class="yf-katalog-kutu">
        <div class="yf-katalog-ust">
          <div>
            <h2>🍽️ Tüm Yemekler – Fotoğraf Paneli</h2>
            <p>KYK Yurtları ve Üniversite Evi yemek fotoğrafları ayrıdır.</p>
          </div>
          <button type="button" class="yf-katalog-kapat" title="Kapat">×</button>
        </div>
        <div class="yf-katalog-araclar">
          <div class="yf-katalog-ara-kutu">
            <input type="text" class="yf-katalog-ara" placeholder="🔍 Yemek ara (örn: Kuru fasulye, Köfte, Çorba, Omlet)...">
          </div>
          <div class="yf-katalog-filtreler">
            <button type="button" class="yf-kat-sekme aktif" data-filtre="yurt">🏠 KYK Yurdu</button>
            <button type="button" class="yf-kat-sekme" data-filtre="uni">🏛️ Üniversite Evi</button>
            <button type="button" class="yf-kat-sekme" data-filtre="hepsi">Tümü</button>
            <button type="button" class="yf-kat-sekme" data-filtre="var">✓ Fotoğraflı</button>
            <button type="button" class="yf-kat-sekme" data-filtre="yok">⏳ Fotoğrafsız</button>
          </div>
          <div class="yf-yeni-yemek-bar">
            <select class="yf-yeni-yer-sec" id="yf-yeni-yer">
              <option value="yurt">🏠 KYK Yurdu</option>
              <option value="unievi">🏛️ Üniversite Evi</option>
            </select>
            <input type="text" class="yf-yeni-yemek-inp" id="yf-yeni-ad" placeholder="Yeni yemek ekle...">
            <button type="button" class="yf-yeni-yemek-btn">+ Fotoğraf Yükle</button>
          </div>
        </div>
        <div class="yf-katalog-liste" id="yf-katalog-liste-govde"></div>
      </div>
    `;

    const kapatBtn = d.querySelector(".yf-katalog-kapat");
    kapatBtn.onclick = () => { d.remove(); katalogModal = null; };
    d.onclick = e => { if (e.target === d) { d.remove(); katalogModal = null; } };

    const araInp = d.querySelector(".yf-katalog-ara");
    const listeGovde = d.querySelector("#yf-katalog-liste-govde");
    let aktifFiltre = "yurt";

    d.querySelectorAll(".yf-kat-sekme").forEach(b => {
      b.onclick = () => {
        d.querySelectorAll(".yf-kat-sekme").forEach(x => x.classList.remove("aktif"));
        b.classList.add("aktif");
        aktifFiltre = b.dataset.filtre;
        ciz();
      };
    });

    const yeniInp = d.querySelector("#yf-yeni-ad");
    const yeniYer = d.querySelector("#yf-yeni-yer");
    const yeniBtn = d.querySelector(".yf-yeni-yemek-btn");
    yeniBtn.onclick = () => {
      const ad = yeniInp.value.trim();
      const yer = yeniYer.value;
      if (!ad) { yeniInp.focus(); return; }
      fotoSeciciAc(ad, yer, () => {
        if (!TUM_KATALOG.find(x => kucuk(x.ad) === kucuk(ad) && x.yer === yer)) {
          TUM_KATALOG.unshift({
            ad,
            yer,
            yerAdi: yer === "unievi" ? "Üniversite Evi" : "KYK Yurdu",
            rozet: yer === "unievi" ? "🏛️ Üniversite Evi" : "🏠 KYK Yurdu"
          });
        }
        yeniInp.value = "";
        ciz();
      });
    };

    function ciz() {
      const q = kucuk(araInp.value);
      let liste = TUM_KATALOG.filter(item => {
        if (q && !kucuk(item.ad).includes(q)) return false;
        const foto = fotoBul(item.ad, item.yer);
        if (aktifFiltre === "yurt") return item.yer === "yurt";
        if (aktifFiltre === "uni") return item.yer === "unievi";
        if (aktifFiltre === "var") return !!foto;
        if (aktifFiltre === "yok") return !foto;
        return true;
      });

      if (!liste.length) {
        listeGovde.innerHTML = `<div style="text-align:center;padding:30px;color:#94a3b8;font-weight:600">Aramanıza uygun yemek bulunamadı.</div>`;
        return;
      }

      listeGovde.innerHTML = liste.map(item => {
        const ad = item.ad;
        const yer = item.yer;
        const foto = fotoBul(ad, yer);
        const varMi = !!foto;
        const resimHtml = varMi
          ? `<img src="${resimSrc(foto)}" alt="${ad}">`
          : `<span style="font-size:22px">🍽️</span>`;

        const rozetClass = yer === "unievi" ? "uni" : "yurt";
        const rozetMetin = yer === "unievi" ? "🏛️ Üniversite Evi" : "🏠 KYK Yurdu";

        return `
          <div class="yf-katalog-satir" data-ad="${ad}" data-yer="${yer}">
            <div class="yf-satir-resim" ${varMi ? `onclick="window.KC_YEMEK_PANEL.buyut('${foto}', '${ad} (${rozetMetin})')"` : ""}>
              ${resimHtml}
            </div>
            <div class="yf-satir-bilgi">
              <span class="yf-satir-ad">${ad}</span>
              <div class="yf-satir-alt">
                <span class="yf-rozet-yer ${rozetClass}">${rozetMetin}</span>
                <span class="yf-satir-durum ${varMi ? "var" : "yok"}">
                  ${varMi ? "✓ Fotoğrafı Var" : "Fotoğraf Yok"}
                </span>
              </div>
            </div>
            <div class="yf-satir-eylem">
              ${varMi ? `
                <button type="button" class="yf-btn-degistir" data-degistir="${ad}" data-yer="${yer}">📷 Değiştir</button>
                <button type="button" class="yf-btn-sil" data-sil="${ad}" data-yer="${yer}">🗑️</button>
              ` : `
                <button type="button" class="yf-btn-yukle" data-yukle="${ad}" data-yer="${yer}">➕ Fotoğraf Yükle</button>
              `}
            </div>
          </div>
        `;
      }).join("");

      listeGovde.querySelectorAll("[data-yukle]").forEach(btn => {
        btn.onclick = () => {
          fotoSeciciAc(btn.dataset.yukle, btn.dataset.yer, () => ciz());
        };
      });

      listeGovde.querySelectorAll("[data-degistir]").forEach(btn => {
        btn.onclick = () => {
          fotoSeciciAc(btn.dataset.degistir, btn.dataset.yer, () => ciz());
        };
      });

      listeGovde.querySelectorAll("[data-sil]").forEach(btn => {
        btn.onclick = async () => {
          const ad = btn.dataset.sil;
          const yer = btn.dataset.yer;
          const yerBaslik = yer === "unievi" ? "Üniversite Evi" : "KYK Yurdu";
          if (!confirm(`"${ad}" (${yerBaslik}) fotoğrafını kaldırmak istediğinize emin misiniz?`)) return;
          if (window.KC_ADMIN && window.KC_ADMIN.silYemekFoto) {
            await window.KC_ADMIN.silYemekFoto(ad, yer);
            ciz();
          }
        };
      });
    }

    araInp.oninput = () => ciz();
    ciz();
    document.body.appendChild(d);
    katalogModal = d;
  }

  window.KC_YEMEK_PANEL = {
    ac: function () {},
    buyut: buyut
  };

  /* =====================================================================
     MENÜ GÜNCELLEME (Yurt ve Üniversite Evi Kendi Görsellerini Alır)
     ===================================================================== */
  function guncelle(ul) {
    const kimlik = menuKimligi(ul);
    const eskiEk = ul.parentNode.querySelector(".yf-ek"); if (eskiEk) eskiEk.remove();
    if (!kimlik) return;
    const [yer, tarih] = kimlik.split("_");
    const genel = yer === "unievi" ? "unievi" : "yurt";

    const yoneticiMi = false; // elle fotoğraf ekleme kaldırıldı

    // (Eski sabit "Tüm Yemekler" düğmesi kaldırıldı; panel Ayarlar > Yönetici bölümünden ve yorum panelinden açılır.)
    const eskiFab = document.getElementById("yf-admin-fab-btn"); if (eskiFab) eskiFab.remove();

    ul.querySelectorAll("li").forEach(li => {
      if (li.classList.contains("bos-menu") || li.classList.contains("not") || li.classList.contains("bos")) return;

      if (!li.dataset.yemek) {
        li.dataset.yemek = li.textContent.replace(/📷 Fotoğraf.*$/i, "").trim();
      }
      const yazi = li.dataset.yemek;
      if (!yazi) return;

      const parcalar = seceneklereAyir(yazi);
      let secenekler = [];

      if (parcalar.length === 1) {
        secenekler = (fotoBulHepsi(parcalar[0], genel) || []).map(f => [parcalar[0], f]);
      } else {
        secenekler = parcalar.flatMap(p => (fotoBulHepsi(p, genel) || []).map(f => [p, f]));
      }

      const eskiGrup = li.querySelector(".yf-grup");
      if (eskiGrup) eskiGrup.remove();
      const eskiMetin = li.querySelector(".yf-metin");
      if (eskiMetin) altAlta(li, yazi);
      const eskiAdminBtn = li.querySelector(".yf-admin-btn");
      if (eskiAdminBtn) eskiAdminBtn.remove();

      if (secenekler.length) {
        li.textContent = "";
        const kutu = document.createElement("span"); kutu.className = "yf-grup";
        secenekler.slice(0, 4).forEach(([ad, g]) => {
          const b = document.createElement("button"); b.className = "yf"; b.type = "button"; b.setAttribute("aria-label", ad + " fotoğrafı");
          b.title = ad;
          b.innerHTML = `<img src="${resimSrc(g)}" alt="${ad}" loading="lazy">`;
          b.onclick = (e) => {
            e.stopPropagation();
            buyut(g, ad);
          };
          kutu.appendChild(b);
        });

        const spanMetin = document.createElement("span");
        spanMetin.className = "yf-metin";
        altAlta(spanMetin, yazi);

        li.appendChild(kutu);
        li.appendChild(spanMetin);
        li.classList.add("fotolu");
      } else {
        li.classList.remove("fotolu");
        altAlta(li, yazi);
      }

      if (yoneticiMi) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "yf-admin-btn";
        btn.innerHTML = "📷 Fotoğraf";
        btn.title = `"${yazi}" için fotoğraf yükle`;
        btn.onclick = (e) => {
          e.stopPropagation();
          const secimParcalari = seceneklereAyir(yazi);
          if (secimParcalari.length > 1) {
            secimDialogGoster(secimParcalari, p => fotoBul(p, genel), secilen => {
              fotoSeciciAc(secilen, genel);
            });
          } else {
            fotoSeciciAc(secimParcalari[0], genel);
          }
        };
        li.appendChild(btn);
      }
    });

    const ek = YANINDA[yer === "unievi" ? "unievi" : "yurt"];
    if (ek && ul.querySelector("li:not(.bos-menu):not(.bos)")) {
      const d = document.createElement("div"); d.className = "yf-ek";
      d.innerHTML = "<span>Menüyle verilir:</span>";
      ek.forEach(([adLabel, dosyaAd]) => {
        const b = document.createElement("button"); b.type = "button";
        b.innerHTML = `<img src="${Y}k/${dosyaAd}.webp" alt="">${adLabel}`;
        b.onclick = () => buyut(dosyaAd, adLabel);
        d.appendChild(b);
      });
      ul.after(d);
    }
  }

  function hepsiniGuncelle() {
    document.querySelectorAll("ul.yemekler").forEach(guncelle);
  }

  function baslat() {
    hepsiniGuncelle();
    document.querySelectorAll("ul.yemekler").forEach(ul => {
      new MutationObserver(() => guncelle(ul)).observe(ul, { childList: true });
      const dg = ul.parentNode.querySelector(".degerlendir");
      if (dg) new MutationObserver(() => guncelle(ul)).observe(dg, { attributes: true, attributeFilter: ["data-menu"] });
    });
    window.addEventListener("kc-fotolar-guncellendi", hepsiniGuncelle);
    window.addEventListener("kc-auth-degisti", hepsiniGuncelle);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", baslat); else baslat();
})();
