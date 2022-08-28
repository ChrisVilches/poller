const isValidComparisonOperator = op => {
  return ['==', '>=', '<=', '>', '<'].includes(op)
}

const comparisonOperator = (op, a, b) => {
  if (!isValidComparisonOperator(op)) {
    throw new Error(`Invalid operator "${op}" was used`)
  }

  switch (op) {
    case '==':
      return a === b
    case '>=':
      return a >= b
    case '<=':
      return a <= b
    case '>':
      return a > b
    case '<':
      return a < b
  }
}

const navigate = ($, navigationList) => {
  $ = $.root()
  for (const selector of navigationList) {
    $ = $.find(selector).first()
    if ($.length === 0) {
      throw new Error('DOM Element was not found')
    }
  }
  return $
}

const inspectArray = arr => arr.map(v => `${v} (${typeof v})`).join(', ')

module.exports = {
  comparisonOperator,
  navigate,
  isValidComparisonOperator,
  inspectArray
}
