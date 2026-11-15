(function(){
"use strict";
var old=window.ArenaMiniOyunlar;
if(!old)return;
var games={carJam:{title:"Car Jam",desc:"Araçları kaydır, otobüse yol aç.",icon:"🚌"},matchTriple:{title:"Match Triple",desc:"Raflardaki ürünleri üçlü eşleştir.",icon:"🛍️"}};
var root=null,id="",state=null,level=1;
var palette=["#e84b45","#2698e8","#35bb82","#f2b83f","#a66be0","#f078b4","#e88a36","#27b9bb"];
var goods=["🥤","🧃","🥫","🧴","🧼","🧽","🍪","🍫","🧃","🧃","🧃","🧻","🪥","🧴","🧴","🧴","🥛","🧀","🍯","🍬","🍭","🧸","🪀","🧩"];
function style(){
 if(document.getElementById("arenaArcadeStyle"))return;
 var st=document.createElement("style");st.id="arenaArcadeStyle";st.textContent=`
 #arenaArcade{position:fixed;inset:0;z-index:100120;background:#10162a;color:#fff;display:flex;flex-direction:column;font-family:system-ui,sans-serif;overflow:hidden}
 #arenaArcade *{box-sizing:border-box}#arenaArcade .aa-top{height:58px;flex:none;display:flex;align-items:center;gap:10px;padding:7px 12px;background:#151d36;border-bottom:1px solid #ffffff18}
 #arenaArcade button{color:inherit;font:inherit;cursor:pointer}#arenaArcade .aa-back,#arenaArcade .aa-tool{border:1px solid #ffffff35;background:#263653;border-radius:13px;min-width:42px;height:42px;font-size:22px}
 #arenaArcade .aa-title{font-size:17px;font-weight:950;flex:1}#arenaArcade .aa-level{font-size:12px;color:#ffe08a;font-weight:900}
 #arenaArcade .aa-stats{display:flex;justify-content:center;gap:8px;padding:10px 8px;flex:none}.aa-stat{padding:7px 12px;border-radius:999px;background:#263653;border:1px solid #ffffff22;font-size:12px;font-weight:850}
 #arenaArcade .aa-main{flex:1;min-height:0;overflow:auto;padding:12px 12px calc(20px + env(safe-area-inset-bottom));display:flex;flex-direction:column;align-items:center;gap:12px}
 #arenaArcade .aa-note{font-size:13px;color:#c5d2ed;text-align:center;max-width:420px;line-height:1.4}
 #arenaArcade .aa-actions{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
 #arenaArcade .aa-btn{border:1px solid #7ba8f0;border-radius:14px;padding:11px 16px;background:linear-gradient(145deg,#397bd0,#214b93);font-weight:900;min-height:44px}
 #arenaArcade .aa-btn.alt{background:#263653;border-color:#62718f}.aa-btn:disabled{opacity:.35}
 #arenaArcade .jam-board{width:min(92vw,430px);aspect-ratio:1;display:grid;grid-template-columns:repeat(6,1fr);grid-template-rows:repeat(6,1fr);gap:4px;padding:7px;border:3px solid #a5b6d5;border-radius:18px;background:linear-gradient(145deg,#2b3854,#151f37);box-shadow:0 16px 36px #0008;position:relative}
 #arenaArcade .jam-cell{min-width:0;min-height:0;border-radius:8px;background:#ffffff0b;border:1px solid #ffffff09}
 #arenaArcade .jam-car{position:relative;border:2px solid #ffffff9c;border-radius:10px;box-shadow:inset 0 2px 5px #ffffff7a,inset 0 -7px 9px #0006,0 3px 6px #0007;display:flex;align-items:center;justify-content:center;overflow:hidden;font-size:clamp(15px,5vw,24px);text-shadow:0 2px 3px #0008}
 #arenaArcade .jam-car:before{content:"";position:absolute;inset:18% 22%;border-radius:7px;background:linear-gradient(135deg,#dff7ffbb,#377da877);border:1px solid #ffffff75}
 #arenaArcade .jam-car span{z-index:1;filter:drop-shadow(0 2px 2px #0008)}
 #arenaArcade .jam-car.sel{outline:3px solid #ffe16a;outline-offset:1px;filter:brightness(1.18)}
 #arenaArcade .jam-exit{position:absolute;right:-10px;top:calc((100% - 14px)/6 * 2 + 7px);height:calc((100% - 14px)/6 - 4px);width:12px;background:#ffcf4a;border-radius:0 7px 7px 0;box-shadow:0 0 12px #ffcf4a}
 #arenaArcade .jam-controls{display:grid;grid-template-columns:repeat(3,54px);gap:6px;justify-content:center}
 #arenaArcade .jam-controls button{height:48px;border-radius:13px;border:1px solid #657b9f;background:#273b60;font-size:23px;font-weight:900}
 #arenaArcade .jam-controls .empty{visibility:hidden}
 #arenaArcade .shelf{width:min(96vw,460px);padding:9px;border-radius:16px;background:linear-gradient(145deg,#9b6036,#5d321f);border:5px solid #d49a57;box-shadow:inset 0 0 0 2px #f4c78b,0 15px 28px #0008;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:5px}
 #arenaArcade .shelf-item{aspect-ratio:1;min-width:0;border:1px solid #ffffff55;border-radius:7px;background:linear-gradient(145deg,#fff2d6,#d9b98c);box-shadow:inset 0 -4px 5px #7b482333,0 2px 3px #0005;font-size:clamp(20px,6vw,31px);display:grid;place-items:center;position:relative}
 #arenaArcade .shelf-item:after{content:"";position:absolute;left:3px;right:3px;bottom:3px;height:3px;border-radius:3px;background:#9a673e66}
 #arenaArcade .shelf-item:disabled{opacity:0;pointer-events:none}
 #arenaArcade .tray{width:min(96vw,460px);min-height:65px;padding:7px;border:2px solid #91a5c9;border-radius:14px;background:#202c46;display:flex;align-items:center;justify-content:center;gap:6px}
 #arenaArcade .tray-item{width:42px;height:46px;border-radius:9px;background:#f3e1bd;color:#3a2a19;display:grid;place-items:center;font-size:26px;box-shadow:0 3px 4px #0006}
 #arenaArcade .tray-item.matched{animation:aaPop .25s ease-out both}
 #arenaArcade .aa-progress{width:min(92vw,430px);height:9px;border-radius:9px;background:#35425c;overflow:hidden}.aa-progress i{display:block;height:100%;background:linear-gradient(90deg,#58e3b0,#ffe16a);width:0}
 #arenaArcade .aa-win{position:absolute;inset:0;background:#07101ddd;display:grid;place-items:center;padding:24px;z-index:5}
 #arenaArcade .aa-win-card{width:min(90%,340px);padding:26px 20px;border:2px solid #ffd76b;border-radius:24px;background:linear-gradient(145deg,#243a62,#101a32);text-align:center;box-shadow:0 20px 70px #000b}
 #arenaArcade .aa-win-card strong{display:block;font-size:28px;color:#ffe17b;margin-bottom:10px}
 @keyframes aaPop{50%{transform:scale(1.18);filter:brightness(1.5)}}
 @media(max-height:700px){#arenaArcade .aa-main{gap:7px;padding-top:6px}.jam-board{width:min(76vh,88vw)!important}.aa-stats{padding:5px}}
 `;document.head.appendChild(st);
}
function shell(title,body){
 style();if(!root){root=document.createElement("div");root.id="arenaArcade";document.body.appendChild(root);root.addEventListener("click",click);}
 root.innerHTML='<header class="aa-top"><button class="aa-back" data-a="back">‹</button><div class="aa-title">'+title+'</div><span class="aa-level">LV '+level+'</span><button class="aa-tool" data-a="restart">↻</button></header>'+body;
}
function carSeed(lv){
 var sets=[
 [{id:"you",r:2,c:0,n:2,d:"h",target:1},{id:"a",r:0,c:2,n:2,d:"v"},{id:"b",r:0,c:4,n:3,d:"v"},{id:"c",r:0,c:0,n:2,d:"h"},{id:"d",r:1,c:0,n:2,d:"h"},{id:"e",r:3,c:0,n:3,d:"h"},{id:"f",r:4,c:0,n:2,d:"v"},{id:"g",r:4,c:2,n:2,d:"h"},{id:"h",r:3,c:5,n:2,d:"v"},{id:"i",r:5,c:3,n:2,d:"h"}],
 [{id:"you",r:2,c:0,n:2,d:"h",target:1},{id:"a",r:0,c:1,n:3,d:"v"},{id:"b",r:0,c:3,n:2,d:"v"},{id:"c",r:1,c:4,n:2,d:"h"},{id:"d",r:3,c:0,n:2,d:"h"},{id:"e",r:4,c:2,n:2,d:"v"},{id:"f",r:5,c:0,n:3,d:"h"},{id:"g",r:0,c:5,n:3,d:"v"},{id:"h",r:3,c:3,n:2,d:"h"},{id:"i",r:4,c:4,n:2,d:"h"}]
 ];
 return JSON.parse(JSON.stringify(sets[(lv-1)%sets.length]));
}
function jamOcc(skip){var o=Array.from({length:6},()=>Array(6).fill(null));state.cars.forEach(v=>{if(v.id===skip||v.out)return;for(var k=0;k<v.n;k++){var r=v.r+(v.d==="v"?k:0),c=v.c+(v.d==="h"?k:0);if(r>=0&&r<6&&c>=0&&c<6)o[r][c]=v.id;}});return o;}
function jamHtml(){
 var occ=jamOcc(),h='<div class="aa-stats"><span class="aa-stat">🚗 '+state.moves+' hamle</span><span class="aa-stat">Hedef: kırmızı aracı çıkar</span></div><main class="aa-main"><div class="aa-note">Araçları kendi yönlerinde kaydır. Kırmızı aracın önünü açıp sağ çıkıştan çıkar.</div><div class="jam-board">';
 for(var r=0;r<6;r++)for(var c=0;c<6;c++)h+='<div class="jam-cell" style="grid-area:'+(r+1)+'/'+(c+1)+'"></div>';
 state.cars.forEach(v=>{if(v.out)return;var color=v.target?"#e83e4b":palette[(v.id.charCodeAt(0)+level)%palette.length],ico=v.target?"🚗":v.n===3?"🚌":"🚙";h+='<button class="jam-car '+(state.sel===v.id?'sel':'')+'" data-a="car" data-id="'+v.id+'" style="grid-row:'+(v.r+1)+' / span '+(v.d==="v"?v.n:1)+';grid-column:'+(v.c+1)+' / span '+(v.d==="h"?v.n:1)+';background:'+color+'"><span>'+ico+'</span></button>';});
 h+='<div class="jam-exit"></div></div><div class="aa-note">'+(state.sel?"Seçili araç: "+state.sel+" · Oklarla hareket ettir":"Hareket ettirmek istediğin araca dokun.")+'</div><div class="jam-controls"><button class="empty"> </button><button data-a="up">↑</button><button class="empty"> </button><button data-a="left">←</button><button data-a="down">↓</button><button data-a="right">→</button></div><div class="aa-actions"><button class="aa-btn alt" data-a="restart">Yeniden başlat</button><button class="aa-btn" data-a="hint">İpucu</button></div></main>';
 if(state.won)h+='<div class="aa-win"><div class="aa-win-card"><strong>🏆 Harika!</strong>Otobüs yolunu buldu.<p>'+state.moves+' hamlede tamamladın.</p><button class="aa-btn" data-a="next">Sonraki bölüm →</button></div></div>';
 return h;
}
function jamInit(){state={cars:carSeed(level),sel:"you",moves:0,won:false};}
function jamMove(dir){
 var v=state.cars.find(x=>x.id===state.sel);if(!v||state.won)return;
 if((v.d==="h"&&(dir==="up"||dir==="down"))||(v.d==="v"&&(dir==="left"||dir==="right")))return;
 var delta=(dir==="left"||dir==="up")?-1:1,occ=jamOcc(v.id);
 if(v.d==="h"){
  if(delta<0){var nc=v.c-1;if(nc>=0&&!occ[v.r][nc]){v.c=nc;state.moves++;}}
  else{var nc=v.c+v.n;if(nc<6){if(!occ[v.r][nc]){v.c++;state.moves++;}}else if(v.target){v.out=true;state.moves++;state.won=true;}}
 }else{
  if(delta<0){var nr=v.r-1;if(nr>=0&&!occ[nr][v.c]){v.r=nr;state.moves++;}}
  else{var nr=v.r+v.n;if(nr<6&&!occ[nr][v.c]){v.r++;state.moves++;}}
 }
}
function jamClick(a,b){
 if(a==="car"){state.sel=b.dataset.id;return;}
 if(a==="up"||a==="down"||a==="left"||a==="right"){jamMove(a);return;}
 if(a==="hint"){var target=state.cars.find(x=>x.target),occ=jamOcc(target.id),block=[];for(var c=target.c+target.n;c<6;c++)if(occ[target.r][c])block.push(occ[target.r][c]);if(block.length)state.sel=block[0];return;}
 if(a==="next"&&state.won){level++;localStorage.setItem("arenaCarJamLevel",String(level));jamInit();}
}
function triplePool(lv){var kinds=6+Math.min(6,Math.floor((lv-1)/2)),arr=[];for(var i=0;i<kinds;i++){var g=goods[(i+(lv-1)*3)%goods.length];for(var n=0;n<3;n++)arr.push(g);}for(var j=arr.length-1;j>0;j--){var k=Math.floor(Math.random()*(j+1));[arr[j],arr[k]]=[arr[k],arr[j]];}return arr;}
function tripleInit(){var pool=triplePool(level);state={items:pool.map((g,i)=>({id:i,g:g,open:true})),tray:[],moves:0,won:false,failed:false};}
function tripleHtml(){
 var h='<div class="aa-stats"><span class="aa-stat">📦 '+state.items.filter(x=>x.open).length+' ürün</span><span class="aa-stat">🧺 '+state.tray.length+'/7 tepsi</span><span class="aa-stat">Seviye '+level+'</span></div><main class="aa-main"><div class="aa-note">Raflardan ürün seç. Tepside aynı üründen üç tane olunca otomatik temizlenir. Tepsi dolmadan rafları bitir.</div><div class="shelf">';
 state.items.forEach(x=>{h+='<button class="shelf-item" data-a="item" data-id="'+x.id+'" '+(!x.open?'disabled':'')+'>'+x.g+'</button>';});
 h+='</div><div class="aa-progress"><i style="width:'+((state.items.filter(x=>!x.open).length/state.items.length)*100)+'%"></i></div><div class="aa-note">Toplama tepsisi</div><div class="tray">';
 for(var i=0;i<7;i++){var x=state.tray[i];h+='<div class="tray-item">'+(x?x.g:"")+'</div>';}
 h+='</div><div class="aa-actions"><button class="aa-btn alt" data-a="undo" '+(!state.history||!state.history.length?'disabled':'')+'>↶ Geri al</button><button class="aa-btn alt" data-a="restart">Yeniden başlat</button></div></main>';
 if(state.won||state.failed)h+='<div class="aa-win"><div class="aa-win-card"><strong>'+(state.won?"🎉 Seviye tamamlandı!":"Tepsi doldu!")+'</strong>'+(state.won?"Bütün rafları temizledin.":"Üçlüleri tamamlayamadın. Yeniden dene.")+'<p><button class="aa-btn" data-a="'+(state.won?"next":"restart")+'">'+(state.won?"Sonraki seviye →":"Tekrar dene")+'</button></p></div></div>';
 return h;
}
function tripleClick(a,b){
 if(a==="item"){var x=state.items.find(v=>v.id===Number(b.dataset.id));if(!x||!x.open||state.won||state.failed)return;state.history=state.history||[];state.history.push(JSON.stringify({items:state.items,tray:state.tray,moves:state.moves}));x.open=false;state.tray.push({g:x.g,id:x.id});state.moves++;var count=state.tray.filter(v=>v.g===x.g).length;if(count===3)state.tray=state.tray.filter(v=>v.g!==x.g);if(!state.items.some(v=>v.open)&&state.tray.length===0)state.won=true;else if(state.tray.length>=7)state.failed=true;return;}
 if(a==="undo"&&state.history&&state.history.length){var prev=JSON.parse(state.history.pop());state.items=prev.items;state.tray=prev.tray;state.moves=prev.moves;state.won=false;state.failed=false;return;}
 if(a==="next"&&state.won){level++;localStorage.setItem("arenaMatchTripleLevel",String(level));tripleInit();}
}
function click(e){var b=e.target.closest("[data-a]");if(!b||!root||!root.contains(b))return;var a=b.dataset.a;if(a==="back"){root.remove();root=null;id="";state=null;window.dispatchEvent(new Event("arena:home"));return;}if(a==="restart"){id==="carJam"?jamInit():tripleInit();}else if(id==="carJam")jamClick(a,b);else if(id==="matchTriple")tripleClick(a,b);id==="carJam"?shell("Car Jam · Trafik Bulmacası",jamHtml()):shell("Match Triple · Raf Düzenleme",tripleHtml());}
function open(k){if(!games[k])return false;id=k;level=Math.max(1,Math.min(200,Number(localStorage.getItem(k==="carJam"?"arenaCarJamLevel":"arenaMatchTripleLevel")||1)));k==="carJam"?jamInit():tripleInit();shell(k==="carJam"?"Car Jam · Trafik Bulmacası":"Match Triple · Raf Düzenleme",k==="carJam"?jamHtml():tripleHtml());return true;}
var ac=old.ac.bind(old),varMi=old.varMi.bind(old),liste=old.liste.bind(old);
window.ArenaMiniOyunlar={ac:function(k){return games[k]?open(k):ac(k);},kapat:function(){if(root){root.remove();root=null;}id="";state=null;if(old.kapat)old.kapat();},varMi:function(k){return !!games[k]||varMi(k);},liste:function(){return liste().concat(Object.keys(games));}};
window.addEventListener("keydown",function(e){if(e.key==="Escape"&&root){root.remove();root=null;id="";state=null;window.dispatchEvent(new Event("arena:home"));}});
})();