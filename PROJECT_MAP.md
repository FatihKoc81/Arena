# ARENA — Proje Haritası

> İlk harita: 18 Kasım 2026. Kök dizin ve README incelenerek hazırlandı. Alt klasörlerin tüm kaynakları henüz tek tek denetlenmedi; doğrulanmayan görevler tahmin edilmedi.

## Projenin amacı
ARENA Mobile; Firebase kimlik doğrulaması ve Android/Capacitor hedefi olan, kategori merkezli oyun ve bilgi yarışması uygulamasıdır.

## Ana akış
`index.html` → web arayüzü/kategori ana sayfası → oyun modülleri → Firebase ve cihaz özellikleri.
Bu akış, dosya bazında tam bağımlılık incelemesiyle ayrıca doğrulanmalıdır.

## Kök dizindeki önemli dosyalar
- `index.html`: web uygulamasının ana giriş sayfası (GitHub Pages için kökte tutulması README'de belirtiliyor).
- `README.md`: Firebase, giriş akışı, yayınlama ve test notları.
- `CLAUDE.md`, `CLAUDE_TASK.md`: Claude için proje bağlamı ve görev yönergeleri.
- `GEMINI.md`, `GEMINI_ARENA_REVIEW.md`: Gemini yönergeleri ve inceleme notları.
- `ads.js`: reklam entegrasyonu kodu.
- `arcade-eklentisi.js`: oyun/arcade eklentisi.
- `.github/`: GitHub iş akışları ve depo otomasyonu.
- `Arena.apk`: depoda bulunan APK çıktısı; kaynak kod değildir.

## Kimlik ve giriş
- Firebase projesi: `arena-mobile-1453`
- Android applicationId: `com.fatihkoc.arena.mobile`
- Google ve telefon/SMS girişi hedefleniyor.
- Facebook ve e-posta giriş arayüzü kaldırılmış olarak belgelenmiş.

## Derleme ve dağıtım
- GitHub Pages: `index.html` kök dizinde kalmalı.
- Android derleme: GitHub Actions iş akışları mevcut; güncel başarılı APK ve imzalama ayarları ayrıca kontrol edilmeli.

## Test ve açık doğrulamalar
- README'de gerçek Android cihazda kategori kartları ve giriş akışının test edilmesi gerektiği belirtiliyor.
- Firebase sağlayıcıları, yetkili alan adları, SHA-1/SHA-256 ve veritabanı kuralları yayın öncesi doğrulanmalı.

## Harita güncelleme kuralı
Yeni modül/klasör, giriş noktası, servis, API veya derleme adımı eklendiğinde bu dosyayı aynı PR/commit içinde güncelle. Bu harita mevcut kodun tam otomatik bağımlılık grafiği değildir.
