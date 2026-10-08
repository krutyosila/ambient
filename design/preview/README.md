# Web önizleme

- `app.html`: **tıklanabilir prototip.** Solda sayfa listesi ve başlangıç noktaları, ortada telefon (ya da admin) ekranı. Düğmelere, satırlara ve konuşma çubuğuna tıklayınca bağlı sayfaya gider; geri/kapat düğmeleri çalışır; anahtarlar değişir; Bugün'de "Olur" öneriyi plana ekler; İzinler'de "İzin ver" işaretlenir. "Tıklanabilir alanları göster" kutusu bağlantıları kesikli çizgiyle gösterir.
- `index.html`: 50 sayfalık galeri; karta tıklayınca prototipte açılır.
- `screens/`: her sayfanın düz HTML hali (v2 tasarım kaynağı). `nav.js` bağlantıları görünen metne göre kurar; bağlantı haritası her sayfanın içindeki `window.__NAV` değerindedir.
- Bunlar sunucu gerektirmeyen düz HTML dosyalarıdır; gerçek veri ya da yapay zekâ yoktur, yalnız gezinme ve küçük etkileşimler simüle edilir.

## Açma
- **Yerelde:** `app.html` (prototip) ya da `index.html` (galeri) dosyasını tarayıcıda aç.
- **GitHub Pages (otomatik, önerilen):** `.github/workflows/pages.yml` `design/preview` klasörünü site köküne yayınlar. Tek seferlik kurulum: depo → Settings → Pages → Source: **GitHub Actions**. Sonra değişiklik `main`'e (ya da `claude/**` dalına, aşağıdaki nota bak) gönderilince yayınlanır. Adresler: `https://<kullanıcı>.github.io/<depo>/` (galeri) ve `.../app.html` (prototip).
  - **404 görüyorsan:** Pages'i "branch" kaynağıyla `main` dalından yayınlıyorsan `design/preview` orada yoktur (dosyalar çalışma dalındadır). Çözüm: kaynağı GitHub Actions yap ve değişikliği `main`'e birleştir; ya da `github-pages` ortamının "Deployment branches" ayarına bu dalı ekle. Eski prototip için `main`'de `design/life-os-case-study.html` vardır, yeni önizleme için değil.
  - Depo özelse Pages plan şartına bağlıdır; içerik herkese açık olabilir (fiyat önerileri ve yer tutucular var).
- **Kendi sunucunda:** `design/preview` klasörünü olduğu gibi yayınla.

## Notlar
- Yer tutucular: fiyatlar (öneri), diyetisyen adı `[AD SOYAD]`, referans değerleri `[DEĞER]`.
- Galeri Google Fonts'tan Inter'i yükler; çevrimdışıysa sistem yazı tipine düşer.
- Düzenlenebilir sürüm: tuval (özel bağlantı, `README.md`).
