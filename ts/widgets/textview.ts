import Colors from "../game/data/styles/colors";
import SimpleView from "./simple_view";
import { MeasureResult } from "./sprite";
import TextViewStateMachine, { DrawItem } from "./textview_state_machine";
import { TextHelper } from "./text_helper";


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
  drawItems: Array<DrawItem>;
  underline: boolean;

  showTextLength: number;

  constructor(text:Text = new Text("Hello world")) {
    super();
    this.text = text;
    this.textColor = Colors.white;
    this.disabledTextColor = "#cccccc";
    this.textSize = 24;
    this.drawItems = [];
    this.underline = false;
    this.showTextLength = text.content.length;
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

    let textParser = new TextViewStateMachine();
    textParser.parse(
      this.text.content,
      this.lineHeight,
      maxWidthForCalculation,
      chineseFontWidth,
      englishFontWidth
    );
    ctx.restore();

    this.drawItems = textParser.output();
    return {
      calcWidth: textParser.maxWidth,
      calcHeight: textParser.maxHeight
    }
  }

  setText(text: Text) {
    this.text = text;
    this.showTextLength = text.content.length;
    this.setIsDirty(true);
  }

  setTransparent() {
    this.textColor = Colors.black;
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

  onLayout(parentWidth: number, parentHeight: number, left: number, top: number) {
    // no special implementation.
  }

  drawToCanvasInternal(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.padding.left, this.padding.bottom);
    this.applyStyle(ctx);
    for (let i = 0; i < this.drawItems.length; i++) {
      let drawItem = this.drawItems[i];
      let end = drawItem.endIndex;
      if (end <= this.showTextLength) {
        if (!drawItem.isPattern) {
          // Normal way
          ctx.fillText(drawItem.text, drawItem.x, drawItem.y);
          if (this.underline) {
            ctx.fillRect(
              drawItem.x,
              drawItem.y + drawItem.height,
              drawItem.width, 2);
          }
        } else if (this.text.textEffects.has(drawItem.text)) {
          // Pattern with specified text effect.
          this.text.textEffects.get(drawItem.text).draw(
            ctx,
            drawItem.x, drawItem.y,
            drawItem.width, drawItem.height,
            drawItem.text
          )
        } else if (this.text.defaultEffect) {
          this.text.defaultEffect.draw(
            ctx,
            drawItem.x, drawItem.y,
            drawItem.width, drawItem.height,
            drawItem.text
          );
        }
      } else {
        // Just show part of the text.
        let text = drawItem.text.substr(
          0,
          this.showTextLength - drawItem.startIndex
        );
        if (!drawItem.isPattern) {
          // Normal way
          ctx.fillText(text, drawItem.x, drawItem.y);
          if (this.underline) {
            ctx.fillRect(
              drawItem.x,
              drawItem.y + drawItem.height,
              drawItem.width, 2);
          }
        } else if (this.text.textEffects.has(drawItem.text)) {
          this.text.textEffects.get(drawItem.text).draw(
            ctx,
            drawItem.x, drawItem.y,
            drawItem.width, drawItem.height,
            drawItem.text
          );
        } else if (this.text.defaultEffect) {
          this.text.defaultEffect.draw(
            ctx,
            drawItem.x, drawItem.y,
            drawItem.width, drawItem.height,
            drawItem.text
          );
        }
        break;
      }
    }
    ctx.restore();
  }

}