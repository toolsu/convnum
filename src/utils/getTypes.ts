import {
  fromCyrillicLetter,
  fromGreekLetter,
  fromGreekLetterEnglishName,
  fromHebrewLetter,
  fromLatinLetter,
  natoAlphabet,
} from '../numerals/alphabet'
import { fromArabicNumerals } from '../numerals/arabic'
import { fromAstroSign } from '../numerals/astrosign'
import { validateChineseWords } from '../numerals/chinese'
import {
  fromChineseEarthlyBranch,
  fromChineseHeavenlyStem,
  fromChineseSolarTerm,
  validateChineseFinancial,
} from '../numerals/chinese2'
import {
  fromDayOfWeek,
  fromMonth,
  toDayOfWeek,
  toMonth,
} from '../numerals/datetime'
import {
  fixEnglishWords,
  fromEnglishWords,
  toEnglishWords,
  validateEnglishWords,
} from '../numerals/english'
import {
  englishOrdinalWordsToWords,
  fromEnglishOrdinalAbbr,
} from '../numerals/englishOrdinal'
import { validateFrenchWords } from '../numerals/french'
import {
  frenchOrdinalWordsToWords,
  fromFrenchOrdinalAbbr,
} from '../numerals/frenchOrdinal'
import { fromRoman } from '../numerals/roman'
import { freeze } from './freeze'
import { capitalizeFirstLetter } from './letterFns'
import { matchLocalisedName } from './locales'
import { VALID_NUM_TYPES } from './orders'
import type {
  CaseType,
  FormatType,
  NumType,
  PrefixType,
  TypeInfo,
  UsUkStyleType,
  ZhstType,
} from './types'
import { isZhTOrS } from './zhSTConv'

/**
 * Determines the case of a string
 * @category Numeral Types
 */
function detectCase(str: string): CaseType {
  if (str === str.toLowerCase()) {
    return 'lower'
  }
  if (str === str.toUpperCase()) {
    return 'upper'
  }

  // Check for title case (first letter of each word capitalized, separated by spaces and "-")
  // Short conjunction word "and" is skipped, it should not be first-letter-capitalized but if it is, it's acceptable
  const words = str.split(/[\s-]+/)
  if (words.length > 1) {
    const isTitleCase = words.every(
      (word) =>
        word.toLowerCase() === 'and' || // skip "and"
        (word.length > 0 &&
          word[0] === word[0].toUpperCase() &&
          word.slice(1) === word.slice(1).toLowerCase())
    )
    if (isTitleCase) {
      return 'title'
    }
  }

  // Check for sentence case (first letter capitalized, rest lowercase)
  if (
    str[0] === str[0].toUpperCase() &&
    str.slice(1) === str.slice(1).toLowerCase()
  ) {
    return 'sentence'
  }

  // If none of the above patterns match exactly, default to sentence for mixed case
  return 'sentence'
}

/**
 * Detects prefix format for base number types
 * @category Numeral Types
 */
function detectPrefix(
  str: string,
  type: 'hexadecimal' | 'binary' | 'octal'
): PrefixType {
  // Handle negative numbers by removing the minus sign for detection
  let workingStr = str
  if (str.startsWith('-')) {
    workingStr = str.slice(1)
  }

  switch (type) {
    case 'hexadecimal':
      if (workingStr.startsWith('0x')) {
        return 'lower'
      }
      if (workingStr.startsWith('0X')) {
        return 'upper'
      }
      break
    case 'binary':
      if (workingStr.startsWith('0b')) {
        return 'lower'
      }
      if (workingStr.startsWith('0B')) {
        return 'upper'
      }
      break
    case 'octal':
      if (workingStr.startsWith('0o')) {
        return 'lower'
      }
      if (workingStr.startsWith('0O')) {
        return 'upper'
      }
      break
  }
  return false
}

/**
 * Determines the format of month/day names
 * @category Numeral Types
 */
function detectDateFormat(
  str: string,
  type: 'month' | 'day'
): FormatType | undefined {
  const normalizedStr = str.toLowerCase()

  if (type === 'month') {
    // Check if it's a short month name
    for (let i = 1; i <= 12; i++) {
      const shortMonth = toMonth(i, 'en-US', 'short').toLowerCase()
      const longMonth = toMonth(i, 'en-US', 'long').toLowerCase()
      if (normalizedStr === shortMonth) {
        return 'short'
      }
      if (normalizedStr === longMonth) {
        return 'long'
      }
    }
  } else if (type === 'day') {
    // Check if it's a short day name
    for (let i = 0; i < 7; i++) {
      const shortDay = toDayOfWeek(i, 'en-US', 'short').toLowerCase()
      const longDay = toDayOfWeek(i, 'en-US', 'long').toLowerCase()
      if (normalizedStr === shortDay) {
        return 'short'
      }
      if (normalizedStr === longDay) {
        return 'long'
      }
    }
  }

  return undefined
}

/**
 * Detects UK/US style for English words
 * @param str - The input string
 * @param type - The type of words ('english_words' or 'english_ordinal_words')
 * @returns 0 for US style, 1 for UK style, 2 for not sure
 * @category Numeral Types
 */
function detectUKStyle(
  str: string,
  type: 'english_words' | 'english_ordinal_words'
): UsUkStyleType {
  try {
    let cardinalWords: string
    let num: number

    str = fixEnglishWords(str)

    if (type === 'english_ordinal_words') {
      cardinalWords = englishOrdinalWordsToWords(str)
      num = fromEnglishWords(cardinalWords)
    } else {
      // For cardinal words, use directly
      cardinalWords = str
      num = fromEnglishWords(str)
    }

    const usStyle = toEnglishWords(num, false)
    const ukStyle = toEnglishWords(num, true)
    const normalizedInput = cardinalWords.toLowerCase().trim()

    if (normalizedInput === ukStyle && normalizedInput !== usStyle) {
      return 1 // UK style
    } else if (normalizedInput === usStyle && normalizedInput !== ukStyle) {
      return 0 // US style
    } else {
      return 2 // not sure (both styles produce the same result)
    }
  } catch {
    return 2 // not sure if conversion fails
  }
}

/**
 * Detects the digit count for zero-padded numbers
 * @category Numeral Types
 */
function detectDigits(
  str: string,
  type: 'decimal' | 'binary' | 'octal' | 'hexadecimal'
): number {
  // Don't apply digits detection to floats
  if (str.includes('.')) {
    return 0
  }

  // Handle negative numbers by removing the minus sign for detection
  let workingStr = str
  if (str.startsWith('-')) {
    workingStr = str.slice(1)
  }

  // Don't detect digits if the string looks like a prefix pattern for another type
  if (type !== 'binary' && /^0[bB]/.test(workingStr)) {
    return 0 // Looks like binary prefix
  }
  if (type !== 'octal' && /^0[oO]/.test(workingStr)) {
    return 0 // Looks like octal prefix
  }
  if (type !== 'hexadecimal' && /^0[xX]/.test(workingStr)) {
    return 0 // Looks like hexadecimal prefix
  }

  let digitPart = workingStr

  // Remove prefixes for base types
  if (type === 'hexadecimal' && /^0[xX]/.test(workingStr)) {
    digitPart = workingStr.replace(/^0[xX]/, '')
  } else if (type === 'binary' && /^0[bB]/.test(workingStr)) {
    digitPart = workingStr.replace(/^0[bB]/, '')
  } else if (type === 'octal' && /^0[oO]/.test(workingStr)) {
    digitPart = workingStr.replace(/^0[oO]/, '')
  }

  // Check if the digit part is valid for this type before detecting digits
  let validPattern: RegExp
  switch (type) {
    case 'decimal':
      validPattern = /^[0-9]+$/
      break
    case 'binary':
      validPattern = /^[01]+$/
      break
    case 'octal':
      validPattern = /^[0-7]+$/
      break
    case 'hexadecimal':
      validPattern = /^[0-9a-fA-F]+$/
      break
  }

  // Only detect digits if the digit part is valid for this type
  if (!validPattern.test(digitPart)) {
    return 0
  }

  // If the digit part has leading zeros, count the total digits
  if (digitPart.length > 1 && digitPart[0] === '0') {
    return digitPart.length
  }

  // If no leading zeros, return 0 (unknown digit count)
  return 0
}

/**
 * Mapping of type names to their validation functions that check if a string matches a specific type.
 * @remarks
 * - Each function takes a string and returns true if it's a valid representation of that type.
 * - Used internally by getTypes() and hasType() but exported for direct access to specific validators.
 * @example
 * ```ts
 * typeValidators.decimal('123') // returns true
 * typeValidators.decimal('abc') // returns false
 * typeValidators.roman('IV') // returns true
 * typeValidators.roman('invalid') // returns false
 * typeValidators.latin_letter('A') // returns true
 * typeValidators.latin_letter('AB') // returns false
 * ```
 * @category Numeral Types
 */
export const typeValidators: Readonly<
  Record<NumType, (str: string) => boolean>
> = freeze({
  // For the base types the anti-"other-prefix" guard must run on the string with
  // any leading minus stripped, otherwise e.g. "-0b101" slips past the hex guard
  // (which only looked for a leading "0b", not "-0b") and is misdetected as hex.
  decimal: (str) => {
    const s = str.replace(/^-/, '')
    return /^\d+(\.\d+)?$/.test(s) && !/^0[bBxXoO]/.test(s)
  },
  binary: (str) => {
    const s = str.replace(/^-/, '')
    return /^(0[bB])?[01]+$/.test(s) && !/^0[xXoO]/.test(s)
  },
  octal: (str) => {
    const s = str.replace(/^-/, '')
    return /^(0[oO])?[0-7]+$/.test(s) && !/^0[bBxX]/.test(s)
  },
  hexadecimal: (str) => {
    const s = str.replace(/^-/, '')
    return /^(0[xX])?[0-9a-fA-F]+$/.test(s) && !/^0[bBoO]/.test(s)
  },
  roman: (str) => {
    try {
      fromRoman(str)
      return true
    } catch {
      return false
    }
  },
  arabic: (str) => {
    try {
      fromArabicNumerals(str)
      return true
    } catch {
      return false
    }
  },
  english_ordinal_abbr: (str) => {
    try {
      fromEnglishOrdinalAbbr(str)
      return true
    } catch {
      return false
    }
  },
  french_ordinal_abbr: (str) => {
    try {
      fromFrenchOrdinalAbbr(str)
      return true
    } catch {
      return false
    }
  },
  english_words: (str) => validateEnglishWords(str, true),
  english_ordinal_words: (str) => {
    try {
      const cardinalWords = englishOrdinalWordsToWords(str)
      const isValidOrdinalOrCardinalWords = validateEnglishWords(
        cardinalWords,
        true
      )
      // An ordinal is present only if the ordinal->cardinal transform actually
      // changed the string. A raw suffix test like /(st|nd|rd|th)$/ wrongly
      // matches plain cardinals such as "twenty thousand" (ends in "nd").
      const hasOrdinalWord =
        cardinalWords.toLowerCase() !== str.toLowerCase().trim()
      return isValidOrdinalOrCardinalWords && hasOrdinalWord
    } catch {
      return false
    }
  },
  french_words: (str) => validateFrenchWords(str), // currently strict validation
  french_ordinal_words: (str) => {
    try {
      const cardinalWords = frenchOrdinalWordsToWords(str)
      const isValidOrdinalOrCardinalWords = validateFrenchWords(cardinalWords)
      // An ordinal is present only if the ordinal->cardinal transform actually
      // changed the string (covers -ième, premier/première, second/seconde).
      const hasOrdinalWord =
        cardinalWords.toLowerCase() !== str.toLowerCase().trim()
      return isValidOrdinalOrCardinalWords && hasOrdinalWord
    } catch {
      return false
    }
  },
  chinese_words: (str) => validateChineseWords(str), // currently strict validation
  chinese_financial: (str) => validateChineseFinancial(str),
  chinese_heavenly_stem: (str) => {
    try {
      fromChineseHeavenlyStem(str)
      return true
    } catch {
      return false
    }
  },
  chinese_earthly_branch: (str) => {
    try {
      fromChineseEarthlyBranch(str)
      return true
    } catch {
      return false
    }
  },
  chinese_solar_term: (str) => {
    try {
      fromChineseSolarTerm(str)
      return true
    } catch {
      return false
    }
  },
  astrological_sign: (str) => {
    try {
      fromAstroSign(str)
      return true
    } catch {
      return false
    }
  },
  nato_phonetic: (str) => {
    const normalizedWord = capitalizeFirstLetter(str.trim())
      .replace(/^Alpha$/i, 'Alfa')
      .replace(/^Juliet$/i, 'Juliett')
      .replace(/^Xray$/i, 'X-ray')
    return natoAlphabet.includes(normalizedWord)
  },
  month_name: (str) => fromMonth(str) !== null,
  day_of_week: (str) => fromDayOfWeek(str) !== null,
  latin_letter: (str) => {
    if (!/^[A-Za-z]$/.test(str)) {
      return false
    }
    try {
      fromLatinLetter(str)
      return true
    } catch {
      return false
    }
  },
  greek_letter: (str) => {
    if (!/^[Α-Ωα-ω]$/.test(str)) {
      return false
    }
    try {
      fromGreekLetter(str)
      return true
    } catch {
      return false
    }
  },
  cyrillic_letter: (str) => {
    if (!/^[А-Яа-яЁё]$/.test(str)) {
      return false
    }
    try {
      fromCyrillicLetter(str)
      return true
    } catch {
      return false
    }
  },
  hebrew_letter: (str) => {
    if (!/^[א-ת]$/.test(str)) {
      return false
    }
    try {
      fromHebrewLetter(str)
      return true
    } catch {
      return false
    }
  },
  greek_letter_english_name: (str) => {
    if (!/^[A-Za-z]+$/.test(str)) {
      return false
    }
    try {
      fromGreekLetterEnglishName(str)
      return true
    } catch {
      return false
    }
  },
  // Special types
  invalid: () => false,
  empty: () => false,
  unknown: () => false,
})

/**
 * Matrix of type properties and their applicable types
 *
 * Table of "which NumType	Can have which TypeInfo props"
 * is generated from this matrix and available in {@link TypeInfo}'s `@remarks`
 *
 * @category Numeral Types
 */
export const typeInfoMatrix: Record<
  Exclude<keyof TypeInfo, 'type'>,
  NumType[]
> = {
  case: [
    'latin_letter',
    'greek_letter',
    'cyrillic_letter',
    'roman',
    'hexadecimal',
    'english_ordinal_abbr',
    'french_ordinal_abbr',
    'english_words',
    'english_ordinal_words',
    'french_words',
    'french_ordinal_words',
    'astrological_sign',
    'nato_phonetic',
    'greek_letter_english_name',
    'month_name',
    'day_of_week',
  ],
  digits: ['decimal', 'binary', 'octal', 'hexadecimal'],
  format: ['month_name', 'day_of_week'],
  locale: ['month_name', 'day_of_week'],
  prefix: ['hexadecimal', 'binary', 'octal'],
  ukStyle: ['english_words', 'english_ordinal_words'],
  zhst: ['chinese_words', 'chinese_financial', 'chinese_solar_term'],
}

/**
 * Creates TypeInfo object with detected properties for a given type and string
 * @category Numeral Types
 */
function createTypeInfo(str: string, type: NumType): TypeInfo {
  const typeInfo: TypeInfo = { type }

  // Detect Chinese script type first for applicable types
  if (typeInfoMatrix.zhst.includes(type)) {
    const zhstResult = isZhTOrS(str)
    // Only set zhst for definitive results (0, 1, 2), not for mixed (-1) or invalid (undefined)
    if (zhstResult === 0 || zhstResult === 1 || zhstResult === 2) {
      typeInfo.zhst = zhstResult as ZhstType
    }
  }

  // Detect UK style for English word types
  if (typeInfoMatrix.ukStyle.includes(type)) {
    typeInfo.ukStyle = detectUKStyle(
      str,
      type as 'english_words' | 'english_ordinal_words'
    )
  }

  // Detect prefix first for base types
  if (typeInfoMatrix.prefix.includes(type)) {
    typeInfo.prefix = detectPrefix(
      str,
      type as 'hexadecimal' | 'binary' | 'octal'
    )
  }

  // Detect digits for applicable types
  if (typeInfoMatrix.digits.includes(type)) {
    const digits = detectDigits(
      str,
      type as 'decimal' | 'binary' | 'octal' | 'hexadecimal'
    )
    if (digits > 0) {
      typeInfo.digits = digits
    }
  }

  // For case detection on prefixed base types, only look at the non-prefix part
  if (
    typeInfoMatrix.case.includes(type) ||
    typeInfoMatrix.format.includes(type)
  ) {
    let strForCase = str

    // Handle negative numbers by removing the minus sign for case detection
    if (str.startsWith('-')) {
      strForCase = str.slice(1)
    }

    // Of the prefixed base types only `hexadecimal` also carries a `case`, so
    // it is the only one whose prefix must be stripped before case detection.
    if (type === 'hexadecimal' && typeInfo.prefix) {
      strForCase = strForCase.replace(/^0[xX]/, '')
    }
    typeInfo.case = detectCase(strForCase)
  }

  if (typeInfoMatrix.format.includes(type)) {
    if (type === 'month_name') {
      typeInfo.format = detectDateFormat(str, 'month')
    } else if (type === 'day_of_week') {
      typeInfo.format = detectDateFormat(str, 'day')
    }
  }

  return typeInfo
}

/**
 * Options for {@link getTypes}.
 * @category Numeral Types
 */
export interface GetTypesOptions {
  /**
   * Languages whose month and weekday names to recognise, most preferred first.
   *
   * Omitted, only English is recognised and no `locale` is reported — which is what
   * every release before this one did, so existing callers see no change. Pass
   * {@link DEFAULT_LOCALES} for a broad set, or a narrower list to keep detection tight.
   * A caller that knows its user's language should put it first: that is what decides a
   * name several languages share.
   */
  readonly locales?: readonly string[]
}

/**
 * Checks if a string has a specific type among all supported types in this library
 * @param str - The input string to check
 * @param targetType - The specific type to check for (e.g., 'decimal', 'roman', 'latin_letter')
 * @returns True if the string has the specified type, false otherwise
 * @example
 * ```ts
 * hasType('123', 'decimal') // returns true
 * hasType('IV', 'roman') // returns true
 * hasType('A', 'latin_letter') // returns true
 * hasType('invalid', 'roman') // returns false
 * hasType('', 'empty') // returns true
 * hasType('xyz123', 'unknown') // returns true
 * hasType(null, 'invalid') // returns true
 * ```
 * @category Numeral Types
 */
export function hasType(str: string, targetType: NumType): boolean {
  if (typeof str !== 'string') {
    return targetType === 'invalid'
  }

  const trimmed = str.trim()
  if (trimmed === '') {
    return targetType === 'empty'
  }

  if (targetType === 'unknown') {
    for (const type of VALID_NUM_TYPES) {
      if (typeValidators[type](trimmed)) {
        return false
      }
    }
    return true
  }

  const validator = typeValidators[targetType]
  if (!validator) {
    return false
  }
  return validator(trimmed)
}

/**
 * Identifies all possible types and contextual properties of input string among all supported types in this library.
 * @param str - The input string to identify and analyze
 * @returns An array of all possible TypeInfo objects the string could be, including detected case and other format/contextual properties
 * like case (lower, upper, sentence, title) and format (short, long) when applicable,
 * sorted by type priority (see {@link VALID_NUM_TYPES})
 * @example
 * ```ts
 * getTypes('123') // returns [{ type: 'decimal' }, { type: 'octal' }, { type: 'hexadecimal', case: 'lower' }]
 * getTypes('A') // returns [{ type: 'latin_letter', case: 'upper' }, { type: 'hexadecimal', case: 'upper' }]
 * getTypes('IV') // returns [{ type: 'roman', case: 'upper' }]
 * getTypes('January') // returns [{ type: 'month_name', case: 'sentence', format: 'long' }]
 * getTypes('Jan') // returns [{ type: 'month_name', case: 'sentence', format: 'short' }]
 * getTypes('Twenty-One') // returns [{ type: 'english_words', case: 'title' }]
 * getTypes('一') // returns [{ type: 'chinese_words' }]
 * getTypes('invalid-string') // returns [{ type: 'unknown' }]
 * getTypes('') // returns [{ type: 'empty' }]
 * getTypes(null) // returns [{ type: 'invalid' }]
 * ```
 * @category Numeral Types
 */
export function getTypes(
  str: string,
  options: GetTypesOptions = {}
): TypeInfo[] {
  if (typeof str !== 'string') {
    return [{ type: 'invalid' }]
  }

  const trimmed = str.trim()
  if (trimmed === '') {
    return [{ type: 'empty' }]
  }

  const locales = options.locales
  const typeInfos: TypeInfo[] = []

  for (const type of VALID_NUM_TYPES) {
    // Month and weekday names are the only types that exist in more than one language.
    // Asked for others, they are matched against each in turn and every reading is
    // reported, most-preferred language first — a caller holding both ends of a range
    // can then intersect two of these, which is what settles `mars:juin` as French and
    // `mars:maj` as Swedish without having to guess.
    if (locales && (type === 'month_name' || type === 'day_of_week')) {
      for (const match of matchLocalisedName(
        trimmed,
        type === 'month_name' ? 'month' : 'day',
        locales
      )) {
        typeInfos.push({
          ...createTypeInfo(trimmed, type),
          locale: match.locale,
          format: match.format,
        })
      }
      continue
    }

    if (typeValidators[type](trimmed)) {
      typeInfos.push(createTypeInfo(trimmed, type))
    }
  }

  // If no types found, return unknown
  if (typeInfos.length === 0) {
    return [{ type: 'unknown' }]
  }

  return typeInfos
}
