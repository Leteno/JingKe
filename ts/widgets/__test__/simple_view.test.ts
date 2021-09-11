import { BindableData } from "../../data/bindable_data";
import { Specify } from "../../misc/layout";
import SimpleView from "../simple_view";
import { MeasureResult } from "../sprite";
import { defaultCtx } from "./default_value.test";
import TestSprite from "./test_sprite.test";

class TestData extends BindableData {
  name: string;
}
class TestView extends SimpleView {
  name: string;
  calculateActualSize(ctx: CanvasRenderingContext2D, maxWidthForCalculation: number, maxHeightForCalculation: number): MeasureResult {
    let r = new MeasureResult();
    r.calcWidth = 0;
    r.calcHeight = 0;
    return r;
  }
  onLayout(parentWidth: number, parentHeight: number, left: number, top: number) {
  }
  drawToCanvasInternal(ctx: CanvasRenderingContext2D) {
  }
}
test("data binding", () => {

  let data = new TestData();
  data.name = "test1";
  let view = new TestView();
  view.bindData(data, (v:TestView, d:TestData) => {
    v.name = d.name;
  });

  expect(view.name).toBe("test1");

  data.name = "test2";
  data.dirty = true;
  view.drawToCanvas(defaultCtx);
  expect(view.name).toBe("test2");
})

test("Specify", () => {
  let view = new TestView();
  view.setIsDirty(true);
  view.measure(defaultCtx, 500, 500, Specify.NONE);

  expect(view.width).toBe(0);
  expect(view.height).toBe(0);

  view.setIsDirty(true);
  view.measure(defaultCtx, 500, 500, Specify.X);
  expect(view.width).toBe(500);
  expect(view.height).toBe(0);

  view.setIsDirty(true);
  view.measure(defaultCtx, 500, 500, Specify.Y);
  expect(view.width).toBe(0);
  expect(view.height).toBe(500);

  view.setIsDirty(true);
  view.measure(defaultCtx, 500, 500, Specify.X | Specify.Y);
  expect(view.width).toBe(500);
  expect(view.height).toBe(500);

  view.setIsDirty(true);
  view.measure(defaultCtx, 500, 500, Specify.X | Specify.NONE);
  expect(view.width).toBe(500);
  expect(view.height).toBe(0);

  view.setIsDirty(true);
  view.measure(defaultCtx, 500, 500, Specify.Y | Specify.NONE);
  expect(view.width).toBe(0);
  expect(view.height).toBe(500);

  view.setIsDirty(true);
  view.measure(defaultCtx, 500, 500, Specify.X | Specify.Y | Specify.NONE);
  expect(view.width).toBe(500);
  expect(view.height).toBe(500);
})

test("enable bg color", () => {
  let t = new TestSprite();
  t.bgColor = "white";
  t.disableBgColor = "blue";
  t.drawToCanvas(defaultCtx);
  expect(defaultCtx.fillStyle).toBe("white");
  t.enable = false;
  t.drawToCanvas(defaultCtx);
  expect(defaultCtx.fillStyle).toBe("blue");

})

test("isReady", ()=> {
  let a = new TestView();
  expect(a.isReady()).toBe(false);
  a.measure(defaultCtx, 10, 10, Specify.NONE);
  a.layout(10, 10);
  expect(a.isReady()).toBe(true);
})