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
    // Actually the naturalWidth/Height alwarys be 0 ?
    return {
      calcWidth: this.img.naturalWidth,
      calcHeight: this.img.naturalHeight
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