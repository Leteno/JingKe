import { Character } from "../misc/character";
import SimpleView from "./simple_view";
import Sprite, { MeasureResult } from "./sprite";

export class TextEffect {
  start: number;
  length: number;
  draw(ctx: CanvasRenderingContext2D,
    x: number, y: number,
    width: number, height: number) {}
}

class TextEffectRecord {
  effect: TextEffect;
  x: number;
  y: number;
  width: number;
  height: number;
}

export default class TextView extends SimpleView {
  text: string;
  textColor: string;
  textSize: number;
  lines: Array<string>;
  lineHeight: number;
  oneCharWidth: number;

  showTextLength: number;
  lineEnds: Array<number>;

  textEffects: Array<TextEffectRecord>;

  constructor(text:string="Hello World") {
    super();
    this.text = text;
    this.textColor = "black";
    this.textSize = 24;
    this.lines = new Array<string>();
    this.lineEnds = new Array<number>();
    this.showTextLength = text.length;
    this.textEffects = new Array<TextEffectRecord>();

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

    this.oneCharWidth = TextHelper.getInstance()
      .calculateOnCharWidth(ctx, this.textSize);

    let chineseFontWidth = TextHelper.getInstance()
      .calculateChineseCharWidth(ctx, this.textSize);
    let englishFontWidth = TextHelper.getInstance()
      .calculateASIICharWidth(ctx, this.textSize);

    this.lineHeight = this.textSize;
    this.lines.splice(0);
    this.lineEnds.splice(0);
    let actualWidth = 0;
    let actualHeight = 0;

    let start = 0;
    let currentWidth = 0;
    let currentCharSize = 0;
    let lastNoneEnglishIndex = 0;
    let lastNoneEnglishWidth = 0;
    for (let i = 0; i < this.text.length; i++) {
      currentCharSize = (this.text.charCodeAt(i) > 512)
        ? chineseFontWidth
        : englishFontWidth;
      currentWidth += currentCharSize;
      if (currentWidth > maxWidthForCalculation) {
        if (lastNoneEnglishIndex == start) {
          // Whole line contains Alphanumberic
          lastNoneEnglishIndex = i - 1;
          lastNoneEnglishWidth = currentWidth - currentCharSize;
        }
        this.lines.push(this.text.substr(
          start, lastNoneEnglishIndex - start + 1
        ));
        this.lineEnds.push(lastNoneEnglishIndex + 1);
        actualHeight += this.lineHeight;
        // Don't waste to this time.
        start = lastNoneEnglishIndex + 1;
        currentWidth = currentWidth - lastNoneEnglishWidth;
        continue;
      }
      if (!Character.isAlphanumberic(this.text.charCodeAt(i))) {
        lastNoneEnglishIndex = i;
        lastNoneEnglishWidth = currentWidth;
      }
    }
    this.lines.push(this.text.substr(start, this.text.length - start));
    this.lineEnds.push(this.text.length);
    actualHeight += this.lineHeight;
    if (this.lines.length > 1) {
      actualWidth = maxWidthForCalculation;
    } else {
      let metric = ctx.measureText(this.text);
      actualWidth = metric.width;
    }

    // TODO(juzhen) should we:
    // actualHeight = min(-, maxHeightForCalculation)

    // Update effect records when vals like lineHeight,
    // lineEnds are updated.
    this.updateEffectRecords();

    ctx.restore();
    return {
      calcWidth: actualWidth,
      calcHeight: actualHeight
    }
  }

  addEffect(effect: TextEffect) {
    let record = new TextEffectRecord();
    record.effect = effect;
    this.textEffects.push(record);
    this.updateEffectRecord(record);
  }

  updateEffectRecords() {
    this.textEffects.forEach(record => {
      this.updateEffectRecord(record);
    });
  }

  private updateEffectRecord(record: TextEffectRecord) {
    let e = record.effect;
    for (let i = 0, lastEnd = 0;
         i < this.lineEnds.length;
         lastEnd = this.lineEnds[i], i++) {
      if (e.start < this.lineEnds[i]) {
        // Start at this line.
        // TODO the case like e.start + e.length > lineEnd
        record.x = (e.start - lastEnd) * this.oneCharWidth;
        record.y = i * this.lineHeight;
        record.width = e.length * this.oneCharWidth;
        record.height = this.lineHeight;
      }        
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
    for (let i = 0; i < this.textEffects.length; i++) {
      let r = this.textEffects[i];
      r.effect.draw(ctx, r.x, r.y, r.width, r.height);
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

  // fontSize -> width when drawing
  chineseSizeMap: Map<number, number>;
  englishSizeMap: Map<number, number>;

  private static instance: TextHelper;
  private constructor() {
    this.storeMap = new Map<number, Map<number, number>>();
    this.chineseSizeMap = new Map<number, number>();
    this.englishSizeMap = new Map<number, number>();
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

  calculateOnCharWidth(
    ctx: CanvasRenderingContext2D,
    textSize: number) {
      
    let text = "你好，世界";
    ctx.save();
    ctx.font = `${textSize}px bold`;
    let drawLength = ctx.measureText(text).width;
    ctx.restore();
    return drawLength / text.length;
  }

  calculateChineseCharWidth(
    ctx: CanvasRenderingContext2D,
    textSize: number) {
    if (this.chineseSizeMap.has(textSize)) {
      return this.chineseSizeMap.get(textSize);
    }
    let text = "你";
    ctx.save();
    ctx.font = `${textSize}px bold`;
    let drawLength = ctx.measureText(text).width;
    ctx.restore();
    this.chineseSizeMap.set(textSize, drawLength);
    return drawLength;
  }

  calculateASIICharWidth(
    ctx: CanvasRenderingContext2D,
    textSize: number) {
    if (this.englishSizeMap.has(textSize)) {
      return this.englishSizeMap.get(textSize);
    }
    let text = "a";
    ctx.save();
    ctx.font = `${textSize}px bold`;
    let drawLength = ctx.measureText(text).width;
    ctx.restore();
    this.englishSizeMap.set(textSize, drawLength);
    return drawLength;
  }
}