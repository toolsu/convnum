import { describe, expect, test } from 'bun:test'
import { convertTo } from '../../src/utils/converters'

describe('convertTo with ukStyle functionality', () => {
  describe('english_words with ukStyle', () => {
    test('should convert with US style (ukStyle: 0)', () => {
      // US style: no "and" between hundreds and tens/units
      expect(convertTo(105, { type: 'english_words', ukStyle: 0 })).toBe(
        'one hundred five'
      )
      expect(convertTo(1005, { type: 'english_words', ukStyle: 0 })).toBe(
        'one thousand five'
      )
      expect(convertTo(1000005, { type: 'english_words', ukStyle: 0 })).toBe(
        'one million five'
      )
    })

    test('should convert with UK style (ukStyle: 1)', () => {
      // UK style: "and" between hundreds and tens/units
      expect(convertTo(105, { type: 'english_words', ukStyle: 1 })).toBe(
        'one hundred and five'
      )
      expect(convertTo(1005, { type: 'english_words', ukStyle: 1 })).toBe(
        'one thousand and five'
      )
      expect(convertTo(1000005, { type: 'english_words', ukStyle: 1 })).toBe(
        'one million and five'
      )
    })

    test('should convert with not sure style (ukStyle: 2, defaults to US style)', () => {
      // Not sure style: defaults to US style
      expect(convertTo(105, { type: 'english_words', ukStyle: 2 })).toBe(
        'one hundred five'
      )
      expect(convertTo(1005, { type: 'english_words', ukStyle: 2 })).toBe(
        'one thousand five'
      )
      expect(convertTo(1000005, { type: 'english_words', ukStyle: 2 })).toBe(
        'one million five'
      )
    })

    test('should convert with undefined ukStyle (defaults to US style)', () => {
      // Undefined ukStyle: defaults to US style
      expect(convertTo(105, { type: 'english_words' })).toBe('one hundred five')
      expect(convertTo(1005, { type: 'english_words' })).toBe(
        'one thousand five'
      )
      expect(convertTo(1000005, { type: 'english_words' })).toBe(
        'one million five'
      )
    })

    test('should combine ukStyle with case transformations', () => {
      expect(
        convertTo(105, { type: 'english_words', ukStyle: 0, case: 'upper' })
      ).toBe('ONE HUNDRED FIVE')
      expect(
        convertTo(105, { type: 'english_words', ukStyle: 1, case: 'upper' })
      ).toBe('ONE HUNDRED AND FIVE')
      expect(
        convertTo(105, { type: 'english_words', ukStyle: 0, case: 'title' })
      ).toBe('One Hundred Five')
      expect(
        convertTo(105, { type: 'english_words', ukStyle: 1, case: 'title' })
      ).toBe('One Hundred and Five')
      expect(
        convertTo(105, { type: 'english_words', ukStyle: 0, case: 'sentence' })
      ).toBe('One hundred five')
      expect(
        convertTo(105, { type: 'english_words', ukStyle: 1, case: 'sentence' })
      ).toBe('One hundred and five')
    })

    test('should handle edge cases with ukStyle', () => {
      // Numbers that don't have "and" in either style
      expect(convertTo(100, { type: 'english_words', ukStyle: 0 })).toBe(
        'one hundred'
      )
      expect(convertTo(100, { type: 'english_words', ukStyle: 1 })).toBe(
        'one hundred'
      )
      expect(convertTo(1000, { type: 'english_words', ukStyle: 0 })).toBe(
        'one thousand'
      )
      expect(convertTo(1000, { type: 'english_words', ukStyle: 1 })).toBe(
        'one thousand'
      )
    })

    test('should handle complex numbers with ukStyle', () => {
      expect(convertTo(1234567, { type: 'english_words', ukStyle: 0 })).toBe(
        'one million two hundred thirty-four thousand five hundred sixty-seven'
      )
      expect(convertTo(1234567, { type: 'english_words', ukStyle: 1 })).toBe(
        'one million two hundred and thirty-four thousand five hundred and sixty-seven'
      )
    })

    test('should handle negative numbers with ukStyle', () => {
      expect(convertTo(-105, { type: 'english_words', ukStyle: 0 })).toBe(
        'negative one hundred five'
      )
      expect(convertTo(-105, { type: 'english_words', ukStyle: 1 })).toBe(
        'negative one hundred and five'
      )
    })
  })

  describe('english_ordinal_words with ukStyle', () => {
    test('should convert with US style (ukStyle: 0)', () => {
      expect(
        convertTo(105, { type: 'english_ordinal_words', ukStyle: 0 })
      ).toBe('one hundred fifth')
      expect(
        convertTo(1005, { type: 'english_ordinal_words', ukStyle: 0 })
      ).toBe('one thousand fifth')
      expect(
        convertTo(1000005, { type: 'english_ordinal_words', ukStyle: 0 })
      ).toBe('one million fifth')
    })

    test('should convert with UK style (ukStyle: 1)', () => {
      expect(
        convertTo(105, { type: 'english_ordinal_words', ukStyle: 1 })
      ).toBe('one hundred and fifth')
      expect(
        convertTo(1005, { type: 'english_ordinal_words', ukStyle: 1 })
      ).toBe('one thousand and fifth')
      expect(
        convertTo(1000005, { type: 'english_ordinal_words', ukStyle: 1 })
      ).toBe('one million and fifth')
    })

    test('should convert with not sure style (ukStyle: 2, defaults to US style)', () => {
      expect(
        convertTo(105, { type: 'english_ordinal_words', ukStyle: 2 })
      ).toBe('one hundred fifth')
      expect(
        convertTo(1005, { type: 'english_ordinal_words', ukStyle: 2 })
      ).toBe('one thousand fifth')
      expect(
        convertTo(1000005, { type: 'english_ordinal_words', ukStyle: 2 })
      ).toBe('one million fifth')
    })

    test('should convert with undefined ukStyle (defaults to US style)', () => {
      expect(convertTo(105, { type: 'english_ordinal_words' })).toBe(
        'one hundred fifth'
      )
      expect(convertTo(1005, { type: 'english_ordinal_words' })).toBe(
        'one thousand fifth'
      )
      expect(convertTo(1000005, { type: 'english_ordinal_words' })).toBe(
        'one million fifth'
      )
    })

    test('should combine ukStyle with case transformations for ordinal words', () => {
      expect(
        convertTo(105, {
          type: 'english_ordinal_words',
          ukStyle: 0,
          case: 'upper',
        })
      ).toBe('ONE HUNDRED FIFTH')
      expect(
        convertTo(105, {
          type: 'english_ordinal_words',
          ukStyle: 1,
          case: 'upper',
        })
      ).toBe('ONE HUNDRED AND FIFTH')
      expect(
        convertTo(105, {
          type: 'english_ordinal_words',
          ukStyle: 0,
          case: 'title',
        })
      ).toBe('One Hundred Fifth')
      expect(
        convertTo(105, {
          type: 'english_ordinal_words',
          ukStyle: 1,
          case: 'title',
        })
      ).toBe('One Hundred and Fifth')
    })

    test('should handle basic ordinal numbers with ukStyle', () => {
      expect(convertTo(1, { type: 'english_ordinal_words', ukStyle: 0 })).toBe(
        'first'
      )
      expect(convertTo(1, { type: 'english_ordinal_words', ukStyle: 1 })).toBe(
        'first'
      )
      expect(convertTo(2, { type: 'english_ordinal_words', ukStyle: 0 })).toBe(
        'second'
      )
      expect(convertTo(2, { type: 'english_ordinal_words', ukStyle: 1 })).toBe(
        'second'
      )
      expect(convertTo(21, { type: 'english_ordinal_words', ukStyle: 0 })).toBe(
        'twenty-first'
      )
      expect(convertTo(21, { type: 'english_ordinal_words', ukStyle: 1 })).toBe(
        'twenty-first'
      )
    })

    test('should handle complex ordinal numbers with ukStyle', () => {
      expect(
        convertTo(1234567, { type: 'english_ordinal_words', ukStyle: 0 })
      ).toBe(
        'one million two hundred thirty-four thousand five hundred sixty-seventh'
      )
      expect(
        convertTo(1234567, { type: 'english_ordinal_words', ukStyle: 1 })
      ).toBe(
        'one million two hundred and thirty-four thousand five hundred and sixty-seventh'
      )
    })

    test('should handle negative ordinal numbers with ukStyle', () => {
      expect(
        convertTo(-105, { type: 'english_ordinal_words', ukStyle: 0 })
      ).toBe('negative one hundred fifth')
      expect(
        convertTo(-105, { type: 'english_ordinal_words', ukStyle: 1 })
      ).toBe('negative one hundred and fifth')
    })
  })

  describe('french_words and french_ordinal_words (no ukStyle)', () => {
    test('should convert french_words without ukStyle (ukStyle is ignored)', () => {
      expect(convertTo(105, { type: 'french_words', ukStyle: 0 })).toBe(
        'cent-cinq'
      )
      expect(convertTo(105, { type: 'french_words', ukStyle: 1 })).toBe(
        'cent-cinq'
      )
      expect(convertTo(105, { type: 'french_words', ukStyle: 2 })).toBe(
        'cent-cinq'
      )
    })

    test('should convert french_ordinal_words without ukStyle (ukStyle is ignored)', () => {
      expect(convertTo(105, { type: 'french_ordinal_words', ukStyle: 0 })).toBe(
        'cent-cinquième'
      )
      expect(convertTo(105, { type: 'french_ordinal_words', ukStyle: 1 })).toBe(
        'cent-cinquième'
      )
      expect(convertTo(105, { type: 'french_ordinal_words', ukStyle: 2 })).toBe(
        'cent-cinquième'
      )
    })
  })

  describe('Round-trip conversions with ukStyle', () => {
    test('should preserve ukStyle in round-trip conversions for english_words', () => {
      const usStyle = convertTo(105, { type: 'english_words', ukStyle: 0 })
      const ukStyle = convertTo(105, { type: 'english_words', ukStyle: 1 })

      expect(usStyle).toBe('one hundred five')
      expect(ukStyle).toBe('one hundred and five')
      expect(usStyle).not.toBe(ukStyle)
    })

    test('should preserve ukStyle in round-trip conversions for english_ordinal_words', () => {
      const usStyle = convertTo(105, {
        type: 'english_ordinal_words',
        ukStyle: 0,
      })
      const ukStyle = convertTo(105, {
        type: 'english_ordinal_words',
        ukStyle: 1,
      })

      expect(usStyle).toBe('one hundred fifth')
      expect(ukStyle).toBe('one hundred and fifth')
      expect(usStyle).not.toBe(ukStyle)
    })
  })

  describe('Edge cases and error handling', () => {
    test('should handle zero with ukStyle', () => {
      expect(convertTo(0, { type: 'english_words', ukStyle: 0 })).toBe('zero')
      expect(convertTo(0, { type: 'english_words', ukStyle: 1 })).toBe('zero')
      expect(convertTo(0, { type: 'english_ordinal_words', ukStyle: 0 })).toBe(
        'zeroth'
      )
      expect(convertTo(0, { type: 'english_ordinal_words', ukStyle: 1 })).toBe(
        'zeroth'
      )
    })

    test('should handle single digits with ukStyle', () => {
      expect(convertTo(5, { type: 'english_words', ukStyle: 0 })).toBe('five')
      expect(convertTo(5, { type: 'english_words', ukStyle: 1 })).toBe('five')
      expect(convertTo(5, { type: 'english_ordinal_words', ukStyle: 0 })).toBe(
        'fifth'
      )
      expect(convertTo(5, { type: 'english_ordinal_words', ukStyle: 1 })).toBe(
        'fifth'
      )
    })

    test('should handle teens with ukStyle', () => {
      expect(convertTo(15, { type: 'english_words', ukStyle: 0 })).toBe(
        'fifteen'
      )
      expect(convertTo(15, { type: 'english_words', ukStyle: 1 })).toBe(
        'fifteen'
      )
      expect(convertTo(15, { type: 'english_ordinal_words', ukStyle: 0 })).toBe(
        'fifteenth'
      )
      expect(convertTo(15, { type: 'english_ordinal_words', ukStyle: 1 })).toBe(
        'fifteenth'
      )
    })
  })
})
