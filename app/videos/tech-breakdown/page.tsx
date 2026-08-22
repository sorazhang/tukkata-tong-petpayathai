import Link from 'next/link'

export default function TechBreakdownPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <Link href="/videos" className="text-xs text-gray-400 hover:text-brand-red transition-colors">
        ← Videos
      </Link>
      <div className="mt-6 mb-14">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Series 02</p>
        <h1 className="text-3xl font-bold text-brand-black mb-3">Tech Breakdown</h1>
        <p className="text-gray-500 leading-relaxed max-w-xl">
          Real fight footage remixed and explained. The techniques and tricks
          behind each moment — from the fighter who used them.
        </p>
      </div>

      <div className="py-20 text-center border border-dashed border-gray-200 rounded-xl">
        <p className="text-gray-400 text-sm">Videos coming soon.</p>
      </div>
    </main>
  )
}
