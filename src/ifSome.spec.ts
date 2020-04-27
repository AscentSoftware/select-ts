import { task, of, map } from 'fp-ts/lib/Task';
import { some, fold, none } from 'fp-ts/lib/Option';

import { pipe } from 'fp-ts/lib/pipeable';

import { getSelectM } from './Selective';
import { ifSome } from './ifSome';

it('runs if an element exists', async () => {
  const S = getSelectM(task);
  const ifSomeS = ifSome(S);

  const sayHello = (name: string): string => `hello ${name}`;
  const getError = (): string => 'cannot get user';

  const getUser = of(some('Tom'));
  const sayHelloTask = of(sayHello);
  const getErrorTask = of(getError);
  const runTask1 = ifSomeS(getUser, sayHelloTask, getErrorTask);

  const runTask2 = pipe(getUser, map(fold(getError, sayHello)));

  const result1 = await runTask1();
  const result2 = await runTask2();

  expect(result1).toBe('hello Tom');
  expect(result2).toBe('hello Tom');
});

it('runs if an element does not exist', async () => {
  const S = getSelectM(task);
  const ifSomeS = ifSome(S);

  const sayHello = (name: string): string => `hello ${name}`;
  const getError = (): string => 'cannot get user';

  const getUser = of(none);
  const sayHelloTask = of(sayHello);
  const getErrorTask = of(getError);
  const runTask1 = ifSomeS(getUser, sayHelloTask, getErrorTask);

  const runTask2 = pipe(getUser, map(fold(getError, sayHello)));

  const result1 = await runTask1();
  const result2 = await runTask2();

  expect(result1).toBe('cannot get user');
  expect(result2).toBe('cannot get user');
});
