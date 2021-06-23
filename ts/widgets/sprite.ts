import { boolean } from "yargs";
import EasyMath from "../misc/easy-math";
import { ClickEvent } from "../misc/event";

export class MeasureResult {
  widthAtMost: number;
  heightAtMost: number;
}

export default abstract class Sprite {
  left: number;
  top: number;
  visible: boolean;

  // We could force the value here. Need to call measure to update it though.
  forceWidth: number;
  forceHeight: number;

  // These values are calculated.
  width: number;
  height: number;
  x: number;
  y: number;

  constructor(left:number=0, top:number=0, visible:boolean=true) {
    this.left = left;
    this.top = top;
    this.visible = visible;

    this.forceWidth = -1;
    this.forceHeight = -1;
    this.width = this.height = 0;
    this.x = this.y = 0;
  }

  measure(ctx: CanvasRenderingContext2D): MeasureResult {
    if (this.forceWidth > 0 && this.forceHeight > 0) {
      this.width = this.forceWidth;
      this.height = this.forceHeight;
      return {
        widthAtMost: this.forceWidth + this.left,
        heightAtMost: this.forceHeight + this.top
      }
    }
    return this.onMeasure(ctx);
  }

  // measure for width and height
  protected abstract onMeasure(ctx: CanvasRenderingContext2D): MeasureResult;

  layout(left: number, top: number, right: number, bottom: number): void {
    return this.onLayout(left, top, right, bottom);
  }

  // layout for x and y
  // (left, top) - (right, bottom), those are parent's size.
  protected abstract onLayout(left: number, top: number, right: number, bottom: number): void;

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