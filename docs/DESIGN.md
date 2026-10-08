# Tasarım rehberi (v2)

Kaynak: `design/life-os-case-study.html` prototipi. Bu belge prototipin **yerine geçmez**; yalnızca onaylanmış v2 farklarını (karar D-001, D-011) ve eksik envanteri tanımlar. Kod `packages/design-tokens` altında tek kaynak olacak.

Görsel çalışma (38 sayfa: ekranlar, ikon kütüphanesi, kurgu haritası, araştırma panosu): https://claude.ai/artifact/CHcQgkvtgDe2JDoqGd1TX2 (özel bağlantı; paylaşım sahibinin Paylaş menüsünden yapılır). Tuvaldeki ekranlar statiktir ve Q7 kararına kadar "Önerilen" renginde sapma içerir (aşağıya bak).

## 0. İkonlar
Prototipteki 7 ikon 45'e çıkarıldı: `design/icons/ambient-icons.svg`, liste ve seçim kuralı `docs/ICONS.md`. Yeni ekranlar yalnızca bu kütüphaneyi kullanır.

## 1. İlkeler
1. **Sakin ve insani.** Skor, seri, rozet, yüzde, robot ve parıltı yok. Yapay zekâ davranışla görünür: anlar, önerir, sorar.
2. **Tek odak.** Bugün ekranının tepesinde tek bir "Sırada" öğesi büyük durur; gerisi ona hizmet eder.
3. **Kenarlıksız, tonal.** Derinlik ton ve hafif gradyanla gelir; kenarlık yok. (İstisna: "Önerilen" kesikli çizgi, odak halkası.)
4. **Okunur sönüklük.** Geçmiş ve ikincil öğeler soluk görünür ama kontrast ≥ 4,5:1 kalır.
5. **Öneri ≠ karar.** Yapay zekâ çıktıları "Önerilen" olarak görsel olarak ayrılır, tek dokunuşla onaylanır, onaylanmadan plan değişmez.
6. **Üç saniyede yakalama.** Konuşma balonu butonu her ana ekranda aynı yerde.
7. **Form yok.** Kayıt yalnızca söz ve yazıyla girer; dokunuş yanıt, onay ve geri al içindir (D-012).

## 2. Token'lar

### 2.1 Prototipten (v1, değişmez)
7 palet × koyu/açık. Varsayılan **Buz Mavisi, koyu** (palet indeksi 4).

| Token | Anlam | Buz Mavisi koyu | Buz Mavisi açık |
|---|---|---|---|
| `--bg` | sayfa zemini | `#07090c` | `#e3e9f0` |
| `--ph` | telefon yüzeyi | `#090c10` | `#f3f6fa` |
| `--a` (`--ar` RGB) | vurgu | `#8fbcff` (143,188,255) | `#2f6fd6` (47,111,214) |
| `--w` (`--wr` RGB) | su / ikincil | `#8ad6cc` (138,214,204) | `#1f8f86` (31,143,134) |
| `--t` | metin | `#e6ecf2` | `#141a22` |
| `--d` | sönük metin | `#7f8894` | `#6a7686` |
| `--ok` | tamamlandı | `#8fcf9f` | `#2f9e5f` |
| `--wn` | yaklaşıyor (amber) | `#f2b45c` | `#c9860f` |
| `--g`, `--gb` | tonal yüzey, yüzey sınırı | beyaz %5,5 ve %9 | koyu %5,5 ve %9 |
| `--f` | çok sönük (çizgi, işaret) | `rgba(236,232,225,.34)` | karşılığı |

Diğer paletler: Kum & Sis, Adaçayı, Lila Alacakaranlık, Gül Külü, Mono Fildişi, Kehribar. Değerler prototipteki `P` (koyu) ve `L` (açık) dizilerinde; koda olduğu gibi taşınacak.

### 2.2 v2 geliştirmeleri
| Değişiklik | v1 | v2 | Neden |
|---|---|---|---|
| Metin kademeleri | `--t`, `--d`, `--f` | `--t` (16,8:1), **`--d2` yeni** ≈ `#9ba5b0` (8,0:1), `--d` (5,6:1). `--f` yalnızca dekoratif | Orta kademe eksikti; ikincil metin ya çok parlak ya çok sönük kalıyordu |
| `--f` kullanımı | metin dahil | **metinde yasak** (2,7:1) | Erişilebilirlik |
| Geçmiş satırlar | `opacity:.32` (≈ 2,5:1) | renk `--d`, ağırlık 300, tamamlandıysa küçük onay ikonu | Okunabilirlik, 4,5:1 hedefi |
| Yüzey merdiveni | `--g` tek kademe | `s1` %5,5, `s2` %8,5, `s3` %12 beyaz (koyu temada) | Kart, vurgulu kart, düğme arka planı ayrımı |
| Vurgulu yüzey | yok | vurgu rengiyle %12–20 karışım (ör. seçili seçenek, "Sırada" kartı gradyanı) | Seçili durum kenarlıksız gösterilebilsin |
| Dokunma hedefi | karışık | **en az 44×44 px** | Erişilebilirlik |

Tuvaldeki ekranlarda yüzey hex değerleri (`#14181D`, `#161B21`, `#1B2027`) `s1`–`s3` merdiveninin yaklaşık karşılıklarıdır; koda alfa token'larıyla taşınacak.

### 2.3 Tipografi
Inter. Başlıklar ağırlık 300, `letter-spacing:-.03em`; gövde 300–400; vurgu 500. Ağırlık 600+ kullanılmaz.
Ölçek (px): 11, 12, 13, 14, 15, 16–17, 21–22, 28, 32, 36, 40, 76 (gün gezinmesi seçili gün rakamı).
Büyük rakamlar ve saatler `font-variant-numeric: tabular-nums`.

### 2.4 Köşe yarıçapları
Düğme 11–14, satır 14–16, kart 18–24, "Sırada" ve widget 24–28, telefon 40. Yatay kenar boşluğu 16 px.

### 2.5 Hareket
Onay çizgisi çizilir (prototipteki `dr` animasyonu). Geçişler Reanimated ile 60 fps. `prefers-reduced-motion` açıkken animasyonlar kapanır, son durum gösterilir.

### 2.6 Açık tema (yapılacak)
Prototipin açık paletinde bazı renkler küçük metinde 4,5:1'i geçmiyor (Buz Mavisi açık: `--d` 3,8:1, vurgu 3,9:1, su 3,2:1, amber 2,5:1, yeşil 2,8:1). Açık tema için küçük metin renkleri koyulaştırılmalı; değerler ölçülerek belirlenecek. Bu iş M0 çıkış ölçütüdür.

## 3. Durumlar ve renk anlamı
| Durum | Görünüm |
|---|---|
| Geçmiş | `--d` metin, ağırlık 300 |
| Şimdi çizgisi | vurgu rengi gradyan çizgi, solda saat |
| Sırada | büyük başlık, vurgu gradyanlı kart, kalan süre çizgisi (skor değil, zaman) |
| Yaklaşıyor | amber (`--wn`) |
| Tamamlandı | yeşil (`--ok`) onay ikonu |
| Önerilen | kesikli çizgi + "Önerilen" chip + "Olur / Başka saat" |
| Atlandı / dinleniyor | ay ikonu, `--d2`; hiçbir uyarı rengi kullanılmaz |

**Önerilen rengi (D-016):** ikincil renk (`--w`) + kesikli çizgi + "Önerilen" chip'i. Amber yalnızca "yaklaşıyor". Tuvalde Bugün, Akış ve Kontrol buna göre; Konuşma sayfasındaki "Bugün beklenen" etiketi hâlâ amber, gözden geçirilecek.

## 4. Bileşenler
Prototipten: iki tonlu çizgi ikon seti (su, koşu, kitap, toplantı, kontrol, uyku, kahve), konuşma balonu butonu (yazı yok, dalga yok, mikrofon yok, imleç yanıp söner), toggle, radyo, stepper, durum chip'i.

v2 ile eklenenler:
- **Sırada kartı** (Bugün ekranı üstü).
- **Önerilen satırı ve kartı** (kesikli çizgi, Olur / Başka saat).
- **Çıkarım kartı** (Konuşma): tür etiketi (Planlı, Bugün beklenen, Rutin), başlık, tek satır not, düzenle düğmesi.
- **Vurgulu cümle** (Konuşma): çıkarılan saat, kişi ve sıklık altı çizili (`border-bottom` vurgu rengi).
- **Seçenek düğmesi** (Kontrol): 60 px yükseklik, ikonlu, seçili hali vurgu karışımı.
- **Kapanış satırı** (Günü kapat): onay ikonu + başlık + saat; yapılmayanlar için "Yarına al".
- **Bildirim kartı** (kilit ekranı) ve **widget** (Sırada, sonrası, "Su?" tek dokunuş, hızlı not).
- **Rutin simge ve renk seçici** (M5; Habit Tracker kullanıcılarının sevdiği özelleştirme).

## 5. Ekran envanteri
Tam envanter, giriş ve çıkışlar, cümle → araç eşlemesi: `docs/FLOWS.md`. Tuvalde 46 sayfa var (42 ekran + ikon kütüphanesi + kurgu haritası + admin maliyet paneli); prototipte olmayıp eklenenler:

| Yeni | Neden |
|---|---|
| Günü kapat | Sunsama bulgusu (D-006, onay bekliyor) |
| Konuşma: su kaydı, tek soru | Sayaçlı rutin (D-014), tek soru kuralı |
| Rutin detayı: Su | Gün içi çok kayıtlı rutin |
| Ritmin | Geçmişten öğrenme (D-013) |
| Plan ve fiyat, Takvim, İzinler, Giriş | Fiyat şeffaflığı, takvim içe aktarma, izin akışı |
| Anlaşılmadı, Çevrimdışı, Boş gün, Anlama hakkı doldu | Özel durumlar |
| Gün kapanmadı, Planları karşılaştır, Plan ve fiyat (3 katman), Ritim seviyesi seçici | Üyelik (D-021), Günü kapat hatırlatması (D-018), ritim seviyeleri (D-019) |
| Admin: Maliyet ve politika | Maliyet duyarlı sistem (D-020) |
| Tüm verileri sil onayı, Kişi detayı, Etkinlik detayı, Günün akışı, Günlük geçmiş, Menü, Profil ve alt sayfalar | Prototipteki gezilebilir sayfaların v2 hali |

Prototipteki **saat ve sayı ayarlayıcı sayfaları kaldırıldı** (D-012). Karşılama, Gün gezinmesi, Hayat ritmi ve Widget prototip düzenini korur.

## 6. Ton ve metin rehberi
Kısa, sakin, düz cümle. Soru sorulacaksa tek soru.

| Kullan | Kullanma |
|---|---|
| "Bugün dinleniyorum", "Yarına al", "Önerilen", "Olur", "Yaptım", "Daha geç" | "Başarısız", "kaçırdın", "seri", "hedefe ulaş", "%", "rozet", "tebrikler!" |
| "5 rutininden 4'ünü tamamladın." | "%80 başarı" |
| "Koşuyu bırakmak da bir karardı." | "Koşuyu yapmadın." |
| "Koşu hâlâ planında mı?" | "Rutinin başladı!" |
| "Üç şey ekledim." + Geri al | Onaysız sessiz değişiklik |

## 7. Erişilebilirlik kontrol listesi
- Metin kontrastı ≥ 4,5:1 (büyük metin ≥ 3:1), her iki temada ve her palette ölçülür.
- Dokunma hedefi ≥ 44 px; yalnızca ikonlu düğmelerde erişilebilir ad.
- Dynamic Type, VoiceOver ve TalkBack etiketleri; durum yalnızca renkle iletilmez (ikon ya da metin eşlik eder).
- Animasyon azaltma desteği.
- Bildirim eylemleri tek dokunuşla ve ekran okuyucuyla kullanılabilir.
