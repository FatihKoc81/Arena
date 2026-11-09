const ALLOWED_ORIGINS=new Set(["https://fatihkoc81.github.io","https://localhost","http://localhost"]);
function cors(origin){return {"Access-Control-Allow-Origin":origin&&ALLOWED_ORIGINS.has(origin)?origin:"*","Access-Control-Allow-Methods":"GET, POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type, Authorization","Access-Control-Max-Age":"86400","Vary":"Origin"}}
function json(data,status=200,origin=""){return new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store",...cors(origin)}})}
function auth(req,env,name){return !!env[name]&&req.headers.get("Authorization")==="Bearer "+env[name]}
const idOk=s=>/^[a-zA-Z0-9_-]{8,100}$/.test(String(s||""));
export default {async fetch(request,env){
 const origin=request.headers.get("Origin")||"",url=new URL(request.url),p=url.pathname;
 if(request.method==="OPTIONS"){if(origin&&!ALLOWED_ORIGINS.has(origin))return json({error:"Origin not allowed"},403,origin);return new Response(null,{status:204,headers:cors(origin)})}
 if(origin&&!ALLOWED_ORIGINS.has(origin))return json({error:"Origin not allowed"},403,origin);
 if(request.method==="GET"&&p==="/health")return json({ok:true,service:"ARENA Test Agent",recording:!!env.RECORDINGS},200,origin);
 if(request.method==="POST"&&p==="/report"){
  if(!auth(request,env,"DEVICE_INGEST_KEY"))return json({error:"Unauthorized"},401,origin);
  let d;try{d=await request.json()}catch{return json({error:"Invalid JSON"},400,origin)}
  const payload=JSON.stringify(d.payload||{});if(payload.length>16000)return json({error:"Payload too large"},413,origin);
  try{await env.DB.prepare("INSERT INTO test_reports (device_id,device_name,app_version,event_type,payload_json) VALUES (?,?,?,?,?)").bind(String(d.deviceId||"").slice(0,80),String(d.deviceName||"Android").slice(0,80),String(d.appVersion||"web").slice(0,40),String(d.eventType||"heartbeat").slice(0,40),payload).run();return json({ok:true,received:true},201,origin)}catch(e){return json({error:"Database write failed",detail:String(e.message||e)},500,origin)}
 }
 if(request.method==="POST"&&p==="/session"){
  if(!auth(request,env,"DEVICE_INGEST_KEY"))return json({error:"Unauthorized"},401,origin);
  let d;try{d=await request.json()}catch{return json({error:"Invalid JSON"},400,origin)}
  const sid=crypto.randomUUID();try{await env.DB.prepare("INSERT INTO test_sessions(session_id,device_id,device_name,started_at,event_count) VALUES(?,?,?,?,0)").bind(sid,String(d.deviceId||"").slice(0,100),String(d.deviceName||"Android").slice(0,80),String(d.startedAt||new Date().toISOString())).run();return json({ok:true,sessionId:sid},201,origin)}catch(e){return json({error:"Session create failed",detail:String(e.message||e)},500,origin)}
 }
 if(request.method==="POST"&&p==="/event"){
  if(!auth(request,env,"DEVICE_INGEST_KEY"))return json({error:"Unauthorized"},401,origin);
  let d;try{d=await request.json()}catch{return json({error:"Invalid JSON"},400,origin)}
  if(!idOk(d.sessionId))return json({error:"Invalid session id"},400,origin);
  const payload=JSON.stringify(d.payload||{});if(payload.length>8000)return json({error:"Event too large"},413,origin);
  try{await env.DB.prepare("INSERT INTO test_events(session_id,event_type,payload_json) VALUES(?,?,?)").bind(d.sessionId,String(d.eventType||"event").slice(0,50),payload).run();await env.DB.prepare("UPDATE test_sessions SET event_count=event_count+1 WHERE session_id=?").bind(d.sessionId).run();return json({ok:true},201,origin)}catch(e){return json({error:"Event save failed",detail:String(e.message||e)},500,origin)}
 }
 if(request.method==="POST"&&p.startsWith("/recording/")){
  if(!auth(request,env,"DEVICE_INGEST_KEY"))return json({error:"Unauthorized"},401,origin);
  if(!env.RECORDINGS)return json({error:"Cloudflare R2 binding RECORDINGS is missing"},503,origin);
  const sid=decodeURIComponent(p.slice("/recording/".length));if(!idOk(sid))return json({error:"Invalid session id"},400,origin);
  const len=Number(request.headers.get("Content-Length")||0);if(len>150000000)return json({error:"Video exceeds 150 MB limit"},413,origin);
  const bytes=await request.arrayBuffer();if(bytes.byteLength>150000000)return json({error:"Video exceeds 150 MB limit"},413,origin);
  const key="sessions/"+sid+"/screen.webm";await env.RECORDINGS.put(key,bytes,{httpMetadata:{contentType:request.headers.get("Content-Type")||"video/webm"}});
  await env.DB.prepare("UPDATE test_sessions SET video_key=? WHERE session_id=?").bind(key,sid).run();return json({ok:true,bytes:bytes.byteLength},201,origin)
 }
 if(request.method==="POST"&&p.startsWith("/session/")&&p.endsWith("/finish")){
  if(!auth(request,env,"DEVICE_INGEST_KEY"))return json({error:"Unauthorized"},401,origin);
  const sid=decodeURIComponent(p.slice(9,-7));let d={};try{d=await request.json()}catch{}
  await env.DB.prepare("UPDATE test_sessions SET ended_at=? WHERE session_id=?").bind(String(d.endedAt||new Date().toISOString()),sid).run();return json({ok:true},200,origin)
 }
 if(request.method==="GET"&&p==="/sessions"){
  if(!auth(request,env,"ADMIN_READ_KEY"))return json({error:"Unauthorized"},401,origin);
  const limit=Math.max(1,Math.min(100,Number(url.searchParams.get("limit")||30)));const r=await env.DB.prepare("SELECT session_id,device_name,started_at,ended_at,event_count,video_key FROM test_sessions ORDER BY started_at DESC LIMIT ?").bind(limit).all();return json({ok:true,sessions:r.results||[]},200,origin)
 }
 if(request.method==="GET"&&p.startsWith("/events/")){
  if(!auth(request,env,"ADMIN_READ_KEY"))return json({error:"Unauthorized"},401,origin);
  const sid=decodeURIComponent(p.slice("/events/".length));const r=await env.DB.prepare("SELECT created_at,event_type,payload_json FROM test_events WHERE session_id=? ORDER BY id ASC LIMIT 2000").bind(sid).all();return json({ok:true,events:r.results||[]},200,origin)
 }
 if(request.method==="GET"&&p.startsWith("/recording/")){
  if(!auth(request,env,"ADMIN_READ_KEY"))return json({error:"Unauthorized"},401,origin);
  if(!env.RECORDINGS)return json({error:"Cloudflare R2 binding RECORDINGS is missing"},503,origin);
  const sid=decodeURIComponent(p.slice("/recording/".length));const row=await env.DB.prepare("SELECT video_key FROM test_sessions WHERE session_id=?").bind(sid).first();if(!row||!row.video_key)return json({error:"Video not found"},404,origin);
  const obj=await env.RECORDINGS.get(row.video_key);if(!obj)return json({error:"Video object not found"},404,origin);
  return new Response(obj.body,{headers:{"Content-Type":obj.httpMetadata?.contentType||"video/webm","Cache-Control":"no-store",...cors(origin)}})
 }
 return json({error:"Not found"},404,origin)
}};
