const MODEL = "@cf/zai-org/glm-4.7-flash";
const PROJECTS = ["ARENA", "RESET-NIGHT", "KATIP"];

// FIREBASE_API_KEY and GATEWAY_TOKEN are Cloudflare Worker secrets.
const cors = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-AI-Project",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function reply(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: cors });
}

function validProject(project) {
  return PROJECTS.includes(project);
}

function candidateText(candidate) {
  if (typeof candidate === "string") return candidate.trim();
  if (Array.isArray(candidate)) {
    return candidate.map((part) => {
      if (typeof part === "string") return part;
      return part?.text || part?.content || "";
    }).join("").trim();
  }
  if (candidate && typeof candidate === "object") {
    if (typeof candidate.text === "string") return candidate.text.trim();
    if (typeof candidate.content === "string") return candidate.content.trim();
  }
  return "";
}

function extractAnswer(result) {
  const choice = result?.choices?.[0];
  const message = choice?.message;
  const candidates = [
    result?.response,
    message?.content,
    choice?.text,
    result?.output_text,
    message?.refusal,
  ];

  for (const candidate of candidates) {
    const text = candidateText(candidate);
    if (text) return text;
  }
  return "";
}

async function verifyFirebase(request, env) {
  const apiKey = env.FIREBASE_API_KEY;
  if (!apiKey) throw new Error("FIREBASE_API_KEY secret is not configured");

  const auth = request.headers.get("Authorization") || "";
  if (!auth.startsWith("Bearer ")) return null;

  const idToken = auth.slice(7).trim();
  if (!idToken) return null;

  const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  const user = data.users && data.users[0];
  return user && user.localId ? user : null;
}

async function saveMessage(env, project, targets, content) {
  const message = {
    id: crypto.randomUUID(),
    project,
    from: project,
    to: targets,
    content,
    created_at: new Date().toISOString(),
  };

  for (const target of targets) {
    await env.KV.put(`inbox:${target}:${message.id}`, JSON.stringify(message));
  }
  return message;
}

async function readMessages(env, project) {
  const result = await env.KV.list({ prefix: `inbox:${project}:`, limit: 100 });
  const messages = [];

  for (const key of result.keys) {
    const value = await env.KV.get(key.name);
    if (value) {
      try {
        messages.push(JSON.parse(value));
      } catch {
        // Ignore malformed stored entries and continue reading the inbox.
      }
    }
  }

  messages.sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)));
  return messages;
}

async function runChat(env, messages, maxTokens = 700) {
  if (!env.AI) throw new Error("AI binding missing");

  // GLM-4.7-Flash enables thinking by default. With small token limits this can
  // consume the completion budget before any user-visible message is produced.
  const result = await env.AI.run(MODEL, {
    messages,
    max_completion_tokens: maxTokens,
    chat_template_kwargs: {
      enable_thinking: false,
      clear_thinking: true,
    },
  });

  const answer = extractAnswer(result);
  if (!answer) {
    const choice = result?.choices?.[0] || {};
    const diagnostic = {
      result_keys: result && typeof result === "object" ? Object.keys(result) : typeof result,
      finish_reason: choice.finish_reason || null,
      message_keys: choice.message && typeof choice.message === "object" ? Object.keys(choice.message) : [],
      completion_tokens: result?.usage?.completion_tokens ?? null,
    };
    throw new Error(`Empty AI response; ${JSON.stringify(diagnostic)}`);
  }
  return answer;
}

const SHARED_SYSTEM_PROMPT = [
  "You are the shared AI engineering collaborator for ARENA, RESET NIGHT, and KÂTİP.",
  "You collaborate with Gemini and ChatGPT on software planning, code review, debugging, tests, and release readiness.",
  "Answer in Turkish unless the task explicitly requests another language.",
  "Use only the code and task context explicitly provided to you. Never ask for or expose API keys, tokens, passwords, signing credentials, or private user data.",
  "For KÂTİP, financial records, balances, SMS and bank notifications must remain on the device. Review source code and synthetic test data only; never request actual financial records.",
  "For RESET NIGHT, preserve the Godot 4 3D human-faction game direction; it is not a zombie game.",
  "For ARENA, preserve existing games and mobile compatibility. Be specific, evidence-based, and concise.",
].join(" ");

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (path === "/health" && request.method === "GET") {
      return reply({
        status: "online",
        projects: PROJECTS,
        storage: env.KV ? "KV" : "missing",
        ai: env.AI ? "available" : "missing",
        model: MODEL,
      });
    }

    if (!env.KV) return reply({ error: "KV binding missing" }, 500);

    // Firebase-authenticated collaboration routes.
    if (path.startsWith("/app/")) {
      let user;
      try {
        user = await verifyFirebase(request, env);
      } catch (error) {
        return reply({ error: "Firebase verification failed", detail: String(error.message || error) }, 502);
      }

      if (!user) return reply({ error: "Invalid Firebase session" }, 401);

      if (path === "/app/chat" && request.method === "POST") {
        try {
          const body = await request.json();
          const message = String(body.message || "").trim();
          const project = String(body.project || request.headers.get("X-AI-Project") || "ARENA");
          if (!validProject(project)) return reply({ error: "Invalid project" }, 400);
          if (!message || message.length > 12000) {
            return reply({ error: "Message must be 1-12000 characters" }, 400);
          }

          const answer = await runChat(env, [
            {
              role: "system",
              content: `${SHARED_SYSTEM_PROMPT} Current project context: ${project}.`,
            },
            { role: "user", content: message },
          ], 700);

          return reply({ project, model: MODEL, response: answer });
        } catch (error) {
          const detail = String(error.message || error);
          const status = detail.includes("Empty AI response") ? 502 : 500;
          return reply({ error: "AI request failed", detail }, status);
        }
      }

      if (path === "/app/messages" && request.method === "POST") {
        try {
          const body = await request.json();
          const project = String(body.project || body.from || request.headers.get("X-AI-Project") || "ARENA");
          const content = String(body.content || "").trim();
          if (!validProject(project)) return reply({ error: "Invalid project" }, 400);
          if (!content || content.length > 12000) {
            return reply({ error: "Invalid message content" }, 400);
          }

          let requested = body.to;
          if (!Array.isArray(requested)) requested = [requested || "ALL"];
          const targets = requested.includes("ALL")
            ? PROJECTS.filter((item) => item !== project)
            : [...new Set(requested)];

          if (targets.length === 0 || targets.some((item) => !validProject(item) || item === project)) {
            return reply({ error: "Invalid recipient" }, 400);
          }

          const message = await saveMessage(env, project, targets, content);
          return reply({ status: "saved", message, delivered_to: targets }, 201);
        } catch (error) {
          return reply({ error: "Message save failed", detail: String(error.message || error) }, 500);
        }
      }

      if (path === "/app/messages" && request.method === "GET") {
        try {
          const project = url.searchParams.get("project") || request.headers.get("X-AI-Project") || "ARENA";
          if (!validProject(project)) return reply({ error: "Valid project required" }, 400);
          const messages = await readMessages(env, project);
          return reply({ project, count: messages.length, messages });
        } catch (error) {
          return reply({ error: "Message read failed", detail: String(error.message || error) }, 500);
        }
      }

      return reply({ error: "Not found" }, 404);
    }

    // Administrative endpoints: require the GATEWAY_TOKEN secret.
    const gatewayToken = env.GATEWAY_TOKEN;
    const auth = request.headers.get("Authorization") || "";
    if (!gatewayToken || auth !== `Bearer ${gatewayToken}`) {
      return reply({ error: "Unauthorized" }, 401);
    }

    if (path === "/numes/chat" && request.method === "POST") {
      try {
        if (!env.NUMES_API_KEY) return reply({ error: "NUMES_API_KEY secret is not configured" }, 503);
        const body = await request.json();
        const project = String(body.project || "");
        const model = String(body.model || "deepseek/deepseek-v4.1-flash");
        const prompt = String(body.prompt || "").trim();
        const allowedModels = new Set([
          "deepseek/deepseek-v4.1-flash",
          "dealignai/deepseek-v4.1-flash-uncensored-fp8",
          "z-ai/glm-5.3-flash",
          "dealignai/glm-5.3-flash-uncensored-fp8",
          "dealignai/glm-5.3-uncensored-fp8",
          "moonshotai/kimi-k3.1-pro",
          "nvidia/nemotron-3-ultra-550b-a55b",
        ]);

        // KÂTİP is deliberately excluded: no financial or personal records may leave the device.
        if (!["ARENA", "RESET-NIGHT"].includes(project)) {
          return reply({ error: "Numes is disabled for this project" }, 403);
        }
        if (!allowedModels.has(model)) return reply({ error: "Model is not allowlisted" }, 400);
        if (!prompt || prompt.length > 12000) return reply({ error: "Prompt must be 1-12000 characters" }, 400);

        const upstream = await fetch("https://api.numes.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.NUMES_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: `${SHARED_SYSTEM_PROMPT} Current project context: ${project}. Review only supplied source-code context and synthetic test data. Never request secrets or personal data.` },
              { role: "user", content: prompt },
            ],
            max_tokens: 1200,
            store: false,
            provider: {
              data_collection: "deny",
              zdr: true,
              // Never route to a paid endpoint. Both token price ceilings are zero.
              max_price: { prompt: 0, completion: 0 },
              allow_fallbacks: false,
            },
          }),
        });

        const data = await upstream.json().catch(() => ({}));
        if (!upstream.ok) {
          const safeError = String(data?.error?.message || data?.message || "Numes upstream request failed").slice(0, 500);
          return reply({ error: "Numes request failed", status: upstream.status, detail: safeError }, upstream.status === 429 ? 429 : 502);
        }
        const answer = candidateText(data?.choices?.[0]?.message?.content);
        if (!answer) return reply({ error: "Numes returned an empty response" }, 502);
        return reply({
          project,
          model: data.model || model,
          response: answer,
          usage: data.usage || null,
        });
      } catch (error) {
        return reply({ error: "Numes request failed", detail: String(error.message || error).slice(0, 500) }, 502);
      }
    }

    if (path === "/chat" && request.method === "POST") {
      try {
        const body = await request.json();
        if (!Array.isArray(body.messages) || body.messages.length === 0) {
          return reply({ error: "Messages required" }, 400);
        }
        const maxTokens = Number(body.max_tokens) > 0 ? Math.min(Number(body.max_tokens), 2500) : 700;
        const answer = await runChat(env, body.messages, maxTokens);
        return reply({ model: MODEL, response: answer });
      } catch (error) {
        const detail = String(error.message || error);
        const status = detail.includes("Empty AI response") ? 502 : 500;
        return reply({ error: "AI request failed", detail }, status);
      }
    }

    if (path === "/messages" && request.method === "POST") {
      try {
        const body = await request.json();
        const project = String(body.project || "");
        const to = String(body.to || "ALL");
        const content = String(body.content || "").trim();

        if (!validProject(project)) return reply({ error: "Invalid project" }, 400);
        if (!content || content.length > 12000) return reply({ error: "Invalid message" }, 400);

        const targets = to === "ALL" ? PROJECTS.filter((item) => item !== project) : [to];
        if (targets.some((item) => !validProject(item) || item === project)) {
          return reply({ error: "Invalid recipient" }, 400);
        }

        const message = await saveMessage(env, project, targets, content);
        return reply({ status: "saved", message, delivered_to: targets }, 201);
      } catch (error) {
        return reply({ error: "Message save failed", detail: String(error.message || error) }, 500);
      }
    }

    if (path === "/messages" && request.method === "GET") {
      const project = url.searchParams.get("project");
      if (!validProject(project)) return reply({ error: "Valid project required" }, 400);
      try {
        const messages = await readMessages(env, project);
        return reply({ project, count: messages.length, messages });
      } catch (error) {
        return reply({ error: "Message read failed", detail: String(error.message || error) }, 500);
      }
    }

    return reply({ error: "Not found" }, 404);
  },
};
