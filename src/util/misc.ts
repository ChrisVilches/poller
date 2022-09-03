import { ArgType } from '@persistence/enum/arg-type.enum';

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
