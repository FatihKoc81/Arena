# ARENA Mobile – yeni proje kaynakları

Bu paket, ARENA01 kaynak arşivindeki web oyun dosyalarının yeni Firebase projesine uyarlanmış çalışma kopyasıdır.

## Yeni kimlik
- Firebase: `arena-mobile-1453`
- Android applicationId: `com.fatihkoc.arena.mobile`
- Capacitor appName: `ARENA`
- Web Firebase App ID: `1:869287234944:web:5a88e33bace461457ac565`

## Giriş akışı
- Google ile giriş
- Telefon numarası + SMS doğrulaması
- Kullanıcı adı, kimlik doğrulaması tamamlandıktan sonra seçilir
- Facebook ve e-posta giriş arayüzü kaldırılmıştır

## Önemli kurulum adımları (henüz tamamlanmadı)
1. Firebase Authentication içinde Google ve Phone sağlayıcılarını etkinleştirin.
2. Firebase Authentication > Settings > Authorized domains bölümüne `fatihkoc81.github.io` alan adını ekleyin.
3. Android için yeni imza anahtarını oluşturun; SHA-1 ve SHA-256 parmak izlerini Firebase Android uygulamasına ekleyin.
4. SHA-1 eklendikten sonra Firebase'den güncel `google-services.json` dosyasını indirin. Şu anki dosyada Web OAuth istemcisi bulunur; Android OAuth istemcisi SHA-1 eklenmeden oluşmaz.
5. GitHub Actions Android derlemesi için yeni keystore ve secret'ları kurup derlemeyi test edin.
6. Realtime Database kurallarını yayımlamadan önce `database_rules.json` dosyasını gözden geçirin.

## GitHub Pages
Bu arşiv ZIP olarak GitHub'a doğrudan yüklenmez; ZIP'in içindeki dosyalar kök dizine çıkarılmalıdır. Depodaki `index.html` kökte kalmalıdır. Eski dosyaları silmeden önce yeni kaynakları ayrı bir commit/branch üzerinde doğrulayın.

## Güvenlik
Eski APK ve eski şifreli imza anahtarı bu pakete dahil edilmemiştir. Eski imza anahtarı yeni uygulama için kullanılmamalıdır. Firebase istemci yapılandırması web uygulamalarında herkese açık istemci ayarıdır; güvenlik veritabanı kurallarıyla sağlanır.

## Test durumu
Bu paket kaynak kodu güncellemesidir; Android APK derlemesi ve gerçek Google/SMS giriş testi yapılmış değildir. SMS doğrulaması Firebase sağlayıcısının etkin olmasına, reCAPTCHA ve kota/ülke ayarlarına bağlıdır.


## 7 Kasım 2026 - Kategori ana sayfası güncellemesi

- Ana ekran kategori merkezli olarak yenilendi: Bilgi, Kelime, Masa, Mantık, Bulmaca, Renk ve Sıralama.
- Kategoriye dokunulduğunda o kategorinin oyun listesi açılır; geri düğmesi ana kategori ekranına döner.
- Mevcut beş oyunun mevcut butonları ve click handler'ları korunur; Milyoner, Passaparola, Kelime Oyunu, İşlem Oyunu ve Rotasyon ilgili kategorilerde açılır.
- Henüz geliştirilmemiş oyunlar açıkça “Yakında eklenecek” olarak gösterilir; çalışır oyun gibi sunulmaz.
- Ana sayfada profil/ödül/görev/lig/arkadaş alanları için görsel yer tutucular bulunur. Bunlar henüz gerçek hesap veya Firebase verisine bağlanmış özellikler değildir.
- Service worker ve menu.js sürüm numaraları yenilendi.

**Test durumu:** JavaScript sözdizimi `node --check` ile kontrol edildi. Gerçek Android cihazda görünüm ve mevcut beş oyunun kategori kartlarından açılması henüz kullanıcı cihazında test edilmelidir. Bu ZIP tek başına APK değildir. GitHub'a yüklemeden önce önceki Firebase giriş ve imzalama yapılandırmaları ayrıca doğrulanmalıdır.
