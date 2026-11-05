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
    return kimlikAl(ad).then(function (cred) {
      if (cred) return u ? u.linkWithCredential(cred) : auth().signInWithCredential(cred);
      return u ? u.linkWithPopup(p) : auth().signInWithPopup(p);
    }).then(function () {
      toast("Giriş yapıldı ✅");
      yenile();
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

  // ---------- arayüz ----------
  var stl = document.createElement("style");
  stl.textContent =
    "#arGirBtn{position:fixed;top:calc(8px + env(safe-area-inset-top));right:10px;z-index:9000;height:40px;min-width:40px;padding:0 12px;border-radius:20px;border:1px solid #3b4a86;background:#111a3a;color:#fff;font:700 14px system-ui,sans-serif}" +
    "#arGirBtn:active{opacity:.7}body:has(#ana.hidden) #arGirBtn{display:none}" +
    "#arGirKutu{position:fixed;inset:0;z-index:100000;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.6)}" +
    "#arGirKutu.ac{display:flex}" +
    "#arGirKutu .k{width:min(86vw,340px);background:#0e1633;color:#fff;border:1px solid #3b4a86;border-radius:20px;padding:20px;font-family:system-ui,sans-serif;text-align:center}" +
    "#arGirKutu h3{margin:0 0 6px;font-size:20px}#arGirKutu p{margin:0 0 14px;font-size:13px;opacity:.75}" +
    "#arGirKutu button{display:block;width:100%;margin-top:10px;height:48px;border-radius:14px;border:0;font:700 16px system-ui,sans-serif}" +
    "#arGirKutu .g{background:#fff;color:#222}#arGirKutu .f{background:#1877f2;color:#fff}" +
    "#arGirKutu .c{background:#a33;color:#fff}#arGirKutu .x{background:transparent;color:#9fb0ff;height:36px}";
  document.head.appendChild(stl);

  var btn = document.createElement("button");
  btn.id = "arGirBtn";
  btn.textContent = "👤 Giriş";
  var kutu = document.createElement("div");
  kutu.id = "arGirKutu";
  document.body.appendChild(btn);
  document.body.appendChild(kutu);

  function kapat() { kutu.classList.remove("ac"); }
  kutu.addEventListener("click", function (e) { if (e.target === kutu) kapat(); });

  function girisliMi() {
    var u = auth().currentUser;
    return !!(u && !u.isAnonymous);
  }

  function yenile() {
    var u = auth().currentUser;
    var gl = !!(u && !u.isAnonymous);
    btn.textContent = gl ? "👤 " + (u.displayName ? u.displayName.split(" ")[0] : "Hesap") : "👤 Giriş";
  }

  function ac() {
    var u = auth().currentUser;
    if (girisliMi()) {
      kutu.innerHTML = '<div class="k"><h3>Hesabın</h3><p>' + (u.displayName || "") + (u.email ? "<br>" + u.email : "") +
        '</p><button class="c" id="arCik">Çıkış yap</button><button class="x" id="arKapa">Kapat</button></div>';
      document.getElementById("arCik").onclick = function () { kapat(); cikis(); };
    } else {
      kutu.innerHTML = '<div class="k"><h3>Giriş yap</h3><p>İlerlemen kaybolmaz, hesabına bağlanır. Başka telefonda da devam edebilirsin.</p>' +
        '<button class="g" id="arG">Google ile devam et</button><button class="f" id="arF">Facebook ile devam et</button>' +
        '<button class="x" id="arKapa">Şimdi değil</button></div>';
      document.getElementById("arG").onclick = function () { kapat(); giris("google"); };
      document.getElementById("arF").onclick = function () { kapat(); giris("facebook"); };
    }
    document.getElementById("arKapa").onclick = kapat;
    kutu.classList.add("ac");
  }
  btn.onclick = ac;

  // Firebase arena.js tarafından başlatılır; hazır olunca dinlemeye başla
  var deneme = 0;
  (function bekle() {
    if (window.firebase && firebase.apps && firebase.apps.length) {
      auth().onAuthStateChanged(yenile);
      yenile();
    } else if (deneme++ < 100) {
      setTimeout(bekle, 200);
    }
  })();
})();
