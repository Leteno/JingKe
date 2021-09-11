import SimpleView from "./simple_view";
import Sprite, { MeasureResult } from "./sprite"

export enum PointerPosition {
  NONE = 0,
  LEFT,
  RIGHT,
}
export default class ImageView extends SimpleView {

  private static pointer: HTMLImageElement;
  private static noteSign: HTMLImageElement;

  img: HTMLImageElement;
  pointerPosition: PointerPosition;
  showNoteSign: boolean;
  constructor(imgSrc: string) {
    super();
    this.img = new Image();
    this.img.src = imgSrc;
    this.pointerPosition = PointerPosition.NONE;
    this.showNoteSign = false;
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
    let dy = (view.height-pointerSize)/2;
    ctx.save();
    if (pointerPosition == PointerPosition.RIGHT) {
      let dx = view.x + view.width + pointerSize;
      ctx.translate(dx, dy);
      ctx.scale(-1, 1);
    } else {
      let dx = -pointerSize/2 - 8;
      ctx.translate(dx, dy);
    }
    ctx.drawImage(
      ImageView.pointer,
      0,
      0,
      pointerSize,
      pointerSize
    )
    ctx.restore();
  }


  static drawNoteSign(
    ctx: CanvasRenderingContext2D,
    view: ImageView) {
    if (!view.showNoteSign) {
      return;
    }
    if (ImageView.noteSign == null) {
      ImageView.noteSign = new Image();
      ImageView.noteSign.src = "res/created/note_sign.png"
    }
    ctx.save();
    let size = 30;
    ctx.drawImage(
      ImageView.noteSign,
      view.width - size, 0,
      size, size
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
    ImageView.drawNoteSign(ctx, this);
  }

  isReady() {
    return super.isReady() && this.img && this.img.complete
  }
}