/* Bilgi Arenası - AdMob reklamları (sadece APK içinde çalışır).
   rotasyon.js'in beklediği window.cemberReklam(tur, bitti) fonksiyonunu tanımlar.
   tur: "odul" (ödüllü, izlenince bitti(true)) veya "gecis" (bölüm arası geçiş reklamı). */
(function () {
  // ===== AYARLAR =====
  // TEST = true iken Google'ın test reklamları gösterilir. Gerçek reklam için false yap.
  var TEST = false;
  var ID_ODUL_TEST = "ca-app-pub-3940256099942544/5224354917";
  var ID_GECIS_TEST = "ca-app-pub-3940256099942544/1033173712";
  var ID_ODUL = "ca-app-pub-8747781588851121/3796069840";  // gerçek ödüllü reklam birimi
  var ID_GECIS = "ca-app-pub-8747781588851121/7179499824"; // gerçek geçiş reklamı birimi
  // ===================

  var C = window.Capacitor;
  if (!C || !C.isNativePlatform || !C.isNativePlatform()) return; // tarayıcıda sahte deneme reklamı kalır

  // Eklentiyi bul: önce Capacitor.Plugins, yoksa registerPlugin ile native eklentiye bağlan
  var AdMob = null, hata = "";
  try { AdMob = C.Plugins && C.Plugins.AdMob; } catch (e) {}
  if (!AdMob && typeof C.registerPlugin === "function") {
    try { AdMob = C.registerPlugin("AdMob"); } catch (e) { hata = "registerPlugin: " + (e && e.message); }
  }
  window.__adHata = AdMob ? "" : ("AdMob eklentisi yok " + hata);

  function hataYaz(e) {
    var m = (e && (e.message || e.errorMessage || e.code)) || String(e);
    window.__adHata = String(m).slice(0, 80);
  }

  var hazir = null;
  function baslat() {
    if (!AdMob) return Promise.reject(new Error("AdMob eklentisi APK içinde yok"));
    if (!hazir) {
      hazir = AdMob.initialize({ initializeForTesting: TEST }).catch(function (e) { hazir = null; throw e; });
    }
    return hazir;
  }
  baslat().catch(hataYaz);

  // olaylar: {ad: fonksiyon}; dinleyiciler kayıt olunca çözülen promise döner
  function dinle(olaylar) {
    var tutaclar = [];
    var hepsi = Promise.all(Object.keys(olaylar).map(function (ad) {
      return Promise.resolve(AdMob.addListener(ad, olaylar[ad])).then(function (h) { if (h) tutaclar.push(h); });
    }));
    return {
      hazir: hepsi,
      temizle: function () { tutaclar.forEach(function (h) { try { h.remove(); } catch (e) {} }); tutaclar = []; }
    };
  }

  function goster(tur, bitti) {
    var odul = tur === "odul";
    var bitisti = false, kazandi = false, dl = null, zamanAsimi;
    function son(ok) {
      if (bitisti) return;
      bitisti = true;
      clearTimeout(zamanAsimi);
      if (dl) dl.temizle();
      bitti(ok);
    }
    zamanAsimi = setTimeout(function () { if (!window.__adHata) window.__adHata = "zaman aşımı"; son(false); }, 45000);

    baslat().then(function () {
      var olaylar = {};
      if (odul) {
        olaylar.onRewardedVideoAdReward = function () { kazandi = true; };
        olaylar.onRewardedVideoAdDismissed = function () { son(kazandi); };
        olaylar.onRewardedVideoAdFailedToLoad = function (e) { hataYaz(e); son(false); };
        olaylar.onRewardedVideoAdFailedToShow = function (e) { hataYaz(e); son(false); };
      } else {
        olaylar.onInterstitialAdDismissed = function () { son(true); };
        olaylar.onInterstitialAdFailedToLoad = function (e) { hataYaz(e); son(false); };
        olaylar.onInterstitialAdFailedToShow = function (e) { hataYaz(e); son(false); };
      }
      dl = dinle(olaylar);
      var id = odul ? (TEST ? ID_ODUL_TEST : ID_ODUL) : (TEST ? ID_GECIS_TEST : ID_GECIS);
      return dl.hazir.then(function () {
        return odul ? AdMob.prepareRewardVideoAd({ adId: id }) : AdMob.prepareInterstitial({ adId: id });
      }).then(function () {
        clearTimeout(zamanAsimi); // reklam yüklendi, gösterim süresi sınırsız
        return odul ? AdMob.showRewardVideoAd() : AdMob.showInterstitial();
      });
    }).catch(function (e) { hataYaz(e); son(false); });
  }

  // APK içindeysek HER ZAMAN tanımlı: eklenti yoksa sahte reklam yerine hata görünür
  window.cemberReklam = function (tur, bitti) { goster(tur, bitti); };
})();
