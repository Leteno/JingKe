import { BindableData } from "../../data/bindable_data";
import SimpleView from "../simple_view";
import { MeasureResult } from "../sprite";
import { defaultCtx } from "./ctx.test";

test("data binding", () => {
  class TestData extends BindableData {
    name: string;
  }
  class TestView extends SimpleView {
    name: string;
    calculateActualSize(ctx: CanvasRenderingContext2D, maxWidthForCalculation: number, maxHeightForCalculation: number): MeasureResult {
      return new MeasureResult();
    }
    onLayout(parentWidth: number, parentHeight: number, left: number, top: number) {
    }
    drawToCanvasInternal(ctx: CanvasRenderingContext2D) {
    }
  }

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