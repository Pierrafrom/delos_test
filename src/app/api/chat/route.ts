import {NextRequest} from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
    const {messages, systemPrompt} = await req.json()

    const apiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'gpt-4',
            stream: true,
            messages: [
                {role: 'system', content: systemPrompt || 'Tu es une IA utile.'},
                ...messages,
            ],
        }),
    })

    return new Response(apiRes.body, {
        status: apiRes.status,
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
        },
    })
}
