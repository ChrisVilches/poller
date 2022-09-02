import { ArgType } from '@persistence/enum/arg-type.enum';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

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

/**
 * Implementation:
 * (1) Calls `plainToInstance` first to transform, and then
 * (2) Calls `validateSync` to validate.
 */
export const validateAndTransform = (className: any, data: object) => {
  const instance: object = plainToInstance(className, data);

  const error = validateSync(instance, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  if (error.length) {
    throw error[0];
  }
  return instance;
};

const tokenReplaceRegex = /%([A-Za-z0-9_]+)%/g;

export const replaceTokens = (str: string, tokens: object) => {
  return str.replace(tokenReplaceRegex, (match: string) => {
    const token = match.substring(1, match.length - 1);

    if (token in tokens) {
      return tokens[token as keyof typeof tokens];
    }
    return match;
  });
};

const removeUrlQueryStringRegex = /\?.*/;

export const removeUrlQueryString = (url: string) =>
  url.replace(removeUrlQueryStringRegex, '');

export const getEnvFilePath = () => {
  const environment: string = process.env.NODE_ENV || 'development';
  if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV is not set (needed to choose the .env file)');
  }
  const file = `.env.${environment}`;
  return file;
};

export const valueToArgType = (value: any): ArgType => {
  const types = {
    string: ArgType.STRING,
    boolean: ArgType.BOOLEAN,
    number: ArgType.NUMBER,
  };
  const t = typeof value as keyof typeof types;

  if (t in types) {
    return types[t];
  }
  return ArgType.INVALID;
};
