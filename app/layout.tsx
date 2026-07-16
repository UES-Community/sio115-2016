import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'
import { Navbar } from '@/components/navbar'
import './globals.css'

const _ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const _ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'SIO115-2016 — Sistemas Operativos',
  description:
    'Plataforma interactiva para el estudio de Redes, Comunicaciones y Seguridad Informática. Materia SIO115-2016.',
  keywords: [
    'sistemas operativos',
    'redes',
    'comunicaciones',
    'seguridad informática',
    'criptografía',
    'TCP/IP',
    'enrutamiento',
  ],
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0a0f18',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-background">
      <body className="antialiased font-sans">
        <Navbar />
        {children}
      </body>
    </html>
  )
}
