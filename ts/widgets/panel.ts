import Sprite from "./sprite"
import {Align} from "../misc/layout"

class Pair {
  view: Sprite
  alignX: Align
  alignY: Align
}

export default class Panel extends Sprite {
  children: Array<Pair>;
  constructor(x:number=0, y:number=0, width:number=0, height:number=0) {
    super(width, height, x, y);
    this.children = new Array();
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
}