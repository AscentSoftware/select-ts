import { left, right } from 'fp-ts/lib/Either';

/**
 * it converts true to left void
 * @param cond
 */
export const fromBoolean = (cond: boolean) => (cond ? left<void, void>(undefined) : right<void, void>(undefined));
