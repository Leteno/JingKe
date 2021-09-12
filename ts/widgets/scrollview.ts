import { DragEvent, SimpleEvent } from "../misc/event";
import Panel from "./panel";
import { MeasureResult } from "./sprite";

export class ScrollView extends Panel {
  // vertical

  offsetX: number;
  offsetY: number;

  childrenMaxWidth: number;
  childrenMaxHeight: number;

  dragStartTime: number;
  offsetYBeforeDrag: number;

  constructor() {
    super();
    this.offsetX = 0;
    this.offsetY = 0;

    this.childrenMaxWidth = 0;
    this.childrenMaxHeight = 0;

    this.dragStartTime = 0;
    this.offsetYBeforeDrag = 0;
  }

  drawToCanvasInternal(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.beginPath()
    ctx.moveTo(0, 0);
    ctx.lineTo(this.width, 0);
    ctx.lineTo(this.width, this.height),
    ctx.lineTo(0, this.height);
    ctx.lineTo(0,0);
    ctx.clip();
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
    this.offsetX += x;
    this.offsetY += y;
    this.alignOffset();
  }

  ondragInternal(event: DragEvent) {
    if (event.startTime != this.dragStartTime) {
      this.dragStartTime = event.startTime;
      this.offsetYBeforeDrag = this.offsetY;
    }
    this.offsetY = this.offsetYBeforeDrag + event.dragY;
    this.alignOffset();
    return true;
  }

  specialModifyOnEvent(event: SimpleEvent) {
    event.x -= this.offsetX;
    event.y -= this.offsetY;
  }

  alignOffset() {
    let newOffsetX = this.offsetX;
    if (this.width > this.childrenMaxWidth) {
      if (newOffsetX < 0) {
        newOffsetX = 0;
      } else {
        newOffsetX = Math.min(newOffsetX,
          this.width - this.childrenMaxWidth);
      }
    } else {
      if (newOffsetX < 0) {
        newOffsetX = Math.max(newOffsetX,
          this.width - this.childrenMaxWidth);
      } else {
        newOffsetX = 0;
      }
    }
    this.offsetX = newOffsetX;

    let newOffsetY = this.offsetY;
    if (this.height > this.childrenMaxHeight) {
      if (newOffsetY < 0) {
        newOffsetY = 0;
      } else {
        newOffsetY = Math.min(newOffsetY,
          this.height - this.childrenMaxHeight);
      }
    } else {
      if (newOffsetY < 0) {
        newOffsetY = Math.max(newOffsetY,
          this.height - this.childrenMaxHeight);
      } else {
        newOffsetY = 0;
      }
    }
    this.offsetY = newOffsetY;
  }
}