# Rakip ve kullanıcı araştırması

Tarih: Ekim 2026. Bu belge bulguları, kaynaklarını ve sınırlarını ayırır. Karar çıkarımları `DECISIONS.md` ve `docs/DESIGN.md` içindedir.

## 1. Doğrudan App Store verisi (8 Ekim 2026)

Puan ve sayılar mağaza sayfalarından ve iTunes Lookup uç noktasından alındı. Yorum metinleri mağaza sayfasında görünen örnekler ve RSS akışındaki son yorumlardır.

| Uygulama | Geliştirici | Puan | Puan sayısı | Türkçe | Not |
|---|---|---|---|---|---|
| D-Plan: Daily Planner & Tasks | ATA GUN | Yok | 0 | Var (16 dil) | Nisan 2026'da çıkmış, son sürüm Eylül 2026. En yakın rakip. |
| Habit Tracker | Inner Grow | 4,79 | 147.713 | Yok | Puanların %87,9'u 5 yıldız, %1,6'sı 1 yıldız. |
| Productive | Mosaic | 4,60 | 91.063 | Var (19 dil) | %80,3 5 yıldız, %4,5 1 yıldız. |
| Routinery | Routinery Corp. | 4,72 | 18.028 | Yok (yalnızca İngilizce) | 2026 App of the Day, Forbes Health 2025 en iyi DEHB uygulaması. |

### D-Plan
- Vaat: "Yaz, yapay zekâ günü planlasın, sen onayla." Ekran görüntüsünde "Önerilen plan" kartı ve onay düğmesi var.
- Kapsam: görevler, alışkanlıklar ("seri tutan"), takvim, odak sayacı, notlar ve tuval, kontrol listeleri.
- Bugün ekranında günlük istatistikler: görev sayısı, odak dakikası, alışkanlık sayısı.
- Tasarım: koyu, cam efektli, pembe-mor ağırlıklı.
- Henüz yorum yok; kullanıcıların onu nasıl bulduğu bilinmiyor.

### Habit Tracker
- Sevilen (yorumlardan): renk, emoji ve simge özelleştirmesi, önerilen alışkanlıklar, bir bakışta yapıldı/yapılmadı gösteren widget'lar, "günde 20 dk" gibi birimli hedefler, ücretsiz sürümün yeterliliği.
- Dikkat: bir yorumda "tasarım alışmayı gerektiriyor". Özellik listesi çok uzun (sosyal, yarışma, HRV, ilham alıntıları).

### Productive
- Sevilen: "atladığında olumsuz geri bildirim vermiyor", alışkanlığı duraklatma, günün farklı saatlerine bölme. Bir kullanıcı rutini ilaç ve terapi düzeninin parçası olarak anlatıyor.
- Şikâyet: seri baskısı kapatılamıyor (3 yıldızlı yorum); cihaz senkronu, takvim ve Apple Health entegrasyonu isteniyor.

### Routinery
- Sevilen: adım adım zamanlayıcı ve sesli yönlendirme; "sabah rutinim bir buçuk saatten yarım saate indi". Claude ve ChatGPT üzerinden rutin kurma (MCP, ücretsiz planda).
- Şikâyet (son 93 yorumdan 12'si 1–2 yıldız): sabah onlarca bildirim, neyi hatırlattığını söylemeyen bildirim, sessiz kalan alarm, Apple Watch kullanımında çökme, ücretin kesilmesi ve iade talepleri, fiyatın uygulamada görünmemesi.
- Türkiye mağazası: 6 yorum; ikisi açıkça Türkçe istiyor, biri fiyatı "şeffaf değil" buluyor.

## 2. Önceki tarama (blog ve inceleme siteleri)

| Uygulama | Sevilen | Şikâyet | Ambient için ders |
|---|---|---|---|
| Motion | Karar yorgunluğunu azaltır, plan kendini yeniler | Plan sürekli yer değiştirir, kontrol yok; mobil ikincil; fiyat yüksek; hesap ve iade sorunları | Yapay zekâ önerir, onaysız değiştirmez |
| Reclaim | Odak ve alışkanlık bloklarını toplantılardan korur | Belirgin şikâyet bulunamadı | Boş aralık mantığı kontrol akışında |
| Sunsama | Sabah planlama ve akşam kapanış ritüeli; yoğun günü uyarır | Fiyat (aylık yaklaşık 20–25 $), mobil yardımcı rolde, öğrenme süresi, yapay zekâ yok | Hafif "Günü kapat" |
| Tiimo | Görsel gün, geçişlerdeki kaygıyı azaltır, hatırlatıcılar | Ücretsiz sürüm sınırlı | Tek "Sırada" odağı |
| Structured | Sakin tasarım, zaman bloklama | Tekrarlayan görev ve yapay zekâ ücretli; widget ve takvim senkronu isteniyor | Rutin ve widget çekirdek |
| Todoist, TickTick | Doğal dil girişi, takvim görünümü | Bu özellikler ücretli pakete alınınca tepki | Türkçe doğal dil girişi kilitlenmez |
| Streaks, Finch | Basitlik, baskısız ton | Seri kırılınca suçluluk, hasta iken bile yapma baskısı | Seri yok, atlamak nötr |

## 3. Çıkarımlar

1. D-Plan aynı vaadi (yaz, yapay zekâ planlasın, onayla) veriyor ve Türkçe destekli. Ayrışma ton, odak ve kapsam disiplininde olmalı; tek başına "yapay zekâ planlıyor" farkı yok.
2. Baskısız ton hâlâ boş bir pozisyon: Productive'de kapatılamayan seri baskısı tekrar eden bir şikâyet, D-Plan ise seriyle ters yöne gidiyor.
3. En sert yorumlar yeni özellik eksikliğinden değil, bildirim hatalarından, sessiz alarmdan, çökmeden ve belirsiz abonelikten geliyor. Bunlar kalite ölçütü.
4. Habit Tracker'ın başarısı özelleştirme ve widget'lardan geliyor; ikisi de Ambient'in kapsamında ve ucuz.
5. Türkçe fırsatı gerçek ama küçük bir örnekleme dayanıyor (Türkiye'den 6 yorum).

## 4. Sınırlar

- Blog ve inceleme siteleri (Lindy, TaskCoach, Saner, ClickUp, Morgen, Kimola vb.) çoğunlukla rakip ürün sahiplerine ait; taraflı olabilir.
- Habit Tracker ve Productive için yalnızca mağaza sayfasında görünen 8'er yorum okunabildi; Routinery için 93 yorum (çoğu Fransa ve Hindistan mağazalarından). Bunlar son yorumlardır, tüm kullanıcıları temsil etmez.
- Reddit ve Türkiye mağazasındaki alışkanlık/planlayıcı uygulamaları taranmadı.
- Tiimo, Sunsama, Motion gibi uygulamaların mağaza yorumları doğrudan okunmadı.
- `dplan-app.com` bir pazarlama sayfasıdır; içeriği sayfa metni olarak okunamadı.

## 5. Sonraki araştırma adayları
1. Türkiye mağazasında "planlayıcı", "rutin", "alışkanlık", "hatırlatıcı" aramaları ve ilk 10 uygulamanın yorumları.
2. Reddit (DEHB, verimlilik toplulukları) tartışmaları.
3. D-Plan'ın birkaç ay sonraki puanı ve yorumları.
4. Üç ila beş kullanıcıyla prototip testi (özellikle "Önerilen" durumu ve "Günü kapat").

## Kaynaklar
- [D-Plan, App Store](https://apps.apple.com/us/app/d-plan-daily-planner-tasks/id6761482246)
- [Habit Tracker, App Store](https://apps.apple.com/us/app/habit-tracker/id1438388363)
- [Productive, App Store](https://apps.apple.com/us/app/productive-habit-tracker/id983826477)
- [Routinery, App Store](https://apps.apple.com/us/app/routine-planner-habit-tracker/id1450486923)
- [Lindy](https://www.lindy.ai/blog/ai-planner), [TaskCoach](https://taskcoach.ai/blog/best-ai-planner-apps/), [Saner (Motion)](https://www.saner.ai/blogs/motion-reviews), [ClickUp (Motion)](https://clickup.com/blog/motion-review/)
- [Capterra (Sunsama)](https://www.capterra.co.uk/reviews/145616/sunsama), [Morgen (Sunsama)](https://www.morgen.so/de/blog-posts/sunsama-pricing)
- [Kimola (Structured)](https://kimola.com/reports/exclusive-insight-structured-daily-planner-feedback-analysis-google-play-en-146981), [Unstar (Todoist, TickTick)](https://unstar.app/blog/todoist-ticktick-things-3-microsoft-todo-apple-reminders-todo-apps-ranked-2026)
- [HabitDoom (seri kaygısı)](https://habitdoom.com/blog/streak-anxiety-habit-trackers), [Macaron (Streaks)](https://macaron.im/blog/streaks-habit-tracker-app-review-2026), [Yoga Journal (Finch)](https://www.yogajournal.com/lifestyle/finch-self-care-app?scope=anon)
