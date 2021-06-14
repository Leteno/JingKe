import Sprite from "./sprite";

export default class TextView extends Sprite {
  constructor(text="Hello World", x=0, y=0) {
    super(x=x, y=y);
    this.text = text;
  }

  // override
  drawToCanvasInternal(ctx, x, y) {
    ctx.fillText(this.text, x, y);
  }
}