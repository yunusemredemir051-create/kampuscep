"""Ünite konu özeti sayfalarını, dersler.html dizinini, sitemap.xml ve robots.txt dosyalarını üretir.

Kullanım (depo kökünden):  python3 _kaynak/sayfa_olustur.py
Alan adı alınınca SITE_URL'yi değiştirip yeniden çalıştırmak yeterli.

Özetler _kaynak/ozetler/<ders-klasoru>.md dosyalarında durur:
    === <ünite no>
    aciklama: <arama sonuçlarında görünecek tek cümle>
    <markdown metni>
_kaynak klasörü Jekyll tarafından yayımlanmaz (alt çizgiyle başladığı için).
"""
import datetime, html, json, os, re
import markdown

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE_URL = "https://kampuscepte.com.tr"
SITE_ADI = "KampüsCepte"
DERSLER = ["ybs/1/bilisim-sistemleri", "ybs/1/veri-tabanina-giris", "ybs/2/istatistik", "ybs/2/finansal-yonetim", "ybs/2/inkilap-tarihi"]
BOLUM_KISA = {"Yönetim Bilişim Sistemleri": "YBS"}
BUGUN = datetime.date.today().isoformat()

def ozetleri_oku(klasor):
    yol = os.path.join(KOK, "_kaynak", "ozetler", klasor.split("/")[-1] + ".md")
    if not os.path.exists(yol):
        return {}
    parcalar = re.split(r"^=== (\d+)\s*$", open(yol, encoding="utf-8").read(), flags=re.M)
    sonuc = {}
    for i in range(1, len(parcalar), 2):
        govde = parcalar[i + 1].strip()
        m = re.match(r"aciklama:\s*(.+)\n", govde)
        sonuc[int(parcalar[i])] = {"aciklama": m.group(1).strip(), "md": govde[m.end():].strip()}
    return sonuc

def e(s):
    return html.escape(s, quote=True)

ORTAK_HEAD = """<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1, user-scalable=no">
<meta name="theme-color" content="#eef3ff">
<link rel="icon" href="{kok}favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">"""

STIL = """<style>
:root {
  --zemin: #eef3ff; --cam: rgba(255,255,255,.78); --cam-kenar: rgba(255,255,255,.9);
  --golge: 0 10px 30px -12px rgba(40,60,140,.18);
  --mavi: #3b5bfd; --mavi-acik: #e6ebff; --yesil: #16b67a; --yesil-acik: #e2f8ee;
  --turuncu: #ff8a3d; --turuncu-acik: #fff0e5;
  --yazi: #141b34; --soluk: #6b7390; --cizgi: #e6e9f4;
  --font: "Plus Jakarta Sans", "Segoe UI", sans-serif;
}
* { box-sizing: border-box; }
body { margin: 0; font-family: var(--font); color: var(--yazi); background: var(--zemin); -webkit-font-smoothing: antialiased; line-height: 1.7; }
.isik { position: fixed; inset: 0; z-index: -1; pointer-events: none;
  background: radial-gradient(520px 380px at 90% 0%, rgba(255,170,110,.40), transparent 70%),
              radial-gradient(600px 460px at -5% 25%, rgba(120,150,255,.35), transparent 70%), var(--zemin); }
a { color: var(--mavi); }
:focus-visible { outline: 2px solid var(--mavi); outline-offset: 3px; }
.cam { background: var(--cam); border: 1px solid var(--cam-kenar); border-radius: 22px; box-shadow: var(--golge);
  backdrop-filter: blur(18px) saturate(160%); -webkit-backdrop-filter: blur(18px) saturate(160%); }
.kap { max-width: 760px; margin: 0 auto; padding: 16px 16px 60px; }
.ust { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 14px; margin-bottom: 18px; }
.logo { display: flex; align-items: center; gap: 9px; font-weight: 800; font-size: 17px; text-decoration: none; color: var(--yazi); }
.logo-ikon { width: 30px; height: 30px; border-radius: 10px; display: grid; place-items: center; background: linear-gradient(140deg, var(--mavi), #8b5cf6); color: #fff; font-size: 15px; }
.yol { font-size: 13px; font-weight: 600; color: var(--soluk); margin: 0 4px 10px; }
.yol a { color: var(--soluk); text-decoration: none; } .yol a:hover { color: var(--mavi); }
.baslik-alani { padding: 0 4px; }
.baslik-alani small { color: var(--mavi); font-weight: 800; font-size: 13px; }
h1 { margin: 4px 0 8px; font-size: 30px; line-height: 1.2; letter-spacing: -.8px; }
.giris { color: var(--soluk); font-size: 15px; margin: 0 0 16px; }
.butonlar { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 18px; }
.btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 16px; border-radius: 14px; font: 700 14px var(--font);
  border: 1px solid var(--cizgi); background: #fff; color: var(--yazi); text-decoration: none; }
.btn.ana { background: var(--mavi); color: #fff; border-color: var(--mavi); }
.btn svg { width: 18px; height: 18px; }
article.metin { padding: 22px 24px; font-size: 16px; }
article.metin h2 { font-size: 20px; letter-spacing: -.3px; margin: 28px 0 8px; line-height: 1.3; }
article.metin h2:first-child { margin-top: 0; }
article.metin p { margin: 0 0 12px; }
article.metin ul, article.metin ol { margin: 0 0 14px; padding-left: 22px; }
article.metin li { margin-bottom: 6px; }
article.metin strong { font-weight: 800; }
.ust-cizgi { text-decoration: overline; text-decoration-thickness: 1.5px; }
sub, sup { font-size: .72em; }
.gecis { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 18px; }
.gecis a { padding: 14px 16px; text-decoration: none; color: var(--yazi); font-weight: 700; font-size: 14px; }
.gecis a small { display: block; color: var(--soluk); font-weight: 600; font-size: 12px; }
.gecis .sonraki { text-align: right; grid-column: 2; }
.not { font-size: 13px; color: var(--soluk); margin: 18px 4px 0; }
.vitrin { display: none !important; /* AdSense onaylanınca bu satırı sil */ }
.ders { padding: 18px 20px; margin-bottom: 14px; }
.ders h2 { margin: 0 0 2px; font-size: 19px; }
.ders .meta { color: var(--soluk); font-size: 13px; font-weight: 600; margin-bottom: 10px; }
.ders ol { margin: 0; padding-left: 22px; }
.ders li { margin: 4px 0; }
.alt-bilgi { display: flex; flex-wrap: wrap; gap: 8px 18px; justify-content: center; margin: 36px 0 0; font-size: 13px; color: var(--soluk); }
.alt-bilgi a { color: var(--soluk); font-weight: 600; }
@media (max-width: 600px) { h1 { font-size: 24px; } article.metin { padding: 18px 16px; font-size: 15.5px; } .gecis { grid-template-columns: 1fr; } .gecis .sonraki { grid-column: 1; } }
</style>"""

IKON_PDF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M9 14h6M9 17h4"/></svg>'
IKON_TEST = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/></svg>'

def ust_kisim(kok):
    return f"""<div class="isik"></div>
<div class="kap">
  <header class="ust cam">
    <a class="logo" href="{kok}index.html"><img class="logo-ikon" src="/ikonlar/logo-128.png" alt="" width="34" height="34">{SITE_ADI}</a>
    <a href="{kok}dersler.html" style="font-weight:700;font-size:14px;text-decoration:none">Tüm dersler</a>
  </header>"""

def alt_kisim(kok):
    return f"""  <footer class="alt-bilgi">
    <a href="{kok}index.html">Ana sayfa</a>
    <a href="{kok}dersler.html">Ders notları</a>
    <a href="{kok}hakkimizda.html">Hakkımızda ve iletişim</a>
    <a href="{kok}gizlilik.html">Gizlilik ve çerezler</a>
    <span>© 2026 {SITE_ADI}</span>
  </footer>
</div>
<script src="{kok}cerez.js" defer></script>"""

def unite_sayfasi(klasor, ders, u, ozet, onceki, sonraki):
    kok = "../" * (klasor.count("/") + 2)
    bolum = BOLUM_KISA.get(ders["bolum"], ders["bolum"])
    baslik = f"Ünite {u['no']}: {u['ad']}"
    title = f"{u['ad']} – {ders['ad']} konu özeti | {SITE_ADI}"
    adres = f"{SITE_URL}/notlar/{klasor}/unite-{u['no']}.html"
    govde = markdown.markdown(ozet["md"], extensions=["sane_lists"])
    govde = govde.replace('<span class="ust">', '<span class="ust-cizgi">')
    ld = {
        "@context": "https://schema.org", "@type": "Article", "headline": baslik, "description": ozet["aciklama"],
        "inLanguage": "tr", "author": [{"@type": "Person", "name": a} for a in ders["yazarlar"].split(" · ")],
        "publisher": {"@type": "Organization", "name": SITE_ADI}, "mainEntityOfPage": adres,
        "isPartOf": {"@type": "Course", "name": ders["ad"], "provider": {"@type": "Organization", "name": SITE_ADI}},
        "dateModified": BUGUN,
    }
    test_btn = (f'<a class="btn ana" href="{kok}ders.html?d={klasor}#test-{u["no"]}">{IKON_TEST}Kendini test et</a>'
                if u.get("test") else "")
    gecis = '<nav class="gecis" aria-label="Üniteler arası geçiş">'
    if onceki:
        gecis += f'<a class="cam" href="unite-{onceki["no"]}.html"><small>‹ Önceki ünite</small>{e(onceki["ad"])}</a>'
    if sonraki:
        gecis += f'<a class="cam sonraki" href="unite-{sonraki["no"]}.html"><small>Sonraki ünite ›</small>{e(sonraki["ad"])}</a>'
    gecis += "</nav>"
    return f"""<!DOCTYPE html>
<html lang="tr">
<head>
{ORTAK_HEAD.format(kok=kok)}
<title>{e(title)}</title>
<meta name="description" content="{e(ozet['aciklama'])}">
<link rel="canonical" href="{adres}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="{SITE_ADI}">
<meta property="og:title" content="{e(baslik)} · {e(ders['ad'])}">
<meta property="og:description" content="{e(ozet['aciklama'])}">
<meta property="og:url" content="{adres}">
<meta property="og:locale" content="tr_TR">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
{STIL}
</head>
<body>
{ust_kisim(kok)}
  <nav class="yol" aria-label="Konum"><a href="{kok}index.html">Ana sayfa</a> › <a href="{kok}dersler.html">Ders notları</a> › <a href="{kok}ders.html?d={klasor}">{e(ders['ad'])}</a> › Ünite {u['no']}</nav>
  <main>
    <div class="baslik-alani">
      <small>{bolum} {ders['sinif']}. sınıf · {e(ders['ad'])} · Ünite {u['no']}</small>
      <h1>{e(u['ad'])}</h1>
      <p class="giris">{e(ozet['aciklama'])}</p>
    </div>
    <div class="butonlar">
      <a class="btn" href="{u['pdf']}" target="_blank" rel="noopener">{IKON_PDF}Notun tamamı (PDF, {u['sayfa']} sayfa)</a>
      {test_btn}
    </div>
    <article class="metin cam">
{govde}
    </article>
    <div class="vitrin">Sponsorlu alan</div>
    {gecis}
    <p class="not">Bu sayfa, {e(ders['yazarlar'])} tarafından hazırlanan ders notunun özetidir. Şekiller, tablolar ve çözümlü örneklerin tamamı için ünitenin PDF notuna bak.</p>
  </main>
{alt_kisim(kok)}
</body>
</html>
"""

def dersler_sayfasi(dersler):
    kartlar = ""
    for klasor, ders, ozetler in dersler:
        bolum = BOLUM_KISA.get(ders["bolum"], ders["bolum"])
        testli = sum(1 for u in ders["uniteler"] if u.get("test"))
        meta = f"{bolum} {ders['sinif']}. sınıf · {len(ders['uniteler'])} ünite" + (f" · {testli} ünitede test" if testli else "")
        li = "".join(
            f'<li><a href="notlar/{klasor}/unite-{u["no"]}.html">{e(u["ad"])}</a></li>' if u["no"] in ozetler
            else f'<li>{e(u["ad"])}</li>' for u in ders["uniteler"])
        kartlar += f"""    <section class="ders cam">
      <h2><a href="ders.html?d={klasor}" style="color:inherit;text-decoration:none">{e(ders['ad'])}</a></h2>
      <div class="meta">{meta}</div>
      <ol>{li}</ol>
      <div class="butonlar" style="margin:14px 0 0"><a class="btn ana" href="ders.html?d={klasor}">{IKON_TEST}Notlar ve testler</a></div>
    </section>
"""
    aciklama = "Fırat Üniversitesi Yönetim Bilişim Sistemleri ders notları: ünite ünite konu özetleri, PDF notlar ve çözülebilir Kendini Test Et soruları."
    return f"""<!DOCTYPE html>
<html lang="tr">
<head>
{ORTAK_HEAD.format(kok="")}
<title>Ders notları ve konu özetleri | {SITE_ADI}</title>
<meta name="description" content="{aciklama}">
<link rel="canonical" href="{SITE_URL}/dersler.html">
<meta property="og:title" content="Ders notları ve konu özetleri · {SITE_ADI}">
<meta property="og:description" content="{aciklama}">
<meta property="og:url" content="{SITE_URL}/dersler.html">
<meta property="og:locale" content="tr_TR">
{STIL}
</head>
<body>
{ust_kisim("")}
  <nav class="yol" aria-label="Konum"><a href="index.html">Ana sayfa</a> › Ders notları</nav>
  <main>
    <div class="baslik-alani">
      <small>Yönetim Bilişim Sistemleri</small>
      <h1>Ders notları ve konu özetleri</h1>
      <p class="giris">Her ünitenin konu özetini okuyabilir, PDF notunu açabilir ve sorusu olan ünitelerde kendini test edebilirsin. Yeni dersler dönem boyunca eklenecek.</p>
    </div>
{kartlar}  </main>
{alt_kisim("")}
</body>
</html>
"""

def main():
    dersler, adresler = [], [("", "1.0"), ("dersler.html", "0.9"), ("hakkimizda.html", "0.3"), ("gizlilik.html", "0.3")]
    for klasor in DERSLER:
        yol = os.path.join(KOK, "notlar", klasor, "ders.json")
        ders = json.load(open(yol, encoding="utf-8"))
        ozetler = ozetleri_oku(klasor)
        uniteler = ders["uniteler"]
        for i, u in enumerate(uniteler):
            if u["no"] not in ozetler:
                u.pop("ozet", None)
                continue
            u["ozet"] = f"unite-{u['no']}.html"
            sayfa = unite_sayfasi(klasor, ders, u, ozetler[u["no"]], uniteler[i - 1] if i else None,
                                  uniteler[i + 1] if i + 1 < len(uniteler) else None)
            open(os.path.join(KOK, "notlar", klasor, u["ozet"]), "w", encoding="utf-8").write(sayfa)
            adresler.append((f"notlar/{klasor}/{u['ozet']}", "0.8"))
        json.dump(ders, open(yol, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
        dersler.append((klasor, ders, ozetler))
        print(f"{klasor}: {sum(1 for u in uniteler if 'ozet' in u)}/{len(uniteler)} ünite özeti")
    open(os.path.join(KOK, "dersler.html"), "w", encoding="utf-8").write(dersler_sayfasi(dersler))
    xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for adres, oncelik in adresler:
        xml.append(f"  <url><loc>{SITE_URL}/{adres}</loc><lastmod>{BUGUN}</lastmod><priority>{oncelik}</priority></url>")
    xml.append("</urlset>")
    open(os.path.join(KOK, "sitemap.xml"), "w", encoding="utf-8").write("\n".join(xml) + "\n")
    open(os.path.join(KOK, "robots.txt"), "w", encoding="utf-8").write(f"User-agent: *\nAllow: /\n\nSitemap: {SITE_URL}/sitemap.xml\n")
    print("sitemap:", len(adresler), "adres")

if __name__ == "__main__":
    main()

# Yurt menü sayfaları (sitemap'e de eklenir)
import runpy; runpy.run_path("_kaynak/yurt_sayfalari.py")

# Uygulama (PWA) etiketleri
runpy.run_path("_kaynak/pwa_ekle.py")
