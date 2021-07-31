import NumberLinearAnimator from "../number-linear-animator";
import {AnimatorSetBuilder} from "../animator_set"

test("simple", () => {
  let animation1 = new NumberLinearAnimator(
    0, 100, 100
  );
  animation1.onValChange = jest.fn();
  animation1.onStop = jest.fn();
  let animation2 = new NumberLinearAnimator(
    0, 100, 100
  );
  animation2.onValChange = jest.fn();
  animation2.onStop = jest.fn();

  let animationSet = new AnimatorSetBuilder()
    .after(animation1)
    .after(animation2)
    .build();

  animationSet.update(50);
  expect(animation1.onValChange as jest.Mock)
    .toBeCalled();
  expect((animation1.onValChange as jest.Mock)
    .mock.calls[0][0]).toBe(50);
  expect(animation1.onStop as jest.Mock)
    .not.toBeCalled();
  expect(animation2.onStop as jest.Mock)
    .not.toBeCalled();

  animationSet.update(100);
  expect((animation1.onValChange as jest.Mock)
    .mock.calls.length).toBe(2);
  expect((animation1.onValChange as jest.Mock)
    .mock.calls[1][0]).toBe(100);
  expect((animation1.onStop as jest.Mock)
    .mock.calls.length).toBe(1);
  expect((animation2.onValChange as jest.Mock)
    .mock.calls.length).toBe(1);
  expect((animation2.onValChange as jest.Mock)
    .mock.calls[0][0]).toBe(50);

  let restDt = animationSet.update(100);
  expect(restDt).toBe(50);
  // animation1 should not be called any more
  expect((animation1.onValChange as jest.Mock)
    .mock.calls.length).toBe(2);
  expect((animation1.onStop as jest.Mock)
    .mock.calls.length).toBe(1);
  // animation2 should come to its ending.
  expect((animation2.onValChange as jest.Mock)
    .mock.calls.length).toBe(2);
  expect((animation2.onValChange as jest.Mock)
    .mock.calls[1][0]).toBe(100);
  expect((animation2.onStop as jest.Mock)
    .mock.calls.length).toBe(1);
})