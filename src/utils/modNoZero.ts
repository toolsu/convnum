/**
 * Mod function that returns positive result for negative numbers or for 0
 * @param n
 * @param m
 * @returns positive result for negative numbers or for 0
 * @internal
 */
export function modNoZero(n: number, m: number): number {
  if (m <= 0) {
    throw new Error('Modulus must be a positive number')
  }
  const result = ((n % m) + m) % m
  return result === 0 ? m : result
}
