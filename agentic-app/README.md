## Atlas · Agentic Operator UI

Atlas is a web-based autonomous agent that turns high-level goals into actionable execution plans. The interface lets you set a mission, capture context and constraints, and iterate with the agent in a live chat.

### Tech stack

- Next.js App Router (React 19)
- Tailwind CSS v4
- OpenAI Responses API (`gpt-4.1-mini`)

### 1. Configure environment

Copy the example env file and add your OpenAI key:

```bash
cp .env.local.example .env.local
echo "OPENAI_API_KEY=sk-..." >> .env.local
```

### 2. Run locally

```bash
npm install
npm run dev
```

Visit http://localhost:3000 to chat with Atlas. Conversations stay client-side; requests flow through the `/api/chat` route which proxies to OpenAI.

### 3. Deploy on Vercel

```bash
npm run build
```

Set `OPENAI_API_KEY` in your Vercel project, then deploy:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-8b566aa4
```

### Notes

- The agent prompt lives in `src/app/api/chat/route.js`.
- UI logic is contained in `src/app/page.js`.
- Tailwind is compiled via PostCSS and requires no extra setup beyond `npm install`.
