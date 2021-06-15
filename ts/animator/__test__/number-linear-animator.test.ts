import NumberLinearAnimator from "../number-linear-animator"

test("test1To5", () => {
  let animator = new NumberLinearAnimator(1, 5)
  animator.onStop = jest.fn();
  expect(animator.getVal()).toBe(1)
  expect(animator.isStop()).toBe(false)
  let time = 3;
  while(time-- > 0) {
    animator.update();
  }
  expect(animator.getVal()).toBe(4);
  time = 3;
  while(time-- > 0) {
    animator.update();
  }
  expect(animator.isStop()).toBe(true)
  expect(animator.getVal()).toBe(5)
  expect(animator.onStop as jest.Mock).toBeCalled()
})

test("test5To1", () => {
  let animator = new NumberLinearAnimator(5, 1)
  animator.onStop = jest.fn();
  expect(animator.getVal()).toBe(5)
  let time = 3;
  while(time-- > 0) {
    animator.update();
  }
  expect(animator.getVal()).toBe(2);
  time = 3;
  while(time-- > 0) {
    animator.update();
  }
  expect(animator.isStop()).toBe(true)
  expect(animator.getVal()).toBe(1)
  expect(animator.onStop as jest.Mock).toBeCalled()
})

test("feet", () => {
  let animator = new NumberLinearAnimator(0, 100, 10)
  animator.onStop = jest.fn();
  expect(animator.getVal()).toBe(0)
  expect(animator.isStop()).toBe(false)
  animator.update();
  expect(animator.getVal()).toBe(10);
  let time = 10;
  while(time-- > 0) {
    animator.update();
  }
  expect(animator.isStop()).toBe(true)
  expect(animator.getVal()).toBe(100)
  expect(animator.onStop as jest.Mock).toBeCalled()
})