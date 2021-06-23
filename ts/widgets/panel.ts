import EasyMath from "../misc/easy-math"
import Sprite, { MeasureResult } from "./sprite"
import {Align} from "../misc/layout"
import { ClickEvent } from "../misc/event"

class Pair {
  view: Sprite
  alignX: Align
  alignY: Align
}

export default class Panel extends Sprite {
  children: Array<Pair>;
  constructor(left:number=0, top:number=0) {
    super(left, top);
    this.children = new Array();
  }

  protected onMeasure(ctx: CanvasRenderingContext2D): MeasureResult {
    let widthAtMost = 0;
    let heightAtMost = 0;
    this.children.forEach((pair) => {
      let size = pair.view.measure(ctx)
      widthAtMost = Math.max(size.widthAtMost, widthAtMost)
      heightAtMost = Math.max(size.heightAtMost, heightAtMost)
    });
    this.width = widthAtMost;
    this.height = heightAtMost;
    return {
      widthAtMost: widthAtMost + this.left,
      heightAtMost: heightAtMost + this.top
    }
  }

  protected onLayout(left: number, top: number, right: number, bottom: number): void {
    throw new Error("Method not implemented.")
  }

  addView(view: Sprite, alignX: Align=Align.START, alignY: Align=Align.START) {
    this.children.push({
      "view": view,
      "alignX": alignX,
      "alignY": alignY
    });
  }

  removeView(view: Sprite) {
    let index = -1;
    this.children.forEach((pair, ind) => {
      if (pair.view == view) {
        index = ind;
      }
    });
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }

  removeAllViews() {
    this.children.splice(0)
  }

  // override
  drawToCanvasInternal(ctx: CanvasRenderingContext2D, x: number, y: number) {
    this.children.forEach((pair => {
      let view = pair.view;
      let alignX = pair.alignX;
      let finalX = alignX == Align.START ? x + view.x:
          alignX == Align.END ? x + this.width - view.x:
          /* Align.CENTER */ x + Math.max(this.width - view.width, 0) / 2 + view.x;
      let alignY = pair.alignY;
      let finalY = alignY == Align.START ? y + view.y:
          alignY == Align.END ? y + this.height - view.y:
          /* Align.Center */ y + Math.max(this.height - view.height, 0) / 2 + view.y;
      view.drawToCanvasInternal(
        ctx,
        finalX,
        finalY,
        view.width,
        view.height
      );
    }));
  }

  onclick(event: ClickEvent) : boolean {
    let inside = EasyMath.between(this.x, this.x + this.width, event.x)
      && EasyMath.between(this.y, this.y + this.height, event.y);
    if (!inside) return false;
    // event cut out
    let childEvent = ClickEvent.alignChildren(event, this.x, this.y);
    for (let i = 0; i < this.children.length; i++) {
      let view:Sprite = this.children[i].view;
      if (view.onclick(childEvent)) {
        return true;
      }
    }
    return this.onclickInternal(event);
  }
}