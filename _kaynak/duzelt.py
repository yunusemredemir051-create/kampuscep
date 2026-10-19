import json, re
v = json.load(open('sorular_ham.json'))
assert not any('<' in json.dumps(b) for b in v.values()), 'ham metinde < var'

BASLIK = 'YBS 1. SINIF BİLİŞİM SİSTEMLERİ VE TEKNOLOJİLERİNE GİRİŞ'

def temiz(s):
    return re.sub(r'\s+', ' ', s.replace(BASLIK, '')).strip()

for n, b in v.items():
    for grup in b.values():
        for q in grup:
            for k in ('s', 'c', 'a'):
                if isinstance(q.get(k), str):
                    q[k] = temiz(q[k])
            if 'o' in q:
                q['o'] = [temiz(o) for o in q['o']]
    # Cevap anahtarında satır kaydığı için açıklamaya taşan şık metnini temizle
    for q in b['test']:
        dogru = q['o'][q['c']]
        ham = temiz(q['_ham'][3:])
        if dogru.startswith(ham) and len(dogru) > len(ham):
            kalan = dogru[len(ham):].strip()
            if q['a'].startswith(kalan):
                q['a'] = q['a'][len(kalan):].strip()

def bosluk(n, i, yeni):
    v[n]['bosluk'][i - 1]['s'] = yeni

# --- Görünmeyen boşluklar
bosluk('3', 5, 'Binary sayı hexadecimal sayıya çevrilirken sağdan ____ gruplara, oktal sayıya çevrilirken ____ gruplara ayrılır.')
bosluk('6', 6, 'Use case’te her şeyin yolunda gittiği akışa ____ senaryo, istisna ve hata durumlarına ____ senaryo denir.')
bosluk('7', 2, 'Aynı anda tek kullanıcıya ve tek işleme izin veren işletim sistemine örnek ____ ’tur.')
bosluk('7', 3, 'TÜBİTAK ULAKBİM tarafından geliştirilen, Linux (Debian) tabanlı yerli işletim sistemi ____ ’tur.')
bosluk('7', 5, 'macOS ve Linux’un temelini oluşturan, 1970’lerden gelen işletim sistemi ____ ’tir.')
bosluk('7', 6, 'Komutların klavyeyle yazıldığı, fare imlecinin bulunmadığı arayüze ____ arayüzü denir.')
bosluk('8', 3, 'Bir problemin çözümü için izlenecek, sırası belli ve sonlu sayıdaki adımlar dizisine ____ denir.')

# --- Bölüm 2, soru C5: satır kayması nedeniyle karışan şıklar
v['2']['test'][4]['o'] = [
    'Disk – RAM – L3 – L2 – L1', 'L1 – L2 – L3 – RAM – Disk', 'L3 – L2 – L1 – RAM – Disk',
    'RAM – L1 – L2 – L3 – Disk', 'L1 – L2 – L3 – Disk – RAM']

# --- Bölüm 3: sayı tabanlarını alt simge yap
def taban(s):
    s = re.sub(r'\(([0-9A-F ]+?)\s*\)\s?(2|8|10|16)(?![0-9])', lambda m: f'({m.group(1).replace(" ", "")})<sub>{m.group(2)}</sub>', s)
    s = s.replace('( ____ )', '( ____ )')
    return s
for grup in v['3'].values():
    for q in grup:
        q['s'] = taban(q['s'])
        if 'o' in q: q['o'] = [taban(o) for o in q['o']]
        if isinstance(q.get('a'), str): q['a'] = taban(q['a'])
for i in (1, 2, 3, 4, 6):  # "( ____ )10" kalıbı
    q = v['3']['bosluk'][i - 1]
    q['s'] = re.sub(r'\( ____ \)\s?(2|8|10|16)', r'( ____ )<sub>\1</sub>', q['s'])
v['3']['dy'][8]['a'] = '2<sup>16</sup> = 65.536.'

# --- Bölüm 4: Boole ifadeleri (üst çizgiler kitaptaki görsele göre)
def u(x): return f'<span class="ust">{x}</span>'
X, Y, A, B, C = 'X', 'Y', 'A', 'B', 'C'
d = '·'
b4 = v['4']
b4['bosluk'][0]['s'] = f'X + {u(X)} = ____ ve X {d} {u(X)} = ____ olur.'
b4['bosluk'][1]['s'] = f'De Morgan kuralına göre {u(f"X {d} Y")} = ____ olur.'
b4['bosluk'][1]['c'] = f'{u(X)} + {u(Y)}'
b4['bosluk'][3]['s'] = f'X + X {d} Y = ____ olur.'
b4['dy'][0]['s'] = 'X + 1 = X olur.'
b4['dy'][2]['s'] = f'{u("X + Y")} = {u(X)} + {u(Y)} olur.'
b4['dy'][2]['a'] = f'Doğrusu {u(X)} {d} {u(Y)} olur.'
b4['dy'][3]['s'] = f'X {d} (X + Y) = X olur.'
b4['dy'][3]['a'] = f'X {d} X + X {d} Y = X + X {d} Y = X.'
b4['dy'][6]['s'] = f'A = 1 ve B = 0 için A {d} {u(B)} + {u(A)} {d} B = 1 olur.'
t = b4['test']
t[0]['s'] = f'X {d} Y + X {d} {u(Y)} + {u(X)} {d} Y ifadesinin en sade hâli hangisidir?'
t[0]['a'] = f'X {d} (Y + {u(Y)}) + {u(X)} {d} Y = X + {u(X)} {d} Y = X + Y.'
t[0]['o'] = [f'X {d} Y', 'X + Y', 'X', 'Y', '1']
t[1]['s'] = f'Q = (A + {u(B)}) {d} C devresinde çıkışı 1 yapan giriş hangisidir?'
t[2]['s'] = f'{u(f"A {d} B")} + A ifadesinin en sade hâli hangisidir?'
t[2]['o'] = ['0', '1', 'A', u(B), 'A + B']
t[2]['a'] = f'{u(A)} + {u(B)} + A = 1 + {u(B)} = 1.'
t[3]['a'] = f'{u(f"A {d} A")} = {u(A)}.'
t[4]['s'] = f'Q = A {d} B + B {d} {u(C)} {d} D ifadesinin lojik diyagramında kaç adet VE, VEYA ve DEĞİL kapısı bulunur?'
t[6]['s'] = f'(X + Y) {d} (X + {u(Y)}) ifadesinin en sade hâli hangisidir?'
t[6]['o'] = ['X', 'Y', 'X + Y', f'X {d} Y', '1']
t[6]['a'] = f'Dağılma kuralı: X + Y {d} {u(Y)} = X + 0 = X.'

# ham alanları kaldır
for b in v.values():
    for grup in b.values():
        for q in grup:
            q.pop('_ham', None)
json.dump(v, open('sorular.json', 'w'), ensure_ascii=False, indent=1)
print('ok', sum(len(g) for b in v.values() for g in b.values()), 'soru')
