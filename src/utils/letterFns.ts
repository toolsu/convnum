export function toLetter(
  num: number,
  baseCharCode: number,
  length: number
): string {
  if (num < 1 || num > length || !Number.isInteger(num)) {
    throw new Error(`Input must be an integer between 1 and ${length}`)
  }
  return String.fromCharCode(baseCharCode + num - 1)
}

export function fromLetter(
  letter: string,
  baseCharCode: number | number[],
  length: number
): number {
  if (letter?.length !== 1) {
    throw new Error('Input must be a single letter')
  }
  const charCode = letter.charCodeAt(0)
  if (Array.isArray(baseCharCode)) {
    for (const base of baseCharCode) {
      if (charCode >= base && charCode < base + length) {
        return charCode - base + 1
      }
    }
  } else {
    if (charCode >= baseCharCode && charCode < baseCharCode + length) {
      return charCode - baseCharCode + 1
    }
  }
  throw new Error('Input must be a valid letter')
}

/**
 * Capitalizes the first letter of a string and makes the rest lowercase
 * @param str - The string to capitalize
 * @returns The string with its first letter capitalized and rest lowercase
 * @example
 * ```ts
 * capitalizeFirstLetter('hello') // returns 'Hello'
 * capitalizeFirstLetter('WORLD') // returns 'World'
 * capitalizeFirstLetter('tEsT') // returns 'Test'
 * ```
 * @internal
 */
export function capitalizeFirstLetter(str: string): string {
  if (!str) {
    return str
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
