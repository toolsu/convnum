import type { FormatType } from './types'

/**
 * The languages whose month and weekday names are recognised.
 *
 * ICU carries several hundred locales and trying them all would be both slow and
 * counter-productive: every language added brings more names that collide with another
 * language's, and the rare ones buy almost nobody anything. This list covers the
 * languages a text editor is realistically used in, and measured across it only four
 * month names and five weekday abbreviations are read as *different numbers* in
 * different languages — all Slavic, where Croatian's month names are shifted against
 * Polish and Czech (`listopad` is November in Polish and Czech, October in Croatian).
 *
 * Order is priority order: it is what settles a name that several languages share, so
 * `en` comes first and the rest follow rough usage. A caller that knows better — an
 * editor that knows its user's display language, say — passes its own list.
 *
 * These are the *standalone* names, the ones a month or weekday is called on its own.
 * They are deliberately not used to read dates: Russian, Ukrainian, Polish, Czech,
 * Lithuanian, Croatian and Finnish all put the month in a different grammatical case
 * inside a date (`январь` on its own, `15 января 2023` in a date), and `Intl` offers no
 * way to enumerate those forms.
 *
 * @category Date
 */
export const DEFAULT_LOCALES: readonly string[] = [
  'en',
  'de',
  'fr',
  'es',
  'pt',
  'it',
  'nl',
  'sv',
  'da',
  'nb',
  'fi',
  'pl',
  'cs',
  'sk',
  'hu',
  'ro',
  'el',
  'ru',
  'uk',
  'tr',
  'ar',
  'he',
  'hi',
  'th',
  'vi',
  'id',
  'ms',
  'ja',
  'ko',
  'zh-CN',
  'zh-TW',
  'ca',
  'hr',
  'sr',
  'bg',
  'lt',
  'lv',
  'et',
  'sl',
  'fa',
]

/** One way of reading a string as a month or weekday name. */
export interface LocalisedName {
  /** The language it was read in. */
  readonly locale: string
  readonly format: FormatType
  /** 1–12 for a month, 0–6 for a weekday, where 0 is Sunday. */
  readonly value: number
}

/** Which set of names to look in. */
export type NameKind = 'month' | 'day'

const FORMATS: readonly FormatType[] = ['long', 'short']

/**
 * Normalises a name for comparison, in the way that language writes it.
 *
 * Lower-casing has to be locale-aware or Turkish breaks: `'MAYIS'.toLowerCase()` is
 * `'mayis'`, while Turkish writes `mayıs` with a dotless ı. The trailing full stop is
 * dropped because most languages abbreviate with one — French writes `déc.` and `janv.`
 * — and a user who leaves it off means the same month.
 */
function normalise(name: string, locale: string): string {
  return name.normalize('NFC').toLocaleLowerCase(locale).replace(/\.$/, '')
}

/** How thoroughly to look: the everyday spelling, or every spelling. */
type Depth = 'standalone' | 'all'

/** The names of one language, indexed by their normalised form. */
type LocaleNames = Map<string, LocalisedName[]>

const indexes = new Map<string, LocaleNames>()

/** The `Intl` options that render one month or weekday in a given context. */
function optionsFor(
  kind: NameKind,
  format: FormatType,
  context: Depth | 'withYear' | 'withDay'
): Intl.DateTimeFormatOptions {
  const field = kind === 'month' ? 'month' : 'weekday'
  const base = {
    [field]: format,
    timeZone: 'UTC',
  } as Intl.DateTimeFormatOptions
  if (context === 'withYear') {
    return kind === 'month' ? { ...base, year: 'numeric' } : base
  }
  if (context === 'withDay') {
    return kind === 'month'
      ? { ...base, day: 'numeric' }
      : { ...base, day: 'numeric', month: 'numeric' }
  }
  return base
}

/**
 * The formatters that render one month or weekday in each context, built once per
 * language and width.
 *
 * Constructing an `Intl.DateTimeFormat` is by far the expensive part — nine hundred of
 * them is a fifth of a second — so they are made once and reused across the twelve months
 * or seven days rather than once per name.
 */
function formattersFor(
  locale: string,
  kind: NameKind,
  format: FormatType,
  depth: Depth
): { standalone: Intl.DateTimeFormat; contextual: Intl.DateTimeFormat[] } {
  const standalone = new Intl.DateTimeFormat(
    locale,
    optionsFor(kind, format, 'standalone')
  )
  if (depth === 'standalone') {
    return { standalone, contextual: [] }
  }
  return {
    standalone,
    contextual: (['withYear', 'withDay'] as const).map(
      (context) =>
        new Intl.DateTimeFormat(locale, optionsFor(kind, format, context))
    ),
  }
}

/**
 * Every spelling of one month or weekday that should be recognised.
 *
 * The first is the standalone name, and it is the only one anything is ever written back
 * as. The others are the forms the same language uses inside a date, which several put in
 * a different grammatical case — Russian says `январь` alone and `января` in a date,
 * Greek `Ιανουάριος` and `Ιανουαρίου`, Finnish `tammikuu` and `tammikuuta`. Accepting
 * them costs almost nothing (measured: one extra name maps to a second month, the Polish
 * genitive of the Croatian collision that was already there) and means a user who types
 * the form they see in dates is understood.
 *
 * Only forms containing a letter are taken. Japanese and Chinese put the 月 in the date
 * pattern rather than in the month name, so their in-date form is the bare digit `1`, and
 * indexing that would turn every number into a month.
 */
function writtenForms(
  formatters: ReturnType<typeof formattersFor>,
  kind: NameKind,
  date: number
): string[] {
  const field = kind === 'month' ? 'month' : 'weekday'
  const standalone = formatters.standalone.format(date)

  const contextual = formatters.contextual.map((formatter) =>
    formatter
      .formatToParts(date)
      .filter((part) => part.type === field)
      .map((part) => part.value)
      .join('')
  )

  return [
    standalone,
    ...contextual.filter(
      (form) => form && form !== standalone && /\p{L}/u.test(form)
    ),
  ]
}

/**
 * Builds one language's index at one depth, once.
 *
 * Two depths rather than one because thoroughness is expensive and rarely needed: the
 * standalone names of all forty languages cost about 40 ms to gather, all their in-date
 * forms as well about 310 ms. Almost every lookup is answered by the first, so the second
 * is built only when the first found nothing — the user typed `января` rather than
 * `январь` — and a range command never stalls for it on the common path.
 */
function indexFor(locale: string, kind: NameKind, depth: Depth): LocaleNames {
  const cacheKey = `${locale}|${kind}|${depth}`
  const cached = indexes.get(cacheKey)
  if (cached) {
    return cached
  }

  const names: LocaleNames = new Map()
  const count = kind === 'month' ? 12 : 7

  for (const format of FORMATS) {
    const formatters = formattersFor(locale, kind, format, depth)
    for (let index = 0; index < count; index++) {
      // Any year, and mid-month or a known Sunday, so no time zone can shift the date
      // into its neighbour. 2023-01-01 was a Sunday.
      const date =
        kind === 'month'
          ? Date.UTC(2021, index, 15)
          : Date.UTC(2023, 0, 1 + index)
      const entry: LocalisedName = {
        locale,
        format,
        value: kind === 'month' ? index + 1 : index,
      }

      for (const written of writtenForms(formatters, kind, date)) {
        const key = normalise(written, locale)
        const existing = names.get(key)
        if (!existing) {
          names.set(key, [entry])
        } else if (!existing.some((each) => each.value === entry.value)) {
          existing.push(entry)
        }
        // A language whose short and long forms are identical — Japanese writes both as
        // `1月`, English's `May` is the same either way — keeps the `long` entry, which
        // was recorded first. There is nothing to distinguish, so claiming `short` would
        // be inventing a distinction the language does not make.
      }
    }
  }

  indexes.set(cacheKey, names)
  return names
}

/** Looks `name` up in every language, at one depth. */
function lookup(
  name: string,
  kind: NameKind,
  locales: readonly string[],
  depth: Depth
): LocalisedName[] {
  const matches: LocalisedName[] = []
  const seen = new Set<string>()

  for (const locale of locales) {
    let names: LocaleNames
    try {
      names = indexFor(locale, kind, depth)
    } catch {
      // An unsupported locale tag. Skip it rather than failing the whole lookup.
      continue
    }
    for (const match of names.get(normalise(name, locale)) ?? []) {
      const key = `${match.locale}|${match.format}|${match.value}`
      if (!seen.has(key)) {
        seen.add(key)
        matches.push(match)
      }
    }
  }

  return matches
}

export function matchLocalisedName(
  name: string,
  kind: NameKind,
  locales: readonly string[] = DEFAULT_LOCALES
): LocalisedName[] {
  if (typeof name !== 'string') {
    return []
  }
  const trimmed = name.trim()
  if (trimmed === '') {
    return []
  }

  // The everyday spelling first, and only if that finds nothing the whole set including
  // the forms a language uses inside a date. Building the second costs about eight times
  // what the first does, and almost nothing needs it.
  const standalone = lookup(trimmed, kind, locales, 'standalone')
  return standalone.length > 0
    ? standalone
    : lookup(trimmed, kind, locales, 'all')
}
