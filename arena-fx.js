/* ARENA FX — zengin ses (WebAudio), yüksek çözünürlüklü parçacık/konfeti ve animasyonlu zafer afişi.
   Bağımsız dosya: mevcut oyun kodlarına dokunmaz, sınıf değişikliklerini izleyerek tepki verir. */
(function(){"use strict";
if(window.ArenaFX)return;
var AC=null,out=null,last={};
function sfxOn(){try{if(window.Arena3D&&Arena3D.settings)return Arena3D.settings().sfxOn;return localStorage.getItem("arenaSfx")!=="off";}catch(e){return true;}}
function ctx(){if(!AC){var C=window.AudioContext||window.webkitAudioContext;if(!C)return null;AC=new C();var comp=AC.createDynamicsCompressor();out=AC.createGain();out.gain.value=.9;out.connect(comp);comp.connect(AC.destination);}
 if(AC.state==="suspended")AC.resume();return AC;}
function tone(f,d,type,v,t0,to){var a=ctx();if(!a)return;var t=a.currentTime+(t0||0),o=a.createOscillator(),g=a.createGain();
 o.type=type||"sine";o.frequency.setValueAtTime(f,t);if(to)o.frequency.exponentialRampToValueAtTime(to,t+d);
 g.gain.setValueAtTime(1e-4,t);g.gain.exponentialRampToValueAtTime(v||.06,t+.012);g.gain.exponentialRampToValueAtTime(1e-4,t+d);
 o.connect(g);g.connect(out);o.start(t);o.stop(t+d+.03);}
function noise(d,v,t0,hp){var a=ctx();if(!a)return;var n=Math.floor(a.sampleRate*d),b=a.createBuffer(1,n,a.sampleRate),x=b.getChannelData(0);
 for(var i=0;i<n;i++)x[i]=(Math.random()*2-1)*(1-i/n);var s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();
 s.buffer=b;f.type="highpass";f.frequency.value=hp||800;g.gain.value=v||.05;s.connect(f);f.connect(g);g.connect(out);s.start(a.currentTime+(t0||0));}
var S={
 select:function(){tone(300,.09,"sine",.07,0,720);},
 clink:function(){var k=Math.random()*200;tone(1500+k,.14,"sine",.045);tone(2300+k,.09,"sine",.02,.012);},
 pour:function(){noise(.22,.035,0,1500);tone(420,.2,"sine",.02,0,640);},
 cork:function(){tone(190,.1,"square",.04,0,90);noise(.05,.05,0,400);tone(880,.18,"triangle",.04,.06);},
 sparkle:function(){[1568,2093,2637].forEach(function(f,i){tone(f,.12,"sine",.03,i*.05);});},
 deal:function(){noise(.07,.06,0,2500);},
 dice:function(){for(var i=0;i<5;i++)noise(.04,.05,i*.07,1800);},
 chip:function(){tone(2400,.06,"triangle",.04);tone(3100,.05,"triangle",.025,.03);},
 win:function(){[523,659,784,1047,1319].forEach(function(f,i){tone(f,.34,"triangle",.06,i*.09);tone(f/2,.4,"sine",.03,i*.09);});tone(1568,.7,"sine",.05,.5);},
 error:function(){tone(170,.2,"sawtooth",.04,0,110);}
};
function play(n){if(!sfxOn())return;try{S[n]&&S[n]();}catch(e){}}
function throttle(k,ms){var t=Date.now();if(last[k]&&t-last[k]<ms)return false;last[k]=t;return true;}

/* ---- Parçacıklar: cihaz piksel oranında (en çok 3x) keskin canvas ---- */
var cv=null,cx=null,P=[],run=false,dpr=1;
function canvas(){if(cv)return cv;cv=document.createElement("canvas");cv.style.cssText="position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:2147483000";
 document.body.appendChild(cv);cx=cv.getContext("2d");resize();window.addEventListener("resize",resize);return cv;}
function resize(){if(!cv)return;dpr=Math.min(window.devicePixelRatio||1,3);cv.width=innerWidth*dpr;cv.height=innerHeight*dpr;}
function star(c,r,rot){c.beginPath();for(var i=0;i<10;i++){var a=rot+i*Math.PI/5,q=i%2?r*.45:r;c.lineTo(Math.cos(a)*q,Math.sin(a)*q);}c.closePath();c.fill();}
function burst(x,y,n,cols,o){o=o||{};canvas();for(var i=0;i<n;i++){var a=Math.random()*6.283,s=(o.speed||5)*(.3+Math.random());
 P.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-(o.up||0),g:o.g==null?.18:o.g,r:(o.size||5)*(.5+Math.random()),c:cols[i%cols.length],l:0,m:o.life||60+Math.random()*30,rot:Math.random()*6,vr:(Math.random()-.5)*.3,st:o.star?1:0});}
 if(!run){run=true;requestAnimationFrame(tick);}}
function tick(){cx.setTransform(1,0,0,1,0,0);cx.clearRect(0,0,cv.width,cv.height);cx.scale(dpr,dpr);
 P=P.filter(function(p){p.l++;p.vy+=p.g;p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr;if(p.l>p.m)return false;
  cx.globalAlpha=Math.max(0,1-p.l/p.m);cx.fillStyle=p.c;cx.shadowColor=p.c;cx.shadowBlur=8;
  cx.save();cx.translate(p.x,p.y);if(p.st)star(cx,p.r*1.6,p.rot);else{cx.rotate(p.rot);cx.fillRect(-p.r,-p.r*.5,p.r*2,p.r);}cx.restore();return true;});
 if(P.length)requestAnimationFrame(tick);else{run=false;cx.clearRect(0,0,cv.width,cv.height);}}
var GOLD=["#ffd45e","#fff0ae","#ffb02e","#ffffff"],RAIN=["#ff4d6d","#ffd45e","#4dd2ff","#7dff9b","#c58bff","#ff9a3d"];

/* ---- Zafer afişi (INCREDIBLE!) ---- */
function css(){if(document.getElementById("arenaFxCss"))return;var s=document.createElement("style");s.id="arenaFxCss";
 s.textContent="@keyframes afxBan{0%{transform:translate(-50%,-50%) scale(0) rotate(-8deg);opacity:0}55%{transform:translate(-50%,-50%) scale(1.18) rotate(2deg);opacity:1}75%{transform:translate(-50%,-50%) scale(.96)}100%{transform:translate(-50%,-50%) scale(1)}}"+
 "@keyframes afxOut{to{opacity:0;transform:translate(-50%,-80%) scale(.9)}}"+
 ".afx-banner{position:fixed;left:50%;top:38%;z-index:2147483001;padding:14px 34px;font:1000 clamp(26px,8vw,44px)/1 system-ui,sans-serif;letter-spacing:2px;color:#fff;text-shadow:0 3px 0 #8a0f58,0 0 18px #ff7ad0;background:linear-gradient(180deg,#ff4fb8,#d3188f);border:3px solid #ffd45e;border-radius:14px;box-shadow:0 8px 30px #000a,0 0 40px #ff4fb888;pointer-events:none;animation:afxBan .6s cubic-bezier(.2,.9,.3,1.2) both,afxOut .5s 1.7s ease-in forwards}"+
 "#arenaMiniGames .mg-sort-tube{transition:transform .2s cubic-bezier(.2,.9,.3,1.3),filter .2s}#arenaMiniGames .mg-ball{will-change:transform}"+
 "#arenaMiniGames .mg-btn:active,#arena-table-modal button:active{transform:scale(.94)}";
 document.head.appendChild(s);}
function banner(txt){css();var b=document.createElement("div");b.className="afx-banner";b.textContent=txt;document.body.appendChild(b);setTimeout(function(){b.remove();},2300);}
function win(){if(!throttle("win",2500))return;var w=innerWidth,h=innerHeight;play("win");
 banner(["INCREDIBLE!","AWESOME!","HARİKA!","MÜKEMMEL!"][Math.floor(Math.random()*4)]);
 burst(w/2,h*.4,40,GOLD,{speed:9,up:3,star:1,size:6,life:90});
 [.2,.8].forEach(function(k,i){setTimeout(function(){burst(w*k,h*.5,55,RAIN,{speed:8,up:6,size:4,life:110});play("sparkle");},250+i*220);});
 if(navigator.vibrate)try{navigator.vibrate([30,40,60]);}catch(e){}}

/* ---- Mevcut oyunlara bağlanma (DOM değişikliklerini izle) ---- */
function center(el){var r=el.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2];}
new MutationObserver(function(list){list.forEach(function(m){
 if(m.type==="attributes"){var t=m.target;if(!t.classList)return;
  if(t.classList.contains("sort-land")&&throttle("land",70)){play("clink");var c=center(t);burst(c[0],c[1]+10,6,GOLD,{speed:2.5,size:2.5,life:28,g:.05});}
  else if(t.classList.contains("sel")&&t.classList.contains("mg-sort-tube")&&throttle("sel",80))play("select");
  else if(t.classList.contains("hint")&&throttle("hint",300))play("sparkle");}
 else m.addedNodes.forEach(function(n){if(n.nodeType!==1)return;
  if(n.matches&&(n.matches(".mg-sort-win")||n.querySelector&&n.querySelector(".mg-sort-win")))win();
  else if(n.classList&&n.classList.contains("sort-fx")&&throttle("fx",120))play("pour");});});
}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:["class"]});

/* ---- Dokunma: altın kıvılcım + masa oyunlarında kart/zar/fiş sesi ---- */
document.addEventListener("pointerdown",function(e){var t=e.target.closest&&e.target.closest("button,.mg-btn,[data-mg],.at-btn,.aw-card,[data-game]");if(!t)return;
 ctx();burst(e.clientX,e.clientY,7,GOLD,{speed:3,size:3,life:26,g:.08,star:1});
 if(t.closest("#arena-table-modal")){var s=(t.textContent||"").toLowerCase();play(/zar|roll/.test(s)?"dice":/bahis|bet|raise|call|fiş|chip/.test(s)?"chip":"deal");}},true);

window.ArenaFX={play:play,burst:burst,banner:banner,win:win};
})();
