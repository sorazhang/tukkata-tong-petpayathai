import type { Metadata } from 'next'
import { getArticles, getTracks, SECTION_META } from '@/lib/content'
import SectionIndex from '@/components/SectionIndex'

const meta = SECTION_META['real-fights']

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
}

export default async function RealFightsPage() {
  const articles = await getArticles('real-fights')
  const tracks = getTracks(articles)
  return (
    <SectionIndex
      articles={articles}
      tracks={tracks}
      title={meta.title}
      description={meta.description}
      basePath="/real-fights"
    />
  )
}
