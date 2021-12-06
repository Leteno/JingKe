
import Interval from "../interval"

test("simple case", () => {
  let maxTime = 5;
  let fn = jest.fn(() => {
    maxTime--;
    return maxTime > 0;
  });
  let interval = new Interval(100);
  interval.onInterval = fn;
  for (let i = 1; i <= 4; i++) {
      // They should all be consumed.
      expect(interval.update(100)).toBe(0);
      expect(interval.isStop()).toBe(false);
      expect((fn as jest.Mock).mock.calls.length).toBe(i);
  }
  expect(interval.update(101)).toBe(1);
  expect(interval.isStop()).toBe(true);
  expect((fn as jest.Mock).mock.calls.length).toBe(5);
})