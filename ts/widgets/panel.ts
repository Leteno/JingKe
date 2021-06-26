import EasyMath from "../misc/easy-math"
import Sprite, { MeasureResult } from "./sprite"
import {Align} from "../misc/layout"
import { ClickEvent } from "../misc/event"

export default class Panel extends Sprite {
  children: Array<Sprite>;
  constructor() {
    super();
    this.children = new Array();
  }

  public measure(ctx: CanvasRenderingContext2D): MeasureResult {
    return this.onMeasure(ctx);
  }

  protected onMeasure(ctx: CanvasRenderingContext2D): MeasureResult {
    let widthAtMost = 0;
    let heightAtMost = 0;
    this.children.forEach((view) => {
      let size = view.measure(ctx)
      widthAtMost = Math.max(size.widthAtMost, widthAtMost)
      heightAtMost = Math.max(size.heightAtMost, heightAtMost)
    });
    if (this.forceWidth > 0 && this.forceHeight > 0) {
      this.width = this.forceWidth;
      this.height = this.forceHeight;
      return {
        widthAtMost: this.forceWidth,
        heightAtMost: this.forceHeight,
      }
    }
    this.width = widthAtMost;
    this.height = heightAtMost;
    return {
      widthAtMost: widthAtMost + this.getAdditionalX(),
      heightAtMost: heightAtMost + this.getAdditionalY()
    }
  }

  public layout() {
    this.onLayout(this.width, this.height)
  }

  onLayout(width: number, height: number) {
    super.onLayout(width, height);
    this.children.forEach(view => {
      view.onLayout(this.width, this.height);
    })
    
  }

  addView(view: Sprite) {
    this.children.push(view);
  }

  removeView(view: Sprite) {
    let index = this.children.findIndex((v) => v == view);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }

  removeAllViews() {
    this.children.splice(0)
  }

  // override
  drawToCanvasInternal(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    ctx.translate(this.x, this.y);
    this.children.forEach((view => {
      view.drawToCanvasInternal(
        ctx,
        view.x,
        view.y,
        view.width,
        view.height
      );
    }));
    ctx.restore();
  }

  onclick(event: ClickEvent) : boolean {
    let inside = EasyMath.between(this.x, this.x + this.width, event.x)
      && EasyMath.between(this.y, this.y + this.height, event.y);
    if (!inside) return false;
    // event cut out
    let childEvent = ClickEvent.alignChildren(event, this.x, this.y);
    for (let i = 0; i < this.children.length; i++) {
      let view:Sprite = this.children[i];
      if (view.onclick(childEvent)) {
        return true;
      }
    }
    return this.onclickInternal(event);
  }
}