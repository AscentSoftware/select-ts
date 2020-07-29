import { URIS, Kind } from 'fp-ts/lib/HKT';

import { flow } from 'fp-ts/lib/function';
import { Either, either, left, right } from 'fp-ts/lib/Either';
import { Selective1 } from './Selective';

export function branch<S extends URIS>(S: Selective1<S>) {
  return <A, B, C>(fe: Kind<S, Either<A, B>>) => (lhs: Kind<S, (b: A) => C>) => (
    rhs: Kind<S, (b: B) => C>,
  ): Kind<S, C> =>
    S.select(
      S.select(
        S.map(fe, ab => either.map<A, B, Either<B, C>>(ab, left)),
        S.map(lhs, fac => flow<[A], C, Either<B, C>>(fac, right)),
      ),
      rhs,
    );
}
