import Panel from "../widgets/panel"
import Sprite from "../widgets/sprite"

test('helloworld', () => {
  expect(1+1).toBe(2);
})

test('addAndRemove', () => {
  let panel = new Panel();
  let s1 = new Sprite();
  let s2 = new Sprite();

  panel.addView(s1);
  expect(panel.children.indexOf(s1)).toBeGreaterThanOrEqual(0);
  expect(panel.children.indexOf(s2)).toBe(-1);
  panel.removeView(s1);
  expect(panel.children.indexOf(s1)).toBe(-1);
})

test('removeAll', () => {
  let panel = new Panel();
  let s1 = new Sprite();
  let s2 = new Sprite();

  panel.addView(s1);
  panel.addView(s2);
  expect(panel.children.indexOf(s1)).toBeGreaterThanOrEqual(0);
  expect(panel.children.indexOf(s2)).toBeGreaterThanOrEqual(0);
  panel.removeAllViews();
  expect(panel.children.indexOf(s1)).toBe(-1);
  expect(panel.children.indexOf(s2)).toBe(-1);
})

test('drawChildren', () => {
  let panel = new Panel();
  panel.x = 120; panel.y = 150;
  let mockDrawFunc1 = jest.fn();
  let mockDrawFunc2 = jest.fn();
  let s1 = new Sprite();
  let s2 = new Sprite();
  s1.drawToCanvasInternal = mockDrawFunc1;
  s2.drawToCanvasInternal = mockDrawFunc2;
  s1.x = 1; s1.y = 10;
  s2.x = 2; s2.y = 20;

  panel.addView(s1 as Sprite);
  panel.addView(s2);
  panel.drawToCanvas({} as CanvasRenderingContext2D);
  expect(mockDrawFunc1).toBeCalled();
  expect(mockDrawFunc2).toBeCalled();
  // assert x, y position.
  expect(mockDrawFunc1.mock.calls[0][1]).toBe(121 /* 120 + 1 */);
  expect(mockDrawFunc1.mock.calls[0][2]).toBe(160 /* 150 + 10 */);
  expect(mockDrawFunc2.mock.calls[0][1]).toBe(122 /* 120 + 2 */);
  expect(mockDrawFunc2.mock.calls[0][2]).toBe(170 /* 150 + 20 */);
})