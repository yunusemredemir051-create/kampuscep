"""Veri Tabanına Giriş kitabının test verisini düzeltir -> vt_sorular.json
Her boşluk sorusunda 'cs' = boşluk başına cevap listesi."""
import json, re, html
v = json.load(open('vt_ham.json'))
BASLIK = 'YBS 1. SINIF VERİ TABANINA GİRİŞ'

def temiz(s):
    return re.sub(r'\s+', ' ', s.replace(BASLIK, '')).strip()

for b in v.values():
    for grup in b.values():
        for q in grup:
            for k in ('s', 'c', 'a'):
                if isinstance(q.get(k), str): q[k] = temiz(q[k])
            if 'o' in q: q['o'] = [temiz(o) for o in q['o']]
    for q in b['test']:
        dogru = q['o'][q['c']]; ham = temiz(q['_ham'][3:])
        if dogru.startswith(ham) and len(dogru) > len(ham):
            kalan = dogru[len(ham):].strip()
            if q['a'].startswith(kalan): q['a'] = q['a'][len(kalan):].strip()

def bs(n, i, s, c=None):
    q = v[str(n)]['bosluk'][i - 1]; q['s'] = s
    if c is not None: q['c'] = c

bs(1, 1, 'Veri tabanlarını saklamak ve yönetmek amacıyla tasarlanmış yazılım paketine ____ denir.')
bs(1, 2, 'Verilerin uygun şekilde üretilmesine, depolanmasına ve alınmasına odaklanan disipline ____ denir.')
bs(1, 4, 'Bilgilerin saklanmasını ve kullanılmasını kolaylaştırmak için biçimlendirilmiş verilere ____ , orijinal ve ham durumdaki verilere ____ denir.')
bs(2, 1, 'Bir sistemin beklenen işlevleri yerine getirmesi için sahip olması gereken özelliklere ____ denir.')
bs(3, 1, 'ER diyagramında varlık kümeleri ____ , nitelikler ____ , ilişkiler ____ ile gösterilir.')
bs(3, 2, 'Değeri her varlık için farklı olan niteliğe ____ nitelik denir ve diyagramda ____ gösterilir.')
bs(3, 3, 'Var olan diğer niteliklerden hesaplanan, veri tabanında gerçekte tutulmayan niteliklere ____ nitelik denir.')
bs(3, 5, 'Zayıf varlık ile onu sistemde var eden güçlü varlık arasındaki bağıntıya ____ bağıntısı denir ve ____ ile gösterilir.')
bs(4, 1, 'Bir sütunun, bileşik anahtarın tamamına değil yalnızca bir parçasına bağlı olmasına ____ bağımlılık denir.')
bs(4, 2, 'Bir alanın birincil anahtara başka bir alan üzerinden dolaylı olarak bağlı olmasına ____ bağımlılık denir.')
bs(4, 6, 'Yeni bir veriyi ekleyebilmek için ilgisiz başka verileri de girmek zorunda kalmaya ____ sorunu denir.')
bs(4, 7, 'A sütunu bilindiğinde B sütunu kesin olarak bulunabiliyorsa B, A’ya ____ bağımlıdır.')
bs(5, 1, 'SQL’in açılımı ____ olup Türkçesi ____ demektir.', 'Structured Query Language / Yapısal Sorgulama Dili')
bs(5, 2, 'Veri tabanının ana veri dosyasının uzantısı ____ , yedek dosyasının uzantısı ____ olur.', '.mdf / .bak')
bs(5, 3, 'Tablonun yapısını bozmadan içindeki tüm verileri tek hamlede boşaltan komut ____ komutudur.')
bs(5, 4, 'Bir sütunun değerinin her yeni kayıtta kendiliğinden artmasını sağlayan özellik ____ özelliğidir.')
bs(5, 5, 'Bir sütundaki değerin belirli bir koşulu sağlamasını zorunlu kılan kısıtlama ____ kısıtlamasıdır.')
bs(5, 6, 'Kullanıcıya yetki veren komut ____ , verilen yetkiyi geri alan komut ____ komutudur.')
bs(5, 7, 'Türkçe karakterlerin sorunsuz saklanması için değişken uzunluklu ve Unicode destekli ____ veri tipi kullanılır.')
bs(6, 2, 'SQL Server’da LIKE ile kullanılan ve herhangi sayıda karakterin yerini tutan joker karakter ____ işaretidir.')
bs(6, 5, 'Soldaki tablonun tüm kayıtlarını, sağda eşleşeni olmasa bile getiren birleştirme türü ____ JOIN’dir.')
bs(6, 6, 'Fiziksel olarak veri saklamayan, kaydedilmiş bir sorgudan ibaret olan sanal tabloya ____ denir.')
bs(6, 7, 'Bir SELECT sorgusunda ilk çalışan bölüm ____ , en son çalışan bölüm ____ bölümüdür.')
bs(7, 1, 'Bir N–M ilişkiyi tabloya dönüştürmek için iki tablonun birincil anahtarlarını içeren bir ____ tablosu oluşturulur.')
bs(7, 3, 'Her müşterinin toplam harcaması SUM( ____ * ____ ) ifadesiyle hesaplanır.')
bs(7, 4, 'SSMS’te tablolar arasındaki ilişkileri görsel olarak göstermek için ____ oluşturulur.')

# Ünite 6, C2-C3: açıklama "3. sınıfta" ile başladığı için yeni soru sanılmıştı
t6 = v['6']['test']
t6[1]['a'] = '3. sınıfta 3 öğrenci (OgrId 3, 4, 7), 1 numaralı bölümde 4 öğrenci (1, 2, 6, 8) vardır; ortak öğrenci yoktur: 3 + 4 = 7.'
t6[2]['c'] = 1
t6[2]['a'] = '1 numaralı bölümün 4, 5 numaralı bölümün 3, 4 numaralı bölümün 1 dersi vardır.'
v['1']['test'][2]['a'] = ''

# Boşluk başına cevap listesi
for n, b in v.items():
    for q in b['bosluk']:
        k = q['s'].count('____')
        parca = [x.strip() for x in re.split(r'\s+/\s+|\s*;\s*', q['c'])] if k > 1 else [q['c']]
        assert len(parca) == k, (n, q['s'], q['c'])
        q['cs'] = parca; del q['c']
    for grup in b.values():
        for q in grup: q.pop('_ham', None)

# HTML'e güvenli hale getir (SQL'de < > olabilir)
def kac(s): return html.escape(s, quote=False)
for b in v.values():
    for grup in b.values():
        for q in grup:
            q['s'] = kac(q['s'])
            if 'o' in q: q['o'] = [kac(o) for o in q['o']]
            if 'a' in q: q['a'] = kac(q['a'])
            if 'cs' in q: q['cs'] = [kac(x) for x in q['cs']]

NOTLAR = {'6': 'Bu ünitedeki SQL soruları, ünite notundaki örnek Fakülte veri tabanının tablolarına göre çözülür.',
          '7': 'Bu ünitedeki sorular, ünite notundaki uygulama veri tabanlarının tablolarına göre çözülür.'}
for n, s in NOTLAR.items(): v[n]['not'] = s
json.dump(v, open('vt_sorular.json', 'w'), ensure_ascii=False, indent=1)
print('ok', sum(len(g) for b in v.values() for k, g in b.items() if k != 'not'), 'soru')
