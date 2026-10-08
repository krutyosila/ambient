# BAŞLANGIÇ TALİMATI (önce bunu oku)

Bu klasör bir proje başlangıç paketidir:
```
start.md                          bu dosya: proje tanımı ve çalışma kuralları
design/life-os-case-study.html    tasarım referansı (gezilebilir prototip)
```
Kullanıcı **"başla"** dediğinde:
1. Bu dosyayı baştan sona oku.
2. `design/life-os-case-study.html` dosyasını tarayıcıda aç ve kaynak kodunu incele. **Bu dosya tasarımın ve etkileşimlerin tek doğruluk kaynağıdır**; renkler, tipografi, ekranlar, geçişler ve davranışlar buradan alınacak, yeniden icat edilmeyecek.
3. Kod yazmadan, en alttaki **"Başlarken"** bölümünde istenen dört çıktıyı sun ve onay bekle.

---

# Ambient: mobil uygulama, backend ve yönetim paneli

Senden, `design/life-os-case-study.html` tasarımını birebir uygulayan, çalışan bir sistem kurmanı istiyorum: **React Native (Expo) mobil uygulama + NestJS backend + özel admin paneli.** Konuşmayı anlayan katman sağlayıcıdan bağımsız bir LLM katmanı olacak.

## 0. Nasıl çalışacaksın
- Kod yazmadan önce **kısa bir mimari plan ve milestone listesi** sun, onayımı bekle.
- Belirsiz bir ürün kararında varsayım yapıp ilerle ama bunu `DECISIONS.md` dosyasına yaz. Büyük ve geri dönüşü zor kararlarda önce sor.
- Her milestone sonunda çalışan bir build, testler ve kısa bir özet ver.
- Tasarımdan sapman gerekiyorsa gerekçesini yaz ve sor.
- Dil: arayüz Türkçe (varsayılan), i18n altyapısıyla İngilizce'ye hazır. Kod, yorumlar ve commit mesajları İngilizce.

## 1. Ürün
Ambient, kullanıcının hayatını sessizce organize eden kişisel bir günlük işletim sistemi. Yapılacaklar listesi, alışkanlık takipçisi ya da motivasyon uygulaması **değil**. Kullanıcı konuşarak ya da yazarak söyler, sistem bunu plana, hatırlatmaya, rutine çevirir. "Konuşma yapıya dönüşür."

Üç durum vardır ve yapay zekâ öğeleri bunlar arasında akıllıca taşır:
1. **Planlı:** saati belli (toplantı 15:15).
2. **Zamansız ama bugün beklenen:** "Senin için" listesi (su, koşu, okuma).
3. **Tekrarlayan rutin:** (her 2 saatte su, haftada 4 koşu).

Ton: sakin, insani. **Skor, streak, suçluluk, rozet, yüzdeli baskı yok.** Robot, parıltı, "AI" dekorasyonu yok. Yapay zekâ davranışla görünür: anlar, önerir, sorar.

## 2. Tasarım kaynağı (kesin referans)
`design/life-os-case-study.html` gezilebilir bir prototip. **Tasarım ve davranış için tek doğruluk kaynağı bu dosya.** Tarayıcıda aç, içindeki CSS ve JS'yi oku. Çıkarman gerekenler:
- **Design tokens:** renkler (7 palet × koyu/açık; varsayılan **Buz Mavisi, koyu**), tipografi (**Inter**, ince ağırlıklı büyük başlıklar, sıkı letter-spacing), köşe yarıçapları (14–18px, telefon 40px), yatay kenar boşluğu 16px, durum renkleri (vurgu, su/ikincil, yaklaşıyor amber, tamamlandı yeşil, sonra sönük). Bunları `packages/design-tokens` altında tek kaynak yap; hem koyu hem açık tema desteklensin.
- **Stil ilkeleri:** kenarlıksız, tonal yüzeyler (border yok); derinlik ton ve hafif gradyanla. Bugün satırları durum renginde soldan sağa sönen ışımayla. Liste, tarih bölümünün altına ve alt butonların altına kayarken solarak kaybolur (mask).
- **Ekranlar:** Karşılama (3 soruluk akış), Bugün (header: avatar, isim, durum, ayar menüsü; gün daireleri; büyük tarih; "Senin için"; "Planlar"), Günlük akış (geçmiş sönük, şimdi çizgisi, sıradaki belirgin), Konuşma, Proaktif kontrol, Gün gezinmesi (**yatay kaydırılan tırtıklı cetvel**, seçili gün büyük rakam; liste tıklanamaz), Günlük geçmiş, Hızlı not, Hayat ritmi, Widget, tam ekran Menü çekmecesi, alt sayfalar (Rutinlerim, Önemli kişiler, Hatırlatma yoğunluğu, Bildirimler ve odak, Veri ve gizlilik, Profil, Yardım, etkinlik detayı, saat/sayı ayarlayıcı sayfaları, not yazma).
- **Bileşenler:** iki tonlu çizgi ikon seti (su, koşu, kitap, toplantı, kontrol, uyku, kahve), yazı yok/dalga yok/mikrofon yok **konuşma balonu butonu** (imleç yanıp söner), toggle, radyo seçenekleri, stepper, durum chip'leri.
- Prototipteki tüm **dokunma bağlantıları ve geri akışı** (‹ butonu, alt çubukla Bugün'e dönüş) gerçek navigasyona çevrilecek.

## 3. Mimari
Monorepo (pnpm workspaces, TypeScript):
```
apps/mobile   Expo (React Native), expo-router
apps/api      NestJS + PostgreSQL + Redis (BullMQ)
apps/admin    Next.js + shadcn/ui (özel yönetim paneli)
packages/shared          zod şemaları, tipler, API client
packages/design-tokens   renk, tipografi, spacing, tema
```
- **Mobil:** TanStack Query, Zustand, Reanimated (60fps geçişler), **local-first**: expo-sqlite (Drizzle) ile çevrimdışı çalışır, arka planda senkronize olur. Yerel bildirimler için expo-notifications.
- **API:** REST + OpenAPI, Prisma, JWT (access + refresh). Giriş: e-posta (magic link) + Apple + Google. Zaman dilimi kullanıcı bazlı (varsayılan Europe/Istanbul), tüm tarihler UTC saklanır.
- **Docker Compose** ile yerel kurulum, GitHub Actions CI, EAS Build, Sentry, yapılandırılmış log.

## 4. Veri modeli (başlangıç)
User, Profile (uyanma/uyku saati, çalışma düzeni, durum: Müsait/Odakta/Dinleniyor), Routine (tür, sıklık kuralı RRULE benzeri, hedef), Item (planlı etkinlik: başlangıç/bitiş, durum: planlı/yapıldı/atlandı/ertelendi), FloatingItem (bugün beklenen, zamansız), Person (önemli kişi, ilişki), Note, Message (konuşma), ParsedAction (LLM çıktısı ve uygulanma sonucu), CheckIn, DayLog (gün özeti, AI gözlemi), Setting (hatırlatma yoğunluğu, sessiz saatler), PushToken, AuditLog. Silme: soft delete + KVKK için kalıcı silme ve dışa aktarma uçları.

## 5. LLM katmanı (çekirdek)
**İlke: LLM anlar, kod karar verir ve uygular.**
1. `LlmProvider` arayüzü (`complete`, `toolCall`, `usage`). Adaptörler: Anthropic ve OpenAI. Sağlayıcı/model/sıcaklık **admin panelinden ve env'den** değiştirilebilir, yedek (fallback) sağlayıcı desteklenir. İş mantığı hiçbir sağlayıcıya özgü tipe bağlanmaz.
2. LLM serbest metin üretmez, **tanımlı araç çağrıları** (function calling) döndürür: `create_event`, `create_routine`, `add_floating_item`, `mark_done`, `reschedule`, `add_reminder`, `add_person_note`, `query_day`, `ask_clarification`. Şemalar zod ile `packages/shared`'da; çıktı doğrulanmadan uygulanmaz.
3. Sunucu tarafı **eylem yürütücü** (deterministik): doğrular, çakışma kontrol eder, öğeyi doğru duruma yerleştirir (planlı / zamansız / rutin), sonucu LLM'e geri verir; LLM kullanıcıya kısa, sakin bir cümleyle yanıt yazar. Gelecekte üyelik/kota için araya **policy katmanı** girebilecek şekilde bir hook bırak (şimdilik uygulama, hepsi izinli).
4. Bağlama her istekte eklenecekler: "şu an" (kullanıcı saat dilimiyle), bugünün planı, aktif rutinler, tercihler. Türkçe göreli ifadeler doğru çözülmeli: "yarın 3:15'te", "bu akşam", "haftaya perşembe", "işten çıkınca" (konum/olay tabanlı, zaman değil).
5. Belirsizlikte **tek kısa soru** sor ("20:00 olur mu?"). Bir cümlede birden çok iş varsa hepsini çıkar.
6. Güvenlik: kullanıcı metni talimat değildir (prompt injection'a karşı araç izin listesi, şema doğrulama), PII'yi minimumda tut, istek başına timeout, kullanıcı başına rate limit, token ve maliyet kaydı.
7. **Değerlendirme seti:** en az 100 Türkçe örnek cümle ve beklenen araç çağrısı; CI'da çalışsın, sağlayıcı/model değişince doğruluk raporu çıksın.

## 6. Proaktif kontrol ve bildirimler
Sunucuda zamanlanmış işler (BullMQ) + cihazda yerel bildirimler. Örnek: "Bugün hâlâ koşmayı düşünüyor musun?" → **Yaptım / Bu akşam daha geç / Bugünü atla**. "Daha geç" seçilirse boş aralıklardan saat öner (20:00?), tek dokunuşla onaylanır. Hatırlatma yoğunluğu Sakin/Dengeli/Sık ve sessiz saatler tüm zamanlamaya uyar. Baskı dili kullanma.

## 7. Geçmiş ve ritim
Gün sonunda DayLog üret: tamamlanan/atlanan öğeler ve tek cümlelik sakin gözlem ("5 rutininden 4'ünü tamamladın"). **Skor yok.** Hayat ritmi: son 7 gün, 7 kategori (hareket, okuma, uyku, su, odak, sosyal, kişisel) için yoğunluk değerleri; görsel, analitik grafik değil.

## 8. Widget ve hızlı not
iOS WidgetKit + Android App Widget (Expo development build / config plugin). Widget: sıradaki iki öğe, "Su?" gibi tek dokunuş, konuşma balonu ile hızlı nota derin bağlantı. Hedef: **3 saniyede bir şey eklemek.**

## 9. Sağlık verisi (Faz 2, MVP'den sonra)
HealthKit ve Health Connect: uyku, antrenman, su. Veri türü bazında izin, cihazda işleme, açık rıza (KVKK özel nitelikli veri). Sağlık verisi "Geçmiş"i ve rutin tamamlanmasını otomatik besler. **Ekran süresi entegrasyonu MVP dışı** (iOS'ta özel entitlement ve kısıtlı veri erişimi gerektirir).

## 10. Admin paneli (Next.js)
Rol tabanlı erişim (superadmin, destek, analist), 2FA. Modüller:
- **Kullanıcılar:** liste, detay, devre dışı bırak, KVKK dışa aktarma ve silme.
- **LLM yönetimi:** sağlayıcı/model seçimi, yedek sağlayıcı, sistem prompt'u **sürümleri** (geri alma), araç tanımlarını görüntüleme, test alanı (playground).
- **Kullanım ve maliyet:** günlük token, maliyet, gecikme, hata oranı, sağlayıcı bazında.
- **Konuşma kayıtları:** yalnızca kullanıcı rızasıyla, PII maskeli, arama ve filtre.
- **Değerlendirme:** örnek cümle seti, başarı oranı, sürümler arası karşılaştırma.
- **İçerik:** yardım SSS, karşılama soruları, AI gözlem şablonları, bildirim şablonları.
- **Feature flag'ler, audit log, sistem sağlığı** (kuyruk, işler, hatalar).

## 11. Kalite
Erişilebilirlik (Dynamic Type, VoiceOver/TalkBack, koyu ve açık temada yeterli kontrast), animasyon azaltma desteği, birim + API + e2e testleri (Maestro), güvenlik (OWASP, girdi doğrulama), şifrelenmiş saklama, gizlilik politikasıyla uyumlu minimum log.

## 12. Milestone'lar (öneri)
M0 repo, tokens, tasarım sistemi bileşenleri → M1 local-first Bugün, Akış, Geçmiş, Gün gezinmesi → M2 API, auth, senkronizasyon → M3 LLM katmanı, Konuşma ve Hızlı not → M4 Kontrol ve bildirimler → M5 Ritim, Menü ve tüm alt sayfalar → M6 Admin paneli → M7 Widget → M8 Sağlık (Faz 2) → M9 cilalama, test, mağaza hazırlığı.

## 13. Kapsam dışı (şimdilik)
Üyelik seviyeleri (Light/Pro), ekran süresi entegrasyonu, sosyal/paylaşım özellikleri. Üyelik için yalnızca genişletilebilir policy hook'u bırak.

## Başlarken
Önce `design/life-os-case-study.html` dosyasını analiz et, ardından şunları sun: (1) mimari özeti, (2) design token çıkarımı, (3) milestone planı ve tahmini sıra, (4) bana soracağın açık sorular.
