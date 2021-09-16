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