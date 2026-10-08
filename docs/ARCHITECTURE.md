# Mimari özet, milestone planı ve onay istenen noktalar

Durum: **onay bekliyor** (`start.md` §0 ve "Başlarken"). Onaylanmadan uygulama kodu yazılmaz. Bu belge `start.md` "Başlarken"in dört çıktısını tek yerde toplar; ayrıntı ilgili belgelere bağlanır.

## 1. Mimari özeti

```
 Mobil (Expo, iOS önce)                        Sunucu (NestJS)                          Yönetim (Next.js)
 ┌──────────────────────────┐   HTTPS/REST   ┌───────────────────────────┐            ┌──────────────────┐
 │ UI (expo-router, tokens) │◄──────────────►│ Auth (magic link/Apple/   │            │ Panel (shadcn)   │
 │ Yerel çözümleyici (tr)   │  delta senkron │ Google, JWT halkası)      │◄──────────►│ RBAC + 2FA       │
 │ Ritim motoru (cihazda)   │                │ Senkron (delta, birleştir)│  admin API │ Taslak→yayın     │
 │ SQLite/Drizzle (kaynak)  │                │ LLM katmanı + policy hook │            └──────────────────┘
 │ Yerel bildirimler        │                │ Eylem yürütücü (kural)    │
 │ Uzak yapılandırma önb.   │                │ Ayar kayıt defteri + Secret│
 └──────────────────────────┘                │ BullMQ işleri             │
                                             └───────┬─────────┬─────────┘
                                          PostgreSQL ┘         └ Redis (kuyruk, ayar yayını)
                                                Anthropic API (Haiku 5.5 → Sonnet 5.5), APNs, App Store bildirimleri
```

**Ana ilkeler (kararlı):**
1. **Local-first:** cihazdaki SQLite doğruluk kaynağıdır; sunucu senkron, yedek ve LLM içindir. Uçak modunda Bugün, Akış, kayıt ve yerel bildirimler çalışır (D-012, `start.md` §3).
2. **LLM anlar, kod karar verir (§5):** önce cihazda yerel çözümleyici ($0), çözemezse sunucuda Haiku, gerekirse (Plus/Pro, bütçe izin verirse) Sonnet. LLM yalnız tanımlı, zod ile doğrulanan araç çağrısı döndürür; **deterministik yürütücü** uygular; çıktı doğrulanmadan hiçbir şey yazılmaz (D-020, D-039).
3. **Plan sabit:** öneri yalnız "Önerilen" olarak gelir, onaysız değişmez; her çıkarım kartında Geri al (`ParsedAction` kaydına göre).
4. **Ayarlar veritabanında** (kayıt defteri, sürümlü, taslak→yayın); `.env` 6 değişken (D-049). Kodda sabit politika sayısı yok.
5. **Bildirim yerel planlanır** (sunucu yalnız push ve senkron); ritim öğrenme cihazda (maliyet ≈ 0, gizlilik).
6. **Sağlayıcıdan bağımsız arayüzler:** `LlmProvider`, `SecretStore`, hata izleme (boş DSN = no-op), `Clock` (test için), barındırma Docker ile taşınabilir (D-040).

**Katmanlar ve sınırlar**
| Katman | Sorumluluk | Notlar |
|---|---|---|
| `packages/shared` | zod şemaları (araçlar, `iconKey`, birimler), tipler, ayar **kayıt defteri**, API istemcisi | Mobil, API ve panel aynı şemayı kullanır |
| `packages/design-tokens` | renk (7 palet × koyu/açık), tipografi, boşluk, yüzey merdiveni | `docs/DESIGN.md` §2 birebir; kontrast testi CI'da |
| `apps/mobile` | ekranlar, yerel DB, yerel çözümleyici, ritim, bildirim, widget (M7) | Reanimated 60 fps; tema/palet seçimi |
| `apps/api` | auth, senkron, LLM yönlendirme ve yürütücü, işler, telemetri, ayar okuma | NestJS modülleri: `auth, sync, llm, executor, settings, billing, jobs, admin` |
| `apps/admin` | `docs/ADMIN.md` | Ayrı yönetici hesapları; kullanıcı içeriği kapalı |

**Bir cümlenin yolu:** metin/ses → (cihaz) yerel çözümleyici → yüksek güven ise yerelde uygulanır, `LogEntry/Item` yazılır → değilse kuyruğa (`OutboxUtterance`) → API: kullanıcı bütçesi + katman → yönlendirme (Haiku/Sonnet) → araç çağrısı JSON → şema doğrulama → yürütücü (çakışma, üst sınır, tekrar kontrolü) → sonuç + kısa şablon yanıt → cihaza → çıkarım kartı + Geri al. Maliyet ve token `telemetri`ye yazılır; bütçe dolunca yerel mod (D-020).

**Senkron (öneri, Q4):** her öğede `updatedAt` + `id` (istemci üretir, idempotent), `LogEntry` yalnız eklenir, çakışmada alan bazında son yazan kazanır; soft delete; silme izleri (tombstone); sunucu `since` imleciyle delta döner.

**Güvenlik ve gizlilik:** KVKK açık rıza kayıtları, sağlık/kişisel veri yalnız rıza ile ve ham haliyle LLM'e gitmez (türetilmiş özet), kullanıcı metni talimat değildir (araç izin listesi), hız sınırı, PII maskeli log, şifreli yerel saklama, dışa aktarma/kalıcı silme uçları (`docs/DATA-MODEL.md` §7).

**Test stratejisi:** birim (çözümleyici, birim dönüşümü, gün sınırı, saat dilimi), API sözleşme testleri (OpenAPI), senkron simülasyonu (iki cihaz), bildirim planlama testleri (sessiz saat, izin reddi, pil), değerlendirme seti (100+ Türkçe cümle, CI'da doğruluk ve maliyet raporu), Maestro e2e (M9), tasarım kontrastı ve 44 px hedef denetimi.

## 2. Design token çıkarımı
Tam tablo `docs/DESIGN.md` §2 (v1 değerleri prototipten, v2 farkları onaylı). Özet: varsayılan **Buz Mavisi koyu** (`#07090c` zemin, `#8fbcff` vurgu, `#8ad6cc` ikincil, `#e6ecf2` metin, `#9ba5b0` yeni orta kademe, `#7f8894` sönük); 7 palet × koyu/açık; yüzey merdiveni s1/s2/s3 (%5,5/8,5/12); Inter 300–500, başlıkta `-.03em`; yarıçaplar 11–28 (telefon 40); yatay boşluk 16; hedef ≥ 44 px; `--f` metinde yasak; 45 ikon (`design/icons`). `packages/design-tokens` bunları tek kaynak olarak üretir; prototipten çıkarma yazılı (kodla değil) bu yüzden **kod aşamasında ilk iş token paketini prototipteki `P`/`L` dizilerinden betikle üretip kontrast raporu çıkarmaktır** (M0).

## 3. Milestone planı ve sıra
Ayrıntı, çıkış ölçütleri ve riskler: `docs/ROADMAP.md`; test ortamı kapsamı: `docs/TEST-ENV.md`.

| Sıra | Milestone | Süre | Çıktı (çalışan build + testler) |
|---|---|---|---|
| T0 | Spike'lar: yerel bildirim güvenilirliği, senkron prototipi, Türkçe çözümleyici (30 cümle), StoreKit sandbox, cihaz içi ses | 1–2 hf | Sonuçlar `DECISIONS.md`'ye; Q4 ve çözümleyici oranı netleşir |
| M0 | Monorepo, CI, Docker, tokens, i18n, 45 ikon, bileşen galerisi | 1–2 hf | Galeri iki temada, kontrast ölçüldü |
| M1 | Local-first çekirdek (Bugün, Akış, Geçmiş, Gün gezinmesi, Karşılama) | 3 hf | Uçak modunda çalışır |
| M2 | API, auth, senkron, takvim içe aktarma (salt okunur) + **ayar altyapısı** | 3 hf | İki cihaz senkron; ayar sürümleme testleri |
| M3 | LLM katmanı, yürütücü, Konuşma, Hızlı not, değerlendirme seti | 4 hf | Hedef doğruluk, prompt injection testleri |
| M4 | Kontrol, bildirimler, ritim motoru | 2 hf | Bildirim kuralları testli |
| M5 | Hayat ritmi, Günü kapat, Menü ve alt sayfalar, Plan ve fiyat, KVKK | 3 hf | Tüm akışlar gerçek navigasyonda |
| M6 | Yönetim paneli (`docs/ADMIN.md`); test ortamı için çekirdek alt küme (T7) | 5 hf (alt küme 3–4) | Prompt/bütçe değişikliği taslak→yayın→geri al |
| M7 | Widget | 2 hf | 3 sn'de kayıt |
| M9 | Cilalama, Maestro, mağaza hazırlığı | 3 hf | TestFlight beta |

Tek geliştiriciyle yaklaşık 24–26 hafta; admin, API, mobil ve tasarım sistemi paralel yürürse 14–16 hafta (tahmin, T0 sonunda yenilenir). **Önerilen ilk adım: T0 spike'ları + M0**, çünkü Q4 (senkron) ve çözümleyici oranı veri şemasını ve maliyeti belirler.

## 4. Onay istenen açık noktalar
Bunlar için bir varsayılan seçtim; itiraz yoksa varsayılanla ilerlerim ve `DECISIONS.md`'ye işlerim.

| # | Soru | Varsayılan |
|---|---|---|
| 1 | **Q4 Senkron:** son yazan kazanır mı, alan bazında birleştirme mi? (en pahalı geri dönüşsüz karar; T0 spike'ı ile doğrulanır) | Alan bazında, öğe başına `updatedAt`; `LogEntry` yalnız eklenir |
| 2 | **Q17 Katman ve fiyatlar** (D-021, D-022) onaylanıyor mu? | Öneri olarak ilerler; fiyatlar yapılandırma/Apple tarafında |
| 3 | **Q19** Normal'de 3 sayaçlı rutin ve 30 gün görünür geçmiş | Kabul |
| 4 | **Q2** Yoğun günde taşıma önerisi | Yalnız öneri, onaysız hareket yok |
| 5 | **Q8** Takvim içe aktarma | Yalnız Apple Takvim, salt okunur |
| 6 | **Q9** Apple Watch | Faz 2 |
| 7 | **Q10** Dış asistan (MCP) | Faz 2 adayı, taahhüt yok |
| 8 | **Q7** "Önerilen" rengi | İkincil renk + kesikli çizgi (D-016) |
| 9 | **Q13** Dinleme hali | Nefes alan halka |
| 10 | **Q14** Ritim rızası | Karşılamada kısa anlatım + Veri ve gizlilik'te anahtar |
| 11 | **Başlangıç** | T0 + M0 ile başla; her milestone sonunda build, test, özet ve `ROADMAP.md`/`SUMMARY.md` güncellemesi |
