import Panel from "./panel";
import { MeasureResult } from "./sprite";

export class ScrollView extends Panel {
  // vertical

  offsetX: number;
  offsetY: number;

  scrollOffset: number;
  childrenMaxWidth: number;
  childrenMaxHeight: number;

  constructor() {
    super();
    this.offsetX = 0;
    this.offsetY = 0;

    this.scrollOffset = 10;
    this.childrenMaxWidth = 0;
    this.childrenMaxHeight = 0;
  }

  drawToCanvasInternal(ctx: CanvasRenderingContext2D) {
    ctx.save();
    let region = new Path2D();
    region.rect(this.x, this.y, this.width, this.height);
    ctx.clip(region);
    ctx.translate(this.offsetX, this.offsetY);
    super.drawToCanvasInternal(ctx);
    ctx.restore();
  }

  calculateActualSize(
    ctx: CanvasRenderingContext2D,
    maxWidthForCalculation: number,
    maxHeightForCalculation: number): MeasureResult {
    let result = super.calculateActualSize(
      ctx, maxWidthForCalculation, maxHeightForCalculation
    );
    this.childrenMaxWidth = result.calcWidth;
    this.childrenMaxHeight = result.calcHeight;
    return result;
  }
    
  scrollBy(x: number, y: number) {
    let newOffsetX = x + this.offsetX;
    if (newOffsetX < 0) {
      newOffsetX = 0;
    } else if (newOffsetX + this.width > this.childrenMaxWidth) {
      if (this.width < this.childrenMaxWidth) {
        newOffsetX = this.childrenMaxWidth - this.width;
      } else {
        newOffsetX = 0;
      }
    }
    this.offsetX = newOffsetX;

    let newOffsetY = y + this.offsetY;
    if (newOffsetY < 0) {
      newOffsetY = 0;
    } else if (newOffsetY + this.height > this.childrenMaxHeight) {
      if (this.height < this.childrenMaxHeight) {
        newOffsetY = this.childrenMaxHeight - this.height;
      } else {
        newOffsetY = 0;
      }
    }
    this.offsetY = newOffsetY;
  }
}