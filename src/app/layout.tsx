import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Agents LLM',
    description: 'Interagissez avec des agents LLM spécialisés dans différents sports.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr">
        <body className={inter.className}>{children}</body>
        </html>
    )
}
