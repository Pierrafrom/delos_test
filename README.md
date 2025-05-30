# DelosChat

**Technical test for DeoSet**: a multi-agent AI chatbot built with Next.js, TypeScript & Tailwind.

## Features

- **5 Specialized Agents**: Football, Tennis, Boxing, Basketball, F1
- **Streaming Responses**: word-by-word AI answers
- **Per-Agent History**: separate chat logs per agent
- **Edit & Retry**: modify a question inline and regenerate
- **Interrupt**: stop an ongoing response

## Tech Stack

- **Frontend**: Next.js App Router, React, Shadcn UI, Tailwind CSS
- **Backend**: Edge API route streaming GPT-4 via OpenAI
- **Deploy**: Vercel (https://your-vercel-app.vercel.app)

## Getting Started

1. `npm install`
2. Create `.env.local` with `OPENAI_API_KEY=sk-…`
3. `npm run dev` → http://localhost:3000

Enjoy!
