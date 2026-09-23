import { describe, expect, test } from 'bun:test'
import {
  frenchOrdinalWordsToWords,
  frenchWordsToOrdinalWords,
  fromFrenchOrdinalAbbr,
  toFrenchOrdinalAbbr,
} from '../../src'

describe('toFrenchOrdinalAbbr', () => {
  test('converts positive numbers correctly', () => {
    expect(toFrenchOrdinalAbbr(1)).toBe('1er')
    expect(toFrenchOrdinalAbbr(2)).toBe('2e')
    expect(toFrenchOrdinalAbbr(3)).toBe('3e')
    expect(toFrenchOrdinalAbbr(4)).toBe('4e')
    expect(toFrenchOrdinalAbbr(5)).toBe('5e')
    expect(toFrenchOrdinalAbbr(10)).toBe('10e')
    expect(toFrenchOrdinalAbbr(11)).toBe('11e')
    expect(toFrenchOrdinalAbbr(12)).toBe('12e')
    expect(toFrenchOrdinalAbbr(13)).toBe('13e')
    expect(toFrenchOrdinalAbbr(14)).toBe('14e')
    expect(toFrenchOrdinalAbbr(20)).toBe('20e')
    expect(toFrenchOrdinalAbbr(21)).toBe('21e')
    expect(toFrenchOrdinalAbbr(22)).toBe('22e')
    expect(toFrenchOrdinalAbbr(23)).toBe('23e')
    expect(toFrenchOrdinalAbbr(24)).toBe('24e')
    expect(toFrenchOrdinalAbbr(100)).toBe('100e')
    expect(toFrenchOrdinalAbbr(101)).toBe('101e')
    expect(toFrenchOrdinalAbbr(102)).toBe('102e')
    expect(toFrenchOrdinalAbbr(103)).toBe('103e')
    expect(toFrenchOrdinalAbbr(104)).toBe('104e')
  })

  test('converts negative numbers correctly', () => {
    expect(toFrenchOrdinalAbbr(-1)).toBe('-1er')
    expect(toFrenchOrdinalAbbr(-2)).toBe('-2e')
    expect(toFrenchOrdinalAbbr(-3)).toBe('-3e')
    expect(toFrenchOrdinalAbbr(-4)).toBe('-4e')
    expect(toFrenchOrdinalAbbr(-11)).toBe('-11e')
    expect(toFrenchOrdinalAbbr(-12)).toBe('-12e')
    expect(toFrenchOrdinalAbbr(-13)).toBe('-13e')
    expect(toFrenchOrdinalAbbr(-21)).toBe('-21e')
    expect(toFrenchOrdinalAbbr(-22)).toBe('-22e')
    expect(toFrenchOrdinalAbbr(-23)).toBe('-23e')
  })

  test('handles zero correctly', () => {
    expect(toFrenchOrdinalAbbr(0)).toBe('0e')
  })

  test('throws error for non-finite numbers', () => {
    expect(() => toFrenchOrdinalAbbr(Number.NaN)).toThrow(
      'Input must be a finite number'
    )
    expect(() => toFrenchOrdinalAbbr(Number.POSITIVE_INFINITY)).toThrow(
      'Input must be a finite number'
    )
    expect(() => toFrenchOrdinalAbbr(Number.NEGATIVE_INFINITY)).toThrow(
      'Input must be a finite number'
    )
  })
})

describe('fromFrenchOrdinalAbbr', () => {
  test('converts positive ordinal numbers correctly', () => {
    expect(fromFrenchOrdinalAbbr('1e')).toBe(1)
    expect(fromFrenchOrdinalAbbr('2e')).toBe(2)
    expect(fromFrenchOrdinalAbbr('3e')).toBe(3)
    expect(fromFrenchOrdinalAbbr('4e')).toBe(4)
    expect(fromFrenchOrdinalAbbr('5e')).toBe(5)
    expect(fromFrenchOrdinalAbbr('10e')).toBe(10)
    expect(fromFrenchOrdinalAbbr('11e')).toBe(11)
    expect(fromFrenchOrdinalAbbr('12e')).toBe(12)
    expect(fromFrenchOrdinalAbbr('13e')).toBe(13)
    expect(fromFrenchOrdinalAbbr('14e')).toBe(14)
    expect(fromFrenchOrdinalAbbr('20e')).toBe(20)
    expect(fromFrenchOrdinalAbbr('21e')).toBe(21)
    expect(fromFrenchOrdinalAbbr('22e')).toBe(22)
    expect(fromFrenchOrdinalAbbr('23e')).toBe(23)
    expect(fromFrenchOrdinalAbbr('24e')).toBe(24)
    expect(fromFrenchOrdinalAbbr('100e')).toBe(100)
    expect(fromFrenchOrdinalAbbr('101e')).toBe(101)
    expect(fromFrenchOrdinalAbbr('102e')).toBe(102)
    expect(fromFrenchOrdinalAbbr('103e')).toBe(103)
    expect(fromFrenchOrdinalAbbr('104e')).toBe(104)
  })

  test('converts negative ordinal numbers correctly', () => {
    expect(fromFrenchOrdinalAbbr('-1e')).toBe(-1)
    expect(fromFrenchOrdinalAbbr('-2e')).toBe(-2)
    expect(fromFrenchOrdinalAbbr('-3e')).toBe(-3)
    expect(fromFrenchOrdinalAbbr('-4e')).toBe(-4)
    expect(fromFrenchOrdinalAbbr('-11e')).toBe(-11)
    expect(fromFrenchOrdinalAbbr('-12e')).toBe(-12)
    expect(fromFrenchOrdinalAbbr('-13e')).toBe(-13)
    expect(fromFrenchOrdinalAbbr('-21e')).toBe(-21)
    expect(fromFrenchOrdinalAbbr('-22e')).toBe(-22)
    expect(fromFrenchOrdinalAbbr('-23e')).toBe(-23)
  })

  test('handles zero correctly', () => {
    expect(fromFrenchOrdinalAbbr('0e')).toBe(0)
  })

  test('handles whitespace correctly', () => {
    expect(fromFrenchOrdinalAbbr(' 1e ')).toBe(1)
    expect(fromFrenchOrdinalAbbr('\t2e\n')).toBe(2)
    expect(fromFrenchOrdinalAbbr(' 3e ')).toBe(3)
  })

  test('handles case insensitive input correctly', () => {
    expect(fromFrenchOrdinalAbbr('1E')).toBe(1)
    expect(fromFrenchOrdinalAbbr('2E')).toBe(2)
    expect(fromFrenchOrdinalAbbr('10E')).toBe(10)
  })

  test('throws error for invalid inputs', () => {
    expect(() => fromFrenchOrdinalAbbr('1')).toThrow(
      'Invalid French ordinal number'
    )
    expect(() => fromFrenchOrdinalAbbr('1st')).toThrow(
      'Invalid French ordinal number'
    )
    expect(() => fromFrenchOrdinalAbbr('1eme')).toThrow(
      'Invalid French ordinal number'
    )
    expect(() => fromFrenchOrdinalAbbr('abc')).toThrow(
      'Invalid French ordinal number'
    )
    expect(() => fromFrenchOrdinalAbbr('1ee')).toThrow(
      'Invalid French ordinal number'
    )
    expect(() => fromFrenchOrdinalAbbr('e')).toThrow(
      'Invalid French ordinal number'
    )
    expect(() => fromFrenchOrdinalAbbr('')).toThrow(
      'Invalid French ordinal number'
    )
  })
})

describe('frenchWordsToOrdinalWords', () => {
  test('converts basic cardinal words to ordinal words', () => {
    expect(frenchWordsToOrdinalWords('un')).toBe('premier')
    expect(frenchWordsToOrdinalWords('deux')).toBe('deuxième')
    expect(frenchWordsToOrdinalWords('trois')).toBe('troisième')
    expect(frenchWordsToOrdinalWords('quatre')).toBe('quatrième')
    expect(frenchWordsToOrdinalWords('cinq')).toBe('cinquième')
    expect(frenchWordsToOrdinalWords('six')).toBe('sixième')
    expect(frenchWordsToOrdinalWords('sept')).toBe('septième')
    expect(frenchWordsToOrdinalWords('huit')).toBe('huitième')
    expect(frenchWordsToOrdinalWords('neuf')).toBe('neuvième')
    expect(frenchWordsToOrdinalWords('dix')).toBe('dixième')
    expect(frenchWordsToOrdinalWords('onze')).toBe('onzième')
    expect(frenchWordsToOrdinalWords('douze')).toBe('douzième')
    expect(frenchWordsToOrdinalWords('treize')).toBe('treizième')
    expect(frenchWordsToOrdinalWords('quatorze')).toBe('quatorzième')
    expect(frenchWordsToOrdinalWords('quinze')).toBe('quinzième')
    expect(frenchWordsToOrdinalWords('seize')).toBe('seizième')
    expect(frenchWordsToOrdinalWords('dix-sept')).toBe('dix-septième')
    expect(frenchWordsToOrdinalWords('dix-huit')).toBe('dix-huitième')
    expect(frenchWordsToOrdinalWords('dix-neuf')).toBe('dix-neuvième')
    expect(frenchWordsToOrdinalWords('vingt')).toBe('vingtième')
  })

  test('converts compound cardinal words to ordinal words', () => {
    expect(frenchWordsToOrdinalWords('vingt-et-un')).toBe('vingt-et-unième')
    expect(frenchWordsToOrdinalWords('vingt-deux')).toBe('vingt-deuxième')
    expect(frenchWordsToOrdinalWords('vingt-trois')).toBe('vingt-troisième')
    expect(frenchWordsToOrdinalWords('vingt-cinq')).toBe('vingt-cinquième')
    expect(frenchWordsToOrdinalWords('vingt-six')).toBe('vingt-sixième')
    expect(frenchWordsToOrdinalWords('vingt-sept')).toBe('vingt-septième')
    expect(frenchWordsToOrdinalWords('vingt-huit')).toBe('vingt-huitième')
    expect(frenchWordsToOrdinalWords('vingt-neuf')).toBe('vingt-neuvième')
    expect(frenchWordsToOrdinalWords('trente-et-un')).toBe('trente-et-unième')
    expect(frenchWordsToOrdinalWords('trente-deux')).toBe('trente-deuxième')
    expect(frenchWordsToOrdinalWords('quarante-et-un')).toBe(
      'quarante-et-unième'
    )
    expect(frenchWordsToOrdinalWords('cinquante-et-un')).toBe(
      'cinquante-et-unième'
    )
    expect(frenchWordsToOrdinalWords('soixante-et-onze')).toBe(
      'soixante-et-onzième'
    )
    expect(frenchWordsToOrdinalWords('quatre-vingt-un')).toBe(
      'quatre-vingt-unième'
    )
    expect(frenchWordsToOrdinalWords('quatre-vingt-onze')).toBe(
      'quatre-vingt-onzième'
    )
  })

  test('converts large cardinal words to ordinal words', () => {
    expect(frenchWordsToOrdinalWords('cent')).toBe('centième')
    expect(frenchWordsToOrdinalWords('cent-cinq')).toBe('cent-cinquième')
    expect(frenchWordsToOrdinalWords('cent-vingt-et-un')).toBe(
      'cent-vingt-et-unième'
    )
    expect(frenchWordsToOrdinalWords('mille')).toBe('millième')
    expect(frenchWordsToOrdinalWords('mille-un')).toBe('mille-unième')
    expect(frenchWordsToOrdinalWords('un-million')).toBe('un-millionième')
    expect(frenchWordsToOrdinalWords('un-milliard')).toBe('un-milliardième')
  })

  test('preserves hyphenated form in conversions', () => {
    expect(frenchWordsToOrdinalWords('vingt-et-un')).toBe('vingt-et-unième')
    expect(frenchWordsToOrdinalWords('trente-et-un')).toBe('trente-et-unième')
    expect(frenchWordsToOrdinalWords('soixante-et-onze')).toBe(
      'soixante-et-onzième'
    )
    expect(frenchWordsToOrdinalWords('quatre-vingt-un')).toBe(
      'quatre-vingt-unième'
    )
  })

  test('preserves non-hyphenated form in conversions', () => {
    expect(frenchWordsToOrdinalWords('vingt et un')).toBe('vingt et unième')
    expect(frenchWordsToOrdinalWords('trente et un')).toBe('trente et unième')
    expect(frenchWordsToOrdinalWords('soixante et onze')).toBe(
      'soixante et onzième'
    )
    expect(frenchWordsToOrdinalWords('quatre vingt un')).toBe(
      'quatre vingt unième'
    )
  })

  test('handles zero correctly', () => {
    expect(frenchWordsToOrdinalWords('zéro')).toBe('zéroième')
  })

  test('handles negative numbers correctly', () => {
    expect(frenchWordsToOrdinalWords('moins-un')).toBe('moins-premier')
    expect(frenchWordsToOrdinalWords('moins-vingt-et-un')).toBe(
      'moins-vingt-et-unième'
    )
    expect(frenchWordsToOrdinalWords('moins-cent-cinq')).toBe(
      'moins-cent-cinquième'
    )
  })

  test('handles case insensitive input', () => {
    expect(frenchWordsToOrdinalWords('UN')).toBe('premier')
    expect(frenchWordsToOrdinalWords('Vingt-Et-Un')).toBe('vingt-et-unième')
    expect(frenchWordsToOrdinalWords('Cent-Cinq')).toBe('cent-cinquième')
  })

  test('handles whitespace correctly', () => {
    expect(frenchWordsToOrdinalWords('  un  ')).toBe('premier')
    expect(frenchWordsToOrdinalWords('\tvingt-et-un\n')).toBe('vingt-et-unième')
  })

  test('handles invalid ordinal words gracefully', () => {
    // If no ordinal word is found, return the original input
    expect(frenchWordsToOrdinalWords('invalid')).toBe('invalid')
    expect(frenchWordsToOrdinalWords('not-a-number')).toBe('not-a-number')
    expect(frenchWordsToOrdinalWords('random text')).toBe('random text')
  })
})

describe('frenchOrdinalWordsToWords', () => {
  test('converts basic ordinal words to cardinal words', () => {
    expect(frenchOrdinalWordsToWords('premier')).toBe('un')
    expect(frenchOrdinalWordsToWords('deuxième')).toBe('deux')
    expect(frenchOrdinalWordsToWords('troisième')).toBe('trois')
    expect(frenchOrdinalWordsToWords('quatrième')).toBe('quatre')
    expect(frenchOrdinalWordsToWords('cinquième')).toBe('cinq')
    expect(frenchOrdinalWordsToWords('sixième')).toBe('six')
    expect(frenchOrdinalWordsToWords('septième')).toBe('sept')
    expect(frenchOrdinalWordsToWords('huitième')).toBe('huit')
    expect(frenchOrdinalWordsToWords('neuvième')).toBe('neuf')
    expect(frenchOrdinalWordsToWords('dixième')).toBe('dix')
    expect(frenchOrdinalWordsToWords('onzième')).toBe('onze')
    expect(frenchOrdinalWordsToWords('douzième')).toBe('douze')
    expect(frenchOrdinalWordsToWords('treizième')).toBe('treize')
    expect(frenchOrdinalWordsToWords('quatorzième')).toBe('quatorze')
    expect(frenchOrdinalWordsToWords('quinzième')).toBe('quinze')
    expect(frenchOrdinalWordsToWords('seizième')).toBe('seize')
    expect(frenchOrdinalWordsToWords('dix-septième')).toBe('dix-sept')
    expect(frenchOrdinalWordsToWords('dix-huitième')).toBe('dix-huit')
    expect(frenchOrdinalWordsToWords('dix-neuvième')).toBe('dix-neuf')
    expect(frenchOrdinalWordsToWords('vingtième')).toBe('vingt')
  })

  test('converts compound ordinal words to cardinal words', () => {
    expect(frenchOrdinalWordsToWords('vingt-et-unième')).toBe('vingt-et-un')
    expect(frenchOrdinalWordsToWords('vingt-deuxième')).toBe('vingt-deux')
    expect(frenchOrdinalWordsToWords('vingt-troisième')).toBe('vingt-trois')
    expect(frenchOrdinalWordsToWords('vingt-cinquième')).toBe('vingt-cinq')
    expect(frenchOrdinalWordsToWords('vingt-sixième')).toBe('vingt-six')
    expect(frenchOrdinalWordsToWords('vingt-septième')).toBe('vingt-sept')
    expect(frenchOrdinalWordsToWords('vingt-huitième')).toBe('vingt-huit')
    expect(frenchOrdinalWordsToWords('vingt-neuvième')).toBe('vingt-neuf')
    expect(frenchOrdinalWordsToWords('trente-et-unième')).toBe('trente-et-un')
    expect(frenchOrdinalWordsToWords('trente-deuxième')).toBe('trente-deux')
    expect(frenchOrdinalWordsToWords('quarante-et-unième')).toBe(
      'quarante-et-un'
    )
    expect(frenchOrdinalWordsToWords('cinquante-et-unième')).toBe(
      'cinquante-et-un'
    )
    expect(frenchOrdinalWordsToWords('soixante-et-onzième')).toBe(
      'soixante-et-onze'
    )
    expect(frenchOrdinalWordsToWords('quatre-vingt-unième')).toBe(
      'quatre-vingt-un'
    )
    expect(frenchOrdinalWordsToWords('quatre-vingt-onzième')).toBe(
      'quatre-vingt-onze'
    )
  })

  test('converts large ordinal words to cardinal words', () => {
    expect(frenchOrdinalWordsToWords('centième')).toBe('cent')
    expect(frenchOrdinalWordsToWords('cent-cinquième')).toBe('cent-cinq')
    expect(frenchOrdinalWordsToWords('cent-vingt-et-unième')).toBe(
      'cent-vingt-et-un'
    )
    expect(frenchOrdinalWordsToWords('millième')).toBe('mille')
    expect(frenchOrdinalWordsToWords('mille-premier')).toBe('mille-un')
    expect(frenchOrdinalWordsToWords('un-millionième')).toBe('un-million')
    expect(frenchOrdinalWordsToWords('un-milliardième')).toBe('un-milliard')
  })

  test('preserves hyphenated form in conversions', () => {
    expect(frenchOrdinalWordsToWords('vingt-et-unième')).toBe('vingt-et-un')
    expect(frenchOrdinalWordsToWords('trente-et-unième')).toBe('trente-et-un')
    expect(frenchOrdinalWordsToWords('soixante-et-onzième')).toBe(
      'soixante-et-onze'
    )
    expect(frenchOrdinalWordsToWords('quatre-vingt-unième')).toBe(
      'quatre-vingt-un'
    )
  })

  test('preserves non-hyphenated form in conversions', () => {
    expect(frenchOrdinalWordsToWords('vingt et unième')).toBe('vingt et un')
    expect(frenchOrdinalWordsToWords('trente et unième')).toBe('trente et un')
    expect(frenchOrdinalWordsToWords('soixante et onzième')).toBe(
      'soixante et onze'
    )
    expect(frenchOrdinalWordsToWords('quatre vingt unième')).toBe(
      'quatre vingt un'
    )
  })

  test('handles zero correctly', () => {
    expect(frenchOrdinalWordsToWords('zéroième')).toBe('zéro')
  })

  test('handles negative numbers correctly', () => {
    expect(frenchOrdinalWordsToWords('moins-premier')).toBe('moins-un')
    expect(frenchOrdinalWordsToWords('moins-vingt-et-unième')).toBe(
      'moins-vingt-et-un'
    )
    expect(frenchOrdinalWordsToWords('moins-cent-cinquième')).toBe(
      'moins-cent-cinq'
    )
  })

  test('handles case insensitive input', () => {
    expect(frenchOrdinalWordsToWords('PREMIER')).toBe('un')
    expect(frenchOrdinalWordsToWords('Vingt-Et-Unième')).toBe('vingt-et-un')
    expect(frenchOrdinalWordsToWords('Cent-Cinquième')).toBe('cent-cinq')
  })

  test('handles whitespace correctly', () => {
    expect(frenchOrdinalWordsToWords('  premier  ')).toBe('un')
    expect(frenchOrdinalWordsToWords('\tvingt-et-unième\n')).toBe('vingt-et-un')
  })

  test('handles invalid ordinal words gracefully', () => {
    // If no ordinal word is found, return the original input
    expect(frenchOrdinalWordsToWords('invalid')).toBe('invalid')
    expect(frenchOrdinalWordsToWords('un')).toBe('un')
    expect(frenchOrdinalWordsToWords('vingt-et-un')).toBe('vingt-et-un')
  })
})

// Comprehensive tests using all cardinal words from french.test.ts
describe('frenchWordsToOrdinalWords - comprehensive tests', () => {
  // French cardinal words (0-131) - hyphenated form
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

  test('converts French cardinal words 0-131 to ordinal words', () => {
    const expected = [
      'zéroième',
      'premier',
      'deuxième',
      'troisième',
      'quatrième',
      'cinquième',
      'sixième',
      'septième',
      'huitième',
      'neuvième',
      'dixième',
      'onzième',
      'douzième',
      'treizième',
      'quatorzième',
      'quinzième',
      'seizième',
      'dix-septième',
      'dix-huitième',
      'dix-neuvième',
      'vingtième',
      'vingt-et-unième',
      'vingt-deuxième',
      'vingt-troisième',
      'vingt-quatrième',
      'vingt-cinquième',
      'vingt-sixième',
      'vingt-septième',
      'vingt-huitième',
      'vingt-neuvième',
      'trentième',
      'trente-et-unième',
      'trente-deuxième',
      'trente-troisième',
      'trente-quatrième',
      'trente-cinquième',
      'trente-sixième',
      'trente-septième',
      'trente-huitième',
      'trente-neuvième',
      'quarantième',
      'quarante-et-unième',
      'quarante-deuxième',
      'quarante-troisième',
      'quarante-quatrième',
      'quarante-cinquième',
      'quarante-sixième',
      'quarante-septième',
      'quarante-huitième',
      'quarante-neuvième',
      'cinquantième',
      'cinquante-et-unième',
      'cinquante-deuxième',
      'cinquante-troisième',
      'cinquante-quatrième',
      'cinquante-cinquième',
      'cinquante-sixième',
      'cinquante-septième',
      'cinquante-huitième',
      'cinquante-neuvième',
      'soixantième',
      'soixante-et-unième',
      'soixante-deuxième',
      'soixante-troisième',
      'soixante-quatrième',
      'soixante-cinquième',
      'soixante-sixième',
      'soixante-septième',
      'soixante-huitième',
      'soixante-neuvième',
      'soixante-dixième',
      'soixante-et-onzième',
      'soixante-douzième',
      'soixante-treizième',
      'soixante-quatorzième',
      'soixante-quinzième',
      'soixante-seizième',
      'soixante-dix-septième',
      'soixante-dix-huitième',
      'soixante-dix-neuvième',
      'quatre-vingtième',
      'quatre-vingt-unième',
      'quatre-vingt-deuxième',
      'quatre-vingt-troisième',
      'quatre-vingt-quatrième',
      'quatre-vingt-cinquième',
      'quatre-vingt-sixième',
      'quatre-vingt-septième',
      'quatre-vingt-huitième',
      'quatre-vingt-neuvième',
      'quatre-vingt-dixième',
      'quatre-vingt-onzième',
      'quatre-vingt-douzième',
      'quatre-vingt-treizième',
      'quatre-vingt-quatorzième',
      'quatre-vingt-quinzième',
      'quatre-vingt-seizième',
      'quatre-vingt-dix-septième',
      'quatre-vingt-dix-huitième',
      'quatre-vingt-dix-neuvième',
      'centième',
      'cent-unième',
      'cent-deuxième',
      'cent-troisième',
      'cent-quatrième',
      'cent-cinquième',
      'cent-sixième',
      'cent-septième',
      'cent-huitième',
      'cent-neuvième',
      'cent-dixième',
      'cent-onzième',
      'cent-douzième',
      'cent-treizième',
      'cent-quatorzième',
      'cent-quinzième',
      'cent-seizième',
      'cent-dix-septième',
      'cent-dix-huitième',
      'cent-dix-neuvième',
      'cent-vingtième',
      'cent-vingt-et-unième',
      'cent-vingt-deuxième',
      'cent-vingt-troisième',
      'cent-vingt-quatrième',
      'cent-vingt-cinquième',
      'cent-vingt-sixième',
      'cent-vingt-septième',
      'cent-vingt-huitième',
      'cent-vingt-neuvième',
      'cent-trentième',
      'cent-trente-et-unième',
    ]

    arr.forEach((cardinal, index) => {
      expect(frenchWordsToOrdinalWords(cardinal)).toBe(expected[index])
    })
  })

  test('converts hundreds to ordinal words', () => {
    expect(frenchWordsToOrdinalWords('deux-cents')).toBe('deux-centième')
    expect(frenchWordsToOrdinalWords('deux-cent-un')).toBe('deux-cent-unième')
    expect(frenchWordsToOrdinalWords('neuf-cent-quatre-vingt-dix-neuf')).toBe(
      'neuf-cent-quatre-vingt-dix-neuvième'
    )
  })

  test('converts thousands to ordinal words', () => {
    expect(frenchWordsToOrdinalWords('mille')).toBe('millième')
    expect(frenchWordsToOrdinalWords('mille-un')).toBe('mille-unième')
    expect(frenchWordsToOrdinalWords('mille-cent')).toBe('mille-centième')
    expect(frenchWordsToOrdinalWords('mille-cent-un')).toBe('mille-cent-unième')
    expect(frenchWordsToOrdinalWords('deux-mille')).toBe('deux-millième')
    expect(frenchWordsToOrdinalWords('deux-mille-un')).toBe('deux-mille-unième')
    expect(frenchWordsToOrdinalWords('dix-mille')).toBe('dix-millième')
    expect(frenchWordsToOrdinalWords('cent-mille')).toBe('cent-millième')
    expect(
      frenchWordsToOrdinalWords(
        'neuf-cent-quatre-vingt-dix-neuf-mille-neuf-cent-quatre-vingt-dix-neuf'
      )
    ).toBe(
      'neuf-cent-quatre-vingt-dix-neuf-mille-neuf-cent-quatre-vingt-dix-neuvième'
    )
  })

  test('converts millions to ordinal words', () => {
    expect(frenchWordsToOrdinalWords('un-million')).toBe('un-millionième')
    expect(frenchWordsToOrdinalWords('deux-millions')).toBe('deux-millionième')
    expect(frenchWordsToOrdinalWords('un-million-un')).toBe('un-million-unième')
    expect(frenchWordsToOrdinalWords('un-million-cent')).toBe(
      'un-million-centième'
    )
    expect(
      frenchWordsToOrdinalWords(
        'neuf-millions-neuf-cent-quatre-vingt-dix-neuf-mille-neuf-cent-quatre-vingt-dix-neuf'
      )
    ).toBe(
      'neuf-millions-neuf-cent-quatre-vingt-dix-neuf-mille-neuf-cent-quatre-vingt-dix-neuvième'
    )
  })

  test('converts billions to ordinal words', () => {
    expect(frenchWordsToOrdinalWords('un-milliard')).toBe('un-milliardième')
    expect(frenchWordsToOrdinalWords('deux-milliards')).toBe(
      'deux-milliardième'
    )
    expect(frenchWordsToOrdinalWords('un-milliard-un')).toBe(
      'un-milliard-unième'
    )
    expect(
      frenchWordsToOrdinalWords(
        'un-milliard-deux-cent-trente-quatre-millions-cinq-cent-soixante-sept-mille-huit-cent-quatre-vingt-dix'
      )
    ).toBe(
      'un-milliard-deux-cent-trente-quatre-millions-cinq-cent-soixante-sept-mille-huit-cent-quatre-vingt-dixième'
    )
  })

  test('converts negative numbers to ordinal words', () => {
    expect(frenchWordsToOrdinalWords('moins-un')).toBe('moins-premier')
    expect(frenchWordsToOrdinalWords('moins-quarante-deux')).toBe(
      'moins-quarante-deuxième'
    )
    expect(frenchWordsToOrdinalWords('moins-un-million')).toBe(
      'moins-un-millionième'
    )
  })

  test('converts edge cases with zeros to ordinal words', () => {
    expect(frenchWordsToOrdinalWords('un-milliard-dix')).toBe(
      'un-milliard-dixième'
    )
    expect(frenchWordsToOrdinalWords('un-milliard-un-million-mille-un')).toBe(
      'un-milliard-un-million-mille-unième'
    )
    expect(frenchWordsToOrdinalWords('un-milliard-mille')).toBe(
      'un-milliard-millième'
    )
  })

  test('converts alternative hyphenation forms to ordinal words', () => {
    expect(frenchWordsToOrdinalWords('cent un')).toBe('cent unième')
    expect(frenchWordsToOrdinalWords('vingt et-un')).toBe('vingt et-unième')
    expect(frenchWordsToOrdinalWords('deux cents')).toBe('deux centième')
    expect(frenchWordsToOrdinalWords('mille-deux cent-trente quatre')).toBe(
      'mille-deux cent-trente quatrième'
    )
    expect(
      frenchWordsToOrdinalWords(
        'un milliard-deux cent-trente quatre-millions cinq-cent soixante-sept mille-huit cent-quatre vingt-dix'
      )
    ).toBe(
      'un milliard-deux cent-trente quatre-millions cinq-cent soixante-sept mille-huit cent-quatre vingt-dixième'
    )
  })
})

describe('frenchOrdinalWordsToWords - comprehensive tests', () => {
  test('converts French ordinal words 0-131 back to cardinal words', () => {
    const ordinal = [
      'zéroième',
      'premier',
      'deuxième',
      'troisième',
      'quatrième',
      'cinquième',
      'sixième',
      'septième',
      'huitième',
      'neuvième',
      'dixième',
      'onzième',
      'douzième',
      'treizième',
      'quatorzième',
      'quinzième',
      'seizième',
      'dix-septième',
      'dix-huitième',
      'dix-neuvième',
      'vingtième',
      'vingt-et-unième',
      'vingt-deuxième',
      'vingt-troisième',
      'vingt-quatrième',
      'vingt-cinquième',
      'vingt-sixième',
      'vingt-septième',
      'vingt-huitième',
      'vingt-neuvième',
      'trentième',
      'trente-et-unième',
      'trente-deuxième',
      'trente-troisième',
      'trente-quatrième',
      'trente-cinquième',
      'trente-sixième',
      'trente-septième',
      'trente-huitième',
      'trente-neuvième',
      'quarantième',
      'quarante-et-unième',
      'quarante-deuxième',
      'quarante-troisième',
      'quarante-quatrième',
      'quarante-cinquième',
      'quarante-sixième',
      'quarante-septième',
      'quarante-huitième',
      'quarante-neuvième',
      'cinquantième',
      'cinquante-et-unième',
      'cinquante-deuxième',
      'cinquante-troisième',
      'cinquante-quatrième',
      'cinquante-cinquième',
      'cinquante-sixième',
      'cinquante-septième',
      'cinquante-huitième',
      'cinquante-neuvième',
      'soixantième',
      'soixante-et-unième',
      'soixante-deuxième',
      'soixante-troisième',
      'soixante-quatrième',
      'soixante-cinquième',
      'soixante-sixième',
      'soixante-septième',
      'soixante-huitième',
      'soixante-neuvième',
      'soixante-dixième',
      'soixante-et-onzième',
      'soixante-douzième',
      'soixante-treizième',
      'soixante-quatorzième',
      'soixante-quinzième',
      'soixante-seizième',
      'soixante-dix-septième',
      'soixante-dix-huitième',
      'soixante-dix-neuvième',
      'quatre-vingtième',
      'quatre-vingt-unième',
      'quatre-vingt-deuxième',
      'quatre-vingt-troisième',
      'quatre-vingt-quatrième',
      'quatre-vingt-cinquième',
      'quatre-vingt-sixième',
      'quatre-vingt-septième',
      'quatre-vingt-huitième',
      'quatre-vingt-neuvième',
      'quatre-vingt-dixième',
      'quatre-vingt-onzième',
      'quatre-vingt-douzième',
      'quatre-vingt-treizième',
      'quatre-vingt-quatorzième',
      'quatre-vingt-quinzième',
      'quatre-vingt-seizième',
      'quatre-vingt-dix-septième',
      'quatre-vingt-dix-huitième',
      'quatre-vingt-dix-neuvième',
      'centième',
      'cent-unième',
      'cent-deuxième',
      'cent-troisième',
      'cent-quatrième',
      'cent-cinquième',
      'cent-sixième',
      'cent-septième',
      'cent-huitième',
      'cent-neuvième',
      'cent-dixième',
      'cent-onzième',
      'cent-douzième',
      'cent-treizième',
      'cent-quatorzième',
      'cent-quinzième',
      'cent-seizième',
      'cent-dix-septième',
      'cent-dix-huitième',
      'cent-dix-neuvième',
      'cent-vingtième',
      'cent-vingt-et-unième',
      'cent-vingt-deuxième',
      'cent-vingt-troisième',
      'cent-vingt-quatrième',
      'cent-vingt-cinquième',
      'cent-vingt-sixième',
      'cent-vingt-septième',
      'cent-vingt-huitième',
      'cent-vingt-neuvième',
      'cent-trentième',
      'cent-trente-et-unième',
    ]

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

    ordinal.forEach((ordinalWord, index) => {
      expect(frenchOrdinalWordsToWords(ordinalWord)).toBe(arr[index])
    })
  })

  test('converts hundreds ordinal words back to cardinal words', () => {
    expect(frenchOrdinalWordsToWords('deux-centième')).toBe('deux-cents')
    expect(frenchOrdinalWordsToWords('deux-cent-unième')).toBe('deux-cent-un')
    expect(
      frenchOrdinalWordsToWords('neuf-cent-quatre-vingt-dix-neuvième')
    ).toBe('neuf-cent-quatre-vingt-dix-neuf')
  })

  test('converts thousands ordinal words back to cardinal words', () => {
    expect(frenchOrdinalWordsToWords('millième')).toBe('mille')
    expect(frenchOrdinalWordsToWords('mille-premier')).toBe('mille-un')
    expect(frenchOrdinalWordsToWords('mille-centième')).toBe('mille-cent')
    expect(frenchOrdinalWordsToWords('mille-cent-unième')).toBe('mille-cent-un')
    expect(frenchOrdinalWordsToWords('deux-millième')).toBe('deux-mille')
    expect(frenchOrdinalWordsToWords('deux-mille-unième')).toBe('deux-mille-un')
    expect(frenchOrdinalWordsToWords('dix-millième')).toBe('dix-mille')
    expect(frenchOrdinalWordsToWords('cent-millième')).toBe('cent-mille')
    expect(
      frenchOrdinalWordsToWords(
        'neuf-cent-quatre-vingt-dix-neuf-mille-neuf-cent-quatre-vingt-dix-neuvième'
      )
    ).toBe(
      'neuf-cent-quatre-vingt-dix-neuf-mille-neuf-cent-quatre-vingt-dix-neuf'
    )
  })

  test('converts millions ordinal words back to cardinal words', () => {
    expect(frenchOrdinalWordsToWords('un-millionième')).toBe('un-million')
    expect(frenchOrdinalWordsToWords('deux-millionième')).toBe('deux-millions')
    expect(frenchOrdinalWordsToWords('un-million-unième')).toBe('un-million-un')
    expect(frenchOrdinalWordsToWords('un-million-centième')).toBe(
      'un-million-cent'
    )
    expect(
      frenchOrdinalWordsToWords(
        'neuf-millions-neuf-cent-quatre-vingt-dix-neuf-mille-neuf-cent-quatre-vingt-dix-neuvième'
      )
    ).toBe(
      'neuf-millions-neuf-cent-quatre-vingt-dix-neuf-mille-neuf-cent-quatre-vingt-dix-neuf'
    )
  })

  test('converts billions ordinal words back to cardinal words', () => {
    expect(frenchOrdinalWordsToWords('un-milliardième')).toBe('un-milliard')
    expect(frenchOrdinalWordsToWords('deux-milliardième')).toBe(
      'deux-milliards'
    )
    expect(frenchOrdinalWordsToWords('un-milliard-unième')).toBe(
      'un-milliard-un'
    )
    expect(
      frenchOrdinalWordsToWords(
        'un-milliard-deux-cent-trente-quatre-millions-cinq-cent-soixante-sept-mille-huit-cent-quatre-vingt-dixième'
      )
    ).toBe(
      'un-milliard-deux-cent-trente-quatre-millions-cinq-cent-soixante-sept-mille-huit-cent-quatre-vingt-dix'
    )
  })

  test('converts negative numbers ordinal words back to cardinal words', () => {
    expect(frenchOrdinalWordsToWords('moins-premier')).toBe('moins-un')
    expect(frenchOrdinalWordsToWords('moins-quarante-deuxième')).toBe(
      'moins-quarante-deux'
    )
    expect(frenchOrdinalWordsToWords('moins-un-millionième')).toBe(
      'moins-un-million'
    )
  })

  test('converts edge cases with zeros ordinal words back to cardinal words', () => {
    expect(frenchOrdinalWordsToWords('un-milliard-dixième')).toBe(
      'un-milliard-dix'
    )
    expect(
      frenchOrdinalWordsToWords('un-milliard-un-million-mille-unième')
    ).toBe('un-milliard-un-million-mille-un')
    expect(frenchOrdinalWordsToWords('un-milliard-millième')).toBe(
      'un-milliard-mille'
    )
  })

  test('converts alternative hyphenation forms ordinal words back to cardinal words', () => {
    expect(frenchOrdinalWordsToWords('cent unième')).toBe('cent un')
    expect(frenchOrdinalWordsToWords('vingt et-unième')).toBe('vingt et-un')
    expect(frenchOrdinalWordsToWords('deux centième')).toBe('deux cents')
    expect(frenchOrdinalWordsToWords('mille-deux cent-trente quatrième')).toBe(
      'mille-deux cent-trente quatre'
    )
    expect(
      frenchOrdinalWordsToWords(
        'un milliard-deux cent-trente quatre-millions cinq-cent soixante-sept mille-huit cent-quatre vingt-dixième'
      )
    ).toBe(
      'un milliard-deux cent-trente quatre-millions cinq-cent soixante-sept mille-huit cent-quatre vingt-dix'
    )
  })
})
