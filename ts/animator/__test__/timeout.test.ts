
import Timeout from "../timeout"

test("simple", () => {
  let timeout = new Timeout(1000);
  let mockStop = jest.fn();
  timeout.onStop = mockStop;

  timeout.update(800);
  expect(timeout.getVal()).toBe(800);
  expect(timeout.isStop()).toBe(false);
  expect(mockStop.mock.calls.length).toBe(0);

  timeout.update(400);
  expect(timeout.getVal()).toBe(1000);
  expect(timeout.isStop()).toBe(true);
  expect(mockStop.mock.calls.length).toBe(1);
});