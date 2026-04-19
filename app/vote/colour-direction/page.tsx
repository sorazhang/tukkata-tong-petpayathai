import ColourPoll from '@/components/ColourPoll'

export const metadata = { title: 'Colour Direction' }

export default function ColourDirectionPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-2">
        Kru&apos;s choice
      </p>
      <h1 className="text-2xl font-bold text-brand-black leading-snug mb-2">
        Which colour feels right?
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Each option shows how the website would look. Tap the one that feels like you.
      </p>
      <ColourPoll />
    </main>
  )
}
