import axios from 'axios'
import cheerio from 'cheerio'
import { inspectArray, navigate } from './util'
import { allRules } from './allRules'

export const performPolling = async endpoint => {
  const { url, rule, not = false } = endpoint

  const args = endpoint.args()

  const ruleInstance = new allRules[rule]()

  if (!ruleInstance.validate(args)) {
    throw new Error(`Invalid arguments: ${inspectArray(args)}`)
  }

  const ruleFunction = ruleInstance.execute.apply(ruleInstance, args)

  const { data, status } = await axios.get(url)

  const htmlResult = cheerio.load(data)
  let domElement

  try {
    domElement = navigate(htmlResult, endpoint.navigation())
  } catch (e) {
    throw new Error('Incorrect navigations')
  }
  const shouldNotify = ruleFunction(domElement)

  return {
    shouldNotify: not ? !shouldNotify : shouldNotify,
    status
  }
}
