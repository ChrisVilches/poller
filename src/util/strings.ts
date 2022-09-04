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

export const limitMessageLength = (msg: string, maxLength: number): string => {
  msg = msg.trim();

  if (msg.length <= maxLength) return msg;

  return msg.substring(0, maxLength) + '...';
};

export const isStringPresent = (str?: string) => {
  if (typeof str !== 'string') {
    return false;
  }

  return str.trim().length > 0;
};
