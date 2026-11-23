# Haber kapak illüstrasyonu örnekleri (depo kökünden çalıştırılır). Yeni kapak için bir blok kopyalayıp şekilleri değiştir.
from PIL import Image, ImageDraw, ImageFilter
import math, random
W,H=1600,900; S=2
NAVY=(13,27,54); NAVY2=(22,42,80)
def base(acc):
    im=Image.new('RGB',(W*S,H*S),NAVY); d=ImageDraw.Draw(im)
    # ince ızgara
    for x in range(0,W*S,80*S): d.line([(x,0),(x,H*S)],fill=(19,36,68),width=S)
    for y in range(0,H*S,80*S): d.line([(0,y),(W*S,y)],fill=(19,36,68),width=S)
    return im,d
def kaydet(im,ad):
    im=im.resize((W,H),Image.LANCZOS); im.save(f'gorseller/haberler/{ad}.webp','WEBP',quality=86)
L=lambda v:int(v*S)
WHITE=(236,240,248); RED=(200,16,46)
# 1 Eğitim: açık kitap + saat
im,d=base(None); ac=(242,178,62)
cx,cy=800,470
for i in range(6):
    y=cy-150+i*0; 
d.polygon([(L(cx),L(cy+150)),(L(cx-330),L(cy+110)),(L(cx-330),L(cy-170)),(L(cx),L(cy-130))],outline=WHITE,width=L(5))
d.polygon([(L(cx),L(cy+150)),(L(cx+330),L(cy+110)),(L(cx+330),L(cy-170)),(L(cx),L(cy-130))],outline=WHITE,width=L(5))
for i in range(7):
    t=i/7; y1=cy-110+i*34
    d.line([(L(cx-290),L(y1-3)),(L(cx-40),L(y1+28))],fill=(120,140,180),width=L(4))
    d.line([(L(cx+40),L(y1+28)),(L(cx+290),L(y1-3))],fill=(120,140,180),width=L(4))
r=105; ox,oy=1270,250
d.ellipse([L(ox-r),L(oy-r),L(ox+r),L(oy+r)],outline=ac,width=L(8))
d.line([(L(ox),L(oy)),(L(ox),L(oy-70))],fill=ac,width=L(8)); d.line([(L(ox),L(oy)),(L(ox+55),L(oy+20))],fill=ac,width=L(8))
kaydet(im,'verimli-ders-calisma')
# 2 Sağlıklı yaşam: kalp atışı çizgisi + su damlası + yaprak
im,d=base(None); ac=(74,222,128)
pts=[(120,520),(520,520),(580,420),(650,660),(720,300),(790,600),(840,520),(1480,520)]
d.line([(L(x),L(y)) for x,y in pts],fill=ac,width=L(9),joint='curve')
# damla
ox,oy=1230,280
d.polygon([(L(ox),L(oy-90)),(L(ox-58),L(oy+10)),(L(ox+58),L(oy+10))],fill=(96,165,250))
d.ellipse([L(ox-60),L(oy-25),L(ox+60),L(oy+95)],fill=(96,165,250))
# yaprak
import math as _m
cx,cy,ln,wd,ang=380,270,260,95,-0.7
pts=[]
for k in range(0,181):
    t=k/180*_m.pi; x=(t/_m.pi-0.5)*ln; y=_m.sin(t)*wd/2; pts.append((x,y))
pts+= [(x,-y) for x,y in reversed(pts)]
rot=[(cx+x*_m.cos(ang)-y*_m.sin(ang), cy+x*_m.sin(ang)+y*_m.cos(ang)) for x,y in pts]
d.polygon([(L(a),L(b)) for a,b in rot],fill=(34,160,90))
a0=(cx-ln/2*_m.cos(ang),cy-ln/2*_m.sin(ang)); a1=(cx+ln/2*_m.cos(ang),cy+ln/2*_m.sin(ang))
d.line([(L(a0[0]-30*_m.cos(ang)),L(a0[1]-30*_m.sin(ang))),(L(a1[0]),L(a1[1]))],fill=NAVY,width=L(5))
kaydet(im,'saglikli-yasam')
# 3 Erteleme: takvim sayfaları + ok
im,d=base(None); ac=(242,178,62)
for i in range(5):
    x=330+i*70; y=230+i*45
    d.rectangle([L(x),L(y),L(x+420),L(y+330)],fill=NAVY2 if i<4 else (30,55,100),outline=WHITE,width=L(4))
x,y=610,410
d.rectangle([L(x),L(y),L(x+420),L(y+70)],fill=RED)
for r_ in range(3):
    for c in range(5):
        d.rectangle([L(x+30+c*78),L(y+100+r_*70),L(x+80+c*78),L(y+140+r_*70)],outline=(120,140,180),width=L(3))
d.rectangle([L(x+30+3*78),L(y+100+70),L(x+80+3*78),L(y+140+70)],fill=ac)
d.line([(L(1120),L(300)),(L(1400),L(300))],fill=ac,width=L(10)); d.polygon([(L(1400),L(270)),(L(1450),L(300)),(L(1400),L(330))],fill=ac)
kaydet(im,'erteleme-aliskanligi')
# 4 Yapay zekâ: düğüm ağı
im,d=base(None); random.seed(4); ac=(129,162,255)
nodes=[(random.randint(180,1420),random.randint(140,760)) for _ in range(26)]
for i,a in enumerate(nodes):
    for b in nodes[i+1:]:
        if math.dist(a,b)<300: d.line([(L(a[0]),L(a[1])),(L(b[0]),L(b[1]))],fill=(70,95,150),width=L(3))
for i,(x,y) in enumerate(nodes):
    r=14 if i%5 else 24; col=RED if i==7 else (ac if i%5==0 else WHITE)
    d.ellipse([L(x-r),L(y-r),L(x+r),L(y+r)],fill=col)
kaydet(im,'yapay-zeka-egitim')
# 5 Kariyer: yükselen basamaklar + bayrak
im,d=base(None); ac=(242,178,62)
for i in range(6):
    x=220+i*190; h=90+i*90
    d.rectangle([L(x),L(800-h),L(x+170),L(800)],fill=NAVY2,outline=WHITE,width=L(4))
fx,fy=220+5*190+85,800-(90+5*90)
d.line([(L(fx),L(fy)),(L(fx),L(fy-170))],fill=WHITE,width=L(6))
d.polygon([(L(fx),L(fy-170)),(L(fx+110),L(fy-135)),(L(fx),L(fy-100))],fill=RED)
d.line([(L(260),L(720)),(L(1250),L(170))],fill=ac,width=L(6))
kaydet(im,'kariyer-yatirim')
# 6 Öğrenci yaşamı: kampüs binası + konuşma balonları
im,d=base(None); ac=(242,178,62)
d.polygon([(L(470),L(330)),(L(800),L(180)),(L(1130),L(330))],outline=WHITE,width=L(6))
d.rectangle([L(470),L(330),L(1130),L(360)],outline=WHITE,width=L(5))
for i in range(6): 
    x=520+i*110; d.rectangle([L(x),L(380),L(x+40),L(660)],outline=WHITE,width=L(5))
d.rectangle([L(440),L(680),L(1160),L(720)],outline=WHITE,width=L(5))
for (x,y,c) in [(260,250,ac),(1340,300,(129,162,255)),(1250,600,RED)]:
    d.rounded_rectangle([L(x-90),L(y-55),L(x+90),L(y+55)],radius=L(18),fill=c)
    d.polygon([(L(x-30),L(y+50)),(L(x-55),L(y+95)),(L(x+5),L(y+50))],fill=c)
    for k in range(3): d.ellipse([L(x-45+k*45-9),L(y-9),L(x-45+k*45+9),L(y+9)],fill=NAVY)
kaydet(im,'ogrenci-yasami')
print('ok')
# ---- 2. paket ----
# YKS takvimi: takvim + işaretli gün + kalem
im,d=base(None); ac=(242,178,62)
x,y=430,170
d.rectangle([L(x),L(y),L(x+740),L(y+560)],outline=WHITE,width=L(5))
d.rectangle([L(x),L(y),L(x+740),L(y+95)],fill=RED)
for k in range(2): d.rectangle([L(x+150+k*400),L(y-40),L(x+170+k*400),L(y+40)],fill=WHITE)
for r_ in range(4):
    for c in range(7):
        cx_,cy_=x+40+c*100,y+130+r_*105
        d.rectangle([L(cx_),L(cy_),L(cx_+70),L(cy_+70)],outline=(120,140,180),width=L(3))
d.ellipse([L(x+40+5*100-18),L(y+130+2*105-18),L(x+40+5*100+88),L(y+130+2*105+88)],outline=ac,width=L(8))
d.rectangle([L(x+40+6*100),L(y+130+2*105),L(x+40+6*100+70),L(y+130+2*105+70)],fill=ac)
kaydet(im,'yks-2027-takvim')
# Burs: üst üste paralar + yükselen ok
im,d=base(None); ac=(242,178,62)
for s_,(bx,n) in enumerate([(430,3),(640,5),(850,7)]):
    for k in range(n):
        yy=720-k*48
        d.ellipse([L(bx),L(yy-30),L(bx+170),L(yy+30)],fill=ac if k==n-1 else (190,140,40),outline=NAVY,width=L(4))
d.line([(L(1120),L(640)),(L(1350),L(330))],fill=WHITE,width=L(9)); d.polygon([(L(1320),L(310)),(L(1380),L(300)),(L(1370),L(360))],fill=WHITE)
kaydet(im,'kyk-burs-kredi')
# PISA: küre + çubuk grafik
im,d=base(None); ac=(129,162,255)
cx_,cy_,r=520,450,250
d.ellipse([L(cx_-r),L(cy_-r),L(cx_+r),L(cy_+r)],outline=WHITE,width=L(5))
for k in [-160,-80,0,80,160]: 
    w_=int(math.sqrt(max(r*r-k*k,0))); d.line([(L(cx_-w_),L(cy_+k)),(L(cx_+w_),L(cy_+k))],fill=(90,115,170),width=L(3))
for k in [0.35,0.7]:
    d.ellipse([L(cx_-r*k),L(cy_-r),L(cx_+r*k),L(cy_+r)],outline=(90,115,170),width=L(3))
for i,(h_,c) in enumerate([(230,(90,115,170)),(300,(90,115,170)),(420,RED)]):
    x=950+i*150; d.rectangle([L(x),L(760-h_),L(x+100),L(760)],fill=c)
d.line([(L(920),L(760)),(L(1420),L(760))],fill=WHITE,width=L(4))
kaydet(im,'pisa-2025')
# Spor: koşu pisti şeritleri + kronometre
im,d=base(None); ac=(74,222,128)
for k in range(5):
    d.arc([L(150-k*60),L(250-k*60),L(1050+k*60),L(1150+k*60)],180,270,fill=WHITE if k else ac,width=L(5))
    d.line([(L(600),L(250-k*60)),(L(1500),L(250-k*60))],fill=WHITE if k else ac,width=L(5))
ox,oy,r=1180,560,120
d.ellipse([L(ox-r),L(oy-r),L(ox+r),L(oy+r)],outline=ac,width=L(9)); d.rectangle([L(ox-20),L(oy-r-45),L(ox+20),L(oy-r-10)],fill=ac)
d.line([(L(ox),L(oy)),(L(ox+60),L(oy-60))],fill=ac,width=L(9))
kaydet(im,'fiziksel-aktivite')
# Uyku: hilal + yıldızlar + çubuklar
im,d=base(None); ac=(242,178,62)
d.ellipse([L(330),L(170),L(630),L(470)],fill=ac); d.ellipse([L(420),L(130),L(720),L(430)],fill=NAVY)
random.seed(9)
for _ in range(18):
    x,y=random.randint(150,1450),random.randint(110,420); r=random.choice([4,5,7])
    d.ellipse([L(x-r),L(y-r),L(x+r),L(y+r)],fill=WHITE)
for i,h_ in enumerate([140,180,160,230,250,240,300]):
    x=760+i*100; d.rectangle([L(x),L(780-h_),L(x+64),L(780)],fill=(129,162,255) if i<6 else RED)
d.line([(L(740),L(780)),(L(1460),L(780))],fill=WHITE,width=L(4))
kaydet(im,'uyku-ve-notlar')
# Sınav kaygısı: kâğıt + kalem + karalanmış satırlar
im,d=base(None); ac=(242,178,62)
d.rectangle([L(520),L(140),L(1040),L(790)],fill=(236,240,248))
for k in range(9):
    y=230+k*60; w_=420 if k%3 else 300
    d.line([(L(570),L(y)),(L(570+w_),L(y))],fill=(120,140,180),width=L(6))
d.line([(L(570),L(470)),(L(870),L(470))],fill=RED,width=L(8))
d.polygon([(L(1110),L(250)),(L(1170),L(290)),(L(930),L(640)),(L(870),L(600))],fill=ac)
d.polygon([(L(870),L(600)),(L(930),L(640)),(L(850),L(690))],fill=WHITE)
kaydet(im,'sinav-kaygisi-yazma')
print('ok2')
