import { isZhTOrS, s2t, t2s } from '../utils/zhSTConv'

function getUnit(pos: number): string {
  const units = ['', '十', '百', '千', '万', '十', '百', '千', '亿']
  const cycle = pos % 8
  const bigUnit = Math.floor(pos / 4) % 2 === 1 ? '万' : '亿'
  return cycle === 0 && pos !== 0 ? bigUnit : units[cycle]
}

const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']

/**
 * Converts a number to Chinese numeral words (can handle negative numbers and numbers with decimal point)
 * @param num - The number to convert
 * @param trad - Whether to convert to Traditional Chinese (default: false)
 * @returns The Chinese numeral word representation
 * @category Chinese Numeral
 */
export function toChineseWords(num: number, trad = false): string {
  if (typeof num !== 'number' || !Number.isFinite(num)) {
    throw new Error(`Invalid input: ${num}`)
  }

  const isNegative = num < 0
  num = Math.abs(num)

  const [integerPart, decimalPart] = num.toString().split('.')
  const integerNum = Number.parseInt(integerPart, 10)

  let result = ''
  if (integerNum === 0) {
    result = '零'
  } else {
    const numArray = integerNum.toString().split('')

    for (let i = 0; i < numArray.length; i++) {
      const reverseI = numArray.length - 1 - i
      result = getUnit(i) + result
      const digitIndex = Number.parseInt(numArray[reverseI], 10)
      result = digits[digitIndex] + result
    }

    result = result
      .replace(/零(千|百|十)/g, '零')
      .replace(/十零/g, '十')
      .replace(/零+/g, '零')
      .replace(/零亿/g, '亿')
      .replace(/零万/g, '万')
      .replace(/亿万/g, '亿')
      .replace(/零+$/, '')
      .replace(/^一十/g, '十')
  }

  if (decimalPart) {
    result += '点'
    for (let i = 0; i < decimalPart.length; i++) {
      const digit = Number.parseInt(decimalPart[i], 10)
      result += digits[digit]
    }
  }

  if (isNegative) {
    result = `负${result}`
  }

  if (trad) {
    result = s2t(result)
  }

  return result
}

// biome-ignore format: ignore
const numMap: Record<string, number> = {
  "零": 0, "一": 1, "二": 2, "三": 3, "四": 4, "五": 5,
  "六": 6, "七": 7, "八": 8, "九": 9, "十": 10,
  "百": 100, "千": 1000, "万": 10000, "亿": 100000000,
}

/**
 * Converts Chinese numeral words to a number (can handle negative numbers and numbers with decimal point)
 * @param words - The Chinese numeral words representing a number
 * @returns The numeric value
 * @throws Error if the input contains characters that are not Chinese numerals
 * @remarks
 * Traditional Chinese input is accepted (converted to Simplified first). Like
 * {@link fromEnglishWords}, the parser is lenient about structure: it only
 * rejects invalid characters, so some malformed-but-parseable sequences (e.g.
 * "十十") still return a value. Use {@link validateChineseWords} for strict
 * validation. Values are reliable only up to `Number.MAX_SAFE_INTEGER`.
 * @category Chinese Numeral
 */
export function fromChineseWords(words: string): number {
  words = t2s(words)
  if (
    !/^[负]?[零一二三四五六七八九十百千万亿]+([点][零一二三四五六七八九]+)?$/.test(
      words
    )
  ) {
    throw new Error(`Invalid input: ${words}`)
  }

  const isNegative = words.startsWith('负')
  if (isNegative) {
    words = words.substring(1)
  }

  const [integerPart, decimalPart] = words.split('点')

  let result = 0
  let section = 0
  let numBuffer = 0
  let billionSection = 0

  for (const char of integerPart) {
    const value = numMap[char]

    if (value < 10) {
      numBuffer = value
    } else if (value < 10000) {
      numBuffer = (numBuffer || 1) * value
      section += numBuffer
      numBuffer = 0
    } else if (value === 10000) {
      // A bare "万" (nothing accumulated) means 1万, mirroring how a bare
      // "十"/"百"/"千" is treated as 1x above (so "万亿" parses as 1e12).
      section += numBuffer
      result += (section || 1) * 10000
      section = 0
      numBuffer = 0
    } else if (value === 100000000) {
      // A bare "亿" likewise means 1亿
      section += numBuffer
      billionSection = (result + section || 1) * 100000000
      result = 0
      section = 0
      numBuffer = 0
    }
  }

  let integerResult = billionSection + result + section + numBuffer

  if (decimalPart) {
    // Convert decimal part to string representation for precision
    let decimalStr = ''
    for (const char of decimalPart) {
      decimalStr += numMap[char]
    }

    const decimalValue = Number(`0.${decimalStr}`)

    integerResult += decimalValue
  }

  return isNegative ? -integerResult : integerResult
}

/**
 * Validates if a string is a strictly valid Chinese number word representation
 * by converting it to a number and back to words to check for consistency
 * @param words - The Chinese words to validate
 * @returns true if the words are valid, false otherwise
 * @category Chinese Numeral
 */
export function validateChineseWords(words: string): boolean {
  try {
    const zhst = isZhTOrS(words)
    const num = fromChineseWords(words)
    const convertedBack = toChineseWords(num, zhst === 1)
    return words === convertedBack
  } catch {
    return false
  }
}
