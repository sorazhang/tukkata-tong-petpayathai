import Link from 'next/link'

export default function VideosPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-2">Videos</p>
      <h1 className="text-3xl font-bold text-brand-black mb-3">Learn from Kru</h1>
      <p className="text-gray-500 leading-relaxed max-w-xl mb-14">
        Two series. One covers the questions students ask most. The other breaks down
        real fights — technique and tactics explained by the fighter himself.
      </p>

      <div className="grid md:grid-cols-2 gap-6">

        <Link href="/videos/answers-from-kru" className="block group">
          <div className="border-2 border-brand-black rounded-xl p-8 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-2">Series 01</p>
            <h2 className="text-xl font-bold text-brand-black mb-3 group-hover:text-brand-red transition-colors">
              Answers from Kru
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              General questions from students — answered directly by Kru. The things
              most coaches never explain clearly.
            </p>
            <p className="text-brand-red text-sm font-medium mt-6">Watch →</p>
          </div>
        </Link>

        <Link href="/videos/tech-breakdown" className="block group">
          <div className="border border-gray-200 rounded-xl p-8 bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Series 02</p>
            <h2 className="text-xl font-bold text-brand-black mb-3 group-hover:text-brand-red transition-colors">
              Tech Breakdown
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Real fight footage remixed and explained. The techniques and tricks
              behind each moment — from the fighter who used them.
            </p>
            <p className="text-brand-red text-sm font-medium mt-6">Watch →</p>
          </div>
        </Link>

      </div>

      {/* YouTube Shorts */}
      <div className="mt-16">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-2">From YouTube</p>
        <h2 className="text-2xl font-bold text-brand-black mb-8">Latest from Kru</h2>
        <div className="grid sm:grid-cols-2 gap-8 max-w-2xl">

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
      </div>
    </main>
  )
}
