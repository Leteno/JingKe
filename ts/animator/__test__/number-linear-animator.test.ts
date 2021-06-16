import NumberLinearAnimator from "../number-linear-animator"

test("test1To5", () => {
  let animator = new NumberLinearAnimator(0, 5, 1000)
  animator.onStop = jest.fn();
  animator.onValChange = jest.fn();
  expect(animator.getVal()).toBe(0)
  expect(animator.isStop()).toBe(false)
  animator.update(800)
  expect((animator.onValChange as jest.Mock).mock.calls[0][0]).toBe(4)
  expect(animator.getVal()).toBe(4);
  animator.update(200)
  expect(animator.isStop()).toBe(true)
  expect((animator.onValChange as jest.Mock).mock.calls[1][0]).toBe(5)
  expect(animator.getVal()).toBe(5)
  expect(animator.onStop as jest.Mock).toBeCalled()
})

test("test5To1", () => {
  let animator = new NumberLinearAnimator(5, 0, 1000)
  animator.onStop = jest.fn();
  expect(animator.getVal()).toBe(5)
  animator.update(600)
  expect(animator.getVal()).toBe(2);
  animator.update(800)
  expect(animator.isStop()).toBe(true)
  expect(animator.getVal()).toBe(0)
  expect(animator.onStop as jest.Mock).toBeCalled()
})

test("feet", () => {
  let animator = new NumberLinearAnimator(0, 100, 1000)
  animator.onStop = jest.fn();
  expect(animator.getVal()).toBe(0)
  expect(animator.isStop()).toBe(false)
  animator.update(100);
  expect(animator.getVal()).toBe(10);
  animator.update(1000)
  expect(animator.isStop()).toBe(true)
  expect(animator.getVal()).toBe(100)
  expect(animator.onStop as jest.Mock).toBeCalled()
})