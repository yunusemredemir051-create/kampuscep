"""Her yurt için kısa menü sayfası üretir: kampuscepte.com.tr/<yurt-id>/
Kullanım (repo kökünden): python3 _kaynak/yurt_sayfalari.py
Yurt listesi veri.js'deki `yurtlar` dizisinden okunur; şablon _kaynak/yurt_sablon.html."""
import json, os, re, subprocess

SITE_URL = "https://kampuscepte.com.tr"
js = "const fs=require('fs');eval(fs.readFileSync('veri.js','utf8').replace(/^const /gm,'var '));console.log(JSON.stringify(yurtlar))"
yurtlar = json.loads(subprocess.check_output(["node", "-e", js]))
sablon = open("_kaynak/yurt_sablon.html", encoding="utf-8").read()

for y in yurtlar:
    os.makedirs(y["id"], exist_ok=True)
    html = sablon.replace("{{ID}}", y["id"]).replace("{{AD}}", y["ad"])
    open(f'{y["id"]}/index.html', "w", encoding="utf-8").write(html)
    print(f'{SITE_URL}/{y["id"]}/  ←  {y["ad"]}')

# sitemap'e ekle
sm = open("sitemap.xml", encoding="utf-8").read()
ekle = "".join(f'  <url><loc>{SITE_URL}/{y["id"]}/</loc><changefreq>daily</changefreq></url>\n'
               for y in yurtlar if f'{SITE_URL}/{y["id"]}/' not in sm)
if f"{SITE_URL}/yol-arkadasi/" not in sm + ekle:
    ekle += f"  <url><loc>{SITE_URL}/yol-arkadasi/</loc><changefreq>daily</changefreq></url>\n"
if ekle:
    sm = sm.replace("</urlset>", ekle + "</urlset>")
    open("sitemap.xml", "w", encoding="utf-8").write(sm)
