import { modNoZero } from './modNoZero'

export function toArrayItem(num: number, arr: string[], circular = false) {
  if (!Number.isInteger(num)) {
    throw new Error('Input must be an integer')
  }
  if (arr.length === 0) {
    throw new Error('Cannot map to an empty array')
  }
  if (!circular && (num > arr.length || num < 1)) {
    throw new Error(`Input must be an integer between 1 and ${arr.length}`)
  }
  return arr[(circular ? modNoZero(num, arr.length) : num) - 1]
}

export function fromArrayItem(item: string, arr: string[]) {
  const index = arr.indexOf(item)
  if (index === -1) {
    throw new Error('Input is invalid')
  }
  return index + 1
}

export function toToArrayItemFn(arr: string[]) {
  return (num: number, circular = false) => toArrayItem(num, arr, circular)
}

export function toFromArrayItemFn(
  arr: string[],
  sanitizeFn?: (item: string) => string
) {
  return (item: string) => {
    if (typeof item !== 'string') {
      throw new Error('Input must be a string')
    }
    return fromArrayItem(sanitizeFn ? sanitizeFn(item) : item, arr)
  }
}
