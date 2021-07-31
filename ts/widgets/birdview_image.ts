import SimpleView from "./simple_view";
import { MeasureResult } from "./sprite";

export default class BirdViewImage extends SimpleView {
  img: HTMLImageElement;
  sx: number;
  sy: number;

  constructor(src: string) {
    super();
    this.img = new Image();
    this.img.src = src;
    this.sx = this.sy = 0;
  }

  calculateActualSize(ctx: CanvasRenderingContext2D, maxWidthForCalculation: number, maxHeightForCalculation: number): MeasureResult {
    return {
      calcWidth: this.img.naturalWidth,
      calcHeight: this.img.naturalHeight
    };
  }

  onLayout(parentWidth: number, parentHeight: number, left: number, top: number) {
  }

  drawToCanvasInternal(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      this.img,
      this.sx, this.sy,
      this.width,
      this.height,
      0, 0,
      this.width,
      this.height
    );
  }
}