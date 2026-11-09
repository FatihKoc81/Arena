/* ARENA inline test recorder */
(function(){
"use strict";

let endpoint="",key="",device="Android telefon";
function loadConfig(){endpoint=(localStorage.getItem("arenaTestEndpoint")||"").replace(/\/$/,"");key=localStorage.getItem("arenaTestKey")||"";device=localStorage.getItem("arenaTestDevice")||"Android telefon";return !!(endpoint&&key)}
const deviceId=localStorage.getItem("arenaTestDeviceId")||("android-"+(crypto.randomUUID?crypto.randomUUID():Date.now()));
loadConfig();localStorage.setItem("arenaTestDeviceId",deviceId);
let sid=localStorage.getItem("arenaTestActiveSession")||"",started=Number(localStorage.getItem("arenaTestStarted")||0),count=Number(localStorage.getItem("arenaTestCount")||0),busy=false,listener=null;
const panel=document.createElement("div");panel.id="arena-inline-recorder";panel.classList.add("is-collapsed");
panel.innerHTML='<div class="air-head"><b>ARENA TEST KAYDI</b><button type="button" id="air-hide">−</button></div><div class="air-status" id="air-status">Kayıt hazır</div><div class="air-actions"><button type="button" id="air-start">● Kaydı başlat</button><button type="button" id="air-stop" disabled>■ Kaydı bitir<br>ve gönder</button></div><button type="button" id="air-share" style="display:block;width:100%;margin-top:7px;background:#168765">Son kaydı ChatGPT’ye gönder</button>';
const css=document.createElement("style");css.textContent='#arena-inline-recorder{position:fixed;z-index:2147483000;right:10px;bottom:calc(12px + env(safe-area-inset-bottom));width:min(290px,calc(100vw - 20px));padding:10px;border:1px solid #45618f;border-radius:14px;background:#101c38;color:#fff;box-shadow:0 5px 24px #0008;font:14px system-ui,sans-serif}#arena-inline-recorder .air-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:7px}#arena-inline-recorder button{border:0;border-radius:9px;padding:9px 10px;color:#fff;background:#247cf0;font-weight:800;font-size:13px}#arena-inline-recorder #air-hide{background:#334666;padding:3px 10px}#arena-inline-recorder .air-status{font-size:12px;color:#c7d5f2;margin:4px 0 8px}#arena-inline-recorder .air-actions{display:grid;grid-template-columns:1fr 1fr;gap:7px}#arena-inline-recorder #air-stop{background:#b8324b}#arena-inline-recorder button:disabled{opacity:.45}';
css.textContent+='#arena-inline-recorder.is-collapsed{width:auto;min-width:150px;padding:8px 10px}#arena-inline-recorder.is-collapsed .air-status,#arena-inline-recorder.is-collapsed .air-actions{display:none}#arena-inline-recorder.is-collapsed .air-head{margin:0;gap:12px}#arena-inline-recorder.is-collapsed #air-hide{min-width:30px}';document.head.append(css);document.body.append(panel);
const $=id=>document.getElementById(id),status=t=>$("air-status").textContent=t;
async function api(path,body){const r=await fetch(endpoint+path,{method:"POST",headers:{"Authorization":"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify(body||{})});const d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.error||"HTTP "+r.status);return d}
async function readApi(path,token){const r=await fetch(endpoint+path,{headers:{"Authorization":"Bearer "+token}});const d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.error||"HTTP "+r.status);return d}
function attachRecorder(){if(listener)return;listener=e=>{if(!sid||panel.contains(e.target))return;const el=e.target.closest("button,a,[role=button],[onclick]")||e.target;event("tap",{x:Math.round(e.clientX),y:Math.round(e.clientY),tag:el.tagName,id:el.id||"",className:String(el.className||"").slice(0,160),text:String(el.innerText||el.textContent||"").trim().slice(0,160),url:location.href,viewport:{width:innerWidth,height:innerHeight,scrollY}})};document.addEventListener("click",listener,true)}
async function event(type,detail){if(!sid)return;try{await api("/event",{sessionId:sid,deviceId,eventType:type,payload:{at:new Date().toISOString(),elapsedMs:Date.now()-started,type,detail}});count++;localStorage.setItem("arenaTestCount",String(count));status("Kayıt sürüyor · "+count+" olay")}catch(e){status("Gönderim hatası: "+e.message)}}
function setCollapsed(value){panel.classList.toggle("is-collapsed",!!value);$("air-hide").textContent=value?"＋":"−";$("air-hide").setAttribute("aria-label",value?"Kayıt panelini aç":"Kayıt panelini küçült")}
setCollapsed(false);$("air-hide").onclick=()=>setCollapsed(!panel.classList.contains("is-collapsed"));
const adminToken=()=>localStorage.getItem("arenaTestAdminKey")||"";

$("air-share").onclick=async()=>{
 const btn=$("air-share");
 let token=adminToken();
 if(!token){
  token=window.prompt("Test kayıtlarını okuyabilmek için yönetici okuma anahtarını girin:");
  if(!token){status("Yönetici anahtarı girilmedi");return}
  try{localStorage.setItem("arenaTestAdminKey",token.trim());token=token.trim()}catch(e){}
 }
 if(!token){status("Yönetici anahtarı boş");return}
 btn.disabled=true;
 try{
  status("Son kayıt sunucudan alınıyor…");
  const list=await readApi("/sessions?limit=1",token);
  if(!list.sessions||!list.sessions.length)throw Error("Sunucuda kayıt bulunamadı");
  const s=list.sessions[0];
  const data=await readApi("/events/"+encodeURIComponent(s.session_id),token);
  const lines=(data.events||[]).map((x,i)=>{
   let p=x.payload_json;
   try{p=JSON.stringify(JSON.parse(p),null,2)}catch(e){}
   return (i+1)+". "+x.event_type+" · "+new Date(x.created_at).toLocaleTimeString("tr-TR")+"\\n"+p
  });
  const report=["ARENA TEST KAYDI","Tarih: "+new Date(s.started_at).toLocaleString("tr-TR"),"Cihaz: "+s.device_name,"Olay sayısı: "+s.event_count,"Oturum: "+s.session_id,"","OLAYLAR",...lines].join("\\n");
  if(navigator.share){
   try{
    await navigator.share({title:"ARENA test kaydı",text:report});
    status("Paylaşım menüsü açıldı. Listeden ChatGPT’yi seçin.");
   }catch(shareError){
    if(shareError&&shareError.name==="AbortError"){status("Paylaşım iptal edildi; kayıt sunucuda duruyor.");return}
    throw shareError;
   }
  }else{
   let copied=false;
   try{if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(report);copied=true}}catch(e){}
   if(!copied){
    const area=document.createElement("textarea");area.value=report;area.style.cssText="position:fixed;left:-9999px;top:0;opacity:0";document.body.append(area);area.focus();area.select();
    try{copied=!!document.execCommand("copy")}catch(e){}area.remove();
   }
   if(copied)status("Kayıt kopyalandı. ChatGPT sohbetine yapıştırın.");
   else{const area=document.createElement("textarea");area.value=report;area.style.cssText="position:fixed;inset:12px;width:calc(100% - 24px);height:70vh;z-index:2147483647;background:#fff;color:#000;padding:12px";document.body.append(area);area.focus();area.select();status("Otomatik kopyalama engellendi. Açılan metni seçip kopyalayın.")}
  }
 }catch(e){
  status("Gönderilemedi: "+(e&&e.message||e));
 }finally{btn.disabled=false}
};

$("air-start").onclick=async()=>{if(busy||sid)return;if(!loadConfig()){status("Önce Test Kayıt Merkezi’nde ayarları kaydedin");return}busy=true;try{const d=await api("/session",{deviceId,deviceName:device,startedAt:new Date().toISOString()});sid=d.sessionId;started=Date.now();count=0;localStorage.setItem("arenaTestActiveSession",sid);localStorage.setItem("arenaTestStarted",String(started));localStorage.setItem("arenaTestCount","0");$("air-start").disabled=true;$("air-stop").disabled=false;status("Kayıt başladı");await event("recording_started",{url:location.href});setCollapsed(false);attachRecorder();window.addEventListener("error",e=>event("app_error",{message:e.message,file:e.filename,line:e.lineno}));window.addEventListener("unhandledrejection",e=>event("promise_error",{message:String(e.reason&&e.reason.message||e.reason)}));}catch(e){status("Başlatılamadı: "+e.message);$("air-start").disabled=false}finally{busy=false}};
$("air-stop").onclick=async()=>{if(!sid||busy)return;loadConfig();if(!endpoint||!key){status("Kayıt ayarları bulunamadı");return}busy=true;$("air-stop").disabled=true;try{await event("recording_finished",{eventCount:count});const id=sid;await api("/session/"+encodeURIComponent(id)+"/finish",{endedAt:new Date().toISOString(),eventCount:count});sid="";localStorage.removeItem("arenaTestActiveSession");localStorage.removeItem("arenaTestStarted");localStorage.removeItem("arenaTestCount");if(listener)document.removeEventListener("click",listener,true);listener=null;$("air-start").disabled=false;status("Gönderildi ✓ · "+count+" olay")}catch(e){status("Gönderilemedi: "+e.message);$("air-stop").disabled=false}finally{busy=false}};
if(sid){$("air-start").disabled=true;$("air-stop").disabled=false;status("Önceki kayıt devam ediyor · "+count+" olay");attachRecorder();setCollapsed(true)}
})();