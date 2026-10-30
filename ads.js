/* Bilgi Arenası - AdMob reklamları (sadece APK içinde çalışır).
   rotasyon.js'in beklediği window.cemberReklam(tur, bitti) fonksiyonunu tanımlar.
   tur: "odul" (ödüllü, izlenince bitti(true)) veya "gecis" (bölüm arası geçiş reklamı). */
(function () {
  // ===== AYARLAR =====
  // TEST = true iken Google'ın test reklamları gösterilir. Gerçek reklam için false yap
  // ve aşağıya AdMob'dan aldığın reklam birimi kimliklerini yaz.
  var TEST = true;
  var ID_ODUL_TEST = "ca-app-pub-3940256099942544/5224354917";
  var ID_GECIS_TEST = "ca-app-pub-3940256099942544/1033173712";
  var ID_ODUL = "ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY";  // gerçek ödüllü reklam birimi
  var ID_GECIS = "ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ"; // gerçek geçiş reklamı birimi
  // ===================

  var C = window.Capacitor;
  if (!C || !C.isNativePlatform || !C.isNativePlatform()) return; // tarayıcıda deneme reklamı kalsın
  var AdMob = C.Plugins && C.Plugins.AdMob;
  if (!AdMob) return;

  var hazir = null;
  function baslat() {
    if (!hazir) {
      hazir = AdMob.initialize({ initializeForTesting: TEST }).catch(function () { hazir = null; throw new Error("init"); });
    }
    return hazir;
  }
  baslat().catch(function () {});

  function dinle(olaylar, temizle) {
    // olaylar: {ad: fonksiyon}; temizle: tüm dinleyicileri kaldıran fonksiyonu döndürür
    var tutaclar = [];
    Object.keys(olaylar).forEach(function (ad) {
      AdMob.addListener(ad, olaylar[ad]).then(function (h) { tutaclar.push(h); });
    });
    return function () { tutaclar.forEach(function (h) { try { h.remove(); } catch (e) {} }); tutaclar = []; };
  }

  function goster(tur, bitti) {
    var odul = tur === "odul";
    var bitisti = false, kazandi = false, kaldir = function () {}, zamanAsimi;
    function son(ok) {
      if (bitisti) return;
      bitisti = true;
      clearTimeout(zamanAsimi);
      kaldir();
      bitti(ok);
    }
    zamanAsimi = setTimeout(function () { son(false); }, 45000); // yüklenemezse takılma

    baslat().then(function () {
      var olaylar = {};
      if (odul) {
        olaylar.onRewardedVideoAdReward = function () { kazandi = true; };
        olaylar.onRewardedVideoAdDismissed = function () { son(kazandi); };
        olaylar.onRewardedVideoAdFailedToLoad = function () { son(false); };
        olaylar.onRewardedVideoAdFailedToShow = function () { son(false); };
      } else {
        olaylar.onInterstitialAdDismissed = function () { son(true); };
        olaylar.onInterstitialAdFailedToLoad = function () { son(false); };
        olaylar.onInterstitialAdFailedToShow = function () { son(false); };
      }
      kaldir = dinle(olaylar);
      var id = odul ? (TEST ? ID_ODUL_TEST : ID_ODUL) : (TEST ? ID_GECIS_TEST : ID_GECIS);
      var hazirla = odul ? AdMob.prepareRewardVideoAd({ adId: id }) : AdMob.prepareInterstitial({ adId: id });
      return hazirla.then(function () {
        clearTimeout(zamanAsimi); // reklam yüklendi, gösterim süresi sınırsız
        return odul ? AdMob.showRewardVideoAd() : AdMob.showInterstitial();
      });
    }).catch(function () { son(false); });
  }

  window.cemberReklam = function (tur, bitti) { goster(tur, bitti); };
})();
