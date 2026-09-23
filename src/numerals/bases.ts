import type { PrefixType } from '../utils/types'

/**
 * Converts a decimal number to a hexadecimal string
 * @param num - The decimal number to convert
 * @param prefix - Whether to include prefix: false (no prefix), "lower" (0x), "upper" (0X)
 * @returns The hexadecimal representation as a string
 * @category Bases
 */
export function toHex(num: number, prefix: PrefixType = false): string {
  if (!Number.isInteger(num)) {
    throw new Error('Input must be an integer')
  }
  const hex = num.toString(16)

  if (prefix === 'lower') {
    return num < 0 ? `-0x${hex.slice(1)}` : `0x${hex}`
  } else if (prefix === 'upper') {
    return num < 0
      ? `-0X${hex.slice(1).toUpperCase()}`
      : `0X${hex.toUpperCase()}`
  } else {
    return hex
  }
}

/**
 * Converts a hexadecimal string to a decimal number
 * @param hex - The hexadecimal string to convert (with or without 0x prefix)
 * @returns The decimal representation as a number
 * @throws Error if input is not a valid hexadecimal string
 * @category Bases
 */
export function fromHex(hex: string): number {
  // Check for negative sign
  const isNegative = hex.startsWith('-')
  const cleanInput = isNegative ? hex.slice(1) : hex

  // Remove optional 0x or 0X prefix
  const cleanHex = cleanInput.replace(/^0x/i, '')
  if (!/^[0-9a-fA-F]+$/.test(cleanHex)) {
    throw new Error('Input must be a valid hexadecimal string')
  }
  const result = Number.parseInt(cleanHex, 16)
  return isNegative && result !== 0 ? -result : result
}

/**
 * Converts a decimal number to a binary string
 * @param num - The decimal number to convert
 * @param prefix - Whether to include prefix: false (no prefix), "lower" (0b), "upper" (0B)
 * @returns The binary representation as a string
 * @category Bases
 */
export function toBin(num: number, prefix: PrefixType = false): string {
  if (!Number.isInteger(num)) {
    throw new Error('Input must be an integer')
  }
  const binary = num.toString(2)

  if (prefix === 'lower') {
    return num < 0 ? `-0b${binary.slice(1)}` : `0b${binary}`
  } else if (prefix === 'upper') {
    return num < 0 ? `-0B${binary.slice(1)}` : `0B${binary}`
  } else {
    return binary
  }
}

/**
 * Converts a binary string to a decimal number
 * @param binary - The binary string to convert (with or without 0b prefix)
 * @returns The decimal representation as a number
 * @throws Error if input is not a valid binary string
 * @category Bases
 */
export function fromBin(binary: string): number {
  // Check for negative sign
  const isNegative = binary.startsWith('-')
  const cleanInput = isNegative ? binary.slice(1) : binary

  // Remove optional 0b or 0B prefix
  const cleanBinary = cleanInput.replace(/^0b/i, '')
  if (!/^[01]+$/.test(cleanBinary)) {
    throw new Error('Input must be a valid binary string')
  }
  const result = Number.parseInt(cleanBinary, 2)
  return isNegative && result !== 0 ? -result : result
}

/**
 * Converts a decimal number to an octal string
 * @param num - The decimal number to convert
 * @param prefix - Whether to include prefix: false (no prefix), "lower" (0o), "upper" (0O)
 * @returns The octal representation as a string
 * @category Bases
 */
export function toOct(num: number, prefix: PrefixType = false): string {
  if (!Number.isInteger(num)) {
    throw new Error('Input must be an integer')
  }
  const octal = num.toString(8)

  if (prefix === 'lower') {
    return num < 0 ? `-0o${octal.slice(1)}` : `0o${octal}`
  } else if (prefix === 'upper') {
    return num < 0 ? `-0O${octal.slice(1)}` : `0O${octal}`
  } else {
    return octal
  }
}

/**
 * Converts an octal string to a decimal number
 * @param octal - The octal string to convert (with or without 0o prefix)
 * @returns The decimal representation as a number
 * @throws Error if input is not a valid octal string
 * @category Bases
 */
export function fromOct(octal: string): number {
  // Check for negative sign
  const isNegative = octal.startsWith('-')
  const cleanInput = isNegative ? octal.slice(1) : octal

  // Remove optional 0o or 0O prefix
  const cleanOctal = cleanInput.replace(/^0o/i, '')
  if (!/^[0-7]+$/.test(cleanOctal)) {
    throw new Error('Input must be a valid octal string')
  }
  const result = Number.parseInt(cleanOctal, 8)
  return isNegative && result !== 0 ? -result : result
}

/**
 * Converts a decimal number to a string in the specified base
 * @param num - The decimal number to convert
 * @param base - The base to convert to (2-36)
 * @returns The representation in the specified base as a string
 * @throws Error if base is out of range
 * @category Bases
 */
export function toBase(num: number, base: number): string {
  if (!Number.isInteger(base) || base < 2 || base > 36) {
    throw new Error('Base must be an integer between 2 and 36')
  }
  if (!Number.isInteger(num)) {
    throw new Error('Input must be an integer')
  }
  // Number.prototype.toString(10) switches to exponential notation for
  // |num| >= 1e21 (e.g. "1e+21"), which is not a valid base-N string and cannot
  // be parsed back. Use BigInt to always produce positional digits. (Precision
  // above Number.MAX_SAFE_INTEGER is not guaranteed for either path.)
  if (Math.abs(num) >= 1e21) {
    return BigInt(num).toString(base)
  }
  return num.toString(base)
}

/**
 * Converts a string in the specified base to a decimal number
 * @param str - The string to convert
 * @param base - The base of the input string (2-36)
 * @returns The decimal representation as a number
 * @throws Error if base is out of range or if input is invalid
 * @category Bases
 */
export function fromBase(str: string, base: number): number {
  if (!Number.isInteger(base) || base < 2 || base > 36) {
    throw new Error('Base must be an integer between 2 and 36')
  }

  // Check for negative sign
  const isNegative = str.startsWith('-')
  const cleanInput = isNegative ? str.slice(1) : str

  const digits =
    base <= 10
      ? `[0-${base - 1}]`
      : `[0-9a-${String.fromCharCode(97 + (base - 11))}A-${String.fromCharCode(65 + (base - 11))}]`

  const regex = new RegExp(`^${digits}+$`)
  if (!regex.test(cleanInput)) {
    throw new Error(`Input must be a valid string in base ${base}`)
  }

  const result = Number.parseInt(cleanInput, base)
  return isNegative && result !== 0 ? -result : result
}
