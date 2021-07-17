import DualStateInfiniteAnimator from "../animator/dual-state-infinite-animator"
import NumberLinearAnimator from "../animator/number-linear-animator";
import Dialogue from "../data/dialogue";
import { ClickEvent } from "../misc/event";
import { Align, LayoutParams } from "../misc/layout";
import Panel from "./panel";
import { Border, MeasureResult } from "./sprite";
import TextView from "./textview";

export default class DialogueView extends Panel {
  nameViewLeft: TextView;
  nameViewRight: TextView;
  contentView: TextView;
  animators: Array<NumberLinearAnimator>;

  showHint: boolean;
  hintAnimator: DualStateInfiniteAnimator;

  queue: Array<Dialogue>;

  // Force update due to contentView's text change
  dirty: boolean;
  measureWidthLastTime: number;
  measureHeightLastTime: number;

  constructor() {
    super();

    this.layoutParam = new LayoutParams(
      Align.START, Align.END
    );
    this.visible = false;
    this.border = new Border();
    this.debugColor = "green";

    // Add all views:
    this.nameViewLeft = new TextView("郑大侠");
    this.nameViewRight = new TextView("嘉女士");
    this.contentView = new TextView("你好，冒险者");
    this.addView(this.nameViewLeft);
    this.addView(this.nameViewRight);
    this.addView(this.contentView);

    // Configure View position
    this.padding.left = 20;
    this.padding.top = 10;
    this.padding.right = 20;
    this.padding.bottom = 20;
    this.nameViewRight.layoutParam = new LayoutParams(
      Align.END, Align.START
    );
    this.nameViewRight.visible = false;
    this.contentView.margin.top = 40;
    this.contentView.margin.bottom = 20;
    this.contentView.textSize = 16;

    // Animator
    this.animators = new Array<NumberLinearAnimator>();
    this.hintAnimator = new DualStateInfiniteAnimator(
      500, false
    );

    // Others
    this.queue = new Array<Dialogue>();
    this.showHint = false;
  }
  measure(ctx: CanvasRenderingContext2D, maxWidth: number, maxHeight: number): MeasureResult {
    this.measureWidthLastTime = maxWidth;
    this.measureHeightLastTime = maxHeight;
    return super.measure(ctx, maxWidth, maxHeight);
  }

  drawToCanvasInternal(
    ctx: CanvasRenderingContext2D) {


    if (this.dirty) {
      this.measure(
        ctx,
        this.measureWidthLastTime,
        this.measureHeightLastTime);
      this.dirty = false;
    }
    if (this.showHint && this.hintAnimator.getVal()) {
      ctx.save();
      ctx.strokeStyle = "black";
      ctx.translate(
        this.width - this.padding.right - 30,
        this.height - this.padding.bottom - 30);
      ctx.ellipse(20, 20, 5, 5, 0, 0, 360);
      ctx.stroke();
      ctx.restore();
    }
    super.drawToCanvasInternal(ctx);
  }

  addDialogue(data: Dialogue) {
    this.queue.push(data);
    if (this.animators.length == 0 ||
        this.animators.findIndex((animator=> {
          return animator.isStop();
        })) != -1) {
      let top = this.queue.shift();
      this.updateView(top);
    }
  }

  private updateView(data:Dialogue) {
    this.visible = true;
    this.showHint = false;
    let view = data.showAtLeft ? this.nameViewLeft
                : this.nameViewRight;
    view.text = data.username;

    this.animators.splice(0);
    let supposedTime = data.content.length * 1000 / data.speed;
    let contentAnimator = new NumberLinearAnimator(
      0, data.content.length, supposedTime
    );
    this.contentView.text = data.content;
    this.contentView.showTextLength = 0;

    this.dirty = true;

    contentAnimator.onValChange = (val => {
      this.contentView.showTextLength = Math.floor(val);
    }).bind(this);
    contentAnimator.onStop = (() => {
      this.showHint = true;
      this.onContentLoadCompleted();
    }).bind(this);
    this.animators.push(contentAnimator);
  }

  updateTime(dt:number) {
    this.animators.forEach(animator => {
      animator.update(dt);
    })
    this.hintAnimator.update(dt);
  }

  onContentLoadCompleted() {
  }

  onclickInternal(event: ClickEvent) {
    if (this.animators.length > 0 &&
        this.animators.findIndex((animator) => {
          return !animator.isStop();
        }) != -1) {
      // click to skip the animation.
      this.animators.forEach((animator) => {
        animator.update(animator.totalTime);
      })
    } else {
      // click to update data:
      if (this.queue.length > 0) {
        let front = this.queue.shift();
        this.updateView(front);
      } else {
        this.visible = false;
      }
    }
    return true;
  }
}