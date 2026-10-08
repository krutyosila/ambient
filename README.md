# Ambient

Kişisel günlük işletim sistemi. Kullanıcı **söyler ya da yazar**, Ambient bunu plana, rutine, hatırlatmaya ve kayda çevirir. Skor, seri, rozet, yüzde ya da suçluluk dili yok. Türkçe-önce, önce iOS.

> Durum (8 Ekim 2026): **kod yok; ürün tanımı, tasarım (50 sayfa), kararlar ve kurulum planı hazır.** Sıradaki hedef: tam çalışır test ortamı (TestFlight + staging). Plan: [`docs/TEST-ENV.md`](docs/TEST-ENV.md). Kurulum: [`docs/SETUP.md`](docs/SETUP.md).

## Arayüzleri web'de incele
- **Tıklanabilir prototip (yerelde):** `design/preview/app.html` dosyasını tarayıcıda aç. Yeni kullanıcı akışından (Giriş → Karşılama → Bugün), bildirim yoklamasından ya da menüden başlayıp sayfalar arasında gezebilirsin; geri düğmeleri çalışır.
- **Galeri (yerelde):** `design/preview/index.html` (50 sayfa; karta tıklayınca prototipte açılır).
- **GitHub Pages ile:** Settings → Pages → dal ve `/ (root)`; adres `…/design/preview/app.html`. Dikkat: herkese açık olabilir ([`design/preview/README.md`](design/preview/README.md)).
- **Tuval (düzenlenebilir, özel bağlantı):** https://claude.ai/artifact/CHcQgkvtgDe2JDoqGd1TX2

## Ürün ilkeleri (değişmez)
1. **Kayıt yalnız söz ya da yazıyla girer.** Form, saat seçici yok. Tek istisna: doğum tarihi, cinsiyet, boy, kilo (elle de girilebilir).
2. **Plan sabit; yapay zekâ yalnız "Önerilen" sunar,** nedeniyle; onaysız hiçbir şey değişmez.
3. **Bildirim:** neyi hatırlattığını söyler, aynı iş için günde bir, sessiz saatlere uyar.
4. **Sayaçlı rutinler** (su, kahve, ilaç): gün içinde birden çok kez, her tekrar zaman damgalı kayıt.
5. **Günü kapat:** akşam isteğe bağlı kapanış; kapanmazsa akşam hatırlatma, ertesi sabah bilgi, 2 gün sonra otomatik kapanış.
6. **Ritme göre öneri:** geçmişten cihazda öğrenilir; seviye katmana göre; unutturulabilir.
7. **Kişiselleştirme:** doğum tarihi, cinsiyet, boy, kilo isteğe bağlı, rızayla; su/uyku önce insan ortalaması (diyetisyen danışmanın tabloları), kullanıcı kendi değerini girer. 18 yaş altına cinsiyet/boy/kilo sorulmaz; 13 altı kullanamaz.
8. **Maliyet duyarlı:** önce cihazda yerel çözümleyici, sonra Haiku 5.5, gerekirse Sonnet 5.5; her abonenin yapay zekâ bütçesi kendi net gelirinin %30'u ve otomatik ayarlanır.

## Üyelik (öneri)
| | Normal | Plus | Pro |
|---|---|---|---|
| Fiyat (TR, KDV dahil) | Ücretsiz | ₺99,99/ay · ₺599,99/yıl | ₺199,99/ay · ₺1.199,99/yıl |
| Basit kayıtlar | Sınırsız | Sınırsız | Sınırsız |
| Karmaşık cümle | ≈ 8/gün | ≈ 14/gün | ≈ 20/gün |
| Ritim | Temel | Tam | Gelişmiş |
3 gün deneme; abone olunmazsa Normal'e devam, seyrek uygulama içi yükseltme kartı. Ayrıntı: [`docs/PRICING.md`](docs/PRICING.md).

## Mimari
Monorepo (pnpm, TypeScript): `apps/mobile` (Expo, local-first), `apps/api` (NestJS, PostgreSQL, Redis), `apps/admin` (Next.js), `packages/shared`, `packages/design-tokens`. LLM: Anthropic, sağlayıcıdan bağımsız arayüzle. Ayrıntı: [`start.md`](start.md) §3, [`docs/COST-POLICY.md`](docs/COST-POLICY.md).

## Kararlar (kısa)
Tüm kararlar ve bekleyen sorular: [`DECISIONS.md`](DECISIONS.md). Başlangıç tercihleri: **Anthropic** (D-039), **önce iOS** (D-042), hosting size ait (D-040), hata izleme en düşük maliyetle (D-041), Small Business başvurusu yayın hazırlığından sonra (D-028).

## Belge haritası
| Dosya | İçerik |
|---|---|
| [`docs/SUMMARY.md`](docs/SUMMARY.md) | Tek sayfa özet (yapay zekâ oturumları önce bunu okur) |
| [`start.md`](start.md) | Ürün tanımı ve çalışma kuralları |
| [`CLAUDE.md`](CLAUDE.md) | Kısa çalışma kuralları |
| [`DECISIONS.md`](DECISIONS.md) | Karar günlüğü ve bekleyen sorular |
| [`docs/SETUP.md`](docs/SETUP.md) | Kurulum, hesaplar, ortam değişkenleri, ilk görevler |
| [`docs/TEST-ENV.md`](docs/TEST-ENV.md) | Test ortamı kapsamı, ortamlar, çıkış ölçütleri |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | Milestone'lar, riskler |
| [`docs/DESIGN.md`](docs/DESIGN.md) | Token'lar, bileşenler, ton rehberi |
| [`docs/FLOWS.md`](docs/FLOWS.md) | Ekran envanteri, akışlar, cümle → araç |
| [`docs/DATA-MODEL.md`](docs/DATA-MODEL.md) | Veri modeli |
| [`docs/RHYTHM.md`](docs/RHYTHM.md) | Ritim öğrenme ve öneri |
| [`docs/PERSONALIZATION.md`](docs/PERSONALIZATION.md) | Kişisel bilgiler, referanslar, diyetisyen |
| [`docs/PRICING.md`](docs/PRICING.md) | Üyelik, fiyat, birim ekonomi |
| [`docs/COST-POLICY.md`](docs/COST-POLICY.md) | Maliyet politikası |
| [`docs/MARKETING.md`](docs/MARKETING.md) | Pazarlama |
| [`docs/RESEARCH.md`](docs/RESEARCH.md) | Rakip ve kullanıcı araştırması |
| [`docs/ICONS.md`](docs/ICONS.md) | 45 ikon, seçim kuralı |
| `design/` | Prototip, ikon sprite'ı, web önizleme |
