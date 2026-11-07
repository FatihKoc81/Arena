
const PROJECT_ID = "arena-mobile-1453";
const DATABASE_URL = "https://arena-mobile-1453-default-rtdb.europe-west1.firebasedatabase.app";
const APP_NODE = "arena";

const ALLOWED_ORIGINS = new Set([
  "https://fatihkoc81.github.io",
  "https://localhost",
  "capacitor://localhost",
  "http://localhost"
]);

let cachedAccessToken = null;
let cachedAccessTokenExpiry = 0;

const MESSAGES = {
  invite: ["⚔️ ARENA düello daveti", "Bir oyuncu seni düelloya çağırıyor."],
  invite_accepted: ["✅ Düello davetin kabul edildi", "Rakibin düelloyu kabul etti. ARENA'ya katıl!"],
  request: ["📨 ARENA oyun isteği", "Bir oyuncu seni 48 saat geçerli oyun isteğine çağırıyor."],
  request_accepted: ["✅ Oyun isteğin kabul edildi", "Oyuncu isteğini kabul etti."],
  request_start: ["▶️ ARENA oyunu başlıyor", "Rakibin oyunu başlattı. Katıl!"],
  match: ["⚔️ Meydan Oku eşleşmesi", "Bir rakiple eşleştirildin. Oyuna katıl!"],
  tournament_join: ["🏆 Turnuvana oyuncu katıldı", "Turnuvana yeni bir oyuncu katıldı."],
  tournament_start: ["🏆 Turnuva başladı", "Turnuvanın ilk maçları hazır. ARENA'ya gir!"],
  tournament_match: ["🏆 Turnuva maçın hazır", "Rakibinle maçın hazır. ARENA'ya katıl!"],
  tournament_champion: ["🏆 Turnuva tamamlandı", "Turnuvanın şampiyonu belli oldu."],
  duel_result: ["🏁 Düello tamamlandı", "Düello sonucu belli oldu. Sonucunu görmek için ARENA'yı aç."]
};

function corsHeaders(origin) {
  const allowed = !origin || ALLOWED_ORIGINS.has(origin)
    ? (origin || "*")
    : "https://fatihkoc81.github.io";

  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function reply(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(origin)
    }
  });
}

function b64url(input) {
  const bytes = typeof input === "string"
    ? new TextEncoder().encode(input)
    : new Uint8Array(input);

  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function pemBytes(pem) {
  const clean = pem.replace(
    /-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g,
    ""
  );

  const binary = atob(clean);
  const out = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    out[i] = binary.charCodeAt(i);
  }

  return out.buffer;
}

async function serviceAccessToken(env) {
  const now = Math.floor(Date.now() / 1000);

  if (cachedAccessToken && cachedAccessTokenExpiry > now + 60) {
    return cachedAccessToken;
  }

  const sa = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT);

  const header = b64url(JSON.stringify({
    alg: "RS256",
    typ: "JWT"
  }));

  const payload = b64url(JSON.stringify({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/firebase.database https://www.googleapis.com/auth/firebase.messaging",
    aud: sa.token_uri || "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3500
  }));

  const unsigned = header + "." + payload;

  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemBytes(sa.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(unsigned)
  );

  const assertion = unsigned + "." + b64url(signature);

  const tokenResponse = await fetch(
    sa.token_uri || "https://oauth2.googleapis.com/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion
      })
    }
  );

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok || !tokenData.access_token) {
    throw new Error("Google servis yetkilendirmesi başarısız");
  }

  cachedAccessToken = tokenData.access_token;
  cachedAccessTokenExpiry = now + (tokenData.expires_in || 3500);

  return cachedAccessToken;
}

async function verifyFirebaseUser(idToken, env) {
  const r = await fetch(
    "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" +
    encodeURIComponent(env.FIREBASE_API_KEY || ""),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken })
    }
  );

  const d = await r.json();

  if (!r.ok || !d.users || !d.users[0] || !d.users[0].localId) {
    throw new Error("Firebase oturumu doğrulanamadı");
  }

  return d.users[0].localId;
}

async function dbGet(path, accessToken) {
  const url = DATABASE_URL + "/" +
    path.split("/").map(encodeURIComponent).join("/") + ".json";

  const r = await fetch(url, {
    headers: {
      Authorization: "Bearer " + accessToken
    }
  });

  if (!r.ok) {
    const detail = await r.text().catch(() => "");
    throw new Error(
      "Firebase verisi okunamadı (HTTP " +
      r.status + "): " + detail.slice(0, 500)
    );
  }

  return r.json();
}

async function allowedEvent(type, eventId, matchKey, fromUid, toUid, accessToken) {
  const root = "apps/" + APP_NODE + "/";

  if (type === "invite") {
    const v = await dbGet(
      root + "invites/" + toUid + "/" + eventId,
      accessToken
    );

    return !!v && v.from === fromUid && v.durum === "bekliyor";
  }

  if (type === "invite_accepted") {
    const v = await dbGet(
      root + "invites/" + fromUid + "/" + eventId,
      accessToken
    );

    return !!v && v.from === toUid && v.durum === "kabul" && !!v.duel;
  }

  if (type === "request" || type === "request_accepted" || type === "request_start") {
    const v = await dbGet(root + "istekler/" + eventId, accessToken);

    if (!v) return false;

    if (type === "request") {
      return v.from === fromUid && v.to === toUid && v.durum === "bekliyor";
    }

    if (type === "request_accepted") {
      return v.from === toUid && v.to === fromUid && v.durum === "kabul";
    }

    return v.from === fromUid && v.to === toUid &&
      v.durum === "basla" && !!v.duel;
  }

  if (type === "match" || type === "duel_result") {
    const d = await dbGet(root + "duels/" + eventId, accessToken);

    if (!d || !(
      (d.a === fromUid && d.b === toUid) ||
      (d.b === fromUid && d.a === toUid)
    )) {
      return false;
    }

    if (type === "match") return true;

    return !!d.kazanan && d.kazanan.uid === fromUid;
  }

  if (type === "tournament_join" || type === "tournament_start") {
    const t = await dbGet(root + "turnuva/" + eventId, accessToken);

    if (!t || !t.oyuncular ||
        !t.oyuncular[fromUid] || !t.oyuncular[toUid]) {
      return false;
    }

    if (type === "tournament_join") {
      return t.durum === "bekliyor" && t.olusturan === toUid;
    }

    return t.durum === "basladi";
  }

  if (type === "tournament_match") {
    if (!matchKey || !/^(y1|y2|f)$/.test(matchKey)) return false;

    const t = await dbGet(root + "turnuva/" + eventId, accessToken);
    const m = t && t.maclar && t.maclar[matchKey];

    return !!m && m.duel &&
      ((m.a === fromUid && m.b === toUid) ||
       (m.b === fromUid && m.a === toUid));
  }

  if (type === "tournament_champion") {
    const t = await dbGet(root + "turnuva/" + eventId, accessToken);

    return !!t && t.durum === "bitti" &&
      t.sampiyon === fromUid &&
      !!t.oyuncular && !!t.oyuncular[toUid];
  }

  return false;
}

async function sendToToken(token, title, body, eventType, accessToken) {
  const r = await fetch(
    "https://fcm.googleapis.com/v1/projects/" +
    PROJECT_ID + "/messages:send",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: {
          token,
          notification: { title, body },
          data: {
            eventType: String(eventType),
            url: "https://fatihkoc81.github.io/Arena/"
          },
          webpush: {
            fcmOptions: {
              link: "https://fatihkoc81.github.io/Arena/"
            },
            notification: {
              icon: "https://fatihkoc81.github.io/Arena/icon-192.png",
              badge: "https://fatihkoc81.github.io/Arena/icon-192.png"
            }
          },
          android: {
            priority: "HIGH",
            notification: {
              channel_id: "default",
              click_action: "FCM_PLUGIN_ACTIVITY"
            }
          }
        }
      })
    }
  );

  const raw = await r.text();
  let data;

  try {
    data = raw ? JSON.parse(raw) : {};
  } catch (_) {
    data = { raw: raw.slice(0, 500) };
  }

  return {
    ok: r.ok,
    status: r.status,
    data
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin)
      });
    }

    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return reply({ ok: true, service: "ARENA push gateway" }, 200, origin);
    }

    if (request.method !== "POST" || url.pathname !== "/send") {
      return reply({ error: "Not found" }, 404, origin);
    }

    if (origin && !ALLOWED_ORIGINS.has(origin)) {
      return reply({ error: "Origin not allowed" }, 403, origin);
    }

    try {
      const auth = request.headers.get("Authorization") || "";
      const idToken = auth.startsWith("Bearer ") ? auth.slice(7) : "";

      if (!idToken) {
        return reply({ error: "Missing Firebase token" }, 401, origin);
      }

      const input = await request.json();

      const to = String(input.to || "");
      const eventId = String(input.eventId || "");
      const eventType = String(input.eventType || "");
      const matchKey = String(input.matchKey || "");

      if (!/^[A-Za-z0-9_-]{1,128}$/.test(to) ||
          !/^[A-Za-z0-9_-]{1,128}$/.test(eventId)) {
        return reply({ error: "Invalid recipient or event" }, 400, origin);
      }

      if (!MESSAGES[eventType]) {
        return reply({ error: "Unknown event type" }, 400, origin);
      }

      if (!env.FIREBASE_SERVICE_ACCOUNT || !env.FIREBASE_API_KEY) {
        return reply({ error: "Worker secrets missing" }, 500, origin);
      }

      const senderUid = await verifyFirebaseUser(idToken, env);

      if (senderUid === to) {
        return reply({ error: "Self notification is not allowed" }, 400, origin);
      }

      const accessToken = await serviceAccessToken(env);

      if (!(await allowedEvent(
        eventType, eventId, matchKey, senderUid, to, accessToken
      ))) {
        return reply({ error: "Event not authorized" }, 403, origin);
      }

      const saved = await dbGet(
        "apps/" + APP_NODE + "/fcm/" + to,
        accessToken
      );

      const tokens = [];

      if (typeof saved === "string") {
        tokens.push(saved);
      } else if (saved && typeof saved === "object") {
        Object.values(saved).forEach(v => {
          if (typeof v === "string" && v.length > 20) {
            tokens.push(v);
          }
        });
      }

      const unique = [...new Set(tokens)].slice(0, 10);

      if (!unique.length) {
        return reply({
          ok: true,
          sent: 0,
          message: "Alıcının kayıtlı bildirim cihazı yok"
        }, 200, origin);
      }

      const results = await Promise.all(
        unique.map(t =>
          sendToToken(
            t,
            MESSAGES[eventType][0],
            MESSAGES[eventType][1],
            eventType,
            accessToken
          )
        )
      );

      return reply({
        ok: results.some(x => x.ok),
        sent: results.filter(x => x.ok).length,
        failed: results.filter(x => !x.ok).length,
        results
      }, 200, origin);

    } catch (e) {
      return reply({
        error: e && e.message ? e.message : "Push failed"
      }, 500, origin);
    }
  }
};
