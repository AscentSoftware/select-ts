import { Applicative1 } from 'fp-ts/lib/Applicative';

import { URIS, Kind } from 'fp-ts/lib/HKT';

import { Monad1 } from 'fp-ts/lib/Monad';

import { Either, fold } from 'fp-ts/lib/Either';

import { pipe } from 'fp-ts/lib/pipeable';

/**
 * The `Selective` type class is an `Applicative` with a `select` operation.
 *
 * Instances must satisfy the following laws in addition to the `Applicative` laws:
 *
 * TODO
 *
 */
export interface Selective1<F extends URIS> extends Applicative1<F> {
  readonly select: <A, B>(fa: Kind<F, Either<A, B>>, fab: Kind<F, (a: A) => B>) => Kind<F, B>;
}

/**
 * It builds a selective that executes effects conditionally.
 *
 * @param M a monad
 */
export function getSelectM<M extends URIS>(M: Monad1<M>): Selective1<M> {
  return {
    ...M,
    select: (fa, fab) =>
      M.chain(fa, ab =>
        pipe(
          ab,
          fold(a => M.ap(fab, M.of(a)), M.of),
        ),
      ),
  };
}
