import Link from 'next/link'

export const metadata = {
    title: 'SportIQ – Your Multi-Agent AI Coach',
    description:
        'Explore specialized AI coaches in Football, Tennis, Boxing, Basketball, and Formula 1. Ask questions and get real-time, streamed advice.',
}

export default function Home() {
    return (
        <main
            className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100 p-6">
            {/* Header */}
            <header className="text-center space-y-4">
                <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
                    SportIQ
                </h1>
                <p className="max-w-2xl text-lg text-gray-600 mx-auto">
                    Your Multi-Agent AI Coach — get instant, streaming advice from experts
                    in Football, Tennis, Boxing, Basketball, and Formula 1.
                </p>
                <Link
                    href="/chat"
                    className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
                >
                    Start Chatting →
                </Link>
            </header>

            {/* Features */}
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
                Features
            </h2>
            <section className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    {
                        title: 'Specialized Coaches',
                        desc: 'Choose from 5 AI-powered agents, each trained in a specific sport.',
                    },
                    {
                        title: 'Real-Time Streaming',
                        desc: 'Watch the answer unfold word-by-word for a dynamic experience.',
                    },
                    {
                        title: 'Edit & Retry',
                        desc: 'Modify your question on the fly and get updated advice instantly.',
                    },
                    {
                        title: 'Session History',
                        desc: 'Each agent keeps its own conversation history for easy reference.',
                    },
                    {
                        title: 'Stop Anytime',
                        desc: 'Interrupt long answers with a single click for full control.',
                    },
                    {
                        title: 'Mobile-Friendly',
                        desc: 'Optimized for desktop and mobile so you can train on the go.',
                    },
                ].map((feature) => (
                    <div
                        key={feature.title}
                        className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
                    >
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {feature.title}
                        </h3>
                        <p className="text-gray-600">{feature.desc}</p>
                    </div>
                ))}
            </section>
        </main>
    )
}
