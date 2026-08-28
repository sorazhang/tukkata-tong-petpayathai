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

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

        <div>
          <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{ paddingBottom: '177.78%' }}>
            <iframe
              src="https://www.youtube.com/embed/vep5CFkaJ2w"
              title="ASK KRU TUK Intro video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <p className="mt-3 text-sm font-semibold text-brand-black">ASK KRU TUK Intro video</p>
        </div>

        <div>
          <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{ paddingBottom: '177.78%' }}>
            <iframe
              src="https://www.youtube.com/embed/zwqaOk7Mpaw"
              title="Never Mind Restart Again"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <p className="mt-3 text-sm font-semibold text-brand-black">Never Mind Restart Again</p>
        </div>

      </div>
    </main>
  )
}
