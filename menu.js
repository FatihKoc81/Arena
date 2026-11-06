// ANA MENÜ KARTLARI (tasarım B): oyun düğmeleri 2 sütunlu kart ızgarası olur.
// Düğmelerin kendisi ve tıklama kodları aynen kalır; sadece içeriği (simge + ad + alt yazı) ve görünümü değişir.
// Simge/alt yazı/renk değiştirmek için aşağıdaki OYUNLAR listesini düzenle.
(function () {
  const ana = document.getElementById("ana");
  if (!ana) return;

  // eşleşme sırası önemli: "Rotasyon" "Kelime"den önce bakılır
  const OYUNLAR = [
    { re: /Milyoner/, ad: "Milyoner", renk: "linear-gradient(145deg,#8f263d,#54152f)", simge: "m", sira: 1 },
    { re: /Passaparola/, ad: "Passaparola", renk: "linear-gradient(145deg,#087f78,#07504f)", simge: "p", sira: 2 },
    { re: /Rotasyon/, ad: "Rotasyon", renk: "linear-gradient(145deg,#c05a20,#713018)", simge: "c", sira: 5, genis: true },
    { re: /Kelime/, ad: "Kelime Oyunu", renk: "linear-gradient(145deg,#245fc7,#173477)", simge: "k", sira: 3 },
    { re: /İşlem/, ad: "İşlem Oyunu", renk: "linear-gradient(145deg,#7844c9,#432477)", simge: "o", sira: 4 },
    { re: /Meydan Oku/, ad: "Meydan Oku", renk: "linear-gradient(145deg,#c23c4a,#762538)", simge: "m", sira: 6 },
    { re: /Sıralama/, ad: "Sıralama", renk: "linear-gradient(145deg,#b68a25,#705316)", simge: "p", sira: 7 }
  ];

  const SIMGELER =
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    '<symbol id="i-m" viewBox="0 0 48 48"><ellipse cx="24" cy="38" rx="15" ry="6" fill="#a87408"/><rect x="9" y="32" width="30" height="6" fill="#d4a63a"/><ellipse cx="24" cy="32" rx="15" ry="6" fill="#f5d56b"/><ellipse cx="24" cy="30" rx="15" ry="6" fill="#a87408"/><rect x="9" y="24" width="30" height="6" fill="#d4a63a"/><ellipse cx="24" cy="24" rx="15" ry="6" fill="#f5d56b"/><ellipse cx="24" cy="22" rx="15" ry="6" fill="#a87408"/><rect x="9" y="16" width="30" height="6" fill="#d4a63a"/><ellipse cx="24" cy="16" rx="15" ry="6" fill="#f5d56b"/><ellipse cx="24" cy="16" rx="9" ry="3.4" fill="none" stroke="#c9972a" stroke-width="1.2"/></symbol>' +
    '<symbol id="i-p" viewBox="0 0 48 48"><g fill="#e8c77a"><rect x="36" y="20" width="8" height="8" rx="2"/><rect x="33.9" y="28" width="8" height="8" rx="2"/><rect x="28" y="33.9" width="8" height="8" rx="2"/><rect x="20" y="36" width="8" height="8" rx="2"/><rect x="12" y="33.9" width="8" height="8" rx="2"/><rect x="6.1" y="28" width="8" height="8" rx="2"/><rect x="4" y="20" width="8" height="8" rx="2"/><rect x="6.1" y="12" width="8" height="8" rx="2"/><rect x="12" y="6.1" width="8" height="8" rx="2"/><rect x="20" y="4" width="8" height="8" rx="2"/><rect x="28" y="6.1" width="8" height="8" rx="2"/><rect x="33.9" y="12" width="8" height="8" rx="2"/></g><text x="24" y="30" text-anchor="middle" font-size="16" font-weight="700" fill="#fff">A</text></symbol>' +
    '<symbol id="i-k" viewBox="0 0 48 48"><rect x="4" y="8" width="28" height="28" rx="2" fill="#f1efe8"/><g fill="#2c2c2a"><rect x="13.3" y="8" width="9.4" height="9.3"/><rect x="4" y="17.3" width="9.3" height="9.4"/><rect x="22.7" y="17.3" width="9.3" height="9.4"/><rect x="13.3" y="26.7" width="9.4" height="9.3"/></g><circle cx="31" cy="29" r="9" fill="rgba(200,230,255,.4)" stroke="#e8e8e8" stroke-width="3"/><line x1="37.5" y1="35.5" x2="44" y2="42" stroke="#c28a4a" stroke-width="4.5" stroke-linecap="round"/></symbol>' +
    '<symbol id="i-o" viewBox="0 0 48 48"><g fill="#d6ddff"><rect x="4" y="4" width="19" height="19" rx="5"/><rect x="25" y="4" width="19" height="19" rx="5"/><rect x="4" y="25" width="19" height="19" rx="5"/><rect x="25" y="25" width="19" height="19" rx="5"/></g><g stroke="#2b2f7a" stroke-width="2.6" stroke-linecap="round" fill="none"><path d="M13.5 8.5v10M8.5 13.5h10"/><path d="M30 13.5h9"/><path d="M9.5 30l8 8M17.5 30l-8 8"/><path d="M30 34.5h9"/></g><circle cx="34.5" cy="30" r="1.8" fill="#2b2f7a"/><circle cx="34.5" cy="39" r="1.8" fill="#2b2f7a"/></symbol>' +
    '<symbol id="i-c" viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="rgba(255,255,255,.14)" stroke="#ffd9a8" stroke-width="2.4"/><g font-size="10" font-weight="700" fill="#fff" text-anchor="middle"><text x="24" y="14">R</text><text x="37" y="23.4">O</text><text x="32" y="38.6">T</text><text x="16" y="38.6">A</text><text x="11" y="23.4">S</text></g><path d="M20.2 23.2A4 4 0 0 1 27.6 22" fill="none" stroke="#ffd9a8" stroke-width="1.8" stroke-linecap="round"/><polygon points="28.6,18.8 29,23.6 24.6,22.4" fill="#ffd9a8"/><path d="M27.8 24.8A4 4 0 0 1 20.4 26" fill="none" stroke="#ffd9a8" stroke-width="1.8" stroke-linecap="round"/><polygon points="19.4,29.2 19,24.4 23.4,25.6" fill="#ffd9a8"/></symbol>' +
    '</defs></svg>';

  const st = document.createElement("style");
  st.textContent =
    // Boyutlar tarayıcı çubuklarına göre zıplamasın diye "svh" (küçük ekran yüksekliği) ile hesaplanır; sabit eşik (media query) yok.
    "#ana{--ch:92px;--ch:clamp(56px,calc((100svh - 480px) / 2.9),108px);display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:12px 0 12px!important;position:relative;top:0;width:100%;max-width:460px;background:transparent!important;border:0!important;box-shadow:none!important;border-radius:0!important;padding:0 4px!important}" +
    "body:has(#ana:not(.hidden)){padding-top:calc(var(--bas-yuk,58px) + env(safe-area-inset-top) + 96px)!important;padding-bottom:calc(var(--dock-yuk,116px) + 24px + env(safe-area-inset-bottom))!important}" +
    "#ana.hidden{display:none!important}" +
    "#ana>.alt{display:none!important}" +
    "#ana>.pill{display:none}" +
    "#ana>.ek-bar{display:none}" +
    // Tüm oyun kartları (Milyoner dahil) birebir aynı: aynı kenarlık, aynı yükseklik, gölge yok
    "#ana>.btn.kartB{order:var(--sira);margin:0!important;width:auto;height:var(--ch);padding:8px 6px;border-radius:22px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font-size:16px;line-height:1.25;border:1px solid rgba(255,255,255,.34)!important;outline:0!important;box-shadow:0 7px 18px rgba(0,0,0,.24),inset 0 1px 0 rgba(255,255,255,.16)!important;transform:none;animation:none;background:var(--kc)!important;color:#fff!important}" +
    "#ana>.btn.kartB.genis{grid-column:1/-1;height:calc(var(--ch) * .9)}" +
    "#ana>.btn.kartB .ic{width:clamp(30px,calc(var(--ch) * .48),52px);height:clamp(30px,calc(var(--ch) * .48),52px);display:block;margin-bottom:4px;flex:none;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2))}" +
    "#ana>.btn.kartB b{font-size:clamp(14px,4.2vw,16px);font-weight:700;display:block;white-space:nowrap}" +
    "#ana>.btn.kartB:active{opacity:.85;transform:none}" +
    // ALT BÖLÜM: kartın ALTINDA, ekranın en dibine yakın durur (eskiden 62px yukarıdaydı, kartın üstüne biniyordu).
    // Üst sıra Fatih / Altın / Premium / Puan (4 eşit kutu), alt sıra yan yana İsimle istek + Güncelle (her biri 2 kutu genişliğinde).
    // Sayfa alt boşluğu (padding-bottom) bu bölümün gerçek yüksekliğine göre ayarlanır (--dock-yuk), böylece kart asla altına girmez.
    "html body .ek-dock{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;grid-auto-rows:auto!important;gap:8px!important;align-items:stretch!important;bottom:calc(10px + env(safe-area-inset-bottom))!important}" +
    "html body .ek-dock:not(.show){display:none!important}" +
    "html body .ek-dock>*{min-width:0!important;width:auto!important;max-width:none!important;box-sizing:border-box!important;overflow:hidden!important;text-overflow:clip!important}" +
    "html body .ek-dock>*:not(.ar-adb):not(.apk-btn){grid-column:span 1!important;height:56px!important}" +
    "html body .ek-dock>.ar-adb,html body .ek-dock>.apk-btn{grid-column:span 2!important;height:52px!important;font-size:15px!important}" +
    // tek başına kalan alt buton (diğeri gizliyse) tam genişlik olur
    "html body .ek-dock:not(:has(.apk-btn:not(.gizli)))>.ar-adb,html body .ek-dock:not(:has(.ar-adb:not(.gizli)))>.apk-btn{grid-column:1/-1!important}";
  document.head.appendChild(st);
  document.body.insertAdjacentHTML("beforeend", SIMGELER);

  function kartla(b) {
    if (b.tagName !== "BUTTON" || b.querySelector(".ic")) return;
    if (b.id === "sifirla") return;
    const t = b.textContent;
    const o = OYUNLAR.find(x => x.re.test(t));
    if (!o) return;
    b.classList.add("kartB");
    b.classList.toggle("genis", !!o.genis);
    b.style.setProperty("--kc", o.renk);
    b.style.setProperty("--sira", o.sira);
    b.innerHTML = '<svg class="ic" viewBox="0 0 48 48" aria-hidden="true"><use href="#i-' + o.simge + '"/></svg><b>' + o.ad + "</b>";
    b.style.removeProperty("background"); // diğer dosyaların eklediği eski renk
  }

  function hepsi() { ana.querySelectorAll("button").forEach(kartla); }
  hepsi();

  // Üst açıklama kaldırıldı; küçük ekranda oyun alanına yer açılır.
  const yeniTasarim = document.createElement("style");
  yeniTasarim.textContent =
    "#ana{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:4px auto 6px!important;padding:9px 10px!important;width:100%;max-width:460px;background:linear-gradient(160deg,rgba(5,14,40,.98),rgba(3,7,25,.98))!important;border:2px solid #526fbd!important;border-radius:36px!important;box-shadow:0 0 22px rgba(55,112,255,.24),inset 0 0 24px rgba(28,68,150,.12)!important}" +
    "#ana .arena-menu-aciklama{display:none!important}" +
    "#ana>.btn.kartB{border-width:2px!important;border-radius:24px!important;box-shadow:0 5px 14px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.2)!important}" +
    "#ana>.btn.kartB.genis{height:calc(var(--ch) * .9)}" +
    "#ana>.btn.kartB[style*=--kc]{background:var(--kc)!important}" +
    "html body .ek-dock>*:not(.ar-adb):not(.apk-btn){background:linear-gradient(145deg,#10254b,#09142e)!important;border:2px solid #315fae!important;border-radius:20px!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.12)!important}" +
    "html body .ek-dock>.ek-dk.g{border-color:#ffbd27!important}" +
    "html body .ek-dock>.ek-dk.p{border-color:#315fae!important}" +
    "html body .ek-dock>.ek-dk.s{border-color:#315fae!important}" +
    "html body .ek-dock>.ar-adb,html body .ek-dock>.apk-btn{background:rgba(5,13,34,.96)!important;border:2px solid #e5ad35!important;border-radius:22px!important;color:#ffd36a!important}" +
    "body:has(#ana:not(.hidden)){position:fixed!important;inset:0!important;width:100%!important;height:100dvh!important;min-height:0!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;align-items:center!important;box-sizing:border-box!important;padding:env(safe-area-inset-top) 10px 0!important;overscroll-behavior:none!important}" +
    "body:has(#ana:not(.hidden))>h1{flex:0 0 48px!important;width:100%!important;min-height:48px!important;height:48px!important;margin:0!important;padding:0!important;display:grid!important;align-items:center!important;font-size:clamp(24px,7vw,32px)!important;line-height:1!important}" +
    "body:has(#ana:not(.hidden))>:not(h1):not(#ana):not(#arenaAltFooter):not(script):not(style):not(link){display:none!important}" +
    "body:has(#ana:not(.hidden)) #ana{--ch:min(78px,calc((100dvh - 245px)/4))!important;flex:1 1 auto!important;min-height:0!important;max-height:none!important;align-content:center!important;grid-template-rows:repeat(2,var(--ch)) calc(var(--ch)*.9) var(--ch)!important;gap:7px!important;margin:4px auto 6px!important;padding:9px 10px!important;width:100%!important;max-width:460px!important;box-sizing:border-box!important;overflow:hidden!important}" +
    "body:has(#ana:not(.hidden)) #ana>.btn.kartB{height:var(--ch)!important;min-height:0!important;padding:5px 4px!important;gap:2px!important;border-radius:20px!important}" +
    "body:has(#ana:not(.hidden)) #ana>.btn.kartB.genis{height:calc(var(--ch)*.9)!important}" +
    "body:has(#ana:not(.hidden)) #ana>.btn.kartB .ic{width:clamp(26px,calc(var(--ch)*.43),42px)!important;height:clamp(26px,calc(var(--ch)*.43),42px)!important;margin-bottom:1px!important}" +
    "body:has(#ana:not(.hidden)) #ana>.btn.kartB b{font-size:clamp(13px,3.9vw,16px)!important}" +
    "html body #arenaAltFooter{position:fixed!important;left:0!important;right:0!important;bottom:calc(5px + env(safe-area-inset-bottom))!important;z-index:999!important;width:100%!important;max-width:620px!important;margin:0 auto!important;padding:0 12px!important;box-sizing:border-box!important;display:flex!important;flex-direction:column!important;gap:6px!important;transform:none!important;pointer-events:none!important}" +
    "html body #arenaAltFooter.gizli{display:none!important}" +
    "html body #arenaAltFooter .ek-dock.show{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:6px!important}" +
    "html body #arenaAltFooter .ek-dk{height:60px!important;min-height:60px!important;grid-column:span 1!important;border-radius:16px!important}" +
    "html body #arenaAltFooter #altSatir{display:flex!important;gap:6px!important}" +
    "html body #arenaAltFooter #altSatir>*{height:42px!important;border-radius:15px!important;font-size:clamp(12px,3.4vw,14px)!important}" +
    "html.menu-kilit,html.menu-kilit body{overflow:hidden!important;overscroll-behavior:none!important;height:100%!important;touch-action:pan-x!important}" +
    "html.menu-kilit body{position:fixed!important;inset:0!important;width:100%!important}";
  document.head.appendChild(yeniTasarim);

  // sonradan eklenen düğmeler (Kelime Çemberi gibi) ve eski dosyaların geri koyduğu satır içi renkler
  new MutationObserver(function () {
    hepsi();
    ana.querySelectorAll("button.kartB").forEach(function (b) {
      if (b.style.getPropertyValue("background")) b.style.removeProperty("background");
    });
  }).observe(ana, { childList: true, subtree: true, attributes: true, attributeFilter: ["style", "class"] });

  window.addEventListener("load", hepsi);

  // Alt bölümün (dock) gerçek yüksekliğini ölç, sayfa alt boşluğuna yaz
  function dockYuk() {
    const d = document.querySelector(".ek-dock");
    if (!d) return;
    if (!d._yuk && window.ResizeObserver) { d._yuk = true; new ResizeObserver(dockYuk).observe(d); }
    const h = d.offsetHeight;
    if (h) document.documentElement.style.setProperty("--dock-yuk", h + "px");
  }
  new MutationObserver(dockYuk).observe(document.body, { childList: true });
  window.addEventListener("load", dockYuk);
  window.addEventListener("resize", dockYuk);
  dockYuk();
})();
