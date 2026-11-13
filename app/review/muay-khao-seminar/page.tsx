import { EPISODES, STAGES, UPDATES, SERIES_MOTTO } from '@/content/muay-khao-seminar-review'
import SeminarCaptionBox from '@/components/SeminarCaptionBox'
import ReviewViewPing from '@/components/ReviewViewPing'

export const metadata = { title: 'Muay Khao Seminar Review — Kru' }

export default function MuayKhaoSeminarReviewPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <ReviewViewPing label="muay-khao-seminar-site" />

      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-2">
          The Muay Khao Style · Seminar 24 Oct
        </p>
        <h1 className="text-3xl font-bold text-brand-black mb-4">Instagram Reels for review</h1>
        <div className="mb-5 leading-tight">
          <p className="text-2xl font-extrabold text-brand-black">{SERIES_MOTTO[0]}</p>
          <p className="text-2xl font-extrabold text-brand-red">{SERIES_MOTTO[1]}</p>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed max-w-xl">
          Kru, these are the 12 reels cut from your Muay Khao seminar: an overview, 10
          lessons and a bonus. Each one is under 1:40 and ends with a &ldquo;next
          episode&rdquo; card. Subtitles use only your own words.{' '}
          <b className="text-brand-black">
            Please watch each one and tell Sora the episode number and time of anything
            you want changed
          </b>
          , for example &ldquo;EP 4 · 0:58&rdquo;.
        </p>
      </div>

      {/* Updates */}
      <details open className="mb-10 bg-gray-50 border-l-4 border-brand-red rounded-r-lg p-5">
        <summary className="text-xs font-bold uppercase tracking-widest text-brand-red cursor-pointer select-none">
          Updates
        </summary>
        <ol className="mt-3 space-y-2 list-decimal list-inside">
          {UPDATES.map((u, i) => (
            <li key={i} className="text-sm text-gray-700">
              {u.text} <span className="text-gray-400 text-xs">· {u.date}</span>
            </li>
          ))}
        </ol>
      </details>

      {/* Stage overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-10">
        {STAGES.map((s, i) => (
          <div
            key={s.name}
            className={
              'p-4 rounded-lg border-t-4 ' +
              (i === 3 ? 'border-brand-red bg-red-50' : 'border-brand-black bg-gray-50')
            }
          >
            <p className={'text-xs font-bold uppercase tracking-widest mb-1 ' + (i === 3 ? 'text-brand-red' : 'text-brand-black')}>
              {s.name}
            </p>
            <p className="text-xs text-gray-500">
              {s.range} · {s.note}
            </p>
          </div>
        ))}
      </div>

      {/* Episode nav */}
      <nav className="flex flex-wrap gap-2 mb-12">
        {EPISODES.map((ep) => (
          <a
            key={ep.code}
            href={'#' + ep.code.toLowerCase().replace(' ', '')}
            className="text-xs font-semibold border border-gray-200 rounded px-3 py-1 text-gray-600 hover:border-brand-red hover:text-brand-red transition-colors"
          >
            {ep.code}
          </a>
        ))}
      </nav>

      {/* Episodes */}
      <div className="space-y-10">
        {EPISODES.map((ep) => (
          <article
            key={ep.code}
            id={ep.code.toLowerCase().replace(' ', '')}
            className="grid md:grid-cols-[240px_1fr] gap-6 bg-white border border-gray-200 rounded-xl p-6 scroll-mt-6"
          >
            <div
              className="relative w-full rounded-xl overflow-hidden bg-black"
              style={{ paddingBottom: '177.78%' }}
            >
              {ep.youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${ep.youtubeId}`}
                  title={`${ep.code} ${ep.title}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-500 text-xs">Video coming soon</p>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-2xl font-bold text-brand-red">{ep.code}</span>
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  {ep.stage} · {ep.durationLabel}
                </span>
              </div>
              <h2 className="text-xl font-bold text-brand-black mb-2">{ep.title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{ep.description}</p>

              <div className="flex flex-wrap gap-2 mb-3">
                {ep.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {ep.safety && (
                <p className="text-xs text-brand-gold-dim mb-2">
                  <b>Safety:</b> {ep.safety}
                </p>
              )}

              <SeminarCaptionBox caption={ep.caption} />
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
