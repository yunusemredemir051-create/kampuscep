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
    "ad": "Tahin helva",
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
      "baklava": "unievi-baklava"
    },
    "unievi_2026-10-21": { "tatlı": "unievi-baklava" },
    "yurt": {
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
      "kek": "yurt-cikolatali-kek",
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
      "tulumba": "yurt-tulumba"
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
      window.KC_BULUT_FOTOLAR = JSON.parse(localStorage.getItem("kc-bulut-fotolar") || "{}");
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
  function fotoBul(ad, yer = "yurt") {
    if (!ad) return null;
    const bulut = window.KC_BULUT_FOTOLAR || {};
    const k = kucuk(ad), sl = slugYap(ad), asc = asciiYap(ad);
    const yerKodu = yer === "unievi" ? "unievi" : "yurt";

    // 1) Yer önekiyle bulutta ara (örn: unievi_etli-kuru-fasulye veya yurt_etli-kuru-fasulye)
    if (bulut[yerKodu + "_" + asc]) return bulut[yerKodu + "_" + asc];
    if (bulut[yerKodu + "_" + sl]) return bulut[yerKodu + "_" + sl];
    if (bulut[yerKodu + "_" + k]) return bulut[yerKodu + "_" + k];

    // 2) Yerel sabit tabloda ara (FOTOLAR.yurt veya FOTOLAR.unievi)
    const yerTablo = FOTOLAR[yerKodu] || {};
    if (yerTablo[k]) return yerTablo[k];
    if (yerTablo[asc]) return yerTablo[asc];
    if (yerTablo[sl]) return yerTablo[sl];

    return null;
  }

  // Gelecek günlerin menüsü gibi başka yerlerde kullanılmak üzere dışa aç
  window.KC_FOTO = { bul: fotoBul, src: resimSrc, ayir: seceneklereAyir, buyut: buyut };

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
    ac: tumYemeklerPaneliniAc,
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

    const yoneticiMi = window.KC_ADMIN && window.KC_ADMIN.isAdmin && window.KC_ADMIN.isAdmin();

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
        const f = fotoBul(parcalar[0], genel);
        if (f) secenekler = [[parcalar[0], f]];
      } else {
        secenekler = parcalar.map(p => [p, fotoBul(p, genel)]).filter(([_, f]) => !!f);
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
