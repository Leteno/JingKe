import Sprite, { MeasureResult } from "./sprite";

export default class TextView extends Sprite {
  text: string;
  textColor: string;
  textSize: number;

  constructor(text:string="Hello World") {
    super();
    this.text = text;
    this.textColor = "black";
    this.textSize = 24;
  }

  applyStyle(ctx: CanvasRenderingContext2D) {
    if (this.textColor) {
      ctx.fillStyle = this.textColor;
    }
    if (this.textSize) {
      ctx.font = `${this.textSize}px bold`
    }
  }
  
  protected onMeasure(ctx: CanvasRenderingContext2D): MeasureResult {
    ctx.save();
    this.applyStyle(ctx);
    let metric = ctx.measureText(this.text);
    this.width = metric.width;
    this.height = this.textSize;
    ctx.restore();
    return {
      widthAtMost: this.width + this.getAdditionalX(),
      heightAtMost: this.height + this.getAdditionalY()
    }
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