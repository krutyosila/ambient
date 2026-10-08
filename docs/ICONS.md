# İkon kütüphanesi

45 iki tonlu çizgi ikon. SVG sprite: `design/icons/ambient-icons.svg` (`<use href="#ambient-su">`). Görsel referans: tuvaldeki 6.1 İkon kütüphanesi.

## Teknik kural
- 24×24 ızgara, çizgi 1,6, uçlar ve köşeler yuvarlak, dolgu yok.
- İki ton: ana çizgi `currentColor` (metin rengi), ikincil çizgi `var(--icon-accent)` (vurgu rengi, varsayılan `#8fbcff`).
- Boyutlar: 20, 24, 32 px; 44 px kutu içinde 24 px ikon.
- Emoji ya da başka ikon seti karıştırılmaz.

## Seçim kuralı (kullanıcı ikon seçmez)
1. Yapay zekâ her öğe, rutin ve kayıt için araç çağrısında `iconKey` döndürür.
2. Eşleşme tablodaki anahtar sözcüklerle yapılır; tam eşleşme yoksa anlamca en yakın ikon seçilir.
3. Hiçbiri uymazsa `genel` kullanılır ve istek "eksik ikon" olarak kaydedilir (admin paneli, İçerik modülü).
4. Kullanıcı yanlış bulursa "ikonu kitap yap" der (`set_icon`); hafıza bunu hatırlar.
5. `iconKey` yalnızca bu listedeki anahtarlardan biri olabilir; şema doğrulaması bunu zorunlu kılar.

## Liste
| Anahtar | Ad | Anahtar sözcükler |
|---|---|---|
| `su` | Su | su, damla, litre |
| `bardak` | Bardak | bardak, şişe, yudum |
| `kahve` | Kahve | kahve, espresso, latte |
| `cay` | Çay | çay, bitki çayı |
| `yemek` | Yemek | kahvaltı, öğle, akşam |
| `ilac` | İlaç | ilaç, vitamin, takviye |
| `kosu` | Koşu | koşu, jog |
| `yuruyus` | Yürüyüş | yürüyüş, adım, gezinti |
| `spor` | Spor | spor, ağırlık, gym |
| `yoga` | Yoga | yoga, esneme, pilates |
| `bisiklet` | Bisiklet | bisiklet, pedal |
| `yuzme` | Yüzme | yüzme, havuz |
| `kitap` | Kitap | kitap, okuma |
| `odak` | Odak | odak, derin çalışma |
| `not` | Not | not, fikir |
| `meditasyon` | Meditasyon | meditasyon, nefes |
| `muzik` | Müzik | müzik, enstrüman |
| `gunluk` | Günlük | günlük, yazı yazma |
| `uyku` | Uyku | uyku, yatma |
| `uyanma` | Uyanma | uyanma, sabah |
| `dus` | Duş | duş, bakım |
| `dis` | Diş | diş, fırçalama |
| `toplanti` | Toplantı | toplantı, görüşme |
| `telefon` | Telefon | arama, telefon |
| `eposta` | E-posta | e-posta, mektup |
| `bilgisayar` | Bilgisayar | iş, proje, kod |
| `temizlik` | Temizlik | temizlik, süpürme |
| `camasir` | Çamaşır | çamaşır, bulaşık |
| `alisveris` | Alışveriş | alışveriş, market |
| `bitki` | Bitki | bitki, çiçek sulama |
| `evcil` | Evcil hayvan | köpek, kedi, mama |
| `fatura` | Fatura | fatura, ödeme, bütçe |
| `kisi` | Kişi | kişi, arkadaş |
| `aile` | Aile ve ev | aile, anne, baba, ev |
| `kutlama` | Kutlama | doğum günü, hediye |
| `arac` | Araç | araba, yol, servis |
| `ucus` | Uçuş | uçuş, seyahat |
| `doktor` | Doktor | doktor, randevu, sağlık |
| `kontrol` | Kontrol | kontrol, liste |
| `mola` | Mola | mola, dinlenme |
| `genel` | Genel | eşleşme yoksa |
| `zaman` | Zaman | alarm, zamanlayıcı |
| `konum` | Konum | mekân, işten çıkınca |
| `ders` | Ders | ders, sınav, okul |
| `mesaj` | Mesaj | mesaj, yazış, yanıtla |

## Yeni ikon ekleme süreci
1. "Eksik ikon" kayıtlarını gözden geçir; en sık istenenleri seç.
2. 24 ızgarada, aynı çizgi kalınlığında iki tonlu çiz; tuvaldeki kütüphane sayfasına ekle.
3. `design/icons/ambient-icons.svg` dosyasına `<symbol id="ambient-<anahtar>">` olarak ekle.
4. Bu tabloya anahtar, ad ve anahtar sözcükleri ekle. `packages/shared` içindeki `iconKey` enum'unu güncelle.
5. Değerlendirme setine yeni ikonu tetikleyen cümleler ekle.

## Olası eksikler (öncelik sırasıyla, kanıt toplanınca)
Güneş/hava durumu, sigara/alkol bırakma gibi hassas konular (ele alınış biçimi ayrıca karara bağlanır), para ve birikim, yazı/blog, oyun, hayvan bakımı çeşitleri, sanat/hobi, dua/ibadet. Bunlar için şimdilik `genel` kullanılır.
