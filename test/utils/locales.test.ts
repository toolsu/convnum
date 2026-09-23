import { describe, expect, test } from 'bun:test'
import {
  convertFrom,
  convertTo,
  DEFAULT_LOCALES,
  getTypes,
  matchLocalisedName,
  type TypeInfo,
} from '../../src'

const ALL = { locales: DEFAULT_LOCALES }

/** The first reading of `str`, with every language considered. */
function firstType(str: string): TypeInfo {
  const [info] = getTypes(str, ALL)
  if (!info) {
    throw new Error(`no type for ${str}`)
  }
  return info
}

/** Reads `str`, adds `offset`, and writes the result back the same way. */
function step(str: string, offset: number): string {
  const info = firstType(str)
  return convertTo(convertFrom(str, info) + offset, info)
}

describe('matchLocalisedName', () => {
  test('reads a month in its own language', () => {
    expect(matchLocalisedName('janvier', 'month')).toEqual([
      { locale: 'fr', format: 'long', value: 1 },
    ])
    expect(matchLocalisedName('февраль', 'month')).toEqual([
      { locale: 'ru', format: 'long', value: 2 },
    ])
    expect(matchLocalisedName('Ocak', 'month')).toEqual([
      { locale: 'tr', format: 'long', value: 1 },
    ])
  })

  test('reads a weekday in its own language', () => {
    expect(matchLocalisedName('lundi', 'day')).toEqual([
      { locale: 'fr', format: 'long', value: 1 },
    ])
    expect(matchLocalisedName('Montag', 'day')).toEqual([
      { locale: 'de', format: 'long', value: 1 },
    ])
  })

  test('reports every language a name belongs to, preferred first', () => {
    const mars = matchLocalisedName('mars', 'month')
    expect(mars.map((each) => each.locale)).toEqual(['fr', 'sv', 'nb'])
    expect(new Set(mars.map((each) => each.value))).toEqual(new Set([3]))
  })

  test('keeps the languages in the order it was given', () => {
    expect(matchLocalisedName('mars', 'month', ['sv', 'fr'])[0]?.locale).toBe(
      'sv'
    )
    expect(matchLocalisedName('mars', 'month', ['fr', 'sv'])[0]?.locale).toBe(
      'fr'
    )
  })

  test('reports a name that means different months in different languages', () => {
    // The one real collision in the default list: Croatian's calendar is shifted.
    const listopad = matchLocalisedName('listopad', 'month')
    expect(listopad).toContainEqual({ locale: 'pl', format: 'long', value: 11 })
    expect(listopad).toContainEqual({ locale: 'cs', format: 'long', value: 11 })
    expect(listopad).toContainEqual({ locale: 'hr', format: 'long', value: 10 })
  })

  test('lower-cases the way the language does, not the way English does', () => {
    // Turkish writes mayıs with a dotless ı, so a naive toLowerCase misses `MAYIS`.
    expect(matchLocalisedName('MAYIS', 'month')).toEqual([
      { locale: 'tr', format: 'long', value: 5 },
    ])
    expect(matchLocalisedName('mayıs', 'month')).toEqual([
      { locale: 'tr', format: 'long', value: 5 },
    ])
  })

  test('accepts an abbreviation with or without its full stop', () => {
    expect(matchLocalisedName('déc.', 'month')).toContainEqual({
      locale: 'fr',
      format: 'short',
      value: 12,
    })
    expect(matchLocalisedName('déc', 'month')).toContainEqual({
      locale: 'fr',
      format: 'short',
      value: 12,
    })
  })

  test('reports one format when a language does not distinguish them', () => {
    // Japanese writes both as 1月, and English's May is the same either way. Claiming a
    // format would be inventing a distinction the language does not make.
    const may = matchLocalisedName('May', 'month', ['en'])
    expect(may).toEqual([{ locale: 'en', format: 'long', value: 5 }])
    const ja = matchLocalisedName('1月', 'month', ['ja'])
    expect(ja).toEqual([{ locale: 'ja', format: 'long', value: 1 }])
  })

  test('tells long from short where a language does distinguish them', () => {
    expect(matchLocalisedName('January', 'month', ['en'])).toEqual([
      { locale: 'en', format: 'long', value: 1 },
    ])
    expect(matchLocalisedName('Jan', 'month', ['en'])).toEqual([
      { locale: 'en', format: 'short', value: 1 },
    ])
  })

  test('returns nothing for what is not a name', () => {
    for (const junk of ['', '   ', 'xyzzy', '13', 'Janvierz']) {
      expect(matchLocalisedName(junk, 'month')).toEqual([])
      expect(matchLocalisedName(junk, 'day')).toEqual([])
    }
    expect(matchLocalisedName(null as unknown as string, 'month')).toEqual([])
  })

  test('skips a locale tag it cannot use rather than failing', () => {
    expect(
      matchLocalisedName('janvier', 'month', ['not a tag!!', 'fr'])
    ).toEqual([{ locale: 'fr', format: 'long', value: 1 }])
  })

  test('does not confuse months with weekdays', () => {
    expect(matchLocalisedName('lundi', 'month')).toEqual([])
    expect(matchLocalisedName('janvier', 'day')).toEqual([])
  })
})

describe('getTypes with locales', () => {
  test('recognises only English when it is not asked otherwise', () => {
    // The default has to stay exactly what it always was.
    expect(getTypes('January')).toEqual([
      { type: 'month_name', case: 'sentence', format: 'long' },
    ])
    expect(getTypes('janvier')).toEqual([{ type: 'unknown' }])
    expect(getTypes('Montag')).toEqual([{ type: 'unknown' }])
    expect(getTypes('1月')).toEqual([{ type: 'unknown' }])
  })

  test('reports the language it read a name in', () => {
    expect(getTypes('janvier', ALL)).toEqual([
      { type: 'month_name', case: 'lower', format: 'long', locale: 'fr' },
    ])
    expect(getTypes('Montag', ALL)).toEqual([
      { type: 'day_of_week', case: 'sentence', format: 'long', locale: 'de' },
    ])
  })

  test('reports every reading, so a caller can pick between them', () => {
    const readings = getTypes('mars', ALL)
    expect(readings.map((info) => info.locale)).toEqual(['fr', 'sv', 'nb'])
    expect(readings.every((info) => info.type === 'month_name')).toBe(true)
  })

  test('honours a narrower list of languages', () => {
    expect(getTypes('janvier', { locales: ['de', 'es'] })).toEqual([
      { type: 'unknown' },
    ])
    expect(getTypes('January', { locales: ['fr'] })).toEqual([
      { type: 'unknown' },
    ])
  })

  test('still finds the other numeral systems alongside', () => {
    // A locale list must not narrow anything but month and weekday names.
    expect(getTypes('1', ALL).map((info) => info.type)).toContain('decimal')
    expect(getTypes('IV', ALL).map((info) => info.type)).toContain('roman')
    expect(getTypes('一', ALL).map((info) => info.type)).toContain(
      'chinese_words'
    )
  })

  test('detects case in scripts that have one, and leaves the rest alone', () => {
    expect(getTypes('JANVIER', ALL)[0]?.case).toBe('upper')
    expect(getTypes('Janvier', ALL)[0]?.case).toBe('sentence')
    expect(getTypes('janvier', ALL)[0]?.case).toBe('lower')
    expect(getTypes('ЯНВАРЬ', ALL)[0]?.case).toBe('upper')
  })
})

describe('converting a localised month or weekday', () => {
  test('counts on in the language it was written in', () => {
    expect(step('janvier', 2)).toBe('mars')
    expect(step('Januar', 2)).toBe('März')
    expect(step('enero', 2)).toBe('marzo')
    expect(step('январь', 2)).toBe('март')
    expect(step('1月', 2)).toBe('3月')
    expect(step('gennaio', 2)).toBe('marzo')
    // `januari` is Dutch, Swedish, Indonesian and Malay alike; Dutch comes first in the
    // default order, so that is the one a bare name is read as.
    expect(step('januari', 2)).toBe('maart')
    expect(step('januari', 2)).not.toBe('mars')
  })

  test('counts weekdays on in the language too', () => {
    expect(step('lundi', 2)).toBe('mercredi')
    expect(step('Montag', 2)).toBe('Mittwoch')
    expect(step('星期一', 2)).toBe('星期三')
    expect(step('понедельник', 2)).toBe('среда')
  })

  test('keeps the case it was written in', () => {
    expect(step('MAYIS', 2)).toBe('TEMMUZ')
    expect(step('JANVIER', 2)).toBe('MARS')
    expect(step('janvier', 2)).toBe('mars')
    expect(step('Janvier', 2)).toBe('Mars')
  })

  test('keeps short short and long long', () => {
    expect(step('Jan', 2)).toBe('Mar')
    expect(step('January', 2)).toBe('March')
    expect(step('janv.', 2)).toBe('mars')
    expect(step('lun.', 2)).toBe('mer.')
  })

  test('wraps around the end of the year and the week', () => {
    expect(step('décembre', 1)).toBe('janvier')
    expect(step('dimanche', 1)).toBe('lundi')
    expect(step('samedi', 1)).toBe('dimanche')
  })

  test('falls back to English when no language is recorded', () => {
    expect(convertTo(1, { type: 'month_name', format: 'long' })).toBe('January')
    expect(convertTo(1, { type: 'day_of_week', format: 'long' })).toBe('Monday')
  })

  test('round-trips every month of every language in the default list', () => {
    for (const locale of DEFAULT_LOCALES) {
      for (const format of ['long', 'short'] as const) {
        for (let month = 1; month <= 12; month++) {
          const info: TypeInfo = { type: 'month_name', locale, format }
          const written = convertTo(month, info)
          expect(convertFrom(written, info)).toBe(month)
        }
      }
    }
  })

  test('round-trips every weekday of every language in the default list', () => {
    for (const locale of DEFAULT_LOCALES) {
      for (const format of ['long', 'short'] as const) {
        for (let day = 0; day < 7; day++) {
          const info: TypeInfo = { type: 'day_of_week', locale, format }
          const written = convertTo(day, info)
          expect(convertFrom(written, info)).toBe(day)
        }
      }
    }
  })

  test('detects back what it wrote, everywhere the name is unambiguous', () => {
    // The stronger claim: what convnum writes, convnum reads back as the same month —
    // and where it cannot, the name really does mean two different months in two
    // different languages. Pinning that set is the point: it is the whole ambiguity
    // surface of the default list, and it should not grow unnoticed.
    const ambiguous: string[] = []

    for (const locale of DEFAULT_LOCALES) {
      for (let month = 1; month <= 12; month++) {
        const written = convertTo(month, {
          type: 'month_name',
          locale,
          format: 'long',
        })
        const detected = getTypes(written, ALL)
        expect(detected.length).toBeGreaterThan(0)
        expect(detected[0]?.type).toBe('month_name')

        // Whichever language wins, reading the name back in *that* language is exact.
        const first = detected[0] as TypeInfo
        expect(convertFrom(written, first)).toBe(
          matchLocalisedName(written, 'month')[0]?.value
        )

        if (convertFrom(written, first) !== month) {
          ambiguous.push(`${locale}:${month}=${written}`)
        }
      }
    }

    // Croatian's month names are shifted a month against Polish and Czech, which share
    // the same Slavic roots: listopad is November in Polish and Czech, October in
    // Croatian, and Polish is preferred.
    expect([...new Set(ambiguous.map((each) => each.split('=')[1]))]).toEqual([
      'listopad',
    ])
  })

  test('reads every short name back as the month the winning language means', () => {
    for (const locale of DEFAULT_LOCALES) {
      for (let month = 1; month <= 12; month++) {
        const written = convertTo(month, {
          type: 'month_name',
          locale,
          format: 'short',
        })
        const [best] = matchLocalisedName(written, 'month')
        expect(best).toBeDefined()
        expect(
          convertFrom(written, getTypes(written, ALL)[0] as TypeInfo)
        ).toBe(best?.value)
      }
    }
  })
})
