// biome-ignore format: ignore
const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
    'seventeen', 'eighteen', 'nineteen']

// biome-ignore format: ignore
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

// biome-ignore format: ignore
const chunks = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion']

// biome-ignore format: ignore
const valueMap: Record<string, number> = {
  'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
  'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
  'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
  'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19,
  'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
  'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90,
  'hundred': 100, 'thousand': 1000, 'million': 1000000,
  'billion': 1000000000, 'trillion': 1000000000000,
  'quadrillion': 1000000000000000, 'quintillion': 1000000000000000000
}

/**
 * Converts a number to English words (cardinal)
 * @param num - The number to convert
 * @param useUKStyle - Whether to use UK English style (with "and" between hundreds and tens/units) (default: false)
 * @returns The English word representation
 *
 * @remarks
 * - Complex large number and negative numbers are supported
 * - US and UK English styles are supported (UK style uses "and" between hundreds and tens/units)
 * - Fractions are not supported
 * @category English Numeral
 */
export function toEnglishWords(num: number, useUKStyle = false): string {
  if (!Number.isFinite(num)) {
    throw new Error('Input must be a finite number')
  }
  if (!Number.isInteger(num)) {
    throw new Error('Input must be an integer (fractions are not supported)')
  }
  if (Math.abs(num) >= 1e21) {
    throw new Error(
      'Input is out of the supported range (|num| must be < 1e21)'
    )
  }

  if (num === 0) {
    return 'zero'
  }

  const isNegative = num < 0
  num = Math.abs(num)

  const words: string[] = []

  function processBelowThousand(n: number): string {
    if (n < 20) {
      return ones[n]
    } else if (n < 100) {
      return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? `-${ones[n % 10]}` : '')
    } else {
      const hundreds = `${ones[Math.floor(n / 100)]} hundred`
      const remainder = n % 100
      if (remainder === 0) {
        return hundreds
      } else {
        const remainderText = processBelowThousand(remainder)
        return hundreds + (useUKStyle ? ' and ' : ' ') + remainderText
      }
    }
  }

  // Process in chunks of 3 digits
  let i = 0
  while (num > 0) {
    const chunk = num % 1000
    if (chunk !== 0) {
      const chunkText = processBelowThousand(chunk)
      const chunkWithUnit = chunkText + (i > 0 ? ` ${chunks[i]}` : '')
      words.unshift(chunkWithUnit)
    }
    num = Math.floor(num / 1000)
    i++
  }

  let result = (isNegative ? 'negative ' : '') + words.join(' ')

  // Generalized UK style: insert 'and' before the final group only when that
  // group is the bare units group (value 1-99, carrying no scale word such as
  // hundred/thousand/million...). Official British usage never says e.g.
  // "one million and one thousand" — the "and" only precedes the last
  // tens/units group. Within-group "and" (after "hundred") is already handled
  // by processBelowThousand above.
  if (useUKStyle && words.length > 1) {
    const lastChunk = words[words.length - 1]
    if (
      !/hundred|thousand|million|billion|trillion|quadrillion|quintillion/.test(
        lastChunk
      )
    ) {
      result =
        (isNegative ? 'negative ' : '') +
        words.slice(0, -1).join(' ') +
        ' and ' +
        lastChunk
    }
  }

  return result
}

/**
 * Converts English words (cardinal) to a number
 * @param words - The English words representing a number
 * @returns The numeric value
 * @throws Error if the input contains a word that is not an English number word,
 * or if it contains no number word at all (e.g. `""`, `"and"`)
 * @remarks
 * This parser is intentionally lenient: it sums recognized number words and
 * ignores the connector "and", so uncommon or malformed-but-parseable inputs
 * still return a (possibly unexpected) value rather than throwing — e.g.
 * `"thousand five"` -> 5, `"twenty twenty"` -> 40, `"hundred one"` -> 1. Use
 * {@link validateEnglishWords} when you need strict validation of spelling and
 * word order.
 * @category English Numeral
 */
export function fromEnglishWords(words: string): number {
  words = words.toLowerCase().replace(/[-,]/g, ' ').trim()

  if (words === 'zero') {
    return 0
  }

  let isNegative = false
  if (words.startsWith('negative ')) {
    isNegative = true
    words = words.substring(9).trim()
  }

  const wordList = words.split(/\s+/)
  let result = 0
  let currentSum = 0
  let consumed = 0

  for (let i = 0; i < wordList.length; i++) {
    const word = wordList[i]

    // Skip "and" as it's just a connector in UK style
    if (word === 'and') {
      continue
    }

    const value = valueMap[word]

    if (value === undefined) {
      throw new Error(`Invalid word in number: "${word}"`)
    }
    consumed++

    if (value >= 1000) {
      // For thousand, million, etc.
      result += currentSum * value
      currentSum = 0
    } else if (value === 100) {
      // For hundred
      currentSum = currentSum * value
    } else {
      // For numbers below 100
      currentSum += value
    }
  }

  // Reject inputs that contained no actual number word (e.g. "and", "")
  if (consumed === 0) {
    throw new Error('Input contains no English number words')
  }

  result += currentSum
  const out = isNegative ? -result : result
  // Normalize negative zero ("negative zero") to 0
  return out === 0 ? 0 : out
}

/**
 * Validates if a string is a strictly valid English number word (cardinal) representation
 * by converting it to a number and back to words to check for consistency
 * @param words - The English words to validate
 * @param loose - Whether to allow loose validation (default: false)
 * @returns true if the words are valid (US or UK style; must have correct hyphenation - although wrong hyphenation is recognizable by `fromEnglishWords()`, it will return false here), false otherwise
 * @category English Numeral
 */
export function validateEnglishWords(words: string, loose = false): boolean {
  if (loose) {
    words = fixEnglishWords(words)
  }

  try {
    const num = fromEnglishWords(words)
    const usStyle = toEnglishWords(num, false)
    const ukStyle = toEnglishWords(num, true)
    const normalizedInput = words.toLowerCase().trim()
    return normalizedInput === usStyle || normalizedInput === ukStyle
  } catch {
    return false
  }
}

const TEN_PREFIXES = [
  'twen',
  'thir',
  'for',
  'fif',
  'six',
  'seven',
  'eigh',
  'nine',
] as const
const TEN_PREFIXES_REGEX2 = new RegExp(
  `\\b(${TEN_PREFIXES.join('|')})ty-([a-z]+)`,
  'gi'
)
const HYPHEN_PLACEHOLDER = '<[HYPHEN]>'

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Normalizes English number words and English ordinal words by standardizing hyphenation patterns
 *
 * @param text - The text containing English number words to normalize
 * @returns The normalized text with consistent hyphenation patterns
 *
 * @example
 * ```ts
 * fixEnglishWords("twenty one")     // returns "twenty-one"
 * fixEnglishWords("twenty-one")     // returns "twenty-one" (unchanged)
 * fixEnglishWords("one-hundred")    // returns "one hundred"
 * fixEnglishWords("twenty one and thirty-five")  // returns "twenty-one and thirty-five"
 * fixEnglishWords("THIRTY FIVE")    // returns "THIRTY-FIVE"
 * fixEnglishWords("Page forty two of chapter fifty seven") // returns "Page forty-two of chapter fifty-seven"
 * fixEnglishWords("twenty first")     // returns "twenty-first"
 * fixEnglishWords("twenty-first")     // returns "twenty-first" (unchanged)
 * fixEnglishWords("one-hundredth")    // returns "one hundredth"
 * fixEnglishWords("twenty first and thirty-fifth")  // returns "twenty-first and thirty-fifth"
 * fixEnglishWords("THIRTY FIFTH")    // returns "THIRTY-FIFTH"
 * fixEnglishWords("the forty second page of the fifty seventh chapter") // returns "the forty-second page of the fifty-seventh chapter"
 * ```
 *
 * @remarks Not supported:
 * - 'twenty - one''s fix
 * - The year is twenty twenty-three
 * @category English Numeral
 */
export function fixEnglishWords(text: string): string {
  const tensWords = [
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ]
  // Words that must NOT be hyphenated onto a preceding tens word: other tens
  // words ("twenty thirty" style), scale words ("twenty thousand"), and the
  // connector "and". Hyphenating a tens word to a scale word (e.g.
  // "twenty-thousand") produces a string neither toEnglishWords nor
  // fromEnglishWords accepts, and breaks getTypes detection of common numbers.
  const noHyphenAfter = new Set([
    ...tensWords,
    'hundred',
    'thousand',
    'million',
    'billion',
    'trillion',
    'quadrillion',
    'quintillion',
    'and',
  ])
  const tensUnitRegex = new RegExp(
    `\\b(${TEN_PREFIXES.join('|')})ty ([a-zA-Z]+)`,
    'gi'
  )

  const hyphenateTensUnit = (match: string, _prefix: string, unit: string) => {
    if (noHyphenAfter.has(unit.toLowerCase())) {
      return match
    }
    const spaceIdx = match.indexOf(' ')
    return `${match.slice(0, spaceIdx)}-${match.slice(spaceIdx + 1)}`
  }

  if (text.includes(HYPHEN_PLACEHOLDER)) {
    return text.replace(tensUnitRegex, hyphenateTensUnit)
  }

  const fixedTens = text.replace(tensUnitRegex, hyphenateTensUnit)

  const protectedHyphens = fixedTens.replace(TEN_PREFIXES_REGEX2, (match) =>
    match.replace('-', HYPHEN_PLACEHOLDER)
  )

  const replacedHyphens = protectedHyphens.replace(/-/g, ' ')

  return replacedHyphens.replace(
    new RegExp(escapeRegExp(HYPHEN_PLACEHOLDER), 'g'),
    '-'
  )
}
