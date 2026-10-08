# Ritme göre öneri: geçmişten öğrenme

Sistem kullanıcının geçmişine bakarak günlük ritmini öğrenir ve önerilerini buna göre zamanlar. Bu belge kuralları, gizliliği ve ölçümü tanımlar. Üst ilkeler: `start.md` §1 ve §6, karar `DECISIONS.md` D-013.

## 1. İlkeler
1. **Öneri karar değildir.** Her çıktı "Önerilen" olarak gelir; onay olmadan plan değişmez.
2. **Açıklanabilir.** Her öneri nedenini söyler ("Perşembe akşamları genelde koşuyorsun."). Nedensiz öneri yok.
3. **Unutulabilir.** Kullanıcı Ritmin sayfasında ya da cümleyle "bunu unut" diyebilir. Unutulan desen yeniden önerilmez.
4. **Cihazda.** Ritim hesapları cihazda yapılır; ham kayıtlar ritim için sunucuya gönderilmez.
5. **Baskısız.** Öneri bir hedef ya da eksik değildir. Kaçırılan şey için suçlayıcı öneri yok.
6. **Az ama yerinde.** Günlük öneri tavanı hatırlatma yoğunluğuna bağlıdır (Sakin 3, Dengeli 6, Sık 10; bildirim ve uygulama içi öneriler birlikte sayılır).

## 2. Girdiler
| Sinyal | Kaynak |
|---|---|
| Rutin ve etkinlik tamamlama, atlama, "dinlendim" | `Item`, `Routine` durumları |
| Sayaç kayıtları ve saatleri | `LogEntry` |
| Hafta günü ve saat dağılımı | Her ikisi |
| Boş aralıklar | Plan + takvim (salt okunur içe aktarma) |
| Uyanma ve uyku saati | Profil, ve gözlemlenen ilk/son etkinlik |
| Uyku, adım, antrenman | Sağlık verisi (Faz 2, açık rıza) |

## 3. Desen türleri
| Tür | Örnek | Çıkarım |
|---|---|---|
| `weekday_time` | Perşembe akşamları 18:00 civarı koşu | Aynı gün+saat penceresinde ≥ 4 haftanın 3'ünde |
| `forget_window` | 16:00'dan sonra su unutuluyor | O pencerede kayıt yok, öncesinde düzenli kayıt var |
| `duration` | Okuma 20–30 dk | Süre dağılımının medyan aralığı |
| `weekend_shift` | Hafta sonu uyku 1 saat geç | Hafta içi/sonu ortalama farkı ≥ 45 dk |
| `gap` | Salı 14:00–16:00 boş | Plan ve takvim boşluğu, üç hafta üst üste |

## 4. Eşikler ve güven
- Bir desenin yayına girmesi için en az **3 gözlem** ve **4 haftalık pencere** gerekir. Daha azsa öneri yok; yeni kullanıcı için ilk iki hafta öneriler genel ve sorarak olur (karşılama sorularının cevapları başlangıç ipucu).
- Gözlemler zamanla eskir (yarı ömür yaklaşık 6 hafta). Ritim değişirse (yeni iş, seyahat) desen kendiliğinden zayıflar.
- Güven, kullanıcıya sayı olarak gösterilmez. Dilde yansır: "genelde", "çoğu zaman", "bazen". Düşük güvende öneri sorudur ("Bu akşam koşmak ister misin?"), yüksekte öneridir.
- Hasta, seyahatte ya da "dinleniyorum" durumunda öneri susturulur.

## 5. Öneri üretimi
1. **Kod karar verir.** Desen eşleşmesi, zamanlama ve tavan kontrolü deterministiktir. LLM yalnızca öneri cümlesini sakin bir dille yazar (gerekçe sabit şablonlardan beslenir).
2. Sıra: sessiz saat ve odak modu kontrolü → günlük tavan → aynı öğe için günde 1 kural → çakışma/boşluk kontrolü → öneri.
3. **Öneri türleri:** boş aralığa saat önerisi (Bugün'deki "Önerilen" satır, Kontrol'deki "Daha geç" önerisi), unutulan pencerede tek hatırlatma, uyku ve hafta sonu için baskısız ton ayarı (ör. cumartesi 23:00'te hatırlatmama).
4. **Yanıtlar:** Olur (kabul), Başka saat söyle (yeniden öneri değil, kullanıcı söyler), Sonra, ya da "bir daha önerme" (kalıcı susturma). Reddedilen öneri aynı öğe için 14 gün tekrarlanmaz.

## 6. Kullanıcıya görünürlük
- **Bugün ve Akış:** "Önerilen" satırında tek cümlelik neden.
- **Kontrol ve bildirim:** kısa neden; bildirim her zaman neyi hatırlattığını söyler.
- **Hayat ritmi → Ritmin:** öğrenilenlerin listesi. Her maddede nedeni ve dayandığı pencere. Düzeltmek için söylenir: "Koşu için bunu unut", "Ritmimi öğrenmeyi durdur".
- **Veri ve gizlilik:** "Ritmimi öğren" anahtarı. Kapatılınca desenler durur; mevcut desenler silinir mi saklanır mı sorulur (varsayılan: silinir).

## 7. Gizlilik ve KVKK
- Ritim çıkarımı konuşma ya da davranış verisi üzerinden yapıldığı için **açık rıza** ile açılır (karşılamada kısa anlatım, Veri ve gizlilik'te anahtar).
- Sağlık verisinden gelen desenler özel nitelikli veridir; yalnızca Faz 2'de, veri türü bazında izinle.
- Dışa aktarmada desenler ve öneri geçmişi yer alır; "Tüm verileri sil" bunları da siler.

## 8. Ölçüm (iç; kullanıcıya gösterilmez, skor değildir)
- Öneri kabul oranı (Olur / gösterilen), desen başına.
- "Bir daha önerme" ve "unut" oranı: yüksekse desen ya da ton yanlış.
- Bildirim başına tepki süresi ve sessize alma oranı.
- Hedef: öneri yoğunluğu arttıkça bildirim kapatma oranı artmamalı.

## 9. Test
- Simüle geçmişlerle desen çıkarımı birim testleri (haftalık düzenli, düzensiz, seyahat sonrası kayma).
- Eşik altı verilerde öneri üretilmediğini doğrulayan testler.
- Tavan, sessiz saat, "dinleniyorum" ve "unut" kurallarını doğrulayan testler.
- Gerekçe cümlelerinin şablon testleri (sayı uydurmaz, "genelde" ile "her zaman" ayrımı).

## 10. Açık sorular
- Ritmin için gerekli en düşük geçmiş süresi 4 hafta mı, yoksa sorarak daha erken mi başlayalım? (Varsayım: sorarak başla, 4 haftada öner.)
- Ritim senkronu açık olan kullanıcılarda cihazlar arası paylaşılsın mı? (Varsayım: yalnızca özet, şifreli.)
- Hafta sonu ve tatil günleri için ayrı desenler (varsayım: evet, `weekend_shift` ayrı tutulur).

## 11. Üyeliğe göre ritim seviyeleri (D-019)
Kullanıcı seviyeyi kendi katmanının izin verdiği ölçüde seçer (Ritmin sayfası, Veri ve gizlilik). Hesap cihazda yapıldığı için seviyeler sunucu maliyeti doğurmaz; fark desen sayısı, öneri tavanı ve sinyal çeşididir.

| Seviye | Katman | Desenler | Öneri tavanı (günlük) | Ek |
|---|---|---|---|---|
| Kapalı | Hepsi | Yok | 0 | Hiçbir öğrenme yapılmaz, mevcut desenler silinir (sorarak) |
| Temel | Normal | `weekday_time`, `forget_window` | 3 | Gerekçe cümlesi şablon |
| Tam | Plus | Beş desenin hepsi | Yoğunluğa göre 6–10 | Ritmin sayfası, hafta sonu ve uyku |
| Gelişmiş | Pro | Tam + çapraz sinyal (takvim yoğunluğu ↔ su/koşu, uyku ↔ koşu), haftalık plan önerisi | Yoğunluğa göre | Faz 2'de sağlık verisi; isteğe bağlı kişisel açıklama (tek Haiku çağrısı) |

Düşürme: üst seviyenin desenleri silinmez, pasifleşir; yükseltince yeniden etkinleşir. Tavan her zaman hatırlatma yoğunluğu ayarıyla birlikte sınırlanır (en düşük olan geçerli).

## 12. Su planı: litreye göre yayma ve arka planda düzenleme (D-047)
Su, ritim motorunun ilk ve en sık kullanılan "sayaç planı"dır. Tamamı **kod ve cihazda**, LLM yok ($0); her katmanda çalışır (Normal dahil).

1. **Girdi:** günlük hedef (litre; ortalama ya da kullanıcının düzelttiği, `docs/PERSONALIZATION.md`), uyanık saat aralığı (uyku saatinden ya da son 14 günün ilk/son kaydından; yoksa 08:00–22:00), birim (bardak = 200 ml ya da kullanıcının söylediği).
2. **Dilimler:** hedef ÷ birim = dilim sayısı (1,6 L → 8). Kalan hedef, kalan uyanık saate eşit aralıklarla dağıtılır. Takvimdeki toplantı ve sessiz saatler dilimi kaydırır, bastırmaz.
3. **Yeniden dağıtım (arka plan, her kayıtta ve her yanıtta):**
   - Erken içildi → sonraki dilimler seyrekleşir ya da düşer. Geç kaldı → kalan dilimler sıkışır, ama bir dilimde en fazla 2 birim ve bir saatte en fazla 500 ml önerilir.
   - "Daha geç" / "Sonra" → dilim 60–90 dk kayar; üst üste 3 kez ertelenirse o saat penceresi öğrenilir (ritim deseni `forget_window`).
   - Yatışa 2 saat kala yeni dilim eklenmez; gün sonunda eksik kalan **telafi edilmez**, ertesi gün sıfırdan başlar.
   - Kullanıcı "bugün 3 litre içeceğim" ya da "hedefim 10 bardak" derse plan o gün/kalıcı yeniden kurulur.
4. **Bildirim:** yalnız sıradaki dilimde, neyi hatırlattığını söyler ("Su içme vakti geldi mi?"), D-005 tavanları ve sessiz saatler geçerlidir; yanıt tek dokunuş (İçtim / Daha geç / Sonra). İçtim = `source=answer` kaydı.
5. **Görünürlük:** Bugün'de yalnız "Sıradaki 16:00"; Su detayında "Günün dağılımı" (yapılan dolu, kalan kesikli ikincil renk). "Nasıl hesaplandı?" yanıtı sabit şablondur, skor ve yüzde yok.
6. **Test:** yeniden dağıtım deterministik birim testleri (erken/geç/atlanan gün, sıfır kayıt, gece yarısı sınırı, saat dilimi/yaz saati), üst sınır testi, "telafi" ve yargı dilini doğrulayan metin testi.
