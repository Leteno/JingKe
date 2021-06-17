import Sprite from "./sprite";

export default class TextView extends Sprite {
  text: string;
  textColor: string;
  textSize: number;

  constructor(text:string="Hello World", x:number=0, y:number=0) {
    super(0, 0, x, y);
    this.text = text;
    this.textColor = "black";
    this.textSize = undefined;
  }

  // override
  drawToCanvasInternal(ctx: CanvasRenderingContext2D, x:number, y:number) {
    ctx.save();
    if (this.textColor) {
      ctx.fillStyle = this.textColor;
    }
    if (this.textSize) {
      ctx.font = `${this.textSize}px bold`
    }
    ctx.fillText(this.text, x, y);
    ctx.restore();
  }
}