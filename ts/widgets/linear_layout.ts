import { Specify } from "../misc/layout";
import Panel from "./panel";
import SimpleView from "./simple_view";
import Sprite, { MeasureResult } from "./sprite";
export enum Orientation {
  HORIZONTAL,
  VERTICAL
}

export default class LinearLayout extends Panel {
  orientation: Orientation;

  constructor(orientation: Orientation = Orientation.VERTICAL) {
    super();
    this.orientation = orientation;
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
  
      let totalWeight = 0;
      let weightViews = new Array<Sprite>();
      for (let i = 0; i < this.children.length; i++) {
        let view = this.children[i];
        if (view.layoutParam.weight > 0) {
          weightViews.push(view);
          totalWeight += view.layoutParam.weight;
          continue;
        }
        let size = view.measure(
          ctx,
          maxWidthForCalculation,
          maxHeightForCalculation,
          Specify.NONE
        );
        childWidthAtMost = Math.max(
          size.calcWidth,
          childWidthAtMost
        );
        currentHeight += size.calcHeight;
      };

      let restOfHeight = maxHeightForCalculation - currentHeight;
      if (weightViews.length <= 0 || restOfHeight <= 0) {
        // Haven't used weight or don't have enough space.
        return {
          calcWidth: childWidthAtMost,
          calcHeight: currentHeight,
        }
      }

      weightViews.forEach(view => {
        let h = view.layoutParam.weight * restOfHeight / totalWeight;
        let size = view.measure(
          ctx,
          maxWidthForCalculation,
          h,
          Specify.Y
        );
        childWidthAtMost = Math.max(
          size.calcWidth,
          childWidthAtMost
        );
      })
      return {
        calcWidth: childWidthAtMost,
        calcHeight: maxHeightForCalculation,
      }
  }

  measureHorizontal(
    ctx: CanvasRenderingContext2D,
    maxWidthForCalculation: number,
    maxHeightForCalculation: number) {
      let childHeightAtMost = 0;
      let currentWidth = 0;

      let totalWeight = 0;
      let weightViews = new Array<Sprite>();
      for (let i = 0; i < this.children.length; i++) {
        let view = this.children[i];
        if (view.layoutParam.weight > 0) {
          weightViews.push(view);
          totalWeight += view.layoutParam.weight;
          continue;
        }
        let size = view.measure(
          ctx,
          maxWidthForCalculation,
          maxHeightForCalculation,
          Specify.NONE
        );
        childHeightAtMost = Math.max(
          size.calcHeight,
          childHeightAtMost
        );
        currentWidth += size.calcWidth;
      };

      let restOfWidth = maxWidthForCalculation - currentWidth;
      if (weightViews.length <= 0 || restOfWidth <= 0) {
        // Haven't used weight or don't have enough space.
        return {
          calcWidth: currentWidth,
          calcHeight: childHeightAtMost,
        }
      }

      // We need to calculate weight
      weightViews.forEach(view => {
        let w = view.layoutParam.weight * restOfWidth / totalWeight;
        let size = view.measure(
          ctx,
          w,
          maxHeightForCalculation,
          Specify.X
        );
        childHeightAtMost = Math.max(
          size.calcHeight,
          childHeightAtMost
        );
      })
      return {
        calcWidth: maxWidthForCalculation,
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