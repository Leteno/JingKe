import Panel from "../panel";

export default class GrayMaskView extends Panel {

  cacheImageData: ImageData;
  setIsDirty(dirty: boolean) {
    super.setIsDirty(dirty);
    this.cacheImageData = undefined;
  }

  drawToCanvasInternal(ctx: CanvasRenderingContext2D) {
    super.drawToCanvasInternal(ctx);
    let matrix = ctx.getTransform();
    let x = matrix.m41;
    let y = matrix.m42;
    if (this.cacheImageData == undefined) {
      if (!this.isReady()) {
        return;
      }
      let imageData = ctx.getImageData(x, y, this.width, this.height);
      this.cacheImageData =  ctx.createImageData(this.width, this.height);
      let src = imageData.data;
      let target = this.cacheImageData.data;
      for (let i = 0; i < src.length; i+=4) {
        var avg = (src[i] + src[i + 1] + src[i + 2]) / 3;
        target[i]     = avg; // red
        target[i + 1] = avg; // green
        target[i + 2] = avg; // blue
        target[i + 3] = src[i + 3]
      }
    }

    ctx.putImageData(this.cacheImageData, x, y);
  }
}