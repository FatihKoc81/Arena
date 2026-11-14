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
let root=null,state=null,timer=null,tts=(()=>{try{return localStorage.getItem('arena_question_voice')!=='0';}catch(e){return true;}})(),voiceToken=0;
function stopVoice(){
 voiceToken++;
 try{if(window.ArenaTTS&&typeof window.ArenaTTS.stop==="function")Promise.resolve(window.ArenaTTS.stop()).catch(()=>{});}catch(e){}
 try{if(window.speechSynthesis)window.speechSynthesis.cancel();}catch(e){}
 try{const p=window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.TextToSpeech;if(p&&typeof p.stop==="function")Promise.resolve(p.stop()).catch(()=>{});}catch(e){}
}
function voiceStillActive(token){return token===voiceToken&&!!root&&root.classList.contains("open")&&!document.hidden;}
document.addEventListener("visibilitychange",()=>{if(document.hidden)stopVoice();});
window.addEventListener("pagehide",stopVoice);
window.addEventListener("blur",stopVoice);
window.addEventListener("arena:game-close",stopVoice);
window.addEventListener("arena:home",stopVoice);
try{
 const app=window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.App;
 if(app&&typeof app.addListener==="function")app.addListener("appStateChange",state=>{if(!state||!state.isActive)stopVoice();});
}catch(e){}

async function speak(){
 if(!tts||!state||!state.deck[state.i])return;
 const token=++voiceToken,q=state.deck[state.i];
 try{if(window.ArenaTTS&&typeof window.ArenaTTS.speakParts==="function"){await window.ArenaTTS.speakParts(q[0],q[1]);if(token!==voiceToken)return;return;}}
 catch(nativeError){if(!voiceStillActive(token))return;console.warn("ARENA native TTS unavailable; using browser speech:",nativeError);}
 if(!voiceStillActive(token)||!("speechSynthesis"in window)||!("SpeechSynthesisUtterance"in window))return;
 try{
  const synth=window.speechSynthesis;synth.cancel();
  let voices=synth.getVoices()||[];
  if(!voices.length&&typeof synth.addEventListener==="function"){
   await Promise.race([new Promise(resolve=>synth.addEventListener("voiceschanged",resolve,{once:true})),new Promise(resolve=>setTimeout(resolve,1200))]);
   voices=synth.getVoices()||[];
  }
  if(!voiceStillActive(token))return;
  const tr=voices.filter(v=>/^tr([-_]|$)/i.test(v.lang||""));
  const male=tr.find(v=>!/(woman|female|kadın)/i.test((v.name||"")+" "+(v.voiceURI||""))&&/(?:^|[^a-z])(male|man)(?=$|[^a-z])|erkek|murat|ahmet|yusuf|cem|emre/i.test((v.name||"")+" "+(v.voiceURI||"")));
  const natural=tr.find(v=>/google|neural|natural|premium/i.test((v.name||"")+" "+(v.voiceURI||"")));
  const voice=male||natural||tr[0]||null;
  const say=text=>new Promise(resolve=>{const u=new SpeechSynthesisUtterance(text);u.lang="tr-TR";u.rate=.88;u.pitch=.88;u.volume=1;if(voice)u.voice=voice;u.onend=resolve;u.onerror=resolve;synth.speak(u);});
  await say("Soru. "+q[0]);if(!voiceStillActive(token))return;
  await new Promise(r=>setTimeout(r,700));
  for(let i=0;i<q[1].length;i++){if(!voiceStillActive(token))return;if(i>0)await new Promise(r=>setTimeout(r,650));await say(q[1][i]+".");}
 }catch(e){console.warn("ARENA TTS:",e);}
}
function shuffle(a){return a.map(x=>[Math.random(),x]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]);}
function mount(){if(root)return;let st=document.createElement("style");st.textContent=`
#arenaDiniMillion{position:fixed;inset:0;z-index:100100;display:none;flex-direction:column;overflow:auto;padding:calc(env(safe-area-inset-top) + 10px) 12px calc(env(safe-area-inset-bottom) + 12px);background:radial-gradient(ellipse at 50% 0%,#183b65,#071326 62%,#020711);color:#fff;font-family:system-ui,sans-serif}
#arenaDiniMillion.open{display:flex}.dm-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.dm-btn{border:1px solid #6998d7;border-radius:13px;padding:10px 13px;background:linear-gradient(145deg,#214e91,#0b2350);color:white;font-weight:850}.dm-brand{text-align:center;font-weight:950;letter-spacing:1px;color:#ffd36b}.dm-brand small{display:block;font-size:10px;color:#bcd5f6}.dm-progress{margin:12px auto;width:min(100%,700px);display:flex;justify-content:space-between;gap:5px;flex-wrap:wrap}.dm-step{font-size:10px;padding:5px 7px;border-radius:7px;background:#12294a;color:#8da9cc}.dm-step.current{background:#f0bd42;color:#17243b;font-weight:900}.dm-step.done{background:#176b50;color:#fff}.dm-table{width:min(100%,720px);margin:0 auto;padding:14px;border:2px solid #4f7bb9;border-radius:22px;background:linear-gradient(145deg,#102b55,#06162e);box-shadow:0 12px 35px #0008}.dm-top{display:flex;justify-content:space-between;align-items:center;color:#ffda83;font-weight:900}.dm-question{margin:18px 0;padding:18px 14px;border:2px solid #8ab8ff;border-radius:18px;background:linear-gradient(145deg,#173d78,#071b42);text-align:center;font-size:clamp(18px,4.8vw,25px);font-weight:850;line-height:1.4}.dm-answers{display:grid;grid-template-columns:1fr 1fr;gap:10px}.dm-answer{min-height:58px;border:2px solid #396cae;border-radius:15px;background:linear-gradient(145deg,#183a6b,#0b1c3b);color:white;text-align:left;padding:10px;font-weight:750}.dm-answer.correct{background:#126b45;border-color:#5ee6a4}.dm-answer.wrong{background:#8c2434;border-color:#ff8290}.dm-answer:disabled{opacity:.65}.dm-tools{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:13px}.dm-tools [data-dm="read"]{flex:0 0 100%;max-width:118px;padding:6px 7px;font-size:11px;line-height:1.15;min-height:34px}.dm-btn:disabled{opacity:.38}.dm-feedback{width:min(100%,720px);margin:8px auto;text-align:center;color:#ffd879;font-weight:800;font-size:14px}.dm-result{text-align:center;padding:18px;font-size:20px;font-weight:900;color:#ffdc83}.dm-ladder{width:min(100%,720px);margin:12px auto;display:grid;grid-template-columns:repeat(5,1fr);gap:5px}.dm-ladder span{padding:6px 3px;border-radius:8px;text-align:center;background:#102442;color:#a9c5e8;font-size:11px}.dm-ladder span.on{background:#e8b943;color:#14243b;font-weight:950}.dm-ladder span.safe{border:1px solid #4ad49a}
@media(max-width:420px){.dm-answers{grid-template-columns:1fr}.dm-question{margin:12px 0;padding:14px}.dm-ladder{grid-template-columns:repeat(3,1fr)}}
`;st.textContent += `
/* Dini İmtihan premium visual pass: emerald night, warm gold and Islamic geometric accents. */
#arenaDiniMillion{background:radial-gradient(ellipse at 50% 0%,#174d55 0%,#0b2637 36%,#061326 72%,#020711 100%)!important;justify-content:flex-start!important;align-items:center!important;overflow-y:auto!important;box-sizing:border-box!important}
#arenaDiniMillion:before{content:"";position:fixed;inset:0;pointer-events:none;opacity:.18;background:repeating-linear-gradient(45deg,transparent 0 22px,#d7b56d 23px,#d7b56d 24px,transparent 25px 46px),repeating-linear-gradient(-45deg,transparent 0 22px,#d7b56d 23px,#d7b56d 24px,transparent 25px 46px);mask-image:linear-gradient(to bottom,black,transparent 75%)}
#arenaDiniMillion .dm-head{display:grid!important;position:relative;z-index:1;min-height:76px;margin:0 auto 10px!important}
#arenaDiniMillion .dm-brand{color:#ffe2a0!important;font-family:Georgia,serif!important;letter-spacing:2px!important;text-shadow:0 2px 0 #543814,0 0 16px #d6a64a!important}
#arenaDiniMillion .dm-brand small{color:#d8e7d6!important;letter-spacing:1.5px!important}
#arenaDiniMillion .dm-icon{border-color:#bd9855!important;background:linear-gradient(145deg,#183b42,#081c2c)!important;box-shadow:inset 0 0 0 1px #fff2,0 5px 14px #0008!important}
#arenaDiniMillion .dm-table{position:relative;z-index:1;max-width:480px!important;border:3px solid #c69b50!important;border-radius:28px!important;background:linear-gradient(160deg,#123c3b 0%,#0a2632 48%,#07182b 100%)!important;box-shadow:0 0 0 2px #543b22,0 0 28px #d7a94a35,inset 0 0 0 2px #f6d99b55!important;padding:16px!important}
#arenaDiniMillion .dm-top{color:#f6d78f!important;font-size:clamp(13px,3.8vw,16px)!important}
#arenaDiniMillion .dm-progressbar{border:1px solid #e0bd72!important;background:#071c27!important;box-shadow:inset 0 1px 4px #0009!important}
#arenaDiniMillion .dm-progressbar i{background:linear-gradient(90deg,#f1c86e,#fff0b0,#b77b2b)!important}
#arenaDiniMillion .dm-question{position:relative;border:2px solid #c49a54!important;border-radius:20px!important;padding:18px 14px!important;margin:12px 0 16px!important;min-height:108px!important;background:linear-gradient(145deg,#153d42,#092536 75%)!important;box-shadow:inset 0 0 0 2px #fff2,0 8px 18px #0006!important;color:#fff4d8!important;font-family:Georgia,serif!important;font-weight:700!important}
#arenaDiniMillion .dm-answer{min-height:56px!important;border:2px solid #b88e4b!important;border-radius:15px!important;background:linear-gradient(100deg,#153d45,#0b2638)!important;color:#fff7e6!important;box-shadow:inset 0 1px #fff2,0 4px 9px #0005!important;font-weight:700!important}
#arenaDiniMillion .dm-answer.correct{background:linear-gradient(100deg,#18784e,#0b4d38)!important;border-color:#8de0a9!important}
#arenaDiniMillion .dm-answer.wrong{background:linear-gradient(100deg,#8e2935,#4e1727)!important;border-color:#ff9b91!important}
#arenaDiniMillion .dm-btn{border-color:#c39b58!important;background:linear-gradient(145deg,#24464a,#102638)!important;color:#ffedc9!important;box-shadow:inset 0 1px #fff2,0 4px 8px #0005!important}
#arenaDiniMillion .dm-pill{border-color:#a88753!important;background:#102c39!important;color:#fff2d8!important}
#arenaDiniMillion .dm-pill.gold{border-color:#f3bd43!important;color:#ffe18a!important;background:linear-gradient(145deg,#554018,#201b24)!important}
#arenaDiniMillion .dm-pill.dm-voice{border-color:#5e9db1!important;color:#d4f1ff!important;background:#103247!important}
#arenaDiniMillion .dm-feedback{color:#ffe09a!important}
/* Match the standard Milyoner play screen; only the felt/background is emerald. */
#arenaDiniMillion{
 background:radial-gradient(ellipse at 50% 38%,#176b4b 0%,#0b3d32 45%,#041c22 100%)!important;
 padding:calc(env(safe-area-inset-top) + 8px) 12px calc(env(safe-area-inset-bottom) + 16px)!important;
 align-items:center!important;justify-content:flex-start!important;
}
#arenaDiniMillion:before{opacity:.08!important}
#arenaDiniMillion .dm-head{
 display:flex!important;display:grid!important;
 grid-template-columns:52px minmax(0,1fr) 52px!important;
 align-items:center!important;gap:8px!important;
 width:min(100%,620px)!important;min-height:66px!important;
 margin:0 auto 12px!important;
}
#arenaDiniMillion .dm-icon{
 display:grid!important;place-items:center!important;
 width:52px!important;height:48px!important;min-width:52px!important;
 padding:0!important;border:1px solid #4b6d7e!important;border-radius:14px!important;
 background:linear-gradient(145deg,#172f43,#091b2c)!important;
 color:#fff!important;font-size:25px!important;font-weight:900!important;
}
#arenaDiniMillion .dm-brand{min-width:0!important;text-align:center!important;font-size:clamp(23px,6vw,30px)!important}
#arenaDiniMillion .dm-brand small{font-size:10px!important}
#arenaDiniMillion .dm-table{
 display:block!important;flex:0 0 auto!important;
 width:100%!important;max-width:620px!important;min-width:0!important;
 margin:0 auto!important;padding:clamp(12px,3vw,18px)!important;
 border:2px solid #557b65!important;border-radius:32px!important;
 background:linear-gradient(160deg,#071b2b 0%,#07182a 100%)!important;
 box-shadow:0 0 0 2px #263f37,0 0 24px #1b9b6530!important;
 box-sizing:border-box!important;
}
#arenaDiniMillion .dm-top{
 display:flex!important;justify-content:space-between!important;align-items:center!important;
 gap:6px!important;color:#d8e4ff!important;font-size:clamp(13px,3.7vw,17px)!important;
}
#arenaDiniMillion .dm-progressbar{
 height:8px!important;margin:12px 0 20px!important;
 border:1px solid #426c63!important;border-radius:10px!important;background:#142b37!important;overflow:hidden!important;
}
#arenaDiniMillion .dm-progressbar i{display:block!important;height:100%!important;border-radius:10px!important;background:linear-gradient(90deg,#25c47b,#b3efae)!important}
#arenaDiniMillion .dm-question{
 min-height:0!important;height:auto!important;margin:0 0 18px!important;padding:18px 14px!important;
 border:2px solid #547f69!important;border-radius:22px!important;
 background:linear-gradient(145deg,#102b3d,#0a2032)!important;
 color:#fff!important;font-family:system-ui,sans-serif!important;
 font-size:clamp(20px,5.3vw,27px)!important;line-height:1.3!important;font-weight:500!important;
 box-shadow:none!important;
}
#arenaDiniMillion .dm-answers{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:10px!important}
#arenaDiniMillion .dm-answer{
 display:flex!important;align-items:center!important;width:100%!important;min-width:0!important;
 min-height:58px!important;height:auto!important;margin:0!important;padding:12px 14px!important;
 border:2px solid #557a68!important;border-radius:17px!important;
 background:#101f39!important;color:#fff!important;
 text-align:left!important;font:500 clamp(17px,4.6vw,21px)/1.25 system-ui,sans-serif!important;
 box-shadow:none!important;
}
#arenaDiniMillion .dm-answer.correct{background:#145d42!important;border-color:#4bc58b!important}
#arenaDiniMillion .dm-answer.wrong{background:#742b36!important;border-color:#e77982!important}
#arenaDiniMillion .dm-tools{
 display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;
 gap:8px!important;margin:18px 0 0!important;
}
#arenaDiniMillion .dm-tools .dm-btn{
 min-width:0!important;min-height:52px!important;padding:8px 3px!important;
 border:2px solid #557a68!important;border-radius:16px!important;
 background:#222f45!important;color:#fff!important;
 font:800 clamp(12px,3.3vw,16px)/1.2 system-ui,sans-serif!important;
 white-space:normal!important;
}
#arenaDiniMillion .dm-footer{
 display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr) minmax(0,1fr)!important;
 align-items:center!important;gap:8px!important;margin-top:12px!important;
}
#arenaDiniMillion .dm-pill{
 display:flex!important;align-items:center!important;justify-content:center!important;
 box-sizing:border-box!important;min-width:0!important;min-height:44px!important;
 padding:7px 5px!important;border:2px solid #4a5a9a!important;border-radius:24px!important;
 background:#101a38!important;color:#fff!important;
 font:800 clamp(11px,3.2vw,14px)/1.15 system-ui,sans-serif!important;
 text-align:center!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;
}
#arenaDiniMillion .dm-pill.gold{border-color:#ffb300!important;color:#ffe27a!important;background:#171b2c!important}
#arenaDiniMillion .dm-pill.dm-player{justify-content:flex-start!important;text-align:left!important;padding-left:10px!important}#arenaDiniMillion .dm-pill.gold{justify-self:center!important;text-align:center!important}
#arenaDiniMillion .dm-pill.dm-voice{border-color:#4a78ba!important;color:#bfe7ff!important;background:#102443!important}
#arenaDiniMillion .dm-home{
 display:block!important;width:100%!important;min-height:66px!important;margin:14px 0 0!important;
 border:2px solid #59677e!important;border-radius:24px!important;
 background:#222f45!important;color:#a9b7dc!important;
 font-size:clamp(20px,5.5vw,27px)!important;font-weight:900!important;
}
#arenaDiniMillion .dm-feedback{margin:10px auto 0!important;color:#b6f0d2!important}
@media(max-width:390px){
 #arenaDiniMillion{padding-left:10px!important;padding-right:10px!important}
 #arenaDiniMillion .dm-table{padding:12px!important}
 #arenaDiniMillion .dm-question{padding:16px 12px!important}
 #arenaDiniMillion .dm-answer{min-height:54px!important;padding:11px 12px!important}
 #arenaDiniMillion .dm-tools .dm-btn{min-height:48px!important;font-size:12px!important}
 #arenaDiniMillion .dm-pill{font-size:11px!important}
}
`;document.head.appendChild(st);root=document.createElement("section");root.id="arenaDiniMillion";document.body.appendChild(root);root.addEventListener("click",e=>{let b=e.target.closest("[data-dm]");if(!b)return;let a=b.dataset.dm;if(a==="close"){stopVoice();clearInterval(timer);root.classList.remove("open");window.dispatchEvent(new Event("arena:game-close"));}if(a==="answer")answer(+b.dataset.i);if(a==="voice"){tts=true;try{localStorage.setItem("arena_question_voice","1");}catch(e){}speak();}if(a==="gold"){if(window.Ekonomi&&Ekonomi.dukkan)Ekonomi.dukkan();}if(a==="half")half();if(a==="audience")audience();if(a==="double"){if(!state.used.double&&!state.lock){state.used.double=true;state.double=true;render();}}if(a==="new")start();if(a==="home"){root.classList.remove("open");stopVoice();clearInterval(timer);window.dispatchEvent(new Event("arena:home"));}});}
function render(msg){
 mount();clearInterval(timer);let q=state.deck[state.i];
 let ad=(window.Ekonomi&&typeof Ekonomi.ad==="function"?Ekonomi.ad():"Oyuncu")||"Oyuncu";
 let altin=(window.Ekonomi&&typeof Ekonomi.altin==="function"?Ekonomi.altin():null);
 ad=String(ad).replace(/[&<>"]/g,"");
 root.innerHTML='<div class="dm-head"><button class="dm-icon" data-dm="home" aria-label="Ana menü">☰</button><div class="dm-brand">ARENA<small>OYUN PLATFORMU</small></div><button class="dm-icon" data-dm="close" aria-label="Oyunu kapat">×</button></div>'+
 '<div class="dm-table"><div class="dm-top"><b>Seviye 1</b><span>❤️ '+state.lives+'</span><b>Soru '+(state.i+1)+'/15</b></div>'+
 '<div class="dm-progressbar"><i style="width:'+((state.i)/15*100)+'%"></i></div>'+
 '<div class="dm-question">'+(msg||q[0])+'</div><div class="dm-answers">'+q[1].map((x,i)=>'<button class="dm-answer" data-dm="answer" data-i="'+i+'" '+(state.lock||state.eliminated.includes(i)?"disabled":"")+'>'+"ABCD"[i]+") "+x+'</button>').join("")+'</div>'+
 '<div class="dm-tools"><button class="dm-btn" data-dm="half" '+(state.used.half?"disabled":"")+'>✂️ 50:50</button><button class="dm-btn" data-dm="audience" '+(state.used.audience?"disabled":"")+'>👥 Seyirci</button><button class="dm-btn" data-dm="double" '+(state.used.double?"disabled":"")+'>🛡️ Çift Cevap</button></div>'+
 '<div class="dm-footer"><div class="dm-pill dm-player">👤 '+ad+'</div><button type="button" class="dm-pill gold" data-dm="gold">🪙 '+(altin==null?"Altın":Number(altin).toLocaleString("tr-TR"))+' +</button><button type="button" class="dm-pill dm-voice" data-dm="voice">🔊 Soruyu dinle</button></div>'+
 '<button type="button" class="dm-home" data-dm="home">Ana Menü</button></div>'+
 (state.feedback?'<div class="dm-feedback">'+state.feedback+'</div>':"");
 root.classList.add("open");if(!state.lock)speak();
}
function answer(i){
 if(state.lock||state.eliminated.includes(i))return;
 const q=state.deck[state.i],bs=root.querySelectorAll(".dm-answer");
 if(i===q[2]){
  state.lock=true;stopVoice();bs[q[2]].classList.add("correct");state.double=false;state.feedback="Doğru cevap!";
  renderFeedback();
  if(state.i===14){setTimeout(()=>renderEnd("TEBRİKLER! DİNİ İMTİHAN TAMAMLADIN! 10.000.000 puanlık büyük ödül."),750);return;}
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
function renderEnd(msg){clearInterval(timer);stopVoice();root.innerHTML='<div class="dm-brand" style="font-size:26px;margin:15vh 0 20px">🕌 DİNİ İMTİHAN</div><div class="dm-result">'+msg+'</div><div class="dm-tools"><button class="dm-btn" data-dm="new">Yeniden oyna</button><button class="dm-btn" data-dm="home">Ana sayfa</button></div>';root.classList.add("open");}
function half(){if(state.used.half||state.lock)return;state.used.half=true;let q=state.deck[state.i],wrong=shuffle([0,1,2,3].filter(i=>i!==q[2]));state.eliminated.push(...wrong.slice(0,2));render();}
function audience(){if(state.used.audience||state.lock)return;state.used.audience=true;const q=state.deck[state.i],correct=55+Math.floor(Math.random()*31),others=shuffle([0,1,2,3].filter(i=>i!==q[2])),left=100-correct,p=[0,0,0,0];p[q[2]]=correct;let rest=left;others.forEach((ix,n)=>{const v=n===2?rest:Math.floor(Math.random()*(rest+1));p[ix]=v;rest-=v;});state.feedback="Seyirci oylaması: "+p.map((v,i)=>"ABCD"[i]+" %"+v).join(" · ");render();}
function start(){state={deck:shuffle(questions).slice(0,15),i:0,lives:3,used:{half:false,audience:false,double:false},double:false,eliminated:[],feedback:"",lock:false};state.deck=state.deck.map(q=>{let opts=q[1].map((x,i)=>({x,ok:i===q[2]}));opts=shuffle(opts);return [q[0],opts.map(o=>o.x),opts.findIndex(o=>o.ok)];});render();}
function open(){start();}
const btn=document.createElement("button");btn.type="button";btn.textContent="__ARENA_DINI_MILYONER__";btn.style.cssText="position:absolute!important;left:-10000px!important;width:1px!important;height:1px!important";btn.addEventListener("click",open);document.getElementById("ana").appendChild(btn);
window.ArenaDiniMilyoner={ac:open};
})();