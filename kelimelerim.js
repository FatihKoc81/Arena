// İŞLEM OYUNU (Bir Kelime Bir İşlem - işlem kısmı)
// index.html'de zaten var: <script src="kelimeislem.js"></script>
(function () {
  const ana = document.getElementById("ana");
  if (!ana) return;

  const SURE = 90, OPS = ["+", "−", "×", "÷"];
  const $ = id => document.getElementById(id);
  const rnd = n => Math.floor(Math.random() * n);

  const css = document.createElement("style");
  css.textContent = `
  #isEkran .isHedef{text-align:center;color:#7f89b8}
  #isEkran .isHedef b{display:block;font-size:clamp(40px,6.4vh,60px);line-height:1.1;color:#fff}
  #isEkran .isSure{height:8px;background:#232f4a;border-radius:8px;margin:10px 0;overflow:hidden}
  #isEkran .isSure i{display:block;height:100%;width:100%;background:#2fbf71;transition:width 1s linear}
  #isEkran .isGrid{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-bottom:10px}
  #isEkran .isSay button{flex:0 0 calc((100% - 20px) / 3)}
  #isEkran .isIsl button{flex:0 0 calc((100% - 30px) / 4)}
  #isEkran .isGrid button{box-sizing:border-box;border:0;border-radius:999px;background:#232f4a;color:#fff;font:inherit;font-size:24px;font-weight:700;line-height:1.2;height:clamp(44px,7vh,64px);padding:0;text-align:center;display:flex;align-items:center;justify-content:center;cursor:pointer}
  #isEkran .isGrid button.secili{background:#5c1a1a}
  #isEkran .isGrid button:disabled{opacity:.3;cursor:default}
  #isEkran .isLog{flex:1 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;white-space:pre-line;color:#7f89b8;line-height:1.45;margin-bottom:6px;text-align:center}
  #isEkran .isMsg{text-align:center;font-weight:700;min-height:24px;margin-bottom:4px}
  #isEkran .isUst{display:flex;justify-content:space-between;color:#7f89b8;margin-bottom:6px}
  #isEkran:not(.hidden){display:flex;flex-direction:column;box-sizing:border-box;position:relative;overflow:hidden}
  #isEkran > *{flex:none}
  #isEkran > .isLog{flex:1 1 auto}
  html.is-kilit,html.is-kilit body{overflow:hidden!important;overscroll-behavior:none!important;height:100%!important}
  `;
  document.head.append(css);

  const ekran = document.createElement("section");
  ekran.className = "kart hidden";
  ekran.id = "isEkran";
  ekran.innerHTML = `
    <div class="isUst"><b>🔢 İşlem Oyunu</b><span id="isPuan">Puan: 0</span></div>
    <div class="isHedef">Hedef sayı<b id="isHedef">---</b></div>
    <div class="isSure"><i id="isBar"></i></div>
    <div class="isGrid isSay" id="isSay"></div>
    <div class="isGrid isIsl" id="isIsl"></div>
    <div class="isLog" id="isLog"></div>
    <div class="isMsg" id="isMsg"></div>
    <button class="btn ikinci" id="isGeri">↩️ Geri Al</button>
    <button class="btn ikinci" id="isYeni">🔄 Yeni Tur</button>`;
  ana.after(ekran);

  const buton = document.createElement("button");
  buton.className = "btn ikinci";
  buton.textContent = "🔢 İşlem Oyunu";
  ana.append(buton);

  let hedef, sayilar, gecmis, secA, secOp, kalan, tid, bitti, toplam = 0;
  let sonrakiTid;

  function hesapla(a, op, b) {
    if (op === "+") return a + b;
    if (op === "−") return a > b ? a - b : null;
    if (op === "×") return a * b;
    return b && a % b === 0 ? a / b : null;
  }

  function bulmaca() {
    const buyuk = [25, 50, 75, 100].sort(() => Math.random() - .5).slice(0, 1 + rnd(3));
    const havuz = buyuk.slice();
    while (havuz.length < 6) havuz.push(1 + rnd(10));
    for (let t = 0; t < 3000; t++) {
      let l = havuz.slice();
      const adim = 3 + rnd(3);
      for (let s = 0; s < adim && l.length > 1; s++) {
        const x = rnd(l.length), y = rnd(l.length);
        if (x === y) continue;
        const r = hesapla(l[x], OPS[rnd(4)], l[y]);
        if (r === null || r < 1) continue;
        l = l.filter((_, k) => k !== x && k !== y);
        l.push(r);
      }
      const son = l[l.length - 1];
      if (son >= 100 && son <= 999 && !havuz.includes(son)) return { havuz, hedef: son };
    }
    return { havuz: [100, 75, 50, 25, 3, 7], hedef: 652 };
  }

  function basla() {
    clearTimeout(sonrakiTid);
    const p = bulmaca();
    hedef = p.hedef;
    sayilar = p.havuz.map((v, i) => ({ v, id: i }));
    gecmis = []; secA = null; secOp = null; kalan = SURE; bitti = false;
    $("isHedef").textContent = hedef;
    $("isMsg").textContent = "";
    $("isBar").style.width = "100%";
    $("isBar").style.background = "";
    clearInterval(tid);
    tid = setInterval(() => {
      kalan--;
      $("isBar").style.width = Math.max(0, kalan / SURE * 100) + "%";
      if (kalan <= 20) $("isBar").style.background = "#f0b429";
      if (kalan <= 0) bitir();
    }, 1000);
    ciz();
  }

  function bitir() {
    if (bitti) return;
    bitti = true;
    clearInterval(tid);
    const yakin = sayilar.reduce((m, n) => Math.abs(n.v - hedef) < Math.abs(m - hedef) ? n.v : m, sayilar[0].v);
    const fark = Math.abs(yakin - hedef);
    let puan = 0, yazi;
    if (fark === 0) { puan = 10; yazi = "Tam isabet! +10 puan 🎯"; }
    else if (fark <= 5) { puan = 7; yazi = "En yakın " + yakin + " (" + fark + " fark). +7 puan"; }
    else if (fark <= 10) { puan = 5; yazi = "En yakın " + yakin + " (" + fark + " fark). +5 puan"; }
    else yazi = "En yakın " + yakin + " (" + fark + " fark). Puan yok";
    toplam += puan;
    $("isPuan").textContent = "Puan: " + toplam;
    $("isMsg").style.color = puan ? "#2fbf71" : "#f0b429";
    $("isMsg").textContent = yazi;
    sonrakiTid = setTimeout(basla, 3000);
    ciz();
  }

  function ciz() {
    const kutu = $("isSay");
    kutu.textContent = "";
    sayilar.forEach(n => {
      const b = document.createElement("button");
      b.textContent = n.v;
      if (secA === n.id) b.className = "secili";
      b.disabled = bitti;
      b.onclick = () => sayiSec(n.id);
      kutu.append(b);
    });
    const ok = $("isIsl");
    ok.textContent = "";
    OPS.forEach(o => {
      const b = document.createElement("button");
      b.textContent = o;
      if (secOp === o) b.className = "secili";
      b.disabled = bitti || secA === null;
      b.onclick = () => { secOp = o; ciz(); };
      ok.append(b);
    });
    $("isLog").textContent = gecmis.length ? gecmis.slice(-3).map(h => h.yazi).join("\n") : "Bir sayı, bir işlem, bir sayı seç.";
    $("isGeri").disabled = bitti || !gecmis.length;
  }

  function sayiSec(id) {
    if (bitti) return;
    if (secA === null || secOp === null) { secA = id; ciz(); return; }
    if (id === secA) { secA = null; secOp = null; ciz(); return; }
    const a = sayilar.find(n => n.id === secA), b = sayilar.find(n => n.id === id);
    const r = hesapla(a.v, secOp, b.v);
    if (r === null) {
      $("isMsg").style.color = "#f0b429";
      $("isMsg").textContent = secOp === "÷" ? "Bölme tam çıkmalı." : "Sonuç pozitif olmalı.";
      return;
    }
    $("isMsg").textContent = "";
    gecmis.push({ onceki: sayilar.slice(), yazi: a.v + " " + secOp + " " + b.v + " = " + r });
    sayilar = sayilar.filter(n => n.id !== a.id && n.id !== b.id);
    const yeniId = 100 + gecmis.length + rnd(1000000);
    sayilar.push({ v: r, id: yeniId });
    if (r === hedef) { secA = null; secOp = null; bitir(); return; }
    secA = yeniId; secOp = null;
    ciz();
  }

  // Ekranı sabitle: sayfa kaymaz, kart "Yeni tur" düğmesi yüksekliği kadar aşağı iner ve alta tam sığar
  function yerlestir() {
    if (ekran.classList.contains("hidden")) return;
    const y = $("isYeni"), cs = getComputedStyle(y);
    const KAYMA_ORAN = 0.6; // 1 = "Yeni Tur" düğmesi yüksekliği kadar; küçültürsen kart yukarı çıkar
    const kayma = Math.round((y.offsetHeight + (parseFloat(cs.marginTop) || 0)) * KAYMA_ORAN);
    ekran.style.top = "0px";
    ekran.style.height = "auto";
    const ust = ekran.getBoundingClientRect().top + window.scrollY;
    ekran.style.top = kayma + "px";
    ekran.style.height = Math.max(300, window.innerHeight - ust - kayma - 12) + "px";
  }
  function kilitle() {
    const ac = !ekran.classList.contains("hidden");
    document.documentElement.classList.toggle("is-kilit", ac);
    if (ac) { window.scrollTo(0, 0); yerlestir(); }
  }
  new MutationObserver(kilitle).observe(ekran, { attributes: true, attributeFilter: ["class"] });
  window.addEventListener("resize", yerlestir);
  window.addEventListener("scroll", () => { if (!ekran.classList.contains("hidden") && window.scrollY) window.scrollTo(0, 0); });
  document.addEventListener("touchmove", e => {
    if (!ekran.classList.contains("hidden")) e.preventDefault();
  }, { passive: false });

  buton.onclick = () => {
    ana.classList.add("hidden");
    ekran.classList.remove("hidden");
    basla();
  };
  $("isYeni").onclick = basla;
  $("isGeri").onclick = () => {
    if (bitti || !gecmis.length) return;
    sayilar = gecmis.pop().onceki; secA = null; secOp = null;
    $("isMsg").textContent = "";
    ciz();
  };
  document.addEventListener("anasayfa", () => { clearInterval(tid); clearTimeout(sonrakiTid); });
})();
