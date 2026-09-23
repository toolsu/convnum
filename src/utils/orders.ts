import { freeze } from './freeze'
import type { NumType } from './types'

/**
 * Array of all valid conversion types (excluding special types 'invalid', 'empty', 'unknown')
 *
 * Sorted by priority to use (used mainly for detection:
 * when a string is detected as being possible to be of multiple types,
 * the higher the priority, the more likely it is of that type)
 *
 * You can use {@link compareNumTypeOrder} to sort array of num types by VALID_NUM_TYPES order
 *
 * @remarks `VALID_NUM_TYPES` order:
 * 1. `decimal`
 * 2. `latin_letter`
 * 3. `month_name`
 * 4. `day_of_week`
 * 5. `greek_letter`
 * 6. `greek_letter_english_name`
 * 7. `roman`
 * 8. `chinese_words`
 * 9. `chinese_financial`
 * 10. `chinese_heavenly_stem`
 * 11. `chinese_earthly_branch`
 * 12. `chinese_solar_term`
 * 13. `cyrillic_letter`
 * 14. `hebrew_letter`
 * 15. `binary`
 * 16. `octal`
 * 17. `hexadecimal`
 * 18. `arabic`
 * 19. `english_ordinal_abbr`
 * 20. `french_ordinal_abbr`
 * 21. `english_words`
 * 22. `english_ordinal_words`
 * 23. `french_words`
 * 24. `french_ordinal_words`
 * 25. `astrological_sign`
 * 26. `nato_phonetic`
 * @category Numeral Types
 */
export const VALID_NUM_TYPES: readonly NumType[] = freeze([
  'decimal',
  'latin_letter',
  'month_name',
  'day_of_week',
  'greek_letter',
  'greek_letter_english_name',
  'roman',
  'chinese_words',
  'chinese_financial',
  'chinese_heavenly_stem',
  'chinese_earthly_branch',
  'chinese_solar_term',
  'cyrillic_letter',
  'hebrew_letter',
  'binary',
  'octal',
  'hexadecimal',
  'arabic',
  'english_ordinal_abbr',
  'french_ordinal_abbr',
  'english_words',
  'english_ordinal_words',
  'french_words',
  'french_ordinal_words',
  'astrological_sign',
  'nato_phonetic',
])

/**
 * Compare two num types based on their order in the {@link VALID_NUM_TYPES} array
 * @param a - The first num type to compare
 * @param b - The second num type to compare
 * @returns A negative value if a is before b, a positive value if a is after b, or 0 if they are the same
 *
 * @example
 * ```ts
 * numTypes.sort((a, b) => numTypeOrderCompare(a, b))
 * ```
 *
 * @remarks {@link VALID_NUM_TYPES} order:
 * 1. `decimal`
 * 2. `latin_letter`
 * 3. `month_name`
 * 4. `day_of_week`
 * 5. `greek_letter`
 * 6. `greek_letter_english_name`
 * 7. `roman`
 * 8. `chinese_words`
 * 9. `chinese_financial`
 * 10. `chinese_heavenly_stem`
 * 11. `chinese_earthly_branch`
 * 12. `chinese_solar_term`
 * 13. `cyrillic_letter`
 * 14. `hebrew_letter`
 * 15. `binary`
 * 16. `octal`
 * 17. `hexadecimal`
 * 18. `arabic`
 * 19. `english_ordinal_abbr`
 * 20. `french_ordinal_abbr`
 * 21. `english_words`
 * 22. `english_ordinal_words`
 * 23. `french_words`
 * 24. `french_ordinal_words`
 * 25. `astrological_sign`
 * 26. `nato_phonetic`
 * @category Numeral Types
 */
export const compareNumTypeOrder = (a: NumType, b: NumType) => {
  return VALID_NUM_TYPES.indexOf(a) - VALID_NUM_TYPES.indexOf(b)
}

/**
 * Extract pattern information from a date format string
 * @category Numeral Types
 */
function getFormatPattern(format: string): {
  priority: number
  separatorPriority: number
  specificityScore: number
} {
  // Normalize format by extracting the pattern structure
  const normalizedFormat = format
    .replace(/M[a-z]*[12]?/g, 'M') // M, M1, M2, Mf, Ms, etc. -> M
    .replace(/D[12]?/g, 'D') // D, D1, D2 -> D
    .replace(/Y/g, 'Y') // Y -> Y

  // Define pattern priorities
  const patternPriorities: { [key: string]: number } = {
    'Y-M-D': 1,
    'Y.M.D': 1,
    'Y/M/D': 1,
    'Y,M,D': 1,
    'D-M-Y': 2,
    'D.M.Y': 2,
    'D/M/Y': 2,
    'D,M,Y': 2,
    'M-D-Y': 3,
    'M.D.Y': 3,
    'M/D/Y': 3,
    'M,D,Y': 3,
    'Y-M': 4,
    'Y.M': 4,
    'Y/M': 4,
    'Y,M': 4,
    'M-Y': 5,
    'M.Y': 5,
    'M/Y': 5,
    'M,Y': 5,
    'M-D': 6,
    'M.D': 6,
    'M/D': 6,
    'M,D': 6,
    'D-M': 7,
    'D.M': 7,
    'D/M': 7,
    'D,M': 7,
  }

  // Handle special named-month format that has no numeric-pattern equivalent
  // ("January 1, 2023"). Other named-month layouts (M Y, Y-M, M-Y) normalize to
  // the same keys as their numeric counterparts above, so they are already
  // scored by patternPriorities.
  const namedMonthPatterns: { [key: string]: number } = {
    'M D, Y': 11, // "January 1, 2023"
  }

  const priority =
    patternPriorities[normalizedFormat] ||
    namedMonthPatterns[normalizedFormat] ||
    999

  // Get separator priority (- first, then ., /, ,, then space/comma-space)
  let separatorPriority = 0
  if (format.includes('-')) separatorPriority = 0
  else if (format.includes('.')) separatorPriority = 1
  else if (format.includes('/')) separatorPriority = 2
  else if (format.includes(',') && !format.includes(', ')) separatorPriority = 3
  else if (format.includes(', ')) separatorPriority = 5
  else if (format.includes(' ')) separatorPriority = 4

  // Calculate specificity score (M2/D2 should come before M1/D1)
  const m2Count = (format.match(/M2/g) || []).length
  const d2Count = (format.match(/D2/g) || []).length
  const m1Count = (format.match(/M1/g) || []).length
  const d1Count = (format.match(/D1/g) || []).length

  // Higher specificity (M2/D2) gets lower score (sorts first)
  const specificityScore = m1Count + d1Count - (m2Count + d2Count)

  return {
    priority,
    separatorPriority,
    specificityScore,
  }
}

/**
 * Compare two date format strings for sorting purposes.
 *
 * @param formatA - The first date format string to compare
 * @param formatB - The second date format string to compare
 * @returns A negative value if formatA is before formatB, a positive value if formatA is after formatB, or 0 if they are the same
 *
 * @example
 * ```ts
 * dateFormats.sort((a, b) => compareDateFormatOrder(a, b))
 * ```
 *
 * @remarks Priority order:
 * 1. `Y-M-D` variations (replacing "-" with ".", ",", "/", ", ", " ", etc.)
 * 2. `D-M-Y` variations
 * 3. `M-D-Y` variations
 * 4. `Y-M` variations
 * 5. `M-Y` variations
 * 6. `M-D` variations
 * 7. `D-M` variations
 * 8. Named month formats (by pattern similarity)
 *
 * Within each category, formats are sorted by separator:
 * 1. `-`
 * 2. `.`
 * 3. `/`
 * 4. `,`
 * 5. `, `
 * 6. ` `
 *
 * then by format specificity (M2/D2 should come before M1/D1)
 * @category Numeral Types
 */
export function compareDateFormatOrder(
  formatA: string,
  formatB: string
): number {
  const patternA = getFormatPattern(formatA)
  const patternB = getFormatPattern(formatB)

  // First compare by pattern priority
  const priorityDiff = patternA.priority - patternB.priority
  if (priorityDiff !== 0) {
    return priorityDiff
  }

  // Then by separator priority within same pattern
  const separatorDiff = patternA.separatorPriority - patternB.separatorPriority
  if (separatorDiff !== 0) {
    return separatorDiff
  }

  // Finally by format specificity (M2/D2 should come before M1/D1)
  return patternA.specificityScore - patternB.specificityScore
}
