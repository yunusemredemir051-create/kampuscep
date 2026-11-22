// Yol Arkadaşı güvenlik kurallarının emulator testleri (Ek 6 / K-1, Y-1).
// Çalıştırma (firebase/test klasöründe, bir kez `npm install` sonrası):  npm test
// Emulator yalnızca demo proje kimliğiyle çalışır (demo-kampuscepte); canlı Firebase'e bağlanmaz.
import { test, before, after, beforeEach } from "node:test";
import { readFileSync } from "node:fs";
import { initializeTestEnvironment, assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, updateDoc, deleteDoc, writeBatch, serverTimestamp, Timestamp } from "firebase/firestore";

let env;
const GUN = 864e5;
const once = ms => Timestamp.fromMillis(Date.now() - ms);
const sonra = ms => Timestamp.fromMillis(Date.now() + ms);
const L1 = "AAAAAAAAAAAAAAAAAAA1", L2 = "AAAAAAAAAAAAAAAAAAA2", LE = "AAAAAAAAAAAAAAAAAAE1";

const google = uid => env.authenticatedContext(uid, { firebase: { sign_in_provider: "google.com" } }).firestore();
const anonim = uid => env.authenticatedContext(uid, { firebase: { sign_in_provider: "anonymous" } }).firestore();
const yaz = fn => env.withSecurityRulesDisabled(c => fn(c.firestore()));

const ilan = (sahipUid, yurt, yurtTur, ek = {}) => ({
  sahipUid, yurt, yurtTur, yon: "gidis", yer: "otogar", zaman: sonra(3600e3),
  aranan: 2, ucret: 300, not: "Kapıda buluşuruz", katilanlar: [], olusturma: Timestamp.now(), ...ek
});

before(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-kampuscepte",
    firestore: { rules: readFileSync(new URL("../firestore.rules", import.meta.url), "utf8"), host: "127.0.0.1", port: 8080 }
  });
});
after(async () => { await env.cleanup(); });
beforeEach(async () => {
  await env.clearFirestore();
  await yaz(async db => {
    await setDoc(doc(db, "turKilidi", "sahip"), { tur: "kiz", zaman: once(40 * GUN) });
    await setDoc(doc(db, "kullanicilar", "sahip"), { yurt: "harput", tur: "kiz" });
    await setDoc(doc(db, "turKilidi", "ayse"), { tur: "kiz", zaman: once(40 * GUN) });
    await setDoc(doc(db, "kullanicilar", "ayse"), { yurt: "sare-ana", tur: "kiz" });
    await setDoc(doc(db, "turKilidi", "ali"), { tur: "erkek", zaman: once(GUN) });
    await setDoc(doc(db, "kullanicilar", "ali"), { yurt: "firat", tur: "erkek" });
    await setDoc(doc(db, "yolculuklar", L1), ilan("sahip", "harput", "kiz"));
    await setDoc(doc(db, "yolculuklar", L2), ilan("sahip", "harput", "kiz"));
    await setDoc(doc(db, "yolculuklar", L1, "iletisim", "sahip"), { ad: "Zeynep", tel: "905551112233" });
  });
});

// Katılma: ilan güncellemesi + sınır kaydı aynı toplu yazımda
function katil(db, uid, ilanId, adet = 1, sinirIlan = ilanId, katilanlar = []) {
  const b = writeBatch(db);
  b.update(doc(db, "yolculuklar", ilanId), { katilanlar: [...katilanlar, uid] });
  b.set(doc(db, "katilimSinir", uid), { son: serverTimestamp(), adet, ilan: sinirIlan });
  return b.commit();
}

/* ---------------- Y-1 (a): kız/erkek kilidi ---------------- */

test("yeni kullanıcı: kilit ve profil birlikte yazılır", async () => {
  const db = google("yeni");
  const b = writeBatch(db);
  b.set(doc(db, "turKilidi", "yeni"), { tur: "kiz", zaman: serverTimestamp() });
  b.set(doc(db, "kullanicilar", "yeni"), { yurt: "harput", tur: "kiz" });
  await assertSucceeds(b.commit());
});

test("kilitsiz profil yazılamaz", async () => {
  await assertFails(setDoc(doc(google("yeni"), "kullanicilar", "yeni"), { yurt: "harput", tur: "kiz" }));
});

test("eski kullanıcı: mevcut profile göre kilit bir kez oluşturulur", async () => {
  await yaz(db => setDoc(doc(db, "kullanicilar", "eski"), { yurt: "firat", tur: "erkek" }));
  await assertSucceeds(setDoc(doc(google("eski"), "turKilidi", "eski"), { tur: "erkek", zaman: serverTimestamp() }));
});

test("kilit istemci saatiyle yazılamaz (zaman sunucu saati olmalı)", async () => {
  await assertFails(setDoc(doc(google("yeni"), "turKilidi", "yeni"), { tur: "kiz", zaman: once(60 * GUN) }));
});

test("anonim oturum kilit yazamaz", async () => {
  await assertFails(setDoc(doc(anonim("anon"), "turKilidi", "anon"), { tur: "kiz", zaman: serverTimestamp() }));
});

test("başkasının kilidi yazılamaz ve okunamaz", async () => {
  await assertFails(setDoc(doc(google("ali"), "turKilidi", "ayse"), { tur: "erkek", zaman: serverTimestamp() }));
  await assertFails(getDoc(doc(google("ali"), "turKilidi", "ayse")));
});

test("profil kilitten farklı türe geçemez", async () => {
  await assertFails(setDoc(doc(google("ali"), "kullanicilar", "ali"), { yurt: "harput", tur: "kiz" }));
});

test("aynı türde başka yurda geçmek serbest", async () => {
  await assertSucceeds(setDoc(doc(google("ali"), "kullanicilar", "ali"), { yurt: "ahmet-kabakli", tur: "erkek" }));
});

test("30 gün dolmadan tür değiştirilemez", async () => {
  const db = google("ali");   // kilidi 1 gün önce
  const b = writeBatch(db);
  b.set(doc(db, "turKilidi", "ali"), { tur: "kiz", zaman: serverTimestamp() });
  b.set(doc(db, "kullanicilar", "ali"), { yurt: "harput", tur: "kiz" });
  await assertFails(b.commit());
});

test("30 gün dolunca tür değiştirilebilir", async () => {
  const db = google("ayse");  // kilidi 40 gün önce
  const b = writeBatch(db);
  b.set(doc(db, "turKilidi", "ayse"), { tur: "erkek", zaman: serverTimestamp() });
  b.set(doc(db, "kullanicilar", "ayse"), { yurt: "firat", tur: "erkek" });
  await assertSucceeds(b.commit());
});

test("kilit silinemez; profil silinip yeniden açılınca kilit geçerli kalır", async () => {
  const db = google("ali");
  await assertFails(deleteDoc(doc(db, "turKilidi", "ali")));
  await assertSucceeds(deleteDoc(doc(db, "kullanicilar", "ali")));
  await assertFails(setDoc(doc(db, "kullanicilar", "ali"), { yurt: "harput", tur: "kiz" }));
});

/* ---------------- Y-1 (b): katılma sınırı ---------------- */

test("normal katılma: ilan + sınır kaydı birlikte", async () => {
  await assertSucceeds(katil(google("ayse"), "ayse", L1));
});

test("sınır kaydı olmadan katılınamaz", async () => {
  await assertFails(updateDoc(doc(google("ayse"), "yolculuklar", L1), { katilanlar: ["ayse"] }));
});

test("sınır kaydı başka ilanı gösteriyorsa katılınamaz", async () => {
  await assertFails(katil(google("ayse"), "ayse", L1, 1, L2));
});

test("tek sınır yazımıyla iki ilana birden katılınamaz", async () => {
  const db = google("ayse");
  const b = writeBatch(db);
  b.update(doc(db, "yolculuklar", L1), { katilanlar: ["ayse"] });
  b.update(doc(db, "yolculuklar", L2), { katilanlar: ["ayse"] });
  b.set(doc(db, "katilimSinir", "ayse"), { son: serverTimestamp(), adet: 1, ilan: L1 });
  await assertFails(b.commit());
});

test("aynı gün 5. katılma olur, 6. olmaz", async () => {
  await yaz(db => setDoc(doc(db, "katilimSinir", "ayse"), { son: once(11e3), adet: 4, ilan: L2 }));
  await assertSucceeds(katil(google("ayse"), "ayse", L1, 5));
  await yaz(db => setDoc(doc(db, "katilimSinir", "ayse"), { son: once(11e3), adet: 5, ilan: L1 }));
  await assertFails(katil(google("ayse"), "ayse", L2, 6));
});

test("sayaç geriye çekilemez (aynı gün adet 1'e dönemez)", async () => {
  await yaz(db => setDoc(doc(db, "katilimSinir", "ayse"), { son: once(11e3), adet: 5, ilan: L2 }));
  await assertFails(katil(google("ayse"), "ayse", L1, 1));
});

test("10 saniye dolmadan yeniden katılınamaz", async () => {
  await yaz(db => setDoc(doc(db, "katilimSinir", "ayse"), { son: once(2e3), adet: 1, ilan: L2 }));
  await assertFails(katil(google("ayse"), "ayse", L1, 2));
});

test("yeni günde sayaç 1'den başlar", async () => {
  await yaz(db => setDoc(doc(db, "katilimSinir", "ayse"), { son: once(2 * GUN), adet: 5, ilan: L2 }));
  await assertSucceeds(katil(google("ayse"), "ayse", L1, 1));
});

test("sınır kaydı silinemez", async () => {
  await yaz(db => setDoc(doc(db, "katilimSinir", "ayse"), { son: once(11e3), adet: 5, ilan: L2 }));
  await assertFails(deleteDoc(doc(google("ayse"), "katilimSinir", "ayse")));
});

test("erkek kilidiyle kız yurdu ilanına katılınamaz", async () => {
  await assertFails(katil(google("ali"), "ali", L1));
});

test("profilde tür değiştirmek kilidi aşmaya yetmez", async () => {
  await yaz(db => setDoc(doc(db, "kullanicilar", "ali"), { yurt: "harput", tur: "kiz" }));   // eski kural döneminden kalma
  await assertFails(katil(google("ali"), "ali", L1));
});

test("ayrılma serbest; katılan iletişimi okur, dışarıdaki okuyamaz", async () => {
  const db = google("ayse");
  await assertSucceeds(katil(db, "ayse", L1));
  await assertSucceeds(getDoc(doc(db, "yolculuklar", L1, "iletisim", "sahip")));
  await assertFails(getDoc(doc(google("ali"), "yolculuklar", L1, "iletisim", "sahip")));
  await assertSucceeds(updateDoc(doc(db, "yolculuklar", L1), { katilanlar: [] }));
});

/* ---------------- İlan açma ve K-1 ---------------- */

test("ilan açma: kilitteki türle olur, diğer türle olmaz", async () => {
  await assertSucceeds(setDoc(doc(google("ali"), "yolculuklar", LE), ilan("ali", "firat", "erkek", { olusturma: serverTimestamp() })));
  await assertFails(setDoc(doc(google("ali"), "yolculuklar", "AAAAAAAAAAAAAAAAAAE2"), ilan("ali", "harput", "kiz", { olusturma: serverTimestamp() })));
});

test("K-1: ilan kimliği otomatik biçimde olmalı", async () => {
  await assertFails(setDoc(doc(google("ali"), "yolculuklar", "kotu-kimlik"), ilan("ali", "firat", "erkek", { olusturma: serverTimestamp() })));
});

test("K-1: ilan sahibi ücreti ve zamanı yalnızca geçerli değerlerle güncelleyebilir", async () => {
  const db = google("sahip");
  await assertSucceeds(updateDoc(doc(db, "yolculuklar", L1), { ucret: 450, not: "Biraz geç kalabilirim" }));
  await assertFails(updateDoc(doc(db, "yolculuklar", L1), { ucret: "<b>450</b>" }));
  await assertFails(updateDoc(doc(db, "yolculuklar", L1), { ucret: 99999 }));
  await assertFails(updateDoc(doc(db, "yolculuklar", L1), { zaman: "yarın" }));
  await assertFails(updateDoc(doc(db, "yolculuklar", L1), { zaman: sonra(60 * GUN) }));
});
