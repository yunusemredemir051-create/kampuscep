import re, json, subprocess
from bolumler import BOLUMLER

GURULTU = re.compile(r'YEŞİM ÜLGEN|^YBS 1\. SINIF BİLİŞİM|^\s*BÖLÜM \d+ ·|^\s*Doğru ise \(D\)|^\s*Soru numaraları,|^\s*\d+\.\d+\s+Cevap Anahtarı|^\s*\d+\.\d+\s+Kendini Test Et')

def temizle(t):
    t = t.replace('​', '').replace(' ', ' ')
    out = []
    for l in t.split('\n'):
        l = l.rstrip()
        if not l.strip() or GURULTU.search(l):
            continue
        out.append(l)
    return out

def bolumlere_ayir(satirlar):
    """A/B/C başlıklarına göre ayır."""
    bas = {'A': re.compile(r'^\s*A\. Boşluk Doldurma'), 'B': re.compile(r'^\s*B\. Doğru'), 'C': re.compile(r'^\s*C\. Çoktan Seçmeli')}
    parca, aktif = {}, None
    for l in satirlar:
        hit = [k for k, r in bas.items() if r.match(l)]
        if hit:
            aktif = hit[0]; parca[aktif] = []; continue
        if aktif:
            parca[aktif].append(l)
    return parca

def maddeler(satirlar):
    """'N.' ile başlayan maddeleri birleştir."""
    items, cur = [], None
    for l in satirlar:
        m = re.match(r'^\s{0,6}(\d{1,2})\.\s+(.*)$', l)
        if m and (cur is None or int(m.group(1)) == cur[0] + 1):
            if cur: items.append(cur)
            cur = [int(m.group(1)), [m.group(2)]]
        elif cur:
            cur[1].append(l)
    if cur: items.append(cur)
    return items

def bosluk_metni(parts):
    s = ' '.join(p.strip() if i else p for i, p in enumerate(parts))
    s = re.sub(r'\s{6,}', ' ____ ', s)
    s = re.sub(r'\s+', ' ', s).strip()
    s = re.sub(r'\(\s*____\s*\)', '( ____ )', s)
    s = re.sub(r'\(\s*\)', '( ____ )', s)
    return s

def tek(s):
    return re.sub(r'\s+', ' ', s).strip()

def secenekleri_ayir(parts):
    s = '\n'.join(parts)
    idx = re.search(r'(?:^|\s)A\)\s', s)
    if not idx:
        return tek(s), []
    govde = tek(s[:idx.start()])
    rest = s[idx.start():]
    sec = re.split(r'(?:^|\s)([A-E])\)\s', rest)
    ops = {}
    for k in range(1, len(sec) - 1, 2):
        ops[sec[k]] = tek(sec[k + 1])
    return govde, [ops.get(h, '') for h in 'ABCDE' if h in ops]

def cevap_kisa(satirlar):
    s = ' '.join(satirlar)
    s = s.replace('​', '')
    res = {}
    for m in re.finditer(r'(?:^|\s)(\d{1,2})\.\s+(.+?)(?=\s{3,}\d{1,2}\.\s|$)', ' ' + '   '.join(x.strip() for x in satirlar)):
        res[int(m.group(1))] = tek(m.group(2))
    return res

def cevap_aciklamali(satirlar):
    res = {}
    for n, parts in maddeler(satirlar):
        bas = tek(parts[0]); ac = tek(' '.join(parts[1:]))
        res[n] = (bas, ac)
    return res

def bolum_isle(n, a, b):
    t = subprocess.run(['pdftotext', '-f', str(a), '-l', str(b), '-layout', 'bsg.pdf', '-'], capture_output=True, text=True).stdout
    i = t.rfind('Kendini Test Et\n');
    i = [m.start() for m in re.finditer(r'\d+\.\d+\s+Kendini Test Et', t)][-1]
    j = [m.start() for m in re.finditer(r'\d+\.\d+\s+Cevap Anahtarı', t)][-1]
    soru = bolumlere_ayir(temizle(t[i:j]))
    cev = bolumlere_ayir(temizle(t[j:]))
    out = {'bosluk': [], 'dy': [], 'test': []}
    ka = cevap_kisa(cev.get('A', []))
    for k, parts in maddeler(soru.get('A', [])):
        out['bosluk'].append({'s': bosluk_metni(parts), 'c': ka.get(k, '?')})
    kb = cevap_aciklamali(cev.get('B', []))
    for k, parts in maddeler(soru.get('B', [])):
        s = tek(' '.join(parts)); s = re.sub(r'^\(\s*\)\s*', '', s)
        bas, ac = kb.get(k, ('?', ''))
        out['dy'].append({'s': s, 'c': bas.startswith('Doğru'), 'a': ac, '_ham': bas})
    kc = cevap_aciklamali(cev.get('C', []))
    for k, parts in maddeler(soru.get('C', [])):
        g, ops = secenekleri_ayir(parts)
        bas, ac = kc.get(k, ('?', ''))
        harf = bas[:1]
        out['test'].append({'s': g, 'o': ops, 'c': 'ABCDE'.find(harf), 'a': ac, '_ham': bas})
    return out

veri = {}
for n, ad, a, b in BOLUMLER:
    veri[n] = bolum_isle(n, a, b)
json.dump(veri, open('sorular_ham.json', 'w'), ensure_ascii=False, indent=1)
for n in veri:
    v = veri[n]
    print(n, 'bosluk', len(v['bosluk']), 'dy', len(v['dy']), 'test', len(v['test']),
          'opsiyon sayilari', [len(x['o']) for x in v['test']],
          'cevapsiz', [x for x in v['test'] if x['c'] < 0][:1])
