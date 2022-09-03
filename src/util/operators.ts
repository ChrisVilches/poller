export type ComparisonOperator = '==' | '>=' | '<=' | '>' | '<';

export const isValidComparisonOperator = (op: ComparisonOperator) => {
  return ['==', '>=', '<=', '>', '<'].includes(op);
};

export const comparisonOperator = (
  op: ComparisonOperator,
  a: string | number,
  b: string | number,
) => {
  if (!isValidComparisonOperator(op)) {
    throw new Error(`Invalid operator "${op}" was used`);
  }

  switch (op) {
    case '==':
      return a === b;
    case '>=':
      return a >= b;
    case '<=':
      return a <= b;
    case '>':
      return a > b;
    case '<':
      return a < b;
  }
};
