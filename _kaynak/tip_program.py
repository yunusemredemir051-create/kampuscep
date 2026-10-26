"""Fırat Tıp eğitim rehberi (.docx) -> tip/sinifN.json (haftalık ders programı).
Kullanım: python3 _kaynak/tip_program.py <docx klasörü>"""
import docx, glob, json, re, sys
AYLAR = {"Ocak":1,"Şubat":2,"Mart":3,"Nisan":4,"Mayıs":5,"Haziran":6,"Temmuz":7,"Ağustos":8,"Eylül":9,"Ekim":10,"Kasım":11,"Aralık":12}
HOCA = re.compile(r"^(?:[A-ZÇĞİÖŞÜ]{1,2}\.? ?)+[A-ZÇĞİÖŞÜ’'\-]{2,}(?: [A-ZÇĞİÖŞÜ’'\-]{2,})*(?: / .*)?$")
def tarih(h):
    m = re.search(r"(\d{1,2})\s+(" + "|".join(AYLAR) + ")", h)
    if not m: return None
    ay = AYLAR[m.group(2)]; yil = 2026 if ay >= 8 else 2027
    return f"{yil}-{ay:02d}-{int(m.group(1)):02d}"
def zaman(s):
    m = re.match(r"^\s*(\d{1,2})[.:](\d{2})", s.replace("¹⁵",".15").replace("⁰⁰",".00"))
    return (int(m.group(1)), int(m.group(2))) if m else None
def bitis(h, d):  # 45 dk ders
    t = h * 60 + d + 45; return f"{t // 60:02d}.{t % 60:02d}"
def dk(x):
    a, b = x.split("."); return int(a) * 60 + int(b)
def satirlar(hucre):
    return [x.strip() for x in hucre.text.replace("\v", "\n").split("\n") if x.strip()]
def cevir(t):
    ust = [c.text for c in t.rows[0].cells]
    gunler = [tarih(x) for x in ust[1:]]
    if sum(1 for g in gunler if g) < 3: return None
    sut = [[] for _ in gunler]
    for r in t.rows[1:]:
        hs = list(r.cells)
        z = zaman(hs[0].text)
        if not z: continue
        bas = f"{z[0]:02d}.{z[1]:02d}"
        for j in range(len(gunler)):
            if j + 1 >= len(hs) or not gunler[j]: continue
            ls = satirlar(hs[j + 1])
            if not ls: continue
            hoca = ""
            if len(ls) > 1 and HOCA.match(ls[-1]): hoca = ls.pop()
            ders = " ".join(ls)
            if ders.lower() in ("serbest", "-"): continue
            kalan = sut[j]
            if kalan and kalan[-1]["d"] == ders and kalan[-1]["h"] == hoca and dk(bas) - dk(kalan[-1]["e"]) <= 15:
                kalan[-1]["e"] = bitis(z[0], z[1])          # birleşik hücre / art arda aynı ders
            else:
                kalan.append({"s": bas, "e": bitis(z[0], z[1]), "d": ders, "h": hoca})
    # 45 dk: ardışık saatlerde bitiş = sonraki başlangıç değilse ayrı blok kalır; aynı dersi uzat
    return {"gunler": gunler, "p": sut}
if __name__ == "__main__":
    kok = sys.argv[1]
    for n in (1, 2, 3):
        d = docx.Document(glob.glob(f"{kok}/*_{n}_snf_egt_reh.docx")[0]); haftalar = []
        for t in d.tables:
            if not t.rows or len(t.columns) < 5: continue
            h = " ".join(c.text for c in t.rows[0].cells)
            if "Pazartesi" not in h and "Salı" not in h: continue
            w = cevir(t)
            if w: haftalar.append(w)
        tek = {}
        for w in haftalar:                                     # aynı hafta iki kez çıkarsa dolu olanı tut
            k = next(g for g in w["gunler"] if g)
            if k not in tek or sum(map(len, w["p"])) > sum(map(len, tek[k]["p"])): tek[k] = w
        haftalar = list(tek.values())
        haftalar.sort(key=lambda w: next(g for g in w["gunler"] if g))
        json.dump({"sinif": n, "haftalar": haftalar}, open(f"tip/sinif{n}.json", "w"), ensure_ascii=False, separators=(",", ":"))
        print(n, len(haftalar), "hafta", sum(len(x) for w in haftalar for x in w["p"]), "ders bloğu")
