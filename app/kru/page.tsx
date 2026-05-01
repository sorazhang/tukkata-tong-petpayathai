import { getConfusions } from '@/lib/confusion-actions'
import { getChallengesFromFirestore } from '@/lib/content-firestore'
import { getPolls } from '@/lib/polls'
import KruDashboard from '@/components/KruDashboard'

export const dynamic = 'force-dynamic'

export default async function KruPage() {
  const [confusions, challenges, polls] = await Promise.all([
    getConfusions(),
    getChallengesFromFirestore(),
    getPolls(),
  ])

  const openQuestions = confusions.filter((c) => c.status === 'open')
  const needsAnswer   = challenges.filter((c) => c.status === 'needs_answer')
  const pendingPolls  = polls.filter((p) => !p.answer)

  return (
    <KruDashboard
      openQuestions={openQuestions}
      needsAnswer={needsAnswer}
      pendingPolls={pendingPolls}
    />
  )
}
