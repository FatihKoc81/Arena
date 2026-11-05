// hesap.js: E-POSTA İLE HESAP + BENZERSİZ KULLANICI ADI
// ekonomi.js bu dosyayı sayfa yüklenince kendisi ekler (index.html'e dokunmana gerek yok).
// Kurallar: 3-18 karakter · ilk harf büyükse 1 büyük harf daha olabilir, küçükse hepsi küçük ·
// sadece a-z, 0-9, _ (boşluk ve Türkçe karakter yok) · adlar büyük/küçük harf fark etmeksizin tektir · 7 günde bir değişir.
// Kurallar ekranda yazmaz, sadece kuralı çiğneyen kişi uyarı görür. Sahip (SAHIP e-postası, doğrulanmış) kuralların dışındadır.
(function () {
  "use strict";
  if (typeof firebase === "undefined" || !firebase.apps || !firebase.apps.length) return; // Firebase kurulu değilse eski yöntem kalır
  var A = firebase.auth(), db = firebase.database();
  var APP = window.ARENA_APP || "arena";
  var GUN7 = 7 * 24 * 3600 * 1000, SAHIP = "fatihkoc7@gmail.com", SAHIP_ADLARI = ["estergon", "osmanli"];
  var REZERVE = ["fk1453", "fatih", "fatih_", "fatihkoc81", "fatihkoc7", "estergon", "osmanli", "hatice", "haticekoc81", "haticekoc1", "haticekoc7"];
  var ayar = false, kayit = null, hesapRef = null, el = null, sekme = "kayit", msg = "", msgOk = false, busy = false;
  var telefonOnay = null, telefonNumara = "", telefonIslem = "", recaptcha = null;

  function noop() {}
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function UYG() { return (window.Ekonomi && window.Ekonomi.UYG) || ""; }

  // ---------- ad kuralları ----------
  function sahipMi(u) { return !!(u && u.email && u.emailVerified && u.email.toLowerCase() === SAHIP); }
  function adDogrula(v, sahip) {
    if (!v) return "Kullanıcı adı yaz.";
    var yasak = v.match(/[^A-Za-z0-9_]/g);
    if (yasak) {
      var l = [];
      yasak.forEach(function (c) { var g = c === " " ? "boşluk" : c; if (l.indexOf(g) < 0) l.push(g); });
      return "Şu karakterler kullanılamıyor: " + l.join(", ") + " (sadece a-z, 0-9 ve _ olabilir).";
    }
    if (v.length < 3 || v.length > 18) return "Ad 3-18 karakter olmalı.";
    if (sahip) return "";
    var buyuk = (v.match(/[A-Z]/g) || []).length, ilkBuyuk = /^[A-Z]/.test(v);
    if (!ilkBuyuk && buyuk) return "İlk harf küçükse büyük harf kullanılamaz.";
    if (ilkBuyuk && buyuk > 2) return "İlk harften sonra en fazla bir büyük harf daha kullanılabilir.";
    return "";
  }
  function rezerveMi(lower) { return REZERVE.indexOf(lower) >= 0; }

  function hataYaz(e) {
    if (e && e.ozel) return e.ozel;
    var c = (e && e.code) || "", m = (e && e.message) || "";
    var t = {
      "auth/email-already-in-use": "Bu e-posta zaten kayıtlı. “Giriş yap” sekmesini kullan.",
      "auth/credential-already-in-use": "Bu e-posta başka bir hesapta kayıtlı. “Giriş yap” sekmesini kullan.",
      "auth/invalid-email": "E-posta adresi geçersiz.",
      "auth/weak-password": "Şifre en az 6 karakter olmalı.",
      "auth/wrong-password": "E-posta ya da şifre hatalı.",
      "auth/invalid-credential": "E-posta ya da şifre hatalı.",
      "auth/user-not-found": "Bu e-postayla kayıtlı hesap yok.",
      "auth/too-many-requests": "Çok fazla deneme yapıldı, biraz bekle.",
      "auth/network-request-failed": "İnternet bağlantısı yok.",
      "auth/operation-not-allowed": "Bu giriş yöntemi Firebase'de kapalı. Authentication > Sign-in method bölümünden ilgili sağlayıcıyı aç.",
      "auth/popup-blocked": "Tarayıcı açılır pencereyi engelledi. Bu site için açılır pencerelere izin ver.",
      "auth/popup-closed-by-user": "Giriş penceresi kapatıldı.",
      "auth/unauthorized-domain": "Bu site Firebase yetkili alan adlarında kayıtlı değil.",
      "auth/captcha-check-failed": "SMS doğrulaması başarısız. Sayfayı yenileyip tekrar dene.",
      "auth/invalid-phone-number": "Telefon numarası geçersiz. +905xxxxxxxxx biçiminde yaz.",
      "auth/too-many-requests": "Çok fazla SMS isteği yapıldı. Bir süre bekle."
    };
    if (t[c]) return t[c];
    if (/permission_denied/i.test(c + " " + m)) return "İzin verilmedi: ad alınmış olabilir ya da Firebase kuralları henüz yayınlanmamış.";
    return "Hata: " + (m || c || "bilinmeyen");
  }

  // ---------- ad alma (rezerve et + kaydet + eskisini bırak) ----------
  function sonrakiTarih() { return kayit && kayit.adT ? kayit.adT + GUN7 : 0; }

  function adAl(ad) {
    var u = A.currentUser, lower = ad.toLowerCase(), sahip = sahipMi(A.currentUser);
    var eski = kayit && kayit.ad ? kayit.ad.toLowerCase() : null;
    var yeniAlindi = false;
    if (!u || (!u.email && !u.phoneNumber)) return Promise.reject({ ozel: "Önce bir hesap yöntemiyle kayıt ol." });
    if (SAHIP_ADLARI.indexOf(lower) >= 0 && !sahip) return Promise.reject({ ozel: "“" + ad + "” rezerve edilmiş bir ad." + (u.emailVerified ? "" : " Sahibiysen önce e-postanı doğrula.") });
    if (kayit && kayit.ad === ad) return Promise.reject({ ozel: "Zaten bu adı kullanıyorsun." });
    if (!sahip && sonrakiTarih() > Date.now()) return Promise.reject({ ozel: "Adını " + new Date(sonrakiTarih()).toLocaleDateString("tr-TR") + " tarihinden sonra değiştirebilirsin." });
    return db.ref("adlar/" + lower).once("value").then(function (s) {
      if (s.exists() && s.val() !== u.uid) throw { ozel: "Bu ad alınmış, başka bir ad dene." };
      if (s.val() === u.uid) return;
      yeniAlindi = true;
      return db.ref("adlar/" + lower).set(u.uid).catch(function (e) {
        if (rezerveMi(lower)) throw { ozel: "“" + ad + "” rezerve edilmiş bir ad." + (u.emailVerified ? "" : " Sahibiysen önce e-postanı doğrula.") };
        throw e;
      });
    }).then(function () {
      return db.ref("hesap/" + u.uid).set({ ad: ad, adT: firebase.database.ServerValue.TIMESTAMP, email: u.email || "", telefon: u.phoneNumber || "" }).catch(function (e) {
        if (yeniAlindi) db.ref("adlar/" + lower).remove().catch(noop); // yarım kalan rezervi geri bırak
        throw e;
      });
    }).then(function () {
      if (eski && eski !== lower) return db.ref("adlar/" + eski).remove().catch(noop);
    }).then(function () {
      if (window.Ekonomi && window.Ekonomi.adAyarla) window.Ekonomi.adAyarla(ad);
    });
  }

  // ---------- kayıt / giriş / çıkış ----------
  function kayitOl(email, pw, ad) {
    var h = adDogrula(ad);
    if (h) return Promise.reject({ ozel: h });
    if (!email) return Promise.reject({ ozel: "E-posta yaz." });
    if (!pw || pw.length < 6) return Promise.reject({ ozel: "Şifre en az 6 karakter olmalı." });
    var u = A.currentUser;
    if (!u) return Promise.reject({ ozel: "Bağlanıyor… birkaç saniye sonra tekrar dene." });
    return db.ref("adlar/" + ad.toLowerCase()).once("value").then(function (s) {
      if (s.exists() && s.val() !== u.uid) throw { ozel: "Bu ad alınmış, başka bir ad dene." };
      return u.linkWithCredential(firebase.auth.EmailAuthProvider.credential(email, pw)); // puanların aynı kalır
    }).then(function () {
      A.currentUser.sendEmailVerification().catch(noop);
      return A.currentUser.getIdToken(true);
    }).then(function () {
      return adAl(ad).then(function () {
        msg = "Kayıt tamam! E-postana doğrulama bağlantısı gönderdik."; msgOk = true;
      }, function (e) {
        msg = "Hesabın açıldı ama ad alınamadı: " + hataYaz(e) + " Aşağıdan başka ad dene."; msgOk = false;
      });
    });
  }

  function birlestir(yeniUid) {
    return Promise.all([
      db.ref("apps/" + APP + "/users/" + yeniUid + "/eller").once("value"),
      db.ref("hesap/" + yeniUid + "/ad").once("value")
    ]).then(function (r) {
      var sv = r[0].val() || {}, yerel = {};
      try { yerel = JSON.parse(localStorage.getItem(UYG() + "arenaEller") || "{}") || {}; } catch (e) {}
      for (var k in sv) yerel[k] = Math.max(yerel[k] || 0, sv[k] || 0);
      try {
        localStorage.setItem(UYG() + "arenaEller", JSON.stringify(yerel));
        if (r[1].val()) localStorage.setItem(UYG() + "cemberAd", r[1].val());
      } catch (e) {}
    });
  }

  function girisYap(email, pw) {
    if (!email || !pw) return Promise.reject({ ozel: "E-posta/kullanıcı adı ve şifreyi yaz." });
    if (email.indexOf("@") < 0 && !/^\+?[0-9 ()-]{8,}$/.test(email)) {
      return db.ref("adlar/" + email.toLowerCase()).once("value").then(function (s) {
        if (!s.exists()) throw { ozel: "Bu kullanıcı adı bulunamadı." };
        return db.ref("hesap/" + s.val() + "/email").once("value");
      }).then(function (s) {
        if (!s.val()) throw { ozel: "Bu kullanıcı adına bağlı e-posta bulunamadı. Telefonla giriş yapmayı dene." };
        return girisYap(s.val(), pw);
      });
    }
    var g = A.currentUser, eskiUid = g && g.isAnonymous ? g.uid : null;
    // misafir kaydı sıralamada hayalet kalmasın
    var temizle = eskiUid ? db.ref("apps/" + APP + "/users/" + eskiUid).remove().catch(noop) : Promise.resolve();
    return temizle.then(function () { return A.signInWithEmailAndPassword(email, pw); }).then(function (c) {
      return birlestir(c.user.uid);
    }).then(function () { location.reload(); });
  }

  function sosyalGiris(tur) {
    var provider = tur === "google" ? new firebase.auth.GoogleAuthProvider() : new firebase.auth.FacebookAuthProvider();
    provider.setCustomParameters && tur === "facebook" && provider.setCustomParameters({ display: "popup" });
    var misafir = A.currentUser && A.currentUser.isAnonymous ? A.currentUser : null;
    var islem = misafir ? misafir.linkWithPopup(provider) : A.signInWithPopup(provider);
    return islem.then(function (sonuc) {
      if (sonuc && sonuc.user) return birlestir(sonuc.user.uid);
    }).catch(function (e) {
      var kod = e && e.code;
      if (misafir && (kod === "auth/credential-already-in-use" || kod === "auth/account-exists-with-different-credential")) {
        var cred = tur === "google" ? firebase.auth.GoogleAuthProvider.credentialFromError(e) : firebase.auth.FacebookAuthProvider.credentialFromError(e);
        if (!cred) throw e;
        var eskiUid = misafir.uid;
        return db.ref("apps/" + APP + "/users/" + eskiUid).remove().catch(noop).then(function () { return A.signInWithCredential(cred); }).then(function (c) { return birlestir(c.user.uid); });
      }
      throw e;
    }).then(function () { location.reload(); });
  }

  function telefonFormatla(v) {
    var n = String(v || "").replace(/[^0-9+]/g, "");
    if (n.indexOf("+") === 0) return n;
    if (n.indexOf("00") === 0) return "+" + n.slice(2);
    if (n.indexOf("0") === 0) return "+9" + n;
    if (n.indexOf("5") === 0 && n.length === 10) return "+90" + n;
    return "+" + n;
  }
  function telefonKodGonder(numara, islem) {
    telefonNumara = telefonFormatla(numara); telefonIslem = islem;
    if (!/^\+[1-9][0-9]{7,14}$/.test(telefonNumara)) return Promise.reject({ ozel: "Telefon numarasını ülke koduyla kontrol et. Örnek: +905xxxxxxxxx" });
    if (!recaptcha) {
      recaptcha = new firebase.auth.RecaptchaVerifier("hs-recaptcha", { size: "invisible" });
    }
    return recaptcha.render().then(function () { return A.signInWithPhoneNumber(telefonNumara, recaptcha); }).then(function (onay) {
      telefonOnay = onay; render(); mesaj("SMS doğrulama kodunu " + telefonNumara + " numarasına gönderdik.", true);
    });
  }
  function telefonKoduDogrula(kod) {
    if (!telefonOnay) return Promise.reject({ ozel: "Önce SMS kodu iste." });
    var eski = A.currentUser && A.currentUser.isAnonymous ? A.currentUser.uid : null;
    return telefonOnay.confirm(String(kod || "").trim()).then(function (c) {
      return (eski ? birlestir(c.user.uid) : Promise.resolve()).then(function () {
        if (telefonIslem === "kayit") {
          var ad = val("hs-a").trim(), h = adDogrula(ad);
          if (h) throw { ozel: h };
          return adAl(ad);
        }
      });
    }).then(function () { telefonOnay = null; location.reload(); });
  }

  function cikisYap() {
    try { localStorage.removeItem(UYG() + "arenaEller"); localStorage.removeItem(UYG() + "cemberAd"); } catch (e) {}
    return A.signOut().then(function () { location.reload(); });
  }

  // ---------- görünüm ----------
  var css = document.createElement("style");
  css.textContent =
    ".hs-ov{position:fixed;inset:0;z-index:100020;background:rgba(0,0,0,.82);display:none;align-items:center;justify-content:center;font-family:system-ui,sans-serif;padding:12px;box-sizing:border-box}" +
    ".hs-ov.show{display:flex}" +
    ".hs-kt{width:min(100%,520px);max-height:calc(100dvh - 24px);overflow:auto;background:radial-gradient(ellipse at 50% 0%,#10264c 0%,#06132d 48%,#020b1d 100%);border:2px solid #548cff;border-radius:26px;color:#fff;box-sizing:border-box;box-shadow:0 0 22px #1768ff66,inset 0 0 22px #0b3b8b33;-webkit-overflow-scrolling:touch}" +
    ".hs-ph{display:flex;align-items:center;justify-content:space-between;padding:15px 18px;font-size:23px;border-bottom:1px solid #243d70}" +
    ".hs-x{border:0;background:#1b2d50;color:#fff;border-radius:13px;width:44px;height:44px;font-size:23px;cursor:pointer}" +
    ".hs-body{padding:16px 18px 20px}" +
    ".hs-tabs{display:flex;gap:0;margin:0 0 18px;border:2px solid #647fca;border-radius:18px;overflow:hidden;background:#0b1731}" +
    ".hs-tab{flex:1;border:0;background:transparent;color:#b9c8ec;padding:13px 5px;font:800 17px system-ui,sans-serif;cursor:pointer}.hs-tab.on{background:linear-gradient(110deg,#075dff,#087bff);color:#fff;box-shadow:0 0 15px #087bff88}" +
    ".hs-kicker{display:flex;align-items:center;gap:10px;color:#b9d3ff;font-size:17px;font-weight:800;margin:10px 0 14px}.hs-kicker:before,.hs-kicker:after{content:'';height:2px;background:#6689d6;flex:1}" +
    ".hs-social{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:0 0 18px}.hs-social button{min-width:0;min-height:58px;border-radius:16px;border:2px solid #6385d1;font:800 15px system-ui,sans-serif;cursor:pointer;padding:9px 7px}.hs-google{background:#fff;color:#172033}.hs-facebook{background:linear-gradient(120deg,#0865ed,#0750d5);border-color:#1e9cff!important;color:#fff}" +
    ".hs-in{display:block;width:100%;box-sizing:border-box;margin:10px 0;padding:15px 16px;border-radius:17px;border:2px solid #607fc7;background:#0a1833;color:#fff;font:17px system-ui,sans-serif;min-height:58px;outline:none}.hs-in:focus{border-color:#32c7ff;box-shadow:0 0 0 2px #168bff33}.hs-in::placeholder{color:#b5c2dc}" +
    ".hs-bt{display:block;width:100%;border:0;border-radius:17px;padding:16px;margin:14px 0 8px;font:900 19px system-ui,sans-serif;color:#fff;background:linear-gradient(110deg,#087cff,#073de8);box-shadow:0 0 14px #087bff66;cursor:pointer}.hs-bt.gri{background:#263958}.hs-bt.kirmizi{background:#a3231c}.hs-bt[disabled]{opacity:.4}" +
    ".hs-s{margin:8px 0;font-size:15px;word-break:break-all}.hs-k{font-size:14px;color:#aebfe0;line-height:1.5;margin:8px 0}.hs-msg{background:#3a1212;border:1px solid #a3231c;border-radius:12px;padding:10px 12px;margin-bottom:12px;font-size:14px;line-height:1.4}.hs-msg.ok{background:#0f2e25;border-color:#22b77a}" +
    ".hs-l{background:none;border:0;color:#8fc6ff;font:600 15px system-ui,sans-serif;padding:8px 0;cursor:pointer;text-decoration:underline}.hs-loginrow{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:8px 2px}.hs-remember{display:flex;align-items:center;gap:7px;font-size:14px;color:#d5e0f6}.hs-remember input{width:18px;height:18px;accent-color:#176bff}" +
    ".hs-safe{margin-top:15px;padding:12px;border:1px solid #526da9;border-radius:16px;background:#142541;text-align:center;color:#dce7ff;font-size:14px}.hs-recaptcha{height:1px;overflow:hidden}" +
    ".hs-pf{text-align:center;margin:4px 0 10px}.hs-av{width:72px;height:72px;border-radius:50%;margin:0 auto 8px;background:linear-gradient(#f2b92e,#a86f0c);color:#101a38;font:900 34px/72px system-ui,sans-serif}.hs-pn{font-size:22px;font-weight:800}" +
    ".hs-top{background:#0b1230;border:2px solid #f2b92e;border-radius:14px;padding:11px;text-align:center;font-size:16px;margin:8px 0}.hs-top b{font-size:24px;color:#ffd35a;margin-left:6px}" +
    ".hs-r{display:flex;justify-content:space-between;padding:8px 4px;border-bottom:1px solid #1d2540;font-size:15px}.hs-r b{color:#ffd35a}" +
    "@media(max-width:390px){.hs-body{padding:12px}.hs-social button{font-size:13px}.hs-tab{font-size:15px}.hs-ph{font-size:21px}}";
  document.head.appendChild(css);

  var KURAL = "3-18 karakter · ilk harf büyük · ilk harften sonra en fazla 1 büyük harf daha · sadece a-z, 0-9 ve _ (Türkçe karakter yok) · herkesin adı farklı olur · 15 günde bir değişir.";

  function misafirHtml() {
    var h = '<div class="hs-tabs"><button class="hs-tab' + (sekme === "kayit" ? " on" : "") + '" data-hs="sekme-kayit">Kayıt Ol</button><button class="hs-tab' + (sekme === "giris" ? " on" : "") + '" data-hs="sekme-giris">Giriş Yap</button></div>';
    if (sekme === "kayit") {
      h += '<div class="hs-kicker">Hızlı Kayıt (Önerilen)</div>' +
        '<div class="hs-social"><button class="hs-google" data-hs="google">🌐 Google ile devam et</button><button class="hs-facebook" data-hs="facebook">f Facebook ile devam et</button></div>' +
        '<input class="hs-in" id="hs-e" type="text" autocomplete="email" placeholder="E-posta veya telefon">' +
        '<input class="hs-in" id="hs-p" type="password" autocomplete="new-password" placeholder="Şifre (en az 6 karakter)">' +
        '<input class="hs-in" id="hs-a" maxlength="18" autocomplete="username" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Kullanıcı adı">' +
        '<button class="hs-bt" data-hs="kayit">Kayıt Ol</button>' +
        '<div class="hs-safe">🛡️ Hesabın güvende, puanların ve ilerlemen korunur.</div>';
    } else {
      h += '<div class="hs-kicker">Hesabına Giriş Yap</div>' +
        '<div class="hs-social"><button class="hs-google" data-hs="google">🌐 Google ile giriş yap</button><button class="hs-facebook" data-hs="facebook">f Facebook ile giriş yap</button></div>' +
        '<div class="hs-kicker">veya</div>' +
        '<input class="hs-in" id="hs-e" type="text" autocomplete="username" placeholder="E-posta, telefon veya kullanıcı adı">' +
        '<input class="hs-in" id="hs-p" type="password" autocomplete="current-password" placeholder="Şifre">' +
        '<div class="hs-loginrow"><label class="hs-remember"><input type="checkbox" id="hs-remember"> Beni hatırla</label><button class="hs-l" data-hs="unuttum">Şifremi unuttum?</button></div>' +
        '<button class="hs-bt" data-hs="giris">Giriş Yap</button>' +
        '<div class="hs-safe">🛡️ Hesabın güvende, puanların ve ilerlemen korunur.</div>';
    }
    h += '<div id="hs-recaptcha" class="hs-recaptcha"></div>';
    if (telefonOnay) h += '<input class="hs-in" id="hs-kod" inputmode="numeric" autocomplete="one-time-code" placeholder="SMS doğrulama kodu"><button class="hs-bt" data-hs="telefon-kod">Kodu doğrula</button>';
    return h;
  }
  function hesapHtml(u) { return ayar ? '<button class="hs-l" data-hs="profil">← Profile dön</button>' + ayarHtml(u) : profilHtml(u); }
  function profilHtml(u) {
    var ad = kayit && kayit.ad ? kayit.ad : "Oyuncu", P = window.Puan, satir = "";
    if (P) Object.keys(P.tablo).map(function (o) { return { ad: P.tablo[o].ad, p: P.oyunPuani(o) }; })
      .sort(function (a, b) { return b.p - a.p; })
      .forEach(function (x) { satir += '<div class="hs-r"><span>' + esc(x.ad) + "</span><b>" + x.p + "</b></div>"; });
    return '<div class="hs-pf"><div class="hs-av">' + esc(ad.charAt(0).toLocaleUpperCase("tr")) + '</div><div class="hs-pn">' + esc(ad) + "</div>" +
      '<div class="hs-k">' + (u.email ? '📧 ' + esc(u.email) + (u.emailVerified ? ' ✓ doğrulandı' : ' (doğrulanmadı)') : '📱 ' + esc(u.phoneNumber || '')) + "</div></div>" +
      '<div class="hs-top">⭐ Toplam puan <b>' + (P ? P.toplam() : 0) + "</b></div>" + satir +
      '<button class="hs-bt gri" data-hs="ayar">⚙️ Hesap ayarları</button>';
  }
  function ayarHtml(u) {
    var h = (u.email ? '<div class="hs-s">📧 <b>' + esc(u.email) + '</b> ' + (u.emailVerified ? '✓ doğrulandı' : '(doğrulanmadı)') + '</div>' : '<div class="hs-s">📱 <b>' + esc(u.phoneNumber || '') + '</b> ✓ doğrulandı</div>') +
      '<div class="hs-s">👤 Kullanıcı adın: <b>' + esc(kayit && kayit.ad ? kayit.ad : 'henüz seçilmedi') + '</b></div>';
    if (u.email && !u.emailVerified) h += '<button class="hs-bt gri" data-hs="dogrula-gonder">Doğrulama mailini tekrar gönder</button><button class="hs-bt gri" data-hs="dogrula-kontrol">Doğruladım, kontrol et</button>';
    h += '<input class="hs-in" id="hs-a" maxlength="18" autocomplete="off" autocapitalize="words" autocorrect="off" spellcheck="false" placeholder="' + (kayit && kayit.ad ? "Yeni kullanıcı adı" : "Kullanıcı adı seç") + '">' +
      '<button class="hs-bt" data-hs="ad-kaydet">Adı Kaydet</button>';
    return h + '<button class="hs-bt kirmizi" data-hs="cikis">Çıkış yap</button>';
  }
  function render() {
    if (!el || !el.classList.contains("show")) return;
    var u = A.currentUser, b = el.querySelector(".hs-body");
    var eski = {}; ["hs-e", "hs-a", "hs-kod"].forEach(function (id) { var x = document.getElementById(id); if (x) eski[id] = x.value; });
    var h = msg ? '<div class="hs-msg' + (msgOk ? " ok" : "") + '">' + esc(msg) + "</div>" : "";
    h += !u ? '<div class="hs-k">Bağlanıyor…</div>' : u.isAnonymous ? misafirHtml() : hesapHtml(u);
    b.innerHTML = h;
    for (var id in eski) { var x = document.getElementById(id); if (x) x.value = eski[id]; }
  }
  function mesaj(m, ok) { msg = m || ""; msgOk = !!ok; render(); }

  function isle(p, okMsg) {
    if (busy) return;
    busy = true; mesaj("");
    p.then(function () { if (okMsg) mesaj(okMsg, true); else render(); }, function (e) { mesaj(hataYaz(e), false); }).then(function () { busy = false; });
  }
  function val(id) { var x = document.getElementById(id); return x ? x.value : ""; }

  function tikla(e) {
    var b = e.target.closest("[data-hs]"); if (!b) return;
    var a = b.getAttribute("data-hs"), u = A.currentUser;
    if (a === "ayar") { ayar = true; msg = ""; render(); }
    else if (a === "profil") { ayar = false; msg = ""; render(); }
    else if (a === "sekme-kayit") { sekme = "kayit"; msg = ""; render(); }
    else if (a === "sekme-giris") { sekme = "giris"; telefonOnay = null; msg = ""; render(); }
    else if (a === "google" || a === "facebook") isle(sosyalGiris(a));
    else if (a === "kayit") {
      var regId = val("hs-e").trim();
      if (/^\+?[0-9 ()-]{8,}$/.test(regId)) isle(telefonKodGonder(regId, "kayit"));
      else isle(kayitOl(regId, val("hs-p"), val("hs-a").trim()).then(function () { render(); }));
    }
    else if (a === "giris") {
      var loginId = val("hs-e").trim();
      if (/^\+?[0-9 ()-]{8,}$/.test(loginId)) isle(telefonKodGonder(loginId, "giris"));
      else isle(girisYap(loginId, val("hs-p")));
    }
    else if (a === "telefon-kod") isle(telefonKoduDogrula(val("hs-kod")));
    else if (a === "unuttum") {
      var m = val("hs-e").trim();
      if (!m || m.indexOf("@") < 0) { mesaj("Şifre yenilemek için e-posta adresini yaz."); return; }
      isle(A.sendPasswordResetEmail(m), "Şifre yenileme bağlantısı e-postana gönderildi.");
    }
    else if (a === "ad-kaydet") {
      var ad = val("hs-a").trim(), h = adDogrula(ad, sahipMi(u));
      if (h) { mesaj(h); return; }
      isle(adAl(ad), "Kullanıcı adın kaydedildi: " + ad);
    }
    else if (a === "dogrula-gonder" && u) isle(u.sendEmailVerification(), "Doğrulama maili gönderildi. Gelen kutunu (ve spam'i) kontrol et.");
    else if (a === "dogrula-kontrol" && u) isle(u.reload().then(function () { return A.currentUser.getIdToken(true); }).then(function () {
      if (!A.currentUser.emailVerified) throw { ozel: "E-posta henüz doğrulanmamış görünüyor." };
    }), "E-postan doğrulandı ✓");
    else if (a === "cikis") {
      if (window.confirm("Çıkış yapılsın mı? Bu cihazdaki ilerleme sıfırlanır; hesabına tekrar girince geri gelir.")) isle(cikisYap());
    }
  }

  function ac() {
    if (!el) {
      el = document.createElement("div"); el.className = "hs-ov";
      el.innerHTML = '<div class="hs-kt"><div class="hs-ph"><b>👤 Profil</b><button class="hs-x">✕</button></div><div class="hs-body"></div></div>';
      document.body.appendChild(el);
      el.querySelector(".hs-x").onclick = function () { el.classList.remove("show"); };
      el.querySelector(".hs-body").addEventListener("click", tikla);
    }
    msg = ""; ayar = false; el.classList.add("show"); render();
  }


  // ---------- sayaçlar (HEPSİ GERÇEK SAYI): iki uygulamanın TOPLAMI ----------
  // çevrimiçi · bugün oynanan oyun · bu hafta oynanan oyun (yalnızca Arena verisi).
  var APPLER = [APP];
  var sayacEl = null, onSay = {}, gunSay = {}, haftaSay = {}, sayacBasladi = false;
  var gunKey = "", haftaKey = "", dinle = [], sonEl = null;
  function fmt(n) { return (n || 0).toLocaleString("tr-TR"); }
  function ymd(d) { return String(d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate()); }
  // Türkiye saatine göre gün (YYYYMMDD) ve haftanın pazartesisi (YYYYMMDD)
  function anahtarlar() {
    var d = new Date(Date.now() + 3 * 3600 * 1000);
    var pzt = new Date(d.getTime() - ((d.getUTCDay() + 6) % 7) * 86400000);
    return { gun: ymd(d), hafta: ymd(pzt) };
  }
  // her uygulamanın değerini topla; hiçbiri okunamadıysa false ("–"), henüz gelmediyse null ("…")
  function topla(o) {
    var t = 0, yuk = 0, hata = 0;
    APPLER.forEach(function (a) { var v = o[a]; if (v === false) hata++; else if (v != null) { t += v; yuk++; } });
    return yuk ? t : (hata === APPLER.length ? false : null);
  }
  function sayacYaz() {
    if (!sayacEl) return;
    var n = function (v) { return v === false ? "–" : v == null ? "…" : fmt(v); };
    var on = topla(onSay);
    sayacEl.innerHTML = '<div class="hs-r1"><span><i class="hs-on"></i><b>' + n(on == null || on === false ? on : Math.max(on, 1)) + "</b> çevrimiçi</span></div>" +
      '<div class="hs-r2"><span>🎮 Bugün <b>' + n(topla(gunSay)) + "</b> oyun</span>" +
      '<span>📅 Bu hafta <b>' + n(topla(haftaSay)) + "</b> oyun</span></div>";
  }
  function sayacKur() {
    var ana = document.getElementById("ana"); if (!ana || sayacEl) return;
    var c2 = document.createElement("style");
    c2.textContent = ".hs-say{position:fixed;left:0;right:0;top:calc(var(--bas-yuk,58px) + env(safe-area-inset-top) + 4px);z-index:30;display:none;flex-direction:column;align-items:center;gap:8px;pointer-events:none}" +
      ".hs-say.show{display:flex}.hs-say span{display:flex;align-items:center;justify-content:center;box-sizing:border-box;min-height:38px;background:rgba(16,26,56,.95);border:2px solid #3a4c92;border-radius:999px;padding:7px 14px;color:#cfd8ff;font:600 15px/1.1 system-ui,sans-serif;white-space:nowrap;text-align:center}.hs-say b{color:#fff;margin:0 .25em}.hs-r1{display:flex;justify-content:center}.hs-r1 span{min-width:150px}.hs-r2{display:grid;grid-template-columns:1fr 1fr;gap:10px;width:min(calc(100vw - 32px),460px)}.hs-r2 span{padding-left:6px;padding-right:6px;font-size:14.5px}" +
      ".hs-on{display:inline-block;width:8px;height:8px;border-radius:50%;background:#22c55e;margin-right:5px}";
    document.head.appendChild(c2);
    sayacEl = document.createElement("div"); sayacEl.className = "hs-say"; document.body.appendChild(sayacEl);
    function g() { sayacEl.classList.toggle("show", !ana.classList.contains("hidden")); }
    new MutationObserver(g).observe(ana, { attributes: true, attributeFilter: ["class"] }); g();
    sayacYaz();
  }
  function oku(ref, hedef, a) {
    ref.on("value", function (s) { hedef[a] = s.val() || 0; sayacYaz(); },
      function (e) { hedef[a] = false; sayacYaz(); try { console.warn("Sayaç okunamadı:", e && e.message); } catch (x) {} });
    dinle.push(ref);
  }
  // gün ya da hafta değişince dinleyicileri yenile
  function izle() {
    var k = anahtarlar();
    if (k.gun === gunKey && k.hafta === haftaKey) return;
    for (var i = 0; i < dinle.length; i++) dinle[i].off();
    dinle = []; gunSay = {}; haftaSay = {};
    gunKey = k.gun; haftaKey = k.hafta;
    APPLER.forEach(function (a) {
      oku(db.ref("apps/" + a + "/oyunSayi/" + gunKey), gunSay, a);
      oku(db.ref("apps/" + a + "/haftaOyun/" + haftaKey), haftaSay, a);
    });
    sayacYaz();
  }
  // bitmiş her oyun: kendi uygulamamızın günlük ve haftalık oyun sayacına +1
  function oyunKaydet(n) {
    var u = A.currentUser; if (!u) return;
    var k = anahtarlar(), kok = "apps/" + APP + "/";
    function artir(v) { return (v || 0) + 1; }
    for (var i = 0; i < n; i++) {
      db.ref(kok + "oyunSayi/" + k.gun).transaction(artir).catch(noop);
      db.ref(kok + "haftaOyun/" + k.hafta).transaction(artir).catch(noop);
    }
  }
  function PuanNesnesi() { try { return typeof Puan !== "undefined" ? Puan : window.Puan; } catch (e) { return window.Puan; } }
  function elToplam() {
    try { var e = PuanNesnesi().eller(), t = 0; for (var k in e) t += +e[k] || 0; return t; } catch (x) { return null; }
  }
  // puan sistemi hazır olunca: toplam el sayısı artarsa bir oyun bitmiş demektir
  function oyunKancasi() {
    var dene = 0, t = setInterval(function () {
      var P = PuanNesnesi();
      if (P && P.degisti && P.eller) {
        clearInterval(t);
        sonEl = elToplam();
        P.degisti(function () {
          var yeni = elToplam(); if (yeni == null) return;
          if (sonEl != null && yeni > sonEl) oyunKaydet(Math.min(yeni - sonEl, 3));
          sonEl = yeni;
        });
      } else if (++dene > 40) clearInterval(t);
    }, 500);
  }
  function sayacBaslat(uid) {
    if (sayacBasladi) return;
    sayacBasladi = true;
    APPLER.forEach(function (a) {
      db.ref("apps/" + a + "/cevrimici").on("value", function (s) { onSay[a] = Math.max(0, s.val() || 0); sayacYaz(); }, function () { onSay[a] = false; sayacYaz(); });
    });
    izle(); setInterval(izle, 60000);
    oyunKancasi();
  }
  sayacKur();

  // ---------- hesap kaydını izle, adı oyuna yansıt ----------
  function esitle() {
    var E = window.Ekonomi; if (!E || !E.adAyarla) return;
    if (kayit && kayit.ad) { if (E.ad() !== kayit.ad) E.adAyarla(kayit.ad); }
    else if (!/^Oyuncu[0-9]{4}$/.test(E.ad())) E.adAyarla("Oyuncu" + (1000 + Math.floor(Math.random() * 9000))); // eski serbest adlar geçersiz
  }
  A.onAuthStateChanged(function (u) {
    if (hesapRef) { hesapRef.off(); hesapRef = null; }
    kayit = null;
    if (!u) { render(); return; }
    sayacBaslat(u.uid);
    hesapRef = db.ref("hesap/" + u.uid);
    hesapRef.on("value", function (s) { kayit = s.val(); esitle(); render(); }, noop);
  });

  window.Hesap = { ac: ac, adDogrula: adDogrula };
})();
