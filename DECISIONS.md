# Karar günlüğü

Durumlar: **Kabul** (kullanıcı onayladı), **Varsayım** (ilerlemek için varsayıldı, itiraz edilebilir), **Önerildi** (onay bekliyor), **Geçersiz**.
Yeni kararlar en alta eklenir. Büyük ve geri dönüşü zor kararlar önce sorulur.

| ID | Tarih | Durum | Karar | Gerekçe / kaynak |
|---|---|---|---|---|
| D-001 | 2026-10-08 | Kabul | Görsel çizgi (koyu, Buz Mavisi, Inter, tonal yüzeyler) korunur ve v2 olarak geliştirilir. | Kullanıcı: "çizgimizi koruyalım ama biraz geliştirelim." Farklar: `docs/DESIGN.md`. |
| D-002 | 2026-10-08 | Kabul | Token kaynağı prototipteki palet dizileridir (`P` koyu, `L` açık, 7 palet, varsayılan Buz Mavisi). Kenarlıksız ilke prototipteki `border:0!important` kuralından gelir. | Prototip kodunun incelenmesi. |
| D-003 | 2026-10-08 | Kabul | Seri, rozet, yüzde ve skor yok. "Bugün dinleniyorum" birinci sınıf eylemdir. | `start.md` §1; Productive'de kapatılamayan seri baskısı şikâyeti (`docs/RESEARCH.md`). |
| D-004 | 2026-10-08 | Kabul | Plan sabittir; yapay zekâ yalnızca önerir ("Önerilen" durumu), onay olmadan öğe taşımaz. | `start.md` §5; Motion'ın "plan sürekli yer değiştiriyor" şikâyeti. |
| D-005 | 2026-10-08 | Kabul | Bildirim kuralları: neyi hatırlattığını söyler, aynı iş için tek bildirim, en fazla üç eylem, sessiz kalan alarm kritik hata. | Routinery yorumları (`docs/RESEARCH.md`). `start.md` §6 güncellendi. |
| D-006 | 2026-10-08 | Önerildi | "Günü kapat" ekranı ürüne eklenir (isteğe bağlı akşam kapanışı, yarına alma, yoğun gün için taşıma önerisi). | Sunsama bulgusu. Kullanıcı onayı bekleniyor (Soru 1). |
| D-007 | 2026-10-08 | Kabul | Fiyat şeffaflığı: abonelik fiyatı ve deneme koşulları karşılamada ve Profil > Plan ve fiyat sayfasında açıkça gösterilir. | Routinery Türkiye yorumu ("şeffaf değil"), iade şikâyetleri. |
| D-008 | 2026-10-08 | Kabul | Türkçe birinci sınıf: Türkçe doğal dil girişi çekirdek özelliktir, hiçbir pakete kilitlenmez. | Rakiplerin Türkçe boşluğu; Routinery yorumlarında Türkçe talebi. |
| D-009 | 2026-10-08 | Kabul | Yeni maddeler yol haritasına alındı: rutinlere simge ve renk seçimi (M5), salt okunur takvim içe aktarma (M2), Plan ve fiyat sayfası (M5), Apple Watch (Faz 2). | Habit Tracker ve Productive yorumları. Kapsam ayrıntıları aşağıdaki sorularda. |
| D-010 | 2026-10-08 | Varsayım | Ürün konumlandırması: D-Plan'dan sakin ton, tek odak ve Türkçe-önce ile ayrışır. Not tuvali, sosyal ve genel görev yönetimi kapsam dışı. | `docs/RESEARCH.md`. |
| D-011 | 2026-10-08 | Varsayım | Metin renginde üç kademe (`--t`, `--d2`, `--d`) kullanılır; `--f` yalnızca dekoratif çizgi ve işaretlerde, metinde kullanılmaz. Geçmiş satırlar opaklık yerine `--d` rengiyle gösterilir. | Ölçülen kontrast: prototipte `--f` ≈ 2,7:1 ve `.tr.past` ≈ 2,5:1. `docs/DESIGN.md`. |

## Bekleyen sorular

| # | Soru | Neden önemli | Varsayılan (cevap gelene kadar) |
|---|---|---|---|
| Q1 | "Günü kapat" ekranı ürüne girsin mi? | Yeni ekran, yeni zamanlanmış iş. | Tasarımda var, kodda M5'e alınır. |
| Q2 | Yoğun bir günde taşıma önerisini yapay zekâ sunsun mu, yoksa hiç sunmasın mı? | Plan güveni ilkesiyle çakışabilir. | Yalnızca öneri, onaysız hareket yok. |
| Q3 | Başlangıç LLM sağlayıcısı ve modeli? | Değerlendirme seti ve maliyet buna bağlı. | Sağlayıcıdan bağımsız arayüz; ilk adaptör ikisi birden. |
| Q4 | Senkron: "son yazan kazanır" mı, alan bazında birleştirme mi? | En pahalı geri dönüşsüz karar. | Alan bazında birleştirme (öğe başına `updatedAt`). |
| Q5 | Barındırma ve bütçe hedefi? | Altyapı seçimi. | Docker Compose ile yerel; üretim sonra. |
| Q6 | Mobilde önce hangi platform? | Widget, giriş seçenekleri, test cihazları. | iOS önce. |
| Q7 | "Önerilen" durumunun rengi: prototipte amber "yaklaşıyor" anlamına geliyor, tuvaldeki v2 ekranlarında "Önerilen" için de amber kullanıldı. | Anlam çakışması. | Karar çıkana dek amber yalnızca "yaklaşıyor"; "Önerilen" için kesikli çizgi + ikincil renk (`--w`). Tuvaldeki ekranlar bu noktada güncellenecek. |
| Q8 | Takvim içe aktarma kapsamı: yalnızca Apple Takvim mi, Google da mı? Salt okunur mu, iki yönlü mü? | Senkron karmaşıklığı. | Apple Takvim, salt okunur. |
| Q9 | Apple Watch Faz 2'de mi, MVP'de mi? | Rakip yorumlarında hem istek hem çökme şikâyeti. | Faz 2. |
| Q10 | Dış asistan bağlantısı (MCP) değerlendirilsin mi? | Routinery ücretsiz sunuyor. | Faz 2 adayı, taahhüt yok. |
| Q11 | D-Plan'ın tasarım dilinden bilinçli ayrışma düzeyi? | Marka kimliği. | Mevcut çizgi korunur (D-001). |
