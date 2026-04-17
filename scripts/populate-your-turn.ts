/**
 * Populates "Your Turn" sections for stub challenges in Firestore.
 * Run with: npx tsx scripts/populate-your-turn.ts
 */

import * as dotenv from 'dotenv'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { yourTurnData } from './your-turn-data'

dotenv.config({ path: '.env.local' })

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_ADMIN_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
      privateKey:  process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}
const db = getFirestore()

async function main() {
  console.log(`\nPopulating Your Turn for ${Object.keys(yourTurnData).length} challenges…\n`)

  let success = 0
  for (const [slug, yourTurn] of Object.entries(yourTurnData)) {
    const ref = db.collection('challenges').doc(slug)
    const doc = await ref.get()

    if (!doc.exists) {
      console.log(`  ✗ ${slug} — not found in Firestore`)
      continue
    }

    const existing = doc.data()!
    const currentContent = existing.content ?? ''

    // Only update if content doesn't already have a Your Turn section
    if (currentContent.includes('## Your Turn')) {
      console.log(`  – ${slug} — already has Your Turn, skipping`)
      continue
    }

    // Rebuild content: keep existing Situation if present, add Your Turn
    const situationMatch = currentContent.match(/## The Situation\n\n([\s\S]*?)(?=## |$)/)
    const situationBody  = situationMatch ? situationMatch[1].trim() : (existing.situation ?? '')
    const solutionMatch  = currentContent.match(/## Solution\n\n([\s\S]*)$/)
    const solutionBody   = solutionMatch ? solutionMatch[1].trim() : ''

    let newContent = ''
    if (situationBody) newContent += `## The Situation\n\n${situationBody}\n\n`
    newContent += `## Your Turn\n\n${yourTurn.trim()}\n\n`
    if (solutionBody) newContent += `## Solution\n\n${solutionBody}\n`

    await ref.update({
      content:   newContent.trim(),
      updatedAt: new Date().toISOString(),
    })

    console.log(`  ✓ ${slug}`)
    success++
  }

  console.log(`\nDone. Updated ${success} challenges.\n`)
  process.exit(0)
}

main().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})
