=== 1
aciklama: Basit seri, frekans ve oran tablosu, gruplandırılmış seri, zaman serisi, mekân serisi, birikimli seri ve histogram grafiği.

Ham veriler kendi başına pek bir şey anlatmaz. İstatistik serileri bu verileri belirli bir düzene sokarak okunur hâle getirir. Bu ünite seri türlerini ve histogram grafiğini anlatır.

## Basit seri ve frekans tablosu

Düzensiz ham verilerin belirli bir ölçüte göre sıralanmasıyla oluşan seriye **basit seri** denir. Bir değerin seride kaç kez geçtiğine **frekans (nᵢ)**, tüm gözlem sayısına **kütle (N)** denir. Her değerin frekansı N'ye bölünerek **oran** bulunur; oranlar ondalık ya da yüzde olarak yazılabilir ve toplamları 1 (yani %100) eder. Örneğin 30 kargo paketinden 4'ü aynı ağırlıktaysa bu değerin oranı 4/30 = 0,133, yani %13,3'tür.

## Gruplandırılmış seri

Veri sayısı çok fazla olduğunda ve birbirinden farklı çok sayıda değer çıktığında, veriler **sınıflar** hâlinde gruplanır. Gruplandırılmış seride her satır tek bir değeri değil, bir değer aralığını (örneğin 50–60 gram) temsil eder. Bir sınıfın üst sınırı ile alt sınırı arasındaki farka **sınıf aralığı** denir; 60 − 50 = 10 gibi.

## Zaman, mekân ve birikimli seriler

- **Zaman serisi:** Bir değişkenin aldığı değerlerin zamana göre kronolojik sıralanmasıdır. Örnek: aylara göre doğum sayıları.
- **Mekân serisi:** Değerlerin yere göre sınıflandırılmasıdır. Örnek: istatistiki bölgelere göre doğum sayıları.
- **Birikimli seri:** Belirli bir değerden daha küçük ya da daha büyük kaç gözlem olduğunu gösterir. **"-den az"** sütunu frekansların yukarıdan aşağıya, **"-den çok"** sütunu ise aşağıdan yukarıya doğru toplanmasıyla elde edilir.

## Histogram

Gruplandırılmış serilerin grafiğine **histogram** denir. Yatay eksende sınıflar, dikey eksende frekanslar yer alır; her sınıf, genişliği sınıf aralığı ve yüksekliği frekansı olan bitişik bir dikdörtgenle gösterilir. Örneğin şoförlerin aylık kat ettikleri mesafeler 0–3, 3–6, 6–9 bin km gibi sınıflarla histogramda gösterilebilir.

=== 2
aciklama: Duyarlı ortalamalar (aritmetik, geometrik, kareli ortalama) ve duyarlı olmayan ortalamalar (medyan ve mod); basit ve gruplandırılmış serilerde hesaplama.

İstatistik serileri bir olay hakkında bilgi verir, ama bu bilgi yeterince nesnel değildir. **Ortalama**, veri kümesinin hangi değer etrafında toplandığını gösteren ve kümeyi tek bir değerle özetleyen ölçüdür.

## Duyarlı ortalamalar

Aritmetik, geometrik ve kareli ortalama **duyarlı ortalamalardır**: hesaplanırken serinin bütün gözlem değerleri kullanılır, bu yüzden bir değerdeki değişiklikten hemen etkilenirler.

- **Aritmetik ortalama (x̄):** Değerlerin toplamının gözlem sayısına bölünmesidir: x̄ = Σx / n. Sekiz kişinin aylık harcamalarının toplamı 8.800 ₺ ise ortalama 1.100 ₺'dir.
- **Gruplandırılmış seride aritmetik ortalama:** Her sınıfın orta değeri (xᵢ) bulunur, frekansla çarpılır ve toplam frekansa bölünür: x̄ = Σ(xᵢ · nᵢ) / Σnᵢ. Örneğin 100–200 sınıfının orta değeri 150'dir.
- **Geometrik ortalama:** Logaritma yardımıyla hesaplanır: log G.O. = Σ(log xᵢ · nᵢ) / Σnᵢ, sonra G.O. = antilog(log G.O.). Oransal değişimleri ve çarpımsal büyümeyi özetlemek için uygundur.
- **Kareli ortalama:** Değerlerin karelerinin ortalamasının kareköküdür: K.O. = √(Σxᵢ² · nᵢ / Σnᵢ).

Aynı seri için genellikle **geometrik ortalama < aritmetik ortalama < kareli ortalama** olur. Örnekteki üretim serisinde bu değerler sırasıyla 29,34, 32 ve 34,06 bin tondur.

## Medyan

Küçükten büyüğe sıralanmış bir seriyi gözlem sayısı bakımından iki eşit parçaya ayıran değere **medyan** denir. Medyan ve mod **duyarlı olmayan ortalamalardır**; uç değerlerden etkilenmezler.

- Gözlem sayısı **tek** ise medyan (n + 1) / 2. sıradaki değerdir. 3, 5, 8, 10, 19 serisinde medyan 8'dir.
- Gözlem sayısı **çift** ise medyan n/2. ve (n/2 + 1). değerlerin ortalamasıdır. 50, 97, 239, 249, 257, 385 serisinde medyan (239 + 249) / 2 = 244'tür.
- **Gruplandırılmış seride:** Önce "-den az" sütununda n/2'yi ilk kez geçen sınıf (medyan sınıfı) bulunur, sonra Med = lₐ + ((n/2 − nₐ) / nₘ) × cₘ formülü uygulanır. Burada lₐ medyan sınıfının alt sınırı, nₐ o sınıfa kadarki frekanslar toplamı, nₘ medyan sınıfının frekansı, cₘ sınıf aralığıdır.

## Mod

Bir seride **en çok tekrarlanan değere mod** denir. 68, 71, 74, 47, 32, 74, 71, 74 serisinde 74 üç kez geçtiği için mod 74'tür.

Gruplandırılmış seride en yüksek frekanslı sınıf mod sınıfıdır ve Mod = lₐ + (Δ₁ / (Δ₁ + Δ₂)) × cₘ ile hesaplanır. Δ₁ mod sınıfının frekansı ile bir önceki sınıfınki arasındaki fark, Δ₂ ise bir sonraki sınıfınki arasındaki farktır.

=== 3
aciklama: Standart sapma ve varyans; frekans ve gruplandırılmış seride adım adım hesaplama, iki çözümlü örnek.

Ortalama bir seriyi tek değerle özetler, ama değerlerin bu ortalama etrafında ne kadar dağıldığını söylemez. **Değişkenlik ölçüleri** bu dağılımı ölçer; en çok kullanılanı standart sapmadır.

## Standart sapma

Bir seriyi oluşturan gözlem değerlerinin aritmetik ortalamadan sapmalarının **kareli ortalamasına** standart sapma denir. Standart sapma küçükse değerler ortalamaya yakın, büyükse ortalamadan uzağa dağılmıştır.

## Frekans ve gruplandırılmış seride hesaplama

1. Önce serinin aritmetik ortalaması bulunur: x̄ = Σ(xᵢ · nᵢ) / Σnᵢ. Gruplandırılmış seride xᵢ, sınıfın orta noktasıdır.
2. Ortalama her gözlem değerinden çıkarılır; farkların kareleri frekanslarla çarpılıp toplanır: Σ(xᵢ − x̄)² · nᵢ.
3. **Standart sapma:** s = √( Σ(xᵢ − x̄)² · nᵢ / Σnᵢ )
4. **Varyans:** standart sapmanın karesidir: σ² = s².

## Örnekler

- **Pasta firmaları:** 10 firmanın aylık işlediği un miktarlarında ortalama 520 / 10 = 52 ton, sapma kareleri toplamı 7560'tır. s = √(7560 / 10) = √756 ≈ 27,5 ton, varyans 756.
- **Kütüphane süreleri:** 80 öğrencinin kütüphanede geçirdiği sürelerde sınıf orta noktalarıyla ortalama 1516 / 80 = 18,95 saattir. Sapma kareleri toplamı 1463,80; s = √(1463,80 / 80) ≈ 4,28 saat, varyans ≈ 18,30.
