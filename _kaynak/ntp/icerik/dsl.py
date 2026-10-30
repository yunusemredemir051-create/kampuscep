"""Kod Atölyesi soru verisi için küçük yardımcılar.
Soru: id, tur, baslik, zorluk (1-3, kitaptaki ◆ sayısı), giris (html), kodlar, adimlar, ack (html)
Adım türleri: satir, sec, coklusec, isaret, tablo, metin, yaz, acik, adim (adım adım izleme), canli (canlı form)
"""
TURLER = {"hata": "Hata avı", "izleme": "İzleme tablosu", "cikti": "Çıktı tahmini", "tasarim": "Tasarım kararı",
          "oku": "Kod okuma", "yaz": "Kod yazma", "senaryo": "Senaryo analizi", "duzen": "Yeniden düzenleme"}

def Q(id, tur, baslik, zorluk, giris, kodlar, adimlar, ack="", ipucu=None):
    q = dict(id=id, tur=tur, baslik=baslik, zorluk=zorluk, giris=giris, kodlar=kodlar, adimlar=adimlar)
    if ack: q["ack"] = ack
    return q

def kod(k, b=None, goster=True, bas=1):
    d = dict(kod=k.strip("\n"))
    if b: d["b"] = b
    if not goster: d["goster"] = False
    if bas != 1: d["bas"] = bas
    return d

def satir(s, kod, dogru, hatalar, **k):
    return dict(t="satir", s=s, kod=kod, dogru=dogru, hatalar=[dict(satir=a, ad=b, neden=c) for a, b, c in hatalar], **k)

def sec(s, o, c, a="", **k):
    return dict(t="sec", s=s, o=o, c=c, a=a, **k)

def coklusec(s, satirlar, **k):
    """satirlar: [(etiket, [secenekler], dogru_indeks, aciklama)]"""
    return dict(t="coklusec", s=s, satirlar=[dict(e=e, o=o, c=c, a=a) for e, o, c, a in satirlar], **k)

def isaret(s, o, c, a="", **k):
    return dict(t="isaret", s=s, o=o, c=c, a=a, **k)

def metin(s, cevap, a="", **k):
    return dict(t="metin", s=s, cevap=cevap if isinstance(cevap, list) else [cevap], a=a, **k)

def tablo(s, kolon, satirlar, notlar=None, kodlu=(), **k):
    return dict(t="tablo", s=s, kolon=kolon, satirlar=satirlar, notlar=notlar or [], kodlu=list(kodlu), **k)

def girdi(c, o=None, mod=None, hasas=False, gen=None):
    d = dict(c=c if isinstance(c, list) else [c])
    if o: d["o"] = o
    if mod: d["mod"] = mod
    if hasas: d["h"] = 1
    if gen: d["gen"] = gen
    return d

def yaz(s, kriter, cozum, bas="", a="", **k):
    """kriter: [dict(ad=..., any=[...]) | dict(ad=..., yok=[...]) | dict(ad=..., esit=[a,b]) | dict(ad, say=dict(p=[...], min=, max=))]"""
    return dict(t="yaz", s=s, kriter=kriter, cozum=cozum.strip("\n"), bas=bas, a=a, **k)

def acik(s, ornek, ogeler, **k):
    return dict(t="acik", s=s, ornek=ornek, ogeler=ogeler, **k)

def adim(s, kod, kareler, **k):
    return dict(t="adim", s=s, kod=kod, kareler=kareler, **k)

def canli(s, nesneler, olaylar, **k):
    return dict(t="canli", s=s, nesneler=nesneler, olaylar=olaylar, **k)

def C(ad, **kw): return dict(ad=ad, **kw)
