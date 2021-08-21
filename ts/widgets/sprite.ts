import { boolean } from "yargs";
import EasyMath from "../misc/easy-math";
import { ClickEvent, PressEvent } from "../misc/event";
import { Align, LayoutParams, Specify } from "../misc/layout";

export class MeasureResult {
  calcWidth: number;
  calcHeight: number;
}

export class Border {
  color: string;
}

class _Gap {
  left: number;
  top: number;
  right: number;
  bottom: number;

  constructor() {
    this.left = 0;
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
  }
}

export default abstract class Sprite {
  margin: _Gap;
  padding: _Gap;
  visible: boolean;
  layoutParam: LayoutParams;
  border: Border;
  bgColor: string;

  debug: boolean;
  debugColor: string;

  // forceWidth = actualWidth + padding
  forceWidth: number;
  // forceHeight = actualHeight + padding
  forceHeight: number;

  // These values are calculated.
  width: number;
  height: number;
  x: number;
  y: number;

  constructor(layoutParam: LayoutParams=LayoutParams.normal(), visible:boolean=true) {
    this.layoutParam = layoutParam;
    this.visible = visible;
    this.debug = false;
    this.debugColor = "blue";

    this.forceWidth = -1;
    this.forceHeight = -1;
    this.width = this.height = 0;
    this.x = this.y = 0;
    this.margin = new _Gap();
    this.padding = new _Gap();
  }

  /**
   * Calculate view.width, view.height
   * Suppose view.width and view.height will consider
   * the padding, not margin.
   * 
   * Return {Width,Height} this view suppose to be.
   * include padding and margin.
   * 
   * @param maxWidth The parent's maxWidth
   * @param maxHeight The parrent's maxHeight
   */
  abstract measure(ctx: CanvasRenderingContext2D,
      maxWidth: number,
      maxHeight: number,
      specify: Specify): MeasureResult;

  /**
   * This will calculate view.x, view.y
   */
  abstract layout(
    parentWidth: number, parentHeight: number,
    left: number, top: number);

  abstract drawToCanvas(ctx: CanvasRenderingContext2D);

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
    if (!this.visible) return false;
    let inside = EasyMath.between(this.x, this.x + this.width, event.x)
      && EasyMath.between(this.y, this.y + this.height, event.y);
    if (!inside) {
      if(this.onTouchOutside(event)) {
        return true;
      }
      return false;
    }
    return this.onclickInternal(event);
  }

  onclickInternal(event: ClickEvent): boolean {
    return false;
  }

  onpress(event: PressEvent): boolean {
    if (!this.visible) return false;
    let inside = EasyMath.between(this.x, this.x + this.width, event.x)
      && EasyMath.between(this.y, this.y + this.height, event.y);
    if (!inside) {
      return false;
    }
    return this.onpressInternal(event);
  }

  onpressInternal(event: PressEvent): boolean {
    return false;
  }

  // Return true if you want to deal it.
  onTouchOutside(event: ClickEvent): boolean {
    return false;
  }
}