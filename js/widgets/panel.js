import Sprite from "./sprite"

export default class Panel extends Sprite {
  constructor(x=0, y=0) {
    super(x=0, y=0);
    this.children = new Array();
  }

  addView(view) {
    this.children.push(view);
  }

  removeView(view) {
    var index = this.children.findIndex((v => view === v));
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }

  removeAllViews() {
    this.children.splice(0)
  }

  // override
  drawToCanvasInternal(ctx, x, y) {
    this.children.forEach((view => {
      view.drawToCanvasInternal(
        ctx,
        x = view.x + this.x,
        y = view.y + this.y,
        view.width,
        view.height
      );
    }));
  }
}