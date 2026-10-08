# Ayar kataloğu

> Bu dosya `packages/shared/src/settings.ts` kayıt defterinden üretilir (`pnpm --filter @ambient/shared docs`). Elle düzenleme.

## Yapay zekâ

| Anahtar                             | Ad                     | Varsayılan            | Birim | Risk     | Karar |
| ----------------------------------- | ---------------------- | --------------------- | ----- | -------- | ----- |
| `llm.provider`                      | Sağlayıcı              | `"anthropic"`         |       | Seviye 2 | D-039 |
| `llm.primary.model`                 | Birincil model         | `"claude-haiku-5-5"`  |       | Seviye 1 |       |
| `llm.primary.effort`                | Birincil çaba          | `"low"`               |       | Seviye 1 |       |
| `llm.escalation.model`              | Yükseltme modeli       | `"claude-sonnet-5-5"` |       | Seviye 1 |       |
| `llm.fallback.model`                | Yedek model            | `"claude-haiku-5-5"`  |       | Seviye 1 |       |
| `llm.maxOutputTokens`               | Çıktı üst sınırı       | `400`                 | token | Seviye 1 |       |
| `llm.timeoutMs`                     | İstek zaman aşımı      | `15000`               | ms    | Seviye 1 |       |
| `llm.escalation.minConfidenceBelow` | Yükseltme güven eşiği  | `0.6`                 |       | Seviye 1 |       |
| `llm.prompt.liveVersion`            | Yayındaki istem sürümü | `""`                  |       | Seviye 1 |       |

## Maliyet

| Anahtar                           | Ad                               | Varsayılan | Birim | Risk     | Karar |
| --------------------------------- | -------------------------------- | ---------- | ----- | -------- | ----- |
| `cost.killSwitch`                 | Acil durdurma                    | `false`    |       | Seviye 2 | D-020 |
| `cost.globalDailyCapUsd`          | Günlük toplam harcama tavanı     | `5`        | USD   | Seviye 1 |       |
| `cost.budgetRatio`                | Bütçe oranı                      | `0.3`      |       | Seviye 2 | D-033 |
| `cost.budgetMode`                 | Bütçe kipi                       | `"auto"`   |       | Seviye 1 | D-033 |
| `cost.budget.free`                | Normal bütçesi                   | `0.04`     | USD   | Seviye 1 |       |
| `cost.budget.plus.min`            | Plus taban                       | `0.12`     | USD   | Seviye 1 |       |
| `cost.budget.plus.max`            | Plus tavan                       | `0.4`      | USD   | Seviye 2 |       |
| `cost.budget.pro.min`             | Pro taban                        | `0.25`     | USD   | Seviye 1 |       |
| `cost.budget.pro.max`             | Pro tavan                        | `0.8`      | USD   | Seviye 2 |       |
| `cost.freeShareOfNetRevenue`      | Ücretsiz katman payı             | `0.15`     |       | Seviye 1 |       |
| `cost.commissionRate`             | Mağaza komisyonu                 | `0.3`      |       | Seviye 2 | D-028 |
| `cost.fxTryPerUsd`                | Kur (TL/USD)                     | `55`       |       | Seviye 1 |       |
| `cost.vatRate`                    | KDV oranı                        | `0.2`      |       | Seviye 2 |       |
| `cost.maxWeeklyBudgetChange`      | Haftalık bütçe değişim sınırı    | `0.1`      |       | Seviye 2 | D-033 |
| `cost.degrade.sonnetOffAt`        | Sonnet kapanma eşiği             | `0.7`      |       | Seviye 1 |       |
| `cost.degrade.shortenAt`          | Bağlam kısaltma eşiği            | `0.9`      |       | Seviye 1 |       |
| `cost.adminPlaygroundDailyCapUsd` | Oyun alanı günlük tavanı         | `1`        | USD   | Seviye 1 |       |
| `cost.rateLimit.perUserPerMinute` | Kullanıcı dakika sınırı          | `20`       |       | Seviye 1 |       |
| `cost.alert.tierCostShareOfNet`   | Uyarı: katman maliyeti/net gelir | `0.35`     |       | Seviye 0 |       |
| `cost.alert.localShareBelow`      | Uyarı: yerel çözüm oranı altı    | `0.4`      |       | Seviye 0 |       |
| `cost.alert.sonnetShareAbove`     | Uyarı: Sonnet oranı üstü         | `0.05`     |       | Seviye 0 |       |

## Ürün kuralları

| Anahtar                                | Ad                                   | Varsayılan | Birim | Risk     | Karar |
| -------------------------------------- | ------------------------------------ | ---------- | ----- | -------- | ----- |
| `notify.maxPerItemPerDay`              | Aynı iş için günlük bildirim         | `1`        |       | Seviye 1 | D-005 |
| `notify.maxActionsPerNotification`     | Bildirimde en çok eylem              | `3`        |       | Seviye 1 |       |
| `notify.defaultQuietStart`             | Varsayılan sessiz saat başlangıcı    | `"23:00"`  |       | Seviye 0 |       |
| `notify.defaultQuietEnd`               | Varsayılan sessiz saat bitişi        | `"07:30"`  |       | Seviye 0 |       |
| `closeDay.reminderTime`                | Günü kapat hatırlatma saati          | `"22:00"`  |       | Seviye 1 | D-018 |
| `closeDay.autoCloseAfterDays`          | Otomatik kapanma (gün)               | `2`        |       | Seviye 1 | D-018 |
| `trial.days`                           | Deneme süresi                        | `3`        | gün   | Seviye 2 | D-026 |
| `upsell.firstTwoWeeksGapDays`          | Yükseltme kartı: ilk 2 hafta aralığı | `4`        | gün   | Seviye 1 | D-026 |
| `upsell.afterGapDays`                  | Yükseltme kartı: sonraki aralık      | `10`       | gün   | Seviye 1 | D-026 |
| `upsell.maxPerMonth`                   | Yükseltme kartı: aylık üst sınır     | `3`        |       | Seviye 1 | D-026 |
| `tier.free.maxCounterRoutines`         | Normal: sayaçlı rutin sayısı         | `3`        |       | Seviye 2 | D-027 |
| `tier.free.historyDays`                | Normal: görünür geçmiş               | `30`       | gün   | Seviye 2 | D-027 |
| `personal.weightAskMonths`             | Kilo sorma aralığı                   | `6`        | ay    | Seviye 1 | D-031 |
| `personal.estimateSlightKg`            | “Biraz” karşılığı                    | `2`        | kg    | Seviye 1 | D-035 |
| `personal.estimateMuchKg`              | “Çok” karşılığı                      | `5`        | kg    | Seviye 1 | D-035 |
| `reports.minGroupSize`                 | Rapor en küçük grup                  | `50`       |       | Seviye 2 | D-036 |
| `reference.maxChangeWithoutFounderPct` | Referans: onaysız en büyük değişim   | `15`       | %     | Seviye 2 | D-034 |

## Giriş ve e-posta

| Anahtar                 | Ad                     | Varsayılan                         | Birim | Risk     | Karar |
| ----------------------- | ---------------------- | ---------------------------------- | ----- | -------- | ----- |
| `auth.magicLinkBaseUrl` | Magic link adresi      | `"http://localhost:3000"`          |       | Seviye 2 |       |
| `auth.mailFrom`         | Gönderen               | `"Ambient <no-reply@example.com>"` |       | Seviye 1 |       |
| `auth.appleClientId`    | Apple istemci kimliği  | `""`                               |       | Seviye 1 |       |
| `auth.googleClientId`   | Google istemci kimliği | `""`                               |       | Seviye 1 |       |

## Genel

| Anahtar                | Ad          | Varsayılan                | Birim | Risk     | Karar |
| ---------------------- | ----------- | ------------------------- | ----- | -------- | ----- |
| `general.publicApiUrl` | API adresi  | `"http://localhost:3000"` |       | Seviye 2 |       |
| `monitoring.enabled`   | Hata izleme | `false`                   |       | Seviye 1 | D-041 |

## Güvenlik

| Anahtar                                   | Ad                            | Varsayılan | Birim | Risk     | Karar |
| ----------------------------------------- | ----------------------------- | ---------- | ----- | -------- | ----- |
| `security.adminIdleTimeoutMin`            | Panel boşta zaman aşımı       | `30`       | dk    | Seviye 2 |       |
| `security.adminAbsoluteTimeoutHours`      | Panel mutlak oturum süresi    | `12`       | sa    | Seviye 2 |       |
| `security.adminCooldownMinutes`           | Seviye 2 bekleme süresi       | `15`       | dk    | Seviye 2 | Q29   |
| `security.auditRetentionMonths`           | Denetim kaydı saklama         | `24`       | ay    | Seviye 2 |       |
| `security.unparsedUtteranceRetentionDays` | Anlaşılmayan cümle saklama    | `30`       | gün   | Seviye 2 |       |
| `age.minimum`                             | 13 yaş alt sınırı             | `13`       |       | Kilitli  | D-037 |
| `age.bodyDataMinimum`                     | Boy/kilo sorulan en küçük yaş | `18`       |       | Kilitli  | D-037 |
