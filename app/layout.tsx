import type { Metadata, Viewport } from 'next'
import { Inter, Cinzel } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LoadingScreen } from '@/components/loading-screen'
import './globals.css'

const _inter = Inter({ subsets: ['latin'] })
const _cinzel = Cinzel({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dungeon RPG',
  description: 'Arena tática de batalha — crie seu time e conquiste o dungeon',
}

export const viewport: Viewport = {
  themeColor: '#1a1a2e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased min-h-screen">
        <LoadingScreen />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
