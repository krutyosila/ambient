# Web önizleme

- `app.html`: **tıklanabilir prototip.** Solda sayfa listesi ve başlangıç noktaları, ortada telefon (ya da admin) ekranı. Düğmelere, satırlara ve konuşma çubuğuna tıklayınca bağlı sayfaya gider; geri/kapat düğmeleri çalışır; anahtarlar değişir; Bugün'de "Olur" öneriyi plana ekler; İzinler'de "İzin ver" işaretlenir. "Tıklanabilir alanları göster" kutusu bağlantıları kesikli çizgiyle gösterir.
- `index.html`: 50 sayfalık galeri; karta tıklayınca prototipte açılır.
- `screens/`: her sayfanın düz HTML hali (v2 tasarım kaynağı). `nav.js` bağlantıları görünen metne göre kurar; bağlantı haritası her sayfanın içindeki `window.__NAV` değerindedir.
- Bunlar sunucu gerektirmeyen düz HTML dosyalarıdır; gerçek veri ya da yapay zekâ yoktur, yalnız gezinme ve küçük etkileşimler simüle edilir.

## Açma
- **Yerelde:** `app.html` (prototip) ya da `index.html` (galeri) dosyasını tarayıcıda aç.
- **GitHub Pages (herkese açık olur, dikkat):** Depo → Settings → Pages → Source: "Deploy from a branch", Branch: bu dal, Folder: `/ (root)`. Adres: `https://<kullanıcı>.github.io/<depo>/design/preview/app.html`. Depo özelse Pages planınıza bağlıdır. İçerikte fiyat önerileri ve yer tutucular var; yayına açmadan karar verin.
- **Kendi sunucunda:** `design/preview` klasörünü olduğu gibi yayınla.

## Notlar
- Yer tutucular: fiyatlar (öneri), diyetisyen adı `[AD SOYAD]`, referans değerleri `[DEĞER]`.
- Galeri Google Fonts'tan Inter'i yükler; çevrimdışıysa sistem yazı tipine düşer.
- Düzenlenebilir sürüm: tuval (özel bağlantı, `README.md`).
