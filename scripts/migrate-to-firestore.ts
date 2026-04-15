/**
 * One-time migration script — reads all MDX files and writes them to Firestore.
 *
 * Usage:
 *   npx tsx scripts/migrate-to-firestore.ts
 *
 * Requires env vars in .env.local:
 *   FIREBASE_ADMIN_PROJECT_ID
 *   FIREBASE_ADMIN_CLIENT_EMAIL
 *   FIREBASE_ADMIN_PRIVATE_KEY
 */

import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'
import matter from 'gray-matter'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

dotenv.config({ path: '.env.local' })

// ── Init Firebase Admin ───────────────────────────────────────────────────────
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

// ── Helpers ───────────────────────────────────────────────────────────────────
function readDir(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))
}

// ── Migrate challenges ────────────────────────────────────────────────────────
async function migrateChallenges() {
  const dir   = path.join(process.cwd(), 'content', 'challenges')
  const files = readDir(dir)
  console.log(`\nMigrating ${files.length} challenges…`)

  let success = 0
  for (const file of files) {
    const slug = file.replace('.mdx', '')
    const raw  = fs.readFileSync(path.join(dir, file), 'utf8')
    const { data, content } = matter(raw)

    const doc = {
      title:              data.title ?? '',
      category:           data.category ?? '',
      difficulty:         data.difficulty ?? 'beginner',
      situation:          data.situation ?? '',
      publishedAt:        data.publishedAt ?? '',
      isFree:             data.isFree ?? false,
      tracks:             data.tracks ?? [],
      content:            content.trim(),
      note:               data.note ?? null,
      voiceNote:          data.voiceNote ?? null,
      referenceVideo:     data.referenceVideo ?? null,
      referenceVideoNote: data.referenceVideoNote ?? null,
      migratedAt:         new Date().toISOString(),
    }

    try {
      await db.collection('challenges').doc(slug).set(doc)
      console.log(`  ✓ ${slug}`)
      success++
    } catch (err) {
      console.error(`  ✗ ${slug}:`, err)
    }
  }
  console.log(`\nChallenges: ${success}/${files.length} migrated.`)
}

// ── Migrate culture stories ───────────────────────────────────────────────────
async function migrateCulture() {
  const dir   = path.join(process.cwd(), 'content', 'culture')
  const files = readDir(dir)
  if (files.length === 0) { console.log('\nNo culture stories found — skipping.'); return }
  console.log(`\nMigrating ${files.length} culture stories…`)

  let success = 0
  for (const file of files) {
    const slug = file.replace('.mdx', '')
    const raw  = fs.readFileSync(path.join(dir, file), 'utf8')
    const { data, content } = matter(raw)

    const doc = {
      title:       data.title ?? '',
      excerpt:     data.excerpt ?? '',
      publishedAt: data.publishedAt ?? '',
      content:     content.trim(),
      migratedAt:  new Date().toISOString(),
    }

    try {
      await db.collection('culture').doc(slug).set(doc)
      console.log(`  ✓ ${slug}`)
      success++
    } catch (err) {
      console.error(`  ✗ ${slug}:`, err)
    }
  }
  console.log(`\nCulture: ${success}/${files.length} migrated.`)
}

// ── Run ───────────────────────────────────────────────────────────────────────
async function main() {
  console.log('Starting Firestore migration…')
  console.log(`Project: ${process.env.FIREBASE_ADMIN_PROJECT_ID}`)
  await migrateChallenges()
  await migrateCulture()
  console.log('\nDone.')
  process.exit(0)
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
