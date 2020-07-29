import { URIS, Kind } from 'fp-ts/lib/HKT';

import { Option, fold } from 'fp-ts/lib/Option';
import { left, right } from 'fp-ts/lib/Either';

import { pipe } from 'fp-ts/lib/pipeable';

import { Selective1 } from './Selective';
import { branch } from './branch';

/**
 *
 * The `isSome` operator executes the left or right branch depending if some data are available.
 *
 * @param S a selective
 * @param cond condition
 * @param hasSome effect to execute if some
 * @param hasNone effect to execute if none
 */
export function ifSome<S extends URIS>(S: Selective1<S>) {
  return <A, B>(
    cond: Kind<S, Option<A>>,
    hasSome: Kind<S, (a: A) => B>,
    hasNone: Kind<S, (b: void) => B>,
  ): Kind<S, B> => {
    const branchS = branch(S);
    const selector = S.map(cond, a =>
      pipe(
        a,
        fold(
          () => left(undefined as void),
          a => right(a),
        ),
      ),
    );
    return branchS<void, A, B>(selector)(hasNone)(hasSome);
  };
}
