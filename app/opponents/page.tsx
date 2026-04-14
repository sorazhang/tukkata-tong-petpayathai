import type { Metadata } from 'next'
import { getArticles, getTracks, SECTION_META } from '@/lib/content'
import SectionIndex from '@/components/SectionIndex'

const meta = SECTION_META['opponents']

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
}

export default async function OpponentsPage() {
  const articles = await getArticles('opponents')
  const tracks = getTracks(articles)
  return (
    <SectionIndex
      articles={articles}
      tracks={tracks}
      title={meta.title}
      description={meta.description}
      basePath="/opponents"
    />
  )
}
