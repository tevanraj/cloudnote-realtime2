# 🌩️ CloudNote Realtime

![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-orange?logo=cloudflare)
![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)

A modern, real-time collaborative note-taking app powered by **Cloudflare Workers**, **Durable Objects**, **Access**, **WebSockets**, and **Workers AI**. Invite users by email, edit notes live, and generate instant summaries — all at the edge.

---

## 🚀 Features

- 🔐 Auth with [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/)
- 🔁 Real-time sync via WebSockets & Durable Objects
- 👥 Multi-user support with per-note access control
- 📩 Invite collaborators by email
- ✍️ AI-generated note summaries (via Workers AI)
- ⚡ Hosted entirely on Cloudflare (no backend server!)

---

## 📦 Tech Stack

| Layer       | Technology             |
|-------------|------------------------|
| Frontend    | HTML + TailwindCSS     |
| API/Socket  | Cloudflare Workers     |
| State       | Durable Objects        |
| Auth        | Cloudflare Access      |
| AI Features | Workers AI             |
| Deploy      | Wrangler + CF Pages    |

---

## 🧪 Quick Start (Local)

```bash
npm install -g wrangler
npx wrangler dev --local
```

You can test the UI by opening `frontend/index.html` in your browser.

For full functionality (auth, WebSockets, AI), deploy live with Cloudflare:

---

## 🚀 Deployment Guide

### 1. Publish the Backend

```bash
npx wrangler login
npx wrangler deploy
```

### 2. Protect `/api/*` with Cloudflare Access

1. Go to [Cloudflare Zero Trust](https://dash.teams.cloudflare.com/)
2. Set up a new **Access App**:
   - **Domain:** `https://YOUR_WORKER_SUBDOMAIN.workers.dev/api/*`
   - Choose identity provider (Google, GitHub, etc.)
3. JWT is injected into every API/WebSocket request

---

### 3. Host the Frontend

Use [Cloudflare Pages](https://pages.cloudflare.com/) or any static host.

**Settings for Pages**:
- **Framework**: None
- **Build Command**: *(leave blank)*
- **Output Folder**: `frontend`

---

## ⚙️ Environment Variables

Set this in `wrangler.toml`:

```toml
[vars]
AI_API_TOKEN = "YOUR_API_TOKEN"
```

---

## 🤖 AI Summarization

We use:

```
@cf/meta/llama-2-7b-chat-int8
```

via [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/).

---

## 📷 Screenshots

Coming soon — or feel free to add your own with `![screenshot](path)` markdown!

---

## 📝 License

MIT — use it, fork it, ship it.

---

## 💬 Contribute

PRs, stars, and forks welcome! Submit issues for bugs or ideas 🚀