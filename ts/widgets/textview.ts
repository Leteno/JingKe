import Sprite, { MeasureResult } from "./sprite";

export default class TextView extends Sprite {
  text: string;
  textColor: string;
  textSize: number;

  debug: boolean;

  constructor(text:string="Hello World") {
    super();
    this.text = text;
    this.textColor = "black";
    this.textSize = 24;

    this.debug = false;
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
    if (this.debug) {
      ctx.save();
      ctx.fillStyle = "pink";
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.restore();
    }
    ctx.save();
    this.applyStyle(ctx);
    ctx.fillText(this.text, x, y);
    ctx.restore();
  }
}