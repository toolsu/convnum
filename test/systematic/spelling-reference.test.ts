import { describe, expect, test } from 'bun:test'
import { toChineseWords } from '../../src/numerals/chinese'
import { toEnglishWords } from '../../src/numerals/english'
import { englishWordsToOrdinalWords } from '../../src/numerals/englishOrdinal'
import { toFrenchWords } from '../../src/numerals/french'
import { frenchWordsToOrdinalWords } from '../../src/numerals/frenchOrdinal'

/**
 * Spelling-correctness tests against hand-verified authoritative references.
 * Bidirectional roundtrip cannot catch a *symmetric* misspelling (one where
 * to/from agree on a wrong form), so these pin the exact expected string at
 * every orthographically tricky boundary.
 */

describe('English cardinal spelling (US, no "and")', () => {
  const cases: [number, string][] = [
    [0, 'zero'],
    [7, 'seven'],
    [13, 'thirteen'],
    [20, 'twenty'],
    [21, 'twenty-one'],
    [45, 'forty-five'],
    [99, 'ninety-nine'],
    [100, 'one hundred'],
    [101, 'one hundred one'],
    [115, 'one hundred fifteen'],
    [200, 'two hundred'],
    [999, 'nine hundred ninety-nine'],
    [1000, 'one thousand'],
    [1001, 'one thousand one'],
    [1100, 'one thousand one hundred'],
    [1000000, 'one million'],
    [1000001, 'one million one'],
    [
      1234567,
      'one million two hundred thirty-four thousand five hundred sixty-seven',
    ],
  ]
  for (const [n, expected] of cases) {
    test(`${n} -> "${expected}"`, () => {
      expect(toEnglishWords(n, false)).toBe(expected)
    })
  }
})

describe('English cardinal spelling (UK, with "and")', () => {
  const cases: [number, string][] = [
    [100, 'one hundred'],
    [101, 'one hundred and one'],
    [115, 'one hundred and fifteen'],
    [1001, 'one thousand and one'],
    [1100, 'one thousand one hundred'],
    [1101, 'one thousand one hundred and one'],
    [1000001, 'one million and one'],
    // "and" must NOT appear before a scale-word final group:
    [1001000, 'one million one thousand'],
    [2050000, 'two million fifty thousand'],
  ]
  for (const [n, expected] of cases) {
    test(`${n} -> "${expected}"`, () => {
      expect(toEnglishWords(n, true)).toBe(expected)
    })
  }
})

describe('English ordinal words spelling', () => {
  const cases: [number, string][] = [
    [1, 'first'],
    [2, 'second'],
    [3, 'third'],
    [5, 'fifth'],
    [8, 'eighth'],
    [9, 'ninth'],
    [12, 'twelfth'],
    [20, 'twentieth'],
    [21, 'twenty-first'],
    [40, 'fortieth'],
    [100, 'one hundredth'],
    [101, 'one hundred first'],
    [1000, 'one thousandth'],
  ]
  for (const [n, expected] of cases) {
    test(`${n} -> "${expected}"`, () => {
      expect(englishWordsToOrdinalWords(toEnglishWords(n, false))).toBe(
        expected
      )
    })
  }
})

describe('French cardinal spelling (1990 reform, fully hyphenated)', () => {
  const cases: [number, string][] = [
    [0, 'zéro'],
    [1, 'un'],
    [16, 'seize'],
    [17, 'dix-sept'],
    [21, 'vingt-et-un'],
    [22, 'vingt-deux'],
    [31, 'trente-et-un'],
    [70, 'soixante-dix'],
    [71, 'soixante-et-onze'],
    [72, 'soixante-douze'],
    [80, 'quatre-vingts'], // plural s, terminal
    [81, 'quatre-vingt-un'], // no s before another number
    [90, 'quatre-vingt-dix'],
    [91, 'quatre-vingt-onze'], // no "et"
    [100, 'cent'],
    [101, 'cent-un'],
    [180, 'cent-quatre-vingts'],
    [200, 'deux-cents'], // plural s, terminal
    [201, 'deux-cent-un'], // no s before another number
    [1000, 'mille'],
    [1100, 'mille-cent'],
    [2000, 'deux-mille'], // mille invariable
    [80000, 'quatre-vingt-mille'], // vingt invariable before mille
    [200000, 'deux-cent-mille'], // cent invariable before mille
    [1000000, 'un-million'],
    [2000000, 'deux-millions'], // million is a noun -> plural s
    [80000000, 'quatre-vingts-millions'], // s kept before the noun "millions"
  ]
  for (const [n, expected] of cases) {
    test(`${n} -> "${expected}"`, () => {
      expect(toFrenchWords(n)).toBe(expected)
    })
  }
})

describe('French ordinal words spelling', () => {
  const cases: [number, string][] = [
    [1, 'premier'],
    [2, 'deuxième'],
    [4, 'quatrième'], // drops the final e
    [5, 'cinquième'], // adds u
    [9, 'neuvième'], // f -> v
    [11, 'onzième'],
    [21, 'vingt-et-unième'],
    [71, 'soixante-et-onzième'],
    [80, 'quatre-vingtième'],
    [100, 'centième'],
    [180, 'cent-quatre-vingtième'],
    [1000, 'millième'],
    [1001, 'mille-unième'], // NOT "mille-premier"
    [2001, 'deux-mille-unième'],
  ]
  for (const [n, expected] of cases) {
    test(`${n} -> "${expected}"`, () => {
      expect(frenchWordsToOrdinalWords(toFrenchWords(n))).toBe(expected)
    })
  }
})

describe('Chinese cardinal spelling (simplified, 零 insertion & 万/亿 grouping)', () => {
  const cases: [number, string][] = [
    [0, '零'],
    [10, '十'],
    [11, '十一'],
    [20, '二十'],
    [100, '一百'],
    [101, '一百零一'],
    [105, '一百零五'],
    [110, '一百一十'],
    [1000, '一千'],
    [1005, '一千零五'],
    [1050, '一千零五十'],
    [10000, '一万'],
    [10001, '一万零一'],
    [10005, '一万零五'],
    [10050, '一万零五十'],
    [100500, '十万零五百'],
    [100000000, '一亿'],
    [100000001, '一亿零一'],
    [120034005, '一亿二千零三万四千零五'],
    [1000000000000, '一万亿'],
  ]
  for (const [n, expected] of cases) {
    test(`${n} -> "${expected}"`, () => {
      expect(toChineseWords(n)).toBe(expected)
    })
  }
})
