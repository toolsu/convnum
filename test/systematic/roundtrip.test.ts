import { describe, expect, test } from 'bun:test'
import {
  chineseFinancialToWords,
  chineseWordsToFinancial,
  convertFrom,
  convertTo,
  englishOrdinalWordsToWords,
  englishWordsToOrdinalWords,
  frenchOrdinalWordsToWords,
  frenchWordsToOrdinalWords,
  fromArabicNumerals,
  fromBase,
  fromChineseWords,
  fromCyrillicLetter,
  fromEnglishOrdinalAbbr,
  fromEnglishWords,
  fromFrenchOrdinalAbbr,
  fromFrenchWords,
  fromGreekLetter,
  fromGreekLetterEnglishName,
  fromHebrewLetter,
  fromLatinLetter,
  fromNatoPhonetic,
  fromRoman,
  toArabicNumerals,
  toBase,
  toChineseWords,
  toCyrillicLetter,
  toEnglishOrdinalAbbr,
  toEnglishWords,
  toFrenchOrdinalAbbr,
  toFrenchWords,
  toGreekLetter,
  toGreekLetterEnglishName,
  toHebrewLetter,
  toLatinLetter,
  toNatoPhonetic,
  toRoman,
  validateChineseWords,
  validateEnglishWords,
  validateFrenchWords,
} from '../../src'

/**
 * Systematic large-range bidirectional roundtrip tests. These exercise every
 * supported value across the full documented range in BOTH directions, rather
 * than spot checks, and would catch any single-value regression.
 */

describe('English words — exhaustive bidirectional roundtrip', () => {
  test('from(to(n)) === n for every integer 0..20000 in US and UK style', () => {
    for (let n = 0; n <= 20000; n++) {
      for (const uk of [false, true]) {
        const words = toEnglishWords(n, uk)
        expect(fromEnglishWords(words)).toBe(n)
      }
    }
  })

  test('every strict output passes loose validation (loose is a superset of strict)', () => {
    for (let n = 0; n <= 5000; n++) {
      for (const uk of [false, true]) {
        expect(validateEnglishWords(toEnglishWords(n, uk), true)).toBe(true)
        expect(validateEnglishWords(toEnglishWords(n, uk), false)).toBe(true)
      }
    }
  })

  test('negatives and large magnitudes roundtrip', () => {
    for (const n of [
      -1,
      -21,
      -100,
      -1000000,
      -123456789,
      1e6,
      1e9,
      1e12,
      1e15,
      1e18,
      123456789012345,
      Number.MAX_SAFE_INTEGER,
    ]) {
      for (const uk of [false, true]) {
        expect(fromEnglishWords(toEnglishWords(n, uk))).toBe(n)
      }
    }
  })
})

describe('English ordinal words & abbreviations — roundtrip', () => {
  test('ordinal words roundtrip 0..2000 both styles', () => {
    for (let n = 0; n <= 2000; n++) {
      for (const uk of [false, true]) {
        const cardinal = toEnglishWords(n, uk)
        const ordinal = englishWordsToOrdinalWords(cardinal)
        expect(fromEnglishWords(englishOrdinalWordsToWords(ordinal))).toBe(n)
        expect(convertFrom(ordinal, 'english_ordinal_words')).toBe(n)
      }
    }
  })

  test('ordinal abbreviations roundtrip -2000..20000 (incl. the teens rule)', () => {
    for (let n = -2000; n <= 20000; n++) {
      expect(fromEnglishOrdinalAbbr(toEnglishOrdinalAbbr(n))).toBe(n)
    }
  })

  test('teens always take "th"', () => {
    for (const n of [11, 12, 13, 111, 112, 113, 1011, 1012, 1013, 2011]) {
      expect(toEnglishOrdinalAbbr(n).endsWith('th')).toBe(true)
    }
    expect(toEnglishOrdinalAbbr(21)).toBe('21st')
    expect(toEnglishOrdinalAbbr(22)).toBe('22nd')
    expect(toEnglishOrdinalAbbr(23)).toBe('23rd')
    expect(toEnglishOrdinalAbbr(101)).toBe('101st')
  })
})

describe('French words — exhaustive bidirectional roundtrip', () => {
  test('from(to(n)) === n for every integer 0..20000', () => {
    for (let n = 0; n <= 20000; n++) {
      expect(fromFrenchWords(toFrenchWords(n))).toBe(n)
    }
  })

  test('every output passes strict validation', () => {
    for (let n = 0; n <= 5000; n++) {
      expect(validateFrenchWords(toFrenchWords(n))).toBe(true)
    }
  })

  test('negatives and large magnitudes roundtrip', () => {
    for (const n of [-1, -80, -100, -1000000, 1e6, 1e9, 123456789]) {
      expect(fromFrenchWords(toFrenchWords(n))).toBe(n)
    }
  })
})

describe('French ordinal words & abbreviations — roundtrip', () => {
  test('cardinal -> ordinal -> cardinal roundtrip 0..20000', () => {
    for (let n = 0; n <= 20000; n++) {
      const cardinal = toFrenchWords(n)
      const ordinal = frenchWordsToOrdinalWords(cardinal)
      expect(frenchOrdinalWordsToWords(ordinal)).toBe(cardinal)
    }
  })

  test('ordinal words convert back to the right number 0..3000', () => {
    for (let n = 0; n <= 3000; n++) {
      const ordinal = frenchWordsToOrdinalWords(toFrenchWords(n))
      expect(convertFrom(ordinal, 'french_ordinal_words')).toBe(n)
    }
  })

  test('ordinal abbreviations roundtrip -2000..2000', () => {
    for (let n = -2000; n <= 2000; n++) {
      expect(fromFrenchOrdinalAbbr(toFrenchOrdinalAbbr(n))).toBe(n)
    }
  })
})

describe('Chinese words — exhaustive bidirectional roundtrip', () => {
  test('from(to(n)) === n for every integer 0..30000', () => {
    for (let n = 0; n <= 30000; n++) {
      expect(fromChineseWords(toChineseWords(n))).toBe(n)
    }
  })

  test('structured large numbers roundtrip', () => {
    const bigs = [
      1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13, 1e14, 10001, 100010,
      1000100, 100000001, 100010001, 120034005, 1000000000001,
    ]
    for (const n of bigs) {
      expect(fromChineseWords(toChineseWords(n))).toBe(n)
    }
  })

  test('traditional output roundtrips through fromChineseWords', () => {
    for (let n = 0; n <= 3000; n++) {
      expect(fromChineseWords(toChineseWords(n, true))).toBe(n)
    }
  })

  test('every simplified output passes strict validation', () => {
    for (let n = 0; n <= 5000; n++) {
      expect(validateChineseWords(toChineseWords(n))).toBe(true)
    }
  })

  test('financial <-> words roundtrip 0..3000', () => {
    for (let n = 0; n <= 3000; n++) {
      const words = toChineseWords(n)
      const financial = chineseWordsToFinancial(words)
      expect(fromChineseWords(chineseFinancialToWords(financial))).toBe(n)
    }
  })
})

describe('Roman numerals — exhaustive roundtrip 1..3999', () => {
  test('from(to(n)) === n for every n in 1..3999 (upper, lower, mixed)', () => {
    for (let n = 1; n <= 3999; n++) {
      const roman = toRoman(n)
      expect(fromRoman(roman)).toBe(n)
      expect(fromRoman(roman.toLowerCase())).toBe(n)
    }
  })
})

describe('Number bases — roundtrip for every base 2..36', () => {
  test('from(to(n, base), base) === n across boundaries and randoms', () => {
    for (let base = 2; base <= 36; base++) {
      const values = [
        0,
        1,
        base - 1,
        base,
        base * base,
        base * base * base,
        255,
        65535,
        1 << 20,
        -1,
        -base,
        -12345,
        9007199254740991,
      ]
      for (const n of values) {
        expect(fromBase(toBase(n, base), base)).toBe(n)
      }
    }
  })

  test('bin/oct/hex via convertTo/convertFrom roundtrip', () => {
    for (let n = -5000; n <= 5000; n++) {
      for (const t of ['binary', 'octal', 'hexadecimal'] as const) {
        expect(convertFrom(convertTo(n, t), t)).toBe(n)
      }
    }
  })
})

describe('Eastern Arabic numerals — roundtrip', () => {
  test('integers -50000..50000 roundtrip', () => {
    for (let n = -50000; n <= 50000; n += 1) {
      expect(fromArabicNumerals(toArabicNumerals(n))).toBe(n)
    }
  })

  test('decimals roundtrip', () => {
    for (const n of [0.5, -0.25, 123.456, -0.0001]) {
      expect(fromArabicNumerals(toArabicNumerals(n))).toBe(n)
    }
  })
})

describe('Alphabets — full-range roundtrip', () => {
  test('Latin 1..26 upper and lower', () => {
    for (let n = 1; n <= 26; n++) {
      expect(fromLatinLetter(toLatinLetter(n))).toBe(n)
      expect(fromLatinLetter(toLatinLetter(n, true))).toBe(n)
    }
  })

  test('Greek 1..24 upper and lower (incl. final sigma folding)', () => {
    for (let n = 1; n <= 24; n++) {
      expect(fromGreekLetter(toGreekLetter(n))).toBe(n)
      expect(fromGreekLetter(toGreekLetter(n, true))).toBe(n)
    }
    expect(fromGreekLetter('ς')).toBe(18) // final sigma folds to sigma
  })

  test('Greek English names 1..24', () => {
    for (let n = 1; n <= 24; n++) {
      expect(fromGreekLetterEnglishName(toGreekLetterEnglishName(n))).toBe(n)
    }
  })

  test('Cyrillic 1..33 upper and lower (incl. Ё at 7)', () => {
    for (let n = 1; n <= 33; n++) {
      expect(fromCyrillicLetter(toCyrillicLetter(n))).toBe(n)
      expect(fromCyrillicLetter(toCyrillicLetter(n, true))).toBe(n)
    }
    expect(fromCyrillicLetter('ё')).toBe(7)
    expect(fromCyrillicLetter('Ё')).toBe(7)
  })

  test('Hebrew 1..22', () => {
    for (let n = 1; n <= 22; n++) {
      expect(fromHebrewLetter(toHebrewLetter(n))).toBe(n)
    }
  })

  test('NATO phonetic 1..26 (incl. Alfa/Juliett/X-ray)', () => {
    for (let n = 1; n <= 26; n++) {
      expect(fromNatoPhonetic(toNatoPhonetic(n))).toBe(n)
    }
    expect(fromNatoPhonetic('Alpha')).toBe(1)
    expect(fromNatoPhonetic('Juliet')).toBe(10)
    expect(fromNatoPhonetic('Xray')).toBe(24)
  })
})
