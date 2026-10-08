# Ekranlar ve akışlar

Görsel kaynak: tuvaldeki 38 sayfa (https://claude.ai/artifact/CHcQgkvtgDe2JDoqGd1TX2, özel bağlantı). Numaralar tuvaldeki başlıklarla aynıdır. Prototip `design/life-os-case-study.html` davranış için hâlâ kaynaktır; farklar `docs/DESIGN.md` içinde.

## 1. Etkileşim kuralları
1. **Kayıt yalnızca söz ve yazıyla girer** (D-012). Form, saat seçici, sayı ayarlayıcı yok.
2. **Dokunuş üç iş görür:** sistemin sorusunu yanıtlamak (Yaptım, Daha geç, Dinleniyorum, Doğru), bir öneriyi onaylamak (Olur) ve son işlemi geri almak (Geri al). Gezinmek ve salt okunur ayrıntıya girmek de dokunuştur.
3. **Konuşma çubuğu** her sayfada altta durur ve o sayfaya özgü ipuçları gösterir. Balon düğmesine dokunmak yazmayı, basılı tutmak sesle söylemeyi açar. Mikrofon izni yoksa yalnızca yazma kalır.
4. **Tek soru kuralı:** belirsizlikte tek kısa soru; çipler yalnızca olası yanıtlardır. Anlaşılmazsa söylenen not olarak saklanır.
5. **Geri alınabilirlik:** her araç çağrısı `ParsedAction` olarak saklanır; "Geri al" ve "son suyu geri al" çalışır.
6. **Çevrimdışı:** cümleler kuyruğa girer, bağlanınca anlaşılır; okuma ekranları çevrimdışı çalışır.

## 2. Ekran envanteri
| No | Ekran | Giriş | Çıkış / sonraki | Ana cümleler (örnek) | Veri |
|---|---|---|---|---|---|
| 1.1 | Bugün | Uygulama açılışı | Sırada kartı → 2.6; su kartı → 2.7; tarih → 1.2; cetvel → 2.3; avatar/ayar → 3.1; balon → 1.3 | "Bir bardak su içtim", "Bu akşam koşarım" | Items, Routine sayaçları, Suggestion |
| 1.2 | Günün akışı | 1.1 tarih | ← 1.1 | "Öğle yemeğini 13:30 yap" | Items, LogEntry işaretleri |
| 1.3 | Konuşma (yapı) | Balon | Tamam / Geri al → 1.1 | "Yarın 15:15'te Elif'le kahve, bu akşam da koşarım, haftada 4 koşu olsun" | ParsedAction, Items, Routine |
| 1.4 | Konuşma (su kaydı) | Balon | → 1.1, 2.7 | "Az önce iki bardak su içtim", "Sabah da bir bardak içmiştim" | LogEntry |
| 1.5 | Konuşma (tek soru) | Belirsiz cümle | Yanıt → 1.3 | "Perşembe doktora gideceğim" → "Bugün mü, 15 Ekim mi?" | Item (beklemede) |
| 1.6 | Hızlı not | Widget, kilit ekranı, uzun basma | Gönder → 1.1 | "İşten çıkınca kahve al" | FloatingItem (konum/olay tabanlı) |
| 1.7 | Kilit ekranı ve widget | Bildirim, ana ekran | Yanıt eylemleri, balon → 1.6 | "Su · 3" yanıtı, hızlı not | OutboxUtterance, LogEntry |
| 2.1 | Proaktif kontrol | Bildirim | Yaptım / Bu akşam daha geç / Bugün dinleniyorum | "Daha geç" → saat önerisi → Olur | Item durumu, Suggestion |
| 2.2 | Günü kapat | Akşam bildirimi (isteğe bağlı) | Günü kapat → 1.1 | "Koşuyu yarına al" | DayLog, Item |
| 2.3 | Gün gezinmesi | 1.1 cetvel | Gün → 2.4 | Salt okunur; liste tıklanmaz | Items |
| 2.4 | Günlük geçmiş | 2.3 | ← 2.3 | "Dün kaç bardak su içmişim?" (`query_day`) | DayLog, LogEntry |
| 2.5 | Hayat ritmi | 3.1 / geçmiş | → 3.8 | — | LogEntry, Item (türetilmiş) |
| 2.6 | Etkinlik detayı | 1.1, 1.2 | Yapıldı / Daha geç | "Saati 16:00 yap", "Yarına al", "İptal et" | Item |
| 2.7 | Rutin detayı: Su | 1.1 su kartı, 3.3 | — | "Hedefim 10 bardak olsun", "Bardak 250 ml", "Duraklat", "Son suyu geri al" | Routine, LogEntry |
| 3.1 | Menü | Avatar/ayar | 3.2–3.8, 4.x | — | — |
| 3.2 | Profil (Uyku ve uyanma) | 3.1 | — | "Altıda uyanıyorum", "Hafta sonu çalışmıyorum" | Profile |
| 3.3 | Rutinlerim | 3.1 | Satır → 2.7 | "Her gün diş ipi kullan", "Kahveyi bırak" | Routine |
| 3.4 | Önemli kişiler | 3.1 | Satır → 3.5 | "Deniz benim yakın arkadaşım" | Person |
| 3.5 | Kişi detayı | 3.4 | — | "Her pazar akşamı ara" | Person, Item |
| 3.6 | Hatırlatma yoğunluğu | 3.1 | — | "Sessiz saatler 22:30'da başlasın" | Setting |
| 3.7 | Bildirimler ve odak | 3.1 | — | "Toplantılarda sessiz ol" | Setting |
| 3.8 | Ritmin | 2.5 | — | "Koşu için bunu unut", "Ritmimi öğrenmeyi durdur" | Pattern |
| 4.1 | Veri ve gizlilik | 3.1 | → 4.2, dışa aktar | — | Setting |
| 4.2 | Tüm verileri sil | 4.1 | Sil / Vazgeç | — | Tüm veri |
| 4.3 | Plan ve fiyat | 3.1, 5.1 | Devam et | — | Abonelik |
| 4.4 | Yardım | 3.1 | — | Destek mesajı | — |
| 4.5 | Takvim | 3.1, 5.5 | — | "Kişisel takvimi gizle" | Setting |
| 2.8 | Gün kapanmadı | Sabah, Bugün üstü | Kapat → 2.2; Geç → Bugün | — | DayLog (açık gün) |
| 4.6 | Plan karşılaştırma | 4.3 | Seç → Plan ve fiyat | — | Abonelik |
| 4.7 | Anlama hakkı doldu | Bütçe %100 | Sıraya al / Plus'a geç / Tamam | — | OutboxUtterance |
| 6.3 | Admin: maliyet ve politika | Admin paneli | — | — | Politika yapılandırması |
| 5.1 | Giriş | İlk açılış | → 5.2 | — | User |
| 5.2–5.4 | Karşılama 1–3 | 5.1 | → 5.5 | Çipler ya da kendi cümlen | Profile, Setting |
| 5.5 | İzinler | 5.4 | → 5.6 | — | İzin durumları |
| 5.6 | Boş gün | Yeni kullanıcı, boş gün | → 1.3 | Örnek cümleler | — |
| 5.7 | Anlaşılmadı | Başarısız çıkarım | Not olarak sakla / yeniden | — | Note |
| 5.8 | Çevrimdışı | Bağlantı yok | Bağlanınca kuyruk işlenir | Her cümle | OutboxUtterance |

## 3. Anahtar akışlar

### 3.1 Gün içinde su kaydı
1. Kullanıcı Bugün'de ya da herhangi bir sayfada söyler/yazar: "Bir bardak su içtim."
2. `log_progress` → LogEntry (+200 ml). Bugün sayacı 3 → 4 bardak olur.
3. Su detayında kayıt listesi güncellenir (kaynak: sesle/yazıyla); Günün akışında o saate işaret konur.
4. Yanlışsa "Geri al" ya da "son suyu geri al".
5. Hatırlatma (16:00'dan sonra unutuyorsa) ritme göre tek bildirim: "Su içme vakti geldi mi?" → İçtim / Daha geç / Sonra.

### 3.2 Öneri ve ritim
1. Bugün'de "Önerilen" satır: "Perşembe akşamları genelde koşuyorsun. Yağmur yok, 19°." → Olur / Başka saat söyle.
2. Olur → Item oluşur/zamanlanır; Başka saat söyle → konuşma açılır.
3. Neden görmek için Hayat ritmi → Ritmin. "Koşu için bunu unut" desen siler.

### 3.3 Yoğun gün
1. Gün sonu kapanışında yarın yoğunsa (3 arka arkaya toplantı) taşıma önerisi gelir; kullanıcı "Seçenekleri göster" ya da "Böyle kalsın" der. Hiçbir şey kendiliğinden taşınmaz.

### 3.4 Anlaşılmadı ve çevrimdışı
1. Güven düşükse tek soru; kullanıcı yanıtlamazsa not olarak saklanır.
2. Çevrimdışıyken söylenen cümleler "Anlaşılmayı bekleyenler" listesinde görünür; bağlanınca sırayla işlenir, sonuçlar Konuşma kartı olarak gösterilir.

## 4. Eksikler ve sonraki tasarım işleri
- Konuşma sırasında ses dalgası olmadan "dinliyor" durumu (balon düğmesinin hali).
- Karşılamada ritim öğrenme rızası için kısa ekran.
- Açık tema ve diğer 6 palet için bu sayfaların gözden geçirilmesi.
- Günü kapat için yoğun gün değişkeni ve boş durum.
- Sayaçlı rutinler için kahve ve ilaç varyantları.
