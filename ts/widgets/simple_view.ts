import { Align } from "../misc/layout";
import Sprite, { MeasureResult } from "./sprite";

export default abstract class SimpleView extends Sprite {

  measure(ctx: CanvasRenderingContext2D, maxWidth: number, maxHeight: number): MeasureResult {
    if (this.forceWidth > 0 && this.forceHeight > 0) {
      // Align forceSize to fit maxWidth/Height
      this.forceWidth = Math.min(this.forceWidth,
        maxWidth - this.getLandscapeMargin());
      this.forceHeight = Math.min(this.forceHeight,
        maxHeight - this.getPortraitMargin());

      this.calculateActualSize(
        ctx,
        this.forceWidth - this.padding.left - this.padding.right,
        this.forceHeight - this.padding.top - this.padding.bottom);

      this.width = this.forceWidth;
      this.height = this.forceHeight;
    } else {
      let measureResult = this.calculateActualSize(
        ctx,
        maxWidth - this.padding.left - this.padding.right
          - this.getLandscapeMargin(),
        maxHeight - this.padding.top - this.padding.bottom
          - this.getPortraitMargin()
      );
      this.width = measureResult.calcWidth +
        this.padding.left + this.padding.right;
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
    if (Align.CENTER == this.layoutParam.xcfg) {
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