import {
  anyToNumber,
  type CaseType,
  convertFrom,
  convertTo,
  type FormatType,
  getTypes,
  type NumType,
  type PrefixType,
  type TypeInfo,
  typeInfoMatrix,
  type UsUkStyleType,
  type ZhstType,
} from 'convnum'
import { useEffect, useState } from 'react'
import Segmented from './Segmented'
import { copyText, localizedTypeName, toolText, type ToolLocale } from './toolI18n'

const NUMERAL_TYPES: { value: NumType; label: string }[] = [
  { value: 'decimal', label: 'Decimal' },
  { value: 'latin_letter', label: 'Latin Letters' },
  { value: 'month_name', label: 'Month Names' },
  { value: 'day_of_week', label: 'Days of Week' },
  { value: 'roman', label: 'Roman Numerals' },
  { value: 'arabic', label: 'Eastern Arabic' },
  { value: 'english_words', label: 'English Words' },
  { value: 'english_ordinal_words', label: 'English Ordinal Words' },
  { value: 'english_ordinal_abbr', label: 'English Ordinal Abbr.' },
  { value: 'french_words', label: 'French Words' },
  { value: 'french_ordinal_words', label: 'French Ordinal Words' },
  { value: 'french_ordinal_abbr', label: 'French Ordinal Abbr.' },
  { value: 'chinese_words', label: 'Chinese Words' },
  { value: 'chinese_financial', label: 'Chinese Financial' },
  { value: 'binary', label: 'Binary' },
  { value: 'octal', label: 'Octal' },
  { value: 'hexadecimal', label: 'Hexadecimal' },
  { value: 'greek_letter', label: 'Greek Letters' },
  { value: 'greek_letter_english_name', label: 'Greek Letter Names' },
  { value: 'cyrillic_letter', label: 'Cyrillic Letters' },
  { value: 'hebrew_letter', label: 'Hebrew Letters' },
  { value: 'chinese_heavenly_stem', label: 'Chinese Heavenly Stems' },
  { value: 'chinese_earthly_branch', label: 'Chinese Earthly Branches' },
  { value: 'chinese_solar_term', label: 'Chinese Solar Terms' },
  { value: 'astrological_sign', label: 'Astrological Signs' },
  { value: 'nato_phonetic', label: 'NATO Phonetic' },
]

// Case options available per type (some types only support a subset)
const CASE_MINIMAL: { value: CaseType; label: string }[] = [
  { value: 'lower', label: 'Lowercase' },
  { value: 'upper', label: 'Uppercase' },
]
const CASE_LIMITED: typeof CASE_MINIMAL = [
  ...CASE_MINIMAL,
  { value: 'sentence', label: 'Sentence' },
]
const CASE_FULL: typeof CASE_MINIMAL = [...CASE_LIMITED, { value: 'title', label: 'Title' }]

const MINIMAL_CASE_TYPES: NumType[] = [
  'latin_letter',
  'english_ordinal_abbr',
  'french_ordinal_abbr',
  'hexadecimal',
  'greek_letter',
  'cyrillic_letter',
]
const LIMITED_CASE_TYPES: NumType[] = [
  'month_name',
  'day_of_week',
  'roman',
  'greek_letter_english_name',
  'astrological_sign',
  'nato_phonetic',
]

function caseOptions(type: NumType) {
  if (MINIMAL_CASE_TYPES.includes(type)) return CASE_MINIMAL
  if (LIMITED_CASE_TYPES.includes(type)) return CASE_LIMITED
  return CASE_FULL
}

interface Controls {
  case?: CaseType
  format?: FormatType
  prefix?: PrefixType
  zhst?: ZhstType
  digits?: number
  ukStyle?: UsUkStyleType
}

// Default controls for a type, choosing a case default that is actually offered
function defaultControls(type: NumType): Controls {
  const c: Controls = {}
  if (typeInfoMatrix.case.includes(type)) {
    // Roman numerals read best uppercase; name-like types default to sentence
    // case; everything else (letters, hex) defaults to lowercase.
    c.case =
      type === 'roman'
        ? 'upper'
        : caseOptions(type).some((o) => o.value === 'sentence')
          ? 'sentence'
          : 'lower'
  }
  if (typeInfoMatrix.format.includes(type)) c.format = 'long'
  if (typeInfoMatrix.prefix.includes(type)) c.prefix = false
  if (typeInfoMatrix.zhst.includes(type)) c.zhst = 0
  if (typeInfoMatrix.digits.includes(type)) c.digits = 0
  if (typeInfoMatrix.ukStyle.includes(type)) c.ukStyle = 0
  return c
}

export default function NumeralConverter({ locale = 'en' }: { locale?: ToolLocale }) {
  const t = toolText[locale]
  const [values, setValues] = useState<Record<string, string>>({})
  const [source, setSource] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [num, setNum] = useState<number | null>(null)
  // Bumped on every recompute so the changed fields can flash in sequence
  const [wave, setWave] = useState(0)
  const [copied, setCopied] = useState<string | null>(null)
  const [controls, setControls] = useState<Record<string, Controls>>(() => {
    const initial: Record<string, Controls> = {}
    for (const { value } of NUMERAL_TYPES) initial[value] = defaultControls(value)
    return initial
  })

  const controlsOf = (type: NumType): Controls => ({
    ...defaultControls(type),
    ...controls[type],
  })

  // Recompute every non-source field whenever the number or the controls change
  useEffect(() => {
    if (num === null) return
    setValues((prev) => {
      const next: Record<string, string> = { ...prev }
      for (const { value: type } of NUMERAL_TYPES) {
        if (type === source) continue
        try {
          next[type] = convertTo(num, { type, ...controlsOf(type) })
        } catch {
          next[type] = ''
        }
      }
      return next
    })
    setWave((w) => w + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [num, controls, source])

  const onInput = (type: string, value: string) => {
    setSource(type)
    setValues((prev) => ({ ...prev, [type]: value }))

    if (!value.trim()) {
      setValues({})
      setError('')
      setNum(null)
      return
    }

    try {
      const decimalValue =
        type === 'any'
          ? anyToNumber(value)
          : convertFrom(value, type as NumType)

      // Reflect the detected format back into the relevant field's controls
      const detected: TypeInfo | undefined =
        type === 'any'
          ? getTypes(value)[0]
          : getTypes(value).find((t) => t.type === type)
      if (
        detected &&
        !['unknown', 'invalid', 'empty'].includes(detected.type)
      ) {
        const t = detected.type as NumType
        setControls((prev) => ({
          ...prev,
          [t]: {
            ...prev[t],
            ...(detected.case !== undefined && { case: detected.case }),
            ...(detected.format !== undefined && { format: detected.format }),
            ...(detected.prefix !== undefined && { prefix: detected.prefix }),
            ...(detected.zhst !== undefined && { zhst: detected.zhst }),
            ...(detected.digits !== undefined && { digits: detected.digits }),
            ...(detected.ukStyle !== undefined && {
              ukStyle: detected.ukStyle,
            }),
          },
        }))
      }

      setNum(decimalValue)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : t.conversionFailed)
    }
  }

  const setControl = (type: NumType, key: keyof Controls, v: unknown) =>
    setControls((prev) => ({ ...prev, [type]: { ...prev[type], [key]: v } }))

  const clearAll = () => {
    setValues({})
    setError('')
    setSource('')
    setNum(null)
  }

  const onCopy = async (key: string) => {
    const text = values[key]
    if (!text || !(await copyText(text))) return
    setCopied(key)
    window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 1400)
  }

  const caseLabel = (v: CaseType) =>
    v === 'lower' ? t.lowercase : v === 'upper' ? t.uppercase : v === 'sentence' ? t.sentence : t.title
  const CASE_GLYPH: Record<CaseType, string> = {
    lower: 'ab',
    upper: 'AB',
    sentence: 'Ab',
    title: 'Ab Cd',
  }

  const renderControls = (type: NumType, name: string) => {
    const c = controlsOf(type)
    const rows: React.ReactNode[] = []
    const row = (key: string, label: string, control: React.ReactNode) => (
      <div key={key} className="nc-control">
        <span>{label}</span>
        {control}
      </div>
    )

    if (typeInfoMatrix.case.includes(type)) {
      rows.push(
        row(
          'case',
          t.case,
          <Segmented
            label={`${name}: ${t.case}`}
            value={c.case}
            onChange={(v) => setControl(type, 'case', v)}
            options={caseOptions(type).map((o) => ({
              value: o.value,
              label: CASE_GLYPH[o.value],
              title: caseLabel(o.value),
            }))}
          />
        )
      )
    }
    if (typeInfoMatrix.format.includes(type)) {
      rows.push(
        row(
          'format',
          t.format,
          <Segmented
            label={`${name}: ${t.format}`}
            value={c.format}
            onChange={(v) => setControl(type, 'format', v)}
            options={[
              { value: 'long' as FormatType, label: t.long },
              { value: 'short' as FormatType, label: t.short },
            ]}
          />
        )
      )
    }
    if (typeInfoMatrix.prefix.includes(type)) {
      const sample = type === 'binary' ? 'b' : type === 'octal' ? 'o' : 'x'
      rows.push(
        row(
          'prefix',
          t.prefix,
          <Segmented<string>
            label={`${name}: ${t.prefix}`}
            value={c.prefix === false ? 'false' : c.prefix}
            onChange={(v) => setControl(type, 'prefix', v === 'false' ? false : v)}
            options={[
              { value: 'false', label: t.none },
              { value: 'lower', label: `0${sample}` },
              { value: 'upper', label: `0${sample.toUpperCase()}` },
            ]}
          />
        )
      )
    }
    if (typeInfoMatrix.zhst.includes(type)) {
      rows.push(
        row(
          'zhst',
          t.script,
          <Segmented<number>
            label={`${name}: ${t.script}`}
            value={c.zhst}
            onChange={(v) => setControl(type, 'zhst', v)}
            options={[
              { value: 0, label: t.simplified },
              { value: 1, label: t.traditional },
            ]}
          />
        )
      )
    }
    if (typeInfoMatrix.digits.includes(type)) {
      const digits = c.digits ?? 0
      rows.push(
        row(
          'digits',
          t.digitsAuto,
          <div className="nc-stepper">
            <button
              type="button"
              aria-label="−1"
              disabled={digits <= 0}
              onClick={() => setControl(type, 'digits', Math.max(0, digits - 1))}
            >
              −
            </button>
            <input
              type="number"
              min={0}
              max={20}
              aria-label={`${name}: ${t.digitsAuto}`}
              value={digits}
              onChange={(e) =>
                setControl(type, 'digits', Math.min(20, Math.max(0, Number(e.target.value) || 0)))
              }
            />
            <button
              type="button"
              aria-label="+1"
              disabled={digits >= 20}
              onClick={() => setControl(type, 'digits', Math.min(20, digits + 1))}
            >
              +
            </button>
          </div>
        )
      )
    }
    if (typeInfoMatrix.ukStyle.includes(type)) {
      rows.push(
        row(
          'ukStyle',
          t.style,
          <Segmented<number>
            label={`${name}: ${t.style}`}
            value={c.ukStyle}
            onChange={(v) => setControl(type, 'ukStyle', v)}
            options={[
              { value: 0, label: 'US' },
              { value: 1, label: 'UK' },
            ]}
          />
        )
      )
    }
    return rows.length ? <div className="nc-controls">{rows}</div> : null
  }

  const sourceIndex = NUMERAL_TYPES.findIndex((x) => x.value === source)

  const copyButton = (key: string, name: string) => (
    <button
      type="button"
      className={copied === key ? 'nc-copy nc-copy-done' : 'nc-copy'}
      onClick={() => onCopy(key)}
      disabled={!values[key]}
      aria-label={t.copyValue(name)}
      title={copied === key ? t.copied : t.copy}
    >
      <svg className="nc-copy-icon" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="9" y="9" width="11" height="11" rx="2.5" />
        <path d="M5 15V6a2 2 0 0 1 2-2h8" />
      </svg>
      <svg className="nc-check-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    </button>
  )

  return (
    <div className="nc">
      <div className="nc-bar">
        <div className="nc-bar-value" aria-live="polite">
          {num === null ? (
            <>
              <span className="nc-bar-eq" aria-hidden="true">=</span>
              <span className="nc-bar-empty">–</span>
            </>
          ) : (
            <>
              <span className="nc-bar-eq" aria-hidden="true">=</span>
              <span key={num} className="nc-bar-num">
                {num.toLocaleString(locale)}
              </span>
            </>
          )}
        </div>
        <button
          type="button"
          className="fx-btn fx-ghost fx-sm nc-clear"
          onClick={clearAll}
          disabled={num === null && !values.any && !source}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="nc-clear-icon">
            <path d="M3 12a9 9 0 1 0 3-6.7" />
            <path d="M3 4v5h5" />
          </svg>
          <span className="fx-btn-label">{t.clearAll}</span>
        </button>
      </div>

      {error && (
        <p key={error} className="nc-error" role="alert">
          {error}
        </p>
      )}

      <div className="nc-grid">
        <div className={`nc-field nc-any${source === 'any' ? ' nc-active' : ''}`}>
          <div className="nc-field-head">
            <label htmlFor="nc-any">{t.anyAutoDetect}</label>
          </div>
          <input
            id="nc-any"
            type="text"
            autoComplete="off"
            spellCheck={false}
            placeholder={t.typeAnything}
            value={values.any ?? ''}
            onChange={(e) => onInput('any', e.target.value)}
          />
        </div>

        {NUMERAL_TYPES.map(({ value, label }, i) => {
          const translatedLabel = localizedTypeName(label, locale)
          const flash = num !== null && source !== value && values[value]
          const distance = sourceIndex < 0 ? i : Math.abs(i - sourceIndex)
          return (
            <div
              key={value}
              className={`nc-field${source === value ? ' nc-active' : ''}${values[value] ? '' : ' nc-empty'}`}
            >
              {flash && (
                <span
                  key={wave}
                  className="nc-flash"
                  style={{ animationDelay: `${Math.min(distance * 22, 420)}ms` }}
                  aria-hidden="true"
                />
              )}
              <div className="nc-field-head">
                <label htmlFor={`nc-${value}`}>{translatedLabel}</label>
                {copyButton(value, translatedLabel)}
              </div>
              <input
                id={`nc-${value}`}
                type="text"
                autoComplete="off"
                spellCheck={false}
                placeholder={
                  locale === 'zh-CN'
                    ? `输入${translatedLabel}…`
                    : locale === 'fr'
                      ? `${t.enter} : ${translatedLabel.toLowerCase()}…`
                      : `${t.enter} ${translatedLabel.toLowerCase()}…`
                }
                value={values[value] ?? ''}
                onChange={(e) => onInput(value, e.target.value)}
              />
              {renderControls(value, translatedLabel)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
