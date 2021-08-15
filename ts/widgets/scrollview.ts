import Panel from "./panel";

export class ScrollView extends Panel {
  // vertical

  offsetX: number;
  offsetY: number;

  constructor() {
    super();
    this.offsetX = 0;
    this.offsetY = 0;
  }

  drawToCanvasInternal(ctx: CanvasRenderingContext2D) {
    ctx.save();
    let region = new Path2D();
    region.rect(this.x, this.y, this.width, this.height);
    ctx.clip(region);
    ctx.translate(this.offsetX, this.offsetY);
    super.drawToCanvasInternal(ctx);
    ctx.restore();
  }
}