# Kişisel bilgiler ve kişiselleştirme

Durum: öneri (`DECISIONS.md` D-029). Kullanıcıdan doğum tarihi, cinsiyet, boy ve kilo gibi bilgileri **isteğe bağlı** alır, planlamayı buna göre ayarlarız. Kayıt yalnız söz ve yazıyla girer (D-012). Bu bilgilerin bir kısmı sağlık verisidir; KVKK'da özel nitelikli kişisel veri sayılır, bu yüzden **açık rıza** gerekir.

## 1. İlkeler
1. **İsteğe bağlı ve atlanabilir.** Hiçbir alan zorunlu değil; atlamak hiçbir özelliği kapatmaz (öneriler daha genel olur).
2. **Konuşarak girilir:** "14 Mart 1992 doğumluyum", "Kilom 74", "Boyum 178". Form ya da kaydırıcı yok.
3. **Hedef koymaz, yargılamaz.** Kilo için hedef, skor, VKİ, "fazla/az" dili, kıyas yok. Kilo bir sayı ve zaman serisidir; hedefi yalnız kullanıcı kendisi söylerse tutarız.
4. **Cihazda.** Bu bilgiler cihazda saklanır; senkron açıksa şifreli. Yapay zekâ sağlayıcısına ham gönderilmez, yalnız türetilmiş küçük alanlar gider (ör. "yaş grubu 30–39", "su hedefi 10 bardak").
5. **Tıbbi tavsiye değil.** Önerilen su, uyku ve hareket değerleri genel başlangıç noktalarıdır; kullanıcı her zaman değiştirebilir; sağlık sorunu varsa uzmana yönlendirilir.
6. **Hassasiyet koruması:** kilo sorusu her an kapatılabilir; kilo verme ya da alma hedefi, kalori ve ekstrem plan önerilmez; 18 yaş altı kullanıcıya boy ve kilo sorulmaz.

## 2. Alanlar
| Alan | Girdi | Saklama | Kullanım |
|---|---|---|---|
| Doğum tarihi | Söyleyerek, bir kez | Tarih (yaş türetilir); isteğe bağlı yalnız yıl | Yaş grubu, genel uyku aralığı, kendi doğum gününde sakin selam, 18 yaş altı korumaları |
| Cinsiyet | Söyleyerek: kadın, erkek, belirtmek istemiyorum, ya da kendi sözüyle | Seçilen değer; yazı ile verilen serbest metin saklanmaz, yalnız eşlenen seçenek | Yalnız genel aralıkların kaynağı cinsiyete göre ayırıyorsa; belirtmezse nötr aralık. Sistem hiçbir zaman tahmin etmez. Metinlerde varsayılan hitap tarafsızdır |
| Boy | Söyleyerek, bir kez (yetişkinde değişmez) | Ölçüm kaydı | Su ve hareket başlangıç önerileri |
| Kilo | Söyleyerek, düzenli | **Ölçüm kayıtları** (zaman damgalı, yalnız eklenir) | Su hedefi başlangıcı, hareket başlangıcı; nötr "son güncelleme" |
| (İsteğe bağlı) Hareket düzeyi | Söyleyerek | Seçenek | Başlangıç önerileri |

## 3. Nasıl kullanılır (kural tabanlı, LLM yok)
Tüm hesaplar cihazdaki deterministik kurallardır (**maliyeti $0**, `docs/COST-POLICY.md`). Aşağıdaki aralıklar **uzman gözden geçirmesinden önce yayına girmez** (Q22).

| Girdi | Çıktı |
|---|---|
| Kilo (+ boy, yaş grubu) | Su hedefi başlangıcı. Yaygın bir genel kural kilo başına günde yaklaşık 30–35 ml'dir; örnek: 70 kg → yaklaşık 2,1–2,5 L ≈ 10–12 bardak (200 ml). Sistem "Hedefini 10 bardak yapayım mı?" diye **önerir**; kullanıcı kendi hedefini söyleyebilir (D-004) |
| Yaş grubu | Genel uyku aralığı önerisi (yetişkinler için yaygın 7–9 saat); uyku saatine göre "Uykuya hazırlık" önerisi |
| Kilo trendi | Yalnız "Son güncelleme 3 hafta önce: 74 kg" gibi nötr bilgi. Grafik, hedef çizgisi ve yorum yok (kullanıcı isterse özel ekran, Faz 2) |
| Hareket düzeyi | Başlangıç yoğunluğu: "Haftada 3 gün, 20 dakikayla başlayalım" gibi yalnız kullanıcı isterse |
| Doğum tarihi | Kendi doğum gününde tek sakin cümle |

## 4. Ne sıklıkla sorulur
- **İlk kez:** Karşılamada isteğe bağlı bir adım ("Seni biraz tanıyayım"), atlanabilir. Atlanırsa 2 hafta sonra bir kez daha sorulur, sonra bir daha sorulmaz (Profil'den söylenebilir).
- **Kilo güncellemesi ("ara ara"):** varsayılan **4 haftada bir**, kullanıcı sıklığı söyleyerek değiştirir: hiç / ayda bir / 3 ayda bir. Soru Bugün'de uygulama içi bir kart olarak gelir (bildirim varsayılan değil). Günde en fazla bir kişisel soru; Dinleniyorum durumunda ve sessiz saatlerde sorulmaz; "Daha sonra" 1 hafta erteler; "Bir daha sorma" kalıcı kapatır.
- **Diğer alanlar:** boy ve doğum tarihi yalnız bir kez. Yaşam değişikliği (ör. uyku saati değişimi) ayrı sorulmaz, ritimden öğrenilir.
- Soru metni baskısız ve kısadır: "Kilonu güncellemek ister misin? Son kayıt 4 hafta önce: 74 kg. Yalnız planlarını ayarlamak için."

## 5. Rıza, KVKK ve güvenlik
- **Ayrı açık rıza:** kilo ve boy için Karşılama 5.5'te kısa, anlaşılır ve geri çekilebilir rıza. Doğum tarihi ve cinsiyet için rıza metni aynı sayfada ama ayrı satır.
- **Geri çekme:** Veri ve gizlilik'te "Kişisel bilgilerimi planlamada kullan" anahtarı; kapatılınca kayıtlar silinir mi saklanır mı sorulur (varsayılan: saklanır, kullanılmaz).
- **Dışa aktarma ve silme** bu verileri de kapsar.
- **Yaş koruması:** doğum tarihine göre 18 yaş altı için boy ve kilo istenmez, kilo trendi yoktur, öneriler nötr. 13 yaş altı kullanım bu sürümde desteklenmez (Q24: yaş eşiği hukuk görüşüyle).
- **LLM'e gidenler:** yalnız türetilmiş alanlar; kimlik ve ham ölçüm gitmez (`DATA-MODEL.md` §9).
- **Hassasiyet:** yeme bozukluğu ya da tıbbi risk belirtisi sinyalinde (ör. kullanıcı aşırı kısıtlamadan söz ederse) kilo isteği durdurulur, nazik bir yönlendirme gösterilir; ayrıntı uzman girdisiyle yazılacak (Q22).

## 6. Ekranlar (tuval)
5.5 Seni tanıyayım (karşılama), 3.2 Profil (yeni alanlar), 2.9 Kilo güncelleme sorusu, 4.1 Veri ve gizlilik (kişisel bilgi anahtarı).

## 7. Katmanlar
Temel kişiselleştirme **her katmanda** (sağlıkla ilgili bir veriyi ücret duvarının arkasına koymayız). Pro'da Faz 2'de sağlık verisi (uyku, adım, antrenman) ve çapraz sinyaller eklenir.

## 8. Test
- Birim: su hedefi hesabı sınır değerleri (çok düşük/yüksek kilo, eksik veri), yaş grubu geçişleri.
- Rıza: rıza yokken hiçbir kayıt kullanılmaz; geri çekince kullanım durur.
- Soru ritmi: sıklık, erteleme, sessiz saat, Dinleniyorum ve günlük tavan.
- 18 yaş altı: boy/kilo sorusu ve kilo trendi hiç çıkmaz.
- Metin: "fazla", "az", "hedef", "VKİ" gibi sözcüklerin kullanıcıya gösterilmediğini doğrulayan test.
