export enum ArgType {
  NUMBER,
  STRING,
  BOOLEAN,
  INVALID,
}

export const argTypeFromValue = (value: any): ArgType => {
  switch (typeof value) {
    case 'boolean':
      return ArgType.BOOLEAN;
    case 'string':
      return ArgType.STRING;
    case 'number':
      return ArgType.NUMBER;
    default:
      return ArgType.INVALID;
  }
};
