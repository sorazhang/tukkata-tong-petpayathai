import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ตุ๊กตาทอง เพชรพญาไท',
    short_name: 'ตุ๊กตาทอง',
    description: 'Muay Thai knowledge from ตุ๊กตาทอง เพชรพญาไท — champion of Lumpinee Stadium.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#dc2626',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
