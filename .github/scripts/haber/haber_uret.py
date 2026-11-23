# Haber sayfalarını üretir: haberler.json -> haberler/*.html ve haberler/index.html
# Yeni haber: haberler.json başına ekle, görseli gorseller/haberler/ içine koy, bu dosyayı çalıştır.
import json, html, re
R=''  # depo kökünden çalıştır: python3 .github/scripts/haber/haber_uret.py
src=open(R+'hakkimizda.html',encoding='utf-8').read()
head=src.split('<body>')[0]
head=head.replace('href="favicon.svg"','href="/favicon.svg"').replace('href="manifest.webmanifest"','href="/manifest.webmanifest"').replace('href="ikonlar/','href="/ikonlar/').replace('register("sw.js",{scope:"./"})','register("/sw.js",{scope:"/"})')
head=re.sub(r'<style>\n  body \{.*?</style>','<style>__CSS__</style>',head,count=1,flags=re.S)
assert '__CSS__' in head
CSS='''
:root { --h-serif: Georgia, "Iowan Old Style", "Times New Roman", serif; --h-sans: "Segoe UI", Roboto, "Helvetica Neue", Arial, system-ui, sans-serif; }
* { box-sizing: border-box; }
html, body { background: var(--kart) !important; }
.ozel-arka { display: none !important; } /* haber sayfalarında okuma için sade zemin; özel gün şeridi yine görünür */
body { margin: 0; background: var(--kart); color: var(--yazi); font-family: var(--h-sans); -webkit-font-smoothing: antialiased; }
a { color: var(--mavi); }
.mast { border-bottom: 1px solid var(--cizgi); background: var(--kart); position: sticky; top: 0; z-index: 5; }
.mast-ic { max-width: 1080px; margin: 0 auto; padding: 0 18px; height: 56px; display: flex; align-items: center; gap: 12px; }
.mast-logo { display: flex; align-items: center; gap: 8px; color: var(--yazi); text-decoration: none; font-weight: 800; font-size: 18px; letter-spacing: -.01em; }
.mast-logo img { width: 28px; height: 28px; }
.mast-logo span { font-weight: 600; color: var(--soluk); border-left: 1px solid var(--cizgi); padding-left: 8px; margin-left: 2px; font-size: 15px; }
.mast nav { margin-left: auto; display: flex; gap: 18px; }
.mast nav a { white-space: nowrap; color: var(--yazi); text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 0; }
.mast nav a:hover { color: var(--mavi); }
.sayfa-ic { max-width: 1080px; margin: 0 auto; padding: 24px 18px 56px; }
.haber { max-width: 720px; margin: 0 auto; }
.kat { display: inline-block; font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: var(--mavi); text-decoration: none; }
.haber h1 { font-family: var(--h-sans); font-weight: 800; font-size: 38px; line-height: 1.15; letter-spacing: -.02em; margin: 10px 0 14px; }
.spot { font-family: var(--h-sans); font-size: 20px; line-height: 1.5; font-weight: 500; color: var(--yazi); opacity: .86; margin: 0 0 18px; }
.kunye { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; padding: 12px 0; border-top: 1px solid var(--cizgi); border-bottom: 1px solid var(--cizgi); font-size: 13.5px; color: var(--soluk); }
.kunye b { color: var(--yazi); font-weight: 700; }
.paylas { margin-left: auto; display: flex; gap: 6px; }
.paylas a, .paylas button { width: 38px; height: 38px; display: grid; place-items: center; border: 1px solid var(--cizgi); border-radius: 50%; background: transparent; color: var(--yazi); cursor: pointer; text-decoration: none; transition: border-color .15s, color .15s; }
.paylas a:hover, .paylas button:hover { border-color: var(--mavi); color: var(--mavi); }
.paylas button.ok { color: var(--yesil); border-color: var(--yesil); }
.paylas svg { width: 18px; height: 18px; }
figure.kapak { margin: 22px 0 6px; }
figure.kapak img { display: block; width: 100%; height: auto; background: var(--kart-2); }
figure.kapak figcaption { font-size: 12.5px; color: var(--soluk); padding: 8px 0 0; border-bottom: 1px solid var(--cizgi); padding-bottom: 10px; }
.metin { font-family: var(--h-serif); font-size: 19px; line-height: 1.75; margin-top: 22px; }
.metin p { margin: 0 0 20px; }
.metin h2 { font-family: var(--h-sans); font-size: 23px; font-weight: 800; letter-spacing: -.01em; line-height: 1.3; margin: 34px 0 12px; }
.metin ul, .metin ol { padding-left: 24px; margin: 0 0 20px; } .metin li { margin-bottom: 10px; }
.metin a { text-underline-offset: 3px; }
.kutu-bilgi { font-family: var(--h-sans); border-top: 3px solid var(--yazi); background: var(--kart-2); padding: 16px 18px; margin: 28px 0; }
.kutu-bilgi p { margin: 0; font-size: 16px; line-height: 1.65; }
.kutu-bilgi b:first-child { display: block; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 6px; }
.son-paylas { display: flex; align-items: center; gap: 12px; white-space: nowrap; border-top: 1px solid var(--cizgi); padding-top: 16px; margin-top: 30px; font-size: 14px; font-weight: 700; }
.son-paylas .paylas { margin-left: 0; }
.ilgili { max-width: 1080px; margin: 48px auto 0; border-top: 3px solid var(--yazi); padding-top: 14px; }
.ilgili h2 { font-size: 13px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; margin: 0 0 16px; }
.ilgili-liste { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.ik { color: var(--yazi); text-decoration: none; display: block; }
.ik img { display: block; width: 100%; height: auto; aspect-ratio: 16 / 10; object-fit: cover; background: var(--kart-2); }
.ik small { display: block; margin-top: 10px; font-size: 11.5px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: var(--mavi); }
.ik b { display: block; margin-top: 4px; font-size: 16px; line-height: 1.35; }
.ik:hover b { text-decoration: underline; text-underline-offset: 3px; }
.alt { border-top: 1px solid var(--cizgi); margin-top: 48px; }
.alt-ic { max-width: 1080px; margin: 0 auto; padding: 20px 18px 40px; display: flex; flex-wrap: wrap; gap: 8px 18px; font-size: 13px; }
.alt-ic a { color: var(--soluk); text-decoration: none; } .alt-ic span { color: var(--soluk); margin-right: auto; }
a:focus-visible, button:focus-visible { outline: 3px solid var(--mavi); outline-offset: 2px; }
/* liste sayfası */
.manset { display: grid; grid-template-columns: 1.5fr 1fr; gap: 28px; color: var(--yazi); text-decoration: none; border-bottom: 1px solid var(--cizgi); padding-bottom: 28px; }
.manset img { width: 100%; height: auto; aspect-ratio: 16 / 9; object-fit: cover; display: block; }
.manset h2 { font-size: 32px; line-height: 1.18; font-weight: 800; letter-spacing: -.02em; margin: 8px 0 12px; }
.manset p { font-family: var(--h-serif); font-size: 18px; line-height: 1.6; color: var(--soluk); margin: 0; }
.manset:hover h2 { text-decoration: underline; text-underline-offset: 4px; }
.sayfa-bas { display: flex; align-items: baseline; gap: 12px; border-bottom: 3px solid var(--yazi); padding-bottom: 10px; margin-bottom: 22px; }
.sayfa-bas h1 { font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -.02em; }
.sayfa-bas p { margin: 0; color: var(--soluk); font-size: 14px; }
.liste-h { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 26px; }
.liste-h .ik p { font-family: var(--h-serif); color: var(--soluk); font-size: 15.5px; line-height: 1.55; margin: 6px 0 0; }
@media (max-width: 860px) { .ilgili-liste { grid-template-columns: 1fr 1fr; } .manset { grid-template-columns: 1fr; gap: 14px; } .liste-h { grid-template-columns: 1fr 1fr; } }
@media (max-width: 600px) {
  .mast nav a.gizle { display: none; }
  .sayfa-ic { padding: 18px 16px 40px; }
  .haber h1 { font-size: 28px; }
  .spot { font-size: 17.5px; }
  .metin { font-size: 18px; }
  figure.kapak { margin-left: -16px; margin-right: -16px; }
  figure.kapak figcaption { padding-left: 16px; padding-right: 16px; }
  .paylas { margin-left: 0; width: 100%; }
  .ilgili-liste { grid-template-columns: 1fr; gap: 0; }
  .ilgili-liste .ik { display: grid; grid-template-columns: 112px 1fr; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--cizgi); }
  .ilgili-liste .ik small { margin-top: 0; }
  .ilgili-liste .ik b { font-size: 15px; }
  .manset h2 { font-size: 25px; }
  .liste-h { grid-template-columns: 1fr; gap: 0; margin-top: 8px; }
  .liste-h .ik { display: grid; grid-template-columns: 112px 1fr; gap: 12px; padding: 14px 0; border-bottom: 1px solid var(--cizgi); }
  .liste-h .ik small { margin-top: 0; } .liste-h .ik b { font-size: 15.5px; } .liste-h .ik p { display: none; }
}
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
'''
head=head.replace('__CSS__',CSS)
MAST='''<header class="mast"><div class="mast-ic">
  <a class="mast-logo" href="/"><img src="/favicon.svg" alt="" width="28" height="28">KampüsCepte<span>Haber</span></a>
  <nav><a class="gizle" href="/">Ana sayfa</a><a href="/haberler/">Haberler</a><a class="gizle" href="/#yurtlar">Yurtlar</a></nav>
</div></header>'''
ALT='''<footer class="alt"><div class="alt-ic"><span>© 2026 KampüsCepte</span><a href="/hakkimizda.html">Hakkımızda</a><a href="/iletisim.html">İletişim</a><a href="/gizlilik.html">Gizlilik ve çerezler</a><a href="/kullanim-kosullari.html">Kullanım koşulları</a></div></footer>'''
JS='''<script>
document.querySelectorAll("[data-paylas]").forEach(function(b){if(!navigator.share)return;b.hidden=false;b.addEventListener("click",function(){navigator.share({title:document.title,url:location.href.split("#")[0]}).catch(function(){})})});
document.querySelectorAll("[data-kopyala]").forEach(function(b){b.addEventListener("click",function(){
  var u=location.href.split("#")[0];
  (navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject()).then(function(){b.classList.add("ok");b.setAttribute("aria-label","Bağlantı kopyalandı");b.title="Bağlantı kopyalandı";setTimeout(function(){b.classList.remove("ok");b.title="Bağlantıyı kopyala"},1800)}).catch(function(){prompt("Bağlantıyı kopyala:",u)});
});});
</script>'''
SON='<script defer src="/geri.js?v=2"></script>\n</body>\n</html>\n'
IKON={
'wa':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19.1L4 20z"/><path d="M9.2 9.3c.2 1.9 1.6 3.6 3.6 4.4l1.1-1 1.7.9c-.2.9-.9 1.5-1.8 1.5-3 0-5.9-2.9-5.9-5.9 0-.9.6-1.6 1.5-1.8l.8 1.7-1 1.1"/></svg>',
'pay':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V4M8 8l4-4 4 4"/><path d="M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"/></svg>',
'link':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>'}
from urllib.parse import quote
def paylas(url,baslik):
    u=quote(url,safe=''); t=quote(baslik,safe='')
    return f'''<div class="paylas"><a href="https://wa.me/?text={t}%20{u}" target="_blank" rel="noopener" aria-label="WhatsApp'ta paylaş" title="WhatsApp'ta paylaş">{IKON["wa"]}</a><button type="button" data-paylas hidden aria-label="Paylaş" title="Paylaş">{IKON["pay"]}</button><button type="button" data-kopyala aria-label="Bağlantıyı kopyala" title="Bağlantıyı kopyala">{IKON["link"]}</button></div>'''
def okuma(n):
    w=len(re.sub(r'<[^>]+>',' ',' '.join(n['govde'])).split()); return max(1,round(w/200))
H=json.load(open('.github/scripts/haber/haberler.json',encoding='utf-8'))
def sayfa(title,desc,canon,body,extra=''):
    h=head.replace('<title>Hakkımızda – KampüsCepte</title>',f'<title>{html.escape(title)} – KampüsCepte</title>')
    h=h.replace('<meta name="description" content="KampüsCepte nedir, kim hazırlıyor, ders notları nasıl yazılıyor ve site nasıl ücretsiz kalıyor.">',f'<meta name="description" content="{html.escape(desc)}">')
    h=h.replace('<link rel="canonical" href="https://kampuscepte.com.tr/hakkimizda.html">',f'<link rel="canonical" href="https://kampuscepte.com.tr{canon}">'+extra)
    assert 'Hakkımızda' not in h
    return h+'<body>\n'+MAST+'\n'+body+'\n'+ALT+'\n'+JS+'\n'+SON
def kart(m):
    return f'<a class="ik" href="/haberler/{m["slug"]}.html"><img src="/gorseller/haberler/{m["gorsel"]}" alt="" width="{m["w"]}" height="{m["h"]}" loading="lazy"><div><small>{m["kategori"]}</small><b>{m["baslik"]}</b></div></a>'
for n in H:
    url=f'https://kampuscepte.com.tr/haberler/{n["slug"]}.html'
    ilgili=''.join(kart(m) for m in H if m is not n)[:]
    ld=json.dumps({"@context":"https://schema.org","@type":"NewsArticle","headline":n["baslik"],"description":n["ozet"],"datePublished":n["iso"],"dateModified":n["iso"],"image":["https://kampuscepte.com.tr/gorseller/haberler/"+n["gorsel"]],"author":{"@type":"Organization","name":"KampüsCepte Haber Merkezi","url":"https://kampuscepte.com.tr/hakkimizda.html"},"publisher":{"@type":"Organization","name":"KampüsCepte","logo":{"@type":"ImageObject","url":"https://kampuscepte.com.tr/ikonlar/ikon-512.png"}},"mainEntityOfPage":url},ensure_ascii=False)
    og=f'\n<meta property="og:type" content="article">\n<meta property="og:site_name" content="KampüsCepte">\n<meta property="og:title" content="{html.escape(n["baslik"])}">\n<meta property="og:description" content="{html.escape(n["ozet"])}">\n<meta property="og:image" content="https://kampuscepte.com.tr/gorseller/haberler/{n["gorsel"]}">\n<meta property="og:url" content="{url}">\n<meta property="article:published_time" content="{n["iso"]}">\n<meta name="twitter:card" content="summary_large_image">\n<script type="application/ld+json">{ld}</script>'
    kaynak=n.get('gorsel_kaynak','Fırat Üniversitesi')
    body=f'''<main class="sayfa-ic">
<article class="haber">
  <a class="kat" href="/haberler/">{n["kategori"]}</a>
  <h1>{n["baslik"]}</h1>
  <p class="spot">{n["ozet"]}</p>
  <div class="kunye"><span><b>KampüsCepte Haber Merkezi</b></span><time datetime="{n["iso"]}">{n["tarih"]}</time><span>{okuma(n)} dk okuma</span>{paylas(url,n["baslik"])}</div>
  <figure class="kapak"><img src="/gorseller/haberler/{n["gorsel"]}" alt="{html.escape(n["alt"])}" width="{n["w"]}" height="{n["h"]}"><figcaption>{html.escape(n["alt"])}. Görsel: {kaynak}</figcaption></figure>
  <div class="metin">
{''.join(n["govde"])}
  </div>
  <div class="son-paylas">Bu haberi paylaş {paylas(url,n["baslik"])}</div>
</article>
<section class="ilgili" aria-labelledby="ilgili-b"><h2 id="ilgili-b">Diğer haberler</h2><div class="ilgili-liste">{ilgili}</div></section>
</main>'''
    open(R+f'haberler/{n["slug"]}.html','w',encoding='utf-8').write(sayfa(n["baslik"],n["ozet"],f'/haberler/{n["slug"]}.html',body,og))
m=H[0]
manset=f'''<a class="manset" href="/haberler/{m["slug"]}.html"><img src="/gorseller/haberler/{m["gorsel"]}" alt="{html.escape(m["alt"])}" width="{m["w"]}" height="{m["h"]}"><div><span class="kat">{m["kategori"]}</span><h2>{m["baslik"]}</h2><p>{m["ozet"]}</p><p style="margin-top:12px;font-family:var(--h-sans);font-size:13px">{m["tarih"]}</p></div></a>'''
liste=''.join(f'<a class="ik" href="/haberler/{x["slug"]}.html"><img src="/gorseller/haberler/{x["gorsel"]}" alt="" width="{x["w"]}" height="{x["h"]}" loading="lazy"><div><small>{x["kategori"]} · {x["tarih"]}</small><b>{x["baslik"]}</b><p>{x["ozet"]}</p></div></a>' for x in H[1:])
body=f'''<main class="sayfa-ic">
<div class="sayfa-bas"><h1>Haberler</h1><p>Elazığ'da üniversite hayatından</p></div>
{manset}
<div class="liste-h">{liste}</div>
</main>'''
open(R+'haberler/index.html','w',encoding='utf-8').write(sayfa('Haberler',"Elazığ'daki üniversite hayatından haberler: öğrenci ödülleri, akademik başarılar, TÜBİTAK projeleri, etkinlikler ve öğrencilere yönelik uygulamalar.",'/haberler/',body))
print('ok')
