import Sprite from "./sprite"

export default class Panel extends Sprite {
  children: Array<Sprite>;
  constructor(x:number=0, y:number=0) {
    super("", 0, 0, x, y);
    this.children = new Array();
  }

  addView(view: Sprite) {
    this.children.push(view);
  }

  removeView(view: Sprite) {
    let index = this.children.indexOf(view);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }

  removeAllViews() {
    this.children.splice(0)
  }

  // override
  drawToCanvasInternal(ctx: CanvasRenderingContext2D, x: number, y: number) {
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