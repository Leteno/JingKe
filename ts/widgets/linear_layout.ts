import Panel from "./panel";
import { MeasureResult } from "./sprite";

export default class LinearLayout extends Panel {
  // Child views are layout potrait.
  calculateActualSize(
    ctx: CanvasRenderingContext2D,
    maxWidthForCalculation: number,
    maxHeightForCalculation: number): MeasureResult {
    let childWidthAtMost = 0;
    let currentHeight = 0;

    this.children.forEach(view => {
      let size = view.measure(
        ctx,
        maxWidthForCalculation,
        maxHeightForCalculation
      );
      childWidthAtMost = Math.max(
        size.calcWidth,
        childWidthAtMost
      );
      currentHeight += size.calcHeight;
    });

    return {
      calcWidth: childWidthAtMost,
      calcHeight: currentHeight,
    }
  }

  onLayout(parentWidth: number, parentHeight: number) {
    let left = 0, top = 0;
    this.children.forEach(view => {
      view.layout(
        this.width - this.padding.left - this.padding.right,
        this.height - this.padding.top - this.padding.bottom,
        left,
        top
      )
      top += view.margin.top + view.height + view.margin.bottom;
    });
  }
}