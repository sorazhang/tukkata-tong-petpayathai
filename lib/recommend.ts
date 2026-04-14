export type Duration = 'just-starting' | 'building' | 'experienced'
export type Sparring  = 'not-yet' | 'just-started' | 'regularly'
export type Problem   = 'striking' | 'defense' | 'footwork' | 'clinch' | 'tactics' | 'unsure'

export interface Recommendation {
  message: string
  start: string        // slug
  path: string[]       // 2–3 follow-on slugs
  track?: string       // suggest a series if relevant
}

export function recommend(
  duration: Duration,
  sparring: Sparring,
  problem: Problem
): Recommendation {

  // ── Just starting ────────────────────────────────────────
  if (duration === 'just-starting' && sparring === 'not-yet') {
    return {
      message: 'Start at the beginning. These build the foundation everything else sits on.',
      start: 'why-two-jabs',
      path: ['fake-and-read', 'reacting-to-feints'],
      track: 'Actions and Reactions',
    }
  }

  if (duration === 'just-starting' && sparring !== 'not-yet') {
    return {
      message: 'The first wall every beginner hits in sparring. Fix these before anything else.',
      start: 'relax-when-scared',
      path: ['one-punch-then-freeze', 'footwork-moving-straight-back'],
    }
  }

  // ── Building (6 months – 2 years) ────────────────────────
  if (duration === 'building') {
    if (problem === 'striking') return {
      message: 'You have the basics. Now make them land for a reason.',
      start: 'jab-does-nothing',
      path: ['nothing-after-jab-cross', 'body-kick-always-checked'],
    }
    if (problem === 'defense') return {
      message: 'Getting hit by the same thing repeatedly is a pattern, not bad luck.',
      start: 'same-punch-same-place',
      path: ['guard-moves-on-feint', 'walking-onto-the-teep'],
    }
    if (problem === 'footwork') return {
      message: 'Footwork problems compound everything else. Fix the base first.',
      start: 'footwork-moving-straight-back',
      path: ['footwork-no-angles', 'footwork-stops-when-punching'],
    }
    if (problem === 'clinch') return {
      message: 'The clinch is where most fights are actually decided.',
      start: 'clinch-just-holding',
      path: ['cannot-enter-clinch', 'getting-thrown-from-clinch'],
    }
    if (problem === 'tactics') return {
      message: 'You can fight. Now learn to read the fight.',
      start: 'fake-and-read',
      path: ['backing-straight-up', 'winning-but-losing-points'],
    }
  }

  // ── Experienced (2+ years) ────────────────────────────────
  if (duration === 'experienced') {
    if (problem === 'striking') return {
      message: 'Advanced striking is about setup, not power.',
      start: 'body-kick-no-setup',
      path: ['roundhouse-telegraphed', 'nothing-after-jab-cross'],
    }
    if (problem === 'defense') return {
      message: 'At this level, defense is about reading before it arrives.',
      start: 'reacting-to-feints',
      path: ['guard-moves-on-feint', 'walking-onto-the-teep'],
    }
    if (problem === 'footwork') return {
      message: 'Advanced footwork is about controlling where the fight happens.',
      start: 'footwork-predictable',
      path: ['footwork-pivot', 'footwork-pressure-or-retreat'],
    }
    if (problem === 'clinch') return {
      message: 'Clinch at this level is about transitions and separation, not just holding.',
      start: 'losing-clinch-separation',
      path: ['getting-thrown-from-clinch', 'cannot-enter-clinch'],
    }
    if (problem === 'tactics') return {
      message: 'At your level, the fight happens in the head before the body.',
      start: 'plan-gone-by-round-two',
      path: ['opponent-waits-then-turns-on', 'stopping-when-ahead'],
    }
  }

  // ── Default / unsure ─────────────────────────────────────
  return {
    message: 'Start here. Everyone starts here.',
    start: 'why-two-jabs',
    path: ['fake-and-read', 'reacting-to-feints'],
    track: 'Actions and Reactions',
  }
}
