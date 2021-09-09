import ImageView from "../imageview";
import Panel from "../panel";

export default class GrayMaskView extends Panel {

  drawToCanvasInternal(ctx: CanvasRenderingContext2D) {
    super.drawToCanvasInternal(ctx);
    let matrix = ctx.getTransform();
    let x = matrix.m41;
    let y = matrix.m42;
    let imageData = ctx.getImageData(x, y, this.width, this.height);
    let data = imageData.data;
    for (let i = 0; i < data.length; i+=4) {
      
      var avg = (data[i] + data[i +1] + data[i +2]) / 3;
      data[i]     = avg; // red
      data[i + 1] = avg; // green
      data[i + 2] = avg; // blue
    }

    ctx.putImageData(imageData, x, y);
  }
}