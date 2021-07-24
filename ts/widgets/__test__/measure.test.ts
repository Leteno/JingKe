import { Align, LayoutType } from "../../misc/layout";
import Panel from "../panel"
import TestSprite from "./test_sprite.test";

test("measurePanel", () => {
  let panel = new Panel();
  let s1 = new TestSprite(100, 200);
  panel.addView(s1);
  let ctx = {} as CanvasRenderingContext2D;

  panel.measure(ctx, 500, 500);
  expect(panel.width).toBe(100);
  expect(panel.height).toBe(200);

  s1.margin.left = 20;
  s1.margin.top = 40;
  panel.setIsDirty(true);
  s1.setIsDirty(true);
  panel.measure(ctx, 500, 500);
  expect(panel.width).toBe(120);
  expect(panel.height).toBe(240);

  let s2 = new TestSprite(100, 100);
  s2.margin.left = 300;
  s2.margin.top = 10;
  panel.addView(s2);
  panel.setIsDirty(true);
  panel.measure(ctx, 500, 500);
  expect(panel.width).toBe(400);
  expect(panel.height).toBe(240);
})

test("MATCH_PARENT", () => {
  let panel = new Panel();
  let s1 = new TestSprite(100, 200);
  let s2 = new TestSprite(300, 100);
  s1.margin.left = 50;
  s1.margin.top = 40;
  s2.margin.left = 60;
  s2.margin.top = 80;
  panel.addView(s1);
  panel.addView(s2);
  let ctx = {} as CanvasRenderingContext2D;

  panel.measure(ctx, 500, 500);
  expect(panel.width).toBe(360);
  expect(panel.height).toBe(240);
  expect(s1.width).toBe(100);
  expect(s2.height).toBe(100);

  s1.layoutParam.xLayout = LayoutType.MATCH_PARENT;
  s1.setIsDirty(true);
  panel.setIsDirty(true);
  panel.measure(ctx, 500, 500);
  expect(panel.width).toBe(500);
  expect(panel.height).toBe(240);
  expect(s1.width).toBe(450);
  expect(s2.height).toBe(100);

  s2.layoutParam.yLayout = LayoutType.MATCH_PARENT;
  s2.setIsDirty(true);
  panel.setIsDirty(true);
  panel.measure(ctx, 500, 500);
  expect(panel.width).toBe(500);
  expect(panel.height).toBe(500);
  expect(s1.width).toBe(450);
  expect(s2.height).toBe(420);

  s1.layoutParam.xcfg = Align.CENTER;
  panel.measure(ctx, 500, 500);
  expect(panel.width).toBe(500);
  expect(panel.height).toBe(500);
  expect(s1.width).toBe(400);
  expect(s2.height).toBe(420);

  s2.layoutParam.ycfg = Align.CENTER;
  panel.measure(ctx, 500, 500);
  expect(panel.width).toBe(500);
  expect(panel.height).toBe(500);
  expect(s1.width).toBe(400);
  expect(s2.height).toBe(340);
})