import EasyMath from "../misc/easy-math"
import Sprite, { MeasureResult } from "./sprite"
import {Align} from "../misc/layout"
import { ClickEvent } from "../misc/event"
import SimpleView from "./simple_view";

export default class Panel extends SimpleView {
  children: Array<Sprite>;


  constructor() {
    super();
    this.children = new Array();
  }


  calculateActualSize(
    ctx: CanvasRenderingContext2D,
    maxWidthForCalculation: number,
    maxHeightForCalculation: number): MeasureResult {
    let childWidthAtMost = 0;
    let childHeightAtMost = 0;

    this.children.forEach((view) => {
      let size = view.measure(
        ctx,
        maxWidthForCalculation,
        maxHeightForCalculation
      );
      childWidthAtMost = Math.max(
        size.calcWidth, childWidthAtMost)
      childHeightAtMost = Math.max(
        size.calcHeight, childHeightAtMost)
    });

    return {
      calcWidth: childWidthAtMost,
      calcHeight: childHeightAtMost
    }
  }


  onLayout(parentWidth: number, parentHeight: number) {
    this.children.forEach(view => {
      view.layout(
        this.width - this.padding.left - this.padding.right,
        this.height - this.padding.top - this.padding.bottom,
        0, 0);
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
  drawToCanvasInternal(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.padding.left, this.padding.top);
    this.children.forEach((view => {
      view.drawToCanvas(ctx);
    }));
    ctx.restore();
  }

  onclick(event: ClickEvent) : boolean {
    if (!this.visible) return false;
    let inside = EasyMath.between(this.x, this.x + this.width, event.x)
      && EasyMath.between(this.y, this.y + this.height, event.y);
    if (!inside) return false;
    // event cut out
    let childEvent = ClickEvent.alignChildren(event, this);
    for (let i = 0; i < this.children.length; i++) {
      let view:Sprite = this.children[i];
      if (view.onclick(childEvent)) {
        return true;
      }
    }
    return this.onclickInternal(event);
  }
}