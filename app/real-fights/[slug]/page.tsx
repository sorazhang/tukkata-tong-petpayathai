import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArticle, getArticles, getTracks, SECTION_META } from '@/lib/content'
import SectionDetail from '@/components/SectionDetail'

const SECTION = 'real-fights' as const
const meta = SECTION_META[SECTION]

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const articles = await getArticles(SECTION)
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(SECTION, slug)
  if (!article) return {}
  return { title: article.title, description: article.situation }
}

export default async function RealFightPage({ params }: Props) {
  const { slug } = await params
  const article = await getArticle(SECTION, slug)
  if (!article) notFound()

  const allArticles = await getArticles(SECTION)
  const allTracks = getTracks(allArticles)

  const nextPerTrack = article.tracks.flatMap((membership) => {
    const track = allTracks.find((t) => t.name === membership.name)
    if (!track) return []
    const idx = track.challenges.findIndex((c) => c.slug === slug)
    if (idx < 0 || idx >= track.challenges.length - 1) return []
    return [{ trackName: membership.name, challenge: track.challenges[idx + 1] }]
  })

  return (
    <SectionDetail
      article={article}
      nextPerTrack={nextPerTrack}
      allTracks={allTracks}
      title={meta.title}
      basePath={`/${SECTION}`}
    />
  )
}
