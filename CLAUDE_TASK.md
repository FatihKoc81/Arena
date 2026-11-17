# ARENA — Sıradaki doğrudan geliştirme görevi

Claude Code baş geliştiricidir. CLAUDE.md ve GEMINI.md talimatlarına uy. Kullanıcı doğrudan main'e commit ve otomatik APK üretimine açıkça izin verdi.

Bu görevde yalnızca ana menü geliştirmesini main'e güvenli biçimde taşı ve Milyoner için bir sonraki küçük, doğrulanabilir iyileştirmeyi yap.

1. Önce main dalındaki mevcut kodu ve açık PR #20 ile #21'i incele. PR'ları körlemesine birleştirme. Değişiklikleri ve olası çakışmaları değerlendir.
2. PR #21'deki premium menü dosyalarını ve ikonları mevcut main ile uyumluysa kontrollü biçimde main'e uygula. PR #20'deki Milyoner düzeltmelerini de incele; yalnızca doğruladığın, gerileme yaratmayan değişiklikleri al.
3. Milyoner akışını çalıştır; en kritik tek hatayı veya eksikliği belirle ve küçük kapsamda düzelt. Soru/cevap akışını, jokerleri ve oyun sonu durumunu bozma.
4. Uygun otomatik testleri ve JS sözdizimi kontrollerini çalıştır. Test kanıtı yoksa başarı iddia etme.
5. Her tutarlı değişikliği doğrudan main'e commit et ve push et. PR oluşturma.
6. Push sonrasında Build APK iş akışının çalıştığını kontrol et. Başarılıysa release ve APK bağlantısını raporla; başarısızsa logları incele, makul bir düzeltme denemesi yap ve sonucu açıkça raporla.
7. Gemini'den hedefli kod incelemesi/test önerisi iste. Büyük kapsamlı yeniden yazım yapma.

Bu turda Okey/101 veya diğer oyunlara geçme. Önce menü ve Milyoner temelini sağlamlaştır. Android gerçek cihaz testi yapıldı diye iddia etme.
