// ARENA - Google / Facebook ile giriş (misafir hesabı bağlama)
// Mevcut anonim hesap Google/Facebook'a BAĞLANIR: uid değişmez, puan/sıralama/düello kaybolmaz.
// Hesap daha önce kullanılmışsa o hesaba geçilir.
(function () {
  "use strict";

  function toast(m) {
    var t = document.createElement("div");
    t.textContent = m;
    t.style.cssText = "position:fixed;left:50%;bottom:calc(70px + env(safe-area-inset-bottom));transform:translateX(-50%);max-width:86vw;background:#111a3a;color:#fff;border:1px solid #3b4a86;border-radius:14px;padding:10px 16px;font:600 14px system-ui,sans-serif;z-index:100001;text-align:center";
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 3500);
  }

  var cap = window.Capacitor;
  var nativeApp = !!(cap && (cap.isNativePlatform ? cap.isNativePlatform() : true));
  function nativePlugin() {
    return cap && cap.Plugins && cap.Plugins.FirebaseAuthentication;
  }

  function auth() { return firebase.auth(); }

  // ---------- giriş mantığı ----------
  function saglayici(ad) {
    var p = ad === "google" ? new firebase.auth.GoogleAuthProvider() : new firebase.auth.FacebookAuthProvider();
    if (ad === "facebook") { p.addScope("email"); }
    return p;
  }

  // Web: popup ile. Native APK: Capacitor eklentisi ile kimlik bilgisi alınır.
  function kimlikAl(ad) {
    if (nativeApp) {
      var pl = nativePlugin();
      if (!pl) return Promise.reject({ code: "arena/eklenti-yok" });
      var islem = ad === "google" ? pl.signInWithGoogle({ skipNativeAuth: true }) : pl.signInWithFacebook({ skipNativeAuth: true });
      return islem.then(function (r) {
        var c = (r && r.credential) || {};
        if (ad === "google") return firebase.auth.GoogleAuthProvider.credential(c.idToken || null, c.accessToken || null);
        return firebase.auth.FacebookAuthProvider.credential(c.accessToken);
      });
    }
    return Promise.resolve(null); // web: popup kullanılacak
  }

  function giris(ad) {
    var u = auth().currentUser;
    var p = saglayici(ad);
    var islem;
    if (nativeApp) {
      islem = kimlikAl(ad).then(function (cred) {
        return u ? u.linkWithCredential(cred) : auth().signInWithCredential(cred);
      });
    } else {
      // Popup doğrudan dokunma olayında çağrılır; Chrome/Samsung Internet kullanıcı hareketini kaybetmez.
      islem = u ? u.linkWithPopup(p) : auth().signInWithPopup(p);
    }
    return islem.then(function () {
      toast("Giriş yapıldı ✅");
      kapat();
    }).catch(function (e) {
      var kod = e && e.code;
      if (kod === "auth/credential-already-in-use" && e.credential) {
        if (!confirm("Bu hesap daha önce kullanılmış. Giriş yaparsan o hesabın ilerlemesi gelir. Devam edilsin mi?")) return;
        return auth().signInWithCredential(e.credential).then(function () { location.reload(); });
      }
      if (kod === "auth/email-already-in-use" || kod === "auth/account-exists-with-different-credential") {
        toast("Bu e-posta başka bir yöntemle kayıtlı. Önce o yöntemle (Google/Facebook) giriş yap.");
        return;
      }
      if (kod === "auth/popup-closed-by-user" || kod === "auth/cancelled-popup-request") return;
      if (kod === "auth/popup-blocked") { toast("Açılır pencere engellendi. Tarayıcıda izin ver."); return; }
      if (kod === "arena/eklenti-yok") { toast("Bu giriş için uygulamayı güncellemen gerekiyor."); return; }
      try { console.warn("Giriş hatası:", kod, e && e.message); } catch (x) {}
      toast("Giriş yapılamadı" + (kod ? " (" + kod + ")" : ""));
    });
  }

  function cikis() {
    var pl = nativeApp && nativePlugin();
    var son = function () { return auth().signOut(); };
    (pl ? pl.signOut().catch(function () {}) : Promise.resolve()).then(son).then(function () { location.reload(); });
  }

  // ---------- arayüz: yalnızca sol alttaki oyuncu kutusundan açılır ----------
  var stl = document.createElement("style");
  stl.textContent =
    "#arGirKutu{position:fixed;inset:0;z-index:100100;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.72);padding:16px;box-sizing:border-box}" +
    "#arGirKutu.ac{display:flex}" +
    "#arGirKutu .k{width:min(100%,380px);max-height:calc(100% - 24px);overflow:auto;box-sizing:border-box;background:#0e1633;color:#fff;border:1px solid #3b4a86;border-radius:20px;padding:20px;font-family:system-ui,sans-serif;text-align:center}" +
    "#arGirKutu h3{margin:0 0 8px;font-size:22px}#arGirKutu p{margin:0 0 14px;font-size:14px;line-height:1.4;opacity:.82;overflow-wrap:anywhere}" +
    "#arGirKutu button{display:block;width:100%;margin-top:10px;min-height:48px;padding:10px;border-radius:14px;border:0;font:700 16px system-ui,sans-serif;cursor:pointer}" +
    "#arGirKutu .g{background:#fff;color:#222}#arGirKutu .f{background:#1877f2;color:#fff}" +
    "#arGirKutu .e{background:#3b5bd6;color:#fff}#arGirKutu .c{background:#a33;color:#fff}#arGirKutu .x{background:transparent;color:#9fb0ff;min-height:38px}";
  document.head.appendChild(stl);

  var kutu = document.createElement("div");
  kutu.id = "arGirKutu";
  document.body.appendChild(kutu);
  function kapat() { kutu.classList.remove("ac"); }
  kutu.addEventListener("click", function (e) { if (e.target === kutu) kapat(); });

  function ac() {
    var u = auth().currentUser;
    var bagli = !!(u && !u.isAnonymous);
    if (bagli) {
      kutu.innerHTML = '<div class="k"><h3>Hesabın</h3><p>' +
        (u.displayName || "Hesap") + (u.email ? "<br>" + u.email : (u.phoneNumber ? "<br>" + u.phoneNumber : "")) +
        '</p><button class="e" id="arProfil">Profil ve hesap ayarları</button><button class="c" id="arCik">Çıkış yap</button><button class="x" id="arKapa">Kapat</button></div>';
      document.getElementById("arProfil").onclick = function () {
        kapat(); if (window.Hesap && window.Hesap.ac) window.Hesap.ac();
      };
      document.getElementById("arCik").onclick = function () { kapat(); cikis(); };
    } else {
      kutu.innerHTML = '<div class="k"><h3>Hesabına bağlan</h3><p>İlerlemeni hesabına bağla; başka telefonda da devam et.</p>' +
        '<button class="g" id="arG">Google ile devam et</button><button class="f" id="arF">Facebook ile devam et</button>' +
        '<button class="e" id="arE">E-posta ile kayıt / giriş</button>' +
        '<button class="x" id="arKapa">Şimdi değil</button></div>';
      // Sağlayıcı işlemi doğrudan gerçek tıklama içinde başlatılır; mobil tarayıcı popup engelini azaltır.
      document.getElementById("arG").onclick = function () { giris("google"); };
      document.getElementById("arF").onclick = function () { giris("facebook"); };
      document.getElementById("arE").onclick = function () {
        kapat(); if (window.Hesap && window.Hesap.ac) window.Hesap.ac();
        else toast("E-posta hesap ekranı yükleniyor. Birkaç saniye sonra tekrar dene.");
      };
    }
    document.getElementById("arKapa").onclick = kapat;
    kutu.classList.add("ac");
  }
  window.ArenaAuth = { ac: ac, kapat: kapat };

  // Firebase arena.js tarafından başlatılır; hazır olunca oturum değişikliklerini izle.
  var deneme = 0;
  (function bekle() {
    if (window.firebase && firebase.apps && firebase.apps.length) {
      auth().onAuthStateChanged(function () { if (kutu.classList.contains("ac")) ac(); });
    } else if (deneme++ < 100) setTimeout(bekle, 200);
  })();
})();
