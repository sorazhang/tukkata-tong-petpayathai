// Pixel-art category icons — 8 × 8 grid, fill="currentColor"
// Drop inside a colored text container and the icon inherits the color.

const ICONS: Record<string, string[]> = {
  // Rounded fist coming forward
  Striking: [
    '.XXXXX..',
    'XXXXXXX.',
    'XXXXXXXX',
    'XXXXXXXX',
    'XXXXXXXX',
    '.XXXXXX.',
    '..XXXX..',
    '...XX...',
  ],
  // Classic shield
  Defense: [
    '.XXXXXX.',
    'XXXXXXXX',
    'XXXXXXXX',
    'XXXXXXXX',
    '.XXXXXX.',
    '..XXXX..',
    '...XX...',
    '........',
  ],
  // Eye — "see the pattern before it happens"
  'Ring IQ': [
    '........',
    '..XXXX..',
    '.XXXXXX.',
    'XX.XX.XX',
    '.XXXXXX.',
    '..XXXX..',
    '........',
    '........',
  ],
  // Two figures locked in grip
  Clinch: [
    'XX....XX',
    'XXX..XXX',
    'XXXXXXXX',
    '.XXXXXX.',
    '.XXXXXX.',
    'XXX..XXX',
    'XX....XX',
    '........',
  ],
}

const GRID_SIZE = 8

interface PixelCategoryIconProps {
  category: string
  pixelSize?: number
  className?: string
}

export default function PixelCategoryIcon({
  category,
  pixelSize = 2,
  className,
}: PixelCategoryIconProps) {
  const grid = ICONS[category]
  if (!grid) return null

  const pixels: { x: number; y: number }[] = []
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === 'X') {
        pixels.push({ x: c * pixelSize, y: r * pixelSize })
      }
    }
  }

  const size = GRID_SIZE * pixelSize

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
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
          fill="currentColor"
        />
      ))}
    </svg>
  )
}
