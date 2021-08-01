
import {Sequence, SequenceItem} from "../sequence"
import NumberLinearAnimator from "../../animator/number-linear-animator"
test("sequence using animation", () => {
  let sequence = new Sequence();
  let a1 = new NumberLinearAnimator(
    0, 100, 100
  );
  let item1:SequenceItem = {
    onStart() {
      a1.onStop = sequence.next.bind(sequence);
    }
  };
  let mockFn = jest.fn();
  let item2:SequenceItem = {
    onStart: mockFn
  }
  sequence.addIntoSequence(item1);
  sequence.addIntoSequence(item2);
  sequence.startOne();

  expect(mockFn.mock.calls.length)
    .toBe(0);

  a1.update(50);
  expect(mockFn.mock.calls.length)
    .toBe(0);


  a1.update(60);
  expect(mockFn.mock.calls.length)
    .toBe(1);
})