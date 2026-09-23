import { describe, expect, test } from 'bun:test'
import {
  fixEnglishWords,
  fromEnglishWords,
  toEnglishWords,
  validateEnglishWords,
} from '../../src'

const arrUS = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty',
  'twenty-one',
  'twenty-two',
  'twenty-three',
  'twenty-four',
  'twenty-five',
  'twenty-six',
  'twenty-seven',
  'twenty-eight',
  'twenty-nine',
  'thirty',
  'thirty-one',
  'thirty-two',
  'thirty-three',
  'thirty-four',
  'thirty-five',
  'thirty-six',
  'thirty-seven',
  'thirty-eight',
  'thirty-nine',
  'forty',
  'forty-one',
  'forty-two',
  'forty-three',
  'forty-four',
  'forty-five',
  'forty-six',
  'forty-seven',
  'forty-eight',
  'forty-nine',
  'fifty',
  'fifty-one',
  'fifty-two',
  'fifty-three',
  'fifty-four',
  'fifty-five',
  'fifty-six',
  'fifty-seven',
  'fifty-eight',
  'fifty-nine',
  'sixty',
  'sixty-one',
  'sixty-two',
  'sixty-three',
  'sixty-four',
  'sixty-five',
  'sixty-six',
  'sixty-seven',
  'sixty-eight',
  'sixty-nine',
  'seventy',
  'seventy-one',
  'seventy-two',
  'seventy-three',
  'seventy-four',
  'seventy-five',
  'seventy-six',
  'seventy-seven',
  'seventy-eight',
  'seventy-nine',
  'eighty',
  'eighty-one',
  'eighty-two',
  'eighty-three',
  'eighty-four',
  'eighty-five',
  'eighty-six',
  'eighty-seven',
  'eighty-eight',
  'eighty-nine',
  'ninety',
  'ninety-one',
  'ninety-two',
  'ninety-three',
  'ninety-four',
  'ninety-five',
  'ninety-six',
  'ninety-seven',
  'ninety-eight',
  'ninety-nine',
  'one hundred',
  'one hundred one',
  'one hundred two',
  'one hundred three',
  'one hundred four',
  'one hundred five',
  'one hundred six',
  'one hundred seven',
  'one hundred eight',
  'one hundred nine',
  'one hundred ten',
  'one hundred eleven',
  'one hundred twelve',
  'one hundred thirteen',
  'one hundred fourteen',
  'one hundred fifteen',
  'one hundred sixteen',
  'one hundred seventeen',
  'one hundred eighteen',
  'one hundred nineteen',
  'one hundred twenty',
  'one hundred twenty-one',
  'one hundred twenty-two',
  'one hundred twenty-three',
  'one hundred twenty-four',
  'one hundred twenty-five',
  'one hundred twenty-six',
  'one hundred twenty-seven',
  'one hundred twenty-eight',
  'one hundred twenty-nine',
  'one hundred thirty',
  'one hundred thirty-one',
]

const arrUK = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty',
  'twenty-one',
  'twenty-two',
  'twenty-three',
  'twenty-four',
  'twenty-five',
  'twenty-six',
  'twenty-seven',
  'twenty-eight',
  'twenty-nine',
  'thirty',
  'thirty-one',
  'thirty-two',
  'thirty-three',
  'thirty-four',
  'thirty-five',
  'thirty-six',
  'thirty-seven',
  'thirty-eight',
  'thirty-nine',
  'forty',
  'forty-one',
  'forty-two',
  'forty-three',
  'forty-four',
  'forty-five',
  'forty-six',
  'forty-seven',
  'forty-eight',
  'forty-nine',
  'fifty',
  'fifty-one',
  'fifty-two',
  'fifty-three',
  'fifty-four',
  'fifty-five',
  'fifty-six',
  'fifty-seven',
  'fifty-eight',
  'fifty-nine',
  'sixty',
  'sixty-one',
  'sixty-two',
  'sixty-three',
  'sixty-four',
  'sixty-five',
  'sixty-six',
  'sixty-seven',
  'sixty-eight',
  'sixty-nine',
  'seventy',
  'seventy-one',
  'seventy-two',
  'seventy-three',
  'seventy-four',
  'seventy-five',
  'seventy-six',
  'seventy-seven',
  'seventy-eight',
  'seventy-nine',
  'eighty',
  'eighty-one',
  'eighty-two',
  'eighty-three',
  'eighty-four',
  'eighty-five',
  'eighty-six',
  'eighty-seven',
  'eighty-eight',
  'eighty-nine',
  'ninety',
  'ninety-one',
  'ninety-two',
  'ninety-three',
  'ninety-four',
  'ninety-five',
  'ninety-six',
  'ninety-seven',
  'ninety-eight',
  'ninety-nine',
  'one hundred',
  'one hundred and one',
  'one hundred and two',
  'one hundred and three',
  'one hundred and four',
  'one hundred and five',
  'one hundred and six',
  'one hundred and seven',
  'one hundred and eight',
  'one hundred and nine',
  'one hundred and ten',
  'one hundred and eleven',
  'one hundred and twelve',
  'one hundred and thirteen',
  'one hundred and fourteen',
  'one hundred and fifteen',
  'one hundred and sixteen',
  'one hundred and seventeen',
  'one hundred and eighteen',
  'one hundred and nineteen',
  'one hundred and twenty',
  'one hundred and twenty-one',
  'one hundred and twenty-two',
  'one hundred and twenty-three',
  'one hundred and twenty-four',
  'one hundred and twenty-five',
  'one hundred and twenty-six',
  'one hundred and twenty-seven',
  'one hundred and twenty-eight',
  'one hundred and twenty-nine',
  'one hundred and thirty',
  'one hundred and thirty-one',
]

// Basic conversions - toEnglishWords
describe('toEnglishWords in US/default style', () => {
  test('should handle 0-131 in US style', () => {
    arrUS.forEach((item, index) => {
      expect(toEnglishWords(index)).toBe(item)
    })
  })

  test('should convert hundreds correctly', () => {
    expect(toEnglishWords(200)).toBe('two hundred')
    expect(toEnglishWords(300)).toBe('three hundred')
    expect(toEnglishWords(400)).toBe('four hundred')
    expect(toEnglishWords(500)).toBe('five hundred')
    expect(toEnglishWords(600)).toBe('six hundred')
    expect(toEnglishWords(700)).toBe('seven hundred')
    expect(toEnglishWords(800)).toBe('eight hundred')
    expect(toEnglishWords(900)).toBe('nine hundred')
  })

  test('should convert three-digit numbers correctly', () => {
    expect(toEnglishWords(246)).toBe('two hundred forty-six')
    expect(toEnglishWords(370)).toBe('three hundred seventy')
    expect(toEnglishWords(405)).toBe('four hundred five')
    expect(toEnglishWords(568)).toBe('five hundred sixty-eight')
    expect(toEnglishWords(684)).toBe('six hundred eighty-four')
    expect(toEnglishWords(792)).toBe('seven hundred ninety-two')
    expect(toEnglishWords(815)).toBe('eight hundred fifteen')
    expect(toEnglishWords(999)).toBe('nine hundred ninety-nine')
  })

  test('should convert thousands correctly', () => {
    expect(toEnglishWords(1000)).toBe('one thousand')
    expect(toEnglishWords(2000)).toBe('two thousand')
    expect(toEnglishWords(5000)).toBe('five thousand')
    expect(toEnglishWords(1001)).toBe('one thousand one')
    expect(toEnglishWords(1234)).toBe('one thousand two hundred thirty-four')
    expect(toEnglishWords(2345)).toBe('two thousand three hundred forty-five')
    expect(toEnglishWords(5678)).toBe('five thousand six hundred seventy-eight')
    expect(toEnglishWords(9999)).toBe('nine thousand nine hundred ninety-nine')
  })

  test('should convert ten thousands correctly', () => {
    expect(toEnglishWords(10000)).toBe('ten thousand')
    expect(toEnglishWords(12000)).toBe('twelve thousand')
    expect(toEnglishWords(20000)).toBe('twenty thousand')
    expect(toEnglishWords(24680)).toBe(
      'twenty-four thousand six hundred eighty'
    )
    expect(toEnglishWords(35791)).toBe(
      'thirty-five thousand seven hundred ninety-one'
    )
    expect(toEnglishWords(99999)).toBe(
      'ninety-nine thousand nine hundred ninety-nine'
    )
  })

  test('should convert hundred thousands correctly', () => {
    expect(toEnglishWords(100000)).toBe('one hundred thousand')
    expect(toEnglishWords(250000)).toBe('two hundred fifty thousand')
    expect(toEnglishWords(345678)).toBe(
      'three hundred forty-five thousand six hundred seventy-eight'
    )
    expect(toEnglishWords(999999)).toBe(
      'nine hundred ninety-nine thousand nine hundred ninety-nine'
    )
  })

  test('should convert millions correctly', () => {
    expect(toEnglishWords(1000000)).toBe('one million')
    expect(toEnglishWords(2500000)).toBe('two million five hundred thousand')
    expect(toEnglishWords(3456789)).toBe(
      'three million four hundred fifty-six thousand seven hundred eighty-nine'
    )
    expect(toEnglishWords(9999999)).toBe(
      'nine million nine hundred ninety-nine thousand nine hundred ninety-nine'
    )
  })

  test('should convert large numbers correctly', () => {
    expect(toEnglishWords(10000000)).toBe('ten million')
    expect(toEnglishWords(100000000)).toBe('one hundred million')
    expect(toEnglishWords(1000000000)).toBe('one billion')
    expect(toEnglishWords(10000000000)).toBe('ten billion')
    expect(toEnglishWords(100000000000)).toBe('one hundred billion')
    expect(toEnglishWords(1000000000000)).toBe('one trillion')
    expect(toEnglishWords(1000000000000000)).toBe('one quadrillion')
    expect(toEnglishWords(1000000000000000000)).toBe('one quintillion')
  })

  test('should convert complex large numbers correctly', () => {
    expect(toEnglishWords(1234567890)).toBe(
      'one billion two hundred thirty-four million five hundred sixty-seven thousand eight hundred ninety'
    )
    expect(toEnglishWords(9876543210)).toBe(
      'nine billion eight hundred seventy-six million five hundred forty-three thousand two hundred ten'
    )

    // Test a number with all possible word components
    const complexNumber = 987654321098765
    expect(toEnglishWords(complexNumber)).toBe(
      'nine hundred eighty-seven trillion six hundred fifty-four billion three hundred twenty-one million ninety-eight thousand seven hundred sixty-five'
    )
  })

  test('should handle negative numbers correctly', () => {
    expect(toEnglishWords(-1)).toBe('negative one')
    expect(toEnglishWords(-15)).toBe('negative fifteen')
    expect(toEnglishWords(-100)).toBe('negative one hundred')
    expect(toEnglishWords(-1234)).toBe(
      'negative one thousand two hundred thirty-four'
    )
    expect(toEnglishWords(-1000000)).toBe('negative one million')
  })

  test('should reject invalid inputs', () => {
    expect(() => toEnglishWords(Number.NaN)).toThrow(
      'Input must be a finite number'
    )
    expect(() => toEnglishWords(Number.POSITIVE_INFINITY)).toThrow(
      'Input must be a finite number'
    )
    expect(() => toEnglishWords(Number.NEGATIVE_INFINITY)).toThrow(
      'Input must be a finite number'
    )
  })

  test('should handle very large numbers', () => {
    // JavaScript's largest safe integer
    const maxSafeInteger = Number.MAX_SAFE_INTEGER
    expect(toEnglishWords(maxSafeInteger)).toBeDefined()
    expect(toEnglishWords(maxSafeInteger).length).toBeGreaterThan(100)
  })
})

// UK Style conversions - toEnglishWords
describe('toEnglishWords in UK Style', () => {
  test('should handle 0-131 in UK style', () => {
    arrUK.forEach((item, index) => {
      expect(toEnglishWords(index, true)).toBe(item)
    })
  })

  test('should convert hundreds correctly in UK style', () => {
    expect(toEnglishWords(200, true)).toBe('two hundred')
    expect(toEnglishWords(300, true)).toBe('three hundred')
    expect(toEnglishWords(400, true)).toBe('four hundred')
    expect(toEnglishWords(500, true)).toBe('five hundred')
    expect(toEnglishWords(600, true)).toBe('six hundred')
    expect(toEnglishWords(700, true)).toBe('seven hundred')
    expect(toEnglishWords(800, true)).toBe('eight hundred')
    expect(toEnglishWords(900, true)).toBe('nine hundred')
  })

  test('should convert three-digit numbers correctly in UK style', () => {
    expect(toEnglishWords(246, true)).toBe('two hundred and forty-six')
    expect(toEnglishWords(370, true)).toBe('three hundred and seventy')
    expect(toEnglishWords(405, true)).toBe('four hundred and five')
    expect(toEnglishWords(568, true)).toBe('five hundred and sixty-eight')
    expect(toEnglishWords(684, true)).toBe('six hundred and eighty-four')
    expect(toEnglishWords(792, true)).toBe('seven hundred and ninety-two')
    expect(toEnglishWords(815, true)).toBe('eight hundred and fifteen')
    expect(toEnglishWords(999, true)).toBe('nine hundred and ninety-nine')
  })

  test('should convert thousands correctly in UK style', () => {
    expect(toEnglishWords(1000, true)).toBe('one thousand')
    expect(toEnglishWords(2000, true)).toBe('two thousand')
    expect(toEnglishWords(5000, true)).toBe('five thousand')
    expect(toEnglishWords(1001, true)).toBe('one thousand and one')
    expect(toEnglishWords(1234, true)).toBe(
      'one thousand two hundred and thirty-four'
    )
    expect(toEnglishWords(2345, true)).toBe(
      'two thousand three hundred and forty-five'
    )
    expect(toEnglishWords(5678, true)).toBe(
      'five thousand six hundred and seventy-eight'
    )
    expect(toEnglishWords(9999, true)).toBe(
      'nine thousand nine hundred and ninety-nine'
    )
  })

  test('should convert complex large numbers correctly in UK style', () => {
    expect(toEnglishWords(1234567890, true)).toBe(
      'one billion two hundred and thirty-four million five hundred and sixty-seven thousand eight hundred and ninety'
    )
    expect(toEnglishWords(9876543210, true)).toBe(
      'nine billion eight hundred and seventy-six million five hundred and forty-three thousand two hundred and ten'
    )
  })

  test('should handle negative numbers correctly in UK style', () => {
    expect(toEnglishWords(-1, true)).toBe('negative one')
    expect(toEnglishWords(-15, true)).toBe('negative fifteen')
    expect(toEnglishWords(-100, true)).toBe('negative one hundred')
    expect(toEnglishWords(-1234, true)).toBe(
      'negative one thousand two hundred and thirty-four'
    )
    expect(toEnglishWords(-1000000, true)).toBe('negative one million')
  })
})

// Basic conversions - fromEnglishWords
describe('fromEnglishWords', () => {
  test('should handle 0-131 in US style', () => {
    arrUS.forEach((item, index) => {
      expect(fromEnglishWords(item)).toBe(index)
    })
  })
  test('should handle 0-131 in UK style', () => {
    arrUK.forEach((item, index) => {
      expect(fromEnglishWords(item)).toBe(index)
    })
  })

  test('should convert hundreds correctly', () => {
    expect(fromEnglishWords('two hundred')).toBe(200)
    expect(fromEnglishWords('three hundred')).toBe(300)
    expect(fromEnglishWords('nine hundred')).toBe(900)
  })

  test('should convert three-digit numbers correctly', () => {
    expect(fromEnglishWords('two hundred forty-six')).toBe(246)
    expect(fromEnglishWords('three hundred seventy')).toBe(370)
    expect(fromEnglishWords('four hundred five')).toBe(405)
    expect(fromEnglishWords('nine hundred ninety-nine')).toBe(999)
  })

  test('should convert thousands correctly', () => {
    expect(fromEnglishWords('one thousand')).toBe(1000)
    expect(fromEnglishWords('two thousand three hundred forty-five')).toBe(2345)
    expect(fromEnglishWords('five thousand six hundred seventy-eight')).toBe(
      5678
    )
    expect(fromEnglishWords('nine thousand nine hundred ninety-nine')).toBe(
      9999
    )
  })

  test('should convert ten thousands correctly', () => {
    expect(fromEnglishWords('ten thousand')).toBe(10000)
    expect(fromEnglishWords('twelve thousand')).toBe(12000)
    expect(fromEnglishWords('twenty thousand')).toBe(20000)
    expect(fromEnglishWords('twenty-four thousand six hundred eighty')).toBe(
      24680
    )
    expect(
      fromEnglishWords('thirty-five thousand seven hundred ninety-one')
    ).toBe(35791)
    expect(
      fromEnglishWords('ninety-nine thousand nine hundred ninety-nine')
    ).toBe(99999)
  })

  test('should convert hundred thousands correctly', () => {
    expect(fromEnglishWords('one hundred thousand')).toBe(100000)
    expect(fromEnglishWords('two hundred fifty thousand')).toBe(250000)
    expect(
      fromEnglishWords(
        'three hundred forty-five thousand six hundred seventy-eight'
      )
    ).toBe(345678)
    expect(
      fromEnglishWords(
        'nine hundred ninety-nine thousand nine hundred ninety-nine'
      )
    ).toBe(999999)
  })

  test('should convert millions correctly', () => {
    expect(fromEnglishWords('one million')).toBe(1000000)
    expect(fromEnglishWords('two million five hundred thousand')).toBe(2500000)
    expect(
      fromEnglishWords(
        'three million four hundred fifty-six thousand seven hundred eighty-nine'
      )
    ).toBe(3456789)
    expect(
      fromEnglishWords(
        'nine million nine hundred ninety-nine thousand nine hundred ninety-nine'
      )
    ).toBe(9999999)
  })

  test('should convert large numbers correctly', () => {
    expect(fromEnglishWords('ten million')).toBe(10000000)
    expect(fromEnglishWords('one hundred million')).toBe(100000000)
    expect(fromEnglishWords('one billion')).toBe(1000000000)
    expect(fromEnglishWords('ten billion')).toBe(10000000000)
    expect(fromEnglishWords('one hundred billion')).toBe(100000000000)
    expect(fromEnglishWords('one trillion')).toBe(1000000000000)
    expect(fromEnglishWords('one quadrillion')).toBe(1000000000000000)
    expect(fromEnglishWords('one quintillion')).toBe(1000000000000000000)
  })

  test('should convert complex large numbers correctly', () => {
    expect(
      fromEnglishWords(
        'one billion two hundred thirty-four million five hundred sixty-seven thousand eight hundred ninety'
      )
    ).toBe(1234567890)
    expect(
      fromEnglishWords(
        'nine billion eight hundred seventy-six million five hundred forty-three thousand two hundred ten'
      )
    ).toBe(9876543210)

    // Test a number with all possible word components
    const complexText =
      'nine hundred eighty-seven trillion six hundred fifty-four billion three hundred twenty-one million ninety-eight thousand seven hundred sixty-five'
    expect(fromEnglishWords(complexText)).toBe(987654321098765)
  })
})

// Format variations - fromEnglishWords
describe('fromEnglishWords - format variations', () => {
  test('should handle numbers with "and" in them', () => {
    expect(fromEnglishWords('one hundred and one')).toBe(101)
    expect(fromEnglishWords('one thousand and one')).toBe(1001)
    expect(fromEnglishWords('one thousand two hundred and thirty-four')).toBe(
      1234
    )
    expect(fromEnglishWords('one thousand, two hundred and thirty-four')).toBe(
      1234
    )
    expect(fromEnglishWords('one million and five')).toBe(1000005)
  })

  test('should handle numbers with commas', () => {
    expect(fromEnglishWords('one thousand, two hundred, thirty-four')).toBe(
      1234
    )
    expect(
      fromEnglishWords(
        'one million, five hundred thousand, four hundred twenty-five'
      )
    ).toBe(1500425)
  })

  test('should be case insensitive', () => {
    expect(fromEnglishWords('One')).toBe(1)
    expect(fromEnglishWords('TWENTY')).toBe(20)
    expect(fromEnglishWords('Fifty-Five')).toBe(55)
    expect(fromEnglishWords('One Hundred Twenty-Three')).toBe(123)
    expect(fromEnglishWords('ONE THOUSAND')).toBe(1000)
  })

  test('should handle various spacing, hyphens, and formatting, even with strictly wrong hyphenation', () => {
    expect(fromEnglishWords('twenty  one')).toBe(21) // Extra spaces
    expect(fromEnglishWords(' fifty five ')).toBe(55) // Leading/trailing spaces
    expect(fromEnglishWords('one-hundred')).toBe(100) // Alternative hyphenation
    expect(fromEnglishWords('two-hundred-and-fifty')).toBe(250) // Extra hyphens
    // various hyphenations
    expect(fromEnglishWords('fifty-five')).toBe(55) // strictly correct hyphenation
    expect(fromEnglishWords('fifty five')).toBe(55) // wrong hyphenation: no hyphen
    expect(fromEnglishWords('one hundred twenty-three')).toBe(123) // strictly correct hyphenation
    expect(fromEnglishWords('one hundred twenty three')).toBe(123) // wrong hyphenation: no hyphen
    expect(fromEnglishWords('one-hundred-twenty-three')).toBe(123) // wrong hyphenation: all hyphens
    expect(fromEnglishWords('one-hundred twenty three')).toBe(123) // wrong hyphenation: random hyphens
    expect(fromEnglishWords('one hundred and twenty-three')).toBe(123) // strictly correct hyphenation
    expect(fromEnglishWords('one hundred and twenty three')).toBe(123) // wrong hyphenation: no hyphen
    expect(fromEnglishWords('one-hundred-and-twenty-three')).toBe(123) // wrong hyphenation: all hyphens
    expect(fromEnglishWords('one-hundred and-twenty three')).toBe(123) // wrong hyphenation: random hyphens
  })
})

// Edge cases and special values - fromEnglishWords
describe('fromEnglishWords - edge cases and special values', () => {
  test('should handle zero correctly', () => {
    expect(fromEnglishWords('zero')).toBe(0)
  })

  test('should handle negative numbers correctly', () => {
    expect(fromEnglishWords('negative one')).toBe(-1)
    expect(fromEnglishWords('negative fifteen')).toBe(-15)
    expect(fromEnglishWords('negative one hundred')).toBe(-100)
    expect(
      fromEnglishWords('negative one thousand two hundred thirty-four')
    ).toBe(-1234)
    expect(fromEnglishWords('negative one million')).toBe(-1000000)
  })

  test('should reject invalid inputs', () => {
    expect(() => fromEnglishWords('')).toThrow()
    expect(() => fromEnglishWords('   ')).toThrow()
    expect(() => fromEnglishWords('abc')).toThrow()
    expect(() => fromEnglishWords('onety-one')).toThrow()
  })

  test('should reject badly formed number words', () => {
    expect(() => fromEnglishWords('twenty-zillion')).toThrow() // Non-existent "zillion"
    expect(() => fromEnglishWords('eleventeen')).toThrow() // Non-existent "eleventeen"
  })
})

// Round-trip conversion tests
describe('Round-trip conversions', () => {
  test('round-trip conversions should yield the original value (US style)', () => {
    // Test a range of numbers from 0 to 1000, stepping by 37 (arbitrary prime-ish number)
    for (let num = 0; num <= 1000; num += 37) {
      expect(fromEnglishWords(toEnglishWords(num, false))).toBe(num)
    }

    // Test some larger numbers
    const largeNumbers = [
      1234, 9876, 10000, 123456, 999999, 1000000, 1234567, 10000000, 1000000000,
      1234567890,
    ]

    for (const num of largeNumbers) {
      expect(fromEnglishWords(toEnglishWords(num, false))).toBe(num)
    }

    // Test negative numbers
    const negativeNumbers = [-1, -42, -100, -999, -1234, -1000000]

    for (const num of negativeNumbers) {
      expect(fromEnglishWords(toEnglishWords(num, false))).toBe(num)
    }
  })

  test('round-trip conversions should yield the original value (UK style)', () => {
    // Test a range of numbers from 0 to 1000, stepping by 37 (arbitrary prime-ish number)
    for (let num = 0; num <= 1000; num += 37) {
      expect(fromEnglishWords(toEnglishWords(num, true))).toBe(num)
    }

    // Test some larger numbers
    const largeNumbers = [
      1234, 9876, 10000, 123456, 999999, 1000000, 1234567, 10000000, 1000000000,
      1234567890,
    ]

    for (const num of largeNumbers) {
      expect(fromEnglishWords(toEnglishWords(num, true))).toBe(num)
    }

    // Test negative numbers
    const negativeNumbers = [-1, -42, -100, -999, -1234, -1000000]

    for (const num of negativeNumbers) {
      expect(fromEnglishWords(toEnglishWords(num, true))).toBe(num)
    }
  })
})

// Specific test cases for known issues or common scenarios
describe('Specific test cases', () => {
  test('should handle common year expressions correctly', () => {
    expect(fromEnglishWords('nineteen hundred')).toBe(1900)
    expect(fromEnglishWords('nineteen hundred and one')).toBe(1901)
    expect(fromEnglishWords('two thousand')).toBe(2000)
    expect(fromEnglishWords('two thousand and one')).toBe(2001)
  })

  test('should handle financial expressions correctly', () => {
    expect(fromEnglishWords('one million two hundred fifty thousand')).toBe(
      1250000
    )
    expect(() => fromEnglishWords('three point five million')).toThrow() // Decimal expressions not supported
    expect(fromEnglishWords('five hundred thousand')).toBe(500000)
    expect(fromEnglishWords('one billion')).toBe(1000000000)
  })

  test('should reject uncommon or other unsupported usage', () => {
    expect(() => fromEnglishWords('a dozen')).toThrow()
    expect(() => fromEnglishWords('half a million')).toThrow()
    expect(() => fromEnglishWords('one oh one')).toThrow()
    expect(() => fromEnglishWords('double zero')).toThrow()
  })

  test('should allow some uncommon usage but result may be unexpected', () => {
    expect(fromEnglishWords('twenty-hundred')).toBe(2000)
    expect(fromEnglishWords('hundred one')).toBe(1)
    expect(fromEnglishWords('thousand five')).toBe(5)
    expect(fromEnglishWords('twenty twenty')).toBe(40)
    expect(fromEnglishWords('twenty twenty-one')).toBe(41)
    expect(fromEnglishWords('twenty twenty-three')).toBe(43)
    expect(fromEnglishWords('twenty four seven')).toBe(31)
  })
})

// Error message clarity tests
describe('Error message clarity', () => {
  test('toEnglishWords should provide clear error messages', () => {
    try {
      toEnglishWords(Number.NaN)
      // Should have thrown an error
    } catch (e) {
      expect((e as Error).message).toContain('finite number')
    }

    try {
      toEnglishWords(Number.POSITIVE_INFINITY)
      // Should have thrown an error
    } catch (e) {
      expect((e as Error).message).toContain('finite number')
    }
  })

  test('fromEnglishWords should provide clear error messages for invalid words', () => {
    try {
      fromEnglishWords('gazillion')
      // Should have thrown an error
    } catch (e) {
      expect((e as Error).message).toContain('Invalid word')
    }

    try {
      fromEnglishWords('eleventy')
      // Should have thrown an error
    } catch (e) {
      expect((e as Error).message).toContain('Invalid word')
    }
  })
})

describe('validateEnglishWords', () => {
  test('should validate correct English number words (US style)', () => {
    expect(validateEnglishWords('zero')).toBe(true)
    expect(validateEnglishWords('one')).toBe(true)
    expect(validateEnglishWords('twenty-one')).toBe(true)
    expect(validateEnglishWords('one hundred')).toBe(true)
    expect(validateEnglishWords('one hundred twenty-three')).toBe(true)
    expect(validateEnglishWords('one thousand two hundred thirty-four')).toBe(
      true
    )
  })

  test('should validate correct English number words (UK style)', () => {
    expect(validateEnglishWords('zero')).toBe(true)
    expect(validateEnglishWords('one')).toBe(true)
    expect(validateEnglishWords('twenty-one')).toBe(true)
    expect(validateEnglishWords('one hundred')).toBe(true)
    expect(validateEnglishWords('one hundred and one')).toBe(true)
    expect(validateEnglishWords('one hundred and twenty-three')).toBe(true)
    expect(validateEnglishWords('one thousand and one')).toBe(true)
    expect(
      validateEnglishWords('one thousand two hundred and thirty-four')
    ).toBe(true)
  })

  test('should reject invalid English number words', () => {
    expect(validateEnglishWords('')).toBe(false)
    expect(validateEnglishWords('invalid')).toBe(false)
    expect(validateEnglishWords('twenty one')).toBe(false)
    expect(validateEnglishWords('one hundred, one')).toBe(false)
    expect(validateEnglishWords('one hundred twenty three')).toBe(false) // it should be "one hundred twenty-three"
  })

  test('should be case insensitive', () => {
    expect(validateEnglishWords('ZERO')).toBe(true)
    expect(validateEnglishWords('Twenty-One')).toBe(true)
    expect(validateEnglishWords('ONE HUNDRED')).toBe(true)
    expect(validateEnglishWords('ONE HUNDRED AND ONE')).toBe(true)
  })

  test('should validate with loose parameter (auto-fix hyphenation)', () => {
    // These should fail with strict validation but pass with loose validation
    expect(validateEnglishWords('twenty one', false)).toBe(false)
    expect(validateEnglishWords('twenty one', true)).toBe(true)

    expect(validateEnglishWords('one hundred twenty three', false)).toBe(false)
    expect(validateEnglishWords('one hundred twenty three', true)).toBe(true)

    expect(validateEnglishWords('one-hundred and twenty-one', false)).toBe(
      false
    )
    expect(validateEnglishWords('one-hundred and twenty-one', true)).toBe(true)

    // These should pass in both modes
    expect(validateEnglishWords('twenty-one', false)).toBe(true)
    expect(validateEnglishWords('twenty-one', true)).toBe(true)

    expect(validateEnglishWords('one hundred twenty-three', false)).toBe(true)
    expect(validateEnglishWords('one hundred twenty-three', true)).toBe(true)
  })
})

describe('fixEnglishWords', () => {
  describe('Basic tens+unit hyphenation', () => {
    test('should add hyphens to tens+unit combinations without hyphens', () => {
      // Test all tens from 20-99
      expect(fixEnglishWords('twenty one')).toBe('twenty-one')
      expect(fixEnglishWords('twenty two')).toBe('twenty-two')
      expect(fixEnglishWords('twenty three')).toBe('twenty-three')
      expect(fixEnglishWords('twenty four')).toBe('twenty-four')
      expect(fixEnglishWords('twenty five')).toBe('twenty-five')
      expect(fixEnglishWords('twenty six')).toBe('twenty-six')
      expect(fixEnglishWords('twenty seven')).toBe('twenty-seven')
      expect(fixEnglishWords('twenty eight')).toBe('twenty-eight')
      expect(fixEnglishWords('twenty nine')).toBe('twenty-nine')

      expect(fixEnglishWords('thirty one')).toBe('thirty-one')
      expect(fixEnglishWords('thirty two')).toBe('thirty-two')
      expect(fixEnglishWords('thirty five')).toBe('thirty-five')
      expect(fixEnglishWords('thirty nine')).toBe('thirty-nine')

      expect(fixEnglishWords('forty one')).toBe('forty-one')
      expect(fixEnglishWords('forty two')).toBe('forty-two')
      expect(fixEnglishWords('forty five')).toBe('forty-five')
      expect(fixEnglishWords('forty nine')).toBe('forty-nine')

      expect(fixEnglishWords('fifty one')).toBe('fifty-one')
      expect(fixEnglishWords('fifty two')).toBe('fifty-two')
      expect(fixEnglishWords('fifty five')).toBe('fifty-five')
      expect(fixEnglishWords('fifty nine')).toBe('fifty-nine')

      expect(fixEnglishWords('sixty one')).toBe('sixty-one')
      expect(fixEnglishWords('sixty two')).toBe('sixty-two')
      expect(fixEnglishWords('sixty five')).toBe('sixty-five')
      expect(fixEnglishWords('sixty nine')).toBe('sixty-nine')

      expect(fixEnglishWords('seventy one')).toBe('seventy-one')
      expect(fixEnglishWords('seventy two')).toBe('seventy-two')
      expect(fixEnglishWords('seventy five')).toBe('seventy-five')
      expect(fixEnglishWords('seventy nine')).toBe('seventy-nine')

      expect(fixEnglishWords('eighty one')).toBe('eighty-one')
      expect(fixEnglishWords('eighty two')).toBe('eighty-two')
      expect(fixEnglishWords('eighty five')).toBe('eighty-five')
      expect(fixEnglishWords('eighty nine')).toBe('eighty-nine')

      expect(fixEnglishWords('ninety one')).toBe('ninety-one')
      expect(fixEnglishWords('ninety two')).toBe('ninety-two')
      expect(fixEnglishWords('ninety five')).toBe('ninety-five')
      expect(fixEnglishWords('ninety nine')).toBe('ninety-nine')
    })

    test('should preserve existing valid hyphens in tens+unit combinations', () => {
      expect(fixEnglishWords('twenty-one')).toBe('twenty-one')
      expect(fixEnglishWords('thirty-five')).toBe('thirty-five')
      expect(fixEnglishWords('forty-two')).toBe('forty-two')
      expect(fixEnglishWords('fifty-seven')).toBe('fifty-seven')
      expect(fixEnglishWords('sixty-three')).toBe('sixty-three')
      expect(fixEnglishWords('seventy-eight')).toBe('seventy-eight')
      expect(fixEnglishWords('eighty-four')).toBe('eighty-four')
      expect(fixEnglishWords('ninety-six')).toBe('ninety-six')
    })
  })

  describe('Invalid hyphen removal', () => {
    test('should remove hyphens from invalid positions', () => {
      // Remove hyphens from hundreds
      expect(fixEnglishWords('one-hundred')).toBe('one hundred')
      expect(fixEnglishWords('two-hundred')).toBe('two hundred')
      expect(fixEnglishWords('three-hundred')).toBe('three hundred')

      // Remove hyphens from thousands
      expect(fixEnglishWords('one-thousand')).toBe('one thousand')
      expect(fixEnglishWords('two-thousand')).toBe('two thousand')

      // Remove hyphens from millions
      expect(fixEnglishWords('one-million')).toBe('one million')
      expect(fixEnglishWords('two-million')).toBe('two million')

      // Remove hyphens from other invalid positions
      expect(fixEnglishWords('hundred-one')).toBe('hundred one')
      expect(fixEnglishWords('thousand-five')).toBe('thousand five')
      expect(fixEnglishWords('million-two')).toBe('million two')
    })
  })

  describe('Mixed valid and invalid hyphenation', () => {
    test('should handle mixed hyphenation in the same text', () => {
      expect(fixEnglishWords('twenty one and thirty-five')).toBe(
        'twenty-one and thirty-five'
      )
      expect(fixEnglishWords('one-hundred and twenty three')).toBe(
        'one hundred and twenty-three'
      )
      expect(fixEnglishWords('two-thousand and forty five')).toBe(
        'two thousand and forty-five'
      )
      expect(fixEnglishWords('twenty one, thirty-five, and forty two')).toBe(
        'twenty-one, thirty-five, and forty-two'
      )
    })

    test('should handle complex mixed scenarios', () => {
      expect(
        fixEnglishWords(
          'one-hundred twenty three thousand four-hundred fifty six'
        )
      ).toBe('one hundred twenty-three thousand four hundred fifty-six')
      expect(
        fixEnglishWords('twenty one million thirty-five thousand forty two')
      ).toBe('twenty-one million thirty-five thousand forty-two')
    })
  })

  describe('Case sensitivity', () => {
    test('should be case insensitive for matching', () => {
      expect(fixEnglishWords('Twenty One')).toBe('Twenty-One')
      expect(fixEnglishWords('THIRTY FIVE')).toBe('THIRTY-FIVE')
      expect(fixEnglishWords('Forty Two')).toBe('Forty-Two')
      expect(fixEnglishWords('FIFTY SEVEN')).toBe('FIFTY-SEVEN')
    })

    test('should preserve original case when not matching patterns', () => {
      expect(fixEnglishWords('One Hundred')).toBe('One Hundred')
      expect(fixEnglishWords('Two Thousand')).toBe('Two Thousand')
      expect(fixEnglishWords('Three Million')).toBe('Three Million')
    })
  })

  describe('Edge cases and boundary conditions', () => {
    test('should handle empty and whitespace-only strings', () => {
      expect(fixEnglishWords('')).toBe('')
      expect(fixEnglishWords('   ')).toBe('   ')
      expect(fixEnglishWords('\t\n')).toBe('\t\n')
    })

    test('should handle strings without any number words', () => {
      expect(fixEnglishWords('hello world')).toBe('hello world')
      expect(fixEnglishWords('the quick brown fox')).toBe('the quick brown fox')
      expect(fixEnglishWords('no numbers here')).toBe('no numbers here')
    })

    test('should handle strings with only single digits (no tens)', () => {
      expect(fixEnglishWords('one two three')).toBe('one two three')
      expect(fixEnglishWords('four five six')).toBe('four five six')
      expect(fixEnglishWords('seven eight nine')).toBe('seven eight nine')
    })

    test('should handle strings with only tens (no units)', () => {
      expect(fixEnglishWords('twenty thirty forty')).toBe('twenty thirty forty')
      expect(fixEnglishWords('fifty sixty seventy')).toBe('fifty sixty seventy')
      expect(fixEnglishWords('eighty ninety')).toBe('eighty ninety')
    })
  })

  describe('Complex text scenarios', () => {
    test('should handle sentences with number words', () => {
      expect(
        fixEnglishWords('I have twenty one apples and thirty five oranges')
      ).toBe('I have twenty-one apples and thirty-five oranges')
      expect(fixEnglishWords('Page forty two of chapter fifty seven')).toBe(
        'Page forty-two of chapter fifty-seven'
      )
    })

    test('should handle text with punctuation', () => {
      expect(fixEnglishWords('twenty-one, thirty-five, and forty-two')).toBe(
        'twenty-one, thirty-five, and forty-two'
      )
      expect(fixEnglishWords('twenty one; thirty five; forty two')).toBe(
        'twenty-one; thirty-five; forty-two'
      )
      expect(fixEnglishWords('twenty one. thirty five. forty two.')).toBe(
        'twenty-one. thirty-five. forty-two.'
      )
    })

    test('should handle text with multiple occurrences', () => {
      expect(fixEnglishWords('twenty one twenty two twenty three')).toBe(
        'twenty-one twenty-two twenty-three'
      )
      expect(fixEnglishWords('thirty five forty two fifty seven')).toBe(
        'thirty-five forty-two fifty-seven'
      )
    })
  })

  describe('Special patterns and edge cases', () => {
    test('should handle text that looks like tens but is not', () => {
      expect(fixEnglishWords('twenty something')).toBe('twenty-something')
      expect(fixEnglishWords('thirty something')).toBe('thirty-something')
      expect(fixEnglishWords('forty something')).toBe('forty-something')
    })

    test('should handle text with numbers in different contexts', () => {
      expect(fixEnglishWords('twenty one percent')).toBe('twenty-one percent')
      expect(fixEnglishWords('thirty five dollars')).toBe('thirty-five dollars')
      expect(fixEnglishWords('forty two years old')).toBe('forty-two years old')
    })

    test('should handle text with existing valid hyphens mixed with invalid ones', () => {
      expect(fixEnglishWords('twenty-one and thirty five')).toBe(
        'twenty-one and thirty-five'
      )
      expect(fixEnglishWords('one-hundred and twenty-one')).toBe(
        'one hundred and twenty-one'
      )
      expect(fixEnglishWords('one-hundred-twenty-three')).toBe(
        'one hundred twenty-three'
      )
      expect(fixEnglishWords('two-thousand and thirty-five')).toBe(
        'two thousand and thirty-five'
      )
      expect(fixEnglishWords('two thousand-thirty-five')).toBe(
        'two thousand thirty-five'
      )
    })
  })

  describe('Regression tests for specific scenarios', () => {
    test('should handle the placeholder mechanism correctly', () => {
      // Test that the placeholder doesn't interfere with normal text
      expect(fixEnglishWords('text with <[HYPHEN]> placeholder')).toBe(
        'text with <[HYPHEN]> placeholder'
      )
      expect(fixEnglishWords('twenty one <[HYPHEN]> thirty five')).toBe(
        'twenty-one <[HYPHEN]> thirty-five'
      )
    })

    test('should handle multiple hyphens in complex patterns', () => {})

    test('should handle boundary word matching correctly', () => {
      expect(fixEnglishWords('twenty one hundred')).toBe('twenty-one hundred')
      expect(fixEnglishWords('thirty five thousand')).toBe(
        'thirty-five thousand'
      )
      expect(fixEnglishWords('forty two million')).toBe('forty-two million')
    })
  })

  describe('English ordinal words', () => {
    test('should fix hyphenation for tens + ordinal words', () => {
      // Basic ordinal words
      expect(fixEnglishWords('twenty first')).toBe('twenty-first')
      expect(fixEnglishWords('twenty second')).toBe('twenty-second')
      expect(fixEnglishWords('twenty third')).toBe('twenty-third')
      expect(fixEnglishWords('twenty fourth')).toBe('twenty-fourth')
      expect(fixEnglishWords('twenty fifth')).toBe('twenty-fifth')
      expect(fixEnglishWords('twenty sixth')).toBe('twenty-sixth')
      expect(fixEnglishWords('twenty seventh')).toBe('twenty-seventh')
      expect(fixEnglishWords('twenty eighth')).toBe('twenty-eighth')
      expect(fixEnglishWords('twenty ninth')).toBe('twenty-ninth')

      expect(fixEnglishWords('thirty first')).toBe('thirty-first')
      expect(fixEnglishWords('thirty second')).toBe('thirty-second')
      expect(fixEnglishWords('thirty third')).toBe('thirty-third')
      expect(fixEnglishWords('thirty fourth')).toBe('thirty-fourth')
      expect(fixEnglishWords('thirty fifth')).toBe('thirty-fifth')
      expect(fixEnglishWords('thirty sixth')).toBe('thirty-sixth')
      expect(fixEnglishWords('thirty seventh')).toBe('thirty-seventh')
      expect(fixEnglishWords('thirty eighth')).toBe('thirty-eighth')
      expect(fixEnglishWords('thirty ninth')).toBe('thirty-ninth')

      expect(fixEnglishWords('forty first')).toBe('forty-first')
      expect(fixEnglishWords('forty second')).toBe('forty-second')
      expect(fixEnglishWords('forty third')).toBe('forty-third')
      expect(fixEnglishWords('forty fourth')).toBe('forty-fourth')
      expect(fixEnglishWords('forty fifth')).toBe('forty-fifth')
      expect(fixEnglishWords('forty sixth')).toBe('forty-sixth')
      expect(fixEnglishWords('forty seventh')).toBe('forty-seventh')
      expect(fixEnglishWords('forty eighth')).toBe('forty-eighth')
      expect(fixEnglishWords('forty ninth')).toBe('forty-ninth')

      expect(fixEnglishWords('fifty first')).toBe('fifty-first')
      expect(fixEnglishWords('fifty second')).toBe('fifty-second')
      expect(fixEnglishWords('fifty third')).toBe('fifty-third')
      expect(fixEnglishWords('fifty fourth')).toBe('fifty-fourth')
      expect(fixEnglishWords('fifty fifth')).toBe('fifty-fifth')
      expect(fixEnglishWords('fifty sixth')).toBe('fifty-sixth')
      expect(fixEnglishWords('fifty seventh')).toBe('fifty-seventh')
      expect(fixEnglishWords('fifty eighth')).toBe('fifty-eighth')
      expect(fixEnglishWords('fifty ninth')).toBe('fifty-ninth')

      expect(fixEnglishWords('sixty first')).toBe('sixty-first')
      expect(fixEnglishWords('sixty second')).toBe('sixty-second')
      expect(fixEnglishWords('sixty third')).toBe('sixty-third')
      expect(fixEnglishWords('sixty fourth')).toBe('sixty-fourth')
      expect(fixEnglishWords('sixty fifth')).toBe('sixty-fifth')
      expect(fixEnglishWords('sixty sixth')).toBe('sixty-sixth')
      expect(fixEnglishWords('sixty seventh')).toBe('sixty-seventh')
      expect(fixEnglishWords('sixty eighth')).toBe('sixty-eighth')
      expect(fixEnglishWords('sixty ninth')).toBe('sixty-ninth')

      expect(fixEnglishWords('seventy first')).toBe('seventy-first')
      expect(fixEnglishWords('seventy second')).toBe('seventy-second')
      expect(fixEnglishWords('seventy third')).toBe('seventy-third')
      expect(fixEnglishWords('seventy fourth')).toBe('seventy-fourth')
      expect(fixEnglishWords('seventy fifth')).toBe('seventy-fifth')
      expect(fixEnglishWords('seventy sixth')).toBe('seventy-sixth')
      expect(fixEnglishWords('seventy seventh')).toBe('seventy-seventh')
      expect(fixEnglishWords('seventy eighth')).toBe('seventy-eighth')
      expect(fixEnglishWords('seventy ninth')).toBe('seventy-ninth')

      expect(fixEnglishWords('eighty first')).toBe('eighty-first')
      expect(fixEnglishWords('eighty second')).toBe('eighty-second')
      expect(fixEnglishWords('eighty third')).toBe('eighty-third')
      expect(fixEnglishWords('eighty fourth')).toBe('eighty-fourth')
      expect(fixEnglishWords('eighty fifth')).toBe('eighty-fifth')
      expect(fixEnglishWords('eighty sixth')).toBe('eighty-sixth')
      expect(fixEnglishWords('eighty seventh')).toBe('eighty-seventh')
      expect(fixEnglishWords('eighty eighth')).toBe('eighty-eighth')
      expect(fixEnglishWords('eighty ninth')).toBe('eighty-ninth')

      expect(fixEnglishWords('ninety first')).toBe('ninety-first')
      expect(fixEnglishWords('ninety second')).toBe('ninety-second')
      expect(fixEnglishWords('ninety third')).toBe('ninety-third')
      expect(fixEnglishWords('ninety fourth')).toBe('ninety-fourth')
      expect(fixEnglishWords('ninety fifth')).toBe('ninety-fifth')
      expect(fixEnglishWords('ninety sixth')).toBe('ninety-sixth')
      expect(fixEnglishWords('ninety seventh')).toBe('ninety-seventh')
      expect(fixEnglishWords('ninety eighth')).toBe('ninety-eighth')
      expect(fixEnglishWords('ninety ninth')).toBe('ninety-ninth')
    })

    test('should preserve existing valid hyphens in ordinal combinations', () => {
      expect(fixEnglishWords('twenty-first')).toBe('twenty-first')
      expect(fixEnglishWords('thirty-second')).toBe('thirty-second')
      expect(fixEnglishWords('forty-third')).toBe('forty-third')
      expect(fixEnglishWords('fifty-fourth')).toBe('fifty-fourth')
      expect(fixEnglishWords('sixty-fifth')).toBe('sixty-fifth')
      expect(fixEnglishWords('seventy-sixth')).toBe('seventy-sixth')
      expect(fixEnglishWords('eighty-seventh')).toBe('eighty-seventh')
      expect(fixEnglishWords('ninety-eighth')).toBe('ninety-eighth')
      expect(fixEnglishWords('ninety-ninth')).toBe('ninety-ninth')
    })

    test('should handle ordinal words with larger numbers', () => {
      expect(fixEnglishWords('one hundred first')).toBe('one hundred first')
      expect(fixEnglishWords('one hundred second')).toBe('one hundred second')
      expect(fixEnglishWords('one hundred third')).toBe('one hundred third')
      expect(fixEnglishWords('one hundred twenty first')).toBe(
        'one hundred twenty-first'
      )
      expect(fixEnglishWords('one hundred thirty second')).toBe(
        'one hundred thirty-second'
      )
      expect(fixEnglishWords('one hundred forty third')).toBe(
        'one hundred forty-third'
      )

      expect(fixEnglishWords('one thousand first')).toBe('one thousand first')
      expect(fixEnglishWords('one thousand second')).toBe('one thousand second')
      expect(fixEnglishWords('one thousand third')).toBe('one thousand third')
      expect(fixEnglishWords('one thousand twenty first')).toBe(
        'one thousand twenty-first'
      )
      expect(fixEnglishWords('one thousand thirty second')).toBe(
        'one thousand thirty-second'
      )
      expect(fixEnglishWords('one thousand forty third')).toBe(
        'one thousand forty-third'
      )
    })

    test('should handle ordinal words with UK style "and"', () => {
      expect(fixEnglishWords('one hundred and first')).toBe(
        'one hundred and first'
      )
      expect(fixEnglishWords('one hundred and second')).toBe(
        'one hundred and second'
      )
      expect(fixEnglishWords('one hundred and third')).toBe(
        'one hundred and third'
      )
      expect(fixEnglishWords('one hundred and twenty first')).toBe(
        'one hundred and twenty-first'
      )
      expect(fixEnglishWords('one hundred and thirty second')).toBe(
        'one hundred and thirty-second'
      )
      expect(fixEnglishWords('one hundred and forty third')).toBe(
        'one hundred and forty-third'
      )

      expect(fixEnglishWords('one thousand and first')).toBe(
        'one thousand and first'
      )
      expect(fixEnglishWords('one thousand and second')).toBe(
        'one thousand and second'
      )
      expect(fixEnglishWords('one thousand and third')).toBe(
        'one thousand and third'
      )
      expect(fixEnglishWords('one thousand and twenty first')).toBe(
        'one thousand and twenty-first'
      )
      expect(fixEnglishWords('one thousand and thirty second')).toBe(
        'one thousand and thirty-second'
      )
      expect(fixEnglishWords('one thousand and forty third')).toBe(
        'one thousand and forty-third'
      )
    })

    test('should handle mixed cardinal and ordinal words', () => {
      expect(fixEnglishWords('twenty one and thirty first')).toBe(
        'twenty-one and thirty-first'
      )
      expect(fixEnglishWords('forty two and fifty second')).toBe(
        'forty-two and fifty-second'
      )
      expect(fixEnglishWords('sixty three and seventy third')).toBe(
        'sixty-three and seventy-third'
      )
      expect(fixEnglishWords('eighty four and ninety fourth')).toBe(
        'eighty-four and ninety-fourth'
      )
    })

    test('should handle ordinal words in sentences', () => {
      expect(
        fixEnglishWords('the forty second page of the fifty seventh chapter')
      ).toBe('the forty-second page of the fifty-seventh chapter')
      expect(
        fixEnglishWords(
          'I finished in twenty first place and my friend was thirty third'
        )
      ).toBe('I finished in twenty-first place and my friend was thirty-third')
      expect(
        fixEnglishWords('the eighty eighth floor and the ninety ninth floor')
      ).toBe('the eighty-eighth floor and the ninety-ninth floor')
    })

    test('should handle ordinal words with case sensitivity', () => {
      expect(fixEnglishWords('Twenty First')).toBe('Twenty-First')
      expect(fixEnglishWords('THIRTY SECOND')).toBe('THIRTY-SECOND')
      expect(fixEnglishWords('Forty Third')).toBe('Forty-Third')
      expect(fixEnglishWords('FIFTY FOURTH')).toBe('FIFTY-FOURTH')
    })

    test('should handle ordinal words with punctuation', () => {
      expect(
        fixEnglishWords('twenty-first, thirty-second, and forty-third')
      ).toBe('twenty-first, thirty-second, and forty-third')
      expect(fixEnglishWords('twenty first; thirty second; forty third')).toBe(
        'twenty-first; thirty-second; forty-third'
      )
      expect(fixEnglishWords('twenty first. thirty second. forty third.')).toBe(
        'twenty-first. thirty-second. forty-third.'
      )
    })

    test('should handle multiple ordinal words in sequence', () => {
      expect(fixEnglishWords('twenty first twenty second twenty third')).toBe(
        'twenty-first twenty-second twenty-third'
      )
      expect(fixEnglishWords('thirty first forty second fifty third')).toBe(
        'thirty-first forty-second fifty-third'
      )
      expect(fixEnglishWords('sixty first seventy second eighty third')).toBe(
        'sixty-first seventy-second eighty-third'
      )
    })

    test('should handle ordinal words in complex contexts', () => {
      expect(
        fixEnglishWords('twenty first century and thirty second century')
      ).toBe('twenty-first century and thirty-second century')
      expect(
        fixEnglishWords('forty second street and fifty third avenue')
      ).toBe('forty-second street and fifty-third avenue')
      expect(
        fixEnglishWords('sixty first floor of the seventy second building')
      ).toBe('sixty-first floor of the seventy-second building')
    })
  })
})
