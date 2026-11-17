/* ARENA — Ana menü premium katmanı (1. aşama)
   Yalnızca görünüm + ses altyapısı. Oyun mantığına, menu.js'in tıklama/yönlendirme koduna dokunmaz.
   Web ve Android WebView aynı dosyayı kullanır (CSS bu dosyadan enjekte edilir; android.yml *.js kopyalar).
   Ses: harici dosya yok, WebAudio ile üretilir. Ayar anahtarları mevcut arenaMusic / arenaSfx ile ortaktır. */
(function () {
  "use strict";
  if (window.ArenaMenuPremium) return;
  var H = "html.arena-home-fixed body #ana #arenaHubHome";
  var CAT_ART = ["knowledge", "words", "table", "logic", "numbers", "colors", "memory", "reflex"];

  /* ---------------------------------------------------------------- CSS */
  var catIcons = CAT_ART.map(function (a, i) {
    return H + ">.ar-categories:not(.is-open)>.ar-cat:nth-child(" + (i + 1) + ") .ar-cat-icon{background-image:url(assets/game-art/" + a + ".svg)!important}";
  }).join("\n");

  var css = [
    /* Başlık: bulanık raster yerine vektör logo + ikonlar (her çözünürlükte keskin) */
    "body>h1{background:url(assets/menu/logo.svg) center 38%/auto 74% no-repeat,linear-gradient(180deg,rgba(14,26,58,.92),rgba(4,9,24,.88))!important;-webkit-backdrop-filter:blur(14px) saturate(140%);backdrop-filter:blur(14px) saturate(140%);border-bottom:1px solid rgba(120,170,255,.22)!important;box-shadow:0 6px 24px rgba(0,0,0,.55),inset 0 -1px 0 rgba(255,255,255,.05)!important}",
    "body>h1 .ar-header-hotspot{background-repeat:no-repeat!important;background-position:center!important;background-size:62% auto!important;transition:transform .16s cubic-bezier(.3,1.6,.5,1),filter .16s!important;filter:drop-shadow(0 2px 4px rgba(0,0,0,.6))}",
    "body>h1 .ar-header-hotspot.left{background-image:url(assets/menu/ic-menu.svg)!important}",
    "body>h1 .ar-header-hotspot.bell{background-image:url(assets/menu/ic-bell.svg)!important}",
    "body>h1 .ar-header-hotspot.gear{background-image:url(assets/menu/ic-gear.svg)!important}",
    "body>h1 .ar-header-hotspot:active{transform:scale(.88)!important;filter:drop-shadow(0 0 8px rgba(120,190,255,.9))}",
    /* Arka plan: derinlik için sabit, yalnızca transform ile hareket eden ışık katmanı */
    "#arenaMenuAmbient{position:fixed;inset:-20%;z-index:0;pointer-events:none;contain:strict;opacity:.9;background:radial-gradient(38% 30% at 22% 18%,rgba(60,130,255,.30),transparent 70%),radial-gradient(34% 28% at 82% 46%,rgba(150,70,255,.22),transparent 70%),radial-gradient(40% 30% at 30% 86%,rgba(0,200,200,.16),transparent 70%);animation:arAmb 22s ease-in-out infinite alternate;will-change:transform}",
    "@keyframes arAmb{from{transform:translate3d(-2%,-1%,0) scale(1)}to{transform:translate3d(2%,2%,0) scale(1.06)}}",
    "html:not(.arena-home-fixed) #arenaMenuAmbient{display:none}",
    /* Cam efektli profil kartı, kısayollar ve alt çubuk (az sayıda statik yüzey: mobilde ucuz) */
    H + " .ar-profile{background:linear-gradient(145deg,rgba(30,56,110,.62),rgba(8,16,40,.72))!important;-webkit-backdrop-filter:blur(12px) saturate(150%);backdrop-filter:blur(12px) saturate(150%);border:1px solid rgba(140,190,255,.30)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.22),inset 0 -14px 28px rgba(0,0,0,.28),0 10px 28px rgba(0,0,0,.5)!important}",
    H + " .ar-shortcuts>.ar-short{background:linear-gradient(160deg,rgba(40,70,130,.60),rgba(8,16,40,.72))!important;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border:1px solid rgba(140,190,255,.28)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.2),0 6px 14px rgba(0,0,0,.45)!important}",
    "html.arena-home-fixed #arenaNeonNav{background:linear-gradient(180deg,rgba(20,36,72,.78),rgba(5,10,26,.88))!important;-webkit-backdrop-filter:blur(16px) saturate(160%)!important;backdrop-filter:blur(16px) saturate(160%)!important;border:1px solid rgba(140,190,255,.28)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 -6px 24px rgba(0,0,0,.55)!important}",
    "html.arena-home-fixed #arenaNeonNav button.active{box-shadow:0 0 18px rgba(110,140,255,.55),inset 0 1px 0 rgba(255,255,255,.3)!important}",
    /* Kategori kartları: keskin SVG ikonlar geri getirilir (önceki katmanlar ikonları boş bırakıyordu) */
    H + ">.ar-categories:not(.is-open)>.ar-cat .ar-cat-icon{background-repeat:no-repeat!important;background-position:center!important;background-size:contain!important;font-size:0!important;width:100%!important;height:100%!important;min-height:44px;filter:drop-shadow(0 6px 8px rgba(0,0,0,.65)) drop-shadow(0 0 10px rgba(120,180,255,.25))!important;transition:transform .35s cubic-bezier(.3,1.5,.5,1)!important}",
    catIcons,
    H + ">.ar-categories:not(.is-open)>.ar-cat{border:1px solid rgba(150,200,255,.34)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.28),inset 0 -16px 26px rgba(0,0,0,.30),0 8px 18px rgba(0,0,0,.5),0 0 14px var(--glow,rgba(80,140,255,.3))!important}",
    /* Dokunma: yaylı basma + bırakma. Yalnızca transform/opacity => GPU, 60 FPS */
    H + " .ar-cat," + H + " .ar-short," + H + " .ar-feature," + H + " .ar-top-btn,html.arena-home-fixed #arenaNeonNav button{position:relative;overflow:hidden;transition:transform .22s cubic-bezier(.3,1.6,.5,1),filter .2s!important;-webkit-user-select:none;user-select:none;touch-action:manipulation}",
    H + " .ar-cat:active," + H + " .ar-short:active," + H + " .ar-feature:active,html.arena-home-fixed #arenaNeonNav button:active{transform:scale(.955)!important;transition-duration:.08s!important;filter:brightness(1.15)}",
    H + " .ar-cat:active .ar-cat-icon{transform:scale(1.1) rotate(-3deg)}",
    ".arp-rip{position:absolute;left:0;top:0;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(255,255,255,.55),rgba(140,190,255,.25) 55%,transparent 70%);transform:scale(0);opacity:1;animation:arRip .55s cubic-bezier(.2,.7,.3,1) forwards;will-change:transform,opacity}",
    "@keyframes arRip{to{transform:scale(var(--s,14));opacity:0}}",
    /* Açılış animasyonu (kademeli). Bir kez oynar, sonra will-change bırakılır */
    "html.arp-intro " + H + " .ar-profile,html.arp-intro " + H + " .ar-shortcuts>.ar-short,html.arp-intro " + H + " .ar-categories>.ar-cat,html.arp-intro " + H + " .ar-daily,html.arp-intro " + H + " .ar-feature{animation:arIn .55s cubic-bezier(.2,.9,.3,1) both!important;animation-delay:calc(var(--i,0)*45ms)!important}",
    "@keyframes arIn{from{opacity:0;transform:translate3d(0,16px,0) scale(.97)}to{opacity:1;transform:none}}",
    /* Ses düğmesi (başlıkta, bildirim ikonunun solunda) */
    "#arpSound{position:absolute;right:calc(21% + 4px);top:calc(env(safe-area-inset-top) + (var(--bas-yuk,58px) - 30px)/2);z-index:54;width:30px;height:30px;min-height:30px;padding:0;border:1px solid rgba(140,190,255,.35);border-radius:10px;background:rgba(10,20,48,.7) url(assets/menu/ic-sound.svg) center/64% no-repeat;transition:transform .16s cubic-bezier(.3,1.6,.5,1)}",
    "#arpSound.off{background-image:url(assets/menu/ic-mute.svg);opacity:.8}",
    "#arpSound:active{transform:scale(.88)}",
    "html:not(.arena-home-fixed) #arpSound{display:none}",
    "@media (prefers-reduced-motion:reduce){#arenaMenuAmbient{animation:none}html.arp-intro *{animation:none!important}.arp-rip{display:none}}"
  ].join("\n");
  var st = document.createElement("style");
  st.id = "arenaMenuPremium";
  st.textContent = css;
  document.head.appendChild(st);

  /* ------------------------------------------------------------- Ses */
  function flag(k) { try { return localStorage.getItem(k) !== "off"; } catch (e) { return true; } }
  function setFlag(k, v) { try { localStorage.setItem(k, v ? "on" : "off"); } catch (e) {} }
  var AC = null, master = null, musicGain = null, musicTimer = 0, nextT = 0, step = 0, musicRun = false;
  function ctx() {
    if (!AC) {
      var C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      AC = new C();
      master = AC.createGain(); master.gain.value = 1;
      var comp = AC.createDynamicsCompressor();
      master.connect(comp); comp.connect(AC.destination);
      musicGain = AC.createGain(); musicGain.gain.value = 0; musicGain.connect(master);
    }
    if (AC.state === "suspended") AC.resume();
    return AC;
  }
  function tone(f, d, type, v, t0, bend, dest) {
    var a = ctx(); if (!a) return;
    var t = a.currentTime + (t0 || 0), o = a.createOscillator(), g = a.createGain();
    o.type = type || "sine"; o.frequency.setValueAtTime(f, t);
    if (bend) o.frequency.exponentialRampToValueAtTime(bend, t + d);
    g.gain.setValueAtTime(1e-4, t); g.gain.exponentialRampToValueAtTime(v || .05, t + .01); g.gain.exponentialRampToValueAtTime(1e-4, t + d);
    o.connect(g); g.connect(dest || master); o.start(t); o.stop(t + d + .05);
  }
  var SFX = {
    tap: function () { tone(520, .09, "sine", .07, 0, 760); tone(1040, .06, "triangle", .02, .005); },
    open: function () { tone(392, .12, "triangle", .06); tone(587, .16, "sine", .06, .06); tone(784, .2, "sine", .04, .12); },
    back: function () { tone(500, .1, "sine", .06, 0, 320); },
    toggle: function () { tone(660, .08, "square", .025, 0, 880); }
  };
  var lastSfx = 0;
  function sfx(n) {
    if (!flag("arenaSfx")) return;
    var now = Date.now(); if (now - lastSfx < 40) return; lastSfx = now;
    try { SFX[n] && SFX[n](); } catch (e) {}
  }
  /* Menü müziği: Am pentatonik, yavaş akor + hafif arpej. 1.2 sn ileriye planlama, 250 ms zamanlayıcı */
  var CH = [[220, 261.63, 329.63], [174.61, 220, 261.63], [196, 246.94, 293.66], [164.81, 207.65, 246.94]];
  var ARP = [440, 523.25, 659.25, 783.99, 659.25, 523.25];
  function sched() {
    var a = AC; if (!a || !musicRun) return;
    while (nextT < a.currentTime + 1.2) {
      var beat = .75, bar = Math.floor(step / 8) % CH.length, i = step % 8;
      if (i === 0) CH[bar].forEach(function (f) { tone(f, 6, "sine", .05, nextT - a.currentTime, 0, musicGain); tone(f * 2.005, 6, "triangle", .012, nextT - a.currentTime, 0, musicGain); });
      if (i % 2 === 0 || i === 5) tone(ARP[(step * 3 + bar) % ARP.length], 1.1, "sine", .028, nextT - a.currentTime, 0, musicGain);
      nextT += beat; step++;
    }
  }
  function musicStart() {
    if (musicRun || !flag("arenaMusic")) return;
    var a = ctx(); if (!a || a.state !== "running") return;
    musicRun = true; nextT = a.currentTime + .05; sched();
    musicTimer = setInterval(sched, 250);
    musicGain.gain.cancelScheduledValues(a.currentTime);
    musicGain.gain.setTargetAtTime(.9, a.currentTime, .8);
  }
  function musicStop() {
    if (!musicRun) return;
    musicRun = false; clearInterval(musicTimer);
    if (AC && musicGain) { musicGain.gain.cancelScheduledValues(AC.currentTime); musicGain.gain.setTargetAtTime(0, AC.currentTime, .15); }
  }
  var unlocked = false;
  function inMenu() {
    var ana = document.getElementById("ana");
    return document.documentElement.classList.contains("arena-home-fixed") && !document.hidden && ana && !ana.classList.contains("hidden") && !window.__arenaGameOpen;
  }
  function sync() { if (unlocked && inMenu() && flag("arenaMusic")) musicStart(); else musicStop(); }
  window.addEventListener("arena:game-start", function () { window.__arenaGameOpen = true; sync(); });
  window.addEventListener("arena:game-close", function () { window.__arenaGameOpen = false; sync(); });
  window.addEventListener("anasayfa", function () { window.__arenaGameOpen = false; setTimeout(sync, 50); });
  window.addEventListener("arena:home", function () { window.__arenaGameOpen = false; setTimeout(sync, 50); });
  document.addEventListener("visibilitychange", sync);
  setInterval(sync, 1500); /* düşük maliyetli güvence: başka katmanlar sınıfları değiştirirse */

  /* ------------------------------------------------- Dokunma efektleri */
  var SEL = ".ar-cat,.ar-short,.ar-feature,.ar-top-btn,.ar-header-hotspot,#arpSound,#arenaNeonNav button";
  var ripples = 0;
  document.addEventListener("pointerdown", function (e) {
    var t = e.target.closest && e.target.closest(SEL);
    if (!t || !t.closest("#arenaHubHome,#arenaNeonNav,body>h1")) return;
    if (!unlocked) { unlocked = true; ctx(); setTimeout(sync, 60); }
    var kind = t.matches(".ar-cat") ? "open" : t.matches("[data-nav=home],.ar-back") ? "back" : "tap";
    sfx(kind);
    if (navigator.vibrate) try { navigator.vibrate(8); } catch (x) {}
    if (ripples > 3 || t.matches(".ar-header-hotspot,#arpSound")) return;
    var r = t.getBoundingClientRect(), s = document.createElement("span");
    s.className = "arp-rip";
    s.style.left = (e.clientX - r.left) + "px"; s.style.top = (e.clientY - r.top) + "px";
    s.style.setProperty("--s", Math.max(8, Math.max(r.width, r.height) / 6));
    t.appendChild(s); ripples++;
    setTimeout(function () { s.remove(); ripples--; }, 600);
  }, true);

  /* ----------------------------------------------------------- Kurulum */
  function init() {
    var de = document.documentElement;
    if (!document.getElementById("arenaMenuAmbient")) {
      var amb = document.createElement("div"); amb.id = "arenaMenuAmbient"; amb.setAttribute("aria-hidden", "true");
      document.body.insertBefore(amb, document.body.firstChild);
    }
    var lg = document.querySelector("#arenaHubHome .ar-league img");
    if (lg) { lg.src = "assets/menu/league.svg"; lg.decoding = "async"; }
    var h1 = document.querySelector("body>h1");
    if (h1 && !document.getElementById("arpSound")) {
      var b = document.createElement("button"); b.id = "arpSound"; b.type = "button";
      var paint = function () { var on = flag("arenaMusic"); b.classList.toggle("off", !on); b.setAttribute("aria-label", on ? "Müziği kapat" : "Müziği aç"); b.setAttribute("aria-pressed", String(on)); };
      b.addEventListener("click", function (e) {
        e.preventDefault(); e.stopPropagation();
        var on = !flag("arenaMusic"); setFlag("arenaMusic", on);
        try { if (window.Arena3D && Arena3D.music && !on) Arena3D.music(false); } catch (x) {}
        paint(); sfx("toggle"); sync();
      }, true);
      paint(); h1.appendChild(b);
    }
    var n = 0;
    document.querySelectorAll("#arenaHubHome .ar-profile,#arenaHubHome .ar-shortcuts>.ar-short,#arenaHubHome .ar-categories>.ar-cat,#arenaHubHome .ar-daily,#arenaHubHome .ar-feature")
      .forEach(function (el) { el.style.setProperty("--i", Math.min(n++, 14)); });
    if (!window.matchMedia("(prefers-reduced-motion:reduce)").matches) {
      de.classList.add("arp-intro");
      setTimeout(function () { de.classList.remove("arp-intro"); }, 1400);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();

  window.ArenaMenuPremium = { sfx: sfx, musicStart: musicStart, musicStop: musicStop, sync: sync };
})();
