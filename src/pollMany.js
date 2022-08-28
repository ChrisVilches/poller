import { performPolling } from './performPolling'

export async function pollMany(pollings = []) {
  const results = []

  for (const pollItem of pollings) {
    const { title = 'Untitled', url, enabled = false, type } = pollItem
    console.assert(type === 'html')
    console.log('---', title)

    if (!enabled) {
      console.log('(Skipped)')
      console.log()
      continue
    }

    console.log(url)

    let shouldNotify, status

    try {
      const res = await performPolling(pollItem)
      shouldNotify = res.shouldNotify
      status = res.status
    } catch (e) {
      console.log(e)
      continue
    }

    console.log(shouldNotify, status)

    if (shouldNotify) {
      const { notificationMessage = 'No message' } = pollItem
      console.log(notificationMessage)
    }

    console.log()

    results.push({
      shouldNotify,
      status
    })
  }

  return results
}
