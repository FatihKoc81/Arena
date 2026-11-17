# ARENA — Android APK öncelikli geliştirme görevi

Claude Code baş geliştiricidir. Gemini yalnızca teknik yardımcındır. GPT-6 koordinasyon ve bağımsız denetim yapar. Kullanıcı doğrudan main'e commit ve otomatik APK üretimine açıkça izin verdi.

## Kapsam kararı: WEB GELİŞTİRMESİ DURDURULDU
- Kullanıcı web sitesi/PWA geliştirmesini şimdilik istemiyor. Ayrı web sitesi, masaüstü tarayıcı, SEO, PWA, web yayını veya web tasarım eşitliği için çalışma yapma.
- Yalnızca kurulabilir Android APK'nın kalitesine ve çalışmasına odaklan.
- ARENA şu anda Capacitor/WebView tabanlı bir Android APK'dır. APK'nın içindeki arayüz HTML/CSS/JavaScript ile paketleniyor olabilir; bu dosyaları yalnızca APK'nın iç deneyimini geliştirmek için değiştir. Ayrı web dağıtımını hedefleme.
- Android APK'ya dahil edilen görsel, ses, efekt ve oyun varlıkları yüksek kaliteli olmalı; düşük çözünürlüklü placeholder kullanma. Lisanslı veya özgün varlık kullan, varlık lisanslarını ve kaynaklarını not et.
- Görselleri yüksek çözünürlükte hazırla ancak Android bellek, APK boyutu ve yükleme süresine göre WebP/AVIF ve uygun ses sıkıştırmasıyla optimize et. Kaliteyi bozacak aşırı sıkıştırma yapma.
- Menü, oyun ve efekt seslerini gerçek ses dosyalarıyla entegre et; sessiz/otomatik oynatma kısıtlarını Android dokunma etkileşimiyle doğru yönet. Ses aç/kapat, ses seviyesi ve uygulama arka plana geçişini test et.
- Akıcı animasyon, dokunma geri bildirimi, doğru ekran yönü, farklı Android ekran yoğunlukları, performans ve uygulama yaşam döngüsünü gözet.

## Bu turun dar kapsamı: APK ana menüsü ve Milyoner
1. Önce main dalındaki gerçek kaynakları, Android Capacitor yapılandırmasını, açık PR #20 ve #21'i ve APK workflow'unu incele. PR'ları körlemesine birleştirme.
2. PR #21'deki ana menü geliştirmelerini ve PR #20'deki Milyoner düzeltmelerini yalnızca mevcut main ile uyumlu, test edilebilir ve gerileme yaratmayacak kısımlarını kontrollü şekilde değerlendir. Uygun olanları doğrudan main'e taşı; PR oluşturma.
3. APK ana menüsünü premium kaliteye yükselt: net yüksek çözünürlüklü görseller, tutarlı özgün ikonlar, katmanlı arka plan, zarif ışık/cam efektleri, akıcı geçişler ve dokunma animasyonları.
4. Menü müziği, buton sesleri ve Milyoner için doğru/yanlış cevap, joker ve seviye geçiş efektlerini kaliteli gerçek ses varlıklarıyla uygula. Kullanıcı ayarlarından sesleri kapatabilsin.
5. Milyoner'in soru/cevap akışını, jokerlerini, süre ve oyun sonu durumlarını Android APK içinde doğrula; bu turda yalnızca en kritik tek oyun hatasını düzelt.
6. Android'e özgü sorunları kontrol et: ses odağı, geri tuşu, ekran yönü, güvenli alanlar, dokunma hedefleri, uygulama duraklatma/devam, offline paketlenmiş varlıklar ve performans.
7. İlgili JS sözdizimi/test kontrollerini ve Android APK derlemesini çalıştır. Gerçek cihaz testi yapılmadıysa bunu açıkça belirt.
8. Her tutarlı ve test edilmiş değişikliği doğrudan main'e commit et ve push et. PR açma. API anahtarlarını veya imzalama sırlarını asla commit etme.
9. Push sonrasında Build APK Actions çalışmasını bekle/incele. APK artifact veya release gerçekten oluştuysa doğrulanmış indirme bağlantısını raporla. Derleme başarısızsa logu incele, bir odaklı düzeltme yap ve yeniden doğrula; sınırsız deneme yapma.
10. Gemini'den hedefli Android incelemesi, test tasarımı ve hata analizi iste. Son uygulama kararları ve kod sahipliği sende.

Bu turda Okey/101, diğer oyunlar, web sitesi, PWA veya masaüstü tarayıcı geliştirmesine geçme. Önce Android APK ana menüsü ve Milyoner deneyimini kaliteli, kararlı ve doğrulanabilir hale getir.
