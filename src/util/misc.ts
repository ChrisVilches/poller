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

export const isArrayOf = (data: any, type: any) => {
  if (!(data instanceof Array)) {
    return false;
  }

  if (typeof type === 'string') {
    return data.reduce((accum, elem) => accum && typeof elem === type, true);
  }

  return data.reduce((accum, elem) => accum && elem instanceof type, true);
};

export const enumKeysToString = (enumType: any, keys: number[]): string[] =>
  keys.map((key: number) => enumType[String(key)]);

export const sortById = (arr: { id: number }[]) =>
  arr.sort((a, b) => a.id - b.id);
