'use client'

import {useEffect, useRef, useState} from 'react'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {Label} from '@/components/ui/label'
import {ChatWindow} from './ChatWindow'
import {ChatControls} from './ChatControls'

/** Available AI agents */
const AGENTS = ['Football', 'Tennis', 'Boxing', 'Basketball', 'Formula 1'] as const
type Agent = typeof AGENTS[number]

/**
 * A single chat message, either from the user or the AI.
 */
type ChatMessage = { from: 'user' | 'ai'; text: string }

/**
 * Builds a system prompt tailored to a given agent.
 */
function generateSystemPrompt(agent: Agent): string {
    return `
Tu es un expert mondialement reconnu et un coach passionné dans le domaine du ${agent}.
Réponds de manière concise, précise et encourageante, comme si tu t’adressais à une personne curieuse ou débutante.
Donne des conseils concrets, des explications claires, et adapte ton niveau à celui d’un amateur sauf indication contraire.
Répond dans la meme langue que la question posée.
`.trim()
}

export default function ChatPage() {
    // Initialize a typed history object: one array per agent
    const initialHistory = AGENTS.reduce<Record<Agent, ChatMessage[]>>((acc, a) => {
        acc[a] = []
        return acc
    }, {} as Record<Agent, ChatMessage[]>)

    const [history, setHistory] = useState(initialHistory)
    const [agent, setAgent] = useState<Agent>(AGENTS[0])
    const messages = history[agent]

    const [input, setInput] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [editIndex, setEditIndex] = useState<number | null>(null)
    const [editText, setEditText] = useState<string>('')

    const abortController = useRef<AbortController | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto-scroll on new messages
    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: 'smooth'})
    }, [messages])

    /**
     * Sends `userText` to the AI, adds placeholder bubble, then streams
     * the response chunk-by-chunk into that bubble.
     */
    async function chatWith(userText: string) {
        setLoading(true)
        let aiIndex = -1

        // 1) add user bubble + empty AI bubble
        setHistory(prev => {
            const clone = {...prev}
            const arr = [...clone[agent]]
            arr.push({from: 'user', text: userText})
            arr.push({from: 'ai', text: ''})
            aiIndex = arr.length - 1
            clone[agent] = arr
            return clone
        })

        // 2) prepare abort controller
        abortController.current?.abort()
        abortController.current = new AbortController()

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                signal: abortController.current.signal,
                body: JSON.stringify({
                    systemPrompt: generateSystemPrompt(agent),
                    messages: [{role: 'user', content: userText}],
                }),
            })
            if (!res.body) throw new Error('No response body')

            // 3) stream and append
            const reader = res.body.getReader()
            const decoder = new TextDecoder()
            let done = false

            while (!done) {
                const {value, done: d} = await reader.read()
                done = d
                if (value) {
                    const chunkStr = decoder.decode(value, {stream: true})
                    for (const part of chunkStr.split('\n\n')) {
                        if (!part.startsWith('data: ')) continue
                        const data = part.replace(/^data: /, '').trim()
                        if (data === '[DONE]') {
                            done = true;
                            break
                        }
                        try {
                            const {choices} = JSON.parse(data)
                            const content = choices?.[0]?.delta?.content
                            if (content) {
                                // append content to AI bubble
                                setHistory(prev => {
                                    const clone = {...prev}
                                    const arr = [...clone[agent]]
                                    arr[aiIndex] = {from: 'ai', text: arr[aiIndex].text + content}
                                    clone[agent] = arr
                                    return clone
                                })
                            }
                        } catch {
                            // ignore JSON parse errors
                        }
                    }
                }
            }
        } catch (error: unknown) {
            // handle abort vs other errors
            const msg =
                error instanceof DOMException && error.name === 'AbortError'
                    ? '⛔️ Réponse interrompue.'
                    : '⚠️ Erreur lors de la réponse.'
            setHistory(prev => {
                const clone = {...prev}
                clone[agent] = [...clone[agent], {from: 'ai', text: msg}]
                return clone
            })
        } finally {
            setLoading(false)
        }
    }

    /** Called when the user hits “Envoyer” */
    async function handleSendAction() {
        const trimmed = input.trim()
        if (!trimmed) return
        setInput('')
        await chatWith(trimmed)
    }

    /** Stops an ongoing streaming response */
    function handleStopAction() {
        abortController.current?.abort()
        setLoading(false)
    }

    /** Enters edit mode on a user message */
    function handleEditAction(idx: number) {
        const m = messages[idx]
        if (m.from !== 'user') return
        setEditIndex(idx)
        setEditText(m.text)
    }

    /** Saves an edit, removes all bubbles after `idx`, then re-chats */
    async function handleSaveEditAction(idx: number) {
        setHistory(prev => {
            const clone = {...prev}
            clone[agent] = clone[agent].slice(0, idx)
            return clone
        })
        setEditIndex(null)
        const trimmed = editText.trim()
        setEditText('')
        if (trimmed) await chatWith(trimmed)
    }

    /** Cancels edit mode without saving */
    function handleCancelEditAction() {
        setEditIndex(null)
        setEditText('')
    }

    return (
        <div className="max-w-4xl mx-auto p-4 grid gap-6">
            {/* Agent selector */}
            <div>
                <h1 className="text-3xl font-bold mb-4 text-center">
                    Talk to an AI Agent
                </h1>
                <RadioGroup
                    value={agent}
                    onValueChange={v => setAgent(v as Agent)}
                    className="grid grid-cols-2 gap-2 sm:grid-cols-3"
                >
                    {AGENTS.map(a => (
                        <div key={a} className="flex items-center space-x-2">
                            <RadioGroupItem value={a} id={a}/>
                            <Label htmlFor={a}>{a}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            {/* Chat window */}
            <ChatWindow
                messages={messages}
                editIndex={editIndex}
                editText={editText}
                onEditAction={handleEditAction}
                onEditTextChangeAction={setEditText}
                onSaveEditAction={handleSaveEditAction}
                onCancelEditAction={handleCancelEditAction}
                loading={loading}
                scrollRef={scrollRef}
            />

            {/* Input + controls */}
            <ChatControls
                inputValue={input}
                onInputChangeAction={setInput}
                onSendAction={handleSendAction}
                onStopAction={handleStopAction}
                loading={loading}
                placeholder={`Pose une question à l’agent ${agent.toLowerCase()}…`}
            />
        </div>
    )
}
