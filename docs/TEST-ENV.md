# Tam çalışır test ortamı: plan

Durum: **onay bekliyor** (`start.md` §0 gereği kod yazmadan önce mimari plan ve milestone onayı). Karar: önce uygulamayı tam çalışır bir test ortamına çıkarırız; yayın öncesi hukuk, diyetisyen adı ve mağaza işleri bu sürede hazırlanır (D-038).

## 1. "Tam çalışır test ortamı" tanımı
Seçilmiş test kullanıcılarının **gerçek cihazda (iOS, TestFlight)**, **gerçek bir sunucuya (staging)** bağlanıp günlük hayatta kullanabildiği, **gerçek yapay zekâ çağrılarıyla** çalışan ve maliyeti ölçülebilen sürüm.

**Kapsamda (test 1):**
| Alan | İçerik |
|---|---|
| Giriş | E-posta (magic link), Apple, Google; Karşılama 3 soru; Seni tanıyayım; izinler; rıza |
| Çekirdek | Bugün, Günün akışı, Gün gezinmesi, Günlük geçmiş, Hayat ritmi, Etkinlik/rutin/kişi detayları |
| Konuşma | Yazı ve söz ile kayıt; çıkarım kartları, tek soru, anlaşılmadı, geri al; hızlı not; çevrimdışı kuyruk |
| Sayaçlı rutin | Su, kahve, ilaç; kayıt listesi, hedef, birim; yerel Türkçe çözümleyici |
| Bildirimler | Yerel planlama; Kontrol; Günü kapat + hatırlatma + otomatik kapanış; sessiz saat; yoğunluk |
| Ritim ve öneri | Temel ve Tam seviye (cihazda); "Önerilen" satırı; Ritmin sayfası; unut |
| Kişiselleştirme | Elle/yazıyla bilgi girişi, kilo çizgisi, referans tabloları (yer tutucu → diyetisyen), 18 yaş koruması |
| Üyelik | Normal/Plus/Pro; **StoreKit sandbox**; 3 gün deneme; limit ve düşürme; Plan sayfaları |
| Maliyet | Yerel → Haiku → Sonnet yönlendirme; bütçe; kademeli düşürme; telemetri |
| Admin (çekirdek) | Yapılandırma merkezi + Entegrasyonlar (anahtarlar panelden), Maliyet ve politika, Modeller/istem sürümü, Kullanıcılar (okuma), referans aralıkları ve Diyetisyen alanı (temel), içerik, feature flag, audit log (`docs/ADMIN.md` §12) |
| Kalite | CI, birim + API + e2e testleri, 100+ cümlelik değerlendirme seti, Sentry, yapılandırılmış log |

**Kapsam dışı (sonraki testler):** Android widget ve iOS widget (M7), Apple Watch, sağlık verisi, dış asistan bağlantısı, ödeme dışı pazarlama araçları. Android test dahili sürümü test 2'de.

## 2. Ortamlar
| Ortam | Amaç | Not |
|---|---|---|
| **local** | Geliştirme | Docker Compose: PostgreSQL, Redis, API, admin; Expo development build |
| **staging** | Test kullanıcıları | Bulutta tek bölge; yönetilen PostgreSQL ve Redis; konteyner barındırma; ayrı LLM anahtarı ve **düşük harcama tavanı**; gerçek kişisel veri yok (test hesapları) |
| **production** | Yayın | Test 1 sonrasında, aynı altyapı kodu; ayrı gizli anahtarlar |
Mobil dağıtım: EAS Build, iOS TestFlight iç/dış test; OTA güncelleme yalnız JS değişikliklerinde.

## 3. Mimari özet (ayrıntı: `start.md` §3)
Monorepo (pnpm): `apps/mobile` (Expo, expo-router, local-first SQLite/Drizzle), `apps/api` (NestJS, PostgreSQL, Redis/BullMQ, REST+OpenAPI, JWT), `apps/admin` (Next.js, shadcn), `packages/shared` (zod, tipler, istemci), `packages/design-tokens`. LLM katmanı sağlayıcıdan bağımsız arayüz; yönlendirme ve bütçe `docs/COST-POLICY.md`. Token ve tasarım dili `docs/DESIGN.md`.

## 4. Sıra ve kaba süre (tek geliştirici; ekip büyüdükçe kısalır)
| Aşama | İçerik | Hafta |
|---|---|---|
| T0 Hazırlık | Spike'lar (bildirim güvenilirliği, senkron, Türkçe çözümleyici, StoreKit sandbox); hesaplar ve anahtarlar | 1–2 |
| T1 Temel (M0) | Monorepo, CI, Docker, tokens, i18n, ikon seti, bileşen galerisi | 2 |
| T2 Çekirdek local-first (M1) | SQLite şeması, Bugün/Akış/Geçmiş/Gezinme, Karşılama, sayaçlı rutin, çevrimdışı | 3 |
| T3 API ve senkron (M2) | NestJS, auth, delta senkron, takvim içe aktarma (salt okunur) | 3 |
| T4 LLM ve maliyet (M3) | Yerel çözümleyici, araç çağrıları, yürütücü, yönlendirme, bütçe, telemetri, değerlendirme seti | 4 |
| T5 Bildirim ve ritim (M4) | Kontrol, bildirimler, Günü kapat ve hatırlatma, ritim motoru | 3 |
| T6 Kişisel ve üyelik (M5 çekirdek) | Kişisel bilgiler ve rıza, Plan/StoreKit sandbox, limit/düşürme, alt sayfalar | 3 |
| T7 Admin çekirdeği (M6 alt küme) | Yapılandırma merkezi, entegrasyonlar, maliyet ve politika, model/istem, kullanıcılar (okuma), referans ve diyetisyen alanı, flag, audit | 3–4 |
| T8 Beta hazırlığı | E2E, erişilebilirlik, güvenlik gözden geçirme, TestFlight, test planı | 2 |
Toplam **yaklaşık 24–26 hafta** (tek geliştirici). Bağımsız işler (admin, API, mobil, tasarım sistemi) paralel yürütülürse 14–16 haftaya inebilir. Bu bir tahmindir; T0 sonunda yenilenir.

## 5. "Test ortamı hazır" çıkış ölçütleri
1. Giriş → karşılama → kayıt → bildirim → günü kapat akışı gerçek cihazda uçtan uca çalışıyor.
2. Değerlendirme setinde Türkçe cümleler hedef doğrulukta; su kayıt cümleleri ayrı kümede doğru.
3. **Bildirim testi:** yinelenen ya da sessiz kalan bildirim yok (sessiz saat, pil tasarrufu, izin reddi senaryoları).
4. **Senkron testi:** iki cihaz arası, çevrimdışı kayıt iki cihazda yinelenmez.
5. **Maliyet:** kullanıcı başına maliyet ve yerel çözüm oranı panoda görünüyor; bütçe aşımında kademeli düşürme çalışıyor.
6. **Abonelik:** sandbox'ta deneme, abonelik, iptal, geri yükleme, düşürme doğru.
7. **KVKK:** rıza, geri çekme, dışa aktarma, silme çalışıyor; staging'de gerçek veri yok; 18 yaş altı koruması testli.
8. Erişilebilirlik: kontrast ≥ 4,5:1 (koyu tema), dokunma hedefi ≥ 44 px, VoiceOver temel akışlar.
9. Çökme oranı ve Sentry kurulu; log'da kişisel veri yok.

## 6. Test planı
- **Kullanıcılar:** 5–10 iç kullanıcı → 20–50 kapalı beta. Çeşitlilik: farklı yaş, çalışma düzeni, iOS sürümü.
- **Senaryolar:** 14 gün günlük kullanım; su kayıtları (çok kez); yoğun gün; çevrimdışı; deneme sonrası Normal; 18 yaş altı hesabı; rıza geri çekme.
- **Sentetik geçmiş:** ritim motoru için simüle edilmiş 8 haftalık geçmişler.
- **Ölçümler:** yerel çözüm oranı (hedef ≥ %55), Sonnet oranı (≤ %2), maliyet/kullanıcı, öneri kabul oranı, bildirim tepkisi, çökmesiz oturum.
- **Geri bildirim:** uygulama içi tek soru + haftalık kısa anket; "anlaşılmadı" örnekleri değerlendirme setine eklenir.

## 7. Sizden gereken (test ortamı için)
| İhtiyaç | Neden | Durum |
|---|---|---|
| Apple Developer hesabı | TestFlight, StoreKit sandbox | Gerekli (Small Business başvurusu bu aşamada kapsam dışı, D-028) |
| Anthropic API anahtarı ve **harcama limiti** | Gerçek çağrılar (D-039) | Gerekli |
| Hosting | Staging | Kullanıcıya ait, şu aşamada gerek yok (D-040) |
| Alan adı + e-posta gönderim hizmeti | Magic link, destek | Gerekli |
| Apple ve Google ile giriş yapılandırması | Giriş | Gerekli |
| Hata izleme (Sentry ücretsiz katman ya da GlitchTip) | Hata izleme (D-041) | Gerekli, ücretsiz başlanır |
| Test kullanıcıları ve cihaz listesi | Beta | Gerekli |
| Diyetisyen: ad, unvan ifadesi, hukuki hazırlık, referans taslağı | Yayın öncesi (D-034, Q27) | Yayından önce hazırlanır |
| Hukuk: KVKK aydınlatma/rıza metinleri, kullanım koşulları | Yayın öncesi | Yayından önce hazırlanır |

## 8. Riskler
| Risk | Önlem |
|---|---|
| Türkçe çözümleyici ve doğruluk | Erken spike ve değerlendirme seti; yerel kural genişletme |
| Bildirim güvenilirliği (rakiplerin en sert şikâyeti) | Spike 2, e2e senaryoları, gerçek cihaz testi |
| Maliyet varsayımları tutmaz | Telemetri ilk günden; bütçe ve düşürme hazır |
| Kapsam büyür | Test 1 kapsam tablosu sabit; yeni istekler "test 2" listesine |
| Hukuk ve mağaza süreçleri uzar | Test sürecinde paralel yürütülür |

## 9. Önerilen ilk adımlar (onayla başlanır)
1. Hesap ve anahtarların açılması (§7).
2. T0 spike'ları (bildirim, senkron, Türkçe çözümleyici, StoreKit sandbox).
3. T1: monorepo ve CI kurulumu.
