/* ARENA reference design rebuild */
(function(){
'use strict';
const ana=document.getElementById('ana'),title=document.querySelector('body>h1');
if(!ana||ana.dataset.arenaReference==='1')return;ana.dataset.arenaReference='1';
const cats=[
{id:'bilgi',name:'Bilgi Oyunları',icon:'🏆',desc:'Bilgini sına, zirveye çık',count:'2 Hazır',color:'violet',games:['milyoner','passaparola'],planned:['Hızlı Karar','Bilgi Düellosu','Genel Kültür']},
{id:'kelime',name:'Kelime Oyunları',icon:'🔠',desc:'Harflerle kelimeler üret',count:'3 Hazır',color:'blue',games:['kelime','rotasyon','wordScramble'],planned:['Kelime Zinciri']},
{id:'masa',name:'Masa Oyunları',icon:'🎲',desc:'Sevilen masa oyunları bir arada',count:'4 Hazır',color:'green',games:['okey','yuzbir','batak','poker'],planned:['Tavla','Dama','Satranç']},
{id:'sudoku',name:'Mantık Oyunları',icon:'🧩',desc:'Akıl yürüt, desenleri çöz',count:'1 Hazır',color:'orange',games:['miniSudoku'],planned:['Kakuro','Nonogram','Mantık Izgarası','Şekil Dizileri']},
{id:'sayi',name:'Bulmaca Oyunları',icon:'🧩',desc:'Zekânı kullan, bulmacaları çöz',count:'2 Hazır',color:'pink',games:['islem','mathSprint'],planned:['Sayı Çaprazı','2048']},
{id:'renk',name:'Renk ve Sıralama',icon:'🧪',desc:'Renkleri ayır, doğru sıraya diz',count:'1 Hazır',color:'cyan',games:['colorSort'],planned:['Top Sıralama','Su Sıralama']},
{id:'dikkat',name:'Hafıza Oyunları',icon:'👁️',desc:'Ayrıntıları fark et, hafızanı sına',count:'1 Hazır',color:'indigo',games:['memory'],planned:['Görsel Hafıza','Nesneyi Bul','7 Fark Bul']},
{id:'refleks',name:'Refleks Oyunları',icon:'⚡',desc:'Hızını ve tepkini test et',count:'1 Hazır',color:'red',games:['reflexTap'],planned:['Hızlı Dokun','Renk Tepkisi','Hızlı Eşleştirme']}
];
const defs={
okey:{name:'Okey',icon:'🀄',desc:'Taşlarını diz, elini tamamla',re:/__arena_okey_never__/i},
yuzbir:{name:'101',icon:'🎴',desc:'Perlerini aç, 101 puanı geç',re:/__arena_101_never__/i},
batak:{name:'Batak',icon:'♠️',desc:'İhaleni al, elleri topla',re:/__arena_batak_never__/i},
poker:{name:'Poker',icon:'🃏',desc:'Texas Hold’em masasına otur',re:/__arena_poker_never__/i},
milyoner:{name:'Milyoner',icon:'🏆',desc:'Genel kültür ve bilgi yarışması',re:/milyoner|oyuna başla/i},
passaparola:{name:'Passaparola',icon:'🔤',desc:'Harf harf cevapla, süreye karşı yarış',re:/pass.?aparola/i},
kelime:{name:'Kelime Oyunu',icon:'🔤',desc:'İpuçlarından kelimeleri bul',re:/kelime oyunu/i},
rotasyon:{name:'Rotasyon',icon:'🧩',desc:'Harfleri birleştir, kelimeleri keşfet',re:/rotasyon/i},
islem:{name:'İşlem Oyunu',icon:'➗',desc:'Sayılarla hedefe ulaş',re:/işlem oyunu|🔢 işlem/i},
wordScramble:{name:'Kelime Karıştırma',icon:'🔤',desc:'Karışık harflerden kelimeyi bul',re:/__arena_extra_word__/i},
miniSudoku:{name:'Mini Sudoku 4×4',icon:'🔢',desc:'4×4 sayı bulmacasını çöz',re:/__arena_extra_sudoku__/i},
mathSprint:{name:'Matematik Sprinti',icon:'➗',desc:'30 saniyede işlemleri çöz',re:/__arena_extra_math__/i},
colorSort:{name:'Renk Sıralama',icon:'🧪',desc:'Topları aynı tüplerde topla',re:/__arena_extra_color__/i},
memory:{name:'Hafıza Kartları',icon:'🧠',desc:'Aynı sembolleri eşleştir',re:/__arena_extra_memory__/i},
reflexTap:{name:'Refleks Testi',icon:'⚡',desc:'Yeşil ekrana zamanında dokun',re:/__arena_extra_reflex__/i}
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
#arenaHubHome .ar-feature i{background-image:none!important;background-size:auto!important;background-repeat:no-repeat!important}
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
const arenaHomePolish=document.createElement('style');arenaHomePolish.id='arenaHomePolish';arenaHomePolish.textContent=`
#arenaHubHome .ar-cat{min-height:88px;border-radius:19px;transition:transform .16s ease,filter .16s ease;}
#arenaHubHome .ar-cat:active,#arenaHubHome .ar-feature:active,#arenaHubHome .ar-short:active{transform:scale(.97);filter:brightness(1.16)}
#arenaHubHome .ar-cat-copy small{font-weight:800;letter-spacing:.15px}
#arenaHubHome .ar-daily{cursor:default;position:relative;overflow:hidden}
#arenaHubHome .ar-progress i{transition:width .35s ease}
#arenaHubHome .ar-feature i{border-radius:16px;background:linear-gradient(145deg,#1c477e,#21134b);border-color:#5c8bd0;box-shadow:0 5px 14px #0007,inset 0 1px #ffffff25}
#arenaHubHome .ar-section-title{letter-spacing:.15px;text-shadow:0 2px 8px #0009}
#arenaHubHome .ar-profile{box-shadow:0 5px 18px #0005,0 0 15px #168bff22,inset 0 1px #ffffff22}
#arenaHubHome .ar-wallet-row{min-height:29px}
#arenaHubHome .ar-short{min-height:62px}
@media(max-width:360px){#arenaHubHome .ar-cat{grid-template-columns:62px minmax(0,1fr);min-height:78px;padding:6px}#arenaHubHome .ar-cat-icon{font-size:34px}#arenaHubHome .ar-short{font-size:8px}}
`;document.head.appendChild(arenaHomePolish);





if(title){title.innerHTML='<button class="ar-header-hotspot left" data-header-hotspot="menu" aria-label="Menü"></button><button class="ar-header-update" data-header-hotspot="update" aria-label="ARENA Güncelle">↓</button><button class="ar-header-hotspot bell" data-header-hotspot="notifications" aria-label="Bildirimler"></button><button class="ar-header-hotspot gear" data-header-hotspot="settings" aria-label="Ayarlar"></button>';title.setAttribute('role','group');title.setAttribute('aria-label','ARENA üst menü');}
/* Web ve APK aynı ana sayfa bileşenlerini kullanır. */
(function(){
  let nativeApp=false;
  try{
    nativeApp=!!(window.Capacitor&&typeof window.Capacitor.isNativePlatform==='function'&&window.Capacitor.isNativePlatform());
    if(!nativeApp&&window.Capacitor&&typeof window.Capacitor.getPlatform==='function')nativeApp=window.Capacitor.getPlatform()!=='web';
    if(!nativeApp&&window.AndroidBridge)nativeApp=true;
  }catch(_){}
  document.documentElement.classList.toggle('arena-native-app',nativeApp);
  document.documentElement.classList.toggle('arena-web-app',!nativeApp);
})();

const found={};
const home=document.createElement('div');home.id='arenaHubHome';
const view=document.createElement('div');view.id='arenaHubCategory';view.hidden=true;
function categoryCount(c){try{if(typeof findGames==='function')findGames();}catch(_){}const ready=c.games.filter(k=>!!found[k]||(['okey','yuzbir','batak','poker'].includes(k)&&!!(window.ArenaMasaOyunlari&&window.ArenaMasaOyunlari.ac))||!!(window.ArenaMiniOyunlar&&window.ArenaMiniOyunlar.varMi&&window.ArenaMiniOyunlar.varMi(k))).length,coming=c.planned.length;return ready?ready+' Oyun'+(coming?' · '+coming+' yakında':''):'Yakında · '+coming+' oyun';}
home.innerHTML='<div class="ar-top"><button class="ar-top-btn" data-action="menu">☷</button><div class="ar-brand">ARENA<small>OYUN PLATFORMU</small></div><button class="ar-top-btn" data-action="settings">⚙</button></div>'+
'<div class="ar-profile"><div class="ar-avatar" id="arAvatar" data-action="profile"><span class="ar-guest-avatar">👤</span></div><div class="ar-player" data-action="profile"><div class="ar-player-name" id="arPlayerName">Misafir</div><div class="ar-level-line"><span class="ar-level-pill" id="arLevel">Seviye 1</span><span class="ar-xp" id="arXp">0 XP</span></div><div class="ar-xpbar"><i id="arXpBar"></i></div><button class="ar-login-state" id="arLoginState" data-action="profile" type="button">Google ile giriş yap</button></div><div class="ar-league"><img src="arena-league.webp" alt="Altın Lig"></div><div class="ar-wallet"><div class="ar-wallet-row"><span>🪙</span><b id="arGold">100</b><span>＋</span></div><div class="ar-wallet-row"><span>❤️</span><b id="arLives">3 / 3</b><span>＋</span></div></div></div>'+
'<div class="ar-shortcuts"><button class="ar-short" data-action="reward"><i>🎁</i>Günlük<br>Ödül</button><button class="ar-short" data-action="tasks"><i>📋</i>Günlük<br>Görevler</button><button class="ar-short" data-action="league"><i>🏆</i>Lig<br>Sıralaması</button><button class="ar-short" data-action="friends"><i>👥</i>Arkadaşlar</button><button class="ar-short" data-action="achievements"><i>🛡️</i>Başarılar</button><button class="ar-short" data-action="season"><i>🗓️</i>Sezon</button></div>'+
'<div class="ar-categories">'+cats.map(c=>'<button class="ar-cat '+c.color+'" data-category="'+c.id+'"><span class="ar-cat-icon">'+c.icon+'</span><span class="ar-cat-copy"><strong>'+c.name+'</strong><small>'+categoryCount(c)+'</small></span><span class="ar-cat-arrow">›</span></button>').join('')+'</div>'+
'<div class="ar-daily"><span class="ar-daily-target">🎯</span><span class="ar-daily-copy"><strong>Günün Görevi</strong><small>3 farklı oyun oyna.</small><span class="ar-progress"><i></i></span></span><span class="ar-daily-reward">🪙 +150</span></div>'+
'<div class="ar-section-title">🔥 Öne Çıkan Oyunlar <small data-action="allgames">Tümünü Gör ›</small></div><div class="ar-featured"><button class="ar-feature" data-feature="milyoner"><i>🏆</i>Milyoner</button><button class="ar-feature" data-feature="passaparola"><i>🔤</i>Passaparola</button><button class="ar-feature" data-feature="kelime"><i>🧩</i>Kelime<br>Oyunu</button><button class="ar-feature" data-feature="rotasyon"><i>🔠</i>Rotasyon</button><button class="ar-feature" data-feature="islem"><i>➗</i>İşlem</button><button class="ar-feature" data-feature="okey"><i>🀄</i>Okey</button></div>';
ana.insertBefore(home,ana.firstChild);ana.appendChild(view);document.documentElement.classList.add('arena-home-fixed');

home.querySelectorAll('.ar-cat-icon').forEach((el,i)=>{if(i>=6){el.textContent=i===6?'👁️':'⚡';el.style.setProperty('background-image','none','important');el.style.setProperty('background-position','center','important');el.style.setProperty('font-size','42px','important');el.style.setProperty('display','grid','important');el.style.setProperty('place-items','center','important');return;}const positions=['0% 0%','20% 0%','40% 0%','60% 0%','80% 0%','100% 0%'];el.textContent='';el.style.setProperty('background-position',positions[i]||'0% 0%','important');el.style.setProperty('background-size','600% 300%','important');el.style.setProperty('background-repeat','no-repeat','important');});
home.querySelectorAll('.ar-feature i').forEach(el=>{el.style.setProperty('background-image','none','important');el.style.setProperty('background-position','center','important');});

function findGames(){const candidates=Array.from(ana.querySelectorAll('button')).filter(b=>!home.contains(b)&&!view.contains(b));Object.keys(defs).forEach(id=>{if(found[id]&&document.contains(found[id]))return;const d=defs[id],b=candidates.find(x=>d.re.test((x.id==='basla'?'Milyoner ':'')+(x.textContent||'').replace(/\s+/g,' ')));if(b){found[id]=b;b.classList.add('arena-original-game');}});}
const hide=document.createElement('style');hide.textContent='#ana .arena-original-game{position:absolute!important;left:-10000px!important;top:auto!important;width:1px!important;height:1px!important;overflow:hidden!important;opacity:0!important;pointer-events:none!important}';document.head.appendChild(hide);
function profile(authUser){try{const E=window.Ekonomi,P=window.Puan,current=window.firebase&&firebase.auth?firebase.auth().currentUser:null,u=authUser&&typeof authUser.uid==='string'?authUser:current,signed=!!(u&&!u.isAnonymous),google=u&&u.providerData?u.providerData.find(p=>p.providerId==='google.com'):null,display=signed?(u.displayName||(google&&google.displayName)||(u.email?u.email.split('@')[0]:'Üyemiz')):'Misafir',gold=E&&E.altin?E.altin():100,total=P&&P.toplam?P.toplam():0;let level=1;try{level=Math.max(1,Number(JSON.parse(localStorage.getItem('arenaMobileProgress')||'{}').seviye)||1);}catch(_){}const el=id=>document.getElementById(id);if(el('arPlayerName'))el('arPlayerName').textContent=signed?display+' ⭐':'Misafir';if(el('arLoginState')){el('arLoginState').textContent='Google ile giriş yap';el('arLoginState').style.display=signed?'none':'inline-flex';}if(el('arLevel'))el('arLevel').textContent='Seviye '+level;if(el('arXp'))el('arXp').textContent=total.toLocaleString('tr-TR')+' / '+(level*1000).toLocaleString('tr-TR')+' XP';if(el('arGold'))el('arGold').textContent=Number(gold).toLocaleString('tr-TR');if(el('arXpBar'))el('arXpBar').style.width=(total%1000)/10+'%';const av=el('arAvatar');if(av){const photo=signed&&(u.photoURL||(google&&google.photoURL));if(photo){let img=av.querySelector('img');if(!img){av.innerHTML='';img=document.createElement('img');img.alt='Profil fotoğrafı';av.appendChild(img);}if(img.getAttribute('src')!==photo)img.src=photo;}else{av.innerHTML='<span class="ar-guest-avatar">'+(signed?String(display).trim().charAt(0).toLocaleUpperCase('tr'):'👤')+'</span>';}}}catch(e){console.warn('ARENA profil güncellemesi:',e);}}
function navActive(key){const n=document.getElementById('arenaNeonNav');if(n)n.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.nav===key));}
function goHome(){document.documentElement.classList.add('arena-home-fixed');view.hidden=true;home.hidden=false;ana.classList.remove('hidden');document.querySelectorAll('section.kart').forEach(s=>s.classList.add('hidden'));try{document.dispatchEvent(new Event('anasayfa'));}catch(_){}try{if(typeof menu==='function')menu();}catch(_){}navActive('home');ana.scrollTop=0;window.scrollTo(0,0);}
function category(id,push){document.documentElement.classList.remove('arena-home-fixed');const c=cats.find(x=>x.id===id);if(!c)return;findGames();home.hidden=true;view.hidden=false;const live=c.games.filter(k=>found[k]||(['okey','yuzbir','batak','poker'].includes(k)&&window.ArenaMasaOyunlari)||(window.ArenaMiniOyunlar&&window.ArenaMiniOyunlar.varMi(k))).map(k=>({id:k,...defs[k]}));const cards=live.map(g=>'<button class="ar-game-card" data-launch="'+g.id+'"><i>'+g.icon+'</i><span><strong>'+g.name+'</strong><small>'+g.desc+'</small></span></button>').join('');const planned=c.planned.map(n=>'<div class="ar-game-card soon"><i>🔒</i><span><strong>'+n+'</strong><small>Yakında eklenecek</small></span></div>').join('');view.innerHTML='<button class="ar-back" type="button">← Kategorilere Dön</button><div class="ar-cat-head"><i>'+c.icon+'</i><span><strong>'+c.name+'</strong><small>'+c.desc+'</small></span></div><div class="ar-game-list">'+cards+planned+'</div>';navActive('games');ana.scrollTop=0;if(push)try{history.pushState({arenaCategory:id},'','#kategori-'+id);}catch(_){}}
function launchGame(id){document.documentElement.classList.remove('arena-home-fixed');let opened=false;try{if(['okey','yuzbir','batak','poker'].includes(id)&&window.ArenaMasaOyunlari&&typeof window.ArenaMasaOyunlari.ac==='function'){window.ArenaMasaOyunlari.ac(id);opened=true;}else if(window.ArenaMiniOyunlar&&window.ArenaMiniOyunlar.varMi(id)){opened=window.ArenaMiniOyunlar.ac(id)!==false;}else{findGames();let b=found[id];if(!b||!document.contains(b)){const d=defs[id];if(d){b=Array.from(ana.querySelectorAll('button')).find(x=>!home.contains(x)&&!view.contains(x)&&d.re.test((x.id==='basla'?'Milyoner ':'')+(x.textContent||'').replace(/\\s+/g,' ')));if(b)found[id]=b;}}if(b&&typeof b.click==='function'&&!b.disabled){b.click();opened=true;}}}catch(err){console.error('ARENA oyun başlatma hatası:',id,err);}if(opened){try{window.dispatchEvent(new CustomEvent('arena:game-start',{detail:{id:id}}));}catch(_){}return;}soon('Bu oyun şu anda açılamadı: '+(defs[id]?.name||id));}
function dailyMission(){const el=document.querySelector('#arenaHubHome .ar-daily');if(!el)return;let key='arenaDailyGames_'+new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate(),data={games:[],claimed:false};try{data=JSON.parse(localStorage.getItem(key)||'null')||data;}catch(_){}const count=Math.min(3,(data.games||[]).length),small=el.querySelector('.ar-daily-copy small'),bar=el.querySelector('.ar-progress i'),reward=el.querySelector('.ar-daily-reward');if(small)small.textContent=count>=3?'Görev tamamlandı! Günlük ödülünü kazandın.':count+'/3 farklı oyun oynadın.';if(bar)bar.style.width=(count/3*100)+'%';if(reward)reward.textContent=count>=3?'✓ Tamamlandı':'🪙 +150';}
window.addEventListener('arena:game-start',e=>{const id=e.detail&&e.detail.id;if(!id)return;let key='arenaDailyGames_'+new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate(),data={games:[],claimed:false};try{data=JSON.parse(localStorage.getItem(key)||'null')||data;}catch(_){}data.games=Array.from(new Set([...(data.games||[]),id]));if(data.games.length>=3&&!data.claimed){data.claimed=true;try{if(window.Ekonomi&&Ekonomi.ekle){Ekonomi.ekle(150);profile();}}catch(_){}}try{localStorage.setItem(key,JSON.stringify(data));}catch(_){}dailyMission();});
function league(){if(window.Arena&&Arena.ac)Arena.ac('siralama');else alert('Lig sıralaması yüklenemedi.');}
function challenge(){if(window.Arena&&Arena.meydanOku)Arena.meydanOku();else alert('Meydan Oku bölümü yüklenemedi.');}
function account(){if(window.Hesap&&Hesap.ac)Hesap.ac();else if(window.ArenaAuth&&ArenaAuth.ac)ArenaAuth.ac();else alert('Profil bölümü yüklenemedi.');}
function soon(n){if(window.Ekonomi&&Ekonomi.sor)Ekonomi.sor(n,'Bu bölüm sonraki geliştirme aşamasında açılacak.',[{t:'Tamam',c:'gri'}]);else alert(n+' bölümü yakında açılacak.');}
home.addEventListener('click',e=>{const c=e.target.closest('[data-category]');if(c){category(c.dataset.category,true);return;}const a=e.target.closest('[data-action]');if(a){const k=a.dataset.action;if(k==='update'){const a=document.createElement('a');a.href='https://github.com/FatihKoc81/Arena/releases/latest/download/Arena.apk';a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove();return;}if(k==='allgames'){navActive('games');document.querySelector('#arenaHubHome .ar-categories').scrollIntoView({behavior:'smooth',block:'start'});return;}if(k==='league')return league();if(k==='friends')return soon('Arkadaşlar');if(k==='settings'||k==='menu'||k==='profile'||k==='login')return account();const names={reward:'Günlük Ödül',tasks:'Günlük Görevler',achievements:'Başarılar',season:'Sezon'};return soon(names[k]||'ARENA');}const f=e.target.closest('[data-feature]');if(f){launchGame(f.dataset.feature);}});
view.addEventListener('click',e=>{const b=e.target.closest('.ar-back');if(b){e.preventDefault();view.hidden=true;home.hidden=false;document.documentElement.classList.add('arena-home-fixed');navActive('home');ana.scrollTop=0;try{history.replaceState({arenaHome:true},'',location.pathname+location.search);}catch(_){}return;}const l=e.target.closest('[data-launch]');if(l)launchGame(l.dataset.launch);});
if(!document.getElementById('arenaNeonNav')){const nav=document.createElement('nav');nav.id='arenaNeonNav';nav.innerHTML='<button class="active" data-nav="home"><i>⌂</i>Ana Sayfa</button><button data-nav="games"><i>🎮</i>Oyunlar</button><button data-nav="league"><i>🏆</i>Lig</button><button data-nav="challenge"><i>⚔️</i>Meydan Oku</button><button data-nav="friends"><i>👥</i>Arkadaşlar</button><button data-nav="profile"><i>♟</i>Profil</button>';document.body.appendChild(nav);nav.addEventListener('click',e=>{const b=e.target.closest('[data-nav]');if(!b)return;const k=b.dataset.nav;if(k==='home')return goHome();if(k==='games'){document.documentElement.classList.remove('arena-home-fixed');view.hidden=true;home.hidden=false;navActive('games');document.querySelector('#arenaHubHome .ar-categories').scrollIntoView({behavior:'smooth',block:'start'});return;}navActive(k);if(k==='league')league();else if(k==='challenge')challenge();else if(k==='friends')soon('Arkadaşlar');else account();});}
if(title)title.addEventListener('click',e=>{const hs=e.target.closest('[data-header-hotspot]');if(hs){e.preventDefault();e.stopImmediatePropagation();const k=hs.dataset.headerHotspot;if(k==='settings')account();else if(k==='notifications')soon('Bildirimler');else if(k==='update'){const a=document.createElement('a');a.href='https://github.com/FatihKoc81/Arena/releases/latest/download/Arena.apk';a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove();}else soon('Menü');return;}e.preventDefault();e.stopImmediatePropagation();goHome();},true);
home.querySelector('.ar-brand').addEventListener('click',goHome);
findGames();new MutationObserver(findGames).observe(ana,{childList:true,subtree:true});
window.addEventListener('load',()=>{findGames();profile();dailyMission();});window.addEventListener('focus',profile);
(function bindProfileAuth(){let tries=0;function bind(){if(!window.firebase||!firebase.apps||!firebase.apps.length||!firebase.auth){if(tries++<100)setTimeout(bind,200);return;}try{firebase.auth().onAuthStateChanged(u=>profile(u));}catch(e){console.warn('ARENA profil oturumu:',e);}}bind();})();window.addEventListener('arena:home',goHome);window.addEventListener('anasayfa',goHome);window.addEventListener('popstate',()=>{if(!view.hidden)goHome();});if(window.Puan&&Puan.degisti)Puan.degisti(profile);setTimeout(profile,300);setTimeout(profile,1200);
/* Unified responsive home layout: identical on web and APK. */
const unifiedHome=document.createElement('style');
unifiedHome.id='arenaUnifiedResponsiveHome';
unifiedHome.textContent=`
html.arena-web-app #arenaHubHome .ar-section-title,
html.arena-native-app #arenaHubHome .ar-section-title{display:flex!important}
html.arena-web-app #arenaHubHome .ar-featured,
html.arena-native-app #arenaHubHome .ar-featured{display:grid!important}
body{padding-bottom:calc(86px + env(safe-area-inset-bottom))!important}
#ana{display:block!important;min-height:0!important;height:auto!important;padding:0 7px 16px!important;overflow:visible!important}
#arenaHubHome{display:flex!important;flex:0 0 auto!important;flex-direction:column!important;justify-content:flex-start!important;align-items:stretch!important;gap:12px!important;min-height:0!important;height:auto!important;padding:4px 0 16px!important}
#arenaHubHome .ar-profile{display:grid!important;grid-template-columns:clamp(54px,15vw,64px) minmax(0,1fr) clamp(48px,14vw,58px) clamp(88px,26vw,112px)!important;align-items:center!important;gap:6px!important;width:100%!important;height:auto!important;min-height:80px!important;margin:0!important;padding:6px 8px!important;box-sizing:border-box!important;overflow:visible!important}
#arenaHubHome .ar-avatar{display:grid!important;place-items:center!important;width:clamp(52px,15vw,60px)!important;height:clamp(52px,15vw,60px)!important;min-width:0!important;min-height:0!important;align-self:center!important;justify-self:center!important;overflow:hidden!important;border:3px solid #ffd35a!important;border-radius:50%!important;background:linear-gradient(145deg,#f6d878,#9b5a16)!important;box-shadow:0 0 10px #ffcc4e88,inset 0 1px #fff8!important;box-sizing:border-box!important}
#arenaHubHome .ar-avatar img{display:block!important;width:100%!important;height:100%!important;max-width:100%!important;max-height:100%!important;object-fit:cover!important;object-position:center!important;border-radius:50%!important}
#arenaHubHome .ar-player{min-width:0!important;align-self:center!important}
#arenaHubHome .ar-player-name{font-size:clamp(12px,3.6vw,17px)!important;line-height:1.15!important}
#arenaHubHome .ar-level-line{display:flex!important;flex-wrap:wrap!important;gap:5px!important;margin-top:5px!important}
#arenaHubHome .ar-level-pill{font-size:11px!important;padding:4px 7px!important}
#arenaHubHome .ar-xp{font-size:10px!important}
#arenaHubHome .ar-xpbar{height:5px!important;margin-top:5px!important}
#arenaHubHome .ar-league{display:grid!important;place-items:center!important;width:100%!important;height:58px!important;min-width:0!important}
#arenaHubHome .ar-league img{display:block!important;width:100%!important;height:56px!important;object-fit:contain!important}
#arenaHubHome .ar-wallet{display:grid!important;grid-template-columns:1fr!important;gap:5px!important;min-width:0!important}
#arenaHubHome .ar-wallet-row{display:flex!important;align-items:center!important;justify-content:space-between!important;min-width:0!important;height:31px!important;min-height:31px!important;padding:3px 6px!important;font-size:11px!important;line-height:1!important;gap:3px!important;border-radius:10px!important}
#arenaHubHome .ar-wallet-row b{font-size:15px!important;line-height:1!important}
#arenaHubHome .ar-shortcuts{display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:5px!important;margin:0!important}
#arenaHubHome .ar-short{display:flex!important;align-items:center!important;justify-content:center!important;min-width:0!important;width:100%!important;height:68px!important;min-height:68px!important;padding:4px 1px!important;gap:4px!important;font-size:clamp(8px,2.5vw,10px)!important;line-height:1.08!important;white-space:normal!important}
#arenaHubHome .ar-short i{font-size:clamp(19px,5.4vw,25px)!important;line-height:1!important}
#arenaHubHome .ar-categories{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px!important;margin:0!important}
#arenaHubHome .ar-cat{display:grid!important;grid-template-columns:clamp(54px,16vw,70px) minmax(0,1fr)!important;align-items:center!important;gap:6px!important;width:100%!important;height:clamp(72px,20vw,82px)!important;min-height:clamp(72px,20vw,82px)!important;padding:6px 8px!important;border-radius:16px!important;box-sizing:border-box!important}
#arenaHubHome .ar-cat-icon{display:block!important;width:100%!important;height:clamp(52px,15vw,66px)!important;min-width:0!important;min-height:0!important;font-size:0!important;background-size:600% 300%!important;background-repeat:no-repeat!important}
#arenaHubHome .ar-cat-copy{min-width:0!important}
#arenaHubHome .ar-cat-copy strong{display:block!important;font-size:clamp(13px,3.7vw,17px)!important;line-height:1.12!important;overflow-wrap:anywhere!important}
#arenaHubHome .ar-cat-copy small{display:block!important;font-size:clamp(10px,2.9vw,12px)!important;margin-top:4px!important}
#arenaHubHome .ar-daily{display:grid!important;grid-template-columns:48px minmax(0,1fr) auto!important;align-items:center!important;gap:7px!important;width:100%!important;height:auto!important;min-height:66px!important;margin:0!important;padding:8px 9px!important;box-sizing:border-box!important}
#arenaHubHome .ar-daily-target{font-size:36px!important}
#arenaHubHome .ar-daily-copy{min-width:0!important}
#arenaHubHome .ar-daily-copy strong{font-size:14px!important}
#arenaHubHome .ar-daily-copy small{font-size:11px!important}
#arenaHubHome .ar-daily-reward{padding:6px 8px!important;font-size:13px!important}
#arenaHubHome .ar-section-title{display:flex!important;align-items:center!important;justify-content:space-between!important;margin:2px 2px 0!important;font-size:clamp(16px,4.5vw,20px)!important}
#arenaHubHome .ar-section-title small{font-size:11px!important}
#arenaHubHome .ar-featured{display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:6px!important;width:100%!important;margin:0!important;padding:0 0 4px!important}
#arenaHubHome .ar-feature{display:block!important;min-width:0!important;padding:0!important;font-size:clamp(8px,2.5vw,10px)!important;line-height:1.12!important}
#arenaHubHome .ar-feature i{display:grid!important;place-items:center!important;width:100%!important;height:clamp(42px,13vw,54px)!important;margin:0 0 4px!important;border:1px solid #527db8!important;border-radius:12px!important;background:linear-gradient(145deg,#173d70,#211342)!important;background-image:none!important;box-shadow:inset 0 1px #ffffff24,0 4px 10px #0008!important;font-size:clamp(22px,6vw,27px)!important;font-style:normal!important}
#arenaHubCategory{padding:2px 0 18px!important}
#arenaNeonNav{left:7px!important;right:7px!important;bottom:calc(4px + env(safe-area-inset-bottom))!important;display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:2px!important;padding:4px 3px!important;border-radius:21px!important;box-sizing:border-box!important}
#arenaNeonNav button{display:flex!important;align-items:center!important;justify-content:center!important;min-width:0!important;width:100%!important;height:62px!important;min-height:62px!important;padding:3px 1px!important;gap:3px!important;font-size:clamp(8px,2.5vw,10px)!important}
#arenaNeonNav button i{font-size:clamp(19px,5.5vw,24px)!important;line-height:1!important}
#arena-table-modal{box-sizing:border-box!important;gap:8px!important}
#arena-table-modal .at-head{position:sticky!important;top:0!important;z-index:3!important;background:#07152df2!important;backdrop-filter:blur(10px)!important;border-radius:12px!important}
#arena-table-modal .at-panel{box-shadow:inset 0 1px #ffffff12,0 7px 18px #0005!important}
#arena-table-modal .at-hand{display:flex!important;flex-wrap:nowrap!important;justify-content:flex-start!important;overflow-x:auto!important;overflow-y:visible!important;padding:10px 4px 14px!important;scrollbar-width:thin!important;touch-action:pan-x!important}
#arena-table-modal .at-tile,#arena-table-modal .at-card{flex:0 0 auto!important;touch-action:manipulation!important;user-select:none!important;-webkit-user-select:none!important}
#arena-table-modal .at-game,#arena-table-modal .at-btn{transition:transform .14s ease,filter .14s ease!important}
#arena-table-modal .at-game:active,#arena-table-modal .at-btn:active{transform:scale(.97)!important;filter:brightness(1.15)!important}
@media(max-width:360px){
 #arenaHubHome{gap:9px!important}
 #arenaHubHome .ar-profile{grid-template-columns:52px minmax(0,1fr) 46px 84px!important;gap:4px!important;padding:5px 5px!important}
 #arenaHubHome .ar-avatar{width:50px!important;height:50px!important}
 #arenaHubHome .ar-player-name{font-size:12px!important}
 #arenaHubHome .ar-wallet-row{height:29px!important;min-height:29px!important;font-size:10px!important}
 #arenaHubHome .ar-wallet-row b{font-size:13px!important}
 #arenaHubHome .ar-cat{grid-template-columns:52px minmax(0,1fr)!important;height:70px!important;min-height:70px!important;padding:5px!important}
 #arenaHubHome .ar-cat-icon{height:52px!important}
 #arenaHubHome .ar-daily{grid-template-columns:40px minmax(0,1fr) auto!important;gap:5px!important}
 #arenaHubHome .ar-daily-target{font-size:30px!important}
 #arenaHubHome .ar-daily-reward{font-size:11px!important;padding:5px!important}
 #arenaNeonNav button{height:58px!important;min-height:58px!important}
}
`;
document.head.appendChild(unifiedHome);


/* One reference-matched design across browser, PWA and APK. */
const arenaReferenceFinal=document.createElement('style');
arenaReferenceFinal.id='arenaReferenceFinal';
arenaReferenceFinal.textContent=`
html,body{width:100%!important;min-height:100%!important;overflow-x:hidden!important;background:#020919!important;color:#fff!important}
body{box-sizing:border-box!important;padding-top:calc(var(--bas-yuk,58px) + env(safe-area-inset-top))!important;padding-bottom:calc(82px + env(safe-area-inset-bottom))!important;background:radial-gradient(ellipse at 50% 34%,#061b3b 0%,#020b1f 55%,#010713 100%)!important}
body>h1{height:calc(var(--bas-yuk,58px) + env(safe-area-inset-top))!important;background-image:url("arena-header.webp")!important;background-size:100% 100%!important;background-position:center!important;background-repeat:no-repeat!important;background-color:#020b21!important;border:0!important;box-shadow:0 4px 18px #001b4b88!important}
body>h1 .hl,body>h1 .arena-logo{display:none!important}
body>h1 .ar-header-hotspot{position:absolute!important;top:10%!important;height:80%!important;padding:0!important;border:0!important;background:transparent!important;z-index:52!important;min-height:0!important;cursor:pointer!important}
body>h1 .ar-header-hotspot.left{left:1%!important;width:12%!important}
body>h1 .ar-header-hotspot.bell{right:11%!important;width:9%!important}
body>h1 .ar-header-hotspot.gear{right:1%!important;width:9%!important}
#ana{display:block!important;position:relative!important;width:100%!important;max-width:720px!important;min-width:0!important;min-height:0!important;height:auto!important;max-height:none!important;overflow:visible!important;margin:0 auto!important;padding:0 6px 20px!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;text-align:left!important}
#ana.hidden{display:none!important}
#ana>#seviye,#ana>.btn,#ana>.pill,#ana>.ek-bar,#ana>.arKart{display:none!important}
#arenaHubHome{display:block!important;width:100%!important;min-height:0!important;height:auto!important;max-height:none!important;overflow:visible!important;padding:0 0 16px!important;margin:0!important}
#arenaHubHome .ar-profile{display:grid!important;grid-template-columns:56px minmax(0,1fr) 54px 90px!important;align-items:center!important;gap:5px!important;width:100%!important;height:auto!important;min-height:62px!important;box-sizing:border-box!important;padding:3px 6px!important;margin:0 0 10px!important;border:1px solid #315a99!important;border-radius:17px!important;background:linear-gradient(105deg,#102c59 0%,#07172f 58%,#10284f 100%)!important;box-shadow:0 0 16px #168bff2a,inset 0 1px #ffffff20!important}
#arenaHubHome .ar-avatar{position:relative!important;width:52px!important;height:52px!important;min-width:52px!important;display:block!important;overflow:hidden!important;border:3px solid #ffd154!important;border-radius:50%!important;background:#182b4d!important;box-shadow:0 0 10px #ffbd3c88!important;box-sizing:border-box!important}
#arenaHubHome .ar-avatar img{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center!important;border-radius:50%!important}
#arenaHubHome .ar-avatar:after{content:'🇹🇷';position:absolute;right:-3px;bottom:-3px;width:17px;height:17px;display:grid;place-items:center;border:1px solid #e7c45b;border-radius:50%;background:#b31c2f;font-size:10px;line-height:1;box-shadow:0 1px 4px #0009}
#arenaHubHome .ar-player{min-width:0!important}
#arenaHubHome .ar-player-name{font-size:clamp(13px,3.8vw,18px)!important;font-weight:900!important;line-height:1.15!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
#arenaHubHome .ar-level-line{display:flex!important;align-items:center!important;gap:6px!important;margin-top:5px!important;min-width:0!important}
#arenaHubHome .ar-level-pill{padding:4px 7px!important;border-radius:10px!important;background:linear-gradient(90deg,#087fe8,#3b50c8)!important;font-size:10px!important;font-weight:900!important}
#arenaHubHome .ar-xp{font-size:9px!important;color:#e5edff!important;white-space:nowrap!important}
#arenaHubHome .ar-xpbar{height:5px!important;margin-top:4px!important;border-radius:8px!important;background:#18284b!important;overflow:hidden!important}
#arenaHubHome .ar-xpbar i{height:100%!important;border-radius:8px!important;background:linear-gradient(90deg,#7d4dff,#35c8ff)!important}
#arenaHubHome .ar-league{display:grid!important;place-items:center!important;width:52px!important;height:54px!important;min-width:0!important;overflow:hidden!important}
#arenaHubHome .ar-league img{display:block!important;width:52px!important;height:52px!important;max-width:100%!important;object-fit:contain!important}
#arenaHubHome .ar-wallet{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:4px!important;min-width:0!important}
#arenaHubHome .ar-wallet-row{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:3px!important;width:100%!important;height:25px!important;min-height:25px!important;box-sizing:border-box!important;padding:2px 5px!important;border:1px solid #33598d!important;border-radius:10px!important;background:#06152f!important;font-size:10px!important;font-weight:850!important;line-height:1!important}
#arenaHubHome .ar-wallet-row b{font-size:14px!important;line-height:1!important}
#arenaHubHome .ar-wallet-row span:last-child{color:#fff!important;font-size:15px!important}
#arenaHubHome .ar-shortcuts{display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:6px!important;width:100%!important;margin:0 0 12px!important;padding:0!important}
#arenaHubHome .ar-short{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:4px!important;min-width:0!important;width:100%!important;height:54px!important;min-height:54px!important;box-sizing:border-box!important;padding:4px 1px!important;border:1px solid #355e9d!important;border-radius:15px!important;background:linear-gradient(155deg,#172e58,#07152d)!important;box-shadow:inset 0 1px #ffffff24,0 4px 10px #0007!important;color:#fff!important;text-align:center!important;font-size:clamp(8px,2.35vw,10px)!important;font-weight:850!important;line-height:1.08!important;white-space:normal!important}
#arenaHubHome .ar-short i{font-style:normal!important;font-size:23px!important;line-height:1!important}
#arenaHubHome .ar-categories{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;width:100%!important;margin:0!important;padding:0!important}
#arenaHubHome .ar-cat{position:relative!important;isolation:isolate!important;display:grid!important;grid-template-columns:62px minmax(0,1fr) 22px!important;align-items:center!important;gap:4px!important;width:100%!important;height:72px!important;min-height:72px!important;box-sizing:border-box!important;padding:5px 7px!important;border:2px solid var(--edge)!important;border-radius:19px!important;color:#fff!important;text-align:left!important;background:linear-gradient(135deg,var(--c1),var(--c2))!important;box-shadow:inset 0 1px 0 #ffffff45,0 0 13px var(--glow)!important;overflow:hidden!important;transition:transform .15s ease,filter .15s ease!important}
#arenaHubHome .ar-cat:before{content:''!important;position:absolute!important;z-index:-1!important;right:-18px!important;top:-28px!important;width:100px!important;height:100px!important;border-radius:50%!important;background:#ffffff13!important}
#arenaHubHome .ar-cat:after{content:''!important;position:absolute!important;z-index:-1!important;inset:0!important;background:linear-gradient(135deg,#ffffff12,transparent 52%,#0002)!important}
#arenaHubHome .ar-cat.violet{--c1:#9128d9;--c2:#35105f;--edge:#d77aff;--glow:#bb45ff55}
#arenaHubHome .ar-cat.blue{--c1:#087bdc;--c2:#092c70;--edge:#31c7ff;--glow:#00aaff55}
#arenaHubHome .ar-cat.green{--c1:#07b968;--c2:#064331;--edge:#35ff91;--glow:#00ff7755}
#arenaHubHome .ar-cat.orange{--c1:#f28b08;--c2:#71300b;--edge:#ffc02d;--glow:#ff9a0055}
#arenaHubHome .ar-cat.pink{--c1:#df2878;--c2:#64143c;--edge:#ff65b1;--glow:#ff2d9155}
#arenaHubHome .ar-cat.cyan{--c1:#05b6b6;--c2:#064657;--edge:#38f5ed;--glow:#00d9e655}
#arenaHubHome .ar-cat.indigo{--c1:#554fd3;--c2:#1c225b;--edge:#938fff;--glow:#6461ff55}
#arenaHubHome .ar-cat.red{--c1:#e94248;--c2:#641a32;--edge:#ff8888;--glow:#ff4f6555}
#arenaHubHome .ar-cat-icon{display:block!important;width:60px!important;height:60px!important;background-image:url("arena-reference.webp")!important;background-size:600% 300%!important;background-repeat:no-repeat!important;background-position:center!important;font-size:0!important;filter:drop-shadow(0 4px 4px #000b)!important}
#arenaHubHome .ar-cat:nth-child(n+6) .ar-cat-icon{background-image:url("arena-reference.webp")!important}
#arenaHubHome .ar-cat-copy{display:block!important;min-width:0!important}
#arenaHubHome .ar-cat-copy strong{display:block!important;font-size:clamp(12px,3.55vw,16px)!important;font-weight:950!important;line-height:1.08!important;overflow-wrap:anywhere!important}
#arenaHubHome .ar-cat-copy small{display:block!important;margin-top:5px!important;font-size:clamp(9px,2.6vw,11px)!important;line-height:1.1!important;color:#f0f5ff!important;font-weight:600!important}
#arenaHubHome .ar-cat-arrow{display:grid!important;place-items:center!important;width:21px!important;height:21px!important;border:1px solid #ffffff75!important;border-radius:50%!important;background:#ffffff16!important;font:900 21px/1 system-ui!important;color:#fff!important}
#arenaHubHome .ar-daily{display:grid!important;grid-template-columns:48px minmax(0,1fr) auto!important;align-items:center!important;gap:6px!important;width:100%!important;min-height:60px!important;height:auto!important;box-sizing:border-box!important;margin:12px 0 0!important;padding:7px 9px!important;border:1px solid #586bc9!important;border-radius:17px!important;background:linear-gradient(100deg,#182d67,#30205b)!important;box-shadow:0 0 13px #6557d044!important}
#arenaHubHome .ar-daily-target{font-size:35px!important;text-align:center!important}
#arenaHubHome .ar-daily-copy{min-width:0!important}
#arenaHubHome .ar-daily-copy strong{display:block!important;font-size:14px!important;font-weight:900!important}
#arenaHubHome .ar-daily-copy small{display:block!important;margin-top:3px!important;color:#d9e5ff!important;font-size:10px!important;line-height:1.15!important}
#arenaHubHome .ar-progress{height:7px!important;margin-top:7px!important;border-radius:10px!important;background:#06122d!important;overflow:hidden!important}
#arenaHubHome .ar-progress i{display:block!important;height:100%!important;border-radius:10px!important;background:linear-gradient(90deg,#2bdc37,#7df52b)!important;transition:width .3s ease!important}
#arenaHubHome .ar-daily-reward{padding:7px 9px!important;border:2px solid #f9c443!important;border-radius:13px!important;background:linear-gradient(#573a09,#1b1631)!important;color:#ffe27a!important;font-size:13px!important;font-weight:950!important;white-space:nowrap!important}
#arenaHubHome .ar-section-title{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;margin:12px 3px 7px!important;color:#fff!important;font-size:clamp(16px,4.8vw,20px)!important;font-weight:950!important;letter-spacing:.1px!important;text-shadow:0 2px 8px #0009!important}
#arenaHubHome .ar-section-title small{font-size:10px!important;color:#c1d6ff!important;font-weight:800!important}
#arenaHubHome .ar-featured{display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:5px!important;padding:0 0 12px!important;margin:0!important}
#arenaHubHome .ar-feature{display:block!important;min-width:0!important;padding:0!important;background:transparent!important;color:#fff!important;text-align:center!important;font-size:clamp(8px,2.7vw,10px)!important;font-weight:900!important;line-height:1.12!important}
#arenaHubHome .ar-feature i{display:grid!important;place-items:center!important;width:100%!important;height:clamp(48px,14vw,58px)!important;margin:0 0 5px!important;border:2px solid #5876b4!important;border-radius:14px!important;background:linear-gradient(145deg,#193d73,#251343)!important;box-shadow:0 4px 12px #0007,inset 0 1px #ffffff25!important;font-size:clamp(20px,5.5vw,27px)!important;font-style:normal!important}
#arenaNeonNav{position:fixed!important;left:6px!important;right:6px!important;bottom:calc(4px + env(safe-area-inset-bottom))!important;z-index:10050!important;display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:2px!important;padding:5px 3px!important;border:1px solid #314d83!important;border-radius:22px!important;background:linear-gradient(180deg,rgba(16,29,58,.98),rgba(4,10,25,.99))!important;box-shadow:0 -5px 22px #000b,0 0 16px #176bca35!important;backdrop-filter:blur(12px)!important}
#arenaNeonNav button{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:4px!important;min-width:0!important;min-height:60px!important;height:60px!important;padding:3px 1px!important;border:0!important;border-radius:14px!important;background:transparent!important;color:#e0eaff!important;font-size:clamp(8px,2.6vw,10px)!important;line-height:1.05!important;font-weight:850!important;white-space:nowrap!important}
#arenaNeonNav button i{font-style:normal!important;font-size:26px!important;line-height:1!important}
#arenaNeonNav button.active{background:linear-gradient(145deg,#5523a0,#171b50)!important;box-shadow:inset 0 0 15px #c18aff55!important;color:#fff!important}
body:has(#ana.hidden) #arenaNeonNav{display:none!important}
#arenaHubHome .ar-cat:active,#arenaHubHome .ar-feature:active,#arenaHubHome .ar-short:active{transform:scale(.975)!important;filter:brightness(1.14)!important}
@media(min-width:600px){
#arenaHubHome .ar-profile{grid-template-columns:88px minmax(0,1fr) 78px 136px!important;min-height:88px!important;padding:4px 10px!important}
#arenaHubHome .ar-avatar{width:78px!important;height:78px!important}
#arenaHubHome .ar-league{width:74px!important;height:78px!important}
#arenaHubHome .ar-league img{width:74px!important;height:74px!important}
#arenaHubHome .ar-wallet-row{height:34px!important;min-height:34px!important;font-size:13px!important}
#arenaHubHome .ar-wallet-row b{font-size:18px!important}
#arenaHubHome .ar-short{height:84px!important;min-height:84px!important;font-size:12px!important}
#arenaHubHome .ar-short i{font-size:32px!important}
#arenaHubHome .ar-cat{height:126px!important;min-height:126px!important;grid-template-columns:102px minmax(0,1fr) 30px!important;padding:8px 12px!important;gap:8px!important;border-radius:24px!important}
#arenaHubHome .ar-cat-icon{width:96px!important;height:104px!important}
#arenaHubHome .ar-cat-copy strong{font-size:clamp(18px,3.5vw,24px)!important}
#arenaHubHome .ar-cat-copy small{font-size:15px!important;margin-top:8px!important}
#arenaHubHome .ar-cat-arrow{width:32px!important;height:32px!important;font-size:27px!important}
#arenaHubHome .ar-daily{min-height:90px!important;grid-template-columns:76px minmax(0,1fr) auto!important;padding:10px 14px!important}
#arenaHubHome .ar-daily-target{font-size:52px!important}
#arenaHubHome .ar-daily-copy strong{font-size:19px!important}
#arenaHubHome .ar-daily-copy small{font-size:14px!important}
#arenaHubHome .ar-daily-reward{font-size:17px!important;padding:9px 13px!important}
#arenaHubHome .ar-feature i{height:90px!important;border-radius:18px!important;font-size:34px!important}
#arenaHubHome .ar-feature{font-size:12px!important}
#arenaNeonNav button{height:82px!important;min-height:82px!important;font-size:12px!important}
#arenaNeonNav button i{font-size:34px!important}
}
@media(max-width:350px){
#arenaHubHome .ar-profile{grid-template-columns:49px minmax(0,1fr) 42px 78px!important;gap:3px!important}
#arenaHubHome .ar-avatar{width:46px!important;height:46px!important;min-width:46px!important}
#arenaHubHome .ar-league,#arenaHubHome .ar-league img{width:42px!important;height:46px!important}
#arenaHubHome .ar-cat{grid-template-columns:54px minmax(0,1fr) 18px!important;padding:4px!important}
#arenaHubHome .ar-cat-icon{width:52px!important;height:54px!important}
#arenaHubHome .ar-cat-copy strong{font-size:11px!important}
#arenaHubHome .ar-cat-arrow{width:18px!important;height:18px!important;font-size:16px!important}
}
`;
document.head.appendChild(arenaReferenceFinal);

})();
/* Shared home polish — deliberately identical in browser, PWA and native app. */
(function(){
  var s=document.createElement('style');s.id='arenaSameHomeAccountFix';s.textContent=`
  html,body{overflow-x:hidden!important;overflow-y:auto!important}
  body{padding-bottom:calc(150px + env(safe-area-inset-bottom))!important}
  #ana{height:auto!important;min-height:0!important;overflow:visible!important}
  #arenaHubHome{height:auto!important;min-height:0!important;justify-content:flex-start!important;gap:12px!important;padding-bottom:118px!important}
  #arenaHubHome .ar-section-title{display:flex!important}
  #arenaHubHome .ar-featured{display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;padding-bottom:22px!important;margin-bottom:64px!important}
  #arenaHubHome .ar-feature{min-height:76px!important;display:block!important;overflow:visible!important}
  #arenaHubHome .ar-feature i{display:grid!important;place-items:center!important;height:clamp(54px,14vw,66px)!important;margin-bottom:6px!important}
  #arenaHubHome .ar-profile,#arenaHubHome .ar-player{cursor:pointer!important}
  #arenaHubHome .ar-login-state{display:inline-flex;align-items:center;justify-content:flex-start;max-width:100%;margin:5px 0 0;padding:0;border:0;background:transparent;color:#80cfff;font:800 10px/1.1 system-ui,sans-serif;text-align:left;cursor:pointer;white-space:nowrap}
  #arenaHubHome .ar-login-state:before{content:'●';font-size:8px;color:#27d78a;margin-right:5px}
  #arenaHubHome .ar-avatar .ar-guest-avatar{display:grid;place-items:center;width:100%;height:100%;border-radius:50%;font:900 30px/1 system-ui,sans-serif;color:#fff;background:linear-gradient(145deg,#294b79,#101d38)}
  #arenaHubHome .ar-cat:nth-child(n+7) .ar-cat-icon{background-image:none!important;font-size:42px!important}
  #arenaHubHome .ar-cat-copy small{white-space:normal!important;line-height:1.05!important}
  #arenaNeonNav{bottom:calc(4px + env(safe-area-inset-bottom))!important}
  html.arena-web-app #arenaHubHome .ar-section-title,
  html.arena-native-app #arenaHubHome .ar-section-title{display:flex!important}
  html.arena-web-app #arenaHubHome .ar-featured,
  html.arena-native-app #arenaHubHome .ar-featured{display:grid!important}
  @media(max-width:360px){
    #arenaHubHome .ar-profile{grid-template-columns:48px minmax(0,1fr) 40px 76px!important;gap:3px!important}
    #arenaHubHome .ar-avatar{width:46px!important;height:46px!important;min-width:46px!important}
    #arenaHubHome .ar-league,#arenaHubHome .ar-league img{width:40px!important;height:44px!important}
    #arenaHubHome .ar-login-state{font-size:9px!important}
  }
  `;document.head.appendChild(s);

/* Final account clarity and shared layout polish */
const accountPolish=document.createElement('style');
accountPolish.id='arenaAccountPolish';
accountPolish.textContent=`
#arenaHubHome .ar-profile{overflow:visible!important;align-items:center!important}
#arenaHubHome .ar-avatar{position:relative!important;overflow:hidden!important;isolation:isolate!important;flex:none!important}
#arenaHubHome .ar-avatar img{position:relative!important;z-index:1!important;width:100%!important;height:100%!important;object-fit:cover!important;border-radius:50%!important}
#arenaHubHome .ar-guest-avatar{display:grid!important;place-items:center!important;width:100%!important;height:100%!important;border-radius:50%!important;background:linear-gradient(145deg,#244b7d,#0b1833)!important;color:#dbeafe!important;font-size:28px!important}
#arenaHubHome .ar-login-state{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:auto!important;min-height:20px!important;margin-top:5px!important;padding:3px 8px!important;border:1px solid #6daaff!important;border-radius:9px!important;background:linear-gradient(90deg,#087fe8,#354ac4)!important;color:#fff!important;font-size:10px!important;font-weight:850!important;line-height:1.1!important}
#arenaHubHome .ar-login-state[style*="display: none"]{display:none!important}
#arenaHubHome .ar-player{min-width:0!important}
#arenaHubHome .ar-player-name{overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
#arenaHubHome .ar-featured{display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important}
#arenaHubHome .ar-feature{min-width:0!important;overflow:hidden!important}
#arenaHubHome .ar-feature i{width:100%!important;box-sizing:border-box!important}
#arenaNeonNav{padding-bottom:calc(5px + env(safe-area-inset-bottom))!important}
body{padding-bottom:calc(88px + env(safe-area-inset-bottom))!important}
`;
document.head.appendChild(accountPolish);


(function(){
var st=document.createElement('style');st.id='arenaRuntimeRecovery';st.textContent=`
#arenaHubHome .ar-avatar{position:relative!important;width:54px!important;height:54px!important;min-width:54px!important;max-width:54px!important;overflow:hidden!important;border-radius:50%!important;box-sizing:border-box!important;transform:none!important}
#arenaHubHome .ar-avatar:before,#arenaHubHome .ar-avatar:after{content:none!important;display:none!important}
#arenaHubHome .ar-avatar img{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;border-radius:50%!important}
#arenaHubHome .ar-guest-avatar{position:absolute!important;inset:0!important;display:grid!important;place-items:center!important;width:100%!important;height:100%!important;border-radius:50%!important}
#arenaHubHome .ar-update-cta{display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;min-height:38px!important;box-sizing:border-box!important;margin:0 0 10px!important;padding:8px 12px!important;border:1px solid #e9bd49!important;border-radius:12px!important;background:linear-gradient(100deg,#163b70,#3b2764)!important;color:#ffe18a!important;font:900 13px/1.2 system-ui,sans-serif!important;text-decoration:none!important;box-shadow:0 0 12px #e6b53a35,inset 0 1px #ffffff35!important}
#arenaHubHome .ar-update-cta:active{transform:scale(.985)!important}
`;document.head.appendChild(st);
})();

})();

/* 2026-11-08: fixed, fitted home layout shared by PWA and APK */
(function(){
  const fixedHome=document.createElement('style');
  fixedHome.id='arenaFixedHomeFinal';
  fixedHome.textContent=`
  html.arena-home-fixed,html.arena-home-fixed body{
    width:100%!important;height:100%!important;min-height:100%!important;
    overflow:hidden!important;overscroll-behavior:none!important;
  }
  html.arena-home-fixed body{
    height:100dvh!important;min-height:100dvh!important;box-sizing:border-box!important;
    padding:calc(var(--bas-yuk,58px) + env(safe-area-inset-top)) 0 calc(70px + env(safe-area-inset-bottom))!important;
    touch-action:manipulation!important;
  }
  html.arena-home-fixed #ana{
    display:block!important;width:100%!important;height:100%!important;min-height:0!important;
    max-height:none!important;overflow:hidden!important;margin:0 auto!important;
    padding:0 7px!important;box-sizing:border-box!important;
  }
  html.arena-home-fixed #arenaHubHome{
    display:grid!important;grid-template-rows:auto auto minmax(0,1fr) auto auto auto!important;
    align-content:stretch!important;justify-content:initial!important;align-items:stretch!important;
    width:100%!important;height:100%!important;min-height:0!important;max-height:100%!important;
    gap:clamp(3px,.65vh,6px)!important;padding:4px 0 2px!important;overflow:hidden!important;
  }
  html.arena-home-fixed #arenaHubHome .ar-profile{
    display:grid!important;grid-template-columns:46px minmax(0,1fr) 42px 74px!important;
    align-items:center!important;gap:4px!important;width:100%!important;height:auto!important;
    min-height:54px!important;margin:0!important;padding:4px 6px!important;
    box-sizing:border-box!important;overflow:hidden!important;border-radius:14px!important;
  }
  html.arena-home-fixed #arenaHubHome .ar-avatar{
    display:grid!important;place-items:center!important;position:relative!important;
    width:42px!important;height:42px!important;min-width:42px!important;max-width:42px!important;
    min-height:42px!important;overflow:hidden!important;border:1px solid #547eaa!important;
    border-radius:50%!important;background:linear-gradient(145deg,#294b79,#101d38)!important;
    box-shadow:0 0 7px #168bff45!important;box-sizing:border-box!important;
  }
  html.arena-home-fixed #arenaHubHome .ar-avatar:before,
  html.arena-home-fixed #arenaHubHome .ar-avatar:after{content:none!important;display:none!important}
  html.arena-home-fixed #arenaHubHome .ar-avatar img{
    display:block!important;position:absolute!important;inset:0!important;width:100%!important;height:100%!important;
    object-fit:cover!important;object-position:center!important;border-radius:50%!important;
  }
  html.arena-home-fixed #arenaHubHome .ar-guest-avatar{position:absolute!important;inset:0!important;display:grid!important;place-items:center!important;width:100%!important;height:100%!important;font-size:24px!important;border-radius:50%!important}
  html.arena-home-fixed #arenaHubHome .ar-player{min-width:0!important}
  html.arena-home-fixed #arenaHubHome .ar-player-name{font-size:clamp(11px,3.4vw,14px)!important;line-height:1.1!important}
  html.arena-home-fixed #arenaHubHome .ar-level-line{display:flex!important;flex-wrap:nowrap!important;gap:4px!important;margin-top:3px!important}
  html.arena-home-fixed #arenaHubHome .ar-level-pill{padding:3px 6px!important;font-size:9px!important}
  html.arena-home-fixed #arenaHubHome .ar-xp{font-size:8px!important;white-space:nowrap!important}
  html.arena-home-fixed #arenaHubHome .ar-xpbar{height:4px!important;margin-top:3px!important}
  html.arena-home-fixed #arenaHubHome .ar-login-state{min-height:17px!important;margin-top:3px!important;padding:2px 6px!important;font-size:8px!important;border-radius:7px!important}
  html.arena-home-fixed #arenaHubHome .ar-league{display:grid!important;place-items:center!important;width:42px!important;height:44px!important;min-width:42px!important;overflow:hidden!important}
  html.arena-home-fixed #arenaHubHome .ar-league img{display:block!important;width:42px!important;height:42px!important;object-fit:contain!important}
  html.arena-home-fixed #arenaHubHome .ar-wallet{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:3px!important;min-width:0!important}
  html.arena-home-fixed #arenaHubHome .ar-wallet-row{height:22px!important;min-height:22px!important;padding:2px 4px!important;font-size:9px!important;border-radius:8px!important;gap:2px!important}
  html.arena-home-fixed #arenaHubHome .ar-wallet-row b{font-size:12px!important}
  html.arena-home-fixed #arenaHubHome .ar-shortcuts{
    display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;
    gap:4px!important;width:100%!important;height:47px!important;min-height:47px!important;margin:0!important;
  }
  html.arena-home-fixed #arenaHubHome .ar-short{
    display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:center!important;
    width:100%!important;height:47px!important;min-height:47px!important;padding:3px 1px!important;
    gap:2px!important;border-radius:11px!important;font-size:clamp(7px,2.25vw,9px)!important;line-height:1.05!important;
  }
  html.arena-home-fixed #arenaHubHome .ar-short i{font-size:19px!important;line-height:1!important}
  html.arena-home-fixed #arenaHubHome .ar-categories{
    display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;
    grid-template-rows:repeat(4,minmax(50px,1fr))!important;align-content:stretch!important;
    gap:5px!important;width:100%!important;height:100%!important;min-height:0!important;margin:0!important;
  }
  html.arena-home-fixed #arenaHubHome .ar-cat{
    display:grid!important;grid-template-columns:clamp(42px,13vw,54px) minmax(0,1fr) 16px!important;
    align-items:center!important;gap:3px!important;width:100%!important;height:100%!important;min-height:0!important;
    max-height:none!important;padding:4px 5px!important;border-radius:13px!important;box-sizing:border-box!important;
  }
  html.arena-home-fixed #arenaHubHome .ar-cat-icon{
    display:block!important;width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;
    font-size:0!important;background-size:600% 300%!important;background-repeat:no-repeat!important;
  }
  html.arena-home-fixed #arenaHubHome .ar-cat-copy{display:block!important;min-width:0!important}
  html.arena-home-fixed #arenaHubHome .ar-cat-copy strong{font-size:clamp(10px,3.35vw,14px)!important;line-height:1.08!important;overflow-wrap:anywhere!important}
  html.arena-home-fixed #arenaHubHome .ar-cat-copy small{font-size:clamp(8px,2.5vw,10px)!important;line-height:1.05!important;margin-top:3px!important;white-space:normal!important}
  html.arena-home-fixed #arenaHubHome .ar-cat-arrow{width:16px!important;height:16px!important;font-size:15px!important}
  html.arena-home-fixed #arenaHubHome .ar-daily{
    display:grid!important;grid-template-columns:37px minmax(0,1fr) auto!important;align-items:center!important;
    width:100%!important;height:45px!important;min-height:45px!important;margin:0!important;padding:4px 6px!important;
    gap:4px!important;border-radius:12px!important;box-sizing:border-box!important;
  }
  html.arena-home-fixed #arenaHubHome .ar-daily-target{font-size:27px!important}
  html.arena-home-fixed #arenaHubHome .ar-daily-copy strong{font-size:11px!important}
  html.arena-home-fixed #arenaHubHome .ar-daily-copy small{font-size:8px!important;margin-top:1px!important}
  html.arena-home-fixed #arenaHubHome .ar-progress{height:4px!important;margin-top:3px!important}
  html.arena-home-fixed #arenaHubHome .ar-daily-reward{padding:4px 6px!important;font-size:10px!important;border-radius:8px!important}
  html.arena-home-fixed #arenaHubHome .ar-section-title{
    display:flex!important;align-items:center!important;justify-content:space-between!important;
    min-height:18px!important;margin:0 2px!important;font-size:13px!important;line-height:1.1!important;
  }
  html.arena-home-fixed #arenaHubHome .ar-section-title small{font-size:8px!important}
  html.arena-home-fixed #arenaHubHome .ar-featured{
    display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;align-items:start!important;
    width:100%!important;min-height:0!important;gap:4px!important;margin:0!important;padding:0!important;
    overflow:hidden!important;
  }
  html.arena-home-fixed #arenaHubHome .ar-feature{
    display:block!important;min-width:0!important;min-height:0!important;padding:0!important;
    font-size:clamp(7px,2.2vw,9px)!important;line-height:1.05!important;overflow:hidden!important;
  }
  html.arena-home-fixed #arenaHubHome .ar-feature i{
    display:grid!important;place-items:center!important;width:100%!important;height:clamp(34px,5.5vh,46px)!important;
    margin:0 0 3px!important;border-radius:10px!important;font-size:clamp(18px,5vw,24px)!important;
    border:1px solid #5876b4!important;box-shadow:0 3px 8px #0007!important;
  }
  html.arena-home-fixed #arenaNeonNav{
    position:fixed!important;left:6px!important;right:6px!important;bottom:calc(3px + env(safe-area-inset-bottom))!important;
    height:64px!important;min-height:64px!important;padding:3px 2px!important;gap:1px!important;
    border-radius:17px!important;box-sizing:border-box!important;
  }
  html.arena-home-fixed #arenaNeonNav button{
    height:56px!important;min-height:56px!important;padding:2px 0!important;gap:2px!important;
    font-size:clamp(7px,2.2vw,9px)!important;line-height:1!important;
  }
  html.arena-home-fixed #arenaNeonNav button i{font-size:21px!important}
  body>h1 .ar-header-update{
    position:absolute!important;left:calc(12% + 7px)!important;
    top:calc(env(safe-area-inset-top) + (var(--bas-yuk,58px) - 29px)/2)!important;
    z-index:53!important;display:grid!important;place-items:center!important;
    width:28px!important;height:28px!important;min-height:28px!important;padding:0!important;
    border:1px solid #4a8ac7!important;border-radius:9px!important;
    background:linear-gradient(145deg,#173b68,#08182f)!important;color:#e7f6ff!important;
    box-shadow:0 2px 8px #0008,inset 0 1px #ffffff28!important;
    font:900 20px/1 system-ui,sans-serif!important;
  }
  body>h1 .ar-header-update:active{transform:scale(.93)!important;background:#1d5790!important}
  @media(max-height:720px){
    html.arena-home-fixed #arenaHubHome{gap:3px!important;padding-top:2px!important}
    html.arena-home-fixed #arenaHubHome .ar-profile{min-height:48px!important;padding:2px 5px!important}
    html.arena-home-fixed #arenaHubHome .ar-avatar{width:38px!important;height:38px!important;min-width:38px!important;max-width:38px!important;min-height:38px!important}
    html.arena-home-fixed #arenaHubHome .ar-shortcuts,
    html.arena-home-fixed #arenaHubHome .ar-short{height:42px!important;min-height:42px!important}
    html.arena-home-fixed #arenaHubHome .ar-short i{font-size:17px!important}
    html.arena-home-fixed #arenaHubHome .ar-categories{grid-template-rows:repeat(4,minmax(43px,1fr))!important;gap:4px!important}
    html.arena-home-fixed #arenaHubHome .ar-daily{height:41px!important;min-height:41px!important}
    html.arena-home-fixed #arenaHubHome .ar-feature i{height:34px!important}
    html.arena-home-fixed #arenaNeonNav{height:58px!important;min-height:58px!important}
    html.arena-home-fixed #arenaNeonNav button{height:50px!important;min-height:50px!important}
  }
  @media(max-width:350px){
    html.arena-home-fixed #arenaHubHome .ar-profile{grid-template-columns:40px minmax(0,1fr) 36px 68px!important;gap:3px!important}
    html.arena-home-fixed #arenaHubHome .ar-avatar{width:38px!important;height:38px!important;min-width:38px!important;max-width:38px!important}
    html.arena-home-fixed #arenaHubHome .ar-league,
    html.arena-home-fixed #arenaHubHome .ar-league img{width:36px!important;height:38px!important;min-width:36px!important}
    html.arena-home-fixed #arenaHubHome .ar-wallet-row{font-size:8px!important}
    html.arena-home-fixed #arenaHubHome .ar-wallet-row b{font-size:11px!important}
    html.arena-home-fixed #arenaHubHome .ar-cat{grid-template-columns:38px minmax(0,1fr) 14px!important;padding:3px!important}
    html.arena-home-fixed #arenaHubHome .ar-cat-copy strong{font-size:10px!important}
  }
  `;
  document.head.appendChild(fixedHome);
})();


/* Home viewport fill + remove stray gold arc */
(function(){
  const s=document.createElement('style');
  s.id='arenaHomeViewportBalance';
  s.textContent=`
  html.arena-home-fixed body{
    position:fixed!important;inset:0!important;width:100%!important;height:100dvh!important;
    min-height:0!important;overflow:hidden!important;box-sizing:border-box!important;
    padding:0!important;margin:0!important;
  }
  html.arena-home-fixed #ana{
    position:fixed!important;
    top:calc(var(--bas-yuk,58px) + env(safe-area-inset-top))!important;
    bottom:calc(70px + env(safe-area-inset-bottom))!important;
    left:0!important;right:0!important;width:100%!important;height:auto!important;
    min-height:0!important;max-height:none!important;overflow:hidden!important;
    margin:0 auto!important;padding:4px 7px 5px!important;box-sizing:border-box!important;
  }
  html.arena-home-fixed #arenaHubHome{
    display:grid!important;
    grid-template-rows:auto auto minmax(0,1fr) auto auto minmax(94px,.62fr)!important;
    grid-template-columns:minmax(0,1fr)!important;
    align-content:stretch!important;align-items:stretch!important;justify-content:stretch!important;
    width:100%!important;height:100%!important;min-height:0!important;max-height:100%!important;
    gap:clamp(3px,.55vh,6px)!important;padding:0!important;margin:0!important;overflow:hidden!important;
  }
  html.arena-home-fixed #arenaHubHome .ar-profile,
  html.arena-home-fixed #arenaHubHome .ar-profile::before,
  html.arena-home-fixed #arenaHubHome .ar-profile::after{
    transform:none!important;animation:none!important;
  }
  html.arena-home-fixed #arenaHubHome .ar-profile::before,
  html.arena-home-fixed #arenaHubHome .ar-profile::after{content:none!important;display:none!important}
  html.arena-home-fixed #arenaHubHome .ar-avatar{
    width:42px!important;height:42px!important;min-width:42px!important;max-width:42px!important;
    min-height:42px!important;max-height:42px!important;position:relative!important;
    inset:auto!important;transform:none!important;overflow:hidden!important;
    border:1px solid #547eaa!important;border-radius:50%!important;
    background:linear-gradient(145deg,#294b79,#101d38)!important;
    box-shadow:0 0 7px #168bff45!important;
  }
  html.arena-home-fixed #arenaHubHome .ar-avatar::before,
  html.arena-home-fixed #arenaHubHome .ar-avatar::after{content:none!important;display:none!important}
  html.arena-home-fixed #arenaHubHome .ar-featured{
    display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;
    grid-template-rows:minmax(0,1fr)!important;align-items:stretch!important;align-content:stretch!important;
    justify-items:stretch!important;align-self:stretch!important;
    width:100%!important;height:100%!important;min-height:94px!important;max-height:none!important;
    gap:5px!important;margin:0!important;padding:0 0 2px!important;overflow:hidden!important;
  }
  html.arena-home-fixed #arenaHubHome .ar-feature{
    display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important;
    min-width:0!important;min-height:0!important;height:100%!important;overflow:hidden!important;
    padding:0!important;font-size:clamp(8px,2.3vw,10px)!important;line-height:1.08!important;
  }
  html.arena-home-fixed #arenaHubHome .ar-feature i{
    display:grid!important;place-items:center!important;flex:1 1 auto!important;
    width:100%!important;height:auto!important;min-height:68px!important;max-height:none!important;
    margin:0 0 4px!important;border-radius:12px!important;font-size:clamp(20px,5vw,28px)!important;
    background:linear-gradient(145deg,#193d73,#251343)!important;
    border:1px solid #5876b4!important;box-shadow:0 4px 10px #0007!important;
  }
  html.arena-home-fixed #arenaHubHome .ar-feature br{display:none!important}
  @media(max-height:760px){
    html.arena-home-fixed #arenaHubHome{
      grid-template-rows:auto auto minmax(0,1fr) auto auto minmax(82px,.48fr)!important;
    }
    html.arena-home-fixed #arenaHubHome .ar-feature i{min-height:58px!important}
  }
  @media(max-width:350px){
    html.arena-home-fixed #arenaHubHome .ar-feature{font-size:7px!important}
    html.arena-home-fixed #arenaHubHome .ar-feature i{min-height:54px!important}
  }
  `;
  document.head.appendChild(s);
})();


/* Increase category card height by reallocating home viewport space */
(function(){
 const s=document.createElement('style');
 s.id='arenaCategoryHeightBoost';
 s.textContent=`
 html.arena-home-fixed #arenaHubHome{
   grid-template-rows:auto auto minmax(0,1fr) auto auto minmax(76px,.34fr)!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-categories{
   grid-template-rows:repeat(4,minmax(58px,1fr))!important;
   gap:6px!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-cat{
   min-height:0!important;
   padding:6px 7px!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-cat-icon{
   min-height:0!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-featured{
   min-height:76px!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-feature i{
   min-height:50px!important;
 }
 @media(max-height:760px){
   html.arena-home-fixed #arenaHubHome{
     grid-template-rows:auto auto minmax(0,1fr) auto auto minmax(68px,.25fr)!important;
   }
   html.arena-home-fixed #arenaHubHome .ar-categories{
     grid-template-rows:repeat(4,minmax(54px,1fr))!important;
   }
   html.arena-home-fixed #arenaHubHome .ar-feature i{min-height:44px!important}
 }
 `;
 document.head.appendChild(s);
})();


/* Reference-balanced home composition: equal columns, full cards, visible featured row */
(function(){
 const s=document.createElement('style');
 s.id='arenaReferenceSymmetry';
 s.textContent=`
 html.arena-home-fixed #ana{
   top:calc(var(--bas-yuk,58px) + env(safe-area-inset-top))!important;
   bottom:calc(76px + env(safe-area-inset-bottom))!important;
   padding:6px 7px 5px!important;
 }
 html.arena-home-fixed #arenaHubHome{
   display:grid!important;
   grid-template-columns:minmax(0,1fr)!important;
   grid-template-rows:clamp(76px,9vh,94px) clamp(66px,8vh,82px) minmax(0,1fr) clamp(62px,8vh,78px) 25px clamp(100px,14vh,132px)!important;
   align-content:stretch!important;align-items:stretch!important;justify-content:stretch!important;
   gap:clamp(5px,.7vh,8px)!important;
   width:100%!important;height:100%!important;min-height:0!important;max-height:100%!important;
   margin:0!important;padding:0!important;overflow:hidden!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-profile{
   grid-template-columns:clamp(54px,13vw,72px) minmax(0,1fr) clamp(48px,12vw,64px) clamp(88px,23vw,116px)!important;
   gap:clamp(4px,1vw,8px)!important;width:100%!important;height:100%!important;min-height:0!important;
   margin:0!important;padding:5px 8px!important;box-sizing:border-box!important;overflow:hidden!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-avatar{
   width:clamp(50px,12vw,66px)!important;height:clamp(50px,12vw,66px)!important;
   min-width:0!important;min-height:0!important;max-width:none!important;max-height:none!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-player-name{font-size:clamp(13px,3.6vw,18px)!important}
 html.arena-home-fixed #arenaHubHome .ar-level-pill{font-size:clamp(9px,2.5vw,12px)!important}
 html.arena-home-fixed #arenaHubHome .ar-xp{font-size:clamp(8px,2.3vw,11px)!important}
 html.arena-home-fixed #arenaHubHome .ar-league,
 html.arena-home-fixed #arenaHubHome .ar-league img{width:100%!important;height:100%!important;max-width:64px!important;max-height:68px!important}
 html.arena-home-fixed #arenaHubHome .ar-wallet{gap:4px!important}
 html.arena-home-fixed #arenaHubHome .ar-wallet-row{height:clamp(26px,4vh,36px)!important;min-height:0!important;font-size:clamp(10px,2.8vw,14px)!important}
 html.arena-home-fixed #arenaHubHome .ar-wallet-row b{font-size:clamp(13px,3.8vw,19px)!important}
 html.arena-home-fixed #arenaHubHome .ar-shortcuts{
   grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:clamp(4px,1vw,8px)!important;
   height:100%!important;min-height:0!important;margin:0!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-short{
   width:100%!important;height:100%!important;min-height:0!important;padding:4px 2px!important;
   gap:3px!important;border-radius:14px!important;font-size:clamp(8px,2.5vw,11px)!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-short i{font-size:clamp(20px,5vw,29px)!important}
 html.arena-home-fixed #arenaHubHome .ar-categories{
   grid-template-columns:repeat(2,minmax(0,1fr))!important;
   grid-template-rows:repeat(4,minmax(0,1fr))!important;
   align-content:stretch!important;align-items:stretch!important;
   gap:clamp(7px,1.2vh,11px)!important;
   width:100%!important;height:100%!important;min-height:0!important;margin:0!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-cat{
   grid-template-columns:clamp(52px,15vw,82px) minmax(0,1fr) clamp(18px,5vw,28px)!important;
   width:100%!important;height:100%!important;min-height:0!important;max-height:none!important;
   gap:clamp(4px,1vw,8px)!important;padding:6px clamp(6px,1.5vw,12px)!important;
   border-radius:clamp(14px,3vw,21px)!important;box-sizing:border-box!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-cat-icon{
   width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;
   background-size:600% 300%!important;background-repeat:no-repeat!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-cat-copy{min-width:0!important}
 html.arena-home-fixed #arenaHubHome .ar-cat-copy strong{
   display:block!important;font-size:clamp(12px,3.6vw,19px)!important;
   line-height:1.1!important;overflow-wrap:anywhere!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-cat-copy small{
   display:block!important;font-size:clamp(9px,2.7vw,13px)!important;
   line-height:1.12!important;margin-top:4px!important;white-space:normal!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-cat-arrow{
   width:clamp(18px,5vw,28px)!important;height:clamp(18px,5vw,28px)!important;
   font-size:clamp(16px,4vw,23px)!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-daily{
   grid-template-columns:clamp(40px,10vw,66px) minmax(0,1fr) auto!important;
   width:100%!important;height:100%!important;min-height:0!important;margin:0!important;
   padding:5px clamp(7px,1.5vw,12px)!important;gap:6px!important;box-sizing:border-box!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-daily-target{font-size:clamp(28px,7vw,46px)!important}
 html.arena-home-fixed #arenaHubHome .ar-daily-copy strong{font-size:clamp(11px,3.3vw,17px)!important}
 html.arena-home-fixed #arenaHubHome .ar-daily-copy small{font-size:clamp(8px,2.5vw,12px)!important}
 html.arena-home-fixed #arenaHubHome .ar-daily-reward{font-size:clamp(10px,3vw,15px)!important;padding:5px 8px!important}
 html.arena-home-fixed #arenaHubHome .ar-section-title{
   display:flex!important;align-items:center!important;justify-content:space-between!important;
   min-height:0!important;height:100%!important;margin:0 3px!important;font-size:clamp(14px,4vw,19px)!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-section-title small{font-size:clamp(8px,2.5vw,11px)!important}
 html.arena-home-fixed #arenaHubHome .ar-featured{
   display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;
   grid-template-rows:minmax(0,1fr)!important;align-items:stretch!important;
   width:100%!important;height:100%!important;min-height:0!important;max-height:none!important;
   gap:clamp(4px,1vw,8px)!important;margin:0!important;padding:0 0 2px!important;overflow:hidden!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-feature{
   display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important;
   min-width:0!important;min-height:0!important;height:100%!important;padding:0!important;
   font-size:clamp(8px,2.4vw,11px)!important;line-height:1.08!important;overflow:hidden!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-feature i{
   display:grid!important;place-items:center!important;flex:1 1 auto!important;
   width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;
   margin:0 0 4px!important;border-radius:clamp(10px,2.5vw,16px)!important;
   font-size:clamp(20px,5.5vw,31px)!important;background-size:cover!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-feature br{display:none!important}
 @media(max-height:760px){
   html.arena-home-fixed #arenaHubHome{
     grid-template-rows:68px 60px minmax(0,1fr) 56px 22px 92px!important;
     gap:4px!important;
   }
   html.arena-home-fixed #arenaHubHome .ar-categories{gap:5px!important}
   html.arena-home-fixed #arenaHubHome .ar-cat-copy strong{font-size:clamp(11px,3.2vw,16px)!important}
   html.arena-home-fixed #arenaHubHome .ar-feature{font-size:8px!important}
 }
 @media(max-width:360px){
   html.arena-home-fixed #arenaHubHome .ar-cat{
     grid-template-columns:42px minmax(0,1fr) 17px!important;padding:4px!important;
   }
 }
 `;
 document.head.appendChild(s);
})();


/* Give the eight category buttons more vertical room */
(function(){
 const s=document.createElement('style');
 s.id='arenaCategoryHeightFinal';
 s.textContent=`
 html.arena-home-fixed #arenaHubHome{
   grid-template-rows:
     clamp(72px,8.5vh,88px)
     clamp(56px,6.5vh,70px)
     minmax(0,1fr)
     clamp(52px,6.2vh,64px)
     22px
     clamp(76px,10vh,96px)!important;
   gap:clamp(4px,.55vh,6px)!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-categories{
   grid-template-rows:repeat(4,minmax(0,1fr))!important;
   gap:clamp(7px,1vh,10px)!important;
   min-height:0!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-cat{
   height:100%!important;
   min-height:0!important;
   padding:7px clamp(7px,1.7vw,13px)!important;
 }
 @media(max-height:760px){
   html.arena-home-fixed #arenaHubHome{
     grid-template-rows:62px 52px minmax(0,1fr) 48px 20px 72px!important;
     gap:4px!important;
   }
   html.arena-home-fixed #arenaHubHome .ar-categories{
     grid-template-rows:repeat(4,minmax(0,1fr))!important;
     gap:5px!important;
   }
 }
 `;
 document.head.appendChild(s);
})();


/* Further vertical emphasis on category tiles; keep all other home sections visible */
(function(){
 const s=document.createElement('style');
 s.id='arenaCategoryHeightNext';
 s.textContent=`
 html.arena-home-fixed #arenaHubHome{
   grid-template-rows:
     clamp(66px,7.8vh,80px)
     clamp(50px,5.8vh,62px)
     minmax(0,1fr)
     clamp(48px,5.8vh,58px)
     20px
     clamp(68px,8.5vh,82px)!important;
   gap:clamp(4px,.5vh,6px)!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-categories{
   grid-template-rows:repeat(4,minmax(0,1fr))!important;
   gap:clamp(6px,.9vh,9px)!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-cat{
   min-height:0!important;height:100%!important;
   padding:7px clamp(7px,1.7vw,13px)!important;
 }
 @media(max-height:760px){
   html.arena-home-fixed #arenaHubHome{
     grid-template-rows:58px 48px minmax(0,1fr) 44px 18px 64px!important;
     gap:4px!important;
   }
   html.arena-home-fixed #arenaHubHome .ar-categories{
     grid-template-rows:repeat(4,minmax(0,1fr))!important;
     gap:5px!important;
   }
 }
 `;
 document.head.appendChild(s);
})();


/* Correct seven direct home rows: the category grid is row 4, not row 3.
   Earlier six-row templates left categories in an implicit auto row, so height changes had no effect. */
(function(){
 const s=document.createElement('style');
 s.id='arenaCategoryGridRowFix';
 s.textContent=`
 html.arena-home-fixed #arenaHubHome{
   display:grid!important;
   grid-template-columns:minmax(0,1fr)!important;
   grid-template-rows:
     auto
     clamp(66px,8vh,76px)
     clamp(54px,6.5vh,62px)
     minmax(0,1fr)
     clamp(52px,6.2vh,60px)
     24px
     clamp(72px,9vh,84px)!important;
   align-content:stretch!important;
   align-items:stretch!important;
   gap:clamp(4px,.55vh,6px)!important;
   height:100%!important;min-height:0!important;max-height:100%!important;
   overflow:hidden!important;
 }
 html.arena-home-fixed #arenaHubHome>.ar-top,
 html.arena-home-fixed #arenaHubHome>.ar-profile,
 html.arena-home-fixed #arenaHubHome>.ar-shortcuts,
 html.arena-home-fixed #arenaHubHome>.ar-categories,
 html.arena-home-fixed #arenaHubHome>.ar-daily,
 html.arena-home-fixed #arenaHubHome>.ar-section-title,
 html.arena-home-fixed #arenaHubHome>.ar-featured{
   min-height:0!important;max-height:100%!important;margin-top:0!important;margin-bottom:0!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-categories{
   display:grid!important;
   grid-template-columns:repeat(2,minmax(0,1fr))!important;
   grid-template-rows:repeat(4,minmax(0,1fr))!important;
   align-content:stretch!important;align-items:stretch!important;
   width:100%!important;height:100%!important;min-height:0!important;
   gap:clamp(6px,.8vh,9px)!important;overflow:hidden!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-cat{
   display:grid!important;width:100%!important;height:100%!important;
   min-height:0!important;max-height:none!important;
   grid-template-columns:clamp(48px,14vw,70px) minmax(0,1fr) 22px!important;
   align-items:center!important;gap:clamp(4px,1vw,7px)!important;
   padding:6px clamp(6px,1.5vw,10px)!important;box-sizing:border-box!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-cat-icon{
   width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;
   background-size:600% 300%!important;background-repeat:no-repeat!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-cat-copy strong{
   font-size:clamp(12px,3.5vw,17px)!important;line-height:1.08!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-cat-copy small{
   font-size:clamp(9px,2.6vw,12px)!important;line-height:1.1!important;margin-top:4px!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-daily{
   height:100%!important;min-height:0!important;margin:0!important;padding:4px 7px!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-section-title{
   height:100%!important;min-height:0!important;margin:0 3px!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-featured{
   display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;
   grid-template-rows:minmax(0,1fr)!important;width:100%!important;height:100%!important;
   min-height:0!important;max-height:100%!important;overflow:hidden!important;margin:0!important;padding:0 0 2px!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-feature{height:100%!important;min-height:0!important;overflow:hidden!important}
 html.arena-home-fixed #arenaHubHome .ar-feature i{height:auto!important;min-height:0!important;flex:1 1 auto!important}
 @media(max-height:760px){
   html.arena-home-fixed #arenaHubHome{
     grid-template-rows:auto 60px 50px minmax(0,1fr) 48px 21px 68px!important;
     gap:4px!important;
   }
   html.arena-home-fixed #arenaHubHome .ar-categories{gap:5px!important}
 }
 `;
 document.head.appendChild(s);
})();


(function(){
 const s=document.createElement('style');
 s.id='arenaHomeExplicitGridRows';
 s.textContent=`
 html.arena-home-fixed #ana{
   position:fixed!important;top:calc(var(--bas-yuk,58px) + env(safe-area-inset-top))!important;
   bottom:calc(70px + env(safe-area-inset-bottom))!important;left:0!important;right:0!important;
   width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;
   overflow:hidden!important;margin:0 auto!important;padding:5px 7px 4px!important;box-sizing:border-box!important;
 }
 html.arena-home-fixed #arenaHubHome{
   display:grid!important;grid-template-columns:minmax(0,1fr)!important;
   grid-template-rows:auto auto clamp(58px,8vh,76px) minmax(0,1fr) 72px 26px clamp(94px,13vh,116px)!important;
   align-content:stretch!important;align-items:stretch!important;justify-content:stretch!important;
   width:100%!important;height:100%!important;min-height:0!important;max-height:100%!important;
   gap:clamp(4px,.65vh,7px)!important;margin:0!important;padding:0!important;overflow:hidden!important;
 }
 html.arena-home-fixed #arenaHubHome>.ar-top{grid-row:1!important;min-height:0!important;margin:0!important}
 html.arena-home-fixed #arenaHubHome>.ar-profile{
   grid-row:2!important;align-self:stretch!important;height:100%!important;min-height:0!important;margin:0!important;box-sizing:border-box!important;
 }
 html.arena-home-fixed #arenaHubHome>.ar-shortcuts{
   grid-row:3!important;align-self:stretch!important;height:100%!important;min-height:0!important;margin:0!important;
 }
 html.arena-home-fixed #arenaHubHome>.ar-categories{
   grid-row:4!important;align-self:stretch!important;display:grid!important;
   grid-template-columns:repeat(2,minmax(0,1fr))!important;grid-template-rows:repeat(4,minmax(0,1fr))!important;
   width:100%!important;height:100%!important;min-height:0!important;gap:clamp(6px,.9vh,9px)!important;
   margin:0!important;padding:0!important;overflow:hidden!important;
 }
 html.arena-home-fixed #arenaHubHome>.ar-categories>.ar-cat{
   display:grid!important;align-self:stretch!important;width:100%!important;height:100%!important;
   min-height:0!important;max-height:none!important;
   grid-template-columns:clamp(46px,13vw,66px) minmax(0,1fr) 20px!important;
   align-items:center!important;gap:clamp(4px,1vw,7px)!important;
   padding:6px clamp(6px,1.5vw,10px)!important;box-sizing:border-box!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-cat-icon{
   width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;
   background-size:600% 300%!important;background-repeat:no-repeat!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-cat-copy{min-width:0!important}
 html.arena-home-fixed #arenaHubHome .ar-cat-copy strong{font-size:clamp(12px,3.5vw,17px)!important;line-height:1.08!important}
 html.arena-home-fixed #arenaHubHome .ar-cat-copy small{margin-top:4px!important;font-size:clamp(9px,2.6vw,12px)!important;line-height:1.1!important}
 html.arena-home-fixed #arenaHubHome>.ar-daily{
   grid-row:5!important;align-self:center!important;display:grid!important;width:100%!important;
   height:72px!important;min-height:72px!important;max-height:72px!important;
   margin:0!important;padding:5px 8px!important;box-sizing:border-box!important;overflow:hidden!important;
 }
 html.arena-home-fixed #arenaHubHome>.ar-section-title{
   grid-row:6!important;align-self:stretch!important;display:flex!important;height:100%!important;min-height:0!important;margin:0 3px!important;
 }
 html.arena-home-fixed #arenaHubHome>.ar-featured{
   grid-row:7!important;align-self:stretch!important;display:grid!important;
   grid-template-columns:repeat(6,minmax(0,1fr))!important;grid-template-rows:minmax(0,1fr)!important;
   width:100%!important;height:100%!important;min-height:0!important;max-height:100%!important;
   margin:0!important;padding:0 0 2px!important;gap:clamp(4px,1vw,7px)!important;overflow:hidden!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-feature{
   display:flex!important;flex-direction:column!important;justify-content:flex-start!important;
   height:100%!important;min-height:0!important;overflow:hidden!important;
 }
 html.arena-home-fixed #arenaHubHome .ar-feature i{flex:1 1 auto!important;height:auto!important;min-height:0!important;width:100%!important}
 @media(max-height:720px){
   html.arena-home-fixed #arenaHubHome{grid-template-rows:auto auto 52px minmax(0,1fr) 62px 22px 82px!important;gap:4px!important}
   html.arena-home-fixed #arenaHubHome>.ar-daily{height:62px!important;min-height:62px!important;max-height:62px!important}
   html.arena-home-fixed #arenaHubHome .ar-categories{gap:5px!important}
 }
 `;
 document.head.appendChild(s);
})();
