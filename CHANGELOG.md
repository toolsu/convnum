# Changelog

## 1.0.0

### Features

- Support negative (`-x`) input in all non-decimal bases
- Add `digits` prop to `TypeInfo` for zero-padded digit count in decimal, octal, hexadecimal, and binary
- Add type aliases for base number types (`hex`, `bin`, `oct`, `dec`), usable both as a bare string and as the `type` field of a `TypeInfo` object
- English ordinal abbreviation type `english_ordinal_abbr`, plus new `french_ordinal_abbr` support
- English and French ordinal words (`english_ordinal_words`, `french_ordinal_words`): first, deuxième, twenty-first, vingt-et-unième, etc.
- Correct English and French cardinal/ordinal words with strictly official spelling, plus US/UK style (`ukStyle`, "and" usage)
- Read and write the East Asian date layouts that label each field with a suffix: `2023年12月25日`, `2023년 12월 25일`, `2023年12月`, `12月25日`. Whatever padding and spacing the input had is preserved, and the unpadded reading is preferred since that is how these layouts are normally written
- Recognise month and weekday names in about forty languages, not just English: `getTypes(str, { locales })` opts in, `TypeInfo` gains `locale`, and `convertFrom` / `convertTo` then read and write in that language, keeping case (Turkish `MAYIS` → `TEMMUZ`, not `HAZIRAN`) and the long-or-short form. `DEFAULT_LOCALES` and `matchLocalisedName` are exported. The default stays English-only, so nothing that worked before changes. The forms a language uses inside a date are recognised too (Russian `января` as well as `январь`), and everything is written back in the standalone form
- Move to Biome from ESLint + Prettier; documentation rebuilt with Astro + Starlight
- Migrate repository to `github.com/toolsu/convnum` (npm package name unchanged: `convnum`)

### Fixes (correctness & spelling)

- **French**: `vingt`/`cent` are now invariable before `mille` (`quatre-vingt-mille`, `deux-cent-mille`) but keep the plural `s` before the nouns `millions`/`milliards`; ordinal of 1001 is `mille-unième` (was `mille-premier`); `frenchOrdinalWordsToWords` restores the terminal plural `s` (`cent-quatre-vingtième` → `cent-quatre-vingts`); `toFrenchOrdinalAbbr(1)` is `1er` and `fromFrenchOrdinalAbbr` accepts `1er`/`1re`/`1ère`; `fromFrenchWords` now throws on non-number words and handles arbitrary whitespace
- **English**: the UK "and" is no longer inserted before a final scale-word group (`one million one thousand`, not `one million and one thousand`); `fixEnglishWords` no longer hyphenates a tens word onto a following scale word, so `getTypes` detects e.g. "twenty thousand"; `fromEnglishOrdinalAbbr` rejects malformed input; `fromEnglishWords` throws when no number word is present and normalizes negative zero
- **Chinese**: bare `万`/`亿` multipliers parse correctly (`万亿` → 1e12); `validateChineseFinancial` now round-trips like `validateChineseWords` instead of only testing the character class, so `壹壹`, `万万`, `拾拾`, `零零`, `壹万壹`, `壹拾` and mixed Simplified/Traditional such as `貳拾陆` are rejected — **breaking**: `getTypes` reports `unknown` for these where it used to report `chinese_financial`. A bare `万` is now unrecognised by both validators rather than financial by only one; the canonical forms are `一万` and `壹万`
- **Bases / Eastern Arabic**: `convertTo` places the sign before the prefix for negative hex (`-0xFF`, not `0x-0XFF`); `toBase(n, 10)` uses positional digits above 1e21; non-integer bases are rejected; `toArabicNumerals` rejects exponential-notation magnitudes and `fromArabicNumerals` rejects structurally invalid strings
- **Dates**: `days`/`formatDayString`/`formatMonthString` are now timezone-safe (no DST off-by-one, pre-1970 negative months work); `"May"` round-trips as a full month name; `formatDateString` rejects invalid month tokens; `fromJulianDay` no longer remaps proleptic-Gregorian years 0–99 to 1900–1999
- **Detection**: `getTypes` no longer misdetects `-0b101` as hexadecimal or a cardinal ending in a scale word (e.g. "twenty thousand") as an ordinal; `fromMonth`/`fromDayOfWeek` use locale-aware casing (Turkish, Greek)
- Input guards: numeral converters throw on non-integer / out-of-range input instead of emitting `"undefined"` or garbage strings

### Tooling

- Systematic test suite with large-range bidirectional roundtrips and a CI timezone matrix
- `engines.node` corrected to `>=18`; `CHANGELOG.md` now shipped in the npm tarball
- Build moved from `tsup` to `tsdown` (rolldown-based, supports TypeScript 7); output file names are unchanged
- Version bumping moved from the in-repo `scripts/bump.ts` to [`vbt`](https://www.npmjs.com/package/vbt) (`bun run bump <patch|minor|major|x.y.z>`)
- TypeScript 7

## 0.2.7

- anyToNumber function
- convertFrom and convertTo's 2nd parameter can be string of type

## 0.2.6

- Add Greek letter English name and Hebrew letter support

## 0.2.5

- parseDateString correctly returns all possible DateInterpretation
- Fix nonexistent YDM
- Add non-year-month support (days property to DateInterpretation and formatDayString function)
- Traditional Chinese support
- getTypes and parseDateString's result ordering and compare functions

## 0.2.4

- Add year-month only support (months property to DateInterpretation and formatMonthString function)

## 0.2.3

- Out-of-range circular support for all types in `convertTo`
- Export version

## 0.2.1

- Simplify ParseDateResult interface

## 0.2.0

- Date functions
- Detailed typeInfo
- Base prefix (e.g. "0x01", "0b01", "0o01")
- Circular support

## 0.1.0

- Initial release
