// ORTAK AYARLAR (tüm oyunlar için)
// index.html'de </body> öncesine ekle: <script src="ortak.js"></script>
// "BİLGİ ARENASI" başlığına tıklayınca, hangi oyunda olursan ol ana sayfaya döner.

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

  function kaydir() {
    if (oyun.classList.contains("hidden")) { oyun.style.top = ""; return; }
    // Ölçü: "Ana Menü" düğmesi, İşlem Oyunu'ndaki "Yeni Tur" ile aynı .btn.ikinci stilinde
    let ref = null;
    oyun.querySelectorAll("button.btn.ikinci").forEach(b => { if (/Ana Menü/.test(b.textContent)) ref = b; });
    if (!ref || !ref.offsetHeight) return;
    const kayma = Math.round((ref.offsetHeight + (parseFloat(getComputedStyle(ref).marginTop) || 0)) * KAYMA_ORAN);
    if (getComputedStyle(oyun).position === "static") oyun.style.position = "relative";
    oyun.style.top = kayma + "px";
  }
  new MutationObserver(kaydir).observe(oyun, { attributes: true, attributeFilter: ["class"] });
  window.addEventListener("resize", kaydir);
  kaydir();
})();
