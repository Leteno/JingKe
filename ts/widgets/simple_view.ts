import { BindableData } from "../data/bindable_data";
import { Align, LayoutType } from "../misc/layout";
import LayoutCache from "./layout_cache";
import Sprite, { MeasureResult } from "./sprite";

export default abstract class SimpleView extends Sprite {

  private layoutCache: LayoutCache;

  // Databinding support
  private bindedData: BindableData;
  private onBind: (v:Sprite, data: BindableData) => void;

  constructor() {
    super();
    this.layoutCache = new LayoutCache();
  }

  measure(ctx: CanvasRenderingContext2D, maxWidth: number, maxHeight: number): MeasureResult {
    if (!this.layoutCache.measureParamsChanged(maxWidth, maxHeight) &&
        !this.layoutCache.isDirty()) {
      return this.layoutCache.getMeasureResult();
    }
    this.layoutCache.saveMeasureParams(maxWidth, maxHeight);
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
    let result = {
      calcWidth: this.width + this.getLandscapeMargin(),
      calcHeight: this.height + this.getPortraitMargin()
    }
    this.layoutCache.saveMeasureResult(result);
    return result;
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

  layout(parentWidth: number, parentHeight: number, left: number=0, top:number=0) {
    if (!this.layoutCache.layoutParamsChanged(
          parentWidth, parentHeight, left, top) &&
        !this.layoutCache.isDirty()) {
        return;
    }
    this.layoutCache.saveLayoutParams(
      parentWidth, parentHeight, left, top
    );
    switch(this.layoutParam.xcfg) {
      case Align.CENTER:
        this.x = left + (parentWidth - this.width) / 2
                + this.margin.left - this.margin.right;
        break;
      case Align.END:
        this.x = left + parentWidth - this.width - this.margin.right;
        break;
      default:
        this.x = left + this.margin.left;
        break;
    }
    switch(this.layoutParam.ycfg) {
      case Align.CENTER:
        this.y = top + (parentHeight - this.height) / 2
                + this.margin.top - this.margin.bottom;
        break;
      case Align.END:
        this.y = top + parentHeight - this.height - this.margin.bottom;
        break;
      default:
        this.y = top + this.margin.top;
        break;
    }
    this.onLayout(parentWidth, parentHeight, left, top);
  }

  abstract onLayout(
    parentWidth: number, parentHeight: number,
    left: number, top: number);

  drawToCanvas(ctx: CanvasRenderingContext2D) {
    if (!this.visible) return;
    if (this.layoutCache.isDirty()) {
      this.layoutCache.reMeasure(this, ctx);
      this.layoutCache.reLayout(this);
      this.layoutCache.setIsDirty(false);
    }
    if (this.bindedData && this.onBind && this.bindedData.dirty) {
      this.onBind(this, this.bindedData);
      this.bindedData.dirty = false;
    }
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

  setIsDirty(dirty: boolean) {
    this.layoutCache.setIsDirty(dirty);  
  }

  bindData(data: BindableData, fn: (v:Sprite, d:BindableData)=>void) {
    this.bindedData = data;
    this.onBind = fn;
    this.onBind(this, data);
  }

  abstract drawToCanvasInternal(ctx: CanvasRenderingContext2D);
}