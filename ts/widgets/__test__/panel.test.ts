import { Align, LayoutParams } from "../../misc/layout";
import Panel from "../panel"
import Sprite from "../sprite"
import TestSprite from "./test_sprite.test"

function indexOf(pairList: Array<Sprite>, view: Sprite): number {
  return pairList.findIndex((v) => v == view);
}

test('helloworld', () => {
  expect(1+1).toBe(2);
})

test('addAndRemove', () => {
  let panel = new Panel();
  let s1 = new TestSprite(100, 100);
  let s2 = new TestSprite(100, 100);

  panel.addView(s1);
  expect(indexOf(panel.children, s1)).toBeGreaterThanOrEqual(0);
  expect(indexOf(panel.children, s2)).toBe(-1);
  panel.removeView(s1);
  expect(indexOf(panel.children, s1)).toBe(-1);
})

test('removeAll', () => {
  let panel = new Panel();
  let s1 = new TestSprite(100, 100);
  let s2 = new TestSprite(100, 100);

  panel.addView(s1);
  panel.addView(s2);
  expect(indexOf(panel.children, s1)).toBeGreaterThanOrEqual(0);
  expect(indexOf(panel.children, s2)).toBeGreaterThanOrEqual(0);
  panel.removeAllViews();
  expect(indexOf(panel.children, s1)).toBe(-1);
  expect(indexOf(panel.children, s2)).toBe(-1);
})

test('drawChildren', () => {
  let panel = new Panel();
  panel.left = 120; panel.top = 150;
  let mockDrawFunc1 = jest.fn();
  let mockDrawFunc2 = jest.fn();
  let s1 = new TestSprite(100, 100);
  let s2 = new TestSprite(100, 100);
  s1.drawToCanvasInternal = mockDrawFunc1;
  s2.drawToCanvasInternal = mockDrawFunc2;
  s1.left = 1; s1.top = 10;
  s2.left = 2; s2.top = 20;

  panel.addView(s1);
  panel.addView(s2);
  let mockTranslation = jest.fn<void, [number, number]>();
  let ctx = {
    save: function(){},
    restore: function(){},
    translate: function(x: number, y: number){},
  } as CanvasRenderingContext2D;
  ctx.translate = mockTranslation;
  panel.measure(ctx);
  panel.layout();
  panel.drawToCanvas(ctx);
  expect(mockDrawFunc1).toBeCalled();
  expect(mockDrawFunc2).toBeCalled();
  // assert x, y position.
  // expect(mockTranslation.mock.calls[0][0]).toBe(120);
  // expect(mockTranslation.mock.calls[0][1]).toBe(150);
  // expect(mockDrawFunc1.mock.calls[0][1]).toBe(1);
  // expect(mockDrawFunc1.mock.calls[0][2]).toBe(10);
  // expect(mockDrawFunc2.mock.calls[0][1]).toBe(2);
  // expect(mockDrawFunc2.mock.calls[0][2]).toBe(20);
})

test("measureAndLayout", ()=> {
  let ctx = {} as CanvasRenderingContext2D;

  let panel = new Panel();
  panel.left = 12; panel.top = 14;
  let s1 = new TestSprite(20, 50);
  let s2 = new TestSprite(30, 40);
  s1.layoutParam = new LayoutParams(Align.CENTER, Align.CENTER);
  s2.layoutParam = new LayoutParams(Align.END, Align.END);
  s1.left = 11; s1.top = 15;
  s2.left = 45; s2.top = 46;
  panel.addView(s1);
  panel.addView(s2);
  panel.measure(ctx);

  expect(panel.width).toBe(75);
  expect(panel.height).toBe(86);
  // because of force width/height
  expect(s1.width).toBe(20);
  expect(s1.height).toBe(50);
  expect(s2.width).toBe(30);
  expect(s2.height).toBe(40);

  panel.layout();

  expect(panel.x).toBe(12);
  expect(panel.y).toBe(14);
  expect(s1.x).toBe(38.5);
  expect(s1.y).toBe(33);
  expect(s2.x).toBe(45);
  expect(s2.y).toBe(46);

  let father = new Panel();
  panel.layoutParam = new LayoutParams(Align.CENTER, Align.CENTER);
  father.addView(panel)
  father.measure(ctx);
  father.layout();

  expect(father.width).toBe(99);
  expect(father.height).toBe(114);
  expect(panel.width).toBe(75);
  expect(panel.height).toBe(86);
  expect(panel.x).toBe(24);
  expect(panel.y).toBe(28);
  // Nothing change inside.
  expect(s1.x).toBe(38.5);
  expect(s1.y).toBe(33);
  expect(s2.x).toBe(45);
  expect(s2.y).toBe(46);
})