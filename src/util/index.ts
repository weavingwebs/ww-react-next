export * from './forms';

export const makeArrayFromRange = (start: number, end: number) => {
  if (start > end) {
    throw new Error('start must be < end');
  }
  const res = [];
  for (let i = start; i <= end; i++) {
    res.push(i);
  }
  return res;
};

export type Booleanish = 'true' | 'false';

export const isBooleanish = (str: unknown) => str === 'true' || str === 'false';

export const booleanToBooleanish = (bool: boolean): Booleanish =>
  String(bool) as Booleanish;

export const booleanishToBoolean = (booleanish: Booleanish): boolean =>
  booleanish === 'true';

export const isAbsoluteUrl = (url: string) => /^(https?:)?\/\//m.test(url);
