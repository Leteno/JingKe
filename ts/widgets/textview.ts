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
// TODO: update measure height. Because we have multiple lines

export class TextHelper {
  /**
   * {
   *   // font size
   *   "40" : {
   *     // width
   *     "300" : 12 // number of char in one line.
   *   }
   * }
   */
  storeMap: Map<number, Map<number, number>>
  private static instance: TextHelper;
  private constructor() {
    this.storeMap = new Map<number, Map<number, number>>();
  }
  public static getInstance() : TextHelper {
    if (this.instance == null) {
      this.instance = new TextHelper();
    }
    return this.instance;
  }

  calculateCharInLine(
      ctx: CanvasRenderingContext2D,
      textSize: number,
      maxWidth: number) : number {
    if (!this.storeMap.has(textSize)) {
      this.storeMap.set(textSize, new Map<number, number>());
    }
    if (this.storeMap.get(textSize).has(maxWidth)) {
      return this.storeMap.get(textSize).get(maxWidth);
    }
    let text = "你好，世界";
    ctx.save();
    ctx.font = `$textSize}px bold`;
    let drawLength = ctx.measureText(text).width;
    let textLength = text.length;
    let result = Math.floor(maxWidth / (drawLength / textLength));
    this.storeMap.get(textSize).set(maxWidth, result);
    ctx.restore();
    return result;
  }
}