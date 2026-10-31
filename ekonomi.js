// ekonomi.js: altın, premium, kullanıcı adı, reklam, mağaza ve diyalog penceresi. Tüm oyunlar bunu ortak kullanır.
// index.html'de oyun script'lerinden ÖNCE yüklenmelidir: <script src="ekonomi.js"></script>
(function () {
  var TEST = true;          // true: gerçek reklam/ödeme bağlı değilse TEST reklamı çıkar, satın almalar ücretsiz simüle edilir. YAYINDA false YAP!
  var ODUL_ALTIN = 30;      // mağazada reklam izleyince kazanılan altın
  var URUNLER = [           // fiyatlar örnektir
    { id: "altin100", t: "🪙 100 Altın", f: "₺29,99", n: 100 },
    { id: "altin550", t: "🪙 550 Altın", f: "₺129,99", n: 550 },
    { id: "altin1200", t: "🪙 1.200 Altın", f: "₺249,99", n: 1200 }
  ];
  var PREMIUM_URUN = { id: "premium", t: "👑 Premium Üyelik", f: "₺79,99/ay" };

  // Aynı alan adında birden fazla uygulama varsa (firtina/, arena/) kayıtlar ayrı tutulur
  var UYG = location.pathname.replace(/[^\/]*$/, "").replace(/[^a-z0-9]/gi, "").slice(0, 24);
  var altin = 100, premium = false, kullanici = "Oyuncu" + (1000 + Math.floor(Math.random() * 9000));
  try {
    var ga = localStorage.getItem(UYG + "cemberAltin"); if (ga !== null) altin = Math.max(0, parseInt(ga, 10) || 0);
    premium = localStorage.getItem(UYG + "cemberPremium") === "1";
    var gu = localStorage.getItem(UYG + "cemberAd"); if (gu) kullanici = gu; else localStorage.setItem(UYG + "cemberAd", kullanici);
  } catch (e) {}

  var css = document.createElement("style");
  css.textContent =
    ".ek-ov{position:fixed;left:0;top:0;right:0;bottom:0;z-index:100000;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.6);font-family:system-ui,sans-serif}" +
    ".ek-ov.show{display:flex}" +
    ".ek-ov.ek-ad{z-index:100001;background:#000;flex-direction:column;color:#fff;text-align:center}" +
    ".ek-dlg{width:min(92%,420px);max-height:92vh;overflow:auto;background:linear-gradient(#fdf3d8,#fbeabc);border:2px solid #e3c04a;border-radius:20px;padding:18px 16px 16px;box-sizing:border-box;text-align:center;color:#5a3a12}" +
    ".ek-dlg h3{margin:4px 0 12px;font-size:24px;font-weight:800;color:#5a3a12}" +
    ".ek-msg{font-size:17px;font-weight:600;line-height:1.35}" +
    ".ek-opt{all:unset;display:block;box-sizing:border-box;width:100%;margin-top:10px;padding:14px 10px;border-radius:14px;font:800 17px system-ui,sans-serif;color:#fff;background:#2fb81a;box-shadow:0 3px 0 #17780a;text-align:center;cursor:pointer}" +
    ".ek-opt.gri{background:#8a8f99;box-shadow:0 3px 0 #5f636b}" +
    ".ek-opt.alt{background:#e0892b;box-shadow:0 3px 0 #a8641a}" +
    ".ek-opt[disabled]{opacity:.5}" +
    ".ek-chip{display:inline-block;background:rgba(0,0,0,.28);border-radius:999px;padding:2px 10px;margin-right:8px;font-size:15px}" +
    ".ek-bar{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;box-sizing:border-box;padding:0 12px 12px;flex:none}" +
    ".ek-bar.in{padding:0;margin-top:12px}" +
    ".ek-bp{all:unset;display:block;box-sizing:border-box;background:rgba(10,24,64,.72);border:2px solid rgba(255,255,255,.35);border-radius:999px;padding:7px 12px;font:700 15px/1.2 system-ui,sans-serif;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;cursor:pointer}" +
    "div.ek-bp{cursor:default}" +
    ".ek-bp.ad{flex:1 1 auto;max-width:42%}" +
    ".ek-bp.g{border-color:#ffb300;color:#ffe27a}" +
    ".ek-bar.az .ek-bp{flex:1 1 0;max-width:none;text-align:center}" +
    ".ek-bar.az .ek-bp.ad{max-width:none}" +
    ".ek-dock{position:fixed;left:0;right:0;bottom:0;z-index:50;display:none;gap:8px;box-sizing:border-box;padding:14px 12px calc(8px + env(safe-area-inset-bottom,0px));background:linear-gradient(rgba(8,12,32,0),rgba(8,12,32,.92) 38%)}" +
    ".ek-dock.show{display:flex}" +
    ".ek-dk{all:unset;box-sizing:border-box;flex:1 1 0;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;padding:6px 4px;background:rgba(10,24,64,.85);border:2px solid rgba(255,255,255,.3);border-radius:14px;color:#fff;font-family:system-ui,sans-serif;text-align:center;cursor:pointer}" +
    ".ek-dk b{display:block;max-width:100%;font-size:15px;font-weight:800;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    ".ek-dk i{display:block;font-style:normal;font-size:11px;font-weight:600;opacity:.8;line-height:1.2}" +
    ".ek-dk.g{border-color:#ffb300;color:#ffe27a}" +
    ".ek-dk.p.on{border-color:#c79bff;color:#e6d2ff}" +
    "div.ek-dk{cursor:default}";
  document.head.appendChild(css);

  var ov = null, adEl = null, adT = null, barlar = [], docklar = [];
  function mk(c) { var d = document.createElement("div"); d.className = c; document.body.appendChild(d); return d; }
  function ensure() { if (!ov) { ov = mk("ek-ov"); adEl = mk("ek-ov ek-ad"); } }

  // Diyalog: ops = [{t:"metin" | h:"html", c:"gri"|"alt", f:fn}]. Düğmeye basılınca pencere kapanır, sonra f çalışır.
  function sor(baslik, mesaj, ops) {
    ensure();
    ov.innerHTML = '<div class="ek-dlg"><h3></h3><div class="ek-msg"></div><div class="ek-o"></div></div>';
    ov.querySelector("h3").textContent = baslik;
    ov.querySelector(".ek-msg").innerHTML = mesaj;
    // uzun yazı pencereyi taşırıp kaydırmasın: yazı uzadıkça küçülür
    var mEl = ov.querySelector(".ek-msg"), uz = mEl.textContent.length;
    if (uz > 70) { mEl.style.fontSize = uz > 120 ? "13.5px" : uz > 95 ? "14.5px" : "15.5px"; mEl.style.lineHeight = "1.25"; }
    var kap = ov.querySelector(".ek-o");
    ops.forEach(function (o) {
      var b = document.createElement("button");
      b.className = "ek-opt " + (o.c || "");
      if (o.h) b.innerHTML = o.h; else b.textContent = o.t;
      b.onclick = function () { ov.classList.remove("show"); o.f(); };
      kap.appendChild(b);
    });
    ov.classList.add("show");
  }
  function sorKapat() { if (ov) ov.classList.remove("show"); }
  function adKapat() { if (adT) { clearInterval(adT); adT = null; } if (adEl) adEl.classList.remove("show"); }
  function kapat() { sorKapat(); adKapat(); }

  // REKLAM: tur "gecis" (ara reklam) veya "odul" (ödüllü). cb(true) = reklam tamamlandı.
  // Gerçek reklam: window.cemberReklam(tur, cb) (APK'daki ads.js). Yoksa ve TEST açıksa 5 sn'lik test ekranı.
  function reklam(tur, cb) {
    if (premium && tur === "gecis") { cb(true); return; } // Premium: ara reklam yok
    if (typeof window.cemberReklam === "function") { window.cemberReklam(tur, cb); return; }
    if (!TEST) { cb(tur === "gecis"); return; }
    ensure();
    var odul = tur === "odul", sn = 5;
    adEl.innerHTML = '<div style="font-size:13px;opacity:.6;letter-spacing:2px">REKLAM · TEST</div><div style="font-size:24px;font-weight:800;margin:16px 0 8px;padding:0 20px">Gerçek reklam buraya gelecek</div><div class="ek-s" style="font-size:54px;font-weight:800;margin:10px 0 24px"></div><button class="ek-opt gri ek-b" style="width:min(80%,300px)"></button>';
    adEl.classList.add("show");
    var s = adEl.querySelector(".ek-s"), b = adEl.querySelector(".ek-b");
    var yaz = function () {
      s.textContent = sn > 0 ? sn : "✓";
      b.textContent = sn > 0 ? (odul ? "Vazgeç" : "Bekleniyor…") : (odul ? "Ödülü al" : "Kapat");
      if (sn > 0 && !odul) b.setAttribute("disabled", ""); else b.removeAttribute("disabled");
    };
    if (adT) clearInterval(adT);
    adT = setInterval(function () { sn--; if (sn <= 0) { sn = 0; clearInterval(adT); adT = null; } yaz(); }, 1000);
    yaz();
    b.onclick = function () { if (sn > 0 && !odul) return; var ok = sn <= 0; adKapat(); cb(ok); };
  }

  function ekle(n) {
    altin = Math.max(0, altin + n);
    try { localStorage.setItem(UYG + "cemberAltin", altin); } catch (e) {}
    barYaz();
  }
  function satinAl(urun, ok) {
    var bitir = function (b) { if (b) ok(); else dukkan(null, "Satın alma tamamlanmadı"); };
    if (typeof window.cemberSatinAl === "function") window.cemberSatinAl(urun.id, bitir); // gerçek ödeme: bunu bağla
    else if (TEST) bitir(true);
    else dukkan(null, "Satın alma henüz bağlı değil");
  }
  function dukkan(geri, not) {
    var ops = [{ t: "📺 Reklam izle  +" + ODUL_ALTIN + " 🪙", f: function () {
      reklam("odul", function (ok) { if (ok) ekle(ODUL_ALTIN); dukkan(geri, ok ? "+" + ODUL_ALTIN + " 🪙 kazandın" : ""); });
    } }];
    URUNLER.forEach(function (u) {
      ops.push({ t: u.t + " · " + u.f, f: function () { satinAl(u, function () { ekle(u.n); dukkan(geri, "+" + u.n + " 🪙 eklendi"); }); } });
    });
    if (!premium) ops.push({ t: PREMIUM_URUN.t + " · " + PREMIUM_URUN.f, c: "alt", f: function () {
      satinAl(PREMIUM_URUN, function () {
        premium = true; try { localStorage.setItem(UYG + "cemberPremium", "1"); } catch (e) {}
        barYaz(); dukkan(geri, "👑 Premium aktif!");
      });
    } });
    ops.push({ t: "Kapat", c: "gri", f: function () { if (geri) geri(); } });
    sor("Altın Al 🪙", (not ? "<b>" + not + "</b><br>" : "") + "Bakiyen: 🪙 " + altin + "<br>" + (premium ? "👑 Premium: ara reklam yok" : "👑 Premium ile ara reklamsız oyna"), ops);
  }

  // Alt çubuk: kullanıcı adı, altın, (isteğe bağlı) üçüncü bilgi. cls "in": kart içi (boşluksuz)
  function adDegistir() {
    var v = null;
    try { v = prompt("Kullanıcı adın:", kullanici); } catch (e) {}
    v = (v || "").replace(/[<>&"]/g, "").trim().slice(0, 14);
    if (!v) return;
    kullanici = v;
    try { localStorage.setItem(UYG + "cemberAd", kullanici); } catch (e) {}
    barYaz();
  }
  function yaz1(o) {
    var g = !o.az; // az: altın bu çubukta gösterilmez (alt bölümde ayrı gösterilir)
    o.el.innerHTML = '<button class="ek-bp ad"></button>' + (g ? '<button class="ek-bp g"></button>' : "") + (o.fn ? '<div class="ek-bp"></div>' : "");
    var bt = o.el.querySelectorAll("button");
    bt[0].textContent = "👤 " + kullanici + (premium ? " 👑" : ""); bt[0].onclick = adDegistir;
    if (g) { bt[1].textContent = "🪙 " + altin + " ＋"; bt[1].onclick = function () { dukkan(); }; }
    if (o.fn) o.el.querySelector("div.ek-bp").textContent = o.fn();
  }
  function barYaz() { barlar.forEach(yaz1); docklar.forEach(dockYaz); }
  function bar(parent, fn, cls, az) {
    var el = document.createElement("div"); el.className = "ek-bar " + (cls || "") + (az ? " az" : "");
    parent.appendChild(el);
    var o = { el: el, fn: fn, az: !!az }; barlar.push(o); yaz1(o);
    return el;
  }

  // Alt bölüm (ekranın altına sabit): altın + satın alma, premium, puan. el görünürken açılır.
  function premiumTikla() {
    var tamam = [{ t: "Tamam", c: "gri", f: function () {} }];
    if (premium) { sor("👑 Premium", "Premium üyeliğin aktif: ara reklam yok.", tamam); return; }
    satinAl(PREMIUM_URUN, function () {
      premium = true; try { localStorage.setItem(UYG + "cemberPremium", "1"); } catch (e) {}
      barYaz(); sor("👑 Premium aktif!", "Ara reklamlar artık kapalı.", tamam);
    });
  }
  function dockYaz(o) {
    var b = o.el.querySelectorAll(".ek-dk");
    b[0].firstChild.textContent = "🪙 " + altin;
    b[1].firstChild.textContent = "👑 Premium"; b[1].lastChild.textContent = premium ? "Aktif ✓" : PREMIUM_URUN.f;
    b[1].classList.toggle("on", premium);
    b[2].firstChild.textContent = "⭐ " + (o.puan ? o.puan() : 0);
  }
  function dock(izle, puanFn) {
    var el = document.createElement("div"); el.className = "ek-dock";
    el.innerHTML = '<button class="ek-dk g"><b></b><i>🛒 Altın Al</i></button>' +
      '<button class="ek-dk p"><b></b><i></i></button>' +
      '<div class="ek-dk s"><b></b><i>Puan</i></div>';
    document.body.appendChild(el);
    var bt = el.querySelectorAll("button");
    bt[0].onclick = function () { dukkan(); };
    bt[1].onclick = premiumTikla;
    var o = { el: el, puan: puanFn }; docklar.push(o); dockYaz(o);
    function g() { el.classList.toggle("show", !izle.classList.contains("hidden")); }
    new MutationObserver(g).observe(izle, { attributes: true, attributeFilter: ["class"] });
    g();
    return el;
  }

  window.Ekonomi = {
    UYG: UYG, reklam: reklam, sor: sor, sorKapat: sorKapat, kapat: kapat, dukkan: dukkan, ekle: ekle,
    altin: function () { return altin; }, premium: function () { return premium; }, bar: bar, dock: dock, barYaz: barYaz
  };
})();
