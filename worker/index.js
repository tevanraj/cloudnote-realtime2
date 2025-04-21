import { NoteDurableObject } from "../durable-object/Note.js";
export { NoteDurableObject };

function getUser(request) {
  const jwt = request.headers.get("CF-Access-Jwt-Assertion");
  if (!jwt) return null;
  try {
    const payload = JSON.parse(atob(jwt.split('.')[1]));
    return payload.email || payload.sub;
  } catch {
    return null;
  }
}

function generateNoteId() {
  return crypto.randomUUID();
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const method = request.method;
    const user = getUser(request);

    if (!user) return new Response("Unauthorized", { status: 401 });

    if (url.pathname === "/api/note/create" && method === "POST") {
      const noteId = generateNoteId();
      const id = env.NOTES.idFromName(noteId);
      const stub = env.NOTES.get(id);
      await stub.fetch(new Request("https://init", {
        method: "POST",
        body: JSON.stringify({ owner: user }),
      }));
      return new Response(JSON.stringify({ noteId }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    if (url.pathname.match(/^\/api\/note\/([^\/]+)\/invite$/)) {
      const noteId = url.pathname.split("/")[3];
      const id = env.NOTES.idFromName(noteId);
      const stub = env.NOTES.get(id);
      const forwardedRequest = new Request("https://invite", {
        method,
        headers: request.headers,
        body: request.body,
      });
      return stub.fetch(forwardedRequest);
    }

    if (url.pathname === "/api/summary" && method === "POST") {
      const { content } = await request.json();
      const res = await fetch("https://api.cloudflare.com/client/v4/accounts/YOUR_ACCOUNT_ID/ai/run/@cf/meta/llama-2-7b-chat-int8", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.AI_API_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: [{ role: "user", content: `Summarize this: ${content}` }] })
      });
      const result = await res.json();
      return new Response(JSON.stringify({ summary: result.result.response }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("Not found", { status: 404 });
  },

  async websocket(request, env, ctx) {
    const upgradeHeader = request.headers.get("Upgrade");
    if (!upgradeHeader || upgradeHeader !== "websocket") {
      return new Response("Expected websocket", { status: 400 });
    }

    const url = new URL(request.url);
    const noteId = url.pathname.split("/").pop();
    const id = env.NOTES.idFromName(noteId);
    const stub = env.NOTES.get(id);

    return stub.fetch(request);
  }
};