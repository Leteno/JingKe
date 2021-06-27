import Sprite, { MeasureResult } from "./sprite"

export default class ImageView extends Sprite {
  img: HTMLImageElement;
  constructor(imgSrc: string) {
    super();
    this.img = new Image();
    this.img.src = imgSrc;
  }

  protected onMeasure(
    ctx: CanvasRenderingContext2D,
    maxWidth: number,
    maxHeight: number): MeasureResult {
    this.width = this.img.naturalWidth;
    this.height = this.img.naturalHeight;
    return {
      widthAtMost: this.width + this.getLandscapeMargin(),
      heightAtMost: this.height + this.getPortraitMargin()
    }
  }

  // override
  drawToCanvasInternal(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
    ctx.drawImage(
      this.img,
      this.x,
      this.y,
      this.width,
      this.height
    )
  }
}