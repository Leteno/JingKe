import { Align, LayoutParams } from "../../misc/layout";
import Panel from "../panel"
import SimpleView from "../simple_view";
import Sprite, { MeasureResult } from "../sprite"
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
  panel.margin.left = 120; panel.margin.top = 150;
  panel.padding.left = 33; panel.padding.top = 23;

  let mockDrawFunc1 = jest.fn();
  let mockDrawFunc2 = jest.fn();
  let mockDrawFunc3 = jest.fn();

  let s1 = new TestSprite(100, 100);
  let s2 = new TestSprite(100, 100);
  let s3 = new TestSprite(100, 100);
  s3.visible = false;

  s1.drawToCanvasInternal = mockDrawFunc1;
  s2.drawToCanvasInternal = mockDrawFunc2;
  s3.drawToCanvasInternal = mockDrawFunc3;
  s1.margin.left = 1; s1.margin.top = 10;
  s2.margin.left = 2; s2.margin.top = 20;
  s3.margin.left = 3; s3.margin.top = 30;

  panel.addView(s1);
  panel.addView(s2);
  panel.addView(s3);
  let mockTranslation = jest.fn<void, [number, number]>();
  let ctx = {
    save: function(){},
    restore: function(){},
    translate: function(x: number, y: number){},
  } as CanvasRenderingContext2D;
  ctx.translate = mockTranslation;
  panel.measure(ctx, 500, 500);
  panel.layout(500, 500);
  panel.drawToCanvas(ctx);
  expect(mockDrawFunc1).toBeCalled();
  expect(mockDrawFunc2).toBeCalled();
  // assert x, y position.
  expect(mockTranslation.mock.calls[0][0]).toBe(120);
  expect(mockTranslation.mock.calls[0][1]).toBe(150);
  expect(mockTranslation.mock.calls[1][0]).toBe(33);
  expect(mockTranslation.mock.calls[1][1]).toBe(23);
  expect(mockTranslation.mock.calls[2][0]).toBe(1);
  expect(mockTranslation.mock.calls[2][1]).toBe(10);
  expect(mockTranslation.mock.calls[3][0]).toBe(2);
  expect(mockTranslation.mock.calls[3][1]).toBe(20);

  // invisible view should not be drawn
  expect(mockDrawFunc3.mock.calls.length).toBe(0);
})

test("onMeasure", () => {
  let ctx = {} as CanvasRenderingContext2D;
  let panel = new Panel();
  panel.forceWidth = panel.forceHeight = 100;
  let s1 = new TestSprite();
  let calculateActualSizeFn = jest.fn<MeasureResult, any>(((all: any[]):MeasureResult=>{
    return {
      calcWidth: 10,
      calcHeight: 10
    };
  }));
  let onLayoutFn = jest.fn();
  s1.calculateActualSize = calculateActualSizeFn;
  s1.onLayout = onLayoutFn;
  panel.addView(s1);

  panel.measure(ctx, 100, 100);
  expect(calculateActualSizeFn.mock.calls.length).toBe(1)
  panel.layout(100, 100);
  expect(onLayoutFn.mock.calls.length).toBe(1)
})

test("measureAndLayout", ()=> {
  let ctx = {} as CanvasRenderingContext2D;

  let panel = new Panel();
  panel.margin.left = 12; panel.margin.top = 14;
  let s1 = new TestSprite(20, 50);
  let s2 = new TestSprite(30, 40);
  s1.layoutParam = new LayoutParams(Align.CENTER, Align.CENTER);
  s2.layoutParam = new LayoutParams(Align.END, Align.END);
  s1.margin.left = 11; s1.margin.top = 15;
  s2.margin.left = 45; s2.margin.top = 46;
  panel.addView(s1);
  panel.addView(s2);
  panel.measure(ctx, 500, 500);

  expect(panel.width).toBe(75);
  expect(panel.height).toBe(86);
  // because of force width/height
  expect(s1.width).toBe(20);
  expect(s1.height).toBe(50);
  expect(s2.width).toBe(30);
  expect(s2.height).toBe(40);

  panel.layout(500, 500);

  expect(panel.x).toBe(12);
  expect(panel.y).toBe(14);
  expect(s1.x).toBe(38.5);
  expect(s1.y).toBe(33);
  expect(s2.x).toBe(45);
  expect(s2.y).toBe(46);

  let father = new Panel();
  panel.layoutParam = new LayoutParams(Align.CENTER, Align.CENTER);
  panel.setIsDirty(true);
  father.addView(panel)
  father.measure(ctx, 500, 500);
  father.layout(500, 500);

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

test("calculateActualSize", () => {
  // We need to forbid changing the Width/Height
  // in calculateActualSize
  let testView = new TestSprite();
  testView.forceWidth = 100;
  testView.forceHeight = 100;
  testView.calculateActualSize = jest.fn<MeasureResult, any[]>(
    (all: any[]) => {
      testView.width = 200;
      testView.height = 200;
      return {
        calcWidth: 200,
        calcHeight: 200
      }
  });
  let ctx = {} as CanvasRenderingContext2D;
  testView.measure(ctx, 200, 200);
  expect(testView.width).toBe(100);
  expect(testView.height).toBe(100);
})