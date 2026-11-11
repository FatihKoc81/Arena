(function(){
"use strict";
if(window.ArenaDiniMilyoner)return;
const questions=[
["İslam'ın kutsal kitabı hangisidir?",["Tevrat","Zebur","Kur'an-ı Kerim","İncil"],2],
["İslam'ın şartı kaçtır?",["Üç","Dört","Beş","Altı"],2],
["İmanın şartı kaçtır?",["Dört","Beş","Altı","Yedi"],2],
["Müslümanların namaz kılarken yöneldiği kıble neresidir?",["Mescid-i Nebevî","Kâbe","Mescid-i Aksa","Kuba Mescidi"],1],
["Ramazan ayında yerine getirilen ibadet hangisidir?",["Hac","Oruç","Zekât","Kurban"],1],
["Kur'an-ı Kerim'in ilk suresi hangisidir?",["Bakara","İhlâs","Fâtiha","Yâsîn"],2],
["Kur'an-ı Kerim kaç sureden oluşur?",["110","112","114","116"],2],
["İlk vahyin geldiği mağaranın adı nedir?",["Sevr","Hira","Nur","Arafat"],1],
["Hicret hangi iki şehir arasında gerçekleşmiştir?",["Mekke-Medine","Medine-Taif","Mekke-Kudüs","Taif-Şam"],0],
["Günde kaç vakit farz namaz vardır?",["Üç","Dört","Beş","Altı"],2],
["Zekât, temel ihtiyaçlar ve borçlar dışında nisap miktarı mala sahip Müslümanlara genel olarak hangi oranda farzdır?",["%1","%2,5","%5","%10"],1],
["Hac ibadeti hangi hicrî ayda yerine getirilir?",["Muharrem","Recep","Ramazan","Zilhicce"],3],
["Kur'an-ı Kerim'de adı geçen ve kendisine kitap verilen peygamberlerden biri kimdir?",["Hz. Davud","Hz. Hârun","Hz. Yahya","Hz. Zekeriyya"],0],
["Bakara suresi hangi ayetle başlar?",["Elhamdülillahi rabbil âlemin","Bismillahirrahmanirrahim","Elif Lâm Mîm","Kul hüvallahu ehad"],2],
["Kur'an-ı Kerim'in en uzun suresi hangisidir?",["Âl-i İmrân","Nisâ","Mâide","Bakara"],3],
["Kadir Gecesi hangi ay içinde aranır?",["Şaban","Ramazan","Şevval","Muharrem"],1],
["İslam takviminin başlangıcı kabul edilen olay hangisidir?",["Bedir Savaşı","Hicret","Mekke'nin Fethi","Veda Haccı"],1],
["Cuma namazı hangi gün kılınır?",["Perşembe","Cuma","Cumartesi","Pazar"],1],
["Kur'an-ı Kerim'de adı en çok geçen peygamber kimdir?",["Hz. İbrahim","Hz. Musa","Hz. İsa","Hz. Nuh"],1],
["Abdestin farzlarından biri hangisidir?",["Ağız çalkalamak","Kulakları mesh etmek","Yüzü yıkamak","Boynu mesh etmek"],2],
["İslam'da farz olan yıllık mali ibadet hangisidir?",["Sadaka","Zekât","Fitre dışındaki nafile bağış","Adak"],1],
["Kâbe'nin bulunduğu şehir hangisidir?",["Medine","Kudüs","Mekke","Taif"],2],
["Kur'an-ı Kerim hangi dilde indirilmiştir?",["Farsça","İbranice","Arapça","Süryanice"],2],
["Uhud Savaşı hangi şehir yakınlarında gerçekleşmiştir?",["Mekke","Medine","Taif","Hayber"],1],
["İslam'da bayram namazı yılda kaç kez, iki dinî bayramda kılınır?",["Bir","İki","Üç","Dört"],1]

,[ "Peygamber Efendimize ilk vahiy hangi melek aracılığıyla getirilmiştir?", ["Cebrâil", "Mikâil", "İsrâfil", "Azrâil"], 0]
,[ "Kur'an-ı Kerim'in son suresi hangisidir?", ["Felak", "Nâs", "Kevser", "Nasr"], 1]
,[ "Kur'an-ı Kerim'in en kısa suresi hangisidir?", ["Asr", "İhlâs", "Kevser", "Kureyş"], 2]
,[ "İlk Müslüman kadın olarak bilinen kişi kimdir?", ["Hz. Âişe", "Hz. Hatice", "Hz. Fâtıma", "Hz. Hafsa"], 1]
,[ "Peygamberimizin doğduğu şehir hangisidir?", ["Medine", "Taif", "Mekke", "Kudüs"], 2]
,[ "Peygamberimizin hicret ettiği şehir hangisidir?", ["Şam", "Medine", "Kudüs", "Taif"], 1]
,[ "Bedir Savaşı hangi hicrî yılda gerçekleşmiştir?", ["1", "2", "3", "5"], 1]
,[ "Müslümanların kutsal kitabı Kur'an hangi ayda indirilmeye başlanmıştır?", ["Muharrem", "Recep", "Ramazan", "Şevval"], 2]
,[ "Kur'an-ı Kerim'de adı geçen peygamberlerden hangisi balığın karnında kalmasıyla bilinir?", ["Hz. Yunus", "Hz. Eyyûb", "Hz. İdris", "Hz. İlyas"], 0]
,[ "Hz. İbrahim'in oğlu olarak Kur'an'da adı geçen peygamber kimdir?", ["Hz. Yusuf", "Hz. İsmail", "Hz. Süleyman", "Hz. Zekeriyya"], 1]
,[ "Mescid-i Nebevî hangi şehirde bulunur?", ["Mekke", "Kudüs", "Medine", "Taif"], 2]
,[ "İslam'ın ilk kıblesi olarak bilinen mescit hangisidir?", ["Mescid-i Aksa", "Mescid-i Haram", "Mescid-i Nebevî", "Kuba Mescidi"], 0]
,[ "Oruç ibadeti hangi vakitte başlar?", ["Güneş doğunca", "İmsak vakti", "Öğle vakti", "İkindi vakti"], 1]
,[ "Ramazan Bayramı hangi hicrî ayın ilk gününde başlar?", ["Şevval", "Zilhicce", "Muharrem", "Recep"], 0]
,[ "Kurban Bayramı hangi hicrî ayda kutlanır?", ["Ramazan", "Şevval", "Zilhicce", "Safer"], 2]
,[ "Kur'an-ı Kerim'de adı geçen peygamberlerden hangisine Zebur verilmiştir?", ["Hz. Musa", "Hz. Davud", "Hz. İsa", "Hz. İbrahim"], 1]
,[ "Tevrat hangi peygambere verilmiştir?", ["Hz. İsa", "Hz. Davud", "Hz. Musa", "Hz. Muhammed"], 2]
,[ "İncil hangi peygambere verilmiştir?", ["Hz. İsa", "Hz. Musa", "Hz. Davud", "Hz. İbrahim"], 0]
,[ "Kur'an-ı Kerim'de adı geçen ilk insan ve peygamber kimdir?", ["Hz. Nuh", "Hz. Âdem", "Hz. İbrahim", "Hz. İdris"], 1]
,[ "İslam dininde günlük farz namazların toplam rekât sayısı kaçtır?", ["17", "20", "30", "40"], 0]
];
const prizes=["1.000","2.000","3.000","5.000","7.500","15.000","30.000","60.000","125.000","250.000","500.000","1.000.000","2.000.000","5.000.000","10.000.000"];
let root=null,state=null,timer=null,tts=true,voiceToken=0;
function stopVoice(){voiceToken++;try{if(window.ArenaTTS)window.ArenaTTS.stop()}catch(e){}try{if(window.speechSynthesis)window.speechSynthesis.cancel()}catch(e){}}
async function speak(){if(!tts||!state||!state.deck[state.i])return;const token=++voiceToken,q=state.deck[state.i],text="Soru "+(state.i+1)+". "+q[0]+". Seçenekler. "+q[1].map((x,i)=>"Şık "+("ABCD"[i])+". "+x).join(". ")+".";
 try{if(window.ArenaTTS&&typeof window.ArenaTTS.speak==="function"){await window.ArenaTTS.speak(text);if(token!==voiceToken)stopVoice();return;}}
 catch(nativeError){console.warn("ARENA yerel seslendirme kullanılamadı:",nativeError);}
 if(!("speechSynthesis" in window)||!("SpeechSynthesisUtterance" in window)){const f=root&&root.querySelector(".dm-feedback");if(f)f.textContent="Bu cihazda seslendirme motoru bulunamadı.";return;}
 try{window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="tr-TR";u.rate=.88;u.pitch=1;u.volume=1;const voices=window.speechSynthesis.getVoices()||[];const tr=voices.find(v=>/^tr([-_]|$)/i.test(v.lang));if(tr)u.voice=tr;u.onerror=function(ev){console.warn("ARENA seslendirme hatası:",ev.error);};window.speechSynthesis.speak(u);}catch(e){console.warn("ARENA seslendirme hatası:",e);}
}
function shuffle(a){return a.map(x=>[Math.random(),x]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]);}
function mount(){if(root)return;let st=document.createElement("style");st.textContent=`
#arenaDiniMillion{position:fixed;inset:0;z-index:100100;display:none;flex-direction:column;overflow:auto;padding:calc(env(safe-area-inset-top) + 10px) 12px calc(env(safe-area-inset-bottom) + 12px);background:radial-gradient(ellipse at 50% 0%,#183b65,#071326 62%,#020711);color:#fff;font-family:system-ui,sans-serif}
#arenaDiniMillion.open{display:flex}.dm-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.dm-btn{border:1px solid #6998d7;border-radius:13px;padding:10px 13px;background:linear-gradient(145deg,#214e91,#0b2350);color:white;font-weight:850}.dm-brand{text-align:center;font-weight:950;letter-spacing:1px;color:#ffd36b}.dm-brand small{display:block;font-size:10px;color:#bcd5f6}.dm-progress{margin:12px auto;width:min(100%,700px);display:flex;justify-content:space-between;gap:5px;flex-wrap:wrap}.dm-step{font-size:10px;padding:5px 7px;border-radius:7px;background:#12294a;color:#8da9cc}.dm-step.current{background:#f0bd42;color:#17243b;font-weight:900}.dm-step.done{background:#176b50;color:#fff}.dm-table{width:min(100%,720px);margin:0 auto;padding:14px;border:2px solid #4f7bb9;border-radius:22px;background:linear-gradient(145deg,#102b55,#06162e);box-shadow:0 12px 35px #0008}.dm-top{display:flex;justify-content:space-between;align-items:center;color:#ffda83;font-weight:900}.dm-question{margin:18px 0;padding:18px 14px;border:2px solid #8ab8ff;border-radius:18px;background:linear-gradient(145deg,#173d78,#071b42);text-align:center;font-size:clamp(18px,4.8vw,25px);font-weight:850;line-height:1.4}.dm-answers{display:grid;grid-template-columns:1fr 1fr;gap:10px}.dm-answer{min-height:58px;border:2px solid #396cae;border-radius:15px;background:linear-gradient(145deg,#183a6b,#0b1c3b);color:white;text-align:left;padding:10px;font-weight:750}.dm-answer.correct{background:#126b45;border-color:#5ee6a4}.dm-answer.wrong{background:#8c2434;border-color:#ff8290}.dm-answer:disabled{opacity:.65}.dm-tools{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:13px}.dm-tools [data-dm="read"]{flex:0 0 100%;max-width:118px;padding:6px 7px;font-size:11px;line-height:1.15;min-height:34px}.dm-btn:disabled{opacity:.38}.dm-feedback{width:min(100%,720px);margin:8px auto;text-align:center;color:#ffd879;font-weight:800;font-size:14px}.dm-result{text-align:center;padding:18px;font-size:20px;font-weight:900;color:#ffdc83}.dm-ladder{width:min(100%,720px);margin:12px auto;display:grid;grid-template-columns:repeat(5,1fr);gap:5px}.dm-ladder span{padding:6px 3px;border-radius:8px;text-align:center;background:#102442;color:#a9c5e8;font-size:11px}.dm-ladder span.on{background:#e8b943;color:#14243b;font-weight:950}.dm-ladder span.safe{border:1px solid #4ad49a}
@media(max-width:420px){.dm-answers{grid-template-columns:1fr}.dm-question{margin:12px 0;padding:14px}.dm-ladder{grid-template-columns:repeat(3,1fr)}}
`;st.textContent += "\n#arenaDiniMillion{padding:calc(env(safe-area-inset-top) + 6px) 12px calc(env(safe-area-inset-bottom) + 12px);background:radial-gradient(ellipse at 50% 0%,#10294e 0%,#071326 48%,#020711 100%);box-sizing:border-box}\n.dm-head{width:100%;max-width:460px;min-height:90px;margin:0 auto 12px;display:grid;grid-template-columns:54px 1fr 54px;align-items:center;gap:8px}\n.dm-icon{width:48px;height:48px;border:2px solid #344d7b;border-radius:15px;background:linear-gradient(145deg,#142e55,#07152d);color:#e8f4ff;font-size:25px;font-weight:800;box-shadow:0 4px 14px #0007}\n.dm-brand{text-align:center;font-weight:950;letter-spacing:2px;color:#fff;font-size:26px;text-shadow:0 0 14px #168dff}\n.dm-brand small{display:block;font-size:10px;letter-spacing:1.2px;color:#a9c9ee;font-weight:700;text-shadow:none}\n.dm-table{width:100%;max-width:460px;box-sizing:border-box;margin:0 auto;background:#070b1d;border:2px solid #4a5a9a;box-shadow:0 0 22px rgba(74,90,154,.35);border-radius:36px;padding:clamp(10px,2.4vh,22px) 18px;text-align:center}\n.dm-top{display:flex;justify-content:space-between;align-items:center;gap:5px;color:#8e9bc4;font-size:15px;margin-bottom:10px;font-weight:700}\n.dm-progressbar{height:8px;background:#27345f;border:1px solid #4a5a9a;border-radius:8px;overflow:hidden;margin-bottom:clamp(12px,3vh,24px)}\n.dm-progressbar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#16c9ff,#596bff);transition:width .25s}\n.dm-question{font-size:22px;line-height:1.45;margin:0 0 clamp(12px,2.8vh,22px);font-weight:500;color:#fff;text-align:center;min-height:3.2em;display:flex;align-items:center;justify-content:center}\n.dm-answers{display:flex;flex-direction:column;gap:0}\n.dm-answer{display:flex;justify-content:flex-start;align-items:center;gap:8px;width:100%;min-height:58px;box-sizing:border-box;text-align:left;background:#101a38;border:2px solid #4a5a9a;border-radius:16px;padding:12px 16px;margin-bottom:10px;color:#fff;font-size:17px;font-weight:500}\n.dm-answer.correct{background:#14532d;border-color:#22c55e}.dm-answer.wrong{background:#7f1d1d;border-color:#ef4444}.dm-answer:disabled{opacity:.68}\n.dm-tools{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:clamp(8px,2vh,16px)}\n.dm-btn{min-width:0;min-height:48px;border:2px solid #4a5a9a;border-radius:14px;padding:10px 4px;background:#222f45;color:#fff;font-size:14px;font-weight:750;line-height:1.2;white-space:normal}\n.dm-btn:disabled{opacity:.35}\n.dm-read-row{display:flex;justify-content:flex-end;margin-top:8px}\n.dm-read{width:calc((100% - 16px)/3);min-height:42px;padding:8px 4px;font-size:12px}\n.dm-footer{display:flex;justify-content:space-between;gap:8px;margin-top:14px}\n.dm-pill{flex:1;min-width:0;border:2px solid #4a5a9a;border-radius:24px;background:#101a38;color:#fff;padding:8px 6px;font-size:13px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.dm-pill.gold{border-color:#ffb300;color:#ffe27a}\n.dm-feedback{max-width:460px;margin:8px auto 0;text-align:center;color:#ffd879;font-weight:800;font-size:14px}\n@media(max-height:760px){.dm-head{min-height:66px;margin-bottom:6px}.dm-brand{font-size:22px}.dm-table{padding:10px 14px}.dm-question{font-size:20px;min-height:2.8em;margin-bottom:10px}.dm-answer{min-height:48px;padding:9px 13px;margin-bottom:7px}.dm-btn{min-height:42px;padding:7px 3px}.dm-tools{margin-top:7px}.dm-footer{margin-top:8px}}\n";document.head.appendChild(st);root=document.createElement("section");root.id="arenaDiniMillion";document.body.appendChild(root);root.addEventListener("click",e=>{let b=e.target.closest("[data-dm]");if(!b)return;let a=b.dataset.dm;if(a==="close"){stopVoice();clearInterval(timer);root.classList.remove("open");window.dispatchEvent(new Event("arena:game-close"));}if(a==="answer")answer(+b.dataset.i);if(a==="read")speak();if(a==="voice"){tts=!tts;if(!tts)stopVoice();render();}if(a==="half")half();if(a==="audience")audience();if(a==="double"){if(!state.used.double&&!state.lock){state.used.double=true;state.double=true;render();}}if(a==="new")start();if(a==="home"){root.classList.remove("open");stopVoice();clearInterval(timer);window.dispatchEvent(new Event("arena:home"));}});}
function render(msg){
 mount();clearInterval(timer);let q=state.deck[state.i];
 let ad=(window.Ekonomi&&typeof Ekonomi.ad==="function"?Ekonomi.ad():"Oyuncu")||"Oyuncu";
 let altin=(window.Ekonomi&&typeof Ekonomi.altin==="function"?Ekonomi.altin():null);
 ad=String(ad).replace(/[&<>"]/g,"");
 root.innerHTML='<div class="dm-head"><button class="dm-icon" data-dm="home">☰</button><div class="dm-brand">ARENA<small>OYUN PLATFORMU · DİNİ MİLYONER</small></div><button class="dm-icon" data-dm="close">×</button></div>'+
 '<div class="dm-table"><div class="dm-top"><span>Seviye 1</span><span>❤️ '+state.lives+'</span><span>Soru '+(state.i+1)+'/15</span></div>'+
 '<div class="dm-progressbar"><i style="width:'+((state.i)/15*100)+'%"></i></div>'+
 '<div class="dm-question">'+(msg||q[0])+'</div><div class="dm-answers">'+q[1].map((x,i)=>'<button class="dm-answer" data-dm="answer" data-i="'+i+'" '+(state.lock||state.eliminated.includes(i)?"disabled":"")+'>'+"ABCD"[i]+") "+x+'</button>').join("")+'</div>'+
 '<div class="dm-tools"><button class="dm-btn" data-dm="half" '+(state.used.half?"disabled":"")+'>✂️ 50:50</button><button class="dm-btn" data-dm="audience" '+(state.used.audience?"disabled":"")+'>👥 Seyirci</button><button class="dm-btn" data-dm="double" '+(state.used.double?"disabled":"")+'>🛡️ Çift Cevap</button></div>'+
 '<div class="dm-read-row"><button class="dm-btn dm-read" data-dm="read">🔊 Soruyu dinle</button></div>'+
 '<div class="dm-footer"><div class="dm-pill">👤 '+ad+'</div><div class="dm-pill gold">🪙 '+(altin==null?"Altın":Number(altin).toLocaleString("tr-TR"))+'</div></div></div>'+
 (state.feedback?'<div class="dm-feedback">'+state.feedback+'</div>':"");
 root.classList.add("open");if(!state.lock)speak();
}
function answer(i){
 if(state.lock||state.eliminated.includes(i))return;
 const q=state.deck[state.i],bs=root.querySelectorAll(".dm-answer");
 if(i===q[2]){
  state.lock=true;stopVoice();bs[q[2]].classList.add("correct");state.double=false;state.feedback="Doğru cevap!";
  renderFeedback();
  if(state.i===14){setTimeout(()=>renderEnd("TEBRİKLER! DİNİ MİLYONERİ TAMAMLADIN! 10.000.000 puanlık büyük ödül."),750);return;}
  setTimeout(()=>{state.i++;state.lock=false;state.eliminated=[];state.feedback="";render();},850);return;
 }
 bs[i].classList.add("wrong");state.eliminated.push(i);stopVoice();
 if(state.double){state.double=false;state.feedback="İlk cevap yanlış. İkinci hakkını kullanabilirsin.";renderFeedback();return;}
 state.lock=true;stopVoice();state.lives--;state.feedback="Yanlış cevap. Doğru cevap: "+q[1][q[2]]+".";
 if(state.lives<=0){setTimeout(()=>renderEnd("Canların bitti. Güvenli ödülün: "+(state.i>=10?"250.000":state.i>=5?"7.500":"0")+" puan."),1000);return;}
 renderFeedback();
 setTimeout(()=>{if(state.i>=14){renderEnd("Son soruda yanlış cevap. Güvenli ödülün: "+(state.i>=10?"250.000":state.i>=5?"7.500":"0")+" puan.");return;}state.i++;state.lock=false;state.eliminated=[];state.feedback="";render();},1200);
}
function renderFeedback(){const el=root.querySelector(".dm-feedback");if(el)el.textContent=state.feedback;else{const d=document.createElement("div");d.className="dm-feedback";d.textContent=state.feedback;root.appendChild(d);}}
function renderEnd(msg){clearInterval(timer);stopVoice();root.innerHTML='<div class="dm-brand" style="font-size:26px;margin:15vh 0 20px">🕌 DİNİ MİLYONER</div><div class="dm-result">'+msg+'</div><div class="dm-tools"><button class="dm-btn" data-dm="new">Yeniden oyna</button><button class="dm-btn" data-dm="home">Ana sayfa</button></div>';root.classList.add("open");}
function half(){if(state.used.half||state.lock)return;state.used.half=true;let q=state.deck[state.i],wrong=shuffle([0,1,2,3].filter(i=>i!==q[2]));state.eliminated.push(...wrong.slice(0,2));render();}
function audience(){if(state.used.audience||state.lock)return;state.used.audience=true;const q=state.deck[state.i],correct=55+Math.floor(Math.random()*31),others=shuffle([0,1,2,3].filter(i=>i!==q[2])),left=100-correct,p=[0,0,0,0];p[q[2]]=correct;let rest=left;others.forEach((ix,n)=>{const v=n===2?rest:Math.floor(Math.random()*(rest+1));p[ix]=v;rest-=v;});state.feedback="Seyirci oylaması: "+p.map((v,i)=>"ABCD"[i]+" %"+v).join(" · ");render();}
function start(){state={deck:shuffle(questions).slice(0,15),i:0,lives:3,used:{half:false,audience:false,double:false},double:false,eliminated:[],feedback:"",lock:false};state.deck=state.deck.map(q=>{let opts=q[1].map((x,i)=>({x,ok:i===q[2]}));opts=shuffle(opts);return [q[0],opts.map(o=>o.x),opts.findIndex(o=>o.ok)];});render();}
function open(){start();}
const btn=document.createElement("button");btn.type="button";btn.textContent="__ARENA_DINI_MILYONER__";btn.style.cssText="position:absolute!important;left:-10000px!important;width:1px!important;height:1px!important";btn.addEventListener("click",open);document.getElementById("ana").appendChild(btn);
window.ArenaDiniMilyoner={ac:open};
})();