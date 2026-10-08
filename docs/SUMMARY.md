# Ambient: tek sayfa özet

Amaç: her oturumda **önce bunu oku**; ayrıntı için yalnız gereken belgeyi aç. Bu özet bağlam ve maliyet tasarrufu içindir. Güncelleme tarihi: 2026-10-08. Büyük karar ya da milestone sonrası bu dosyayı güncelle (≤ 120 satır).

## Ürün
Kişisel günlük işletim sistemi. Kullanıcı **söyler ya da yazar**, sistem plan, rutin, hatırlatma ve kayda çevirir. Skor, seri, rozet, yüzde, suçluluk dili yok. Türkçe-önce. Mobil: Expo (React Native) + NestJS + PostgreSQL + Redis + Next.js admin; mobil local-first.

## Çizgi (görsel)
Koyu, Buz Mavisi (`#8fbcff` vurgu, `#8ad6cc` ikincil, `#e6ecf2` metin, `#7f8894` sönük, `#07090c` zemin), Inter ağırlık 300, kenarlıksız tonal yüzeyler, 44 px dokunma, 45 ikon (`design/icons`). Tasarım kaynağı: `design/life-os-case-study.html`; v2 farkları `docs/DESIGN.md`. Tuval: https://claude.ai/artifact/CHcQgkvtgDe2JDoqGd1TX2 (özel).

## Değişmez ilkeler
1. **Kayıt yalnız söz/yazıyla** (form, saat seçici yok); dokunuş = yanıt, onay (Olur), geri al (D-012).
2. **Plan sabit:** yapay zekâ yalnız "Önerilen" sunar, nedeniyle; onaysız değişmez (D-004, D-013).
3. **Bildirim:** neyi hatırlattığını söyler, aynı iş için günde 1, sessiz saatlere uyar (D-005).
4. **Sayaçlı rutinler** (su, kahve, ilaç): her tekrar zaman damgalı `LogEntry` (D-014). Alkol/sigara öneri yok.
5. **Günü kapat** var; kapanmazsa akşam hatırlatması ve ertesi sabah "dün kapanmadı" bilgisi, baskısız (D-018).
6. **Ritim öğrenme** cihazda; seviye katmana göre (Temel/Tam/Gelişmiş), kapatılabilir, unutturulabilir (D-013, D-019).
7. **Kişiselleştirme (D-029…D-032):** doğum tarihi, cinsiyet, boy, kilo isteğe bağlı; **elle ya da yazıyla/sözle**, açık rızayla; kilo 6 ayda bir, kesin sayı ya da "biraz aldım" tahmini (kilo çizgisi); su/uyku önce insan ortalaması (kurum içi diyetisyen tabloları), kullanıcı düzeltir; hedef/skor/VKİ yok; kural tabanlı ($0). `docs/PERSONALIZATION.md`.
8. **Maliyet duyarlı:** yerel çözümleyici → Haiku 5.5 → (Plus/Pro) Sonnet 5.5; kullanıcı başına aylık bütçe; kademeli düşürme (D-020).

## Üyelik (öneri, onay bekliyor)
Normal (ücretsiz) · Plus (₺99,99/ay, ₺599,99/yıl) · Pro (₺199,99/ay, ₺1.199,99/yıl); global Plus $3,99/$29,99, Pro $8,99/$59,99; 3 gün deneme, sonra Normal'e devam + baskısız yükseltme kartı; lifetime ve haftalık yok. Tipik maliyet/kullanıcı/ay: Normal $0,03, Plus $0,11, Pro $0,23. Bütçe (LLM+ses, plan B %30 komisyon): $0,04 / $0,16 / $0,32; Small Business onayında $0,19 / $0,38. Kural (kabul, D-033): her abonenin bütçesi kendi net gelirinin %30'u, katman taban/tavanıyla; kur, komisyon ve gelire göre **otomatik ayarlanır**. Ayrıntı: `docs/PRICING.md`, `docs/COST-POLICY.md`.

## Rakipler (özet)
En yakını D-Plan (aynı vaat, seri+istatistik, Türkçe var; Pro ₺249,99/ay). Habit Tracker 4,8 (147 bin), Productive 4,6, Routinery 4,7. Boşluk: baskısız, Türkçe, dürüst fiyat. Ayrıntı: `docs/RESEARCH.md`.

## Belgeler (ihtiyaca göre aç)
`start.md` (tam tanım) · `DECISIONS.md` (kararlar, bekleyen sorular) · `docs/DESIGN.md` (token, bileşen) · `docs/FLOWS.md` (ekran/akış, cümle→araç) · `docs/DATA-MODEL.md` · `docs/RHYTHM.md` · `docs/ICONS.md` · `docs/PRICING.md` · `docs/COST-POLICY.md` · `docs/MARKETING.md` · `docs/ROADMAP.md` · `docs/RESEARCH.md`.

## Durum
Kod yok; tasarım ve belgeler hazır. Tuvalde 50 sayfa. Sıradaki: açık soruların kapanması (`DECISIONS.md` Q'lar), mimari özet ve milestone onayı (`start.md` §0), spike'lar (widget, bildirim, senkron, Türkçe çözümleyici).

## Açık kararlar (kısa)
Diyetisyen danışmanın seçimi ve sözleşmesi (Q27) · yaş eşikleri (Q24) · LLM sağlayıcı (Haiku/Sonnet 5.5 varsayım) · senkron stratejisi · fiyat/komisyon/vergi doğrulaması · platform sırası (iOS önce) · barındırma/bütçe.

## Tasarruf kuralları (oturum için)
Tüm belgeleri baştan okuma; önce bu dosya. Sabit kalan dosyaları tekrar okuma. Çıktıyı kısa tut, tabloları belge içinde bırak, sohbette özetle. Tuval dosyalarını yalnız değişeceklerse oku.
