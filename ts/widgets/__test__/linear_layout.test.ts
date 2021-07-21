
import LinearLayout from "../linear_layout"
import TestSprite from "./test_sprite.test"
test("measure", () => {
  let layout = new LinearLayout();

  let v1 = new TestSprite(100, 100);
  v1.margin.top = 30;
  v1.margin.bottom = 40;
  v1.margin.left = 10;
  layout.addView(v1);

  let v2 = new TestSprite(200, 200);
  v2.margin.top = 10;
  v2.margin.bottom = 20;
  v2.margin.left = 5;
  layout.addView(v2);

  let ctx = {} as CanvasRenderingContext2D;
  layout.measure(ctx, 600, 600);
  layout.layout(600, 600);

  expect(v1.width).toBe(100);
  expect(v1.height).toBe(100);
  expect(v1.x).toBe(10);
  expect(v1.y).toBe(30);

  expect(v2.width).toBe(200);
  expect(v2.height).toBe(200);
  expect(v2.x).toBe(5);
  expect(v2.y).toBe(180);
})