import DualStateInfiniteAnimator from "../animator/dual-state-infinite-animator"
import NumberLinearAnimator from "../animator/number-linear-animator";
import Dialogue from "../data/dialogue";
import { ClickEvent } from "../misc/event";
import { Align, LayoutParams } from "../misc/layout";
import Panel from "./panel";
import { Border, MeasureResult } from "./sprite";
import TextView, { Text } from "./textview";

export default class DialogueView extends Panel {
  nameViewLeft: TextView;
  nameViewRight: TextView;
  contentView: TextView;
  animators: Array<NumberLinearAnimator>;

  showHint: boolean;
  hintAnimator: DualStateInfiniteAnimator;

  queue: Array<Dialogue>;

  constructor() {
    super();

    this.layoutParam = new LayoutParams(
      Align.START, Align.END
    );
    this.visible = false;
    this.border = new Border();
    this.debugColor = "green";

    // Add all views:
    this.nameViewLeft = new TextView(new Text("郑大侠"));
    this.nameViewRight = new TextView(new Text("嘉女士"));
    this.contentView = new TextView(new Text("你好，冒险者"));
    this.nameViewLeft.textColor = "black";
    this.nameViewRight.textColor = "black";
    this.contentView.textColor = "black";
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

  drawToCanvasInternal(
    ctx: CanvasRenderingContext2D) {
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
    let nameView = data.showAtLeft ? this.nameViewLeft
                : this.nameViewRight;
    nameView.setText(new Text(data.username));
    nameView.visible = true;
    let otherView = data.showAtLeft ? this.nameViewRight
                : this.nameViewLeft;
    otherView.visible = false;

    this.animators.splice(0);
    let supposedTime = data.content.content.length * 1000 / data.speed;
    let contentAnimator = new NumberLinearAnimator(
      0, data.content.content.length, supposedTime
    );
    this.contentView.setText(data.content);
    this.contentView.showTextLength = 0;

    this.contentView.setIsDirty(true);
    nameView.setIsDirty(true);
    otherView.setIsDirty(true);

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
    this.performNext();
    return true;
  }

  onTouchOutside() {
    if (this.visible) {
      // Please answer dialogue view before you move on.
      this.performNext();
      return true;
    }
    return false;
  }

  performNext() {
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
        if (this.onDialogueFinished) {
          let callback = this.onDialogueFinished;
          this.onDialogueFinished = undefined;
          callback();
        }
      }
    }
  }

  // Call when no more dialogue follow up
  // Will call once.
  onDialogueFinished() {
  }
}