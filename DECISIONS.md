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
| D-012 | 2026-10-08 | Kabul | **Kayıt yalnızca söz ve yazıyla girer.** Form, saat seçici ve sayı ayarlayıcı yok; prototipteki ayarlayıcı sayfaları kaldırılır. Dokunuş yalnızca yanıt (Yaptım, Daha geç, Dinleniyorum, Doğru), onay (Olur) ve geri al içindir. Seçim ve anahtar ayarları kayıt sayılmaz, ama aynı ayarlar konuşmayla da değişir. | Kullanıcı isteği: "manuel kayıt girilmemeli, her durumda konuşarak ya da yazışarak sonuç anlaşılmalı." Yorum: bildirim ve widget'taki tek dokunuşlu yanıtlar sistemin sorusuna yanıt sayıldı (Q12). |
| D-013 | 2026-10-08 | Kabul | Sistem geçmişi izleyip kullanıcının ritmine göre öneri yapar. Öneri her zaman "Önerilen" olarak, nedeniyle gelir; cihazda hesaplanır; kullanıcı unutturabilir ve kapatabilir. | Kullanıcı isteği. Kurallar `docs/RHYTHM.md`. |
| D-014 | 2026-10-08 | Kabul | Su gibi gün içinde birden çok kez yapılan eylemler **sayaçlı rutin**dir; her tekrar zaman damgalı `LogEntry` olarak saklanır, toplam ve geçmiş kayıtlardan türetilir. Birim kanonik (su için ml), gösterim kullanıcının birimiyle (bardak). | Kullanıcı isteği. `docs/DATA-MODEL.md`. |
| D-015 | 2026-10-08 | Kabul | İkon kütüphanesi 45 ikona çıkarıldı (`design/icons/ambient-icons.svg`). Yapay zekâ her öğeye ikon atar; kullanıcı ikon seçmez; eşleşme yoksa `genel` ve eksik ikon kaydı. | Kullanıcı isteği: tüm alternatifler için ikon hazır olmalı. `docs/ICONS.md`. |
| D-016 | 2026-10-08 | Varsayım | "Önerilen" durum rengi ikincil renk (`--w`, su/teal) + kesikli çizgi; amber yalnızca "yaklaşıyor". Tuvaldeki sayfalar buna göre güncellendi (Bugün, Akış, Kontrol). Konuşma'da "Bugün beklenen" etiketi hâlâ amber kullanıyor, bu gözden geçirilecek. | Q7'nin varsayılanı. |
| D-017 | 2026-10-08 | Varsayım | Sayaçlı rutinde hedef ve ilerleme "skor" gibi sunulmaz: yüzde, halka, "tamamlandı" rozeti yok; yalnızca sayı, sakin bir hedef çizgisi ve saat saat kayıtlar. | `start.md` §1. |

## Bekleyen sorular

| # | Soru | Neden önemli | Varsayılan (cevap gelene kadar) |
|---|---|---|---|
| Q1 | "Günü kapat" ekranı ürüne girsin mi? | Yeni ekran, yeni zamanlanmış iş. | Tasarımda var, kodda M5'e alınır. |
| Q2 | Yoğun bir günde taşıma önerisini yapay zekâ sunsun mu, yoksa hiç sunmasın mı? | Plan güveni ilkesiyle çakışabilir. | Yalnızca öneri, onaysız hareket yok. |
| Q3 | Başlangıç LLM sağlayıcısı ve modeli? | Değerlendirme seti ve maliyet buna bağlı. | Sağlayıcıdan bağımsız arayüz; ilk adaptör ikisi birden. |
| Q4 | Senkron: "son yazan kazanır" mı, alan bazında birleştirme mi? | En pahalı geri dönüşsüz karar. | Alan bazında birleştirme (öğe başına `updatedAt`). |
| Q5 | Barındırma ve bütçe hedefi? | Altyapı seçimi. | Docker Compose ile yerel; üretim sonra. |
| Q6 | Mobilde önce hangi platform? | Widget, giriş seçenekleri, test cihazları. | iOS önce. |
| Q7 | "Önerilen" durumunun rengi: ikincil renk (`--w`) + kesikli çizgi mi, başka bir şey mi? | Anlam çakışması (prototipte amber "yaklaşıyor"). | D-016 olarak uygulandı; itiraz yoksa kapanır. |
| Q8 | Takvim içe aktarma kapsamı: yalnızca Apple Takvim mi, Google da mı? Salt okunur mu, iki yönlü mü? | Senkron karmaşıklığı. | Apple Takvim, salt okunur. |
| Q9 | Apple Watch Faz 2'de mi, MVP'de mi? | Rakip yorumlarında hem istek hem çökme şikâyeti. | Faz 2. |
| Q10 | Dış asistan bağlantısı (MCP) değerlendirilsin mi? | Routinery ücretsiz sunuyor. | Faz 2 adayı, taahhüt yok. |
| Q11 | D-Plan'ın tasarım dilinden bilinçli ayrışma düzeyi? | Marka kimliği. | Cevaplandı: çizgi korunur ve geliştirilir (D-001). |
| Q12 | Bildirim ve widget'taki tek dokunuşlu yanıtlar ("İçtim", "Su · 3") D-012 ile uyumlu sayılsın mı? | "Her durumda konuşarak" ifadesinin sınırı. | Evet: sistemin sorusuna yanıt sayılır; Bugün'de manuel "+1" düğmesi yok. |
| Q13 | Konuşma sırasında ses dalgası olmadan "dinliyor" hali nasıl görünsün? | Konuşma balonu butonunun tasarımında dalga ve mikrofon yok. | İmleç yerine nefes alan halka. |
| Q14 | Ritim öğrenme rızası karşılamada ayrı bir adım mı, Veri ve gizlilik'te anahtar mı? | KVKK açık rıza şartı. | Karşılamada kısa anlatım + Veri ve gizlilik'te anahtar. |
| Q15 | Su dışındaki hassas sayaçlar (alkol, sigara) ve tıbbi hatırlatmalar (ilaç) kapsamda mı? | Sağlık ve yasal sorumluluk. | İlaç hatırlatılır ve kaydedilir, tıbbi tavsiye verilmez. Alkol ve sigara ilk sürümde kapsam dışı. |
| Q16 | Fiyat ve deneme süresi? | Plan ve fiyat sayfası köşeli parantezlerle bekliyor. | Fiyatlandırma kararı gelene dek [AYLIK FİYAT] yer tutucu. |
