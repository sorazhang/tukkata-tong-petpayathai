# Project Setup Guide
## Next.js + Firebase + Vercel + Custom Domain

This is the exact stack and steps used to build and deploy this project.

---

## Stack

| Layer | Service |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| Database | Firebase Firestore |
| File storage | Firebase Storage |
| AI | Anthropic SDK (Claude) |
| Hosting | Vercel |
| Domain | Custom domain via Vercel |
| Source control | GitHub |

---

## Step 1 — Create the Next.js project

```bash
npx create-next-app@latest your-project-name
```

Choose: TypeScript ✓ · Tailwind CSS ✓ · App Router ✓ · ESLint ✓

```bash
cd your-project-name
```

---

## Step 2 — Push to GitHub

1. Go to github.com → New repository
2. Name it, set to private or public
3. In your project folder:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

## Step 3 — Set up Firebase

### 3a. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Add project → give it a name
3. Disable Google Analytics if you don't need it

### 3b. Enable Firestore

- Build → Firestore Database → Create database
- Start in **production mode**
- Choose a region (e.g. `asia-southeast1` for Thailand/SEA)

### 3c. Enable Storage (if you need file uploads)

- Build → Storage → Get started
- Production mode → same region as Firestore

### 3d. Get your client-side config keys

- Project Settings (gear icon) → General → Your apps → Add app → Web
- Register app, copy the config object:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
}
```

### 3e. Get your Admin SDK service account key

Needed for server-side access (Next.js server actions / API routes).

- Project Settings → Service accounts → Generate new private key
- Download the JSON file — **keep this secret, never commit it**
- You need: `project_id`, `client_email`, `private_key` from that file

---

## Step 4 — Install dependencies

```bash
npm install firebase firebase-admin @anthropic-ai/sdk
```

---

## Step 5 — Set up environment variables locally

Create `.env.local` in your project root (this file is gitignored by default):

```env
# Firebase client (public — safe to expose)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (secret — server only)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxx@your_project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Anthropic (if using Claude)
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Step 6 — Wire up Firebase in code

**`lib/firebase.ts`** — client-side (used in browser components):

```ts
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const db      = getFirestore(app)
export const storage = getStorage(app)
```

**`lib/firebase-admin.ts`** — server-side (used in server actions and API routes):

```ts
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0]
  return initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_ADMIN_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
      // Vercel stores private key with literal \n — replace to real newlines
      privateKey:  process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  })
}

export const adminDb      = getFirestore(getAdminApp())
export const adminStorage = getStorage(getAdminApp())
```

> **Note on the private key:** Vercel stores the private key as a single-line string with literal `\n` characters. The `.replace(/\\n/g, '\n')` call is required to convert them back to real newlines — otherwise Firebase Admin will throw a key parsing error.

---

## Step 7 — Deploy to Vercel

### 7a. Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com) → Add New Project
2. Import from GitHub → select your repository
3. Framework preset: **Next.js** (auto-detected)
4. Click Deploy — Vercel builds from your `main` branch

### 7b. Add environment variables in Vercel

- Project → Settings → Environment Variables
- Add every variable from your `.env.local` file
- **Important for the private key:** paste the full key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`. Vercel will store the newlines as `\n` — the `.replace()` in `firebase-admin.ts` handles this automatically.

### 7c. Redeploy after adding variables

- Deployments → click the three dots on latest → Redeploy

From this point, every push to `main` triggers an automatic deployment.

---

## Step 8 — Add a custom domain

1. Vercel → Project → Settings → Domains
2. Add your domain (e.g. `yourdomain.com`)
3. Vercel shows you DNS records to add — either:
   - **A record** pointing to Vercel's IP, or
   - **CNAME record** pointing to `cname.vercel-dns.com`
4. Add these in your domain registrar's DNS settings
5. Vercel automatically provisions an SSL certificate (HTTPS)

---

## Step 9 — Serving static HTML files

Any file placed in the `public/` folder is served directly at the root URL.

```
public/my-page.html  →  https://yourdomain.com/my-page.html
public/logo.png      →  https://yourdomain.com/logo.png
```

No routing or configuration needed — Next.js serves `public/` as-is.

---

## Firestore security rules (minimum for this pattern)

Since this project uses Firebase Admin SDK (server-side only), the client never writes directly to Firestore. Set rules to deny all client access:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

All reads and writes go through your Next.js server actions using the Admin SDK, which bypasses these rules entirely.

---

## Common issues

| Problem | Fix |
|---|---|
| `FIREBASE_ADMIN_PRIVATE_KEY` error on Vercel | The `.replace(/\\n/g, '\n')` line in `firebase-admin.ts` is mandatory |
| Camera not working on deployed site | Camera requires HTTPS — Vercel provides this automatically |
| `NEXT_PUBLIC_` variables not available client-side | Only vars prefixed `NEXT_PUBLIC_` are exposed to the browser |
| Build passes locally but fails on Vercel | Check that all env vars are added in Vercel's dashboard, not just `.env.local` |
| Large file push rejected via git | Upload large static files (HTML, images) directly via GitHub web UI instead |
