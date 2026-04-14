import type { Metadata } from 'next'
import { getArticles, getTracks, SECTION_META } from '@/lib/content'
import SectionIndex from '@/components/SectionIndex'

const meta = SECTION_META['scoring']

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
}

export default async function ScoringPage() {
  const articles = await getArticles('scoring')
  const tracks = getTracks(articles)
  return (
    <SectionIndex
      articles={articles}
      tracks={tracks}
      title={meta.title}
      description={meta.description}
      basePath="/scoring"
    />
  )
}
