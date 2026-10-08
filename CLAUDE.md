# Ambient: çalışma kuralları

Ürün tanımı ve değişmez ilkeler `start.md` içinde. Bu dosya kısa tutulur; ayrıntı için belge haritasına bak (`start.md` §14).

## Her oturumda
0. **Önce `docs/SUMMARY.md`'yi oku** (tek sayfa özet). Tüm belgeleri baştan okuma; yalnız işin gerektirdiğini aç. Büyük karar ya da milestone sonrası SUMMARY.md'yi güncelle (≤ 120 satır). Bu hem tutarlılık hem maliyet içindir (D-025).
1. Gerektiğinde `start.md`, `DECISIONS.md` ve `docs/DESIGN.md`. Ekran ve akış işlerinde `docs/FLOWS.md`, veri işlerinde `docs/DATA-MODEL.md`, öneri işlerinde `docs/RHYTHM.md`, ikon işlerinde `docs/ICONS.md`. Bekleyen sorular `DECISIONS.md` sonundadır.
2. Tasarım ve davranış için kaynak `design/life-os-case-study.html` prototipidir. `docs/DESIGN.md` yalnızca onaylanmış v2 farklarını ekler. Tasarımdan sapman gerekiyorsa gerekçeyi yaz ve sor.
3. Kod yazmadan önce mimari plan ve milestone onayı al (`start.md` §0). Onay gelmeden uygulama kodu yazma.

## Karar ve belge disiplini
- Belirsiz ürün kararında varsayım yap, ama `DECISIONS.md`'ye yaz. Büyük ve geri dönüşü zor kararlarda (senkron stratejisi, LLM sağlayıcısı, veri modeli, fiyatlandırma) önce sor.
- Bir karar değiştiğinde ilgili belgeyi aynı değişiklikte güncelle. Eski kararı silme, durumunu "Geçersiz" yap ve nedenini yaz.
- Araştırma bulgusu eklerken kaynağı ve örneklem sınırını yaz. Bulguyu abartma; bilinmeyeni bilinmiyor olarak belirt.

## Dil
- Arayüz metinleri Türkçe (varsayılan), i18n ile İngilizceye hazır. Kod, yorumlar ve commit mesajları İngilizce. Belgeler Türkçe.

## Maliyet ve üyelik
Yeni özellik tasarlarken hangi katmana ait olduğunu ve LLM maliyetini düşün: önce yerel çözüm, sonra Haiku, Sonnet yalnız gerektiğinde (`docs/COST-POLICY.md`). Katman farkları `docs/PRICING.md`'de; kodda sabit değil yapılandırma.

## Girdi kuralı
Kayıt yalnızca söz ya da yazıyla girer (D-012); **tek istisna** doğum tarihi, cinsiyet, boy, kilo (D-030). Yeni bir ekran tasarlarken form, saat seçici ya da sayı ayarlayıcı ekleme; dokunuş yalnızca yanıt, onay, geri al ve sayaçlı rutinde sabit birimli tek dokunuş kaydı içindir (D-046); Bugün'de öğeler içeriğe göre eylem sunar (Katıl, Başla, Yaptım, Olur). Her yeni ekranın altında o sayfaya özgü örnek cümleli konuşma çubuğu olur. Cümle → araç eşlemesi `docs/FLOWS.md`'de.

## Ürün yasakları (kısa)
Seri, rozet, yüzde, skor, suçluluk dili, robot/parıltı dekorasyonu yok. Yapay zekâ planı kendi başına değiştirmez, yalnızca önerir. Ayrıntı: `start.md` §1.

## Kalite kapıları
Her milestone sonunda: çalışan build, testler, kısa özet, `docs/ROADMAP.md` durum güncellemesi. Bildirim ve senkron değişiklikleri için ilgili testler zorunlu. Kontrast ≥ 4,5:1 (metin), dokunma hedefi ≥ 44 px.
