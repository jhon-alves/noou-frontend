export function cleanObject<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== "" && v !== undefined && v !== null),
  ) as Partial<T>
}
