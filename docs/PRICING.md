# Üyelik, fiyat ve birim ekonomi

Durum: **öneri** (`DECISIONS.md` D-018…D-022, onay bekliyor). Fiyatlar, vergi ve komisyon varsayımları aşağıda ayrıca işaretlidir; yayından önce App Store Connect ve muhasebeyle doğrulanır. Maliyet mimarisi: `docs/COST-POLICY.md`. Pazarlama: `docs/MARKETING.md`.

## 1. Özet
- Üç katman: **Normal** (süresiz ücretsiz), **Plus**, **Pro**. Lifetime ve haftalık plan yok (değişken LLM maliyeti olduğu için).
- Katmanlar özellik kadar **maliyet bütçesiyle** de ayrılır: her kullanıcıya aylık bir "anlama bütçesi" tanınır; sistem bütçeye göre ucuz yoldan çalışır (`COST-POLICY.md`).
- Önerilen fiyatlar (KDV dahil, Türkiye): **Plus ₺99,99/ay · ₺599,99/yıl**, **Pro ₺199,99/ay · ₺1.199,99/yıl**. Global: Plus $3,99 · $29,99; Pro $8,99 · $59,99. Abonelik başlatınca **3 gün ücretsiz** (Apple tanıtım teklifi). Deneme bitip abone olunmazsa **Normal olarak devam** edilir; ara ara, baskısız yükseltme hatırlatması gösterilir (§6).
- Hesaplanan tipik maliyet kullanıcı başına ayda: Normal ≈ $0,03, Plus ≈ $0,11, Pro ≈ $0,23. En kötü senaryoda (bütçe sınırı dolu, yıllık plan, Small Business'a başvuru **yok** → %30 komisyon, TL zayıf) marjin Plus ≈ %53, Pro ≈ %57; başvuru onaylanırsa daha yüksek (§4).

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
| Yapay zekâ anlama (karmaşık cümle) | Günde yaklaşık 8 | Günde yaklaşık 14 | Günde yaklaşık 20 |
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
- Diyetisyen danışmanlığı: sabit gider, [DANIŞMANLIK ÜCRETİ] (henüz belli değil; birim ekonomiye dahil edilmedi).
- Altyapı (API, veritabanı, kuyruk, push): kullanıcı başına Normal $0,02, Plus $0,04, Pro $0,06 (tahmin).

### Kullanıcı başına aylık maliyet
| | Cümle başına | Tipik kullanım | Bütçe sınırında (LLM+STT) | Toplam tipik | Toplam en çok |
|---|---|---|---|---|---|
| Normal | $0,00016 | 60 | $0,04 (≈250 cümle) | **$0,03** | $0,06 |
| Plus | $0,00038 | 150 | $0,20 (≈524 cümle) | **$0,11** | $0,25 |
| Pro | $0,00053 | 300 | $0,45 (≈846 cümle) | **$0,23** | $0,52 |

Karşılaştırma: yönlendirmesiz "her cümle Sonnet" yaklaşımında aynı kullanım Normal $0,72, Plus $1,80, Pro $3,60 olurdu (**yaklaşık 12–25 kat**). Maliyeti düşüren şey fiyat değil, mimaridir.

### Net gelir ve marjin (Türkiye, KDV dahil fiyattan)
Net gelir = fiyat ÷ 1,20 (KDV) × (1 − komisyon) ÷ kur. Kur senaryoları 45 / 55 / 65 TL/USD (güncel kur bilinmiyor, senaryo). İki komisyon senaryosu: **A** = Small Business Program onaylı (%15), **B** = başvuru yok ya da onaylanmadı (%30, ilk yıl). Başvuru yapılacak, ama plan B'ye göre de sağlam olmalı.

Yıllık plan, aylık eşdeğer net gelir (USD):

| Plan | A %15 · kur 45 | A · kur 55 | A · kur 65 | B %30 · kur 45 | B · kur 55 | B · kur 65 |
|---|---|---|---|---|---|---|
| Plus ₺599,99/yıl (₺50/ay) | 0,79 | 0,64 | 0,54 | 0,65 | **0,53** | 0,45 |
| Pro ₺1.199,99/yıl (₺100/ay) | 1,57 | 1,29 | 1,09 | 1,30 | **1,06** | 0,90 |
Aylık planlar yaklaşık 2 kat net gelir getirir (Plus ₺99,99/ay → B, kur 55: $1,06).

Marjin (net gelirden toplam maliyet düşülür; kur 55 / kur 65):

| | Tipik kullanım (A) | Bütçe sınırında (A) | Tipik (B) | Bütçe sınırında (B) |
|---|---|---|---|---|
| Plus yıllık | %83 / — | %62 / %55 | %80 / — | **%61 / %53** |
| Pro yıllık | %82 / — | %65 / %58 | %78 / — | **%63 / %57** |
Global fiyatlarda (net = fiyat × 0,70 en kötü): Plus aylık $3,99 → marjin %91; Plus yıllık $29,99 → %86; Pro aylık $8,99 → %92; Pro yıllık $59,99 → %85 (bütçe sınırında).

### Ücretsiz kullanıcı finansmanı
Kur 55'te bir Plus yıllık abone ayda yaklaşık $0,42 (B) ile $0,54 (A) katkı verir; bu yaklaşık **14–18 ücretsiz kullanıcının** maliyetini (her biri $0,03) karşılar. Sabit maliyet örneği: ayda $300 sabit gider varsa başa baş için yaklaşık 600 Plus yıllık abone gerekir (kur 55). Gerçek sabit gider ve kur belli olunca güncellenecek.

## 5. Bütçe kuralı: "%30" ne demek?
Bir ücretli kullanıcıdan, KDV ve Apple komisyonu düştükten sonra elimize geçen paraya **net gelir** diyoruz. Yapay zekâ (cümleleri anlama ve bulut ses) için bu net gelirin **en fazla %30'unu** harcıyoruz; kalan %70'i sunucu, pazarlama, ekip ve kâr içindir. Bu bir **tavandır**, fiyat değil; tipik kullanıcı bütçenin yarısından azını harcar.

Örnek (Plus yıllık, ₺599,99 → ayda ₺50, kur 55):
1. KDV çıkar: ₺50 ÷ 1,20 = ₺41,67
2. Apple komisyonu: **A (%15):** ₺35,42 = **$0,64**; **B (%30):** ₺29,17 = **$0,53**
3. %30'u: **A: $0,19**, **B: $0,16**. Bu, o kullanıcının aylık anlama bütçesidir. Tipik Plus kullanıcısının gerçek harcaması yaklaşık $0,06'dır.

Neden yıllık planın neti? Kullanıcı hangi planda olursa olsun bütçe en düşük net gelirli planı baz aldığı için, hiçbir plan zarar etmez. Neden %30? Pazarlama, altyapı ve kâr için yeterli pay bırakırken kullanıcıya yeterli anlama hakkı verir. %20 daha güvenli ama kullanıcıya daha az hak; %40 daha cömert ama marjin ince. Oran kabul edildi (D-033); ilk 4 hafta ölçümle gözden geçirilir.

**Başvuru senaryolarına göre bütçeler** (referans kur 55):

| | Normal | Plus | Pro |
|---|---|---|---|
| **Plan B (başvuru yok, %30): başlangıç değeri** | $0,04 (≈ 8 cümle/gün) | **$0,16** (≈ 14/gün) | **$0,32** (≈ 20/gün) |
| Plan A (Small Business onaylı, %15) | $0,04 | $0,19 (≈ 17/gün) | $0,38 (≈ 24/gün) |

Karar: **bütçeleri plan B'ye göre başlatırız**; Small Business onayı gelince ve komisyon kuralı App Store Connect'te doğrulanınca plan A değerlerine çıkarız (kullanıcılara cömertlik artışı olarak). Böylece onay gecikse bile zarar etmeyiz. Normal katmanın bütçesi gelire bağlı değildir; pazarlama bütçesinden karşılanan sabit bir tavandır.
**Kendini ayarlayan sistem (D-033):** bütçe tek bir sabit sayı değil, her abonenin kendi net gelirinin %30'udur (katman tabanı/tavanıyla); kur, komisyon ve gerçek gelir değiştikçe günlük yeniden hesaplanır (`COST-POLICY.md` §4.1). Yukarıdaki tablo referans değerlerdir.

## 6. Paywall ve deneme kuralları
- Satış baskısı yok: paywall yalnızca (a) kullanıcı bir Plus/Pro özelliğine dokunduğunda, (b) anlama bütçesi dolduğunda, (c) Plan ve fiyat sayfasında gösterilir. Açılışta paywall yok.
- **3 gün ücretsiz:** Apple tanıtım teklifi; deneme bitmeden **1 gün önce** bildirim; ücret ve iptal yolu sayfada açık. Deneme maliyeti yaklaşık Plus $0,01, Pro $0,02.
- Yıllık plan öne çıkarılır ama aylık plan aynı sayfada eşit görünürlükte.
- İptal ve iade yolu uygulama içinde görünür. "Satın alımları geri yükle" her zaman erişilebilir.
- Düşürme (Pro → Plus → Normal) veri silmez; yalnızca sınırlar ve ritim seviyesi düşer, geçmiş saklı kalır (Normal'de 30 gün görünür, sonrası gizli ama silinmez).

### Deneme bittikten sonra ve yükseltme hatırlatması
- Abone olmazsa **Normal olarak devam eder**; hiçbir şey kilitlenmez, veri silinmez.
- Deneme bitince **bir kez** sakin bir bilgi sayfası ("Normal olarak devam ediyorsun") gösterilir.
- Sonra yalnız **uygulama içi kart**, bildirim yok: ilk 2 haftada 4 günde en fazla 1, sonra 10 günde en fazla 1, ayda en fazla 3. Kart "Bir daha gösterme (30 gün)" ve "Sonra" seçenekleri taşır.
- Hatırlatma **asla**: Günü kapat, Kontrol ya da bildirim yanıtı sırasında; Dinleniyorum durumunda; sessiz saatte; hata ya da "anlaşılmadı" sonrasında gösterilmez.
- Plus/Pro özelliğine dokununca ya da anlama bütçesi dolunca ilgili bilgi sayfası açılır (tasarım 4.7).
- Düşme etkisi: 3'ten fazla sayaçlı rutin **duraklatılır** (silinmez; ilk 3 aktif kalır), geçmiş 30 gün görünür (sonrası gizli, silinmez), ritim Temel'e iner, ek takvim hesapları pasifleşir. Yeniden yükseltince hepsi geri gelir.

## 7. Doğrulanacaklar
1. **Apple komisyonu:** Small Business Program'a **başvurulacak** (D-028). Abonelikte kaynaklar çelişiyor: bazıları programdakilere ilk günden %15, bazıları standart hesaplar için ilk yıl %30 sonra %15 diyor. App Store Connect'te doğrulanacak; o zamana dek plan B (%30) baz alınır.
2. **Türkiye vergileri:** KDV (%20 varsayıldı) ve dijital hizmet vergisinin fiyata yansıması muhasebeyle doğrulanacak.
3. **TL fiyat noktaları:** Apple'ın o dönemki fiyat tablosu; önerilen ₺99,99 ve ₺199,99 noktalarının mevcut olup olmadığı.
4. **Token ve yönlendirme varsayımları:** gerçek kullanımla beta'da ölçülür (`COST-POLICY.md` §9). İlk 4 hafta veriye göre fiyat ve bütçe gözden geçirilir.
5. **Önbellek:** Haiku 5.5 için önbellek okuma fiyatı ve en düşük önbelleklenebilir önek uzunluğu doğrulanacak; hesapta önbellek yok sayıldı.
6. **Rakip fiyatları** sık değişir; yayın öncesi yeniden çekilir.
