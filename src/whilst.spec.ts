import { task, of } from 'fp-ts/lib/Task';

import { whilst } from './whilst';
import { getSelectMonad } from './Selective';

it('does not run at all', async () => {
  const M = getSelectMonad(task);
  const whileS = whilst(M);

  const runTask = whileS(of(false));
  const result = await runTask();

  expect(result).toBeUndefined();
});

it('repeats until is positive', async () => {
  const M = getSelectMonad(task);
  const fn = jest.fn();
  const whileS = whilst(M);
  let count = 5;

  const isPositive = () =>
    new Promise<boolean>(resolve => {
      const isPositive = count > 0;
      count = count - 1;

      fn();
      resolve(isPositive);
    });

  const runTask = whileS(isPositive);
  const result = await runTask();

  expect(result).toBeUndefined();
  expect(fn).toBeCalledTimes(6);
});
