import { performPolling } from './performPolling'

export async function pollMany(endpoints = []) {
  const results = []

  for (const endpoint of endpoints) {
    const { enabled = false, type } = endpoint
    console.assert(type === 'html')

    if (!enabled) {
      results.push({})
      continue
    }

    try {
      results.push({ endpoint, ...await performPolling(endpoint) })
    } catch(e) {
      results.push({
        error: e.message
      })
    }
  }

  return results
}
