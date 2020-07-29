import { URIS, Kind } from 'fp-ts/lib/HKT';

import { whenL } from './when';
import { SelectiveMonad1 } from './Selective';

export function whilst<M extends URIS>(M: SelectiveMonad1<M>): (cond: Kind<M, boolean>) => Kind<M, void> {
  const whenS = whenL(M);
  return (cond: Kind<M, boolean>): Kind<M, void> => {
    return whenS(cond)(() => whilst(M)(cond));
  };
}
