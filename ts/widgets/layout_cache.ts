import Sprite, { MeasureResult } from "./sprite";

class MeasureParams {
  maxWidth: number;
  maxHeight: number;

  constructor() {
    this.maxWidth = -1;
    this.maxHeight = -1;
  }

  setParams(maxWidth: number, maxHeight: number) {
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
  }

  isDifferent(maxWidth: number, maxHeight: number) : boolean {
    return this.maxWidth != maxWidth ||
      this.maxHeight != maxHeight;
  }
}

class LayoutParams {
  parentWidth: number;
  parentHeight: number;
  left: number;
  top:number;

  constructor() {
    this.parentWidth = -1;
    this.parentHeight = -1;
    this.left = -1;
    this.top = -1;
  }

  setParams(parentWidth: number, parentHeight: number, left: number, top:number) {
    this.parentWidth = parentWidth;
    this.parentHeight = parentHeight;
    this.left = left;
    this.top = top;
  }

  isDifferent(parentWidth: number, parentHeight: number, left: number, top:number) {
    return this.parentWidth != parentWidth ||
      this.parentHeight != parentHeight ||
      this.left != left ||
      this.top != top;
  }
}

export default class LayoutCache {
  private measureParams: MeasureParams;
  private measureResult: MeasureResult;
  private layoutParams: LayoutParams;
  private dirty: boolean;
  
  constructor() {
    this.measureParams = new MeasureParams();
    this.measureResult = new MeasureResult();
    this.layoutParams = new LayoutParams();
    this.dirty = false;
  }

  measureParamsChanged(maxWidth: number, maxHeight: number) {
    return this.measureParams.isDifferent(
      maxWidth, maxHeight
    );
  }
  saveMeasureParams(maxWidth: number, maxHeight: number) {
    this.measureParams.setParams(maxWidth, maxHeight);
  }
  saveMeasureResult(result: MeasureResult) {
    this.measureResult.calcWidth = result.calcWidth;
    this.measureResult.calcHeight = result.calcHeight;
  }
  getMeasureResult() : MeasureResult {
    return {
      calcWidth: this.measureResult.calcWidth,
      calcHeight: this.measureResult.calcHeight
    };
  }
  reMeasure(view: Sprite, ctx: CanvasRenderingContext2D) {
    view.measure(
      ctx,
      this.measureParams.maxWidth,
      this.measureParams.maxHeight
    );
  }

  layoutParamsChanged(parentWidth: number, parentHeight: number, left: number, top:number) {
    return this.layoutParams.isDifferent(
      parentWidth, parentHeight,
      left, top
    );
  }
  saveLayoutParams(parentWidth: number, parentHeight: number, left: number, top:number) {
    this.layoutParams.setParams(
      parentWidth, parentHeight,
      left, top
    );
  }
  reLayout(view: Sprite) {
    view.layout(
      this.layoutParams.parentWidth,
      this.layoutParams.parentHeight,
      this.layoutParams.left,
      this.layoutParams.top
    );
  }

  isDirty() : boolean {
    return this.dirty;
  }

  setIsDirty(dirty: boolean) {
    this.dirty = dirty;
  }
}