/* ARENA reference design rebuild */
(function(){
'use strict';
const ana=document.getElementById('ana'),title=document.querySelector('body>h1');
if(!ana||ana.dataset.arenaReference==='1')return;ana.dataset.arenaReference='1';
const cats=[
{id:'bilgi',name:'Bilgi Oyunları',icon:'🏆',desc:'Bilgini sına ve zirveye çık',count:'5 Oyun',color:'violet',games:['milyoner','passaparola'],planned:['Hızlı Karar','Bilgi Düellosu','Genel Kültür']},
{id:'kelime',name:'Kelime Oyunları',icon:'🔠',desc:'Harfler, kelimeler ve sözcükler',count:'3 Oyun',color:'blue',games:['kelime','rotasyon'],planned:['Kelime Zinciri']},
{id:'masa',name:'Masa ve Strateji',icon:'🎲',desc:'Hamleni planla, rakibini yen',count:'5 Oyun',color:'green',games:[],planned:['Tavla','Dama','Domino','Satranç','Reversi']},
{id:'sayi',name:'Sayı ve İşlem',icon:'➗',desc:'Sayıları birleştir, işlemleri çöz',count:'5 Oyun',color:'orange',games:['islem'],planned:['İşlem Bulmacası','Sayı Çaprazı','Matematik Bulmacası','2048']},
{id:'sudoku',name:'Sudoku ve Mantık',icon:'🧩',desc:'Sayı, şekil ve mantıkla çözüme ulaş',count:'5 Oyun',color:'pink',games:[],planned:['Sudoku','Kakuro','Nonogram','Mantık Izgarası','Şekil Dizileri']},
{id:'dikkat',name:'Dikkat ve Görsel',icon:'👁️',desc:'Gözlemle, karşılaştır ve ayrıntıyı yakala',count:'5 Oyun',color:'cyan',games:[],planned:['7 Fark Bul','Görsel Hafıza','Nesneyi Bul','Hızlı Tarama','Dikkat Testi']},
{id:'renk',name:'Renk ve Sıralama',icon:'🧪',desc:'Renkleri ayır, parçaları doğru sıraya koy',count:'3 Oyun',color:'indigo',games:[],planned:['Top Sıralama','Su Sıralama','Renkli Bloklar']},
{id:'refleks',name:'Hız ve Refleks',icon:'⚡',desc:'Hızını ve tepki süreni test et',count:'4 Oyun',color:'red',games:[],planned:['Refleks Testi','Hızlı Dokun','Renk Tepkisi','Hızlı Eşleştirme']}
];
const defs={
milyoner:{name:'Milyoner',icon:'🏆',desc:'Genel kültür ve bilgi yarışması',re:/milyoner|oyuna başla/i},
passaparola:{name:'Passaparola',icon:'🔤',desc:'Harf harf cevapla, süreye karşı yarış',re:/pass.?aparola/i},
kelime:{name:'Kelime Oyunu',icon:'🔤',desc:'İpuçlarından kelimeleri bul',re:/kelime oyunu/i},
rotasyon:{name:'Rotasyon',icon:'🧩',desc:'Harfleri birleştir, kelimeleri keşfet',re:/rotasyon/i},
islem:{name:'İşlem Oyunu',icon:'➗',desc:'Sayılarla hedefe ulaş',re:/işlem oyunu|🔢 işlem/i}
};
const st=document.createElement('style');st.id='arenaReferenceDesign';st.textContent=`
body{background:#020713!important;color:#f7f9ff!important;padding:calc(var(--bas-yuk,58px) + env(safe-area-inset-top) + 8px) 0 calc(94px + env(safe-area-inset-bottom))!important;display:block!important;min-height:100dvh!important}
html.menu-kilit,html.menu-kilit body{height:auto!important;min-height:100%!important;overflow-y:auto!important;position:relative!important;top:auto!important;left:auto!important;right:auto!important}
body>h1{height:calc(var(--bas-yuk,58px) + env(safe-area-inset-top))!important;background:linear-gradient(180deg,#06142b,#030918)!important;border-bottom:1px solid #14345f!important;box-shadow:0 5px 24px #087bff30!important;display:flex!important;align-items:center!important;justify-content:center!important}
body>h1 .hl{display:none!important}
body>h1 .arena-logo{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:.9;font:1000 clamp(27px,7vw,37px)/.9 Georgia,serif;letter-spacing:1px;color:#fff;text-shadow:0 2px 0 #76521b,0 0 13px #3d9dff}
body>h1 .arena-logo:before{content:'♛';position:absolute;top:-2px;font-size:15px;color:#ffd34f;text-shadow:0 0 10px #ffb300}
body>h1 .arena-logo:after{content:'OYUN PLATFORMU';font:700 8px/1.4 system-ui,sans-serif;letter-spacing:2px;color:#d7e7ff;margin-top:4px;text-shadow:none}
body>h1 .arena-wreath{position:absolute;top:0;font:26px/1 Georgia,serif;color:#f5c84d;text-shadow:0 0 9px #ffae00}
body>h1 .arena-wreath.left{right:calc(100% + 8px)}body>h1 .arena-wreath.right{left:calc(100% + 8px);transform:scaleX(-1)}
#ana{display:block!important;position:relative!important;width:100%!important;max-width:720px!important;min-height:0!important;height:auto!important;max-height:none!important;overflow:visible!important;overscroll-behavior:auto!important;margin:0 auto!important;padding:2px 12px 24px!important;border:0!important;border-radius:0!important;background:linear-gradient(180deg,#061329 0%,#030917 100%)!important;box-shadow:none!important;text-align:left!important}
#ana.hidden{display:none!important}#ana>#seviye,#ana>.btn,#ana>.pill,#ana>.ek-bar,#ana>.arKart{display:none!important}
#arenaHubHome,#arenaHubCategory{width:100%;padding:0 0 12px}
.ar-top{display:none!important;grid-template-columns:58px minmax(0,1fr) 58px;align-items:center;gap:8px;margin:0 0 10px}
.ar-top-btn{height:54px;width:54px;border-radius:18px;border:1px solid #315b91;background:linear-gradient(145deg,#122c52,#08172f);color:white;font-size:25px;box-shadow:inset 0 1px #ffffff20,0 5px 14px #0008}.ar-top-btn:last-child{justify-self:end}
.ar-brand{font:900 clamp(25px,7vw,34px)/1 system-ui,sans-serif;letter-spacing:1px;text-align:center;color:#fff;text-shadow:0 0 14px #168bff}.ar-brand small{display:block;font-size:9px;letter-spacing:3px;color:#a9c9ff;margin-top:5px}
.ar-profile{display:grid;grid-template-columns:58px minmax(0,1fr) 120px;align-items:center;gap:6px;padding:6px 7px;margin-bottom:8px;border:1px solid #2b5b91;border-radius:17px;background:linear-gradient(105deg,#102a51,#071831 62%,#10284d);box-shadow:0 0 18px #168bff2a,inset 0 1px #ffffff20}
.ar-avatar{width:54px;height:54px;border-radius:50%;display:grid;place-items:center;overflow:hidden;border:3px solid #ffce4a;background:linear-gradient(145deg,#f4d46a,#9d6014);box-shadow:0 0 12px #ffbd3c88;font-size:34px;color:#fff}.ar-avatar img{width:100%;height:100%;object-fit:cover}
.ar-player{min-width:0}.ar-player-name{font-size:clamp(14px,4vw,19px);font-weight:850;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ar-level-line{display:flex;align-items:center;gap:7px;margin-top:6px}.ar-level-pill{padding:5px 9px;border-radius:12px;background:linear-gradient(90deg,#1688d8,#3045c5);font-size:12px;font-weight:900;white-space:nowrap}.ar-xp{font-size:10px;color:#dbe8ff;white-space:nowrap}.ar-xpbar{height:7px;margin-top:5px;border-radius:10px;background:#17294b;overflow:hidden}.ar-xpbar i{display:block;height:100%;width:35%;background:linear-gradient(90deg,#21c6ff,#9d55ff);border-radius:10px}
.ar-wallet{display:grid;gap:6px}.ar-wallet-row{display:flex;align-items:center;justify-content:space-between;gap:5px;padding:5px 7px;border:1px solid #31598a;border-radius:12px;background:#07152e;font-size:13px;font-weight:850;white-space:nowrap}.ar-wallet-row b{font-size:19px}
.ar-shortcuts{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:4px;margin:0 0 9px}.ar-short{min-width:0;min-height:58px;padding:5px 1px;border:1px solid #315d98;border-radius:15px;background:linear-gradient(155deg,#17345e,#07152d);box-shadow:inset 0 1px #ffffff20,0 4px 12px #0008;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;text-align:center;font-size:clamp(8px,2.5vw,11px);font-weight:800;line-height:1.12}.ar-short i{font-style:normal;font-size:clamp(19px,5vw,24px);line-height:1}
.ar-section-title{display:flex;align-items:center;justify-content:space-between;margin:9px 3px 6px;color:#fff;font-size:clamp(17px,5vw,21px);font-weight:900}.ar-section-title small{font-size:10px;color:#a9c9f7;font-weight:700}
.ar-categories{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}
.ar-cat{position:relative;isolation:isolate;display:grid;grid-template-columns:78px minmax(0,1fr);align-items:center;gap:5px;min-height:82px;padding:7px 7px;border:2px solid var(--edge);border-radius:21px;color:#fff;text-align:left;background:linear-gradient(135deg,var(--c1),var(--c2));box-shadow:inset 0 1px 0 #ffffff45,0 0 16px var(--glow);overflow:hidden}
.ar-cat:before{content:'';position:absolute;z-index:-1;right:-22px;top:-32px;width:115px;height:115px;border-radius:50%;background:#ffffff12}.ar-cat:after{content:'';position:absolute;z-index:-1;inset:0;background:linear-gradient(135deg,#ffffff12,transparent 50%,#0002)}
.ar-cat-icon{display:grid;place-items:center;font-size:clamp(34px,9vw,48px);filter:drop-shadow(0 5px 4px #000b)}.ar-cat-copy strong{display:block;font-size:clamp(13px,3.7vw,17px);font-weight:950;line-height:1.12}.ar-cat-copy small{display:block;margin-top:5px;font-size:clamp(9px,2.8vw,12px);line-height:1.2;color:#f0f5ff}
.ar-cat.violet{--c1:#8e28db;--c2:#321064;--edge:#db79ff;--glow:#b348ff55}.ar-cat.blue{--c1:#087bd7;--c2:#082b70;--edge:#31c7ff;--glow:#00aaff55}.ar-cat.green{--c1:#06b76a;--c2:#064333;--edge:#35ff91;--glow:#00ff7755}.ar-cat.orange{--c1:#ee8b08;--c2:#74300b;--edge:#ffc02d;--glow:#ff9a0055}.ar-cat.pink{--c1:#e22c7b;--c2:#65143e;--edge:#ff65b1;--glow:#ff2d9155}.ar-cat.cyan{--c1:#05b6b6;--c2:#064657;--edge:#38f5ed;--glow:#00d9e655}
.ar-daily{display:grid;grid-template-columns:48px minmax(0,1fr) auto;align-items:center;gap:6px;margin:9px 0 0;padding:8px 9px;min-height:62px;border:1px solid #596bd1;border-radius:16px;background:linear-gradient(100deg,#172d68,#34205e);box-shadow:0 0 14px #6557d044}
.ar-daily-target{font-size:34px;text-align:center}.ar-daily-copy strong{display:block;font-size:14px}.ar-daily-copy small{display:block;color:#d9e5ff;font-size:10px;margin-top:3px}.ar-progress{height:7px;border-radius:10px;background:#06122d;overflow:hidden;margin-top:8px}.ar-progress i{display:block;width:66%;height:100%;background:linear-gradient(90deg,#2bdc37,#7df52b);border-radius:10px}.ar-daily-reward{padding:7px 9px;border:2px solid #f9c443;border-radius:13px;background:linear-gradient(#573a09,#1b1631);color:#ffe27a;font-size:14px;font-weight:950;white-space:nowrap}
.ar-featured{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:7px;padding:2px 0 8px}.ar-feature{min-width:0;padding:0;background:none;color:#fff;text-align:center;font-size:clamp(8px,2.7vw,11px);font-weight:850;line-height:1.15}.ar-feature i{display:grid;place-items:center;height:clamp(52px,14vw,68px);margin-bottom:6px;border:2px solid #5876b4;border-radius:17px;background:linear-gradient(145deg,#193d73,#251343);box-shadow:0 0 12px #168bff3b;font-size:clamp(24px,6vw,32px);font-style:normal}
#arenaHubCategory{padding:5px 0 22px}.ar-back{min-height:55px;padding:10px 18px;margin:0 0 14px;border:1px solid #4775ad;border-radius:15px;background:linear-gradient(145deg,#173d70,#0b1d3b);color:#fff;font-size:17px;font-weight:900}.ar-cat-head{display:flex;align-items:center;gap:13px;min-height:100px;padding:13px;margin-bottom:14px;border:1px solid #2b5d9b;border-radius:18px;background:linear-gradient(110deg,#17345f,#111d40)}.ar-cat-head i{font-style:normal;font-size:42px}.ar-cat-head strong{font-size:22px}.ar-cat-head small{display:block;margin-top:5px;color:#b6c9e9;font-size:14px}
.ar-game-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.ar-game-card{display:flex;min-height:125px;flex-direction:column;justify-content:space-between;padding:13px 11px;border:1px solid #3b6094;border-radius:18px;background:linear-gradient(145deg,#18365f,#0a1731);color:#fff;text-align:left}.ar-game-card i{font-style:normal;font-size:34px}.ar-game-card strong{font-size:15px;line-height:1.2}.ar-game-card small{display:block;margin-top:5px;color:#b6c9e9;font-size:12px}.ar-game-card.soon{opacity:.68;border-style:dashed}.ar-game-card.soon small{color:#f4c66b}
#arenaNeonNav{position:fixed;left:9px;right:9px;bottom:calc(7px + env(safe-area-inset-bottom));z-index:10050;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:3px;padding:6px 4px 5px;border:1px solid #314d83;border-radius:23px;background:linear-gradient(180deg,rgba(16,29,58,.98),rgba(4,10,25,.99));box-shadow:0 -5px 22px #000b,0 0 16px #176bca35;backdrop-filter:blur(12px)}
#arenaNeonNav button{min-width:0;min-height:67px;padding:4px 1px;border:0;border-radius:15px;background:transparent;color:#e0eaff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font-size:clamp(8px,2.5vw,11px);line-height:1.1;font-weight:800;white-space:nowrap}#arenaNeonNav button i{font-style:normal;font-size:27px;line-height:1}#arenaNeonNav button.active{background:linear-gradient(145deg,#5523a0,#171b50);box-shadow:inset 0 0 15px #c18aff55;color:#fff}
body:has(#ana.hidden) #arenaNeonNav{display:none!important}.ek-dock,.apk-btn,#altSatir,#arenaAltFooter{display:none!important}
@media(max-width:390px){.ar-profile{grid-template-columns:66px minmax(0,1fr) 120px;gap:6px;padding:8px}.ar-avatar{width:62px;height:62px}.ar-wallet-row{font-size:11px;padding:5px}.ar-cat{grid-template-columns:78px minmax(0,1fr);min-height:119px;padding:8px 6px}.ar-cat-icon{font-size:45px}.ar-cat-copy strong{font-size:15px}.ar-cat-copy small{font-size:10px}.ar-daily{grid-template-columns:52px minmax(0,1fr) auto;padding:9px}.ar-daily-target{font-size:36px}.ar-daily-reward{font-size:14px;padding:6px}}
@media(max-width:350px){.ar-short{font-size:7px}.ar-cat{grid-template-columns:65px minmax(0,1fr);min-height:110px}.ar-cat-icon{font-size:39px}}
`;document.head.appendChild(st);

const fit=document.createElement('style');
fit.id='arenaReferenceFit';
fit.textContent=`
body{padding-top:calc(var(--bas-yuk,58px) + env(safe-area-inset-top))!important;padding-bottom:calc(60px + env(safe-area-inset-bottom))!important;background:#020713!important}
#ana{padding:0 6px 12px!important;max-width:720px!important;overflow:visible!important}
body>h1{background-image:url("arena-header.webp")!important;background-size:100% 100%!important;background-position:center!important;background-repeat:no-repeat!important;background-color:#020b21!important}
body>h1 .arena-logo{display:none!important}
body>h1 .ar-header-hotspot{position:absolute;top:10%;height:80%;padding:0;border:0;background:transparent;z-index:52;min-height:0!important;cursor:pointer}
body>h1 .ar-header-hotspot.left{left:1%;width:12%}
body>h1 .ar-header-hotspot.bell{right:11%;width:9%}
body>h1 .ar-header-hotspot.gear{right:1%;width:9%}
#arenaHubHome .ar-profile{grid-template-columns:100px minmax(0,1fr) 92px 158px!important;gap:7px!important;padding:0 7px!important;margin:0 0 14px!important;height:100px!important;min-height:100px!important;border-radius:18px!important}
#arenaHubHome .ar-avatar{width:96px!important;height:96px!important;display:block!important;overflow:visible!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important}
#arenaHubHome .ar-avatar img{width:100%!important;height:100%!important;object-fit:contain!important}
#arenaHubHome .ar-league{display:grid!important;place-items:center!important;width:92px!important;height:94px!important}
#arenaHubHome .ar-league img{display:block!important;width:92px!important;height:90px!important;object-fit:contain!important}
#arenaHubHome .ar-player-name{font-size:clamp(15px,4vw,20px)!important}
#arenaHubHome .ar-level-line{gap:7px!important;margin-top:6px!important}
#arenaHubHome .ar-level-pill{padding:5px 9px!important;font-size:12px!important}
#arenaHubHome .ar-xp{font-size:10px!important}
#arenaHubHome .ar-xpbar{height:7px!important;margin-top:5px!important}
#arenaHubHome .ar-wallet{gap:6px!important}
#arenaHubHome .ar-wallet-row{height:42px!important;min-height:42px!important;padding:4px 8px!important;font-size:13px!important;line-height:1!important;border-radius:13px!important;gap:5px!important}
#arenaHubHome .ar-wallet-row b{font-size:19px!important;line-height:1!important}
#arenaHubHome .ar-shortcuts{gap:7px!important;margin:0 0 22px!important}
#arenaHubHome .ar-short{min-height:100px!important;height:100px!important;padding:8px 2px!important;gap:6px!important;font-size:11px!important;border-radius:18px!important}
#arenaHubHome .ar-short i{font-size:30px!important}
#arenaHubHome #arCategoryTitle{display:none!important}
#arenaHubHome .ar-categories{gap:12px!important;margin-top:0!important}
#arenaHubHome .ar-cat{grid-template-columns:112px minmax(0,1fr)!important;min-height:137px!important;height:137px!important;padding:8px 9px!important;gap:6px!important;border-radius:21px!important}
#arenaHubHome .ar-cat-icon{width:108px!important;height:118px!important;display:block!important;font-size:0!important;background-size:600% 300%!important;background-repeat:no-repeat!important}
#arenaHubHome .ar-cat-copy strong{font-size:clamp(16px,4.4vw,21px)!important;line-height:1.12!important}
#arenaHubHome .ar-cat-copy small{font-size:13px!important;margin-top:7px!important}
#arenaHubHome .ar-daily{grid-template-columns:84px minmax(0,1fr) 112px!important;min-height:92px!important;height:92px!important;margin-top:18px!important;padding:8px 12px!important;gap:8px!important;border-radius:17px!important}
#arenaHubHome .ar-daily-target{font-size:58px!important}
#arenaHubHome .ar-daily-copy strong{font-size:18px!important}
#arenaHubHome .ar-daily-copy small{font-size:14px!important;margin-top:4px!important}
#arenaHubHome .ar-progress{height:9px!important;margin-top:8px!important}
#arenaHubHome .ar-daily-reward{padding:7px 8px!important;font-size:17px!important;border-radius:13px!important}
#arenaHubHome .ar-section-title:has(+.ar-featured){margin:14px 3px 10px!important;font-size:20px!important}
#arenaHubHome .ar-featured{gap:8px!important;padding:0 0 4px!important}
#arenaHubHome .ar-feature{font-size:12px!important;line-height:1.15!important}
#arenaHubHome .ar-feature i{height:92px!important;margin-bottom:7px!important;border-radius:17px!important;font-size:0!important;background-size:600% 300%!important;background-repeat:no-repeat!important;border:0!important;box-shadow:none!important}
#arenaNeonNav{left:9px!important;right:9px!important;bottom:calc(5px + env(safe-area-inset-bottom))!important;padding:6px 4px 5px!important;gap:3px!important;border-radius:22px!important}
#arenaNeonNav button{min-height:100px!important;height:100px!important;padding:5px 1px!important;gap:5px!important;font-size:clamp(9px,2.7vw,12px)!important}
#arenaNeonNav button i{font-size:32px!important}
@media(max-width:390px){
#arenaHubHome .ar-profile{grid-template-columns:52px minmax(0,1fr) 48px 84px!important;gap:4px!important;padding:1px 4px!important;margin-bottom:8px!important;height:54px!important;min-height:54px!important}
#arenaHubHome .ar-avatar{width:52px!important;height:52px!important}
#arenaHubHome .ar-league{width:48px!important;height:52px!important}
#arenaHubHome .ar-league img{width:48px!important;height:50px!important}
#arenaHubHome .ar-player-name{font-size:10px!important}
#arenaHubHome .ar-level-line{gap:4px!important;margin-top:3px!important}
#arenaHubHome .ar-level-pill{font-size:9px!important;padding:2px 5px!important}
#arenaHubHome .ar-xp{font-size:8px!important}
#arenaHubHome .ar-xpbar{height:4px!important;margin-top:3px!important}
#arenaHubHome .ar-wallet{gap:3px!important}
#arenaHubHome .ar-wallet-row{height:22px!important;min-height:22px!important;padding:1px 3px!important;font-size:8px!important;line-height:1!important;border-radius:8px!important;gap:2px!important}
#arenaHubHome .ar-wallet-row b{font-size:11px!important}
#arenaHubHome .ar-shortcuts{gap:4px!important;margin-bottom:12px!important}
#arenaHubHome .ar-short{min-height:52px!important;height:52px!important;padding:3px 1px!important;gap:3px!important;font-size:8px!important}
#arenaHubHome .ar-short i{font-size:20px!important}
#arenaHubHome .ar-categories{gap:6px!important}
#arenaHubHome .ar-cat{grid-template-columns:58px minmax(0,1fr)!important;height:72px!important;min-height:72px!important;padding:4px!important;gap:3px!important;border-radius:12px!important}
#arenaHubHome .ar-cat-icon{width:56px!important;height:64px!important}
#arenaHubHome .ar-cat-copy strong{font-size:13px!important;line-height:1.1!important}
#arenaHubHome .ar-cat-copy small{font-size:10px!important;margin-top:3px!important}
#arenaHubHome .ar-daily{grid-template-columns:42px minmax(0,1fr) 58px!important;min-height:48px!important;height:48px!important;margin-top:10px!important;padding:4px 5px!important;gap:3px!important}
#arenaHubHome .ar-daily-target{font-size:30px!important}
#arenaHubHome .ar-daily-copy strong{font-size:11px!important}
#arenaHubHome .ar-daily-copy small{font-size:8px!important;margin-top:2px!important}
#arenaHubHome .ar-progress{height:5px!important;margin-top:4px!important}
#arenaHubHome .ar-daily-reward{padding:4px!important;font-size:10px!important;border-radius:8px!important}
#arenaHubHome .ar-section-title:has(+.ar-featured){font-size:13px!important;margin:8px 2px 6px!important}
#arenaHubHome .ar-featured{gap:4px!important;padding:0 0 3px!important}
#arenaHubHome .ar-feature i{height:48px!important;margin-bottom:3px!important;border-radius:9px!important}
#arenaHubHome .ar-feature{font-size:8px!important;line-height:1.05!important}
#arenaNeonNav{left:5px!important;right:5px!important;bottom:calc(3px + env(safe-area-inset-bottom))!important;padding:3px 2px!important;gap:1px!important}
#arenaNeonNav button{height:54px!important;min-height:54px!important;padding:2px 0!important;gap:2px!important;font-size:9px!important}
#arenaNeonNav button i{font-size:20px!important}
}
`;
document.head.appendChild(fit);

const unlock=document.createElement('style');
unlock.textContent='html.menu-kilit,html.menu-kilit body{height:auto!important;min-height:100%!important;overflow-y:auto!important;overflow-x:hidden!important;position:relative!important;top:auto!important;left:auto!important;right:auto!important}';
window.addEventListener('load',()=>document.head.appendChild(unlock),{once:true});



/* Reference icon sprite: six category icons + six featured game icons */
const artStyle=document.createElement('style');
artStyle.id='arenaReferenceSprite';
artStyle.textContent=`
#arenaHubHome .ar-cat-icon{background-image:url("arena-reference.webp")!important;background-size:600% 300%!important;background-repeat:no-repeat!important}
#arenaHubHome .ar-feature i{background-image:url("arena-reference.webp")!important;background-size:600% 300%!important;background-repeat:no-repeat!important}
`;
document.head.appendChild(artStyle);

/* Three final category accents; first five continue using the approved sprite artwork. */
const eightCategoriesStyle=document.createElement('style');
eightCategoriesStyle.textContent=`
#arenaHubHome .ar-cat.indigo{--c1:#5852d9;--c2:#1c225b;--edge:#8d8bff;--glow:#6461ff55}
#arenaHubHome .ar-cat.red{--c1:#ed4b4b;--c2:#681b32;--edge:#ff8888;--glow:#ff4f6555}
#arenaHubHome .ar-cat.cyan{--c1:#078d9b;--c2:#073447;--edge:#38e4ed;--glow:#18d6dc55}
#arenaHubHome .ar-cat:nth-child(n+6) .ar-cat-icon{background-image:none!important;text-align:center!important}
`;
document.head.appendChild(eightCategoriesStyle);


/* APK home screen: fill the usable device height without hiding Android system bars. */
const fullPage=document.createElement('style');
fullPage.id='arenaApkFullPage';
fullPage.textContent=`
html,body{min-height:100%!important}
body{min-height:100dvh!important;min-height:100svh!important;box-sizing:border-box!important}
#ana{display:flex!important;flex-direction:column!important;min-height:calc(100dvh - var(--bas-yuk,58px) - 60px - env(safe-area-inset-top) - env(safe-area-inset-bottom))!important;min-height:calc(100svh - var(--bas-yuk,58px) - 60px - env(safe-area-inset-top) - env(safe-area-inset-bottom))!important}
#arenaHubHome{display:flex!important;flex:1 0 auto!important;flex-direction:column!important;justify-content:space-between!important;min-height:inherit!important;padding-top:2px!important;padding-bottom:12px!important;gap:0!important}
#arenaHubHome .ar-profile{flex:none!important;margin-bottom:0!important}
#arenaHubHome .ar-shortcuts{flex:none!important;margin-top:0!important;margin-bottom:0!important}
#arenaHubHome .ar-categories{flex:none!important}
#arenaHubHome .ar-daily{flex:none!important;margin-top:0!important}
#arenaHubHome .ar-section-title{flex:none!important;margin-top:0!important;margin-bottom:0!important}
#arenaHubHome .ar-featured{flex:none!important;margin-top:0!important;padding-bottom:0!important}
#arenaNeonNav{bottom:calc(3px + env(safe-area-inset-bottom))!important}
@media(max-height:760px){
 #arenaHubHome{justify-content:flex-start!important;gap:8px!important}
 #arenaHubHome .ar-profile{margin-bottom:0!important}
 #arenaHubHome .ar-shortcuts{margin-bottom:0!important}
 #arenaHubHome .ar-daily{margin-top:0!important}
}
`;
document.head.appendChild(fullPage);




if(title){title.innerHTML='<button class="ar-header-hotspot left" data-header-hotspot="menu" aria-label="Menü"></button><button class="ar-header-hotspot bell" data-header-hotspot="notifications" aria-label="Bildirimler"></button><button class="ar-header-hotspot gear" data-header-hotspot="settings" aria-label="Ayarlar"></button>';title.setAttribute('role','group');title.setAttribute('aria-label','ARENA üst menü');}
/* Platform-specific home: featured mini-game strip is reserved for the native app. */
(function(){
  let nativeApp=false;
  try{
    nativeApp=!!(window.Capacitor&&typeof window.Capacitor.isNativePlatform==='function'&&window.Capacitor.isNativePlatform());
    if(!nativeApp&&window.Capacitor&&typeof window.Capacitor.getPlatform==='function')nativeApp=window.Capacitor.getPlatform()!=='web';
    if(!nativeApp&&window.AndroidBridge)nativeApp=true;
  }catch(_){}
  document.documentElement.classList.toggle('arena-native-app',nativeApp);
  document.documentElement.classList.toggle('arena-web-app',!nativeApp);
  const platformStyle=document.createElement('style');
  platformStyle.textContent=`
    html.arena-web-app #arenaHubHome .ar-section-title,
    html.arena-web-app #arenaHubHome .ar-featured{display:none!important}
    html.arena-web-app #arenaHubHome{padding-bottom:20px!important}
    html.arena-native-app #arenaHubHome .ar-section-title,
    html.arena-native-app #arenaHubHome .ar-featured{display:flex}
  `;
  document.head.appendChild(platformStyle);
})();

const home=document.createElement('div');home.id='arenaHubHome';
const view=document.createElement('div');view.id='arenaHubCategory';view.hidden=true;
home.innerHTML='<div class="ar-top"><button class="ar-top-btn" data-action="menu">☷</button><div class="ar-brand">ARENA<small>OYUN PLATFORMU</small></div><button class="ar-top-btn" data-action="settings">⚙</button></div>'+
'<div class="ar-profile"><div class="ar-avatar" id="arAvatar"><img src="arena-avatar.webp" alt=""></div><div class="ar-player"><div class="ar-player-name" id="arPlayerName">ARENA Oyuncusu ⭐</div><div class="ar-level-line"><span class="ar-level-pill" id="arLevel">Seviye 1</span><span class="ar-xp" id="arXp">0 XP</span></div><div class="ar-xpbar"><i id="arXpBar"></i></div></div><div class="ar-league"><img src="arena-league.webp" alt="Altın Lig"></div><div class="ar-wallet"><div class="ar-wallet-row"><span>🪙</span><b id="arGold">100</b><span>＋</span></div><div class="ar-wallet-row"><span>❤️</span><b id="arLives">3 / 3</b><span>＋</span></div></div></div>'+
'<div class="ar-shortcuts"><button class="ar-short" data-action="reward"><i>🎁</i>Günlük<br>Ödül</button><button class="ar-short" data-action="tasks"><i>📋</i>Günlük<br>Görevler</button><button class="ar-short" data-action="league"><i>🏆</i>Lig<br>Sıralaması</button><button class="ar-short" data-action="friends"><i>👥</i>Arkadaşlar</button><button class="ar-short" data-action="achievements"><i>🛡️</i>Başarılar</button><button class="ar-short" data-action="season"><i>🗓️</i>Sezon</button></div>'+
'<div class="ar-categories">'+cats.map(c=>'<button class="ar-cat '+c.color+'" data-category="'+c.id+'"><span class="ar-cat-icon">'+c.icon+'</span><span class="ar-cat-copy"><strong>'+c.name+'</strong><small>'+c.count+'</small></span></button>').join('')+'</div>'+
'<div class="ar-daily"><span class="ar-daily-target">🎯</span><span class="ar-daily-copy"><strong>Günün Görevi</strong><small>3 farklı oyun oyna.</small><span class="ar-progress"><i></i></span></span><span class="ar-daily-reward">🪙 +150</span></div>'+
'<div class="ar-section-title">🔥 Öne Çıkan Oyunlar <small data-action="allgames">Tümünü Gör ›</small></div><div class="ar-featured"><button class="ar-feature" data-feature="renkli"><i>🟪</i>Renkli<br>Bloklar</button><button class="ar-feature" data-feature="tavla"><i>🎲</i>Tavla</button><button class="ar-feature" data-feature="kelime"><i>🔤</i>Kelime<br>Lik</button><button class="ar-feature" data-feature="top"><i>🧪</i>Top<br>Sıralama</button><button class="ar-feature" data-feature="oklar"><i>⬇️</i>Okları<br>Çöz</button><button class="ar-feature" data-feature="blok"><i>🧱</i>Blok<br>Kaçış</button></div>';
ana.insertBefore(home,ana.firstChild);ana.appendChild(view);

home.querySelectorAll('.ar-cat-icon').forEach((el,i)=>{if(i<5){el.textContent='';el.style.setProperty('background-position',(i*20)+'% 0%','important');}else{el.style.setProperty('background-image','none','important');el.style.setProperty('background-position','center','important');el.style.setProperty('font-size','clamp(36px,9vw,48px)','important');el.style.setProperty('display','grid','important');el.style.setProperty('place-items','center','important');}});
home.querySelectorAll('.ar-feature i').forEach((el,i)=>{el.textContent='';el.style.setProperty('background-position',(i*20)+'% 50%','important');});

const found={};
function findGames(){const candidates=Array.from(ana.querySelectorAll('button')).filter(b=>!home.contains(b)&&!view.contains(b));Object.keys(defs).forEach(id=>{if(found[id]&&document.contains(found[id]))return;const d=defs[id],b=candidates.find(x=>d.re.test((x.id==='basla'?'Milyoner ':'')+(x.textContent||'').replace(/\\s+/g,' ')));if(b){found[id]=b;b.classList.add('arena-original-game');}});}
const hide=document.createElement('style');hide.textContent='#ana .arena-original-game{position:absolute!important;left:-10000px!important;top:auto!important;width:1px!important;height:1px!important;overflow:hidden!important;opacity:0!important;pointer-events:none!important}';document.head.appendChild(hide);
function profile(){try{const E=window.Ekonomi,P=window.Puan,user=E&&E.ad?E.ad():'ARENA Oyuncusu',gold=E&&E.altin?E.altin():100,total=P&&P.toplam?P.toplam():0;let level=1;try{level=Math.max(1,Number(JSON.parse(localStorage.getItem('arenaMobileProgress')||'{}').seviye)||1);}catch(_){}const el=id=>document.getElementById(id);if(el('arPlayerName'))el('arPlayerName').textContent=user+' ⭐';if(el('arLevel'))el('arLevel').textContent='Seviye '+level;if(el('arXp'))el('arXp').textContent=total.toLocaleString('tr-TR')+' / '+(level*1000).toLocaleString('tr-TR')+' XP';if(el('arGold'))el('arGold').textContent=Number(gold).toLocaleString('tr-TR');if(el('arXpBar'))el('arXpBar').style.width=(total%1000)/10+'%';const av=el('arAvatar'),u=window.firebase&&firebase.auth&&firebase.auth().currentUser;if(av&&u&&u.photoURL)av.innerHTML='<img alt="" src="'+String(u.photoURL).replace(/["<>]/g,'')+'">';}catch(_){}}
function navActive(key){const n=document.getElementById('arenaNeonNav');if(n)n.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.nav===key));}
function goHome(){view.hidden=true;home.hidden=false;ana.classList.remove('hidden');document.querySelectorAll('section.kart').forEach(s=>s.classList.add('hidden'));try{document.dispatchEvent(new Event('anasayfa'));}catch(_){}try{if(typeof menu==='function')menu();}catch(_){}navActive('home');ana.scrollTop=0;window.scrollTo(0,0);}
function category(id,push){const c=cats.find(x=>x.id===id);if(!c)return;findGames();home.hidden=true;view.hidden=false;const live=c.games.filter(k=>found[k]).map(k=>({id:k,...defs[k]}));const cards=live.map(g=>'<button class="ar-game-card" data-launch="'+g.id+'"><i>'+g.icon+'</i><span><strong>'+g.name+'</strong><small>'+g.desc+'</small></span></button>').join('');const planned=c.planned.map(n=>'<div class="ar-game-card soon"><i>🔒</i><span><strong>'+n+'</strong><small>Yakında eklenecek</small></span></div>').join('');view.innerHTML='<button class="ar-back" type="button">← Kategorilere Dön</button><div class="ar-cat-head"><i>'+c.icon+'</i><span><strong>'+c.name+'</strong><small>'+c.desc+'</small></span></div><div class="ar-game-list">'+cards+planned+'</div>';navActive('games');ana.scrollTop=0;if(push)try{history.pushState({arenaCategory:id},'','#kategori-'+id);}catch(_){}}
function league(){if(window.Arena&&Arena.ac)Arena.ac('siralama');else alert('Lig sıralaması yüklenemedi.');}
function challenge(){if(window.Arena&&Arena.meydanOku)Arena.meydanOku();else alert('Meydan Oku bölümü yüklenemedi.');}
function account(){if(window.Hesap&&Hesap.ac)Hesap.ac();else if(window.ArenaAuth&&ArenaAuth.ac)ArenaAuth.ac();else alert('Profil bölümü yüklenemedi.');}
function soon(n){if(window.Ekonomi&&Ekonomi.sor)Ekonomi.sor(n,'Bu bölüm sonraki geliştirme aşamasında açılacak.',[{t:'Tamam',c:'gri'}]);else alert(n+' bölümü yakında açılacak.');}
home.addEventListener('click',e=>{const c=e.target.closest('[data-category]');if(c){category(c.dataset.category,true);return;}const a=e.target.closest('[data-action]');if(a){const k=a.dataset.action;if(k==='allgames'){navActive('games');document.querySelector('#arenaHubHome .ar-categories').scrollIntoView({behavior:'smooth',block:'start'});return;}if(k==='league')return league();if(k==='friends'||k==='settings'||k==='menu')return account();const names={reward:'Günlük Ödül',tasks:'Günlük Görevler',achievements:'Başarılar',season:'Sezon'};return soon(names[k]||'ARENA');}const f=e.target.closest('[data-feature]');if(f){if(f.dataset.feature==='kelime'&&found.kelime)found.kelime.click();else soon(f.textContent.replace(/\\s+/g,' ').trim());}});
view.addEventListener('click',e=>{const b=e.target.closest('.ar-back');if(b){e.preventDefault();view.hidden=true;home.hidden=false;navActive('home');ana.scrollTop=0;try{history.replaceState({arenaHome:true},'',location.pathname+location.search);}catch(_){}return;}const l=e.target.closest('[data-launch]');if(l&&found[l.dataset.launch])found[l.dataset.launch].click();});
if(!document.getElementById('arenaNeonNav')){const nav=document.createElement('nav');nav.id='arenaNeonNav';nav.innerHTML='<button class="active" data-nav="home"><i>⌂</i>Ana Sayfa</button><button data-nav="games"><i>🎮</i>Oyunlar</button><button data-nav="league"><i>🏆</i>Lig</button><button data-nav="challenge"><i>⚔️</i>Meydan Oku</button><button data-nav="friends"><i>👥</i>Arkadaşlar</button><button data-nav="profile"><i>♟</i>Profil</button>';document.body.appendChild(nav);nav.addEventListener('click',e=>{const b=e.target.closest('[data-nav]');if(!b)return;const k=b.dataset.nav;if(k==='home')return goHome();if(k==='games'){view.hidden=true;home.hidden=false;navActive('games');document.querySelector('#arenaHubHome .ar-categories').scrollIntoView({behavior:'smooth',block:'start'});return;}navActive(k);if(k==='league')league();else if(k==='challenge')challenge();else account();});}
if(title)title.addEventListener('click',e=>{const hs=e.target.closest('[data-header-hotspot]');if(hs){e.preventDefault();e.stopImmediatePropagation();const k=hs.dataset.headerHotspot;if(k==='settings')account();else if(k==='notifications')soon('Bildirimler');else soon('Menü');return;}e.preventDefault();e.stopImmediatePropagation();goHome();},true);
home.querySelector('.ar-brand').addEventListener('click',goHome);
findGames();new MutationObserver(findGames).observe(ana,{childList:true,subtree:true});
window.addEventListener('load',()=>{findGames();profile();});window.addEventListener('focus',profile);window.addEventListener('arena:home',goHome);window.addEventListener('anasayfa',goHome);window.addEventListener('popstate',()=>{if(!view.hidden)goHome();});if(window.Puan&&Puan.degisti)Puan.degisti(profile);setTimeout(profile,300);setTimeout(profile,1200);
})();