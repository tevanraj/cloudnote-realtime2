export class NoteDurableObject {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.users = new Map();
    this.allowedUsers = new Set();
    this.content = "";
  }

  async fetch(request) {
    const url = new URL(request.url);
    const upgradeHeader = request.headers.get("Upgrade");

    if (upgradeHeader === "websocket") {
      const client = request.headers.get("CF-Access-Jwt-Assertion");
      const userEmail = JSON.parse(atob(client.split('.')[1])).email;

      if (!this.allowedUsers.has(userEmail)) {
        return new Response("Unauthorized WebSocket", { status: 401 });
      }

      const [clientSocket, serverSocket] = Object.values(new WebSocketPair());
      this.users.set(userEmail, serverSocket);

      serverSocket.accept();

      serverSocket.addEventListener("message", async (msg) => {
        const { content } = JSON.parse(msg.data);
        this.content = content;
        for (const socket of this.users.values()) {
          socket.send(JSON.stringify({ content }));
        }
      });

      serverSocket.addEventListener("close", () => {
        this.users.delete(userEmail);
      });

      return new Response(null, { status: 101, webSocket: clientSocket });
    }

    if (request.method === "POST" && url.pathname === "/invite") {
      const { email } = await request.json();
      this.allowedUsers.add(email);
      return new Response("User invited");
    }

    if (request.method === "POST" && url.pathname === "/") {
      const { owner } = await request.json();
      this.allowedUsers.add(owner);
      return new Response("Note initialized");
    }

    return new Response("Invalid", { status: 400 });
  }
}