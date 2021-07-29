import { Character } from "../misc/character";
import SimpleView from "./simple_view";
import { MeasureResult } from "./sprite";

class DrawLine {
  x: number;
  y: number;
  width: number;
  height: number;
  startIndex: number;
  endIndex: number;
  text: string;

  isPattern: boolean;

  draw: (ctx: CanvasRenderingContext2D,
    x: number, y: number,
    width: number, height: number,
    text: string) => void;


  constructor(isPattern: boolean=false) {
    this.isPattern = isPattern;
    if (!isPattern) {
      this.draw = function(ctx: CanvasRenderingContext2D,
        x: number, y: number,
        width: number, height: number,
        text: string) {
        ctx.fillText(text, x, y);
      }
    }
  }
}

export interface DrawFunc {
  draw(
    ctx: CanvasRenderingContext2D,
    x: number, y: number,
    width: number, height: number,
    text: string):void;
}

export default class TextView extends SimpleView {
  text: string;
  textColor: string;
  textSize: number;
  lineHeight: number;
  oneCharWidth: number;
  drawLines: Array<DrawLine>;

  showTextLength: number;

  textEffects: Map<string, DrawFunc>;

  constructor(text:string="Hello World") {
    super();
    this.text = text;
    this.textColor = "black";
    this.textSize = 24;
    this.showTextLength = text.length;
    this.textEffects = new Map<string, DrawFunc>();
    this.drawLines = new Array<DrawLine>();

    this.debugColor = "pink";
  }

  setText(text: string) {
    this.text = text;
    this.showTextLength = text.length;
    this.setIsDirty(true);
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
    this.drawLines.splice(0);
    let actualWidth = 0;
    let actualHeight = 0;

    let currentWidth = 0;
    let lastNoneEnglishIndex = 0;
    let lastNoneEnglishWidth = 0;
    let start = 0;
    let x = 0;
    let y = 0;

    // for pattern:
    let patStart = -1;
    for (let i = 0; i < this.text.length; i++) {
      let ch = this.text.charAt(i);
      let chCode = this.text.charCodeAt(i);
      /**
       * Dealing the pattern between \f \g
       */
      // Check \f \g are pairing.
      if (ch == '\f') {
        patStart = i+1;
        if (currentWidth > 0) {
          let drawLine = new DrawLine();
          drawLine.x = x;
          drawLine.y = y;
          drawLine.text = this.text.substr(
            start, i - start
          ) // i not include.
          drawLine.startIndex = start;
          drawLine.endIndex = i - 1;
          drawLine.width = currentWidth;
          drawLine.height = this.lineHeight;
          drawLine.isPattern = false;
          this.drawLines.push(drawLine);

          x = x + currentWidth;
        }
        currentWidth = 0;
        start = i + 1;
        continue;
      } else if (ch == '\r') {
        let drawLine = new DrawLine(true);
        drawLine.text = this.text.substr(
          patStart, i - patStart
        ) // i not include.
        drawLine.width = currentWidth;
        drawLine.height = this.lineHeight;
        drawLine.endIndex = i - 1;
        drawLine.startIndex = start;
        drawLine.x = x;
        drawLine.y = y;
        this.drawLines.push(drawLine);

        x = x + currentWidth;

        patStart = -1;
        currentWidth = 0;
        start = i + 1;
        continue;
      }

      // Normal case
      let currentCharWidth = chCode > 512
        ? chineseFontWidth
        : englishFontWidth;
      currentWidth += currentCharWidth;
      // Different from currentWidth, actualWidth will keep adding
      // And the value will be valuable when there is only one line.
      actualWidth += currentCharWidth;
      if (x + currentWidth > maxWidthForCalculation) {
        // Need to have a new line.
        if (patStart >= 0) {
          // Inside pattern.
          if (x == 0) {
            // already start at 0
            let warning = "(Pattern length is above maxWidth)";
            console.warn(warning);
            let drawLine = new DrawLine();
            drawLine.x = x;
            drawLine.y = y;
            drawLine.startIndex = 0;
            drawLine.endIndex = warning.length - 1;
            drawLine.width = warning.length * englishFontWidth;
            drawLine.height = this.lineHeight;
            drawLine.text = warning;
            this.drawLines.push(drawLine);
          } else {
            // Try new line.
            actualHeight += this.lineHeight;
            x = 0;
            y += this.lineHeight;
          }
          continue;
        }
        let drawLine = new DrawLine();
        drawLine.x = x;
        drawLine.y = y;
        drawLine.startIndex = start;
        drawLine.endIndex = lastNoneEnglishIndex;
        drawLine.width = lastNoneEnglishWidth;
        drawLine.height = this.lineHeight;
        drawLine.text = this.text.substr(
          start, lastNoneEnglishIndex - start + 1 
        ) // lastNoneEnglishIndex is included.
        this.drawLines.push(drawLine);

        actualHeight += this.lineHeight;
        start = lastNoneEnglishIndex + 1;
        x = 0;
        y += this.lineHeight;
        currentWidth = currentWidth - lastNoneEnglishWidth;
      }
      if (!Character.isAlphanumberic(chCode)) {
        lastNoneEnglishIndex = i;
        lastNoneEnglishWidth = currentWidth;
      }
    }
    // Scaning the text is over, adding the rest into one line.
    if (patStart >= 0) {
      // We should have one pattern, however, didn't find the end.
      let warning = "(Expect end for pattern)";
      console.warn(warning);
      let drawLine = new DrawLine();
      drawLine.x = x;
      drawLine.y = y;
      drawLine.startIndex = 0;
      drawLine.endIndex = warning.length - 1;
      drawLine.width = warning.length * englishFontWidth;
      drawLine.height = this.lineHeight;
      drawLine.text = warning;
      this.drawLines.push(drawLine);

      actualHeight += this.lineHeight;
    } else {
      let drawLine = new DrawLine();
      drawLine.x = x;
      drawLine.y = y;
      drawLine.startIndex = start;
      drawLine.endIndex = this.text.length - 1;
      drawLine.width = currentWidth;
      drawLine.height = this.lineHeight;
      drawLine.text = this.text.substr(
        start, this.text.length - start
      );
      this.drawLines.push(drawLine);

      actualHeight += this.lineHeight;
    }

    if (this.drawLines.length > 1) {
      actualWidth = maxWidthForCalculation;
    } else {
      actualWidth = currentWidth;
    }

    // TODO(juzhen) should we:
    // actualHeight = min(-, maxHeightForCalculation)

    // Update effect records when vals like lineHeight,
    // lineEnds are updated.

    ctx.restore();
    return {
      calcWidth: actualWidth,
      calcHeight: actualHeight
    }
  }

  public updatePatternDrawFunc(text: string, fn: DrawFunc) {
    this.textEffects.set(text, fn);
  }

  onLayout() {
    // no special implementation.
  }

  // override
  drawToCanvasInternal(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.padding.left, this.padding.bottom);
    this.applyStyle(ctx);
    for (let i = 0; i < this.drawLines.length; i++) {
      let drawLine = this.drawLines[i];
      let end = drawLine.endIndex;
      if (end <= this.showTextLength) {
        if (drawLine.draw) {
          drawLine.draw(
            ctx,
            drawLine.x, drawLine.y,
            drawLine.width, drawLine.height,
            drawLine.text);
        } else if (this.textEffects.has(drawLine.text)) {
          this.textEffects.get(drawLine.text).draw(
            ctx,
            drawLine.x, drawLine.y,
            drawLine.width, drawLine.height,
            drawLine.text
          );
        }
      } else {
        // show part of it
        let text = drawLine.text.substr(
          0,
          this.showTextLength - drawLine.startIndex)
        if (drawLine.draw) {
          drawLine.draw(
            ctx,
            drawLine.x, drawLine.y,
            drawLine.width, drawLine.height,
            text
          );
        } else if (this.textEffects.has(drawLine.text)) {
          this.textEffects.get(drawLine.text).draw(
            ctx,
            drawLine.x, drawLine.y,
            drawLine.width, drawLine.height,
            drawLine.text
          );
        }
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