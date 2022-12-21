type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

export const mapValues = <S, U extends any, T extends PropertyKey = string>(
  obj: Record<T, U>,
  mapper: (v: U) => S
) => {
  const entries = Object.entries(obj) as Entries<typeof obj>
  return entries.reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: mapper(value),
    }),
    {} as Record<T, U>
  )
}
