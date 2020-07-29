import { URIS, Kind } from 'fp-ts/lib/HKT';

import { left, right } from 'fp-ts/lib/Either';

import { Option, fold } from 'fp-ts/lib/Option';
import { Selective1 } from './Selective';

/**
 * The `fromOption` operator return the value in `fma` if any, otherwise `fa`.
 *
 * @param S a selective
 * @param fa a default value
 * @param fma an optional value
 */
export function fromOption<S extends URIS>(S: Selective1<S>) {
  return <A>(fa: Kind<S, A>, fma: Kind<S, Option<A>>): Kind<S, A> => {
    return S.select(
      S.map(
        fma,
        fold(
          () => left<void, A>(undefined),
          b => right<void, A>(b),
        ),
      ),
      S.map(fa, b => (_nothing: void) => b),
    );
  };
}
