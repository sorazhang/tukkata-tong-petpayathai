import type { NextConfig } from 'next'

// Static export is only used when deploying to GitHub Pages.
// Omit it in dev so that Server Actions (used by the /review editor) work.
const isStaticExport = process.env.STATIC_EXPORT === 'true'

const nextConfig: NextConfig = {
  ...(isStaticExport && { output: 'export' }),
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // allow voice note uploads up to 10MB
    },
  },
}

export default nextConfig
