/**
 * Converts a number to a Roman numeral string
 * @param num - The number to convert (must be a positive integer between 1 and 3999 (included))
 * @returns The Roman numeral representation
 * @throws Error if input is out of valid range
 * @category Roman Numeral
 */
export function toRoman(num: number): string {
  if (num <= 0 || num > 3999 || !Number.isInteger(num)) {
    throw new Error('Input must be a positive integer between 1 and 3999')
  }

  const romanNumerals: [number, string][] = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ]

  let result = ''

  for (const [value, symbol] of romanNumerals) {
    while (num >= value) {
      result += symbol
      num -= value
    }
  }

  return result
}

/**
 * Converts a Roman numeral string to a number
 * @param roman - The Roman numeral string (must be a valid Roman numeral)
 * @returns The corresponding number
 * @throws Error if input is not a valid Roman numeral
 * @category Roman Numeral
 */
export function fromRoman(roman: string): number {
  if (!roman || !/^[MDCLXVI]+$/i.test(roman)) {
    throw new Error('Input must be a valid Roman numeral')
  }

  const validRomanRegex =
    /^(M{0,3})(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i

  if (!validRomanRegex.test(roman.toUpperCase())) {
    throw new Error('Input is not a valid Roman numeral')
  }

  const romanMap: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  }

  const upperRoman = roman.toUpperCase()
  let result = 0

  for (let i = 0; i < upperRoman.length; i++) {
    const current = romanMap[upperRoman[i]]
    const next = romanMap[upperRoman[i + 1]]

    if (next && current < next) {
      result += next - current
      i++
    } else {
      result += current
    }
  }

  return result
}
