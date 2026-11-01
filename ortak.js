// ORTAK AYARLAR (tüm oyunlar için)
// index.html'de </body> öncesine ekle: <script src="ortak.js"></script>
// "ARENA" başlığına tıklayınca, hangi oyunda olursan ol ana sayfaya döner.

// TÜM YAZILAR: satırlar dengeli (simetrik) kırılsın, üst satır alttakinden uzun kalmasın
(function () {
  const st = document.createElement("style");
  st.textContent = "html{text-wrap:balance}input,textarea,pre,code{text-wrap:wrap}";
  document.head.appendChild(st);
})();

(function () {
  // Ana menü düzenlemesi: "İlerlemeyi Sıfırla" kaldırılır, "Oyuna Başla" -> "Milyoner"
  const sifirla = document.getElementById("sifirla");
  if (sifirla) sifirla.remove();
  const basla = document.getElementById("basla");
  if (basla) basla.textContent = "🎯 Milyoner";

  // Ana menüdeki "Seviye 1" kutusunu gizle
  const seviye = document.getElementById("seviye");
  if (seviye) seviye.style.display = "none";

  const baslik = document.querySelector("h1");
  baslik.style.cursor = "pointer";

  function anaSayfa() {
    // Oyunlar bu olayı dinleyip kendi sayaçlarını durdurabilir
    document.dispatchEvent(new Event("anasayfa"));
    // Tüm oyun/sonuç ekranlarını gizle (ana menü <main id="ana"> olduğu için etkilenmez)
    document.querySelectorAll("section.kart").forEach(e => e.classList.add("hidden"));
    if (typeof menu === "function") menu();
    document.getElementById("ana").classList.remove("hidden");
  }
  baslik.addEventListener("click", anaSayfa);

  // Milyoner oyun ekranının altına "Ana menü" butonu
  const milyoner = document.getElementById("oyun");
  if (milyoner) {
    const b = document.createElement("button");
    b.className = "btn ikinci";
    b.textContent = "Ana Menü";
    b.onclick = anaSayfa;
    milyoner.append(b);
  }
})();

// FK LOGOSU (sadece ana sayfada) + OYUN BUTONLARI RENKLERİ
(function () {
  const ana = document.getElementById("ana");
  if (!ana) return;

  const r = document.createElement("div");
  r.textContent = "FK";
  r.style.cssText = "position:fixed;right:10px;bottom:4px;width:62px;height:40px;display:flex;align-items:center;justify-content:center;border:2px solid #d4a63a;border-radius:11px;color:#d4a63a;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-weight:700;font-size:21px;line-height:1;pointer-events:none;z-index:5";
  document.body.append(r);
  const g = () => { r.style.display = ana.classList.contains("hidden") || ana.style.display === "none" ? "none" : "flex"; };
  new MutationObserver(g).observe(ana, { attributes: true, attributeFilter: ["class", "style"] });
  g();

  // Milyoner koyu kalır, diğer oyunlar renkli (butonlar yazısına göre bulunur)
  window.addEventListener("load", () => {
    const renk = { "Passaparola": "#0f9d8a", "Kelime": "#3b6fe0", "İşlem": "#8e4fd6" };
    ana.querySelectorAll("button").forEach(b => {
      for (const k in renk) if (b.textContent.includes(k)) {
        b.style.setProperty("background", renk[k], "important");
        b.style.setProperty("color", "#fff", "important");
      }
    });
  });
})();

// AÇIKLAMA YAZISI: iki satır, ortalı
(function () {
  const alt = document.querySelector("#ana .alt");
  if (!alt) return;
  alt.style.textAlign = "center";
  alt.style.fontSize = "clamp(11px, 3.9vw, 15px)";
  alt.querySelectorAll("span").forEach(s => {
    s.style.display = "block";
    s.style.whiteSpace = "nowrap";
  });
})();

// İŞLEM OYUNU EKRANI: üstteki "🔢 İşlem Oyunu" başlık yazısını gizle (Puan kalır)
(function () {
  function gizle() {
    const ana = document.getElementById("ana");
    const adaylar = [];
    document.querySelectorAll("body *").forEach(el => {
      if (el.dataset.islemGizli) return;
      if (/^(SCRIPT|STYLE|BUTTON|H1|H2|H3)$/.test(el.tagName)) return;
      if (ana && ana.contains(el)) return;      // ana menü butonuna dokunma
      if (el.closest("#cm, button, h1")) return; // çember ve butonlar hariç
      const t = (el.textContent || "").trim();
      if (t.length <= 20 && /İşlem Oyunu$/.test(t)) adaylar.push(el);
    });
    // Sadece en içteki eşleşmeyi gizle
    adaylar.forEach(el => {
      if (adaylar.some(o => o !== el && el.contains(o))) return;
      el.dataset.islemGizli = "1";
      el.style.display = "none";
      // Başlık gidince "Puan" sağda kalsın
      if (el.parentElement) el.parentElement.style.justifyContent = "flex-end";
    });
  }
  gizle();
  new MutationObserver(gizle).observe(document.body, { childList: true, subtree: true });
})();

// PASSAPAROLA EKRANI: sayfa yukarı aşağı kaymasın (klavye açıkken de)
(function () {
  let kilitli = false;
  const st = document.createElement("style");
  st.textContent = "html.pp-kilit,html.pp-kilit body{overflow:hidden!important;overscroll-behavior:none!important;height:100%!important}";
  document.head.appendChild(st);

  function passaparolaAcik() {
    const bs = document.querySelectorAll("button");
    for (const b of bs) {
      if (b.offsetParent !== null && /^\s*(✅\s*)?Tahmin\s*$/.test(b.textContent)) return true;
    }
    return false;
  }
  function kontrol() {
    const ac = passaparolaAcik();
    if (ac === kilitli) return;
    kilitli = ac;
    document.documentElement.classList.toggle("pp-kilit", ac);
    if (ac) window.scrollTo(0, 0);
  }
  window.addEventListener("scroll", () => { if (kilitli && window.scrollY) window.scrollTo(0, 0); });
  document.addEventListener("touchmove", e => {
    if (kilitli && !e.target.closest("input,textarea")) e.preventDefault();
  }, { passive: false });
  document.addEventListener("focusin", () => { if (kilitli) setTimeout(() => window.scrollTo(0, 0), 50); });
  new MutationObserver(kontrol).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "style"] });
  kontrol();
})();

// DÜĞME YAZILARI: "Ana menü" -> "Ana Menü" (tüm oyunlarda, sonradan eklenen düğmelerde de)
(function () {
  function duzelt() {
    document.querySelectorAll("button").forEach(b => {
      const w = document.createTreeWalker(b, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = w.nextNode())) {
        if (/Ana menü/.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/Ana menü/g, "Ana Menü");
      }
    });
  }
  duzelt();
  new MutationObserver(duzelt).observe(document.body, { childList: true, subtree: true, characterData: true });
})();

// MİLYONER EKRANI: kart, İşlem Oyunu ile aynı üst çizgiye insin (kelimelerim.js'deki KAYMA_ORAN ile aynı değer)
(function () {
  const oyun = document.getElementById("oyun");
  if (!oyun) return;
  const KAYMA_ORAN = 0.6; // kelimelerim.js içindeki değerle aynı olmalı
  const YUKARI = 0;       // kartı bu kadar piksel yukarı alır (alt çizgi ekranda kesilmesin); İşlem Oyunu'nda da aynı değer çıkarılmalı

  function kaydir() {
    if (oyun.classList.contains("hidden")) { oyun.style.top = ""; oyun.style.minHeight = ""; delete oyun.dataset.sik; return; }
    // Ölçü: "Ana Menü" düğmesi, İşlem Oyunu'ndaki "Yeni Tur" ile aynı .btn.ikinci stilinde
    let ref = null;
    oyun.querySelectorAll("button.btn.ikinci").forEach(b => { if (/Ana Menü/.test(b.textContent)) ref = b; });
    if (!ref || !ref.offsetHeight) return;
    const kayma = Math.round((ref.offsetHeight + (parseFloat(getComputedStyle(ref).marginTop) || 0)) * KAYMA_ORAN);
    if (getComputedStyle(oyun).position === "static") oyun.style.position = "relative";
    // İşlem Oyunu ile aynı: üst çizgi aynı, alt çizgi ekranın 12 px üstünde. Sığmazsa boşluklar sıkılaşır.
    delete oyun.dataset.sik;
    oyun.style.top = "0px"; oyun.style.minHeight = "";
    const ust = oyun.getBoundingClientRect().top + window.scrollY, at = kayma - YUKARI, alt = window.innerHeight - 12;
    oyun.style.top = at + "px";
    oyun.style.minHeight = Math.max(300, alt - ust - at) + "px";
    if (oyun.getBoundingClientRect().bottom > alt + 1) oyun.dataset.sik = "1";
  }
  const css = document.createElement("style");
  css.textContent = "#oyun{display:flex;flex-direction:column}#oyun>.btn.ikinci{margin-top:auto!important}#oyun>*:has(+ .btn.ikinci){margin-bottom:12px}" +
    "#oyun[data-sik] .sec{padding-top:6px!important;padding-bottom:6px!important}#oyun[data-sik] .jokerler{margin-top:6px}";
  document.head.appendChild(css);
  const kay2 = () => { kaydir(); setTimeout(kaydir, 350); };
  new MutationObserver(kay2).observe(oyun, { attributes: true, attributeFilter: ["class"] });
  window.addEventListener("resize", kay2);
  window.addEventListener("load", kay2);
  kay2();
})();


// TÜM UYGULAMA YAZILARI: çok satırlı yazılar dengeli bölünür, ALT satır üst satırdan KISA olmaz.
// (CSS text-wrap eski WebView'lerde çalışmadığı için kendimiz ölçüp satırları belirliyoruz.)
(function () {
  const cv = document.createElement("canvas").getContext("2d");
  const izlenen = new Set();
  let bekle = false;
  const kuyruk = new Set();

  function adayMi(el) {
    if (!el || el.nodeType !== 1) return false;
    if (/^(SCRIPT|STYLE|INPUT|TEXTAREA|SELECT|OPTION|CODE|PRE|SVG|CANVAS|HTML|BODY)$/i.test(el.tagName)) return false;
    if (el.isContentEditable || el.closest("#oyun")) return false; // Milyoner soru metninin kendi düzenleyicisi var
    let n = 0;
    for (const c of el.childNodes) {
      if (c.nodeType === 3) n += c.textContent.trim().length;
      else if (c.nodeName !== "BR") return false;
    }
    return n >= 10;
  }

  // Kelimeleri k satıra böler: satırlar birbirine en yakın uzunlukta, alt satır üsttekinden kısa olmayacak şekilde
  function bol(words, olc, maxW) {
    const n = words.length;
    if (n < 3 || n > 45) return null;
    const sp = olc(" "), wd = words.map(olc);
    let k = 1, cw = 0;
    wd.forEach((w, i) => {
      const add = cw ? sp + w : w;
      if (cw && cw + add > maxW) { k++; cw = w; } else cw += add;
    });
    if (k < 2 || k > 5 || k > n) return null;
    const pre = [0]; wd.forEach((w, i) => pre.push(pre[i] + w));
    const gen = (i, j) => pre[j] - pre[i] + sp * (j - i - 1);
    let en = null, enSkor = Infinity;
    (function dene(basla, kalan, kes) {
      if (kalan === 0) {
        const sn = [0].concat(kes, [n]), w = [];
        let toplam = 0;
        for (let a = 0; a < k; a++) { const x = gen(sn[a], sn[a + 1]); if (x > maxW) return; w.push(x); toplam += x; }
        const ort = toplam / k;
        let skor = 0;
        w.forEach(x => { skor += (x - ort) * (x - ort); });
        for (let a = 0; a < k - 1; a++) if (w[a] > w[a + 1] + 1) skor += 1e4 * (w[a] - w[a + 1]);
        if (skor < enSkor) { enSkor = skor; en = sn.slice(); }
        return;
      }
      for (let pos = basla; pos <= n - kalan; pos++) { kes.push(pos); dene(pos + 1, kalan - 1, kes); kes.pop(); }
    })(1, k - 1, []);
    if (!en) return null;
    const out = [];
    for (let a = 0; a < k; a++) out.push(words.slice(en[a], en[a + 1]).join(" "));
    return out;
  }

  function yaz(el, parcalar) {
    el.textContent = "";
    parcalar.forEach((satirlar, si) => {
      satirlar.forEach((l, li) => {
        const sonSatir = li === satirlar.length - 1;
        el.appendChild(document.createTextNode(sonSatir && si === parcalar.length - 1 ? l : l + " "));
        if (!sonSatir) el.appendChild(document.createElement("br"));
      });
      if (si < parcalar.length - 1) el.appendChild(document.createElement("br"));
    });
    el.__dgHtml = el.innerHTML;
  }

  function isle(el) {
    if (!el.isConnected || !adayMi(el)) return;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.display === "inline" || /nowrap|^pre$|pre-wrap/.test(cs.whiteSpace) || cs.textOverflow === "ellipsis") return;
    const maxW = el.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0) - 2;
    if (maxW < 40) return;
    let ham = "";
    el.childNodes.forEach(c => { ham += c.nodeName === "BR" ? "\u0001" : c.textContent; });
    const parcalar = ham.split(/[\u0001\n]/).map(x => x.replace(/\s+/g, " ").trim()).filter(Boolean);
    if (!parcalar.length) return;
    const buyuk = cs.textTransform === "uppercase", ls = parseFloat(cs.letterSpacing) || 0;
    cv.font = cs.fontStyle + " " + cs.fontWeight + " " + cs.fontSize + " " + cs.fontFamily;
    const olc = t => cv.measureText(buyuk ? t.toUpperCase() : t).width + ls * t.length;
    let degisti = false;
    const sonuc = parcalar.map(seg => {
      const r = bol(seg.split(" "), olc, maxW);
      if (r) { degisti = true; return r; }
      return [seg];
    });
    if (!degisti) return;
    if (!el.__dgOrig) el.__dgOrig = Array.from(el.childNodes).map(c => c.cloneNode(true));
    yaz(el, sonuc);
    izlenen.add(el);
  }

  function tara(n) {
    if (!n || n.nodeType !== 1) return;
    isle(n);
    const l = n.querySelectorAll ? n.querySelectorAll("*") : [];
    if (l.length <= 800) l.forEach(isle);
  }
  function isleKuyruk() {
    bekle = false;
    const l = Array.from(kuyruk); kuyruk.clear();
    l.forEach(n => { if (n && n.nodeType === 3) n = n.parentElement; if (n && n.isConnected) tara(n); });
    mo.takeRecords();
  }
  function ekle(n) { if (!n) return; kuyruk.add(n); if (!bekle) { bekle = true; requestAnimationFrame(isleKuyruk); } }

  const mo = new MutationObserver(ml => {
    ml.forEach(m => {
      if (m.type === "characterData") ekle(m.target);
      else if (m.type === "attributes") ekle(m.target);
      else m.addedNodes.forEach(ekle);
    });
  });
  function basla() {
    mo.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["class", "style", "hidden"] });
    ekle(document.body);
  }
  // Ekran genişliği değişince (döndürme vb.) baştan hesapla
  let rt = null;
  window.addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      Array.from(izlenen).forEach(el => {
        if (!el.isConnected || el.__dgHtml !== el.innerHTML) { izlenen.delete(el); return; }
        el.textContent = ""; el.__dgOrig.forEach(c => el.appendChild(c.cloneNode(true)));
        izlenen.delete(el); isle(el);
      });
      mo.takeRecords();
    }, 250);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ekle(document.body));
  if (document.body) basla(); else document.addEventListener("DOMContentLoaded", basla);
  window.addEventListener("load", () => ekle(document.body));
})();

// MİLYONER SORU METNİ: satırlar dengeli olsun, alt satır üst satırdan uzun olmasın
(function () {
  const oyun = document.getElementById("oyun");
  if (!oyun) return;
  const norm = s => s.replace(/\s+/g, " ").trim();
  const cv = document.createElement("canvas").getContext("2d");

  // Kelimeleri, en fazla "avail" genişliğinde satırlara böler; satırlar dengeli ve üstten alta kısalan şekilde olur
  function bol(words, w, avail) {
    const sp = w(" "), ww = words.map(w);
    function pack(W) {
      const out = []; let cur = [], cw = 0;
      words.forEach((x, i) => {
        const add = cur.length ? sp + ww[i] : ww[i];
        if (cur.length && cw + add > W) { out.push(cur.join(" ")); cur = [x]; cw = ww[i]; }
        else { cur.push(x); cw += add; }
      });
      if (cur.length) out.push(cur.join(" "));
      return out;
    }
    const dogal = pack(avail);
    if (dogal.length < 2) return dogal;
    let lo = Math.min(Math.max.apply(null, ww), avail), hi = avail;
    for (let i = 0; i < 24; i++) { const mid = (lo + hi) / 2; if (pack(mid).length <= dogal.length) hi = mid; else lo = mid; }
    const genis = r => r.map(w);
    const azalan = r => { const g = genis(r); for (let i = 1; i < g.length; i++) if (g[i] > g[i - 1] + 0.5) return false; return true; };
    const sonKisa = r => { const g = genis(r); return g[g.length - 1] <= g[0] + 0.5; };
    for (let W = hi; W <= avail; W += 1) { const r = pack(W); if (r.length <= dogal.length && azalan(r)) return r; }
    for (let W = hi; W <= avail; W += 1) { const r = pack(W); if (r.length <= dogal.length && sonKisa(r)) return r; }
    return pack(hi);
  }
  window.__soruBol = bol; // test için

  function metin(el) {
    let s = "";
    el.childNodes.forEach(n => { s += n.nodeName === "BR" ? " " : n.textContent; });
    return norm(s);
  }
  function soruKumesi() {
    const k = new Set();
    try {
      if (typeof milyonerSorulari !== "undefined")
        Object.values(milyonerSorulari).forEach(a => (a || []).forEach(q => { if (q && q.soru) k.add(norm(q.soru)); }));
    } catch (e) {}
    return k;
  }
  function soruElemani() {
    const adaylar = [];
    oyun.querySelectorAll("*").forEach(el => {
      if (el.closest("button")) return;
      if (Array.prototype.some.call(el.children, c => c.tagName !== "BR")) return;
      const t = metin(el);
      if (t.length < 8 || /^(Seviye\s*\d|Soru\s*\d)/.test(t)) return;
      adaylar.push([el, t]);
    });
    if (!adaylar.length) return null;
    const k = soruKumesi();
    return adaylar.find(x => k.has(x[1])) || adaylar[0];
  }

  const MAX_SATIR = 3; // soru alanı hep bu kadar satır yüksekliğinde olur: kartın alt çizgisi her soruda aynı yerde kalır
  function uygula() {
    if (typeof soruYaz === "function") return; // soru yazısını artık index.html'deki soruYaz() düzenliyor
    if (oyun.classList.contains("hidden")) return;
    const s = soruElemani();
    if (!s) return;
    const el = s[0], t = s[1];
    if (!el.clientWidth) return;
    let cs = getComputedStyle(el);
    const anahtar = t + "|" + el.clientWidth + "|" + cs.font;
    if (el._simetri === anahtar && el._simetriHtml === el.innerHTML) return;
    // önceki sorudan kalan ayarları sıfırla, doğal ölçüyü oku
    el.style.fontSize = ""; el.style.lineHeight = ""; el.style.paddingTop = ""; el.style.paddingBottom = "";
    cs = getComputedStyle(el);
    const temel = parseFloat(cs.fontSize) || 16;
    let lh = parseFloat(cs.lineHeight); if (!(lh > 0)) lh = temel * 1.25;
    const oran = lh / temel;
    const pt = parseFloat(cs.paddingTop) || 0, pb = parseFloat(cs.paddingBottom) || 0;
    const avail = el.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0) - 6;
    const kelimeler = t.split(" ");
    // uzun soru: yazıyı, MAX_SATIR satırlık yüksekliğe sığana kadar küçült (en fazla %60'a kadar)
    let px = temel, satirlar;
    for (;;) {
      cv.font = cs.fontStyle + " " + cs.fontWeight + " " + px + "px " + cs.fontFamily;
      satirlar = bol(kelimeler, x => cv.measureText(x).width, avail);
      if (satirlar.length * px <= MAX_SATIR * temel + 0.5 || px <= temel * 0.6) break;
      px -= 0.5;
    }
    el.style.fontSize = px + "px";
    el.style.lineHeight = (px * oran) + "px";
    // kısa soru: üstten/alttan boşluk ekle, toplam yükseklik hep aynı kalsın
    const fark = MAX_SATIR * lh - satirlar.length * px * oran;
    if (fark > 1) { el.style.paddingTop = (pt + fark / 2) + "px"; el.style.paddingBottom = (pb + fark / 2) + "px"; }
    el.textContent = "";
    satirlar.forEach((l, i) => {
      if (i) el.appendChild(document.createElement("br"));
      el.appendChild(document.createTextNode(l));
    });
    el._simetri = t + "|" + el.clientWidth + "|" + getComputedStyle(el).font;
    el._simetriHtml = el.innerHTML;
  }

  new MutationObserver(uygula).observe(oyun, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["class"] });
  window.addEventListener("resize", uygula);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(uygula);
  window.addEventListener("load", uygula);
  uygula();
})();

// MİLYONER ALT ÇUBUĞU (ad · altın · seviye): yazı uzun olunca "Fatih ...", "10..." diye kesilmesin; sığana kadar küçülür
(function () {
  const oyun = document.getElementById("oyun");
  if (!oyun) return;
  const st = document.createElement("style");
  st.textContent = ".cip-sig,.cip-sig *{font-size:var(--cip-px)!important}";
  document.head.appendChild(st);

  // Ekranda en altta duran "Seviye N" yazısı alt çubuktaki kutudur (üstteki "Seviye N" başlıktır)
  function bul() {
    let chip = null, enAlt = -1;
    oyun.querySelectorAll("*").forEach(el => {
      if (el.children.length > 2 || el.closest("button.btn.ikinci")) return;
      const t = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (t.length > 24 || !/Seviye\s*\d+$/.test(t)) return;
      const r = el.getBoundingClientRect();
      if (r.height && r.top > enAlt) { enAlt = r.top; chip = el; }
    });
    if (!chip) return null;
    let row = chip.parentElement;
    while (row && row !== oyun && row.children.length < 3) row = row.parentElement;
    if (!row || row === oyun || row.getBoundingClientRect().height > 120) return null;
    return { row, chip };
  }
  function tasan(row) {
    if (row.scrollWidth - row.clientWidth > 1) return true;
    const l = row.querySelectorAll("*");
    for (let i = 0; i < l.length; i++) if (l[i].scrollWidth - l[i].clientWidth > 1) return true;
    return false;
  }
  function sigdir() {
    if (oyun.classList.contains("hidden")) return;
    const b = bul(); if (!b) return;
    const row = b.row;
    const anahtar = row.textContent + "|" + row.clientWidth;
    if (row._cipKey === anahtar) return;
    row.classList.remove("cip-sig");
    if (tasan(row)) {
      let px = parseFloat(getComputedStyle(b.chip).fontSize) || 16;
      row.classList.add("cip-sig");
      while (px > 10) {
        px -= 0.5;
        row.style.setProperty("--cip-px", px + "px");
        if (!tasan(row)) break;
      }
    }
    row._cipKey = row.textContent + "|" + row.clientWidth;
  }
  new MutationObserver(sigdir).observe(oyun, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["class"] });
  window.addEventListener("resize", sigdir);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sigdir);
  window.addEventListener("load", sigdir);
  sigdir();
})();


// PREMIUM: alt çubuktaki "Premium" düğmesine basınca "Çok yakında" yazar (şimdilik)
(function () {
  document.addEventListener("click", function (e) {
    let el = e.target;
    for (let i = 0; el && i < 5; i++, el = el.parentElement) {
      const t = (el.textContent || "").replace(/[\uFE0E\uFE0F]/g, "").replace(/\s+/g, " ").trim();
      if (/^(👑\s*)?Premium(\s*[✓✔☑])?$/.test(t) && el.parentElement && /Altın/.test(el.parentElement.textContent) && /Puan/.test(el.parentElement.textContent)) {
        e.preventDefault(); e.stopImmediatePropagation();
        try { window.Ekonomi.sor("👑 Premium", "Çok yakında!", [{ t: "Tamam", c: "gri", f: function () {} }]); } catch (x) {}
        return;
      }
    }
  }, true);
})();

// GERİ TUŞU: oyunun neresinde olursan ol ana sayfaya götürür (açık pencere varsa önce onu kapatır).
// Ana sayfadayken iki kez arka arkaya basınca uygulamadan çıkar.
(function () {
  const ana = document.getElementById("ana"), h1 = document.querySelector("h1");
  if (!ana || !h1) return;
  let son = 0, hazir = false;
  const durum = () => { try { history.pushState({ arena: 1 }, ""); } catch (e) {} };

  function toast(m) {
    const t = document.createElement("div");
    t.textContent = m;
    t.style.cssText = "position:fixed;left:50%;bottom:calc(70px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:100050;background:rgba(20,28,60,.95);color:#fff;border:1px solid #4a5a9a;border-radius:14px;padding:10px 16px;font:600 14px system-ui,sans-serif";
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 1800);
  }
  // Açık pencereyi (Hesap, Arena/Sıralama, istek penceresi, seviye geçildi...) kapatır; kapattıysa true döner
  function katmanKapat() {
    const g = document.getElementById("gecis");
    if (g && g.classList.contains("ac")) { g.classList.remove("ac"); return true; }
    let bulundu = false;
    document.querySelectorAll("body > *").forEach(e => {
      if (bulundu || e === h1) return;
      const cs = getComputedStyle(e);
      if (cs.position !== "fixed" || cs.display === "none" || cs.visibility === "hidden" || +cs.opacity === 0) return;
      const r = e.getBoundingClientRect();
      if (r.width < innerWidth * 0.9 || r.height < innerHeight * 0.5) return;
      const x = Array.from(e.querySelectorAll("button")).find(b => /^(✕|×|✖|x|X|Vazgeç|Kapat)$/.test(b.textContent.trim()));
      if (x) { x.click(); bulundu = true; }
    });
    return bulundu;
  }

  // Geri tuşuna basılınca yapılacak iş (tus: true = Capacitor'dan geldi, geçmiş kaydı eklemeye gerek yok)
  function geri(tus) {
    const kapandi = katmanKapat();
    const yeniden = () => { if (!tus) durum(); };
    if (!ana.classList.contains("hidden")) {
      if (kapandi) { yeniden(); return; }
      if (Date.now() - son < 2000) {
        try { window.Capacitor.Plugins.App.exitApp(); } catch (e) {}
        return;
      }
      son = Date.now(); toast("Çıkmak için tekrar geri bas"); yeniden();
      return;
    }
    if (!kapandi) h1.click();                           // oyundaysa ana sayfaya dön
    yeniden();
  }

  // 1) APK: Capacitor geri tuşu olayı (en sağlam yol; uygulamanın kendiliğinden kapanmasını engeller)
  try {
    const App = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App;
    if (App && App.addListener) { App.addListener("backButton", () => geri(true)); hazir = true; }
  } catch (e) {}
  // 2) Tarayıcı / PWA: geçmiş kaydı. Chrome, kullanıcı dokunmadan eklenen kayıtları geri tuşunda atladığı için
  //    ilk dokunuşta eklenir.
  if (!hazir) {
    const ilk = () => { document.removeEventListener("pointerdown", ilk, true); durum(); };
    document.addEventListener("pointerdown", ilk, true);
    durum();
    window.addEventListener("popstate", () => geri(false));
  }
})();
