import { URIS, Kind } from 'fp-ts/lib/HKT';

import { constVoid, constant } from 'fp-ts/lib/function';

import { fromBoolean } from './utils';
import { Selective1 } from './Selective';
import { Chain1 } from 'fp-ts/lib/Chain';

export const when = <S extends URIS>(S: Selective1<S>) => (cond: Kind<S, boolean>) => (
  ifTrue: Kind<S, void>,
): Kind<S, void> => S.select(S.map(cond, fromBoolean), S.map<void, (a: void) => void>(ifTrue, constant(constVoid)));

export const whenL = <S extends URIS>(S: Selective1<S> & Chain1<S>) => (cond: Kind<S, boolean>) => (
  getAction: () => Kind<S, void>,
): Kind<S, void> => {
  return S.select(
    S.map(cond, fromBoolean),
    S.map(
      S.chain(S.of(undefined), _a => getAction()),
      (a: void) => (_b: void) => a,
    ),
  );
};
