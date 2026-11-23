# Haberler bölümünü üretir: .github/scripts/haber/haberler.json -> haberler/*.html, haberler/index.html, haberler/veri.js
# Yeni haber: haberler.json'un başına ekle (alanlar aşağıda), görseli gorseller/haberler/ içine koy,
# depo kökünden çalıştır:  python3 .github/scripts/haber/haber_uret.py
# Alanlar: gizli (isteğe bağlı, true = listelenmez), slug, baslik, tarih ("23 Kasım 2026"), iso ("2026-11-23"), saat (isteğe bağlı, "10.45"), kategori,
#          gorsel, w, h, alt, gorsel_kaynak (isteğe bağlı), ozet, govde (HTML parçaları listesi), kaynak
import json, html, re
from urllib.parse import quote

R = ''
TUM = json.load(open(R + '.github/scripts/haber/haberler.json', encoding='utf-8'))
# "gizli": true olan haber hiçbir listede, aramada ve sitemap'te görünmez; sayfası yalnızca doğrudan linkle açılır (noindex)
H = [n for n in TUM if not n.get('gizli')]
CSS_V, JS_V, KC_V = '1', '1', '6'
SIRA = ['Üniversite', 'Kampüs', 'Eğitim', 'Duyurular', 'Öğrenci Yaşamı', 'Akademik Gelişmeler', 'Etkinlikler', 'Teknoloji', 'Kariyer ve Gelecek', 'Psikoloji ve Kişisel Gelişim', 'Sağlıklı Yaşam', 'Türkiye', 'Dünya', 'Spor']
TR = str.maketrans('çğıöşüÇĞİÖŞÜ', 'cgiosuCGIOSU')
def kod(k): return re.sub(r'[^a-z0-9]+', '-', k.translate(TR).lower()).strip('-')
KATS = [k for k in SIRA if any(h['kategori'] == k for h in H)]
e = html.escape

src = open(R + 'hakkimizda.html', encoding='utf-8').read()
head = src.split('<body>')[0]
head = (head.replace('href="favicon.svg"', 'href="/favicon.svg"').replace('href="manifest.webmanifest"', 'href="/manifest.webmanifest"')
        .replace('href="ikonlar/', 'href="/ikonlar/').replace('register("sw.js",{scope:"./"})', 'register("/sw.js",{scope:"/"})'))
head = re.sub(r'<link rel="stylesheet" href="/kc.css\?v=\d+">\n<style>.*?</style>',
              f'<link rel="stylesheet" href="/kc.css?v={KC_V}">\n<link rel="preload" href="/yazitipi/source-serif-4-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin>\n<link rel="stylesheet" href="/haber.css?v={CSS_V}">',
              head, count=1, flags=re.S)
assert 'haber.css' in head, 'şablon değişmiş'

IK = {
 'ara': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
 'pay': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V4M8 8l4-4 4 4"/><path d="M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"/></svg>',
 'link': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
}

def mast(aktif=''):
    kat = ''.join(f'<a href="/haberler/?kategori={kod(k)}"{" class=\"aktif\"" if aktif == k else ""}>{k}</a>' for k in KATS)
    return f'''<header class="hb-mast"><div class="hb-ic">
  <a class="hb-marka" href="/haberler/"><img src="/favicon.svg" alt="" width="26" height="26"><b>KampüsCepte</b><span>Haberler</span></a>
  <span class="hb-tarih" id="hb-tarih"></span>
  <a class="hb-uygulama" href="/">Uygulamaya dön</a>
  <button class="hb-dugme" type="button" id="hb-ara-ac" aria-label="Haberlerde ara" aria-expanded="false" aria-controls="hb-arama">{IK["ara"]}</button>
</div></header>
<form class="hb-arama" id="hb-arama" role="search" action="/haberler/" hidden><div class="hb-ic">
  <label class="hb-gizli" for="hb-ara-kutu">Haberlerde ara</label>
  <input id="hb-ara-kutu" name="ara" type="search" placeholder="Haberlerde ara" autocomplete="off"><button type="submit">Ara</button>
</div></form>
<nav class="hb-kat" aria-label="Haber kategorileri"><div class="hb-ic"><a href="/haberler/"{" class=\"aktif\"" if aktif == "Tümü" else ""}>Tümü</a>{kat}</div></nav>'''

ALT = '''<footer class="hb-altbilgi"><div class="hb-ic"><b>KampüsCepte Haberler</b><a href="/">Uygulamaya dön</a><a href="/hakkimizda.html">Hakkımızda</a><a href="/iletisim.html">Haber ihbarı ve iletişim</a><a href="/gizlilik.html">Gizlilik</a><a href="/kullanim-kosullari.html">Kullanım koşulları</a></div></footer>'''
SON = f'<script src="/haberler/veri.js?v={JS_V}"></script>\n<script src="/haber.js?v={JS_V}"></script>\n<script defer src="/geri.js?v=2"></script>\n</body>\n</html>\n'

def zaman(n): return f'<time class="hb-zaman" datetime="{n["iso"]}">{n["tarih"]}{(", " + n["saat"]) if n.get("saat") else ""}</time>'
def gorsel(n, ilk=False):
    lz = '' if ilk else ' loading="lazy"'
    fp = ' fetchpriority="high"' if ilk else ''
    return f'<a class="hb-gorsel" href="/haberler/{n["slug"]}.html" tabindex="-1" aria-hidden="true"><img src="/gorseller/haberler/{n["gorsel"]}" alt="" width="{n["w"]}" height="{n["h"]}"{lz}{fp}></a>'
def etiket(n): return f'<a class="hb-etiket" href="/haberler/?kategori={kod(n["kategori"])}">{n["kategori"]}</a>'
def bag(n): return f'<a href="/haberler/{n["slug"]}.html">{n["baslik"]}</a>'
def kart(n): return f'<article class="hb-kart">{gorsel(n)}<div>{etiket(n)}<h3 class="hb-baslik">{bag(n)}</h3><p class="hb-spot">{n["ozet"]}</p>{zaman(n)}</div></article>'
def satir(n): return f'<article class="hb-satir">{gorsel(n)}<div>{etiket(n)}<h3 class="hb-baslik">{bag(n)}</h3><p class="hb-spot">{n["ozet"]}</p>{zaman(n)}</div></article>'

def sayfa(title, desc, canon, body, extra=''):
    h = head.replace('<title>Hakkımızda – KampüsCepte</title>', f'<title>{e(title)}</title>')
    h = h.replace('<meta name="description" content="KampüsCepte nedir, kim hazırlıyor, ders notları nasıl yazılıyor ve site nasıl ücretsiz kalıyor.">', f'<meta name="description" content="{e(desc)}">')
    h = h.replace('<link rel="canonical" href="https://kampuscepte.com.tr/hakkimizda.html">', f'<link rel="canonical" href="https://kampuscepte.com.tr{canon}">' + extra)
    assert 'Hakkımızda' not in h
    return h + '<body>\n' + body + '\n' + ALT + '\n' + SON

def kaynak_satiri(n):
    if n['kaynak'] == 'KampüsCepte Haber Merkezi': return 'Bu içerik KampüsCepte Haber Merkezi tarafından hazırlanmıştır.'
    return f'<b>Kaynak:</b> {n["kaynak"]}. Haber KampüsCepte Haber Merkezi tarafından hazırlanmıştır.'

def okuma(n): return max(1, round(len(re.sub(r'<[^>]+>', ' ', ' '.join(n['govde'])).split()) / 200))

# ---------- Ana sayfa ----------
m, ikinci, akis = H[0], H[1:4], H[4:]
gundem = ''.join(bag(n) for n in H[:4])
son = ''.join(f'<li><div><h3 class="hb-baslik">{bag(n)}</h3>{zaman(n)}</div></li>' for n in H[:5])
body = f'''{mast("Tümü")}
<div class="hb-gundem" aria-label="Gündem"><div class="hb-ic"><strong>Gündem</strong>{gundem}</div></div>
<main class="hb-sayfa"><div class="hb-ic" id="hb-icerik">
  <h1 class="hb-gizli">KampüsCepte Haberler</h1>
  <div class="hb-ust">
    <article class="hb-manset">{gorsel(m, True)}<div>{etiket(m)}<h2 class="hb-baslik">{bag(m)}</h2><p class="hb-spot">{m["ozet"]}</p>{zaman(m)}</div></article>
    <aside class="hb-son"><div class="hb-bolum-b"><h2>Son haberler</h2></div><ol>{son}</ol></aside>
  </div>
  {'<div class="hb-ikinci">' + ''.join(kart(n) for n in ikinci) + '</div>' if ikinci else ''}
  {'<section class="hb-akis"><div class="hb-bolum-b"><h2>Diğer haberler</h2></div>' + ''.join(satir(n) for n in akis) + '</section>' if akis else ''}
</div></main>'''
open(R + 'haberler/index.html', 'w', encoding='utf-8').write(sayfa('KampüsCepte Haberler – Elazığ\'da üniversite ve kampüs haberleri',
    "Elazığ'daki üniversite hayatından haberler: akademik gelişmeler, öğrenci başarıları, etkinlikler, teknoloji ve kampüs gündemi.", '/haberler/', body,
    '\n<meta property="og:type" content="website">\n<meta property="og:title" content="KampüsCepte Haberler">\n<meta property="og:url" content="https://kampuscepte.com.tr/haberler/">'))

# ---------- Haber detay ----------
for n in TUM:
    url = f'https://kampuscepte.com.tr/haberler/{n["slug"]}.html'
    ilgili = [x for x in H if x is not n and x['kategori'] == n['kategori']] + [x for x in H if x is not n and x['kategori'] != n['kategori']]
    iso_dt = n['iso'] + (('T' + n['saat'].replace('.', ':') + ':00+03:00') if n.get('saat') else '')
    ld = json.dumps({"@context": "https://schema.org", "@type": "NewsArticle", "headline": n["baslik"], "description": n["ozet"],
        "datePublished": iso_dt, "dateModified": iso_dt, "articleSection": n["kategori"],
        "image": ["https://kampuscepte.com.tr/gorseller/haberler/" + n["gorsel"]],
        "author": {"@type": "Organization", "name": "KampüsCepte Haber Merkezi", "url": "https://kampuscepte.com.tr/hakkimizda.html"},
        "publisher": {"@type": "Organization", "name": "KampüsCepte", "logo": {"@type": "ImageObject", "url": "https://kampuscepte.com.tr/ikonlar/ikon-512.png"}},
        "mainEntityOfPage": url}, ensure_ascii=False)
    og = ('\n<meta name="robots" content="noindex, nofollow">' if n.get('gizli') else '') + (f'\n<meta property="og:type" content="article">\n<meta property="og:site_name" content="KampüsCepte Haberler">\n<meta property="og:title" content="{e(n["baslik"])}">'
          f'\n<meta property="og:description" content="{e(n["ozet"])}">\n<meta property="og:image" content="https://kampuscepte.com.tr/gorseller/haberler/{n["gorsel"]}">'
          f'\n<meta property="og:url" content="{url}">\n<meta property="article:published_time" content="{iso_dt}">\n<meta property="article:section" content="{e(n["kategori"])}">'
          f'\n<meta name="twitter:card" content="summary_large_image">\n<script type="application/ld+json">{ld}</script>')
    pay = f'<div class="hb-paylas"><button type="button" data-paylas>{IK["pay"]}Paylaş</button><button type="button" data-kopyala aria-label="Bağlantıyı kopyala">{IK["link"]}<span>Kopyala</span></button></div>'
    body = f'''{mast(n["kategori"])}
<main class="hb-detay"><div class="hb-ic">
<nav class="hb-yol" aria-label="Konum"><a href="/haberler/">Haberler</a> › <a href="/haberler/?kategori={kod(n["kategori"])}">{n["kategori"]}</a></nav>
<article class="hb-makale">
  <header>
    {etiket(n)}
    <h1>{n["baslik"]}</h1>
    <p class="hb-spot">{n["ozet"]}</p>
    <div class="hb-kunye">
      <div class="hb-yazar"><img src="/favicon.svg" alt="" width="36" height="36"><div><b>KampüsCepte Haber Merkezi</b><span>{zaman(n)} · {okuma(n)} dk okuma</span></div></div>
      {pay}
    </div>
  </header>
  <figure class="hb-kapak"><div class="hb-gorsel"><img src="/gorseller/haberler/{n["gorsel"]}" alt="{e(n["alt"])}" width="{n["w"]}" height="{n["h"]}" fetchpriority="high"></div>
    <figcaption>{e(n.get("aciklama", n["alt"] + "."))} <small>Görsel: {n.get("gorsel_kaynak", "Fırat Üniversitesi")}</small></figcaption></figure>
  <div class="hb-metin">
{chr(10).join(n["govde"])}
  </div>
  <p class="hb-kaynak">{kaynak_satiri(n)} Haber ihbarı ve düzeltme için <a href="/iletisim.html">bize yazın</a>.</p>
  <div class="hb-alt-paylas"><span class="hb-zaman">{n["kategori"]} · {n["tarih"]}</span>{pay}</div>
</article>
<section class="hb-ilgili" aria-labelledby="ilgili-b"><div class="hb-bolum-b"><h2 id="ilgili-b">İlgili haberler</h2></div><div class="hb-ikinci">{"".join(kart(x) for x in ilgili[:3])}</div></section>
</div></main>'''
    open(R + f'haberler/{n["slug"]}.html', 'w', encoding='utf-8').write(sayfa(n["baslik"] + ' – KampüsCepte Haberler', n["ozet"], f'/haberler/{n["slug"]}.html', body, og))

# ---------- Uygulama ana sayfasındaki haber kartları (index.html) ----------
def ana_kart(n, buyuk=False):
    p = f'\n          <p>{n["ozet"]}</p>' if buyuk else ''
    return (f'        <a class="haber-kart{" buyuk" if buyuk else ""}" href="/haberler/{n["slug"]}.html">\n'
            f'          <img src="gorseller/haberler/{n["gorsel"]}" alt="{e(n["alt"])}" width="{n["w"]}" height="{n["h"]}" loading="lazy">\n'
            f'          <div><small>{n["tarih"]} · {n["kategori"]}</small><b>{n["baslik"]}</b>{p}</div>\n        </a>\n')
ix = open(R + 'index.html', encoding='utf-8').read()
a = ix.index('      <div class="haber-liste">'); b = ix.index('      </div>\n      </section>', a)
ix = ix[:a] + '      <div class="haber-liste">\n' + ''.join(ana_kart(n, i == 0) for i, n in enumerate(H[:4])) + ix[b:]
open(R + 'index.html', 'w', encoding='utf-8').write(ix)

# ---------- Arama/filtre verisi ----------
veri = [{k: n[k] for k in ('slug', 'baslik', 'ozet', 'kategori', 'tarih', 'iso', 'gorsel', 'w', 'h')} | {'saat': n.get('saat', ''), 'kod': kod(n['kategori']),
         'metin': re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', ' '.join(n['govde']))).strip()[:4000]} for n in H]
open(R + 'haberler/veri.js', 'w', encoding='utf-8').write('/* Otomatik üretilir: .github/scripts/haber/haber_uret.py */\nwindow.HABERLER = ' + json.dumps(veri, ensure_ascii=False) + ';\n')
print('ok', len(H), 'haber;', 'kategoriler:', KATS)
