import { Align } from "../misc/layout";
import { DrawFunc } from "./textview";

export class BgText implements DrawFunc {
  bgColor: string;
  textColor: string;
  align: Align;

  constructor(bgColor: string, textColor: string, align: Align=Align.CENTER) {
    this.bgColor = bgColor;
    this.textColor = textColor;
    this.align = align;
  }

  draw(ctx: CanvasRenderingContext2D,
       x: number, y: number,
       width: number, height: number,
       text: string): void {
    ctx.save();
    let lastWidth = width;
    let lastHeight = height;
    let ratio = 4/5;
    width *= ratio;
    height *= ratio;
    switch(this.align) {
      case Align.CENTER:
        x = x + (lastWidth - width) / 2;
        break;
      case Align.START:
        break;
      case Align.END:
        x = x + (lastWidth - width);
        break;
    }
    y = y + (lastHeight - height) / 2;

    if (this.bgColor) {
      ctx.fillStyle = this.bgColor;
      ctx.fillRect(x, y, width, height);
    }
    ctx.restore();

    ctx.save();
    ctx.font = `${height - 1}px bold`;
    if (this.textColor) {
      ctx.fillStyle = this.textColor;
    }
    ctx.fillText(text, x, y);
    ctx.restore();
  }
}