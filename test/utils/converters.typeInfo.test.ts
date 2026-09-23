import { describe, expect, test } from 'bun:test'
import { convertFrom, convertTo } from '../../src'
import type {
  CaseType,
  FormatType,
  NumType,
  PrefixType,
  TypeInfo,
  ZhstType,
} from '../../src/utils/types'

// Helper function to create TypeInfo objects for easier testing
function typeInfo(
  type: NumType,
  caseType?: CaseType,
  format?: FormatType,
  prefix?: PrefixType,
  zhst?: ZhstType,
  digits?: number
): TypeInfo {
  const info: TypeInfo = { type }
  if (caseType !== undefined) info.case = caseType
  if (format !== undefined) info.format = format
  if (prefix !== undefined) info.prefix = prefix
  if (zhst !== undefined) info.zhst = zhst
  if (digits !== undefined) info.digits = digits
  return info
}

describe('Converter Functions with TypeInfo', () => {
  describe('convertFrom function with TypeInfo', () => {
    test('should convert with basic types', () => {
      expect(convertFrom('123', { type: 'decimal' })).toBe(123)
      expect(convertFrom('1010', { type: 'binary' })).toBe(10)
      expect(convertFrom('IV', { type: 'roman' })).toBe(4)
      expect(convertFrom('A', { type: 'latin_letter' })).toBe(1)
      expect(convertFrom('January', { type: 'month_name' })).toBe(1)
      expect(convertFrom('Jan', { type: 'month_name' })).toBe(1)
      expect(convertFrom('Aries', { type: 'astrological_sign' })).toBe(1)
      expect(convertFrom('twenty-one', { type: 'english_words' })).toBe(21)
      expect(convertFrom('一百二十三', { type: 'chinese_words' })).toBe(123)
    })

    test('should convert regardless of case/format properties', () => {
      // Case and format properties shouldn't affect convertFrom
      expect(convertFrom('A', { type: 'latin_letter', case: 'upper' })).toBe(1)
      expect(convertFrom('a', { type: 'latin_letter', case: 'lower' })).toBe(1)
      expect(
        convertFrom('January', {
          type: 'month_name',
          case: 'sentence',
          format: 'long',
        })
      ).toBe(1)
      expect(
        convertFrom('Jan', {
          type: 'month_name',
          case: 'sentence',
          format: 'short',
        })
      ).toBe(1)
    })

    test('should work with complex types', () => {
      expect(
        convertFrom('Aries', { type: 'astrological_sign', case: 'sentence' })
      ).toBe(1)
      expect(
        convertFrom('twenty-one', { type: 'english_words', case: 'lower' })
      ).toBe(21)
    })

    test('should throw error for invalid TypeInfo', () => {
      expect(() => convertFrom('123', { type: 'invalid' })).toThrow(
        'Cannot convert invalid type'
      )

      expect(() => convertFrom('123', { type: 'empty' })).toThrow(
        'Cannot convert empty type'
      )

      expect(() => convertFrom('123', { type: 'unknown' })).toThrow(
        'Cannot convert unknown type'
      )
    })
  })

  describe('convertTo function with TypeInfo', () => {
    test('should convert with basic types', () => {
      expect(convertTo(123, { type: 'decimal' })).toBe('123')
      expect(convertTo(10, { type: 'binary' })).toBe('1010')
      expect(convertTo(4, { type: 'roman' })).toBe('IV')
    })

    test('should apply case transformations', () => {
      // Latin letters
      expect(convertTo(1, { type: 'latin_letter', case: 'lower' })).toBe('a')
      expect(convertTo(1, { type: 'latin_letter', case: 'upper' })).toBe('A')

      // Greek letters
      expect(convertTo(1, { type: 'greek_letter', case: 'lower' })).toBe('α')
      expect(convertTo(1, { type: 'greek_letter', case: 'upper' })).toBe('Α')

      // Cyrillic letters
      expect(convertTo(1, { type: 'cyrillic_letter', case: 'lower' })).toBe('а')
      expect(convertTo(1, { type: 'cyrillic_letter', case: 'upper' })).toBe('А')
    })

    test('should apply case transformations to words', () => {
      // Astrological signs
      expect(convertTo(1, { type: 'astrological_sign', case: 'lower' })).toBe(
        'aries'
      )
      expect(convertTo(1, { type: 'astrological_sign', case: 'upper' })).toBe(
        'ARIES'
      )
      expect(
        convertTo(1, { type: 'astrological_sign', case: 'sentence' })
      ).toBe('Aries')

      // NATO phonetic
      expect(convertTo(1, { type: 'nato_phonetic', case: 'lower' })).toBe(
        'alfa'
      )
      expect(convertTo(1, { type: 'nato_phonetic', case: 'upper' })).toBe(
        'ALFA'
      )
      expect(convertTo(1, { type: 'nato_phonetic', case: 'sentence' })).toBe(
        'Alfa'
      )

      // English words
      expect(convertTo(21, { type: 'english_words', case: 'lower' })).toBe(
        'twenty-one'
      )
      expect(convertTo(21, { type: 'english_words', case: 'upper' })).toBe(
        'TWENTY-ONE'
      )
      expect(convertTo(21, { type: 'english_words', case: 'sentence' })).toBe(
        'Twenty-one'
      )
      expect(convertTo(21, { type: 'english_words', case: 'title' })).toBe(
        'Twenty-One'
      )

      // French words
      expect(convertTo(21, { type: 'french_words', case: 'lower' })).toBe(
        'vingt-et-un'
      )
      expect(convertTo(21, { type: 'french_words', case: 'upper' })).toBe(
        'VINGT-ET-UN'
      )
      expect(convertTo(21, { type: 'french_words', case: 'sentence' })).toBe(
        'Vingt-et-un'
      )
      expect(convertTo(21, { type: 'french_words', case: 'title' })).toBe(
        'Vingt-Et-Un'
      )
    })

    test('should apply format for date/time types', () => {
      // Month names
      expect(
        convertTo(1, { type: 'month_name', format: 'long', case: 'sentence' })
      ).toBe('January')
      expect(
        convertTo(1, { type: 'month_name', format: 'short', case: 'sentence' })
      ).toBe('Jan')
      expect(
        convertTo(1, { type: 'month_name', format: 'long', case: 'lower' })
      ).toBe('january')
      expect(
        convertTo(1, { type: 'month_name', format: 'short', case: 'upper' })
      ).toBe('JAN')

      // Day of week names
      expect(
        convertTo(1, { type: 'day_of_week', format: 'long', case: 'sentence' })
      ).toBe('Monday')
      expect(
        convertTo(1, {
          type: 'day_of_week',
          format: 'short',
          case: 'sentence',
        })
      ).toBe('Mon')
      expect(
        convertTo(1, { type: 'day_of_week', format: 'long', case: 'lower' })
      ).toBe('monday')
      expect(
        convertTo(1, { type: 'day_of_week', format: 'short', case: 'upper' })
      ).toBe('MON')
    })

    test('should handle hexadecimal case', () => {
      expect(convertTo(255, { type: 'hexadecimal', case: 'lower' })).toBe('ff')
      expect(convertTo(255, { type: 'hexadecimal', case: 'upper' })).toBe('FF')
      expect(convertTo(171, { type: 'hexadecimal', case: 'lower' })).toBe('ab')
      expect(convertTo(171, { type: 'hexadecimal', case: 'upper' })).toBe('AB')
    })

    test('should handle roman numeral case', () => {
      expect(convertTo(4, { type: 'roman', case: 'lower' })).toBe('iv')
      expect(convertTo(4, { type: 'roman', case: 'upper' })).toBe('IV')
      expect(convertTo(1994, { type: 'roman', case: 'lower' })).toBe('mcmxciv')
      expect(convertTo(1994, { type: 'roman', case: 'upper' })).toBe('MCMXCIV')
    })

    test('should handle english ordinal case', () => {
      expect(
        convertTo(1, { type: 'english_ordinal_abbr', case: 'lower' })
      ).toBe('1st')
      expect(
        convertTo(1, { type: 'english_ordinal_abbr', case: 'upper' })
      ).toBe('1ST')
      expect(
        convertTo(1, { type: 'english_ordinal_abbr', case: 'sentence' })
      ).toBe('1st')
      expect(
        convertTo(2, { type: 'english_ordinal_abbr', case: 'lower' })
      ).toBe('2nd')
      expect(
        convertTo(2, { type: 'english_ordinal_abbr', case: 'upper' })
      ).toBe('2ND')
    })

    test('should use defaults when case/format not specified', () => {
      // Should use default behaviors when case/format not specified
      expect(convertTo(1, { type: 'latin_letter' })).toBe('a') // default lowercase
      expect(convertTo(1, { type: 'month_name' })).toBe('January') // default long format
      expect(convertTo(255, { type: 'hexadecimal' })).toBe('ff') // default lowercase
    })
  })

  describe('Round-trip conversions with TypeInfo', () => {
    test('should preserve exact format in round-trips', () => {
      const testCases: Array<{ input: string; typeInfo: TypeInfo }> = [
        { input: 'A', typeInfo: { type: 'latin_letter', case: 'upper' } },
        { input: 'a', typeInfo: { type: 'latin_letter', case: 'lower' } },
        {
          input: 'ARIES',
          typeInfo: { type: 'astrological_sign', case: 'upper' },
        },
        {
          input: 'aries',
          typeInfo: { type: 'astrological_sign', case: 'lower' },
        },
        {
          input: 'January',
          typeInfo: { type: 'month_name', case: 'sentence', format: 'long' },
        },
        {
          input: 'JAN',
          typeInfo: { type: 'month_name', case: 'upper', format: 'short' },
        },
        { input: 'FF', typeInfo: { type: 'hexadecimal', case: 'upper' } },
        { input: 'ff', typeInfo: { type: 'hexadecimal', case: 'lower' } },
        { input: 'IV', typeInfo: { type: 'roman', case: 'upper' } },
        { input: 'iv', typeInfo: { type: 'roman', case: 'lower' } },
        {
          input: 'Twenty-One',
          typeInfo: { type: 'english_words', case: 'title' },
        },
        {
          input: 'twenty-one',
          typeInfo: { type: 'english_words', case: 'lower' },
        },
      ]

      testCases.forEach(({ input, typeInfo }) => {
        const num = convertFrom(input, typeInfo)
        const result = convertTo(num, typeInfo)
        expect(result).toBe(input)
      })
    })

    test('should work with all types that have properties', () => {
      // Test a comprehensive set of types with their properties
      const testData = [
        {
          num: 1,
          typeInfo: { type: 'latin_letter', case: 'upper' } as TypeInfo,
          expected: 'A',
        },
        {
          num: 1,
          typeInfo: { type: 'greek_letter', case: 'lower' } as TypeInfo,
          expected: 'α',
        },
        {
          num: 1,
          typeInfo: { type: 'cyrillic_letter', case: 'upper' } as TypeInfo,
          expected: 'А',
        },
        {
          num: 3,
          typeInfo: {
            type: 'month_name',
            case: 'lower',
            format: 'short',
          } as TypeInfo,
          expected: 'mar',
        },
        {
          num: 0,
          typeInfo: {
            type: 'day_of_week',
            case: 'upper',
            format: 'long',
          } as TypeInfo,
          expected: 'SUNDAY',
        },
        {
          num: 255,
          typeInfo: { type: 'hexadecimal', case: 'upper' } as TypeInfo,
          expected: 'FF',
        },
        {
          num: 9,
          typeInfo: { type: 'roman', case: 'lower' } as TypeInfo,
          expected: 'ix',
        },
        {
          num: 2,
          typeInfo: {
            type: 'english_ordinal_abbr',
            case: 'sentence',
          } as TypeInfo,
          expected: '2nd',
        },
        {
          num: 42,
          typeInfo: { type: 'english_words', case: 'title' } as TypeInfo,
          expected: 'Forty-Two',
        },
        {
          num: 33,
          typeInfo: { type: 'french_words', case: 'upper' } as TypeInfo,
          expected: 'TRENTE-TROIS',
        },
        {
          num: 5,
          typeInfo: { type: 'astrological_sign', case: 'sentence' } as TypeInfo,
          expected: 'Leo',
        },
        {
          num: 7,
          typeInfo: { type: 'nato_phonetic', case: 'lower' } as TypeInfo,
          expected: 'golf',
        },
      ]

      testData.forEach(({ num, typeInfo, expected }) => {
        const result = convertTo(num, typeInfo)
        expect(result).toBe(expected)

        // And test round-trip
        const backToNum = convertFrom(result, typeInfo)
        expect(backToNum).toBe(num)
      })
    })
  })

  describe('Digits property for zero-padding', () => {
    test('should handle zero-padding for decimal numbers', () => {
      expect(convertTo(123, { type: 'decimal', digits: 5 })).toBe('00123')
      expect(convertTo(12, { type: 'decimal', digits: 4 })).toBe('0012')
      expect(convertTo(7, { type: 'decimal', digits: 3 })).toBe('007')
      expect(convertTo(0, { type: 'decimal', digits: 3 })).toBe('000')
    })

    test('should NOT pad decimal numbers when digits is 0', () => {
      expect(convertTo(123, { type: 'decimal', digits: 0 })).toBe('123')
      expect(convertTo(1, { type: 'decimal', digits: 0 })).toBe('1')
    })

    test('should NOT pad decimal numbers when digits is undefined', () => {
      expect(convertTo(123, { type: 'decimal' })).toBe('123')
      expect(convertTo(1, { type: 'decimal' })).toBe('1')
    })

    test('should pad negative decimal numbers', () => {
      expect(convertTo(-12, { type: 'decimal', digits: 4 })).toBe('-0012')
      expect(convertTo(-123, { type: 'decimal', digits: 5 })).toBe('-00123')
      expect(convertTo(-7, { type: 'decimal', digits: 3 })).toBe('-007')
    })

    test('should NOT pad float decimal numbers', () => {
      expect(convertTo(3.14, { type: 'decimal', digits: 5 })).toBe('3.14')
      expect(convertTo(12.5, { type: 'decimal', digits: 4 })).toBe('12.5')
    })

    test('should handle zero-padding for hexadecimal numbers', () => {
      expect(convertTo(0x2a, { type: 'hexadecimal', digits: 4 })).toBe('002a')
      expect(
        convertTo(0x2a, { type: 'hexadecimal', digits: 4, case: 'upper' })
      ).toBe('002A')
      expect(convertTo(0xff, { type: 'hexadecimal', digits: 4 })).toBe('00ff')
    })

    test('should handle zero-padding for hexadecimal with prefixes', () => {
      expect(
        convertTo(0x2a, { type: 'hexadecimal', digits: 4, prefix: 'lower' })
      ).toBe('0x002a')
      expect(
        convertTo(0x2a, { type: 'hexadecimal', digits: 4, prefix: 'upper' })
      ).toBe('0X002a')
      expect(
        convertTo(0x2a, {
          type: 'hexadecimal',
          digits: 4,
          prefix: 'lower',
          case: 'upper',
        })
      ).toBe('0x002A')
      expect(
        convertTo(0x2a, {
          type: 'hexadecimal',
          digits: 4,
          prefix: 'upper',
          case: 'upper',
        })
      ).toBe('0X002A')
    })

    test('should handle zero-padding for binary numbers', () => {
      expect(convertTo(5, { type: 'binary', digits: 5 })).toBe('00101')
      expect(convertTo(10, { type: 'binary', digits: 6 })).toBe('001010')
    })

    test('should handle zero-padding for binary with prefixes', () => {
      expect(convertTo(5, { type: 'binary', digits: 5, prefix: 'lower' })).toBe(
        '0b00101'
      )
      expect(convertTo(5, { type: 'binary', digits: 5, prefix: 'upper' })).toBe(
        '0B00101'
      )
    })

    test('should handle zero-padding for octal numbers', () => {
      expect(convertTo(0o123, { type: 'octal', digits: 5 })).toBe('00123')
      expect(convertTo(0o77, { type: 'octal', digits: 4 })).toBe('0077')
    })

    test('should handle zero-padding for octal with prefixes', () => {
      expect(
        convertTo(0o123, { type: 'octal', digits: 5, prefix: 'lower' })
      ).toBe('0o00123')
      expect(
        convertTo(0o123, { type: 'octal', digits: 5, prefix: 'upper' })
      ).toBe('0O00123')
    })

    test('should pad negative numbers for base types', () => {
      expect(convertTo(-12, { type: 'hexadecimal', digits: 4 })).toBe('-000c')
      expect(convertTo(-5, { type: 'binary', digits: 5 })).toBe('-00101')
      expect(convertTo(-8, { type: 'octal', digits: 4 })).toBe('-0010')
    })

    test('should pad negative numbers for base types with prefixes', () => {
      expect(
        convertTo(-12, { type: 'hexadecimal', digits: 4, prefix: 'lower' })
      ).toBe('-0x000c')
      expect(
        convertTo(-12, { type: 'hexadecimal', digits: 4, prefix: 'upper' })
      ).toBe('-0X000c')
      expect(
        convertTo(-5, { type: 'binary', digits: 5, prefix: 'lower' })
      ).toBe('-0b00101')
      expect(
        convertTo(-5, { type: 'binary', digits: 5, prefix: 'upper' })
      ).toBe('-0B00101')
      expect(convertTo(-8, { type: 'octal', digits: 4, prefix: 'lower' })).toBe(
        '-0o0010'
      )
      expect(convertTo(-8, { type: 'octal', digits: 4, prefix: 'upper' })).toBe(
        '-0O0010'
      )
    })

    test('should pad negative hexadecimal with case and prefix', () => {
      expect(
        convertTo(-171, {
          type: 'hexadecimal',
          digits: 4,
          prefix: 'lower',
          case: 'upper',
        })
      ).toBe('-0x00AB')
      expect(
        convertTo(-171, {
          type: 'hexadecimal',
          digits: 4,
          prefix: 'upper',
          case: 'lower',
        })
      ).toBe('-0X00ab')
      expect(
        convertTo(-255, { type: 'hexadecimal', digits: 4, case: 'upper' })
      ).toBe('-00FF')
      expect(
        convertTo(-255, { type: 'hexadecimal', digits: 4, case: 'lower' })
      ).toBe('-00ff')
    })

    test('should NOT pad float numbers for base types', () => {
      // Base conversion functions (hex, binary, octal) don't support floats
      expect(() => convertTo(12.5, { type: 'hexadecimal', digits: 4 })).toThrow(
        'Input must be an integer'
      )
      expect(() => convertTo(12.5, { type: 'binary', digits: 5 })).toThrow(
        'Input must be an integer'
      )
      expect(() => convertTo(12.5, { type: 'octal', digits: 4 })).toThrow(
        'Input must be an integer'
      )
    })

    test('should work with round-trip conversions for zero-padded numbers', () => {
      const testCases = [
        {
          input: '00123',
          typeInfo: { type: 'decimal', digits: 5 } as TypeInfo,
        },
        {
          input: '0x012a',
          typeInfo: {
            type: 'hexadecimal',
            digits: 4,
            prefix: 'lower',
            case: 'lower',
          } as TypeInfo,
        },
        {
          input: '0X012A',
          typeInfo: {
            type: 'hexadecimal',
            digits: 4,
            prefix: 'upper',
            case: 'upper',
          } as TypeInfo,
        },
        {
          input: '0b00101',
          typeInfo: { type: 'binary', digits: 5, prefix: 'lower' } as TypeInfo,
        },
        {
          input: '0B00101',
          typeInfo: { type: 'binary', digits: 5, prefix: 'upper' } as TypeInfo,
        },
        {
          input: '0o00123',
          typeInfo: { type: 'octal', digits: 5, prefix: 'lower' } as TypeInfo,
        },
        {
          input: '0O00123',
          typeInfo: { type: 'octal', digits: 5, prefix: 'upper' } as TypeInfo,
        },
      ]

      testCases.forEach(({ input, typeInfo }) => {
        const num = convertFrom(input, typeInfo)
        const result = convertTo(num, typeInfo)
        expect(result).toBe(input)
      })
    })

    test('should work with round-trip conversions for negative zero-padded numbers', () => {
      const negativeTestCases = [
        {
          input: '-00123',
          typeInfo: { type: 'decimal', digits: 5 } as TypeInfo,
        },
        {
          input: '-0x012a',
          typeInfo: {
            type: 'hexadecimal',
            digits: 4,
            prefix: 'lower',
            case: 'lower',
          } as TypeInfo,
        },
        {
          input: '-0X012A',
          typeInfo: {
            type: 'hexadecimal',
            digits: 4,
            prefix: 'upper',
            case: 'upper',
          } as TypeInfo,
        },
        {
          input: '-0b00101',
          typeInfo: { type: 'binary', digits: 5, prefix: 'lower' } as TypeInfo,
        },
        {
          input: '-0B00101',
          typeInfo: { type: 'binary', digits: 5, prefix: 'upper' } as TypeInfo,
        },
        {
          input: '-0o00123',
          typeInfo: { type: 'octal', digits: 5, prefix: 'lower' } as TypeInfo,
        },
        {
          input: '-0O00123',
          typeInfo: { type: 'octal', digits: 5, prefix: 'upper' } as TypeInfo,
        },
        {
          input: '-00FF',
          typeInfo: {
            type: 'hexadecimal',
            digits: 4,
            prefix: false,
            case: 'upper',
          } as TypeInfo,
        },
      ]

      negativeTestCases.forEach(({ input, typeInfo }) => {
        const num = convertFrom(input, typeInfo)
        const result = convertTo(num, typeInfo)
        expect(result).toBe(input)
      })
    })
  })

  describe('Error handling with TypeInfo', () => {
    test('should throw meaningful errors', () => {
      expect(() =>
        convertFrom('invalid', { type: 'roman', case: 'upper' })
      ).toThrow('Failed to convert "invalid" from type "roman"')

      expect(() => convertTo(0, { type: 'roman', case: 'lower' })).toThrow(
        'Failed to convert 0 to type "roman"'
      )

      expect(() => convertTo(123, { type: 'invalid' })).toThrow(
        'Cannot convert to invalid type'
      )
    })
  })

  describe('Chinese zhst functionality', () => {
    describe('convertFrom with Chinese types', () => {
      test('should convert Simplified Chinese as-is', () => {
        expect(convertFrom('一万', typeInfo('chinese_words'))).toBe(10000)
        expect(convertFrom('贰拾叁', typeInfo('chinese_financial'))).toBe(23)
        expect(convertFrom('惊蛰', typeInfo('chinese_solar_term'))).toBe(3)
      })

      test('should convert Traditional Chinese to Simplified first', () => {
        expect(convertFrom('一萬', typeInfo('chinese_words'))).toBe(10000)
        expect(convertFrom('貳拾叄', typeInfo('chinese_financial'))).toBe(23)
        expect(convertFrom('驚蟄', typeInfo('chinese_solar_term'))).toBe(3)
      })

      test('should handle ambiguous Chinese text', () => {
        expect(convertFrom('一百二十三', typeInfo('chinese_words'))).toBe(123)
        expect(convertFrom('壹佰贰拾叁', typeInfo('chinese_financial'))).toBe(
          123
        )
        expect(convertFrom('立春', typeInfo('chinese_solar_term'))).toBe(1)
      })

      test('should NOT convert for non-zhst Chinese types', () => {
        expect(convertFrom('甲', typeInfo('chinese_heavenly_stem'))).toBe(1)
        expect(convertFrom('子', typeInfo('chinese_earthly_branch'))).toBe(1)
      })
    })

    describe('convertTo with Chinese zhst property', () => {
      test('should output Simplified Chinese by default', () => {
        expect(convertTo(10000, typeInfo('chinese_words'))).toBe('一万')
        expect(convertTo(23, typeInfo('chinese_financial'))).toBe('贰拾叁')
        expect(convertTo(3, typeInfo('chinese_solar_term'))).toBe('惊蛰')
      })

      test('should output Simplified Chinese when zhst is 0', () => {
        expect(
          convertTo(
            10000,
            typeInfo('chinese_words', undefined, undefined, undefined, 0)
          )
        ).toBe('一万')
        expect(
          convertTo(
            23,
            typeInfo('chinese_financial', undefined, undefined, undefined, 0)
          )
        ).toBe('贰拾叁')
        expect(
          convertTo(
            3,
            typeInfo('chinese_solar_term', undefined, undefined, undefined, 0)
          )
        ).toBe('惊蛰')
      })

      test('should output Traditional Chinese when zhst is 1', () => {
        expect(
          convertTo(
            10000,
            typeInfo('chinese_words', undefined, undefined, undefined, 1)
          )
        ).toBe('一萬')
        expect(
          convertTo(
            23,
            typeInfo('chinese_financial', undefined, undefined, undefined, 1)
          )
        ).toBe('貳拾叄')
        expect(
          convertTo(
            3,
            typeInfo('chinese_solar_term', undefined, undefined, undefined, 1)
          )
        ).toBe('驚蟄')
      })

      test('should output Simplified Chinese when zhst is 2 (ambiguous)', () => {
        expect(
          convertTo(
            123,
            typeInfo('chinese_words', undefined, undefined, undefined, 2)
          )
        ).toBe('一百二十三')
        expect(
          convertTo(
            123,
            typeInfo('chinese_financial', undefined, undefined, undefined, 2)
          )
        ).toBe('壹佰贰拾叁')
        expect(
          convertTo(
            1,
            typeInfo('chinese_solar_term', undefined, undefined, undefined, 2)
          )
        ).toBe('立春')
      })

      test('should NOT apply zhst conversion for non-zhst Chinese types', () => {
        expect(convertTo(1, typeInfo('chinese_heavenly_stem'))).toBe('甲')
        expect(convertTo(1, typeInfo('chinese_earthly_branch'))).toBe('子')
      })
    })

    describe('Round-trip conversions with Chinese zhst', () => {
      test('should work for Simplified Chinese', () => {
        const testCases = [
          { value: 10000, type: 'chinese_words' as NumType, expected: '一万' },
          {
            value: 23,
            type: 'chinese_financial' as NumType,
            expected: '贰拾叁',
          },
          { value: 3, type: 'chinese_solar_term' as NumType, expected: '惊蛰' },
        ]

        testCases.forEach(({ value, type, expected }) => {
          const typeInfoObj = typeInfo(type, undefined, undefined, undefined, 0)
          const converted = convertTo(value, typeInfoObj)
          expect(converted).toBe(expected)
          const backToNum = convertFrom(converted, typeInfoObj)
          expect(backToNum).toBe(value)
        })
      })

      test('should work for Traditional Chinese', () => {
        const testCases = [
          { value: 10000, type: 'chinese_words' as NumType, expected: '一萬' },
          {
            value: 23,
            type: 'chinese_financial' as NumType,
            expected: '貳拾叄',
          },
          { value: 3, type: 'chinese_solar_term' as NumType, expected: '驚蟄' },
        ]

        testCases.forEach(({ value, type, expected }) => {
          const typeInfoObj = typeInfo(type, undefined, undefined, undefined, 1)
          const converted = convertTo(value, typeInfoObj)
          expect(converted).toBe(expected)
          const backToNum = convertFrom(converted, typeInfoObj)
          expect(backToNum).toBe(value)
        })
      })

      test('should handle cross-script conversions', () => {
        // Traditional input, Simplified output
        const traditionalInput = '一萬'
        const num = convertFrom(traditionalInput, typeInfo('chinese_words'))
        const simplifiedOutput = convertTo(
          num,
          typeInfo('chinese_words', undefined, undefined, undefined, 0)
        )
        expect(simplifiedOutput).toBe('一万')

        // Simplified input, Traditional output
        const simplifiedInput = '一万'
        const num2 = convertFrom(simplifiedInput, typeInfo('chinese_words'))
        const traditionalOutput = convertTo(
          num2,
          typeInfo('chinese_words', undefined, undefined, undefined, 1)
        )
        expect(traditionalOutput).toBe('一萬')
      })
    })
  })
})
