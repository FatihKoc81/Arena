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

## Gemini görevi — Görsel tasarım ve kullanıcı deneyimi

Gemini yalnızca kod hatası aramayacak; ARENA'nın masa oyunları için görsel tasarım ortağı olarak da bağımsız fikir üretecek. Özellikle Okey ve 101 ekranlarını gerçek bir masa oyunu hissi verecek şekilde değerlendirecek.

### Görsel olarak incelenecek alanlar
- **Taşlar:** renk ve sayı kontrastı, yazı tipi, taş oranları, kenar yuvarlaklığı, gölge, parlaklık ve gerçek taş hissi.
- **Istaka:** ahşap dokusu, derinlik, ön dudak, taşların oturuşu, seçili taşın belirginliği ve sürükleme sırasında görsel geri bildirim.
- **Masa:** arka plan/keçe dokusu, renk uyumu, ışık-gölge dengesi ve oyun alanının görsel hiyerarşisi.
- **Oyuncu alanları:** rakiplerin konumu, isim ve profil alanları, sıra göstergesi, taş sayısı ve okunabilirlik.
- **Kontroller:** taş çekme/atma, sıralama, per açma ve diğer butonların kolay bulunması; yanlışlıkla dokunmayı azaltan boyut ve aralıklar.
- **Animasyonlar:** taş dağıtma, çekme, atma, seçme ve sürükleme hareketlerinin doğal, kısa ve akıcı olması.
- **Ekran uyumu:** dar ve geniş telefonlar, portre/yatay yön, Android WebView, Chrome ve Safari. İçerik kesilmemeli, taşlar okunamayacak kadar küçülmemeli, gereksiz kaydırma oluşmamalı.

### Tasarım değerlendirme kuralları
1. Önce mevcut ekranı ve mevcut CSS/HTML yapısını incele; yalnızca varsayıma dayalı eleştiri yapma.
2. Her önemli görsel sorun için mümkünse ekran görüntüsü üzerinde işaretli açıklama veya basit bir taslak öner.
3. Tek bir tasarımı dayatma. Gerektiğinde en fazla 2–3 farklı tasarım alternatifi sun; her birinin artılarını ve eksilerini yaz.
4. Alternatifleri gerçekçilik, okunabilirlik, telefon ekranına uyum, erişilebilirlik ve performans açısından karşılaştır.
5. ARENA'nın mevcut görsel kimliğiyle uyumu koru; sırf gösterişli olsun diye gereksiz efekt, parlama veya animasyon ekleme.
6. Görsel öneriler mevcut oyun kurallarını, taş sayısını veya dokunmatik etkileşimleri bozmamalı.
7. Önerdiğin değişikliklerin hangi dosya ve CSS seçicilerini/HTML parçalarını etkileyeceğini belirt.
8. Tasarım kararı verilmeden büyük çaplı görsel değişikliği uygulama. Önce önerileri ChatGPT ile karşılaştırılmak üzere raporla.

### Görsel rapor formatı
1. **Mevcut durum:** Güçlü ve zayıf yönler.
2. **Sorun:** Ekran bölgesi ve kullanıcıya etkisi.
3. **Alternatifler:** En fazla 2–3 tasarım fikri; mümkünse taslak/görsel referans.
4. **Karşılaştırma:** Gerçekçilik, okunabilirlik, mobil uyum ve performans.
5. **Önerilen seçenek:** Gerekçesi ve etkilenecek dosyalar.
6. **Sonuç:** Tasarım onayı / kullanıcı kararı gerekli.

### Ortak karar ve uygulama
- ChatGPT ve Gemini önce teknik ve görsel önerileri ayrı ayrı değerlendirir.
- Fikir ayrılığı varsa iki yaklaşımın artı/eksileri açıkça karşılaştırılır; gerekirse kullanıcıya kısa ve anlaşılır seçenekler sunulur.
- Uygulanacak tasarım, teknik olarak güvenli ve oyun kullanımını kolaylaştıran seçenek olmalıdır.
- ChatGPT onaylanan değişikliği GitHub'a uygular; Gemini'nin raporu tek başına kod değişikliği yetkisi vermez.
- Son karar gerçek cihaz ekran görüntüsü/video testiyle doğrulanır.

**Önemli:** Gemini bu inceleme için `main` dalına doğrudan commit atma. Önce yalnızca rapor üret. Kod değişikliği gerekiyorsa ayrı dal ve Pull Request öner; ChatGPT ile çakışan değişiklik yapma.
