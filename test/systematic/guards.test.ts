import { describe, expect, test } from 'bun:test'
import {
  convertTo,
  frenchOrdinalWordsToWords,
  frenchWordsToOrdinalWords,
  fromArabicNumerals,
  fromBase,
  fromEnglishOrdinalAbbr,
  fromEnglishWords,
  fromFrenchOrdinalAbbr,
  fromFrenchWords,
  toArabicNumerals,
  toBase,
  toEnglishOrdinalAbbr,
  toEnglishWords,
  toFrenchOrdinalAbbr,
  toFrenchWords,
} from '../../src'

/**
 * Systematic guard / invalid-input / edge-case tests. These pin the error
 * contracts of the 1.0.0 fixes and exercise the guard branches directly.
 */

describe('English guards', () => {
  test('toEnglishWords rejects fractions and out-of-range magnitudes', () => {
    expect(() => toEnglishWords(0.5)).toThrow('integer')
    expect(() => toEnglishWords(-2.5)).toThrow('integer')
    expect(() => toEnglishWords(1e21)).toThrow('range')
    expect(() => toEnglishWords(-1e21)).toThrow('range')
    expect(() => toEnglishWords(Number.NaN)).toThrow('finite')
    expect(() => toEnglishWords(Number.POSITIVE_INFINITY)).toThrow('finite')
  })

  test('fromEnglishWords throws when no number word is present', () => {
    expect(() => fromEnglishWords('and')).toThrow()
    expect(() => fromEnglishWords('and and')).toThrow()
    expect(() => fromEnglishWords('')).toThrow()
    expect(() => fromEnglishWords('   ')).toThrow()
    expect(() => fromEnglishWords('gazillion')).toThrow('Invalid word')
  })

  test('fromEnglishWords normalizes negative zero to 0', () => {
    expect(Object.is(fromEnglishWords('negative zero'), -0)).toBe(false)
    expect(fromEnglishWords('negative zero')).toBe(0)
  })

  test('toEnglishOrdinalAbbr rejects non-integers', () => {
    expect(() => toEnglishOrdinalAbbr(1.5)).toThrow('integer')
    expect(() => toEnglishOrdinalAbbr(Number.NaN)).toThrow('finite')
  })

  test('fromEnglishOrdinalAbbr rejects malformed strings', () => {
    for (const bad of [
      '121abcst',
      '1sst',
      '12 th',
      '+1st',
      '01st',
      '007th',
      '1th',
      '2st',
      '21th',
      '1st1',
      'st',
      '',
    ]) {
      expect(() => fromEnglishOrdinalAbbr(bad)).toThrow()
    }
  })

  test('fromEnglishOrdinalAbbr accepts the canonical forms', () => {
    expect(fromEnglishOrdinalAbbr('1st')).toBe(1)
    expect(fromEnglishOrdinalAbbr('2ND')).toBe(2)
    expect(fromEnglishOrdinalAbbr('-3rd')).toBe(-3)
    expect(fromEnglishOrdinalAbbr('111th')).toBe(111)
  })
})

describe('French guards', () => {
  test('toFrenchWords rejects fractions', () => {
    expect(() => toFrenchWords(1.5)).toThrow('integer')
    expect(() => toFrenchWords(-3.7)).toThrow('integer')
    expect(() => toFrenchWords(Number.NaN)).toThrow('finite')
  })

  test('fromFrenchWords throws on non-number words', () => {
    for (const bad of [
      '',
      'invalide',
      'bonjour',
      'cent-foo',
      'vingt-cinq-cent',
      'septante',
    ]) {
      expect(() => fromFrenchWords(bad)).toThrow()
    }
  })

  test('fromFrenchWords handles whitespace variants (double spaces, tabs)', () => {
    expect(fromFrenchWords('vingt et un')).toBe(21)
    expect(fromFrenchWords('vingt  et  un')).toBe(21)
    expect(fromFrenchWords('vingt\tet\tun')).toBe(21)
    expect(fromFrenchWords('  cent  ')).toBe(100)
  })

  test('toFrenchOrdinalAbbr(1) is 1er; abbr accepts 1er/1re/1ère and Ne', () => {
    expect(toFrenchOrdinalAbbr(1)).toBe('1er')
    expect(toFrenchOrdinalAbbr(-1)).toBe('-1er')
    expect(toFrenchOrdinalAbbr(2)).toBe('2e')
    expect(fromFrenchOrdinalAbbr('1er')).toBe(1)
    expect(fromFrenchOrdinalAbbr('1re')).toBe(1)
    expect(fromFrenchOrdinalAbbr('1ère')).toBe(1)
    expect(fromFrenchOrdinalAbbr('2e')).toBe(2)
    expect(fromFrenchOrdinalAbbr('2ème')).toBe(2)
    expect(fromFrenchOrdinalAbbr('21e')).toBe(21)
  })

  test('toFrenchOrdinalAbbr rejects non-integers; fromFrenchOrdinalAbbr rejects malformed', () => {
    expect(() => toFrenchOrdinalAbbr(1.5)).toThrow('integer')
    for (const bad of ['2er', '--1e', 'invalid', '1 e', '', 'e']) {
      expect(() => fromFrenchOrdinalAbbr(bad)).toThrow()
    }
  })

  test('French ordinal words accept feminine/second forms on input', () => {
    expect(frenchOrdinalWordsToWords('première')).toBe('un')
    expect(frenchOrdinalWordsToWords('seconde')).toBe('deux')
    expect(frenchOrdinalWordsToWords('second')).toBe('deux')
    // mille-premier is still accepted leniently on input
    expect(frenchOrdinalWordsToWords('mille-premier')).toBe('mille-un')
  })

  test('frenchWordsToOrdinalWords leaves non-number input unchanged', () => {
    expect(frenchWordsToOrdinalWords('invalid')).toBe('invalid')
  })
})

describe('Eastern Arabic guards', () => {
  test('toArabicNumerals rejects exponential-notation magnitudes', () => {
    expect(() => toArabicNumerals(1e-7)).toThrow()
    expect(() => toArabicNumerals(1e21)).toThrow()
    expect(() => toArabicNumerals(-1e21)).toThrow()
    expect(() => toArabicNumerals(Number.POSITIVE_INFINITY)).toThrow('finite')
  })

  test('fromArabicNumerals rejects structurally invalid strings', () => {
    for (const bad of ['٤-٢', '٤٢-', '٤.٢.٣', '-٤-٢', '-.٤', '٤.', '.', '-']) {
      expect(() => fromArabicNumerals(bad)).toThrow()
    }
  })

  test('fromArabicNumerals accepts well-formed strings', () => {
    expect(fromArabicNumerals('١٢٣')).toBe(123)
    expect(fromArabicNumerals('-٤.٢')).toBe(-4.2)
    expect(fromArabicNumerals('٠')).toBe(0)
  })
})

describe('Base guards', () => {
  test('non-integer and out-of-range bases throw', () => {
    expect(() => toBase(10, 2.5)).toThrow('integer')
    expect(() => fromBase('15', 2.5)).toThrow('integer')
    expect(() => toBase(10, 1)).toThrow('between 2 and 36')
    expect(() => toBase(10, 37)).toThrow('between 2 and 36')
  })

  test('toBase(n, 10) uses positional digits above 1e21 (no exponential)', () => {
    expect(toBase(1e21, 10)).toBe('1000000000000000000000')
    expect(toBase(-1e21, 10)).toBe('-1000000000000000000000')
    expect(toBase(1e21, 10).includes('e')).toBe(false)
  })
})

describe('convertTo hexadecimal negative sign placement', () => {
  test('sign precedes the prefix for every case/prefix combination', () => {
    expect(
      convertTo(-255, { type: 'hexadecimal', prefix: 'lower', case: 'upper' })
    ).toBe('-0xFF')
    expect(
      convertTo(-255, { type: 'hexadecimal', prefix: 'lower', case: 'lower' })
    ).toBe('-0xff')
    expect(
      convertTo(-255, { type: 'hexadecimal', prefix: 'upper', case: 'upper' })
    ).toBe('-0XFF')
    expect(convertTo(-255, { type: 'hexadecimal', case: 'upper' })).toBe('-FF')
    expect(convertTo(-255, { type: 'hexadecimal', case: 'lower' })).toBe('-ff')
    // positive and prefix-only paths unchanged
    expect(convertTo(255, { type: 'hexadecimal', prefix: 'upper' })).toBe(
      '0XFF'
    )
    expect(
      convertTo(255, { type: 'hexadecimal', prefix: 'lower', case: 'upper' })
    ).toBe('0xFF')
  })
})
