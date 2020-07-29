import { URIS, Kind } from 'fp-ts/lib/HKT';

import { Selective1 } from './Selective';
import { ifElse } from './ifElse';

export function and<S extends URIS>(S: Selective1<S>) {
  return (lhs: Kind<S, boolean>) => (rhs: Kind<S, boolean>): Kind<S, boolean> => {
    const ifElseS = ifElse(S);
    return ifElseS<boolean>(lhs)(rhs)(S.of<boolean>(false));
  };
}
