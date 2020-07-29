import { URIS, Kind } from 'fp-ts/lib/HKT';

import { constVoid, flow } from 'fp-ts/lib/function';
import { swap } from 'fp-ts/lib/Either';

import { fromBoolean } from './utils';
import { Selective1 } from './Selective';

export function unless<S extends URIS>(S: Selective1<S>) {
  return (cond: Kind<S, boolean>) => (ifFalse: Kind<S, void>): Kind<S, void> =>
    S.select(
      S.map(cond, flow(fromBoolean, swap)),
      S.map<void, (a: void) => void>(ifFalse, () => constVoid),
    );
}
