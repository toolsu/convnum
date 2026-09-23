import { describe, expect, test } from 'bun:test'
import { fromFrenchWords, toFrenchWords, validateFrenchWords } from '../../src'

const arr = [
  'zéro',
  'un',
  'deux',
  'trois',
  'quatre',
  'cinq',
  'six',
  'sept',
  'huit',
  'neuf',
  'dix',
  'onze',
  'douze',
  'treize',
  'quatorze',
  'quinze',
  'seize',
  'dix-sept',
  'dix-huit',
  'dix-neuf',
  'vingt',
  'vingt-et-un',
  'vingt-deux',
  'vingt-trois',
  'vingt-quatre',
  'vingt-cinq',
  'vingt-six',
  'vingt-sept',
  'vingt-huit',
  'vingt-neuf',
  'trente',
  'trente-et-un',
  'trente-deux',
  'trente-trois',
  'trente-quatre',
  'trente-cinq',
  'trente-six',
  'trente-sept',
  'trente-huit',
  'trente-neuf',
  'quarante',
  'quarante-et-un',
  'quarante-deux',
  'quarante-trois',
  'quarante-quatre',
  'quarante-cinq',
  'quarante-six',
  'quarante-sept',
  'quarante-huit',
  'quarante-neuf',
  'cinquante',
  'cinquante-et-un',
  'cinquante-deux',
  'cinquante-trois',
  'cinquante-quatre',
  'cinquante-cinq',
  'cinquante-six',
  'cinquante-sept',
  'cinquante-huit',
  'cinquante-neuf',
  'soixante',
  'soixante-et-un',
  'soixante-deux',
  'soixante-trois',
  'soixante-quatre',
  'soixante-cinq',
  'soixante-six',
  'soixante-sept',
  'soixante-huit',
  'soixante-neuf',
  'soixante-dix',
  'soixante-et-onze',
  'soixante-douze',
  'soixante-treize',
  'soixante-quatorze',
  'soixante-quinze',
  'soixante-seize',
  'soixante-dix-sept',
  'soixante-dix-huit',
  'soixante-dix-neuf',
  'quatre-vingts',
  'quatre-vingt-un',
  'quatre-vingt-deux',
  'quatre-vingt-trois',
  'quatre-vingt-quatre',
  'quatre-vingt-cinq',
  'quatre-vingt-six',
  'quatre-vingt-sept',
  'quatre-vingt-huit',
  'quatre-vingt-neuf',
  'quatre-vingt-dix',
  'quatre-vingt-onze',
  'quatre-vingt-douze',
  'quatre-vingt-treize',
  'quatre-vingt-quatorze',
  'quatre-vingt-quinze',
  'quatre-vingt-seize',
  'quatre-vingt-dix-sept',
  'quatre-vingt-dix-huit',
  'quatre-vingt-dix-neuf',
  'cent',
  'cent-un',
  'cent-deux',
  'cent-trois',
  'cent-quatre',
  'cent-cinq',
  'cent-six',
  'cent-sept',
  'cent-huit',
  'cent-neuf',
  'cent-dix',
  'cent-onze',
  'cent-douze',
  'cent-treize',
  'cent-quatorze',
  'cent-quinze',
  'cent-seize',
  'cent-dix-sept',
  'cent-dix-huit',
  'cent-dix-neuf',
  'cent-vingt',
  'cent-vingt-et-un',
  'cent-vingt-deux',
  'cent-vingt-trois',
  'cent-vingt-quatre',
  'cent-vingt-cinq',
  'cent-vingt-six',
  'cent-vingt-sept',
  'cent-vingt-huit',
  'cent-vingt-neuf',
  'cent-trente',
  'cent-trente-et-un',
]

describe('toFrenchWords', () => {
  test('should handle 0-131', () => {
    arr.forEach((item, index) => {
      expect(toFrenchWords(index)).toBe(item)
    })
  })

  test('should handle hundreds', () => {
    expect(toFrenchWords(200)).toBe('deux-cents')
    expect(toFrenchWords(201)).toBe('deux-cent-un')
    expect(toFrenchWords(999)).toBe('neuf-cent-quatre-vingt-dix-neuf')
  })

  test('should handle thousands', () => {
    expect(toFrenchWords(1000)).toBe('mille')
    expect(toFrenchWords(1001)).toBe('mille-un')
    expect(toFrenchWords(1100)).toBe('mille-cent')
    expect(toFrenchWords(1101)).toBe('mille-cent-un')
    expect(toFrenchWords(2000)).toBe('deux-mille')
    expect(toFrenchWords(2001)).toBe('deux-mille-un')
    expect(toFrenchWords(10000)).toBe('dix-mille')
    expect(toFrenchWords(100000)).toBe('cent-mille')
    expect(toFrenchWords(999999)).toBe(
      'neuf-cent-quatre-vingt-dix-neuf-mille-neuf-cent-quatre-vingt-dix-neuf'
    )
  })

  test('should handle millions', () => {
    expect(toFrenchWords(1000000)).toBe('un-million')
    expect(toFrenchWords(2000000)).toBe('deux-millions')
    expect(toFrenchWords(1000001)).toBe('un-million-un')
    expect(toFrenchWords(1000100)).toBe('un-million-cent')
    expect(toFrenchWords(9999999)).toBe(
      'neuf-millions-neuf-cent-quatre-vingt-dix-neuf-mille-neuf-cent-quatre-vingt-dix-neuf'
    )
  })

  test('should handle billions', () => {
    expect(toFrenchWords(1000000000)).toBe('un-milliard')
    expect(toFrenchWords(2000000000)).toBe('deux-milliards')
    expect(toFrenchWords(1000000001)).toBe('un-milliard-un')
    expect(toFrenchWords(1234567890)).toBe(
      'un-milliard-deux-cent-trente-quatre-millions-cinq-cent-soixante-sept-mille-huit-cent-quatre-vingt-dix'
    )
  })

  test('should handle negative numbers', () => {
    expect(toFrenchWords(-1)).toBe('moins-un')
    expect(toFrenchWords(-42)).toBe('moins-quarante-deux')
    expect(toFrenchWords(-1000000)).toBe('moins-un-million')
  })

  test('should handle edge cases with zeros', () => {
    expect(toFrenchWords(1000000010)).toBe('un-milliard-dix')
    expect(toFrenchWords(1001001001)).toBe('un-milliard-un-million-mille-un')
    expect(toFrenchWords(1000001000)).toBe('un-milliard-mille')
  })
})

describe('fromFrenchWords', () => {
  test('should handle 0-131', () => {
    arr.forEach((item, index) => {
      expect(fromFrenchWords(item)).toBe(index)
    })
  })

  test('should handle hundreds', () => {
    expect(fromFrenchWords('deux-cents')).toBe(200)
    expect(fromFrenchWords('deux-cent-un')).toBe(201)
    expect(fromFrenchWords('neuf-cent-quatre-vingt-dix-neuf')).toBe(999)
  })

  test('should handle thousands', () => {
    expect(fromFrenchWords('mille')).toBe(1000)
    expect(fromFrenchWords('mille-un')).toBe(1001)
    expect(fromFrenchWords('mille-cent')).toBe(1100)
    expect(fromFrenchWords('mille-cent-un')).toBe(1101)
    expect(fromFrenchWords('deux-mille')).toBe(2000)
    expect(fromFrenchWords('deux-mille-un')).toBe(2001)
    expect(fromFrenchWords('dix-mille')).toBe(10000)
    expect(fromFrenchWords('cent-mille')).toBe(100000)
    expect(
      fromFrenchWords(
        'neuf-cent-quatre-vingt-dix-neuf-mille-neuf-cent-quatre-vingt-dix-neuf'
      )
    ).toBe(999999)
  })

  test('should handle millions', () => {
    expect(fromFrenchWords('un-million')).toBe(1000000)
    expect(fromFrenchWords('deux-millions')).toBe(2000000)
    expect(fromFrenchWords('un-million-un')).toBe(1000001)
    expect(fromFrenchWords('un-million-cent')).toBe(1000100)
    expect(
      fromFrenchWords(
        'neuf-millions-neuf-cent-quatre-vingt-dix-neuf-mille-neuf-cent-quatre-vingt-dix-neuf'
      )
    ).toBe(9999999)
  })

  test('should handle billions', () => {
    expect(fromFrenchWords('un-milliard')).toBe(1000000000)
    expect(fromFrenchWords('deux-milliards')).toBe(2000000000)
    expect(fromFrenchWords('un-milliard-un')).toBe(1000000001)
    expect(
      fromFrenchWords(
        'un-milliard-deux-cent-trente-quatre-millions-cinq-cent-soixante-sept-mille-huit-cent-quatre-vingt-dix'
      )
    ).toBe(1234567890)
  })

  test('should handle negative numbers', () => {
    expect(fromFrenchWords('moins-un')).toBe(-1)
    expect(fromFrenchWords('moins-quarante-deux')).toBe(-42)
    expect(fromFrenchWords('moins-un-million')).toBe(-1000000)
  })

  test('should handle edge cases with zeros', () => {
    expect(fromFrenchWords('un-milliard-dix')).toBe(1000000010)
    expect(fromFrenchWords('un-milliard-un-million-mille-un')).toBe(1001001001)
    expect(fromFrenchWords('un-milliard-mille')).toBe(1000001000)
  })

  test('should handle all alternative hyphenation forms', () => {
    expect(fromFrenchWords('cent un')).toBe(101)
    expect(fromFrenchWords('vingt et-un')).toBe(21)
    expect(fromFrenchWords('deux cents')).toBe(200)
    expect(fromFrenchWords('mille-deux cent-trente quatre')).toBe(1234)
    expect(
      fromFrenchWords(
        'un milliard-deux cent-trente quatre-millions cinq-cent soixante-sept mille-huit cent-quatre vingt-dix'
      )
    ).toBe(1234567890)
  })
})

describe('validateFrenchWords', () => {
  test('should validate correct French number words', () => {
    expect(validateFrenchWords('zéro')).toBe(true)
    expect(validateFrenchWords('un')).toBe(true)
    expect(validateFrenchWords('vingt-et-un')).toBe(true)
    expect(validateFrenchWords('cent')).toBe(true)
    expect(validateFrenchWords('mille-deux-cent-trente-quatre')).toBe(true)
    expect(validateFrenchWords('moins-cent')).toBe(true)
  })

  test('should validate all alternative hyphenation forms', () => {
    expect(validateFrenchWords('cent un')).toBe(true)
    expect(validateFrenchWords('vingt et-un')).toBe(true)
    expect(validateFrenchWords('deux cents')).toBe(true)
    expect(validateFrenchWords('mille-deux cent-trente quatre')).toBe(true)
    expect(
      validateFrenchWords(
        'un milliard-deux cent-trente quatre-millions cinq-cent soixante-sept mille-huit cent-quatre vingt-dix'
      )
    ).toBe(true)
  })

  test('should reject invalid French number words (or unsupported like "virgule")', () => {
    expect(validateFrenchWords('')).toBe(false)
    expect(validateFrenchWords('invalide')).toBe(false)
    expect(validateFrenchWords('cent et un')).toBe(false)
    expect(validateFrenchWords('cent, et un')).toBe(false)
    expect(validateFrenchWords('vingt un')).toBe(false)
    expect(validateFrenchWords('cent, un')).toBe(false)
    expect(validateFrenchWords('cent virgule cinq')).toBe(false)
  })

  test('should be case insensitive', () => {
    expect(validateFrenchWords('ZÉRO')).toBe(true)
    expect(validateFrenchWords('VINGT-ET-UN')).toBe(true)
    expect(validateFrenchWords('CENT')).toBe(true)
  })

  test('should handle error cases', () => {
    // Test for non-finite numbers (covers line 126)
    expect(() => toFrenchWords(Infinity)).toThrow(
      'Input must be a finite number'
    )
    expect(() => toFrenchWords(-Infinity)).toThrow(
      'Input must be a finite number'
    )
    expect(() => toFrenchWords(NaN)).toThrow('Input must be a finite number')
  })

  test('should handle catch block in validateFrenchWords', () => {
    expect(validateFrenchWords(null as unknown as string)).toBe(false)
    expect(validateFrenchWords(undefined as unknown as string)).toBe(false)
  })
})
