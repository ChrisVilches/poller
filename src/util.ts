import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

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

export const navigate = ($: any, navigationList: string[]) => {
  $ = $.root();
  for (const selector of navigationList) {
    $ = $.find(selector).first();
    if ($.length === 0) {
      throw new Error('DOM Element was not found');
    }
  }
  return $;
};

export const inspectArray = (arr: any[]) =>
  arr.map((v) => `${v} (${typeof v})`).join(', ');

export const validateAndTransform = async (className: any, data: object) => {
  const instance: object = plainToInstance(className, data);
  const error = await validate(instance);
  if (error.length) {
    throw error[0];
  }
  return instance;
};
