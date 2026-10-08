# Yol haritası

Süreler tek geliştirici hızıyla kaba tahmindir; ekip büyüklüğüne ve onay hızına göre ciddi değişir. Her milestone sonunda: çalışan build, testler, kısa özet ve bu belgede durum güncellemesi (`CLAUDE.md`). Kararlar `DECISIONS.md` içinde.

Durum: ☐ başlamadı · ◐ sürüyor · ☑ bitti

## Başlamadan önce (kod yok)
| İş | Çıktı | Durum |
|---|---|---|
| Rakip ve kullanıcı araştırması | `docs/RESEARCH.md` | ☑ |
| Tasarım v2 (7 ekran) | Tuval + `docs/DESIGN.md` | ◐ (Q7 ve eksik ekranlar) |
| `start.md` §0 gereği mimari özet, token çıkarımı, milestone planı, açık sorular | Kullanıcı onayı | ☐ |
| Bekleyen sorular Q1–Q11 | `DECISIONS.md` | ☐ |
| Küçük spike'lar (aşağıda) | Karar notları | ☐ |

### Spike'lar (M0'dan önce, her biri ≤ 1–2 gün)
1. **Widget:** Expo development build + config plugin ile iOS WidgetKit ve Android widget'ı çalışır halde göstermek. Başarısız olursa M7 yeniden planlanır.
2. **Yerel bildirimler:** expo-notifications ile sessiz saat, pil tasarrufu ve izin reddi senaryolarında planlanan bildirimin gerçekten tetiklendiğini doğrulamak. Rakip şikâyetlerinin kökü burası.
3. **Senkron stratejisi:** öğe başına `updatedAt` ile alan bazında birleştirme için küçük bir prototip (Q4).
4. **Türkçe göreli ifade çözümü:** 20–30 örnek cümle ile bir LLM'in "haftaya perşembe", "bu akşam", "işten çıkınca" ifadelerini doğru araç çağrısına çevirdiğini ölçmek. M3 değerlendirme setinin tohumu.

## Milestone'lar
| M | Kapsam | Çıkış ölçütü | Tahmin | Durum |
|---|---|---|---|---|
| **M0** Temel | pnpm monorepo, CI, Docker Compose, `design-tokens` (v1 + v2 farkları, koyu ve açık tema, 7 palet), `shared` iskeleti (`iconKey` enum'u dahil), i18n (tr varsayılan, en hazır), temel bileşenler ve **45 ikonluk set** (`design/icons`), bileşen galerisi | Galeri her iki temada; küçük metin kontrastı tüm paletlerde ölçüldü (açık tema dahil) | 1–2 hf | ☐ |
| **M1** Local-first çekirdek | expo-sqlite + Drizzle şeması (**sayaçlı rutin ve LogEntry dahil**), Bugün (Sırada kartı, su sayacı), Akış, Geçmiş, Gün gezinmesi, Karşılama, Çevrimdışı ve Boş gün durumları | Uçak modunda tam çalışan Bugün/Akış; 60 fps geçişler | 3 hf | ☐ |
| **M2** API ve senkron | NestJS, Prisma, JWT, magic link + Apple + Google, UTC ve zaman dilimi, delta senkron, soft delete, OpenAPI, **salt okunur takvim içe aktarma** | İki cihaz arası senkron; senkron testleri; takvim olayları Bugün'de görünür | 3 hf | ☐ |
| **M3** LLM katmanı | `LlmProvider` + adaptörler + yedek, araç çağrıları (zod): 9 temel + `log_progress`, `update_item`, `cancel_item`, `set_preference`, `set_icon`, `undo_last`, `forget_pattern`; deterministik yürütücü, ikon atama, birim dönüşümü ve su kaydı testleri, policy hook, Türkçe göreli tarih, Konuşma ve Hızlı not, 100+ cümlelik değerlendirme seti CI'da | Değerlendirme seti hedef doğruluk; prompt injection testleri; token ve maliyet kaydı | 4 hf | ☐ |
| **M4** Kontrol, bildirimler ve ritim | BullMQ, proaktif kontrol, boş aralıktan saat önerisi, yerel bildirimler, yoğunluk ve sessiz saat, **ritim öğrenme ve öneri motoru** (`docs/RHYTHM.md`), Ritmin sayfası | Bildirim kuralları (D-005) testlerle doğrulandı; yinelenen ya da sessiz bildirim yok; ritim desenleri simüle geçmişlerle test edildi, eşik altında öneri yok | 2 hf | ☐ |
| **M5** Hayat ritmi, Günü kapat, Menü ve alt sayfalar | DayLog, Hayat ritmi, **Günü kapat** (Q1 onayıyla), Menü, Rutinlerim (**simge/renk seçici**), Önemli kişiler, Veri ve gizlilik (KVKK dışa aktarma ve silme), Profil, **Plan ve fiyat**, Yardım | Prototipteki tüm dokunma akışları gerçek navigasyonda | 3 hf | ☐ |
| **M6** Admin paneli | Next.js + shadcn, RBAC + 2FA, kullanıcılar, LLM yönetimi, kullanım ve maliyet, rızalı ve PII maskeli kayıtlar, değerlendirme, içerik, feature flag, audit log, sistem sağlığı | Prompt sürümü değiştirilip geri alınabiliyor | 4 hf | ☐ |
| **M7** Widget | WidgetKit + Android App Widget, derin bağlantı ile hızlı not | Widget'tan 3 saniyede kayıt | 2 hf | ☐ |
| **M8** Faz 2 | Sağlık verisi (HealthKit, Health Connect), **Apple Watch** (Q9), değerlendirilecek: dış asistan bağlantısı (Q10) | MVP sonrası ayrı onay | belirsiz | ☐ |
| **M9** Cilalama ve yayın | Erişilebilirlik, Maestro e2e, OWASP, Sentry, EAS Build, mağaza hazırlığı (açık fiyat ve iptal yolu dahil) | Beta (TestFlight / dahili test) | 3 hf | ☐ |

## Bağımlılıklar
- M1 senkron stratejisi (Q4) netleşmeden veri şemasını dondurma.
- M3 için sağlayıcı kararı (Q3) gerekmeden başlanabilir (arayüz sağlayıcıdan bağımsız), ama değerlendirme sonuçlarıyla seçilir.
- M4 bildirimleri M1 yerel şemasına ve M3 araç çağrılarına bağlıdır.
- M5'teki Günü kapat için Q1; Plan ve fiyat sayfası için fiyatlandırma kararı.
- M7 spike'ının sonucuna bağlıdır.

## Riskler
| Risk | Etki | Önlem |
|---|---|---|
| Senkron hataları | Veri kaybı, güven kaybı | Spike 3; delta senkron testleri; M2'de uçtan uca çift cihaz testi |
| Bildirim güvenilirliği | Rakiplerde en sert yorumlar buradan | Spike 2; M4 çıkış ölçütü; gerçek cihaz testi |
| Widget Expo dışına çıkar | M7 gecikmesi | Spike 1; erken uyarı |
| Türkçe doğal dil doğruluğu (birim, saat, "az önce", "sabah da") | Çekirdek özellik | Değerlendirme seti; sağlayıcı karşılaştırması; M3 çıkış ölçütü; su kaydı cümleleri ayrı küme |
| Sayaç kaydı yanlış anlaşılır (ör. "yarım şişe") | Veri güveni | Tek soru, Geri al, makul üst sınır kontrolü, `timeInferred` onayı |
| Ritim önerisi baskı gibi hissedilir | Ürün ilkesi | Günlük tavan, nedenli öneri, "unut" ve kapatma, kabul oranı izleme |
| Ritim verisi ve KVKK | Hukuki | Açık rıza, cihazda hesaplama, silme ve dışa aktarma |
| D-Plan benzer vaatle pazarda | Ayrışma zorluğu | Ton, odak, kapsam disiplini (D-010); kullanıcı testi |
| KVKK: konuşma kayıtları, sağlık verisi | Hukuki risk | Açık rıza, PII maskeleme, silme uçları M2 ve M5'te baştan |
| Kanıt zayıflığı (küçük yorum örneği) | Yanlış ürün kararı | `docs/RESEARCH.md` §5: Türkiye mağazası ve kullanıcı testi |
| Açık temada düşük kontrast | Erişilebilirlik | M0 çıkış ölçütü |

## Üyelik, maliyet ve pazarlama işleri (D-018…D-025)
| İş | Milestone | Not |
|---|---|---|
| Yerel Türkçe çözümleyici (su, yaptım, saat, göreli tarih) | M1–M3 | Maliyetin ana kaldıracı; hedef yerel çözüm oranı ≥ %55 |
| Maliyet politikası katmanı: yönlendirme, bütçe, telemetri, kill-switch | M3 | `docs/COST-POLICY.md` |
| Kullanıcı "Hafıza" özeti (haftalık toplu işleme) | M3–M4 | Bağlamı küçültür |
| Ritim seviyeleri (Temel/Tam/Gelişmiş) | M4 | `docs/RHYTHM.md` §11 |
| Günü kapat hatırlatma ve otomatik kapanış | M4–M5 | D-018 |
| Plan ve fiyat, karşılaştırma, anlama hakkı sayfası, StoreKit abonelik, deneme | M5 | `docs/PRICING.md`; fiyatlar yapılandırma |
| Admin: Maliyet ve politika modülü | M6 | Tasarım 6.3 |
| Beta ölçümü: maliyet/net gelir, yerel çözüm oranı, escalation | M9 öncesi beta | Fiyat ve bütçe 4. haftada gözden geçirilir |
| Pazarlama: ASO, ekran görüntüleri, video, içerik üretici programı | M9 | `docs/MARKETING.md` |
| Proje özeti güncel tutma | Sürekli | `docs/SUMMARY.md` |

## Kişiselleştirme (D-029)
- Kişisel bilgi alma ve kullanma kuralları: `docs/PERSONALIZATION.md`. M2 (veri) ve M5 (Karşılama adımı, Profil, kilo sorusu); aralıklar uzman gözden geçirmesinden sonra (Q22).
- Deneme sonrası yükseltme kartı ve düşürme davranışı: M5.
- Diyetisyen: referans tablolarını (su, uyku) hazırlayıp onaylar; admin'de "Referans aralıkları" modülü (M6). Yayın önkoşulu (D-032, Q25).
- Bütçe otomatik ayarlama işi: kur/komisyon/gelir verisi, günlük hesap, haftalık ±%10 sınırı (M3–M6, D-033).
