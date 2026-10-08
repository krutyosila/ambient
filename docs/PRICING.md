# Üyelik, fiyat ve birim ekonomi

Durum: **öneri** (`DECISIONS.md` D-018…D-022, onay bekliyor). Fiyatlar, vergi ve komisyon varsayımları aşağıda ayrıca işaretlidir; yayından önce App Store Connect ve muhasebeyle doğrulanır. Maliyet mimarisi: `docs/COST-POLICY.md`. Pazarlama: `docs/MARKETING.md`.

## 1. Özet
- Üç katman: **Normal** (süresiz ücretsiz), **Plus**, **Pro**. Lifetime ve haftalık plan yok (değişken LLM maliyeti olduğu için).
- Katmanlar özellik kadar **maliyet bütçesiyle** de ayrılır: her kullanıcıya aylık bir "anlama bütçesi" tanınır; sistem bütçeye göre ucuz yoldan çalışır (`COST-POLICY.md`).
- Önerilen fiyatlar (KDV dahil, Türkiye): **Plus ₺99,99/ay · ₺599,99/yıl**, **Pro ₺199,99/ay · ₺1.199,99/yıl**. Global: Plus $3,99 · $29,99; Pro $8,99 · $59,99. Abonelik başlatınca **7 gün ücretsiz** (Apple tanıtım teklifi).
- Hesaplanan tipik maliyet kullanıcı başına ayda: Normal ≈ $0,03, Plus ≈ $0,11, Pro ≈ $0,23. En kötü senaryoda (bütçe sınırı dolu, yıllık plan, %30 komisyon, TL zayıf) marjin Plus ≈ %44, Pro ≈ %42.

## 2. Rakip fiyatları (App Store, 8 Ekim 2026)
Uygulama sayfalarındaki "Uygulama İçi Satın Alımlar" listesinden. Plan adları listelendiği gibi; bir uygulamanın birden çok fiyat noktası olabilir.

| Uygulama | ABD | Türkiye |
|---|---|---|
| D-Plan Standart | $4,99/ay · $29,99/yıl | ₺99,99/ay · ₺599,99/yıl |
| D-Plan Pro | $14,99/ay · $74,99/yıl | ₺249,99/ay · ₺1.499,99/yıl |
| Habit Tracker | $2,99/ay · $7,99/yıl · ömür boyu $9,89 | ₺149,99/ay · ₺349,99/yıl · ömür boyu ₺499,99 |
| Productive | $10,99/ay · yıllık $19,99–$79,99 | ₺149,99–₺299,99/ay |
| Routinery | $5,00–5,49/ay · $36–39,49/yıl · haftalık $0,99 | ₺79,99/ay · ₺569,99–₺579,99/yıl |
| Sunsama (blog verisi) | yaklaşık $20–25/ay | yok |
| Motion (blog verisi) | $19+/ay | yok |

Gözlemler: D-Plan Standart Türkiye fiyatı Plus önerimizle aynı, D-Plan Pro'nun yaklaşık %20 altında Pro öneriyoruz. Habit Tracker ve Routinery uzun vadeli ucuz planlar sunuyor; biz yıllık planı yaklaşık %50 indirimle öneriyoruz. Türkiye'de TL fiyatları ABD fiyatından farklı oranlarda belirleniyor (ör. Habit Tracker aylık $2,99 ↔ ₺149,99, D-Plan aylık $4,99 ↔ ₺99,99), yani yerel fiyat noktası ayrıca seçilmeli.

## 3. Katmanlar

| | **Normal** (ücretsiz) | **Plus** | **Pro** |
|---|---|---|---|
| Söz ve yazıyla kayıt | Basit kayıtlar (su, "yaptım", saatli etkinlik) cihazda, **sınırsız** | Aynı | Aynı |
| Yapay zekâ anlama (karmaşık cümle) | Günde yaklaşık 8 | Günde yaklaşık 17 | Günde yaklaşık 28 |
| Zor cümleler için güçlü model | Yok | Gerektiğinde, sınırlı | Gerektiğinde, sınırlı, öncelikli |
| Sayaçlı rutinler (su, kahve, ilaç) | 3 | Sınırsız | Sınırsız |
| Ritim öğrenme | **Temel**: 2 desen, günde en fazla 3 öneri | **Tam**: 5 desen, hafta sonu ve uyku, Ritmin sayfası | **Gelişmiş**: Tam + çapraz sinyal (takvim yoğunluğu ↔ su/koşu), haftalık plan önerisi |
| Günü kapat | Evet (şablon özet) | Evet (kişisel gözlem) | Evet (kişisel gözlem + hafta önizlemesi) |
| Gün kapanmadı bildirimi | Evet | Evet | Evet |
| Takvim içe aktarma | Yok | 1 takvim hesabı | Çoklu hesap |
| Geçmiş | 30 gün | Sınırsız | Sınırsız + dışa aktarma |
| Ses tanıma | Cihaz içi | Cihaz içi | Cihaz içi + düşük güvende bulut (daha doğru) |
| Faz 2 | — | — | Sağlık verisi, Apple Watch, dış asistan bağlantısı |
| Widget, bildirim, Türkçe, KVKK araçları | Hepsi | Hepsi | Hepsi |

İlkeler:
- **Güvenlik ve temel kalite paywall'a girmez:** bildirim doğruluğu, veri dışa aktarma ve silme, Türkçe doğal dil girişi, geri al her katmanda.
- Normal katman kullanışlı kalır; amaç baskı değil, değer görünce yükseltme.
- Gün sayıları "yaklaşık"tır: gerçek sınır bütçedir (aşağıda). Kullanıcıya sayaç gösterilmez; sınır yaklaşınca sakin bir bilgi gelir.

## 4. Birim ekonomi

### Varsayımlar (ölçülmedi, beta'da ölçülecek)
- Model fiyatları (Claude API, 1M token başına, önbellek tarihi 6 Ekim 2026): Haiku 5.5 giriş $0,10 / çıkış $0,50; Sonnet 5.5 giriş $2 / çıkış $10.
- Tipik niyet çıkarma çağrısı: Haiku, 1.800 giriş + 350 çıkış token ≈ **$0,00036**. Zor cümle: Sonnet, 3.000 + 600 ≈ **$0,012**. Önbellek ve toplu işleme tasarrufu hesaba **katılmadı** (üst sınır).
- Yönlendirme: cümlelerin %55'i cihazda kural tabanlı çözülür (hedef; ölçülecek), kalanı Haiku; Plus ve Pro'da %2'si Sonnet'e çıkar.
- Aylık tipik kullanım: Normal 60, Plus 150, Pro 300 cümle. Pro'da cümlelerin %25'i bulutta ses tanımaya gider (0,1 dk × $0,006/dk).
- Altyapı (API, veritabanı, kuyruk, push): kullanıcı başına Normal $0,02, Plus $0,04, Pro $0,06 (tahmin).

### Kullanıcı başına aylık maliyet
| | Cümle başına | Tipik kullanım | Bütçe sınırında (LLM+STT) | Toplam tipik | Toplam en çok |
|---|---|---|---|---|---|
| Normal | $0,00016 | 60 | $0,04 (≈250 cümle) | **$0,03** | $0,06 |
| Plus | $0,00038 | 150 | $0,20 (≈524 cümle) | **$0,11** | $0,25 |
| Pro | $0,00053 | 300 | $0,45 (≈846 cümle) | **$0,23** | $0,52 |

Karşılaştırma: yönlendirmesiz "her cümle Sonnet" yaklaşımında aynı kullanım Normal $0,72, Plus $1,80, Pro $3,60 olurdu (**yaklaşık 12–25 kat**). Maliyeti düşüren şey fiyat değil, mimaridir.

### Net gelir ve marjin (Türkiye, KDV dahil fiyattan)
Net gelir = fiyat ÷ 1,20 (KDV) × (1 − komisyon) ÷ kur. Kur senaryoları 45 / 55 / 65 TL/USD (güncel kur bilinmiyor, senaryo).

| Plan | En iyi durum (%15, kur 45) | En kötü durum (%30, kur 65) | Marjin tipik / bütçe sınırında (en kötü) |
|---|---|---|---|
| Plus aylık ₺99,99 | $1,57 | $0,90 | %93 / %72 |
| Plus yıllık ₺599,99 (₺50/ay) | $0,79 | $0,45 | %86 / **%44** |
| Pro aylık ₺199,99 | $3,15 | $1,79 | %93 / %71 |
| Pro yıllık ₺1.199,99 (₺100/ay) | $1,57 | $0,90 | %85 / **%42** |

Global fiyatlarda (net = fiyat × 0,70 en kötü): Plus aylık $3,99 → marjin %91; Plus yıllık $29,99 → %86; Pro aylık $8,99 → %92; Pro yıllık $59,99 → %85 (bütçe sınırında).

### Ücretsiz kullanıcı finansmanı
Kur 55 ve komisyon %15'te bir Plus yıllık abone ayda yaklaşık $0,54 katkı verir; bu yaklaşık **18 ücretsiz kullanıcının** maliyetini (her biri $0,03) karşılar. Sabit maliyet örneği: ayda $300 sabit gider varsa başa baş için yaklaşık 600 Plus yıllık abone gerekir (kur 55). Gerçek sabit gider ve kur belli olunca güncellenecek.

## 5. Bütçe kuralı (maliyete göre değişen sistem)
- Her katmana aylık bir **anlama bütçesi** (LLM + bulut ses) tanımlanır: Normal $0,04, Plus $0,20, Pro $0,45 (referans kur 55).
- Kural: bütçe, o katmanın **en düşük net gelirli planının %30'unu** aşmaz. Kur ya da komisyon değişince admin panelinden güncellenir; üç ayda bir gerçek maliyetle yeniden hesaplanır.
- Bütçe dolmaya yaklaştıkça sistem kademeli ucuzlar (Sonnet kapanır → yalnız Haiku → yerel mod). Ayrıntı: `COST-POLICY.md`.

## 6. Paywall ve deneme kuralları
- Satış baskısı yok: paywall yalnızca (a) kullanıcı bir Plus/Pro özelliğine dokunduğunda, (b) anlama bütçesi dolduğunda, (c) Plan ve fiyat sayfasında gösterilir. Açılışta paywall yok.
- 7 gün ücretsiz: Apple tanıtım teklifi; deneme bitmeden **3 gün önce** bildirim; ücret ve iptal yolu sayfada açık.
- Yıllık plan öne çıkarılır ama aylık plan aynı sayfada eşit görünürlükte.
- İptal ve iade yolu uygulama içinde görünür. "Satın alımları geri yükle" her zaman erişilebilir.
- Düşürme (Pro → Plus → Normal) veri silmez; yalnızca sınırlar ve ritim seviyesi düşer, geçmiş saklı kalır (Normal'de 30 gün görünür, sonrası gizli ama silinmez).

## 7. Doğrulanacaklar
1. **Apple komisyonu:** Small Business Program %15; abonelikte ilk yıl için kaynaklar çelişiyor (bazıları ilk günden %15, bazıları ilk yıl %30 diyor). App Store Connect'te ve Apple sayfasında doğrulanacak.
2. **Türkiye vergileri:** KDV (%20 varsayıldı) ve dijital hizmet vergisinin fiyata yansıması muhasebeyle doğrulanacak.
3. **TL fiyat noktaları:** Apple'ın o dönemki fiyat tablosu; önerilen ₺99,99 ve ₺199,99 noktalarının mevcut olup olmadığı.
4. **Token ve yönlendirme varsayımları:** gerçek kullanımla beta'da ölçülür (`COST-POLICY.md` §9). İlk 4 hafta veriye göre fiyat ve bütçe gözden geçirilir.
5. **Önbellek:** Haiku 5.5 için önbellek okuma fiyatı ve en düşük önbelleklenebilir önek uzunluğu doğrulanacak; hesapta önbellek yok sayıldı.
6. **Rakip fiyatları** sık değişir; yayın öncesi yeniden çekilir.
