# Veri modeli: sayaçlı rutinler, kayıtlar, ritim

`start.md` §4'teki başlangıç modelini genişletir. Şemalar `packages/shared` içinde zod ile tanımlanır; mobilde Drizzle (SQLite), API'de Prisma (PostgreSQL). Tarihler UTC saklanır, gün sınırı kullanıcının saat dilimine göre hesaplanır.

## 1. İlke
Her kayıt konuşmadan ya da yazıdan gelir (`DECISIONS.md` D-012). Yapay zekâ bir araç çağrısı döndürür, kod doğrular ve uygular, sonuç geri alınabilir. Kullanıcı formla kayıt girmez.

## 2. Rutin türleri
| Tür | Örnek | Gün içinde | Kayıt |
|---|---|---|---|
| `check` | Okuma 20 dk, Genel kontrol | Bir kez işaretlenir | Tamamlandı/atlandı/dinlendi durumu |
| `timed` | Uykuya hazırlık 23:00 | Saati belli | Durum |
| `counter` | **Su, Kahve, Vitamin** | **Birden çok kez** | Her tekrar bir `LogEntry` |

`counter` rutinin hedefi: `target = { amount, unit, mode, period }`.
- `mode`: `atLeast` (su: en az 8 bardak), `atMost` (kahve: en fazla 3 fincan), `none` (yalnızca say).
- `period`: `day` ya da `week`.

## 3. Varlıklar

### Routine
`id, userId, title, iconKey, kind (check|timed|counter), schedule (RRULE benzeri), target?, unit?, reminderPolicy, status (active|paused), createdFromMessageId, createdAt, updatedAt, deletedAt`.

### LogEntry (sayaçlı rutin kaydı)
| Alan | Anlamı |
|---|---|
| `id` | UUID, istemcide üretilir (çevrimdışı çalışma ve senkron için) |
| `routineId` | Hangi rutin |
| `occurredAt` | Gerçekleşme zamanı, UTC |
| `amount` | Kanonik birimde miktar (su için ml, diğerleri için adet) |
| `displayUnit` | Kullanıcının söylediği birim (bardak, litre, fincan) |
| `source` | `voice`, `text`, `answer` (bildirim/widget yanıtı), `import` |
| `timeInferred` | `true` ise saat söylenmemiş, tahmin edilmiş (kullanıcıya "Doğru mu?" sorulur) |
| `messageId` | Kaydı doğuran konuşma |
| `undoneAt` | Geri alındıysa zaman |
| `deletedAt` | Soft delete |

Kayıtlar **yalnızca eklenir** (append-only); silme ve geri alma işaretleyicidir. Böylece senkron çakışması neredeyse yok olur (aynı `id` iki cihazda aynı kaydı temsil eder). Bu, `DECISIONS.md` Q4 için önerilen yaklaşımı destekler.

### Birimler
| Söylenen | Kanonik (su) |
|---|---|
| 1 bardak | 200 ml (kullanıcı değiştirebilir: "bardak 250 ml") |
| 1 şişe | 500 ml (kullanıcı değiştirebilir) |
| yarım litre | 500 ml |
| 1 litre | 1000 ml |
| yudum, bir kaç yudum | miktarsız: yalnızca "içti" olayı, sayaca 0,25 bardak eklenmez; sorulur |
Gösterim: kullanıcının tercih ettiği birim (varsayılan bardak). Kesirli sonuç "2,5 bardak" olarak gösterilir.

### DayAggregate (türetilmiş, önbellek)
`routineId, localDate, total, count, firstAt, lastAt`. Her zaman `LogEntry`'den yeniden üretilebilir.

### Pattern (öğrenilen ritim, `docs/RHYTHM.md`)
`id, userId, kind (weekday_time|forget_window|duration|weekend_shift|gap), subjectRoutineId?, params (JSON), evidenceCount, windowDays, firstSeenAt, lastSeenAt, status (active|forgotten|muted)`. Cihazda hesaplanır. `forgotten` desen yeniden öğrenilmez (kullanıcı açıkça isteyene kadar).

### Suggestion
`id, kind (reschedule|add_slot|reminder_time|rest), targetRef, reasonPatternIds[], text, proposedAt, status (proposed|accepted|declined|muted|expired), respondedAt`. `muted` o desen/öğe için öneriyi kalıcı susturur.

### OutboxUtterance (çevrimdışı kuyruk)
`id, text|audioRef, capturedAt, status (queued|sent|understood|failed)`. Bağlantı gelince sırayla anlaşılır; saat bilgisi `capturedAt`'ten çıkarılır (bu yüzden "az önce" doğru çözülür).

### Mevcut varlıklarla ilişki
`Item`, `FloatingItem`, `Routine` hepsi `iconKey` taşır. `ParsedAction` her araç çağrısını ve uygulanma sonucunu saklar; `undo_last` bu kayda göre çalışır.

## 4. Su örneği: baştan sona

1. Kullanıcı: "Az önce iki bardak su içtim." (14:33)
2. Bağlama eklenir: şimdi (kullanıcı saat dilimiyle), aktif rutinler (Su: sayaç, hedef 8 bardak), birim tercihi.
3. LLM araç çağrısı:
   ```json
   {
     "tool": "log_progress",
     "routine": "su",
     "amount": 2,
     "unit": "bardak",
     "at": "now"
   }
   ```
4. Yürütücü: `amount = 2 × 200 = 400 ml`, `occurredAt = 14:33` (kullanıcı "az önce" dediği için 14:31 olabilir; saat tahmini işaretlenir), tek `LogEntry` ekler. Üst sınır kontrolü (tek cümlede 2 litreden fazla ise sorar), tekrar kontrolü (30 saniye içinde aynı cümle ise tek kayıt).
5. Sonuç LLM'e döner, kullanıcıya kısa yanıt: "Bugün 5 bardak." Ekranda çıkarım kartı + Geri al.
6. Türeyen: Bugün sayacı, Su detayı kayıt listesi, Günün akışı işareti, Ritim ve Pattern girdisi.

Geriye dönük kayıt: "Sabah da bir bardak içmiştim." → `at: "morning"`, saat söylenmediği için `timeInferred = true`, 09:00 varsayılır, kullanıcıya "Doğru mu?" sorulur. Varsayılan saat eşlemesi: sabah 09:00, öğle 12:30, öğleden sonra 15:00, akşam 19:00, gece 22:00 (kullanıcının uyanma ve uyku saatine göre kaydırılır).

## 5. Diğer sayaçlar
- **Kahve** (`atMost`, 3 fincan): "Bir kahve içtim" → `log_progress`. Hedef aşılırsa suçlayıcı mesaj yok; yalnızca sayı. "Günde en fazla 3" yalnızca kullanıcı kendisi söylediyse tanımlanır.
- **Vitamin/ilaç** (`counter`, günde N kez, saatli hatırlatma): "09:00'da vitamin aldım" → kayıt. Kaçırılan doz için hatırlatma baskı dili kullanmaz. Tıbbi tavsiye vermez; yalnızca hatırlatır ve kaydeder.
- **Mola, su gibi herhangi bir sayılabilir şey**: kullanıcı "Günde 3 kez mola vereceğim" derse `create_routine` ile `counter` oluşur.

## 6. Hayat ritmi kategorileri ile bağ
Hayat ritmi ekranının yedi kategorisi (hareket, okuma, uyku, su, odak, sosyal, kişisel) `LogEntry` ve `Item` durumlarından türetilir. Yoğunluk değeri 0–1 arası normalize edilir ve **yalnızca görsel** kullanılır (skor olarak gösterilmez). Sağlık verisi (Faz 2) aynı yapıya `source: import` ile eklenir.

## 7. Saklama, silme, dışa aktarma
- Soft delete; "Tüm verileri sil" kalıcı silme (cihaz ve sunucu), silinecekler sayfada listelenir.
- Dışa aktarma: rutinler, kayıtlar, öğeler, kişiler, notlar (PDF, JSON, Markdown). Kayıtlar saat damgalı satırlar olarak çıkar.
- Pattern ve Suggestion cihazdadır; sunucuya yalnızca kullanıcı senkronu açıksa özet olarak gider.

## 8. Test notları
- Birim dönüşümleri ve yuvarlama (bardak ↔ ml).
- Gün sınırı: 23:50 ve 00:10 kayıtları doğru güne düşer; saat dilimi ve yaz saati değişimi.
- Çevrimdışı kayıt iki cihazda yinelenmez (aynı `id`).
- `undo_last` yalnızca son işlemi geri alır; geri alınan kayıt toplamdan düşer, geçmişte kalır.
- Aynı cümlenin iki kez gönderilmesi tek kayıt üretir (idempotency).
