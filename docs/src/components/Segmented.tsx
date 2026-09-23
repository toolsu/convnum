import { useRef } from 'react'

export interface SegmentOption<T> {
  value: T
  label: React.ReactNode
  title?: string
}

/** A row of mutually exclusive buttons with a thumb that slides to the chosen one. */
export default function Segmented<T extends string | number | boolean>({
  options,
  value,
  onChange,
  label,
  size = 'sm',
}: {
  options: SegmentOption<T>[]
  value: T | undefined
  onChange: (value: T) => void
  label: string
  size?: 'sm' | 'lg'
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const index = Math.max(
    0,
    options.findIndex((o) => o.value === value)
  )

  // Arrow keys move the choice, like a native radio group.
  const onKeyDown = (e: React.KeyboardEvent) => {
    const delta = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!delta) return
    e.preventDefault()
    const next = (index + delta + options.length) % options.length
    onChange(options[next].value)
    refs.current[next]?.focus()
  }

  return (
    <div
      className={`seg seg-${size}`}
      role="radiogroup"
      aria-label={label}
      style={{ '--n': options.length, '--i': index } as React.CSSProperties}
      onKeyDown={onKeyDown}
    >
      <span className="seg-thumb" aria-hidden="true" />
      {options.map((o, i) => (
        <button
          key={String(o.value)}
          ref={(el) => {
            refs.current[i] = el
          }}
          type="button"
          role="radio"
          aria-checked={i === index}
          tabIndex={i === index ? 0 : -1}
          title={o.title}
          className="seg-option"
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
