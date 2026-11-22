// Çalıştırma (depo kökünden): node testler/yol-ilan.test.mjs yol-arkadasi/index.html
// Ek 6 / K-1: yol-arkadasi/index.html içindeki gecerliIlan'ı ve ilan kartındaki ücret satırını sahte verilerle sınar
import { readFileSync } from "node:fs";
const kaynak = readFileSync(process.argv[2], "utf8");
const parca = kaynak.slice(kaynak.indexOf("const tamSayi"), kaynak.indexOf("const ilanlariOku"));
class Timestamp { toMillis() { return Date.now() + 3600e3; } toDate() { return new Date(this.toMillis()); } }
const gecerliIlan = new Function("Timestamp", parca + "; return gecerliIlan;")(Timestamp);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const iyi = { id: "AbCdEfGhIjKlMnOpQrSt", zaman: new Timestamp(), aranan: 2, ucret: 300, not: "Saat 9'da kapıda",
              yurt: "firat", yer: "otogar", yon: "gidis", sahipUid: "u1", katilanlar: [] };
const durumlar = [
  ["normal ilan", iyi, true],
  ["ücretsiz ilan (0)", { ...iyi, ucret: 0 }, true],
  ["ücret metin (HTML)", { ...iyi, ucret: "<img src=x onerror=alert(1)>" }, false],
  ["ücret sayı-metin", { ...iyi, ucret: "300" }, false],
  ["ücret çok büyük", { ...iyi, ucret: 99999 }, false],
  ["ücret ondalık", { ...iyi, ucret: 12.5 }, false],
  ["zaman metin", { ...iyi, zaman: "yarın" }, false],
  ["zaman yok", { ...iyi, zaman: undefined }, false],
  ["aranan metin", { ...iyi, aranan: "3" }, false],
  ["kimlik HTML", { ...iyi, id: '"><img src=x onerror=alert(1)>' }, false],
  ["kimlik kısa", { ...iyi, id: "abc" }, false],
  ["yön bozuk", { ...iyi, yon: "x" }, false],
  ["katılanlar nesne", { ...iyi, katilanlar: { a: 1 } }, false],
  ["not nesne", { ...iyi, not: { a: 1 } }, false],
];
let hata = 0;
for (const [ad, ilan, beklenen] of durumlar) {
  const sonuc = gecerliIlan(ilan);
  if (sonuc !== beklenen) { hata++; console.log("HATA:", ad, "beklenen", beklenen, "çıkan", sonuc); }
}
// Kaçışlama: denetimi geçse bile ücret satırı düz yazı olmalı
if (esc("<b>") !== "&lt;b&gt;") hata++;
if (!/Taksi ~\$\{esc\(i\.ucret\)\}/.test(kaynak)) { hata++; console.log("HATA: ücret kaçışlanmıyor"); }
console.log(hata ? `${hata} hata` : `${durumlar.length} durum + kaçışlama: hepsi geçti`);
process.exit(hata ? 1 : 0);
