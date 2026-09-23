import { describe, expect, test } from 'bun:test'
import {
  englishOrdinalWordsToWords,
  englishWordsToOrdinalWords,
  fromEnglishOrdinalAbbr,
  toEnglishOrdinalAbbr,
} from '../../src'

describe('toEnglishOrdinalAbbr', () => {
  test('converts positive numbers correctly', () => {
    expect(toEnglishOrdinalAbbr(1)).toBe('1st')
    expect(toEnglishOrdinalAbbr(2)).toBe('2nd')
    expect(toEnglishOrdinalAbbr(3)).toBe('3rd')
    expect(toEnglishOrdinalAbbr(4)).toBe('4th')
    expect(toEnglishOrdinalAbbr(5)).toBe('5th')
    expect(toEnglishOrdinalAbbr(10)).toBe('10th')
    expect(toEnglishOrdinalAbbr(11)).toBe('11th')
    expect(toEnglishOrdinalAbbr(12)).toBe('12th')
    expect(toEnglishOrdinalAbbr(13)).toBe('13th')
    expect(toEnglishOrdinalAbbr(14)).toBe('14th')
    expect(toEnglishOrdinalAbbr(20)).toBe('20th')
    expect(toEnglishOrdinalAbbr(21)).toBe('21st')
    expect(toEnglishOrdinalAbbr(22)).toBe('22nd')
    expect(toEnglishOrdinalAbbr(23)).toBe('23rd')
    expect(toEnglishOrdinalAbbr(24)).toBe('24th')
    expect(toEnglishOrdinalAbbr(100)).toBe('100th')
    expect(toEnglishOrdinalAbbr(101)).toBe('101st')
    expect(toEnglishOrdinalAbbr(102)).toBe('102nd')
    expect(toEnglishOrdinalAbbr(103)).toBe('103rd')
    expect(toEnglishOrdinalAbbr(104)).toBe('104th')
  })

  test('converts negative numbers correctly', () => {
    expect(toEnglishOrdinalAbbr(-1)).toBe('-1st')
    expect(toEnglishOrdinalAbbr(-2)).toBe('-2nd')
    expect(toEnglishOrdinalAbbr(-3)).toBe('-3rd')
    expect(toEnglishOrdinalAbbr(-4)).toBe('-4th')
    expect(toEnglishOrdinalAbbr(-11)).toBe('-11th')
    expect(toEnglishOrdinalAbbr(-12)).toBe('-12th')
    expect(toEnglishOrdinalAbbr(-13)).toBe('-13th')
    expect(toEnglishOrdinalAbbr(-21)).toBe('-21st')
    expect(toEnglishOrdinalAbbr(-22)).toBe('-22nd')
    expect(toEnglishOrdinalAbbr(-23)).toBe('-23rd')
  })

  test('handles zero correctly', () => {
    expect(toEnglishOrdinalAbbr(0)).toBe('0th')
  })

  test('throws error for non-finite numbers', () => {
    expect(() => toEnglishOrdinalAbbr(Number.NaN)).toThrow(
      'Input must be a finite number'
    )
    expect(() => toEnglishOrdinalAbbr(Number.POSITIVE_INFINITY)).toThrow(
      'Input must be a finite number'
    )
    expect(() => toEnglishOrdinalAbbr(Number.NEGATIVE_INFINITY)).toThrow(
      'Input must be a finite number'
    )
  })
})

describe('fromEnglishOrdinalAbbr', () => {
  test('converts positive ordinal numbers correctly', () => {
    expect(fromEnglishOrdinalAbbr('1st')).toBe(1)
    expect(fromEnglishOrdinalAbbr('2nd')).toBe(2)
    expect(fromEnglishOrdinalAbbr('3rd')).toBe(3)
    expect(fromEnglishOrdinalAbbr('4th')).toBe(4)
    expect(fromEnglishOrdinalAbbr('5th')).toBe(5)
    expect(fromEnglishOrdinalAbbr('10th')).toBe(10)
    expect(fromEnglishOrdinalAbbr('11th')).toBe(11)
    expect(fromEnglishOrdinalAbbr('12th')).toBe(12)
    expect(fromEnglishOrdinalAbbr('13th')).toBe(13)
    expect(fromEnglishOrdinalAbbr('14th')).toBe(14)
    expect(fromEnglishOrdinalAbbr('20th')).toBe(20)
    expect(fromEnglishOrdinalAbbr('21st')).toBe(21)
    expect(fromEnglishOrdinalAbbr('22nd')).toBe(22)
    expect(fromEnglishOrdinalAbbr('23rd')).toBe(23)
    expect(fromEnglishOrdinalAbbr('24th')).toBe(24)
    expect(fromEnglishOrdinalAbbr('100th')).toBe(100)
    expect(fromEnglishOrdinalAbbr('101st')).toBe(101)
    expect(fromEnglishOrdinalAbbr('102nd')).toBe(102)
    expect(fromEnglishOrdinalAbbr('103rd')).toBe(103)
    expect(fromEnglishOrdinalAbbr('104th')).toBe(104)
  })

  test('converts negative ordinal numbers correctly', () => {
    expect(fromEnglishOrdinalAbbr('-1st')).toBe(-1)
    expect(fromEnglishOrdinalAbbr('-2nd')).toBe(-2)
    expect(fromEnglishOrdinalAbbr('-3rd')).toBe(-3)
    expect(fromEnglishOrdinalAbbr('-4th')).toBe(-4)
    expect(fromEnglishOrdinalAbbr('-11th')).toBe(-11)
    expect(fromEnglishOrdinalAbbr('-12th')).toBe(-12)
    expect(fromEnglishOrdinalAbbr('-13th')).toBe(-13)
    expect(fromEnglishOrdinalAbbr('-21st')).toBe(-21)
    expect(fromEnglishOrdinalAbbr('-22nd')).toBe(-22)
    expect(fromEnglishOrdinalAbbr('-23rd')).toBe(-23)
  })

  test('handles zero correctly', () => {
    expect(fromEnglishOrdinalAbbr('0th')).toBe(0)
  })

  test('handles whitespace correctly', () => {
    expect(fromEnglishOrdinalAbbr(' 1st ')).toBe(1)
    expect(fromEnglishOrdinalAbbr('\t2nd\n')).toBe(2)
    expect(fromEnglishOrdinalAbbr(' 3rd ')).toBe(3)
  })

  test('throws error for invalid inputs', () => {
    expect(() => fromEnglishOrdinalAbbr('1')).toThrow('Invalid ordinal number')
    expect(() => fromEnglishOrdinalAbbr('0st')).toThrow(
      'Invalid ordinal number'
    )
    expect(() => fromEnglishOrdinalAbbr('1st1')).toThrow(
      'Invalid ordinal number'
    )
    expect(() => fromEnglishOrdinalAbbr('abc')).toThrow(
      'Invalid ordinal number'
    )
    expect(() => fromEnglishOrdinalAbbr('1th')).toThrow(
      'Invalid ordinal number'
    )
    expect(() => fromEnglishOrdinalAbbr('2st')).toThrow(
      'Invalid ordinal number'
    )
    expect(() => fromEnglishOrdinalAbbr('3nd')).toThrow(
      'Invalid ordinal number'
    )
  })
})

describe('englishWordsToOrdinalWords', () => {
  test('converts basic cardinal words to ordinal words', () => {
    expect(englishWordsToOrdinalWords('one')).toBe('first')
    expect(englishWordsToOrdinalWords('two')).toBe('second')
    expect(englishWordsToOrdinalWords('three')).toBe('third')
    expect(englishWordsToOrdinalWords('four')).toBe('fourth')
    expect(englishWordsToOrdinalWords('five')).toBe('fifth')
    expect(englishWordsToOrdinalWords('six')).toBe('sixth')
    expect(englishWordsToOrdinalWords('seven')).toBe('seventh')
    expect(englishWordsToOrdinalWords('eight')).toBe('eighth')
    expect(englishWordsToOrdinalWords('nine')).toBe('ninth')
    expect(englishWordsToOrdinalWords('ten')).toBe('tenth')
    expect(englishWordsToOrdinalWords('eleven')).toBe('eleventh')
    expect(englishWordsToOrdinalWords('twelve')).toBe('twelfth')
    expect(englishWordsToOrdinalWords('thirteen')).toBe('thirteenth')
    expect(englishWordsToOrdinalWords('fourteen')).toBe('fourteenth')
    expect(englishWordsToOrdinalWords('fifteen')).toBe('fifteenth')
    expect(englishWordsToOrdinalWords('sixteen')).toBe('sixteenth')
    expect(englishWordsToOrdinalWords('seventeen')).toBe('seventeenth')
    expect(englishWordsToOrdinalWords('eighteen')).toBe('eighteenth')
    expect(englishWordsToOrdinalWords('nineteen')).toBe('nineteenth')
    expect(englishWordsToOrdinalWords('twenty')).toBe('twentieth')
  })

  test('converts compound cardinal words to ordinal words', () => {
    expect(englishWordsToOrdinalWords('twenty-one')).toBe('twenty-first')
    expect(englishWordsToOrdinalWords('twenty-two')).toBe('twenty-second')
    expect(englishWordsToOrdinalWords('twenty-three')).toBe('twenty-third')
    expect(englishWordsToOrdinalWords('twenty-five')).toBe('twenty-fifth')
    expect(englishWordsToOrdinalWords('twenty-eight')).toBe('twenty-eighth')
    expect(englishWordsToOrdinalWords('twenty-nine')).toBe('twenty-ninth')
    expect(englishWordsToOrdinalWords('thirty-one')).toBe('thirty-first')
    expect(englishWordsToOrdinalWords('thirty-two')).toBe('thirty-second')
    expect(englishWordsToOrdinalWords('forty-one')).toBe('forty-first')
    expect(englishWordsToOrdinalWords('fifty-one')).toBe('fifty-first')
    expect(englishWordsToOrdinalWords('sixty-one')).toBe('sixty-first')
    expect(englishWordsToOrdinalWords('seventy-one')).toBe('seventy-first')
    expect(englishWordsToOrdinalWords('eighty-one')).toBe('eighty-first')
    expect(englishWordsToOrdinalWords('ninety-one')).toBe('ninety-first')
  })

  test('converts large cardinal words to ordinal words', () => {
    expect(englishWordsToOrdinalWords('one hundred')).toBe('one hundredth')
    expect(englishWordsToOrdinalWords('one hundred and five')).toBe(
      'one hundred and fifth'
    )
    expect(englishWordsToOrdinalWords('one hundred and twenty-one')).toBe(
      'one hundred and twenty-first'
    )
    expect(englishWordsToOrdinalWords('one thousand')).toBe('one thousandth')
    expect(englishWordsToOrdinalWords('one thousand and one')).toBe(
      'one thousand and first'
    )
    expect(englishWordsToOrdinalWords('one million')).toBe('one millionth')
    expect(englishWordsToOrdinalWords('one billion')).toBe('one billionth')
  })

  test('preserves US/UK style in conversions', () => {
    // US style (no "and")
    expect(englishWordsToOrdinalWords('one hundred five')).toBe(
      'one hundred fifth'
    )
    expect(englishWordsToOrdinalWords('one thousand one')).toBe(
      'one thousand first'
    )

    // UK style (with "and")
    expect(englishWordsToOrdinalWords('one hundred and five')).toBe(
      'one hundred and fifth'
    )
    expect(englishWordsToOrdinalWords('one thousand and one')).toBe(
      'one thousand and first'
    )
  })

  test('handles zero correctly', () => {
    expect(englishWordsToOrdinalWords('zero')).toBe('zeroth')
  })

  test('handles negative numbers correctly', () => {
    expect(englishWordsToOrdinalWords('negative one')).toBe('negative first')
    expect(englishWordsToOrdinalWords('negative twenty-one')).toBe(
      'negative twenty-first'
    )
    expect(englishWordsToOrdinalWords('negative one hundred and five')).toBe(
      'negative one hundred and fifth'
    )
  })

  test('handles cased input', () => {
    expect(englishWordsToOrdinalWords('ONE')).toBe('FIRST')
    expect(englishWordsToOrdinalWords('Twenty-One')).toBe('Twenty-First')
    expect(englishWordsToOrdinalWords('Twenty-one')).toBe('Twenty-first')
    expect(englishWordsToOrdinalWords('One Hundred and Five')).toBe(
      'One Hundred and Fifth'
    )
    expect(englishWordsToOrdinalWords('One Hundred And Five')).toBe(
      'One Hundred And Fifth'
    )
  })

  test('handles whitespace correctly', () => {
    expect(englishWordsToOrdinalWords('  one  ')).toBe('first')
    expect(englishWordsToOrdinalWords('\ttwenty-one\n')).toBe('twenty-first')
  })

  test('handles invalid ordinal words gracefully', () => {
    // If no ordinal word is found, return the original input
    expect(englishWordsToOrdinalWords('invalid')).toBe('invalid')
    expect(englishWordsToOrdinalWords('not-a-number')).toBe('not-a-number')
    expect(englishWordsToOrdinalWords('random text')).toBe('random text')
  })
})

describe('englishOrdinalWordsToWords', () => {
  test('converts basic ordinal words to cardinal words', () => {
    expect(englishOrdinalWordsToWords('first')).toBe('one')
    expect(englishOrdinalWordsToWords('second')).toBe('two')
    expect(englishOrdinalWordsToWords('third')).toBe('three')
    expect(englishOrdinalWordsToWords('fourth')).toBe('four')
    expect(englishOrdinalWordsToWords('fifth')).toBe('five')
    expect(englishOrdinalWordsToWords('sixth')).toBe('six')
    expect(englishOrdinalWordsToWords('seventh')).toBe('seven')
    expect(englishOrdinalWordsToWords('eighth')).toBe('eight')
    expect(englishOrdinalWordsToWords('ninth')).toBe('nine')
    expect(englishOrdinalWordsToWords('tenth')).toBe('ten')
    expect(englishOrdinalWordsToWords('eleventh')).toBe('eleven')
    expect(englishOrdinalWordsToWords('twelfth')).toBe('twelve')
    expect(englishOrdinalWordsToWords('thirteenth')).toBe('thirteen')
    expect(englishOrdinalWordsToWords('fourteenth')).toBe('fourteen')
    expect(englishOrdinalWordsToWords('fifteenth')).toBe('fifteen')
    expect(englishOrdinalWordsToWords('sixteenth')).toBe('sixteen')
    expect(englishOrdinalWordsToWords('seventeenth')).toBe('seventeen')
    expect(englishOrdinalWordsToWords('eighteenth')).toBe('eighteen')
    expect(englishOrdinalWordsToWords('nineteenth')).toBe('nineteen')
    expect(englishOrdinalWordsToWords('twentieth')).toBe('twenty')
  })

  test('converts compound ordinal words to cardinal words', () => {
    expect(englishOrdinalWordsToWords('twenty-first')).toBe('twenty-one')
    expect(englishOrdinalWordsToWords('twenty-second')).toBe('twenty-two')
    expect(englishOrdinalWordsToWords('twenty-third')).toBe('twenty-three')
    expect(englishOrdinalWordsToWords('twenty-fifth')).toBe('twenty-five')
    expect(englishOrdinalWordsToWords('twenty-eighth')).toBe('twenty-eight')
    expect(englishOrdinalWordsToWords('twenty-ninth')).toBe('twenty-nine')
    expect(englishOrdinalWordsToWords('thirty-first')).toBe('thirty-one')
    expect(englishOrdinalWordsToWords('thirty-second')).toBe('thirty-two')
    expect(englishOrdinalWordsToWords('forty-first')).toBe('forty-one')
    expect(englishOrdinalWordsToWords('fifty-first')).toBe('fifty-one')
    expect(englishOrdinalWordsToWords('sixty-first')).toBe('sixty-one')
    expect(englishOrdinalWordsToWords('seventy-first')).toBe('seventy-one')
    expect(englishOrdinalWordsToWords('eighty-first')).toBe('eighty-one')
    expect(englishOrdinalWordsToWords('ninety-first')).toBe('ninety-one')
  })

  test('converts large ordinal words to cardinal words', () => {
    expect(englishOrdinalWordsToWords('one hundredth')).toBe('one hundred')
    expect(englishOrdinalWordsToWords('one hundred and fifth')).toBe(
      'one hundred and five'
    )
    expect(englishOrdinalWordsToWords('one hundred and twenty-first')).toBe(
      'one hundred and twenty-one'
    )
    expect(englishOrdinalWordsToWords('one thousandth')).toBe('one thousand')
    expect(englishOrdinalWordsToWords('one thousand and first')).toBe(
      'one thousand and one'
    )
    expect(englishOrdinalWordsToWords('one millionth')).toBe('one million')
    expect(englishOrdinalWordsToWords('one billionth')).toBe('one billion')
  })

  test('preserves US/UK style in conversions', () => {
    // US style (no "and")
    expect(englishOrdinalWordsToWords('one hundred fifth')).toBe(
      'one hundred five'
    )
    expect(englishOrdinalWordsToWords('one thousand first')).toBe(
      'one thousand one'
    )

    // UK style (with "and")
    expect(englishOrdinalWordsToWords('one hundred and fifth')).toBe(
      'one hundred and five'
    )
    expect(englishOrdinalWordsToWords('one thousand and first')).toBe(
      'one thousand and one'
    )
  })

  test('handles zero correctly', () => {
    expect(englishOrdinalWordsToWords('zeroth')).toBe('zero')
  })

  test('handles negative numbers correctly', () => {
    expect(englishOrdinalWordsToWords('negative first')).toBe('negative one')
    expect(englishOrdinalWordsToWords('negative twenty-first')).toBe(
      'negative twenty-one'
    )
    expect(englishOrdinalWordsToWords('negative one hundred and fifth')).toBe(
      'negative one hundred and five'
    )
  })

  test('handles cased input', () => {
    expect(englishOrdinalWordsToWords('FIRST')).toBe('ONE')
    expect(englishOrdinalWordsToWords('Twenty-First')).toBe('Twenty-One')
    expect(englishOrdinalWordsToWords('Twenty-first')).toBe('Twenty-one')
    expect(englishOrdinalWordsToWords('One Hundred and Fifth')).toBe(
      'One Hundred and Five'
    )
    expect(englishOrdinalWordsToWords('One Hundred And Fifth')).toBe(
      'One Hundred And Five'
    )
  })

  test('handles whitespace correctly', () => {
    expect(englishOrdinalWordsToWords('  first  ')).toBe('one')
    expect(englishOrdinalWordsToWords('\ttwenty-first\n')).toBe('twenty-one')
  })

  test('handles invalid ordinal words gracefully', () => {
    // If no ordinal word is found, return the original input
    expect(englishOrdinalWordsToWords('invalid')).toBe('invalid')
    expect(englishOrdinalWordsToWords('one')).toBe('one')
    expect(englishOrdinalWordsToWords('twenty-one')).toBe('twenty-one')
  })
})

// Comprehensive tests using all cardinal words from english.test.ts
describe('englishWordsToOrdinalWords - comprehensive tests', () => {
  // US style cardinal words (0-131)
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

  // UK style cardinal words (0-131)
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

  test('converts US style cardinal words 0-131 to ordinal words', () => {
    const expectedUS = [
      'zeroth',
      'first',
      'second',
      'third',
      'fourth',
      'fifth',
      'sixth',
      'seventh',
      'eighth',
      'ninth',
      'tenth',
      'eleventh',
      'twelfth',
      'thirteenth',
      'fourteenth',
      'fifteenth',
      'sixteenth',
      'seventeenth',
      'eighteenth',
      'nineteenth',
      'twentieth',
      'twenty-first',
      'twenty-second',
      'twenty-third',
      'twenty-fourth',
      'twenty-fifth',
      'twenty-sixth',
      'twenty-seventh',
      'twenty-eighth',
      'twenty-ninth',
      'thirtieth',
      'thirty-first',
      'thirty-second',
      'thirty-third',
      'thirty-fourth',
      'thirty-fifth',
      'thirty-sixth',
      'thirty-seventh',
      'thirty-eighth',
      'thirty-ninth',
      'fortieth',
      'forty-first',
      'forty-second',
      'forty-third',
      'forty-fourth',
      'forty-fifth',
      'forty-sixth',
      'forty-seventh',
      'forty-eighth',
      'forty-ninth',
      'fiftieth',
      'fifty-first',
      'fifty-second',
      'fifty-third',
      'fifty-fourth',
      'fifty-fifth',
      'fifty-sixth',
      'fifty-seventh',
      'fifty-eighth',
      'fifty-ninth',
      'sixtieth',
      'sixty-first',
      'sixty-second',
      'sixty-third',
      'sixty-fourth',
      'sixty-fifth',
      'sixty-sixth',
      'sixty-seventh',
      'sixty-eighth',
      'sixty-ninth',
      'seventieth',
      'seventy-first',
      'seventy-second',
      'seventy-third',
      'seventy-fourth',
      'seventy-fifth',
      'seventy-sixth',
      'seventy-seventh',
      'seventy-eighth',
      'seventy-ninth',
      'eightieth',
      'eighty-first',
      'eighty-second',
      'eighty-third',
      'eighty-fourth',
      'eighty-fifth',
      'eighty-sixth',
      'eighty-seventh',
      'eighty-eighth',
      'eighty-ninth',
      'ninetieth',
      'ninety-first',
      'ninety-second',
      'ninety-third',
      'ninety-fourth',
      'ninety-fifth',
      'ninety-sixth',
      'ninety-seventh',
      'ninety-eighth',
      'ninety-ninth',
      'one hundredth',
      'one hundred first',
      'one hundred second',
      'one hundred third',
      'one hundred fourth',
      'one hundred fifth',
      'one hundred sixth',
      'one hundred seventh',
      'one hundred eighth',
      'one hundred ninth',
      'one hundred tenth',
      'one hundred eleventh',
      'one hundred twelfth',
      'one hundred thirteenth',
      'one hundred fourteenth',
      'one hundred fifteenth',
      'one hundred sixteenth',
      'one hundred seventeenth',
      'one hundred eighteenth',
      'one hundred nineteenth',
      'one hundred twentieth',
      'one hundred twenty-first',
      'one hundred twenty-second',
      'one hundred twenty-third',
      'one hundred twenty-fourth',
      'one hundred twenty-fifth',
      'one hundred twenty-sixth',
      'one hundred twenty-seventh',
      'one hundred twenty-eighth',
      'one hundred twenty-ninth',
      'one hundred thirtieth',
      'one hundred thirty-first',
    ]

    arrUS.forEach((cardinal, index) => {
      expect(englishWordsToOrdinalWords(cardinal)).toBe(expectedUS[index])
    })
  })

  test('converts UK style cardinal words 0-131 to ordinal words', () => {
    const expectedUK = [
      'zeroth',
      'first',
      'second',
      'third',
      'fourth',
      'fifth',
      'sixth',
      'seventh',
      'eighth',
      'ninth',
      'tenth',
      'eleventh',
      'twelfth',
      'thirteenth',
      'fourteenth',
      'fifteenth',
      'sixteenth',
      'seventeenth',
      'eighteenth',
      'nineteenth',
      'twentieth',
      'twenty-first',
      'twenty-second',
      'twenty-third',
      'twenty-fourth',
      'twenty-fifth',
      'twenty-sixth',
      'twenty-seventh',
      'twenty-eighth',
      'twenty-ninth',
      'thirtieth',
      'thirty-first',
      'thirty-second',
      'thirty-third',
      'thirty-fourth',
      'thirty-fifth',
      'thirty-sixth',
      'thirty-seventh',
      'thirty-eighth',
      'thirty-ninth',
      'fortieth',
      'forty-first',
      'forty-second',
      'forty-third',
      'forty-fourth',
      'forty-fifth',
      'forty-sixth',
      'forty-seventh',
      'forty-eighth',
      'forty-ninth',
      'fiftieth',
      'fifty-first',
      'fifty-second',
      'fifty-third',
      'fifty-fourth',
      'fifty-fifth',
      'fifty-sixth',
      'fifty-seventh',
      'fifty-eighth',
      'fifty-ninth',
      'sixtieth',
      'sixty-first',
      'sixty-second',
      'sixty-third',
      'sixty-fourth',
      'sixty-fifth',
      'sixty-sixth',
      'sixty-seventh',
      'sixty-eighth',
      'sixty-ninth',
      'seventieth',
      'seventy-first',
      'seventy-second',
      'seventy-third',
      'seventy-fourth',
      'seventy-fifth',
      'seventy-sixth',
      'seventy-seventh',
      'seventy-eighth',
      'seventy-ninth',
      'eightieth',
      'eighty-first',
      'eighty-second',
      'eighty-third',
      'eighty-fourth',
      'eighty-fifth',
      'eighty-sixth',
      'eighty-seventh',
      'eighty-eighth',
      'eighty-ninth',
      'ninetieth',
      'ninety-first',
      'ninety-second',
      'ninety-third',
      'ninety-fourth',
      'ninety-fifth',
      'ninety-sixth',
      'ninety-seventh',
      'ninety-eighth',
      'ninety-ninth',
      'one hundredth',
      'one hundred and first',
      'one hundred and second',
      'one hundred and third',
      'one hundred and fourth',
      'one hundred and fifth',
      'one hundred and sixth',
      'one hundred and seventh',
      'one hundred and eighth',
      'one hundred and ninth',
      'one hundred and tenth',
      'one hundred and eleventh',
      'one hundred and twelfth',
      'one hundred and thirteenth',
      'one hundred and fourteenth',
      'one hundred and fifteenth',
      'one hundred and sixteenth',
      'one hundred and seventeenth',
      'one hundred and eighteenth',
      'one hundred and nineteenth',
      'one hundred and twentieth',
      'one hundred and twenty-first',
      'one hundred and twenty-second',
      'one hundred and twenty-third',
      'one hundred and twenty-fourth',
      'one hundred and twenty-fifth',
      'one hundred and twenty-sixth',
      'one hundred and twenty-seventh',
      'one hundred and twenty-eighth',
      'one hundred and twenty-ninth',
      'one hundred and thirtieth',
      'one hundred and thirty-first',
    ]

    arrUK.forEach((cardinal, index) => {
      expect(englishWordsToOrdinalWords(cardinal)).toBe(expectedUK[index])
    })
  })

  test('converts hundreds to ordinal words', () => {
    expect(englishWordsToOrdinalWords('two hundred')).toBe('two hundredth')
    expect(englishWordsToOrdinalWords('three hundred')).toBe('three hundredth')
    expect(englishWordsToOrdinalWords('four hundred')).toBe('four hundredth')
    expect(englishWordsToOrdinalWords('five hundred')).toBe('five hundredth')
    expect(englishWordsToOrdinalWords('six hundred')).toBe('six hundredth')
    expect(englishWordsToOrdinalWords('seven hundred')).toBe('seven hundredth')
    expect(englishWordsToOrdinalWords('eight hundred')).toBe('eight hundredth')
    expect(englishWordsToOrdinalWords('nine hundred')).toBe('nine hundredth')
  })

  test('converts three-digit numbers to ordinal words', () => {
    expect(englishWordsToOrdinalWords('two hundred forty-six')).toBe(
      'two hundred forty-sixth'
    )
    expect(englishWordsToOrdinalWords('three hundred seventy')).toBe(
      'three hundred seventieth'
    )
    expect(englishWordsToOrdinalWords('four hundred five')).toBe(
      'four hundred fifth'
    )
    expect(englishWordsToOrdinalWords('five hundred sixty-eight')).toBe(
      'five hundred sixty-eighth'
    )
    expect(englishWordsToOrdinalWords('six hundred eighty-four')).toBe(
      'six hundred eighty-fourth'
    )
    expect(englishWordsToOrdinalWords('seven hundred ninety-two')).toBe(
      'seven hundred ninety-second'
    )
    expect(englishWordsToOrdinalWords('eight hundred fifteen')).toBe(
      'eight hundred fifteenth'
    )
    expect(englishWordsToOrdinalWords('nine hundred ninety-nine')).toBe(
      'nine hundred ninety-ninth'
    )
  })

  test('converts thousands to ordinal words', () => {
    expect(englishWordsToOrdinalWords('one thousand')).toBe('one thousandth')
    expect(englishWordsToOrdinalWords('two thousand')).toBe('two thousandth')
    expect(englishWordsToOrdinalWords('five thousand')).toBe('five thousandth')
    expect(englishWordsToOrdinalWords('one thousand one')).toBe(
      'one thousand first'
    )
    expect(
      englishWordsToOrdinalWords('one thousand two hundred thirty-four')
    ).toBe('one thousand two hundred thirty-fourth')
    expect(
      englishWordsToOrdinalWords('two thousand three hundred forty-five')
    ).toBe('two thousand three hundred forty-fifth')
    expect(
      englishWordsToOrdinalWords('five thousand six hundred seventy-eight')
    ).toBe('five thousand six hundred seventy-eighth')
    expect(
      englishWordsToOrdinalWords('nine thousand nine hundred ninety-nine')
    ).toBe('nine thousand nine hundred ninety-ninth')
  })

  test('converts ten thousands to ordinal words', () => {
    expect(englishWordsToOrdinalWords('ten thousand')).toBe('ten thousandth')
    expect(englishWordsToOrdinalWords('twelve thousand')).toBe(
      'twelve thousandth'
    )
    expect(englishWordsToOrdinalWords('twenty thousand')).toBe(
      'twenty thousandth'
    )
    expect(
      englishWordsToOrdinalWords('twenty-four thousand six hundred eighty')
    ).toBe('twenty-four thousand six hundred eightieth')
    expect(
      englishWordsToOrdinalWords(
        'thirty-five thousand seven hundred ninety-one'
      )
    ).toBe('thirty-five thousand seven hundred ninety-first')
    expect(
      englishWordsToOrdinalWords(
        'ninety-nine thousand nine hundred ninety-nine'
      )
    ).toBe('ninety-nine thousand nine hundred ninety-ninth')
  })

  test('converts hundred thousands to ordinal words', () => {
    expect(englishWordsToOrdinalWords('one hundred thousand')).toBe(
      'one hundred thousandth'
    )
    expect(englishWordsToOrdinalWords('two hundred fifty thousand')).toBe(
      'two hundred fifty thousandth'
    )
    expect(
      englishWordsToOrdinalWords(
        'three hundred forty-five thousand six hundred seventy-eight'
      )
    ).toBe('three hundred forty-five thousand six hundred seventy-eighth')
    expect(
      englishWordsToOrdinalWords(
        'nine hundred ninety-nine thousand nine hundred ninety-nine'
      )
    ).toBe('nine hundred ninety-nine thousand nine hundred ninety-ninth')
  })

  test('converts millions to ordinal words', () => {
    expect(englishWordsToOrdinalWords('one million')).toBe('one millionth')
    expect(
      englishWordsToOrdinalWords('two million five hundred thousand')
    ).toBe('two million five hundred thousandth')
    expect(
      englishWordsToOrdinalWords(
        'three million four hundred fifty-six thousand seven hundred eighty-nine'
      )
    ).toBe(
      'three million four hundred fifty-six thousand seven hundred eighty-ninth'
    )
    expect(
      englishWordsToOrdinalWords(
        'nine million nine hundred ninety-nine thousand nine hundred ninety-nine'
      )
    ).toBe(
      'nine million nine hundred ninety-nine thousand nine hundred ninety-ninth'
    )
  })

  test('converts large numbers to ordinal words', () => {
    expect(englishWordsToOrdinalWords('ten million')).toBe('ten millionth')
    expect(englishWordsToOrdinalWords('one hundred million')).toBe(
      'one hundred millionth'
    )
    expect(englishWordsToOrdinalWords('one billion')).toBe('one billionth')
    expect(englishWordsToOrdinalWords('ten billion')).toBe('ten billionth')
    expect(englishWordsToOrdinalWords('one hundred billion')).toBe(
      'one hundred billionth'
    )
    expect(englishWordsToOrdinalWords('one trillion')).toBe('one trillionth')
    expect(englishWordsToOrdinalWords('one quadrillion')).toBe(
      'one quadrillionth'
    )
    expect(englishWordsToOrdinalWords('one quintillion')).toBe(
      'one quintillionth'
    )
  })

  test('converts complex large numbers to ordinal words', () => {
    expect(
      englishWordsToOrdinalWords(
        'one billion two hundred thirty-four million five hundred sixty-seven thousand eight hundred ninety'
      )
    ).toBe(
      'one billion two hundred thirty-four million five hundred sixty-seven thousand eight hundred ninetieth'
    )
    expect(
      englishWordsToOrdinalWords(
        'nine billion eight hundred seventy-six million five hundred forty-three thousand two hundred ten'
      )
    ).toBe(
      'nine billion eight hundred seventy-six million five hundred forty-three thousand two hundred tenth'
    )
    expect(
      englishWordsToOrdinalWords(
        'nine hundred eighty-seven trillion six hundred fifty-four billion three hundred twenty-one million ninety-eight thousand seven hundred sixty-five'
      )
    ).toBe(
      'nine hundred eighty-seven trillion six hundred fifty-four billion three hundred twenty-one million ninety-eight thousand seven hundred sixty-fifth'
    )
  })

  test('converts negative numbers to ordinal words', () => {
    expect(englishWordsToOrdinalWords('negative one')).toBe('negative first')
    expect(englishWordsToOrdinalWords('negative fifteen')).toBe(
      'negative fifteenth'
    )
    expect(englishWordsToOrdinalWords('negative one hundred')).toBe(
      'negative one hundredth'
    )
    expect(
      englishWordsToOrdinalWords(
        'negative one thousand two hundred thirty-four'
      )
    ).toBe('negative one thousand two hundred thirty-fourth')
    expect(englishWordsToOrdinalWords('negative one million')).toBe(
      'negative one millionth'
    )
  })
})

describe('englishOrdinalWordsToWords - comprehensive tests', () => {
  test('converts US style ordinal words 0-131 back to cardinal words', () => {
    const ordinalUS = [
      'zeroth',
      'first',
      'second',
      'third',
      'fourth',
      'fifth',
      'sixth',
      'seventh',
      'eighth',
      'ninth',
      'tenth',
      'eleventh',
      'twelfth',
      'thirteenth',
      'fourteenth',
      'fifteenth',
      'sixteenth',
      'seventeenth',
      'eighteenth',
      'nineteenth',
      'twentieth',
      'twenty-first',
      'twenty-second',
      'twenty-third',
      'twenty-fourth',
      'twenty-fifth',
      'twenty-sixth',
      'twenty-seventh',
      'twenty-eighth',
      'twenty-ninth',
      'thirtieth',
      'thirty-first',
      'thirty-second',
      'thirty-third',
      'thirty-fourth',
      'thirty-fifth',
      'thirty-sixth',
      'thirty-seventh',
      'thirty-eighth',
      'thirty-ninth',
      'fortieth',
      'forty-first',
      'forty-second',
      'forty-third',
      'forty-fourth',
      'forty-fifth',
      'forty-sixth',
      'forty-seventh',
      'forty-eighth',
      'forty-ninth',
      'fiftieth',
      'fifty-first',
      'fifty-second',
      'fifty-third',
      'fifty-fourth',
      'fifty-fifth',
      'fifty-sixth',
      'fifty-seventh',
      'fifty-eighth',
      'fifty-ninth',
      'sixtieth',
      'sixty-first',
      'sixty-second',
      'sixty-third',
      'sixty-fourth',
      'sixty-fifth',
      'sixty-sixth',
      'sixty-seventh',
      'sixty-eighth',
      'sixty-ninth',
      'seventieth',
      'seventy-first',
      'seventy-second',
      'seventy-third',
      'seventy-fourth',
      'seventy-fifth',
      'seventy-sixth',
      'seventy-seventh',
      'seventy-eighth',
      'seventy-ninth',
      'eightieth',
      'eighty-first',
      'eighty-second',
      'eighty-third',
      'eighty-fourth',
      'eighty-fifth',
      'eighty-sixth',
      'eighty-seventh',
      'eighty-eighth',
      'eighty-ninth',
      'ninetieth',
      'ninety-first',
      'ninety-second',
      'ninety-third',
      'ninety-fourth',
      'ninety-fifth',
      'ninety-sixth',
      'ninety-seventh',
      'ninety-eighth',
      'ninety-ninth',
      'one hundredth',
      'one hundred first',
      'one hundred second',
      'one hundred third',
      'one hundred fourth',
      'one hundred fifth',
      'one hundred sixth',
      'one hundred seventh',
      'one hundred eighth',
      'one hundred ninth',
      'one hundred tenth',
      'one hundred eleventh',
      'one hundred twelfth',
      'one hundred thirteenth',
      'one hundred fourteenth',
      'one hundred fifteenth',
      'one hundred sixteenth',
      'one hundred seventeenth',
      'one hundred eighteenth',
      'one hundred nineteenth',
      'one hundred twentieth',
      'one hundred twenty-first',
      'one hundred twenty-second',
      'one hundred twenty-third',
      'one hundred twenty-fourth',
      'one hundred twenty-fifth',
      'one hundred twenty-sixth',
      'one hundred twenty-seventh',
      'one hundred twenty-eighth',
      'one hundred twenty-ninth',
      'one hundred thirtieth',
      'one hundred thirty-first',
    ]

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

    ordinalUS.forEach((ordinal, index) => {
      expect(englishOrdinalWordsToWords(ordinal)).toBe(arrUS[index])
    })
  })

  test('converts UK style ordinal words 0-131 back to cardinal words', () => {
    const ordinalUK = [
      'zeroth',
      'first',
      'second',
      'third',
      'fourth',
      'fifth',
      'sixth',
      'seventh',
      'eighth',
      'ninth',
      'tenth',
      'eleventh',
      'twelfth',
      'thirteenth',
      'fourteenth',
      'fifteenth',
      'sixteenth',
      'seventeenth',
      'eighteenth',
      'nineteenth',
      'twentieth',
      'twenty-first',
      'twenty-second',
      'twenty-third',
      'twenty-fourth',
      'twenty-fifth',
      'twenty-sixth',
      'twenty-seventh',
      'twenty-eighth',
      'twenty-ninth',
      'thirtieth',
      'thirty-first',
      'thirty-second',
      'thirty-third',
      'thirty-fourth',
      'thirty-fifth',
      'thirty-sixth',
      'thirty-seventh',
      'thirty-eighth',
      'thirty-ninth',
      'fortieth',
      'forty-first',
      'forty-second',
      'forty-third',
      'forty-fourth',
      'forty-fifth',
      'forty-sixth',
      'forty-seventh',
      'forty-eighth',
      'forty-ninth',
      'fiftieth',
      'fifty-first',
      'fifty-second',
      'fifty-third',
      'fifty-fourth',
      'fifty-fifth',
      'fifty-sixth',
      'fifty-seventh',
      'fifty-eighth',
      'fifty-ninth',
      'sixtieth',
      'sixty-first',
      'sixty-second',
      'sixty-third',
      'sixty-fourth',
      'sixty-fifth',
      'sixty-sixth',
      'sixty-seventh',
      'sixty-eighth',
      'sixty-ninth',
      'seventieth',
      'seventy-first',
      'seventy-second',
      'seventy-third',
      'seventy-fourth',
      'seventy-fifth',
      'seventy-sixth',
      'seventy-seventh',
      'seventy-eighth',
      'seventy-ninth',
      'eightieth',
      'eighty-first',
      'eighty-second',
      'eighty-third',
      'eighty-fourth',
      'eighty-fifth',
      'eighty-sixth',
      'eighty-seventh',
      'eighty-eighth',
      'eighty-ninth',
      'ninetieth',
      'ninety-first',
      'ninety-second',
      'ninety-third',
      'ninety-fourth',
      'ninety-fifth',
      'ninety-sixth',
      'ninety-seventh',
      'ninety-eighth',
      'ninety-ninth',
      'one hundredth',
      'one hundred and first',
      'one hundred and second',
      'one hundred and third',
      'one hundred and fourth',
      'one hundred and fifth',
      'one hundred and sixth',
      'one hundred and seventh',
      'one hundred and eighth',
      'one hundred and ninth',
      'one hundred and tenth',
      'one hundred and eleventh',
      'one hundred and twelfth',
      'one hundred and thirteenth',
      'one hundred and fourteenth',
      'one hundred and fifteenth',
      'one hundred and sixteenth',
      'one hundred and seventeenth',
      'one hundred and eighteenth',
      'one hundred and nineteenth',
      'one hundred and twentieth',
      'one hundred and twenty-first',
      'one hundred and twenty-second',
      'one hundred and twenty-third',
      'one hundred and twenty-fourth',
      'one hundred and twenty-fifth',
      'one hundred and twenty-sixth',
      'one hundred and twenty-seventh',
      'one hundred and twenty-eighth',
      'one hundred and twenty-ninth',
      'one hundred and thirtieth',
      'one hundred and thirty-first',
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

    ordinalUK.forEach((ordinal, index) => {
      expect(englishOrdinalWordsToWords(ordinal)).toBe(arrUK[index])
    })
  })

  test('converts hundreds ordinal words back to cardinal words', () => {
    expect(englishOrdinalWordsToWords('two hundredth')).toBe('two hundred')
    expect(englishOrdinalWordsToWords('three hundredth')).toBe('three hundred')
    expect(englishOrdinalWordsToWords('four hundredth')).toBe('four hundred')
    expect(englishOrdinalWordsToWords('five hundredth')).toBe('five hundred')
    expect(englishOrdinalWordsToWords('six hundredth')).toBe('six hundred')
    expect(englishOrdinalWordsToWords('seven hundredth')).toBe('seven hundred')
    expect(englishOrdinalWordsToWords('eight hundredth')).toBe('eight hundred')
    expect(englishOrdinalWordsToWords('nine hundredth')).toBe('nine hundred')
  })

  test('converts three-digit ordinal words back to cardinal words', () => {
    expect(englishOrdinalWordsToWords('two hundred forty-sixth')).toBe(
      'two hundred forty-six'
    )
    expect(englishOrdinalWordsToWords('three hundred seventieth')).toBe(
      'three hundred seventy'
    )
    expect(englishOrdinalWordsToWords('four hundred fifth')).toBe(
      'four hundred five'
    )
    expect(englishOrdinalWordsToWords('five hundred sixty-eighth')).toBe(
      'five hundred sixty-eight'
    )
    expect(englishOrdinalWordsToWords('six hundred eighty-fourth')).toBe(
      'six hundred eighty-four'
    )
    expect(englishOrdinalWordsToWords('seven hundred ninety-second')).toBe(
      'seven hundred ninety-two'
    )
    expect(englishOrdinalWordsToWords('eight hundred fifteenth')).toBe(
      'eight hundred fifteen'
    )
    expect(englishOrdinalWordsToWords('nine hundred ninety-ninth')).toBe(
      'nine hundred ninety-nine'
    )
  })

  test('converts thousands ordinal words back to cardinal words', () => {
    expect(englishOrdinalWordsToWords('one thousandth')).toBe('one thousand')
    expect(englishOrdinalWordsToWords('two thousandth')).toBe('two thousand')
    expect(englishOrdinalWordsToWords('five thousandth')).toBe('five thousand')
    expect(englishOrdinalWordsToWords('one thousand first')).toBe(
      'one thousand one'
    )
    expect(
      englishOrdinalWordsToWords('one thousand two hundred thirty-fourth')
    ).toBe('one thousand two hundred thirty-four')
    expect(
      englishOrdinalWordsToWords('two thousand three hundred forty-fifth')
    ).toBe('two thousand three hundred forty-five')
    expect(
      englishOrdinalWordsToWords('five thousand six hundred seventy-eighth')
    ).toBe('five thousand six hundred seventy-eight')
    expect(
      englishOrdinalWordsToWords('nine thousand nine hundred ninety-ninth')
    ).toBe('nine thousand nine hundred ninety-nine')
  })

  test('converts ten thousands ordinal words back to cardinal words', () => {
    expect(englishOrdinalWordsToWords('ten thousandth')).toBe('ten thousand')
    expect(englishOrdinalWordsToWords('twelve thousandth')).toBe(
      'twelve thousand'
    )
    expect(englishOrdinalWordsToWords('twenty thousandth')).toBe(
      'twenty thousand'
    )
    expect(
      englishOrdinalWordsToWords('twenty-four thousand six hundred eightieth')
    ).toBe('twenty-four thousand six hundred eighty')
    expect(
      englishOrdinalWordsToWords(
        'thirty-five thousand seven hundred ninety-first'
      )
    ).toBe('thirty-five thousand seven hundred ninety-one')
    expect(
      englishOrdinalWordsToWords(
        'ninety-nine thousand nine hundred ninety-ninth'
      )
    ).toBe('ninety-nine thousand nine hundred ninety-nine')
  })

  test('converts hundred thousands ordinal words back to cardinal words', () => {
    expect(englishOrdinalWordsToWords('one hundred thousandth')).toBe(
      'one hundred thousand'
    )
    expect(englishOrdinalWordsToWords('two hundred fifty thousandth')).toBe(
      'two hundred fifty thousand'
    )
    expect(
      englishOrdinalWordsToWords(
        'three hundred forty-five thousand six hundred seventy-eighth'
      )
    ).toBe('three hundred forty-five thousand six hundred seventy-eight')
    expect(
      englishOrdinalWordsToWords(
        'nine hundred ninety-nine thousand nine hundred ninety-ninth'
      )
    ).toBe('nine hundred ninety-nine thousand nine hundred ninety-nine')
  })

  test('converts millions ordinal words back to cardinal words', () => {
    expect(englishOrdinalWordsToWords('one millionth')).toBe('one million')
    expect(
      englishOrdinalWordsToWords('two million five hundred thousandth')
    ).toBe('two million five hundred thousand')
    expect(
      englishOrdinalWordsToWords(
        'three million four hundred fifty-six thousand seven hundred eighty-ninth'
      )
    ).toBe(
      'three million four hundred fifty-six thousand seven hundred eighty-nine'
    )
    expect(
      englishOrdinalWordsToWords(
        'nine million nine hundred ninety-nine thousand nine hundred ninety-ninth'
      )
    ).toBe(
      'nine million nine hundred ninety-nine thousand nine hundred ninety-nine'
    )
  })

  test('converts large numbers ordinal words back to cardinal words', () => {
    expect(englishOrdinalWordsToWords('ten millionth')).toBe('ten million')
    expect(englishOrdinalWordsToWords('one hundred millionth')).toBe(
      'one hundred million'
    )
    expect(englishOrdinalWordsToWords('one billionth')).toBe('one billion')
    expect(englishOrdinalWordsToWords('ten billionth')).toBe('ten billion')
    expect(englishOrdinalWordsToWords('one hundred billionth')).toBe(
      'one hundred billion'
    )
    expect(englishOrdinalWordsToWords('one trillionth')).toBe('one trillion')
    expect(englishOrdinalWordsToWords('one quadrillionth')).toBe(
      'one quadrillion'
    )
    expect(englishOrdinalWordsToWords('one quintillionth')).toBe(
      'one quintillion'
    )
  })

  test('converts complex large numbers ordinal words back to cardinal words', () => {
    expect(
      englishOrdinalWordsToWords(
        'one billion two hundred thirty-four million five hundred sixty-seven thousand eight hundred ninetieth'
      )
    ).toBe(
      'one billion two hundred thirty-four million five hundred sixty-seven thousand eight hundred ninety'
    )
    expect(
      englishOrdinalWordsToWords(
        'nine billion eight hundred seventy-six million five hundred forty-three thousand two hundred tenth'
      )
    ).toBe(
      'nine billion eight hundred seventy-six million five hundred forty-three thousand two hundred ten'
    )
    expect(
      englishOrdinalWordsToWords(
        'nine hundred eighty-seven trillion six hundred fifty-four billion three hundred twenty-one million ninety-eight thousand seven hundred sixty-fifth'
      )
    ).toBe(
      'nine hundred eighty-seven trillion six hundred fifty-four billion three hundred twenty-one million ninety-eight thousand seven hundred sixty-five'
    )
  })

  test('converts negative numbers ordinal words back to cardinal words', () => {
    expect(englishOrdinalWordsToWords('negative first')).toBe('negative one')
    expect(englishOrdinalWordsToWords('negative fifteenth')).toBe(
      'negative fifteen'
    )
    expect(englishOrdinalWordsToWords('negative one hundredth')).toBe(
      'negative one hundred'
    )
    expect(
      englishOrdinalWordsToWords(
        'negative one thousand two hundred thirty-fourth'
      )
    ).toBe('negative one thousand two hundred thirty-four')
    expect(englishOrdinalWordsToWords('negative one millionth')).toBe(
      'negative one million'
    )
  })
})
