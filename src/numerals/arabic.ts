import { reverseKeyValue } from '../utils/reverseKeyValue'

const digitMap: Record<string, string> = {
  '0': '٠',
  '1': '١',
  '2': '٢',
  '3': '٣',
  '4': '٤',
  '5': '٥',
  '6': '٦',
  '7': '٧',
  '8': '٨',
  '9': '٩',
  '-': '-',
  '.': '.',
}

/**
 * Converts a number to Eastern Arabic numerals
 * @param num - The number to convert
 * @returns The Eastern Arabic numeral representation
 * @throws Error if input is not finite, or if its magnitude is so large or small
 * that JavaScript renders it in exponential notation (|num| >= 1e21 or a very
 * small fraction like 1e-7), which cannot be transliterated digit-by-digit
 * @category Eastern Arabic Numeral
 */
export function toArabicNumerals(num: number): string {
  if (!Number.isFinite(num)) {
    throw new Error('Input must be a finite number')
  }

  const numStr = num.toString()
  // Reject exponential notation ("1e+21", "1e-7"): transliterating the 'e'/'+'
  // would produce an invalid, non-round-trippable numeral.
  if (/[eE]/.test(numStr)) {
    throw new Error(
      'Input is out of the representable range (exponential notation)'
    )
  }

  let result = ''
  for (const char of numStr) {
    result += digitMap[char] || char
  }

  return result
}

/**
 * Converts Arabic numerals to a number
 * @param numerals - The Arabic numerals
 * @returns The numeric value
 * @throws Error if input contains invalid characters
 * @category Eastern Arabic Numeral
 */
export function fromArabicNumerals(numerals: string): number {
  const reverseDigitMap = reverseKeyValue(digitMap)

  let result = ''
  for (const char of numerals) {
    if (reverseDigitMap[char] !== undefined) {
      result += reverseDigitMap[char]
    } else {
      throw new Error(`Invalid character in number: "${char}"`)
    }
  }

  // Validate the transliterated string structurally. Since '-' and '.' are in
  // the digit map, per-character validation alone would accept malformed inputs
  // like "٤-٢" or "٤.٢.٣" (Number.parseFloat silently truncates them). A leading
  // digit is required (canonical output is e.g. "٠.٤", never ".٤").
  if (!/^-?\d+(\.\d+)?$/.test(result)) {
    throw new Error(`Invalid Eastern Arabic numeral: "${numerals}"`)
  }

  // The structural check above guarantees a parseable number here.
  return Number.parseFloat(result)
}
