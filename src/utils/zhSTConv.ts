import { reverseKeyValue } from './reverseKeyValue'

// All chars used in convnum: 零一二三四五六七八九壹贰叁肆伍陆柒捌玖两十百千万亿点负拾佰仟甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥立春雨水惊蛰分清明谷夏小满芒种至暑大秋处白露寒霜降冬雪人民币元角厘整
// All stem and branche characters are the same in both traditional and simplified Chinese, including 丑 in Earthly Branches, which should not be converted to 醜 when s2t

// All Chinese characters
const zhPatternText =
  '[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\\s。，、！？！？（）「」《》]'

const s2tMap = {
  贰: '貳',
  叁: '叄',
  陆: '陸',
  两: '兩',
  万: '萬',
  亿: '億',
  点: '點',
  负: '負',
  惊: '驚',
  蛰: '蟄',
  满: '滿',
  种: '種',
  处: '處',
  币: '幣',
  厘: '釐',
}

const s2tKeys = []
for (const key in s2tMap) {
  s2tKeys.push(key)
}
// Simplified Chinese
const sPatternText = `[${s2tKeys.join('|')}]`

const t2sMap = reverseKeyValue(s2tMap)
const t2sKeys = []
for (const key in t2sMap) {
  t2sKeys.push(key)
}
// Traditional Chinese
const tPatternText = `[${t2sKeys.join('|')}]`

/**
 * Convert a pattern text to a RegExp object
 *
 * @param text The pattern text to convert
 * @param mode The mode
 *   - 0: global match, for replacement
 *   - 1: first character is in the range
 *   - 2: at least one character is in the range
 *   - 3: all characters are in the range
 * @returns The RegExp object
 * @category Chinese Numeral
 */
function patternTextToRegExp(text: string, mode: 0 | 1 | 2 | 3): RegExp {
  switch (mode) {
    case 0:
      return new RegExp(`${text}`, 'g')
    case 1:
      return new RegExp(`^${text}`)
    case 2:
      return new RegExp(`${text}`)
    case 3:
      return new RegExp(`^${text}+$`)
  }
}

/**
 * Check if the text is Chinese (Simplified or Traditional or punctuation)
 *
 * 检查文本是否为中文（简体或繁体或标点）
 *
 * @param text The text to check
 * @param mode The mode
 *   - 1: first character is in the range
 *   - 2: at least one character is in the range
 *   - 3: all characters are in the range
 * @returns boolean
 * @category Chinese Numeral
 */
export const isZh = (text: string, mode: 1 | 2 | 3) =>
  patternTextToRegExp(zhPatternText, mode).test(text)

const sPattern = patternTextToRegExp(sPatternText, 2)
const tPattern = patternTextToRegExp(tPatternText, 2)
const sReplPattern = patternTextToRegExp(sPatternText, 0)
const tReplPattern = patternTextToRegExp(tPatternText, 0)

/**
 * Check if the text is Simplified or Traditional Chinese (only for characters in convnum)
 *
 * 检查文本为繁体或简体（仅限convnum中出现的汉字）
 *
 * @param text The text to check
 * @returns
 *   - undefined: the text is not (common) Chinese (not all characters are in zhPattern)
 *   - 0: the text is Simplified Chinese for sure (at least one is in sPattern, no one is in tPattern)
 *   - 1: the text is Traditional Chinese for sure (at least one is in tPattern, no one is in sPattern)
 *   - -1: the text is mixed of Simplified and Traditional (at least one is in sPattern, and at least one is in tPattern)
 *   - 2: not sure if it is Simplified or Traditional (no one is in sPattern, and no one is in tPattern)
 * @category Chinese Numeral
 */
export const isZhTOrS = (text: string) => {
  if (!isZh(text, 3)) {
    return undefined
  }
  const sPatternTest = sPattern.test(text)
  const tPatternTest = tPattern.test(text)
  if (sPatternTest && !tPatternTest) {
    return 0
  }
  if (tPatternTest && !sPatternTest) {
    return 1
  }
  if (sPatternTest && tPatternTest) {
    return -1
  }
  return 2
}

/**
 * Simplified Chinese to Traditional Chinese (only for characters in convnum)
 *
 * 简体转繁体（仅限convnum中出现的汉字）
 *
 * @param text Simplified Chinese string 简体字符串
 * @returns Traditional Chinese string 繁体字符串
 * @category Chinese Numeral
 */
export function s2t(text: string) {
  return text.replace(
    sReplPattern,
    (char) => s2tMap[char as keyof typeof s2tMap]
  )
}

/**
 * Traditional Chinese to Simplified Chinese (only for characters in convnum)
 *
 * 繁体转简体（仅限convnum中出现的汉字）
 *
 * @param text Traditional Chinese string 繁体字符串
 * @returns Simplified Chinese string 简体字符串
 * @category Chinese Numeral
 */
export function t2s(text: string) {
  return text.replace(
    tReplPattern,
    (char) => t2sMap[char as keyof typeof t2sMap]
  )
}
