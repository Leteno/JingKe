
export default class Sprite {
  constructor(imgSrc='', width=0, height=0, x=0, y=0, visible=true) {
    this.img = new Image();
    this.img.src = imgSrc;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.visible = visible;
  }

  // public final
  drawToCanvas(ctx) {
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
  drawToCanvasInternal(ctx, x, y, width, height) {
    ctx.drawImage(
      this.img,
      x,
      y,
      width,
      height
    );
  }

  isCollideWith(sp) {
    if (!this.visible || !sp.visible) return false;

    const spX = sp.x + sp.width / 2;
    const spY = sp.y + sp.height / 2;
    return !!(spX >= this.x
              && spX <= this.x + this.width
              && spY >= this.y
              && spY <= this.y + this.height);
  }
}