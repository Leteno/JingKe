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

  applyStyle(ctx: CanvasRenderingContext2D) {
    if (this.textColor) {
      ctx.fillStyle = this.textColor;
    }
    if (this.textSize) {
      ctx.font = `${this.textSize}px bold`
    }
  }
  
  measure(ctx: CanvasRenderingContext2D) {
    ctx.save();
    this.applyStyle(ctx);
    let metric = ctx.measureText(this.text);
    this.width = metric.width;
    console.log(`measure width: ${this.width}`)
    ctx.restore();
  }

  // override
  drawToCanvasInternal(ctx: CanvasRenderingContext2D, x:number, y:number) {
    if (!this.visible) return;
    ctx.save();
    this.applyStyle(ctx);
    ctx.fillText(this.text, x, y);
    ctx.restore();
  }
}