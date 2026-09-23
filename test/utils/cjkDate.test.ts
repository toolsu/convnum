import { describe, expect, test } from 'bun:test'
import { formatDayString, formatMonthString, parseDateString } from '../../src'

/** The formats `parseDateString` offers for `input`, in the order it offers them. */
function formats(input: string): string[] {
  return parseDateString(input).map((each) => each.format)
}

/** Reads `input`, moves it by `offset`, and writes it back the same way. */
function step(input: string, offset: number): string {
  const [first] = parseDateString(input)
  if (!first) {
    throw new Error(`could not parse ${input}`)
  }
  return first.days !== undefined
    ? formatDayString(first.days + offset, first.format)
    : formatMonthString((first.months as number) + offset, first.format)
}

describe('suffix-labelled dates', () => {
  test('reads a full date in Japanese and Chinese', () => {
    expect(parseDateString('2023年12月25日')[0]).toMatchObject({
      format: 'Y4年M1月D1日',
      days: 19716,
    })
  })

  test('reads a full date in Korean, keeping its spacing', () => {
    expect(parseDateString('2023년 12월 25일')[0]).toMatchObject({
      format: 'Y4년 M1월 D1일',
      days: 19716,
    })
    expect(parseDateString('2023년12월25일')[0]?.format).toBe('Y4년M1월D1일')
  })

  test('reads a year and month, and a month and day', () => {
    expect(parseDateString('2023年12月')[0]).toMatchObject({
      format: 'Y4年M1月',
      months: 647,
    })
    expect(parseDateString('12月25日')[0]).toMatchObject({
      format: 'M1月D1日',
    })
    expect(parseDateString('12월 25일')[0]?.format).toBe('M1월 D1일')
  })

  test('offers both paddings when two digits could be either', () => {
    // `12月` may be padded or simply two digits wide, and only the other end of a range
    // can say which — exactly as `2023-12` is read both ways.
    expect(formats('2023年12月')).toEqual(['Y4年M1月', 'Y4年M2月'])
    // A leading zero can only be padded, a single digit can only be unpadded.
    expect(formats('2023年01月')).toEqual(['Y4年M2月'])
    expect(formats('2023年3月')).toEqual(['Y4年M1月'])
  })

  test('prefers the unpadded reading, which is how these layouts are written', () => {
    expect(formats('2023年12月25日')[0]).toBe('Y4年M1月D1日')
    expect(step('2023年12月25日', 7)).toBe('2024年1月1日')
  })

  test('keeps an explicit padding', () => {
    expect(step('2023年01月05日', 30)).toBe('2023年02月04日')
    expect(step('2023年01月', 2)).toBe('2023年03月')
  })

  test('counts days and months on', () => {
    expect(step('2023年12月25日', 1)).toBe('2023年12月26日')
    expect(step('2023年12月31日', 1)).toBe('2024年1月1日')
    expect(step('2023年2月28日', 1)).toBe('2023年3月1日')
    expect(step('2024年2月28日', 1)).toBe('2024年2月29日')
    expect(step('2023年12月', 1)).toBe('2024年1月')
    expect(step('2023년 12월 31일', 1)).toBe('2024년 1월 1일')
  })

  test('refuses a date that does not exist', () => {
    for (const bad of [
      '2023年2月30日',
      '2023年13月1日',
      '2023年0月1日',
      '2023年1月0日',
      '2023年1月32日',
      '2023年2月29日',
    ]) {
      expect(() => parseDateString(bad)).toThrow()
    }
    expect(() => parseDateString('2024年2月29日')).not.toThrow()
  })

  test('refuses a layout that is not one of these', () => {
    for (const bad of [
      '2023年',
      '12日',
      '年月日',
      '2023年12月25',
      '12345年1月1日',
    ]) {
      expect(() => parseDateString(bad)).toThrow()
    }
  })

  test('does not mix the two scripts', () => {
    expect(() => parseDateString('2023年12월25日')).toThrow()
    expect(() => parseDateString('2023년12月25일')).toThrow()
  })

  test('accepts a year of any length, and keeps its width', () => {
    // These layouts are used for historical dates too, where the year is not four
    // digits: 8年3月9日 is the year 8, not 1908 — the two-digit-year rule that
    // `Date.UTC` still applies would have made it so.
    expect(formats('1208年3月9日')[0]).toBe('Y4年M1月D1日')
    expect(formats('208年3月9日')[0]).toBe('Y3年M1月D1日')
    expect(formats('08年3月9日')[0]).toBe('Y2年M1月D1日')
    expect(formats('8年3月9日')[0]).toBe('Y1年M1月D1日')
    expect(formats('0008年3月9日')[0]).toBe('Y4年M1月D1日')

    expect(step('8年3月9日', 0)).toBe('8年3月9日')
    expect(step('08年3月9日', 0)).toBe('08年3月9日')
    expect(step('208年3月9日', 1)).toBe('208年3月10日')
    expect(step('1208年03月9日', 1)).toBe('1208年03月10日')
    expect(step('8년 12월', 1)).toBe('9년 1월')
  })

  test('lets a year outgrow the width it was written with', () => {
    // A minimum width, never a truncation.
    expect(step('999年12月31日', 1)).toBe('1000年1月1日')
    expect(step('99年12月', 1)).toBe('100年1月')
  })

  test('leaves the separator-based formats alone', () => {
    expect(formats('2023-12-25')).toContain('Y-M2-D2')
    expect(formats('2023-01')).toContain('Y-M2')
    expect(formats('Dec 25, 2023')).toContain('Ms D2, Y')
    expect(step('2023-12-25', 1)).toBe('2023-12-26')
  })
})
