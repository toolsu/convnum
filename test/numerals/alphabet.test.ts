import { describe, expect, test } from 'bun:test'
import {
  fromCyrillicLetter,
  fromGreekLetter,
  fromGreekLetterEnglishName,
  fromHebrewLetter,
  fromLatinLetter,
  fromNatoPhonetic,
  toCyrillicLetter,
  toGreekLetter,
  toGreekLetterEnglishName,
  toHebrewLetter,
  toLatinLetter,
  toNatoPhonetic,
} from '../../src'

describe('Alphabet-related conversions', () => {
  describe('Latin letter conversions', () => {
    test('toLatinLetter basic cases', () => {
      expect(toLatinLetter(1)).toBe('a')
      expect(toLatinLetter(26)).toBe('z')
      expect(toLatinLetter(1, true)).toBe('A')
      expect(toLatinLetter(26, true)).toBe('Z')
    })

    test('toLatinLetter all letters lowercase', () => {
      const expected = 'abcdefghijklmnopqrstuvwxyz'
      for (let i = 1; i <= expected.length; i++) {
        expect(toLatinLetter(i)).toBe(expected[i - 1])
      }
    })

    test('toLatinLetter all letters uppercase', () => {
      const expected = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      for (let i = 1; i <= expected.length; i++) {
        expect(toLatinLetter(i, true)).toBe(expected[i - 1])
      }
    })

    test('toLatinLetter invalid inputs', () => {
      expect(() => toLatinLetter(0)).toThrow()
      expect(() => toLatinLetter(27)).toThrow()
      expect(() => toLatinLetter(-1)).toThrow()
      expect(() => toLatinLetter(1.5)).toThrow()
    })

    test('fromLatinLetter basic cases', () => {
      expect(fromLatinLetter('a')).toBe(1)
      expect(fromLatinLetter('z')).toBe(26)
      expect(fromLatinLetter('A')).toBe(1)
      expect(fromLatinLetter('Z')).toBe(26)
    })

    test('fromLatinLetter all letters', () => {
      const lowercase = 'abcdefghijklmnopqrstuvwxyz'
      const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      for (let i = 0; i < 26; i++) {
        expect(fromLatinLetter(lowercase[i])).toBe(i + 1)
        expect(fromLatinLetter(uppercase[i])).toBe(i + 1)
      }
    })

    test('fromLatinLetter invalid inputs', () => {
      expect(() => fromLatinLetter('')).toThrow()
      expect(() => fromLatinLetter('aa')).toThrow()
      expect(() => fromLatinLetter('1')).toThrow()
      expect(() => fromLatinLetter('!')).toThrow()
      expect(() => fromLatinLetter('@')).toThrow()
      expect(() => fromLatinLetter('[')).toThrow()
      expect(() => fromLatinLetter('`')).toThrow()
      expect(() => fromLatinLetter('{')).toThrow()
    })
  })

  describe('Greek letter conversions', () => {
    test('toGreekLetter basic cases', () => {
      expect(toGreekLetter(1)).toBe('α')
      expect(toGreekLetter(24)).toBe('ω')
      expect(toGreekLetter(1, true)).toBe('Α')
      expect(toGreekLetter(24, true)).toBe('Ω')
    })

    test('toGreekLetter all letters lowercase', () => {
      const expected = 'αβγδεζηθικλμνξοπρστυφχψω'
      for (let i = 1; i <= expected.length; i++) {
        expect(toGreekLetter(i)).toBe(expected[i - 1])
      }
    })

    test('toGreekLetter all letters uppercase', () => {
      const expected = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ'
      for (let i = 1; i <= expected.length; i++) {
        expect(toGreekLetter(i, true)).toBe(expected[i - 1])
      }
    })

    test('toGreekLetter invalid inputs', () => {
      expect(() => toGreekLetter(0)).toThrow()
      expect(() => toGreekLetter(25)).toThrow()
      expect(() => toGreekLetter(-1)).toThrow()
      expect(() => toGreekLetter(1.5)).toThrow()
    })

    test('fromGreekLetter basic cases', () => {
      expect(fromGreekLetter('α')).toBe(1)
      expect(fromGreekLetter('ω')).toBe(24)
      expect(fromGreekLetter('Α')).toBe(1)
      expect(fromGreekLetter('Ω')).toBe(24)
    })

    test('fromGreekLetter all letters', () => {
      const lowercase = 'αβγδεζηθικλμνξοπρστυφχψω'
      const uppercase = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ'
      for (let i = 0; i < 24; i++) {
        expect(fromGreekLetter(lowercase[i])).toBe(i + 1)
        expect(fromGreekLetter(uppercase[i])).toBe(i + 1)
      }
    })

    test('fromGreekLetter special inputs', () => {
      expect(fromGreekLetter('ρ')).toBe(17)
      expect(fromGreekLetter('σ')).toBe(18)
      expect(fromGreekLetter('τ')).toBe(19)

      expect(fromGreekLetter('ς')).toBe(18)
      expect(fromGreekLetter('Σ')).toBe(18)
    })

    test('fromGreekLetter invalid inputs', () => {
      expect(() => fromGreekLetter('')).toThrow()
      expect(() => fromGreekLetter('αα')).toThrow()
      expect(() => fromGreekLetter('a')).toThrow()
      expect(() => fromGreekLetter('1')).toThrow()
      expect(() => fromGreekLetter('𝛂')).toThrow()
      expect(() => fromGreekLetter('Ἅ')).toThrow()
      expect(() => fromGreekLetter('ΰ')).toThrow()
      expect(() => fromGreekLetter('ϊ')).toThrow()
      expect(() => fromGreekLetter('ΐ')).toThrow()
      expect(() => fromGreekLetter('Ϊ')).toThrow()
    })
  })

  describe('Cyrillic letter conversions', () => {
    test('toCyrillicLetter basic cases', () => {
      expect(toCyrillicLetter(1)).toBe('а')
      expect(toCyrillicLetter(33)).toBe('я')
      expect(toCyrillicLetter(1, true)).toBe('А')
      expect(toCyrillicLetter(33, true)).toBe('Я')
      expect(toCyrillicLetter(7)).toBe('ё')
      expect(toCyrillicLetter(7, true)).toBe('Ё')
    })

    test('toCyrillicLetter all letters lowercase', () => {
      const expected = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'
      for (let i = 1; i <= expected.length; i++) {
        expect(toCyrillicLetter(i)).toBe(expected[i - 1])
      }
    })

    test('toCyrillicLetter all letters uppercase', () => {
      const expected = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'
      for (let i = 1; i <= expected.length; i++) {
        expect(toCyrillicLetter(i, true)).toBe(expected[i - 1])
      }
    })

    test('toCyrillicLetter invalid inputs', () => {
      expect(() => toCyrillicLetter(0)).toThrow()
      expect(() => toCyrillicLetter(34)).toThrow()
      expect(() => toCyrillicLetter(-1)).toThrow()
      expect(() => toCyrillicLetter(1.5)).toThrow()
    })

    test('fromCyrillicLetter basic cases', () => {
      expect(fromCyrillicLetter('а')).toBe(1)
      expect(fromCyrillicLetter('я')).toBe(33)
      expect(fromCyrillicLetter('А')).toBe(1)
      expect(fromCyrillicLetter('Я')).toBe(33)
      expect(fromCyrillicLetter('ё')).toBe(7)
      expect(fromCyrillicLetter('Ё')).toBe(7)
    })

    test('fromCyrillicLetter all letters', () => {
      const lowercase = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'
      const uppercase = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'
      for (let i = 0; i < 33; i++) {
        expect(fromCyrillicLetter(lowercase[i])).toBe(i + 1)
        expect(fromCyrillicLetter(uppercase[i])).toBe(i + 1)
      }
    })

    test('fromCyrillicLetter special case for ё/Ё', () => {
      expect(fromCyrillicLetter('е')).toBe(6)
      expect(fromCyrillicLetter('ё')).toBe(7)
      expect(fromCyrillicLetter('ж')).toBe(8)
      expect(fromCyrillicLetter('Е')).toBe(6)
      expect(fromCyrillicLetter('Ё')).toBe(7)
      expect(fromCyrillicLetter('Ж')).toBe(8)
    })

    test('fromCyrillicLetter invalid inputs', () => {
      expect(() => fromCyrillicLetter('')).toThrow()
      expect(() => fromCyrillicLetter('аа')).toThrow()
      expect(() => fromCyrillicLetter('a')).toThrow()
      expect(() => fromCyrillicLetter('1')).toThrow()
      expect(() => fromCyrillicLetter('!')).toThrow()
      expect(() => fromCyrillicLetter('α')).toThrow()
      expect(() => fromCyrillicLetter('č')).toThrow() // Latin with diacritics
      expect(() => fromCyrillicLetter('ґ')).toThrow() // Ukrainian-specific Cyrillic
      expect(() => fromCyrillicLetter('ђ')).toThrow() // Serbian-specific Cyrillic
    })
  })

  describe('NATO phonetic alphabet conversions', () => {
    test('toNatoPhonetic basic cases', () => {
      expect(toNatoPhonetic(1)).toBe('Alfa')
      expect(toNatoPhonetic(26)).toBe('Zulu')
    })

    test('toNatoPhonetic all words', () => {
      const expected = [
        'Alfa',
        'Bravo',
        'Charlie',
        'Delta',
        'Echo',
        'Foxtrot',
        'Golf',
        'Hotel',
        'India',
        'Juliett',
        'Kilo',
        'Lima',
        'Mike',
        'November',
        'Oscar',
        'Papa',
        'Quebec',
        'Romeo',
        'Sierra',
        'Tango',
        'Uniform',
        'Victor',
        'Whiskey',
        'X-ray',
        'Yankee',
        'Zulu',
      ]
      for (let i = 1; i <= expected.length; i++) {
        expect(toNatoPhonetic(i)).toBe(expected[i - 1])
      }
    })

    test('toNatoPhonetic invalid inputs', () => {
      expect(() => toNatoPhonetic(0)).toThrow()
      expect(() => toNatoPhonetic(27)).toThrow()
      expect(() => toNatoPhonetic(-1)).toThrow()
      expect(() => toNatoPhonetic(1.5)).toThrow()
    })

    test('fromNatoPhonetic basic cases', () => {
      expect(fromNatoPhonetic('Alfa')).toBe(1)
      expect(fromNatoPhonetic('Zulu')).toBe(26)
    })

    test('fromNatoPhonetic case insensitive', () => {
      expect(fromNatoPhonetic('alfa')).toBe(1)
      expect(fromNatoPhonetic('zulu')).toBe(26)
      expect(fromNatoPhonetic('ALPHA')).toBe(1)
      expect(fromNatoPhonetic('ZULU')).toBe(26)
    })

    test('fromNatoPhonetic all words', () => {
      const words = [
        'Alfa',
        'Bravo',
        'Charlie',
        'Delta',
        'Echo',
        'Foxtrot',
        'Golf',
        'Hotel',
        'India',
        'Juliett',
        'Kilo',
        'Lima',
        'Mike',
        'November',
        'Oscar',
        'Papa',
        'Quebec',
        'Romeo',
        'Sierra',
        'Tango',
        'Uniform',
        'Victor',
        'Whiskey',
        'X-ray',
        'Yankee',
        'Zulu',
      ]
      for (let i = 0; i < 26; i++) {
        expect(fromNatoPhonetic(words[i])).toBe(i + 1)
      }
    })

    test('fromNatoPhonetic aliases', () => {
      expect(fromNatoPhonetic('Alpha')).toBe(1)
      expect(fromNatoPhonetic('Juliet')).toBe(10)
      expect(fromNatoPhonetic('Xray')).toBe(24)
      // Test case insensitivity
      expect(fromNatoPhonetic('ALPHA')).toBe(1)
      expect(fromNatoPhonetic('juliet')).toBe(10)
      expect(fromNatoPhonetic('XRAY')).toBe(24)
    })

    test('fromNatoPhonetic invalid inputs', () => {
      expect(() => fromNatoPhonetic('')).toThrow()
      expect(() => fromNatoPhonetic('NotAWord')).toThrow()
    })
  })

  describe('Hebrew letter conversions', () => {
    test('toHebrewLetter basic cases', () => {
      expect(toHebrewLetter(1)).toBe('א')
      expect(toHebrewLetter(22)).toBe('ת')
    })

    test('toHebrewLetter all letters', () => {
      const expected = 'אבגדהוזחטיכלמנסעפצקרשת'
      for (let i = 1; i <= expected.length; i++) {
        expect(toHebrewLetter(i)).toBe(expected[i - 1])
      }
    })

    test('toHebrewLetter specific letters', () => {
      expect(toHebrewLetter(1)).toBe('א') // Aleph
      expect(toHebrewLetter(2)).toBe('ב') // Bet
      expect(toHebrewLetter(3)).toBe('ג') // Gimel
      expect(toHebrewLetter(4)).toBe('ד') // Dalet
      expect(toHebrewLetter(10)).toBe('י') // Yod
      expect(toHebrewLetter(11)).toBe('כ') // Kaf
      expect(toHebrewLetter(12)).toBe('ל') // Lamed
      expect(toHebrewLetter(13)).toBe('מ') // Mem
      expect(toHebrewLetter(22)).toBe('ת') // Tav
    })

    test('toHebrewLetter invalid inputs', () => {
      expect(() => toHebrewLetter(0)).toThrow()
      expect(() => toHebrewLetter(23)).toThrow()
      expect(() => toHebrewLetter(-1)).toThrow()
      expect(() => toHebrewLetter(1.5)).toThrow()
    })

    test('fromHebrewLetter basic cases', () => {
      expect(fromHebrewLetter('א')).toBe(1)
      expect(fromHebrewLetter('ת')).toBe(22)
    })

    test('fromHebrewLetter all letters', () => {
      const letters = 'אבגדהוזחטיכלמנסעפצקרשת'
      for (let i = 0; i < 22; i++) {
        expect(fromHebrewLetter(letters[i])).toBe(i + 1)
      }
    })

    test('fromHebrewLetter specific letters', () => {
      expect(fromHebrewLetter('א')).toBe(1) // Aleph
      expect(fromHebrewLetter('ב')).toBe(2) // Bet
      expect(fromHebrewLetter('ג')).toBe(3) // Gimel
      expect(fromHebrewLetter('ד')).toBe(4) // Dalet
      expect(fromHebrewLetter('י')).toBe(10) // Yod
      expect(fromHebrewLetter('כ')).toBe(11) // Kaf
      expect(fromHebrewLetter('ל')).toBe(12) // Lamed
      expect(fromHebrewLetter('מ')).toBe(13) // Mem
      expect(fromHebrewLetter('ת')).toBe(22) // Tav
    })

    test('fromHebrewLetter invalid inputs', () => {
      expect(() => fromHebrewLetter('')).toThrow()
      expect(() => fromHebrewLetter('אב')).toThrow()
      expect(() => fromHebrewLetter('a')).toThrow()
      expect(() => fromHebrewLetter('1')).toThrow()
      expect(() => fromHebrewLetter('!')).toThrow()
      expect(() => fromHebrewLetter('α')).toThrow()
      expect(() => fromHebrewLetter('א́')).toThrow() // Hebrew with diacritic
      expect(() => fromHebrewLetter('ך')).toThrow() // Final Kaf (not in standard 22)
      expect(() => fromHebrewLetter('ם')).toThrow() // Final Mem (not in standard 22)
      expect(() => fromHebrewLetter('ן')).toThrow() // Final Nun (not in standard 22)
      expect(() => fromHebrewLetter('ף')).toThrow() // Final Pe (not in standard 22)
      expect(() => fromHebrewLetter('ץ')).toThrow() // Final Tzade (not in standard 22)
    })
  })

  describe('Greek letter English name conversions', () => {
    test('toGreekLetterEnglishName basic cases', () => {
      expect(toGreekLetterEnglishName(1)).toBe('Alpha')
      expect(toGreekLetterEnglishName(24)).toBe('Omega')
    })

    test('toGreekLetterEnglishName all names', () => {
      const expected = [
        'Alpha',
        'Beta',
        'Gamma',
        'Delta',
        'Epsilon',
        'Zeta',
        'Eta',
        'Theta',
        'Iota',
        'Kappa',
        'Lambda',
        'Mu',
        'Nu',
        'Xi',
        'Omicron',
        'Pi',
        'Rho',
        'Sigma',
        'Tau',
        'Upsilon',
        'Phi',
        'Chi',
        'Psi',
        'Omega',
      ]
      for (let i = 1; i <= expected.length; i++) {
        expect(toGreekLetterEnglishName(i)).toBe(expected[i - 1])
      }
    })

    test('toGreekLetterEnglishName specific names', () => {
      expect(toGreekLetterEnglishName(1)).toBe('Alpha')
      expect(toGreekLetterEnglishName(5)).toBe('Epsilon')
      expect(toGreekLetterEnglishName(10)).toBe('Kappa')
      expect(toGreekLetterEnglishName(15)).toBe('Omicron')
      expect(toGreekLetterEnglishName(16)).toBe('Pi')
      expect(toGreekLetterEnglishName(17)).toBe('Rho')
      expect(toGreekLetterEnglishName(18)).toBe('Sigma')
      expect(toGreekLetterEnglishName(21)).toBe('Phi')
      expect(toGreekLetterEnglishName(24)).toBe('Omega')
    })

    test('toGreekLetterEnglishName invalid inputs', () => {
      expect(() => toGreekLetterEnglishName(0)).toThrow()
      expect(() => toGreekLetterEnglishName(25)).toThrow()
      expect(() => toGreekLetterEnglishName(-1)).toThrow()
      expect(() => toGreekLetterEnglishName(1.5)).toThrow()
    })

    test('fromGreekLetterEnglishName basic cases', () => {
      expect(fromGreekLetterEnglishName('Alpha')).toBe(1)
      expect(fromGreekLetterEnglishName('Omega')).toBe(24)
    })

    test('fromGreekLetterEnglishName case insensitive', () => {
      expect(fromGreekLetterEnglishName('alpha')).toBe(1)
      expect(fromGreekLetterEnglishName('omega')).toBe(24)
      expect(fromGreekLetterEnglishName('ALPHA')).toBe(1)
      expect(fromGreekLetterEnglishName('OMEGA')).toBe(24)
      expect(fromGreekLetterEnglishName('AlPhA')).toBe(1)
      expect(fromGreekLetterEnglishName('oMeGa')).toBe(24)
    })

    test('fromGreekLetterEnglishName all names', () => {
      const names = [
        'Alpha',
        'Beta',
        'Gamma',
        'Delta',
        'Epsilon',
        'Zeta',
        'Eta',
        'Theta',
        'Iota',
        'Kappa',
        'Lambda',
        'Mu',
        'Nu',
        'Xi',
        'Omicron',
        'Pi',
        'Rho',
        'Sigma',
        'Tau',
        'Upsilon',
        'Phi',
        'Chi',
        'Psi',
        'Omega',
      ]
      for (let i = 0; i < 24; i++) {
        expect(fromGreekLetterEnglishName(names[i])).toBe(i + 1)
        expect(fromGreekLetterEnglishName(names[i].toLowerCase())).toBe(i + 1)
        expect(fromGreekLetterEnglishName(names[i].toUpperCase())).toBe(i + 1)
      }
    })

    test('fromGreekLetterEnglishName specific names', () => {
      expect(fromGreekLetterEnglishName('Alpha')).toBe(1)
      expect(fromGreekLetterEnglishName('Epsilon')).toBe(5)
      expect(fromGreekLetterEnglishName('Kappa')).toBe(10)
      expect(fromGreekLetterEnglishName('Omicron')).toBe(15)
      expect(fromGreekLetterEnglishName('Pi')).toBe(16)
      expect(fromGreekLetterEnglishName('Rho')).toBe(17)
      expect(fromGreekLetterEnglishName('Sigma')).toBe(18)
      expect(fromGreekLetterEnglishName('Phi')).toBe(21)
      expect(fromGreekLetterEnglishName('Omega')).toBe(24)
    })

    test('fromGreekLetterEnglishName invalid inputs', () => {
      expect(() => fromGreekLetterEnglishName('')).toThrow()
      expect(() => fromGreekLetterEnglishName('NotAGreekLetter')).toThrow()
      expect(() => fromGreekLetterEnglishName('Alpha Beta')).toThrow()
      expect(() => fromGreekLetterEnglishName('α')).toThrow() // Greek letter, not English name
      expect(() => fromGreekLetterEnglishName('Beta1')).toThrow()
      expect(() => fromGreekLetterEnglishName('Alphas')).toThrow()
      expect(() => fromGreekLetterEnglishName('1')).toThrow()
      expect(() => fromGreekLetterEnglishName('!')).toThrow()
    })
  })
})
