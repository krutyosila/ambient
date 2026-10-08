# Yönetim paneli: tasarım ve yapılandırma modeli

Durum: **kabul** (D-046, D-047; Q28–Q30 kapandı). `start.md` §10 ve `docs/COST-POLICY.md` §8'in yerine geçen, onları genişleten ana belgedir; onlarla çelişirsen bu belge geçerlidir. Kod yazılmadı; M6'da uygulanır, ama **ayar altyapısı (§3) M2'de** kurulur, çünkü API'nin geri kalanı ayarları ondan okur.

## 1. İlkeler
1. **`.env` yalnız önyükleme içindir.** Veritabanına ulaşmak için gerekenler dışında hiçbir şey `.env`'de durmaz. Politika, model, bütçe, eşik, metin, anahtar, entegrasyon: hepsi panelden değişir (D-046).
2. **Her ayarın tek kaynağı bir kayıt defteridir** (`packages/shared/settings-registry.ts`): anahtar, tür (zod), varsayılan, birim, alt/üst sınır, katman bazlı mı, sır mı, yeniden başlatma gerekir mi, risk seviyesi, açıklama (Türkçe). Panel formları, doğrulama, belge tablosu ve mobil uzak yapılandırma bu tek kayıttan türer. Kod içinde sabit sayı yok (CLAUDE.md "kodda sabit değil yapılandırma").
3. **Taslak → önizleme → yayın → geri al.** Hiçbir değişiklik yazılırken canlı olmaz; her yayın sürümlenir, gerekçelidir, denetlenir, tek tıkla geri alınır.
4. **Risk kadar sürtünme.** Küçük, geri alınabilir değişiklik anında; para, gizlilik ve güvenliğe dokunan değişiklik etki önizlemesi ve ek onay ister (§4).
5. **En az yetki, en az veri.** Yönetici kullanıcı içeriğini varsayılan olarak göremez; ham kişisel veri maskeli, açma gerekçeli ve denetimlidir. Rapor eşiği 50 (D-036).
6. **Yalnız ölçülen gösterilir, örnek veri örnek diye etiketlenir.** Boş durum dürüst boş durumdur.
7. **Panelin kendisi de maliyet bilir.** Panoda toplu veri günlük özet tablolardan gelir (canlı tarama yok); yapay zekâ kullanan her panel işlevi (oyun alanı, değerlendirme) kendi günlük tavanına sahiptir ve çalıştırmadan önce tahmini maliyeti gösterir. Kullanıcıya yönelik yasaklar (skor, seri, yüzde) panele uygulanmaz: operasyon aracıdır. Girdi kuralı (D-012) mobil uygulama içindir; panel form kullanır.

## 2. `.env` ne kadar olmalı
**Gerekli (hepsi bu):**

| Değişken | Neden `.env`'de |
|---|---|
| `APP_ENV` (`local`\|`staging`\|`production`) | Panelde ortam şeridi; yanlış ortamda değişiklik yapmayı önler |
| `DATABASE_URL` | Ayarlar veritabanında; ona bağlanmadan okunamaz |
| `REDIS_URL` | Kuyruk ve ayar değişikliği yayını (pub/sub) |
| `SETTINGS_MASTER_KEY` | Veritabanındaki sırları (API anahtarları vb.) şifreleyen anahtar; veritabanıyla aynı yerde durmamalı |
| `ADMIN_BOOTSTRAP_EMAIL` | İlk superadmin; ilk girişten sonra etkisizdir |
| `PORT` (isteğe bağlı, varsayılan 3000) | Konteyner |

**Mobil derleme zamanı:** `EXPO_PUBLIC_API_URL` (EAS profilinde; bir kez bilinir, değişirse yeni derleme gerekir). Diğer her şey `GET /v1/config` ile uzaktan gelir (§7).

**Panele taşınanlar:**

| Eski `.env` | Yeni yeri |
|---|---|
| `ANTHROPIC_API_KEY` | Entegrasyonlar → Yapay zekâ (sır, yazma-yalnız, "Test et") |
| `LLM_PROVIDER`, `LLM_PRIMARY_MODEL`, `LLM_ESCALATION_MODEL`, `LLM_PRIMARY_EFFORT`, `LLM_MAX_OUTPUT_TOKENS` | Yapay zekâ → Modeller ve yönlendirme |
| `COMMISSION_RATE`, `FX_TRY_PER_USD`, `BUDGET_*`, `GLOBAL_DAILY_SPEND_CAP_USD` | Maliyet ve politika |
| `LLM_KILL_SWITCH` | Maliyet ve politika → Acil durdurma (ayrıca Redis bayrağı: veritabanı yavaşsa da çalışır) |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `ADMIN_SESSION_SECRET` | **Kalktı.** Anahtar halkası (key ring): ilk açılışta üretilir, Güvenlik → Anahtarlar'dan örtüşmeli döndürülür (eski anahtar bir süre doğrulamada kalır) |
| `MAGIC_LINK_BASE_URL` | Genel → Herkese açık adresler |
| `MAIL_FROM`, `SMTP_URL` | Entegrasyonlar → E-posta (sır, test gönderimi) |
| `APPLE_CLIENT_ID`, `GOOGLE_CLIENT_ID` | Entegrasyonlar → Giriş sağlayıcıları (sır değil) |
| `SENTRY_DSN` | Entegrasyonlar → Hata izleme (boşsa kapalı, D-041) |
| `TZ` | Kalktı: sunucu her zaman UTC (kod sabiti, ayar değil) |
| `NODE_ENV` | Derleme bayrağı; ayar değil |

Sonuç: `.env.example` 6 satıra iner (§12'de güncellendi). Yeni bir ortam kurmak = veritabanı + Redis + anahtar + ilk yönetici e-postası, sonra her şey panelden.

**Sır yönetimi.** Sırlar `Secret` tablosunda **zarf şifrelemeyle** (AES-256-GCM, veri anahtarı `SETTINGS_MASTER_KEY` ile sarılı) saklanır. Panel sırrı hiçbir zaman geri göstermez (`••••3f9a`, son değişim, son test sonucu); yalnız "Değiştir" ve "Test et" vardır. Yanıtlara, loglara, denetim kaydına değer yazılmaz (yalnız "değişti"). `SETTINGS_MASTER_KEY` kaybolursa sırlar çözülemez, ama başka veri etkilenmez: sırlar yeniden girilir (kurtarma prosedürü: Kurulum belgesi). Barındırma kararı kullanıcıda olduğu için (D-040) harici sır yöneticisi şart koşulmaz; arayüz `SecretStore` soyutlamasıdır, sonradan değiştirilebilir (Q28).

**Çözümleme sırası:** kullanıcı düzeltmesi (ör. su hedefi) > katman değeri > genel değer > koddaki varsayılan. Kayıt defterindeki varsayılan her zaman geçerli bir değerdir; panel boşken bile sistem çalışır.

## 3. Ayar altyapısı (M2'de kurulur)
- `Setting {key, scope (global|tier:normal|plus|pro|platform:ios…), value, version, updatedBy, reason, updatedAt}` ve **salt eklenir** `SettingVersion` (eski değer, yeni değer, kim, neden, ne zaman, hangi değişiklik isteğinde).
- **Okuma:** API işlem içi önbellek (30 sn) + Redis pub/sub ile anında geçersiz kılma; yayında ayarın okuyan her örnekte birkaç saniye içinde yürürlüğe girmesi hedeftir. Yeniden başlatma gerektiren ayar (ör. Sentry DSN) açıkça işaretlenir ve panel "uygulandı / bekliyor" gösterir.
- **Doğrulama:** zod şeması + alanlar arası kurallar (ör. Plus tavan ≥ taban, Sonnet eşiği < Haiku eşiği). Geçersiz taslak yayınlanamaz.
- **Zamanlı yayın:** "yarın 00:00 UTC'de geçerli" (fiyat metni, referans tablo sürümü, içerik).
- **Ortamlar arası aktarım:** staging'de denenen ayar kümesi **dışa aktarılır** (JSON, sırlar hariç) ve production'a **fark görünümüyle içe aktarılır** (taslak olarak; yine onay kurallarına tabi). Her ortam kendi veritabanını yönetir.
- **Yedek:** ayar sürümleri veritabanı yedeğiyle gelir; panelden "tüm yapılandırmayı JSON indir" (sırlar hariç).

## 4. Değişiklik yaşam döngüsü ve risk seviyeleri
`Taslak` → `Doğrulandı` → (`Onay bekliyor`) → `Yayında` → `Geri alındı`. Panelin üstünde taslak varken kalıcı bir şerit görünür: "3 değişiklik taslakta · İncele ve yayınla".

| Seviye | Örnekler | Kural |
|---|---|---|
| **0 · Anında** | İçerik metni, SSS, bildirim şablonu, yardım, ikon talebi durumu, uyarı alıcıları | Taslak yok, kaydet = yayınla; yine sürümlü ve geri alınabilir |
| **1 · Önizlemeli** | Model/çaba, yönlendirme eşikleri, bütçe tabanı/tavanı, kur, komisyon, rate limit, bildirim kuralı parametreleri, feature flag yüzdesi, kademeli düşürme eşikleri | Fark + **etki önizlemesi** ("bu bütçeyle Plus aylık TL kullanıcısı günde ≈ 14 → 17 cümle; tahmini aylık maliyet +$X"), gerekçe zorunlu, yayın düğmesi |
| **2 · Onaylı** | Acil durdurmayı **kapatma**, günlük tavanı artırma (> %50), komisyonu **düşürme** (Small Business onayı kanıtı ister), sağlayıcı anahtarı değiştirme, referans tablosu (%15'ten büyük değişim: D-034), yaş eşikleri ve veri saklama süreleri, rol ve yetki değişikliği, kullanıcı toplu işlemleri, KVKK silme | İkinci kişinin onayı. **Tek yöneticili ekipte** (şimdiki durum): yazılı gerekçe + etkiyi yazarak onay + 15 dk bekleme ("soğuma"); ikinci yönetici eklenince ikinci kişi onayı zorunlu olur (Q29) |
| **K · Kilit** | 13 yaş alt sınırı, "18 altına boy/kilo sorulmaz", sağlık verisi rıza şartı, alkol/sigara öneri yasağı (D-023, D-037) | Panelden **değiştirilemez**; kodda sabit; panel yalnız gösterir ("kilitli: hukuk/ürün ilkesi") |

**Acil durdurma (kill-switch)** onaysız, tek dokunuşla **açılır** (yalnız superadmin); kapatmak seviye 2'dir. Açıldığında: tüm katmanlar yerel moda düşer, kullanıcıya sakin bilgi (tasarım 4.7), yöneticilere uyarı gider.

**Otomatik ayarlama ile elle ayarın ilişkisi (D-033).** Her bütçe ayarı iki kipte: **Otomatik** (gelir ve kura göre günlük hesap, haftalık ±%10 yumuşatma) ya da **Sabit** (elle girilen değer, otomatik durur). Otomatik kipte panel hesabın girdilerini ve sonuç önerisini gösterir; tavan/taban dışına çıkacak öneri "onay bekliyor" olarak bekler. Hesap her gün çalışır ama yalnız fark varsa denetim kaydı yazar.

## 5. Bilgi mimarisi
Sol menü, gruplanmış. Üstte ortam şeridi (staging = turuncu, production = kırmızı ince şerit, local = gri), arama/komut paleti (⌘K: sayfa, kullanıcı kimliği, ayar anahtarı), taslak şeridi, hesap menüsü.

| Grup | Sayfalar |
|---|---|
| **Genel bakış** | Pano |
| **Kullanıcılar** | Kullanıcılar (liste, segment) · Kullanıcı detayı · KVKK talepleri · Rızalar |
| **Gelir** | Abonelikler (katman, deneme, iptal, iade) · Net gelir (D-033 girdisi) · App Store bildirimleri |
| **Yapay zekâ** | Modeller ve yönlendirme · Sistem istemi sürümleri · Araç tanımları · Oyun alanı · Değerlendirme · Anlaşılmayanlar (kuyruk) |
| **Maliyet** | Maliyet ve politika (bütçe, otomatik ayar, kur/komisyon, günlük tavan, acil durdurma, uyarılar, hız sınırları) |
| **Ürün** | Ürün kuralları (bildirim, Günü kapat, yükseltme kartı, deneme, düşürme, ritim seviyeleri, kişiselleştirme) · Feature flag'ler ve deneyler · Mobil uzak yapılandırma |
| **İçerik** | Yardım SSS · Karşılama · AI gözlem şablonları · Bildirim şablonları · Metin anahtarları (tr/en) · İkon talepleri |
| **Beslenme (diyetisyen)** | Referans aralıkları · Diyetisyen alanı (raporlar) |
| **Operasyon** | Sistem sağlığı · Kuyruklar ve işler · Bildirim teslimi · Senkron sağlığı · Hata izleme · Yedekler |
| **Güvenlik** | Yöneticiler ve roller · Oturumlar · Anahtarlar (JWT halkası, sırlar) · Audit log · Veri saklama |
| **Ayarlar** | Yapılandırma merkezi (tüm ayarlar, arama, sürümler) · Entegrasyonlar · Ortam durumu · İçe/dışa aktarma |

Diyetisyen rolü yalnız "Beslenme" grubunu ve kendi bildirimlerini görür; menü sadeleşir (mevcut 6.4/6.5 tasarımı korunur).

### 5.1 Sayfa sayfa ne var

**Pano.** Bugünün durumu tek bakışta; hepsi tıklayınca ilgili sayfaya gider. Kartlar: bugünkü harcama / günlük tavan, kullanıcı başına ay maliyeti (katman), yerel çözüm oranı, çözülemeyen cümle oranı, kuyruk gecikmesi, hata oranı, aktif kullanıcı (anonim sayı), yeni abonelik/iptal. **Dikkat gerektirenler** listesi (tek yer): açık uyarılar, onay bekleyen değişiklikler, son başarısız entegrasyon testi, 30 güne yakın KVKK talebi, süresi dolan sır/anahtar. **Son değişiklikler** (kim, ne, ne zaman, geri al). Sağlık: ayar önbelleği yayını, kuyruk, son yedek. Örnek veri etiketlidir.

**Kullanıcılar.** Liste: sahte-anonim kimlik, maskeli e-posta, katman, kayıt tarihi, son görülme, platform, bütçe doluluğu aralığı; filtreler: katman, ülke/dil, durum (aktif/devre dışı/silme bekliyor), bütçe doluluğu, deneme günü; kayıtlı görünümler. **Detay** (destek rolü salt okur): hesap ve abonelik durumu, katman geçmişi, bu ayki kullanım ve maliyet, rıza durumları (tarih), cihazlar, son hatalar, senkron durumu. **İçerik (rutinler, notlar, cümleler) gösterilmez**; destek için "teşhis paketi" (şemasız metadata, kişisel içerik yok) üretilir. Eylemler: devre dışı bırak / etkinleştir, deneme uzat, katman hediye et (süreli, gerekçeli), oturumları kapat, dışa aktarma başlat, silme başlat (KVKK; seviye 2). **"Kullanıcı olarak gir" (impersonation) yoktur.** E-postayı açma gerekçe ister ve denetlenir.

**KVKK talepleri ve rızalar.** Kuyruk: dışa aktarma ve silme talepleri, kalan süre (yasal süre 30 gün; panel 7. günden uyarır), durum (alındı, doğrulandı, işlendi). Rıza kayıtları salt eklenir; geri çekme etkisi (kullanım durdu mu) görünür.

**Gelir.** Katman başına abone, deneme dönüşümü, iptal nedenleri (kullanıcı verirse), iade, net gelir (fiyat ÷ KDV × (1−komisyon) ÷ kur) plan ve mağaza kırılımında; bu veri D-033 otomatik ayarının girdisidir ve hesap ayrıntısı açık görünür. **Gerçek fiyatlar App Store Connect'te kalır;** panelde yalnız gösterim metni, katman yetkileri ve sınırlar (sayaç sayısı, geçmiş günü, ritim seviyesi) ayarlanır. App Store sunucu bildirimleri günlüğü (alındı/işlendi/hata, yeniden işle).

**Modeller ve yönlendirme.** Basamak tablosu (yerel → Haiku → Sonnet): model kimliği (listeden seçilir; sağlayıcıdan model listesi çekilir), çaba, `max_tokens`, zaman aşımı, güven eşiği, hangi katman hangi basamağı kullanır, yedek sağlayıcı/model. Her satırda **son 7 gün gerçek ölçüm** (çağrı, ort. token, gecikme, hata, maliyet). Değişince yayın öncesi "değerlendirme setiyle karşılaştır" önerisi (doğruluk ve maliyet yan yana, §yapay zekâ kullanır, tahmini maliyet gösterilir). Sürüm değişikliği iki aşamalı: önce %5 trafik (flag), sonra tamamı.

**Sistem istemi sürümleri.** Sürüm listesi, fark görünümü, "yayında / aday / arşiv", tek tıkla geri alma, sürüm başına değerlendirme sonucu. Sabit önek/değişen bağlam ayrımı (önbellek) görünür: önek uzunluğu ve önbellek isabeti. **Araç tanımları:** salt okunur şema listesi (kodda yaşar, `packages/shared`); panelde yalnız hangi aracın açık olduğu (ör. `set_icon` kapatma) ve açıklamaları sürümlenir.

**Oyun alanı.** Yönetici cümle yazar; seçilen yönlendirme ve istem sürümüyle araç çağrısı JSON'u, token, maliyet, gecikme gösterilir; sonucu uygulamaz (kuru çalıştırma). Günlük kendi tavanı vardır (varsayılan $1) ve harcaması bütçe telemetrisine "yönetici" olarak yazılır. Sonucu tek tıkla değerlendirme setine **örnek olarak ekle**.

**Değerlendirme.** Örnek cümle kümeleri (en az 100, tr), beklenen araç çağrısı, çalıştırma geçmişi; çalıştırmadan önce tahmini maliyet ve onay; sonuç: doğruluk, hangi basamakta çözüldü, maliyet; sürümler arası karşılaştırma. "Anlaşılmayanlar" kuyruğundan aday cümleler (rızalı ve maskeli) tek tıkla sete eklenir.

**Anlaşılmayanlar.** Kullanıcıların rıza verdiği anlaşılamayan cümleler (maskeli, kullanıcı kimliksiz), kümeleme (benzer cümleler), her küme için "yerel çözümleyiciye kural ekle" notu: yerel çözüm oranını (hedef ≥ %55) artırmanın birincil kaynağı. Saklama süresi kısa (varsayılan 30 gün).

**Maliyet ve politika** (6.3'ün genişlemiş hali): üst bant (günlük/aylık harcama, tavan, kill-switch), **Katman bütçeleri** (kip: Otomatik/Sabit, oran %30, taban/tavan, haftalık değişim sınırı, ücretsiz katman payı %15), **Kur ve komisyon** (kaynak: elle / günlük otomatik; komisyon senaryosu %30 ↔ %15 ve Small Business kanıtı), **Yönlendirme** (Modeller sayfasına bağlantı), **Kademeli düşürme eşikleri** (%70/%90/%100), **Hız sınırları** (kullanıcı başına dakikalık/günlük, yönetici API'si), **Uyarılar** (kural, eşik, alıcı, kanal), **Simülatör** ("komisyon %15 olursa / kur 60 olursa / Plus fiyatı ₺109,99 olursa her katmanın bütçesi ve cümle/gün karşılığı", yalnız hesaplar, yayınlamaz). Simülatör kararı verirken en değerli araç olduğundan sayfanın ana parçasıdır.

**Ürün kuralları.** Ürün ilkelerinden doğan parametreler ve **kilitli olanların** görünümü:
- Bildirim: aynı iş için günlük sınır (1), varsayılan sessiz saat, bildirim başına en çok eylem (3), Günü kapat hatırlatma saati (22:00) ve otomatik kapanma günü (2) [D-005, D-018].
- Yükseltme kartı: ilk 2 hafta aralığı (4 gün), sonra (10 gün), aylık üst sınır (3); asla-gösterme bağlamları kilitli [D-026].
- Deneme gün sayısı (3), düşürme: Normal'de sayaçlı rutin sayısı (3), görünür geçmiş günü (30) [D-026, D-027].
- Kişiselleştirme: kilo sorma aralığı (6 ay), tahmin karşılıkları (±2/±5 kg), rapor en küçük grup (50) [D-031, D-035, D-036]. Yaş eşikleri **kilitli**.
- Ritim: seviyeye göre desen sayısı ve öneri tavanı [D-019].
Her satırın yanında karar numarası ve "neden" bağlantısı.

**Feature flag'ler ve deneyler.** Bayrak: anahtar, açıklama, sahip, durum, **hedefleme** (katman, platform, uygulama sürümü, ülke, kullanıcı yüzdesi, belirli kullanıcılar), kademeli yayın (%5 → %25 → %100), **otomatik bitiş tarihi** (eskimiş bayrak uyarısı), son değişiklik. Deney: yalnız ürün metriği, **kullanıcı başına skor/seri üretmez**; hangi grubun hangi bayrağı gördüğü ve toplu sonuç. Bayrak değerleri mobil uzak yapılandırmayla gelir.

**Mobil uzak yapılandırma.** Uygulamanın indirdiği ayar kümesinin (§7) önizlemesi: katman ve platform seçerek "bu kullanıcı ne görür?" ve sürüm uyumluluğu (minimum desteklenen sürüm: zorunlu güncelleme uyarısı baskısız ve yalnız gerçekten gerektiğinde).

**İçerik.** Tüm kullanıcıya dönük metinler **anahtar + dil** ile tutulur (`tr` varsayılan, `en` hazır): yardım SSS, karşılama soruları, AI gözlem şablonları, bildirim şablonları, boş durum ve hata metinleri. Editör: sürüm, taslak/yayın, **ton denetimi** (yasak sözcük listesi: "başarısız", "kaçırdın", "seri", "rozet", "%"… `docs/DESIGN.md` §6; yayında uyarı verir, engellemez, seviye 0), uzunluk sınırı, önizleme (telefon çerçevesi), eksik çeviri listesi. **İkon talepleri:** "genel" ikona düşen, eksik ikon olarak kaydedilen etiketlerin sayımı (`docs/ICONS.md`).

**Beslenme.** Mevcut 6.4 ve 6.5 tasarımı korunur; ek olarak: değişiklik büyüklüğü yüzde kuralı (%15 üstü kurucu onayı) formda anında hesaplanır, **sürümler arası fark** ve **etkilenecek kullanıcı sayısı bandı** (≥ 50 kuralıyla) gösterilir, yayın zamanlanabilir.

**Sistem sağlığı ve operasyon.** Servis durumu (API, veritabanı, Redis, kuyruk, e-posta, Anthropic, APNs, App Store bildirimleri, Sentry), son başarılı kontrol, gecikme; **Kuyruklar:** BullMQ kuyruk uzunluğu, başarısız işler (yeniden dene/at), günlük işler (bütçe yeniden hesabı, kur çekme, haftalık Hafıza özeti, günü otomatik kapatma) ve son çalışma/sonraki çalışma; **Bildirim teslimi:** APNs kabul/ret, geçersiz token oranı (yerel planlama cihazda olduğu için sunucu tarafı yalnız push ve senkron); **Senkron sağlığı:** çakışma sayısı, geciken cihaz, hata; **Yedekler:** son yedek zamanı, geri yükleme testi tarihi. Bakım kipi anahtarı: uygulamaya sakin "kısa bir ara" bilgisi, yazma çevrimdışı kuyruğa düşer (cihaz zaten local-first).

**Güvenlik.** Yöneticiler (davet, rol, durum), **zorunlu 2. faktör** (parolasız e-posta bağlantısı + passkey ya da TOTP; SMS yok), oturum listesi ve uzaktan kapatma, boşta 30 dk / mutlak 12 sa zaman aşımı (ayarlanır), isteğe bağlı IP izin listesi, giriş denemesi kilidi. Anahtarlar: JWT halkası döndürme, sır son değişim/test tarihleri ve "90 günden eski" uyarısı. **Audit log:** §6. **Veri saklama:** konuşma kaydı, anlaşılmayan cümleler, yönetici günlükleri, telemetri için süreler (seviye 2).

**Yapılandırma merkezi.** Tüm ayarların arandığı tek liste (anahtar, açıklama, değer, varsayılan, kapsam, son değişiklik, risk seviyesi, "yeniden başlatma gerekir" rozeti); satıra tıklayınca sağda çekmece: düzenle, sürüm geçmişi, geri al, "varsayılana dön", bu ayarı kullanan kod yeri (belge bağlantısı). **Entegrasyonlar** bölümünde her dış hizmet için kart: durum (bağlı / test başarısız / yapılandırılmadı), son test, sır alanları (yazma-yalnız), "Test et" (gerçek ama zararsız bir çağrı: Anthropic'e küçük bir istek, SMTP'ye test e-postası). **Ortam durumu:** hangi `.env` anahtarlarının mevcut olduğu (değerler hiç gösterilmez), sürüm, commit, migrasyon durumu, ayar önbelleği sürümü.

## 6. Denetim kaydı
- Her yazma (ayar, içerik, rol, kullanıcı eylemi, e-posta açma, oturum): `kim, rol, ne zaman (UTC), ortam, hedef, önce/sonra (sırlar hariç), gerekçe, IP/cihaz özeti, istek kimliği`.
- **Salt eklenir ve zincirlidir** (her kayıt önceki kaydın özetini taşır); panel zincir doğrulama düğmesi sunar. Uygulama rolü kaydı silemez/değiştiremez.
- Filtre: kim, ne, modül, seviye, tarih; dışa aktarma (CSV, kişisel veri maskeli). Saklama varsayılan 24 ay (seviye 2 ile değişir).
- Değişikliklerin **geri alınması** yeni bir kayıt olarak yazılır.

## 7. Mobil uzak yapılandırma
`GET /v1/config` (kullanıcı katmanı, platform ve uygulama sürümüne göre) şunları döner: bayraklar, katman yetkileri ve sınırlar, ürün kuralı parametreleri, minimum sürüm, metin paketi sürümü. İlkeler: imzalı yanıt ve sürüm numarası; cihazda önbellek ve **çevrimdışıyken son bilinen yapılandırma** (ürün çevrimdışı çalışmak zorunda); ağ yoksa bile ilk açılışta uygulamaya gömülü varsayılanlar. **Bildirim ve plan davranışını bozacak bir ayar cihazda yarım uygulanmaz:** yapılandırma sürümü bir bütündür. Maliyet ve gizlilik ayarları (anahtarlar, bütçeler) cihaza **hiç gönderilmez.**

## 8. Roller ve izinler
İzin biçimi `modül:eylem`. Rol → izin eşlemesi veri tablosudur (panelden değil, kodda sürümlü; değişikliği seviye 2).

| İzin | Superadmin | Destek | Analist | İçerik | Diyetisyen |
|---|---|---|---|---|---|
| Pano, toplu metrikler | ✓ | ✓ (sınırlı) | ✓ | — | — |
| Kullanıcı detayı (içeriksiz) | ✓ | ✓ | — | — | — |
| Kullanıcı eylemi (devre dışı, deneme uzat) | ✓ | ✓ (sınırlı) | — | — | — |
| KVKK silme/dışa aktarma | ✓ | ✓ (başlatır, superadmin onaylar) | — | — | — |
| Gelir, maliyet (okuma) | ✓ | — | ✓ | — | — |
| Maliyet/politika yazma | ✓ | — | — | — | — |
| Yapay zekâ yazma (model, istem) | ✓ | — | — | — | — |
| Oyun alanı, değerlendirme | ✓ | — | ✓ | — | — |
| Konuşma kayıtları (rızalı, maskeli) | ✓ | — | — | — | — |
| İçerik yazma | ✓ | — | — | ✓ | — |
| Feature flag yazma | ✓ | — | — | — | — |
| Referans aralıkları, Diyetisyen alanı | ✓ (onay) | — | — | — | ✓ |
| Audit log okuma | ✓ | — | ✓ (kendi modülleri) | — | — |
| Roller, anahtarlar, saklama | ✓ | — | — | — | — |

Yönetici yetki aşımına karşı: ayrı yönetici hesapları (kullanıcı hesabından bağımsız), her API çağrısında izin denetimi sunucuda, panel yalnızca izinli menüyü gösterir ama gizleme güvenlik sayılmaz.

## 9. Arayüz ilkeleri
- **Çizgi:** mevcut tuval ve 6.3 ile aynı: koyu Buz Mavisi, Inter 300, kenarlıksız tonal yüzey. Geniş ekran (1280+), kenar çubuğu 240 px, içerik 12 sütun; dar ekranda (tablet) kenar çubuğu daralır; **telefon desteklenmez** (yalnız acil durdurma ve uyarı okuma için duyarlı bir "acil" görünümü olur).
- **Erişilebilirlik:** kontrast ≥ 4,5:1, **tüm tıklanabilirler ≥ 44 px yükseklik** (tuvaldeki 6.3'te 40 px olan düğmeler 44'e çıkarıldı), klavye ile tam gezinme, odak halkası, durum yalnız renkle verilmez (ikon ya da metin).
- **Düzen:** her sayfada başlık + tek cümle açıklama + birincil eylem sağ üstte; tablolar yapışkan başlık, sütun seçici, kayıtlı görünüm, sayfa başına 50; boş durum "ne yapılır" cümlesi taşır; yükleniyor iskeletleri; hata yeniden dene.
- **Form:** alan altında birim ve izin verilen aralık, sınır dışı değer anında kırmızı değil **sakin uyarı** (ikon + metin), "varsayılana dön" bağlantısı, değiştirilmiş alan işaretli, kaydetmeden çıkarken uyarı.
- **Tehlikeli eylem:** kırmızı yerine koyu vurgu + açıklayıcı onay ("YAZ: PRODUCTION"); yalnız production'da.
- **Etki dili:** "Plus aylık TL kullanıcısı için bütçe $0,16 → $0,19 (≈ günde 14 → 17 cümle)" gibi somut karşılıklar; sadece sayı değil.
- **Örnek veri** etiketli, **boş durum** dürüst; hiçbir yerde uydurma ölçüm gerçek gibi gösterilmez.

## 10. Veri modeli ek varlıkları (`docs/DATA-MODEL.md` §10)
`Setting`, `SettingVersion`, `Secret`, `ChangeRequest`, `AdminUser`, `AdminRole`, `AdminSession`, `AuditLog`, `PromptVersion`, `FeatureFlag`, `Experiment`, `ContentItem` (key, locale, version, status), `AlertRule`, `AlertEvent`, `CostRollupDaily`, `EvalSet`/`EvalRun`, `UnparsedUtterance`, `DataRequest` (KVKK). Ayrıntı alanlar veri modeli belgesinde.

## 11. Bilinen riskler
| Risk | Önlem |
|---|---|
| Ayar kayıt defteri ile belge ayrışır | Belge tablosu kayıt defterinden üretilir; CI aynı olmayanı reddeder |
| Yanlış ayar canlıyı bozar | Doğrulama, sınırlar, etki önizlemesi, kademeli yayın, tek tıkla geri al, son bilinen iyi yapılandırma |
| Sırlar sızar | Zarf şifreleme, yazma-yalnız alan, log/denetimde yok, dönüş süresi uyarısı |
| Yönetici tek kişi: dört göz yok | Soğuma süresi + yazılı onay; ekip büyüyünce ikinci kişi zorunlu |
| Panel yeni kullanıcı verisi toplar | Panel veri üretmez; yalnız mevcut telemetriyi okur; kullanıcı içeriği kapalı |
| İş bilgi sızıntısı (rol) | En az yetki, oturum güvenliği, IP izni, denetim |
| Ayar sayısı büyür, panel karışır | Kayıt defteri zorunlu açıklama ve grup ister; "Yapılandırma merkezi" arama; kullanılmayan ayar raporu |

## 12. Uygulama sırası
1. **M2'de:** `Setting`/`SettingVersion`/`Secret`, kayıt defteri, okuma önbelleği, `.env` 6 satıra, anahtar halkası, ilk yönetici davet akışı, audit log tablosu.
2. **M3'te:** model/yönlendirme ve istem sürümleri ayarları kayıt defterinden okunur; maliyet telemetri günlüğü.
3. **M6'da (4 hf → **5 hf**):** panel kabuğu (rol, 2FA, ortam şeridi, ⌘K, taslak şeridi), Yapılandırma merkezi + Entegrasyonlar, Maliyet ve politika (simülatör dahil), Yapay zekâ (modeller, istem, oyun alanı, değerlendirme), Kullanıcılar + KVKK, İçerik, Feature flag, Beslenme, Operasyon, Audit log. Çıkış ölçütü: bir prompt sürümü ve bir bütçe değişikliği taslak → onay → yayın → geri al akışıyla uçtan uca çalışır; hiçbir ayar `.env`'de kalmamıştır.
4. **Test ortamı (T7)** için çekirdek alt küme: Yapılandırma merkezi, Entegrasyonlar, Maliyet ve politika, Kullanıcılar (okuma), Modeller/istem, Beslenme, Feature flag, Audit log. Gelir, oyun alanı, deney ve bakım kipi sonraya.

## 13. Açık sorular
Kapandı: Q28 sırlar veritabanında şifreli; Q29 tek yöneticide gerekçe + yazarak onay + 15 dk bekleme; Q30 VPN yok, zorunlu 2FA yeterli, IP listesi isteğe bağlı.
