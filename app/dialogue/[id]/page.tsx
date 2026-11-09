import { notFound } from 'next/navigation'
import { getDialogue } from '@/lib/dialogue-actions'
import DialogueRecorder from '@/components/DialogueRecorder'

export const dynamic = 'force-dynamic'

export default async function DialogueSessionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const dialogue = await getDialogue(id)
  if (!dialogue) notFound()
  return <DialogueRecorder initial={dialogue} />
}
