import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import KruPill from '@/components/KruPill'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'ตุ๊กตาทอง เพชรพญาไท — Tukkatatong Petpayathai',
    template: '%s — ตุ๊กตาทอง เพชรพญาไท',
  },
  description:
    'Champion knowledge from Lumpinee Stadium title holder ตุ๊กตาทอง เพชรพญาไท (Tukkatatong Petpayathai). Muay Thai challenges, stories, and the art behind the art.',
  openGraph: {
    siteName: 'ตุ๊กตาทอง เพชรพญาไท',
    type: 'website',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const isKru = cookieStore.get('review_auth')?.value === process.env.REVIEW_PASSWORD

  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
        <Footer />
        {isKru && <KruPill />}
      </body>
    </html>
  )
}
