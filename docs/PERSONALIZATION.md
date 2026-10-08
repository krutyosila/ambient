# Kişisel bilgiler ve kişiselleştirme

Durum: kabul (`DECISIONS.md` D-029…D-032). Kullanıcıdan doğum tarihi, cinsiyet, boy ve kilo alınır; planlama bunlara göre ayarlanır. Bu bilgilerin bir kısmı sağlık verisidir; KVKK'da özel nitelikli kişisel veri sayılır, bu yüzden **açık rıza** gerekir.

## 1. İlkeler
1. **İsteğe bağlı ve atlanabilir.** Hiçbir alan zorunlu değil; atlamak hiçbir özelliği kapatmaz (öneriler daha genel olur).
2. **Elle girilir, yazıyla ya da sözle de anlatılabilir** (D-030). Bu dört alan için formda alanlar vardır (tarih, seçim, sayı); aynı bilgiyi konuşma çubuğuna **yazarak ya da söyleyerek** de verebilir ("14 Mart 1992 doğumluyum", "kilom 74", "biraz kilo aldım sanırım"). Her iki yolda da sistem ne istendiğini anlar. Bu, "kayıt yalnız söz/yazıyla girer" kuralının (D-012) **tek istisnasıdır**; diğer kayıtlarda (etkinlik, rutin, su) form yoktur.
3. **Hedef koymaz, yargılamaz.** Kilo için hedef, skor, VKİ, "fazla/az" dili, kıyas yok. Hedefi yalnız kullanıcı kendisi söylerse tutarız.
4. **Cihazda.** Bu bilgiler cihazda saklanır; senkron açıksa şifreli. Yapay zekâ sağlayıcısına ham gönderilmez, yalnız türetilmiş küçük alanlar gider (ör. "yaş grubu 30–39", "su hedefi 10 bardak").
5. **Önce ortalama, sonra kişiye göre.** Su ve uyku önerileri başlangıçta bir **insan ortalamasına** göre sunulur; kullanıcı "benim için uygun olan şu" diyerek düzeltir ve düzeltmesi her zaman önceliklidir (§3).
6. **Tıbbi tavsiye değil.** Değerler genel başlangıç noktalarıdır; sağlık sorunu varsa uzmana yönlendirilir.
7. **Hassasiyet koruması:** kilo sorusu her an kapatılabilir; kilo verme/alma hedefi, kalori ve ekstrem plan önerilmez; 18 yaş altına boy ve kilo sorulmaz.

## 2. Alanlar
| Alan | Giriş | Saklama | Kullanım |
|---|---|---|---|
| Doğum tarihi | Elle (gün/ay/yıl) ya da yazı/söz, bir kez | Tarih (yaş türetilir) | Yaş grubu, ortalama aralıkların seçimi, kendi doğum gününde sakin selam, 18 yaş altı korumaları |
| Cinsiyet | Seçim: kadın, erkek, belirtmek istemiyorum, diğer (ya da yazı/söz) | Seçilen değer | Yalnız referans tablosu cinsiyete göre ayırıyorsa; belirtmezse nötr aralık. Sistem hiçbir zaman tahmin etmez. Hitap tarafsızdır |
| Boy | Elle (cm) ya da yazı/söz, bir kez | Ölçüm kaydı | Referans bandının seçimi |
| Kilo | Elle (kg) **ya da tahmini çizgi** (§4) | Ölçüm kayıtları (zaman damgalı, yalnız eklenir) | Referans bandının seçimi, nötr "son güncelleme" |
| (İsteğe bağlı) Hareket düzeyi | Seçim | Seçenek | Başlangıç önerileri |

## 3. Ortalamalar ve diyetisyen
**Başlangıç değeri bir insan ortalamasıdır.** Su ve uyku için varsayılanlar, kurum içi **diyetisyen** tarafından yönetilen **referans tablolarından** gelir (admin panelinde "Referans aralıkları", tasarım 6.4). Tablo **yaş grubu, cinsiyet ve kilo bandına göre** ayrı ortalama değerler tutar (kullanıcının girdiği bilgiye göre ilgili satır seçilir; bilgi eksikse bir üst satıra düşülür). Bilgi eksikse genel yetişkin ortalaması kullanılır.

| Girdi | Başlangıç davranışı |
|---|---|
| Hiç bilgi yok | Genel yetişkin ortalaması. Yer tutucu: su yaklaşık 8 bardak (200 ml), uyku 7–9 saat (hedef 8). **Diyetisyen onaylayana dek yer tutucudur** |
| Bilgi var | Tablodaki ilgili bant. Kullanıcıya "Ortalama bir yetişkine göre başladım; sana uygun olan başka bir değer varsa söyle" gibi önerilir |
| Kullanıcı düzeltti | "Benim için 10 bardak uygun": kullanıcı değeri **kalıcı olarak** geçerlidir; tablo değişse bile bu kullanıcıya dokunulmaz |

- Sistem kullanıcıyı ortalamaya zorlamaz; ortalamadan sapmayı yargılamaz.
- Referans tablosu güncellenirse, **kendi değerini girmemiş** kullanıcılar için "Ortalamayı güncelledim" sakin bir bilgi olarak gösterilir.
- Tablolar sürümlüdür (yürürlük tarihi, değişiklik notu, denetim kaydı). Kaynak/atıf bilgisi tabloda tutulur.

**Diyetisyen danışman (D-034).** Yayına girmeden önce tabloları hazırlar ve onaylar. Yayın süresince **kendisine özel alandan** (admin'de "Diyetisyen alanı", tasarım 6.5) yalnız şunlara erişir:
- **Raporlar (toplu, anonim; neden gruplar?):** referans tablosu yaş, cinsiyet ve kilo bantlarına göredir; bir bandı güncellemek için o bandın kullanıcılarının toplu davranışı görülmelidir (ör. "18–64 yaş kadınlarda su hedefi dağılımı"). En az 50 kullanıcılık eşik, küçük gruplarda sayıdan bir kişinin tanınmasını (yeniden kimliklendirme) önler; bu yüzden küçük gruplar gizlenir ya da üst bantla birleştirilir. Danışman ekipten biri olsa da veri en aza indirme ve en az yetki ilkesi geçerlidir. İçerik: kullanıcıların kendi su/uyku hedeflerinin dağılımı ve referanstan sapması, öneriye "bunu unut" oranı, yardım ve geri bildirim temaları. Kimlik, kilo, doğum tarihi görünmez; en az 50 kullanıcılık gruplar gösterilir (Q27).
- **Referans aralıkları:** taslak → danışman onayı → etki önizlemesi → yayın. Tek seferde %15'ten büyük değişiklik kurucu onayı ister; her yayın geri alınabilir.
- Başka admin modüllerine erişimi yoktur. Danışman **ekipten biridir**, ayrı ücret yoktur; yine de **en az yetki** ilkesiyle yalnız bu alana erişir.
- **Sözleşme ve metin:** sözleşmede ve Yardım'da "Öneri aralıkları [AD SOYAD] diyetisyen ile düşünülmüştür; tıbbi tavsiye değildir" ifadesi yer alır. İfade yalnız kişinin yazılı onayıyla ve unvanı doğru kullanılarak yayınlanır (Q27).
- Hareket başlangıcı ("Haftada 3 gün, 20 dakikayla başlayalım") yalnız kullanıcı isterse ve tabloya göre önerilir.

## 4. Kilo: elle girilen sayı ya da tahmini çizgi
Kullanıcı kilosunu iki biçimde verebilir:
1. **Kesin sayı:** "74 kg". Çizgide dolu nokta.
2. **Tahmini değişim**, kesin sayıyı bilmiyorsa: *aynı kaldı · biraz aldım · biraz verdim · çok aldım · çok verdim · bilmiyorum*. Yazı/söz de olur: "bilmiyorum, kilo aldım sanırım", "biraz kilo verdim".
   - Sistem bunu önceki kayda göre **tahmini** bir nokta olarak işler (biraz ≈ ±2 kg, çok ≈ ±5 kg, kesin değerlerle değiştirilebilir; "bilmiyorum" bir nokta eklemez, yalnız "güncelleme atlandı" işaretler).
   - Tahmini noktalar çizgide **kesikli** gösterilir; kesin sayı girilince tahminler üzerine yazılmaz, sıralı kalır.

**Kilo çizgisi** (tasarım 3.10): zaman içinde nötr bir çizgi; hedef çizgisi, renk yargısı ve yorum yok. Ölçek sayı ve tarih, "arttı/azaldı" yerine yalnız değerler.

## 5. Ne sıklıkla sorulur
- **İlk kez:** Karşılamada isteğe bağlı bir adım ("Seni biraz tanıyayım"), atlanabilir. Atlanırsa 2 hafta sonra bir kez daha sorulur, sonra bir daha sorulmaz (Profil'den girilir).
- **Kilo güncellemesi: 6 ayda bir** (D-031). Kullanıcı sıklığı değiştirebilir: hiç / 3 ayda bir / 6 ayda bir. Soru Bugün'de uygulama içi kart olarak gelir (bildirim yok). Günde en fazla bir kişisel soru; Dinleniyorum ve sessiz saatte sorulmaz; "Daha sonra" 1 ay erteler; "Bir daha sorma" kalıcı kapatır.
- **Diğer alanlar:** boy ve doğum tarihi yalnız bir kez.
- Soru metni baskısız ve kısadır: "Kilonu güncellemek ister misin? Son kayıt 6 ay önce. Yalnızca önerilerimi ayarlamak için."

## 6. Rıza, KVKK ve güvenlik
- **Ayrı açık rıza:** kilo ve boy için Karşılama 5.5'te kısa, anlaşılır ve geri çekilebilir rıza. Doğum tarihi ve cinsiyet için aynı sayfada ayrı satır.
- **Geri çekme:** Veri ve gizlilik'te "Kişisel bilgilerimi planlamada kullan" anahtarı; kapatılınca kayıtlar silinir mi saklanır mı sorulur (varsayılan: saklanır, kullanılmaz).
- **Dışa aktarma ve silme** bu verileri de kapsar.
- **Yaş koruması (Q24):** 18 yaş altı kullanıcıya **boy, kilo ve cinsiyet sorulmaz**, kilo çizgisi yoktur; su ve uyku önerisi yalnız **yaşa göre ortalama** ile verilir (tabloda 14–17 bandı). Gerekçe: gelişim çağında kilo takibi hassastır (yeme bozukluğu riski) ve çocukların kişisel/sağlık verisi için veli rızası ve KVKK kuralları ayrıca gerekir. **13 yaş altı kullanamaz.** 18 yaş altı kullanıcı dilerse su, uyku vb. hedeflerini kendisi girebilir (kendi programı). Karar D-037; hukuki teyit yayın öncesi hazırlıkta yapılır.
- **LLM'e gidenler:** yalnız türetilmiş alanlar; kimlik ve ham ölçüm gitmez (`DATA-MODEL.md` §9).
- **Hassasiyet:** yeme bozukluğu ya da tıbbi risk belirtisi sinyalinde kilo isteği durdurulur, nazik bir yönlendirme gösterilir; metin diyetisyenle yazılır.

## 7. Ekranlar (tuval)
5.5 Seni tanıyayım (elle ya da yazıyla), 3.2 Profil (satırlara dokununca düzenleme), 3.9 Kişisel bilgilerim (elle giriş), 3.10 Kilo çizgisi, 2.9 Kilo güncelleme sorusu, 4.1 Veri ve gizlilik (anahtar), 6.4 Admin: Referans aralıkları, 6.5 Admin: Diyetisyen alanı (raporlar).

## 8. Katmanlar
Kişiselleştirme **her katmanda** (sağlıkla ilgili bir veriyi ücret duvarının arkasına koymayız). Pro'da Faz 2'de sağlık verisi (uyku, adım, antrenman) eklenir.

## 9. Maliyet
Kurallar deterministik ve cihazdadır: LLM maliyeti $0. Diyetisyen ekipten biridir, ek maliyet yoktur.

## 10. Test
- Birim: referans bandı seçimi (eksik veri, bant sınırları), kullanıcı değerinin tablodan öncelikli olması, tablo güncellemesinin kullanıcı değerine dokunmaması.
- Kilo: kesin sayı, tahmini değişim, "bilmiyorum", yazı ile verme ("biraz kilo aldım") doğru işleniyor; tahmini noktalar kesikli.
- Rıza: rıza yokken hiçbir kayıt kullanılmaz; geri çekince kullanım durur.
- Soru ritmi: 6 aylık sıklık, erteleme, sessiz saat, Dinleniyorum, günlük tavan.
- 18 yaş altı: boy/kilo sorusu ve kilo çizgisi hiç çıkmaz.
- Metin: "fazla", "az", "hedef", "VKİ" gibi sözcüklerin kullanıcıya gösterilmediğini doğrulayan test.
