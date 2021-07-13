import { Align, LayoutType } from "../misc/layout";
import Sprite, { MeasureResult } from "./sprite";

export default abstract class SimpleView extends Sprite {

  measure(ctx: CanvasRenderingContext2D, maxWidth: number, maxHeight: number): MeasureResult {
    // The max size this child view could be.
    maxWidth = maxWidth - this.getLandscapeMargin();
    maxHeight = maxHeight - this.getPortraitMargin();

    let width = 0;
    let height = 0;
    if (this.layoutParam.xLayout == LayoutType.MATCH_PARENT) {
      width = maxWidth;
    } else if (this.forceWidth > 0) {
      width = Math.min(this.forceWidth, maxWidth);
    }
    if (this.layoutParam.yLayout == LayoutType.MATCH_PARENT) {
      height = maxHeight;
    } else if (this.forceHeight > 0) {
      height = Math.min(this.forceHeight, maxHeight);
    }

    let specifiedX = width > 0;
    let specifiedY = height > 0;
    if (!specifiedX) {
      width = maxWidth;
    }
    if (!specifiedY) {
      height = maxHeight;
    }

    let measureResult = this.calculateActualSize(
      ctx,
      width - this.padding.left - this.padding.right,
      height - this.padding.top - this.padding.bottom
    )
    if (specifiedX) {
      this.width = width;
    } else {
      this.width = measureResult.calcWidth +
        this.padding.left + this.padding.right;
    }
    if (specifiedY) {
      this.height = height;
    } else {
      this.height = measureResult.calcHeight +
        this.padding.top + this.padding.bottom;
    }
    return {
      calcWidth: this.width + this.getLandscapeMargin(),
      calcHeight: this.height + this.getPortraitMargin()
    }
  }

  /**
   * Return margin in Landscape regard of align
   */
  getLandscapeMargin() : number {
    let ret = this.margin.left + this.margin.right;
    if (Align.CENTER == this.layoutParam.xcfg) {
      ret = Math.max(this.margin.left, this.margin.right) * 2;
    }
    return ret;
  }

  /**
   * Return margin in Portrait regard of align
   */
  getPortraitMargin() : number {
    let ret = this.margin.top + this.margin.bottom;
    if (Align.CENTER == this.layoutParam.ycfg) {
      ret = Math.max(this.margin.top, this.margin.bottom) * 2;
    }
    return ret;
  }

  /**
   * Calculate the possible actually size of this view.
   *
   * The width/height in param has been - view.padding
   * and view.margin
   *
   * @param maxWidthForCalculation
   * parentPossibleWidth - view.padding - view.margin
   * @param maxHeightForCalculation 
   * parentPossibleHeight - view.padding - view.margin
   */
  abstract calculateActualSize(
    ctx: CanvasRenderingContext2D,
    maxWidthForCalculation: number,
    maxHeightForCalculation: number): MeasureResult;

  layout(parentWidth: number, parentHeight: number) {
    switch(this.layoutParam.xcfg) {
      case Align.CENTER:
        this.x = (parentWidth - this.width) / 2 + this.margin.left;
        break;
      case Align.END:
        this.x = parentWidth - this.width - this.margin.right;
        break;
      default:
        this.x = this.margin.left;
        break;
    }
    switch(this.layoutParam.ycfg) {
      case Align.CENTER:
        this.y = (parentHeight - this.height) / 2 + this.margin.top;
        break;
      case Align.END:
        this.y = parentHeight - this.height - this.margin.bottom;
        break;
      default:
        this.y = this.margin.top;
        break;
    }
    this.onLayout(parentWidth, parentHeight);
  }

  abstract onLayout(parentWidth: number, parentHeight: number);

  drawToCanvas(ctx: CanvasRenderingContext2D) {
    if (!this.visible) return;
    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.bgColor) {
      ctx.save();
      ctx.fillStyle = this.bgColor;
      ctx.fillRect(
        0, 0,
        this.width,
        this.height);
      ctx.restore();
    }

    if (this.debug) {
      ctx.save();
      ctx.fillStyle = this.debugColor;
      ctx.fillRect(
        0, 0,
        this.width,
        this.height);
      ctx.restore();
    }

    if (this.border) {
      ctx.save();
      ctx.strokeStyle = "black";
      ctx.strokeRect(
        0, 0,
        this.width,
        this.height
      );
      ctx.restore();
    }

    this.drawToCanvasInternal(ctx);

    ctx.restore();
  }

  abstract drawToCanvasInternal(ctx: CanvasRenderingContext2D);
}