
import DualStateInfiniteAnimator from "../dual-state-infinite-animator"

test("simple", () => {
  let animator = new DualStateInfiniteAnimator(1000, true);
  expect(animator.getVal()).toBe(true);
  {
    let animator_tmp = new DualStateInfiniteAnimator(1000, false);
    expect(animator_tmp.getVal()).toBe(false);  
  }

  let mock = jest.fn();
  animator.onValChange = mock;
  animator.update(500);
  expect(mock.mock.calls.length).toBe(0);
  expect(animator.getVal()).toBe(true);
  animator.update(500);
  expect(mock.mock.calls.length).toBe(1);
  expect(animator.getVal()).toBe(false);
});

test("overlap", () => {
  let animator = new DualStateInfiniteAnimator(1000, true);
  expect(animator.getVal()).toBe(true);
  let mock = jest.fn();
  animator.onValChange = mock;

  animator.update(2000);
  expect(animator.getVal()).toBe(true);
  expect(mock.mock.calls.length).toBe(0);

  animator.update(1000);
  expect(animator.getVal()).toBe(false);
  expect(mock.mock.calls.length).toBe(1);

  animator.update(3000);
  expect(animator.getVal()).toBe(true);
  expect(mock.mock.calls.length).toBe(2);
});