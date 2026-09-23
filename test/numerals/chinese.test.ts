import { describe, expect, test } from 'bun:test'
import {
  fromChineseWords,
  toChineseWords,
  validateChineseFinancial,
  validateChineseWords,
} from '../../src'

const arr = [
  '零',
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
  '七',
  '八',
  '九',
  '十',
  '十一',
  '十二',
  '十三',
  '十四',
  '十五',
  '十六',
  '十七',
  '十八',
  '十九',
  '二十',
  '二十一',
  '二十二',
  '二十三',
  '二十四',
  '二十五',
  '二十六',
  '二十七',
  '二十八',
  '二十九',
  '三十',
  '三十一',
  '三十二',
  '三十三',
  '三十四',
  '三十五',
  '三十六',
  '三十七',
  '三十八',
  '三十九',
  '四十',
  '四十一',
  '四十二',
  '四十三',
  '四十四',
  '四十五',
  '四十六',
  '四十七',
  '四十八',
  '四十九',
  '五十',
  '五十一',
  '五十二',
  '五十三',
  '五十四',
  '五十五',
  '五十六',
  '五十七',
  '五十八',
  '五十九',
  '六十',
  '六十一',
  '六十二',
  '六十三',
  '六十四',
  '六十五',
  '六十六',
  '六十七',
  '六十八',
  '六十九',
  '七十',
  '七十一',
  '七十二',
  '七十三',
  '七十四',
  '七十五',
  '七十六',
  '七十七',
  '七十八',
  '七十九',
  '八十',
  '八十一',
  '八十二',
  '八十三',
  '八十四',
  '八十五',
  '八十六',
  '八十七',
  '八十八',
  '八十九',
  '九十',
  '九十一',
  '九十二',
  '九十三',
  '九十四',
  '九十五',
  '九十六',
  '九十七',
  '九十八',
  '九十九',
  '一百',
  '一百零一',
  '一百零二',
  '一百零三',
  '一百零四',
  '一百零五',
  '一百零六',
  '一百零七',
  '一百零八',
  '一百零九',
  '一百一十',
  '一百一十一',
  '一百一十二',
  '一百一十三',
  '一百一十四',
  '一百一十五',
  '一百一十六',
  '一百一十七',
  '一百一十八',
  '一百一十九',
  '一百二十',
  '一百二十一',
  '一百二十二',
  '一百二十三',
  '一百二十四',
  '一百二十五',
  '一百二十六',
  '一百二十七',
  '一百二十八',
  '一百二十九',
  '一百三十',
  '一百三十一',
]

describe('toChineseWords', () => {
  test('should handle 0-131', () => {
    arr.forEach((item, index) => {
      expect(toChineseWords(index)).toBe(item)
    })
  })

  test('toChineseWords should convert numbers to Chinese words', () => {
    expect(toChineseWords(200)).toBe('二百')
    expect(toChineseWords(999)).toBe('九百九十九')

    // Thousands
    expect(toChineseWords(1000)).toBe('一千')
    expect(toChineseWords(1001)).toBe('一千零一')
    expect(toChineseWords(1010)).toBe('一千零一十')
    expect(toChineseWords(1100)).toBe('一千一百')
    expect(toChineseWords(1234)).toBe('一千二百三十四')

    // Ten thousands
    expect(toChineseWords(10000)).toBe('一万')
    expect(toChineseWords(10001)).toBe('一万零一')
    expect(toChineseWords(10010)).toBe('一万零一十')
    expect(toChineseWords(10100)).toBe('一万零一百')
    expect(toChineseWords(11000)).toBe('一万一千')
    expect(toChineseWords(12345)).toBe('一万二千三百四十五')

    // Larger numbers
    expect(toChineseWords(100000)).toBe('十万')
    expect(toChineseWords(1000000)).toBe('一百万')
    expect(toChineseWords(10000000)).toBe('一千万')
    expect(toChineseWords(100000000)).toBe('一亿')
    expect(toChineseWords(1000000000000)).toBe('一万亿')
  })

  test('toChineseWords should handle complex large numbers', () => {
    expect(toChineseWords(10001001)).toBe('一千万一千零一')
    expect(toChineseWords(100100100)).toBe('一亿零一十万零一百')
    expect(toChineseWords(101010101)).toBe('一亿零一百零一万零一百零一')

    expect(toChineseWords(100100100100)).toBe('一千零一亿零一十万零一百')
    expect(toChineseWords(1001001001001)).toBe('一万零一十亿零一百万一千零一')
    expect(toChineseWords(1001001001001)).toBe('一万零一十亿零一百万一千零一')
    expect(toChineseWords(1010101010101)).toBe(
      '一万零一百零一亿零一百零一万零一百零一'
    )
    expect(toChineseWords(9090909090909)).toBe(
      '九万零九百零九亿零九百零九万零九百零九'
    )

    expect(toChineseWords(1000000001000)).toBe('一万亿一千')
    expect(toChineseWords(1000010000100)).toBe('一万亿一千万零一百')
    expect(toChineseWords(1001000100001)).toBe('一万零一十亿零一十万零一')

    expect(toChineseWords(123456789012)).toBe(
      '一千二百三十四亿五千六百七十八万九千零一十二'
    )
    expect(toChineseWords(987654321098)).toBe(
      '九千八百七十六亿五千四百三十二万一千零九十八'
    )

    expect(toChineseWords(111111111111)).toBe(
      '一千一百一十一亿一千一百一十一万一千一百一十一'
    )
    expect(toChineseWords(999999999999)).toBe(
      '九千九百九十九亿九千九百九十九万九千九百九十九'
    )
  })

  test('toChineseWords should throw for invalid inputs', () => {
    expect(() => toChineseWords(Number.NaN)).toThrow()
    expect(() => toChineseWords(Number.POSITIVE_INFINITY)).toThrow()
  })

  test('toChineseWords should handle negative numbers', () => {
    expect(toChineseWords(-1)).toBe('负一')
    expect(toChineseWords(-10000)).toBe('负一万')
    expect(toChineseWords(-123)).toBe('负一百二十三')
    expect(toChineseWords(-12345)).toBe('负一万二千三百四十五')
  })

  test('toChineseWords should handle numbers with decimal point', () => {
    expect(toChineseWords(-1.45)).toBe('负一点四五')
    expect(toChineseWords(10000.00059)).toBe('一万点零零零五九')
    expect(toChineseWords(-0.00062)).toBe('负零点零零零六二')
  })
})

describe('fromChineseWords', () => {
  test('should handle 0-131', () => {
    arr.forEach((item, index) => {
      expect(fromChineseWords(item)).toBe(index)
    })
  })

  test('should convert Chinese words to numbers', () => {
    expect(fromChineseWords('一千二百三十四')).toBe(1234)
    expect(fromChineseWords('一万')).toBe(10000)
    expect(fromChineseWords('一万零一')).toBe(10001)
    expect(fromChineseWords('一万二千三百四十五')).toBe(12345)
    expect(fromChineseWords('一亿')).toBe(100000000)
    expect(fromChineseWords('一千零一十')).toBe(1010)
    expect(fromChineseWords('一万零一百')).toBe(10100)
    expect(fromChineseWords('十万一千')).toBe(101000)
    expect(fromChineseWords('一百万一千零一')).toBe(1001001)
    expect(fromChineseWords('一亿零一万')).toBe(100010000)
    expect(fromChineseWords('一亿一千万')).toBe(110000000)
    expect(fromChineseWords('一亿一千零一万')).toBe(110010000)
    expect(fromChineseWords('一万亿零一')).toBe(1000000000001)
  })

  test('should be permissive', () => {
    expect(fromChineseWords('一万零一十四')).toBe(10014)
    expect(fromChineseWords('一万零十四')).toBe(10014)
    expect(fromChineseWords('一万零百十四')).toBe(10114)
    expect(fromChineseWords('一万零一百十四')).toBe(10114)
    expect(fromChineseWords('一万零百一十四')).toBe(10114)
    expect(fromChineseWords('一万零一百一十四')).toBe(10114)
    expect(fromChineseWords('一万一十四')).toBe(10014)
    expect(fromChineseWords('一万十四')).toBe(10014)
    expect(fromChineseWords('一万百十四')).toBe(10114)
    expect(fromChineseWords('一万一百十四')).toBe(10114)
    expect(fromChineseWords('一万百一十四')).toBe(10114)
    expect(fromChineseWords('一万一百一十四')).toBe(10114)
  })

  test('should be able to reverse toChineseWords', () => {
    // Basic numbers
    expect(fromChineseWords('零')).toBe(0)
    expect(fromChineseWords('一')).toBe(1)
    expect(fromChineseWords('二')).toBe(2)
    expect(fromChineseWords('九')).toBe(9)

    // Teens and tens
    expect(fromChineseWords('十')).toBe(10)
    expect(fromChineseWords('十一')).toBe(11)
    expect(fromChineseWords('十九')).toBe(19)
    expect(fromChineseWords('二十')).toBe(20)
    expect(fromChineseWords('二十一')).toBe(21)
    expect(fromChineseWords('九十九')).toBe(99)

    // Hundreds
    expect(fromChineseWords('一百')).toBe(100)
    expect(fromChineseWords('一百零一')).toBe(101)
    expect(fromChineseWords('一百一十')).toBe(110)
    expect(fromChineseWords('二百')).toBe(200)
    expect(fromChineseWords('九百九十九')).toBe(999)

    // Thousands
    expect(fromChineseWords('一千')).toBe(1000)
    expect(fromChineseWords('一千零一')).toBe(1001)
    expect(fromChineseWords('一千零一十')).toBe(1010)
    expect(fromChineseWords('一千一百')).toBe(1100)
    expect(fromChineseWords('一千二百三十四')).toBe(1234)

    // Ten thousands
    expect(fromChineseWords('一万')).toBe(10000)
    expect(fromChineseWords('一万零一')).toBe(10001)
    expect(fromChineseWords('一万零一十')).toBe(10010)
    expect(fromChineseWords('一万零一百')).toBe(10100)
    expect(fromChineseWords('一万一千')).toBe(11000)
    expect(fromChineseWords('一万二千三百四十五')).toBe(12345)

    // Larger numbers
    expect(fromChineseWords('十万')).toBe(100000)
    expect(fromChineseWords('一百万')).toBe(1000000)
    expect(fromChineseWords('一千万')).toBe(10000000)
    expect(fromChineseWords('一亿')).toBe(100000000)
    expect(fromChineseWords('一万亿')).toBe(1000000000000)
  })

  test('should be able to reverse toChineseWords, complex', () => {
    expect(fromChineseWords('一千万一千零一')).toBe(10001001)
    expect(fromChineseWords('一亿零一十万零一百')).toBe(100100100)
    expect(fromChineseWords('一亿零一百零一万零一百零一')).toBe(101010101)

    expect(fromChineseWords('一千零一亿零一十万零一百')).toBe(100100100100)
    expect(fromChineseWords('一万零一十亿零一百万一千零一')).toBe(1001001001001)
    expect(fromChineseWords('一万零一十亿零一百万一千零一')).toBe(1001001001001)
    expect(fromChineseWords('一万零一百零一亿零一百零一万零一百零一')).toBe(
      1010101010101
    )
    expect(fromChineseWords('九万零九百零九亿零九百零九万零九百零九')).toBe(
      9090909090909
    )

    expect(fromChineseWords('一万亿一千')).toBe(1000000001000)
    expect(fromChineseWords('一万亿一千万零一百')).toBe(1000010000100)
    expect(fromChineseWords('一万零一十亿零一十万零一')).toBe(1001000100001)

    expect(
      fromChineseWords('一千二百三十四亿五千六百七十八万九千零一十二')
    ).toBe(123456789012)
    expect(
      fromChineseWords('九千八百七十六亿五千四百三十二万一千零九十八')
    ).toBe(987654321098)

    expect(
      fromChineseWords('一千一百一十一亿一千一百一十一万一千一百一十一')
    ).toBe(111111111111)
    expect(
      fromChineseWords('九千九百九十九亿九千九百九十九万九千九百九十九')
    ).toBe(999999999999)
  })

  test('should throw for invalid inputs', () => {
    expect(() => fromChineseWords('不是数字')).toThrow()
  })

  test('should handle negative numbers', () => {
    expect(fromChineseWords('负一')).toBe(-1)
    expect(fromChineseWords('负一万')).toBe(-10000)
    expect(fromChineseWords('负一百二十三')).toBe(-123)
    expect(fromChineseWords('负一万二千三百四十五')).toBe(-12345)
  })

  test('should handle numbers with decimal point', () => {
    expect(fromChineseWords('负一点四五')).toBe(-1.45)
    expect(fromChineseWords('一万点零零零五九')).toBe(10000.00059)
    expect(fromChineseWords('零点零零零六二')).toBe(0.00062)
    expect(fromChineseWords('负零点零零零六二')).toBe(-0.00062)
  })
})

describe('validateChineseWords', () => {
  test('should validate correct Chinese number words', () => {
    expect(validateChineseWords('零')).toBe(true)
    expect(validateChineseWords('一')).toBe(true)
    expect(validateChineseWords('二十一')).toBe(true)
    expect(validateChineseWords('一百')).toBe(true)
    expect(validateChineseWords('一千二百三十四')).toBe(true)
    expect(validateChineseWords('负一百')).toBe(true)
    expect(validateChineseWords('一百点五')).toBe(true)
  })

  test('should reject invalid Chinese number words', () => {
    expect(validateChineseWords('')).toBe(false)
    expect(validateChineseWords('无效')).toBe(false)
    expect(validateChineseWords('一百零一零')).toBe(false)
    expect(validateChineseWords('二十 一')).toBe(false)
    expect(validateChineseWords('一百，一')).toBe(false)
  })
})

describe('validateChineseFinancial strictness', () => {
  test('accepts the canonical form in either script', () => {
    expect(validateChineseFinancial('壹')).toBe(true)
    expect(validateChineseFinancial('拾')).toBe(true)
    expect(validateChineseFinancial('壹佰')).toBe(true)
    expect(validateChineseFinancial('壹万')).toBe(true)
    expect(validateChineseFinancial('壹萬')).toBe(true)
    expect(validateChineseFinancial('叁仟贰佰')).toBe(true)
    expect(validateChineseFinancial('貳')).toBe(true)
    expect(validateChineseFinancial('陸')).toBe(true)
  })

  test('rejects what a character-class test used to let through', () => {
    // Every one of these is built only from financial characters, so the previous
    // pattern-only check accepted them all.
    for (const junk of ['壹壹', '万万', '拾拾', '零零', '壹万壹', '仟佰拾']) {
      expect(validateChineseFinancial(junk)).toBe(false)
    }
  })

  test('rejects a bare 万, the same way the ordinary validator does', () => {
    // 万 and 亿 belong to both systems. Accepting a bare one in only the financial
    // validator made `万` read as a financial numeral, which is not what anyone typing
    // it means. Neither validator accepts it now: the canonical forms are 一万 and 壹万.
    expect(validateChineseFinancial('万')).toBe(false)
    expect(validateChineseWords('万')).toBe(false)
    expect(validateChineseFinancial('萬')).toBe(false)
    expect(validateChineseWords('萬')).toBe(false)
    expect(validateChineseWords('一万')).toBe(true)
    expect(validateChineseFinancial('壹万')).toBe(true)
  })

  test('rejects a non-canonical unit prefix, as the ordinary validator does', () => {
    expect(validateChineseFinancial('壹拾')).toBe(false)
    expect(validateChineseWords('一十')).toBe(false)
    expect(validateChineseFinancial('拾')).toBe(true)
    expect(validateChineseWords('十')).toBe(true)
  })

  test('rejects mixed Simplified and Traditional', () => {
    expect(validateChineseFinancial('貳拾陆')).toBe(false)
    expect(validateChineseFinancial('贰拾陆')).toBe(true)
    expect(validateChineseFinancial('貳拾陸')).toBe(true)
  })
})
