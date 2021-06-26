import { boolean } from "yargs";
import EasyMath from "../misc/easy-math";
import { ClickEvent } from "../misc/event";
import { Align, LayoutParams } from "../misc/layout";

export class MeasureResult {
  widthAtMost: number;
  heightAtMost: number;
}

export default abstract class Sprite {
  left: number;
  top: number;
  right: number;
  bottom: number;
  visible: boolean;
  layoutParam: LayoutParams;

  // We could force the value here. Need to call measure to update it though.
  forceWidth: number;
  forceHeight: number;

  // These values are calculated.
  width: number;
  height: number;
  x: number;
  y: number;

  constructor(layoutParam: LayoutParams=LayoutParams.normal(), visible:boolean=true) {
    this.layoutParam = layoutParam;
    this.visible = visible;

    this.forceWidth = -1;
    this.forceHeight = -1;
    this.width = this.height = 0;
    this.x = this.y = 0;
    this.left = this.top = 0;
    this.right = this.bottom = 0;
  }

  measure(ctx: CanvasRenderingContext2D): MeasureResult {
    if (this.forceWidth > 0 && this.forceHeight > 0) {
      this.width = this.forceWidth;
      this.height = this.forceHeight;
      return {
        widthAtMost: this.forceWidth + this.getAdditionalX(),
        heightAtMost: this.forceHeight + this.getAdditionalY()
      }
    }
    return this.onMeasure(ctx);
  }

  getAdditionalX() : number {
    let ret = this.left;
    if (Align.CENTER == this.layoutParam.xcfg) {
      ret = this.left * 2;
    }
    return ret;
  }
  getAdditionalY() : number {
    let ret = this.top;
    if (Align.CENTER == this.layoutParam.xcfg) {
      ret = this.top * 2;
    }
    return ret;
  }

  // measure for width and height
  protected abstract onMeasure(ctx: CanvasRenderingContext2D): MeasureResult;

  // (left, top) - width, height, those are parent's attribute.
  // And under such situation, we need to calculate the x,y for the layout
  onLayout(width: number, height: number) {
    switch(this.layoutParam.xcfg) {
      case Align.CENTER:
        this.x = (width - this.width) / 2 + this.left;
        break;
      case Align.END:
        this.x = width - this.width - this.right;
        break;
      default:
        this.x = this.left;
        break;
    }
    switch(this.layoutParam.ycfg) {
      case Align.CENTER:
        this.y = (height - this.height) / 2 + this.top;
        break;
      case Align.END:
        this.y = height - this.height - this.bottom;
        break;
      default:
        this.y = this.top;
        break;
    }
  }

  // public final
  drawToCanvas(ctx: CanvasRenderingContext2D) {
    if (!this.visible) return;
    this.drawToCanvasInternal(
      ctx,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  // protected
  abstract drawToCanvasInternal(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void;

  isCollideWith(sp: Sprite) {
    if (!this.visible || !sp.visible) return false;

    const spX = sp.x + sp.width / 2;
    const spY = sp.y + sp.height / 2;
    return !!(spX >= this.x
              && spX <= this.x + this.width
              && spY >= this.y
              && spY <= this.y + this.height);
  }

  onclick(event: ClickEvent): boolean {
    let inside = EasyMath.between(this.x, this.x + this.width, event.x)
      && EasyMath.between(this.y, this.y + this.height, event.y);
    if (!inside) return false;
    return this.onclickInternal(event);
  }

  onclickInternal(event: ClickEvent): boolean {
    return true;
  }
}