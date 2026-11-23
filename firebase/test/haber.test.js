// Haber tıklanma sayacı kurallarının emulator testleri (haberOkunma). Çalıştırma: npm test
import { test, before, after, beforeEach } from "node:test";
import { readFileSync } from "node:fs";
import { initializeTestEnvironment, assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, writeBatch, serverTimestamp, increment, Timestamp } from "firebase/firestore";

let env;
const anonim = uid => env.authenticatedContext(uid, { firebase: { sign_in_provider: "anonymous" } }).firestore();
const yaz = fn => env.withSecurityRulesDisabled(c => fn(c.firestore()));
const say = (db, uid, slug = "ornek-haber") => {
  const b = writeBatch(db);
  b.set(doc(db, "haberOkunma", slug), { okunma: increment(1) }, { merge: true });
  b.set(doc(db, "haberOkunma", slug, "okuyanlar", uid), { son: serverTimestamp() });
  return b.commit();
};

before(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-kampuscepte",
    firestore: { rules: readFileSync(new URL("../firestore.rules", import.meta.url), "utf8"), host: "127.0.0.1", port: 8080 }
  });
});
after(async () => { await env.cleanup(); });
beforeEach(async () => { await env.clearFirestore(); });

test("herkes sayacı okuyabilir", async () => {
  await assertSucceeds(getDoc(doc(env.unauthenticatedContext().firestore(), "haberOkunma", "ornek-haber")));
});
test("ilk açılış ve başka kişinin açılışı sayılır", async () => {
  await assertSucceeds(say(anonim("a"), "a"));
  await assertSucceeds(say(anonim("b"), "b"));
});
test("aynı kişi 10 saniye içinde tekrar sayamaz, sonra sayabilir", async () => {
  await assertSucceeds(say(anonim("a"), "a"));
  await assertFails(say(anonim("a"), "a"));
  await yaz(db => setDoc(doc(db, "haberOkunma", "ornek-haber", "okuyanlar", "a"), { son: Timestamp.fromMillis(Date.now() - 11e3) }));
  await assertSucceeds(say(anonim("a"), "a"));
});
test("giriş yoksa sayılmaz", async () => {
  const db = env.unauthenticatedContext().firestore();
  await assertFails(setDoc(doc(db, "haberOkunma", "ornek-haber"), { okunma: 1 }));
});
test("sayı elle büyütülemez, okuyan kaydı olmadan artırılamaz", async () => {
  await yaz(db => setDoc(doc(db, "haberOkunma", "ornek-haber"), { okunma: 5 }));
  await assertFails(setDoc(doc(anonim("a"), "haberOkunma", "ornek-haber"), { okunma: 500 }));
  await assertFails(setDoc(doc(anonim("a"), "haberOkunma", "ornek-haber"), { okunma: increment(1) }, { merge: true }));
  const b = writeBatch(anonim("a"));
  b.set(doc(anonim("a"), "haberOkunma", "ornek-haber"), { okunma: increment(10) }, { merge: true });
  b.set(doc(anonim("a"), "haberOkunma", "ornek-haber", "okuyanlar", "a"), { son: serverTimestamp() });
  await assertFails(b.commit());
});
test("başkasının adına sayılamaz", async () => {
  await assertFails(say(anonim("a"), "b"));
});
