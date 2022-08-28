import { isValidComparisonOperator, comparisonOperator } from '../util'

class WhenHasTextRaw {
  execute(text, times, op = '==') {
    return dom => {
      const html = dom.text()
      const regex = new RegExp(text, 'g')
      const count = (html.match(regex) || []).length;
      return comparisonOperator(op, count, times)
    }
  }

  validate(args) {
    if (!([2, 3].includes(args.length))) return false

    const [text, times, op = '=='] = args

    if (!isValidComparisonOperator(op)) return false
    if (typeof text !== 'string') return false
    if (text.length === 0) return false

    return times >= 0
  }
}

module.exports = {
  WhenHasTextRaw
}
