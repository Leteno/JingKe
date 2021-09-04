import { Char } from "../misc/char";
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


  constructor(isPattern: boolean=false, underline?: boolean) {
    this.isPattern = isPattern;
    if (!isPattern) {
      this.draw = function(ctx: CanvasRenderingContext2D,
        x: number, y: number,
        width: number, height: number,
        text: string) {
        ctx.fillText(text, x, y);
        if (underline) {
          ctx.fillRect(x, y + height, width, 2);
        }
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

export class Text {
  textEffects: Map<string, DrawFunc>;
  defaultEffect: DrawFunc;
  content: string
  constructor(content: string) {
    this.content = content;
    this.textEffects = new Map<string, DrawFunc>();
  }

  public updatePatternDrawFunc(
    text: string, fn: DrawFunc): Text {
    this.textEffects.set(text, fn);
    return this;
  }

  public setDefaultEffect(fn: DrawFunc): Text {
    this.defaultEffect = fn;
    return this;
  }
}

export default class TextView extends SimpleView {
  text: Text;
  textColor: string;
  disabledTextColor: string;
  textSize: number;
  lineHeight: number;
  drawLines: Array<DrawLine>;
  underline: boolean;

  showTextLength: number;

  constructor(text:Text= new Text("Hello world")) {
    super();
    this.text = text;
    this.textColor = "white";
    this.disabledTextColor = "#cccccc"
    this.textSize = 24;
    this.underline = false;
    this.showTextLength = text.content.length;
    this.drawLines = new Array<DrawLine>();

    this.debugColor = "pink";
  }

  setText(text: Text) {
    this.text = text;
    this.showTextLength = text.content.length;
    this.setIsDirty(true);
  }

  setTransparent() {
    this.textColor = "#000000";
  }

  applyStyle(ctx: CanvasRenderingContext2D) {
    let textColor = this.textColor;
    if (!this.enable && this.disabledTextColor != undefined) {
      textColor = this.disabledTextColor;
    }
    if (textColor) {
      ctx.fillStyle = textColor;
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
    for (let i = 0; i < this.text.content.length; i++) {
      let ch = this.text.content.charAt(i);
      let chCode = this.text.content.charCodeAt(i);
      /**
       * Dealing the pattern between \f \r
       */
      // Check \f \r are pairing.
      if (ch == '\f') {
        patStart = i+1;
        if (currentWidth > 0) {
          let drawLine = new DrawLine();
          drawLine.x = x;
          drawLine.y = y;
          drawLine.text = this.text.content.substr(
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
        let drawLine = new DrawLine(true, this.underline);
        drawLine.text = this.text.content.substr(
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
      } else if (ch == '\n') {
        let drawLine = new DrawLine(false, this.underline);
        drawLine.text = this.text.content.substr(
          start, i - start
        ) // i not include.
        drawLine.width = currentWidth;
        drawLine.height = this.lineHeight;
        drawLine.endIndex = i - 1;
        drawLine.startIndex = start;
        drawLine.x = x;
        drawLine.y = y;
        this.drawLines.push(drawLine);

        actualHeight += this.lineHeight;
        x = 0;
        y += this.lineHeight;
        currentWidth = 0;
        lastNoneEnglishIndex = i+1;
        lastNoneEnglishWidth = 0;
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
            let drawLine = new DrawLine(false, this.underline);
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
        let drawLine = new DrawLine(false, this.underline);
        drawLine.x = x;
        drawLine.y = y;
        drawLine.startIndex = start;
        drawLine.endIndex = lastNoneEnglishIndex;
        drawLine.width = lastNoneEnglishWidth;
        drawLine.height = this.lineHeight;
        drawLine.text = this.text.content.substr(
          start, lastNoneEnglishIndex - start + 1 
        ) // lastNoneEnglishIndex is included.
        this.drawLines.push(drawLine);

        actualHeight += this.lineHeight;
        start = lastNoneEnglishIndex + 1;
        x = 0;
        y += this.lineHeight;
        currentWidth = currentWidth - lastNoneEnglishWidth;
      }
      if (!Char.isAlphanumberic(chCode)) {
        lastNoneEnglishIndex = i;
        lastNoneEnglishWidth = currentWidth;
      }
    }
    // Scaning the text is over, adding the rest into one line.
    if (patStart >= 0) {
      // We should have one pattern, however, didn't find the end.
      let warning = "(Expect end for pattern)";
      console.warn(warning);
      let drawLine = new DrawLine(false, this.underline);
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
      let drawLine = new DrawLine(false, this.underline);
      drawLine.x = x;
      drawLine.y = y;
      drawLine.startIndex = start;
      drawLine.endIndex = this.text.content.length - 1;
      drawLine.width = currentWidth;
      drawLine.height = this.lineHeight;
      drawLine.text = this.text.content.substr(
        start, this.text.content.length - start
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
        } else if (this.text.textEffects.has(drawLine.text)) {
          this.text.textEffects.get(drawLine.text).draw(
            ctx,
            drawLine.x, drawLine.y,
            drawLine.width, drawLine.height,
            drawLine.text
          );
        } else if (this.text.defaultEffect) {
          this.text.defaultEffect.draw(
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
        } else if (this.text.textEffects.has(drawLine.text)) {
          this.text.textEffects.get(drawLine.text).draw(
            ctx,
            drawLine.x, drawLine.y,
            drawLine.width, drawLine.height,
            drawLine.text
          );
        } else if (this.text.defaultEffect) {
          this.text.defaultEffect.draw(
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