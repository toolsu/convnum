import { anyToNumber, convertTo, getTypes, type NumType } from 'convnum'
import { useEffect, useRef, useState } from 'react'
import { copyText, toolText, typeLabel, type ToolLocale } from './toolI18n'

// Numbers the demo cycles through; each reads well in every row.
const DEMO_NUMBERS = [11, 2024, 42, 1789, 365, 88, 1024, 7, 500, 3999]
const CYCLE_MS = 3200

interface Row {
  type: NumType
  options?: Record<string, unknown>
  glyphs: string
}

const ROWS: Row[] = [
  { type: 'roman', glyphs: 'IVXLCDM' },
  { type: 'chinese_words', glyphs: '零一二三四五六七八九十百千万' },
  { type: 'arabic', glyphs: '٠١٢٣٤٥٦٧٨٩' },
  { type: 'english_words', glyphs: 'abcdefghijklmnopqrstuvwxyz' },
  { type: 'french_words', glyphs: 'abcdefghijklmnopqrstuvwxyzéè' },
  { type: 'hexadecimal', options: { case: 'upper', prefix: 'lower' }, glyphs: '0123456789ABCDEF' },
  { type: 'binary', options: { prefix: 'lower' }, glyphs: '01' },
]

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function render(n: number, row: Row): string {
  try {
    return convertTo(n, { type: row.type, ...row.options } as never)
  } catch {
    return ''
  }
}

/** Text that settles into place character by character, cycling through look-alike glyphs. */
function Scramble({ text, glyphs, delay }: { text: string; glyphs: string; delay: number }) {
  const [shown, setShown] = useState(text)
  const first = useRef(true)

  useEffect(() => {
    if (first.current || prefersReducedMotion()) {
      first.current = false
      setShown(text)
      return
    }
    const chars = [...text]
    const pool = [...glyphs]
    const perChar = Math.min(38, 520 / Math.max(chars.length, 1))
    const start = performance.now() + delay
    let frame = 0
    let last = 0
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      if (now - last < 40) return
      last = now
      const settled = Math.floor((now - start) / perChar)
      if (settled >= chars.length) {
        setShown(text)
        cancelAnimationFrame(frame)
        return
      }
      setShown(
        chars
          .map((ch, i) =>
            i < settled || ch === ' ' || ch === '-'
              ? ch
              : pool[Math.floor(Math.random() * pool.length)]
          )
          .join('')
      )
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [text, glyphs, delay])

  return <>{shown}</>
}

export default function HeroTicker({ locale = 'en' }: { locale?: ToolLocale }) {
  const t = toolText[locale]
  const [input, setInput] = useState(String(DEMO_NUMBERS[0]))
  const [num, setNum] = useState<number | null>(DEMO_NUMBERS[0])
  const [readAs, setReadAs] = useState<string>('decimal')
  const [playing, setPlaying] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const step = useRef(0)
  const card = useRef<HTMLDivElement>(null)

  // Start paused for people who asked for less motion.
  useEffect(() => {
    if (prefersReducedMotion()) setPlaying(false)
  }, [])

  const running = playing && !hovered

  useEffect(() => {
    if (!running) return
    const id = window.setTimeout(() => {
      step.current = (step.current + 1) % DEMO_NUMBERS.length
      const n = DEMO_NUMBERS[step.current]
      setInput(String(n))
      setNum(n)
      setReadAs('decimal')
    }, CYCLE_MS)
    return () => window.clearTimeout(id)
  }, [running, num])

  const onInput = (value: string) => {
    setPlaying(false)
    setInput(value)
    if (!value.trim()) {
      setNum(null)
      setReadAs('')
      return
    }
    try {
      setNum(anyToNumber(value))
      setReadAs(getTypes(value)[0]?.type ?? '')
    } catch {
      setNum(null)
      setReadAs('invalid')
    }
  }

  const onCopy = async (key: string, value: string) => {
    if (!value || !(await copyText(value))) return
    setCopied(key)
    window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 1400)
  }

  // Spotlight follows the pointer.
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = card.current
    if (!el || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--mx', `${x * 100}%`)
    el.style.setProperty('--my', `${y * 100}%`)
  }
  const onPointerLeave = () => setHovered(false)

  const status =
    readAs === 'invalid'
      ? t.notRecognized
      : readAs && readAs !== 'unknown' && readAs !== 'empty'
        ? t.readAs(typeLabel(readAs, locale))
        : t.tickerHint

  return (
    <div className="ht-stage">
      <div
        ref={card}
        className="ht-card"
        onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <div className="ht-top">
          <label htmlFor="ht-input" className="ht-label">
            {t.tickerLabel}
          </label>
          <button
            type="button"
            className="ht-play"
            aria-label={playing ? t.pauseDemo : t.playDemo}
            title={playing ? t.pauseDemo : t.playDemo}
            aria-pressed={!playing}
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" rx="1.2" />
                <rect x="14" y="5" width="4" height="14" rx="1.2" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
              </svg>
            )}
          </button>
        </div>

        <div className="ht-input-wrap">
          <input
            id="ht-input"
            className="ht-input"
            value={input}
            onChange={(e) => onInput(e.target.value)}
            onFocus={() => setPlaying(false)}
            autoComplete="off"
            spellCheck={false}
          />
          <span
            key={`${num}-${running}`}
            className={running ? 'ht-progress ht-progress-run' : 'ht-progress'}
            style={{ animationDuration: `${CYCLE_MS}ms` }}
            aria-hidden="true"
          />
        </div>
        <p className={readAs === 'invalid' ? 'ht-status ht-status-bad' : 'ht-status'} aria-live="polite">
          {status}
        </p>

        <ul className="ht-rows">
          {ROWS.map((row, i) => {
            const value = num === null ? '' : render(num, row)
            const name = typeLabel(row.type, locale)
            const isCopied = copied === row.type
            return (
              <li key={row.type}>
                <button
                  type="button"
                  className={isCopied ? 'ht-row ht-row-copied' : 'ht-row'}
                  onClick={() => onCopy(row.type, value)}
                  disabled={!value}
                  aria-label={`${t.copyValue(name)}: ${value || '–'}`}
                >
                  <span className="ht-row-name">{name}</span>
                  <span className="ht-row-value" lang={row.type === 'arabic' ? 'ar' : undefined} title={value}>
                    {value ? <Scramble text={value} glyphs={row.glyphs} delay={i * 55} /> : '–'}
                  </span>
                  <span className="ht-row-copy" aria-hidden="true">
                    {isCopied ? t.copied : t.copy}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
