import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Chat with Agents',
    description: 'Choose one of 5 agents and start chatting',
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    return <div className="min-h-screen bg-background text-foreground p-4">{children}</div>
}
