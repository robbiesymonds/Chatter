// Based on http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
const goldenRatio = 0.618033988749895

function random(seed: number) {
  let t = (seed += 0x2d2a84f1)
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const generate = (i: number, s: number, v: number) => {
  let hue = random(i)
  hue += goldenRatio
  hue %= 1
  return `hsla(${hue * 360}, ${s * 100}%, ${v * 100}%, 1)`
}

const randomColor = (options: { s?: number; v?: number; count?: number }): string | string[] => {
  const results: string[] = []
  for (let i = 0; i < (options.count ?? 1); i++)
    results.push(generate(i, options.s ?? 0.5, options.v ?? 0.65))
  return options.count === 1 ? results[0] : results
}

export default randomColor
