// hesap.js: E-POSTA İLE HESAP + BENZERSİZ KULLANICI ADI
// ekonomi.js bu dosyayı sayfa yüklenince kendisi ekler (index.html'e dokunmana gerek yok).
// Kurallar: 3-18 karakter · ilk harf büyük · ilk harften sonra en fazla 1 büyük harf daha ·
// sadece a-z, 0-9, _ (Türkçe karakter yok) · adlar büyük/küçük harf fark etmeksizin tektir · 15 günde bir değişir.
(function () {
  "use strict";
  if (typeof firebase === "undefined" || !firebase.apps || !firebase.apps.length) return; // Firebase kurulu değilse eski yöntem kalır
  var A = firebase.auth(), db = firebase.database();
  var APP = window.ARENA_APP || "arena";
  var GUN15 = 15 * 24 * 3600 * 1000;
  var REZERVE = ["fk1453", "fatih", "fatih_", "fatihkoc81", "fatihkoc7", "estergon", "hatice", "haticekoc81", "haticekoc1", "haticekoc7"];
  var kayit = null, hesapRef = null, el = null, sekme = "kayit", msg = "", msgOk = false, busy = false;

  function noop() {}
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function UYG() { return (window.Ekonomi && window.Ekonomi.UYG) || ""; }

  // ---------- ad kuralları ----------
  function adDogrula(v) {
    if (!v) return "Kullanıcı adı yaz.";
    if (v.length < 3 || v.length > 18) return "Ad 3-18 karakter olmalı.";
    if (/[^A-Za-z0-9_]/.test(v)) return "Sadece İngilizce harf (a-z), rakam ve _ kullanılabilir. Türkçe karakter (ç ğ ı ö ş ü), boşluk ve işaret olmaz.";
    if (!/^[A-Z]/.test(v)) return "İlk harf büyük harf olmalı.";
    if ((v.match(/[A-Z]/g) || []).length > 2) return "İlk harften sonra en fazla bir büyük harf daha olabilir.";
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
      "auth/operation-not-allowed": "E-posta girişi Firebase'de kapalı: Authentication > Sign-in method > Email/Password'ü aç."
    };
    if (t[c]) return t[c];
    if (/permission_denied/i.test(c + " " + m)) return "İzin verilmedi: ad alınmış olabilir ya da Firebase kuralları henüz yayınlanmamış.";
    return "Hata: " + (m || c || "bilinmeyen");
  }

  // ---------- ad alma (rezerve et + kaydet + eskisini bırak) ----------
  function sonrakiTarih() { return kayit && kayit.adT ? kayit.adT + GUN15 : 0; }

  function adAl(ad) {
    var u = A.currentUser, lower = ad.toLowerCase();
    var eski = kayit && kayit.ad ? kayit.ad.toLowerCase() : null;
    var yeniAlindi = false;
    if (!u || !u.email) return Promise.reject({ ozel: "Önce e-postayla kayıt ol." });
    if (kayit && kayit.ad === ad) return Promise.reject({ ozel: "Zaten bu adı kullanıyorsun." });
    if (sonrakiTarih() > Date.now()) return Promise.reject({ ozel: "Adını " + new Date(sonrakiTarih()).toLocaleDateString("tr-TR") + " tarihinden sonra değiştirebilirsin." });
    return db.ref("adlar/" + lower).once("value").then(function (s) {
      if (s.exists() && s.val() !== u.uid) throw { ozel: "Bu ad alınmış, başka bir ad dene." };
      if (s.val() === u.uid) return;
      yeniAlindi = true;
      return db.ref("adlar/" + lower).set(u.uid).catch(function (e) {
        if (rezerveMi(lower)) throw { ozel: "“" + ad + "” rezerve edilmiş bir ad." + (u.emailVerified ? "" : " Sahibiysen önce e-postanı doğrula.") };
        throw e;
      });
    }).then(function () {
      return db.ref("hesap/" + u.uid).set({ ad: ad, adT: firebase.database.ServerValue.TIMESTAMP }).catch(function (e) {
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
    if (!email || !pw) return Promise.reject({ ozel: "E-posta ve şifreyi yaz." });
    var g = A.currentUser, eskiUid = g && !g.email ? g.uid : null;
    // misafir kaydı sıralamada hayalet kalmasın
    var temizle = eskiUid ? db.ref("apps/" + APP + "/users/" + eskiUid).remove().catch(noop) : Promise.resolve();
    return temizle.then(function () { return A.signInWithEmailAndPassword(email, pw); }).then(function (c) {
      return birlestir(c.user.uid);
    }).then(function () { location.reload(); });
  }

  function cikisYap() {
    try { localStorage.removeItem(UYG() + "arenaEller"); localStorage.removeItem(UYG() + "cemberAd"); } catch (e) {}
    return A.signOut().then(function () { location.reload(); });
  }

  // ---------- görünüm ----------
  var css = document.createElement("style");
  css.textContent =
    ".hs-ov{position:fixed;inset:0;z-index:100020;background:rgba(0,0,0,.78);display:none;align-items:center;justify-content:center;font-family:system-ui,sans-serif;padding:12px;box-sizing:border-box}" +
    ".hs-ov.show{display:flex}" +
    ".hs-kt{width:min(100%,440px);max-height:100%;overflow:auto;background:#101a38;border:2px solid #4a5a9a;border-radius:18px;color:#fff;box-sizing:border-box;-webkit-overflow-scrolling:touch}" +
    ".hs-ph{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;font-size:19px;border-bottom:1px solid #1d2540}" +
    ".hs-x{border:0;background:#222f45;color:#fff;border-radius:10px;width:36px;height:36px;font-size:17px;cursor:pointer}" +
    ".hs-body{padding:12px 14px 16px}" +
    ".hs-tabs{display:flex;gap:6px;margin-bottom:10px}" +
    ".hs-tab{flex:1;border:2px solid #4a5a9a;background:#0b1230;color:#8e9bc4;border-radius:12px;padding:9px 2px;font:700 14px system-ui,sans-serif;cursor:pointer}.hs-tab.on{background:#3b5bd6;color:#fff;border-color:#7d97ff}" +
    ".hs-in{display:block;width:100%;box-sizing:border-box;margin:6px 0;padding:12px;border-radius:12px;border:2px solid #2b3a72;background:#0b1230;color:#fff;font:16px system-ui,sans-serif}" +
    ".hs-bt{display:block;width:100%;border:0;border-radius:14px;padding:13px;margin:8px 0;font:800 16px system-ui,sans-serif;color:#fff;background:#3b5bd6;cursor:pointer}.hs-bt.gri{background:#6b7280}.hs-bt.kirmizi{background:#a3231c}.hs-bt[disabled]{opacity:.4}" +
    ".hs-s{margin:6px 0;font-size:15px;word-break:break-all}.hs-k{font-size:12.5px;color:#8e9bc4;line-height:1.45;margin:6px 0}" +
    ".hs-msg{background:#3a1212;border:1px solid #a3231c;border-radius:12px;padding:9px 11px;margin-bottom:10px;font-size:14px;line-height:1.4}.hs-msg.ok{background:#0f2e17;border-color:#2fb81a}" +
    ".hs-l{background:none;border:0;color:#7d97ff;font:600 14px system-ui,sans-serif;padding:6px 0;cursor:pointer;text-decoration:underline}";
  document.head.appendChild(css);

  var KURAL = "3-18 karakter · ilk harf büyük · ilk harften sonra en fazla 1 büyük harf daha · sadece a-z, 0-9 ve _ (Türkçe karakter yok) · herkesin adı farklı olur · 15 günde bir değişir.";

  function misafirHtml() {
    var h = '<div class="hs-tabs"><button class="hs-tab' + (sekme === "kayit" ? " on" : "") + '" data-hs="sekme-kayit">Kayıt ol</button><button class="hs-tab' + (sekme === "giris" ? " on" : "") + '" data-hs="sekme-giris">Giriş yap</button></div>';
    if (sekme === "kayit") {
      h += '<div class="hs-k">E-postayla kayıt ol: puanların ve adın senin olur, başka telefondan da girebilirsin.</div>' +
        '<input class="hs-in" id="hs-e" type="email" autocomplete="email" placeholder="E-posta">' +
        '<input class="hs-in" id="hs-p" type="password" autocomplete="new-password" placeholder="Şifre (en az 6 karakter)">' +
        '<input class="hs-in" id="hs-a" maxlength="18" autocomplete="off" autocapitalize="words" autocorrect="off" spellcheck="false" placeholder="Kullanıcı adı">' +
        '<div class="hs-k">' + KURAL + "</div>" +
        '<button class="hs-bt" data-hs="kayit">Kayıt Ol</button>';
    } else {
      h += '<input class="hs-in" id="hs-e" type="email" autocomplete="email" placeholder="E-posta">' +
        '<input class="hs-in" id="hs-p" type="password" autocomplete="current-password" placeholder="Şifre">' +
        '<button class="hs-bt" data-hs="giris">Giriş Yap</button>' +
        '<button class="hs-l" data-hs="unuttum">Şifremi unuttum</button>' +
        '<div class="hs-k">Giriş yapınca bu cihazdaki misafir ilerlemesi hesabındaki ilerlemeyle birleşir (her oyunda yüksek olan kalır).</div>';
    }
    return h;
  }
  function hesapHtml(u) {
    var h = '<div class="hs-s">📧 <b>' + esc(u.email) + "</b> " + (u.emailVerified ? "✓ doğrulandı" : "(doğrulanmadı)") + "</div>" +
      '<div class="hs-s">👤 Kullanıcı adın: <b>' + esc(kayit && kayit.ad ? kayit.ad : "henüz seçilmedi") + "</b></div>";
    if (!u.emailVerified) h += '<button class="hs-bt gri" data-hs="dogrula-gonder">Doğrulama mailini tekrar gönder</button><button class="hs-bt gri" data-hs="dogrula-kontrol">Doğruladım, kontrol et</button>';
    var bekle = sonrakiTarih() > Date.now();
    if (bekle) h += '<div class="hs-k">Adını <b>' + esc(new Date(sonrakiTarih()).toLocaleDateString("tr-TR")) + "</b> tarihinden sonra değiştirebilirsin.</div>";
    else h += '<input class="hs-in" id="hs-a" maxlength="18" autocomplete="off" autocapitalize="words" autocorrect="off" spellcheck="false" placeholder="' + (kayit && kayit.ad ? "Yeni kullanıcı adı" : "Kullanıcı adı seç") + '">' +
      '<div class="hs-k">' + KURAL + '</div><button class="hs-bt" data-hs="ad-kaydet">Adı Kaydet</button>';
    return h + '<button class="hs-bt kirmizi" data-hs="cikis">Çıkış yap</button>';
  }
  function render() {
    if (!el || !el.classList.contains("show")) return;
    var u = A.currentUser, b = el.querySelector(".hs-body");
    var eski = {}; ["hs-e", "hs-a"].forEach(function (id) { var x = document.getElementById(id); if (x) eski[id] = x.value; });
    var h = msg ? '<div class="hs-msg' + (msgOk ? " ok" : "") + '">' + esc(msg) + "</div>" : "";
    h += !u ? '<div class="hs-k">Bağlanıyor…</div>' : !u.email ? misafirHtml() : hesapHtml(u);
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
    if (a === "sekme-kayit") { sekme = "kayit"; msg = ""; render(); }
    else if (a === "sekme-giris") { sekme = "giris"; msg = ""; render(); }
    else if (a === "kayit") isle(kayitOl(val("hs-e").trim(), val("hs-p"), val("hs-a").trim()).then(function () { render(); }));
    else if (a === "giris") isle(girisYap(val("hs-e").trim(), val("hs-p")));
    else if (a === "unuttum") {
      var m = val("hs-e").trim();
      if (!m) { mesaj("Önce e-posta adresini yaz."); return; }
      isle(A.sendPasswordResetEmail(m), "Şifre yenileme bağlantısı e-postana gönderildi.");
    }
    else if (a === "ad-kaydet") {
      var ad = val("hs-a").trim(), h = adDogrula(ad);
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
      el.innerHTML = '<div class="hs-kt"><div class="hs-ph"><b>👤 Hesap</b><button class="hs-x">✕</button></div><div class="hs-body"></div></div>';
      document.body.appendChild(el);
      el.querySelector(".hs-x").onclick = function () { el.classList.remove("show"); };
      el.querySelector(".hs-body").addEventListener("click", tikla);
    }
    msg = ""; el.classList.add("show"); render();
  }


  // ---------- sayaçlar (HEPSİ GERÇEK SAYI): çevrimiçi · bugün oynanan oyun · bu hafta aktif oyuncu ----------
  var sayacEl = null, anlik = null, bugunOyun = null, haftaAktif = null, sayacBasladi = false;
  var gunKey = "", haftaKey = "", dinle = [], sonEl = null;
  function fmt(n) { return (n || 0).toLocaleString("tr-TR"); }
  function ymd(d) { return String(d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate()); }
  // Türkiye saatine göre gün (YYYYMMDD) ve haftanın pazartesisi (YYYYMMDD)
  function anahtarlar() {
    var d = new Date(Date.now() + 3 * 3600 * 1000);
    var pzt = new Date(d.getTime() - ((d.getUTCDay() + 6) % 7) * 86400000);
    return { gun: ymd(d), hafta: ymd(pzt) };
  }
  function sayacYaz() {
    if (!sayacEl) return;
    var n = function (v) { return v == null ? "…" : fmt(v); };
    sayacEl.innerHTML = '<span><i class="hs-on"></i><b>' + n(anlik == null ? null : Math.max(anlik, 1)) + "</b> çevrimiçi</span>" +
      '<span>🎮 Bugün <b>' + n(bugunOyun) + "</b> oyun</span>" +
      '<span>🔥 Bu hafta <b>' + n(haftaAktif) + "</b> aktif</span>";
  }
  function sayacKur() {
    var ana = document.getElementById("ana"); if (!ana || sayacEl) return;
    var c2 = document.createElement("style");
    c2.textContent = ".hs-say{position:fixed;left:0;right:0;top:calc(var(--bas-yuk,58px) + env(safe-area-inset-top) + 14px);z-index:30;display:none;justify-content:center;flex-wrap:wrap;gap:6px;pointer-events:none}" +
      ".hs-say.show{display:flex}.hs-say span{background:rgba(16,26,56,.85);border:1px solid #2b3a72;border-radius:999px;padding:4px 9px;color:#cfd8ff;font:600 12px system-ui,sans-serif;white-space:nowrap}.hs-say b{color:#fff}" +
      ".hs-on{display:inline-block;width:8px;height:8px;border-radius:50%;background:#22c55e;margin-right:5px}";
    document.head.appendChild(c2);
    sayacEl = document.createElement("div"); sayacEl.className = "hs-say"; document.body.appendChild(sayacEl);
    function g() { sayacEl.classList.toggle("show", !ana.classList.contains("hidden")); }
    new MutationObserver(g).observe(ana, { attributes: true, attributeFilter: ["class"] }); g();
    sayacYaz();
  }
  // gün ya da hafta değişince dinleyicileri yenile
  function izle() {
    var k = anahtarlar();
    if (k.gun === gunKey && k.hafta === haftaKey) return;
    for (var i = 0; i < dinle.length; i++) dinle[i].off();
    gunKey = k.gun; haftaKey = k.hafta;
    var r1 = db.ref("apps/" + APP + "/oyunSayi/" + gunKey), r2 = db.ref("apps/" + APP + "/haftaSayi/" + haftaKey);
    r1.on("value", function (s) { bugunOyun = s.val() || 0; sayacYaz(); }, noop);
    r2.on("value", function (s) { haftaAktif = s.val() || 0; sayacYaz(); }, noop);
    dinle = [r1, r2];
  }
  // bitmiş her oyun: bugünkü sayaca +1; oyuncu bu hafta ilk kez oynadıysa haftalık aktif sayısına +1
  function oyunKaydet(n) {
    var u = A.currentUser; if (!u) return;
    var k = anahtarlar(), kok = "apps/" + APP + "/";
    var rU = db.ref(kok + "haftaUye/" + k.hafta + "/" + u.uid);
    rU.once("value").then(function (s) {
      if (s.exists()) return;
      return rU.set(true).then(function () {
        return db.ref(kok + "haftaSayi/" + k.hafta).transaction(function (v) { return (v || 0) + 1; });
      });
    }).catch(noop);
    for (var i = 0; i < n; i++) db.ref(kok + "oyunSayi/" + k.gun).transaction(function (v) { return (v || 0) + 1; }).catch(noop);
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
    db.ref("apps/" + APP + "/online").on("value", function (s) { anlik = s.numChildren(); sayacYaz(); }, noop);
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
