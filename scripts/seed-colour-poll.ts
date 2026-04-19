/**
 * Seeds the colour-direction poll document into Firestore.
 * Run with: npx tsx scripts/seed-colour-poll.ts
 */

import * as dotenv from 'dotenv'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

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
  await db.collection('polls').doc('colour-direction').set({
    question:    'Which colour feels right?',
    description: 'Each option shows how the website would look. Tap the one that feels like you.',
    options: [
      { id: 'current',  label: 'Current' },
      { id: 'gold',     label: 'Championship Gold' },
      { id: 'crimson',  label: 'Deep Crimson' },
      { id: 'night',    label: 'Night Fight' },
      { id: 'cream',    label: 'Warm Cream' },
    ],
    answer:    null,
    createdAt: '2026-04-19T00:00:00.000Z',
  }, { merge: true })

  console.log('✓ colour-direction poll seeded')
  process.exit(0)
}

main().catch((err) => { console.error(err); process.exit(1) })
