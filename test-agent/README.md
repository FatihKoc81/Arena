# ARENA Test Agent

Bu klasör ana ARENA uygulamasından bağımsız mobil test paneli ve Cloudflare Worker alıcısı içerir.

Toplanan veriler: tarayıcı/Android user-agent, dil, ekran ve viewport ölçüleri, çevrimiçi durumu, destekleniyorsa bağlantı türü, Navigation Timing ölçümleri, yakalanabilen JavaScript/Promise/kaynak yükleme hataları ve ön planda dakikada bir heartbeat. Parola, Firebase oturumu, kullanıcı profili ve oyun cevapları toplanmaz.

## Cloudflare kurulumu
1. Cloudflare Dashboard > Workers & Pages > Create > Worker: arena-test-agent.
2. Worker kodu olarak bu klasördeki worker.js dosyasını kullanın.
3. D1 > Create database: arena-test-logs.
4. D1 Console'da schema.sql içeriğini çalıştırın.
5. Worker Settings > Bindings > D1 Database: Variable name DB, oluşturduğunuz veritabanını bağlayın.
6. Worker Settings > Variables and Secrets bölümünde DEVICE_INGEST_KEY adında güçlü, rastgele bir Secret oluşturun. Ayrıca raporları okumak için ayrı bir ADMIN_READ_KEY Secret oluşturun. Telefon paneline yalnızca DEVICE_INGEST_KEY girilir; ADMIN_READ_KEY telefona girilmez.
7. Worker adresini not edin. Örnek: https://arena-test-agent.hesap.workers.dev.

## GitHub Pages
Panel adresi: https://fatihkoc81.github.io/Arena/test-agent/

## Telefonda eşleştirme
1. Paneli Xiaomi Mi 8 Lite üzerinde açın.
2. Worker adresini ve DEVICE_INGEST_KEY değerini girin. ADMIN_READ_KEY yalnızca yönetici rapor sorguları içindir.
3. Ayarları kaydet ve bağlan düğmesine dokunun.

## Sınırlar
Android Chrome arka plan sekmelerini askıya alabilir. Kesintisiz arka plan testi garanti edilmez; panel ön plandayken raporlama yapılır. Bu sürüm DOM/JS ve performans izleme yapar; gerçek dokunma otomasyonu, ekran görüntüsü, uygulama kapalıyken otomatik açma veya tüm ağ trafiğini izleme yapmaz. Ana ARENA sayfasını değiştirmez; uygulamayı aynı kökenli iframe içinde açar.
