// ARENA Mobile - sadece Google ve telefon giriş seçenekleri
(function () {
  "use strict";
  function toast(m){var t=document.createElement("div");t.textContent=m;t.style.cssText="position:fixed;left:50%;bottom:calc(70px + env(safe-area-inset-bottom));transform:translateX(-50%);max-width:86vw;background:#111a3a;color:#fff;border:1px solid #3b4a86;border-radius:14px;padding:10px 16px;font:600 14px system-ui,sans-serif;z-index:100001;text-align:center";document.body.appendChild(t);setTimeout(function(){t.remove();},3500);}
  function auth(){return firebase.auth();}
  function waitForHesap(callback) {
    if (window.Hesap && typeof window.Hesap.ac === 'function') {
        callback(window.Hesap);
    } else {
        var tries = 0;
        var interval = setInterval(function() {
            tries++;
            if (window.Hesap && typeof window.Hesap.ac === 'function') {
                clearInterval(interval);
                callback(window.Hesap);
            } else if (tries > 20) {
                clearInterval(interval);
                toast("Hesap modülü yüklenemedi. Sayfayı yenileyip tekrar dene.");
            }
        }, 500);
    }
  }
  function google(){
    waitForHesap(function(H) {
        if (typeof H.googleGiris !== "function") {
            toast("Hesap modülü henüz hazır değil.");
            return;
        }
        H.googleGiris().then(function(){close();toast("Google hesabın ARENA'ya bağlandı.");}).catch(function(e){var m=e&&e.ozel?e.ozel:(e&&e.code==="auth/unauthorized-domain"?"Bu alan adı Firebase'de yetkilendirilmemiş.":(e&&e.code)|| (e&&e.message)||"bilinmeyen hata");toast("Google girişi tamamlanamadı: "+m);});
    });
  }
  var st=document.createElement("style");st.textContent="#arGirKutu{position:fixed;inset:0;z-index:100100;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.76);padding:16px;box-sizing:border-box}#arGirKutu.ac{display:flex}#arGirKutu .k{width:min(100%,380px);background:#0e1633;color:#fff;border:1px solid #3b4a86;border-radius:22px;padding:22px;font-family:system-ui,sans-serif;text-align:center}#arGirKutu h3{font-size:25px;margin:0 0 8px}#arGirKutu p{opacity:.8;margin:0 0 18px}#arGirKutu button{display:block;width:100%;min-height:54px;margin-top:12px;border:0;border-radius:15px;font:800 16px system-ui;cursor:pointer}#arGirKutu .g{background:#fff;color:#172033}#arGirKutu .t{background:linear-gradient(110deg,#087cff,#073de8);color:#fff}#arGirKutu .x{background:transparent;color:#9fb0ff}#arGirKutu .u{background:linear-gradient(110deg,#9a6b13,#3b2a0d);border:1px solid #f3c64f;color:#ffe49a}";document.head.appendChild(st);
  var box=document.createElement("div");box.id="arGirKutu";document.body.appendChild(box);function close(){box.classList.remove("ac");}
  function update(){var a=document.createElement("a");a.href="https://github.com/FatihKoc81/Arena/releases/latest/download/Arena.apk";a.target="_blank";a.rel="noopener";a.style.display="none";document.body.appendChild(a);a.click();a.remove();toast("En son ARENA APK indiriliyor. İndirme bitince dosyayı açıp Güncelle / Yükle seçeneğine bas.");}
  function open(){var u=auth().currentUser;if(u&&!u.isAnonymous){box.innerHTML='<div class="k"><h3>ARENA hesabın</h3><p>Hesabını ve kullanıcı adını yönet.</p><button class="t" id="arProfile">Profil ve kullanıcı adı</button><button class="u" id="arUpdate">⬇ ARENA Güncelle</button><button class="x" id="arClose">Kapat</button></div>';document.getElementById("arProfile").onclick=function(){close();waitForHesap(function(H) { H.ac(); });};}else{box.innerHTML='<div class="k"><h3>ARENA</h3><p>Hesabına güvenli şekilde bağlan</p><button class="g" id="arGoogle">Google ile giriş</button><button class="t" id="arPhone">Telefonla giriş</button><button class="x" id="arGuest">Misafir olarak devam et</button><button class="u" id="arUpdate">⬇ ARENA Güncelle</button></div>';document.getElementById("arGoogle").onclick=google;document.getElementById("arPhone").onclick=function(){close();waitForHesap(function(H) { H.ac(); });};}var cl=document.getElementById("arClose");if(cl)cl.onclick=close;var guest=document.getElementById("arGuest");if(guest)guest.onclick=close;var up=document.getElementById("arUpdate");if(up)up.onclick=update;box.classList.add("ac");}
  box.addEventListener("click",function(e){if(e.target===box)close();});window.ArenaAuth={ac:open,kapat:close};
  var n=0;(function wait(){if(window.firebase&&firebase.apps&&firebase.apps.length){auth().onAuthStateChanged(function(u){if(box.classList.contains("ac"))open();else if(u&&u.isAnonymous)open();});}else if(n++<100)setTimeout(wait,200);})();
})();
