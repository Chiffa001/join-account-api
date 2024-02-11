export const isArrayWithItems = <T>(array: T | T[]): array is T[] =>
  Array.isArray(array) && array.length > 0;
