import { Task, task, of } from 'fp-ts/lib/Task';

import { getSelectM } from './Selective';
import { cond, select } from './cond';

it('cond some', async () => {
  const S = getSelectM(task);
  const condS = cond(S);
  const runTask = condS(
    [of(false), () => Promise.resolve(0)],
    [of(false), () => Promise.resolve(1)],
    [of(false), () => Promise.resolve(2)],
    [of(true), () => Promise.resolve(3)],
    [of(false), () => Promise.resolve(4)],
  );
  const result = await runTask();
  expect(result).toStrictEqual({ _tag: 'Some', value: 3 });
});

it('cond none', async () => {
  const S = getSelectM(task);
  const condS = cond(S);
  const runTask = condS(
    [of(false), () => Promise.resolve(0)],
    [of(false), () => Promise.resolve(1)],
    [of(false), () => Promise.resolve(2)],
    [of(false), () => Promise.resolve(3)],
    [of(false), () => Promise.resolve(4)],
  );
  const result = await runTask();
  expect(result).toStrictEqual({ _tag: 'None' });
});

it('select some', async () => {
  const printIsTrueFn = jest.fn();
  const printIsFalseFn = jest.fn();

  const S = getSelectM(task);
  const selectT = select(task);
  const condS = cond(S);

  const data = true;
  const isTrue = (a: unknown): a is true => a === true;
  const isFalse = (a: unknown): a is false => a === false;
  const printIsTrue = (a: true): Task<string> => async () => {
    printIsTrueFn();
    return `"${a}" is true`;
  };
  const printIsFalse = (a: false): Task<string> => async () => {
    printIsFalseFn();
    return `"${a}" is false`;
  };

  const caseOf = selectT(data);

  const runTask = condS(
    // cases
    caseOf(isTrue, printIsTrue),
    caseOf(isFalse, printIsFalse),
  );

  const result = await runTask();
  expect(result).toStrictEqual({ _tag: 'Some', value: '"true" is true' });
  expect(printIsTrueFn).toBeCalledTimes(1);
  expect(printIsFalseFn).toBeCalledTimes(0);
});
it('select some other', async () => {
  const printIsTrueFn = jest.fn();
  const printIsFalseFn = jest.fn();

  const S = getSelectM(task);
  const selectT = select(task);
  const condS = cond(S);

  const data = false;
  const isTrue = (a: unknown): a is true => a === true;
  const isFalse = (a: unknown): a is false => a === false;
  const printIsTrue = (a: true): Task<string> => async () => {
    printIsTrueFn();
    return `"${a}" is true`;
  };
  const printIsFalse = (a: false): Task<string> => async () => {
    printIsFalseFn();
    return `"${a}" is false`;
  };

  const caseOf = selectT(data);

  const runTask = condS(
    // cases
    caseOf(isTrue, printIsTrue),
    caseOf(isFalse, printIsFalse),
  );

  const result = await runTask();
  expect(result).toStrictEqual({ _tag: 'Some', value: '"false" is false' });
  expect(printIsTrueFn).toBeCalledTimes(0);
  expect(printIsFalseFn).toBeCalledTimes(1);
});

it('select none', async () => {
  const printIsTrueFn = jest.fn();
  const printIsFalseFn = jest.fn();

  const S = getSelectM(task);
  const selectT = select(task);
  const condS = cond(S);

  const data = 'hello';
  const isTrue = (a: unknown): a is true => a === true;
  const isFalse = (a: unknown): a is false => a === false;
  const printIsTrue = (a: true): Task<string> => async () => {
    printIsTrueFn();
    return `"${a}" is true`;
  };
  const printIsFalse = (a: false): Task<string> => async () => {
    printIsFalseFn();
    return `"${a}" is false`;
  };

  const caseOf = selectT(data);

  const runTask = condS(
    // cases
    caseOf(isTrue, printIsTrue),
    caseOf(isFalse, printIsFalse),
  );

  const result = await runTask();
  expect(result).toStrictEqual({ _tag: 'None' });
  expect(printIsTrueFn).toBeCalledTimes(0);
  expect(printIsFalseFn).toBeCalledTimes(0);
});
