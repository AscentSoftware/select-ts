import { task, of } from 'fp-ts/lib/Task';
import { left, right } from 'fp-ts/lib/Either';

import { getSelectM } from './Selective';

it('does not execute effects', async () => {
  const fn0 = jest.fn();
  const fn1 = jest.fn();
  const S = getSelectM(task);
  const rightTask = of(right('right'));
  const execLeftTask = task.map(
    of((_a: any) => {
      fn0();
      return 'left';
    }),
    f => {
      fn1();
      return f;
    },
  );
  const runTask = S.select(rightTask, execLeftTask);
  const result = await runTask();
  expect(result).toBe('right');
  expect(fn0).toBeCalledTimes(0);
  expect(fn1).toBeCalledTimes(0);
});

it('executes effects conditionally', async () => {
  const fn0 = jest.fn();
  const fn1 = jest.fn();
  const S = getSelectM(task);
  const leftTask = of(left('left'));
  const execLeftTask = task.map(
    of((_a: any) => {
      fn0();
      return 'left';
    }),
    f => {
      fn1();
      return f;
    },
  );
  const runTask = S.select(leftTask, execLeftTask);
  const result = await runTask();
  expect(result).toBe('left');
  expect(fn0).toBeCalledTimes(1);
  expect(fn1).toBeCalledTimes(1);
});
