import Panel from "./panel";
import { MeasureResult } from "./sprite";
export enum Orientation {
  HORIZONTAL,
  VERTICAL
}

export default class LinearLayout extends Panel {
  orientation: Orientation;

  constructor() {
    super();
    this.orientation = Orientation.VERTICAL;
  }

  // Child views are layout potrait.
  calculateActualSize(
    ctx: CanvasRenderingContext2D,
    maxWidthForCalculation: number,
    maxHeightForCalculation: number): MeasureResult {
    if (this.orientation == Orientation.VERTICAL) {
      return this.measureVertical(
        ctx,
        maxWidthForCalculation,
        maxHeightForCalculation
      );
    } else {
      return this.measureHorizontal(
        ctx,
        maxWidthForCalculation,
        maxHeightForCalculation
      )
    }
  }

  measureVertical(
    ctx: CanvasRenderingContext2D,
    maxWidthForCalculation: number,
    maxHeightForCalculation: number) {
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

  measureHorizontal(
    ctx: CanvasRenderingContext2D,
    maxWidthForCalculation: number,
    maxHeightForCalculation: number) {
      let childHeightAtMost = 0;
      let currentWidth = 0;
  
      this.children.forEach(view => {
        let size = view.measure(
          ctx,
          maxWidthForCalculation,
          maxHeightForCalculation
        );
        childHeightAtMost = Math.max(
          size.calcHeight,
          childHeightAtMost
        );
        currentWidth += size.calcWidth;
      });
  
      return {
        calcWidth: currentWidth,
        calcHeight: childHeightAtMost,
      }
  }

  onLayout(parentWidth: number, parentHeight: number) {
    if (this.orientation == Orientation.VERTICAL) {
      this.layoutVertical(parentWidth, parentHeight);
    } else {
      this.layoutHorizontal(parentWidth, parentHeight);
    }
  }

  layoutVertical(parentWidth: number, parentHeight: number) {
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
  
  layoutHorizontal(parentWidth: number, parentHeight: number) {
    let left = 0, top = 0;
    this.children.forEach(view => {
      view.layout(
        this.width - this.padding.left - this.padding.right,
        this.height - this.padding.top - this.padding.bottom,
        left,
        top
      )
      left += view.margin.left + view.width + view.margin.right;
    });
  }
}