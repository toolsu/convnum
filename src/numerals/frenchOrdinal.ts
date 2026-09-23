import { reverseKeyValue } from '../utils/reverseKeyValue'

// Essential irregular French ordinal mappings
const frenchIrregularCardToOrd: Record<string, string> = {
  un: 'premier',
  deux: 'deuxième',
  trois: 'troisième',
  quatre: 'quatrième',
  cinq: 'cinquième',
  six: 'sixième',
  sept: 'septième',
  huit: 'huitième',
  neuf: 'neuvième',
  dix: 'dixième',
  onze: 'onzième',
  douze: 'douzième',
  treize: 'treizième',
  quatorze: 'quatorzième',
  quinze: 'quinzième',
  seize: 'seizième',
  'dix-sept': 'dix-septième',
  'dix-huit': 'dix-huitième',
  'dix-neuf': 'dix-neuvième',
  vingt: 'vingtième',
  trente: 'trentième',
  quarante: 'quarantième',
  cinquante: 'cinquantième',
  soixante: 'soixantième',
  'soixante-dix': 'soixante-dixième',
  'quatre-vingt': 'quatre-vingtième',
  'quatre-vingts': 'quatre-vingtième',
  'quatre-vingt-dix': 'quatre-vingt-dixième',
  cent: 'centième',
  mille: 'millième',
  million: 'millionième',
  milliard: 'milliardième',
}

// Reverse mapping for ordinal to cardinal
const frenchIrregularOrdToCard = reverseKeyValue(frenchIrregularCardToOrd)

/**
 * Converts a number to its ordinal abbreviation in French (e.g., 1 -> "1er", 2 -> "2e")
 * @param num - The number to convert
 * @returns The ordinal form of the number
 * @throws Error if input is not a finite integer
 * @remarks
 * Can handle negative numbers and zero. Follows the official French abbreviation
 * convention: 1 is `"1er"` (premier), and every other number is the plain number
 * followed by `"e"` (`"2e"`, `"3e"`, `"21e"`…). The feminine `"1re"` is accepted
 * on input by {@link fromFrenchOrdinalAbbr} but not produced here.
 * @category French Numeral
 */
export function toFrenchOrdinalAbbr(num: number): string {
  if (!Number.isFinite(num)) {
    throw new Error('Input must be a finite number')
  }
  if (!Number.isInteger(num)) {
    throw new Error('Input must be an integer')
  }

  const isNegative = num < 0
  const absNum = Math.abs(num)
  const numStr = absNum.toString()
  const sign = isNegative ? '-' : ''

  // 1 -> "1er" (premier); every other number -> "<n>e"
  return absNum === 1 ? `${sign}1er` : `${sign}${numStr}e`
}

/**
 * Converts a French ordinal abbreviation to its numeric value
 * @param ordinal - The ordinal number (e.g., "1er", "1re", "2e")
 * @returns The numeric value
 * @throws Error if input is not a valid French ordinal number
 * @remarks
 * Can handle negative numbers and zero. Accepts the official forms `"1er"`/`"1re"`
 * for 1 and `"<n>e"` for every other number, plus the common lenient variants
 * `"1ère"`, `"2ème"`, `"3ème"`… (with `"ème"` instead of `"e"`).
 * @category French Numeral
 */
export function fromFrenchOrdinalAbbr(ordinal: string): number {
  // Sanitize input
  ordinal = ordinal.trim().toLowerCase()

  // Handle negative numbers (reject a doubled/misplaced sign)
  const isNegative = ordinal.startsWith('-')
  if (isNegative) {
    ordinal = ordinal.substring(1)
  }

  // Special-case the abbreviations of "premier"/"première": 1er, 1re, 1ère
  if (ordinal === '1er' || ordinal === '1re' || ordinal === '1ère') {
    return isNegative ? -1 : 1
  }

  // Every other number: "<digits>e" or the lenient "<digits>ème"
  const match = ordinal.match(/^(0|[1-9]\d*)(?:e|ème)$/)
  if (!match) {
    throw new Error('Invalid French ordinal number')
  }
  const num = Number.parseInt(match[1], 10)

  return isNegative ? -num : num
}

/**
 * Converts French cardinal words to ordinal words
 * @param words - The French cardinal words (e.g., "un", "vingt-et-un", "cent-cinq")
 * @returns The French ordinal words (e.g., "premier", "vingt-et-unième", "cent-cinquième")
 * @remarks
 * - Preserves the original hyphenated form from the input
 * - "un" -> "premier" only when standalone; in compounds it is "unième"
 *   (e.g. "vingt-et-un" -> "vingt-et-unième", "mille-un" -> "mille-unième" — "premier" is never used inside a compound)
 * - "zéroième" is returned for "zéro" as a convenience; it is not a standard French word
 * @category French Numeral
 */
export function frenchWordsToOrdinalWords(words: string): string {
  const normalizedWords = words.toLowerCase().trim()

  // Handle special cases
  if (normalizedWords === 'zéro') {
    return 'zéroième'
  }
  if (normalizedWords === 'quatre-vingts') {
    return 'quatre-vingtième'
  }

  // Handle negative numbers
  if (normalizedWords.startsWith('moins-')) {
    const positivePart = normalizedWords.substring(6).trim()
    return `moins-${frenchWordsToOrdinalWords(positivePart)}`
  }

  const parts = normalizedWords.split(/([ -])/)
  let lastWord = parts[parts.length - 1]

  // Plural handling: if lastWord ends with 's' and singular is in the map, use singular
  if (
    lastWord.endsWith('s') &&
    frenchIrregularCardToOrd[lastWord.slice(0, -1)]
  ) {
    lastWord = lastWord.slice(0, -1)
    parts[parts.length - 1] = lastWord
  }

  // Special handling for "un" - becomes "premier" when standalone, "unième" when part of compound
  if (lastWord === 'un') {
    parts[parts.length - 1] = parts.length === 1 ? 'premier' : 'unième'
  } else if (frenchIrregularCardToOrd[lastWord]) {
    parts[parts.length - 1] = frenchIrregularCardToOrd[lastWord]
  } else if (lastWord.endsWith('ième')) {
    // Already an ordinal, return as is
    return normalizedWords
  } else if (
    !/^[a-zàâçéèêëîïôûùüÿñæœ-]+$/.test(lastWord) ||
    !(frenchIrregularCardToOrd[lastWord] || /^[0-9]+$/.test(lastWord))
  ) {
    // Not a valid French number word, return as is
    return normalizedWords
  } else {
    // Try to add -ième suffix
    parts[parts.length - 1] = `${lastWord}ième`
  }

  return parts.join('')
}

/**
 * Converts French ordinal words to cardinal words
 * @param words - The French ordinal words (e.g., "premier", "vingt-et-unième", "cent-cinquième")
 * @returns The French cardinal words (e.g., "un", "vingt-et-un", "cent-cinq")
 * @remarks
 * - Preserves the original hyphenated form from the input
 * - Also accepts the feminine "première" and "seconde"/"second" on input, mapping them to "un"/"deux"
 * - Restores the terminal plural "s" of "quatre-vingts"/"cents"/"millions"/"milliards" (e.g. "cent-quatre-vingtième" -> "cent-quatre-vingts")
 * @category French Numeral
 */
export function frenchOrdinalWordsToWords(words: string): string {
  const normalizedWords = words.toLowerCase().trim()

  // Handle special cases
  if (normalizedWords === 'zéroième') {
    return 'zéro'
  }

  // Handle negative numbers
  if (normalizedWords.startsWith('moins-')) {
    const positivePart = normalizedWords.substring(6).trim()
    return `moins-${frenchOrdinalWordsToWords(positivePart)}`
  }

  const parts = normalizedWords.split(/([ -])/)
  const lastWord = parts[parts.length - 1]
  const prev = parts.length > 2 ? parts[parts.length - 3] : undefined
  let card: string | undefined
  if (lastWord === 'première') {
    card = 'un'
  } else if (lastWord === 'seconde' || lastWord === 'second') {
    card = 'deux'
  } else if (frenchIrregularOrdToCard[lastWord]) {
    card = frenchIrregularOrdToCard[lastWord]
  } else if (lastWord.endsWith('unième')) {
    card = `${lastWord.slice(0, -6)}un`
  } else if (lastWord.endsWith('ième')) {
    card = lastWord.slice(0, -4)
  } else {
    // Not an ordinal word, return as is
    return normalizedWords
  }

  // Restore terminal plural "s" that the ordinal form drops:
  const digitBefore = /^(deux|trois|quatre|cinq|six|sept|huit|neuf)$/
  if (card === 'vingt' && prev === 'quatre') {
    // ...quatre-vingtième -> ...quatre-vingts (80, 180, 1080, ...)
    card = 'vingts'
  } else if (card === 'cent' && prev && digitBefore.test(prev)) {
    // deux-centième -> deux-cents (multiple hundreds, terminal)
    card = 'cents'
  } else if (
    (card === 'million' || card === 'milliard') &&
    prev &&
    prev !== 'un'
  ) {
    // million/milliard is plural unless preceded by "un" (deux-millionième ->
    // deux-millions, deux-cents-millionième -> deux-cents-millions)
    card += 's'
  }

  parts[parts.length - 1] = card
  return parts.join('')
}
