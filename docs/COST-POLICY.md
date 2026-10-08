# Maliyet politikası: maliyete göre değişen sistem

Amaç: kullanıcıya aynı sakin deneyimi verirken LLM ve altyapı maliyetini en aza indirmek. İlke `start.md` §5: **LLM anlar, kod karar verir.** Bu belge o kararın maliyet katmanıdır (policy hook). Fiyat ve katmanlar: `docs/PRICING.md`.

## 1. Yönlendirme sırası (ucuzdan pahalıya)
| Basamak | Ne | Maliyet | Ne zaman |
|---|---|---|---|
| 0. Yerel çözümleyici | Cihazda kural tabanlı Türkçe dil bilgisi: "bir bardak su içtim", "yaptım", "yarın 15:15", "saati 16:00 yap", sayılar, birimler, göreli tarihler | $0 | Güveni yüksek, tek işlemli cümleler |
| 1. Haiku 5.5 | Araç çağrısı çıkarma (`strict: true`, düşük çaba, kısa çıktı) | ≈ $0,0004/çağrı | Yerelin çözemediği cümleler |
| 2. Sonnet 5.5 | Çoklu iş, belirsiz bağlam, Haiku düşük güven | ≈ $0,012/çağrı | Yalnız Plus/Pro, bütçe izin verirse |
| — | Opus 5.5, Fable 5.1 | kullanılmaz | Bu işte gerekmiyor |

Ayarlar: Haiku 5.5'te `effort` varsayılanı `medium`; araç çıkarma için **açıkça `low`** gönderilir. Sonnet 5.5'te zorlamalı `tool_choice` 400 verir; `auto` + `strict: true` + istemde araç adı kullanılır. Çıktı üst sınırı (`max_tokens`) küçük tutulur (≈400). Haiku 5.5 reddetmelerinde sunucu tarafı yedek yok; reddetme kod tarafında "anlaşılmadı" akışına düşer.

## 2. Kısa ve sabit istem
- Sistem istemi ve araç şemaları **sabit önek** olarak tutulur; değişen bağlam (şimdi, bugünün planı, kullanıcı özeti) sona eklenir. Önbellek yalnız önek en düşük uzunluğu aşarsa çalışır (model bağımlı); `cache_read_input_tokens` loglanır.
- Bağlam sıkıştırılmış gelir: aktif rutinler (ad, tür, hedef), tercihler, bugünün 5–10 öğesi, **kullanıcı özeti** (aşağıda). Tüm geçmiş gönderilmez.
- Çıktı yalnız araç çağrısı JSON'u; açıklama cümlesi gerekirse şablondan üretilir, LLM yazmaz (Normal'de hiç yazmaz).

## 3. Düzenli özetleme (bağlamı küçük tutma)
- **Kullanıcı özeti ("Hafıza"):** kısa, sabit biçimli metin: önemli kişiler, rutinler ve hedefler, tercih edilen birimler, öğrenilen ritim desenlerinin özeti. Haftada bir **toplu işleme (Batch API, %50 ucuz)** ile Haiku üretir; değişmediyse atlanır. Her istek bu özeti ekler, geçmiş kayıtları değil.
- **Gün özeti (DayLog):** Normal'de şablon ve sayılar ($0). Plus/Pro'da gün kapanırken tek Haiku çağrısı (≈ $0,0003) ya da şablon.
- **Konuşma geçmişi:** konuşma bağlama yalnız son 2–3 tur eklenir; eski turlar `ParsedAction` kaydında kalır, bağlama girmez.
- **Kayıtlar:** su gibi sayaç kayıtları LLM'e ham gitmez; yalnız gün toplamı ve son saat gider.
- Özetler cihazda ve sunucuda kullanıcıya açıktır ve silinir ("Hafıza" anahtarı, Veri ve gizlilik).

## 4. Bütçe ve kademeli düşürme

### 4.1 Bütçe kuralı ve otomatik ayarlama (D-033)
- **Her ücretli abonenin aylık bütçesi = kendi net aylık gelirinin %30'u.** Net gelir = fiyat ÷ KDV oranı × (1 − komisyon) ÷ kur, kullanıcının **planı ve mağazası** için (TL fiyatla Türkiye aboneliği ile $ ile ABD aboneliği farklı bütçe alır). Aylık plan yıllıktan yüksek net verir, bütçesi de yüksektir.
- **Taban ve tavan** (katman başına): bütçe en az tabana, en çok tavana sabitlenir. Başlangıç: Plus taban $0,12 · tavan $0,40; Pro taban $0,25 · tavan $0,80 (ölçümle ayarlanır). Taban, çok ucuz pazarlarda hizmetin kullanılamaz hale gelmesini; tavan, pahalı planda aşırı harcamayı önler.
- **Ücretsiz katman:** kullanıcı başına sabit $0,04; ancak toplam ücretsiz harcama, toplam net gelirin **%15'ini** aşmaz (ya da lansman döneminde pazarlama bütçesinin belirlenen tutarı). Aşılırsa ücretsiz bütçe orantılı küçülür (en az $0,01).
- **Kendini ayarlama:** günlük bir iş şunları okur ve bütçeleri yeniden hesaplar: (a) kur (günlük ortalama), (b) komisyon oranı (Small Business onay durumu; onaylanana dek %30), (c) gerçek net gelir (App Store sunucu bildirimleri ve satış raporları), (d) gerçek maliyet telemetrisi. Değişiklikler **haftada en çok ±%10** ile yumuşatılır; admin onayı olmadan tavan/tabanı aşmaz; her değişiklik denetim kaydına yazılır ve uyarı üretir.
- **Örnek (kur 55, KDV %20):** Plus yıllık TL: net $0,53 (komisyon %30) → bütçe $0,16 ≈ 14 cümle/gün; Small Business onayında net $0,64 → bütçe $0,19 ≈ 17. ABD'de Plus aylık $3,99 → net $2,79 → %30 = $0,84 → tavan $0,40 uygulanır.
- Kullanıcıya gösterilen "günde yaklaşık N cümle" değeri bu bütçeden türetilir, yaklaşıktır ve plan sayfasında "yaklaşık" yazar.

### 4.2 Kademeli düşürme
Her çağrının gerçek maliyeti (token ve ses dakikası) kullanıcıya yazılır.

| Bütçe kullanımı | Davranış |
|---|---|
| < %70 | Normal çalışır |
| %70–%90 | Sonnet kapanır; yalnız Haiku. Kullanıcıya bir şey gösterilmez |
| %90–%100 | Bağlam daha da kısalır; çok işli cümleler tek tek sorulur |
| %100 | **Yerel mod:** basit kayıtlar çalışır; karmaşık cümleler sıraya alınır ("Sonra anlarım"), sakin bir bilgi sayfası gösterilir (tasarım 4.7), yükseltme önerilir ama zorlanmaz |
| Yeni dönem | Bütçe sıfırlanır, sıradaki cümleler işlenir (kullanıcı onaylarsa) |

Küresel güvenlik: günlük toplam harcama tavanı aşılırsa önce Normal katman yerel moda alınır; admin panelinde tek düğmeyle kapatılabilir (kill-switch).

## 5. Ses
- Varsayılan **cihaz içi** ses tanıma (maliyet $0, çevrimdışı; Türkçe doğruluğu hedef cihazlarda ölçülecek, çevrimdışı garanti sanılmamalı).
- Pro: cihaz güveni düşükse bulut ses tanıma (yaklaşık $0,006/dk, güncel fiyat doğrulanacak). Bulut ses bütçeye yazılır.

## 6. Bildirim, ritim, widget
- Bildirimler ve hatırlatmalar yerel planlanır (sunucu maliyeti ≈ 0); sunucu işleri yalnız senkron ve gün özeti içindir.
- Ritim öğrenme **cihazda** çalışır (sunucu maliyeti 0); katmanlar yalnız desen sayısını ve öneri tavanını değiştirir (`docs/RHYTHM.md`). Öneri cümleleri şablondandır; LLM yalnız Pro'da isteğe bağlı kişisel açıklama yazar.
- Widget yanıtları yerel işlenir.

## 7. Telemetri ve uyarılar
Her LLM çağrısı için kaydedilir: `userId (anonim), tier, route (local|haiku|sonnet), in/out/cache token, ses dakikası, maliyet, gecikme, sonuç (çözüldü|soru|reddedildi)`.
Panoda izlenenler: kullanıcı başına aylık maliyet, katman başına maliyet / net gelir, **yerel çözüm oranı (hedef ≥ %55)**, Sonnet oranı (hedef ≤ %2 Plus/Pro), önbellek isabeti, ortalama token, bütçe doluluk dağılımı.
Uyarılar: katman maliyeti net gelirin %35'ini aşarsa, yerel oran %40'ın altına düşerse, Sonnet oranı %5'i aşarsa.

## 8. Admin paneli (M6)
"Maliyet ve politika" modülü (tasarım 6.3): katman bütçeleri (Otomatik/Sabit kip), yönlendirme tablosu, model/sürüm ve çaba, kill-switch, kur ve komisyon, günlük tavan, kademeli düşürme eşikleri, hız sınırları, uyarılar ve **simülatör**. **Bu belgedeki tüm sayı ve eşikler panelden ayarlanır; `.env`'de yalnız önyükleme değişkenleri kalır (D-049).** Değişiklik yaşam döngüsü, risk seviyeleri, onaylar ve ayrıntılı sayfa tasarımı: `docs/ADMIN.md`. Her değişiklik denetim kaydına yazılır.

## 9. Ölçüm planı (beta)
1. İlk 2 hafta: gerçek cümle dağılımı; yerel çözüm oranı; token ortalamaları; escalation oranı.
2. Değerlendirme seti (100+ cümle) her cümlenin hangi basamakta çözüldüğünü ve maliyetini raporlar; sağlayıcı/model değişince doğruluk ve maliyet birlikte karşılaştırılır.
3. 4. haftada `PRICING.md` varsayımları gerçek verilerle güncellenir.

## 10. Riskler
| Risk | Etki | Önlem |
|---|---|---|
| Yerel çözüm oranı hedefin altında | Maliyet artar | Gramer genişletme; sık cümleler için kalıp öğrenme; oran uyarısı |
| Türkçe cihaz içi ses doğruluğu düşük | Daha çok LLM, kullanıcı hatası | Cihaz testi; yazma önceliği; Pro bulut ses |
| Bütçe katı hissedilir | Memnuniyet | Basit kayıtlar hiç kesilmez; sınır sakin dille söylenir |
| Fiyat/kur değişimi | Marjin erimesi | Bütçe net gelirin %30'una bağlı ve güncellenebilir |
| Önbellek varsayılandan az etkili | Maliyet artar | Hesapta önbellek yok sayıldı; ölçülünce iyileşme olarak eklenir |
