import { freeze } from './freeze'

/**
 * All supported numeral types in the library
 *
 * Excluded: julian_day, base
 *
 * Included: decimal, chinese_financial
 *
 * Included: invalid (non string input), empty (empty string input), unknown (unknown input)
 *
 * @remarks
 * - See {@link VALID_NUM_TYPES} for their priority order
 * - See {@link TYPE_ALIASES} for their aliases
 * - See {@link TypeInfo} for their applicable `TypeInfo` properties
 * - See Home Page (README) for a table of quick examples and descriptions of each type
 * @category Numeral Types
 */
export type NumType =
  | 'decimal'
  | 'binary'
  | 'octal'
  | 'hexadecimal'
  | 'roman'
  | 'arabic'
  | 'english_ordinal_abbr'
  | 'french_ordinal_abbr'
  | 'english_words'
  | 'english_ordinal_words'
  | 'french_words'
  | 'french_ordinal_words'
  | 'chinese_words'
  | 'chinese_financial'
  | 'chinese_heavenly_stem'
  | 'chinese_earthly_branch'
  | 'chinese_solar_term'
  | 'astrological_sign'
  | 'nato_phonetic'
  | 'month_name'
  | 'day_of_week'
  | 'latin_letter'
  | 'greek_letter'
  | 'greek_letter_english_name'
  | 'cyrillic_letter'
  | 'hebrew_letter'
  | 'invalid'
  | 'empty'
  | 'unknown'

/**
 * Map of type aliases to their canonical NumType values
 * - `hex` -> `hexadecimal`
 * - `bin` -> `binary`
 * - `oct` -> `octal`
 * - `dec` -> `decimal`
 * @category Numeral Types
 */
export const TYPE_ALIASES: Readonly<Record<string, NumType>> = freeze({
  hex: 'hexadecimal',
  bin: 'binary',
  oct: 'octal',
  dec: 'decimal',
})

/**
 * Resolves a type string to its canonical NumType, handling {@link TYPE_ALIASES aliases}
 * @param type - The type string, which may be an alias
 * @returns The canonical NumType
 * @category Numeral Types
 */
export function resolveTypeAlias(type: NumTypeAndAlias): NumType {
  return TYPE_ALIASES[type] || (type as NumType)
}

/**
 * A union type of {@link NumType} and its {@link TYPE_ALIASES aliases}
 * @category Numeral Types
 */
export type NumTypeAndAlias = NumType | keyof typeof TYPE_ALIASES

/**
 * Case types for string formatting
 *   - "sentence" case (first letter capitalized, rest lowercase)
 *   - "title" case (first letter of each word capitalized, separated by spaces and "-")
 *   - "lower" case (all lowercase)
 *   - "upper" case (all uppercase)
 * @category Numeral Types
 */
export type CaseType = 'sentence' | 'title' | 'lower' | 'upper'

/**
 * Format types for date/time strings
 *   - "short" format (e.g. "Jan", "Dec")
 *   - "long" format (e.g. "January", "December")
 * @category Numeral Types
 */
export type FormatType = 'short' | 'long'

/**
 * Prefix types for base numbers
 *   - "lower" prefix (e.g. "0b", "0x")
 *   - "upper" prefix (e.g. "0B", "0X")
 *   - false (no prefix)
 * @category Numeral Types
 */
export type PrefixType = false | 'lower' | 'upper'

/**
 * Chinese script type for Traditional/Simplified detection
 *   - 0: the text is Simplified Chinese for sure
 *   - 1: the text is Traditional Chinese for sure
 *   - 2: not sure if it is Simplified or Traditional
 * @category Numeral Types
 */
export type ZhstType = 0 | 1 | 2

/**
 * UK/US style for English words
 *   - 0: US style
 *   - 1: UK style
 *   - 2: not sure if it is UK or US
 * @category Numeral Types
 */
export type UsUkStyleType = 0 | 1 | 2

/**
 * Type information with additional properties
 * @remarks
 * - `zhst` is only used in `chinese_words`, `chinese_financial`, `chinese_solar_term`, not used in `chinese_heavenly_stem`, `chinese_earthly_branch`, both of which contain only simp-trad-same-form characters
 * - `digits` is only used in `decimal`, `binary`, `octal`, `hexadecimal` for zero-padded numbers. Value 0 means "unknown digit count" (no explicit leading zeros) (if undefined/not present, it means the same as 0), values > 0 indicate the total digit count including leading zeros. Not used for floats.
 * - `ukStyle` is only used in `english_words` and `english_ordinal_words` to specify UK English style (with "and" between hundreds and tens/units). Default is false (US style).
 *
 * | {@link NumType}  | Can have which `TypeInfo` props |
 * |---------|------------------------------|
 * | `decimal` | `digits` |
 * | `latin_letter` | `case` |
 * | `month_name` | `case`, `format` |
 * | `day_of_week` | `case`, `format` |
 * | `roman` | `case` |
 * | `arabic` | _N/A_ |
 * | `english_words` | `case`, `ukStyle` |
 * | `english_ordinal_words` | `case`, `ukStyle` |
 * | `english_ordinal_abbr` | `case` |
 * | `french_words` | `case` |
 * | `french_ordinal_words` | `case` |
 * | `french_ordinal_abbr` | `case` |
 * | `chinese_words` | `zhst` |
 * | `chinese_financial` | `zhst` |
 * | `binary` | `digits`, `prefix` |
 * | `octal` | `digits`, `prefix` |
 * | `hexadecimal` | `case`, `digits`, `prefix` |
 * | `greek_letter` | `case` |
 * | `greek_letter_english_name` | `case` |
 * | `cyrillic_letter` | `case` |
 * | `hebrew_letter` | _N/A_ |
 * | `chinese_heavenly_stem` | _N/A_ |
 * | `chinese_earthly_branch` | _N/A_ |
 * | `chinese_solar_term` | `zhst` |
 * | `astrological_sign` | `case` |
 * | `nato_phonetic` | `case` |
 *
 * The above table is generated from {@link typeInfoMatrix}
 *
 * @category Numeral Types
 */
export type TypeInfo = {
  type: NumTypeAndAlias
  case?: CaseType
  format?: FormatType
  /**
   * Which language a `month_name` or `day_of_week` was read in, e.g. `'fr'`.
   *
   * Only set when {@link getTypes} was asked to consider more than English. Left
   * undefined, every converter falls back to `en-US`, which is what it has always done.
   */
  locale?: string
  prefix?: PrefixType
  zhst?: ZhstType
  digits?: number
  ukStyle?: UsUkStyleType
}

/**
 * Type information without aliases
 * @category Numeral Types
 */
export type TypeInfoWithoutAlias = {
  type: NumType
  case?: CaseType
  format?: FormatType
  /** Which language a `month_name` or `day_of_week` was read in. See {@link TypeInfo}. */
  locale?: string
  prefix?: PrefixType
  zhst?: ZhstType
  digits?: number
  ukStyle?: UsUkStyleType
}
