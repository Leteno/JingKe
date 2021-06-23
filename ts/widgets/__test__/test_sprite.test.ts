
import Sprite, { MeasureResult } from "../sprite"

export default class TestSprite extends Sprite {
  constructor(width: number, height: number) {
    super();
    this.width = this.forceWidth = width;
    this.height = this.forceHeight = height;
  }

  protected onMeasure(ctx: CanvasRenderingContext2D): MeasureResult {
    throw new Error("Shouldn't call.");
  }
  protected onLayout(left: number, top: number, right: number, bottom: number): void {
    // do nothing
  }
  drawToCanvasInternal(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
    // do nothing
  }

}

test("good", () => {
  let s = new TestSprite(100, 120);
  expect(s.forceWidth).toBe(100)
  expect(s.width).toBe(100)
  expect(s.forceHeight).toBe(120)
  expect(s.height).toBe(120)
})