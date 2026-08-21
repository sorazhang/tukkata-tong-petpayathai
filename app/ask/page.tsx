import ConfusionForm from '@/components/ConfusionForm'

export const metadata = { title: 'Ask Kru' }

export default function AskPage() {
  return (
    <main className="max-w-lg mx-auto px-6 py-12">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-2">
          ตุ๊กตาทอง เพชรพญาไท
        </p>
        <h1 className="text-2xl font-bold text-brand-black leading-snug">
          What is confusing you in training?
        </h1>
        <p className="text-gray-500 text-sm mt-2 leading-relaxed">
          Kru reads every submission. The questions that come up most often
          become the next challenges he answers on the platform.
        </p>
      </div>

      <ConfusionForm />
    </main>
  )
}
