const ALLOWED_ORIGINS = new Set(["https://fatihkoc81.github.io","https://localhost","http://localhost"]);
function cors(origin) {
  const allowed = !origin || ALLOWED_ORIGINS.has(origin) ? (origin || "*") : "https://fatihkoc81.github.io";
  return {"Access-Control-Allow-Origin":allowed,"Access-Control-Allow-Methods":"GET, POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type, Authorization","Access-Control-Max-Age":"86400","Vary":"Origin"};
}
function json(data,status,origin) {
  return new Response(JSON.stringify(data),{status:status||200,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store",...cors(origin)}});
}
function authorized(request,env) {
  return !!env.DEVICE_INGEST_KEY && request.headers.get("Authorization")==="Bearer "+env.DEVICE_INGEST_KEY;
}
export default {
  async fetch(request,env) {
    const origin=request.headers.get("Origin")||"";
    const url=new URL(request.url);
    if(request.method==="OPTIONS") {
      if(origin&&!ALLOWED_ORIGINS.has(origin)) return json({error:"Origin not allowed"},403,origin);
      return new Response(null,{status:204,headers:cors(origin)});
    }
    if(origin&&!ALLOWED_ORIGINS.has(origin)) return json({error:"Origin not allowed"},403,origin);
    if(request.method==="GET"&&url.pathname==="/health")
      return json({ok:true,service:"ARENA Test Agent",time:new Date().toISOString()},200,origin);
    if(request.method==="POST"&&url.pathname==="/report") {
      if(!authorized(request,env)) return json({error:"Unauthorized"},401,origin);
      const length=Number(request.headers.get("Content-Length")||0);
      if(length>20000) return json({error:"Payload too large"},413,origin);
      let data;
      try { data=await request.json(); } catch(_) { return json({error:"Invalid JSON"},400,origin); }
      const deviceId=String(data.deviceId||"");
      const eventType=String(data.eventType||"heartbeat");
      if(!/^[a-zA-Z0-9_-]{8,80}$/.test(deviceId)) return json({error:"Invalid deviceId"},400,origin);
      if(!/^[a-zA-Z0-9_-]{1,40}$/.test(eventType)) return json({error:"Invalid eventType"},400,origin);
      const payload=JSON.stringify(data.payload||{});
      if(payload.length>16000) return json({error:"Payload too large"},413,origin);
      try {
        await env.DB.prepare("INSERT INTO test_reports (device_id, device_name, app_version, event_type, payload_json) VALUES (?, ?, ?, ?, ?)")
          .bind(deviceId,String(data.deviceName||"Android cihaz").slice(0,80),String(data.appVersion||"web").slice(0,40),eventType,payload).run();
        return json({ok:true,received:true},201,origin);
      } catch(e) {
        return json({error:"Database write failed",detail:String(e.message||e).slice(0,180)},500,origin);
      }
    }
    if(request.method==="GET"&&url.pathname==="/latest") {
      if(!authorized(request,env)) return json({error:"Unauthorized"},401,origin);
      const limit=Math.max(1,Math.min(100,Number(url.searchParams.get("limit")||30)));
      try {
        const result=await env.DB.prepare("SELECT id, created_at, device_id, device_name, app_version, event_type, payload_json FROM test_reports ORDER BY id DESC LIMIT ?").bind(limit).all();
        return json({ok:true,reports:result.results||[]},200,origin);
      } catch(e) {
        return json({error:"Database read failed",detail:String(e.message||e).slice(0,180)},500,origin);
      }
    }
    return json({error:"Not found"},404,origin);
  }
};
