import SimpleView from "./simple_view";
import Sprite, { MeasureResult } from "./sprite";

export default class TextView extends SimpleView {
  text: string;
  textColor: string;
  textSize: number;
  lines: Array<string>;
  lineHeight: number;

  showTextLength: number;
  lineEnds: Array<number>;

  constructor(text:string="Hello World") {
    super();
    this.text = text;
    this.textColor = "black";
    this.textSize = 24;
    this.lines = new Array<string>();
    this.lineEnds = new Array<number>();
    this.showTextLength = text.length;

    this.debugColor = "pink";
  }

  applyStyle(ctx: CanvasRenderingContext2D) {
    if (this.textColor) {
      ctx.fillStyle = this.textColor;
    }
    if (this.textSize) {
      ctx.font = `${this.textSize}px bold`
    }
  }
  
  calculateActualSize(
    ctx: CanvasRenderingContext2D,
    maxWidthForCalculation: number,
    maxHeightForCalculation: number): MeasureResult {
    ctx.save();
    this.applyStyle(ctx);

    let charNumEachLine = 1000;
    if (maxWidthForCalculation > 0) {
      charNumEachLine = 
        TextHelper.getInstance().calculateCharInLine(
          ctx, this.textSize, maxWidthForCalculation
        );
    }

    this.lineHeight = this.textSize;
    this.lines.splice(0);
    this.lineEnds.splice(0);
    let actualWidth = 0;
    let actualHeight = 0;
    let lineEnd = 0;
    for (let i = 0; i < this.text.length; i += charNumEachLine) {
      let endSize = Math.min(charNumEachLine, this.text.length - i);
      this.lines.push(this.text.substr(i, endSize));
      lineEnd += endSize;
      this.lineEnds.push(lineEnd);
      actualHeight += this.lineHeight;
    }
    if (this.lines.length > 1) {
      actualWidth = maxWidthForCalculation;
    } else {
      let metric = ctx.measureText(this.text);
      actualWidth = metric.width;
    }

    // TODO(juzhen) should we:
    // actualHeight = min(-, maxHeightForCalculation)

    ctx.restore();
    return {
      calcWidth: actualWidth,
      calcHeight: actualHeight
    }
  }

  onLayout() {
    // no special implementation.
  }

  // override
  drawToCanvasInternal(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.padding.left, this.padding.bottom);
    this.applyStyle(ctx);
    for (let i = 0, lastEnd = 0;
      i < this.lineEnds.length;
      lastEnd = this.lineEnds[i], i++) {

      let end = this.lineEnds[i];
      if (end < this.showTextLength) {
        // show the total line
        ctx.fillText(
          this.lines[i],
          0,
          i * this.lineHeight
        );
      } else {
        // this.showTextLength <= current Line end
        // show sub string [lastEnd, this.showTextLength)
        ctx.fillText(
          this.lines[i].substr(0, this.showTextLength - lastEnd),
          0,
          i * this.lineHeight
        );
        // stop iteration.
        break;
      }
    }
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