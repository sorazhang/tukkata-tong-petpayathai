import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getCultureStory, getCultureStories } from '@/lib/content'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const stories = await getCultureStories()
  return stories.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const story = await getCultureStory(slug)
  if (!story) return {}
  return {
    title: story.title,
    description: story.excerpt,
  }
}

export default async function CultureStoryPage({ params }: Props) {
  const { slug } = await params
  const story = await getCultureStory(slug)
  if (!story) notFound()

  const formattedDate = new Date(story.publishedAt).toLocaleDateString(
    'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' },
  )

  return (
    <main>
      {/* Back */}
      <div className="border-b border-gray-100 bg-white px-6 py-3">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/culture"
            className="text-sm text-gray-400 hover:text-brand-red transition-colors"
          >
            ← Culture
          </Link>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-14">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs text-gray-400 mb-4">{formattedDate}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-black leading-tight mb-6">
            {story.title}
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed border-l-4 border-brand-red pl-5">
            {story.excerpt}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <MDXRemote source={story.content} />
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex justify-between items-center flex-wrap gap-4">
          <Link
            href="/culture"
            className="text-sm text-gray-400 hover:text-brand-red transition-colors"
          >
            ← More Stories
          </Link>
          <Link
            href="/challenges"
            className="text-sm text-brand-red font-medium hover:underline"
          >
            Try a Challenge →
          </Link>
        </div>
      </article>
    </main>
  )
}
