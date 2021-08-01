import NumberLinearAnimator from "../number-linear-animator"
import { MeanWhile, MeanWhileBuilder} from "../meanwhile"

test("simple", () => {
  let a1 = new NumberLinearAnimator(
    0, 100, 100
  );
  let a2 = new NumberLinearAnimator(
    0, 200, 200
  );
  let meanwhile = new MeanWhileBuilder()
    .join(a1)
    .join(a2)
    .build();

  a1.onValChange = jest.fn();
  a1.onStop = jest.fn();
  a2.onValChange = jest.fn();
  a2.onStop = jest.fn();

  meanwhile.update(50);
  expect((a1.onValChange as jest.Mock)
    .mock.calls.length).toBe(1);
  expect((a1.onValChange as jest.Mock)
    .mock.calls[0][0]).toBe(50);
  expect((a1.onStop as jest.Mock)
    .mock.calls.length).toBe(0);

  expect((a2.onValChange as jest.Mock)
    .mock.calls.length).toBe(1);
  expect((a2.onValChange as jest.Mock)
    .mock.calls[0][0]).toBe(50);
  expect((a2.onStop as jest.Mock)
    .mock.calls.length).toBe(0);

  meanwhile.update(50);
  expect((a1.onValChange as jest.Mock)
    .mock.calls.length).toBe(2);
  expect((a1.onValChange as jest.Mock)
    .mock.calls[1][0]).toBe(100);
  expect((a1.onStop as jest.Mock)
    .mock.calls.length).toBe(1);

  expect((a2.onValChange as jest.Mock)
    .mock.calls.length).toBe(2);
  expect((a2.onValChange as jest.Mock)
    .mock.calls[1][0]).toBe(100);
  expect((a2.onStop as jest.Mock)
    .mock.calls.length).toBe(0);

  meanwhile.update(50);
  expect((a1.onValChange as jest.Mock)
    .mock.calls.length).toBe(2);
  expect((a1.onStop as jest.Mock)
    .mock.calls.length).toBe(1);

  expect((a2.onValChange as jest.Mock)
    .mock.calls.length).toBe(3);
  expect((a2.onValChange as jest.Mock)
    .mock.calls[2][0]).toBe(150);
  expect((a2.onStop as jest.Mock)
    .mock.calls.length).toBe(0);

  meanwhile.update(60);
  expect((a1.onValChange as jest.Mock)
    .mock.calls.length).toBe(2);
  expect((a1.onStop as jest.Mock)
    .mock.calls.length).toBe(1);

  expect((a2.onValChange as jest.Mock)
    .mock.calls.length).toBe(4);
  expect((a2.onValChange as jest.Mock)
    .mock.calls[3][0]).toBe(200);
  expect((a2.onStop as jest.Mock)
    .mock.calls.length).toBe(1);
})