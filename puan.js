// puan.js: PUANLAMA SİSTEMİ (internet gerekmez, tüm oyunlar ortak kullanır)
// index.html'de ekonomi.js'den SONRA, oyun script'lerinden ÖNCE yüklenir.
//
// Mantık:  oyunun puanı = kazanılan el sayısı × elin puanı (el) × katsayı (kat)
//          toplam puan   = tüm oyunların puanlarının toplamı
// Bir oyunda "el" kazanınca o oyunun kodundan şunu çağır:  Puan.ekle("passaparola");
// Aşağıdaki TABLO'daki el ve kat değerlerini istediğin gibi değiştir.
(function () {
  var TABLO = {
    milyoner:    { ad: "Milyoner",        el: 10,  kat: 1.0 },  // el = doğru bilinen soru
    passaparola: { ad: "Passaparola",     el: 40,  kat: 1.5 },  // el = tamamlanan tur
    kelime:      { ad: "Kelime Oyunu",    el: 25,  kat: 1.5 },  // el = bulunan kelime
    islem:       { ad: "İşlem",           el: 30,  kat: 2.0 },  // el = bulunan hedef
    rotasyon:    { ad: "Kelime Çemberi",  el: 25,  kat: 1.5 },  // el = çözülen çember
    duello:      { ad: "Düello Zaferi",   el: 50,  kat: 1.0 },  // el = kazanılan düello
    turnuva:     { ad: "Turnuva Zaferi",  el: 250, kat: 1.0 }   // el = kazanılan turnuva
  };

  var UYG = (window.Ekonomi && window.Ekonomi.UYG) || "";
  var KEY = UYG + "arenaEller";
  var eller = {}, ilk = true, dinleyiciler = [];
  try {
    var ham = localStorage.getItem(KEY);
    if (ham !== null) { eller = JSON.parse(ham) || {}; ilk = false; }
  } catch (e) {}

  function kaydet() { try { localStorage.setItem(KEY, JSON.stringify(eller)); } catch (e) {} }

  function oyunPuani(o) {
    var t = TABLO[o]; if (!t) return 0;
    return Math.round((eller[o] || 0) * t.el * t.kat);
  }
  function toplam() {
    var s = 0;
    for (var o in TABLO) s += oyunPuani(o);
    return s;
  }
  function ekle(o, adet) {
    if (!TABLO[o]) return;
    adet = adet == null ? 1 : adet;
    if (!(adet > 0)) return;
    eller[o] = (eller[o] || 0) + adet;
    ilk = false;
    kaydet();
    if (window.Ekonomi && window.Ekonomi.barYaz) window.Ekonomi.barYaz(); // ana sayfadaki puan kutusu
    dinleyiciler.forEach(function (f) { try { f(o, toplam()); } catch (e) {} });
  }

  window.Puan = {
    tablo: TABLO,
    ekle: ekle,
    toplam: toplam,
    oyunPuani: oyunPuani,
    eller: function () { var k = {}; for (var o in eller) k[o] = eller[o]; return k; },
    elSayisi: function (o) { return eller[o] || 0; },
    degisti: function (f) { dinleyiciler.push(f); },
    get ilk() { return ilk; }
  };
})();
