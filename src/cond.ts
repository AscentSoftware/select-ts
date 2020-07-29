import { URIS, Kind } from 'fp-ts/lib/HKT';
import { Monad1 } from 'fp-ts/lib/Monad';

import { ReadonlyNonEmptyArray, reduceRight } from 'fp-ts/lib/ReadonlyNonEmptyArray';
import { Option, none, some } from 'fp-ts/lib/Option';
import { Refinement } from 'fp-ts/lib/function';

import { Selective1 } from './Selective';
import { ifElse } from './ifElse';

/**
 * The `cond` operator implements an `if/then`, `if/then` logic.
 *
 * @param S an applicative selective
 * @param conds, list of predicates [condition, action]
 * @return returns an `S` applicative with `some a` if an action is executed or `none`.
 */
export function cond<S extends URIS>(S: Selective1<S>) {
  return <A>(...conds: ReadonlyNonEmptyArray<[Kind<S, boolean>, Kind<S, A>]>): Kind<S, Option<A>> => {
    const ifElseS = ifElse(S);
    const ret = reduceRight<[Kind<S, boolean>, Kind<S, A>], Kind<S, Option<A>>>(S.of<Option<A>>(none), (elem, acc) => {
      return ifElseS<Option<A>>(elem[0])(S.map(elem[1], some))(acc);
    })(conds);
    return ret;
  };
}

/**
 *
 * The `select` operator is intended to be used with `cond`.
 * We want to simulate Ramda cond. Note that the API of this operator could change in the future.
 *
 * @param S an applicative selective
 * @param a an unknown value
 * @param doAction action to apply if `a` has a given shape
 */
export function select<S extends URIS>(S: Monad1<S>) {
  return (a: unknown) => <A, B>(
    isA: Refinement<unknown, A>,
    doAction: (a: A) => Kind<S, B>,
  ): [Kind<S, boolean>, Kind<S, B>] => {
    return [S.of(isA(a)), S.chain(S.of(a), a => doAction(a as A))];
  };
}
