"""Tüm HTML sayfalarına uygulama (PWA) etiketlerini ekler: manifest, ikon, service worker kaydı.
Kullanım (repo kökünden): python3 _kaynak/pwa_ekle.py   — tekrar çalıştırmak güvenlidir."""
import glob, os, re

BAS, SON = "<!-- PWA -->", "<!-- /PWA -->"

def blok(on):
    return (f'{BAS}\n<link rel="manifest" href="{on}manifest.webmanifest">\n'
            f'<link rel="apple-touch-icon" href="{on}ikonlar/apple-touch-icon.png">\n'
            f'<meta name="mobile-web-app-capable" content="yes">\n'
            f'<meta name="apple-mobile-web-app-title" content="KampüsCepte">\n'
            f'<meta name="google-adsense-account" content="ca-pub-5083598455747122">\n'
            f'<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5083598455747122" crossorigin="anonymous"></script>\n'
            f'<script async src="https://www.googletagmanager.com/gtag/js?id=G-EN48D4XWNB"></script>\n'
            f'<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments)}}gtag("js",new Date());'
            f'(function(){{var u=false;try{{if(/[?&]kaynak=uygulama/.test(location.search)||window.Capacitor)sessionStorage.setItem("kc-uyg","1");u=sessionStorage.getItem("kc-uyg")==="1"}}catch(e){{}}'
            f'gtag("config","G-EN48D4XWNB",{{nereden:u?"uygulama":"web"}})}})();</script>\n'
            f'<style>body{{padding-top:max(env(safe-area-inset-top,0px),var(--safe-area-inset-top,0px))}}.alt-menu,.yan{{margin-bottom:max(env(safe-area-inset-bottom,0px),var(--safe-area-inset-bottom,0px))}}</style>\n'
            f'<script defer src="/ozelgun.js?v=4"></script>\n'
            f'<script>if("serviceWorker" in navigator)addEventListener("load",()=>navigator.serviceWorker.register("{on}sw.js",{{scope:"{on or "./"}"}}).catch(()=>{{}}));</script>\n'
            f'{SON}')

sayi = 0
for yol in glob.glob("**/*.html", recursive=True):
    if yol.startswith(("_kaynak", "_uygulama", "uygulama", "node_modules", ".github")):
        continue
    derinlik = yol.count("/")
    on = "../" * derinlik
    s = open(yol, encoding="utf-8").read()
    s = re.sub(re.escape(BAS) + r".*?" + re.escape(SON) + r"\n?", "", s, flags=re.S)
    if "</head>" not in s:
        continue
    s = s.replace("</head>", blok(on) + "\n</head>", 1)
    open(yol, "w", encoding="utf-8").write(s)
    sayi += 1
print(f"PWA etiketleri {sayi} sayfaya eklendi")
