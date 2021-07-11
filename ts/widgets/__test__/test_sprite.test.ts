
import SimpleView from "../simple_view";
import Sprite, { MeasureResult } from "../sprite"

export default class TestSprite extends SimpleView {
  constructor(width: number = -1, height: number=-1) {
    super();
    this.width = this.forceWidth = width;
    this.height = this.forceHeight = height;
  }

  calculateActualSize(ctx: CanvasRenderingContext2D, maxWidthForCalculation: number, maxHeightForCalculation: number): MeasureResult {
    return {
      calcWidth: this.width,
      calcHeight: this.height
    }
  }

  onLayout(parentWidth: number, parentHeight: number) {
  }

  drawToCanvasInternal(ctx: CanvasRenderingContext2D) {
  }
}

test("good", () => {
  let s = new TestSprite(100, 120);
  expect(s.forceWidth).toBe(100)
  expect(s.width).toBe(100)
  expect(s.forceHeight).toBe(120)
  expect(s.height).toBe(120)
})