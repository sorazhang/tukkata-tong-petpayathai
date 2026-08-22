import Link from 'next/link'

export default function AnswersFromKruPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <Link href="/videos" className="text-xs text-gray-400 hover:text-brand-red transition-colors">
        ← Videos
      </Link>
      <div className="mt-6 mb-14">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-2">Series 01</p>
        <h1 className="text-3xl font-bold text-brand-black mb-3">Answers from Kru</h1>
        <p className="text-gray-500 leading-relaxed max-w-xl">
          General questions from students — answered directly by Kru. The things
          most coaches never explain clearly.
        </p>
      </div>

      <div className="py-20 text-center border border-dashed border-gray-200 rounded-xl">
        <p className="text-gray-400 text-sm">Videos coming soon.</p>
      </div>
    </main>
  )
}
