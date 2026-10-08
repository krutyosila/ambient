# Takip: yapıldı mı diye sorma (D-048)

Amaç: kullanıcının programa eklediği her işin sonucunu **yaşam koçu ve asistan** tavrıyla öğrenmek; yanıtlanmayan iş kaybolmasın, ama kullanıcı bunalıp uygulamadan çıkmasın.

## 1. Ne sorulur
| Tür | Sorulur mu | Sorular |
|---|---|---|
| Rutin, görev, hatırlatma (koşu, okuma, "annemi ara") | Evet, zaman gelince | Yaptım / Daha geç / Bugün dinleniyorum |
| İlaç ve vitamin (kullanıcı kurduysa) | Evet, saatinde | Aldım / Daha geç / Bugün almıyorum |
| Sayaçlı rutin (su, kahve) | Hayır, kişiye tek tek sorulmaz; su için litre planı (RHYTHM §12) | İçtim / Daha geç |
| Etkinlik (toplantı, randevu) | Sormaz; yalnız Günü kapat'ta "Gerçekleşti mi?" tek satır | Evet / Ertelendi |
| "Önerilen" (onaylanmamış) | Hayır; plan değil, öneridir | Olur / Başka saat |

## 2. Zincir: yanıt gelene kadar, ama sakin
1. **İlk soru:** öğenin saatinde (görevde +15 dk; ilaçta tam saatinde).
2. **Yanıt yoksa tekrar:** aralıklar açılır, yoğunluk ayarına göre (Hatırlatma yoğunluğu):

| Yoğunluk | Aralık | Öğe başına günlük tavan (ilk soru dahil) |
|---|---|---|
| Sakin | 45 dk, 2 sa | 3 |
| Dengeli | 30, 60, 120 dk | 4 |
| Sık | 20, 40, 80, 120 dk | 5 (ilaçta 6) |

3. **Zincir durur:** Yaptım/Aldım, **Daha geç** (30 dk · 1 sa · akşam · yarın; ya da söz/yazıyla "6'ya al"), Bugün dinleniyorum/almıyorum, sessiz saat, odak modu ve toplantı, ya da tavan dolması.
4. **Tavan dolunca** bildirim susar ama iş **"Yanıt bekliyor" olarak açıkta kalır**: Bugün'de tek satır (Yaptım / Daha geç), akşam Günü kapat'ta tek soru. Yanıtlanana ya da ertelenene kadar kaybolmaz; kullanıcıyı yormadan açık kalır.
5. **Birleştirme:** aynı anda birden çok iş yanıt bekliyorsa tek bildirim ("2 şey yanıt bekliyor: Vitamin, Koşu"); yığılma yok.
6. Bildirim her seferinde neyi sorduğunu söyler (D-005), cümle her turda değişir, suçlama ve "kaçırdın" dili yok.

## 3. Koç davranışı (çıkmayı önleyen korkuluklar)
- **Erteleme öğrenme:** aynı iş üst üste 3 kez ertelenir ya da yanıtsız kalırsa tek, yargısız öneri: "Bu saat sana uymuyor olabilir. 19:30 dener misin?" (Olur / Ara verelim). Plan yine kendiliğinden değişmez.
- **Bırakma sinyali:** bildirimleri kapatma ya da yoğunluğu düşürme, zinciri bir kademe sakinleştirir ve tek cümleyle söylenir; kullanıcı izin vermeden artırılmaz.
- **Yoğun gün:** 3+ yanıt bekleyen iş birikirse hepsi tek karta toplanır ve "Hepsini yarına al / Tek tek bakalım" sunulur.
- **İlaç:** tıbbi tavsiye yok; "iki doz al" ya da "geç de olsa al" önerilmez. Kaçırılan doz kayıt olarak "almadım" işlenir, ton nötrdür.
- **İzin yok / pil tasarrufu:** bildirim gelmezse zincir uygulama içinde "Yanıt bekliyor" satırı olarak sürer; Bugün açılışında kullanıcıya nazikçe bildirilir.
- **Ölçüm (skor değil):** zincir başına yanıt oranı, bildirim kapatma oranı, 7 gün sonra tutunma. Hedef: takip arttıkça kapatma oranı artmamalı; artarsa varsayılan düşer.

## 4. Teknik
- **Yerel, $0:** zincir cihazda zamanlanır (yerel bildirim + eylem düğmeleri); LLM yok, tüm katmanlarda aynı. iOS bekleyen yerel bildirim üst sınırı (64) nedeniyle yalnız önümüzdeki 24–48 saat ve yalnız ilk 1–2 adım zamanlanır, uygulama açılışında/arka plan görevinde yeniden kurulur.
- **Yanıt iptal eder:** bir cihaz, widget ya da konuşma yanıtı bekleyen tüm zincir adımlarını iptal eder; senkronda `answeredAt` ile diğer cihaza yansır (T0 spike 2).
- **Veri:** `FollowUp` (itemId, tarih, adım, `askedAt[]`, `answeredAt`, yanıt: done/postponed/skipped/pending) — bkz. `docs/DATA-MODEL.md`.
- **Test:** tavan ve aralıklar, sessiz saat, yanıt gelince iptal, iki cihaz, izin reddi, gece yarısı sınırı, yinelenen bildirim yok (TEST-ENV §5.3); metin testi: suçlama sözcükleri yok.
