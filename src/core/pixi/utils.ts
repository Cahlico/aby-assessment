export function calculateSpiralPosition(
  index: number,
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number } {
  const centerX = canvasWidth / 2
  const centerY = canvasHeight / 2

  if (index === 0) {
    return { x: centerX, y: centerY }
  }

  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  const radius = 80 + index * 40
  const angle = index * goldenAngle

  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle)
  }
}

/**
 * Calculate position using grid pattern
 */
export function calculateGridPosition(
  index: number,
  canvasWidth: number,
  canvasHeight: number,
  columns = 3,
  spacing = 200
): { x: number; y: number } {
  const startX = 150
  const startY = 150

  const col = index % columns
  const row = Math.floor(index / columns)

  return {
    x: startX + col * spacing,
    y: startY + row * spacing
  }
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Calculate angle between two points
 */
export function angleBetweenPoints(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.atan2(y2 - y1, x2 - x1)
}

/**
 * Calculate distance between two points
 */
export function distanceBetweenPoints(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x2 - x1
  const dy = y2 - y1
  return Math.sqrt(dx * dx + dy * dy)
}
