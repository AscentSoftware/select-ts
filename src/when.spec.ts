import { task, of } from 'fp-ts/lib/Task';
import { IO, io } from 'fp-ts/lib/IO';

import { getSelectM } from './Selective';
import { when } from './when';

it('when true', async () => {
  const fn = jest.fn();
  const S = getSelectM(task);
  const whenS = when(S);
  const runTask = whenS(of(true))(() => Promise.resolve(undefined).then(fn));
  const result = await runTask();
  expect(result).toBeUndefined();
  expect(fn).toBeCalledTimes(1);
});

it('when false', async () => {
  const fn = jest.fn();
  const S = getSelectM(task);
  const whenS = when(S);
  const runTask = whenS(of(false))(() => Promise.resolve(undefined).then(fn));
  const result = await runTask();
  expect(result).toBeUndefined();
  expect(fn).toBeCalledTimes(0);
});

// from [1], section 2.2
it('when ping, do pong', async () => {
  const printLine = jest.fn();
  const S = getSelectM(io);
  const whenS = when(S);

  const getLine = io.of('ping');
  const isPing = io.map(getLine, a => a === 'ping');
  const putStrLn = (a: string): IO<void> => () => {
    printLine(a);
    return;
  };

  const runTask = whenS(isPing)(putStrLn('pong'));
  const result = runTask();
  expect(result).toBeUndefined();
  expect(printLine).toBeCalledTimes(1);
  expect(printLine).toBeCalledWith('pong');
});

// from [1], section 2.2
it('when hello, do not pong', async () => {
  const printLine = jest.fn();
  const S = getSelectM(io);
  const whenS = when(S);

  const getLine = io.of('hello');
  const isPing = io.map(getLine, a => a === 'ping');
  const putStrLn = (a: string): IO<void> => () => {
    printLine(a);
    return;
  };

  const runTask = whenS(isPing)(putStrLn('pong'));
  const result = runTask();
  expect(result).toBeUndefined();
  expect(printLine).toBeCalledTimes(0);
});
