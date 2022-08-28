import axios from 'axios'
import cheerio from 'cheerio'
import { inspectArray, navigate } from './util'
import { WhenHasTextRaw } from './rules/WhenHasTextRaw'

const rules = {
  WhenHasTextRaw
}

const cleanArguments = args => args.map(a => {
  switch (a.type) {
    case 'boolean':
      return a.value === 'true'
    case 'string':
      return a.value
    case 'number':
      return +a.value
    default:
      throw new Error('Wrong argument type came from the database')
  }
})

const sortById = arr => arr.sort((a, b) => a.id - b.id)

export const performPolling = async endpoint => {
  const { url, rule, navigations = [], not = false } = endpoint

  sortById(endpoint.arguments)
  const args = cleanArguments(endpoint.arguments)

  const ruleInstance = new rules[rule]

  if (!ruleInstance.validate(args)) {
    throw new Error(`Invalid arguments: ${inspectArray(args)}`)
  }

  const ruleFunction = ruleInstance.execute.apply(ruleInstance, args)

  const { data, status } = await axios.get(url)

  const htmlResult = cheerio.load(data)
  let domElement

  try {
    sortById(navigations)
    domElement = navigate(htmlResult, navigations.map(n => n.selector))
  } catch (e) {
    throw new Error('Incorrect navigations')
  }
  const shouldNotify = ruleFunction(domElement)

  return {
    shouldNotify: not ? !shouldNotify : shouldNotify,
    status
  }
}
