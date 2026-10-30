import pymupdf, re, json, sys
d=pymupdf.open("kitap.pdf")
CH={1:(11,17),2:(18,24),3:(25,32),4:(33,38),5:(39,43),6:(44,48),7:(49,53),8:(54,58),9:(67,71),10:(72,76),11:(77,80),12:(81,84),13:(85,89)}
PROVA={"V1":(60,62),"V2":(64,66),"F":(91,93)}
NOISE=re.compile(r"^(YBS 2\. SINIF İNGİLİZCE I|BÖLÜM \d+ ·.*|EK · .*|Y U N U S E M R E D E M İ R|\d+|NOT|HOCA|→|[ivx]+)$")
def lines(a,b):
    out=[]
    for p in range(a-1,b):
        for l in d[p].get_text().split("\n"):
            l=l.strip()
            if l and not NOISE.match(l): out.append(l)
    return out
def parse(ls, extra):
    # soru ve anahtar bölümü
    try: i0=next(i for i,l in enumerate(ls) if l=="Kendini Test Et" or l.startswith("Her sorunun") or re.match(r"^1\.$",l) or re.match(r"^1\. ",l))
    except StopIteration: i0=0
    return ls
res={}
for k,(a,b) in {**CH,**PROVA}.items():
    ls=lines(a,b)
    # test başlangıcı
    if isinstance(k,int):
        s=max(i for i,l in enumerate(ls) if l=="Kendini Test Et")+0
        s=next(i for i,l in enumerate(ls) if l=="Kendini Test Et")
    else:
        s=0
    e=next(i for i,l in enumerate(ls) if l=="Cevap Anahtarı" or l.endswith("Cevap Anahtarı ve Açıklamalar"))
    qs=ls[s:e]; ans=ls[e:]
    # sorular
    items=[]; cur=None; mode=None; extras=[]
    for l in qs:
        m=re.match(r"^(\d+)\.\s*(.*)$",l)
        if m and (cur is None or int(m.group(1))==len(items)+1) and int(m.group(1))==len(items)+1:
            cur=dict(n=int(m.group(1)),s=m.group(2),o=[]); items.append(cur); mode="s"; continue
        mo=re.match(r"^([A-E])\)\s*(.*)$",l)
        if mo and cur is not None:
            cur["o"].append(mo.group(2)); mode="o"; continue
        if cur is None: continue
        if mode=="s": cur["s"]=(cur["s"]+" "+l).strip()
        elif mode=="o":
            cur["o"][-1]+=" "+l if len(cur["o"])<5 else ""
            if len(cur["o"])==5: extras.append((k,cur["n"],l))
    # anahtar
    txt=" ".join(ans)
    m=re.search(r"((?:\d+\.\s*[A-E]\s*·?\s*)+)",txt)
    key={int(n):"ABCDE".index(c) for n,c in re.findall(r"(\d+)\.\s*([A-E])\s*(?:·|$|\s)",m.group(1))}
    aciklama={}
    for l in ans:
        mm=re.match(r"^(\d+)\.\s*(?:[A-E]\)\s*)?(.+)$",l)
        if mm and not re.match(r"^\d+\.\s*[A-E]\s*·",l): aciklama[int(mm.group(1))]=mm.group(2)
    res[k]=dict(items=items,key=key,ac=aciklama,extras=extras)
    print(k,len(items),len(key),[len(x["o"]) for x in items if len(x["o"])!=5], extras[:3])
json.dump({str(k):v for k,v in res.items()},open("ham.json","w"),ensure_ascii=False)
