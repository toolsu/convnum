import { describe, expect, test } from 'bun:test'
import {
  anyToNumber,
  type CaseType,
  convertFrom,
  getTypes,
  hasType,
} from '../../src'

/**
 * Systematic type-detection tests, including the English words case/ukStyle
 * matrix that used to live in the repo-root scratch file t.ts.
 */

describe('English words case + ukStyle detection (from t.ts)', () => {
  const cardinal: [string, 0 | 1, CaseType][] = [
    ['one hundred-twenty-three', 0, 'lower'],
    ['One hundred-twenty-three', 0, 'sentence'],
    ['One Hundred-Twenty-Three', 0, 'title'],
    ['ONE HUNDRED-TWENTY-THREE', 0, 'upper'],
    ['one hundred-and twenty-three', 1, 'lower'],
    ['One hundred-and twenty-three', 1, 'sentence'],
    ['One Hundred-and Twenty-Three', 1, 'title'],
    // "And" capitalized is accepted as title case though not preferred
    ['One Hundred-And Twenty-Three', 1, 'title'],
    ['ONE HUNDRED-AND TWENTY-THREE', 1, 'upper'],
  ]
  for (const [str, ukStyle, caseType] of cardinal) {
    test(`"${str}" -> english_words ukStyle=${ukStyle} case=${caseType}`, () => {
      expect(getTypes(str)).toEqual([
        { type: 'english_words', ukStyle, case: caseType },
      ])
      expect(convertFrom(str, 'english_words')).toBe(123)
    })
  }

  const ordinal: [string, 0 | 1, CaseType][] = [
    ['one hundred-twenty-third', 0, 'lower'],
    ['One hundred-twenty-third', 0, 'sentence'],
    ['One Hundred-Twenty-Third', 0, 'title'],
    ['ONE HUNDRED-TWENTY-THIRD', 0, 'upper'],
    ['one hundred-and twenty-third', 1, 'lower'],
    ['One hundred-and twenty-third', 1, 'sentence'],
    ['One Hundred-and Twenty-Third', 1, 'title'],
    ['One Hundred-And Twenty-Third', 1, 'title'],
    ['ONE HUNDRED-AND TWENTY-THIRD', 1, 'upper'],
  ]
  for (const [str, ukStyle, caseType] of ordinal) {
    test(`"${str}" -> english_ordinal_words ukStyle=${ukStyle} case=${caseType}`, () => {
      expect(getTypes(str)).toEqual([
        { type: 'english_ordinal_words', ukStyle, case: caseType },
      ])
      expect(convertFrom(str, 'english_ordinal_words')).toBe(123)
    })
  }
})

describe('detection precision — regression cases from the 1.0.0 audit', () => {
  test('"twenty thousand" is english_words only (not english_ordinal_words)', () => {
    expect(getTypes('twenty thousand').map((t) => t.type)).toEqual([
      'english_words',
    ])
  })

  test('"fifty million" is detected as english_words', () => {
    expect(getTypes('fifty million').map((t) => t.type)).toContain(
      'english_words'
    )
  })

  test('"-0b101" is binary, never hexadecimal', () => {
    expect(hasType('-0b101', 'hexadecimal')).toBe(false)
    expect(getTypes('-0b0101').map((t) => t.type)).toEqual(['binary'])
  })

  test('"1er"/"1re" detected as french_ordinal_abbr', () => {
    expect(getTypes('1er').map((t) => t.type)).toContain('french_ordinal_abbr')
    expect(getTypes('1re').map((t) => t.type)).toContain('french_ordinal_abbr')
  })

  test('officially-spelled French forms are detected', () => {
    expect(getTypes('deux-cent-mille').map((t) => t.type)).toContain(
      'french_words'
    )
    expect(getTypes('quatre-vingt-mille').map((t) => t.type)).toContain(
      'french_words'
    )
    expect(getTypes('cent-quatre-vingtième').map((t) => t.type)).toContain(
      'french_ordinal_words'
    )
  })

  test('valid ordinals ending in a scale word are still detected', () => {
    expect(getTypes('one thousand fifth').map((t) => t.type)).toContain(
      'english_ordinal_words'
    )
    expect(getTypes('one million fifth').map((t) => t.type)).toContain(
      'english_ordinal_words'
    )
  })
})

describe('anyToNumber across representative inputs of every type', () => {
  const cases: [string, number][] = [
    ['123', 123],
    ['IV', 4],
    ['twenty-one', 21],
    ['first', 1],
    ['1st', 1],
    ['一百二十三', 123],
    ['壹佰', 100],
    ['0xFF', 255],
    ['1010', 1010], // decimal has the highest detection priority
    ['Aries', 1],
    ['Alfa', 1],
    ['١٢٣', 123],
    ['1er', 1],
    ['vingt-et-unième', 21],
    ['甲', 1],
    ['子', 1],
    ['立春', 1],
  ]
  for (const [str, expected] of cases) {
    test(`anyToNumber("${str}") === ${expected}`, () => {
      expect(anyToNumber(str)).toBe(expected)
    })
  }

  test('anyToNumber throws for unrecognizable input', () => {
    expect(() => anyToNumber('!@#$')).toThrow()
    expect(() => anyToNumber('xyzzy plugh')).toThrow()
  })
})
