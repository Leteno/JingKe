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