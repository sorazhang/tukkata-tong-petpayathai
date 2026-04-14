// Pixel-art Muay Thai fighter in guard stance
// 16 × 22 grid   key: B = body, R = gloves (red), G = mongkol (gold), . = transparent

const GRID = [
  '....BBBB........', // 0  head top
  '...BBBBBB.......', // 1  head
  '...BGGGGB.......', // 2  mongkol
  '...BBBBBB.......', // 3  face
  '....BBBB........', // 4  chin
  '...BBBBBB.......', // 5  neck
  '.BBBBBBBBBB.....', // 6  shoulders
  'RRR.BBBB.RRR....', // 7  guard – fists level
  'RRR.BBBB.RRR....', // 8
  '.RR.BBBB.RR.....', // 9  forearms taper
  '....BBBBBB......', // 10 torso
  '....BBBBBB......', // 11
  '....BBBBBB......', // 12
  '.....BBBB.......', // 13 waist
  '....BB..BB......', // 14 thighs split
  '....BB..BB......', // 15
  '...BB....BB.....', // 16 knees widen
  '...BB....BB.....', // 17
  '..BB......BB....', // 18 shins
  '..BB......BB....', // 19
  '..BBB....BBB....', // 20 ankles
  '..BBBB..BBBB....', // 21 feet
]

const GRID_W = 16
const GRID_H = 22

const DARK_COLORS: Record<string, string> = {
  B: '#1a1a1a',
  R: '#d32f2f',
  G: '#c9a84c',
}

const LIGHT_COLORS: Record<string, string> = {
  B: '#ffffff',
  R: '#d32f2f',
  G: '#c9a84c',
}

interface PixelFighterProps {
  pixelSize?: number
  variant?: 'dark' | 'light'
  className?: string
}

export default function PixelFighter({
  pixelSize = 6,
  variant = 'dark',
  className,
}: PixelFighterProps) {
  const colors = variant === 'light' ? LIGHT_COLORS : DARK_COLORS

  const pixels: { x: number; y: number; fill: string }[] = []
  for (let r = 0; r < GRID.length; r++) {
    for (let c = 0; c < GRID[r].length; c++) {
      const ch = GRID[r][c]
      if (ch !== '.' && colors[ch]) {
        pixels.push({ x: c * pixelSize, y: r * pixelSize, fill: colors[ch] })
      }
    }
  }

  return (
    <svg
      width={GRID_W * pixelSize}
      height={GRID_H * pixelSize}
      viewBox={`0 0 ${GRID_W * pixelSize} ${GRID_H * pixelSize}`}
      style={{ imageRendering: 'pixelated' }}
      className={className}
      aria-hidden="true"
    >
      {pixels.map((p, i) => (
        <rect
          key={i}
          x={p.x}
          y={p.y}
          width={pixelSize}
          height={pixelSize}
          fill={p.fill}
        />
      ))}
    </svg>
  )
}
