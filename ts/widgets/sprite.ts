
export default class Sprite {
  img: CanvasImageSource;
  width: number;
  height: number;
  x: number;
  y: number;
  visible: boolean;

  constructor(imgSrc:string='', width:number=0, height:number=0, x:number=0, y:number=0, visible:boolean=true) {
    this.img = new Image();
    this.img.src = imgSrc;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.visible = visible;
  }

  // public final
  drawToCanvas(ctx: CanvasRenderingContext2D) {
    if (!this.visible) return;
    this.drawToCanvasInternal(
      ctx,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  // protected
  drawToCanvasInternal(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
    ctx.drawImage(
      this.img,
      x,
      y,
      width,
      height
    );
  }

  isCollideWith(sp: Sprite) {
    if (!this.visible || !sp.visible) return false;

    const spX = sp.x + sp.width / 2;
    const spY = sp.y + sp.height / 2;
    return !!(spX >= this.x
              && spX <= this.x + this.width
              && spY >= this.y
              && spY <= this.y + this.height);
  }
}