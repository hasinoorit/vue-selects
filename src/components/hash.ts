export const useHash = () => {
  const wMap = new WeakMap()
  return (obj: any) => {
    if (wMap.has(obj)) {
      return wMap.get(obj)
    }
    const uuid = crypto.randomUUID()
    wMap.set(obj, uuid)
    return uuid
  }
}
