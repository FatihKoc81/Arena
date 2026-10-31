// arena.js: GERÇEK ZAMANLI SIRALAMA, DAVET, DÜELLO, MEYDAN OKU, TURNUVA
// Sunucu: Firebase Realtime Database (firebase-config.js doldurulmalı). Yapılandırma yoksa oyunlar
// ve puanlama normal çalışır, sadece çevrimiçi özellikler "kurulmadı" uyarısı verir.
//
// Bir oyunu düelloya eklemek için window.ArenaOyunlari.<id> = { ad, baslat(d, api), dur() } kaydet:
//   d.seed  : iki oyuncuda AYNI rastgele tohum (aynı soru/aynı sayılar için kullan)
//   api.ilerle(n, toplam)  : ilerlemeyi bildir (rakip görür)
//   api.bitti()            : oyunu ilk bitiren kazanır
//   api.elendi()           : oyuncu kaybetti (canı bitti vb.)
(function () {
  "use strict";
  var APP = window.ARENA_APP || "arena";
  var CFG = window.FIREBASE_CONFIG || null;
  var OYUN = window.ArenaOyunlari = window.ArenaOyunlari || {};
  var SURE_LIMIT = 300000;      // düello en fazla 5 dk
  var DAVET_SN = 90;            // davet bu kadar sn geçerli
  var TURNUVA_KISI = 4;
  var ATK = ((window.Ekonomi && window.Ekonomi.UYG) || "") + "arenaTurnuva";

  var db = null, kok = null, uid = null, offset = 0;
  var sira = [], onlineSet = {}, benSira = null, benYazi = "";
  var panel = null, sekme = "siralama";
  var duelAktif = null, meydan = null, turnuvaListe = [], turnuvaBen = null;

  // ---------- LİG SİSTEMİ ----------
  // Ligler: her biri 1-2-3 yıldızlı. Çırak ★ → Çırak ★★ → Çırak ★★★ → Kalfa ★ → ... → Efsane ★★★
  // Sezon her Pazartesi 00:00'da (TSİ) biter; aynı ligdeki oyuncular o haftaki TURNUVA PUANINA göre sıralanır.
  var LIGLER = ["Çırak", "Kalfa", "Usta", "Üstad", "Efsane"], LIG_MAX = LIGLER.length * 3 - 1;
  var YUKSELME = 0.30;   // ilk %30 üst lige çıkar
  var DUSME = 0.70;      // %70'ten sonrası (son %30) alt lige düşer; ikisinin arası kalır
  var MIN_GRUP = 4;      // ligde en az bu kadar puanlı oyuncu yoksa kimse yer değiştirmez
  var TP = { duello: 5, yariGalip: 20, yariMagl: 5, finalMagl: 15, sampiyon: 50, sampiyonlarKat: 2, sampiyonlarSampiyon: 100 };
  var LK = ((window.Ekonomi && window.Ekonomi.UYG) || "") + "arenaLig";
  var L = { tp: 0, tz: 0, lig: 0, hafta: "", hp: 0 };    // tp: turnuva puanı, tz: turnuva zaferi, hp: bu haftaki puan
  try { var lh = localStorage.getItem(LK); if (lh) { var lo = JSON.parse(lh) || {}; for (var lk in L) if (lo[lk] != null) L[lk] = lo[lk]; } } catch (e) {}
  var tpYuklendi = false, ligHazir = false, bekleyenTp = 0, ligRef = null, ligGrup = [], siraTp = [], siraTur = "genel";
  function ligAd(i) { i = Math.max(0, Math.min(LIG_MAX, i | 0)); return LIGLER[Math.floor(i / 3)] + " " + new Array(i % 3 + 2).join("★"); }
  function ligKaydet() { try { localStorage.setItem(LK, JSON.stringify(L)); } catch (e) {} }
  function haftaKey() {
    var d = new Date(Date.now() + 3 * 3600 * 1000), p = new Date(d.getTime() - ((d.getUTCDay() + 6) % 7) * 86400000);
    return String(p.getUTCFullYear() * 10000 + (p.getUTCMonth() + 1) * 100 + p.getUTCDate());
  }

  // ---------- yardımcılar ----------
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function adim() { return (window.Ekonomi && window.Ekonomi.ad && window.Ekonomi.ad()) || "Oyuncu"; }
  function fmt(n) { return (n || 0).toLocaleString("tr-TR"); }
  function simdi() { return Date.now() + offset; }
  function ts() { return firebase.database.ServerValue.TIMESTAMP; }
  function ana() { var h = document.querySelector("h1"); if (h) h.click(); }
  function karistir(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function oyunAd(id) { return (OYUN[id] && OYUN[id].ad) || id; }

  // ---------- görünüm (CSS) ----------
  var css = document.createElement("style");
  css.textContent =
    "#ana>.btn.arKart{order:var(--sira);margin:0;width:auto;height:72px;padding:6px;border-radius:20px;display:flex;flex-direction:row;align-items:center;justify-content:center;gap:8px;font-size:clamp(14px,4.2vw,16px);font-weight:700;border:2px solid rgba(255,255,255,.2);background:var(--kc)!important;color:#fff!important}" +
    "#ana>.btn.arKart .ar-ik{font-size:28px;line-height:1}" +
    "@media (max-height:700px){#ana>.btn.arKart{height:58px}}" +
    ".ar-afisK{position:fixed;left:0;right:0;top:calc(env(safe-area-inset-top) + 6px);z-index:100010;display:flex;flex-direction:column;align-items:center;gap:6px;pointer-events:none;padding:0 10px}" +
    ".ar-afis{pointer-events:auto;width:min(100%,440px);box-sizing:border-box;background:#101a38;border:2px solid #ffb300;border-radius:16px;padding:10px 12px;color:#fff;font:600 15px/1.35 system-ui,sans-serif;text-align:center;box-shadow:0 6px 24px rgba(0,0,0,.6)}" +
    ".ar-ab{display:flex;gap:8px;margin-top:8px}" +
    ".ar-b{flex:1;border:0;border-radius:12px;padding:10px 6px;font:800 15px system-ui,sans-serif;color:#fff;background:#2fb81a;cursor:pointer}.ar-b.gri{background:#6b7280}" +
    ".ar-pn{position:fixed;inset:0;z-index:99990;background:#080c20;display:none;flex-direction:column;color:#fff;font-family:system-ui,sans-serif;padding-top:env(safe-area-inset-top)}" +
    ".ar-pn.show{display:flex}" +
    ".ar-ph{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;font-size:20px;font-weight:800;border-bottom:1px solid #1d2540}" +
    ".ar-x{border:0;background:#222f45;color:#fff;border-radius:10px;width:38px;height:38px;font-size:18px;cursor:pointer}" +
    ".ar-tabs{display:flex;gap:6px;padding:8px 10px}" +
    ".ar-tab{flex:1;border:2px solid #4a5a9a;background:#101a38;color:#8e9bc4;border-radius:12px;padding:9px 2px;font:700 14px system-ui,sans-serif;cursor:pointer}.ar-tab.on{background:#3b5bd6;color:#fff;border-color:#7d97ff}" +
    ".ar-body{flex:1;overflow:auto;padding:4px 12px calc(16px + env(safe-area-inset-bottom));-webkit-overflow-scrolling:touch}" +
    ".ar-ben{background:#14204a;border:2px solid #ffb300;border-radius:14px;padding:10px;margin:6px 0 10px;text-align:center;font-size:16px}" +
    ".ar-sr{display:flex;align-items:center;gap:8px;background:#101a38;border:1px solid #2b3a72;border-radius:12px;padding:8px 10px;margin-bottom:6px}" +
    ".ar-sr.me{border-color:#ffb300;background:#241d08}" +
    ".ar-no{width:34px;text-align:center;font-weight:800;color:#ffe27a}" +
    ".ar-ad{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:700}" +
    ".ar-on{width:9px;height:9px;border-radius:50%;background:#22c55e;flex:none}" +
    ".ar-pu{font-weight:800;color:#ffe27a}" +
    ".ar-dv{border:0;border-radius:10px;background:#a3231c;color:#fff;font-size:16px;padding:6px 10px;cursor:pointer}.ar-dv[disabled]{opacity:.3}" +
    ".ar-bos{text-align:center;color:#8e9bc4;padding:24px 8px}" +
    ".ar-alt{flex:1;border:2px solid #4a5a9a;background:#101a38;color:#8e9bc4;border-radius:12px;padding:8px 2px;font:700 13px system-ui,sans-serif;cursor:pointer}.ar-alt.on{background:#7a5a00;color:#fff;border-color:#ffb300}" +
    ".ar-lgs{display:block;font-size:11px;font-weight:600;color:#8e9bc4}.ar-sr.yuk{border-color:#22c55e}.ar-sr.dus{border-color:#ef4444}" +
    ".ar-tb{width:100%;border-collapse:collapse;font-size:14px}.ar-tb td,.ar-tb th{padding:8px 4px;border-bottom:1px solid #1d2540;text-align:right}.ar-tb td:first-child,.ar-tb th:first-child{text-align:left}.ar-tb th{color:#8e9bc4;font-weight:600}.ar-tb tr.top td{font-weight:800;color:#ffe27a;border-bottom:0}" +
    ".ar-bt{display:block;width:100%;border:0;border-radius:14px;padding:13px;margin:8px 0;font:800 16px system-ui,sans-serif;color:#fff;background:#3b5bd6;cursor:pointer}.ar-bt.gri{background:#6b7280}.ar-bt.kirmizi{background:#a3231c}" +
    ".ar-kt{background:#101a38;border:2px solid #4a5a9a;border-radius:14px;padding:10px 12px;margin:8px 0}" +
    ".ar-kt h4{margin:0 0 6px;font-size:16px}.ar-mc{display:flex;justify-content:space-between;gap:6px;padding:5px 0;font-size:14px}" +
    ".ar-sy{position:fixed;inset:0;z-index:100003;background:rgba(0,0,0,.88);display:none;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-family:system-ui,sans-serif;text-align:center}.ar-sy.show{display:flex}" +
    ".ar-sy-a{font-size:22px;font-weight:800;padding:0 20px}.ar-sy-n{font-size:120px;font-weight:900;color:#ffb300;line-height:1.1}" +
    ".ar-dbar{position:fixed;left:0;right:0;top:calc(var(--bas-yuk,58px) + env(safe-area-inset-top));height:28px;z-index:49;display:none;align-items:center;justify-content:space-between;gap:6px;padding:0 12px;background:#2a0d0d;border-bottom:1px solid #6b1d1d;color:#fff;font:700 13px system-ui,sans-serif;white-space:nowrap}" +
    ".ar-dbar.show{display:flex}.ar-dbar span{overflow:hidden;text-overflow:ellipsis}.ar-dbar .t{color:#ffe27a}" +
    "body.arDuel{padding-top:calc(var(--bas-yuk,58px) + env(safe-area-inset-top) + 40px)!important}";
  document.head.appendChild(css);

  // ---------- bildirim / afiş ----------
  function afisKap() {
    var k = document.querySelector(".ar-afisK");
    if (!k) { k = document.createElement("div"); k.className = "ar-afisK"; document.body.appendChild(k); }
    return k;
  }
  function afis(html, ops, sn) {
    var d = document.createElement("div"), t;
    d.className = "ar-afis";
    d.innerHTML = "<div>" + html + '</div><div class="ar-ab"></div>';
    var ab = d.querySelector(".ar-ab");
    function kapat() { clearTimeout(t); if (d.parentNode) d.parentNode.removeChild(d); }
    (ops || []).forEach(function (o) {
      var b = document.createElement("button");
      b.className = "ar-b " + (o.c || ""); b.textContent = o.t;
      b.onclick = function () { kapat(); if (o.f) o.f(); };
      ab.appendChild(b);
    });
    if (!(ops && ops.length)) ab.style.display = "none";
    t = setTimeout(kapat, (sn || 4) * 1000);
    afisKap().appendChild(d);
    return kapat;
  }
  function toast(m) { return afis(m, null, 3.5); }

  // Uygulama bildirimi: APK'da LocalNotifications eklentisi varsa onu, tarayıcıda Notification API'yi kullanır.
  function bildirimIzni() {
    try { if ("Notification" in window && Notification.permission === "default") Notification.requestPermission(); } catch (e) {}
    try {
      var LN = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications;
      if (LN && LN.requestPermissions) LN.requestPermissions();
    } catch (e) {}
  }
  function bildirim(baslik, govde) {
    try { if (navigator.vibrate) navigator.vibrate([120, 60, 120]); } catch (e) {}
    try {
      var LN = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications;
      if (LN && LN.schedule) { LN.schedule({ notifications: [{ id: Date.now() % 2000000000, title: baslik, body: govde }] }); return; }
    } catch (e) {}
    try { if ("Notification" in window && Notification.permission === "granted") new Notification(baslik, { body: govde }); } catch (e) {}
  }

  function cevrimici(goster) {
    if (db && uid) return true;
    if (goster) toast(db ? "Bağlanıyor… birkaç saniye sonra tekrar dene." : "Çevrimiçi özellikler henüz kurulmadı (firebase-config.js).");
    return false;
  }

  // ---------- bağlantı ----------
  function baslat() {
    if (!CFG || !CFG.apiKey || /BURAYA/.test(CFG.apiKey) || typeof firebase === "undefined") return;
    try {
      if (!firebase.apps.length) firebase.initializeApp(CFG);
      db = firebase.database();
    } catch (e) { db = null; return; }
    kok = db.ref("apps/" + APP);
    db.ref(".info/serverTimeOffset").on("value", function (s) { offset = s.val() || 0; });
    // Misafir girişi SADECE hiç oturum yoksa yapılır; yoksa e-posta oturumunu ezip her yenilemede çıkış yaptırır.
    firebase.auth().onAuthStateChanged(function (u) {
      if (u) { if (u.uid !== uid) { uid = u.uid; baglan(); } }
      else firebase.auth().signInAnonymously().catch(function (e) { try { console.warn("Arena giriş:", e && e.message); } catch (x) {} });
    });
  }

  var yazT = null;
  function kullaniciYaz(hemen) {
    if (!kok || !uid) return;
    clearTimeout(yazT);
    yazT = setTimeout(function () {
      var o = { ad: adim(), puan: Puan.toplam(), eller: Puan.eller(), t: ts() };
      if (tpYuklendi) { o.tp = L.tp; o.tz = L.tz; o.lig = L.lig; }   // sunucudaki değer okunmadan sıfırla ezme
      kok.child("users/" + uid).update(o);
    }, hemen ? 0 : 1500);
  }

  function baglan() {
    // varlık (çevrimiçi göstergesi)
    db.ref(".info/connected").on("value", function (s) {
      if (s.val() !== true) return;
      var r = kok.child("online/" + uid);
      r.onDisconnect().remove(); r.set(true);
      kullaniciYaz(true);
    });
    // turnuva puanı / lig bilgisini sunucudan al (başka cihazdaki değerle birleştir), sonra sezonu kontrol et
    kok.child("users/" + uid).once("value").then(function (s) {
      var v = s.val() || {};
      if ((v.tp || 0) > L.tp) L.tp = v.tp;
      if ((v.tz || 0) > L.tz) L.tz = v.tz;
      if (!L.hafta && v.lig != null) L.lig = Math.max(0, Math.min(LIG_MAX, v.lig | 0));
    }).catch(function () {}).then(function () {
      tpYuklendi = true; ligKaydet(); kullaniciYaz(true); donemKontrol();
      setInterval(function () { if (ligHazir && L.hafta !== haftaKey()) { ligHazir = false; donemKontrol(); } }, 60000);
    });
    // turnuva puanı sıralaması (ilk 100)
    kok.child("users").orderByChild("tp").limitToLast(100).on("value", function (s) {
      var a = [];
      s.forEach(function (c) { var v = c.val() || {}; if ((v.tp || 0) > 0) a.push({ uid: c.key, ad: v.ad || "Oyuncu", tp: v.tp || 0, lig: v.lig | 0 }); });
      a.reverse(); siraTp = a; yenile();
    });
    kok.child("online").on("value", function (s) { onlineSet = s.val() || {}; yenile(); });
    // sıralama (ilk 100, gerçek zamanlı)
    kok.child("users").orderByChild("puan").limitToLast(100).on("value", function (s) {
      var a = [];
      s.forEach(function (c) { var v = c.val() || {}; a.push({ uid: c.key, ad: v.ad || "Oyuncu", puan: v.puan || 0, lig: v.lig | 0 }); });
      a.reverse(); sira = a; siraHesapla();
    });
    // gelen davetler
    kok.child("invites/" + uid).on("child_added", davetGeldi);
    // Meydan Oku eşleşmesi
    kok.child("meydan/eslesme/" + uid).on("value", function (s) {
      var id = s.val(); if (!id) return;
      s.ref.remove();
      if (meydan && meydan.bekliyor) { meydanBitir(); duelAc(id); }
    });
    // açık turnuvalar
    kok.child("turnuva").orderByChild("durum").equalTo("bekliyor").limitToLast(20).on("value", function (s) {
      var a = [];
      s.forEach(function (c) { var v = c.val() || {}; if (simdi() - (v.t || 0) < 15 * 60000) a.push({ id: c.key, v: v }); });
      turnuvaListe = a.reverse(); yenile();
    });
    var kayitli = null;
    try { kayitli = localStorage.getItem(ATK); } catch (e) {}
    if (kayitli) turnuvaBagla(kayitli);
  }

  function ligDinle() {
    if (ligRef) { try { ligRef.off(); } catch (e) {} }
    ligRef = kok.child("ligPuan/" + L.hafta + "/" + L.lig).orderByChild("p").limitToLast(100);
    ligRef.on("value", function (s) {
      var a = [];
      s.forEach(function (c) { var v = c.val() || {}; if ((v.p || 0) > 0) a.push({ uid: c.key, ad: v.ad || "Oyuncu", p: v.p }); });
      a.reverse(); ligGrup = a; yenile();
    });
  }
  function ligYaz() { if (kok && uid && L.hp > 0) kok.child("ligPuan/" + L.hafta + "/" + L.lig + "/" + uid).set({ ad: adim(), p: L.hp }); }
  function tpEkle(n) {
    if (!(n > 0)) return;
    if (!ligHazir) { bekleyenTp += n; return; }
    tpUygula(n);
  }
  function tpUygula(n) {
    L.tp += n; L.hp += n; ligKaydet(); ligYaz(); kullaniciYaz(true); yenile();
  }
  // Yeni hafta başladıysa geçen haftanın sonucuna göre yüksel / düş / kal
  function donemKontrol() {
    var hk = haftaKey();
    function bitir() {
      L.hafta = hk; L.hp = 0; ligKaydet(); ligHazir = true; ligDinle();
      if (bekleyenTp) { var n = bekleyenTp; bekleyenTp = 0; tpUygula(n); } else kullaniciYaz(true);
      yenile();
    }
    if (!L.hafta || L.hafta === hk || L.hp <= 0) { bitir(); return; }
    var eskiH = L.hafta, eskiL = L.lig, bp = L.hp;
    kok.child("ligPuan/" + eskiH + "/" + eskiL).orderByChild("p").limitToLast(1000).once("value").then(function (s) {
      var n = 0, ustte = 0;
      s.forEach(function (c) { var p = (c.val() || {}).p || 0; if (p > 0) { n++; if (p > bp) ustte++; } });
      var sira = ustte + 1, oran = n ? sira / n : 1, yeni = eskiL;
      if (n >= MIN_GRUP) {
        if (oran <= YUKSELME && eskiL < LIG_MAX) yeni = eskiL + 1;
        else if (oran > DUSME && eskiL > 0) yeni = eskiL - 1;
      }
      L.lig = yeni;
      var m = "Sezon bitti: <b>" + sira + ".</b> oldun (" + n + " oyuncu).<br>";
      if (yeni > eskiL) afis("📈 <b>Lig atladın!</b><br>" + m + esc(ligAd(eskiL)) + " → <b>" + esc(ligAd(yeni)) + "</b>", null, 8);
      else if (yeni < eskiL) afis("📉 <b>Lig düştün</b><br>" + m + esc(ligAd(eskiL)) + " → <b>" + esc(ligAd(yeni)) + "</b>", null, 8);
      else afis("🏅 " + m + "<b>" + esc(ligAd(yeni)) + "</b> ligindesin, yerinde kaldın.", null, 6);
      bildirim("🏅 Lig sezonu bitti", ligAd(eskiL) + (yeni === eskiL ? " ligindesin" : " → " + ligAd(yeni)));
      bitir();
    }).catch(function () { setTimeout(donemKontrol, 20000); });   // okunamazsa puan kaybolmasın, tekrar dene
  }

  function siraHesapla() {
    var i = -1;
    for (var k = 0; k < sira.length; k++) if (sira[k].uid === uid) { i = k; break; }
    if (i >= 0) { benSira = i + 1; benYazi = "#" + benSira; sonra(); return; }
    kok.child("users").orderByChild("puan").startAt(Puan.toplam() + 1).limitToFirst(1000).once("value").then(function (s) {
      var n = s.numChildren(); benSira = n + 1; benYazi = n >= 1000 ? "#1000+" : "#" + (n + 1); sonra();
    });
  }
  function sonra() { if (window.Ekonomi && window.Ekonomi.barYaz) window.Ekonomi.barYaz(); yenile(); }

  // ---------- davet ----------
  function oyunSec(baslik, cb) {
    var ids = Object.keys(OYUN);
    if (!ids.length) { toast("Düello için kayıtlı oyun yok."); return; }
    if (ids.length === 1) { cb(ids[0]); return; }
    var ops = ids.map(function (id) { return { t: oyunAd(id), f: function () { cb(id); } }; });
    ops.push({ t: "Vazgeç", c: "gri", f: function () {} });
    Ekonomi.sor(baslik, "Hangi oyunu oynayacaksınız?", ops);
  }
  function davetSec(hedef, hedefAd) {
    if (!cevrimici(true)) return;
    bildirimIzni();
    oyunSec("⚔️ " + hedefAd, function (oyun) { davetGonder(hedef, hedefAd, oyun); });
  }
  function davetGonder(hedef, hedefAd, oyun) {
    var ref = kok.child("invites/" + hedef).push(), bitti = false;
    ref.set({ from: uid, fromAd: adim(), oyun: oyun, durum: "bekliyor", t: ts() });
    toast("📨 " + esc(hedefAd) + " kişisine " + esc(oyunAd(oyun)) + " isteği gönderildi");
    function son() { bitti = true; clearTimeout(zt); ref.off(); ref.remove(); }
    var zt = setTimeout(function () { if (!bitti) { son(); toast(esc(hedefAd) + " yanıt vermedi."); } }, DAVET_SN * 1000);
    ref.on("value", function (s) {
      var v = s.val(); if (!v || bitti) return;
      if (v.durum === "kabul" && v.duel) {
        son();
        bildirim("✅ İstek kabul edildi", hedefAd + " düelloyu kabul etti. Oyun başlıyor!");
        afis("✅ <b>" + esc(hedefAd) + "</b> isteğini kabul etti!", null, 3);
        duelAc(v.duel);
      } else if (v.durum === "red") {
        son(); toast("❌ " + esc(hedefAd) + " isteği reddetti");
      }
    });
  }
  function davetGeldi(s) {
    var v = s.val(); if (!v) return;
    if (v.durum !== "bekliyor" || simdi() - (v.t || 0) > DAVET_SN * 1000) { s.ref.remove(); return; }
    if (!OYUN[v.oyun]) { s.ref.update({ durum: "red" }); return; }
    bildirim("⚔️ " + v.fromAd, "seni " + oyunAd(v.oyun) + " düellosuna çağırıyor");
    var kapat = afis("⚔️ <b>" + esc(v.fromAd) + "</b> seni <b>" + esc(oyunAd(v.oyun)) + "</b> düellosuna çağırıyor!", [
      { t: "✅ Kabul", f: function () {
        duelOlustur(v.oyun, { uid: v.from, ad: v.fromAd }, { uid: uid, ad: adim() }).then(function (id) {
          s.ref.update({ durum: "kabul", duel: id }); duelAc(id);
        });
      } },
      { t: "Reddet", c: "gri", f: function () { s.ref.update({ durum: "red" }); } }
    ], DAVET_SN);
    s.ref.on("value", function (x) { if (!x.exists()) { s.ref.off(); kapat(); } });
  }

  // ---------- düello ----------
  function duelOlustur(oyun, a, b, ekstra) {
    var ref = kok.child("duels").push();
    var d = { oyun: oyun, seed: Math.floor(Math.random() * 2147483000) + 1, a: a.uid, b: b.uid, ad: {}, t: ts() };
    d.ad[a.uid] = a.ad; d.ad[b.uid] = b.ad;
    if (ekstra) for (var k in ekstra) d[k] = ekstra[k];
    return ref.set(d).then(function () { return ref.key; });
  }

  function sayEl() {
    var e = document.querySelector(".ar-sy");
    if (!e) { e = document.createElement("div"); e.className = "ar-sy"; e.innerHTML = '<div class="ar-sy-a"></div><div class="ar-sy-n"></div>'; document.body.appendChild(e); }
    return e;
  }
  function barEl() {
    var e = document.querySelector(".ar-dbar");
    if (!e) { e = document.createElement("div"); e.className = "ar-dbar"; e.innerHTML = '<span class="s"></span><span class="t"></span><span class="r"></span>'; document.body.appendChild(e); }
    return e;
  }
  function barYaz(il) {
    var D = duelAktif; if (!D || !D.v) return;
    il = il || D.v.ilerleme || {};
    var b = barEl(), me = il[uid] || {}, rk = il[D.rakip] || {};
    b.querySelector(".s").textContent = "Sen " + (me.n || 0) + "/" + (me.t || "?");
    b.querySelector(".r").textContent = D.rakipAd + " " + (rk.n || 0) + "/" + (rk.t || "?");
  }
  function barSure() {
    var D = duelAktif; if (!D || !D.v || !D.v.baslangic) return;
    var sn = Math.max(0, Math.floor((simdi() - D.v.baslangic) / 1000));
    barEl().querySelector(".t").textContent = "⏱ " + Math.floor(sn / 60) + ":" + ("0" + (sn % 60)).slice(-2);
  }

  function duelAc(id) {
    if (!cevrimici(true)) return;
    if (duelAktif && duelAktif.id === id) return;
    duelKapat();
    var ref = kok.child("duels/" + id);
    var D = duelAktif = { id: id, ref: ref, v: null };
    ref.child("hazir/" + uid).set(true);
    ref.on("value", duelGuncelle);
  }
  function duelKapat() {
    var D = duelAktif; if (!D) return;
    try { D.ref.off(); } catch (e) {}
    clearTimeout(D.gelmediT); clearTimeout(D.limitT); clearInterval(D.sayimIv); clearInterval(D.tikT);
    var s = document.querySelector(".ar-sy"); if (s) s.classList.remove("show");
    var b = document.querySelector(".ar-dbar"); if (b) b.classList.remove("show");
    document.body.classList.remove("arDuel");
    duelAktif = null;
  }
  function kazananYaz(u, sebep) {
    var D = duelAktif; if (!D || D.yazildi) return;
    D.yazildi = true;
    var sure = D.v && D.v.baslangic ? Math.max(0, simdi() - D.v.baslangic) : 0;
    D.ref.child("kazanan").transaction(function (c) { return c || { uid: u || "", sebep: sebep, sure: sure }; });
  }
  function duelGuncelle(s) {
    var D = duelAktif; if (!D || D.id !== s.key) return;
    var v = s.val();
    if (!v) { duelKapat(); return; }
    var ilk = !D.v;
    D.v = v; D.rakip = v.a === uid ? v.b : v.a; D.rakipAd = (v.ad && v.ad[D.rakip]) || "Rakip";
    if (ilk) {
      // rakip belirli sürede gelmezse hazır olan kazanır
      D.gelmediT = setTimeout(function () {
        var x = duelAktif && duelAktif.v;
        if (x && !x.kazanan && !x.baslangic && !(x.hazir && x.hazir[D.rakip])) kazananYaz(uid, "gelmedi");
      }, (v.tur ? 60 : 30) * 1000);
      var sy = sayEl(); sy.querySelector(".ar-sy-a").textContent = "⚔️ " + D.rakipAd + " bekleniyor…"; sy.querySelector(".ar-sy-n").textContent = "";
      sy.classList.add("show");
    }
    if (v.kazanan) { if (!D.bitti) duelBitisi(v); return; }
    var hz = v.hazir || {};
    if (!v.baslangic) {
      if (hz[v.a] && hz[v.b]) D.ref.child("baslangic").transaction(function (c) { return c || simdi() + 4000; });
      return;
    }
    if (!D.sayim) {
      D.sayim = true;
      var sy2 = sayEl(); sy2.querySelector(".ar-sy-a").textContent = "⚔️ " + D.rakipAd + " ile düello"; sy2.classList.add("show");
      D.sayimIv = setInterval(function () {
        var k = v.baslangic - simdi();
        if (k <= 0) { clearInterval(D.sayimIv); sy2.classList.remove("show"); duelBaslat(); return; }
        sy2.querySelector(".ar-sy-n").textContent = Math.ceil(k / 1000);
      }, 100);
      D.limitT = setTimeout(zamanAsimi, Math.max(0, v.baslangic - simdi()) + SURE_LIMIT);
    }
    var el = v.elendi || {};
    if (el[v.a] && el[v.b]) kazananYaz(null, "ikisi de elendi");
    else if (el[D.rakip] && !el[uid]) kazananYaz(uid, "rakip elendi");
    barYaz(v.ilerleme);
  }
  function zamanAsimi() {
    var D = duelAktif; if (!D || D.bitti || !D.v) return;
    var il = D.v.ilerleme || {}, na = (il[D.v.a] || {}).n || 0, nb = (il[D.v.b] || {}).n || 0;
    kazananYaz(na > nb ? D.v.a : nb > na ? D.v.b : null, "süre doldu");
  }
  function duelBaslat() {
    var D = duelAktif; if (!D || D.bitti || D.basladi) return;
    var k = OYUN[D.v.oyun];
    D.basladi = true; D.baslatiyor = true;
    ana();                                  // önceki ekranı kapat (anasayfa olayı: baslatiyor iken yok sayılır)
    D.baslatiyor = false;
    D.api = {
      ilerle: function (n, t) { if (!D.bitti) D.ref.child("ilerleme/" + uid).set({ n: n, t: t }); },
      bitti: function () { if (!D.bitti) kazananYaz(uid, "bitirdi"); },
      elendi: function () { if (!D.bitti && !D.benElendi) { D.benElendi = true; D.ref.child("elendi/" + uid).set(true); } }
    };
    document.body.classList.add("arDuel");
    barEl().classList.add("show"); barYaz(); barSure();
    D.tikT = setInterval(barSure, 500);
    try { k.baslat({ seed: D.v.seed, oyun: D.v.oyun }, D.api); }
    catch (e) { toast("Oyun başlatılamadı"); D.api.elendi(); }
  }
  function duelBitisi(v) {
    var D = duelAktif; D.bitti = true;
    try { var k = OYUN[v.oyun]; if (k && k.dur) k.dur(); } catch (e) {}
    clearTimeout(D.gelmediT); clearTimeout(D.limitT); clearInterval(D.sayimIv); clearInterval(D.tikT);
    var sy = document.querySelector(".ar-sy"); if (sy) sy.classList.remove("show");
    var b = document.querySelector(".ar-dbar"); if (b) b.classList.remove("show");
    document.body.classList.remove("arDuel");
    var kz = v.kazanan || {}, ben = kz.uid === uid, bera = !kz.uid, sn = Math.round((kz.sure || 0) / 100) / 10;
    var bas, msg;
    if (bera) { bas = "🤝 Berabere"; msg = "Kimse kazanamadı."; }
    else if (ben) {
      bas = "🏆 Kazandın!";
      msg = kz.sebep === "bitirdi" ? "<b>" + sn + " sn</b>'de bitirdin." : kz.sebep === "gelmedi" ? "Rakip gelmedi." : "Rakip elendi.";
      if (kz.sebep !== "gelmedi" && !D.puanVerildi) {
        D.puanVerildi = true; Puan.ekle("duello"); msg += "<br>+Düello puanı kazandın ⭐";
        if (!v.tur) { tpEkle(TP.duello); msg += "<br>+" + TP.duello + " turnuva puanı 🏅"; }
      }
    } else {
      bas = "😔 Kaybettin";
      msg = kz.sebep === "bitirdi" ? esc(D.rakipAd) + " <b>" + sn + " sn</b>'de bitirdi." : kz.sebep === "gelmedi" ? "Zamanında hazır olmadın." : "Bu sefer olmadı.";
    }
    if (v.tur) {
      var w = kz.uid || (v.a < v.b ? v.a : v.b);   // beraberlikte küçük uid ilerler
      if (!D.tpVerildi) {
        D.tpVerildi = true;
        var sm = turnuvaBen && turnuvaBen.id === v.tur.tid && turnuvaBen.v && turnuvaBen.v.sampiyonlar ? TP.sampiyonlarKat : 1;
        var tpn = w === uid ? (v.tur.m === "f" ? 0 : TP.yariGalip * sm) : (v.tur.m === "f" ? TP.finalMagl * sm : TP.yariMagl * sm);
        if (tpn) { tpEkle(tpn); msg += "<br>+" + tpn + " turnuva puanı 🏅"; }
      }
      kok.child("turnuva/" + v.tur.tid + "/maclar/" + v.tur.m + "/kazanan").transaction(function (c) { return c || w; });
    }
    bildirim(bas.replace(/^\S+\s/, ""), msg.replace(/<[^>]+>/g, ""));
    var ops = [];
    if (v.tur) ops.push({ t: "🏆 Turnuvaya dön", f: function () { duelKapat(); ana(); ac("turnuva"); } });
    ops.push({ t: "Ana Menü", c: "gri", f: function () { duelKapat(); ana(); } });
    try { D.ref.off(); } catch (e) {}
    Ekonomi.sor(bas, msg, ops);
  }
  // Düello sırasında ana sayfaya dönen oyuncu pes etmiş sayılır
  document.addEventListener("anasayfa", function () {
    var D = duelAktif; if (!D || D.bitti || D.baslatiyor) return;
    if (D.basladi) { if (D.api) D.api.elendi(); toast("Düellodan ayrıldın."); }
    else duelKapat();
  });

  // ---------- Meydan Oku ----------
  function meydanBitir() {
    if (meydan) clearTimeout(meydan.zt);
    meydan = null; Ekonomi.sorKapat();
  }
  function meydanIptal() {
    if (!meydan) return;
    var bekliyordu = meydan.bekliyor;
    meydanBitir();
    if (bekliyordu) kok.child("meydan/bekleyen").transaction(function (c) { return c && c.uid === uid ? null : c; });
  }
  function meydanOku() {
    if (!cevrimici(true)) return;
    var ids = Object.keys(OYUN);
    if (!ids.length) { toast("Düello için kayıtlı oyun yok."); return; }
    bildirimIzni();
    if (meydan) return;
    meydan = { bekliyor: false };
    Ekonomi.sor("⚔️ Meydan Oku", "Rakip aranıyor…<br>Aynı anda Meydan Oku'ya basan biriyle eşleşirsin.", [{ t: "Vazgeç", c: "gri", f: meydanIptal }]);
    var slot = kok.child("meydan/bekleyen"), alinan = null;
    slot.transaction(function (cur) {
      alinan = null;
      if (cur && cur.uid !== uid && simdi() - cur.t < 45000) { alinan = cur; return null; }   // bekleyen var: onu al
      return { uid: uid, ad: adim(), t: simdi() };                                         // yoksa sıraya gir
    }, function (err, ok) {
      if (!meydan) return;
      if (err || !ok) { meydanBitir(); toast("Bağlantı hatası, tekrar dene."); return; }
      if (alinan) {
        var rakip = alinan, oyun = ids[Math.floor(Math.random() * ids.length)];
        meydanBitir();
        duelOlustur(oyun, { uid: rakip.uid, ad: rakip.ad }, { uid: uid, ad: adim() }).then(function (id) {
          kok.child("meydan/eslesme/" + rakip.uid).set(id);
          duelAc(id);
        });
      } else {
        meydan.bekliyor = true;
        meydan.zt = setTimeout(function () { if (meydan) { meydanIptal(); toast("Şu an Meydan Oku'ya basan kimse yok. Biraz sonra tekrar dene."); } }, 40000);
      }
    }, false);
  }

  // ---------- turnuva (4 kişilik, eleme usulü) ----------
  function turnuvaOff() {
    if (turnuvaBen && turnuvaBen.ref) try { turnuvaBen.ref.off(); } catch (e) {}
    turnuvaBen = null;
  }
  function turnuvaBagla(tid) {
    if (turnuvaBen && turnuvaBen.id === tid) return;
    turnuvaOff();
    var ref = kok.child("turnuva/" + tid), T = turnuvaBen = { id: tid, ref: ref, v: null, olusturuluyor: {}, sorulan: {} };
    try { localStorage.setItem(ATK, tid); } catch (e) {}
    ref.on("value", function (s) {
      if (turnuvaBen !== T) return;
      T.v = s.val();
      if (!T.v) { turnuvaOff(); try { localStorage.removeItem(ATK); } catch (e) {} yenile(); return; }
      turnuvaIsle(); yenile();
    });
  }
  function tAd(t, u) { return (t.oyuncular && t.oyuncular[u] && t.oyuncular[u].ad) || "Oyuncu"; }
  function turnuvaIsle() {
    var T = turnuvaBen, t = T && T.v; if (!t || t.durum === "bitti") return;
    var m = t.maclar || {};
    if (t.durum === "basladi" && !T.basladiBildirim) { T.basladiBildirim = true; bildirim("🏆 Turnuva başladı", "Maçın hazır olunca haber vereceğiz."); }
    if (m.y1 && m.y2 && m.y1.kazanan && m.y2.kazanan && !m.f && (uid === m.y1.kazanan || uid === m.y2.kazanan)) {
      T.ref.child("maclar/f").transaction(function (c) { return c || { a: m.y1.kazanan, b: m.y2.kazanan }; });
    }
    if (m.f && m.f.kazanan && !t.sampiyon && m.f.kazanan === uid) {
      var yeni = false;
      T.ref.child("sampiyon").transaction(function (c) { yeni = !c; return c || uid; }, function (e, ok) {
        if (!e && ok && yeni) { Puan.ekle("turnuva"); L.tz++; ligKaydet(); tpEkle(t.sampiyonlar ? TP.sampiyonlarSampiyon : TP.sampiyon); T.ref.child("durum").set("bitti"); bildirim("🏆 Şampiyon!", "Turnuvayı kazandın."); afis("🏆 <b>Turnuva şampiyonusun!</b>", null, 6); }
      });
    }
    ["y1", "y2", "f"].forEach(function (k) {
      var x = m[k]; if (!x || !x.a || !x.b || x.kazanan) return;
      if (!x.duel) {
        if (x.a === uid && !T.olusturuluyor[k]) {
          T.olusturuluyor[k] = true;
          duelOlustur(t.oyun, { uid: x.a, ad: tAd(t, x.a) }, { uid: x.b, ad: tAd(t, x.b) }, { tur: { tid: T.id, m: k } }).then(function (id) {
            T.ref.child("maclar/" + k + "/duel").transaction(function (c) { return c || id; });
          });
        }
        return;
      }
      if ((x.a === uid || x.b === uid) && !(duelAktif && duelAktif.id === x.duel) && !T.sorulan[x.duel]) {
        T.sorulan[x.duel] = true;
        var rk = x.a === uid ? x.b : x.a;
        bildirim("🏆 Turnuva maçın hazır", tAd(t, rk) + " ile karşılaşacaksın");
        afis("🏆 Turnuva maçın hazır!<br>Rakip: <b>" + esc(tAd(t, rk)) + "</b>", [{ t: "▶ Başla", f: function () { duelAc(x.duel); } }], 60);
      }
    });
  }
  function turnuvaAc(oyun, sampiyonlar) {
    if (!cevrimici(true)) return;
    if (sampiyonlar && !(L.tz > 0)) { toast("👑 Şampiyonlar Turnuvası sadece bir turnuva kazanmış oyunculara açık."); return; }
    bildirimIzni();
    var ref = kok.child("turnuva").push(), o = {};
    o[uid] = { ad: adim() };
    var tv = { oyun: oyun, olusturan: uid, durum: "bekliyor", kapasite: TURNUVA_KISI, t: ts(), oyuncular: o };
    if (sampiyonlar) tv.sampiyonlar = true;
    ref.set(tv).then(function () {
      turnuvaBagla(ref.key); toast((sampiyonlar ? "👑 Şampiyonlar Turnuvası" : "🏆 Turnuva") + " açıldı, " + (TURNUVA_KISI - 1) + " kişi daha bekleniyor");
    });
  }
  function turnuvaKatil(id) {
    if (!cevrimici(true)) return;
    bildirimIzni();
    var ref = kok.child("turnuva/" + id);
    ref.once("value").then(function () {
      return ref.transaction(function (c) {
        if (!c || c.durum !== "bekliyor") return;
        if (c.sampiyonlar && !(L.tz > 0)) return;   // sadece turnuva kazananlar
        c.oyuncular = c.oyuncular || {};
        if (c.oyuncular[uid]) return c;
        var n = Object.keys(c.oyuncular).length;
        if (n >= TURNUVA_KISI) return;
        c.oyuncular[uid] = { ad: adim() };
        if (n + 1 >= TURNUVA_KISI) {
          var ids = karistir(Object.keys(c.oyuncular));
          c.durum = "basladi";
          c.maclar = { y1: { a: ids[0], b: ids[1] }, y2: { a: ids[2], b: ids[3] } };
        }
        return c;
      });
    }).then(function (r) {
      if (r.committed) { turnuvaBagla(id); toast("🏆 Turnuvaya katıldın"); } else toast(L.tz > 0 ? "Turnuva dolu ya da kapandı." : "Turnuva dolu, kapandı ya da sadece turnuva kazananlara açık.");
    });
  }
  function turnuvaAyril() {
    var T = turnuvaBen; if (!T) return;
    var t = T.v;
    if (t && t.durum === "bekliyor") {
      T.ref.transaction(function (c) {
        if (!c || c.durum !== "bekliyor") return c;
        if (c.oyuncular) delete c.oyuncular[uid];
        return c.oyuncular && Object.keys(c.oyuncular).length ? c : null;
      });
    }
    turnuvaOff(); try { localStorage.removeItem(ATK); } catch (e) {}
    yenile();
  }

  // ---------- panel ----------
  function panelEl() {
    if (panel) return panel;
    panel = document.createElement("div");
    panel.className = "ar-pn";
    panel.innerHTML = '<div class="ar-ph"><span>🏅 Arena</span><button class="ar-x">✕</button></div>' +
      '<div class="ar-tabs"><button class="ar-tab" data-s="siralama">Sıralama</button><button class="ar-tab" data-s="puan">Puanım</button><button class="ar-tab" data-s="turnuva">Turnuva</button><button class="ar-tab" data-s="lig">Lig</button></div>' +
      '<div class="ar-body"></div>';
    document.body.appendChild(panel);
    panel.querySelector(".ar-x").onclick = function () { panel.classList.remove("show"); };
    panel.querySelectorAll(".ar-tab").forEach(function (b) { b.onclick = function () { sekme = b.getAttribute("data-s"); yenile(); }; });
    panel.querySelector(".ar-body").addEventListener("click", function (e) {
      var st = e.target.closest("[data-st]");
      if (st) { siraTur = st.getAttribute("data-st"); yenile(); return; }
      var d = e.target.closest("[data-u]"), a = e.target.closest("[data-act]");
      if (d && !d.disabled) davetSec(d.getAttribute("data-u"), d.getAttribute("data-a"));
      if (a) {
        var act = a.getAttribute("data-act"), id = a.getAttribute("data-id");
        if (act === "ac") oyunSec("🏆 Turnuva aç", function (o) { turnuvaAc(o, false); });
        else if (act === "acS") oyunSec("👑 Şampiyonlar Turnuvası", function (o) { turnuvaAc(o, true); });
        else if (act === "katil") turnuvaKatil(id);
        else if (act === "ayril") turnuvaAyril();
        else if (act === "mac") duelAc(id);
        else if (act === "meydan") { panel.classList.remove("show"); meydanOku(); }
      }
    });
    return panel;
  }
  function ac(s) {
    if (s) sekme = s;
    bildirimIzni();
    panelEl().classList.add("show");
    if (!(db && uid)) toast(db ? "Bağlanıyor…" : "Çevrimiçi özellikler henüz kurulmadı (firebase-config.js).");
    yenile();
  }
  var yT = null;
  function yenile() {
    if (!panel || !panel.classList.contains("show")) return;
    cancelAnimationFrame(yT);
    yT = requestAnimationFrame(ciz);
  }
  function ciz() {
    panel.querySelectorAll(".ar-tab").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-s") === sekme); });
    var h = sekme === "siralama" ? htmlSira() : sekme === "puan" ? htmlPuan() : sekme === "lig" ? htmlLig() : htmlTurnuva();
    var body = panel.querySelector(".ar-body"), y = body.scrollTop;
    body.innerHTML = h; body.scrollTop = y;
  }
  function htmlSira() {
    var tpMod = siraTur === "turnuva", liste = tpMod ? siraTp : sira, h = "";
    h += '<div class="ar-tabs" style="padding:2px 0 8px"><button class="ar-alt' + (tpMod ? "" : " on") + '" data-st="genel">⭐ Genel Puan</button><button class="ar-alt' + (tpMod ? " on" : "") + '" data-st="turnuva">🏆 Turnuva Puanı</button></div>';
    if (tpMod) {
      var bi = -1; for (var k = 0; k < siraTp.length; k++) if (siraTp[k].uid === uid) { bi = k; break; }
      h += '<div class="ar-ben">Sıran: <b>' + (bi >= 0 ? "#" + (bi + 1) : (L.tp > 0 ? "#100+" : "—")) + "</b> &nbsp;·&nbsp; 🏅 " + fmt(L.tp) + '<br><span style="font-size:13px">' + esc(ligAd(L.lig)) + " · 🏆 " + fmt(L.tz) + " turnuva zaferi</span></div>";
    } else {
      h += '<div class="ar-ben">Sıran: <b>' + esc(benYazi || "…") + "</b> &nbsp;·&nbsp; ⭐ " + fmt(Puan.toplam()) + "</div>";
    }
    h += '<button class="ar-bt kirmizi" data-act="meydan">⚔️ Meydan Oku</button>';
    if (!liste.length) h += '<div class="ar-bos">' + (!db ? "Çevrimiçi sıralama için firebase-config.js doldurulmalı." : tpMod ? "Henüz turnuva puanı olan yok. İlk sen ol!" : "Yükleniyor…") + "</div>";
    var madal = ["🥇", "🥈", "🥉"];
    liste.forEach(function (x, i) {
      var me = x.uid === uid, on = !!onlineSet[x.uid], deger = tpMod ? (me ? L.tp : x.tp) : (me ? Puan.toplam() : x.puan), lg = me ? L.lig : x.lig;
      h += '<div class="ar-sr' + (me ? " me" : "") + '"><span class="ar-no">' + (i < 3 ? madal[i] : i + 1) + '</span><span class="ar-ad">' + esc(x.ad) + (me ? " (sen)" : "") + '<small class="ar-lgs">' + esc(ligAd(lg)) + "</small></span>" +
        (on ? '<i class="ar-on"></i>' : "") + '<span class="ar-pu">' + fmt(deger) + "</span>" +
        (me ? "" : '<button class="ar-dv" data-u="' + esc(x.uid) + '" data-a="' + esc(x.ad) + '"' + (on ? "" : " disabled") + ">⚔️</button>") + "</div>";
    });
    return h + '<div class="ar-bos" style="font-size:12px">● yeşil nokta = çevrimiçi (sadece onlara istek gönderilir)</div>';
  }
  function htmlLig() {
    if (!db) return '<div class="ar-bos">Lig için firebase-config.js doldurulmalı.</div>';
    var n = ligGrup.length, h = '<div class="ar-ben" style="font-size:18px">' + esc(ligAd(L.lig)) + '<br><span style="font-size:14px">Bu hafta: <b>' + fmt(L.hp) + "</b> turnuva puanı</span></div>";
    h += '<div class="ar-kt"><h4>Ligler</h4><div style="font-size:14px;line-height:1.7">' + LIGLER.map(function (x, i) {
      return i === Math.floor(L.lig / 3) ? "<b>" + x + "</b>" : x;
    }).join(" › ") + '</div><div style="font-size:12px;color:#8e9bc4">Her lig ★ · ★★ · ★★★ olarak 3 kademedir.</div></div>';
    h += '<div class="ar-kt"><h4>Sezon kuralları</h4>' +
      '<div class="ar-mc"><span>🟢 İlk %' + Math.round(YUKSELME * 100) + '</span><span>Üst kademeye çıkar</span></div>' +
      '<div class="ar-mc"><span>⚪ Ortadakiler</span><span>Yerinde kalır</span></div>' +
      '<div class="ar-mc"><span>🔴 Son %' + Math.round((1 - DUSME) * 100) + '</span><span>Alt kademeye düşer</span></div>' +
      '<div style="font-size:12px;color:#8e9bc4">Sezon her Pazartesi 00:00\'da (TSİ) biter. Puan almayan oyuncu yer değiştirmez; ligde en az ' + MIN_GRUP + ' puanlı oyuncu yoksa kimse yer değiştirmez.</div></div>';
    h += "<h4 style=\"margin:10px 2px 6px\">Bu haftaki " + esc(ligAd(L.lig)) + " sıralaması</h4>";
    if (!n) h += '<div class="ar-bos">Bu hafta bu ligde henüz puan alan yok. Düello ya da turnuva oyna!</div>';
    ligGrup.forEach(function (x, i) {
      var me = x.uid === uid, oran = (i + 1) / n, bolge = n >= MIN_GRUP ? (oran <= YUKSELME && L.lig < LIG_MAX ? " yuk" : oran > DUSME && L.lig > 0 ? " dus" : "") : "";
      h += '<div class="ar-sr' + (me ? " me" : bolge) + '"><span class="ar-no">' + (i + 1) + '</span><span class="ar-ad">' + esc(x.ad) + (me ? " (sen)" : "") + '</span><span class="ar-pu">' + fmt(me ? L.hp : x.p) + "</span></div>";
    });
    return h;
  }
  function htmlPuan() {
    var h = '<div class="ar-ben">Genel puan: <b>⭐ ' + fmt(Puan.toplam()) + "</b>" + (benYazi ? " &nbsp;·&nbsp; Sıran: <b>" + esc(benYazi) + "</b>" : "") + '<br><span style="font-size:14px">Turnuva puanı: <b>🏅 ' + fmt(L.tp) + "</b> &nbsp;·&nbsp; " + esc(ligAd(L.lig)) + "</span></div>";
    h += '<table class="ar-tb"><tr><th>Oyun</th><th>El</th><th>Puan/el</th><th>Kat</th><th>Puan</th></tr>';
    for (var o in Puan.tablo) {
      var t = Puan.tablo[o];
      h += "<tr><td>" + esc(t.ad) + "</td><td>" + fmt(Puan.elSayisi(o)) + "</td><td>" + t.el + "</td><td>×" + String(t.kat).replace(".", ",") + "</td><td><b>" + fmt(Puan.oyunPuani(o)) + "</b></td></tr>";
    }
    return h + '<tr class="top"><td colspan="4">TOPLAM</td><td>' + fmt(Puan.toplam()) + "</td></tr></table>" +
      '<div class="ar-bos" style="font-size:12px">Puan = kazanılan el × elin puanı × oyun katsayısı</div>';
  }
  function htmlTurnuva() {
    var T = turnuvaBen, t = T && T.v, h = "";
    if (!db) return '<div class="ar-bos">Turnuva için firebase-config.js doldurulmalı.</div>';
    if (t) {
      var ids = Object.keys(t.oyuncular || {}), m = t.maclar || {};
      h += '<div class="ar-kt"><h4>' + (t.sampiyonlar ? "👑 Şampiyonlar Turnuvası" : "🏆 Turnuvan") + ' · ' + esc(oyunAd(t.oyun)) + '</h4><div>Durum: <b>' + (t.durum === "bekliyor" ? "Oyuncu bekleniyor (" + ids.length + "/" + TURNUVA_KISI + ")" : t.durum === "bitti" ? "Bitti" : "Devam ediyor") + "</b></div>";
      if (t.durum === "bekliyor") h += "<div>" + ids.map(function (u) { return esc(tAd(t, u)); }).join(", ") + "</div>";
      h += "</div>";
      [["y1", "Yarı final 1"], ["y2", "Yarı final 2"], ["f", "Final"]].forEach(function (p) {
        var x = m[p[0]]; if (!x) return;
        var ben = x.a === uid || x.b === uid;
        h += '<div class="ar-kt"><h4>' + p[1] + '</h4><div class="ar-mc"><span>' + esc(tAd(t, x.a)) + "</span><b>vs</b><span>" + esc(tAd(t, x.b)) + "</span></div>";
        if (x.kazanan) h += "<div>✅ Kazanan: <b>" + esc(tAd(t, x.kazanan)) + "</b></div>";
        else if (x.duel && ben) h += '<button class="ar-bt" data-act="mac" data-id="' + esc(x.duel) + '">▶ Maça Başla</button>';
        else h += "<div>⏳ Bekleniyor…</div>";
        h += "</div>";
      });
      if (t.sampiyon) h += '<div class="ar-ben">🏆 Şampiyon: <b>' + esc(tAd(t, t.sampiyon)) + "</b></div>";
      h += '<button class="ar-bt gri" data-act="ayril">' + (t.durum === "bekliyor" ? "Turnuvadan ayrıl" : "Turnuva ekranını kapat") + "</button>";
      return h;
    }
    h += '<div class="ar-ben">🏆 Turnuva zaferin: <b>' + fmt(L.tz) + "</b> &nbsp;·&nbsp; 🏅 " + fmt(L.tp) + " turnuva puanı</div>";
    h += '<button class="ar-bt" data-act="ac">➕ Turnuva Aç (' + TURNUVA_KISI + ' kişilik)</button>';
    h += '<button class="ar-bt ' + (L.tz > 0 ? "kirmizi" : "gri") + '" data-act="acS">👑 Şampiyonlar Turnuvası Aç</button>';
    if (!(L.tz > 0)) h += '<div class="ar-bos" style="padding:0 8px 8px;font-size:12px">Şampiyonlar Turnuvası\'na sadece en az bir turnuva kazanmış oyuncular katılabilir.</div>';
    if (!turnuvaListe.length) h += '<div class="ar-bos">Şu an açık turnuva yok. Bir tane aç, arkadaşların katılsın!</div>';
    turnuvaListe.forEach(function (x) {
      var n = Object.keys(x.v.oyuncular || {}).length;
      h += '<div class="ar-kt"><h4>' + (x.v.sampiyonlar ? "👑 Şampiyonlar Turnuvası · " : "") + esc(oyunAd(x.v.oyun)) + " turnuvası</h4><div>" + esc(tAd(x.v, x.v.olusturan)) + " açtı · " + n + "/" + TURNUVA_KISI + '</div><button class="ar-bt" data-act="katil" data-id="' + esc(x.id) + '">Katıl</button></div>';
    });
    return h;
  }

  // ---------- ana sayfa düğmeleri ----------
  function anaButonlar() {
    var a = document.getElementById("ana"); if (!a) return;
    function mk(id, ikon, ad, renk, sr, fn) {
      var b = document.createElement("button");
      b.className = "btn arKart"; b.id = id;
      b.style.setProperty("--kc", renk); b.style.setProperty("--sira", sr);
      b.innerHTML = '<span class="ar-ik">' + ikon + "</span><b>" + ad + "</b>";
      b.onclick = fn; a.appendChild(b);
    }
    mk("arMeydan", "⚔️", "Meydan Oku", "#a3231c", 6, meydanOku);
    mk("arSiralama", "🏅", "Sıralama", "#7a5a00", 7, function () { ac("siralama"); });
  }

  window.onEkonomiAd = function () { kullaniciYaz(true); };
  Puan.degisti(function () { kullaniciYaz(); });

  window.Arena = {
    ac: ac, meydanOku: meydanOku, bildirim: bildirim,
    kaydet: function (id, o) { OYUN[id] = o; },
    siraYazi: function () { return benYazi ? "Puan · " + benYazi : "Puan"; }
  };

  anaButonlar();
  baslat();
})();
