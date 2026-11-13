// Content for the Muay Khao seminar review page (/review/muay-khao-seminar).
// Mirrors the claude.ai review artifact, moved onto our own site so view-tracking
// actually works (the Claude artifact runs sandboxed and can't log visits).
// Fill in each `youtubeId` once the video is uploaded (unlisted is fine).

export type SeminarEpisode = {
  code: string
  stage: string
  durationLabel: string
  title: string
  description: string
  tags: string[]
  safety: string
  caption: string
  youtubeId: string
}

export const SERIES_MOTTO = ['DEFENSE IS OFFENSE.', 'OFFENSE IS DEFENSE.']

export const STAGES = [
  { name: 'AT RANGE', range: 'EP 1–4', note: 'the block is your setup' },
  { name: 'CLINCH DOOR', range: 'EP 5–6', note: 'your teep is your wall' },
  { name: 'INSIDE', range: 'EP 7–8', note: 'control the arm: safe and ready' },
  { name: 'STRIKE', range: 'EP 9–10', note: 'every setup → the knee' },
]

export const UPDATES = [
  { date: '13 Nov', text: 'Moved the whole review page from the claude.ai link onto our own site, so we can see if/when it gets opened.' },
  { date: '13 Nov', text: 'EP 1: removed the 17–37s section that was labeled "front teep" but showed the rear-leg teep. New length 0:59 (was 1:19).' },
  { date: '12 Nov', text: 'EP 10: extended the cheers clip so it runs on to the group photo frame with the boy, then fades to the end card. New length 1:40.' },
  { date: '12 Nov', text: 'EP 0 rebuilt around "Defense is offense. Offense is defense." — new hook, staircase graphic, stage lines, and the knee as the final payoff. Captions updated across all 12 episodes to match.' },
]

export const EPISODES: SeminarEpisode[] = [
  {
    code: 'EP 0',
    stage: 'Overview',
    durationLabel: '1:04',
    title: 'Series Overview',
    description:
      'The map of the whole series, built on one idea: defense is offense, offense is defense. The move that stops their attack already sets up yours, and your attack also protects you. The 4 stages climb like stairs to the top step, the knee. It ends with your line "Defend for attack, defend for return."',
    tags: [
      'DEFENSE IS OFFENSE. OFFENSE IS DEFENSE.',
      'MUAY KHAO · THE KNEE FIGHTER',
      'THE BLOCK IS YOUR SETUP',
      'YOUR TEEP IS YOUR WALL',
      'CONTROL THE ARM: SAFE AND READY',
      'EVERY SETUP → THE KNEE',
      'EVERY MOVE LEADS TO THE KNEE',
    ],
    safety: '',
    caption:
      "Defense is offense. Offense is defense. 🥊\n\nSounds backwards? Here's what it means:\nWhen you stop their attack, the same move sets up yours. Catch the kick, and your hands already hold the leg for the knee.\nWhen you attack, it protects you too. A front teep keeps them out of the clinch.\nEvery move does both. And in Muay Khao, the knee fighter's style, it all leads to the knee.\n\nThe Muay Khao Style: a new 10-part series with Kru Tukkatatong Petpayathai, 2X Channel 7 Champion. Four stages: at range, the clinch door, inside, strike.\n\n\"Defend for attack, defend for return.\"\n\nFollow so you don't miss EP 1 👇\n\n#muaythai #muaykhao #clinch #muaythaitechnique #TheMuayKhaoStyle",
    youtubeId: '',
  },
  {
    code: 'EP 1',
    stage: 'At range',
    durationLabel: '0:59',
    title: 'Counter the Jab & Front Teep',
    description: 'They jab: catch it, step in, knee. They front-teep: catch the leg and sweep.',
    tags: ['COUNTER THE JAB → KNEE', 'FRONT TEEP: CATCH → SWEEP', 'ONE HAND UNDER · ONE ON TOP'],
    safety: 'Reach the position, no need to take them down · Beginners: no twisting, no sweeps · Beginners: no knees, never the face',
    caption:
      'Counter the jab & front teep 🥊\nEP 1/10 · At range\n\nDefense is offense: the catch is already your grip for the knee.\n\nThey jab: catch it, step in, knee. They teep with the front leg: catch it and sweep.\n\nDrill safely: just reach the position, no takedowns. Beginners: no knees, never the face.\n\nSave this for your next session 📌\n\n#muaythai #muaykhao #counterattack #teep #TheMuayKhaoStyle',
    youtubeId: '',
  },
  {
    code: 'EP 2',
    stage: 'At range',
    durationLabel: '1:07',
    title: 'Counter the Rear Teep',
    description: 'Catch the rear teep, then knee. Drop the knee in front, no need to pull it back. Push your hips forward for power and balance.',
    tags: ['REAR TEEP: CATCH → KNEE', 'HIP FORWARD → BALANCE / POWER'],
    safety: 'Beginners: no knees, never the face · Knee the body first, go slow',
    caption:
      'Counter the rear teep 🦵\nEP 2/10 · At range\n\nDefense is offense: catch the teep, and the knee is right there.\n\nCatch the rear teep, then knee. Drop the knee in front, no need to pull it back. Push your hips forward for power and balance.\n\nDrill safely: beginners, no knees, never the face. Knee the body first and go slow.\n\nHow do you counter the teep? 👇\n\n#muaythai #muaykhao #teep #kneestrike #TheMuayKhaoStyle',
    youtubeId: '',
  },
  {
    code: 'EP 3',
    stage: 'At range',
    durationLabel: '1:25',
    title: 'Counter the Power Kick: Low Kick',
    description: "Block it, then drop your foot forward, closer to them, and low kick. Don't land back where you started; lean the opposite way and kick the other side.",
    tags: ['BLOCK → DROP CLOSER', '✓ / ✗', 'LEAN OPPOSITE → LOW KICK'],
    safety: 'Beginners: light contact on the block and the kick',
    caption:
      "Counter the power kick 💥\nEP 3/10 · At range\n\nDefense is offense: the block puts your foot closer for the low kick.\n\nBlock it, then drop your foot forward, closer to them, and low kick. Don't land back where you started. Lean the opposite way and kick the other side.\n\nSave this and try it at your next class 📌\n\n#muaythai #muaykhao #lowkick #counterattack #TheMuayKhaoStyle",
    youtubeId: '',
  },
  {
    code: 'EP 4',
    stage: 'At range',
    durationLabel: '1:21',
    title: 'Counter the Kick: Catch & Turn',
    description: 'Catch the kick with both hands, push it to the side and turn them. The takedown is shown by Kru only.',
    tags: ['CATCH & TURN', 'BOTH HANDS', 'PUSH TO THE SIDE'],
    safety: "Takedown: Kru's demo only · Drill: no takedown · Beginners: don't sweep",
    caption:
      "Counter the kick: catch & turn 🔄\nEP 4/10 · At range\n\nDefense is offense: the catch is already the turn.\n\nCatch the kick with both hands, push it to the side and turn them.\n\nDrill safely: the takedown is Kru's demo only. In the drill, no takedowns, and beginners don't sweep.\n\n#muaythai #muaykhao #catchkick #muaythaitechnique #TheMuayKhaoStyle",
    youtubeId: '',
  },
  {
    code: 'EP 5',
    stage: 'Clinch door',
    durationLabel: '1:31',
    title: 'Keep Them Out',
    description: 'Use the front leg teep to break their entry. Too strong to push off? Block with both hands. When they push, hop to keep your own rhythm. Hands first, then the knee.',
    tags: ['FRONT LEG TEEP', 'THEY PUSH? HOP', 'YOUR OWN RHYTHM', 'HAND FIRST'],
    safety: 'Beginners: no knees',
    caption:
      'Keep them out 🚫\nEP 5/10 · Clinch door\n\nOffense is defense: your teep is your wall.\n\nThey want the clinch? Use the front leg teep to break their entry. Too strong to push off? Block with both hands. When they push, hop and keep your own rhythm. Hands first, then the knee.\n\nDrill safely: beginners, no knees.\n\n#muaythai #muaykhao #clinch #teep #TheMuayKhaoStyle',
    youtubeId: '',
  },
  {
    code: 'EP 6',
    stage: 'Clinch door',
    durationLabel: '1:30',
    title: 'Defense to Offense',
    description: "The bridge episode. First half: after the kick, don't cross the middle, drop in front, hop when you have no power. Second half: go into the clinch yourself — start outside, hands to their chest, relax and be fast.",
    tags: ["DON'T CROSS THE MIDDLE", 'DROP IN FRONT', 'NO POWER? HOP', 'START OUTSIDE', 'HANDS TO YOUR CHEST', 'RELAX, BE FAST'],
    safety: 'Beginners: no knees',
    caption:
      "Kick first, or go in ⚡\nEP 6/10 · Clinch door\n\nOffense is defense: kick and land in front, ready for whatever comes back.\n\nAfter the kick, don't cross the middle: drop in front, and hop when you have no power. Or go in yourself: start outside, hands to their chest, relax and be fast.\n\nKick first or go in, which one are you? 👇\n\n#muaythai #muaykhao #clinch #muaythaitechnique #TheMuayKhaoStyle",
    youtubeId: '',
  },
  {
    code: 'EP 7',
    stage: 'Inside',
    durationLabel: '1:20',
    title: 'Win the Arm',
    description: "Clinch first step is controlling the arms. Relax, feet square. Legs get caught? Take it out. Elbow stops them from getting inside. Control the arm and you can attack — they can't reach your head.",
    tags: ['RELAX, FEET SQUARE', 'TAKE THE LEG OUT', 'ELBOW STOPS THEM', 'CONTROL THE ARM'],
    safety: 'Beginners: no knees, no takedowns',
    caption:
      "Win the arm 💪\nEP 7/10 · Inside\n\nBoth at once: control the arm, and they can't reach your head while you're ready to attack.\n\nIn the clinch, the arms come first. Relax, feet square. Use the elbow to stop them getting inside. Control the arm and you can attack, and they can't reach your head.\n\nDrill safely: beginners, no knees, no takedowns.\n\n#muaythai #muaykhao #clinch #clinchwork #TheMuayKhaoStyle",
    youtubeId: '',
  },
  {
    code: 'EP 8',
    stage: 'Inside',
    durationLabel: '1:26',
    title: 'Defend for Return',
    description: 'They go for your neck: defend for return. Push their face with the same-side hand, make distance, step back and knee.',
    tags: ['DEFEND FOR RETURN', 'PUSH THE FACE', 'MAKE DISTANCE, KNEE', 'PUSH, STEP BACK, KNEE'],
    safety: 'Beginners: no knees',
    caption:
      'They go for the neck 🛡️\nEP 8/10 · Inside\n\nDefense is offense: the push that frees your neck makes room for your knee.\n\nDefend for return. Push their face with the same-side hand, make distance, step back and knee.\n\n"Defend for attack, defend for return."\n\nDrill safely: beginners, no knees.\n\n#muaythai #muaykhao #clinch #kneestrike #TheMuayKhaoStyle',
    youtubeId: '',
  },
  {
    code: 'EP 9',
    stage: 'Strike',
    durationLabel: '1:26',
    title: 'Pull the Head, Knee',
    description: 'Only knee once the head comes down. Push to the side, one hand inside, one hand locked, jerk down, step back, knee.',
    tags: ['PULL THE HEAD', 'SIDE AND PUSH', 'ONE HAND LOCKED', 'JERK DOWN, STEP BACK'],
    safety: 'Beginners: no knees · Sparring: never the face',
    caption:
      'Pull the head, then knee 🎯\nEP 9/10 · Strike\n\nEvery setup → the knee.\n\nOnly knee once the head comes down. Go to the side and push. One hand inside, one hand locked, jerk down, step back, knee.\n\nDrill safely: beginners, no knees. Sparring: never the face.\n\n#muaythai #muaykhao #kneestrike #clinch #TheMuayKhaoStyle',
    youtubeId: '',
  },
  {
    code: 'EP 10',
    stage: 'Strike',
    durationLabel: '1:40',
    title: 'Turn & Walk Over',
    description: 'The final episode. Turn them in the clinch, or get inside and walk forward to put them down (Kru only). Ends with the thank-you, the cheers and the group photo.',
    tags: ['TURN', 'WALK OVER', 'GET INSIDE, WALK FORWARD'],
    safety: "Takedown/walk-over: Kru's demo only",
    caption:
      "Turn, or walk over 🏁\nEP 10/10 · Strike\n\nOne idea, start to finish: defense is offense, offense is defense.\n\nThe final episode. Turn them in the clinch, or get inside and walk forward over them. Turns and takedowns are Kru's demo only.\n\nThank you to everyone who came to the seminar 🙏 Stay for the cheers at the end.\n\n#muaythai #muaykhao #clinch #muaythaiseminar #TheMuayKhaoStyle",
    youtubeId: '',
  },
  {
    code: 'Bonus',
    stage: 'Highlights',
    durationLabel: '1:00',
    title: 'Live Round & Highlights',
    description: 'The best moments of the series in slow motion, then a full live clinch round at real speed.',
    tags: ['LIVE ROUND'],
    safety: '',
    caption:
      'Live round 🔥\n\nDefense is offense, offense is defense, at full speed.\n\nThe best moments of the Muay Khao series in slow motion, then a full live clinch round at real speed.\n\nMissed the series? Start from EP 0 on our page.\n\n#muaythai #muaykhao #clinch #muaythaisparring #TheMuayKhaoStyle',
    youtubeId: '',
  },
]
