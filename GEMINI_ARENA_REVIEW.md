# ARENA — Gemini bağımsız kod incelemesi

Bu dosya Gemini'ye verilecek inceleme görevidir. Kaynak kodun tek doğruluk kaynağı GitHub'daki `main` dalıdır.

## Çalışma düzeni
1. ChatGPT değişiklikleri hazırlar ve GitHub'a kaydeder.
2. Gemini bağımsız inceleme yapar; mevcut görevi kendi başına yeniden yazmaz.
3. Gemini bulguları dosya/satır, önem seviyesi, tekrar üretme adımı ve önerilen düzeltmeyle raporlar.
4. ChatGPT bulguları doğrular, gerekli düzeltmeleri yapar.
5. GitHub Actions sözdizimi/derleme kontrolleri geçmeden APK hazır veya test edilmiş sayılmaz.
6. Gerçek cihaz testi kullanıcı tarafından yapılır. Ekran görüntüsü/video ve hata raporu ortak kanıttır.
7. Kimlik bilgileri, imzalama anahtarları, Firebase dosyaları ve reklam/ödeme ayarları değiştirilmez.

## Gemini görevi — Okey / 101 ıstaka ve oyun akışı

İncelenecek dosyalar:
- `masa.js`
- `masa-premium.css`
- `index.html`
- `.github/workflows/android.yml`
- `.github/workflows/validate-games.yml`

Son değişikliklerde Okey ve 101 için ahşap görünümlü ıstaka, taş seçimi ve Pointer Events ile sürükleyerek sıralama eklendi.

### Kontrol listesi
- Taşlara dokunma tek seçim yapıyor; çift seçim veya kaybolan seçim oluşmuyor.
- Taşı sürükleyip başka taşın üzerine bırakınca sıra doğru değişiyor.
- Parmağı ıstaka dışına çıkarıp bırakmak takılı sürükleme durumu oluşturmuyor.
- Pointer cancel / Android dokunmatik davranışı güvenli.
- Okey başlangıç eli 15 taş, 101 başlangıç eli 22 taş; taş sayıları ve buton akışı bozulmuyor.
- 101'de iki satırlı ıstaka küçük ekrana sığıyor; Okey'de taşlar gereksiz daralmıyor.
- Taş çekme, atılan taşı alma, taş atma, sıralama, per açma ve yeni el akışları çalışıyor.
- CSS, hem web/PWA hem Android WebView'da yükleniyor.
- Android workflow yeni CSS dosyasını webDir içine kopyalıyor.
- `node --check masa.js` ve mevcut doğrulama workflow kontrolleri geçiyor.

### Yanıt formatı
1. **Bulgu:** dosya ve fonksiyon/seçici.
2. **Önem:** Kritik / Yüksek / Orta / Düşük.
3. **Tekrar üretme:** kesin adımlar.
4. **Beklenen / gerçekleşen:** fark.
5. **Önerilen düzeltme:** kısa ve uygulanabilir.
6. **Sonuç:** Onay / Düzeltme gerekli.

**Önemli:** Bu inceleme için `main` dalına doğrudan commit atma. Önce yalnızca rapor üret. Kod değişikliği gerekiyorsa ayrı dal ve Pull Request öner; ChatGPT ile çakışan değişiklik yapma.
