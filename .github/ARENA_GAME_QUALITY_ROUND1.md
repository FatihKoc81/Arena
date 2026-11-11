# ARENA — Oyun Kalitesi 1. Tur

Bu dal gerçek uygulama geliştirme çalışması içindir. Hedef: Okey ve 101 oyunlarını sağlam, akıcı, telefonda rahat oynanır ve görsel olarak tutarlı hale getirmek.

## Görev
Mevcut kodu ve kullanıcı testlerinde görülen sorunları incele; yalnızca doğrulayabildiğin sorunları düzelt. Öncelik sırası:

1. Okey ve 101 oyun akışı: el dağıtımı, taş çekme/atılanı alma, seçme, sıralama, taş atma, per açma ve el bitirme. Kuralların mevcut uygulamadaki anlamını koru; yeni kural uydurma.
2. Istaka dokunmatik etkileşimi: tek dokunuş tek seçim olmalı; sürükle-bırak doğru taşı doğru yere taşımalı; pointercancel ve parmak alan dışına çıkma güvenli olmalı. Taş seçiminde çift tetikleme, takılı sürükleme veya kaybolan seçim olmamalı.
3. Taş sayıları: Okey oyuncu başlangıcı 15, botlar 14; 101 oyuncu başlangıcı 22, botlar 21. Çekme/atma akışında tutarlılığı doğrula.
4. Küçük ve geniş telefon ekranları: Okey taşları okunabilir kalmalı; 101'in 22 taşlık ıstakası iki satırda taşmadan sığmalı. Portre/yatay, Android WebView ve mobil tarayıcı davranışını gözet.
5. Masa görsel kalitesi: taş kontrastı ve boyutları, ahşap ıstaka, masa/keçe, oyuncu alanları, sıra göstergesi, kontroller ve kısa/akıcı animasyonlar. Mevcut ARENA kimliğini koru; gereksiz efekt ekleme.
6. Oyun aç/kapat ve geri dönüş akışı: pencere kapatma, lobiye dönme, yön kilidini bırakma ve ana menüye dönüşte takılma/çift ekran oluşmamalı.

## Kesin sınırlar
- Yalnızca ilgili oyun dosyalarını ve gerekiyorsa testlerini değiştir.
- Kullanıcı hesapları, Firebase, reklam, puan/ödül altyapısı, kimlik bilgileri, imzalama anahtarı, bildirimler ve mevcut diğer oyunlara dokunma.
- Sorunu doğrulamadan davranış değiştirme.
- Oyun kurallarını, mevcut Türkçe metinleri ve erişilebilir etiketleri koru.
- Büyük görsel değişiklik yapmadan önce mevcut tasarıma uyumlu, ölçülü iyileştirmeler yap.
- Çıktı PR olarak sunulsun; main'e doğrudan commit/merge yapılmasın.

## Doğrulama
- İlgili JS dosyalarında node --check.
- Mevcut validate-games kontrolleri.
- Okey/101 için başlangıç taş sayıları, tek dokunuş, sürükle-bırak, pointercancel, çek/at ve per açma akışlarına test ekle veya manuel test adımlarını raporla.
- Ekran görüntüsü/gerçek cihaz doğrulaması yapılmadıysa yapılmış gibi yazma.

## PR raporu
- Düzeltilen her sorun: dosya/fonksiyon, önceki davranış, yeni davranış.
- Dokunulan dosyalar ve gerekçesi.
- Test komutları ve gerçek sonuçları.
- Bilinen eksikler ve gerçek cihazda kontrol edilmesi gerekenler.
