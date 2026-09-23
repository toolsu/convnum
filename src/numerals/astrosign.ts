import { toFromArrayItemFn, toToArrayItemFn } from '../utils/arrayItemFns'
import { capitalizeFirstLetter } from '../utils/letterFns'

const astroSigns = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
]

// const astroSignUnicodes = ['♈︎', '♉︎', '♊︎', '♋︎', '♌︎', '♍︎', '♎︎', '♏︎', '♐︎', '♑︎', '♒︎', '♓︎']

/**
 * Converts a number to an astrological sign word
 * @param num - The number to convert (must be between 1 and 12)
 * @param circular - Whether to use circular indexing (default: false)
 * @returns The astrological sign word
 * @throws Error if input is out of valid range
 * @example
 * ```ts
 * toAstroSign(1) // 'Aries'
 * toAstroSign(12) // 'Pisces'
 * toAstroSign(13) // Error: Input must be an integer between 1 and 12
 * toAstroSign(13, true) // 'Aries'
 * toAstroSign(0) // Error: Input must be an integer between 1 and 12
 * toAstroSign(1.5) // Error: Input must be an integer
 * toAstroSign('Aries') // Error: Input must be an integer
 * ```
 * @function
 * @category Astrological Sign
 */
export const toAstroSign = toToArrayItemFn(astroSigns)

/**
 * Converts an astrological sign word to a number
 * @param item - The astrological sign word to convert
 * @returns The number corresponding to the astrological sign
 * @throws Error if input is not a valid astrological sign word
 * @example
 * ```ts
 * fromAstroSign('Aries') // 1
 * fromAstroSign('Aquarius') // 11
 * fromAstroSign('AQUARIUS') // 11
 * fromAstroSign('Invalid') // Error: Invalid astrological sign
 * fromAstroSign('') // Error: Invalid astrological sign
 * fromAstroSign(1.5) // Error: Input must be a string
 * fromAstroSign(undefined) // Error: Input must be a string
 * ```
 * @function
 * @category Astrological Sign
 */
export const fromAstroSign = toFromArrayItemFn(
  astroSigns,
  capitalizeFirstLetter
)
