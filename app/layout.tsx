import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Tukkatatong Petpayathai',
    template: '%s — Tukkatatong Petpayathai',
  },
  description:
    'Champion knowledge from Lumpinee Stadium title holder Tukkatatong Petpayathai. Muay Thai challenges, stories, and the art behind the art.',
  openGraph: {
    siteName: 'Tukkatatong Petpayathai',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  )
}
