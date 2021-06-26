import Panel from "../panel"
import TestSprite from "./test_sprite.test";

test("measurePanel", () => {
  let panel = new Panel();
  let s1 = new TestSprite(100, 200);
  panel.addView(s1);
  let ctx = {} as CanvasRenderingContext2D;

  panel.measure(ctx);
  expect(panel.width).toBe(100);
  expect(panel.height).toBe(200);

  s1.left = 20;
  s1.top = 40;
  panel.measure(ctx);
  expect(panel.width).toBe(120);
  expect(panel.height).toBe(240);

  let s2 = new TestSprite(100, 100);
  s2.left = 300;
  s2.top = 10;
  panel.addView(s2);
  panel.measure(ctx);
  expect(panel.width).toBe(400);
  expect(panel.height).toBe(240);
})