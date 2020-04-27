# Functional conditional combinators (experimental ⚗️)

> An (incomplete) Typescript implementation of Selective Applicative Functors (from [1]) based on [fp-ts](https://github.com/gcanti/fp-ts).

This package offers a set of "conditional" combinators to implement behaviors of type "if this condition is true, then do that". They are re-usable with different functional data structures (e.g. `Task`, `Option` and so on).

# Motivating examples

## Ramda-like conditional operators

Let's assume that we have a serverless function that processes some commands. Depending on the kind of command, we need to perform different tasks.

In Ramda, we have the `cond` function ([doc](https://ramdajs.com/docs/#cond)) that implements a `if/else, if/else...` logic.

```javascript
R.cond([
  [isTurnOnAction, doTurnOnAction],
  [isFireAction, doFireAction],
  [R.T, doCatchAllAction],
]);
```

There are at least two problems:

1. if there is no match, the result is `undefined` 😨. We need to remember a `doCatchAllAction` action;
2. it is not always clear what is the result of `doSomething` functions, is it a simple value or a `Promise`?

With this package, instead, we do:

```typescript
// build a `cond` combinator working with Tasks
const condS = cond(getSelectM(task));
// build the conditional function
const runTask = condS(
  // type of predicates is [Task<boolean>, Task<Response>]
  [isTurnOnAction, doTurnOnAction],
  [isFireAction, doFireAction],
  // we do not need a catchall pair
);
const result = await runTask();
// the result has type Option<Response>
// meaning that it might be a Response or None if there is no match
// in this way we can easily pipe runTask with other tasks
```

## Cleaner fp-ts code

When a task can return an `Option`, the next action depends if the value is `none` or `some`.
This is a common use case, for example you want to verify if a user exists before performing an action.

A possible implementation with `pipe` is the following.

```typescript
pipe(
  getUser, // returns a `Task<Option<string>>`
  map(fold(getError, sayHello)), // inspects the task and unfold `Option`
);
```

Using this library, the `Option` unfolding is handled by the `ifSomeS` combinator resulting in a cleaner code (i.e. more imperative 😜).

```typescript
ifSomeS(
  getUser, // returns a `Task<Option<string>>`
  sayHelloTask, // has type `Task<string => string>`
  getErrorTask, // has type `Task<() => string>`
);
```

## Contributing

PRs are welcome! We would like to add new conditional operators (see [1] for examples), extend the existing ones for more type constructors and add more tests.

## References

[1] Mokhov, Andrey, et al. "Selective applicative functors." Proceedings of the ACM on Programming Languages 3.ICFP (2019): 1-29. [link](https://dl.acm.org/doi/pdf/10.1145/3341694)
