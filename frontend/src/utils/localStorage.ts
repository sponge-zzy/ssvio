export function readStorageList<T>(key: string) {
  const savedValue = localStorage.getItem(key)

  if (!savedValue) {
    return []
  }

  try {
    const parsedValue = JSON.parse(savedValue)

    if (Array.isArray(parsedValue)) {
      return parsedValue as T[]
    }

    return []
  } catch {
    return []
  }
}

export function writeStorageList<T>(key: string, value: T[]) {
  localStorage.setItem(key, JSON.stringify(value))
}
