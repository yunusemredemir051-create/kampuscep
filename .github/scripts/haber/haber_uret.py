# Haberler bölümünü üretir: .github/scripts/haber/haberler.json -> haberler/*.html, haberler/index.html, haberler/veri.js
# Yeni haber: haberler.json'un başına ekle (alanlar aşağıda), görseli gorseller/haberler/ içine koy,
# depo kökünden çalıştır:  python3 .github/scripts/haber/haber_uret.py
# Alanlar: gizli (isteğe bağlı, true = listelenmez), slug, baslik, tarih ("23 Kasım 2026"), iso ("2026-11-23"), saat (isteğe bağlı, "10.45"), kategori,
#          gorsel, w, h, alt, gorsel_kaynak (isteğe bağlı), ozet, govde (HTML parçaları listesi), kaynak (düz metin),
#          kaynaklar (isteğe bağlı: [{"ad": "ÖSYM 2027 Sınav Takvimi", "url": "https://..."}] — haberin altında bağlantı olarak görünür),
#          son_dakika (isteğe bağlı, true: yayından sonraki 24 saat boyunca "Son dakika" etiketi ve şeridi),
#          one_cikan (isteğe bağlı, true: manşet ve öne çıkanlarda önceliklidir),
#          kesinlesmemis (isteğe bağlı, true: kulis/iddia içeren haberde metnin başında uyarı kutusu)
import json, html, re
from urllib.parse import quote

R = ''
TUM = json.load(open(R + '.github/scripts/haber/haberler.json', encoding='utf-8'))
# "gizli": true olan haber hiçbir listede, aramada ve sitemap'te görünmez; sayfası yalnızca doğrudan linkle açılır (noindex)
H = [n for n in TUM if not n.get('gizli')]
CSS_V, JS_V, KC_V = '6', '4', '6'
# Haber platformu kategorileri (site sahibi, 27 Kasım 2026). Yalnızca bunlar kullanılır.
SIRA = ['Türkiye Gündemi', 'Memur ve Kamu', 'Eğitim', 'Ekonomi', 'Teknoloji', 'Sağlık', 'Dünya', 'Spor', 'Yaşam', 'Üniversite ve Kampüs']
# Eski kategori adresleri (?kategori=...) paylaşılmış olabilir; haber.js bunları yeni kategoriye yönlendirir
ESKI = {'Ders Çalışma Teknikleri': 'Eğitim', 'Sınavlara Hazırlık': 'Eğitim', 'Öğrenci Yaşamı': 'Üniversite ve Kampüs', 'Akademik Gelişmeler': 'Üniversite ve Kampüs',
        'Etkinlikler': 'Üniversite ve Kampüs', "Türkiye'den Eğitim Gündemi": 'Eğitim', "Dünya'dan Eğitim Gündemi": 'Eğitim', 'Burs ve Öğrenci Fırsatları': 'Eğitim',
        'Bilimsel Gelişmeler': 'Teknoloji', 'Kariyer ve Gelecek': 'Memur ve Kamu', 'Psikoloji ve Kişisel Gelişim': 'Sağlık', 'Sağlıklı Yaşam': 'Sağlık',
        'Dengeli Beslenme': 'Sağlık', 'Spor ve Fiziksel Aktivite': 'Spor', 'Kültür ve Sanat': 'Yaşam', 'Kitap ve Okuma Önerileri': 'Yaşam',
        'Sosyal Yaşam ve Etkinlikler': 'Yaşam', 'Üniversite': 'Üniversite ve Kampüs', 'Kampüs': 'Üniversite ve Kampüs', 'Duyurular': 'Üniversite ve Kampüs',
        'Türkiye': 'Türkiye Gündemi'}
TR = str.maketrans('çğıöşüÇĞİÖŞÜ', 'cgiosuCGIOSU')
def kod(k): return re.sub(r'[^a-z0-9]+', '-', k.translate(TR).lower()).strip('-')
_bilinmeyen = sorted({h['kategori'] for h in TUM} - set(SIRA))
assert not _bilinmeyen, f'tanımsız kategori: {_bilinmeyen} (SIRA listesindekilerden birini kullan)'
KATS = SIRA  # boş kategori de menüde görünür; sayfası "henüz haber yok" der
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

def okuma(n): return max(1, round(len(re.sub(r'<[^>]+>', ' ', ' '.join(n['govde'])).split()) / 200))
def zaman(n): return f'<time class="hb-zaman" datetime="{n["iso"]}"{(' data-saat="' + n["saat"] + '"') if n.get("saat") else ""}>{n["tarih"]}{(", " + n["saat"]) if n.get("saat") else ""}</time>'
def meta(n): return f'<p class="hb-meta">{zaman(n)}<span>{okuma(n)} dk okuma</span></p>'
def gorsel(n, ilk=False):
    lz = '' if ilk else ' loading="lazy"'
    fp = ' fetchpriority="high"' if ilk else ''
    return f'<a class="hb-gorsel" href="/haberler/{n["slug"]}.html" tabindex="-1" aria-hidden="true"><img src="/gorseller/haberler/{n["gorsel"]}" alt="" width="{n["w"]}" height="{n["h"]}"{lz}{fp}></a>'
def iso_dt(n): return n['iso'] + (('T' + n['saat'].replace('.', ':') + ':00+03:00') if n.get('saat') else 'T00:00:00+03:00')
def sd(n): return (f'<span class="hb-sd" data-sd="{iso_dt(n)}" hidden>Son dakika</span>') if n.get('son_dakika') else ''
def etiket(n): return f'{sd(n)}<a class="hb-etiket" href="/haberler/?kategori={kod(n["kategori"])}">{n["kategori"]}</a>'
def bag(n): return f'<a href="/haberler/{n["slug"]}.html">{n["baslik"]}</a>'
def kart(n): return f'<article class="hb-kart">{gorsel(n)}<div>{etiket(n)}<h3 class="hb-baslik">{bag(n)}</h3><p class="hb-spot">{n["ozet"]}</p>{meta(n)}</div></article>'
def satir(n): return f'<article class="hb-satir">{gorsel(n)}<div>{etiket(n)}<h3 class="hb-baslik">{bag(n)}</h3><p class="hb-spot">{n["ozet"]}</p>{meta(n)}</div></article>'

def sayfa(title, desc, canon, body, extra=''):
    h = head.replace('<title>Hakkımızda – KampüsCepte</title>', f'<title>{e(title)}</title>')
    h = h.replace('<meta name="description" content="KampüsCepte nedir, kim hazırlıyor, ders notları nasıl yazılıyor ve site nasıl ücretsiz kalıyor.">', f'<meta name="description" content="{e(desc)}">')
    h = h.replace('<link rel="canonical" href="https://kampuscepte.com.tr/hakkimizda.html">', f'<link rel="canonical" href="https://kampuscepte.com.tr{canon}">' + extra)
    assert 'Hakkımızda' not in h
    return h + '<body>\n' + body + '\n' + ALT + '\n' + SON

def kaynak_satiri(n):
    if n.get('kaynaklar'):
        bag = ''.join(f'<li><a href="{e(k["url"])}" target="_blank" rel="noopener nofollow">{e(k["ad"])}</a></li>' for k in n['kaynaklar'])
        return f'<b>Kaynaklar</b><ul class="hb-kaynaklar">{bag}</ul>Haber, bu kaynaklardaki bilgiler doğrulanarak KampüsCepte Haber Merkezi tarafından özgün olarak yazılmıştır.'
    if n['kaynak'] == 'KampüsCepte Haber Merkezi': return 'Bu içerik KampüsCepte Haber Merkezi tarafından hazırlanmıştır.'
    return f'<b>Kaynak:</b> {n["kaynak"]}. Haber KampüsCepte Haber Merkezi tarafından hazırlanmıştır.'


# ---------- Ana sayfa ----------
# Düzen: son dakika şeridi (yalnızca taze son dakika varsa) · gündem kaydırıcısı (görselli manşetler) + günün haberleri
#        · 3 öne çıkan kart · kategori blokları + en çok okunanlar
# Gündem kaydırıcısı: son dakika → öne çıkan → en yeniler; en fazla 8 haber
KAY_SAYI = 8
gundem_l = []
for n in [x for x in H[:30] if x.get('son_dakika')] + [x for x in H[:30] if x.get('one_cikan')] + H:
    if all(n is not g for g in gundem_l): gundem_l.append(n)
    if len(gundem_l) == KAY_SAYI: break
m = gundem_l[0]
ikinci = [n for n in H if all(n is not g for g in gundem_l)][:3]
gun = H[0]['iso']
gunun = [n for n in H if n['iso'] == gun][:8]
gunun_b = 'Günün haberleri'
if len(gunun) < 5: gunun, gunun_b = H[:6], 'Son haberler'
seritte = [n for n in H[:30] if n.get('son_dakika')][:6]
gundem = ''.join(f'<a href="/haberler/{n["slug"]}.html" data-sd="{iso_dt(n)}">{n["baslik"]}</a>' for n in seritte)
serit = (f'<div class="hb-gundem sd" aria-label="Son dakika" hidden><div class="hb-ic"><strong><i aria-hidden="true"></i><span>Son dakika</span></strong>'
         f'<div class="hb-gundem-liste">{gundem}</div></div></div>') if seritte else ''
def slayt(n, i):
    yk = ' fetchpriority="high"' if i == 0 else ' loading="lazy"'
    return (f'<article class="hb-kay-slayt" aria-roledescription="slayt" aria-label="{i + 1} / {len(gundem_l)}">'
            f'<a class="hb-manset-kapak" href="/haberler/{n["slug"]}.html"><span class="hb-gorsel"><img src="/gorseller/haberler/{n["gorsel"]}" alt="" width="{n["w"]}" height="{n["h"]}"{yk}></span>'
            f'<span class="hb-manset-yazi">{sd(n)}<span class="hb-hap">{n["kategori"]}</span>{"<h2" if i == 0 else "<h3"} class="hb-baslik">{n["baslik"]}{"</h2>" if i == 0 else "</h3>"}</span></a>'
            f'<div class="hb-manset-alt"><p class="hb-spot">{n["ozet"]}</p>{meta(n)}</div></article>')
OK_SOL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>'
OK_SAG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>'
noktalar = ''.join(f'<button type="button" data-git="{i}" aria-label="{i + 1}. haber: {e(n["baslik"])}"{" aria-current=\"true\"" if i == 0 else ""}><i></i></button>' for i, n in enumerate(gundem_l))
kaydirici = (f'<section class="hb-manset hb-kay" id="hb-kay" aria-roledescription="kaydırıcı" aria-label="Gündem">'
             f'<div class="hb-kay-iz">{"".join(slayt(n, i) for i, n in enumerate(gundem_l))}</div>'
             f'<div class="hb-kay-alt"><button type="button" class="hb-kay-ok" data-yon="-1" aria-label="Önceki haber">{OK_SOL}</button>'
             f'<div class="hb-kay-nokta">{noktalar}</div>'
             f'<button type="button" class="hb-kay-ok" data-yon="1" aria-label="Sonraki haber">{OK_SAG}</button></div></section>')
son = ''.join(f'<li><div>{sd(n)}<h3 class="hb-baslik">{bag(n)}</h3>{zaman(n)}</div></li>' for n in gunun)
def blok(k):
    ust_ids = {id(n) for n in gundem_l} | {id(n) for n in ikinci}  # üstte gösterilenler blokta en sona düşer
    l = sorted([n for n in H if n['kategori'] == k], key=lambda n: id(n) in ust_ids)[:4]
    if not l: return ''
    ust = f'<article class="hb-blok-ust">{gorsel(l[0])}<div>{sd(l[0])}<h3 class="hb-baslik">{bag(l[0])}</h3><p class="hb-spot">{l[0]["ozet"]}</p>{zaman(l[0])}</div></article>'
    alt = ''.join(f'<li><h3 class="hb-baslik">{bag(n)}</h3>{zaman(n)}</li>' for n in l[1:])
    return (f'<section class="hb-blok" aria-labelledby="b-{kod(k)}"><div class="hb-bolum-b"><h2 id="b-{kod(k)}">{k}</h2>'
            f'<a class="hb-tumu" href="/haberler/?kategori={kod(k)}">Tümü<span aria-hidden="true"> ›</span></a></div>{ust}'
            + (f'<ul class="hb-blok-liste">{alt}</ul>' if alt else '') + '</section>')
bloklar = ''.join(blok(k) for k in KATS)
populer = ('<aside class="hb-populer" id="hb-populer" hidden aria-labelledby="populer-b"><div class="hb-bolum-b"><h2 id="populer-b">En çok okunanlar</h2>'
           '<span>Son 30 gün</span></div><ol></ol></aside>')
body = f'''{mast("Tümü")}
{serit}
<main class="hb-sayfa"><div class="hb-ic" id="hb-icerik">
  <h1 class="hb-gizli">KampüsCepte Haberler</h1>
  <div class="hb-ust">
    {kaydirici}
    <aside class="hb-son"><div class="hb-bolum-b"><h2>{gunun_b}</h2></div><ol>{son}</ol></aside>
  </div>
  {'<section class="hb-ikinci" aria-label="Öne çıkan haberler">' + ''.join(kart(n) for n in ikinci) + '</section>' if ikinci else ''}
  <div class="hb-govde"><div class="hb-bloklar">{bloklar}</div>{populer}</div>
</div></main>
<script src="/firebase-ayar.js?v=2"></script>
<script type="module" src="/haber-populer.js?v=1"></script>'''
open(R + 'haberler/index.html', 'w', encoding='utf-8').write(sayfa('KampüsCepte Haberler – Türkiye gündemi, memur, eğitim ve ekonomi haberleri',
    "Türkiye ve dünya gündemi, memur ve kamu personeli, eğitim ve sınavlar, ekonomi, teknoloji, sağlık, spor ve kampüs haberleri; resmî kaynaklarla doğrulanmış güncel haberler.", '/haberler/', body,
    '\n<meta property="og:type" content="website">\n<meta property="og:title" content="KampüsCepte Haberler">\n<meta property="og:url" content="https://kampuscepte.com.tr/haberler/">'))


# ---------- Haber detay ----------
for n in TUM:
    url = f'https://kampuscepte.com.tr/haberler/{n["slug"]}.html'
    ilgili = [x for x in H if x is not n and x['kategori'] == n['kategori']] + [x for x in H if x is not n and x['kategori'] != n['kategori']]
    iso_dt_ = n['iso'] + (('T' + n['saat'].replace('.', ':') + ':00+03:00') if n.get('saat') else '')
    ld = json.dumps({"@context": "https://schema.org", "@type": "NewsArticle", "headline": n["baslik"], "description": n["ozet"],
        "datePublished": iso_dt_, "dateModified": iso_dt_, "articleSection": n["kategori"],
        "image": ["https://kampuscepte.com.tr/gorseller/haberler/" + n["gorsel"]],
        "author": {"@type": "Organization", "name": "KampüsCepte Haber Merkezi", "url": "https://kampuscepte.com.tr/hakkimizda.html"},
        "publisher": {"@type": "Organization", "name": "KampüsCepte", "logo": {"@type": "ImageObject", "url": "https://kampuscepte.com.tr/ikonlar/ikon-512.png"}},
        "mainEntityOfPage": url}, ensure_ascii=False)
    og = ('\n<meta name="robots" content="noindex, nofollow">' if n.get('gizli') else '') + (f'\n<meta property="og:type" content="article">\n<meta property="og:site_name" content="KampüsCepte Haberler">\n<meta property="og:title" content="{e(n["baslik"])}">'
          f'\n<meta property="og:description" content="{e(n["ozet"])}">\n<meta property="og:image" content="https://kampuscepte.com.tr/gorseller/haberler/{n["gorsel"]}">'
          f'\n<meta property="og:url" content="{url}">\n<meta property="article:published_time" content="{iso_dt_}">\n<meta property="article:section" content="{e(n["kategori"])}">'
          f'\n<meta name="twitter:card" content="summary_large_image">\n<script type="application/ld+json">{ld}</script>')
    pay = f'<div class="hb-paylas"><button type="button" data-paylas>{IK["pay"]}Paylaş</button><button type="button" data-kopyala aria-label="Bağlantıyı kopyala">{IK["link"]}<span>Kopyala</span></button></div>'
    body = f'''{mast(n["kategori"])}
<main class="hb-detay"><div class="hb-ic">
<div class="hb-ilerleme" aria-hidden="true"><i></i></div>
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
{'<div class="kutu-bilgi hb-kesin"><p><b>Kesinleşmemiş bilgi</b> Bu haberde henüz resmî olarak açıklanmamış iddia ya da kulis bilgisi var; resmî açıklamalar metinde ayrıca belirtilmiştir.</p></div>' if n.get('kesinlesmemis') else ''}
{chr(10).join(n["govde"])}
  </div>
  <div class="hb-kaynak">{kaynak_satiri(n)} Haber ihbarı ve düzeltme için <a href="/iletisim.html">bize yazın</a>.</div>
  <div class="hb-alt-paylas"><span class="hb-zaman">{n["kategori"]} · {n["tarih"]}<span class="hb-okunma" id="hb-okunma" data-haber="{n["slug"]}" data-onceki="{int(n.get("onceki_okunma", 0))}" hidden> · <b></b> görüntülenme</span></span>{pay}</div>
</article>
<script src="/firebase-ayar.js?v=2"></script>
<script type="module" src="/haber-sayac.js?v=2"></script>
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
         'metin': re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', ' '.join(n['govde']))).strip()[:4000], 'onceki': int(n.get('onceki_okunma', 0))} for n in H]
open(R + 'haberler/veri.js', 'w', encoding='utf-8').write('/* Otomatik üretilir: .github/scripts/haber/haber_uret.py */\nwindow.HABERLER = ' + json.dumps(veri, ensure_ascii=False) + ';\n'
    + 'window.HABER_ESKI_KOD = ' + json.dumps({kod(a): kod(b) for a, b in ESKI.items() if kod(a) != kod(b)}, ensure_ascii=False) + ';\n')
print('ok', len(H), 'haber;', 'kategoriler:', KATS)
