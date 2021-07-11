import SimpleView from "./simple_view";
import Sprite, { MeasureResult } from "./sprite"

export default class ImageView extends SimpleView {

  img: HTMLImageElement;
  constructor(imgSrc: string) {
    super();
    this.img = new Image();
    this.img.src = imgSrc;
  }

  calculateActualSize(ctx: CanvasRenderingContext2D, maxWidthForCalculation: number, maxHeightForCalculation: number): MeasureResult {
    this.width = this.img.naturalWidth;
    this.height = this.img.naturalHeight;
    return {
      calcWidth: this.width,
      calcHeight: this.height
    }
  }

  onLayout(parentWidth: number, parentHeight: number) {
  }

  drawToCanvasInternal(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      this.img,
      0,
      0,
      this.width,
      this.height
    )
  }
}