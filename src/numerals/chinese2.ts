import { toFromArrayItemFn, toToArrayItemFn } from '../utils/arrayItemFns'
import { reverseKeyValue } from '../utils/reverseKeyValue'
import { isZhTOrS, s2t, t2s } from '../utils/zhSTConv'
import { fromChineseWords, toChineseWords } from './chinese'

const financialNumerals: Record<string, string> = {
  零: '零',
  一: '壹',
  两: '贰',
  二: '贰',
  三: '叁',
  四: '肆',
  五: '伍',
  六: '陆',
  七: '柒',
  八: '捌',
  九: '玖',
  十: '拾',
  百: '佰',
  千: '仟',
  万: '万',
  亿: '亿',
}

const finVals = []
for (const key in financialNumerals) {
  finVals.push(financialNumerals[key])
}
// Character class of all financial numerals (join with '' — inside [] a '|'
// would be a literal pipe, not an alternation)
const finPattern = new RegExp(`^[${finVals.join('')}]+$`)

/**
 * Validates if a string is a strictly valid Chinese financial number word representation
 * by converting it to a number and back to words to check for consistency
 *
 * The round trip is what makes this strict, and it matches {@link validateChineseWords}.
 * A character-class test alone accepted any string built from financial characters, so
 * `壹壹`, `万万`, `拾拾`, `零零` and `壹万壹` all passed, and so did a bare `万` — which is
 * not a canonical financial numeral any more than `万` alone is a canonical ordinary one,
 * and being accepted by only one of the two validators made `万` read as financial.
 *
 * @param words - The Chinese words to validate
 * @returns true if the words are valid, false otherwise
 * @category Chinese Numeral
 */
export function validateChineseFinancial(words: string): boolean {
  try {
    if (!finPattern.test(t2s(words))) {
      return false
    }
    const num = fromChineseWords(chineseFinancialToWords(words))
    const canonical = chineseWordsToFinancial(
      toChineseWords(num),
      isZhTOrS(words) === 1
    )
    return words === canonical
  } catch {
    return false
  }
}

/**
 * Converts Chinese numeral words to Chinese financial characters
 * @param numeral - The Chinese numeral words to convert
 * @param trad - Whether to convert to Traditional Chinese (default: false)
 * @returns The Chinese financial character representation
 * @category Chinese Numeral
 */
export function chineseWordsToFinancial(numeral: string, trad = false): string {
  let result = ''
  for (let i = 0; i < numeral.length; i++) {
    result += financialNumerals[numeral[i]] || numeral[i]
  }
  if (trad) {
    result = s2t(result)
  }
  return result
}

/**
 * Converts Chinese financial characters to Chinese numeral words
 * @param numeral - The Chinese financial characters to convert
 * @returns The Chinese numeral word representation
 * @category Chinese Numeral
 */
export function chineseFinancialToWords(numeral: string): string {
  numeral = t2s(numeral)
  const reversedFinancialNumerals = reverseKeyValue(financialNumerals)
  reversedFinancialNumerals.贰 = '二'
  let result = ''
  for (let i = 0; i < numeral.length; i++) {
    result += reversedFinancialNumerals[numeral[i]] || numeral[i]
  }
  return result
}

// biome-ignore format: ignore
const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']

/**
 * Converts a number to Chinese Heavenly Stem (天干) word
 * @param num - The number to convert (must be between 1 and 10)
 * @returns The Chinese Heavenly Stem character
 * @throws Error if input is out of valid range
 * @function
 * @category Chinese Numeral
 */
export const toChineseHeavenlyStem = toToArrayItemFn(stems)

/**
 * Converts a Chinese Heavenly Stem (天干) character to its corresponding number
 * @param item - The Chinese Heavenly Stem character
 * @returns The corresponding number (1-10)
 * @throws Error if input is not a valid Heavenly Stem character
 * @function
 * @category Chinese Numeral
 */
export const fromChineseHeavenlyStem = toFromArrayItemFn(stems)

// biome-ignore format: ignore
const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

/**
 * Converts a number to Chinese Earthly Branch (地支) word
 * @param num - The number to convert (must be between 1 and 12)
 * @returns The Chinese Earthly Branch character
 * @throws Error if input is out of valid range
 * @function
 * @category Chinese Numeral
 */
export const toChineseEarthlyBranch = toToArrayItemFn(branches)

/**
 * Converts a Chinese Earthly Branch (地支) character to its corresponding number
 * @param item - The Chinese Earthly Branch character
 * @returns The corresponding number (1-12)
 * @throws Error if input is not a valid Earthly Branch character
 * @function
 * @category Chinese Numeral
 */
export const fromChineseEarthlyBranch = toFromArrayItemFn(branches)

// biome-ignore format: ignore
const solarTerms = [
  '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
  '立夏', '小满', '芒种', '夏至', '小暑', '大暑',
  '立秋', '处暑', '白露', '秋分', '寒露', '霜降',
  '立冬', '小雪', '大雪', '冬至', '小寒', '大寒',
]

const _toChineseSolarTerm = toToArrayItemFn(solarTerms)
const _fromChineseSolarTerm = toFromArrayItemFn(solarTerms)

/**
 * Converts a number to a 节气 (Solar Term) character
 * @param num - The number to convert (must be between 1 and 24)
 * @param circular - Whether to use circular indexing (default: false)
 * @param trad - Whether to convert to Traditional Chinese (default: false)
 * @returns The 节气 character
 * @throws Error if input is out of valid range
 * @category Chinese Numeral
 */
export function toChineseSolarTerm(
  num: number,
  circular?: boolean,
  trad?: boolean
): string {
  const str = _toChineseSolarTerm(num, circular)
  return trad ? s2t(str) : str
}

/**
 * Converts a 节气 (Solar Term) character to its corresponding number
 * @param item - The 节气 character
 * @returns The corresponding number (1-24)
 * @throws Error if input is not a valid 节气 character
 * @category Chinese Numeral
 */
export function fromChineseSolarTerm(item: string): number {
  return _fromChineseSolarTerm(t2s(item))
}
