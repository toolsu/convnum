import { describe, expect, test } from 'bun:test'
import { getTypes, hasType } from '../../src'
import { VALID_NUM_TYPES } from '../../src/utils/orders'
import type {
  CaseType,
  FormatType,
  NumType,
  PrefixType,
  TypeInfo,
  UsUkStyleType,
  ZhstType,
} from '../../src/utils/types'

// Helper function to create TypeInfo objects for easier testing
function typeInfo(
  type: NumType,
  caseType?: CaseType,
  format?: FormatType,
  prefix?: PrefixType,
  zhst?: ZhstType,
  digits?: number,
  ukStyle?: UsUkStyleType
): TypeInfo {
  const info: TypeInfo = { type }
  if (caseType !== undefined) info.case = caseType
  if (format !== undefined) info.format = format
  if (prefix !== undefined) info.prefix = prefix
  if (zhst !== undefined) info.zhst = zhst
  if (digits !== undefined) info.digits = digits
  if (ukStyle !== undefined) info.ukStyle = ukStyle
  return info
}

describe('getTypes function', () => {
  describe('Basic type detection', () => {
    test('should detect decimal numbers', () => {
      expect(getTypes('123')).toContainEqual(typeInfo('decimal'))
      expect(getTypes('-45.67')).toEqual([typeInfo('decimal')])
      expect(getTypes('0')).toContainEqual(typeInfo('decimal'))
    })

    test('should detect binary numbers', () => {
      expect(getTypes('1010')).toContainEqual(
        typeInfo('binary', undefined, undefined, false)
      )
      expect(getTypes('0')).toContainEqual(
        typeInfo('binary', undefined, undefined, false)
      )
    })

    test('should detect hexadecimal with case', () => {
      expect(getTypes('A')).toContainEqual(
        typeInfo('hexadecimal', 'upper', undefined, false)
      )
      expect(getTypes('a')).toContainEqual(
        typeInfo('hexadecimal', 'lower', undefined, false)
      )
      expect(getTypes('FF')).toContainEqual(
        typeInfo('hexadecimal', 'upper', undefined, false)
      )
      expect(getTypes('ff')).toContainEqual(
        typeInfo('hexadecimal', 'lower', undefined, false)
      )
    })

    test('should detect Roman numerals with case', () => {
      expect(getTypes('IV')).toContainEqual(typeInfo('roman', 'upper'))
      expect(getTypes('iv')).toContainEqual(typeInfo('roman', 'lower'))
      expect(getTypes('MCDXL')).toContainEqual(typeInfo('roman', 'upper'))
    })
  })

  describe('Letter types with case', () => {
    test('should detect Latin letters with case', () => {
      expect(getTypes('A')).toContainEqual(typeInfo('latin_letter', 'upper'))
      expect(getTypes('a')).toContainEqual(typeInfo('latin_letter', 'lower'))
      expect(getTypes('Z')).toContainEqual(typeInfo('latin_letter', 'upper'))
      expect(getTypes('z')).toContainEqual(typeInfo('latin_letter', 'lower'))
    })

    test('should detect Greek letters with case', () => {
      expect(getTypes('Α')).toContainEqual(typeInfo('greek_letter', 'upper'))
      expect(getTypes('α')).toContainEqual(typeInfo('greek_letter', 'lower'))
      expect(getTypes('Ω')).toContainEqual(typeInfo('greek_letter', 'upper'))
      expect(getTypes('ω')).toContainEqual(typeInfo('greek_letter', 'lower'))
    })

    test('should detect Cyrillic letters with case', () => {
      expect(getTypes('А')).toContainEqual(typeInfo('cyrillic_letter', 'upper'))
      expect(getTypes('а')).toContainEqual(typeInfo('cyrillic_letter', 'lower'))
      expect(getTypes('Я')).toContainEqual(typeInfo('cyrillic_letter', 'upper'))
      expect(getTypes('я')).toContainEqual(typeInfo('cyrillic_letter', 'lower'))
    })

    test('should detect Hebrew letters without case', () => {
      expect(getTypes('א')).toContainEqual(typeInfo('hebrew_letter'))
      expect(getTypes('ב')).toContainEqual(typeInfo('hebrew_letter'))
      expect(getTypes('ת')).toContainEqual(typeInfo('hebrew_letter'))
      expect(getTypes('י')).toContainEqual(typeInfo('hebrew_letter'))
      expect(getTypes('ל')).toContainEqual(typeInfo('hebrew_letter'))
    })
  })

  describe('Word types with case', () => {
    test('should detect astrological signs with case', () => {
      expect(getTypes('Aries')).toContainEqual(
        typeInfo('astrological_sign', 'sentence')
      )
      expect(getTypes('ARIES')).toContainEqual(
        typeInfo('astrological_sign', 'upper')
      )
      expect(getTypes('aries')).toContainEqual(
        typeInfo('astrological_sign', 'lower')
      )
    })

    test('should detect NATO phonetic with case', () => {
      expect(getTypes('Alfa')).toContainEqual(
        typeInfo('nato_phonetic', 'sentence')
      )
      expect(getTypes('ALFA')).toContainEqual(
        typeInfo('nato_phonetic', 'upper')
      )
      expect(getTypes('alfa')).toContainEqual(
        typeInfo('nato_phonetic', 'lower')
      )
    })

    test('should detect English words with case', () => {
      expect(getTypes('one')).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          2
        )
      )
      expect(getTypes('One')).toContainEqual(
        typeInfo(
          'english_words',
          'sentence',
          undefined,
          undefined,
          undefined,
          undefined,
          2
        )
      )
      expect(getTypes('ONE')).toContainEqual(
        typeInfo(
          'english_words',
          'upper',
          undefined,
          undefined,
          undefined,
          undefined,
          2
        )
      )
      expect(getTypes('Twenty-One')).toContainEqual(
        typeInfo(
          'english_words',
          'title',
          undefined,
          undefined,
          undefined,
          undefined,
          2
        )
      )
    })

    test('should detect French words with case', () => {
      expect(getTypes('un')).toContainEqual(typeInfo('french_words', 'lower'))
      expect(getTypes('Un')).toContainEqual(
        typeInfo('french_words', 'sentence')
      )
      expect(getTypes('UN')).toContainEqual(typeInfo('french_words', 'upper'))
      expect(getTypes('Vingt-Et-Un')).toContainEqual(
        typeInfo('french_words', 'title')
      )
    })

    test('should detect Greek letter English names with case', () => {
      expect(getTypes('Alpha')).toContainEqual(
        typeInfo('greek_letter_english_name', 'sentence')
      )
      expect(getTypes('ALPHA')).toContainEqual(
        typeInfo('greek_letter_english_name', 'upper')
      )
      expect(getTypes('alpha')).toContainEqual(
        typeInfo('greek_letter_english_name', 'lower')
      )
      expect(getTypes('Omega')).toContainEqual(
        typeInfo('greek_letter_english_name', 'sentence')
      )
      expect(getTypes('OMEGA')).toContainEqual(
        typeInfo('greek_letter_english_name', 'upper')
      )
      expect(getTypes('omega')).toContainEqual(
        typeInfo('greek_letter_english_name', 'lower')
      )
    })
  })

  describe('Date/time types with case and format', () => {
    test('should detect month names with case and format', () => {
      expect(getTypes('January')).toContainEqual(
        typeInfo('month_name', 'sentence', 'long')
      )
      expect(getTypes('JANUARY')).toContainEqual(
        typeInfo('month_name', 'upper', 'long')
      )
      expect(getTypes('january')).toContainEqual(
        typeInfo('month_name', 'lower', 'long')
      )
      expect(getTypes('Jan')).toContainEqual(
        typeInfo('month_name', 'sentence', 'short')
      )
      expect(getTypes('JAN')).toContainEqual(
        typeInfo('month_name', 'upper', 'short')
      )
      expect(getTypes('jan')).toContainEqual(
        typeInfo('month_name', 'lower', 'short')
      )
    })

    test('should detect day of week with case and format', () => {
      expect(getTypes('Monday')).toContainEqual(
        typeInfo('day_of_week', 'sentence', 'long')
      )
      expect(getTypes('MONDAY')).toContainEqual(
        typeInfo('day_of_week', 'upper', 'long')
      )
      expect(getTypes('monday')).toContainEqual(
        typeInfo('day_of_week', 'lower', 'long')
      )
      expect(getTypes('Mon')).toContainEqual(
        typeInfo('day_of_week', 'sentence', 'short')
      )
      expect(getTypes('MON')).toContainEqual(
        typeInfo('day_of_week', 'upper', 'short')
      )
      expect(getTypes('mon')).toContainEqual(
        typeInfo('day_of_week', 'lower', 'short')
      )
    })
  })

  describe('Chinese types', () => {
    test('should detect Chinese words', () => {
      expect(getTypes('一')).toContainEqual(
        typeInfo('chinese_words', undefined, undefined, undefined, 2)
      )
      expect(getTypes('十一')).toContainEqual(
        typeInfo('chinese_words', undefined, undefined, undefined, 2)
      )
      expect(getTypes('一百二十三')).toContainEqual(
        typeInfo('chinese_words', undefined, undefined, undefined, 2)
      )
    })

    test('should detect Chinese financial', () => {
      expect(getTypes('壹')).toContainEqual(
        typeInfo('chinese_financial', undefined, undefined, undefined, 2)
      )
      expect(getTypes('壹佰贰拾叁')).toContainEqual(
        typeInfo('chinese_financial', undefined, undefined, undefined, 0)
      )
    })

    test('should detect Chinese heavenly stems', () => {
      expect(getTypes('甲')).toContainEqual(typeInfo('chinese_heavenly_stem'))
      expect(getTypes('乙')).toContainEqual(typeInfo('chinese_heavenly_stem'))
    })

    test('should detect Chinese earthly branches', () => {
      expect(getTypes('子')).toContainEqual(typeInfo('chinese_earthly_branch'))
      expect(getTypes('丑')).toContainEqual(typeInfo('chinese_earthly_branch'))
    })

    test('should detect Chinese solar terms', () => {
      expect(getTypes('立春')).toContainEqual(
        typeInfo('chinese_solar_term', undefined, undefined, undefined, 2)
      )
      expect(getTypes('夏至')).toContainEqual(
        typeInfo('chinese_solar_term', undefined, undefined, undefined, 2)
      )
    })

    test('should detect Chinese zhst for applicable types', () => {
      // Simplified Chinese
      expect(getTypes('一万')).toContainEqual(
        typeInfo('chinese_words', undefined, undefined, undefined, 0)
      )
      expect(getTypes('贰拾叁')).toContainEqual(
        typeInfo('chinese_financial', undefined, undefined, undefined, 0)
      )
      expect(getTypes('惊蛰')).toContainEqual(
        typeInfo('chinese_solar_term', undefined, undefined, undefined, 0)
      )
      expect(getTypes('一萬')).toContainEqual(
        typeInfo('chinese_words', undefined, undefined, undefined, 1)
      )
      expect(getTypes('貳拾')).toContainEqual(
        typeInfo('chinese_financial', undefined, undefined, undefined, 1)
      )
      expect(getTypes('驚蟄')).toContainEqual(
        typeInfo('chinese_solar_term', undefined, undefined, undefined, 1)
      )

      // Mixed Chinese characters are not a canonical numeral in either script, so
      // `validateChineseFinancial`'s round trip rejects them the same way
      // `validateChineseWords` rejects `一十` in favour of `十`.
      expect(getTypes('貳拾陆').map((info) => info.type)).toEqual(['unknown'])
      expect(getTypes('贰拾陆')).toContainEqual(
        typeInfo('chinese_financial', undefined, undefined, undefined, 0)
      )
      expect(getTypes('貳拾陸')).toContainEqual(
        typeInfo('chinese_financial', undefined, undefined, undefined, 1)
      )

      // Chinese characters that are not in validation patterns will be detected as 'unknown'
      // This is expected behavior since validation functions use specific character sets

      // Ambiguous (same in both forms) - using characters that are properly detected
      expect(getTypes('零')).toContainEqual(
        typeInfo('chinese_words', undefined, undefined, undefined, 2)
      )
      expect(getTypes('立春')).toContainEqual(
        typeInfo('chinese_solar_term', undefined, undefined, undefined, 2)
      )
    })

    test('should NOT detect zhst for heavenly stems and earthly branches', () => {
      // These types should not have zhst property since all chars are the same in both forms
      const heavenlyResult = getTypes('甲')
      const heavenlyTypeInfo = heavenlyResult.find(
        (t) => t.type === 'chinese_heavenly_stem'
      )
      expect(heavenlyTypeInfo?.zhst).toBeUndefined()

      const earthlyResult = getTypes('子')
      const earthlyTypeInfo = earthlyResult.find(
        (t) => t.type === 'chinese_earthly_branch'
      )
      expect(earthlyTypeInfo?.zhst).toBeUndefined()
    })
  })

  describe('Multiple type detection', () => {
    test('should detect overlapping types correctly', () => {
      const result = getTypes('A')
      expect(result).toContainEqual(typeInfo('latin_letter', 'upper'))
      expect(result).toContainEqual(
        typeInfo('hexadecimal', 'upper', undefined, false)
      )
      expect(result.length).toBe(2)
    })

    test('should detect Dec as both hexadecimal and month', () => {
      const result = getTypes('Dec')
      expect(result).toContainEqual(
        typeInfo('hexadecimal', 'sentence', undefined, false)
      )
      expect(result).toContainEqual(typeInfo('month_name', 'sentence', 'short'))
      expect(result.length).toBe(2)
    })

    test('should detect overlapping Chinese types', () => {
      const result = getTypes('零')
      expect(result).toContainEqual(
        typeInfo('chinese_words', undefined, undefined, undefined, 2)
      )
      expect(result).toContainEqual(
        typeInfo('chinese_financial', undefined, undefined, undefined, 2)
      )
      expect(result.length).toBe(2)
    })
  })

  describe('Prefix detection', () => {
    test('should detect hexadecimal with prefixes', () => {
      expect(getTypes('0xff')).toContainEqual(
        typeInfo('hexadecimal', 'lower', undefined, 'lower')
      )
      expect(getTypes('0xFF')).toContainEqual(
        typeInfo('hexadecimal', 'upper', undefined, 'lower')
      )
      expect(getTypes('0Xff')).toContainEqual(
        typeInfo('hexadecimal', 'lower', undefined, 'upper')
      )
      expect(getTypes('0XFF')).toContainEqual(
        typeInfo('hexadecimal', 'upper', undefined, 'upper')
      )
      expect(getTypes('0xAB')).toContainEqual(
        typeInfo('hexadecimal', 'upper', undefined, 'lower')
      )
      expect(getTypes('0xab')).toContainEqual(
        typeInfo('hexadecimal', 'lower', undefined, 'lower')
      )
    })

    test('should detect binary with prefixes', () => {
      expect(getTypes('0b1010')).toContainEqual(
        typeInfo('binary', undefined, undefined, 'lower')
      )
      expect(getTypes('0B1010')).toContainEqual(
        typeInfo('binary', undefined, undefined, 'upper')
      )
      expect(getTypes('0b0')).toContainEqual(
        typeInfo('binary', undefined, undefined, 'lower')
      )
      expect(getTypes('0B11111111')).toContainEqual(
        typeInfo('binary', undefined, undefined, 'upper')
      )
    })

    test('should detect octal with prefixes', () => {
      expect(getTypes('0o77')).toContainEqual(
        typeInfo('octal', undefined, undefined, 'lower')
      )
      expect(getTypes('0O77')).toContainEqual(
        typeInfo('octal', undefined, undefined, 'upper')
      )
      expect(getTypes('0o0')).toContainEqual(
        typeInfo('octal', undefined, undefined, 'lower')
      )
      expect(getTypes('0O123')).toContainEqual(
        typeInfo('octal', undefined, undefined, 'upper')
      )
    })

    test('should detect non-prefixed base numbers', () => {
      expect(getTypes('ff')).toContainEqual(
        typeInfo('hexadecimal', 'lower', undefined, false)
      )
      expect(getTypes('FF')).toContainEqual(
        typeInfo('hexadecimal', 'upper', undefined, false)
      )
      expect(getTypes('1010')).toContainEqual(
        typeInfo('binary', undefined, undefined, false)
      )
      expect(getTypes('77')).toContainEqual(
        typeInfo('octal', undefined, undefined, false)
      )
    })

    test('should handle overlapping prefixed types', () => {
      // 0b1010 should only be detected as binary with prefix, not as hexadecimal
      // because hexadecimal validator now correctly rejects binary prefixes
      const result = getTypes('0b1010')
      expect(result).toContainEqual(
        typeInfo('binary', undefined, undefined, 'lower')
      )
      expect(result).not.toContainEqual(
        typeInfo('hexadecimal', 'lower', undefined, false)
      )
      expect(result.length).toBe(1)
    })
  })

  describe('Digits detection for zero-padded numbers', () => {
    test('should detect digits for zero-padded decimal numbers', () => {
      expect(getTypes('00123')).toContainEqual(
        typeInfo('decimal', undefined, undefined, undefined, undefined, 5)
      )
      expect(getTypes('0012')).toContainEqual(
        typeInfo('decimal', undefined, undefined, undefined, undefined, 4)
      )
      expect(getTypes('007')).toContainEqual(
        typeInfo('decimal', undefined, undefined, undefined, undefined, 3)
      )
      expect(getTypes('000')).toContainEqual(
        typeInfo('decimal', undefined, undefined, undefined, undefined, 3)
      )
    })

    test('should NOT detect digits for non-zero-padded decimal numbers', () => {
      const result123 = getTypes('123')
      const decimalType123 = result123.find((t) => t.type === 'decimal')
      expect(decimalType123?.digits).toBeUndefined()

      const result13 = getTypes('13')
      const decimalType13 = result13.find((t) => t.type === 'decimal')
      expect(decimalType13?.digits).toBeUndefined()

      const result1 = getTypes('1')
      const decimalType1 = result1.find((t) => t.type === 'decimal')
      expect(decimalType1?.digits).toBeUndefined()
    })

    test('should detect digits for negative zero-padded decimal numbers', () => {
      expect(getTypes('-00123')).toContainEqual(
        typeInfo('decimal', undefined, undefined, undefined, undefined, 5)
      )
      expect(getTypes('-0012')).toContainEqual(
        typeInfo('decimal', undefined, undefined, undefined, undefined, 4)
      )
      expect(getTypes('-007')).toContainEqual(
        typeInfo('decimal', undefined, undefined, undefined, undefined, 3)
      )
    })

    test('should NOT detect digits for negative non-zero-padded decimal numbers', () => {
      const resultNeg = getTypes('-123')
      const decimalTypeNeg = resultNeg.find((t) => t.type === 'decimal')
      expect(decimalTypeNeg?.digits).toBeUndefined()

      const resultNeg13 = getTypes('-13')
      const decimalTypeNeg13 = resultNeg13.find((t) => t.type === 'decimal')
      expect(decimalTypeNeg13?.digits).toBeUndefined()
    })

    test('should NOT detect digits for floats', () => {
      const resultFloat = getTypes('3.14')
      const decimalTypeFloat = resultFloat.find((t) => t.type === 'decimal')
      expect(decimalTypeFloat?.digits).toBeUndefined()
    })

    test('should detect digits for zero-padded hexadecimal numbers', () => {
      expect(getTypes('0x012a')).toContainEqual(
        typeInfo('hexadecimal', 'lower', undefined, 'lower', undefined, 4)
      )
      expect(getTypes('0012a')).toContainEqual(
        typeInfo('hexadecimal', 'lower', undefined, false, undefined, 5)
      )
      expect(getTypes('0X012A')).toContainEqual(
        typeInfo('hexadecimal', 'upper', undefined, 'upper', undefined, 4)
      )
      expect(getTypes('00FF')).toContainEqual(
        typeInfo('hexadecimal', 'upper', undefined, false, undefined, 4)
      )
    })

    test('should NOT detect digits for non-zero-padded hexadecimal numbers', () => {
      const resultHex1 = getTypes('0x4')
      const hexType1 = resultHex1.find((t) => t.type === 'hexadecimal')
      expect(hexType1?.digits).toBeUndefined()

      const resultHex2 = getTypes('0x214')
      const hexType2 = resultHex2.find((t) => t.type === 'hexadecimal')
      expect(hexType2?.digits).toBeUndefined()

      const resultHex3 = getTypes('214')
      const hexType3 = resultHex3.find((t) => t.type === 'hexadecimal')
      expect(hexType3?.digits).toBeUndefined()

      const resultHex4 = getTypes('0xab')
      const hexType4 = resultHex4.find((t) => t.type === 'hexadecimal')
      expect(hexType4?.digits).toBeUndefined()
    })

    test('should detect digits for zero-padded binary numbers', () => {
      expect(getTypes('0b00101')).toContainEqual(
        typeInfo('binary', undefined, undefined, 'lower', undefined, 5)
      )
      expect(getTypes('0B00101')).toContainEqual(
        typeInfo('binary', undefined, undefined, 'upper', undefined, 5)
      )
      expect(getTypes('00101')).toContainEqual(
        typeInfo('binary', undefined, undefined, false, undefined, 5)
      )
    })

    test('should NOT detect digits for non-zero-padded binary numbers', () => {
      const resultBin1 = getTypes('0b1010')
      const binType1 = resultBin1.find((t) => t.type === 'binary')
      expect(binType1?.digits).toBeUndefined()

      const resultBin2 = getTypes('1010')
      const binType2 = resultBin2.find((t) => t.type === 'binary')
      expect(binType2?.digits).toBeUndefined()
    })

    test('should detect digits for zero-padded octal numbers', () => {
      expect(getTypes('0o00123')).toContainEqual(
        typeInfo('octal', undefined, undefined, 'lower', undefined, 5)
      )
      expect(getTypes('0O00123')).toContainEqual(
        typeInfo('octal', undefined, undefined, 'upper', undefined, 5)
      )
      expect(getTypes('00123')).toContainEqual(
        typeInfo('octal', undefined, undefined, false, undefined, 5)
      )
    })

    test('should NOT detect digits for non-zero-padded octal numbers', () => {
      const resultOct1 = getTypes('0o77')
      const octType1 = resultOct1.find((t) => t.type === 'octal')
      expect(octType1?.digits).toBeUndefined()

      const resultOct2 = getTypes('77')
      const octType2 = resultOct2.find((t) => t.type === 'octal')
      expect(octType2?.digits).toBeUndefined()
    })

    test('should detect digits for negative zero-padded hexadecimal numbers', () => {
      expect(getTypes('-0x001F1')).toContainEqual(
        typeInfo('hexadecimal', 'upper', undefined, 'lower', undefined, 5)
      )
      expect(getTypes('-001F1')).toContainEqual(
        typeInfo('hexadecimal', 'upper', undefined, false, undefined, 5)
      )
      expect(getTypes('-0x012a')).toContainEqual(
        typeInfo('hexadecimal', 'lower', undefined, 'lower', undefined, 4)
      )
      expect(getTypes('-0012a')).toContainEqual(
        typeInfo('hexadecimal', 'lower', undefined, false, undefined, 5)
      )
      expect(getTypes('-0X012A')).toContainEqual(
        typeInfo('hexadecimal', 'upper', undefined, 'upper', undefined, 4)
      )
      expect(getTypes('-00FF')).toContainEqual(
        typeInfo('hexadecimal', 'upper', undefined, false, undefined, 4)
      )
    })

    test('should NOT detect digits for negative non-zero-padded hexadecimal numbers', () => {
      const resultHex1 = getTypes('-0x4')
      const hexType1 = resultHex1.find((t) => t.type === 'hexadecimal')
      expect(hexType1?.digits).toBeUndefined()

      const resultHex2 = getTypes('-214')
      const hexType2 = resultHex2.find((t) => t.type === 'hexadecimal')
      expect(hexType2?.digits).toBeUndefined()

      const resultHex3 = getTypes('-0xab')
      const hexType3 = resultHex3.find((t) => t.type === 'hexadecimal')
      expect(hexType3?.digits).toBeUndefined()
    })

    test('should detect digits for negative zero-padded binary numbers', () => {
      expect(getTypes('-0b00101')).toContainEqual(
        typeInfo('binary', undefined, undefined, 'lower', undefined, 5)
      )
      expect(getTypes('-0B00101')).toContainEqual(
        typeInfo('binary', undefined, undefined, 'upper', undefined, 5)
      )
      expect(getTypes('-00101')).toContainEqual(
        typeInfo('binary', undefined, undefined, false, undefined, 5)
      )
    })

    test('should NOT detect digits for negative non-zero-padded binary numbers', () => {
      const resultBin1 = getTypes('-0b1010')
      const binType1 = resultBin1.find((t) => t.type === 'binary')
      expect(binType1?.digits).toBeUndefined()

      const resultBin2 = getTypes('-1010')
      const binType2 = resultBin2.find((t) => t.type === 'binary')
      expect(binType2?.digits).toBeUndefined()
    })

    test('should detect digits for negative zero-padded octal numbers', () => {
      expect(getTypes('-0o00123')).toContainEqual(
        typeInfo('octal', undefined, undefined, 'lower', undefined, 5)
      )
      expect(getTypes('-0O00123')).toContainEqual(
        typeInfo('octal', undefined, undefined, 'upper', undefined, 5)
      )
      expect(getTypes('-00123')).toContainEqual(
        typeInfo('octal', undefined, undefined, false, undefined, 5)
      )
    })

    test('should NOT detect digits for negative non-zero-padded octal numbers', () => {
      const resultOct1 = getTypes('-0o77')
      const octType1 = resultOct1.find((t) => t.type === 'octal')
      expect(octType1?.digits).toBeUndefined()

      const resultOct2 = getTypes('-77')
      const octType2 = resultOct2.find((t) => t.type === 'octal')
      expect(octType2?.digits).toBeUndefined()
    })
  })

  describe('Special cases', () => {
    test('should handle invalid inputs', () => {
      expect(getTypes(null as unknown as string)).toEqual([typeInfo('invalid')])
      expect(getTypes(undefined as unknown as string)).toEqual([
        typeInfo('invalid'),
      ])
      expect(getTypes(123 as unknown as string)).toEqual([typeInfo('invalid')])
    })

    test('should handle empty strings', () => {
      expect(getTypes('')).toEqual([typeInfo('empty')])
      expect(getTypes('   ')).toEqual([typeInfo('empty')])
      expect(getTypes('\t\n')).toEqual([typeInfo('empty')])
    })

    test('should handle unknown types', () => {
      expect(getTypes('invalid-string')).toEqual([typeInfo('unknown')])
      expect(getTypes('xyz123')).toEqual([typeInfo('unknown')])
    })
  })

  describe('English ordinal numbers', () => {
    test('should detect English ordinal with case', () => {
      expect(getTypes('1st')).toContainEqual(
        typeInfo('english_ordinal_abbr', 'lower')
      )
      expect(getTypes('1ST')).toContainEqual(
        typeInfo('english_ordinal_abbr', 'upper')
      )
      expect(getTypes('2nd')).toContainEqual(
        typeInfo('english_ordinal_abbr', 'lower')
      )
      expect(getTypes('2ND')).toContainEqual(
        typeInfo('english_ordinal_abbr', 'upper')
      )
    })
  })

  describe('UK/US style detection for English words', () => {
    test('should detect US style (ukStyle: 0) for numbers with "and"', () => {
      // These should be detected as US style because they don't have "and"
      expect(getTypes('one hundred five')).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        )
      )
      expect(getTypes('one thousand five')).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        )
      )
      expect(getTypes('one million five')).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        )
      )
      expect(getTypes('one hundred twenty-three')).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        )
      )
      expect(getTypes('two thousand one hundred')).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          2
        )
      )
    })

    test('should detect UK style (ukStyle: 1) for numbers with "and"', () => {
      // These should be detected as UK style because they have "and"
      expect(getTypes('one hundred and five')).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        )
      )
      expect(getTypes('one thousand and five')).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        )
      )
      expect(getTypes('one million and five')).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        )
      )
      expect(getTypes('one hundred and twenty-three')).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        )
      )
      expect(getTypes('two thousand one hundred and five')).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        )
      )
    })

    test('should detect not sure style (ukStyle: 2) for ambiguous numbers', () => {
      // These should be detected as not sure because both US and UK styles produce the same result
      expect(getTypes('one')).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          2
        )
      )
      expect(getTypes('five')).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          2
        )
      )
      expect(getTypes('twenty')).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          2
        )
      )
      expect(getTypes('one hundred')).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          2
        )
      )
      expect(getTypes('one thousand')).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          2
        )
      )
      expect(getTypes('one million')).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          2
        )
      )
      expect(getTypes('twenty-one')).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          2
        )
      )
      expect(getTypes('fifty-five')).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          2
        )
      )
    })

    test('should detect UK/US style with different cases', () => {
      // US style with different cases
      expect(getTypes('One Hundred Five')).toContainEqual(
        typeInfo(
          'english_words',
          'title',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        )
      )
      expect(getTypes('ONE HUNDRED FIVE')).toContainEqual(
        typeInfo(
          'english_words',
          'upper',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        )
      )
      expect(getTypes('One hundred five')).toContainEqual(
        typeInfo(
          'english_words',
          'sentence',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        )
      )

      // UK style with different cases
      expect(getTypes('One Hundred And Five')).toContainEqual(
        typeInfo(
          'english_words',
          'title',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        )
      )
      expect(getTypes('ONE HUNDRED AND FIVE')).toContainEqual(
        typeInfo(
          'english_words',
          'upper',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        )
      )
      expect(getTypes('One hundred and five')).toContainEqual(
        typeInfo(
          'english_words',
          'sentence',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        )
      )

      // Not sure style with different cases
      expect(getTypes('Twenty-One')).toContainEqual(
        typeInfo(
          'english_words',
          'title',
          undefined,
          undefined,
          undefined,
          undefined,
          2
        )
      )
      expect(getTypes('TWENTY-ONE')).toContainEqual(
        typeInfo(
          'english_words',
          'upper',
          undefined,
          undefined,
          undefined,
          undefined,
          2
        )
      )
      expect(getTypes('Twenty-one')).toContainEqual(
        typeInfo(
          'english_words',
          'sentence',
          undefined,
          undefined,
          undefined,
          undefined,
          2
        )
      )
    })

    test('should detect UK/US style for complex numbers', () => {
      // US style complex numbers
      expect(
        getTypes(
          'one million two hundred thirty-four thousand five hundred sixty-seven'
        )
      ).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        )
      )
      expect(getTypes('two thousand one hundred fifty')).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        )
      )

      // UK style complex numbers
      expect(
        getTypes(
          'one million two hundred and thirty-four thousand five hundred and sixty-seven'
        )
      ).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        )
      )
      expect(getTypes('two thousand one hundred and fifty')).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        )
      )
    })

    test('should detect UK/US style for negative numbers', () => {
      // US style negative numbers
      expect(getTypes('negative one hundred five')).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        )
      )
      expect(getTypes('negative one thousand five')).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        )
      )

      // UK style negative numbers
      expect(getTypes('negative one hundred and five')).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        )
      )
      expect(getTypes('negative one thousand and five')).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        )
      )
    })

    test('should detect UK/US style for edge cases', () => {
      // Numbers that don't have "and" in either style
      expect(getTypes('one hundred')).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          2
        )
      )
      expect(getTypes('one thousand')).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          2
        )
      )
      expect(getTypes('one million')).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          2
        )
      )

      // Numbers that always have "and" in UK style
      expect(getTypes('one hundred one')).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        )
      )
      expect(getTypes('one hundred and one')).toContainEqual(
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        )
      )
    })
  })

  describe('UK/US style detection for English ordinal words', () => {
    test('should detect US style (ukStyle: 0) for ordinal words with "and"', () => {
      expect(getTypes('one hundred fifth')).toContainEqual(
        typeInfo(
          'english_ordinal_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        )
      )
      expect(getTypes('one thousand fifth')).toContainEqual(
        typeInfo(
          'english_ordinal_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        )
      )
      expect(getTypes('one million fifth')).toContainEqual(
        typeInfo(
          'english_ordinal_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        )
      )
    })

    test('should detect UK style (ukStyle: 1) for ordinal words with "and"', () => {
      expect(getTypes('one hundred and fifth')).toContainEqual(
        typeInfo(
          'english_ordinal_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        )
      )
      expect(getTypes('one thousand and fifth')).toContainEqual(
        typeInfo(
          'english_ordinal_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        )
      )
      expect(getTypes('one million and fifth')).toContainEqual(
        typeInfo(
          'english_ordinal_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        )
      )
    })

    test('should detect not sure style (ukStyle: 2) for ambiguous ordinal words', () => {
      expect(getTypes('first')).toContainEqual(
        typeInfo(
          'english_ordinal_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          2
        )
      )
      expect(getTypes('second')).toContainEqual(
        typeInfo(
          'english_ordinal_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          2
        )
      )
      expect(getTypes('twenty-first')).toContainEqual(
        typeInfo(
          'english_ordinal_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          2
        )
      )
      expect(getTypes('one hundredth')).toContainEqual(
        typeInfo(
          'english_ordinal_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          2
        )
      )
      expect(getTypes('one thousandth')).toContainEqual(
        typeInfo(
          'english_ordinal_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          2
        )
      )
    })

    test('should detect UK/US style for complex ordinal numbers', () => {
      // US style complex ordinal numbers
      expect(
        getTypes(
          'one million two hundred thirty-four thousand five hundred sixty-seventh'
        )
      ).toContainEqual(
        typeInfo(
          'english_ordinal_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        )
      )

      // UK style complex ordinal numbers
      expect(
        getTypes(
          'one million two hundred and thirty-four thousand five hundred and sixty-seventh'
        )
      ).toContainEqual(
        typeInfo(
          'english_ordinal_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        )
      )
    })

    test('should detect UK/US style for negative ordinal numbers', () => {
      // US style negative ordinal numbers
      expect(getTypes('negative one hundred fifth')).toContainEqual(
        typeInfo(
          'english_ordinal_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        )
      )

      // UK style negative ordinal numbers
      expect(getTypes('negative one hundred and fifth')).toContainEqual(
        typeInfo(
          'english_ordinal_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        )
      )
    })
  })

  describe('Arabic numerals', () => {
    test('should detect Arabic numerals', () => {
      expect(getTypes('١٢٣')).toContainEqual(typeInfo('arabic'))
      expect(getTypes('٠')).toContainEqual(typeInfo('arabic'))
    })
  })
})

describe('hasType function', () => {
  test('should work with all basic types', () => {
    expect(hasType('123', 'decimal')).toBe(true)
    expect(hasType('A', 'latin_letter')).toBe(true)
    expect(hasType('Aries', 'astrological_sign')).toBe(true)
    expect(hasType('January', 'month_name')).toBe(true)
    expect(hasType('IV', 'roman')).toBe(true)
    expect(hasType('invalid', 'roman')).toBe(false)
  })

  test('should handle special types', () => {
    expect(hasType('', 'empty')).toBe(true)
    expect(hasType('invalid-string', 'unknown')).toBe(true)
    expect(hasType(null as unknown as string, 'invalid')).toBe(true)
  })
})

describe('Result ordering', () => {
  test('should return types in VALID_NUM_TYPES order', () => {
    // Use a string that matches multiple types to test ordering
    // 'A' matches: decimal (nope), latin_letter, greek_letter (nope), ..., hexadecimal
    const result = getTypes('A')

    // Extract the types from the result
    const resultTypes = result.map((r) => r.type)

    // Get the indices of these types in VALID_NUM_TYPES
    const expectedOrder = VALID_NUM_TYPES.filter((type) =>
      resultTypes.includes(type)
    )

    // Check that the result types are in the same order as VALID_NUM_TYPES
    expect(resultTypes).toEqual(expectedOrder)
  })

  test('should return types in VALID_NUM_TYPES order for multiple matches', () => {
    // Test with another example that has multiple matches
    // 'Dec' matches: month_name, hexadecimal (in that order in VALID_NUM_TYPES)
    const result = getTypes('Dec')
    const resultTypes = result.map((r) => r.type)

    // Verify both types are present
    expect(resultTypes).toContain('month_name')
    expect(resultTypes).toContain('hexadecimal')

    // Verify they appear in the same order as VALID_NUM_TYPES
    const monthIndex = VALID_NUM_TYPES.indexOf('month_name')
    const hexIndex = VALID_NUM_TYPES.indexOf('hexadecimal')

    if (monthIndex >= 0 && hexIndex >= 0 && monthIndex < hexIndex) {
      // If month_name comes before hexadecimal in VALID_NUM_TYPES, it should in results too
      const monthResultIndex = resultTypes.indexOf('month_name')
      const hexResultIndex = resultTypes.indexOf('hexadecimal')
      expect(monthResultIndex).toBeLessThan(hexResultIndex)
    }
  })

  test('should return types in VALID_NUM_TYPES order for Chinese overlaps', () => {
    // Test with Chinese character that matches multiple types
    // '零' matches: chinese_words, chinese_financial
    const result = getTypes('零')
    const resultTypes = result.map((r) => r.type)

    // Verify both types are present
    expect(resultTypes).toContain('chinese_words')
    expect(resultTypes).toContain('chinese_financial')

    // Verify they appear in the same order as VALID_NUM_TYPES
    const wordsIndex = VALID_NUM_TYPES.indexOf('chinese_words')
    const financialIndex = VALID_NUM_TYPES.indexOf('chinese_financial')

    if (wordsIndex >= 0 && financialIndex >= 0 && wordsIndex < financialIndex) {
      // If chinese_words comes before chinese_financial in VALID_NUM_TYPES, it should in results too
      const wordsResultIndex = resultTypes.indexOf('chinese_words')
      const financialResultIndex = resultTypes.indexOf('chinese_financial')
      expect(wordsResultIndex).toBeLessThan(financialResultIndex)
    }
  })
})
