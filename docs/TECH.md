# Technical Architecture — Tukkatatong Petpayathai Platform

## Overview

A Muay Thai knowledge platform built with Next.js, Firebase, and Vercel.
Content is managed through a password-protected review tool and served
dynamically from Firestore.

---

## Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 15 (App Router) | Pages, routing, server components |
| Styling | Tailwind CSS 3 | UI styling with custom brand colours |
| Database | Firebase Firestore | Challenge content, culture stories |
| File Storage | Firebase Storage | Voice note recordings from Kru |
| Hosting | Vercel (Hobby) | Builds, deploys, serves the site |
| Domain | Namecheap | `tukkatatong-petpayathai.com` |
| Source Control | GitHub | `sorazhang/tukkata-tong-petpayathai` |

---

## Architecture

```
Browser / Kru's phone
        ↓
tukkatatong-petpayathai.com  (Vercel)
        ↓
Next.js App Router (server components + server actions)
        ↓
Firebase Admin SDK
        ↓
Firestore (content)   Firebase Storage (voice notes)
```

---

## Key Services

### Vercel
- Hosts the Next.js app
- Auto-deploys on every push to `main` branch
- Holds all environment variables (Firebase credentials)
- Free Hobby plan
- Dashboard: vercel.com

### Firebase (Project: `muaythaiwistom`)
- **Firestore** — stores all challenge content and culture stories
- **Storage** — stores voice note recordings (`voice-notes/{slug}.webm`)
- Dashboard: console.firebase.google.com
- Project ID: `muaythaiwistom`

### Namecheap (Domain)
- Domain: `tukkatatong-petpayathai.com`
- DNS: A Record `@` → `76.76.21.21` (Vercel)
- DNS: CNAME `www` → `cname.vercel-dns.com`

### GitHub
- Repo: `sorazhang/tukkata-tong-petpayathai`
- Production branch: `main`
- Feature branch: `claude/muay-thai-platform-GrnOm`

---

## Environment Variables (set in Vercel)

```
# Firebase Client (public)
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID

# Firebase Admin (secret — server only)
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY

# Review tool
REVIEW_PASSWORD
```

Local development: copy `.env.local.example` → `.env.local` and fill in values.

---

## Firestore Collections

### `challenges`
Document ID = slug (e.g. `why-two-jabs`)

| Field | Type | Description |
|-------|------|-------------|
| title | string | Challenge title |
| category | string | Striking / Defense / Footwork / Clinch / Ring IQ |
| difficulty | string | beginner / intermediate / advanced |
| situation | string | One-liner shown on cards |
| content | string | Full MDX body (Situation + Your Turn + Solution) |
| isFree | boolean | Whether solution is publicly visible |
| tracks | array | `[{ name, order }]` for learning series |
| publishedAt | string | ISO date |
| note | string | Internal collaborator note (hidden from readers) |
| voiceNote | string | Public URL to voice recording in Firebase Storage |
| referenceVideo | string | YouTube or video URL from Kru |
| referenceVideoNote | string | Timestamp/note about the video |

### `culture`
Document ID = slug (e.g. `wai-kru`)

| Field | Type | Description |
|-------|------|-------------|
| title | string | Story title |
| excerpt | string | Short preview text |
| content | string | Full MDX body |
| publishedAt | string | ISO date |

---

## Key Files

```
lib/
  firebase.ts          — Firebase client SDK init
  firebase-admin.ts    — Firebase Admin SDK init (server only)
  content.ts           — All Firestore reads (challenges, culture)
  actions.ts           — All Firestore writes (server actions)
  recommend.ts         — Survey recommendation logic (no DB)

app/
  page.tsx             — Homepage
  challenges/page.tsx  — Challenges index with accordion + survey
  challenges/[slug]/   — Individual challenge page
  knowledge/page.tsx   — Knowledge section index
  culture/[slug]/      — Culture story pages
  review/page.tsx      — Internal content review + editor (password protected)
  review-login/page.tsx — Password login for /review
  api/review-auth/     — Sets auth cookie on correct password

components/
  ChallengeEditor.tsx  — Editor with typed / voice / video input
  ChallengesGrouped.tsx — Accordion by category + difficulty
  SurveyWidget.tsx     — 3-question recommendation survey
  Nav.tsx              — Navigation with mobile hamburger
  Footer.tsx           — Footer with brand voice

middleware.ts          — Protects /review route with password cookie

scripts/
  migrate-to-firestore.ts — One-time MDX → Firestore migration

docs/
  STRATEGY.md          — Brand and market strategy
  VOICE.md             — Brand voice and writing guide
  TECH.md              — This file
```

---

## Deployment Flow

```
Edit code locally
      ↓
git push origin main
      ↓
Vercel detects push → builds automatically (~1 min)
      ↓
Live at tukkatatong-petpayathai.com
```

---

## Content Edit Flow (Kru)

```
Kru opens tukkatatong-petpayathai.com/review on any device
      ↓
Enters password → sees all 54 challenges
      ↓
Clicks any challenge → types solution, records voice, or pastes video link
      ↓
Hits Save → writes directly to Firestore
      ↓
Live on site immediately (no deploy needed)
```

---

## Local Development

```bash
# Install dependencies
npm install

# Copy env template and fill in values
cp .env.local.example .env.local

# Run dev server (with full editing capability)
npm run dev

# One-time: migrate MDX files to Firestore
npm run migrate

# Build for production (same as Vercel)
npm run build
```

---

## Next Phase

- [ ] Rotate Firebase service account key (current one was shared in chat)
- [ ] Connect `tukkatatong-petpayathai.com` as primary domain in Vercel
- [ ] Add Firebase Auth for more secure /review access
- [ ] YouTube transcript parsing for Real Fights section
- [ ] Illustration upload support in review tool
- [ ] Subscription/payment tier (Stripe or similar)
- [ ] iOS/Android app (React Native using same Firebase backend)
