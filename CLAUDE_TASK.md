# ARENA — kapsamlı Android APK kalite ve tasarım yenilemesi

Kullanıcının açık talebi: ARENA'yı düzgün ve gözle görülür biçimde güncelle. Önceki küçük/kozmetik değişiklikler beğenilmedi. Bu kez yalnızca birkaç parlak efekt ekleme; uygulamanın tamamında tutarlı, kaliteli ve gerçekten çalışan bir ürün deneyimi oluştur.

## Kesin sınırlar
- Yalnızca kurulabilir Android APK. Ayrı web/PWA/masaüstü/SEO geliştirmesi yapma.
- Capacitor WebView içindeki HTML/CSS/JS, yalnızca APK deneyimini iyileştirmek için değiştirilebilir.
- Mevcut oyunları, Firebase, Google/telefon oturum açma, misafir kullanımı, kayıtlı ilerleme, reklam/ödül sistemlerini bozma veya kaldırma.
- Mevcut işlevi olmayan profil, lig, görev, arkadaş, bildirim, çok oyunculu gibi sahte kartlar/rozetler üretme. Çalışmayan özellikleri çalışıyormuş gibi gösterme.
- Kullanıcının quiz içerik yasaklarını ve Türkçe metin tercihlerini koru.
- RESET NIGHT beklemede. Bu görev yalnızca ARENA içindir.

## Önce teşhis
1. Main dalındaki tüm ana ekran, kategori ekranı, oyun başlatma akışı, oyun ekranları, ayarlar, profil, Firebase/kimlik doğrulama, Android yapılandırması ve APK workflow'unu incele.
2. Kullanıcının önceki şikâyetlerini ve açık PR #20/#21'i incele. PR #21'de assets/game-art/*.svg referansları var fakat PR dosya listesinde bu dosyalar bulunmuyor; eksik varlıkları kontrol et. PR'ları körlemesine birleştirme.
3. Şu anki APK'nın gerçek görünümüyle kodu karşılaştır. Yalnızca kod satırı sayısını artırmak için değişiklik yapma.

## Tasarım hedefi — uygulamanın tamamında
- ARENA için tek ve tutarlı premium görsel dil kur: koyu lacivert/füme temel, kontrollü elektrik mavisi ve altın vurgu, net tipografi, iyi boşluk, güçlü hiyerarşi, yüksek kontrast.
- Ana menü: gerçek kullanıcı verisine bağlı profil/ilerleme alanı, anlaşılır kategori kartları, düzgün iki sütunlu mobil ızgara, taşma ve üst üste binme olmadan sabit alt gezinme. Küçük telefonlarda da doğru yerleşim.
- Kategori ve oyun seçim ekranları: her oyuna özgü, net ikon/kapak, kısa açıklama, tutarlı kart ölçüleri ve belirgin başlatma aksiyonu. Sadece ana menüyü güzelleştirip diğer ekranları eski bırakma.
- Oyun içi ekranlar: Milyoner, Dini İmtihan ve mevcut oyunların mevcut işlevlerini koruyarak görsel bütünlük, okunabilir soru/cevap, doğru/yanlış durumları, jokerler, skor/süre ve oyun sonu ekranlarını düzenle. Bu turda oyun mantığını gereksiz yere yeniden yazma.
- Animasyonlar kısa, akıcı ve Android GPU dostu olsun. Her dokunuşta aşırı parıltı/animasyon kullanma. Reduce-motion ve düşük performanslı cihazları destekle.
- Gerçek, özgün veya lisansı açık yüksek kaliteli görsel varlık kullan. SVG/WebP çözünürlüklerini doğru ayarla, eksik dosya bırakma, dış ağdan yüklenen görsele bağımlı olma.
- Ses: yalnızca osilatörle sahte melodi üretip bunu profesyonel müzik diye sunma. Lisansı açık/özgün kısa menü müziği ve gerçek UI/oyun ses efektleri ekle; ses aç/kapat ve seviye ayarlarını uygula. Uygulama arka plana girince sesi durdur, geri gelince doğru yönet. Ses dosyaları APK içinde offline çalışsın.
- Android geri tuşu, güvenli alanlar, ekran yönü, dokunma hedefleri, yaşam döngüsü, çevrimdışı kullanım ve performans kontrolü yap.

## Uygulama ve teslim
1. Her değişiklikten önce ilgili dosyaları ve mevcut davranışı anla. Büyük dosyaları toptan değiştirme.
2. Değişiklikleri küçük, bütünlüklü gruplar halinde uygula; mevcut çalışan oyunları ve kullanıcı verilerini koru.
3. PR açma; kullanıcının açık izniyle main'e doğrudan commit et. Her commit açıklayıcı olsun.
4. JS sözdizimi, HTML inline script, asset dosya yolları, mümkünse headless mobil görünüm ve ilgili oyun akışlarını test et.
5. Android APK'yı derle, imzayı doğrula, GitHub Release'e yükle. Build yeşil tek başına yeterli değildir; APK dosyasının gerçekten oluştuğunu ve indirme bağlantısını doğrula.
6. Gerçek Android cihaz testi yapılmadıysa bunu açıkça yaz. Ölçmediğin FPS, ses veya cihaz uyumluluğunu iddia etme.
7. Önce ana menü + kategori/oyun seçimi + Milyoner/Dini İmtihan deneyimini tutarlı hale getir. Sonra aynı tasarım sistemini diğer oyun ekranlarına yay. Okey/101 oyun mantığını bu turda değiştirme.
8. Kullanıcıya sadece gerçek değişiklikleri, testleri, eksikleri ve doğrulanmış APK bağlantısını raporla. "Premium oldu" gibi kanıtsız ifadeler kullanma.

Önce uygulanabilir planı belirle, ardından kodla ve test et. Kullanıcıdan rutin terminal/Git/derleme adımı isteme; kendin yap.
