import { task, of } from 'fp-ts/lib/Task';
import { left } from 'fp-ts/lib/Either';

import { getSelectM } from './Selective';
import { branch } from './branch';

it('branch', async () => {
  const lhs = jest.fn<void, string[]>();
  const rhs = jest.fn<void, string[]>();
  const S = getSelectM(task);
  const branchS = branch(S);
  const printLeft = of(lhs);
  const printRight = of(rhs);
  const runTask = branchS(of(left('isLeft')))(printLeft)(printRight);
  const result = await runTask();
  expect(result).toBeUndefined();
  expect(lhs).toBeCalledTimes(1);
  expect(lhs).toBeCalledWith('isLeft');
  expect(rhs).toBeCalledTimes(0);
});
