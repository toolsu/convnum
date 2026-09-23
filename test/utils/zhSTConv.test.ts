import { describe, expect, test } from 'bun:test'
import { isZh, isZhTOrS, s2t, t2s } from '../../src/utils/zhSTConv'

describe('zhSTConv', () => {
  describe('isZh', () => {
    describe('mode 1: first character is in the range', () => {
      test('should return true when first character is Chinese', () => {
        expect(isZh('中国hello', 1)).toBe(true)
        expect(isZh('你好world', 1)).toBe(true)
        expect(isZh('零一二', 1)).toBe(true)
      })

      test('should return false when first character is not Chinese', () => {
        expect(isZh('hello中国', 1)).toBe(false)
        expect(isZh('123中文', 1)).toBe(false)
        expect(isZh('abc', 1)).toBe(false)
      })

      test('should handle empty string', () => {
        expect(isZh('', 1)).toBe(false)
      })
    })

    describe('mode 2: at least one character is in the range', () => {
      test('should return true when at least one character is Chinese', () => {
        expect(isZh('hello中国', 2)).toBe(true)
        expect(isZh('123中文456', 2)).toBe(true)
        expect(isZh('abc你好def', 2)).toBe(true)
        expect(isZh('零', 2)).toBe(true)
      })

      test('should return false when no character is Chinese', () => {
        expect(isZh('hello', 2)).toBe(false)
        expect(isZh('123456', 2)).toBe(false)
        expect(isZh('abcdef', 2)).toBe(false)
      })

      test('should handle empty string', () => {
        expect(isZh('', 2)).toBe(false)
      })
    })

    describe('mode 3: all characters are in the range', () => {
      test('should return true when all characters are Chinese', () => {
        expect(isZh('中国', 3)).toBe(true)
        expect(isZh('你好世界', 3)).toBe(true)
        expect(isZh('零一二三', 3)).toBe(true)
      })

      test('should return false when not all characters are Chinese', () => {
        expect(isZh('中国hello', 3)).toBe(false)
        expect(isZh('你好123', 3)).toBe(false)
        expect(isZh('abc中文', 3)).toBe(false)
      })

      test('should handle empty string', () => {
        expect(isZh('', 3)).toBe(false)
      })

      test('should handle whitespace correctly', () => {
        expect(isZh('中 国', 3)).toBe(true) // Space is included in Chinese pattern
        expect(isZh(' ', 3)).toBe(true) // Space only
      })
    })
  })

  describe('isZhTOrS', () => {
    test('should return 0 for Simplified Chinese text', () => {
      expect(isZhTOrS('万亿')).toBe(0)
      expect(isZhTOrS('贰叁陆')).toBe(0)
      expect(isZhTOrS('两万点')).toBe(0)
      expect(isZhTOrS('人民币')).toBe(0)
    })

    test('should return 1 for Traditional Chinese text', () => {
      expect(isZhTOrS('萬億')).toBe(1)
      expect(isZhTOrS('貳叄陸')).toBe(1)
      expect(isZhTOrS('兩萬點')).toBe(1)
      expect(isZhTOrS('人民幣')).toBe(1)
    })

    test('should return -1 for mixed Simplified and Traditional text', () => {
      expect(isZhTOrS('万萬')).toBe(-1)
      expect(isZhTOrS('貳万')).toBe(-1)
      expect(isZhTOrS('两兩')).toBe(-1)
    })

    test('should return 2 for Chinese text without conversion characters', () => {
      expect(isZhTOrS('零一二三')).toBe(2)
      expect(isZhTOrS('甲乙丙丁')).toBe(2)
      expect(isZhTOrS('子丑寅卯')).toBe(2)
      expect(isZhTOrS('立春雨水')).toBe(2)
    })

    test('should return undefined for non-Chinese text', () => {
      expect(isZhTOrS('hello')).toBeUndefined()
      expect(isZhTOrS('123')).toBeUndefined()
      expect(isZhTOrS('abc123')).toBeUndefined()
      expect(isZhTOrS('hello中国')).toBeUndefined()
      expect(isZhTOrS('中国hello')).toBeUndefined()
    })

    test('should handle empty string', () => {
      expect(isZhTOrS('')).toBeUndefined()
    })

    test('should handle edge cases', () => {
      expect(isZhTOrS('丑')).toBe(2) // Earthly Branch 丑 should NOT be treated as simplified
    })
  })

  describe('s2t', () => {
    test('should convert individual characters', () => {
      expect(s2t('万')).toBe('萬')
      expect(s2t('亿')).toBe('億')
      expect(s2t('两')).toBe('兩')
      expect(s2t('贰')).toBe('貳')
      expect(s2t('叁')).toBe('叄')
      expect(s2t('陆')).toBe('陸')
      expect(s2t('点')).toBe('點')
      expect(s2t('负')).toBe('負')
      expect(s2t('处')).toBe('處')
      expect(s2t('币')).toBe('幣')
      expect(s2t('厘')).toBe('釐')
    })

    test('should not convert characters not in the map', () => {
      expect(s2t('零一二三四五六七八九')).toBe('零一二三四五六七八九')
      expect(s2t('甲乙丙丁戊己庚辛壬癸')).toBe('甲乙丙丁戊己庚辛壬癸')
      expect(s2t('子丑寅卯辰巳午未申酉戌亥')).toBe('子丑寅卯辰巳午未申酉戌亥')
    })

    test('should handle mixed content', () => {
      expect(s2t('hello万world')).toBe('hello萬world')
      expect(s2t('123万456')).toBe('123萬456')
      expect(s2t('万hello亿')).toBe('萬hello億')
    })

    test('should handle empty string', () => {
      expect(s2t('')).toBe('')
    })

    test('should handle non-Chinese text', () => {
      expect(s2t('hello world')).toBe('hello world')
      expect(s2t('123456')).toBe('123456')
    })

    test('should handle special edge case with 丑', () => {
      expect(s2t('丑')).toBe('丑') // Earthly Branch 丑 should NOT be converted
    })

    test('should handle multiple occurrences', () => {
      expect(s2t('万万万')).toBe('萬萬萬')
      expect(s2t('两万两万')).toBe('兩萬兩萬')
    })
  })

  describe('t2s', () => {
    test('should convert individual characters', () => {
      expect(t2s('萬')).toBe('万')
      expect(t2s('億')).toBe('亿')
      expect(t2s('兩')).toBe('两')
      expect(t2s('貳')).toBe('贰')
      expect(t2s('叄')).toBe('叁')
      expect(t2s('陸')).toBe('陆')
      expect(t2s('點')).toBe('点')
      expect(t2s('負')).toBe('负')
      expect(t2s('處')).toBe('处')
      expect(t2s('幣')).toBe('币')
      expect(t2s('釐')).toBe('厘')
    })

    test('should not convert characters not in the map', () => {
      expect(t2s('零一二三四五六七八九')).toBe('零一二三四五六七八九')
      expect(t2s('甲乙丙丁戊己庚辛壬癸')).toBe('甲乙丙丁戊己庚辛壬癸')
    })

    test('should handle mixed content', () => {
      expect(t2s('hello萬world')).toBe('hello万world')
      expect(t2s('123萬456')).toBe('123万456')
      expect(t2s('萬hello億')).toBe('万hello亿')
    })

    test('should handle empty string', () => {
      expect(t2s('')).toBe('')
    })

    test('should handle non-Chinese text', () => {
      expect(t2s('hello world')).toBe('hello world')
      expect(t2s('123456')).toBe('123456')
    })

    test('should handle multiple occurrences', () => {
      expect(t2s('萬萬萬')).toBe('万万万')
      expect(t2s('兩萬兩萬')).toBe('两万两万')
    })
  })

  describe('all convnum chars round-trip conversions', () => {
    const sText =
      '零一二三四五六七八九壹贰叁肆伍陆柒捌玖两十百千万亿点负拾佰仟甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥立春雨水惊蛰分清明谷夏小满芒种至暑大秋处白露寒霜降冬雪人民币元角厘整'

    const tText =
      '零一二三四五六七八九壹貳叄肆伍陸柒捌玖兩十百千萬億點負拾佰仟甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥立春雨水驚蟄分清明谷夏小滿芒種至暑大秋處白露寒霜降冬雪人民幣元角釐整'

    test('Simplified to Traditional Chinese', () => {
      expect(s2t(sText)).toBe(tText)
    })

    test('Traditional to Simplified Chinese', () => {
      expect(t2s(tText)).toBe(sText)
    })
  })

  describe('integration with all functions', () => {
    test('should correctly identify and convert text', () => {
      const simplifiedText = '万亿两点'

      // Check if it's Chinese
      expect(isZh(simplifiedText, 3)).toBe(true)

      // Check if it's simplified
      expect(isZhTOrS(simplifiedText)).toBe(0)

      // Convert to traditional
      const traditionalText = s2t(simplifiedText)
      expect(traditionalText).toBe('萬億兩點')

      // Check if converted text is traditional
      expect(isZhTOrS(traditionalText)).toBe(1)

      // Convert back to simplified
      expect(t2s(traditionalText)).toBe(simplifiedText)
    })

    test('should handle text with no convertible characters', () => {
      const commonText = '零一二三四五'

      expect(isZh(commonText, 3)).toBe(true)
      expect(isZhTOrS(commonText)).toBe(2) // Not sure
      expect(s2t(commonText)).toBe(commonText) // No change
      expect(t2s(commonText)).toBe(commonText) // No change
    })
  })
})
