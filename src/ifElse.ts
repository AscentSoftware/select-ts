import { URIS, Kind } from 'fp-ts/lib/HKT';

import { constant } from 'fp-ts/lib/function';

import { fromBoolean } from './utils';
import { Selective1 } from './Selective';
import { branch } from './branch';

export const ifElse = <S extends URIS>(S: Selective1<S>) => <A>(cond: Kind<S, boolean>) => (ifTrue: Kind<S, A>) => (
  ifFalse: Kind<S, A>,
): Kind<S, A> => {
  const branchS = branch(S);
  const selector = S.map(cond, fromBoolean);
  return branchS<void, void, A>(selector)(S.map<A, (b: void) => A>(ifTrue, constant))(
    S.map<A, (b: void) => A>(ifFalse, constant),
  );
};
