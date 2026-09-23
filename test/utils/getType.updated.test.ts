import { describe, expect, test } from 'bun:test'
import { getTypes, hasType, typeValidators } from '../../src'
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
  if (caseType !== undefined) {
    info.case = caseType
  }
  if (format !== undefined) {
    info.format = format
  }
  if (prefix !== undefined) {
    info.prefix = prefix
  }
  if (zhst !== undefined) {
    info.zhst = zhst
  }
  if (digits !== undefined) {
    info.digits = digits
  }
  if (ukStyle !== undefined) {
    info.ukStyle = ukStyle
  }
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

  describe('Arabic numerals', () => {
    test('should detect Arabic numerals', () => {
      expect(getTypes('١٢٣')).toContainEqual(typeInfo('arabic'))
      expect(getTypes('٠')).toContainEqual(typeInfo('arabic'))
    })
  })

  describe('UK/US style detection for English words', () => {
    test('should detect US style (ukStyle: 0) for numbers without "and"', () => {
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
    })

    test('should detect UK style (ukStyle: 1) for numbers with "and"', () => {
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
    })

    test('should detect not sure style (ukStyle: 2) for ambiguous numbers', () => {
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
    })

    test('should detect title case with "and" handling', () => {
      // Title case with lowercase "and" (correct format)
      expect(getTypes('One Hundred and Five')).toContainEqual(
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
      expect(getTypes('One Thousand and Five')).toContainEqual(
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

      // Title case with capitalized "And" (acceptable but not preferred)
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
      expect(getTypes('One Thousand And Five')).toContainEqual(
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

      // Mixed case with "and" should not be detected as title case
      expect(getTypes('One hundred and Five')).not.toContainEqual(
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
      expect(getTypes('One Hundred and five')).not.toContainEqual(
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
    })
  })

  describe('UK/US style detection for English ordinal words', () => {
    test('should detect US style (ukStyle: 0) for ordinal words without "and"', () => {
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
    })
  })

  describe('English words and ordinal words type detection', () => {
    test('should detect only english_words for cardinal input with different cases', () => {
      // US style (no "and")
      expect(getTypes('one hundred twenty-three')).toEqual([
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        ),
      ])
      expect(getTypes('One hundred twenty-three')).toEqual([
        typeInfo(
          'english_words',
          'sentence',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        ),
      ])
      expect(getTypes('One Hundred Twenty-Three')).toEqual([
        typeInfo(
          'english_words',
          'title',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        ),
      ])
      expect(getTypes('ONE HUNDRED TWENTY-THREE')).toEqual([
        typeInfo(
          'english_words',
          'upper',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        ),
      ])

      // UK style (with "and")
      expect(getTypes('one hundred and twenty-three')).toEqual([
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        ),
      ])
      expect(getTypes('One hundred and twenty-three')).toEqual([
        typeInfo(
          'english_words',
          'sentence',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        ),
      ])
      expect(getTypes('One Hundred and Twenty-Three')).toEqual([
        typeInfo(
          'english_words',
          'title',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        ),
      ])
      expect(getTypes('One Hundred And Twenty-Three')).toEqual([
        typeInfo(
          'english_words',
          'title',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        ),
      ])
      expect(getTypes('ONE HUNDRED AND TWENTY-THREE')).toEqual([
        typeInfo(
          'english_words',
          'upper',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        ),
      ])
    })

    test('should detect only english_ordinal_words for ordinal input with different cases', () => {
      // US style (no "and")
      expect(getTypes('one hundred twenty-third')).toEqual([
        typeInfo(
          'english_ordinal_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        ),
      ])
      expect(getTypes('One hundred twenty-third')).toEqual([
        typeInfo(
          'english_ordinal_words',
          'sentence',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        ),
      ])
      expect(getTypes('One Hundred Twenty-Third')).toEqual([
        typeInfo(
          'english_ordinal_words',
          'title',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        ),
      ])
      expect(getTypes('ONE HUNDRED TWENTY-THIRD')).toEqual([
        typeInfo(
          'english_ordinal_words',
          'upper',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        ),
      ])

      // UK style (with "and")
      expect(getTypes('one hundred and twenty-third')).toEqual([
        typeInfo(
          'english_ordinal_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        ),
      ])
      expect(getTypes('One hundred and twenty-third')).toEqual([
        typeInfo(
          'english_ordinal_words',
          'sentence',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        ),
      ])
      expect(getTypes('One Hundred and Twenty-Third')).toEqual([
        typeInfo(
          'english_ordinal_words',
          'title',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        ),
      ])
      expect(getTypes('One Hundred And Twenty-Third')).toEqual([
        typeInfo(
          'english_ordinal_words',
          'title',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        ),
      ])
      expect(getTypes('ONE HUNDRED AND TWENTY-THIRD')).toEqual([
        typeInfo(
          'english_ordinal_words',
          'upper',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        ),
      ])
    })

    test('should detect only english_words for cardinal input with wrong hyphenation', () => {
      // US style (no "and") with wrong hyphenation
      expect(getTypes('one hundred-twenty-three')).toEqual([
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        ),
      ])
      expect(getTypes('One hundred-twenty-three')).toEqual([
        typeInfo(
          'english_words',
          'sentence',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        ),
      ])
      expect(getTypes('One Hundred-Twenty-Three')).toEqual([
        typeInfo(
          'english_words',
          'title',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        ),
      ])
      expect(getTypes('ONE HUNDRED-TWENTY-THREE')).toEqual([
        typeInfo(
          'english_words',
          'upper',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        ),
      ])

      // UK style (with "and") with wrong hyphenation
      expect(getTypes('one hundred-and twenty-three')).toEqual([
        typeInfo(
          'english_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        ),
      ])
      expect(getTypes('One hundred-and twenty-three')).toEqual([
        typeInfo(
          'english_words',
          'sentence',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        ),
      ])
      expect(getTypes('One Hundred-and Twenty-Three')).toEqual([
        typeInfo(
          'english_words',
          'title',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        ),
      ])
      expect(getTypes('One Hundred-And Twenty-Three')).toEqual([
        typeInfo(
          'english_words',
          'title',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        ),
      ])
      expect(getTypes('ONE HUNDRED-AND TWENTY-THREE')).toEqual([
        typeInfo(
          'english_words',
          'upper',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        ),
      ])
    })

    test('should detect only english_ordinal_words for ordinal input with wrong hyphenation', () => {
      // US style (no "and") with wrong hyphenation
      expect(getTypes('one hundred-twenty-third')).toEqual([
        typeInfo(
          'english_ordinal_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        ),
      ])
      expect(getTypes('One hundred-twenty-third')).toEqual([
        typeInfo(
          'english_ordinal_words',
          'sentence',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        ),
      ])
      expect(getTypes('One Hundred-Twenty-Third')).toEqual([
        typeInfo(
          'english_ordinal_words',
          'title',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        ),
      ])
      expect(getTypes('ONE HUNDRED-TWENTY-THIRD')).toEqual([
        typeInfo(
          'english_ordinal_words',
          'upper',
          undefined,
          undefined,
          undefined,
          undefined,
          0
        ),
      ])

      // UK style (with "and") with wrong hyphenation
      expect(getTypes('one hundred-and twenty-third')).toEqual([
        typeInfo(
          'english_ordinal_words',
          'lower',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        ),
      ])
      expect(getTypes('One hundred-and twenty-third')).toEqual([
        typeInfo(
          'english_ordinal_words',
          'sentence',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        ),
      ])
      expect(getTypes('One Hundred-and Twenty-Third')).toEqual([
        typeInfo(
          'english_ordinal_words',
          'title',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        ),
      ])
      expect(getTypes('One Hundred-And Twenty-Third')).toEqual([
        typeInfo(
          'english_ordinal_words',
          'title',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        ),
      ])
      expect(getTypes('ONE HUNDRED-AND TWENTY-THIRD')).toEqual([
        typeInfo(
          'english_ordinal_words',
          'upper',
          undefined,
          undefined,
          undefined,
          undefined,
          1
        ),
      ])
    })

    test('should not detect ordinal for cardinal input', () => {
      const cardinalInputs = [
        'one hundred twenty-three',
        'One hundred twenty-three',
        'One Hundred Twenty-Three',
        'ONE HUNDRED TWENTY-THREE',
        'one hundred and twenty-three',
        'One hundred and twenty-three',
        'One Hundred and Twenty-Three',
        'One Hundred And Twenty-Three',
        'ONE HUNDRED AND TWENTY-THREE',
      ]

      cardinalInputs.forEach((input) => {
        const types = getTypes(input).map((t) => t.type)
        expect(types).not.toContain('english_ordinal_words')
      })
    })

    test('should not detect cardinal for ordinal input', () => {
      const ordinalInputs = [
        'one hundred twenty-third',
        'One hundred twenty-third',
        'One Hundred Twenty-Third',
        'ONE HUNDRED TWENTY-THIRD',
        'one hundred and twenty-third',
        'One hundred and twenty-third',
        'One Hundred and Twenty-Third',
        'One Hundred And Twenty-Third',
        'ONE HUNDRED AND TWENTY-THIRD',
      ]

      ordinalInputs.forEach((input) => {
        const types = getTypes(input).map((t) => t.type)
        expect(types).not.toContain('english_words')
      })
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

describe('typeValidators', () => {
  describe('decimal', () => {
    test('should validate decimal numbers', () => {
      expect(typeValidators.decimal('123')).toBe(true)
      expect(typeValidators.decimal('-45.67')).toBe(true)
      expect(typeValidators.decimal('0')).toBe(true)
      expect(typeValidators.decimal('123.456')).toBe(true)
    })

    test('should reject non-decimal strings', () => {
      expect(typeValidators.decimal('abc')).toBe(false)
      expect(typeValidators.decimal('12a')).toBe(false)
      expect(typeValidators.decimal('')).toBe(false)
      expect(typeValidators.decimal('0x123')).toBe(false)
      expect(typeValidators.decimal('0b1010')).toBe(false)
      expect(typeValidators.decimal('0o123')).toBe(false)
    })
  })

  describe('binary', () => {
    test('should validate binary numbers', () => {
      expect(typeValidators.binary('1010')).toBe(true)
      expect(typeValidators.binary('0b1010')).toBe(true)
      expect(typeValidators.binary('0B1010')).toBe(true)
      expect(typeValidators.binary('-1010')).toBe(true)
      expect(typeValidators.binary('-0b1010')).toBe(true)
    })

    test('should reject non-binary strings', () => {
      expect(typeValidators.binary('1020')).toBe(false)
      expect(typeValidators.binary('abc')).toBe(false)
      expect(typeValidators.binary('0x1010')).toBe(false)
      expect(typeValidators.binary('0o123')).toBe(false)
    })
  })

  describe('octal', () => {
    test('should validate octal numbers', () => {
      expect(typeValidators.octal('123')).toBe(true)
      expect(typeValidators.octal('0o123')).toBe(true)
      expect(typeValidators.octal('0O123')).toBe(true)
      expect(typeValidators.octal('-123')).toBe(true)
      expect(typeValidators.octal('-0o123')).toBe(true)
    })

    test('should reject non-octal strings', () => {
      expect(typeValidators.octal('189')).toBe(false)
      expect(typeValidators.octal('abc')).toBe(false)
      expect(typeValidators.octal('0x123')).toBe(false)
      expect(typeValidators.octal('0b1010')).toBe(false)
    })
  })

  describe('hexadecimal', () => {
    test('should validate hexadecimal numbers', () => {
      expect(typeValidators.hexadecimal('123')).toBe(true)
      expect(typeValidators.hexadecimal('0x123')).toBe(true)
      expect(typeValidators.hexadecimal('0X123')).toBe(true)
      expect(typeValidators.hexadecimal('ABC')).toBe(true)
      expect(typeValidators.hexadecimal('abc')).toBe(true)
      expect(typeValidators.hexadecimal('-123')).toBe(true)
      expect(typeValidators.hexadecimal('-0x123')).toBe(true)
    })

    test('should reject non-hexadecimal strings', () => {
      expect(typeValidators.hexadecimal('GHI')).toBe(false)
      expect(typeValidators.hexadecimal('abcg')).toBe(false)
      expect(typeValidators.hexadecimal('0b123')).toBe(false)
      expect(typeValidators.hexadecimal('0o123')).toBe(false)
    })
  })

  describe('roman', () => {
    test('should validate Roman numerals', () => {
      expect(typeValidators.roman('I')).toBe(true)
      expect(typeValidators.roman('IV')).toBe(true)
      expect(typeValidators.roman('X')).toBe(true)
      expect(typeValidators.roman('MCDXL')).toBe(true)
      expect(typeValidators.roman('MMXXIII')).toBe(true)
    })

    test('should reject invalid Roman numerals', () => {
      expect(typeValidators.roman('IIII')).toBe(false)
      expect(typeValidators.roman('VV')).toBe(false)
      expect(typeValidators.roman('LL')).toBe(false)
      expect(typeValidators.roman('DD')).toBe(false)
      expect(typeValidators.roman('invalid')).toBe(false)
    })
  })

  describe('arabic', () => {
    test('should validate Arabic numerals', () => {
      expect(typeValidators.arabic('١٢٣')).toBe(true)
      expect(typeValidators.arabic('٠')).toBe(true)
      expect(typeValidators.arabic('٤٥٦')).toBe(true)
    })

    test('should reject non-Arabic strings', () => {
      expect(typeValidators.arabic('123')).toBe(false)
      expect(typeValidators.arabic('abc')).toBe(false)
      expect(typeValidators.arabic('')).toBe(false)
    })
  })

  describe('english_ordinal_abbr', () => {
    test('should validate English ordinal abbreviations', () => {
      expect(typeValidators.english_ordinal_abbr('1st')).toBe(true)
      expect(typeValidators.english_ordinal_abbr('2nd')).toBe(true)
      expect(typeValidators.english_ordinal_abbr('3rd')).toBe(true)
      expect(typeValidators.english_ordinal_abbr('4th')).toBe(true)
      expect(typeValidators.english_ordinal_abbr('21st')).toBe(true)
      expect(typeValidators.english_ordinal_abbr('22nd')).toBe(true)
      expect(typeValidators.english_ordinal_abbr('23rd')).toBe(true)
      expect(typeValidators.english_ordinal_abbr('24th')).toBe(true)
    })

    test('should reject invalid ordinal abbreviations', () => {
      expect(typeValidators.english_ordinal_abbr('1th')).toBe(false)
      expect(typeValidators.english_ordinal_abbr('2st')).toBe(false)
      expect(typeValidators.english_ordinal_abbr('3nd')).toBe(false)
      expect(typeValidators.english_ordinal_abbr('invalid')).toBe(false)
    })
  })

  describe('french_ordinal_abbr', () => {
    test('should validate French ordinal abbreviations', () => {
      // French ordinal abbreviations only accept the modern format with 'e' suffix
      expect(typeValidators.french_ordinal_abbr('1e')).toBe(true)
      expect(typeValidators.french_ordinal_abbr('2e')).toBe(true)
      expect(typeValidators.french_ordinal_abbr('3e')).toBe(true)
      expect(typeValidators.french_ordinal_abbr('21e')).toBe(true)
      expect(typeValidators.french_ordinal_abbr('22e')).toBe(true)
    })

    test('should accept the official abbreviations of premier (1er/1re)', () => {
      // "1er"/"1re" are the official abbreviations of premier/première
      expect(typeValidators.french_ordinal_abbr('1er')).toBe(true)
      expect(typeValidators.french_ordinal_abbr('1re')).toBe(true)
    })

    test('should reject invalid French ordinal abbreviations', () => {
      expect(typeValidators.french_ordinal_abbr('2er')).toBe(false)
      expect(typeValidators.french_ordinal_abbr('invalid')).toBe(false)
    })
  })

  describe('english_ordinal_words', () => {
    test('should validate English ordinal words', () => {
      expect(typeValidators.english_ordinal_words('first')).toBe(true)
      expect(typeValidators.english_ordinal_words('second')).toBe(true)
      expect(typeValidators.english_ordinal_words('third')).toBe(true)
      expect(typeValidators.english_ordinal_words('fourth')).toBe(true)
      expect(typeValidators.english_ordinal_words('twenty-first')).toBe(true)
      expect(
        typeValidators.english_ordinal_words('one hundred twenty-third')
      ).toBe(true)
    })

    test('should reject non-ordinal words', () => {
      expect(typeValidators.english_ordinal_words('one')).toBe(false)
      expect(typeValidators.english_ordinal_words('twenty-one')).toBe(false)
      expect(typeValidators.english_ordinal_words('invalid')).toBe(false)
    })
  })

  describe('french_ordinal_words', () => {
    test('should validate French ordinal words', () => {
      expect(typeValidators.french_ordinal_words('premier')).toBe(true)
      expect(typeValidators.french_ordinal_words('deuxième')).toBe(true)
      expect(typeValidators.french_ordinal_words('troisième')).toBe(true)
      expect(typeValidators.french_ordinal_words('vingt-et-unième')).toBe(true)
    })

    test('should reject non-ordinal words', () => {
      expect(typeValidators.french_ordinal_words('un')).toBe(false)
      expect(typeValidators.french_ordinal_words('vingt-et-un')).toBe(false)
      expect(typeValidators.french_ordinal_words('invalid')).toBe(false)
    })
  })

  describe('chinese_heavenly_stem', () => {
    test('should validate Chinese heavenly stems', () => {
      expect(typeValidators.chinese_heavenly_stem('甲')).toBe(true)
      expect(typeValidators.chinese_heavenly_stem('乙')).toBe(true)
      expect(typeValidators.chinese_heavenly_stem('丙')).toBe(true)
      expect(typeValidators.chinese_heavenly_stem('丁')).toBe(true)
      expect(typeValidators.chinese_heavenly_stem('戊')).toBe(true)
      expect(typeValidators.chinese_heavenly_stem('己')).toBe(true)
      expect(typeValidators.chinese_heavenly_stem('庚')).toBe(true)
      expect(typeValidators.chinese_heavenly_stem('辛')).toBe(true)
      expect(typeValidators.chinese_heavenly_stem('壬')).toBe(true)
      expect(typeValidators.chinese_heavenly_stem('癸')).toBe(true)
    })

    test('should reject invalid heavenly stems', () => {
      expect(typeValidators.chinese_heavenly_stem('子')).toBe(false)
      expect(typeValidators.chinese_heavenly_stem('一')).toBe(false)
      expect(typeValidators.chinese_heavenly_stem('invalid')).toBe(false)
    })
  })

  describe('chinese_earthly_branch', () => {
    test('should validate Chinese earthly branches', () => {
      expect(typeValidators.chinese_earthly_branch('子')).toBe(true)
      expect(typeValidators.chinese_earthly_branch('丑')).toBe(true)
      expect(typeValidators.chinese_earthly_branch('寅')).toBe(true)
      expect(typeValidators.chinese_earthly_branch('卯')).toBe(true)
      expect(typeValidators.chinese_earthly_branch('辰')).toBe(true)
      expect(typeValidators.chinese_earthly_branch('巳')).toBe(true)
      expect(typeValidators.chinese_earthly_branch('午')).toBe(true)
      expect(typeValidators.chinese_earthly_branch('未')).toBe(true)
      expect(typeValidators.chinese_earthly_branch('申')).toBe(true)
      expect(typeValidators.chinese_earthly_branch('酉')).toBe(true)
      expect(typeValidators.chinese_earthly_branch('戌')).toBe(true)
      expect(typeValidators.chinese_earthly_branch('亥')).toBe(true)
    })

    test('should reject invalid earthly branches', () => {
      expect(typeValidators.chinese_earthly_branch('甲')).toBe(false)
      expect(typeValidators.chinese_earthly_branch('一')).toBe(false)
      expect(typeValidators.chinese_earthly_branch('invalid')).toBe(false)
    })
  })

  describe('chinese_solar_term', () => {
    test('should validate Chinese solar terms', () => {
      expect(typeValidators.chinese_solar_term('立春')).toBe(true)
      expect(typeValidators.chinese_solar_term('雨水')).toBe(true)
      expect(typeValidators.chinese_solar_term('惊蛰')).toBe(true)
      expect(typeValidators.chinese_solar_term('春分')).toBe(true)
      expect(typeValidators.chinese_solar_term('清明')).toBe(true)
      expect(typeValidators.chinese_solar_term('谷雨')).toBe(true)
      expect(typeValidators.chinese_solar_term('立夏')).toBe(true)
      expect(typeValidators.chinese_solar_term('小满')).toBe(true)
      expect(typeValidators.chinese_solar_term('芒种')).toBe(true)
      expect(typeValidators.chinese_solar_term('夏至')).toBe(true)
      expect(typeValidators.chinese_solar_term('小暑')).toBe(true)
      expect(typeValidators.chinese_solar_term('大暑')).toBe(true)
      expect(typeValidators.chinese_solar_term('立秋')).toBe(true)
      expect(typeValidators.chinese_solar_term('处暑')).toBe(true)
      expect(typeValidators.chinese_solar_term('白露')).toBe(true)
      expect(typeValidators.chinese_solar_term('秋分')).toBe(true)
      expect(typeValidators.chinese_solar_term('寒露')).toBe(true)
      expect(typeValidators.chinese_solar_term('霜降')).toBe(true)
      expect(typeValidators.chinese_solar_term('立冬')).toBe(true)
      expect(typeValidators.chinese_solar_term('小雪')).toBe(true)
      expect(typeValidators.chinese_solar_term('大雪')).toBe(true)
      expect(typeValidators.chinese_solar_term('冬至')).toBe(true)
      expect(typeValidators.chinese_solar_term('小寒')).toBe(true)
      expect(typeValidators.chinese_solar_term('大寒')).toBe(true)
    })

    test('should reject invalid solar terms', () => {
      expect(typeValidators.chinese_solar_term('甲')).toBe(false)
      expect(typeValidators.chinese_solar_term('子')).toBe(false)
      expect(typeValidators.chinese_solar_term('一')).toBe(false)
      expect(typeValidators.chinese_solar_term('invalid')).toBe(false)
    })
  })

  describe('astrological_sign', () => {
    test('should validate astrological signs', () => {
      expect(typeValidators.astrological_sign('Aries')).toBe(true)
      expect(typeValidators.astrological_sign('Taurus')).toBe(true)
      expect(typeValidators.astrological_sign('Gemini')).toBe(true)
      expect(typeValidators.astrological_sign('Cancer')).toBe(true)
      expect(typeValidators.astrological_sign('Leo')).toBe(true)
      expect(typeValidators.astrological_sign('Virgo')).toBe(true)
      expect(typeValidators.astrological_sign('Libra')).toBe(true)
      expect(typeValidators.astrological_sign('Scorpio')).toBe(true)
      expect(typeValidators.astrological_sign('Sagittarius')).toBe(true)
      expect(typeValidators.astrological_sign('Capricorn')).toBe(true)
      expect(typeValidators.astrological_sign('Aquarius')).toBe(true)
      expect(typeValidators.astrological_sign('Pisces')).toBe(true)
    })

    test('should reject invalid astrological signs', () => {
      expect(typeValidators.astrological_sign('Invalid')).toBe(false)
      expect(typeValidators.astrological_sign('Arieses')).toBe(false)
      expect(typeValidators.astrological_sign('')).toBe(false)
    })
  })

  describe('nato_phonetic', () => {
    test('should validate NATO phonetic alphabet', () => {
      expect(typeValidators.nato_phonetic('Alfa')).toBe(true)
      expect(typeValidators.nato_phonetic('Bravo')).toBe(true)
      expect(typeValidators.nato_phonetic('Charlie')).toBe(true)
      expect(typeValidators.nato_phonetic('Delta')).toBe(true)
      expect(typeValidators.nato_phonetic('Echo')).toBe(true)
      expect(typeValidators.nato_phonetic('Foxtrot')).toBe(true)
      expect(typeValidators.nato_phonetic('Golf')).toBe(true)
      expect(typeValidators.nato_phonetic('Hotel')).toBe(true)
      expect(typeValidators.nato_phonetic('India')).toBe(true)
      expect(typeValidators.nato_phonetic('Juliett')).toBe(true)
      expect(typeValidators.nato_phonetic('Kilo')).toBe(true)
      expect(typeValidators.nato_phonetic('Lima')).toBe(true)
      expect(typeValidators.nato_phonetic('Mike')).toBe(true)
      expect(typeValidators.nato_phonetic('November')).toBe(true)
      expect(typeValidators.nato_phonetic('Oscar')).toBe(true)
      expect(typeValidators.nato_phonetic('Papa')).toBe(true)
      expect(typeValidators.nato_phonetic('Quebec')).toBe(true)
      expect(typeValidators.nato_phonetic('Romeo')).toBe(true)
      expect(typeValidators.nato_phonetic('Sierra')).toBe(true)
      expect(typeValidators.nato_phonetic('Tango')).toBe(true)
      expect(typeValidators.nato_phonetic('Uniform')).toBe(true)
      expect(typeValidators.nato_phonetic('Victor')).toBe(true)
      expect(typeValidators.nato_phonetic('Whiskey')).toBe(true)
      expect(typeValidators.nato_phonetic('X-ray')).toBe(true)
      expect(typeValidators.nato_phonetic('Yankee')).toBe(true)
      expect(typeValidators.nato_phonetic('Zulu')).toBe(true)
    })

    test('should reject invalid NATO phonetic words', () => {
      expect(typeValidators.nato_phonetic('Invalid')).toBe(false)
      expect(typeValidators.nato_phonetic('Alfaa')).toBe(false)
      expect(typeValidators.nato_phonetic('')).toBe(false)
    })
  })

  describe('month_name', () => {
    test('should validate month names', () => {
      expect(typeValidators.month_name('January')).toBe(true)
      expect(typeValidators.month_name('February')).toBe(true)
      expect(typeValidators.month_name('March')).toBe(true)
      expect(typeValidators.month_name('April')).toBe(true)
      expect(typeValidators.month_name('May')).toBe(true)
      expect(typeValidators.month_name('June')).toBe(true)
      expect(typeValidators.month_name('July')).toBe(true)
      expect(typeValidators.month_name('August')).toBe(true)
      expect(typeValidators.month_name('September')).toBe(true)
      expect(typeValidators.month_name('October')).toBe(true)
      expect(typeValidators.month_name('November')).toBe(true)
      expect(typeValidators.month_name('December')).toBe(true)
      expect(typeValidators.month_name('Jan')).toBe(true)
      expect(typeValidators.month_name('Feb')).toBe(true)
      expect(typeValidators.month_name('Mar')).toBe(true)
      expect(typeValidators.month_name('Apr')).toBe(true)
      expect(typeValidators.month_name('Jun')).toBe(true)
      expect(typeValidators.month_name('Jul')).toBe(true)
      expect(typeValidators.month_name('Aug')).toBe(true)
      expect(typeValidators.month_name('Sep')).toBe(true)
      expect(typeValidators.month_name('Oct')).toBe(true)
      expect(typeValidators.month_name('Nov')).toBe(true)
      expect(typeValidators.month_name('Dec')).toBe(true)
    })

    test('should reject invalid month names', () => {
      expect(typeValidators.month_name('Invalid')).toBe(false)
      expect(typeValidators.month_name('Janu')).toBe(false)
      expect(typeValidators.month_name('')).toBe(false)
    })
  })

  describe('day_of_week', () => {
    test('should validate day of week names', () => {
      expect(typeValidators.day_of_week('Monday')).toBe(true)
      expect(typeValidators.day_of_week('Tuesday')).toBe(true)
      expect(typeValidators.day_of_week('Wednesday')).toBe(true)
      expect(typeValidators.day_of_week('Thursday')).toBe(true)
      expect(typeValidators.day_of_week('Friday')).toBe(true)
      expect(typeValidators.day_of_week('Saturday')).toBe(true)
      expect(typeValidators.day_of_week('Sunday')).toBe(true)
      expect(typeValidators.day_of_week('Mon')).toBe(true)
      expect(typeValidators.day_of_week('Tue')).toBe(true)
      expect(typeValidators.day_of_week('Wed')).toBe(true)
      expect(typeValidators.day_of_week('Thu')).toBe(true)
      expect(typeValidators.day_of_week('Fri')).toBe(true)
      expect(typeValidators.day_of_week('Sat')).toBe(true)
      expect(typeValidators.day_of_week('Sun')).toBe(true)
    })

    test('should reject invalid day of week names', () => {
      expect(typeValidators.day_of_week('Invalid')).toBe(false)
      expect(typeValidators.day_of_week('Mond')).toBe(false)
      expect(typeValidators.day_of_week('')).toBe(false)
    })
  })

  describe('latin_letter', () => {
    test('should validate Latin letters', () => {
      expect(typeValidators.latin_letter('A')).toBe(true)
      expect(typeValidators.latin_letter('a')).toBe(true)
      expect(typeValidators.latin_letter('Z')).toBe(true)
      expect(typeValidators.latin_letter('z')).toBe(true)
    })

    test('should reject non-Latin letters', () => {
      expect(typeValidators.latin_letter('AB')).toBe(false)
      expect(typeValidators.latin_letter('1')).toBe(false)
      expect(typeValidators.latin_letter('Α')).toBe(false)
      expect(typeValidators.latin_letter('')).toBe(false)
    })
  })

  describe('greek_letter', () => {
    test('should validate Greek letters', () => {
      expect(typeValidators.greek_letter('Α')).toBe(true)
      expect(typeValidators.greek_letter('α')).toBe(true)
      expect(typeValidators.greek_letter('Ω')).toBe(true)
      expect(typeValidators.greek_letter('ω')).toBe(true)
    })

    test('should reject non-Greek letters', () => {
      expect(typeValidators.greek_letter('AB')).toBe(false)
      expect(typeValidators.greek_letter('1')).toBe(false)
      expect(typeValidators.greek_letter('A')).toBe(false)
      expect(typeValidators.greek_letter('')).toBe(false)
    })
  })

  describe('cyrillic_letter', () => {
    test('should validate Cyrillic letters', () => {
      expect(typeValidators.cyrillic_letter('А')).toBe(true)
      expect(typeValidators.cyrillic_letter('а')).toBe(true)
      expect(typeValidators.cyrillic_letter('Я')).toBe(true)
      expect(typeValidators.cyrillic_letter('я')).toBe(true)
      expect(typeValidators.cyrillic_letter('Ё')).toBe(true)
      expect(typeValidators.cyrillic_letter('ё')).toBe(true)
    })

    test('should reject non-Cyrillic letters', () => {
      expect(typeValidators.cyrillic_letter('AB')).toBe(false)
      expect(typeValidators.cyrillic_letter('1')).toBe(false)
      expect(typeValidators.cyrillic_letter('A')).toBe(false)
      expect(typeValidators.cyrillic_letter('')).toBe(false)
    })
  })

  describe('hebrew_letter', () => {
    test('should validate Hebrew letters', () => {
      expect(typeValidators.hebrew_letter('א')).toBe(true)
      expect(typeValidators.hebrew_letter('ב')).toBe(true)
      expect(typeValidators.hebrew_letter('ג')).toBe(true)
      expect(typeValidators.hebrew_letter('ת')).toBe(true)
    })

    test('should reject non-Hebrew letters', () => {
      expect(typeValidators.hebrew_letter('AB')).toBe(false)
      expect(typeValidators.hebrew_letter('1')).toBe(false)
      expect(typeValidators.hebrew_letter('A')).toBe(false)
      expect(typeValidators.hebrew_letter('')).toBe(false)
    })
  })

  describe('greek_letter_english_name', () => {
    test('should validate Greek letter English names', () => {
      expect(typeValidators.greek_letter_english_name('Alpha')).toBe(true)
      expect(typeValidators.greek_letter_english_name('Beta')).toBe(true)
      expect(typeValidators.greek_letter_english_name('Gamma')).toBe(true)
      expect(typeValidators.greek_letter_english_name('Delta')).toBe(true)
      expect(typeValidators.greek_letter_english_name('Epsilon')).toBe(true)
      expect(typeValidators.greek_letter_english_name('Zeta')).toBe(true)
      expect(typeValidators.greek_letter_english_name('Eta')).toBe(true)
      expect(typeValidators.greek_letter_english_name('Theta')).toBe(true)
      expect(typeValidators.greek_letter_english_name('Iota')).toBe(true)
      expect(typeValidators.greek_letter_english_name('Kappa')).toBe(true)
      expect(typeValidators.greek_letter_english_name('Lambda')).toBe(true)
      expect(typeValidators.greek_letter_english_name('Mu')).toBe(true)
      expect(typeValidators.greek_letter_english_name('Nu')).toBe(true)
      expect(typeValidators.greek_letter_english_name('Xi')).toBe(true)
      expect(typeValidators.greek_letter_english_name('Omicron')).toBe(true)
      expect(typeValidators.greek_letter_english_name('Pi')).toBe(true)
      expect(typeValidators.greek_letter_english_name('Rho')).toBe(true)
      expect(typeValidators.greek_letter_english_name('Sigma')).toBe(true)
      expect(typeValidators.greek_letter_english_name('Tau')).toBe(true)
      expect(typeValidators.greek_letter_english_name('Upsilon')).toBe(true)
      expect(typeValidators.greek_letter_english_name('Phi')).toBe(true)
      expect(typeValidators.greek_letter_english_name('Chi')).toBe(true)
      expect(typeValidators.greek_letter_english_name('Psi')).toBe(true)
      expect(typeValidators.greek_letter_english_name('Omega')).toBe(true)
    })

    test('should reject invalid Greek letter English names', () => {
      expect(typeValidators.greek_letter_english_name('Invalid')).toBe(false)
      expect(typeValidators.greek_letter_english_name('Alph')).toBe(false)
      expect(typeValidators.greek_letter_english_name('')).toBe(false)
    })
  })

  describe('special types', () => {
    test('should handle invalid type', () => {
      expect(typeValidators.invalid('any')).toBe(false)
    })

    test('should handle empty type', () => {
      expect(typeValidators.empty('any')).toBe(false)
    })

    test('should handle unknown type', () => {
      expect(typeValidators.unknown('any')).toBe(false)
    })
  })
})
