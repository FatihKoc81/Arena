/* ARENA inline test recorder */
(function(){
"use strict";

let endpoint="",key="",device="Android telefon";
function loadConfig(){endpoint=(localStorage.getItem("arenaTestEndpoint")||"").replace(/\/$/,"");key=localStorage.getItem("arenaTestKey")||"";device=localStorage.getItem("arenaTestDevice")||"Android telefon";return !!(endpoint&&key)}
const deviceId=localStorage.getItem("arenaTestDeviceId")||("android-"+(crypto.randomUUID?crypto.randomUUID():Date.now()));
loadConfig();localStorage.setItem("arenaTestDeviceId",deviceId);
let sid=localStorage.getItem("arenaTestActiveSession")||"",started=Number(localStorage.getItem("arenaTestStarted")||0),count=Number(localStorage.getItem("arenaTestCount")||0),busy=false,listener=null,geometryTimer=null,geometryPrevious=null;
const panel=document.createElement("div");panel.id="arena-inline-recorder";panel.classList.add("is-collapsed");
panel.innerHTML='<div class="air-head"><b>ARENA TEST KAYDI</b><button type="button" id="air-hide">−</button></div><div class="air-status" id="air-status">Kayıt hazır</div><div class="air-actions"><button type="button" id="air-start">● Kaydı başlat</button><button type="button" id="air-stop" disabled>■ Kaydı bitir<br>ve gönder</button></div><button type="button" id="air-share" style="display:block;width:100%;margin-top:7px;background:#168765">Son kaydı ChatGPT’ye gönder</button>';
const css=document.createElement("style");css.textContent='#arena-inline-recorder{position:fixed;z-index:2147483000;right:10px;bottom:calc(12px + env(safe-area-inset-bottom));width:min(290px,calc(100vw - 20px));padding:10px;border:1px solid #45618f;border-radius:14px;background:#101c38;color:#fff;box-shadow:0 5px 24px #0008;font:14px system-ui,sans-serif}#arena-inline-recorder .air-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:7px}#arena-inline-recorder button{border:0;border-radius:9px;padding:9px 10px;color:#fff;background:#247cf0;font-weight:800;font-size:13px}#arena-inline-recorder #air-hide{background:#334666;padding:3px 10px}#arena-inline-recorder .air-status{font-size:12px;color:#c7d5f2;margin:4px 0 8px}#arena-inline-recorder .air-actions{display:grid;grid-template-columns:1fr 1fr;gap:7px}#arena-inline-recorder #air-stop{background:#b8324b}#arena-inline-recorder button:disabled{opacity:.45}';
css.textContent+='#arena-inline-recorder.is-collapsed{width:auto;min-width:150px;padding:8px 10px}#arena-inline-recorder.is-collapsed .air-status,#arena-inline-recorder.is-collapsed .air-actions{display:none}#arena-inline-recorder.is-collapsed .air-head{margin:0;gap:12px}#arena-inline-recorder.is-collapsed #air-hide{min-width:30px}';document.head.append(css);document.body.append(panel);
const $=id=>document.getElementById(id),status=t=>$("air-status").textContent=t;
async function api(path,body){const r=await fetch(endpoint+path,{method:"POST",headers:{"Authorization":"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify(body||{})});const d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.error||"HTTP "+r.status);return d}
async function readApi(path,token){const r=await fetch(endpoint+path,{headers:{"Authorization":"Bearer "+token}});const d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.error||"HTTP "+r.status);return d}
function layoutMetrics(){
 const pick=selector=>{const e=document.querySelector(selector);if(!e)return null;const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {selector,x:+r.x.toFixed(2),y:+r.y.toFixed(2),width:+r.width.toFixed(2),height:+r.height.toFixed(2),position:s.position,transform:s.transform,scale:s.scale,translate:s.translate}};
 const header=pick("h1"),profile=pick(".ar-profile,.ar-profile-row,[class*='profile']");
 const controls=[];
 document.querySelectorAll("button,a,[role=button],input,select,.ar-cat,.ar-game-card").forEach((e,i)=>{
  if(panel.contains(e))return;
  const r=e.getBoundingClientRect(),s=getComputedStyle(e);
  if(r.width<1||r.height<1||s.display==="none"||s.visibility==="hidden"||Number(s.opacity||1)===0)return;
  let sx=1,sy=1;if(s.transform&&s.transform!=="none"){try{const m=new DOMMatrixReadOnly(s.transform);sx=Math.hypot(m.a,m.b);sy=Math.hypot(m.c,m.d)}catch(_e){}}
  const label=String(e.innerText||e.value||e.getAttribute("aria-label")||"").trim().replace(/\\s+/g," ").slice(0,60);
  const cls=String(e.className||"").toString().trim().replace(/\\s+/g,".");
  controls.push({key:(e.id?"#"+e.id:e.tagName+"."+cls)+":"+label+":"+i,x:+r.x.toFixed(2),y:+r.y.toFixed(2),width:+r.width.toFixed(2),height:+r.height.toFixed(2),scaleX:+sx.toFixed(3),scaleY:+sy.toFixed(3),transform:s.transform,position:s.position});
 });
 return {viewport:{width:innerWidth,height:innerHeight,scrollY},header,profile,profileHeaderGap:header&&profile?+(profile.y-(header.y+header.height)).toFixed(2):null,controls};
}
function layoutChanges(before,after){
 const old=new Map((before.controls||[]).map(x=>[x.key,x])),now=new Map((after.controls||[]).map(x=>[x.key,x])),changes=[];
 for(const [key,n] of now){const p=old.get(key);if(!p){changes.push({kind:"added",key,after:n});continue}
  const delta={};["x","y","width","height","scaleX","scaleY","transform","position"].forEach(k=>{if(p[k]!==n[k])delta[k]={before:p[k],after:n[k]}});
  if(Object.keys(delta).length)changes.push({kind:"changed",key,delta});
 }
 for(const [key,p] of old)if(!now.has(key))changes.push({kind:"removed",key,before:p});
 const anchors={};["header","profile","profileHeaderGap","viewport"].forEach(k=>{if(JSON.stringify(before[k])!==JSON.stringify(after[k]))anchors[k]={before:before[k],after:after[k]}});
 return {changedCount:changes.length,changes:changes.slice(0,80),anchors};
}
async function startGeometryWatch(){
 if(geometryTimer)clearInterval(geometryTimer);
 geometryPrevious=layoutMetrics();
 await event("layout_baseline",{intervalMs:250,metrics:geometryPrevious,recorderVersion:"inline-geometry-20261110"});
 geometryTimer=setInterval(()=>{
  if(!sid)return;
  try{const current=layoutMetrics();if(!geometryPrevious){geometryPrevious=current;return}
   const diff=layoutChanges(geometryPrevious,current);
   if(diff.changedCount||Object.keys(diff.anchors).length)event("layout_change",{intervalMs:250,...diff});
   geometryPrevious=current;
  }catch(e){event("recorder_error",{stage:"geometry_watch",message:String(e.message||e)})}
 },250);
}
function attachRecorder(){if(listener)return;listener=e=>{if(!sid||panel.contains(e.target))return;const el=e.target.closest("button,a,[role=button],[onclick]")||e.target;event("tap",{x:Math.round(e.clientX),y:Math.round(e.clientY),tag:el.tagName,id:el.id||"",className:String(el.className||"").slice(0,160),text:String(el.innerText||el.textContent||"").trim().slice(0,160),url:location.href,viewport:{width:innerWidth,height:innerHeight,scrollY},layoutBefore:layoutMetrics()});setTimeout(()=>{if(sid)event("layout_snapshot",{reason:"tap-after-350ms",metrics:layoutMetrics()})},350)};document.addEventListener("click",listener,true)}
async function event(type,detail){if(!sid)return;try{await api("/event",{sessionId:sid,deviceId,eventType:type,payload:{at:new Date().toISOString(),elapsedMs:Date.now()-started,type,detail}});count++;localStorage.setItem("arenaTestCount",String(count));status("Kayıt sürüyor · "+count+" olay")}catch(e){status("Gönderim hatası: "+e.message)}}
function setCollapsed(value){panel.classList.toggle("is-collapsed",!!value);$("air-hide").textContent=value?"＋":"−";$("air-hide").setAttribute("aria-label",value?"Kayıt panelini aç":"Kayıt panelini küçült")}
setCollapsed(false);$("air-hide").onclick=()=>setCollapsed(!panel.classList.contains("is-collapsed"));
const adminToken=()=>localStorage.getItem("arenaTestAdminKey")||"";
let cachedLatestReport="",reportLoadPromise=null;
async function fetchLatestReport(token){
 const list=await readApi("/sessions?limit=1",token);
 if(!list.sessions||!list.sessions.length)throw Error("Sunucuda kayıt bulunamadı");
 const s=list.sessions[0];
 const data=await readApi("/events/"+encodeURIComponent(s.session_id),token);
 const lines=(data.events||[]).map((x,i)=>{
  let p=x.payload_json;
  try{p=JSON.stringify(JSON.parse(p),null,2)}catch(e){}
  return (i+1)+". "+x.event_type+" · "+new Date(x.created_at).toLocaleTimeString("tr-TR")+"\\n"+p
 });
 return ["ARENA TEST KAYDI","Tarih: "+new Date(s.started_at).toLocaleString("tr-TR"),"Cihaz: "+s.device_name,"Olay sayısı: "+s.event_count,"Oturum: "+s.session_id,"","OLAYLAR",...lines].join("\\n");
}
function prefetchLatestReport(){
 const token=adminToken();
 if(!token)return;
 reportLoadPromise=fetchLatestReport(token).then(report=>{cachedLatestReport=report;return report}).catch(e=>{reportLoadPromise=null;return null});
}
prefetchLatestReport();

$("air-share").onclick=async()=>{
 const btn=$("air-share");
 let token=adminToken();
 if(!token){
  token=window.prompt("Test kayıtlarını okuyabilmek için yönetici okuma anahtarını girin:");
  if(!token){status("Yönetici anahtarı girilmedi");return}
  token=token.trim();
  if(!token){status("Yönetici anahtarı boş");return}
  try{localStorage.setItem("arenaTestAdminKey",token)}catch(e){}
 }
 if(!cachedLatestReport){
  btn.disabled=true;
  try{
   status("Rapor hazırlanıyor. Hazır olunca aynı düğmeye tekrar basın…");
   cachedLatestReport=await (reportLoadPromise||fetchLatestReport(token));
   reportLoadPromise=null;
   status("Rapor hazır. Şimdi Son kaydı ChatGPT’ye gönder düğmesine tekrar basın.");
  }catch(e){status("Gönderilemedi: "+(e&&e.message||e))}
  finally{btn.disabled=false}
  return;
 }
 const report=cachedLatestReport;
 btn.disabled=true;
 let sharePromise=null;
 if(navigator.share){
  try{
   // Call Web Share synchronously in the user's click handler to preserve Android user activation.
   sharePromise=navigator.share({title:"ARENA test kaydı",text:report});
  }catch(e){sharePromise=Promise.reject(e)}
 }
 if(sharePromise){
  try{
   await sharePromise;
   status("Paylaşım menüsü açıldı. Listeden ChatGPT’yi seçin.");
   cachedLatestReport="";
   prefetchLatestReport();
  }catch(e){
   if(e&&e.name==="AbortError"){status("Paylaşım iptal edildi; kayıt sunucuda duruyor.");return}
   status("Android paylaşımı açılamadı. Rapor panoya kopyalanıyor…");
   let copied=false;
   try{if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(report);copied=true}}catch(_e){}
   if(copied)status("Paylaşım açılamadı; kayıt kopyalandı. ChatGPT’ye yapıştırın.");
   else status("Paylaşım açılamadı. Raporu yeniden yükleyip tekrar deneyin.");
  }finally{btn.disabled=false}
  return;
 }
 let copied=false;
 try{if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(report);copied=true}}catch(e){}
 if(copied)status("Kayıt kopyalandı. ChatGPT sohbetine yapıştırın.");
 else{
  const area=document.createElement("textarea");area.value=report;area.setAttribute("readonly","");
  area.style.cssText="position:fixed;inset:12px;width:calc(100% - 24px);height:70vh;z-index:2147483647;background:#fff;color:#000;padding:12px;font:13px monospace";
  document.body.append(area);area.focus();area.select();
  status("Metin seçildi. Kopyala deyip ChatGPT sohbetine yapıştırın.");
 }
 btn.disabled=false;
};

$("air-start").onclick=async()=>{if(busy||sid)return;if(!loadConfig()){status("Önce Test Kayıt Merkezi’nde ayarları kaydedin");return}busy=true;try{const d=await api("/session",{deviceId,deviceName:device,startedAt:new Date().toISOString()});sid=d.sessionId;started=Date.now();count=0;localStorage.setItem("arenaTestActiveSession",sid);localStorage.setItem("arenaTestStarted",String(started));localStorage.setItem("arenaTestCount","0");$("air-start").disabled=true;$("air-stop").disabled=false;status("Kayıt başladı");await event("recording_started",{url:location.href,geometryEnabled:true,geometryIntervalMs:250,recorderVersion:"inline-geometry-20261110"});setCollapsed(false);attachRecorder();await startGeometryWatch();window.addEventListener("error",e=>event("app_error",{message:e.message,file:e.filename,line:e.lineno}));window.addEventListener("unhandledrejection",e=>event("promise_error",{message:String(e.reason&&e.reason.message||e.reason)}));}catch(e){status("Başlatılamadı: "+e.message);$("air-start").disabled=false}finally{busy=false}};
$("air-stop").onclick=async()=>{if(!sid||busy)return;loadConfig();if(!endpoint||!key){status("Kayıt ayarları bulunamadı");return}busy=true;$("air-stop").disabled=true;if(geometryTimer){clearInterval(geometryTimer);geometryTimer=null}try{await event("recording_finished",{eventCount:count,geometryEnabled:true});const id=sid;await api("/session/"+encodeURIComponent(id)+"/finish",{endedAt:new Date().toISOString(),eventCount:count});sid="";localStorage.removeItem("arenaTestActiveSession");localStorage.removeItem("arenaTestStarted");localStorage.removeItem("arenaTestCount");if(listener)document.removeEventListener("click",listener,true);listener=null;$("air-start").disabled=false;status("Gönderildi ✓ · "+count+" olay");cachedLatestReport="";prefetchLatestReport()}catch(e){status("Gönderilemedi: "+e.message);$("air-stop").disabled=false}finally{busy=false}};
if(sid){$("air-start").disabled=true;$("air-stop").disabled=false;status("Önceki kayıt devam ediyor · "+count+" olay");attachRecorder();setCollapsed(true)}
})();