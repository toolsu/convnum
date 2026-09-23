import {
  fromCyrillicLetter,
  fromGreekLetter,
  fromGreekLetterEnglishName,
  fromHebrewLetter,
  fromLatinLetter,
  fromNatoPhonetic,
  toCyrillicLetter,
  toGreekLetter,
  toGreekLetterEnglishName,
  toHebrewLetter,
  toLatinLetter,
  toNatoPhonetic,
} from '../numerals/alphabet'
import { fromArabicNumerals, toArabicNumerals } from '../numerals/arabic'
import { fromAstroSign, toAstroSign } from '../numerals/astrosign'
import {
  fromBin,
  fromHex,
  fromOct,
  toBin,
  toHex,
  toOct,
} from '../numerals/bases'
import { fromChineseWords, toChineseWords } from '../numerals/chinese'
import {
  chineseFinancialToWords,
  chineseWordsToFinancial,
  fromChineseEarthlyBranch,
  fromChineseHeavenlyStem,
  fromChineseSolarTerm,
  toChineseEarthlyBranch,
  toChineseHeavenlyStem,
  toChineseSolarTerm,
} from '../numerals/chinese2'
import {
  fromDayOfWeek,
  fromMonth,
  toDayOfWeek,
  toMonth,
} from '../numerals/datetime'
import { fromEnglishWords, toEnglishWords } from '../numerals/english'
import {
  englishOrdinalWordsToWords,
  englishWordsToOrdinalWords,
  fromEnglishOrdinalAbbr,
  toEnglishOrdinalAbbr,
} from '../numerals/englishOrdinal'
import { fromFrenchWords, toFrenchWords } from '../numerals/french'
import {
  frenchOrdinalWordsToWords,
  frenchWordsToOrdinalWords,
  fromFrenchOrdinalAbbr,
  toFrenchOrdinalAbbr,
} from '../numerals/frenchOrdinal'
import { fromRoman, toRoman } from '../numerals/roman'
import { numeralLength, toBasicRange } from './circular'
import { freeze } from './freeze'
import { getTypes } from './getTypes'
import { matchLocalisedName } from './locales'
import {
  type NumType,
  type NumTypeAndAlias,
  resolveTypeAlias,
  type TypeInfo,
  type TypeInfoWithoutAlias,
} from './types'

/**
 * Applies case transformation to a string based on the specified case type
 * @category Universal Converter
 */
function applyCase(
  str: string,
  caseType?: 'sentence' | 'title' | 'lower' | 'upper',
  locale?: string
): string {
  if (!caseType) {
    return str
  }

  // Changing case has to follow the language when there is one. Turkish uppercases `i`
  // to `İ` and lowercases `I` to `ı`, so `haziran` becomes `HAZIRAN` rather than
  // `HAZİRAN` without this — a word Turkish does not contain.
  const upper = (text: string) =>
    locale ? text.toLocaleUpperCase(locale) : text.toUpperCase()
  const lower = (text: string) =>
    locale ? text.toLocaleLowerCase(locale) : text.toLowerCase()

  switch (caseType) {
    case 'lower':
      return lower(str)
    case 'upper':
      return upper(str)
    case 'sentence':
      return upper(str.charAt(0)) + lower(str.slice(1))
    case 'title':
      return str
        .split(/(\s+|-+)/)
        .map((part) =>
          /^[\s-]+$/.test(part)
            ? part
            : part.toLowerCase() === 'and'
              ? 'and'
              : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        )
        .join('')
    default:
      return str
  }
}

/**
 * Mapping of type names to their "From" functions that convert strings to numbers.
 * Each function takes a string representation and returns the corresponding numeric value.
 * Used internally by convertFrom() but exported for direct access to specific converters.
 * @example
 * ```ts
 * typeFromFns.decimal('123') // returns 123
 * typeFromFns.roman('IV') // returns 4
 * typeFromFns.latin_letter('A') // returns 1
 * typeFromFns.hexadecimal('FF') // returns 255
 * ```
 * @category Universal Converter
 */
export const typeFromFns: Readonly<Record<NumType, (str: string) => number>> =
  freeze({
    decimal: (str) => {
      const result = Number.parseFloat(str)
      // Handle negative zero: return 0 instead of -0
      return result === 0 ? 0 : result
    },
    binary: fromBin,
    octal: fromOct,
    hexadecimal: fromHex,
    roman: fromRoman,
    arabic: fromArabicNumerals,
    english_ordinal_abbr: fromEnglishOrdinalAbbr,
    french_ordinal_abbr: fromFrenchOrdinalAbbr,
    english_words: fromEnglishWords,
    english_ordinal_words: (str) =>
      fromEnglishWords(englishOrdinalWordsToWords(str)),
    french_words: fromFrenchWords,
    french_ordinal_words: (str) =>
      fromFrenchWords(frenchOrdinalWordsToWords(str)),
    chinese_words: fromChineseWords,
    chinese_financial: (str) => fromChineseWords(chineseFinancialToWords(str)),
    chinese_heavenly_stem: fromChineseHeavenlyStem,
    chinese_earthly_branch: fromChineseEarthlyBranch,
    chinese_solar_term: fromChineseSolarTerm,
    astrological_sign: fromAstroSign,
    nato_phonetic: fromNatoPhonetic,
    month_name: (str) => {
      const result = fromMonth(str)
      if (result === null) {
        throw new Error(`Invalid month name: ${str}`)
      }
      return result
    },
    day_of_week: (str) => {
      const result = fromDayOfWeek(str)
      if (result === null) {
        throw new Error(`Invalid day of week: ${str}`)
      }
      return result
    },
    latin_letter: fromLatinLetter,
    greek_letter: fromGreekLetter,
    greek_letter_english_name: fromGreekLetterEnglishName,
    cyrillic_letter: fromCyrillicLetter,
    hebrew_letter: fromHebrewLetter,
    // Special types that don't have conversion functions
    invalid: () => {
      throw new Error('Cannot convert invalid type')
    },
    empty: () => {
      throw new Error('Cannot convert empty type')
    },
    unknown: () => {
      throw new Error('Cannot convert unknown type')
    },
  })

/**
 * Mapping of type names to their "To" functions that convert numbers to strings.
 * Each function takes a number and optional `TypeInfo` for formatting, returning the string representation.
 * Supports case and format transformations when `TypeInfo` is provided.
 * Used internally by `convertTo()` but exported for direct access to specific converters.
 * @example
 * ```ts
 * typeToFns.decimal(123) // returns '123'
 * typeToFns.roman(4) // returns 'IV'
 * typeToFns.roman(4, { case: 'lower' }) // returns 'iv'
 * typeToFns.latin_letter(1, { case: 'lower' }) // returns 'a'
 * typeToFns.hexadecimal(255, { case: 'lower' }) // returns 'ff'
 * typeToFns.month_name(1, { case: 'upper', format: 'short' }) // returns 'JAN'
 * ```
 * @category Universal Converter
 */
export const typeToFns: Readonly<
  Record<NumType, (num: number, typeInfo?: TypeInfoWithoutAlias) => string>
> = freeze({
  decimal: (num, typeInfo) => {
    let result = num.toString()

    // Apply zero-padding if digits is specified and > 0
    if (typeInfo?.digits && typeInfo.digits > 0) {
      // Don't pad floats
      if (Number.isInteger(num)) {
        if (num < 0) {
          // For negative numbers, pad the absolute value and add minus sign back
          const absResult = Math.abs(num).toString()
          const paddedAbs = absResult.padStart(typeInfo.digits, '0')
          result = `-${paddedAbs}`
        } else {
          result = result.padStart(typeInfo.digits, '0')
        }
      }
    }

    return result
  },
  binary: (num, typeInfo) => {
    let result = toBin(num, typeInfo?.prefix || false)

    // Apply zero-padding if digits is specified and > 0
    if (typeInfo?.digits && typeInfo.digits > 0 && Number.isInteger(num)) {
      if (num < 0) {
        // For negative numbers, work with absolute value and add minus sign back
        const absNum = Math.abs(num)
        const absResult = toBin(absNum, typeInfo.prefix || false)

        if (typeInfo.prefix) {
          // Extract prefix and pad the digit part
          const prefixPart = typeInfo.prefix === 'lower' ? '0b' : '0B'
          const digitPart = absResult.replace(/^0[bB]/, '')
          const paddedDigitPart = digitPart.padStart(typeInfo.digits, '0')
          result = `-${prefixPart}${paddedDigitPart}`
        } else {
          const paddedAbs = absResult.padStart(typeInfo.digits, '0')
          result = `-${paddedAbs}`
        }
      } else {
        if (typeInfo.prefix) {
          // Extract prefix and pad the digit part
          const prefixPart = typeInfo.prefix === 'lower' ? '0b' : '0B'
          const digitPart = result.replace(/^0[bB]/, '')
          const paddedDigitPart = digitPart.padStart(typeInfo.digits, '0')
          result = prefixPart + paddedDigitPart
        } else {
          result = result.padStart(typeInfo.digits, '0')
        }
      }
    }

    return result
  },
  octal: (num, typeInfo) => {
    let result = toOct(num, typeInfo?.prefix || false)

    // Apply zero-padding if digits is specified and > 0
    if (typeInfo?.digits && typeInfo.digits > 0 && Number.isInteger(num)) {
      if (num < 0) {
        // For negative numbers, work with absolute value and add minus sign back
        const absNum = Math.abs(num)
        const absResult = toOct(absNum, typeInfo.prefix || false)

        if (typeInfo.prefix) {
          // Extract prefix and pad the digit part
          const prefixPart = typeInfo.prefix === 'lower' ? '0o' : '0O'
          const digitPart = absResult.replace(/^0[oO]/, '')
          const paddedDigitPart = digitPart.padStart(typeInfo.digits, '0')
          result = `-${prefixPart}${paddedDigitPart}`
        } else {
          const paddedAbs = absResult.padStart(typeInfo.digits, '0')
          result = `-${paddedAbs}`
        }
      } else {
        if (typeInfo.prefix) {
          // Extract prefix and pad the digit part
          const prefixPart = typeInfo.prefix === 'lower' ? '0o' : '0O'
          const digitPart = result.replace(/^0[oO]/, '')
          const paddedDigitPart = digitPart.padStart(typeInfo.digits, '0')
          result = prefixPart + paddedDigitPart
        } else {
          result = result.padStart(typeInfo.digits, '0')
        }
      }
    }

    return result
  },
  hexadecimal: (num, typeInfo) => {
    // For digits padding, we need to handle prefix and digits more carefully
    if (typeInfo?.digits && typeInfo.digits > 0 && Number.isInteger(num)) {
      if (num < 0) {
        // For negative numbers, work with absolute value and add minus sign back
        const absNum = Math.abs(num)

        // Get hex without prefix first to avoid the toHex function's prefix logic interfering with case
        let result = toHex(absNum, false) // Get base hex without prefix

        // Apply zero-padding
        const paddedResult = result.padStart(typeInfo.digits, '0')

        // Apply case to hex digits if specified
        const casedResult = typeInfo.case
          ? applyCase(paddedResult, typeInfo.case)
          : paddedResult

        // Add prefix if specified, then add negative sign
        if (typeInfo.prefix) {
          const prefixPart = typeInfo.prefix === 'lower' ? '0x' : '0X'
          result = `-${prefixPart}${casedResult}`
        } else {
          result = `-${casedResult}`
        }

        return result
      } else {
        // Get hex without prefix first to avoid the toHex function's prefix logic interfering with case
        let result = toHex(num, false) // Get base hex without prefix

        // Apply zero-padding
        const paddedResult = result.padStart(typeInfo.digits, '0')

        // Apply case to hex digits if specified
        const casedResult = typeInfo.case
          ? applyCase(paddedResult, typeInfo.case)
          : paddedResult

        // Add prefix if specified
        if (typeInfo.prefix) {
          const prefixPart = typeInfo.prefix === 'lower' ? '0x' : '0X'
          result = prefixPart + casedResult
        } else {
          result = casedResult
        }

        return result
      }
    } else {
      // Use existing logic for non-digits cases
      let result = toHex(num, typeInfo?.prefix || false)

      // Apply case to the hex digits only (not the prefix) - existing logic
      if (typeInfo?.case && typeInfo?.prefix) {
        // Preserve a leading minus sign: the prefix must sit AFTER the sign,
        // not before it (otherwise negatives become e.g. "0x-0XFF").
        const isNeg = result.startsWith('-')
        const body = isNeg ? result.slice(1) : result
        const prefixPart = typeInfo.prefix === 'lower' ? '0x' : '0X'
        const hexPart = body.replace(/^0[xX]/, '')
        const casedHexPart = applyCase(hexPart, typeInfo.case)
        result = (isNeg ? '-' : '') + prefixPart + casedHexPart
      } else if (typeInfo?.case) {
        result = applyCase(result, typeInfo.case)
      }

      return result
    }
  },
  roman: (num, typeInfo) => {
    const result = toRoman(num)
    return applyCase(result, typeInfo?.case)
  },
  arabic: (num) => toArabicNumerals(num),
  english_ordinal_abbr: (num, typeInfo) => {
    const result = toEnglishOrdinalAbbr(num)
    return applyCase(result, typeInfo?.case)
  },
  french_ordinal_abbr: (num, typeInfo) => {
    const result = toFrenchOrdinalAbbr(num)
    return applyCase(result, typeInfo?.case)
  },
  english_words: (num, typeInfo) => {
    // ukStyle: 0 = US style (false), 1 = UK style (true), 2 = not sure (default to US style = false)
    const useUKStyle = typeInfo?.ukStyle === 1
    const result = toEnglishWords(num, useUKStyle)
    return applyCase(result, typeInfo?.case)
  },
  english_ordinal_words: (num, typeInfo) => {
    // ukStyle: 0 = US style (false), 1 = UK style (true), 2 = not sure (default to US style = false)
    const useUKStyle = typeInfo?.ukStyle === 1
    const cardinalWords = toEnglishWords(num, useUKStyle)
    const result = englishWordsToOrdinalWords(cardinalWords)
    return applyCase(result, typeInfo?.case)
  },
  french_words: (num, typeInfo) => {
    const result = toFrenchWords(num)
    return applyCase(result, typeInfo?.case)
  },
  french_ordinal_words: (num, typeInfo) => {
    const cardinalWords = toFrenchWords(num)
    const result = frenchWordsToOrdinalWords(cardinalWords)
    return applyCase(result, typeInfo?.case)
  },
  chinese_words: (num, typeInfo) => {
    return toChineseWords(num, typeInfo?.zhst === 1)
  },
  chinese_financial: (num, typeInfo) => {
    return chineseWordsToFinancial(toChineseWords(num), typeInfo?.zhst === 1)
  },
  chinese_heavenly_stem: (num) => toChineseHeavenlyStem(num),
  chinese_earthly_branch: (num) => toChineseEarthlyBranch(num),
  chinese_solar_term: (num, typeInfo) => {
    return toChineseSolarTerm(num, undefined, typeInfo?.zhst === 1)
  },
  astrological_sign: (num, typeInfo) => {
    const result = toAstroSign(num)
    return applyCase(result, typeInfo?.case)
  },
  nato_phonetic: (num, typeInfo) => {
    const result = toNatoPhonetic(num)
    return applyCase(result, typeInfo?.case)
  },
  month_name: (num, typeInfo) => {
    const format = typeInfo?.format || 'long'
    const result = toMonth(num, typeInfo?.locale || 'en-US', format)
    return applyCase(result, typeInfo?.case, typeInfo?.locale)
  },
  day_of_week: (num, typeInfo) => {
    const format = typeInfo?.format || 'long'
    const result = toDayOfWeek(num, typeInfo?.locale || 'en-US', format)
    return applyCase(result, typeInfo?.case, typeInfo?.locale)
  },
  latin_letter: (num, typeInfo) => {
    const upperCase = typeInfo?.case === 'upper'
    return toLatinLetter(num, upperCase)
  },
  greek_letter: (num, typeInfo) => {
    const upperCase = typeInfo?.case === 'upper'
    return toGreekLetter(num, upperCase)
  },
  greek_letter_english_name: (num, typeInfo) => {
    const result = toGreekLetterEnglishName(num)
    return applyCase(result, typeInfo?.case)
  },
  cyrillic_letter: (num, typeInfo) => {
    const upperCase = typeInfo?.case === 'upper'
    return toCyrillicLetter(num, upperCase)
  },
  hebrew_letter: (num, typeInfo) => {
    const result = toHebrewLetter(num)
    return applyCase(result, typeInfo?.case)
  },
  // Special types that don't have conversion functions
  invalid: () => {
    throw new Error('Cannot convert to invalid type')
  },
  empty: () => {
    throw new Error('Cannot convert to empty type')
  },
  unknown: () => {
    throw new Error('Cannot convert to unknown type')
  },
})

/**
 * Generalized function to convert a string to a number based on the specified type.
 * @param str - The input string to convert (e.g., 'IV', 'twenty-one', '一百二十三', '萬億')
 * @param typeInfo - The type information object specifying how to interpret the string, or the type name as a string.
 * This function actually only uses the string property `type` of `typeInfo`, the other properties are ignored
 * as currently there is no ambiguous cases within all the types supported.
 * @returns The converted number
 * @throws Error if the type is not supported or conversion fails
 * @example
 * ```ts
 * convertFrom('123', { type: 'hex' }) // returns 291
 * convertFrom('123', 'hex') // returns 291 (using alias)
 * convertFrom('0x123', 'hex') // returns 291 (using alias and "0x" prefix)
 * convertFrom('0X123', 'hex') // returns 291 (using alias and "0X" prefix)
 * convertFrom('IV', { type: 'roman' }) // returns 4
 * convertFrom('twenty-one', { type: 'english_words' }) // returns 21
 * convertFrom('A', { type: 'latin_letter' }) // returns 1
 * convertFrom('FF', { type: 'hexadecimal' }) // returns 255
 * convertFrom('FF', 'hex') // returns 255 (using alias)
 * convertFrom('1010', 'bin') // returns 10 (using binary alias)
 * convertFrom('777', 'oct') // returns 511 (using octal alias)
 * convertFrom('January', { type: 'month_name' }) // returns 1
 * convertFrom('一百二十三', { type: 'chinese_words' }) // returns 123
 * convertFrom('一萬億', { type: 'chinese_words' }) // returns 1000000000000 (Traditional converted to Simplified first)
 * convertFrom('Aries', { type: 'astrological_sign' }) // returns 1
 * ```
 * @remarks
 * - Supports all numeral formats. Case and format properties in TypeInfo are ignored during parsing (they're used for output formatting)
 * - For Chinese types, Traditional Chinese input is automatically converted to Simplified before processing, as the internal conversion functions work with Simplified Chinese
 * @category Universal Converter
 */
export function convertFrom(
  str: string,
  typeInfo: TypeInfo | NumTypeAndAlias
): number {
  if (typeof typeInfo === 'string') {
    typeInfo = { type: resolveTypeAlias(typeInfo) }
  }

  const type = resolveTypeAlias(typeInfo.type)

  const fromFn = typeFromFns[type]
  if (!fromFn) {
    throw new Error(`Unsupported type: ${type}`)
  }

  try {
    // Month and weekday names are the only readings that depend on a language; every
    // other type is either language-neutral or English by definition. `typeFromFns` is
    // a public, single-argument table, so the language is applied here rather than by
    // widening its signature.
    if (typeInfo.locale && (type === 'month_name' || type === 'day_of_week')) {
      // Through the name index rather than `fromMonth`, so that the forms a language
      // uses inside a date — Russian `января` against the standalone `январь` — read
      // back as the same month they are detected as.
      const [localised] = matchLocalisedName(
        str,
        type === 'month_name' ? 'month' : 'day',
        [typeInfo.locale]
      )
      if (!localised) {
        throw new Error(`Invalid ${type.replace('_', ' ')}: ${str}`)
      }
      return localised.value
    }
    return fromFn(str)
  } catch (error) {
    throw new Error(
      `Failed to convert "${str}" from type "${type}": ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

/**
 * Converts any string to a number
 *
 * It detects the type of any input string and converts it to a number with the most likely type
 * @param str - The input string to convert (e.g., 'IV', 'twenty-one', '一百二十三', '萬億')
 * @returns The converted number
 * @throws Error if the type is not supported or conversion fails
 * @remarks This function is a shortcut for `convertFrom(str, getTypes(str)[0])`
 * @example
 * ```ts
 * anyToNumber('123') // returns 123
 * anyToNumber('IV') // returns 4
 * anyToNumber('twenty-one') // returns 21
 * ```
 * @category Universal Converter
 */
export function anyToNumber(str: string): number {
  const types = getTypes(str)
  if (types.length === 0) {
    throw new Error(`No valid types found for "${str}"`)
  }
  return convertFrom(str, types[0])
}

/**
 * Generalized function to convert a number to a string based on the specified type.
 * Supports precise control over output formatting through `case`, `format` and other `TypeInfo` properties.
 *
 * @param num - The input number to convert (e.g., 4, 21, 123)
 * @param typeInfo - The target type information object including `type`, `case`, `format`, and several other specifications, or the type name as a string.
 * Some of the `TypeInfo` properties are explained in the `@remarks` section below
 * @returns The converted string formatted according to the specified case, format, and Chinese script
 * @throws Error if the type is not supported or conversion fails
 *
 * @remarks
 * - Explanation of some `typeInfo` properties:
 *   - `case` property: 'lower', 'upper', 'sentence' (first letter capitalized), 'title' (each word capitalized except "and").
 *   - `format` property: 'short' or 'long' for dates/months.
 *   - For Chinese types, supports Traditional/Simplified script conversion via `zhst` property:
 *     - 0 = output Simplified Chinese (default)
 *     - 1 = output Traditional Chinese (converted from Simplified)
 *     - 2 = output Simplified Chinese (ambiguous, defaults to Simplified)
 *   - For English words and ordinal words, supports UK/US style conversion via `ukStyle` property:
 *     - 0 = US style (default)
 *     - 1 = UK style
 *     - 2 = US style (not sure / ambiguous, thereforedefaults to US style)
 * - For circular numeral types (all types present in numeralLength: latin_letter, greek_letter,
 * month_name, astrological_sign, etc.), automatically handles out-of-range numbers by wrapping them
 * using circular arithmetic. The circular handling is included in `convertTo()`,
 * some specific `toAbc()` functions include it too but many don't
 *
 * @example
 * ```ts
 * convertTo(4, { type: 'roman', case: 'upper' }) // returns 'IV'
 * convertTo(4, { type: 'roman', case: 'lower' }) // returns 'iv'
 * convertTo(21, { type: 'english_words', case: 'title' }) // returns 'Twenty-One'
 * convertTo(21, { type: 'english_words', case: 'upper' }) // returns 'TWENTY-ONE'
 * convertTo(1, { type: 'latin_letter', case: 'lower' }) // returns 'a'
 * convertTo(27, { type: 'latin_letter', case: 'lower' }) // returns 'a' (wraps around)
 * convertTo(255, { type: 'hexadecimal', case: 'upper' }) // returns 'FF'
 * convertTo(255, 'hex') // returns 'ff' (using alias, default lowercase)
 * convertTo(10, 'bin') // returns '1010' (using binary alias)
 * convertTo(123, 'dec') // returns '123' (using decimal alias)
 * convertTo(511, 'oct') // returns '777' (using octal alias)
 * convertTo(1, { type: 'month_name', case: 'sentence', format: 'long' }) // returns 'January'
 * convertTo(1, { type: 'month_name', case: 'upper', format: 'short' }) // returns 'JAN'
 * convertTo(13, { type: 'month_name', case: 'upper', format: 'short' }) // returns 'JAN' (wraps to January)
 * convertTo(123, { type: 'chinese_words' }) // returns '一百二十三' (Simplified)
 * convertTo(123, { type: 'chinese_words', zhst: 1 }) // returns '一百二十三' (Traditional, same in this case)
 * convertTo(10000000000000, { type: 'chinese_words', zhst: 1 }) // returns '萬億' (Traditional)
 * convertTo(1, { type: 'astrological_sign', case: 'lower' }) // returns 'aries'
 * convertTo(13, { type: 'astrological_sign', case: 'lower' }) // returns 'aries' (wraps around)
 * convertTo(7, { type: 'day_of_week', case: 'lower' }) // returns 'sunday' (wraps around)
 * ```
 * @category Universal Converter
 */
export function convertTo(
  num: number,
  typeInfo: TypeInfo | NumTypeAndAlias
): string {
  if (typeof typeInfo === 'string') {
    typeInfo = { type: resolveTypeAlias(typeInfo) }
  }

  const type = resolveTypeAlias(typeInfo.type)
  const typeInfoWithoutAlias: TypeInfoWithoutAlias = {
    type,
    case: typeInfo.case,
    format: typeInfo.format,
    locale: typeInfo.locale,
    prefix: typeInfo.prefix,
    zhst: typeInfo.zhst,
    digits: typeInfo.digits,
    ukStyle: typeInfo.ukStyle,
  }

  const toFn = typeToFns[type]
  if (!toFn) {
    throw new Error(`Unsupported type: ${type}`)
  }

  try {
    // Check if this is a circular numeral type and handle out-of-range values
    if (numeralLength[type] !== undefined) {
      // Special cases for types that have specific requirements
      if (type === 'day_of_week') {
        // Day of week uses 0-based indexing (0-6), need special handling
        if (num >= 0 && num <= 6) {
          // Already in valid range
          return toFn(num, typeInfoWithoutAlias)
        } else {
          // Wrap using modular arithmetic for 0-6 range
          const wrappedNum = ((num % 7) + 7) % 7
          return toFn(wrappedNum, typeInfoWithoutAlias)
        }
      } else {
        // For other circular numerals, wrap the number to the valid range
        const wrappedNum = toBasicRange(num, type)
        return toFn(wrappedNum, typeInfoWithoutAlias)
      }
    } else {
      // For non-circular types, use the number as-is
      return toFn(num, typeInfoWithoutAlias)
    }
  } catch (error) {
    throw new Error(
      `Failed to convert ${num} to type "${type}": ${error instanceof Error ? error.message : String(error)}`
    )
  }
}
