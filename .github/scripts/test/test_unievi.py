"""Üniversite Evi menü okuyucusunun testleri.  Çalıştırma (depo kökünden):
    python3 -m unittest discover -s .github/scripts/test -v
"""
import importlib.util, os, shutil, subprocess, sys, tempfile, unittest
from datetime import date

KOK = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
BETIK = os.path.join(KOK, ".github", "scripts", "unievi_guncelle.py")
ORNEK = os.path.join(os.path.dirname(__file__), "unievi-ornek.html")

spec = importlib.util.spec_from_file_location("unievi", BETIK)
u = importlib.util.module_from_spec(spec)
_argv = sys.argv; sys.argv = ["x"]; spec.loader.exec_module(u); sys.argv = _argv


def calistir(veri, sayfa, *ek, ortam=None):
    return subprocess.run([sys.executable, BETIK, "--dosya", sayfa, "--veri", veri,
                           "--foto", os.path.join(KOK, "yemekfoto.js"), "--bugun", "2026-11-17", *ek],
                          capture_output=True, text=True, env={**os.environ, **(ortam or {})})


class Okuma(unittest.TestCase):
    def setUp(self):
        self.gunler = u.ayristir(open(ORNEK, encoding="utf-8").read(), date(2026, 11, 17))

    def test_gunler_ve_adlar(self):
        self.assertEqual(sorted(self.gunler), ["2026-11-16", "2026-11-18", "2026-11-20"])
        self.assertEqual(self.gunler["2026-11-16"]["yemekler"], ["Antep tava", "Makarna", "Mercimek çorbası", "Yoğurt"])

    def test_besin_degerleri(self):
        self.assertEqual(self.gunler["2026-11-16"]["y"][1], [355, 10.7, 47.4, 13.5])
        self.assertEqual(self.gunler["2026-11-18"]["y"][0], [480, 50, None, 30])   # karbonhidrat yazmıyor
        self.assertEqual(self.gunler["2026-11-20"]["y"][3], [60, None, 15, None])  # yalnızca karbonhidrat
        self.assertEqual(self.gunler["2026-11-20"]["t"], [757, 23.3, 96, 31])

    def test_ad_bicimi(self):
        self.assertEqual(u.guzel("İrmik Tatlısı"), "İrmik tatlısı")
        self.assertEqual(u.guzel("EZOGELİN ÇORBA"), "Ezogelin çorbası")
        self.assertEqual(u.guzel("ıhlamur"), "Ihlamur")

    def test_bolum_disindaki_yazilar_okunmaz(self):
        self.assertNotIn("2026-12-12", self.gunler)


class Yazma(unittest.TestCase):
    def setUp(self):
        self.d = tempfile.mkdtemp()
        self.veri = os.path.join(self.d, "veri.js")
        shutil.copy(os.path.join(KOK, "veri.js"), self.veri)
        self.ilk = open(self.veri, encoding="utf-8").read()

    def tearDown(self):
        shutil.rmtree(self.d)

    def sayfa(self, icerik):
        yol = os.path.join(self.d, "sayfa.html")
        open(yol, "w", encoding="utf-8").write(icerik)
        return yol

    def test_ayni_menu_degisiklik_yapmaz(self):
        r = calistir(self.veri, ORNEK)
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(open(self.veri, encoding="utf-8").read(), self.ilk)

    def test_bozuk_sayfa_hicbir_sey_yazmaz(self):
        for icerik in ["<html>Bakımdayız</html>", "", open(ORNEK, encoding="utf-8").read().replace("fm-dish", "yeni-tasarim")]:
            r = calistir(self.veri, self.sayfa(icerik))
            self.assertNotEqual(r.returncode, 0)
            self.assertEqual(open(self.veri, encoding="utf-8").read(), self.ilk)

    def test_yeni_gun_eklenir_eskiler_silinmez(self):
        h = open(ORNEK, encoding="utf-8").read().replace("20 Kasım 2026", "23 Kasım 2026")
        r = calistir(self.veri, self.sayfa(h))
        self.assertEqual(r.returncode, 0, r.stderr)
        sonra = open(self.veri, encoding="utf-8").read()
        once_m, sonra_m = u.menuleri_oku(self.ilk), u.menuleri_oku(sonra)
        self.assertTrue(set(once_m) <= set(sonra_m))
        self.assertEqual(sonra_m["2026-11-23"], ["Kıymalı karnabahar", "Pirinç pilavı", "Döğme çorbası", "Mandalina"])
        self.assertEqual(u.besinleri_oku(sonra)["2026-11-23"]["t"], [757, 23.3, 96, 31])
        # veri.js'in geri kalanı (yurt menüleri vb.) aynen kalmalı
        self.assertEqual(self.ilk.split("const uniEviMenuleri")[0], sonra.split("const uniEviMenuleri")[0])

    def test_eksik_gun_atlanir(self):
        h = open(ORNEK, encoding="utf-8").read()
        bas = h.index('<section class="fm-panel" id="fm-panel-4"')
        h = h[:bas] + h[bas:].replace('<div class="fm-dish">', '<div class="x">', 2).replace("20 Kasım 2026", "23 Kasım 2026")
        r = calistir(self.veri, self.sayfa(h))
        self.assertEqual(r.returncode, 0, r.stderr)
        # Eksik gün yazılmaz; veri.js'te o gün zaten varsa (ör. elle eklendiyse) olduğu gibi kalır.
        # (Önceki hâli "2026-11-23 yok" diye bakıyordu; gerçek veri.js'e o gün eklenince yanlışlıkla bozuluyordu.)
        self.assertEqual(open(self.veri, encoding="utf-8").read(), self.ilk)

    def test_haftasonu_tamsa_siteye_gitmez(self):
        r = calistir(self.veri, "/yok/boyle/dosya", ortam={"UNIEVI_MOD": "haftasonu"})
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIn("zaten tam", r.stdout)


if __name__ == "__main__":
    unittest.main()
