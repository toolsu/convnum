import { describe, expect, test } from 'bun:test'
import {
  fromDayOfWeek,
  fromJulianDay,
  fromMonth,
  toDayOfWeek,
  toJulianDay,
  toMonth,
} from '../../src'

describe('Month Conversion Functions', () => {
  describe('toMonth function', () => {
    test('converts month numbers to English month names by default', () => {
      expect(toMonth(1)).toBe('January')
      expect(toMonth(2)).toBe('February')
      expect(toMonth(3)).toBe('March')
      expect(toMonth(4)).toBe('April')
      expect(toMonth(5)).toBe('May')
      expect(toMonth(6)).toBe('June')
      expect(toMonth(7)).toBe('July')
      expect(toMonth(8)).toBe('August')
      expect(toMonth(9)).toBe('September')
      expect(toMonth(10)).toBe('October')
      expect(toMonth(11)).toBe('November')
      expect(toMonth(12)).toBe('December')
    })

    test('converts month numbers to short format when specified', () => {
      expect(toMonth(1, 'en-US', 'short')).toBe('Jan')
      expect(toMonth(4, 'en-US', 'short')).toBe('Apr')
      expect(toMonth(12, 'en-US', 'short')).toBe('Dec')
    })

    test('converts month numbers to different locales', () => {
      expect(toMonth(1, 'fr-FR')).toBe('janvier')
      expect(toMonth(5, 'fr-FR')).toBe('mai')
      expect(toMonth(12, 'fr-FR')).toBe('décembre')

      expect(toMonth(1, 'de-DE')).toBe('Januar')
      expect(toMonth(4, 'de-DE')).toBe('April')
      expect(toMonth(10, 'de-DE')).toBe('Oktober')

      expect(toMonth(2, 'es-ES')).toBe('febrero')
      expect(toMonth(8, 'es-ES')).toBe('agosto')
    })

    test('combines locale and type parameters correctly', () => {
      expect(toMonth(3, 'fr-FR', 'short')).toBe('mars')
      expect(toMonth(7, 'de-DE', 'short')).toBe('Jul')
      expect(toMonth(9, 'ja-JP', 'short')).toBe('9月')
      expect(toMonth(11, 'zh-CN', 'short')).toBe('11月')
      expect(toMonth(11, 'zh-TW', 'short')).toBe('11月')
    })

    test('throws error for invalid month numbers', () => {
      expect(() => toMonth(0)).toThrow()
      expect(() => toMonth(13)).toThrow()
      expect(() => toMonth(-5)).toThrow()
      expect(() => toMonth(3.5)).toThrow()
    })
  })

  describe('fromMonth function', () => {
    test('converts English month names to numbers', () => {
      expect(fromMonth('January')).toBe(1)
      expect(fromMonth('February')).toBe(2)
      expect(fromMonth('March')).toBe(3)
      expect(fromMonth('April')).toBe(4)
      expect(fromMonth('May')).toBe(5)
      expect(fromMonth('June')).toBe(6)
      expect(fromMonth('July')).toBe(7)
      expect(fromMonth('August')).toBe(8)
      expect(fromMonth('September')).toBe(9)
      expect(fromMonth('October')).toBe(10)
      expect(fromMonth('November')).toBe(11)
      expect(fromMonth('December')).toBe(12)
    })

    test('converts short English month names to numbers', () => {
      expect(fromMonth('Jan')).toBe(1)
      expect(fromMonth('Feb')).toBe(2)
      expect(fromMonth('Mar')).toBe(3)
      expect(fromMonth('Apr')).toBe(4)
      expect(fromMonth('Aug')).toBe(8)
      expect(fromMonth('Dec')).toBe(12)
    })

    test('is case-insensitive', () => {
      expect(fromMonth('january')).toBe(1)
      expect(fromMonth('MARCH')).toBe(3)
      expect(fromMonth('Jul')).toBe(7)
      expect(fromMonth('ocToBer')).toBe(10)
    })

    test('converts month names in different locales', () => {
      expect(fromMonth('janvier', 'fr-FR')).toBe(1)
      expect(fromMonth('févr.', 'fr-FR')).toBe(2)
      expect(fromMonth('févr', 'fr-FR')).toBe(2)
      expect(fromMonth('décembre', 'fr-FR')).toBe(12)

      expect(fromMonth('Januar', 'de-DE')).toBe(1)
      expect(fromMonth('Mär', 'de-DE')).toBe(3)
      expect(fromMonth('Dez', 'de-DE')).toBe(12)

      expect(fromMonth('enero', 'es-ES')).toBe(1)
      expect(fromMonth('abr', 'es-ES')).toBe(4)
    })

    test('returns null for invalid month names', () => {
      expect(fromMonth('NotAMonth')).toBeNull()
      expect(fromMonth('Janu')).toBeNull()
      expect(fromMonth('')).toBeNull()
      expect(fromMonth('Janvier')).toBeNull() // French in English locale
    })

    test('handles edge cases', () => {
      expect(fromMonth(null as unknown as string)).toBeNull()
      expect(fromMonth(undefined as unknown as string)).toBeNull()
      expect(fromMonth(123 as unknown as string)).toBeNull()
    })
  })
})

describe('Day Conversion Functions', () => {
  describe('toDayOfWeek function', () => {
    test('converts day numbers to English day names by default', () => {
      expect(toDayOfWeek(0)).toBe('Sunday')
      expect(toDayOfWeek(1)).toBe('Monday')
      expect(toDayOfWeek(2)).toBe('Tuesday')
      expect(toDayOfWeek(3)).toBe('Wednesday')
      expect(toDayOfWeek(4)).toBe('Thursday')
      expect(toDayOfWeek(5)).toBe('Friday')
      expect(toDayOfWeek(6)).toBe('Saturday')
    })

    test('converts day numbers to short format when specified', () => {
      expect(toDayOfWeek(0, 'en-US', 'short')).toBe('Sun')
      expect(toDayOfWeek(3, 'en-US', 'short')).toBe('Wed')
      expect(toDayOfWeek(6, 'en-US', 'short')).toBe('Sat')
    })

    test('converts day numbers to different locales', () => {
      expect(toDayOfWeek(0, 'fr-FR')).toBe('dimanche')
      expect(toDayOfWeek(1, 'fr-FR')).toBe('lundi')
      expect(toDayOfWeek(6, 'fr-FR')).toBe('samedi')

      expect(toDayOfWeek(0, 'de-DE')).toBe('Sonntag')
      expect(toDayOfWeek(3, 'de-DE')).toBe('Mittwoch')
      expect(toDayOfWeek(5, 'de-DE')).toBe('Freitag')

      expect(toDayOfWeek(0, 'ja-JP')).toBe('日曜日')
      expect(toDayOfWeek(4, 'ja-JP')).toBe('木曜日')

      expect(toDayOfWeek(0, 'zh-CN')).toBe('星期日')
      expect(toDayOfWeek(4, 'zh-CN')).toBe('星期四')

      expect(toDayOfWeek(0, 'zh-TW')).toBe('星期日')
      expect(toDayOfWeek(4, 'zh-TW')).toBe('星期四')
    })

    test('combines locale and type parameters correctly', () => {
      expect(toDayOfWeek(1, 'fr-FR', 'short')).toBe('lun.')
      expect(toDayOfWeek(2, 'de-DE', 'short')).toBe('Di')
      expect(toDayOfWeek(6, 'ja-JP', 'short')).toBe('土')
      expect(toDayOfWeek(6, 'zh-CN', 'short')).toBe('周六')
      expect(toDayOfWeek(6, 'zh-TW', 'short')).toBe('週六')
    })

    test('throws error for invalid day numbers', () => {
      expect(() => toDayOfWeek(-1)).toThrow()
      expect(() => toDayOfWeek(7)).toThrow()
      expect(() => toDayOfWeek(10)).toThrow()
      expect(() => toDayOfWeek(2.5)).toThrow()
    })
  })

  describe('fromDayOfWeek function', () => {
    test('converts English day names to numbers', () => {
      expect(fromDayOfWeek('Sunday')).toBe(0)
      expect(fromDayOfWeek('Monday')).toBe(1)
      expect(fromDayOfWeek('Tuesday')).toBe(2)
      expect(fromDayOfWeek('Wednesday')).toBe(3)
      expect(fromDayOfWeek('Thursday')).toBe(4)
      expect(fromDayOfWeek('Friday')).toBe(5)
      expect(fromDayOfWeek('Saturday')).toBe(6)
    })

    test('converts short English day names to numbers', () => {
      expect(fromDayOfWeek('Sun')).toBe(0)
      expect(fromDayOfWeek('Mon')).toBe(1)
      expect(fromDayOfWeek('Tue')).toBe(2)
      expect(fromDayOfWeek('Wed')).toBe(3)
      expect(fromDayOfWeek('Thu')).toBe(4)
      expect(fromDayOfWeek('Fri')).toBe(5)
      expect(fromDayOfWeek('Sat')).toBe(6)
    })

    test('is case-insensitive', () => {
      expect(fromDayOfWeek('sunday')).toBe(0)
      expect(fromDayOfWeek('MONDAY')).toBe(1)
      expect(fromDayOfWeek('wEdNeSdAy')).toBe(3)
      expect(fromDayOfWeek('fri')).toBe(5)
    })

    test('converts day names in different locales', () => {
      expect(fromDayOfWeek('dimanche', 'fr-FR')).toBe(0)
      expect(fromDayOfWeek('lundi', 'fr-FR')).toBe(1)
      expect(fromDayOfWeek('sam.', 'fr-FR')).toBe(6)
      expect(fromDayOfWeek('sam', 'fr-FR')).toBe(6)

      expect(fromDayOfWeek('Sonntag', 'de-DE')).toBe(0)
      expect(fromDayOfWeek('Mi', 'de-DE')).toBe(3)
      expect(fromDayOfWeek('Freitag', 'de-DE')).toBe(5)

      expect(fromDayOfWeek('domingo', 'es-ES')).toBe(0)
      expect(fromDayOfWeek('mar', 'es-ES')).toBe(2)
      expect(fromDayOfWeek('sábado', 'es-ES')).toBe(6)

      expect(fromDayOfWeek('日曜日', 'ja-JP')).toBe(0)
      expect(fromDayOfWeek('水', 'ja-JP')).toBe(3)

      expect(fromDayOfWeek('星期日', 'zh-CN')).toBe(0)
      expect(fromDayOfWeek('周三', 'zh-CN')).toBe(3)

      expect(fromDayOfWeek('星期日', 'zh-TW')).toBe(0)
      expect(fromDayOfWeek('週三', 'zh-TW')).toBe(3)
    })

    test('returns null for invalid day names', () => {
      expect(fromDayOfWeek('NotADay')).toBeNull()
      expect(fromDayOfWeek('Mond')).toBeNull()
      expect(fromDayOfWeek('')).toBeNull()
      expect(fromDayOfWeek('Lundi')).toBeNull() // French in English locale
    })

    test('handles edge cases', () => {
      expect(fromDayOfWeek(null as unknown as string)).toBeNull()
      expect(fromDayOfWeek(undefined as unknown as string)).toBeNull()
      expect(fromDayOfWeek(123 as unknown as string)).toBeNull()
    })
  })
})

describe('Month and Day Conversion Integration', () => {
  test('round trip conversion works for months', () => {
    // Test round trip from number -> name -> number
    for (let i = 1; i <= 12; i++) {
      const monthName = toMonth(i)
      expect(fromMonth(monthName)).toBe(i)
    }

    const locales = [
      'en-US',
      'fr-FR',
      'de-DE',
      'es-ES',
      'ja-JP',
      'zh-CN',
      'zh-TW',
    ]
    for (const locale of locales) {
      for (let i = 1; i <= 12; i++) {
        const monthName = toMonth(i, locale)
        expect(fromMonth(monthName, locale)).toBe(i)
      }
    }

    for (let i = 1; i <= 12; i++) {
      const monthShort = toMonth(i, 'en-US', 'short')
      expect(fromMonth(monthShort)).toBe(i)
    }
  })

  test('round trip conversion works for days', () => {
    // Test round trip from number -> name -> number
    for (let i = 0; i < 7; i++) {
      const dayName = toDayOfWeek(i)
      expect(fromDayOfWeek(dayName)).toBe(i)
    }

    const locales = [
      'en-US',
      'fr-FR',
      'de-DE',
      'es-ES',
      'ja-JP',
      'zh-CN',
      'zh-TW',
    ]
    for (const locale of locales) {
      for (let i = 0; i < 7; i++) {
        const dayName = toDayOfWeek(i, locale)
        expect(fromDayOfWeek(dayName, locale)).toBe(i)
      }
    }

    for (let i = 0; i < 7; i++) {
      const dayShort = toDayOfWeek(i, 'en-US', 'short')
      expect(fromDayOfWeek(dayShort)).toBe(i)
    }
  })

  test('confirms correct numerical values by checking date logic', () => {
    // January is month 1 and has 31 days
    expect(toMonth(1)).toBe('January')
    expect(new Date(2023, 1 - 1, 31).getDate()).toBe(31)

    // February is month 2 and has 28 days in non-leap years
    expect(toMonth(2)).toBe('February')
    expect(new Date(2023, 2 - 1, 28).getDate()).toBe(28)

    // Sunday is day 0
    expect(toDayOfWeek(0)).toBe('Sunday')
    expect(new Date(2023, 0, 1).getDay()).toBe(0) // Jan 1, 2023 was a Sunday

    // Wednesday is day 3
    expect(toDayOfWeek(3)).toBe('Wednesday')
    expect(new Date(2023, 0, 4).getDay()).toBe(3) // Jan 4, 2023 was a Wednesday
  })
})

describe('Julian day conversions', () => {
  test('should convert between Date and Julian day', () => {
    // Use local calendar components (toJulianDay reads the local date), so the
    // test is timezone-independent
    const date = new Date(2021, 0, 1, 12, 0, 0)
    const julianDay = 2459216

    expect(toJulianDay(date)).toBe(julianDay)

    const resultDate = fromJulianDay(julianDay)
    expect(resultDate.getFullYear()).toBe(2021)
    expect(resultDate.getMonth()).toBe(0) // January is 0
    expect(resultDate.getDate()).toBe(1)
  })
})
