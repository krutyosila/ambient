# Kurulum

Amaç: kuruluma ve ilk satır koda başlayabilecek hale gelmek. Kapsam ve sıra: `docs/TEST-ENV.md`. Burada anlatılan komutlar ve klasörler **T1 aşamasında oluşturulacak** hedef kurulumdur; bugün repoda yalnız belgeler ve tasarım var.

## 1. Önkoşullar (geliştirici makinesi)
| Araç | Neden | Not |
|---|---|---|
| macOS + Xcode (güncel kararlı sürüm) | iOS derleme ve simülatör | Önce iOS (D-042) |
| Node.js LTS ve pnpm | Monorepo | Sürümler `package.json` `engines` ile sabitlenir |
| Docker Desktop | PostgreSQL, Redis, API yerelde | |
| Git | | |
| Expo hesabı + EAS CLI | Derleme ve TestFlight dağıtımı | |
| Apple Developer hesabı | TestFlight, StoreKit sandbox | Small Business başvurusu bu aşamada yok (D-028) |
| Anthropic API anahtarı (harcama limitli) | Yapay zekâ (D-039) | Staging için ayrı anahtar ve düşük limit |

## 2. Hesaplar ve gizli anahtarlar
| Hesap | Kimin | Nereye girer |
|---|---|---|
| Apple Developer | Sizin | EAS, App Store Connect, "Apple ile giriş" |
| Anthropic | Sizin | `ANTHROPIC_API_KEY` (yalnız `.env` / gizli yönetim) |
| Google (OAuth) | Sizin | `GOOGLE_CLIENT_ID` |
| E-posta gönderimi (magic link) | Sizin | `SMTP_URL`, `MAIL_FROM`; yerelde Mailpit gibi bir test sunucusu yeter |
| Hata izleme | Sizin | `SENTRY_DSN` (boş bırakılırsa kapalı); Sentry ücretsiz katman ya da GlitchTip (D-041) |
| Hosting | Sizin (D-040) | Staging için sonra |
Gizli anahtarlar repoya **girmez** (`.gitignore`); örnek: `.env.example`.

## 3. Hedef repo yapısı
```
apps/
  mobile/        Expo (React Native), expo-router, local-first (expo-sqlite + Drizzle)
  api/           NestJS, Prisma, PostgreSQL, Redis (BullMQ), OpenAPI
  admin/         Next.js, shadcn/ui
packages/
  shared/        zod şemaları, tipler, API istemcisi, iconKey enum'u
  design-tokens/ renk, tipografi, spacing, tema (docs/DESIGN.md)
design/          prototip, ikonlar, web önizleme (mevcut)
docs/            belgeler (mevcut)
docker-compose.yml  PostgreSQL, Redis, (Mailpit)
```

## 4. Kurulum adımları (T1 sonunda çalışır hale gelir)
1. `git clone` ve dal: `claude/sweet-bardeen-575uyo` (ya da yeni çalışma dalı).
2. `cp .env.example .env` ve değerleri doldur (§2).
3. `pnpm install`.
4. `docker compose up -d` (PostgreSQL, Redis, Mailpit).
5. `pnpm --filter api prisma migrate dev` ve `pnpm --filter api seed` (test verisi).
6. `pnpm dev` (API + admin) ve `pnpm --filter mobile ios` (simülatör).
7. İlk sağlık kontrolü: `GET /health` 200, admin giriş sayfası açılıyor, mobil "Giriş" ekranı görünüyor.

## 5. Ortam değişkenleri
Tüm liste ve varsayılanlar: `.env.example`. Maliyet politikası değişkenleri (`COMMISSION_RATE`, `BUDGET_*`, `FX_TRY_PER_USD`, `LLM_KILL_SWITCH`) `docs/COST-POLICY.md` ile birebir eşleşir. Staging'de `GLOBAL_DAILY_SPEND_CAP_USD` düşük tutulur.

## 6. İlk görevler
**T0 (hazırlık, spike'lar; her biri ≤ 1–2 gün, sonuçlar `DECISIONS.md`'ye not edilir)**
1. Yerel bildirim güvenilirliği: sessiz saat, pil tasarrufu, izin reddi senaryolarında planlanan bildirim tetikleniyor mu.
2. Senkron: öğe başına `updatedAt` ve eklemeli `LogEntry` ile iki cihaz arası birleştirme prototipi.
3. Türkçe yerel çözümleyici: 30 örnek cümle ("bir bardak su içtim", "yarın 15:15", "haftaya perşembe", "saati 16:00 yap"); hangi oranı kuralla çözülüyor.
4. StoreKit sandbox: deneme, abonelik, iptal, geri yükleme akışı.
5. Cihaz içi Türkçe ses tanıma doğruluğu ve çevrimdışı davranışı (hedef cihazlarda).

**T1 (temel / M0)**
1. Monorepo iskeleti (pnpm workspaces, TypeScript, lint, format) ve CI (GitHub Actions: lint, tip, test).
2. `docker-compose.yml`, `.env` yükleme, `GET /health`.
3. `packages/design-tokens` (`docs/DESIGN.md` §2: 7 palet × koyu/açık, v2 farkları) ve açık tema kontrast ölçümü.
4. `packages/shared`: zod şemaları (araç çağrıları, `iconKey`, birimler), API istemcisi iskeleti.
5. Mobil iskelet: expo-router, tema, i18n (tr varsayılan), 45 ikonluk set (`design/icons/ambient-icons.svg`) ve bileşen galerisi.
6. Hata izleme soyutlaması (`SENTRY_DSN` boşsa no-op).
7. Değerlendirme seti iskeleti (100+ cümle) ve maliyet raporu.

## 7. Çalışma kuralları
- Dal ve commit: İngilizce commit mesajları; küçük, odaklı commit'ler; PR yalnız istenince açılır.
- Her milestone sonunda çalışan build, testler, kısa özet; `docs/ROADMAP.md` ve `docs/SUMMARY.md` güncellenir.
- Belge ve karar disiplini: `CLAUDE.md`.

## 8. Kurulumdan önce kontrol listesi
- [ ] Apple Developer hesabı açık
- [ ] Anthropic anahtarı ve harcama limiti hazır
- [ ] Google OAuth istemcisi (iOS) oluşturuldu
- [ ] E-posta gönderimi için test sunucusu/hesabı
- [ ] Hata izleme için ücretsiz hesap ya da GlitchTip planı
- [ ] Test cihazları (iOS sürümleri) ve ilk 5–10 test kullanıcısı
- [ ] Onay: `docs/TEST-ENV.md` planı ve süre tahmini

## 9. Çalışma araçları (isteğe bağlı)
- **affaan-m/ecc** (D-044): Claude Code için planlama, TDD, kod inceleme ve dil kuralları (TypeScript/Swift vb.) sunan agent/skill/komut koleksiyonu. T1'de gerekirse **yalnız ihtiyaç duyulan parçalar** (ör. planlayıcı, kod inceleme, TypeScript kuralları) alınır. Tamamı kurulmaz: çok sayıda skill ve hook bağlamı şişirir, maliyeti artırır ve çakışma yapabilir. Önerilen sıra: önce kendi `CLAUDE.md` ve `docs/SUMMARY.md` düzeni, ihtiyaç doğarsa ECC'den seçici ekleme.
- Önizlemeyi çalıştırma: `design/preview/app.html` (ayrıntı `design/preview/README.md`).
