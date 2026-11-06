// ANA MENÜ KARTLARI (tasarım B): oyun düğmeleri 2 sütunlu kart ızgarası olur.
// Düğmelerin kendisi ve tıklama kodları aynen kalır; sadece içeriği (simge + ad + alt yazı) ve görünümü değişir.
// Simge/alt yazı/renk değiştirmek için aşağıdaki OYUNLAR listesini düzenle.
(function () {
  const ana = document.getElementById("ana");
  if (!ana) return;

  // eşleşme sırası önemli: "Rotasyon" "Kelime"den önce bakılır
  const OYUNLAR = [
    { re: /Milyoner/, ad: "Milyoner", renk: "#68272f", simge: "m", sira: 1 },
    { re: /Passaparola/, ad: "Passaparola", renk: "#256556", simge: "p", sira: 2 },
    { re: /Rotasyon/, ad: "Rotasyon", renk: "#724222", simge: "c", sira: 5, genis: true },
    { re: /Kelime/, ad: "Kelime Oyunu", renk: "#28416c", simge: "k", sira: 3 },
    { re: /İşlem/, ad: "İşlem Oyunu", renk: "#422e6b", simge: "o", sira: 4 }
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
    "#ana{--ch:92px;--ch:clamp(56px,calc((100svh - 480px) / 2.9),108px);display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:auto;margin-bottom:auto;position:relative;top:0}" +
    "body:has(#ana:not(.hidden)){padding-top:calc(var(--bas-yuk,58px) + env(safe-area-inset-top) + 96px)!important;padding-bottom:calc(var(--dock-yuk,116px) + 24px + env(safe-area-inset-bottom))!important}" +
    "#ana.hidden{display:none!important}" +
    "#ana>.alt{grid-column:1/-1;margin-bottom:6px;order:0}" +
    "#ana>.pill{display:none}" +
    "#ana>.ek-bar{display:none}" +
    // Tüm oyun kartları (Milyoner dahil) birebir aynı: aynı kenarlık, aynı yükseklik, gölge yok
    "#ana>.btn.kartB{order:var(--sira);margin:0!important;width:auto;height:var(--ch);padding:8px 6px;border-radius:20px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:16px;line-height:1.25;border:2px solid rgba(255,255,255,.2)!important;outline:0!important;box-shadow:none!important;transform:none;animation:none;background:var(--kc)!important;color:#fff!important}" +
    "#ana>.btn.kartB.genis{grid-column:1/-1;height:calc(var(--ch) * .9)}" +
    "#ana>.btn.kartB .ic{width:clamp(30px,calc(var(--ch) * .52),56px);height:clamp(30px,calc(var(--ch) * .52),56px);display:block;margin-bottom:4px;flex:none}" +
    "#ana>.btn.kartB b{font-size:clamp(14px,4.2vw,16px);font-weight:700;display:block;white-space:nowrap}" +
    "#ana>.btn.kartB:active{opacity:.85;transform:none}" +
    // ALT BÖLÜM: kartın ALTINDA, ekranın en dibine yakın durur (eskiden 62px yukarıdaydı, kartın üstüne biniyordu).
    // Üst sıra Fatih / Altın / Premium / Puan (4 eşit kutu), alt sıra yan yana Davet + Güncelle (her biri 2 kutu genişliğinde).
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
