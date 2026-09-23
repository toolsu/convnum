import { reverseKeyValue } from '../utils/reverseKeyValue'

// Mapping for basic cardinal to ordinal
const cardinalToOrdinal: Record<string, string> = {
  one: 'first',
  two: 'second',
  three: 'third',
  four: 'fourth',
  five: 'fifth',
  six: 'sixth',
  seven: 'seventh',
  eight: 'eighth',
  nine: 'ninth',
  ten: 'tenth',
  eleven: 'eleventh',
  twelve: 'twelfth',
  thirteen: 'thirteenth',
  fourteen: 'fourteenth',
  fifteen: 'fifteenth',
  sixteen: 'sixteenth',
  seventeen: 'seventeenth',
  eighteen: 'eighteenth',
  nineteen: 'nineteenth',
  twenty: 'twentieth',
  thirty: 'thirtieth',
  forty: 'fortieth',
  fifty: 'fiftieth',
  sixty: 'sixtieth',
  seventy: 'seventieth',
  eighty: 'eightieth',
  ninety: 'ninetieth',
  hundred: 'hundredth',
  thousand: 'thousandth',
  million: 'millionth',
  billion: 'billionth',
  trillion: 'trillionth',
  quadrillion: 'quadrillionth',
  quintillion: 'quintillionth',
}

// Mapping for basic ordinal to cardinal
const ordinalToCardinal: Record<string, string> =
  reverseKeyValue(cardinalToOrdinal)

/**
 * Converts a number to its ordinal abbreviation in English (e.g., 1 -> "1st", 2 -> "2nd")
 * @param num - The number to convert
 * @returns The ordinal form of the number
 * @throws Error if input is not a finite number
 * @remarks Can handle negative numbers and zero
 * @category English Numeral
 */
export function toEnglishOrdinalAbbr(num: number): string {
  if (!Number.isFinite(num)) {
    throw new Error('Input must be a finite number')
  }
  if (!Number.isInteger(num)) {
    throw new Error('Input must be an integer')
  }

  const isNegative = num < 0
  const absNum = Math.abs(num)
  const numStr = absNum.toString()

  // Special cases for numbers ending in 11, 12, 13
  if (absNum % 100 >= 11 && absNum % 100 <= 13) {
    return `${(isNegative ? '-' : '') + numStr}th`
  }

  // Regular cases
  const lastDigit = absNum % 10
  const suffix =
    lastDigit === 1
      ? 'st'
      : lastDigit === 2
        ? 'nd'
        : lastDigit === 3
          ? 'rd'
          : 'th'

  return (isNegative ? '-' : '') + numStr + suffix
}

/**
 * Converts an English ordinal abbreviation to its numeric value
 * @param ordinal - The ordinal number (e.g., "1st", "2nd")
 * @returns The numeric value
 * @throws Error if input is not a valid English ordinal number
 * @remarks Can handle negative numbers and zero
 * @category English Numeral
 */
export function fromEnglishOrdinalAbbr(ordinal: string): number {
  // Sanitize input
  ordinal = ordinal.trim().toLowerCase()

  // Handle negative numbers
  const isNegative = ordinal.startsWith('-')
  if (isNegative) {
    ordinal = ordinal.substring(1)
  }

  // Validate the whole string: digits (no leading zeros / sign / whitespace /
  // trailing garbage) followed by a two-letter ordinal suffix.
  if (!/^(?:0|[1-9]\d*)(?:st|nd|rd|th)$/.test(ordinal)) {
    throw new Error('Invalid ordinal number')
  }

  // Extract numeric part and suffix (numStr is guaranteed to be digits by the
  // regex validation above, so parseInt cannot be NaN here)
  const numStr = ordinal.slice(0, -2)
  const suffix = ordinal.slice(-2)
  const num = Number.parseInt(numStr, 10)

  // Special cases for numbers ending in 11, 12, 13
  if (num % 100 >= 11 && num % 100 <= 13) {
    if (suffix !== 'th') {
      throw new Error('Invalid ordinal number')
    }
    return isNegative ? -num : num
  }

  // Regular cases
  const lastDigit = num % 10
  const expectedSuffix =
    lastDigit === 1
      ? 'st'
      : lastDigit === 2
        ? 'nd'
        : lastDigit === 3
          ? 'rd'
          : 'th'

  if (suffix !== expectedSuffix) {
    throw new Error('Invalid ordinal number')
  }

  return isNegative ? -num : num
}

function replaceLastWord(
  words: string,
  map: Record<string, string>,
  zero: string,
  zeroReplacement: string
): string {
  words = words.trim()
  if (words.startsWith('negative '))
    return `negative ${replaceLastWord(words.slice(9), map, zero, zeroReplacement)}`

  const lower = (s: string) => s.toLowerCase()
  const matchCase = (src: string, tgt: string) =>
    src === src.toUpperCase()
      ? tgt.toUpperCase()
      : src === src.toLowerCase()
        ? tgt.toLowerCase()
        : src[0] === src[0]?.toUpperCase()
          ? tgt[0].toUpperCase() + tgt.slice(1).toLowerCase()
          : tgt

  if (lower(words) === lower(zero)) {
    return matchCase(words, zeroReplacement)
  }

  const parts = words.split(/([ -])/)
  for (let i = parts.length - 1; i >= 0; i--) {
    const key = lower(parts[i])
    if (parts[i].trim() && map[key]) {
      parts[i] = matchCase(parts[i], map[key])
      break
    }
  }
  return parts.join('')
}

/**
 * Converts English cardinal words to ordinal words
 * @param words - The English cardinal words (e.g., "one", "twenty-one", "one hundred five")
 * @returns The English ordinal words (e.g., "first", "twenty-first", "one hundred fifth")
 * @remarks
 * - This is a lightweight transformer, not a validator: it only replaces the
 *   last recognized number word with its ordinal form and otherwise returns the
 *   input unchanged (e.g. `"invalid"` -> `"invalid"`). Use {@link validateEnglishWords}
 *   to check validity.
 * - Preserves the original US/UK style ("and" usage), and case, from the input
 * @category English Numeral
 */
export function englishWordsToOrdinalWords(words: string): string {
  return replaceLastWord(words, cardinalToOrdinal, 'zero', 'zeroth')
}

/**
 * Converts English ordinal words to cardinal words
 * @param words - The English ordinal words (e.g., "first", "twenty-first", "one hundred and fifth")
 * @returns The English cardinal words (e.g., "one", "twenty-one", "one hundred and five")
 * @remarks
 * - This is a lightweight transformer, not a validator: it only replaces the
 *   last recognized ordinal word with its cardinal form and otherwise returns
 *   the input unchanged (e.g. `"blah"` -> `"blah"`).
 * - Preserves the original US/UK style ("and" usage), and case, from the input
 * @category English Numeral
 */
export function englishOrdinalWordsToWords(words: string): string {
  return replaceLastWord(words, ordinalToCardinal, 'zeroth', 'zero')
}
