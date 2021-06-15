import Sprite from "./sprite"

export default class ImageView extends Sprite {
  img: HTMLImageElement;
  constructor(imgSrc: string, width:number=0, height:number=0, x:number=0, y:number=0) {
    super(width, height, x, y, true);
    this.img = new Image();
    this.img.src = imgSrc;
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