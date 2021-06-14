import Sprite from "./sprite";

export default class TextView extends Sprite {
  text: string;

  constructor(text:string ="Hello World", x: number=0, y: number=0) {
    super(x=x, y=y);
    this.text = text;
  }

  // override
  drawToCanvasInternal(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillText(this.text, x, y);
  }
}