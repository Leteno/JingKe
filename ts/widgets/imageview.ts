import SimpleView from "./simple_view";
import Sprite, { MeasureResult } from "./sprite"

export enum PointerPosition {
  NONE = 0,
  LEFT,
  RIGHT,
}
export default class ImageView extends SimpleView {

  private static pointer: HTMLImageElement;

  img: HTMLImageElement;
  pointerPosition: PointerPosition;
  constructor(imgSrc: string) {
    super();
    this.img = new Image();
    this.img.src = imgSrc;
    this.pointerPosition = PointerPosition.NONE;
  }

  static drawPointer(
      ctx: CanvasRenderingContext2D,
      pointerPosition: PointerPosition,
      view: SimpleView) {
    if (pointerPosition == PointerPosition.NONE) {
      return;
    }
    if (ImageView.pointer == null) {
      ImageView.pointer = new Image();
      ImageView.pointer.src = "res/created/pointer.png"
    }
    let pointerSize = 30;
    let dx = -pointerSize/2 - 8;
    let dy = (view.height-pointerSize)/2;
    ctx.save();
    ctx.drawImage(
      ImageView.pointer,
      dx,
      dy,
      pointerSize,
      pointerSize
    )
    ctx.restore();
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
    ImageView.drawPointer(ctx, this.pointerPosition, this);
  }
}