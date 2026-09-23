// biome-ignore format: ignore
const units = [
  '', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix',
  'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf',
]
// biome-ignore format: ignore
const tens = [
  '', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix',
]

// Dictionary of simple French number words
// biome-ignore format: ignore
const numberMap: Record<string, number> = {
  zéro: 0, un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7, huit: 8, neuf: 9, dix: 10,
  onze: 11, douze: 12, treize: 13, quatorze: 14, quinze: 15, seize: 16,
  'dix-sept': 17, 'dix-huit': 18, 'dix-neuf': 19,
  vingt: 20, trente: 30, quarante: 40, cinquante: 50
}

// Every valid word after a full hyphen-split of any (traditional or 1990-reform)
// French cardinal, used to reject inputs containing non-number words.
// biome-ignore format: ignore
const VALID_FRENCH_TOKENS = new Set([
  'zéro', 'un', 'une', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix',
  'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize',
  'vingt', 'vingts', 'trente', 'quarante', 'cinquante', 'soixante',
  'cent', 'cents', 'mille', 'million', 'millions', 'milliard', 'milliards',
  'et', 'moins',
])

const convertLessThanOneThousand = (n: number): string => {
  if (n < 20) {
    return units[n]
  }

  const digit = n % 10
  if (n < 70) {
    if (digit === 1) {
      return `${tens[Math.floor(n / 10)]}-et-${units[digit]}`
    }
    return tens[Math.floor(n / 10)] + (digit > 0 ? `-${units[digit]}` : '')
  }

  if (n < 80) {
    if (digit === 1) {
      return `soixante-et-${units[10 + digit]}`
    }
    return `soixante${digit > 0 ? `-${units[10 + digit]}` : '-dix'}`
  }

  if (n < 90) {
    return `quatre-vingt${digit > 0 ? `-${units[digit]}` : 's'}`
  }

  return `quatre-vingt${digit > 0 ? `-${units[10 + digit]}` : '-dix'}`
}

const convert = (n: number): string => {
  if (n < 100) {
    return convertLessThanOneThousand(n)
  }

  if (n < 1000) {
    const hundreds = Math.floor(n / 100)
    const remainder = n % 100

    if (hundreds === 1) {
      return (
        'cent' +
        (remainder > 0 ? `-${convertLessThanOneThousand(remainder)}` : '')
      )
    } else {
      return (
        units[hundreds] +
        '-cent' +
        (remainder > 0 ? `-${convertLessThanOneThousand(remainder)}` : 's')
      )
    }
  }

  if (n < 1000000) {
    const thousands = Math.floor(n / 1000)
    const remainder = n % 1000

    if (thousands === 1) {
      return `mille${remainder > 0 ? `-${convert(remainder)}` : ''}`
    } else {
      // "vingt" and "cent" are invariable before "mille" (a numeral, not a
      // noun): "quatre-vingt-mille" not "quatre-vingts-mille", "deux-cent-mille"
      // not "deux-cents-mille". Only the terminal plural-s (which can only come
      // from a trailing "vingts"/"cents") is dropped. Note: before "millions"/
      // "milliards" (nouns) the plural-s is KEPT, so those branches are untouched.
      const thousandsStr = convert(thousands).replace(/(vingt|cent)s$/, '$1')
      return (
        thousandsStr +
        '-mille' +
        (remainder > 0 ? `-${convert(remainder)}` : '')
      )
    }
  }

  if (n < 1000000000) {
    const millions = Math.floor(n / 1000000)
    const remainder = n % 1000000

    if (millions === 1) {
      return `un-million${remainder > 0 ? `-${convert(remainder)}` : ''}`
    } else {
      return (
        convert(millions) +
        '-millions' +
        (remainder > 0 ? `-${convert(remainder)}` : '')
      )
    }
  }

  const billions = Math.floor(n / 1000000000)
  const remainder = n % 1000000000

  if (billions === 1) {
    return `un-milliard${remainder > 0 ? `-${convert(remainder)}` : ''}`
  } else {
    return (
      convert(billions) +
      '-milliards' +
      (remainder > 0 ? `-${convert(remainder)}` : '')
    )
  }
}

/**
 * Converts a number to French words (cardinal)
 * @param num - The number to convert
 * @returns The French word representation (fully hyphenated)
 *
 * @remarks
 * - Complex large number and negative numbers are supported
 * - The result uses the fully hyphenated form as recommended by the 1990 reform
 * - Fractions are not supported
 * @category French Numeral
 */
export function toFrenchWords(num: number): string {
  if (!Number.isFinite(num)) {
    throw new Error('Input must be a finite number')
  }
  if (!Number.isInteger(num)) {
    throw new Error('Input must be an integer (fractions are not supported)')
  }

  if (num === 0) {
    return 'zéro'
  }

  const isNegative = num < 0
  num = Math.abs(num)

  return (isNegative ? 'moins-' : '') + convert(num)
}

/**
 * Converts French words (cardinal) to a number
 * @param words - The French words representing a number (hyphenation does not matter)
 * @returns The numeric value
 * @throws Error if the input is empty or contains a word that is not a French number word
 *
 * @remarks
 * - The input can be either in the fully hyphenated form recommended by the 1990 reform or in the traditional (space-separated) form; hyphenation and whitespace do not matter, but every word must be a valid French number word.
 * - Like {@link fromEnglishWords}, the parser is lenient about word order: it recognizes and sums valid number words, so some uncommon arrangements (e.g. `"cent cent"`) still return a value rather than throwing. Use {@link validateFrenchWords} for strict validation.
 * @category French Numeral
 */
export function fromFrenchWords(words: string): number {
  // Sanitize input and normalize whitespace/hyphen runs into single hyphens so
  // we deal with hyphenated words only (handles multiple spaces, tabs, and the
  // traditional space-separated form alike)
  words = words
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, '-')
    .replace(/^-|-$/g, '')

  if (words === '') {
    throw new Error('Invalid French number words: empty input')
  }

  // Handle negative numbers
  if (words.startsWith('moins-')) {
    return -fromFrenchWords(words.substring(6))
  }

  if (words === 'zéro') {
    return 0
  }

  // Reject any input containing a word that is not a French number word
  for (const token of words.split('-')) {
    if (!VALID_FRENCH_TOKENS.has(token)) {
      throw new Error(`Invalid word in French number: "${token}"`)
    }
  }

  // Handle simple cases first - check if the entire string is in our map
  if (numberMap[words] !== undefined) {
    return numberMap[words]
  }

  let total = 0
  let current = 0

  // Process by finding patterns and large numbers first
  let remaining = words

  // Handle billions
  for (const suffix of ['milliards', 'milliard']) {
    const pattern = new RegExp(`^(.*?)[-]?${suffix}[-]?(.*)$`)
    const match = remaining.match(pattern)
    if (match) {
      const beforePart = match[1].trim().replace(/^-|-$/g, '')
      const afterPart = match[2].trim().replace(/^-|-$/g, '')
      const multiplier = beforePart ? fromFrenchWords(beforePart) : 1
      total += multiplier * 1000000000
      remaining = afterPart
      break
    }
  }

  // Handle millions
  for (const suffix of ['millions', 'million']) {
    const pattern = new RegExp(`^(.*?)[-]?${suffix}[-]?(.*)$`)
    const match = remaining.match(pattern)
    if (match) {
      const beforePart = match[1].trim().replace(/^-|-$/g, '')
      const afterPart = match[2].trim().replace(/^-|-$/g, '')
      const multiplier = beforePart ? fromFrenchWords(beforePart) : 1
      total += multiplier * 1000000
      remaining = afterPart
      break
    }
  }

  // Handle thousands
  const milleMatch = remaining.match(/^(.*?)[-]?mille[-]?(.*)$/)
  if (milleMatch) {
    const beforePart = milleMatch[1].trim().replace(/^-|-$/g, '')
    const afterPart = milleMatch[2].trim().replace(/^-|-$/g, '')
    const multiplier = beforePart ? fromFrenchWords(beforePart) : 1
    total += multiplier * 1000
    remaining = afterPart
  }

  // Handle what's left (should be < 1000)
  if (remaining) {
    current = parseUnderThousand(remaining)
  }

  const result = total + current
  if (Number.isNaN(result)) {
    throw new Error(`Invalid French number words: "${words}"`)
  }
  return result
}

// Helper function to parse numbers under 1000
function parseUnderThousand(words: string): number {
  if (!words) {
    return 0
  }

  // Check if it's a simple word we know
  if (numberMap[words] !== undefined) {
    return numberMap[words]
  }

  let result = 0
  let remaining = words

  // Handle hundreds
  const centMatch = remaining.match(/^(.*?)[-]?cents?[-]?(.*)$/)
  if (centMatch) {
    const beforePart = centMatch[1].trim().replace(/^-|-$/g, '')
    const afterPart = centMatch[2].trim().replace(/^-|-$/g, '')
    const multiplier = beforePart ? numberMap[beforePart] : 1
    result += multiplier * 100
    remaining = afterPart
  }

  // Handle special cases for 70-99
  if (remaining) {
    // quatre-vingt-dix-neuf (99), quatre-vingt-dix-huit (98), etc.
    const quatreVingtDixMatch = remaining.match(/^quatre-vingt-dix[-]?(.*)$/)
    if (quatreVingtDixMatch) {
      result += 90
      const extra = quatreVingtDixMatch[1]
      if (extra && numberMap[extra]) {
        result += numberMap[extra]
      }
      return result
    }

    // quatre-vingt-xxx (81-89)
    const quatreVingtMatch = remaining.match(/^quatre-vingts?[-]?(.*)$/)
    if (quatreVingtMatch) {
      result += 80
      const extra = quatreVingtMatch[1]
      if (extra && numberMap[extra]) {
        result += numberMap[extra]
      }
      return result
    }

    // soixante-dix-xxx (70-79)
    const soixanteDixMatch = remaining.match(/^soixante-dix[-]?(.*)$/)
    if (soixanteDixMatch) {
      result += 70
      const extra = soixanteDixMatch[1]
      if (extra && numberMap[extra]) {
        result += numberMap[extra]
      }
      return result
    }

    // soixante-xxx (60-69)
    const soixanteMatch = remaining.match(/^soixante[-]?(.*)$/)
    if (soixanteMatch) {
      result += 60
      const extra = soixanteMatch[1]
      if (extra) {
        // Handle soixante-et-onze, etc.
        const etMatch = extra.match(/^et[-]?(.*)$/)
        if (etMatch && numberMap[etMatch[1]]) {
          result += numberMap[etMatch[1]]
        } else if (numberMap[extra]) {
          result += numberMap[extra]
        }
      }
      return result
    }

    // Handle other tens with "et" pattern
    for (const [tensWord, tensValue] of Object.entries(numberMap)) {
      if (tensValue >= 20 && tensValue <= 60 && tensValue % 10 === 0) {
        const etPattern = new RegExp(`^${tensWord}-et[-]?(.*)$`)
        const etMatch = remaining.match(etPattern)
        if (etMatch) {
          result += tensValue
          if (numberMap[etMatch[1]]) {
            result += numberMap[etMatch[1]]
          }
          return result
        }

        const regularPattern = new RegExp(`^${tensWord}[-]?(.*)$`)
        const regularMatch = remaining.match(regularPattern)
        if (regularMatch) {
          result += tensValue
          if (regularMatch[1] && numberMap[regularMatch[1]]) {
            result += numberMap[regularMatch[1]]
          }
          return result
        }
      }
    }

    // If nothing matched, try to parse as a simple number
    if (numberMap[remaining]) {
      result += numberMap[remaining]
    }
  }

  return result
}

/**
 * Validates if a string (case insensitive) is a valid French number word (cardinal) representation
 * by converting it to a number and back to words to check for consistency
 * @param words - The French words to validate
 * @returns true if the words are valid, false otherwise
 *
 * @remarks The input can be either in the fully hyphenated form recommended by the 1990 reform or in the traditional form,
 * as both are valid per official standards.
 * Therefore, you don't need to worry about the use of hyphens in the input, but the spelling of the words must still be correct
 * @category French Numeral
 */
export function validateFrenchWords(words: string): boolean {
  try {
    words = words
      .toLowerCase()
      .trim()
      .replace(/[\s-]+/g, '-')
      .replace(/^-|-$/g, '')
    const num = fromFrenchWords(words)
    const convertedBack = toFrenchWords(num)
    return words === convertedBack
  } catch {
    return false
  }
}
