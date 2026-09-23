export const freeze = <T>(obj: T): Readonly<T> => {
  if (Object?.freeze) {
    return Object.freeze(obj)
  }
  return obj
}
