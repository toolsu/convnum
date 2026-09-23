import {
  convertFrom,
  convertTo,
  findCommonType,
  getTypes,
  type NumType,
} from 'convnum'
import { useMemo, useState } from 'react'
import Segmented from './Segmented'
import { copyText, localizedTypeName, toolText, type ToolLocale } from './toolI18n'

const TYPES: { value: NumType; label: string }[] = [
  { value: 'decimal', label: 'Decimal' },
  { value: 'roman', label: 'Roman Numerals' },
  { value: 'latin_letter', label: 'Latin Letters' },
  { value: 'greek_letter', label: 'Greek Letters' },
  { value: 'greek_letter_english_name', label: 'Greek Letter Names' },
  { value: 'cyrillic_letter', label: 'Cyrillic Letters' },
  { value: 'hebrew_letter', label: 'Hebrew Letters' },
  { value: 'nato_phonetic', label: 'NATO Phonetic' },
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
  { value: 'month_name', label: 'Month Names' },
  { value: 'day_of_week', label: 'Days of Week' },
  { value: 'astrological_sign', label: 'Astrological Signs' },
  { value: 'chinese_heavenly_stem', label: 'Chinese Heavenly Stems' },
  { value: 'chinese_earthly_branch', label: 'Chinese Earthly Branches' },
  { value: 'chinese_solar_term', label: 'Chinese Solar Terms' },
]

const labelOf = (type: NumType, locale: ToolLocale) =>
  localizedTypeName(TYPES.find((x) => x.value === type)?.label ?? type, locale)

/** Parse a start value given as either an Arabic number or the type's own form. */
function parseStart(value: string, type: NumType, locale: ToolLocale): number {
  const trimmed = value.trim()
  try {
    return convertFrom(trimmed, type)
  } catch {
    const n = Number(trimmed)
    if (Number.isNaN(n)) {
      throw new Error(toolText[locale].invalidStart(value, labelOf(type, locale)))
    }
    return n
  }
}

/** Intersect the detected types across every item of a sequence, priority-first. */
function detectCommonType(items: string[]): NumType | null {
  if (items.length === 0) return null
  let common = getTypes(items[0])
    .map((t) => t.type)
    .filter((t): t is NumType => t !== 'unknown' && t !== 'empty' && t !== 'invalid')
  for (const item of items.slice(1)) {
    const theseTypes = getTypes(item)
      .map((t) => t.type)
      .filter((t): t is NumType => t !== 'unknown' && t !== 'empty' && t !== 'invalid')
    // findCommonType keeps the library's priority order for the shared subset
    const first = findCommonType(common, theseTypes)
    common = common.filter((t) => theseTypes.includes(t))
    if (common.length === 0) return null
    // (first is the highest-priority shared type after this pair)
    void first
  }
  return common[0] ?? null
}

/** A number input flanked by − / + buttons. */
function Stepper({
  value,
  onChange,
  min,
  max,
  label,
}: {
  value: number
  onChange: (n: number) => void
  min?: number
  max?: number
  label: string
}) {
  const clamp = (n: number) =>
    Math.min(max ?? Number.POSITIVE_INFINITY, Math.max(min ?? Number.NEGATIVE_INFINITY, n))
  return (
    <div className="nc-stepper">
      <button
        type="button"
        aria-label="−1"
        disabled={min !== undefined && value <= min}
        onClick={() => onChange(clamp(value - 1))}
      >
        −
      </button>
      <input
        type="number"
        min={min}
        max={max}
        aria-label={label}
        value={value}
        onChange={(e) => onChange(clamp(Number(e.target.value) || 0))}
      />
      <button
        type="button"
        aria-label="+1"
        disabled={max !== undefined && value >= max}
        onClick={() => onChange(clamp(value + 1))}
      >
        +
      </button>
    </div>
  )
}

function TypeSelect<T extends string>({
  value,
  onChange,
  locale,
  extra,
  exclude,
}: {
  value: T
  onChange: (v: T) => void
  locale: ToolLocale
  extra?: { value: T; label: string }
  exclude?: NumType
}) {
  return (
    <span className="fx-select">
      <select value={value} onChange={(e) => onChange(e.target.value as T)}>
        {extra && <option value={extra.value}>{extra.label}</option>}
        {TYPES.filter((x) => x.value !== exclude).map((x) => (
          <option key={x.value} value={x.value}>
            {localizedTypeName(x.label, locale)}
          </option>
        ))}
      </select>
    </span>
  )
}

/** One labelled line of the result, shown as chips with a copy button. */
function ResultRow({
  label,
  items,
  locale,
  tone = 'plain',
}: {
  label: string
  items: string[]
  locale: ToolLocale
  tone?: 'primary' | 'plain' | 'muted'
}) {
  const t = toolText[locale]
  const [copied, setCopied] = useState(false)
  const onCopy = async () => {
    if (!(await copyText(items.join(', ')))) return
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }
  return (
    <div className={`sg-row sg-row-${tone}`}>
      <div className="sg-row-head">
        <strong>{label}</strong>
        <span className="sg-count">{t.items(items.length)}</span>
        <button
          type="button"
          className={copied ? 'nc-copy nc-copy-done' : 'nc-copy'}
          onClick={onCopy}
          aria-label={`${t.copyResult}: ${label}`}
          title={copied ? t.copied : t.copyResult}
        >
          <svg className="nc-copy-icon" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="9" y="9" width="11" height="11" rx="2.5" />
            <path d="M5 15V6a2 2 0 0 1 2-2h8" />
          </svg>
          <svg className="nc-check-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </button>
      </div>
      <ol className="sg-chips">
        {items.map((item, i) => (
          <li
            // Re-mount on change so the new value pops in
            key={`${i}:${item}`}
            className={item.startsWith('⚠') ? 'sg-chip sg-chip-warn' : 'sg-chip'}
            style={{ animationDelay: `${Math.min(i * 14, 320)}ms` }}
          >
            {item}
          </li>
        ))}
      </ol>
    </div>
  )
}

function GenerateMode({ locale }: { locale: ToolLocale }) {
  const t = toolText[locale]
  const [type, setType] = useState<NumType>('roman')
  const [start, setStart] = useState('1')
  const [count, setCount] = useState(10)
  const [step, setStep] = useState(1)
  const [asType, setAsType] = useState<NumType>('decimal')

  const result = useMemo(() => {
    try {
      const startNum = parseStart(start, type, locale)
      const nums: number[] = []
      for (let i = 0; i < Math.min(count, 500); i++) {
        nums.push(startNum + i * step)
      }
      const primary = nums.map((n) => {
        try {
          return convertTo(n, type)
        } catch (e) {
          return `⚠ ${e instanceof Error ? e.message : t.outOfRange}`
        }
      })
      const secondary = nums.map((n) => {
        try {
          return convertTo(n, asType)
        } catch {
          return '⚠'
        }
      })
      return { nums, primary, secondary, error: '' }
    } catch (e) {
      return {
        nums: [],
        primary: [],
        secondary: [],
        error: e instanceof Error ? e.message : t.invalidInput,
      }
    }
  }, [type, start, count, step, asType, locale])

  return (
    <div className="sg-panel">
      <div className="sg-controls">
        <label className="nc-control">
          <span>{t.type}</span>
          <TypeSelect value={type} onChange={setType} locale={locale} />
        </label>
        <label className="nc-control">
          <span>{t.startHint(labelOf(type, locale))}</span>
          <input value={start} onChange={(e) => setStart(e.target.value)} spellCheck={false} />
        </label>
        <div className="nc-control">
          <span>{t.count}</span>
          <Stepper value={count} onChange={setCount} min={1} max={500} label={t.count} />
        </div>
        <div className="nc-control">
          <span>{t.step}</span>
          <Stepper value={step} onChange={setStep} label={t.step} />
        </div>
        <label className="nc-control">
          <span>{t.alsoShowAs}</span>
          <TypeSelect value={asType} onChange={setAsType} locale={locale} />
        </label>
      </div>

      {result.error ? (
        <p key={result.error} className="nc-error" role="alert">
          {result.error}
        </p>
      ) : (
        <div className="sg-output">
          <ResultRow label={labelOf(type, locale)} items={result.primary} locale={locale} tone="primary" />
          {asType !== type && (
            <ResultRow label={labelOf(asType, locale)} items={result.secondary} locale={locale} />
          )}
          {type !== 'decimal' && asType !== 'decimal' && (
            <ResultRow
              label={labelOf('decimal', locale)}
              items={result.nums.map(String)}
              locale={locale}
              tone="muted"
            />
          )}
        </div>
      )}
    </div>
  )
}

function ConvertMode({ locale }: { locale: ToolLocale }) {
  const t = toolText[locale]
  const [input, setInput] = useState('IV, V, VI, VII, VIII')
  const [asType, setAsType] = useState<'decimal' | NumType>('decimal')

  const items = useMemo(
    () =>
      input
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean),
    [input]
  )

  const detected = useMemo(() => detectCommonType(items), [items])

  const result = useMemo(() => {
    if (items.length === 0) return { nums: [], out: [], error: '' }
    if (!detected)
      return {
        nums: [],
        out: [],
        error: t.noCommonType,
      }
    try {
      const nums = items.map((s) => convertFrom(s, detected))
      const out =
        asType === 'decimal'
          ? nums.map(String)
          : nums.map((n) => {
              try {
                return convertTo(n, asType)
              } catch (e) {
                return `⚠ ${e instanceof Error ? e.message : ''}`
              }
            })
      return { nums, out, error: '' }
    } catch (e) {
      return {
        nums: [],
        out: [],
        error: e instanceof Error ? e.message : t.conversionFailed,
      }
    }
  }, [items, detected, asType, locale])

  return (
    <div className="sg-panel">
      <label className="nc-control sg-textarea">
        <span>{t.inputSequence}</span>
        <textarea
          rows={3}
          value={input}
          spellCheck={false}
          onChange={(e) => setInput(e.target.value)}
        />
      </label>
      <div className="sg-controls">
        <div className="nc-control">
          <span>{t.detectedType}</span>
          <output className={detected ? 'sg-detected' : 'sg-detected sg-detected-none'} key={detected ?? 'none'}>
            {detected ? labelOf(detected, locale) : items.length ? t.noneMixed : '–'}
          </output>
        </div>
        <label className="nc-control">
          <span>{t.convertTo}</span>
          <TypeSelect<'decimal' | NumType>
            value={asType}
            onChange={setAsType}
            locale={locale}
            extra={{ value: 'decimal', label: t.decimalNumbers }}
            exclude="decimal"
          />
        </label>
      </div>

      {result.error ? (
        <p key={result.error} className="nc-error" role="alert">
          {result.error}
        </p>
      ) : (
        result.out.length > 0 && (
          <div className="sg-output">
            <ResultRow label={t.result} items={result.out} locale={locale} tone="primary" />
          </div>
        )
      )}
    </div>
  )
}

export default function SequenceGenerator({ locale = 'en' }: { locale?: ToolLocale }) {
  const t = toolText[locale]
  const [mode, setMode] = useState<'generate' | 'convert'>('generate')
  return (
    <div className="nc sg">
      <Segmented
        size="lg"
        label={`${t.generateSequence} / ${t.convertSequence}`}
        value={mode}
        onChange={setMode}
        options={[
          { value: 'generate' as const, label: t.generateSequence },
          { value: 'convert' as const, label: t.convertSequence },
        ]}
      />
      {mode === 'generate' ? <GenerateMode locale={locale} /> : <ConvertMode locale={locale} />}
    </div>
  )
}
